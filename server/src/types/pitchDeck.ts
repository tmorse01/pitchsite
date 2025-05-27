import { ObjectId } from "mongodb";

export interface PitchDeck {
  _id?: ObjectId;
  shareId: string;
  createdAt: Date;
  expiresAt?: Date;
  isPublic: boolean;
  password?: string;

  // Form Data
  formData: {
    projectName: string;
    address: string;
    investmentType: string;
    purchasePrice: number;
    totalRaise: number;
    targetIrr: string;
    holdPeriod: string;
    description: string;
    sponsorBio: string;
    tone: string;
  };

  // AI Generated Content
  generatedContent: {
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
    dealMetrics?: {
      capRate: string;
      cashOnCashReturn: string;
      riskScore: number;
      marketVolatility: string;
      breakEvenAnalysis: string;
    };
  };

  // Metadata
  metadata: {
    viewCount: number;
    lastViewed?: Date;
    creatorIp?: string;
    userAgent?: string;
  };
}

export interface SavePitchDeckRequest {
  formData: PitchDeck["formData"];
  generatedContent: PitchDeck["generatedContent"];
  options?: {
    expiresIn?: number; // Days until expiration
    password?: string;
    isPublic?: boolean;
  };
}

export interface SavePitchDeckResponse {
  shareId: string;
  shareUrl: string;
  expiresAt?: Date;
}

export interface GetPitchDeckResponse {
  pitchDeck: Omit<PitchDeck, "password">;
  isPasswordProtected: boolean;
}

export interface IncrementViewResponse {
  viewCount: number;
}

export interface DeletePitchDeckResponse {
  success: boolean;
}
