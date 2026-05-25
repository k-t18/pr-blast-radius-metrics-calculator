import type { DropdownOption } from '../../../../components/common/Dropdown';
import type { MultiSelectOption } from '../../../../components/form-fields/multiSelect';
import type { RadioButtonOption } from '../../../../components/common/RadioButton';

export interface FilterOption {
    id: string;
    label: string;
    children?: FilterOption[];
    isSubSection?: boolean;
    inputType?: 'checkbox' | 'dropdown' | 'multiselect' | 'radio';
    dropdownOptions?: DropdownOption[];
    multiselectOptions?: MultiSelectOption[];
    radioOptions?: RadioButtonOption[];
}

export interface FilterSection {
    id: string;
    title: string;
    subtitle: string;
    options: FilterOption[];
}

// Nigeria location data
export const nigeriaRegions: FilterOption[] = [
    { id: 'region-all', label: 'All Regions' },
    { id: 'region-nc', label: 'North Central' },
    { id: 'region-ne', label: 'North East' },
    { id: 'region-nw', label: 'North West' },
    { id: 'region-se', label: 'South East' },
    { id: 'region-ss', label: 'South South' },
    { id: 'region-sw', label: 'South West' },
];

export const nigeriaStates: FilterOption[] = [
    { id: 'state-all', label: 'All States' },
    { id: 'state-abuja', label: 'Abuja (FCT)' },
    { id: 'state-enugu', label: 'Enugu' },
    { id: 'state-lagos', label: 'Lagos' },
    { id: 'state-delta', label: 'Delta' },
    { id: 'state-rivers', label: 'Rivers' },
    { id: 'state-kano', label: 'Kano' },
    { id: 'state-oyo', label: 'Oyo' },
    { id: 'state-kaduna', label: 'Kaduna' },
    { id: 'state-kano-2', label: 'Kano' },
    { id: 'state-oyo-2', label: 'Oyo' },
    { id: 'state-kaduna-2', label: 'Kaduna' },
    { id: 'state-rivers-2', label: 'Rivers' },
];

export const cityOptions: MultiSelectOption[] = [
    { label: 'Lagos Island', value: 'lagos-island' },
    { label: 'Abuja Metro', value: 'abuja-metro' },
    { label: 'Port Harcourt', value: 'port-harcourt' },
    { label: 'Victoria Island', value: 'victoria-island' },
    { label: 'Ikeja', value: 'ikeja' },
    { label: 'Surulere', value: 'surulere' },
    { label: 'Garki', value: 'garki' },
    { label: 'Wuse', value: 'wuse' },
    { label: 'Maitama', value: 'maitama' },
    { label: 'Asokoro', value: 'asokoro' },
];

