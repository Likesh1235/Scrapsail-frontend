/**
 * Start Both Backend and Frontend
 * This script starts the Spring Boot backend and React frontend concurrently
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Note: fetch is available in Node.js 18+, if not available, install node-fetch
let fetch;
try {
  fetch = globalThis.fetch || require('node-fetch');
} catch (e) {
  console.error('❌ fetch is not available. Please use Node.js 18+ or install node-fetch: npm install node-fetch');
  process.exit(1);
}

console.log('🚀 Starting ScrapSail Full-Stack Application...\n');

// Paths
const backendDir = path.join(__dirname, '..', 'scrapsail-backend');
const frontendDir = __dirname;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Check if backend directory exists
if (!fs.existsSync(backendDir)) {
  console.error(`${colors.red}❌ Backend directory not found: ${backendDir}${colors.reset}`);
  process.exit(1);
}

// Global variables for cleanup
let backendProcess = null;
let frontendProcess = null;

// Start Backend
console.log(`${colors.cyan}[1/2] Starting Backend (Spring Boot) on port 8080...${colors.reset}`);
backendProcess = spawn('mvn', ['spring-boot:run'], {
  cwd: backendDir,
  shell: true,
  stdio: 'inherit'
});

backendProcess.on('error', (error) => {
  console.error(`${colors.red}❌ Failed to start backend: ${error.message}${colors.reset}`);
  console.error(`${colors.yellow}Make sure Maven is installed and available in PATH${colors.reset}`);
});

backendProcess.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`${colors.red}❌ Backend exited with code ${code}${colors.reset}`);
  }
});

// Function to check if backend is ready
const checkBackendHealth = async (maxAttempts = 30) => {
  const healthUrl = 'http://localhost:8080/health';
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(healthUrl);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'UP') {
          console.log(`\n${colors.green}✅ Backend is ready!${colors.reset}`);
          return true;
        }
      }
    } catch (error) {
      // Backend not ready yet
    }
    
    if (i < maxAttempts - 1) {
      process.stdout.write(`${colors.yellow}.${colors.reset}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`\n${colors.yellow}⚠️  Backend took longer than expected to start${colors.reset}`);
  return false;
};

// Function to start frontend
const startFrontend = () => {
  console.log(`${colors.cyan}[2/2] Starting Frontend (React) on port 3000...${colors.reset}`);
  frontendProcess = spawn('npm', ['start'], {
    cwd: frontendDir,
    shell: true,
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: '3000',
      BROWSER: 'none'
    }
  });

  frontendProcess.on('error', (error) => {
    console.error(`${colors.red}❌ Failed to start frontend: ${error.message}${colors.reset}`);
    console.error(`${colors.yellow}Make sure Node.js and npm are installed${colors.reset}`);
  });

  frontendProcess.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`${colors.red}❌ Frontend exited with code ${code}${colors.reset}`);
    }
  });
};

// Wait for backend to be ready, then start frontend
(async () => {
  console.log(`${colors.yellow}Waiting for backend to be ready...${colors.reset}`);
  const backendReady = await checkBackendHealth();
  
  if (backendReady) {
    console.log(`${colors.green}Backend health check passed!${colors.reset}`);
  } else {
    console.log(`${colors.yellow}Starting frontend anyway... (backend may still be starting)${colors.reset}`);
  }
  
  // Start frontend regardless
  startFrontend();
  
  console.log(`\n${colors.green}✅ Both servers are starting...${colors.reset}`);
  console.log(`${colors.blue}   Backend:  http://localhost:8080${colors.reset}`);
  console.log(`${colors.blue}   Frontend: http://localhost:3000${colors.reset}`);
  console.log(`\n${colors.yellow}Press Ctrl+C to stop both servers${colors.reset}\n`);
})();

// Handle cleanup
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}Shutting down servers...${colors.reset}`);
  if (backendProcess) backendProcess.kill();
  if (frontendProcess) frontendProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  if (backendProcess) backendProcess.kill();
  if (frontendProcess) frontendProcess.kill();
  process.exit(0);
});
