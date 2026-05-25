import { useState } from 'react';
import HeaderTitle from '../../components/common/HeaderTitle';
import CertificateDetailsSection from './components/CertificateDetailsSection';
import CsrCards from './components/CsrCards';
import PieChart from '../../components/charts/PieChart';
import SingleBarChart from '../../components/charts/SingleBarChart';
import LeaderBoard from './components/LeaderBoard';
import NgoPartnership from './components/NgoPartnership';
import useFetchCsrPageData from './hooks/useFetchCsrPageData';
import { usePeriodSelectionLogic } from '../../hooks/period/usePeriodSelectionLogic';
import { PeriodFilterSelection } from '../../components/common/PeriodFilterSelection';

const fundsAllocationColors = ['#6A0DAD', '#FF6F61', '#20B2AA', '#FFD700'];
function CSRPage() {
    const [rankingPage, setRankingPage] = useState(0);
    const [rankingRowsPerPage, setRankingRowsPerPage] = useState(10);
    const [ngoPage, setNgoPage] = useState(0);
    const [ngoRowsPerPage, setNgoRowsPerPage] = useState(10);

    // Period filter logic
    const { handlePeriodChange, selectedDateFormat, periodData, isPeriodReady } = usePeriodSelectionLogic();

    const {
        csrCardSummary,
        isLoading,
        error,
        ngoWiseTotalDonationData,
        rankValueData,
        rankingListData,
        rankingListCount,
        fundsAllocationData,
        ngoPartnershipListData,
        ngoPartnershipCount,
        isLoadingNgoPartnershipList,
        isLoadingRankingList,
        errorNgoPartnershipList,
        errorRankingList,
        certificateData,
        isLoadingCertificate,
        errorCertificate,
    } = useFetchCsrPageData({
        rankingLimit: rankingRowsPerPage,
        // Backend expects zero-based page index (page 1 -> 0, page 2 -> 1, ...)
        rankingOffset: rankingPage,
        ngoLimit: ngoRowsPerPage,
        // Backend expects zero-based page index (page 1 -> 0, page 2 -> 1, ...)
        ngoOffset: ngoPage,
        dateFormat: selectedDateFormat,
        enabled: isPeriodReady,
    });

    const certificateSourceRow =
        ngoPartnershipListData?.find(item => item.certificate === certificateData?.certificate) ?? ngoPartnershipListData?.[0];
    const ngoName = certificateData?.ngo_name || certificateSourceRow?.ngo_name;
    const focusArea = certificateData?.focus_area || certificateSourceRow?.focus_area || undefined;

    return (
        <div className="mb-4">
            <HeaderTitle text="Corporate Social Responsibility" size="2xl" weight="medium" className="mb-6" />
            <div className="mb-8">
                <CertificateDetailsSection
                    certificateData={certificateData}
                    isLoading={isLoadingCertificate}
                    error={errorCertificate}
                    ngoName={ngoName}
                    focusArea={focusArea}
                />
            </div>
            <div className="mb-6">
                <div className="mb-4 flex items-center justify-end">
                    <PeriodFilterSelection periodData={periodData} selectedValue={selectedDateFormat} onChange={handlePeriodChange} />
                </div>
                <CsrCards csrCardSummary={csrCardSummary ?? []} isLoading={isLoading} error={error} />
            </div>
            <hr className="border-border-gray-600 my-8" />
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
                <div className="lg:col-span-2 h-full">
                    {fundsAllocationData?.fundsAllocation && fundsAllocationData.fundsAllocation.length > 0 ? (
                        <PieChart
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            data={fundsAllocationData.fundsAllocation}
                            title="Funds allocation by Focus Areas"
                            colors={fundsAllocationColors}
                            isAnimationActive
                        />
                    ) : (
                        <div className="flex h-full min-h-[400px] w-full items-center justify-center rounded border border-gray-200 bg-white">
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-lg font-medium text-gray-800">No Data Available</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="lg:col-span-3 h-full">
                    {ngoWiseTotalDonationData?.ngoDonations && ngoWiseTotalDonationData.ngoDonations.length > 0 ? (
                        <SingleBarChart
                            data={ngoWiseTotalDonationData.ngoDonations}
                            title="Top 5 NGO partnerships by Donations made"
                            barKey="donation"
                            barName="Donation"
                            barColor="#6A0DAD"
                            yAxisDomain={[0, ngoWiseTotalDonationData?.yAxisDomain?.[1] ?? 8_000_000]}
                            height={400}
                            yAxisLabel="Donation"
                            currencySymbol="₦"
                        />
                    ) : (
                        <div className="flex h-[400px] w-full items-center justify-center rounded border border-gray-200 bg-white">
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-lg font-medium text-gray-800">No Data Available</span>
                                <span className="text-sm text-gray-600">There are no NGO donations to display for this period.</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <hr className="border-border-gray-600 my-8" />
            <LeaderBoard
                rankValueData={rankValueData ?? { rank: 0 }}
                rankingListData={rankingListData ?? []}
                totalCount={rankingListCount ?? 0}
                page={rankingPage}
                rowsPerPage={rankingRowsPerPage}
                isLoading={isLoadingRankingList ?? false}
                error={errorRankingList ?? null}
                onPageChange={(page, rows) => {
                    setRankingPage(page);
                    setRankingRowsPerPage(rows);
                }}
            />
            <hr className="border-border-gray-600 my-8" />
            <NgoPartnership
                data={ngoPartnershipListData ?? []}
                isLoading={isLoadingNgoPartnershipList ?? false}
                error={errorNgoPartnershipList ?? null}
                totalCount={ngoPartnershipCount ?? 0}
                page={ngoPage}
                rowsPerPage={ngoRowsPerPage}
                onPageChange={(page, rows) => {
                    setNgoPage(page);
                    setNgoRowsPerPage(rows);
                }}
            />
            {/* <hr className="border-border-gray-600 my-8" />
            <Testimonials />
            <hr className="border-border-gray-600 my-8" />
            <ImpactStories /> */}
        </div>
    );
}

export default CSRPage;
