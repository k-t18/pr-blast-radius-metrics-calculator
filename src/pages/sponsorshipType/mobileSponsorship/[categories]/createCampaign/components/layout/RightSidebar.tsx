import ActionButton from '../../../../../../../components/common/ActionButton';
import Checkbox from '../../../../../../../components/common/CheckBox';
import '../../../../../../../styles/mobileSponsorshipStyles/rightSidebar.css';
import { useRightSidebarSectionLogic } from '../../hooks/useRightSidebarSectionLogic';
import { SkeletonAudienceReach } from '../../../../skeleton/step2SelectTargetAudienceSkeleton';

export default function RightSidebarFilters() {
    const {
        filterGroups,
        selectedFiltersCount,
        audienceReach,
        baseCPMRate,
        baseCPCRate,
        saveFilters,
        setSaveFilters,
        clearFilters,
        newCPMRateFromApi,
        newCPCRateFromApi,
        targetImpressions,
        targetClicks,
        objective,
        hasTargetAudience,
        isLoadingSavedFilters,
        savedFiltersError,
        isLoadingAudienceReach,
        errorAudienceReach,
    } = useRightSidebarSectionLogic();

    return (
        <div className="right-sidebar">
            {/* Audience reach section */}
            <div className="right-sidebar-section">
                <div className={`right-sidebar-audience-box d-flex ${audienceReach ? 'has-audience' : 'no-audience'}`}>
                    <h3 className="right-sidebar-audience-label">Audience you will reach</h3>
                    {(() => {
                        if (isLoadingAudienceReach) {
                            return <SkeletonAudienceReach />;
                        }
                        if (errorAudienceReach) {
                            return (
                                <div className="flex flex-col items-start justify-start">
                                    <span className="text-red-500 text-xs">Failed to load audience reach</span>
                                </div>
                            );
                        }
                        if (audienceReach) {
                            return (
                                <div className="flex flex-col items-start justify-start">
                                    <span className="sidebar-audience ">{audienceReach.toLocaleString()}</span>
                                </div>
                            );
                        }
                        return <span className="right-sidebar-audience-empty">-</span>;
                    })()}
                </div>
            </div>

            {/* Selected filters section */}
            <div className="right-sidebar-section">
                <div className="right-sidebar-section-header">
                    <h3 className="right-sidebar-section-title-selected-filters">Selected Filters({selectedFiltersCount})</h3>
                </div>

                <div className="right-sidebar-filters">
                    <div className="right-sidebar-filter-checkbox-label">
                        {isLoadingSavedFilters ? (
                            <div className="flex items-center gap-2 animate-pulse">
                                <div className="w-5 h-5 bg-gray-200 rounded-[4px]" />
                                <div className="h-4 w-32 bg-gray-200 rounded" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-start justify-start">
                                <Checkbox
                                    label="Apply saved filters"
                                    checked={saveFilters}
                                    onChange={setSaveFilters}
                                    className="right-sidebar-filter-checkbox text-sm"
                                    disabled={isLoadingSavedFilters}
                                />
                                {savedFiltersError && <div className="text-red-500 text-xs mt-1">Failed to load saved filters</div>}
                            </div>
                        )}
                    </div>

                    {filterGroups.length > 0 && (
                        <>
                            <div className="right-sidebar-filter-container">
                                {filterGroups.map(group => (
                                    <div key={group.optionId} className="right-sidebar-filter-group">
                                        <div className="right-sidebar-filter-group-header">
                                            <div className="right-sidebar-filter-group-title">
                                                {group.optionLabel} <span className="right-sidebar-filter-group-count">({group.options.length})</span>
                                            </div>
                                        </div>

                                        <div className="right-sidebar-filter-options">
                                            {group.options.map(opt => (
                                                <button key={opt.id} className="btn btn-sm btn-primary right-sidebar-filter-button" type="button">
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="right-sidebar-filter-actions">
                                <ActionButton
                                    bgColor="bg-transparent"
                                    textColor="#000000"
                                    borderColor="border-gray-500"
                                    width="auto"
                                    className="right-sidebar-filter-action-button border"
                                    onClick={clearFilters}
                                    type="button"
                                >
                                    Reset Filters
                                </ActionButton>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Rates section divider */}
            <div>
                <hr className="right-sidebar-section-divider" />
            </div>

            {/* CPC / CPM rates section */}
            <div className="right-sidebar-section">
                <div className="right-sidebar-section-header">
                    <h3 className="cpc-cpm-rates-title">CPC / CPM Rates</h3>
                </div>
                <div className="right-sidebar-rates">
                    {(() => {
                        // Both objective
                        if (objective === 'both') {
                            return (
                                <>
                                    <p className="right-sidebar-rate-text">
                                        {hasTargetAudience ? 'Updated rates available' : 'Estimated rates available upon filter selection'}
                                    </p>
                                    {/* CPM Row */}
                                    <p className="right-sidebar-rate-label">
                                        Base CPM Rate:{' '}
                                        <span className="right-sidebar-rate-value">{baseCPMRate === undefined ? '-' : `₦ ${baseCPMRate}`}</span>
                                        <span className="right-sidebar-rate-separator">|</span>
                                        <span className="right-sidebar-rate-label-new">New CPM Rate:</span>{' '}
                                        <span className="right-sidebar-rate-value-new">
                                            {newCPMRateFromApi === undefined ? '-' : `₦ ${newCPMRateFromApi}`}
                                        </span>
                                    </p>
                                    {/* CPC Row */}
                                    <p className="right-sidebar-rate-label" style={{ marginTop: '0.5rem' }}>
                                        Base CPC Rate:{' '}
                                        <span className="right-sidebar-rate-value">{baseCPCRate === undefined ? '-' : `₦ ${baseCPCRate}`}</span>
                                        <span className="right-sidebar-rate-separator">|</span>
                                        <span className="right-sidebar-rate-label-new">New CPC Rate:</span>{' '}
                                        <span className="right-sidebar-rate-value-new">
                                            {newCPCRateFromApi === undefined ? '-' : `₦ ${newCPCRateFromApi}`}
                                        </span>
                                    </p>
                                </>
                            );
                        }

                        // Engagement - show CPC rates
                        if (objective === 'engagement') {
                            return (
                                <>
                                    <p className="right-sidebar-rate-text">
                                        {hasTargetAudience && newCPCRateFromApi !== undefined
                                            ? 'Updated rate available upon filter selection'
                                            : 'Estimated rate available upon filter selection'}
                                    </p>
                                    <p className="right-sidebar-rate-label">
                                        Base CPC Rate:{' '}
                                        <span className="right-sidebar-rate-value">{baseCPCRate === undefined ? '-' : `₦ ${baseCPCRate}`}</span>
                                        <span className="right-sidebar-rate-separator">|</span>
                                        <span className="right-sidebar-rate-label-new">New CPC Rate:</span>{' '}
                                        <span className="right-sidebar-rate-value-new">
                                            {newCPCRateFromApi === undefined ? '-' : `₦ ${newCPCRateFromApi}`}
                                        </span>
                                    </p>
                                </>
                            );
                        }

                        // Visibility - show CPM rates
                        return (
                            <>
                                <p className="right-sidebar-rate-text">
                                    {hasTargetAudience && newCPMRateFromApi !== undefined
                                        ? 'Updated rate available upon filter selection'
                                        : 'Estimated rate available upon filter selection'}
                                </p>
                                <p className="right-sidebar-rate-label">
                                    Base CPM Rate:{' '}
                                    <span className="right-sidebar-rate-value">{baseCPMRate === undefined ? '-' : `₦ ${baseCPMRate}`}</span>
                                    <span className="right-sidebar-rate-separator">|</span>
                                    <span className="right-sidebar-rate-label-new">New CPM Rate:</span>{' '}
                                    <span className="right-sidebar-rate-value-new">
                                        {newCPMRateFromApi === undefined ? '-' : `₦ ${newCPMRateFromApi}`}
                                    </span>
                                </p>
                            </>
                        );
                    })()}
                </div>
            </div>

            {/* Estimated engagement section divider */}
            <div>
                <hr className="right-sidebar-section-divider" />
            </div>

            {/* Estimated engagement section */}
            <div className="right-sidebar-section">
                <div className="right-sidebar-section-header">
                    <h3 className="text-black">Estimated Engagement</h3>
                </div>
                <div className="right-sidebar-engagement">
                    {targetImpressions > 0 || targetClicks > 0 ? (
                        <div className="flex flex-col gap-2">
                            {targetImpressions > 0 && (
                                <div>
                                    <span className="right-sidebar-engagement-label text-[12px]">Target Impressions: </span>
                                    <span className="right-sidebar-engagement-value text-[12px]">{targetImpressions.toLocaleString()}</span>
                                </div>
                            )}
                            {targetClicks > 0 && (
                                <div>
                                    <span className="right-sidebar-engagement-label text-[12px]">Target Clicks: </span>
                                    <span className="right-sidebar-engagement-value text-[12px]">{targetClicks.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <span className="right-sidebar-engagement-empty">-</span>
                    )}
                </div>
            </div>
        </div>
    );
}
