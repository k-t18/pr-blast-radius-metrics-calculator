# Prize Agreement Module Documentation

## 📖 Overview

The **Prize Agreement (PA)** module allows sponsors to configure how their rewards will be distributed to players. Sponsors define reward types, quantities, values, and handling instructions for their sponsored items.

---

## 🏗️ Architecture Overview

```
src/pages/prizeAgreement/
├── page.tsx                          # Main entry point
├── config/
│   └── constants.ts                  # Form defaults, options, progress fields
├── hooks/
│   ├── api/
│   │   ├── useFetchNgosList.ts       # Fetch NGO list for CSR
│   │   ├── usePrizeAgreementApis.ts  # Main API hook for fetching orders
│   │   └── usePrizeAgreementList.ts  # Fetch submitted prize agreements
│   └── form/
│       ├── useFormHandler.ts         # Save & submit form data
│       ├── useFormValidation.ts      # Validate form fields
│       ├── useItemsLinkedForm.ts     # Manage form state
│       └── useProgressHandler.ts     # Track form completion progress
└── components/
    ├── Containers/
    │   ├── PrizeAgreementCard.tsx    # Individual order card with accordion
    │   ├── PrizeAgreementContainer.tsx # List of order cards with infinite scroll
    │   └── PrizeAgreementListContainer.tsx # Submitted agreements list
    ├── ItemsLinkedFields/            # Main form component
    │   ├── index.tsx                 # Form orchestrator
    │   └── components/
    │       ├── RewardTypeSelector.tsx
    │       ├── DescriptionField.tsx
    │       ├── CashRewardFields.tsx
    │       ├── GiftVoucherFields.tsx
    │       ├── VoucherExtraFields.tsx
    │       ├── MixRewardSection.tsx
    │       ├── CommonFields.tsx
    │       └── SaveButton.tsx
    └── CsrContribution/              # CSR donation form
        └── index.tsx
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              page.tsx                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  usePrizeAgreementApis() → Fetches sales orders with items          │    │
│  │  useFetchNGOsList() → Fetches NGO list for CSR                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │              PrizeAgreementContainer                                │    │
│  │  - Renders list of PrizeAgreementCard                               │    │
│  │  - Handles infinite scroll pagination                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │              PrizeAgreementCard                                     │    │
│  │  - useFormHandler() → Manages saved data & submission               │    │
│  │  - useProgressHandler() → Tracks completion %                       │    │
│  │  - Renders accordion with CSRContribution + ItemsLinkedFields       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │              ItemsLinkedFields                                      │    │
│  │  - useItemsLinkedForm() → Local form state                          │    │
│  │  - useFormValidation() → Validates all fields                       │    │
│  │  - Renders form fields based on reward type                         │    │
│  │  - Calls onSave() → PrizeAgreementCard.handleSaveItem()             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Reward Types

| Type               | Description                  | Fields Required                                                                              |
| ------------------ | ---------------------------- | -------------------------------------------------------------------------------------------- |
| **Cash**           | Money distributed to players | `playersCount`, `description`, common fields                                                 |
| **Gift**           | Physical items               | `quantity`, `unitRetailPrice`, `description`, common fields                                  |
| **Voucher/Coupon** | Digital vouchers             | `quantity`, `unitRetailPrice`, `startDate`_, `durationMonths`_, `description`, common fields |
| **Mix**            | Combination of 2+ types      | Select at least 2 types, fill all fields for each                                            |

> \*`startDate` and `durationMonths` only required for **Mobile Game** sponsorship type

### Common Fields (All Types)

- `unclaimedPrizesHandling` - What to do with unclaimed prizes
- `disbursementOwnership` - Who handles distribution (Chances Team / Sponsor)
- `collectionInstructions` - Instructions for winners

---

## 🪝 Custom Hooks

### `useFormHandler`

**Location**: `hooks/form/useFormHandler.ts`

**Purpose**: Manages saved form data and handles submission to API.

```typescript
const {
    savedFormsData, // Record of all saved item forms
    handleSaveItem, // Save individual item form
    handleSaveCSRContributionForm, // Save CSR contribution
    handleSubmit, // Submit entire prize agreement
    isSubmittingFormMutation, // Loading state
} = useFormHandler({ sponsorshipType, sponsor });
```

**Key Functions**:

- `handleSaveItem()` - Saves form data to local state
- `handleSubmit()` - Transforms data to API format and submits

---

### `useItemsLinkedForm`

**Location**: `hooks/form/useItemsLinkedForm.ts`

**Purpose**: Manages local form state for a single item.

```typescript
const {
    form, // Current form values
    update, // Update single field
    updateMixTypeData, // Update field within mix type
    toggleMixType, // Toggle mix type selection
} = useItemsLinkedForm(initialValues);
```

---

### `useFormValidation`

**Location**: `hooks/form/useFormValidation.ts`

**Purpose**: Validates all form fields and determines if form can be submitted.

```typescript
const {
    isCash,
    isGift,
    isVoucher,
    isMix, // Type flags
    isMixTypesValid, // At least 2 mix types selected
    canSubmit, // All validations passed
    areMixTypeDataFieldsValid, // Mix type fields validated
} = useFormValidation(form, {
    isMobileGameWeeklyLeaderboard,
    declaredRewardAmount,
    isMobileTab,
});
```

**Validation Rules**:

| Reward Type | Validation                                                                    |
| ----------- | ----------------------------------------------------------------------------- |
| Cash        | `playersCount >= 1`                                                           |
| Gift        | `quantity >= 1`, `unitRetailPrice >= 1`                                       |
| Voucher     | `quantity >= 1`, `unitRetailPrice >= 1`, `startDate`_, `durationMonths >= 1`_ |
| Mix         | At least 2 types + all fields for each selected type                          |

---

### `useProgressHandler`

**Location**: `hooks/form/useProgressHandler.ts`

**Purpose**: Tracks form completion percentage for progress indicator.

```typescript
const { progressMap, handleProgress } = useProgressHandler();
// progressMap: { [itemId]: number } // 0-100%
```

---

## 📦 Key Components

### `ItemsLinkedFields`

**Location**: `components/ItemsLinkedFields/index.tsx`

The main form component that renders different fields based on selected reward type.

**Props**:

```typescript
interface ItemsLinkedFieldsProperties {
    itemId: string; // Unique item identifier
    declaredRewardAmount?: number; // Total reward value
    initialValues?: PrizeAgreementFormDataTypes;
    onSave: (data) => void; // Called when "Save & Continue" clicked
    onProgress: (value: number) => void; // Progress callback
    sponsorshipType?: string; // "Mobile Game" | "Studio Show"
    sponsorItemName?: string; // Item name for special handling
}
```

**Conditional Rendering Logic**:

```
RewardTypeSelector (always shown)
    │
    ├── Cash Selected
    │   ├── DescriptionField
    │   ├── CashRewardFields (playersCount, amountPerPlayer)
    │   └── CommonFields
    │
    ├── Gift Selected
    │   ├── DescriptionField
    │   ├── GiftVoucherFields (quantity, unitRetailPrice)
    │   └── CommonFields
    │
    ├── Voucher/Coupon Selected
    │   ├── DescriptionField
    │   ├── GiftVoucherFields (quantity, unitRetailPrice)
    │   ├── VoucherExtraFields (startDate, durationMonths) → Mobile Game only
    │   └── CommonFields
    │
    └── Mix Selected
        └── MixRewardSection (contains all fields for each selected type)
