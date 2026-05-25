import { useState } from 'react';
import { CaretRightIcon, CaretDownIcon } from '@phosphor-icons/react';
import type { CategoryData } from '../../context/createCampaignContext';
import { formatCurrency } from '../../../../../../../utils/formatCurrency';
import '../../../../../../../styles/mobileSponsorshipStyles/reviewCampaignCategoryItem.css';
import { CurrencySymbol } from '../../../../../../../components/common/CurrencySymbol';
import { useReviewCampaignCategoryData } from '../../hooks/useReviewCampaignCategoryData';

interface ReviewCampaignCategoryItemProperties {
    categoryTitle: string;
    categoryData: CategoryData;
    index: number;
}

export default function ReviewCampaignCategoryItem({ categoryTitle, categoryData, index }: ReviewCampaignCategoryItemProperties) {
    const [isRewardDetailsOpen, setIsRewardDetailsOpen] = useState(true);
    const [isCampaignDetailsOpen, setIsCampaignDetailsOpen] = useState(true);

    // Use custom hook to get all computed values
    const {
        audienceReach,
        targetImpressions,
        targetClicks,
        formatCPMRate,
        formatCPCRate,
        filterGroups,
        selectedFiltersCount,
        isSquares,
        isLeaderboard,
        leaderboardRankings,
        squaresSubTotal,
        squaresRewardTotal,
        leaderboardSubTotal,
        leaderboardRewardTotal,
        formattedStartDate,
        durationLabel,
    } = useReviewCampaignCategoryData(categoryData);

    return (
        <div className="">
            <h3 className="text-[14] font-medium mb-2 text-black">
                {index + 1}. {categoryTitle}
            </h3>

            {/* Reward Details Section (Squares or Leaderboard) */}
            {(isSquares || isLeaderboard) && (
                <div className="mb-6">
                    <button type="button" className="review-item-collapsible-btn" onClick={() => setIsRewardDetailsOpen(!isRewardDetailsOpen)}>
                        {isRewardDetailsOpen ? <CaretDownIcon size={20} weight="fill" /> : <CaretRightIcon size={20} weight="fill" />}
                        Reward Details
                    </button>
                    {isRewardDetailsOpen && (
                        <div className="pl-7">
                            <div className="review-item-table-container">
                                <table className="review-item-table">
                                    <thead>
                                        <tr>
                                            {isSquares ? (
                                                <>
                                                    <th>Square Type</th>
                                                    <th>Row</th>
                                                    <th className="text-right">Reward Value</th>
                                                </>
                                            ) : (
                                                <>
                                                    <th>Ranking</th>
                                                    <th className="text-right">Unit Sales Price</th>
                                                    <th className="text-right">Reward Value</th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isSquares
                                            ? categoryData.selectedSquares.map(square => (
                                                  <tr key={square.id}>
                                                      <td className="review-item-table-text">{square.squareType}</td>
                                                      <td className="review-item-table-text">{square.row}</td>
                                                      <td className="text-right review-item-price-text">
                                                          <CurrencySymbol />
                                                          {formatCurrency(square.rewardValue)}
                                                      </td>
                                                  </tr>
                                              ))
                                            : leaderboardRankings.map(rank => (
                                                  <tr key={`${rank.weekId}-${rank.id}`}>
                                                      <td className="review-item-table-text">#{rank.position}</td>
                                                      <td className="text-right review-item-price-text">
                                                          <CurrencySymbol />
                                                          {formatCurrency(rank.unitSalesPrice)}
                                                      </td>
                                                      <td className="text-right review-item-price-text">
                                                          <CurrencySymbol />
                                                          {formatCurrency(rank.rewardValue)}
                                                      </td>
                                                  </tr>
                                              ))}
                                        <tr className="">
                                            {isSquares ? (
                                                <>
                                                    <td colSpan={2} className="review-item-table-subtotal-label">
                                                        Sub total
                                                    </td>
                                                    <td className="text-right review-item-price-text">
                                                        <CurrencySymbol />
                                                        {formatCurrency(squaresRewardTotal)}
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="review-item-table-subtotal-label">Subtotal</td>
                                                    <td className="text-right review-item-price-text">
                                                        <CurrencySymbol />
                                                        {formatCurrency(leaderboardSubTotal)}
                                                    </td>
                                                    <td className="text-right review-item-price-text">
                                                        <CurrencySymbol />
                                                        {formatCurrency(leaderboardRewardTotal)}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                        <tr className="">
                                            {isSquares ? (
                                                <>
                                                    <td colSpan={2} className="review-item-table-total">
                                                        Your total
                                                    </td>
                                                    <td className="text-right review-item-table-total">
                                                        <CurrencySymbol />
                                                        {formatCurrency(squaresSubTotal + squaresRewardTotal)}
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="review-item-table-total">Total</td>
                                                    <td />
                                                    <td className="text-right review-item-table-total">
                                                        <CurrencySymbol />
                                                        {formatCurrency(leaderboardSubTotal + leaderboardRewardTotal)}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Campaign Details Section (Only for non-leaderboard) */}
            {!isLeaderboard && (
                <div>
                    <button type="button" className="review-item-collapsible-btn" onClick={() => setIsCampaignDetailsOpen(!isCampaignDetailsOpen)}>
                        {isCampaignDetailsOpen ? <CaretDownIcon size={20} weight="fill" /> : <CaretRightIcon size={20} weight="fill" />}
                        Campaign Details
                    </button>
                    {isCampaignDetailsOpen && (
                        <div className="pl-7">
                            <div className="grid grid-cols-3 gap-y-6 gap-x-8">
                                {/* Row 1 */}
                                <div>
                                    <p className="review-item-detail-label">Audience Reach</p>
                                    <p className="review-item-detail-value">{audienceReach ? audienceReach.toLocaleString() : '-'}</p>
                                </div>
                                <div>
                                    <p className="review-item-detail-label">Objective</p>
                                    <p className="capitalize review-item-detail-value">{categoryData.objective || 'Visibility'}</p>
                                </div>
                                <div>
                                    <p className="review-item-detail-label">Rates</p>
                                    <div className="flex gap-4 review-item-detail-value">
                                        <span>CPM: {formatCPMRate}</span>
                                        <span>|</span>
                                        <span>CPC: {formatCPCRate}</span>
                                    </div>
                                </div>

                                {/* Row 2 */}
                                <div>
                                    <p className="review-item-detail-label">Budget</p>
                                    <p className="review-item-detail-value">{formatCurrency(categoryData.budget)}</p>
                                </div>
                                <div>
                                    <p className="review-item-detail-label">Estimated Engagement:</p>
                                    <div className="flex gap-4 review-item-detail-value">
                                        <span>Clicks: ~{targetClicks.toLocaleString()}</span>
                                        <span>|</span>
                                        <span>Impressions: ~{targetImpressions.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="review-item-detail-label">Duration</p>
                                    <div className="flex gap-4 review-item-detail-value">
                                        <span>Start Date: {formattedStartDate}</span>
                                        <span>|</span>
                                        <span>Months: {durationLabel}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Filters Applied */}
                            <div className="mt-6">
                                <p className="review-item-detail-label mb-2">Filters Applied ({selectedFiltersCount})</p>
                                <div className="review-item-detail-value text-gray-600">
                                    {filterGroups.length > 0 ? (
                                        filterGroups.map((group, groupIndex) => (
                                            <span key={group.optionId}>
                                                <span className="review-item-detail-label">{group.optionLabel}:</span>{' '}
                                                <span className="review-item-filter-value">{group.options.map(opt => opt.label).join(', ')}</span>
                                                {groupIndex < filterGroups.length - 1 ? ' ; ' : ''}
                                            </span>
                                        ))
                                    ) : (
                                        <span>No filters applied</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <hr className="my-2 border-gray-200" />
        </div>
    );
}
