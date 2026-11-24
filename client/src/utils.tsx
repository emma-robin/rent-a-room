// Cleans up the labels


// Contract type labels
const CONTRACTLABELS: Record<string, string> = {
  fixed_term_six_months: 'Fixed 6 months',
  fixed_term_twelve_months: 'Fixed 12 months',
  rolling_monthly: 'Rolling monthly',
  short_let: 'Short let',
};

export const contractLabel = (value: string): string =>
  CONTRACTLABELS[value];

// Listing type labels
const LISTINGTYPELABELS: Record<string, string> = {
  propertyholder_property: 'Whole property',
  household_room: 'Room in shared home',
};

export const listingTypeLabel = (value: string): string =>
  LISTINGTYPELABELS[value];

// Tag labels
const TAGLABELS: Record<string, string> = {
   "en-suite": 'En-suite',
   "parking-available": 'Parking Available',
    "outdoor-space": 'Outdoor space',
    "quiet": 'Quiet',
     "non-smoker": 'Non-smoker',
     "enjoys-parties": 'Enjoys parties',
     "highly-social": 'Highly social',
      "tidy": 'Tidy',
      'has-pets':'Pet owner'
};

export const tagLabels = (value: string): string =>
  TAGLABELS[value];

// Looking-for labels
const LOOKING_FOR_LABELS: Record<string, string> = {
  room: 'Looking for a room',
  person: 'Looking for a new tenant',
};

export const lookingForLabel = (value: string): string =>
  LOOKING_FOR_LABELS[value];

// Shift pattern labels
const SHIFTPATTERNLABELS: Record<string, string> = {
  'standard_shift': 'Standard 9–5',
  'nightshift_only': 'Night shift only',
  'rotating_shifts': 'Rotating shifts',
  'early_shift': 'Early shift',
  'late_shift': 'Late shift',
  'flexible': 'Flexible',
};

export const shiftPatternLabel = (value: string): string =>
  SHIFTPATTERNLABELS[value];


