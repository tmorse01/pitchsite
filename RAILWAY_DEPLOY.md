# Railway Deployment Step-by-Step Guide

## 🚀 Quick Setup

### Step 1: Deploy Backend Service

1. **Login to Railway**

   ```powershell
   npm install -g @railway/cli
   railway login
   ```

2. **Create Backend Service**

   ```powershell
   railway new
   # Choose "Deploy from GitHub repo"
   # Select your repository
   # Name: "pitchsite-backend"
   ```

3. **Configure Backend**
   - In Railway Dashboard → Project → pitchsite-backend
   - Go to **Settings** tab:
     - **Root Directory**: `server`
     - **Build Command**: `npm ci && npm run build`
     - **Start Command**: `npm start`
4. **Set Backend Environment Variables**

   - Go to **Variables** tab
   - Add these variables:
     ```
     NODE_ENV=production
     OPENAI_API_KEY=your_actual_openai_api_key_here
     ```
   - Note: ALLOWED_ORIGINS will be set after frontend is deployed

5. **Deploy**
   - Railway will automatically deploy
   - Copy the generated URL (e.g., `https://pitchsite-backend-production-xyz.railway.app`)

### Step 2: Deploy Frontend Service

1. **Create Frontend Service**

   ```powershell
   railway new
   # Choose "Deploy from GitHub repo"
   # Select the SAME repository
   # Name: "pitchsite-frontend"
   ```

2. **Configure Frontend**

   - In Railway Dashboard → Project → pitchsite-frontend
   - Go to **Settings** tab:
     - **Root Directory**: `client`
     - **Build Command**: `npm ci && npm run build`
     - **Start Command**: `npx serve -s dist -l $PORT`

3. **Set Frontend Environment Variables**

   - Go to **Variables** tab
   - Add this variable:
     ```
     VITE_API_URL=https://your-backend-url-from-step1.railway.app
     ```

4. **Deploy**
   - Railway will build and deploy your frontend
   - Copy the generated URL (e.g., `https://pitchsite-frontend-production-abc.railway.app`)

### Step 3: Update Backend CORS

1. **Add Frontend URL to Backend**

   - Go back to pitchsite-backend service
   - Go to **Variables** tab
   - Add/Update:
     ```
     ALLOWED_ORIGINS=https://your-frontend-url-from-step2.railway.app
     ```

2. **Redeploy Backend**
   - Railway will automatically redeploy with new CORS settings

### Step 4: Test Your Deployment

Visit your frontend URL and test the application!

## 🔧 Alternative: Using Railway CLI

```powershell
# Backend deployment
cd server
railway link  # Link to backend service
railway variables set NODE_ENV=production
railway variables set OPENAI_API_KEY=your_key_here
railway up

# Frontend deployment
cd ../client
railway link  # Link to frontend service
railway variables set VITE_API_URL=https://your-backend-url.railway.app
railway up
```

## 🚨 Common Issues

1. **CORS Errors**: Make sure ALLOWED_ORIGINS in backend includes your frontend URL
2. **Build Failures**: Check that Root Directory is set correctly for each service
3. **API Not Found**: Verify VITE_API_URL in frontend matches backend URL
4. **Environment Variables**: Remember VITE\_ prefix for frontend variables

## 📋 Quick Reference

| Service  | Root Directory | Environment Variables                           |
| -------- | -------------- | ----------------------------------------------- |
| Backend  | `server`       | `NODE_ENV`, `OPENAI_API_KEY`, `ALLOWED_ORIGINS` |
| Frontend | `client`       | `VITE_API_URL`                                  |

**Remember**: Railway auto-assigns PORT, so don't set it manually!
