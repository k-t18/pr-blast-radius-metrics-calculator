import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';
import type { SponsorRegistrationFormData } from '../../pages/sponsorRegistration/context/sponsorRegistrationContext';

/**
 * @function sponsor_registration
 * @description
 * Registers a new sponsor by creating a Lead in the system.
 * Accepts detailed company, contact, social media, CSR preferences, financial,
 * and demographic information along with file attachments.
 *
 * This API is used to onboard a new sponsor into the Chances platform.
 *
 * @route
 * POST /api/method/chances_game.api.sponsor_api.v1.registration.sponsor_registration
 *
 * @bodyParam {object} data - Full sponsor registration details.
 *
 * @bodyParam {string} data.company_name - Name of the sponsoring organization.
 * @bodyParam {string} data.industry - Industry type (e.g., "Music").
 * @bodyParam {string} data.custom_cac_number - CAC (Corporate Affairs Commission) number.
 * @bodyParam {string} data.custom_tin - TIN (Tax Identification Number).
 * @bodyParam {string} data.custom_customer_type - Type of customer ("Company" or "Individual").
 * @bodyParam {string} data.website - Company website URL.
 * @bodyParam {string} data.custom_instagram - Instagram profile link.
 * @bodyParam {string} data.custom_facebook - Facebook profile link.
 * @bodyParam {string} data.custom_x - X (Twitter) profile link.
 * @bodyParam {string} data.custom_linkedin - LinkedIn profile link.
 * @bodyParam {string} data.custom_address_line_1 - Registered address line.
 * @bodyParam {string} data.city - City.
 * @bodyParam {string} data.state - State.
 * @bodyParam {string} data.country - Country.
 * @bodyParam {string} data.custom_postal_code - Postal code.
 * @bodyParam {string} data.custom_contact_person - Contact person's full name.
 * @bodyParam {string} data.job_title - Contact person's job title.
 * @bodyParam {string} data.email_id - Email address.
 * @bodyParam {string} data.mobile_no - Mobile number.
 * @bodyParam {string} data.whatsapp_no - WhatsApp number.
 * @bodyParam {string} data.phone - Telephone number.
 * @bodyParam {array<string>} data.custom_csr_focus_area - CSR interest areas.
 * @bodyParam {array<string>} data.custom_sponsorship_intent - Sponsorship goals.
 * @bodyParam {string} data.custom_prize_pledge_type - Pledge type (e.g., "Cash Reward").
 * @bodyParam {string} data.custom_additional_notes - Additional information.
 *
 * @bodyParam {array<object>} data.attachments - List of file attachments (Base64).
 * @bodyParam {string} attachments[].fieldname - Field to which file is attached.
 * @bodyParam {string} attachments[].filename - File name with extension.
 * @bodyParam {string} attachments[].filedata - Base64 encoded file string.
 *
 * @bodyParam {string} data.first_name - First name of contact.
 * @bodyParam {string} data.last_name - Last name of contact.
 * @bodyParam {string} data.lead_name - Full name for lead.
 * @bodyParam {string} data.custom_customer_group - Customer group (e.g., "Sponsor").
 * @bodyParam {string} data.lead_type - Lead type, e.g., "Sponsor".
 * @bodyParam {string} data.no_of_employees - Employee count range.
 * @bodyParam {number} data.annual_revenue - Annual revenue amount.
 * @bodyParam {array<string>} data.custom_brand_categories - Target audience category (e.g., "Students").
 *
 * @bodyParam {string} data.phone_ext - Phone extension.
 * @bodyParam {number} data.custom_terms_and_conditions - Terms agreement (1 = yes).
 * @bodyParam {number} data.custom_kyc_information - KYC confirmation (1 = yes).
 * @bodyParam {number} data.custom_privacy_policy - Privacy policy acceptance (1 = yes).
 *
 * @bodyParam {string} data.custom_account_name - Account name for transactions.
 * @bodyParam {string} data.custom_account_number - Bank account number.
 * @bodyParam {string} data.custom_ifsc_code - IFSC code.
 *
 * @bodyParam {array<object>} data.target_audiences - Detailed targeting groups.
 * Example:
 * [
 *   {
 *     "group": "banking",
 *     "options": {
 *       "public_sector_banks": { "sub": ["SBI", "PNB"] }
 *     }
 *   }
 * ]
 *
 * @authentication
 * Optional – can use guest access (no Authorization header required in this case).
 *
 * @header {string} Content-Type
 * application/json
 *
 * @response 200 - Success
 * {
 *   "status": "success",
 *   "data": {
 *     "status": "success",
 *     "message": "Lead created successfully",
 *     "lead_id": "CRM-LEAD-2025-00025"
 *   },
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-12-01 19:02:32"
 * }
 *
 * @response 400 - Validation Error
 * {
 *   "status": "error",
 *   "message": "Required fields missing or invalid"
 * }
 *
 * @response 500 - Internal Server Error
 * {
 *   "status": "error",
 *   "message": "Unexpected error occurred"
 * }
 *
 * @example cURL
 * curl --location --request POST 'http://127.0.0.1:8000/api/method/chances_game.api.sponsor_api.v1.registration.sponsor_registration' \
 * --header 'Content-Type: application/json' \
 * --data '{
 *   "data": {
 *     "company_name": "ABC Foundation",
 *     "industry": "Music",
 *     ...
 *     "custom_terms_and_conditions": 1,
 *     "custom_kyc_information": 1,
 *     "custom_privacy_policy": 1
 *   }
 * }'
 *
 */
export const postSubmitForm = async (payload: SponsorRegistrationFormData): Promise<ApiResponse<string>> => {
    const { folder, file, function: methodName } = apiRegistry.postSubmitForm;
    const url = buildFrappeMethodURL(folder, file, methodName);
    return api.post<ApiResponse<string>>(url, { ...payload });
};
