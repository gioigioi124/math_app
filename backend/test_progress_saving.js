// Native fetch used

const API_URL = "http://localhost:5000/api";

async function test() {
  try {
    const phone = "09" + Math.floor(Math.random() * 100000000);
    console.log("Using phone:", phone);

    // 1. Try Register directly first (since we want fresh user)
    console.log("Registering...");
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phone,
        password: "password123",
        childName: "Test Kid",
        grade: 1,
      }),
    });

    let token;
    if (regRes.ok) {
      const regData = await regRes.json();
      token = regData.token;
      console.log("Registered successfully. Token:", token ? "Yes" : "No");
    } else {
      const err = await regRes.text();
      console.error("Registration failed:", err);
      return;
    }

    // 2. Update Progress
    // We need a valid lesson ID. Since we can't easily get one, we might fail validation if we use a fake one.
    // But let's try to fetch lessons first.
    console.log("Fetching lessons...");
    const lessonRes = await fetch(`${API_URL}/lessons?grade=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const lessons = await lessonRes.json();
    console.log(`Fetched ${lessons.length} lessons`);

    if (lessons.length === 0) {
      console.log("No lessons found to test with.");
      return;
    }

    const lessonId = lessons[0]._id;
    console.log("Testing with Lesson ID:", lessonId);

    const payload = {
      lessonId: lessonId,
      activityId: "activity_1",
      status: "completed",
      score: 100,
      accuracy: 100,
      stars: 3,
      lessonStatus: "available",
      lessonScore: 10,
    };

    console.log("Sending Progress Update...");
    const progressRes = await fetch(`${API_URL}/progress/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    console.log("Update Status:", progressRes.status);
    const progressData = await progressRes.json();
    console.log("Update Response:", JSON.stringify(progressData, null, 2));
  } catch (err) {
    console.error("Test failed:", err);
  }
}

test();
