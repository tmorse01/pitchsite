# PitchSite - Railway Deployment Guide

AI-powered real estate pitch deck generator with React frontend and Express backend.

## 🚀 Deploy to Railway

Railway allows you to deploy both frontend and backend as separate services with different environment variable configurations.

### Method 1: Two Separate Services (Recommended)

#### Backend Service

1. **Create Backend Service**
   ```powershell
   railway login
   railway new
   # Select "Create from GitHub repo" and choose your repository
   # Name it something like "pitchsite-backend"
   ```

2. **Configure Backend Environment Variables**
   In Railway Dashboard → Your Backend Service → Variables tab:
   ```
   NODE_ENV=production
   OPENAI_API_KEY=sk-proj-your-actual-openai-key-here
   PORT=3001
   ALLOWED_ORIGINS=https://pitchsite-frontend.railway.app
   ```

3. **Set Backend Build Configuration**
   Railway will detect the monorepo. In Settings → Build:
   - **Root Directory**: `/server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

#### Frontend Service

1. **Create Frontend Service**
   ```powershell
   railway new
   # Create another service from the same repo
   # Name it "pitchsite-frontend"
   ```

2. **Configure Frontend Environment Variables**
   In Railway Dashboard → Your Frontend Service → Variables tab:
   ```
   VITE_API_URL=https://pitchsite-backend.railway.app
   NODE_ENV=production
   ```

3. **Set Frontend Build Configuration**
   In Settings → Build:
   - **Root Directory**: `/client`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve -s dist -l 3000`

### Method 2: Using Railway CLI for Environment Variables

#### Set Backend Variables via CLI
```powershell
# Connect to your backend service
railway link

# Set environment variables
railway variables set NODE_ENV=production
railway variables set OPENAI_API_KEY=sk-proj-your-key-here
railway variables set ALLOWED_ORIGINS=https://your-frontend-url.railway.app

# Deploy
railway up
```

#### Set Frontend Variables via CLI
```powershell
# Switch to frontend service
railway link
# (Select your frontend service)

# Set frontend environment variables
railway variables set VITE_API_URL=https://your-backend-url.railway.app
railway variables set NODE_ENV=production

# Deploy
railway up
```

### Method 3: Environment Variables in Code

#### Backend - Using .env File Pattern
Railway automatically loads environment variables, but you can also use:

```javascript
// In your server code
const config = {
  port: process.env.PORT || 3001,
  openaiKey: process.env.OPENAI_API_KEY,
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173']
};
```

#### Frontend - Build-Time Variables
For Vite (frontend), environment variables must be prefixed with `VITE_`:

```javascript
// In your client code
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

### 🔧 Railway Dashboard Configuration

1. **Access Variables**:
   - Go to Railway Dashboard
   - Select your project
   - Choose the specific service (frontend or backend)
   - Click "Variables" tab

2. **Add Variables**:
   - Click "New Variable"
   - Enter variable name and value
   - Click "Add"

3. **Variable Visibility**:
   - Backend variables are server-side only
   - Frontend variables (VITE_*) are embedded in the build and publicly visible

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

## 🌐 Environment Variables Reference

### Backend Environment Variables
Set these in Railway Dashboard → Backend Service → Variables:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `NODE_ENV` | Environment mode | `production` |
| `OPENAI_API_KEY` | OpenAI API key for AI content generation | `sk-proj-abc123...` |
| `PORT` | Server port (Railway auto-assigns) | `3001` |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `https://mydomain.railway.app,https://custom-domain.com` |

### Frontend Environment Variables
Set these in Railway Dashboard → Frontend Service → Variables:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `VITE_API_URL` | Backend API URL | `https://pitchsite-backend.railway.app` |
| `NODE_ENV` | Environment mode | `production` |

### Important Notes:

- **Frontend variables must be prefixed with `VITE_`** for Vite to include them in the build
- **Frontend variables are public** - they're embedded in the built JavaScript
- **Backend variables are private** - only accessible on the server
- **Railway auto-assigns PORT** - don't set it manually for Railway deployments
- **Use Railway's generated URLs** - they look like `https://service-name-production-abc123.railway.app`

## 🔗 API Endpoints

- `GET /health` - Health check
- `POST /api/generate` - Generate pitch content
- `GET /api/test` - Test endpoint

## 📋 Prerequisites

- Node.js 18+
- NPM 9+
- OpenAI API key
- Railway account