```

---

## ⚡ Special Cases

### Mobile Game Weekly Leaderboard

When `sponsorItemName === "Mobile Game Weekly Leaderboard"`:

| Field                            | Default              | Minimum              |
| -------------------------------- | -------------------- | -------------------- |
| `playersCount` (Cash)            | 1                    | 1                    |
| `quantity` (Gift/Voucher)        | 1                    | 1                    |
| `unitRetailPrice` (Gift/Voucher) | declaredRewardAmount | declaredRewardAmount |

This logic is implemented in `ItemsLinkedFields/index.tsx` with a `useEffect` that sets defaults when reward type changes.

---

## 📊 Type Definitions

**Location**: `src/interfaces/prizeAgreement/prizeAgreement.types.ts`

```typescript
// Reward type options for Mix
type MixTypeKey = 'cash' | 'gift' | 'voucher-coupon';

// Main form data structure
interface PrizeAgreementFormDataTypes {
    episode: string;
    square: string;
    rewardType: string; // 'cash' | 'gift' | 'voucher-coupon' | 'mix'
    description: string;
    quantity: number;
    unitRetailPrice: number;
    playersCount: number;
    startDate: string;
    durationMonths: number;
    unclaimedPrizesHandling: string; // 'carry-forward' | 'donate' | 'distribute'
    disbursementOwnership: string; // 'chances' | 'sponsor'
    collectionInstructions: string;
    totalAmount: number;
    selectedMixTypes?: MixTypeKey[];
    mixTypesData?: Record<MixTypeKey, MixTypeData>;
}

// Mix type data (for each type in mix)
interface MixTypeData {
    description: string;
    quantity: number;
    unitRetailPrice: number;
    playersCount: number;
    cashAmount: number;
    unclaimedPrizesHandling: string;
    disbursementOwnership: string;
    collectionInstructions: string;
}
```

---

## 🔧 Configuration

**Location**: `config/constants.ts`

```typescript
// Fields used for progress calculation per reward type
export const PROGRESS_FIELDS = {
    cash: ['rewardType', 'description', 'playersCount', 'unclaimedPrizesHandling', 'disbursementOwnership', 'collectionInstructions'],
    gift: ['rewardType', 'description', 'quantity', 'unitRetailPrice', 'unclaimedPrizesHandling', 'disbursementOwnership', 'collectionInstructions'],
    'voucher-coupon': [
        'rewardType',
        'description',
        'quantity',
        'unitRetailPrice',
        'startDate',
        'durationMonths',
        'unclaimedPrizesHandling',
        'disbursementOwnership',
        'collectionInstructions',
    ],
    mix: ['rewardType', 'selectedMixTypes'],
};

