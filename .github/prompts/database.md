# 🔄 Feature Request: MongoDB Collection for Pitch Deck Sharing

Replace the current local storage implementation with a MongoDB collection to persist pitch deck data for sharing functionality.

## 📝 Current State Analysis

Currently, the application uses:

- `sessionStorage` in `CreatePage.tsx` to store form data and generated content temporarily
- `localStorage` in `PreviewPage.tsx` to store pitch deck data with a random share ID
- `localStorage` in `SharePage.tsx` to retrieve pitch deck data by share ID

## 🎯 Feature Requirements

### 1. Database Schema Design

Create a MongoDB collection `pitchDecks` with the following schema:

```typescript
interface PitchDeck {
  _id: ObjectId;
  shareId: string; // Unique 6-character identifier for public sharing
  createdAt: Date;
  expiresAt?: Date; // Optional expiration date for auto-cleanup
  isPublic: boolean; // Flag to control public access
  password?: string; // Optional password protection

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
    creatorIp?: string; // For basic tracking
    userAgent?: string;
  };
}
```

### 2. Backend API Endpoints

Add the following Express routes to `server/src/routes/`:

#### **`POST /api/pitch-decks`** - Save Pitch Deck

```typescript
// Save a new pitch deck and return shareId
{
  formData: FormData,
  generatedContent: GeneratedContent,
  options?: {
    expiresIn?: number,      // Days until expiration
    password?: string,       // Optional password protection
    isPublic?: boolean       // Default true
  }
}

// Response:
{
  shareId: string,
  shareUrl: string,
  expiresAt?: Date
}
```

#### **`GET /api/pitch-decks/:shareId`** - Retrieve Pitch Deck

```typescript
// Query params: ?password=xxx (if password protected)
// Response:
{
  pitchDeck: PitchDeck,
  isPasswordProtected: boolean
}
```

#### **`PATCH /api/pitch-decks/:shareId/view`** - Increment View Count

```typescript
// Updates view count and lastViewed timestamp
// Response: { viewCount: number }
```

#### **`DELETE /api/pitch-decks/:shareId`** - Delete Pitch Deck

```typescript
// Soft delete or actual deletion
// Response: { success: boolean }
```

### 3. Frontend Updates

#### **Client API Service (`client/src/api/*`)**

Add new functions:

```typescript
export const savePitchDeck = async (
  pitchData: PitchData,
  options?: SaveOptions
) => {
  // POST to /api/pitch-decks
};

export const getPitchDeck = async (shareId: string, password?: string) => {
  // GET from /api/pitch-decks/:shareId
};

export const incrementViewCount = async (shareId: string) => {
  // PATCH to /api/pitch-decks/:shareId/view
};
```

#### **Preview Page Updates (`client/src/pages/PreviewPage.tsx`)**

- Replace `localStorage.setItem()` in `handleShare()` with API call to `savePitchDeck()`
- Show loading state during save operation
- Display generated share URL and optional expiration info
- Add optional password protection toggle

#### **Share Page Updates (`client/src/pages/SharePage.tsx`)**

- Replace `localStorage.getItem()` with API call to `getPitchDeck()`
- Add password input component if deck is password protected
- Implement proper loading and error states
- Track view count increment on successful load

### 4. Database Configuration

#### **Dependencies**

Add to `server/package.json`:

```json
{
  "mongodb": "^6.3.0",
  "@types/mongodb": "^4.0.7"
}
```

#### **Environment Variables**

Add to Railway/environment:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pitchsite
DB_NAME=pitchsite
```

#### **Database Connection (`server/src/db/connection.ts`)**

```typescript
import { MongoClient, Db } from "mongodb";

let db: Db;

export const connectToDatabase = async (): Promise<Db> => {
  // Connection logic with error handling
};

export const getDatabase = (): Db => {
  // Return existing connection
};
```

### 5. Additional Features

#### **Expiration & Cleanup**

- Implement automatic cleanup of expired pitch decks
- Add cron job or scheduled function to remove old entries
- Default expiration: 30 days from creation

#### **Password Protection**

- Optional password field in save request
- Hash passwords using bcrypt
- Verify password on retrieval

#### **Analytics Dashboard** (Future Enhancement)

- View counts per deck
- Popular investment types
- Geographic distribution of projects

### 6. Migration Strategy

1. **Phase 1**: Implement MongoDB backend without breaking existing local storage
2. **Phase 2**: Update frontend to use MongoDB API while maintaining local storage fallback
3. **Phase 3**: Remove local storage code entirely
4. **Phase 4**: Add advanced features (password protection, analytics)

### 7. Error Handling & Validation

- Validate shareId format (6-character alphanumeric)
- Handle database connection failures gracefully
- Implement proper error responses for missing/expired decks
- Rate limiting for deck creation to prevent abuse

### 8. Security Considerations

- Sanitize all input data before database storage
- Implement CORS properly for production
- Add request rate limiting
- Consider IP-based access controls
- Secure password hashing for protected decks

## 🚀 Implementation Priority

1. **High Priority**: Core CRUD operations for pitch decks
2. **Medium Priority**: Password protection and expiration
3. **Low Priority**: Analytics and advanced features

This implementation will provide a robust, scalable solution for sharing pitch decks while maintaining data persistence and enabling future enhancements like user accounts and advanced sharing features.

## 📋 Implementation Checklist

### Backend Tasks

- [ ] Install MongoDB dependencies (`mongodb`, `@types/mongodb`)
- [ ] Create database connection module (`server/src/db/connection.ts`)
- [ ] Create PitchDeck interface/types (`server/src/types/pitchDeck.ts`)
- [ ] Implement CRUD routes for pitch decks (`server/src/routes/pitchDecks.ts`)
- [ ] Add environment variables for MongoDB connection
- [ ] Implement password hashing with bcrypt
- [ ] Add request validation and error handling
- [ ] Set up automatic expiration cleanup job

### Frontend Tasks

- [ ] Update API client with new pitch deck endpoints
- [ ] Modify PreviewPage to save to MongoDB instead of localStorage
- [ ] Update SharePage to fetch from MongoDB instead of localStorage
- [ ] Add password protection UI components
- [ ] Implement proper loading and error states
- [ ] Add share link copying functionality
- [ ] Remove localStorage dependency for sharing

### Database Tasks

- [ ] Set up MongoDB Atlas cluster (or Railway MongoDB addon)
- [ ] Configure database indexes for performance
- [ ] Create TTL index for automatic expiration
- [ ] Set up database monitoring and backup
- [ ] Configure connection pooling and error handling

### Deployment Tasks

- [ ] Add MongoDB environment variables to Railway
- [ ] Test database connectivity in production
- [ ] Monitor database performance and usage
- [ ] Set up database backup strategy
- [ ] Configure logging for database operations
