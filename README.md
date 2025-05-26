# 🏠 PitchSite

AI-powered real estate pitch deck generator that helps investors create professional, data-driven presentations in minutes.

## ✨ Features

- **Step-by-step guided input** - User-friendly form with validation
- **AI-powered content generation** - Leverages OpenAI to create compelling pitch content
- **Professional pitch decks** - Beautiful, investment-grade presentations
- **Real-time preview** - See your pitch deck as you build it
- **Shareable links** - Generate public URLs for your pitch decks
- **Mobile responsive** - Works seamlessly on all devices

## 🛠 Tech Stack

### Frontend

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Mantine UI** for modern, accessible components
- **React Router** for client-side routing
- **Recharts** for data visualization

### Backend

- **Node.js** with Express and TypeScript
- **OpenAI API** for AI content generation
- **JWT** for authentication
- **CORS** for cross-origin requests

### Infrastructure

- **Railway** for deployment
- **Monorepo structure** with separate frontend/backend services

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm 10+
- OpenAI API key
- Git

### 1. Clone and Install

```powershell
git clone <your-repo-url>
cd pitchsite
npm run install:all
```

### 2. Environment Setup

Create environment files:

**Backend** (`server/.env`):

```env
NODE_ENV=development
OPENAI_API_KEY=sk-proj-your-openai-key-here
PORT=3001
ALLOWED_ORIGINS=http://localhost:5173
```

**Frontend** (`client/.env`):

```env
VITE_API_URL=http://localhost:3001
```

### 3. Start Development

```powershell
# Start both frontend and backend in development mode
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## 📁 Project Structure

```
pitchsite/
├── package.json              # Root package.json with workspaces
├── README.md                 # Project documentation
├── RAILWAY_DEPLOY.md         # Deployment guide
│
├── client/                   # React + Vite Frontend
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.ts       # Vite configuration
│   ├── tsconfig.json        # TypeScript config
│   ├── index.html           # HTML entry point
│   ├── public/              # Static assets
│   └── src/
│       ├── main.tsx         # React entry point
│       ├── App.tsx          # Main app component
│       ├── theme.ts         # Mantine theme configuration
│       ├── api/
│       │   └── client.ts    # API client configuration
│       ├── components/      # Reusable UI components
│       │   ├── Layout.tsx
│       │   ├── PasswordGate.tsx
│       │   ├── LocationMap.tsx
│       │   ├── MarketTrendsChart.tsx
│       │   ├── ComparableProperties.tsx
│       │   └── ROISimulator.tsx
│       ├── pages/           # Route-based page components
│       │   ├── HomePage.tsx
│       │   ├── CreatePage.tsx
│       │   ├── PreviewPage.tsx
│       │   └── SharePage.tsx
│       └── utils/
│           └── formatters.ts # Utility functions
│
└── server/                   # Express + TypeScript Backend
    ├── package.json         # Backend dependencies
    ├── tsconfig.json        # TypeScript config
    └── src/
        ├── index.ts         # Server entry point
        ├── middleware/
        │   └── auth.ts      # Authentication middleware
        └── routes/
            └── generate.ts  # AI content generation routes
```

## 🔌 API Reference

### Base URL

- **Development**: `http://localhost:3001`
- **Production**: Your Railway backend URL

### Endpoints

#### `GET /health`

Health check endpoint

```json
{ "status": "ok", "timestamp": "2024-01-01T00:00:00.000Z" }
```

#### `POST /api/generate`

Generate AI-powered pitch content

**Request Body:**

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

**Response:**

```json
{
  "executiveSummary": "A concise paragraph explaining the opportunity...",
  "investmentThesis": "A few sentences explaining why this deal makes sense...",
  "riskFactors": ["Interest rates", "Construction delays", "Exit timing"],
  "locationOverview": "A quick overview of the neighborhood or city...",
  "sponsorBio": "A short professional summary about the sponsor..."
}
```

## 🎯 User Flow

