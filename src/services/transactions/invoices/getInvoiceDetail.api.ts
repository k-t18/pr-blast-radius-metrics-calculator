/**
 * @function get_sales_invoice_details
 * @description
 * Retrieves detailed information for a specific Sales Invoice using its unique
 * invoice ID. The response includes all high-level invoice fields along with
 * each associated item row containing pricing, stock, accounting, and delivery
 * information.
 *
 * @route
 * GET /api/method/chances_game.api.transactions_api.sales_invoice.get_sales_invoice_details
 *
 * @authentication
 * Required — pass Authorization token in headers.
 *
 * @header {string}
 * Authorization - Authentication token. Example: `<token>`
 *
 * @queryparam {string}
 * id - Unique Sales Invoice ID to fetch details for.
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates success or failure.
 * @returns {Object} response.data - Sales Invoice details.
 * @returns {string} response.data.name - Sales Invoice ID.
 * @returns {string} response.data.creation - Timestamp of invoice creation.
 * @returns {number} response.data.grand_total - Grand total of the invoice.
 * @returns {string} response.data.status - Invoice status (e.g., Paid, Unpaid).
 * @returns {string|null} response.data.workflow_state - Workflow approval state.
 * @returns {Array<Object>} response.data.items - List of detailed invoice item rows.
 *
 * @typedef {Object} SalesInvoiceItem
 * @property {string} name - Row ID for the item entry.
 * @property {string} owner - Creator of the record.
 * @property {string} creation - Timestamp when item row was created.
 * @property {string} modified - Last modification timestamp.
 * @property {string} modified_by - User who last modified the row.
 * @property {number} docstatus - Document status (0/1/2).
 * @property {number} idx - Row index.
 * @property {string} item_code - Product code.
 * @property {string} item_name - Product name.
 * @property {string} description - Item description.
 * @property {string} item_group - Item group.
 * @property {string} image - Image URL (if any).
 * @property {number} qty - Quantity.
 * @property {number} rate - Final rate.
 * @property {number} amount - Final amount.
 * @property {number} weight_per_unit - Weight per unit.
 * @property {number} total_weight - Total weight.
 * @property {string} sales_order - Linked Sales Order ID.
 * @property {number} page_break - Page break flag.
 * @property {string} parent - Parent invoice ID.
 * @property {string} doctype - DocType name.
 *
 * @example
 * // Example Success Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "name": "ACC-SINV-2025-00001",
 *     "creation": "2025-11-21 12:06:00.447060",
 *     "grand_total": 100000.0,
 *     "status": "Unpaid",
 *     "workflow_state": null,
 *     "items": [
 *       {
 *         "name": "kp435u4soi",
 *         "item_code": "Mobile Game Chance Square",
 *         "item_name": "Mobile Game Chance Square",
 *         "qty": 1.0,
 *         "rate": 100000.0,
 *         "amount": 100000.0,
 *         "parent": "ACC-SINV-2025-00001",
 *         "doctype": "Sales Invoice Item"
 *       }
 *     ]
 *   },
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-11-21 17:03:59"
 * }
 */
