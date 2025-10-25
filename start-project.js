#!/usr/bin/env node

/**
 * ScrapSail Project Startup Script
 * Starts all services in the correct order
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting ScrapSail Project...\n');

// Function to start a service
function startService(name, command, args, cwd) {
  console.log(`📦 Starting ${name}...`);
  
  const process = spawn(command, args, {
    cwd: cwd,
    stdio: 'pipe',
    shell: true
  });

  process.stdout.on('data', (data) => {
    console.log(`[${name}] ${data.toString().trim()}`);
  });

  process.stderr.on('data', (data) => {
    console.error(`[${name}] ERROR: ${data.toString().trim()}`);
  });

  process.on('close', (code) => {
    console.log(`[${name}] Process exited with code ${code}`);
  });

  return process;
}

// Start services in order
console.log('1️⃣ Starting Node.js Backend Server...');
const nodeBackend = startService('Node.js Backend', 'node', ['start-without-db.js'], path.join(__dirname, 'scrapsail-backend'));

// Wait 3 seconds before starting Spring Boot
setTimeout(() => {
  console.log('\n2️⃣ Starting Spring Boot Backend...');
  const springBoot = startService('Spring Boot', 'mvn', ['spring-boot:run'], path.join(__dirname, 'scrapsail-spring-backend'));
  
  // Wait 10 seconds before starting React
  setTimeout(() => {
    console.log('\n3️⃣ Starting React Frontend...');
    const reactApp = startService('React App', 'npm', ['start'], __dirname);
    
    console.log('\n🎉 All services started!');
    console.log('\n📋 Service URLs:');
    console.log('   Node.js Backend: http://localhost:8080');
    console.log('   Spring Boot: http://localhost:8080 (if different port)');
    console.log('   React App: http://localhost:3000');
    console.log('   H2 Database Console: http://localhost:8080/h2-console');
    
    console.log('\n🧪 Test OTP functionality:');
    console.log('   node scrapsail-backend/send-otp-to-user.js user@example.com');
    
  }, 10000);
  
}, 3000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down all services...');
  process.exit(0);
});

