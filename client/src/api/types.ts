export interface FormData {
  projectName: string;
  address: string;
  investmentType: string;
  purchasePrice: number;
  totalRaise: number;
  targetIrr: string;
  holdPeriod: string;
  description: string;
  sponsorBio: string;
  image: File | null;
  tone: string;
}

export interface GeneratedContent {
  executiveSummary: string;
  investmentThesis: string;
  riskFactors: string[];
  locationOverview: string;
  locationSnapshot: string;
  sponsorBio: string;
  comparableProperties: Array<{
    address: string;
    price: string;
    distance: string;
    note: string;
  }>;
  marketTrends: {
    priceTrends: Array<{
      year: string;
      medianPrice: number;
      rentGrowth: number;
      capRate: number;
    }>;
    summary: string;
  };
}

export interface PitchData {
  formData: FormData;
  generatedContent: GeneratedContent;
}

export interface SavePitchDeckOptions {
  expiresIn?: number; // Days until expiration
  password?: string;
  isPublic?: boolean;
}

export interface SavePitchDeckResponse {
  shareId: string;
  shareUrl: string;
  expiresAt?: string;
}

export interface GetPitchDeckResponse {
  pitchDeck: {
    _id?: string;
    shareId: string;
    createdAt: string;
    expiresAt?: string;
    isPublic: boolean;
    formData: FormData;
    generatedContent: GeneratedContent;
    metadata: {
      viewCount: number;
      lastViewed?: string;
    };
  };
  isPasswordProtected: boolean;
}

export interface IncrementViewResponse {
  viewCount: number;
}

export interface TestApiResponse {
  message: string;
  method: string;
  timestamp: string;
}