1. **Homepage** (`/`) - Landing page with call-to-action
2. **Create Form** (`/create`) - Step-by-step input form with Mantine Stepper
3. **Preview** (`/preview`) - Generated pitch deck preview
4. **Share** (`/share/:deckId`) - Public shareable pitch deck

## 🎨 Design System

Built with [Mantine UI](https://mantine.dev/) for:

- Consistent component styling
- Built-in dark/light mode
- Responsive design
- Accessibility compliance
- Form validation and state management

## 🔧 Development Scripts

### Root Level

```powershell
npm run dev              # Start both frontend and backend
npm run build            # Build both services for production
npm run install:all      # Install all dependencies
npm run dev:client       # Start only frontend
npm run dev:server       # Start only backend
npm run build:client     # Build only frontend
npm run build:server     # Build only backend
```

### Frontend (`client/`)

```powershell
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

### Backend (`server/`)

```powershell
npm run dev              # Start with hot reload (tsx)
npm run build            # Compile TypeScript
npm run start            # Start production server
npm run type-check       # Check TypeScript without building
```

## 🌐 Environment Variables

### Frontend Environment Variables

Must be prefixed with `VITE_` for Vite to include them in the build.

| Variable       | Description     | Development             | Production                         |
| -------------- | --------------- | ----------------------- | ---------------------------------- |
| `VITE_API_URL` | Backend API URL | `http://localhost:3001` | `https://your-backend.railway.app` |

### Backend Environment Variables

Server-side only, not exposed to the client.

| Variable          | Description                      | Required | Example                                        |
| ----------------- | -------------------------------- | -------- | ---------------------------------------------- |
| `NODE_ENV`        | Environment mode                 | No       | `development` or `production`                  |
| `OPENAI_API_KEY`  | OpenAI API key for AI generation | Yes      | `sk-proj-abc123...`                            |
| `PORT`            | Server port                      | No       | `3001` (auto-assigned in Railway)              |
| `ALLOWED_ORIGINS` | CORS allowed origins             | No       | `http://localhost:5173,https://yourdomain.com` |

### Important Notes:

- **Frontend variables are public** - embedded in the built JavaScript
- **Backend variables are private** - only accessible on the server
- **Railway auto-assigns PORT** - don't set it manually for Railway deployments

## 🚀 Deployment

This project is designed to deploy to [Railway](https://railway.app) as two separate services.

### Quick Deploy

1. Fork this repository
2. Connect Railway to your GitHub account
3. Create two services from the same repo:
   - **Backend**: Root directory `/server`
   - **Frontend**: Root directory `/client`
4. Set environment variables in Railway dashboard
5. Deploy!

For detailed deployment instructions, see [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md).

## 🧪 Testing

### Manual Testing Checklist

- [ ] Homepage loads correctly
- [ ] Create form validation works
- [ ] All form steps complete successfully
- [ ] AI content generation works
- [ ] Preview page displays correctly
- [ ] Share links work
- [ ] Mobile responsive design
- [ ] Dark/light mode toggle

### API Testing

```powershell
# Test health endpoint
curl http://localhost:3001/health

# Test generation endpoint
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -d '{"projectName":"Test Project","address":"123 Main St"}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines

- Use TypeScript for type safety
- Follow existing code formatting
- Add comments for complex logic
- Test on both desktop and mobile
- Ensure environment variables are properly configured

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Frontend can't connect to backend:**

- Check that `VITE_API_URL` is set correctly
- Ensure backend is running on the specified port
- Verify CORS settings in backend

**OpenAI API errors:**

- Verify `OPENAI_API_KEY` is set correctly
- Check API key has sufficient credits
- Ensure API key has required permissions

**Build failures:**

- Run `npm run install:all` to ensure all dependencies are installed
- Check Node.js version (requires 20+)
- Clear `node_modules` and reinstall if needed

**Railway deployment issues:**

- Verify environment variables are set in Railway dashboard
- Check build logs for specific error messages
- Ensure correct root directories are set for each service

### Getting Help

- Check the [issues](https://github.com/yourusername/pitchsite/issues) page
- Review Railway logs for deployment issues
- Verify environment variable configuration
