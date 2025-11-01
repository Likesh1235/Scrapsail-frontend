# 🚀 Quick Start Guide - Start Both Frontend & Backend

## ✅ All Connection Issues Fixed!

### Option 1: One Command (Recommended)
From the **frontend** directory:
```bash
cd scrapsail-frontend-new
npm run start-both
```

This will:
1. ✅ Start the Spring Boot backend (port 8080)
2. ✅ Wait for backend to be ready (health check)
3. ✅ Start the React frontend (port 3000)

### Option 2: PowerShell Script
From the **backend** directory:
```powershell
.\START_PROJECT.ps1
```

### Option 3: Manual (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd scrapsail-backend
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd scrapsail-frontend-new
npm start
```

---

## 📋 Configuration

### Frontend .env
Located at: `scrapsail-frontend-new/.env`
```
REACT_APP_API_BASE_URL=http://localhost:8080
PORT=3000
HTTPS=true
```

### Backend Port
- Default: `8080`
- Config: `src/main/resources/application.properties`

---

## ✅ Verification

### Check Backend:
Open browser: `http://localhost:8080/health`
Should return: `{"status":"UP"}`

### Check Frontend:
Open browser: `http://localhost:3000`
Should show the login page

---

## 🔧 Troubleshooting

### Backend Won't Start
1. Check if MySQL is running
2. Verify database credentials in `application.properties`
3. Check if port 8080 is available

### Frontend Can't Connect
1. Ensure backend is running first
2. Check browser console for CORS errors
3. Verify `.env` file has correct API URL

### Port Already in Use
Backend (8080):
```powershell
netstat -ano | findstr :8080
taskkill /F /PID <process_id>
```

Frontend (3000):
```powershell
netstat -ano | findstr :3000
taskkill /F /PID <process_id>
```

---

## 📝 API Configuration

All API calls use: `http://localhost:8080`

Configured in:
- `src/config/api.js`
- `src/api.js`
- `.env` file

---

## 🎯 Summary

✅ **Backend:** http://localhost:8080  
✅ **Frontend:** http://localhost:3000  
✅ **API:** http://localhost:8080  
✅ **CORS:** Configured for all localhost ports  
✅ **HTTPS:** Enabled for frontend (prevents security warnings)

**Everything is ready to use!** 🎉



