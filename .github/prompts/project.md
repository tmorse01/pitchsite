# 🧠 Co-pilot Prompt – PitchSite

Create a React + Vite project called **"PitchSite"** that helps real estate investors generate AI-powered pitch deck websites.

## 🛠 Tech Stack

- **React + Vite** (TypeScript)
- **Mantine UI** for component styling
- **React Router** for client-side routing
- **Node.js + Express** for backend API
- **Railway** for deployment
- **No SSR** — purely client-rendered app with separate backend

---

## ✅ Requirements

### 1. Homepage

- Clean header with title and call-to-action: "Create Your Pitch Deck"
- Button links to `/create`

### 2. Step-by-Step Input Form (`/create`)

Use `@mantine/form` and `Stepper` to guide users through the following fields:

- Project Name
- Address
- Investment Type (e.g., multifamily, flip)
- Purchase Price
- Total Raise
- Target IRR
- Hold Period
- Description (optional)
- Sponsor Bio
- Image upload (simulate with local state only)

### 3. Backend Logic (`/api/generate`)

Create an Express API server that:

- Accepts form data via `POST` to `/api/generate`
- Returns a JSON object with:
  - Executive Summary
  - Investment Thesis
  - Risk Factors
  - Location Overview
  - Sponsor Bio

### 4. Preview Page (`/preview`)

- Render a one-page pitch deck
- Include:
  - Hero section
  - Deal metrics
  - AI-generated sections
  - Sponsor info
  - Contact footer

### 5. Share Page (`/share/:deckId`)

- Simulate short public URL using React Router
- Use local state or static mapping (no DB)
- Display previous pitch content

### 6. File Structure

```
/src
  /api
    client.ts
  /components
  /pages
  App.tsx
  main.tsx
/server
  index.js
  package.json
  routes/
    generate.js
```

### 7. Deployment

- Deploy to **Railway**
- Frontend and backend as separate services
- Frontend: Static React build
- Backend: Node.js Express server
- Environment variables for API URL configuration
- Use Railway's automatic deployment from Git

---

## 📄 API Response Format (`/api/generate`)

Return the following structure from your Express API endpoint:

```json
{
  "executiveSummary": "A concise paragraph explaining the opportunity...",
  "investmentThesis": "A few sentences explaining why this deal makes sense...",
  "riskFactors": ["Interest rates", "Construction delays", "Exit timing"],
  "locationOverview": "A quick overview of the neighborhood or city...",
  "sponsorBio": "A short professional summary about the sponsor..."
}
```

### Example Input:

```json
{
  "projectName": "Sunset Villas",
  "address": "1234 Hilltop Dr, Austin, TX",
  "investmentType": "Multifamily Development",
  "purchasePrice": 4200000,
  "equityRaise": 1200000,
  "targetIrr": "18%",
  "holdPeriod": "5 years",
  "description": "24 luxury units in a high-demand submarket.",
  "sponsorBio": "Taylor Morse has over $50M in completed projects."
}
```
