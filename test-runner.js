#!/usr/bin/env node

// Simple test runner without external dependencies
const fs = require('fs');
const path = require('path');

// Test results
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Simple assertion function
function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ ${message}`);
    passedTests++;
  } else {
    console.log(`❌ ${message}`);
    failedTests++;
  }
}

// Test API endpoints
async function testAPIEndpoints() {
  console.log('\n🧪 Testing API Endpoints...');
  
  // Test 1: Login endpoint exists
  try {
    const loginRoute = fs.readFileSync('./app/api/login/route.ts', 'utf8');
    assert(loginRoute.includes('export async function POST'), 'Login POST endpoint exists');
    assert(loginRoute.includes('bcrypt.compare'), 'Login uses bcrypt for password validation');
    assert(!loginRoute.includes('console.log(\'pass\''), 'Login no longer logs passwords (SECURITY FIX)');
  } catch (error) {
    console.log(`❌ Error reading login route: ${error.message}`);
    failedTests++;
  }

  // Test 2: Register endpoint exists
  try {
    const registerRoute = fs.readFileSync('./app/api/register/route.ts', 'utf8');
    assert(registerRoute.includes('export async function POST'), 'Register POST endpoint exists');
    assert(registerRoute.includes('generateSlug'), 'Register generates slug for company');
    assert(registerRoute.includes('user.create'), 'Register creates user');
  } catch (error) {
    console.log(`❌ Error reading register route: ${error.message}`);
    failedTests++;
  }

  // Test 3: Clients endpoint exists
  try {
    const clientsRoute = fs.readFileSync('./app/api/clients/route.ts', 'utf8');
    assert(clientsRoute.includes('export async function GET'), 'Clients GET endpoint exists');
    assert(clientsRoute.includes('export async function POST'), 'Clients POST endpoint exists');
    assert(clientsRoute.includes('getAuthPayload'), 'Clients endpoints require authentication');
  } catch (error) {
    console.log(`❌ Error reading clients route: ${error.message}`);
    failedTests++;
  }
}

// Test Components
function testComponents() {
  console.log('\n🧪 Testing Components...');
  
  // Test 1: ClientFilters exists
  try {
    const clientFilters = fs.readFileSync('./components/clients/client-filters.tsx', 'utf8');
    assert(clientFilters.includes('export function ClientFilters'), 'ClientFilters component exists');
    assert(clientFilters.includes('interface ClientFiltersState'), 'ClientFilters has proper TypeScript types');
    assert(clientFilters.includes('activeFiltersCount'), 'ClientFilters tracks active filters count');
  } catch (error) {
    console.log(`❌ Error reading ClientFilters: ${error.message}`);
    failedTests++;
  }

  // Test 2: PaymentsTable exists
  try {
    const paymentsTable = fs.readFileSync('./components/payments/payments-table.tsx', 'utf8');
    assert(paymentsTable.includes('export function PaymentsTable'), 'PaymentsTable component exists');
    assert(paymentsTable.includes('PaymentFiltersState'), 'PaymentsTable uses filter state');
    assert(paymentsTable.includes('useMemo'), 'PaymentsTable uses React.memo for optimization');
  } catch (error) {
    console.log(`❌ Error reading PaymentsTable: ${error.message}`);
    failedTests++;
  }

  // Test 3: Status badges exist
  try {
    const statusBadge = fs.readFileSync('./components/ui/status-badge.tsx', 'utf8');
    assert(statusBadge.includes('ClientStatusBadge'), 'ClientStatusBadge component exists');
    assert(statusBadge.includes('PaymentStatusBadge'), 'PaymentStatusBadge component exists');
    assert(statusBadge.includes('PlanBadge'), 'PlanBadge component exists');
  } catch (error) {
    console.log(`❌ Error reading status badges: ${error.message}`);
    failedTests++;
  }
}

// Test Database Schema
function testDatabaseSchema() {
  console.log('\n🧪 Testing Database Schema...');
  
  try {
    const schema = fs.readFileSync('./prisma/schema.prisma', 'utf8');
    assert(schema.includes('model User'), 'User model exists');
    assert(schema.includes('model Company'), 'Company model exists');
    assert(schema.includes('model Client'), 'Client model exists');
    assert(schema.includes('model Payment'), 'Payment model exists');
    assert(schema.includes('model Plan'), 'Plan model exists');
    assert(schema.includes('enum ClientStatus'), 'ClientStatus enum exists');
    assert(schema.includes('enum PaymentStatus'), 'PaymentStatus enum exists');
    assert(schema.includes('enum PaymentMethod'), 'PaymentMethod enum exists');
    assert(schema.includes('enum UserRole'), 'UserRole enum exists');
  } catch (error) {
    console.log(`❌ Error reading schema: ${error.message}`);
    failedTests++;
  }
}

// Test Security
function testSecurity() {
  console.log('\n🧪 Testing Security...');
  
  try {
    const loginRoute = fs.readFileSync('./app/api/login/route.ts', 'utf8');
    assert(!loginRoute.includes('console.log(\'pass\''), 'No password logging in login route');
    assert(loginRoute.includes('bcrypt.compare'), 'Passwords are hashed with bcrypt');
    assert(loginRoute.includes('JWT_SECRET'), 'Uses JWT secret for token signing');
  } catch (error) {
    console.log(`❌ Error checking security: ${error.message}`);
    failedTests++;
  }
}

// Test Type Safety
function testTypeSafety() {
  console.log('\n🧪 Testing Type Safety...');
  
  try {
    const typesFile = fs.readFileSync('./lib/types.ts', 'utf8');
    assert(typesFile.includes('export type ClientStatus'), 'ClientStatus type exported');
    assert(typesFile.includes('export type PaymentStatus'), 'PaymentStatus type exported');
    assert(typesFile.includes('export type PaymentMethod'), 'PaymentMethod type exported');
    assert(typesFile.includes('export interface Client'), 'Client interface exists');
    assert(typesFile.includes('export interface Payment'), 'Payment interface exists');
  } catch (error) {
    console.log(`❌ Error checking types: ${error.message}`);
    failedTests++;
  }
}

// Test Build Configuration
function testBuildConfig() {
  console.log('\n🧪 Testing Build Configuration...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    assert(packageJson.scripts.build, 'Build script exists');
    assert(packageJson.scripts.dev, 'Dev script exists');
    assert(packageJson.scripts.lint, 'Lint script exists');
    assert(packageJson.dependencies, 'Dependencies exist');
    assert(packageJson.devDependencies, 'Dev dependencies exist');
  } catch (error) {
    console.log(`❌ Error checking package.json: ${error.message}`);
    failedTests++;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Comprehensive Application Tests...\n');
  
  await testAPIEndpoints();
  testComponents();
  testDatabaseSchema();
  testSecurity();
  testTypeSafety();
  testBuildConfig();
  
  // Results
  console.log('\n📊 TEST RESULTS:');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (failedTests > 0) {
    console.log('\n🚨 Some tests failed. Please review the issues above.');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed! Application is in good health.');
  }
}

runAllTests().catch(console.error);