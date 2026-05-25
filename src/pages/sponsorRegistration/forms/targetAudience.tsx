import { useMemo } from 'react';
import HeaderTitle from '../../../components/common/HeaderTitle';
import { Target } from '../../../components/icons';

import DescriptionText from '../../../components/common/DescriptionText';
import ActionButton from '../../../components/common/ActionButton';
import HierarchicalFilterPanel from '../../../components/form-fields/HierarchicalFilterPanel';
import FloatingContainer from '../../../components/common/FloatingContainer';
import type { DropdownOption } from '../../../components/common/Dropdown';
import type { MultiSelectOption } from '../../../components/form-fields/multiSelect';
import useHierarchicalFilterLogic from '../../../hooks/useHierarchicalFilterLogic';
import { useTargetAudienceFilterData } from '../../../hooks/mobileSponsorship/useTargetAudienceFilterData';
import { useSponsorRegistration } from '../context/sponsorRegistrationContext';
import { buildFilterGroups } from '../../sponsorshipType/mobileSponsorship/[categories]/createCampaign/utils/buildFilterGroups';
import { buildTargetAudiencePayload } from '../utils/buildTargetAudiencePayload';
import '../../../styles/mobileSponsorshipStyles/step2SelectTargetAudience.css';
import Step2SelectTargetAudienceSkeleton from '../../sponsorshipType/mobileSponsorship/skeleton/step2SelectTargetAudienceSkeleton';

type AudienceFieldValues = Record<string, DropdownOption | MultiSelectOption[] | string | number | undefined>;

export default function TargetAudience() {
    const { formData, updateFormData, markStepAsCompleted, setCurrentStep } = useSponsorRegistration();
    const { targetAudienceFilterData, isLoading, error } = useTargetAudienceFilterData();

    const {
        selectedFilters,
        fieldValues,
        expandedSections,
        expandedOptions,
        handleFilterChange,
        setFieldValues,
        toggleSection,
        toggleOption,
        isOptionFullySelected,
        isOptionPartiallySelected,
        clearAll,
        hasSelections,
    } = useHierarchicalFilterLogic<AudienceFieldValues>(targetAudienceFilterData, {
        initialSelectedFilters: new Set(formData.targetAudienceSelectedFilters || []),
        initialFieldValues: (formData.targetAudienceFieldValues || {}) as AudienceFieldValues,
        onSelectedFiltersChange: filters => {
            updateFormData({ targetAudienceSelectedFilters: [...filters] });
        },
        onFieldValuesChange: values => {
            updateFormData({ targetAudienceFieldValues: values });
        },
    });

    const selectedFilterGroups = useMemo(
        () => buildFilterGroups(selectedFilters, fieldValues, targetAudienceFilterData),
        [selectedFilters, fieldValues, targetAudienceFilterData]
    );

    const selectedFiltersCount = useMemo(
        () => selectedFilterGroups.reduce((total, group) => total + group.options.length, 0),
        [selectedFilterGroups]
    );

    const handleSaveAndContinue = () => {
        const targetAudiencesPayload = buildTargetAudiencePayload(selectedFilters, fieldValues, targetAudienceFilterData);

        // eslint-disable-next-line no-console
        console.log('Target audiences payload', targetAudiencesPayload);

        updateFormData({
            target_audiences: targetAudiencesPayload,
        });

        markStepAsCompleted(7);
        setCurrentStep(8);
    };

    const handleClearAll = () => {
        clearAll();
        updateFormData({
            targetAudienceSelectedFilters: [],
            targetAudienceFieldValues: {},
            target_audiences: undefined,
        });
    };

    if (isLoading) {
        return <Step2SelectTargetAudienceSkeleton />;
    }

    if (error) {
        return (
            <div className="flex flex-col gap-4">
                <HeaderTitle text="Target Audience" size="xl" weight="medium" />
                <div className="text-red-500 text-sm">Unable to load target audience filters. Please try again.</div>
            </div>
        );
    }

    return (
        <div className="target-audience-form">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <Target size={20} />
                    <HeaderTitle text="Target Audience" size="xl" weight="medium" />
                </div>
                <DescriptionText
                    text="Choose relevant demographic, behavioural, and location-based filters to create a precise audience segment."
                    size="sm"
                    weight="normal"
                    color="text-black"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[2fr,1fr] gap-6">
                <div className="">
                    <HierarchicalFilterPanel
                        filterSections={targetAudienceFilterData}
                        selectedFilters={selectedFilters}
                        fieldValues={fieldValues}
                        expandedSections={expandedSections}
                        expandedOptions={expandedOptions}
                        handleFilterChange={handleFilterChange}
                        setFieldValues={
                            setFieldValues as (
                                value: Record<string, unknown> | ((previous: Record<string, unknown>) => Record<string, unknown>)
                            ) => void
                        }
                        toggleSection={toggleSection}
                        toggleOption={toggleOption}
                        isOptionFullySelected={isOptionFullySelected}
                        isOptionPartiallySelected={isOptionPartiallySelected}
                        emptyMessage="No target audience filters available."
                    />
                </div>

                <FloatingContainer top="1.5rem" padding="18px 8px" borderRadius="8px" className="bg-white">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <p className="text-sm font-semibold text-black">Filters Selected ({selectedFiltersCount}) :</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="text-sm font-medium font-ubuntu text-black disabled:text-gray-800 border border-gray-600 rounded-sm p-2 cursor-pointer"
                                onClick={handleClearAll}
                                disabled={!hasSelections}
                            >
                                Clear All
                            </button>
                            <div className="flex flex-col gap-2">
                                <ActionButton
                                    bgColor={hasSelections ? 'bg-brand-primary-500' : 'bg-gray-200'}
                                    textColor={hasSelections ? 'text-white' : 'text-gray-600'}
                                    width="full"
                                    borderRadius="rounded-sm"
                                    className="justify-center text-sm font-medium font-ubuntu"
                                    isDisabled={!hasSelections}
                                    onClick={handleSaveAndContinue}
                                >
                                    Save & Continue
                                </ActionButton>
                                {/* {!hasSelections && <p className="text-xs text-gray-500 text-center">Select at least one filter to continue.</p>} */}
                            </div>
                        </div>
                    </div>

                    {/* {selectedFilterGroups.length > 0 ? (
                        <div className="flex flex-col gap-4 max-h-[24rem] overflow-y-auto pr-1">
                            {selectedFilterGroups.map(group => (
                                <div key={group.optionId} className="border border-gray-100 rounded-lg p-3">
                                    <p className="text-sm font-semibold text-gray-800 mb-2">{group.optionLabel}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {group.options.map(option => (
                                            <span
                                                key={option.id}
                                                className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded-md border border-gray-200"
                                            >
                                                {option.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-600">No filters selected yet.</p>
                    )} */}
                </FloatingContainer>
            </div>
        </div>
    );
}
