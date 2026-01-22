// Test script for signup with a new user
const API_URL = "http://192.168.10.91:5000/api";

// New test user
const newUser = {
  childName: "Bảo An",
  phone: "0987654321",
  password: "123456",
  grade: 2,
};

// Register function
async function testSignup() {
  console.log("\n🔵 Testing SIGNUP with new user...");
  console.log("URL:", `${API_URL}/auth/register`);
  console.log("Data:", JSON.stringify(newUser, null, 2));

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Signup SUCCESS!");
      console.log("Response:", JSON.stringify(data, null, 2));
      console.log("\n📱 You can now login with:");
      console.log("  Phone:", newUser.phone);
      console.log("  Password:", newUser.password);
      return data;
    } else {
      console.log("❌ Signup FAILED!");
      console.log("Error:", JSON.stringify(data, null, 2));
      return null;
    }
  } catch (error) {
    console.log("❌ Network Error:", error.message);
    return null;
  }
}

// Run test
console.log("=".repeat(50));
console.log("🧪 SIGNUP TEST - New User");
console.log("=".repeat(50));
testSignup();
