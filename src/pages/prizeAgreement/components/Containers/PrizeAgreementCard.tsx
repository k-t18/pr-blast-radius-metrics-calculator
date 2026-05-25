import { useState, useMemo, Suspense, lazy, useCallback } from 'react';
import { formatCurrency } from '../../../../utils/formatCurrency';
import type { PrizeAgreementFormDataTypes, PrizeAgreementItem } from '../../../../interfaces/prizeAgreement/prizeAgreement.types';
import useFormHandler from '../../hooks/form/useFormHandler';
import useProgressHandler from '../../hooks/form/useProgressHandler';
import TabViewCard from '../../../../components/cards/TabViewCard';
import type { AccordionItem } from '../../../../components/common/Accordion';
import type { NGOItem } from '../../../../interfaces/ngo/ngo.types';
import type { SavedCSRData } from '../CsrContribution/types/csrContribution.types';
import '../../../../styles/prizeAgreementCard.css';

// Lazy Load Form
const ItemsLinkedFields = lazy(() => import('../ItemsLinkedFields/index').then(module => ({ default: module.default })));
const CSRContribution = lazy(() => import('../CsrContribution'));

interface PrizeAgreementCardProperties {
    orderId: string;
    totalAmount: number;
    items: PrizeAgreementItem[];
    ngoList: NGOItem[];
    creationDate: string;
    sponsorshipType: string;
    sponsor: string;
}

function PrizeAgreementCard({ orderId, totalAmount, items, ngoList, creationDate, sponsorshipType, sponsor }: PrizeAgreementCardProperties) {
    const {
        savedFormsData,
        handleSaveItem: handleSaveItemForm,
        handleSaveCSRContributionForm,
        isSubmittingFormMutation,
        handleSubmit,
    } = useFormHandler({ sponsorshipType, sponsor });
    const { progressMap, handleProgress: handleProgressForm } = useProgressHandler();

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // Check if all items are saved (exclude charity_item_table from count)
    const allItemsSaved = useMemo(() => {
        const itemKeys = items.map(item => item.name);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const savedItemKeys = new Set(Object.keys(savedFormsData).filter((key: string) => key !== 'charity_item_table'));
        return itemKeys.every(itemKey => savedItemKeys.has(itemKey));
    }, [items, savedFormsData]);

    /** SAVE callback from child */
    const handleSaveItem = useCallback(
        (
            itemId: string,
            episodeId: string,
            squareId: string,
            data: PrizeAgreementFormDataTypes,
            declaredRewardAmount: number,
            sponsorshipCategory: string
        ) => {
            handleSaveItemForm(itemId, episodeId, squareId, data, declaredRewardAmount, sponsorshipCategory);
            setActiveIndex(null); // collapse all
        },
        [handleSaveItemForm]
    );

    /** Save CSR Contribution callback from child */
    const handleSaveCSRContribution = useCallback(
        (data: SavedCSRData[]) => {
            handleSaveCSRContributionForm(data);
            setActiveIndex(null); // collapse all
        },
        [handleSaveCSRContributionForm]
    );

    /** Accordion items */
    const accordionItems: AccordionItem[] = useMemo(() => {
        const csrProgress = progressMap['csr-contribution'] || 0;
        const csrItem: AccordionItem = {
            id: 'csr-contribution',
            title: 'CSR Contribution',
            subtitle: 'Donate a percentage or fixed amount for causes you support.',
            showProgressIndicator: true,
            progress: csrProgress,
            content: (
                <Suspense fallback={<div className="p-4">Loading form…</div>}>
                    <CSRContribution
                        totalOrderAmount={totalAmount}
                        handleSaveCSRContribution={handleSaveCSRContribution}
                        ngoList={ngoList}
                        onProgress={value => handleProgressForm('csr-contribution', value)}
                        initialValues={savedFormsData.charity_item_table as unknown as SavedCSRData[]}
                    />
                </Suspense>
            ),
        };

        const itemAccordions: AccordionItem[] = items.map(item => ({
            id: item.name,
            title: item.sponsor_item_name,
            subtitle: `Episode ${item.custom_episode?.split('-')[0] || '-'} | Declared Reward Value: ₦ ${formatCurrency(item.custom_declared_reward_amount || 0)}`,
            showProgressIndicator: true,
            progress: progressMap[item.name] || 0,
            content: (
                <Suspense fallback={<div className="p-4">Loading form…</div>}>
                    <ItemsLinkedFields
                        itemId={item.name}
                        declaredRewardAmount={item.custom_declared_reward_amount || 0}
                        initialValues={savedFormsData[item.name] as PrizeAgreementFormDataTypes}
                        onSave={data =>
                            handleSaveItem(
                                item.name,
                                item.custom_episode ?? '',
                                item.custom_square ?? '',
                                data,
                                item.custom_declared_reward_amount || 0,
                                item.custom_sponsorship_category || ''
                            )
                        }
                        onProgress={value => handleProgressForm(item.name, value)}
                        sponsorshipType={sponsorshipType}
                        sponsorItemName={item.sponsor_item_name}
                    />
                </Suspense>
            ),
        }));

        return [csrItem, ...itemAccordions];
    }, [items, savedFormsData, progressMap, ngoList, totalAmount, handleSaveCSRContribution, handleProgressForm, handleSaveItem, sponsorshipType]);

    return (
        <TabViewCard
            title={`Order ID: ${orderId}`}
            amount={totalAmount}
            creationDate={creationDate}
            timelineEventName="studioShowPrizeAgreement"
            accordionItems={accordionItems}
            activeIndex={activeIndex}
            onTabChange={event => {
                const clickedIndex = Number(event?.index);
                setActiveIndex(activeIndex === clickedIndex ? null : clickedIndex);
            }}
            accordionClassName="card-accordion"
            isSubmitting={isSubmittingFormMutation}
            areAllItemsSaved={allItemsSaved}
            buttonLabel="Submit Prize Agreement"
            cardSubmitHandler={() => handleSubmit(orderId)}
        />
    );
}

export default PrizeAgreementCard;
