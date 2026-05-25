const BASE_METHOD_PATH: string = '/api/method/chances_game.api';
const APPLY_VERSION_TO_METHOD_PATH: boolean = false;
const VERSION: string = 'v1';

export const apiRegistry = {
    quotationsList: {
        folder: 'transactions_api',
        file: 'quotation',
        function: 'get_quotations_list',
    },
    quotationDetail: {
        folder: 'transactions_api',
        file: 'quotation',
        function: 'get_quotation_details',
    },
    salesOrdersWithPrizeAgreementItemsList: {
        folder: 'transactions_api',
        file: 'sales_order',
        function: 'get_sales_order_with_prize_agreement_items_list',
    },
    createPrizeAgreement: {
        folder: 'transactions_api',
        file: 'prize_agreement',
        function: 'create_prize_agreement',
    },
    getPrizeAgreementList: {
        folder: 'transactions_api',
        file: 'prize_agreement',
        function: 'get_prize_agreement_list',
    },
    getNGOsList: {
        folder: 'v1',
        file: 'ngo',
        function: 'get_ngo_list',
    },
    getTINVerification: {
        folder: 'sponsor_api.v1',
        file: 'registration',
        function: 'verify_tin_number',
    },
    getCACVerification: {
        folder: 'sponsor_api.v1',
        file: 'registration',
        function: 'verify_cac_number',
    },
    getCountryList: {
        folder: 'sponsor_api.v1',
        file: 'registration',
        function: 'get_country_list',
    },
    getIndustryTypeList: {
        folder: 'sponsor_api.v1',
        file: 'registration',
        function: 'get_industry_type',
    },
    getIndustryList: {
        folder: 'sponsor_api.v1',
        file: 'registration',
        function: 'get_industry_list',
    },
    getSponsorshipIntentList: {
        folder: 'sponsor_api.v1',
        file: 'registration',
        function: 'get_sponsorship_intent',
    },
    getSponsorshipFocusAreaList: {
        folder: 'sponsor_api.v1',
        file: 'registration',
        function: 'get_sponsorship_focus_area',
    },
    getPrizePledgeList: {
        folder: 'sponsor_api.v1',
        file: 'registration',
        function: 'get_prize_pledge',
    },
    getAccessApiToken: {
        folder: 'sponsor_api.v1',
        file: 'login',
        function: 'get_access_api_token',
    },
    salesOrderList: {
        folder: 'transactions_api',
        file: 'sales_order',
        function: 'get_sales_orders_list',
    },
    salesOrderDetail: {
        folder: 'transactions_api',
        file: 'sales_order',
        function: 'get_sales_order_details',
    },
    invoicesList: {
        folder: 'transactions_api',
        file: 'sales_invoice',
        function: 'get_sales_invoices_list',
    },
    getStudioShowEpisodes: {
        folder: 'sponsor_api.v1',
        file: 'episode',
        function: 'get_studio_show_episodes',
    },
    studioShowEpisodeCategories: {
        folder: 'sponsor_api.v1',
        file: 'category',
        function: 'get_episode_categories',
    },
    studioShowEpisodeSquares: {
        folder: 'sponsor_api.v1',
        file: 'square',
        function: 'get_episode_squares',
    },
    crossSellingEpisodes: {
        folder: 'sponsor_api.v1',
        file: 'episode',
        function: 'get_crosseling_episodes',
    },
    getOverallPerformanceMetrics: {
        folder: 'sponsor_api.v1',
        file: 'campaign',
        function: 'get_overall_performance_metrics',
    },
    getRewardCampaignMetrics: {
        folder: 'sponsor_api.v1',
        file: 'campaign',
        function: 'get_reward_campaign_metrics',
    },
    getEstimatedVsActualImpressions: {
        folder: 'sponsor_api.v1',
        file: 'campaign',
        function: 'get_estimated_vs_actual_impressions',
    },
    getEstimatedVsActualClicks: {
        folder: 'sponsor_api.v1',
        file: 'campaign',
        function: 'get_estimated_vs_actual_clicks',
    },
    getCampaigns: {
        folder: 'sponsor_api.v1',
        file: 'campaign',
        function: 'get_campaigns',
    },
    getCampaignsFilters: {
        folder: 'sponsor_api.v1',
        file: 'campaign',
        function: 'get_campaigns_filters',
    },
    getGameSeason: {
        folder: 'sponsor_api.v1',
        file: 'game_season',
        function: 'get_game_season_list',
    },
    createQuotation: {
        folder: 'transactions_api',
        file: 'quotation',
        function: 'create_quotation',
    },
    getVatCalculation: {
        folder: 'transactions_api',
        file: 'quotation',
        function: 'get_vat_calculation',
    },
    postSubmitForm: {
        folder: 'sponsor_api.v1',
        file: 'registration',
        function: 'sponsor_registration',
    },
    // Blanket Order API's start here
    blanketOrderList: {
        folder: 'sponsor_api.v1',
        file: 'blanket_order',
        function: 'get_blanket_order',
    },
    createBlanketOrder: {
        folder: 'sponsor_api.v1',
        file: 'blanket_order',
        function: 'create_blanket_from_portal',
    },
    // General API's start here
    fileUpload: {
        folder: 'sponsor_api.v1',
        file: 'creatives',
        function: 'upload_files_from_portal',
    },
    createCreativeFromPortal: {
        folder: 'sponsor_api.v1',
        file: 'creatives',
        function: 'create_creative_from_portal',
    },
    getSponsorPortalSettings: {
        folder: 'sponsor_api.v1',
        file: 'sponsor_portal_settings',
        function: 'get_sponsor_portal_settings',
    },
    // Support APIs
    getIssueCategory: {
        folder: 'customization.issue',
        file: 'api',
        function: 'get_issue_category',
    },
    winnerCards: {
        folder: 'doctype.winner_list',
        file: 'api',
        function: 'winner_cards',
    },
    winnerTable: {
        folder: 'doctype.winner_list',
        file: 'api',
        function: 'get_winner_table',
    },
    getSponsorshipCategory: {
        folder: 'customization.issue',
        file: 'api',
        function: 'get_sponsorship_category',
    },
    getSupportTickets: {
        folder: 'customization.issue',
        file: 'api',
        function: 'get_support_table',
    },
    getIssueList: {
        folder: 'customization.issue',
        file: 'api',
        function: 'get_issue_list',
    },
    createSupportTicket: {
        folder: 'sponsor_api.v1',
        file: 'issues',
        function: 'create_portal_issue',
    },
    // CSR API's start here
    getCsrCardDetails: {
        folder: 'csr_donation',
        file: 'api',
        function: 'csr_card_details',
    },
    getCsrFundAllocationByFocusArea: {
        folder: 'csr_donation',
        file: 'api',
        function: 'get_fund_allocation',
    },
    getNgoWiseTotalDonation: {
        folder: 'csr_donation',
        file: 'api',
        function: 'fetch_ngo_wise_total_donation',
    },
    getNgoPartnershipList: {
        folder: 'csr_donation',
        file: 'api',
        function: 'get_ngo_patnership',
    },
    getNgoPartnershipSocial: {
        folder: 'csr_donation',
        file: 'api',
        function: 'get_ngo_patnership_social',
    },
    getLoggedInCustomerRank: {
        folder: 'csr_donation',
        file: 'api',
        function: 'get_logged_in_customer_rank',
    },
    getRankList: {
        folder: 'csr_donation',
        file: 'api',
        function: 'get_customer_wise_paid_summary',
    },
    getLatestCertificate: {
        folder: 'csr_donation',
        file: 'api',
        function: 'get_latest_certifcate',
    },
    // Creatives API's start here
    getSalesOrderWithItemsRequiringCreativesList: {
        folder: 'transactions_api',
        file: 'sales_order',
        function: 'get_sales_orders_list_with_items_requiring_creatives',
    },
    creativesUploadTable: {
        folder: 'sponsor_api.v1',
        file: 'creatives',
        function: 'creatives_upload_table',
    },
    getLeadUserLogo: {
        folder: 'customization.common',
        file: 'retrieve_filters_data',
        function: 'get_lead_user_logo',
    },
    getPeriodFilter: {
        folder: 'sponsor_api.v1',
        file: 'period',
        function: 'get_period_filter',
        // transactions filters
    },
    transactionFilterList: {
        folder: 'transactions_api',
        file: 'get_transactions_filters_list',
        function: 'get_document_names_list',
    },
    getMobileGrowthInUsers: {
        folder: 'sponsor_api.v1',
        file: 'mobile_dashboard',
        function: 'get_customer_creation_chart',
    },
    getMobileGenderDistribution: {
        folder: 'sponsor_api.v1',
        file: 'mobile_dashboard',
        function: 'get_gender_distribution',
    },
    getMobileAgeGroupDistribution: {
        folder: 'sponsor_api.v1',
        file: 'mobile_dashboard',
        function: 'get_age_group_distribution',
    },
    getMobileEducationDistribution: {
        folder: 'sponsor_api.v1',
        file: 'mobile_dashboard',
        function: 'get_education_status_distribution',
    },
    getMobileTopCitiesByPlayerCount: {
        folder: 'sponsor_api.v1',
        file: 'mobile_dashboard',
        function: 'get_top_cities_by_player_count',
    },
    getMobileAudienceReachAndExposure: {
        folder: 'sponsor_api.v1',
        file: 'mobile_dashboard',
        function: 'get_audience_reach_and_exposure',
    },
    getMobileInterestsOfPlayers: {
        folder: 'sponsor_api.v1',
        file: 'mobile_dashboard',
        function: 'get_interests_of_players',
    },
    getMobileTopPaymentMethods: {
        folder: 'sponsor_api.v1',
        file: 'mobile_dashboard',
        function: 'get_top_payment_methods_data',
    },
    getMobileStateByPlayerCount: {
        folder: 'sponsor_api.v1',
        file: 'mobile_dashboard',
        function: 'get_state_by_player_count',
    },
    getTermsAndCondition: {
        folder: 'sponsor_api.v1',
        file: 'terms_and_condition',
        function: 'get_terms_and_condition',
    },
    getDocumentSize: {
        folder: 'sponsor_api.v1',
        file: 'document_size',
        function: 'get_document_size',
    },
    getUserNotificationLog: {
        folder: 'sponsor_api.v1',
        file: 'notification',
        function: 'get_user_notification_log',
    },
    readNotification: {
        folder: 'sponsor_api.v1',
        file: 'notification',
        function: 'read_notification',
    },
};

/**
 * Builds full Frappe method API URL.
 *
 * @param {string} folder - The folder inside transactions_api
 * @param {string} file - The file name
 * @param {string} method - The function name
 * @returns {string} - Full API endpoint URL
 */
export const buildFrappeMethodURL = (folder: string, file: string, method: string): string => {
    if (APPLY_VERSION_TO_METHOD_PATH) {
        return `${BASE_METHOD_PATH}.${VERSION}.${folder}.${file}.${method}`;
    }
    return `${BASE_METHOD_PATH}.${folder}.${file}.${method}`;
};
