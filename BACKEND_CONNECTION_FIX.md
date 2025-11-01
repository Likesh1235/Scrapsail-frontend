# Backend Connection Fix - Complete Guide

## 🔧 Changes Made

### 1. Environment Configuration (.env)
- Created `.env` file with `REACT_APP_API_URL=http://localhost:8080`
- This ensures consistent API endpoint configuration

### 2. Proxy Configuration (package.json)
- Added `"proxy": "http://localhost:8080"` to handle CORS automatically
- React dev server will proxy API requests to the backend

### 3. Login Component Fixes (src/pages/Login.jsx)
- ✅ Fixed JSON parsing error - now checks response status before parsing
- ✅ Added backend connection status check on page load
- ✅ Added visual indicator showing backend connection status
- ✅ Improved error messages with specific troubleshooting steps

### 4. API Configuration (src/config/api.js)
- ✅ Updated to use environment variables
- ✅ Proper fallback to default localhost:8080

### 5. Carbon Credits Component (src/pages/CarbonCredits.jsx)
- ✅ Replaced hardcoded URLs with API config
- ✅ Added better error handling

### 6. API Helper Utility (src/utils/apiHelper.js)
- ✅ Created utility functions for API calls
- ✅ Connection checking utilities
- ✅ Better error message handling

---

## 🚀 How to Fix Your Connection Issue

### Step 1: Ensure Backend is Running

**Open a terminal and navigate to backend directory:**
```bash
cd c:\Users\likes\scrapsail-backend
```

**Start the backend server:**
```bash
mvn spring-boot:run
```

**Look for this success message:**
```
Started BackendApplication in X.XXX seconds
```

### Step 2: Verify Backend is Accessible

**Open a browser and visit:**
```
http://localhost:8080/api/auth/test
```

**You should see:**
```json
{
  "message": "Auth controller is working!",
  "userServiceExists": true,
  "jwtServiceExists": true
}
```

### Step 3: Restart Frontend Server

**If your frontend is already running, stop it (Ctrl+C) and restart:**
```bash
cd c:\Users\likes\scrapsail-frontend-new
npm start
```

**Important:** The proxy configuration requires a server restart to take effect!

### Step 4: Check Connection Status

When you open the login page (`http://localhost:3000/login`), you should now see:
- ✅ **Green indicator**: "Backend server is connected" - Everything is working!
- ❌ **Red indicator**: "Cannot connect to backend" - Follow troubleshooting below

---

## 🔍 Troubleshooting

### Problem: Still seeing "Cannot connect to server"

#### Check 1: Is the backend actually running?
```bash
# In backend directory
cd c:\Users\likes\scrapsail-backend
mvn spring-boot:run
```
Wait for: `Started BackendApplication`

#### Check 2: Is port 8080 available?
```powershell
# In PowerShell
netstat -ano | findstr :8080
```
If something else is using port 8080, either:
- Stop that service, OR
- Change backend port in `application.properties` to another port (e.g., 8081)
- Update `.env` file: `REACT_APP_API_URL=http://localhost:8081`

#### Check 3: Check CORS Configuration
The backend CORS config should allow `http://localhost:3000`. Verify in:
`c:\Users\likes\scrapsail-backend\src\main\java\com\scrapsail\backend\config\CorsConfig.java`

It should include:
```java
.allowedOrigins("http://localhost:3000", "http://localhost:3001", "http://localhost:5173")
```

#### Check 4: Check Database Connection
The backend needs MySQL to be running. Verify in:
`c:\Users\likes\scrapsail-backend\src\main\resources\application.properties`

Default config:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/scrapsail
spring.datasource.username=root
spring.datasource.password=Likesh@2006
```

#### Check 5: Browser Console Errors
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for CORS errors or network errors
4. Check Network tab to see if requests are being made

---

## 📝 Testing the Connection

### Test 1: Manual Backend Test
```bash
# In PowerShell
curl http://localhost:8080/api/auth/test
```

### Test 2: Frontend Connection Check
1. Open `http://localhost:3000/login`
2. Check the connection status indicator
3. Open browser console (F12) and look for connection logs

### Test 3: Full Login Test
1. Use test credentials (if available)
2. Try logging in
3. Check browser console for detailed logs
4. Check Network tab to see the actual request/response

---

## 🎯 Expected Behavior

### ✅ Working Setup:
1. Backend terminal shows: `Started BackendApplication in X.XXX seconds`
2. Frontend login page shows: Green "✅ Backend server is connected"
3. Login form submits successfully
4. User is redirected to appropriate dashboard

### ❌ Connection Issues:
1. Backend not running → Start backend server
2. Wrong port → Check backend port and update `.env`
3. CORS error → Verify CORS config matches frontend URL
4. Database error → Check MySQL is running and credentials are correct

---

## 🔄 Quick Restart Procedure

If you're still having issues, try this complete restart:

```powershell
# Terminal 1: Start Backend
cd c:\Users\likes\scrapsail-backend
mvn spring-boot:run
# Wait for "Started BackendApplication"

# Terminal 2: Start Frontend (after backend is ready)
cd c:\Users\likes\scrapsail-frontend-new
npm start
```

---

## 📞 Need More Help?

Check the console logs - they now include:
- 🔐 Login attempt details
- 📡 API endpoint being used
- 🌐 Full URL being called
- 📥 Server response
- ✅/❌ Success/failure status

These logs will help identify exactly where the connection is failing.