// Filter sections data
export const getFilterSections = (): FilterSection[] => [
    {
        id: 'location',
        title: 'Where are they located?',
        subtitle: '(Country, state, region etc)',
        options: [
            {
                id: 'country-field',
                label: 'Country',
                inputType: 'dropdown',
                dropdownOptions: [
                    { label: 'Nigeria', value: 'nigeria' },
                    { label: 'United States', value: 'united-states' },
                    { label: 'United Kingdom', value: 'united-kingdom' },
                    { label: 'Canada', value: 'canada' },
                    { label: 'Ghana', value: 'ghana' },
                    { label: 'South Africa', value: 'south-africa' },
                ],
            },
            {
                id: 'region-zone',
                label: 'Region / Zone',
                isSubSection: true,
                children: nigeriaRegions,
            },
            {
                id: 'states',
                label: 'States',
                isSubSection: true,
                children: nigeriaStates,
            },
            {
                id: 'city-local',
                label: 'City / Local Area',
                inputType: 'multiselect',
                multiselectOptions: cityOptions,
            },
        ],
    },
    {
        id: 'demographics',
        title: 'Who are they?',
        subtitle: '(Detailed Demographics)',
        options: [
            {
                id: 'demo-age',
                label: 'Age',
                isSubSection: true,
                children: [
                    { id: 'demo-age-13-17', label: '13-17' },
                    { id: 'demo-age-18-24', label: '18-24' },
                    { id: 'demo-age-25-34', label: '25-34' },
                    { id: 'demo-age-45-54', label: '45-54' },
                    { id: 'demo-age-55-64', label: '55-64' },
                    { id: 'demo-age-65-plus', label: '65+' },
                    { id: 'demo-age-all', label: 'All age groups' },
                ],
            },
            {
                id: 'demo-gender',
                label: 'Gender',
                isSubSection: true,
                children: [
                    { id: 'demo-gender-all', label: 'All genders' },
                    { id: 'demo-gender-male', label: 'Male' },
                    { id: 'demo-gender-female', label: 'Female' },
                    { id: 'demo-gender-non-binary', label: 'Non-binary' },
                ],
            },
            {
                id: 'demo-marital',
                label: 'Marital Status',
                isSubSection: true,
                children: [
                    { id: 'demo-marital-single', label: 'Single' },
                    { id: 'demo-marital-relationship', label: 'In a relationship' },
                    { id: 'demo-marital-married', label: 'Married' },
                ],
            },
            {
                id: 'demo-parental',
                label: 'Parental Status',
                isSubSection: true,
                children: [
                    { id: 'demo-parental-infants', label: 'Parents of Infants (0-1 years)' },
                    { id: 'demo-parental-toddlers', label: 'Parents of Toddlers (1-3 years)' },
                    { id: 'demo-parental-preschoolers', label: 'Parents of Preschoolers (4-5 years)' },
                    { id: 'demo-parental-grade-school', label: 'Parents of Grade-Schoolers (6-12 years)' },
                    { id: 'demo-parental-teens', label: 'Parents of Teens (13-17 years)' },
                    { id: 'demo-parental-young-adults', label: 'Parents of Young adults (18-24 years)' },
                    { id: 'demo-parental-not-parent', label: 'Not a parent' },
                ],
            },
            {
                id: 'demo-education',
                label: 'Education',
                isSubSection: true,
                children: [
                    {
                        id: 'demo-edu-current',
                        label: 'Current Education status',
                        isSubSection: true,
                        children: [
                            { id: 'demo-edu-current-enrolled', label: 'Currently Enrolled' },
                            { id: 'demo-edu-current-not-student', label: 'Not a student' },
                        ],
                    },
                    {
                        id: 'demo-edu-level',
                        label: 'Recent most Education Level',
                        isSubSection: true,
                        children: [
                            { id: 'demo-edu-level-high-school', label: 'High School' },
                            { id: 'demo-edu-level-undergraduate', label: 'Undergraduate' },
                            { id: 'demo-edu-level-postgraduate', label: 'Postgraduate' },
                            { id: 'demo-edu-level-doctorate', label: 'Doctorate' },
                            { id: 'demo-edu-level-vocational', label: 'Vocational' },
                        ],
                    },
                ],
            },
            {
                id: 'demo-field-study',
                label: 'Field of Study',
                isSubSection: true,
                children: [
                    { id: 'demo-field-stem', label: 'STEM' },
                    { id: 'demo-field-business', label: 'Business / Finance' },
                    { id: 'demo-field-arts', label: 'Arts / Humanities' },
                    { id: 'demo-field-health', label: 'Health Sciences' },
                    { id: 'demo-field-law', label: 'Law / Social Sciences' },
                    { id: 'demo-field-creative', label: 'Creative / Media' },
                ],
            },
            {
                id: 'demo-homeownership',
                label: 'Homeownership Status',
                isSubSection: true,
                children: [
                    { id: 'demo-homeowner', label: 'Homeowner' },
                    { id: 'demo-renter', label: 'Renter' },
                ],
            },
        ],
    },
    {
        id: 'interests',
        title: 'What are their interests?',
        subtitle: '(Likings & Interests)',
        options: [
            {
                id: 'interest-banking',
                label: 'Banking & Finance',
                children: [
                    { id: 'interest-banking-investors', label: 'Avid Investors' },
                    { id: 'interest-banking-crypto', label: 'Crypto' },
                    { id: 'interest-banking-mutual-funds', label: 'Mutual Funds' },
                ],
            },
            {
                id: 'interest-beauty',
                label: 'Beauty & Wellness',
                children: [
                    { id: 'interest-beauty-wellness-sub', label: 'Beauty & Wellness' },
                    { id: 'interest-beauty-salons', label: 'Frequently Visits Salons' },
                ],
            },
            {
                id: 'interest-food',
                label: 'Food & Dining',
                children: [
                    { id: 'interest-food-coffee', label: 'Coffee Shop Regulars' },
                    {
                        id: 'interest-food-cooking',
                        label: 'Cooking Enthusiasts',
                        children: [
                            { id: 'interest-food-cooking-aspiring', label: 'Aspiring Chefs' },
                            { id: 'interest-food-cooking-amateur', label: 'Amateur Chefs' },
                        ],
                    },
                    { id: 'interest-food-fast-food', label: 'Fast Food Cravers' },
                    { id: 'interest-food-foodies', label: 'Foodies' },
                    { id: 'interest-food-dines-out', label: 'Frequently Dines Out' },
                ],
            },
            {
                id: 'interest-home',
                label: 'Home & Garden',
                children: [
                    { id: 'interest-home-diy', label: 'Do-It-Yourselfers' },
                    { id: 'interest-home-decor', label: 'Home Decor Enthusiasts' },
                ],
            },
            {
                id: 'interest-lifestyle',
                label: 'Lifestyles & Hobbies',
                children: [
                    { id: 'interest-lifestyle-art', label: 'Art & Theater Aficionados' },
                    { id: 'interest-lifestyle-business', label: 'Business Professionals' },
                    { id: 'interest-lifestyle-family', label: 'Family-Focused' },
                    { id: 'interest-lifestyle-fashion', label: 'Fashionistas' },
                    { id: 'interest-lifestyle-live-events', label: 'Frequently Attends Live Events' },
                    { id: 'interest-lifestyle-green', label: 'Green Living Enthusiasts' },
                    { id: 'interest-lifestyle-nightlife', label: 'Nightlife Enthusiasts' },
                    { id: 'interest-lifestyle-outdoor', label: 'Outdoor Enthusiasts' },
                    { id: 'interest-lifestyle-pets', label: 'Pet Lovers' },
                    { id: 'interest-lifestyle-photography', label: 'Shutterbugs' },
                    { id: 'interest-lifestyle-thrill', label: 'Thrill Seekers' },
                ],
            },
            {
                id: 'interest-media',
                label: 'Media & Entertainment',
                children: [
                    { id: 'interest-media-books', label: 'Book Lovers' },
                    { id: 'interest-media-comics', label: 'Comics & Animation Fans' },
                    { id: 'interest-media-gamers', label: 'Gamers' },
                    { id: 'interest-media-light-tv', label: 'Light TV Viewers' },
                    { id: 'interest-media-movies', label: 'Movie Lovers' },
                    { id: 'interest-media-music', label: 'Music Lovers' },
                    { id: 'interest-media-tv', label: 'TV Lovers' },
                ],
            },
            {
                id: 'interest-sports',
                label: 'Sports & Fitness',
                children: [
                    { id: 'interest-sports-fitness', label: 'Health & Fitness Buffs' },
                    {
                        id: 'interest-sports-fans',
                        label: 'Sports Fans',
                        children: [
                            { id: 'interest-sports-football', label: 'Football' },
                            { id: 'interest-sports-basketball', label: 'Basketball Fans' },
                            { id: 'interest-sports-athletics', label: 'Athletics' },
                            { id: 'interest-sports-boxing', label: 'Boxing' },
                            { id: 'interest-sports-table-tennis', label: 'Table Tennis' },
                            { id: 'interest-sports-volleyball', label: 'Volleyball' },
                            { id: 'interest-sports-wrestling', label: 'Wrestling' },
                            { id: 'interest-sports-esports', label: 'Esports / Mobile Gaming' },
                            { id: 'interest-sports-tennis', label: 'Tennis' },
                            { id: 'interest-sports-rugby', label: 'Rugby' },
                        ],
                    },
                ],
            },
            {
                id: 'interest-travel',
                label: 'Travelers',
                children: [
                    { id: 'interest-travel-business', label: 'Business Travelers' },
                    {
                        id: 'interest-travel-buffs',
                        label: 'Travel Buffs',
                        children: [
                            { id: 'interest-travel-beach', label: 'Beachbound Travelers' },
                            { id: 'interest-travel-family', label: 'Family Vacationers' },
                            { id: 'interest-travel-luxury', label: 'Luxury Travelers' },
                            { id: 'interest-travel-snow', label: 'Snowbound Travelers' },
                        ],
                    },
                ],
            },
            {
                id: 'interest-tech',
                label: 'Technology',
                children: [
                    { id: 'interest-tech-mobile', label: 'Mobile Enthusiasts' },
                    { id: 'interest-tech-social', label: 'Social Media Enthusiasts' },
                    {
                        id: 'interest-tech-technophiles',
                        label: 'Technophiles',
                        children: [
                            { id: 'interest-tech-audio', label: 'Audiophiles' },
                            { id: 'interest-tech-cloud', label: 'Cloud Services Power Users' },
                            { id: 'interest-tech-home-automation', label: 'Home Automation Enthusiasts' },
                        ],
                    },
                ],
            },
        ],
    },
];
