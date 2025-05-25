# PitchSite - Railway Deployment Guide

AI-powered real estate pitch deck generator with React frontend and Express backend.

## 🚀 Deploy to Railway

### Backend Deployment

1. **Create a new Railway project**

   ```bash
   railway login
   railway new
   ```

2. **Connect your repository**

   - Connect to your GitHub repository
   - Railway will auto-detect the monorepo structure

3. **Configure Environment Variables**
   Set these variables in your Railway project dashboard:

   ```
   NODE_ENV=production
   OPENAI_API_KEY=your_openai_api_key_here
   ALLOWED_ORIGINS=https://your-frontend-domain.railway.app
   ```

4. **Deploy Backend Service**
   - Railway will automatically build and deploy your server
   - Note the generated URL (e.g., `https://your-app-name.railway.app`)

### Frontend Deployment

1. **Update Client Environment**

   ```bash
   # Update client/.env.production.local
   VITE_API_URL=https://your-backend-railway-url.railway.app
   ```

2. **Deploy Frontend as Static Site**
   - Create a second Railway service for the frontend
   - Use Nixpacks to build and serve static files
   - Or deploy to Netlify/Vercel pointing to your Railway backend

## 🔧 Local Development

```bash
# Install all dependencies
npm run install:all

# Start both services in development mode
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
pitchsite/
├── client/          # React + Vite frontend
├── server/          # Express + TypeScript backend
├── package.json     # Root package.json with workspaces
├── railway.json     # Railway configuration
├── nixpacks.toml    # Build configuration
└── README.md        # This file
```

## 🌐 Environment Variables

### Backend (.env)

- `OPENAI_API_KEY` - Your OpenAI API key
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3001)
- `ALLOWED_ORIGINS` - CORS allowed origins

### Frontend (.env)

- `VITE_API_URL` - Backend API URL

## 🔗 API Endpoints

- `GET /health` - Health check
- `POST /api/generate` - Generate pitch content
- `GET /api/test` - Test endpoint

## 📋 Prerequisites

- Node.js 18+
- NPM 9+
- OpenAI API key
- Railway account
