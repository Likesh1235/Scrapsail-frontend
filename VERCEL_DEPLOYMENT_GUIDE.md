# 🚀 ScrapSail Frontend - Vercel Deployment Guide

This guide will walk you through deploying your React frontend on Vercel step-by-step.

---

## 📋 Prerequisites

✅ React app is working locally  
✅ GitHub account  
✅ Vercel account (we'll create one)  

---

## 🧩 Step 1: Prepare Your Project

### 1.1 Test Locally

Open your React project folder in VS Code (you're already in `scrapsail-frontend-new`).

**Make sure it runs correctly:**
```bash
npm start
```

If it opens in browser (usually on `localhost:3000`), your app is ready! ✅

### 1.2 Build Production Version

Now build the production version:
```bash
npm run build
```

This creates a folder named `build` inside your project. ✅

---

## 📦 Step 2: Commit & Push to GitHub

### 2.1 Commit Your Changes

First, commit any pending changes:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
```

### 2.2 Create GitHub Repository

1. Go to https://github.com and log in or sign up
2. Click **"New Repository"** (or the `+` icon → "New repository")
3. Name it: `scrapsail-frontend` (or any name you prefer)
4. **Don't** add anything (no README, .gitignore, license)
5. Click **"Create repository"**

### 2.3 Push to GitHub

Now in your VS Code terminal (make sure you're in `scrapsail-frontend-new` folder):

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/scrapsail-frontend.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**If you get an error that remote already exists:**
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/scrapsail-frontend.git
git push -u origin main
```

✅ Now your React app is live on GitHub!

---

## 🚀 Step 3: Deploy on Vercel

### 3.1 Sign Up / Log In to Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"** → Sign up with your **GitHub account** (recommended)
3. Authorize Vercel to access your GitHub repositories

### 3.2 Import Your Project

1. Once logged in, click **"Add New Project"** (or "Import Project")
2. Click **"Import Git Repository"**
3. Select your `scrapsail-frontend` repository
4. Vercel auto-detects it's a React app ✅

### 3.3 Configure Build Settings

Leave everything default (Vercel auto-detects React):

- **Framework Preset:** React
- **Root Directory:** `/` (or leave empty)
- **Build Command:** `npm run build` ✅
- **Output Directory:** `build` ✅
- **Install Command:** `npm install` ✅

### 3.4 Set Environment Variables (IMPORTANT!)

Before deploying, set your production API URL:

1. Click **"Environment Variables"** section
2. Add the following:

   **Variable Name:** `REACT_APP_API_BASE_URL`  
   **Value:** `https://your-backend-url.com` (your actual backend URL)

   Example:
   ```
   REACT_APP_API_BASE_URL=https://scrapsail-backend.onrender.com
   ```

   Or if your backend is hosted elsewhere, use that URL.

3. Select **Production**, **Preview**, and **Development** environments
4. Click **"Add"**

### 3.5 Deploy!

Click **"Deploy"** 🚀

---

## 🌍 Step 4: Wait & Get Your URL

1. Wait 1–2 minutes while Vercel builds and deploys
2. You'll see a success message ✅
3. You'll get a live URL like:
   ```
   https://scrapsail-frontend.vercel.app/
   ```

**That's your official website — anyone in the world can access it!** 🎉

---

## 🔄 Step 5: Automatic Deployments (Bonus!)

Every time you push to GitHub, Vercel will automatically:
- ✅ Detect the changes
- ✅ Build your app
- ✅ Deploy the new version

**Just push to GitHub and your site updates automatically!**

---

## 🛠️ Troubleshooting

### Build Fails

**Error: "Build command failed"**
- Make sure `npm run build` works locally
- Check the build logs in Vercel for specific errors
- Ensure all dependencies are in `package.json`

### API Not Working

**Error: API calls fail after deployment**
- Check that `REACT_APP_API_BASE_URL` environment variable is set in Vercel
- Make sure your backend CORS settings allow your Vercel domain
- Check browser console for CORS errors

### CORS Issues

If you see CORS errors, update your backend `CorsConfig.java`:

```java
.allowedOrigins("https://scrapsail-frontend.vercel.app")
```

Or add multiple origins:
```java
.allowedOrigins("http://localhost:3000", "https://scrapsail-frontend.vercel.app")
```

---

## 📝 Quick Commands Reference

```bash
# Build locally
npm run build

# Test production build locally
npm install -g serve
serve -s build

# Commit and push
git add .
git commit -m "Your message"
git push origin main
```

---

## ✅ Deployment Checklist

- [ ] Local app runs with `npm start`
- [ ] Production build works: `npm run build`
- [ ] Code committed to git
- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] Environment variables set (especially `REACT_APP_API_BASE_URL`)
- [ ] Deploy successful
- [ ] Test live URL works
- [ ] Test API connections work

---

## 🎯 Next Steps

1. ✅ Share your Vercel URL with your team
2. ✅ Update your backend CORS settings if needed
3. ✅ Set up a custom domain (optional) in Vercel settings
4. ✅ Enable analytics in Vercel (optional)

---

**Happy Deploying! 🚀**

