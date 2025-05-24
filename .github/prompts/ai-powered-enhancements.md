# 🧠 Co-pilot Prompt – AI-Powered Enhancements for PitchSite

You are upgrading the PitchSite app to feel like a smart real estate analyst assistant. Implement the following features to give the app an AI "wow factor" and data-driven value for investors.

## 🎯 Goals

Enhance the pitch preview experience by:

- Generating AI content based on form input
- Enriching the pitch deck with links, maps, comps, and graphs
- Simulating external data sources where necessary

---

## ✅ Feature 1: Zillow Listing Link

- Add a dynamic Zillow link using the form address
- Format: `https://www.zillow.com/homes/{encoded-address}`
- Display it under the Deal Overview or Location section

```ts
const zillowLink = `https://www.zillow.com/homes/${encodeURIComponent(
  address
)}`;
```

---

## ✅ Feature 2: Embedded Google Map

- Use the Google Static Maps API or an iframe to render a map for the property location
- Fallback to a Google Maps link if API key is not available

```tsx
<iframe
  width="100%"
  height="300"
  loading="lazy"
  allowFullScreen
  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(
    address
  )}`}
/>
```

---

## ✅ Feature 3: GPT-Enhanced Location Summary

- In the `/api/generate` Netlify Function, modify the GPT prompt to include:

```
"Write a professional overview of the area near {address}. Focus on real estate demand, population growth, and economic development."
```

- Add this section to the pitch preview under "Location Snapshot"

---

## ✅ Feature 4: Market Trend Graphs (Dummy Data)

- Use Recharts to show:
  - Median home prices (5-year trend)
  - Rent growth percentage
  - Local cap rate trend

```tsx
<LineChart data={priceTrends}>
  <XAxis dataKey="year" />
  <YAxis />
  <Line dataKey="medianPrice" stroke="#6366f1" />
</LineChart>
```

Use hardcoded JSON for now:

```ts
const priceTrends = [
  { year: "2019", medianPrice: 300000 },
  { year: "2020", medianPrice: 325000 },
  { year: "2021", medianPrice: 350000 },
  { year: "2022", medianPrice: 390000 },
  { year: "2023", medianPrice: 420000 },
];
```

---

## ✅ Feature 5: Comparable Properties (Simulated)

- In the GPT prompt, ask:

```
List 3 comparable properties to {projectName} in {city}, with sale price, distance, and a note on comparability.
```

- Return as:

```json
[
  {
    "address": "567 Maple Ave",
    "price": "$410,000",
    "distance": "0.4 miles",
    "note": "Similar lot size and finish"
  }
]
```

- Render as a small card list with optional Zillow links

---

## ✅ Feature 6: ROI Simulator (Optional for MVP)

- Add a section with sliders:
  - Exit Cap Rate
  - Monthly Rent
  - Hold Period
- Show resulting IRR or equity multiple
- Use simplified ROI formula (no cash flows for now)

---

## ✅ Feature 7: AI Tone Selector

- Let user choose tone of generated content:
  - "Professional", "Persuasive", "Data-Driven"
- Pass `tone` into GPT prompt and use it to customize style:

```
Write an executive summary in a {tone} tone for this real estate investment.
```

---

## ⚙️ Notes

- Use Mantine UI components
- All AI logic lives in the Netlify Function `/api/generate`
- All maps, comps, and graphs are optional add-ons and should gracefully degrade if data is missing
