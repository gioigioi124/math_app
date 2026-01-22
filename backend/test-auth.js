// Test script for authentication API
const API_URL = "http://192.168.10.91:5000/api";

// Test data
const testUser = {
  childName: "Minh Anh",
  phone: "0123456789",
  password: "123456",
  grade: 1,
};

// Register function
async function testRegister() {
  console.log("\n🔵 Testing REGISTER...");
  console.log("URL:", `${API_URL}/auth/register`);
  console.log("Data:", JSON.stringify(testUser, null, 2));

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Register SUCCESS!");
      console.log("Response:", JSON.stringify(data, null, 2));
      return data;
    } else {
      console.log("❌ Register FAILED!");
      console.log("Error:", JSON.stringify(data, null, 2));
      return null;
    }
  } catch (error) {
    console.log("❌ Network Error:", error.message);
    return null;
  }
}

// Login function
async function testLogin() {
  console.log("\n🔵 Testing LOGIN...");
  console.log("URL:", `${API_URL}/auth/login`);
  console.log("Data:", {
    phone: testUser.phone,
    password: testUser.password,
  });

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: testUser.phone,
        password: testUser.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Login SUCCESS!");
      console.log("Response:", JSON.stringify(data, null, 2));
      return data;
    } else {
      console.log("❌ Login FAILED!");
      console.log("Error:", JSON.stringify(data, null, 2));
      return null;
    }
  } catch (error) {
    console.log("❌ Network Error:", error.message);
    return null;
  }
}

// Main test function
async function runTests() {
  console.log("=".repeat(50));
  console.log("🧪 AUTHENTICATION API TEST");
  console.log("=".repeat(50));

  // Test 1: Register
  const registerResult = await testRegister();

  // Wait a bit
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Test 2: Login
  const loginResult = await testLogin();

  console.log("\n" + "=".repeat(50));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(50));
  console.log("Register:", registerResult ? "✅ PASS" : "❌ FAIL");
  console.log("Login:", loginResult ? "✅ PASS" : "❌ FAIL");
  console.log("=".repeat(50));
}

// Run tests
runTests();
