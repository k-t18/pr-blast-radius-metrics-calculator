import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CreativeEpisode, EpisodeData } from '../../interfaces/creatives/creatives.types';
import type { SalesOrderWithItems } from '../../interfaces/prizeAgreement/prizeAgreement.types';
import { calculateEpisodeProgress } from '../../utils/creativesUtils';
import { fileUpload } from '../../services/general/fileUpload.api';
import { createCreativeFromPortal } from '../../services/creatives/createCreativeFromPortal.api';
import { useApiMutation } from '../useApiMutation';
import { showErrorToast } from '../../services/toast/toastService';

export function useCreativesOrder(episodes: CreativeEpisode[]) {
    const [episodesData, setEpisodesData] = useState<Record<string, EpisodeData>>({});
    const [summary, setSummary] = useState('');
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [savedEpisodes, setSavedEpisodes] = useState<Set<string>>(new Set());
    const [savingEpisodes, setSavingEpisodes] = useState<Record<string, boolean>>({});
    const [saveErrors, setSaveErrors] = useState<Record<string, string | undefined>>({});

    const [logoData, setLogoData] = useState<Record<string, File>>({});

    // Initialize episode data
    useEffect(() => {
        const initialData: Record<string, EpisodeData> = {};
        // eslint-disable-next-line unicorn/no-array-for-each
        episodes.forEach(episode => {
            initialData[episode.id] = {
                episodeId: episode.id,
                logoFile: undefined,
                creatives: [],
                questions: [],
            };
        });
        setEpisodesData(initialData);
    }, [episodes]);

    const handleEpisodeDataChange = useCallback((episodeId: string, data: Partial<EpisodeData>) => {
        setEpisodesData(previous => ({
            ...previous,
            [episodeId]: {
                ...previous[episodeId],
                ...data,
            },
        }));
    }, []);

    const normalizeUploadedName = (value: unknown) => {
        if (typeof value === 'string') return value;
        if (value && typeof value === 'object' && 'file_name' in (value as Record<string, unknown>)) {
            const fileName = (value as Record<string, unknown>).file_name;
            return typeof fileName === 'string' ? fileName : undefined;
        }
    };

    const uploadIfFile = useCallback(async (file?: File | string) => {
        if (file && file instanceof File) {
            const response = await fileUpload(file);
            const uploaded = response.data?.[0] ?? file.name;
            return normalizeUploadedName(uploaded) ?? file.name;
        }
        return typeof file === 'string' ? file : undefined;
    }, []);

    const handleSaveEpisode = useCallback(
        async (episodeId: string) => {
            const episodeData = episodesData[episodeId];
            if (!episodeData) {
                setSavedEpisodes(previous => new Set([...previous, episodeId]));
                return;
            }

            try {
                setSavingEpisodes(previous => ({ ...previous, [episodeId]: true }));
                setSaveErrors(previous => ({ ...previous, [episodeId]: undefined }));
                const uploadedCreatives = await Promise.all(
                    episodeData.creatives.map(async creative => ({
                        ...creative,
                        uploadedFileName: await uploadIfFile(creative.file),
                    }))
                );
                setEpisodesData(previous => ({
                    ...previous,
                    [episodeId]: {
                        ...previous[episodeId],
                        creatives: uploadedCreatives,
                    },
                }));

                setSavedEpisodes(previous => new Set([...previous, episodeId]));
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Failed to upload creatives for episode', episodeId, error);
                setSaveErrors(previous => ({
                    ...previous,
                    [episodeId]: 'Failed to upload creatives for this episode. Please try again.',
                }));
            }
            setSavingEpisodes(previous => ({ ...previous, [episodeId]: false }));
        },
        [episodesData, uploadIfFile]
    );

    const submitCreativesMutation = useApiMutation({
        mutationFn: createCreativeFromPortal,
        successMessage: 'Creatives submitted successfully',
        onSuccess: () => setShowSubmissionModal(true),
    });

    const handleSubmitCreatives = useCallback(
        (order: SalesOrderWithItems, platformLabel: 'Mobile Game' | 'Studio Show') => {
            const portalCreatives: Array<{
                sales_order_item: string;
                sales_order: string;
                item: string | undefined;
                sponsorship_category: string;
                game_format: string;
                asset_type: string;
                asset: string;
                attachments: Array<{ filename: string; asset_type: string; utm_link: string }>;
                qa: Array<{
                    question: string;
                    answer: string;
                    [key: string]: string;
                }>;
            }> = [];

            // eslint-disable-next-line unicorn/no-array-for-each
            order.items_with_status.forEach(item => {
                const episodeData = episodesData[item.name];

                // Collect all attachments with their URLs (creatives only; logo upload removed)
                const attachments: { filename: string; asset_type: string; utm_link: string }[] = [];

                episodeData?.creatives?.forEach(creative => {
                    if (creative.uploadedFileName) {
                        attachments.push({
                            filename: creative.uploadedFileName,
                            asset_type: creative.assetType || 'Image',
                            utm_link: creative.url || '', // Use URL from creative, or empty string if not provided
                        });
                    }
                });

                if (attachments.length === 0) return;

                // Build qa array once per item (will be included in all objects for this item)
                const qa =
                    episodeData?.questions?.length > 0
                        ? episodeData.questions.map(question => {
                              const payload: {
                                  question: string;
                                  answer: string;
                                  [key: string]: string;
                              } = {
                                  question: question.questionText,
                                  answer: '',
                              };

                              // Convert options → option1, option2, ...
                              // eslint-disable-next-line unicorn/no-array-for-each
                              // "@ts-expect-error - option is expected to be an object with text and id properties, question has correctOptionId
                              question.options.forEach((option: { text: string; id: string }, index) => {
                                  payload[`option${index + 1}`] = option.text;

                                  // Set answer if option matches correctOptionId
                                  if (option.id === (question as { correctOptionId?: string }).correctOptionId) {
                                      payload.answer = option.text;
                                  }
                              });

                              return payload;
                          })
                        : [];

                // Common fields for all objects from this item
                const commonFields = {
                    sales_order_item: item.name,
                    sales_order: order.name,
                    item: item.item_name || item.sponsor_item_name || item.item_code,
                    sponsorship_category: (item as unknown as { custom_sponsorship_category?: string }).custom_sponsorship_category || '',
                    game_format: platformLabel,
                    qa,
                };

                // Create a separate object for each attachment
                // eslint-disable-next-line unicorn/no-array-for-each
                attachments.forEach(attachment => {
                    portalCreatives.push({
                        ...commonFields,
                        asset_type: attachment.asset_type,
                        asset: attachment.filename,
                        attachments: [attachment],
                    });
                });
            });

            if (portalCreatives.length === 0) {
                showErrorToast('Please upload and save creatives before submitting.');
                return;
            }

            submitCreativesMutation.mutate({
                portal_creatives: portalCreatives,
            });
        },
        [episodesData, submitCreativesMutation]
    );

    // Calculate progress for each episode in real-time based on uploaded logo and creatives
    const episodeProgress = useMemo(() => {
        const progress: Record<string, number> = {};
        // eslint-disable-next-line unicorn/no-array-for-each
        episodes.forEach(episode => {
            const episodeData = episodesData[episode.id];

            if (episodeData) {
                const isBrainiac = episode.title.toLowerCase().includes('braniac');
                // Pass initial logo URL from logoRequirement to account for fetched logo
                const initialLogoUrl = episode.logoRequirement?.imageUrl;
                progress[episode.id] = calculateEpisodeProgress(episodeData, isBrainiac, initialLogoUrl);
            } else {
                progress[episode.id] = 0;
            }
        });
        return progress;
    }, [episodes, episodesData]);

    // Check if episode has any uploaded data
    const hasUploadedData = useCallback(
        (episodeId: string): boolean => {
            const episodeData = episodesData[episodeId];
            if (!episodeData) return false;

            const hasLogo = Boolean(episodeData.logoFile);
            const hasCreatives = episodeData.creatives.some(creative => creative.file || creative.url);
            const hasQnA = episodeData.questions.length > 0 && episodeData.questions.every(q => q.questionText.trim() && q.correctOptionId);

            return hasLogo || hasCreatives || hasQnA;
        },
        [episodesData]
    );

    // Check if all episodes have been saved by clicking "Save & Continue"
    const canSubmitCreatives = useMemo(() => {
        if (episodes.length === 0) return false;
        // All episodes must be saved (in savedEpisodes set) AND have 100% progress
        // eslint-disable-next-line unicorn/no-array-for-each
        return episodes.every(episode => {
            const isSaved = savedEpisodes.has(episode.id);
            const progress = episodeProgress[episode.id] || 0;
            return isSaved && progress === 100;
        });
    }, [episodes, savedEpisodes, episodeProgress]);

    const resetAllEpisodes = useCallback(() => {
        const initialData: Record<string, EpisodeData> = {};
        // eslint-disable-next-line unicorn/no-array-for-each
        episodes.forEach(episode => {
            initialData[episode.id] = {
                episodeId: episode.id,
                logoFile: undefined,
                creatives: [],
                questions: [],
            };
        });
        setEpisodesData(initialData);
        setSavedEpisodes(new Set());
        setSavingEpisodes({});
        setSaveErrors({});
    }, [episodes]);

    return {
        episodesData,
        summary,
        setSummary,
        handleEpisodeDataChange,
        showSubmissionModal,
        setShowSubmissionModal,
        episodeProgress,
        handleSaveEpisode,
        hasUploadedData,
        canSubmitCreatives,
        handleSubmitCreatives,
        isSubmittingCreatives: submitCreativesMutation.status === 'pending',
        logoData,
        setLogoData,
        savingEpisodes,
        saveErrors,
        resetAllEpisodes,
    };
}