// Default form values
export const DEFAULT_FORM_VALUES: PrizeAgreementFormDataTypes;

// Dropdown options
export const REWARD_TYPE_OPTIONS; // Cash, Gift, Voucher/Coupon, Mix
export const UNCLAIMED_PRIZES_OPTIONS; // Carry forward, Donate, Distribute
export const DISBURSEMENT_OPTIONS; // Chances Team, Sponsor
```

---

## 🚀 API Submission Flow

```
1. User fills form → Clicks "Save & Continue"
                           │
                           ▼
2. ItemsLinkedFields.handleSave() validates form
                           │
                           ▼
3. Calls onSave(formData) → PrizeAgreementCard.handleSaveItem()
                           │
                           ▼
4. useFormHandler saves to savedFormsData state
                           │
                           ▼
5. All items saved? → "Submit Prize Agreement" button enabled
                           │
                           ▼
6. User clicks submit → useFormHandler.handleSubmit()
                           │
                           ├─→ Transform camelCase → snake_case
                           ├─→ Expand mix types into individual items
                           └─→ Call createPrizeAgreement() API
                           │
                           ▼
7. On success → Invalidate queries → Refresh lists
```

---

## 🧪 Testing Checklist

### Cash Reward

- [ ] Enter players count (>= 1)
- [ ] Verify "Each player gets" amount calculated correctly
- [ ] Fill all common fields
- [ ] Save & Continue button enables when all fields filled

### Gift Reward

- [ ] Enter quantity (>= 1)
- [ ] Enter unit retail price (>= 1)
- [ ] Verify "Total Reward Value" calculated correctly
- [ ] Fill all common fields
- [ ] Save & Continue button enables when all fields filled

### Voucher/Coupon Reward

- [ ] All Gift fields apply
- [ ] For Mobile Game: Start date and duration months required
- [ ] For Studio Show: Start date and duration months NOT shown

### Mix Reward

- [ ] Select at least 2 types (validation message if < 2)
- [ ] Each selected type shows its own form section
- [ ] Fill all fields for each selected type
- [ ] Save & Continue button enables only when ALL selected types are complete

### Mobile Game Weekly Leaderboard

- [ ] Cash: Players count defaults to 1, minimum 1
- [ ] Gift/Voucher: Quantity defaults to 1, minimum 1
- [ ] Gift/Voucher: Unit price defaults to declared reward amount

### Form Submission

- [ ] Progress indicator updates as fields are filled
- [ ] Save button disabled until all required fields filled
- [ ] Submit button disabled until all items saved
- [ ] After submit, lists refresh automatically

---

## 📝 Common Issues & Solutions

| Issue                          | Cause                                      | Solution                                                                      |
| ------------------------------ | ------------------------------------------ | ----------------------------------------------------------------------------- |
| "Maximum depth exceeded" error | Moving progress calculation to custom hook | Keep progress calculation in `ItemsLinkedFields` component (see code comment) |
| Save button always disabled    | Missing required field                     | Check `useFormValidation` - log `canSubmit` and individual validation states  |
| Mix type not saving correctly  | Not all selected types have data           | Ensure all selected mix types have all fields filled                          |
| Infinite loop on form update   | useEffect dependencies                     | Check eslint-disable comments - some dependencies are intentionally omitted   |
| Input field won't clear        | Immediate min value enforcement            | Min values enforced on blur, not on change (allows clearing)                  |

---

## 🔍 Debugging Tips

### Check Form Validation State

```typescript
// In ItemsLinkedFields, log validation results:
console.log({
    canSubmit,
    areCommonFieldsValid,
    areCashFieldsValid,
    areGiftVoucherFieldsValid,
    areVoucherExtraFieldsValid,
    areMixTypeDataFieldsValid,
});
```

### Check Saved Form Data

```typescript
// In PrizeAgreementCard, log saved data:
console.log('savedFormsData:', savedFormsData);
```

### Check API Payload

```typescript
// In useFormHandler.handleSubmit(), payload is logged before submission
console.log(payload);
```

---

## 👥 Contributing

When adding new features to this module:

1. **New Reward Type**:
    - Add to `REWARD_TYPE_OPTIONS` in constants
    - Add fields to `PROGRESS_FIELDS`
    - Update `useFormValidation` with new validation rules
    - Create new field component if needed
    - Update `ItemsLinkedFields` conditional rendering

2. **New Field**:
    - Add to `PrizeAgreementFormDataTypes` interface
    - Add to `DEFAULT_FORM_VALUES`
    - Add to relevant `PROGRESS_FIELDS` arrays
    - Update validation in `useFormValidation`
    - Create/update field component

3. **Special Item Handling**:
    - Add constant for item name (like `MOBILE_GAME_WEEKLY_LEADERBOARD`)
    - Add useEffect in `ItemsLinkedFields` for defaults
    - Pass flag to `useFormValidation` for validation rules
    - Pass min values to field components
