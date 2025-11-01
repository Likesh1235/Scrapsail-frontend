# ⚡ Quick Deploy to Vercel - 5 Minutes!

## ✅ Pre-Deployment Checklist

Your project is already configured! Here's what's ready:

- ✅ React app configured (`package.json` with build script)
- ✅ API uses environment variables (`REACT_APP_API_BASE_URL`)
- ✅ Vercel configuration file created (`vercel.json`)
- ✅ Build output directory: `build`

---

## 🚀 Quick Steps

### 1️⃣ Build & Test Locally (Optional but Recommended)

```bash
npm run build
```

If this works, you're ready! ✅

### 2️⃣ Push to GitHub

```bash
# Commit any changes
git add .
git commit -m "Ready for Vercel deployment"

# If you haven't added GitHub remote yet:
git remote add origin https://github.com/YOUR_USERNAME/scrapsail-frontend.git
git branch -M main
git push -u origin main
```

### 3️⃣ Deploy on Vercel

1. Go to **https://vercel.com** → Sign in with GitHub
2. Click **"Add New Project"**
3. Import your **scrapsail-frontend** repository
4. **IMPORTANT:** Add Environment Variable:
   - **Name:** `REACT_APP_API_BASE_URL`
   - **Value:** Your backend URL (e.g., `https://your-backend.onrender.com`)
5. Click **"Deploy"**

### 4️⃣ Done! 🎉

Your site will be live at: `https://scrapsail-frontend.vercel.app/`

---

## 📝 Full Guide

See `VERCEL_DEPLOYMENT_GUIDE.md` for detailed instructions and troubleshooting.

---

## 🔧 Important Notes

1. **Environment Variables**: Make sure to set `REACT_APP_API_BASE_URL` in Vercel dashboard
2. **CORS**: Update your backend CORS settings to allow your Vercel domain
3. **Auto-Deploy**: Every push to GitHub automatically deploys to Vercel

---

**Ready to deploy? Let's go! 🚀**

