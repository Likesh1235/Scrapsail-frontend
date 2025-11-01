# 🚀 Quick Start Guide

## Starting the Backend Server

You need to start the backend server before the frontend can connect to it.

### Option 1: Using the Script (Easiest)
Double-click: `START_BACKEND.bat` in the backend folder

### Option 2: Manual Start
Open PowerShell/Command Prompt and run:
```powershell
cd c:\Users\likes\scrapsail-backend
mvn spring-boot:run
```

### What to Look For:
✅ **Success message:**
```
Started BackendApplication in X.XXX seconds
```

❌ **Common issues:**
- MySQL not running → Start MySQL service
- Port 8080 in use → Stop other application using port 8080
- Database connection error → Check MySQL credentials in `application.properties`

---

## Starting the Frontend

### After Backend is Running:
Open a **NEW** terminal and run:
```powershell
cd c:\Users\likes\scrapsail-frontend-new
npm start
```

The browser will open automatically at `http://localhost:3000`

---

## Starting Both at Once

Double-click: `START_PROJECT.bat` in the frontend folder

This will:
1. Start backend in one terminal window
2. Wait 10 seconds
3. Start frontend in another terminal window

---

## ✅ Verification

1. **Backend Status:**
   - Visit: `http://localhost:8080/api/auth/test`
   - Should see: `{"message":"Auth controller is working!",...}`

2. **Frontend Status:**
   - Visit: `http://localhost:3000/login`
   - Should see: Green "✅ Backend server is connected"

---

## 🛠️ Troubleshooting

### Backend Won't Start
- Check MySQL is running: `netstat -ano | findstr :3306`
- Check Java version: `java -version` (need Java 17+)
- Check Maven: `mvn -version`

### Frontend Shows "Cannot Connect"
- Ensure backend shows "Started BackendApplication"
- Wait 10-15 seconds after backend starts
- Refresh the browser page
- Check browser console (F12) for errors

### Port Already in Use
- Backend (8080): `netstat -ano | findstr :8080`
- Frontend (3000): `netstat -ano | findstr :3000`
- Kill process: `taskkill /PID <pid> /F`

---

## 📋 Startup Checklist

- [ ] MySQL is running
- [ ] Backend terminal shows "Started BackendApplication"
- [ ] Frontend shows green connection status
- [ ] Can access `http://localhost:3000/login`

---

**Need help?** Check the browser console (F12) for detailed error messages!

