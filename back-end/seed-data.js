import pkg from "pg";
import bcrypt from "bcrypt";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "karigo",
  password: "yhwh",
  port: 5432,
});

const workerNames = [
  "Raj Kumar",
  "Priya Singh",
  "Amit Patel",
  "Deepak Sharma",
  "Neha Reddy",
  "Arjun Verma",
  "Simran Kaur",
  "Vikram Singh",
  "Anjali Desai",
  "Rohit Nair",
  "Fatima Khan",
  "Suresh Pillai",
  "Meera Iyer",
  "Karan Rao",
  "Pooja Mishra",
  "Anurag Gupta",
  "Divya Kumar",
  "Sanjay Singh",
  "Riya Patel",
  "Gaurav Sharma",
  "Ananya Reddy",
  "Nikhil Verma",
  "Shreya Kaur",
  "Aditya Singh",
  "Varun Desai",
  "Isha Nair",
  "Ashok Khan",
  "Lavanya Pillai",
  "Naveen Iyer",
  "Harsha Rao",
  "Ankita Mishra",
  "Akshay Gupta",
  "Swati Kumar",
  "Ravi Singh",
  "Neelam Patel",
  "Siddharth Sharma",
  "Pragya Reddy",
  "Yash Verma",
  "Kavya Kaur",
  "Kunal Singh",
  "Payal Desai",
  "Aryan Nair",
  "Disha Khan",
  "Rahul Pillai",
  "Rithika Iyer",
  "Vikram Rao",
  "Anjana Mishra",
  "Keshav Gupta",
  "Sneha Kumar",
  "Arjun Singh",
];

const locations = [
  "Downtown",
  "Uptown",
  "Midtown",
  "Riverside",
  "Hillside",
  "Parkside",
  "Lakeside",
  "Eastside",
  "Westside",
  "Central",
];

const descriptions = [
  "Experienced professional with 5+ years of expertise",
  "Quick and efficient service with attention to detail",
  "Certified expert with proven track record",
  "Reliable and trustworthy service provider",
  "Fast, affordable, and quality work",
  "Expert in complex projects and installations",
  "Customer satisfaction guaranteed with warranty",
  "Available for urgent same-day services",
  "Licensed professional with insurance coverage",
  "Eco-friendly and sustainable practices",
];

async function seedDatabase() {
  try {
    console.log("Starting database seeding...");
    const client = await pool.connect();

    // Clear existing data
    await client.query("DELETE FROM bookings");
    await client.query("DELETE FROM reviews");
    await client.query("DELETE FROM favorites");
    await client.query("DELETE FROM workers");
    await client.query("DELETE FROM users");
    console.log("✓ Cleared existing data");

    // Create demo user
    const hashedPassword = await bcrypt.hash("demo@123", 10);
    const userRes = await client.query(
      "INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, password",
      ["Demo User", "demo@karigo.com", hashedPassword, "9876543210", "user"],
    );
    const demoUserId = userRes.rows[0].id;
    console.log("✓ Created demo user:", "demo@karigo.com");

    // Create worker users first
    const workerIds = [];
    for (let i = 0; i < 50; i++) {
      const workerHashedPwd = await bcrypt.hash("worker@123", 10);
      const userRes = await client.query(
        "INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [
          workerNames[i],
          `worker${i + 1}@karigo.com`,
          workerHashedPwd,
          `98765${String(i).padStart(5, "0")}`,
          "worker",
        ],
      );
      const workerId = userRes.rows[0].id;

      // Create worker profile
      const serviceId = (i % 6) + 1; // Cycle through 6 services
      const rating = Math.floor(Math.random() * 20) / 4 + 3; // 3.0 to 5.0
      const reviewsCount = Math.floor(Math.random() * 100) + 10;
      const experience = Math.floor(Math.random() * 15) + 1;
      const price = Math.floor(Math.random() * 3000) + 500;
      const jobsCompleted = Math.floor(Math.random() * 500) + 50;
      const workerIndex = i % 5;

      const res = await client.query(
        `INSERT INTO workers 
        (user_id, service_id, image, rating, reviews_count, experience, price, jobs_completed, location, description, response_time, is_approved, availability_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
        RETURNING id`,
        [
          workerId,
          serviceId,
          `/src/assets/workers/worker${workerIndex + 1}.svg`,
          rating,
          reviewsCount,
          experience,
          price,
          jobsCompleted,
          locations[i % locations.length],
          descriptions[i % descriptions.length],
          Math.floor(Math.random() * 24) + " hours",
          true,
          "available",
        ],
      );
      workerIds.push(res.rows[0].id);
    }
    console.log(`✓ Created 50 workers with varying ratings`);

    // Create bookings for demo user
    const statuses = [
      "pending",
      "accepted",
      "completed",
      "rejected",
      "cancelled",
    ];
    for (let i = 0; i < 8; i++) {
      const randomWorker =
        workerIds[Math.floor(Math.random() * workerIds.length)];
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];
      const randomDate = new Date(
        Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000,
      )
        .toISOString()
        .split("T")[0];

      await client.query(
        `INSERT INTO bookings (user_id, worker_id, service_id, booking_date, booking_time, location, description, status, price)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          demoUserId,
          randomWorker,
          (i % 6) + 1,
          randomDate,
          `${Math.floor(Math.random() * 12) + 9}:00`,
          locations[i % locations.length],
          `Service booking request ${i + 1}`,
          randomStatus,
          Math.floor(Math.random() * 3000) + 500,
        ],
      );
    }
    console.log("✓ Created 8 bookings for demo user");

    // Create reviews from workers
    // Get all user IDs first
    const usersRes = await client.query("SELECT id FROM users ORDER BY id");
    const userIds = usersRes.rows.map((r) => r.id);

    const comments = [
      "Excellent work! Highly recommended.",
      "Very professional and on time.",
      "Great service, will hire again.",
      "Quick and efficient work.",
      "Very satisfied with the result.",
      "Best service in town!",
      "Amazing quality, worth every penny.",
      "Perfect! Exactly what I needed.",
      "Outstanding service, very reliable.",
      "Would definitely book again!",
      "Professional and courteous.",
      "Exceeded my expectations!",
      "Great attention to detail.",
      "Fast turnaround, excellent results.",
      "Highly skilled and trustworthy.",
      "Very happy with the workmanship.",
      "Friendly and efficient service.",
      "Top-notch quality work.",
      "Will recommend to friends.",
      "Best experience I've had!",
    ];

    // Create 50+ reviews (multiple per worker)
    for (let i = 0; i < 60; i++) {
      const randomWorker =
        workerIds[Math.floor(Math.random() * workerIds.length)];
      const rating = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5

      // Use random reviewer from existing users
      const reviewerUserId =
        userIds[Math.floor(Math.random() * userIds.length)];

      try {
        await client.query(
          `INSERT INTO reviews (user_id, worker_id, booking_id, rating, comment)
          VALUES ($1, $2, $3, $4, $5)`,
          [
            reviewerUserId,
            randomWorker,
            null,
            rating,
            comments[Math.floor(Math.random() * comments.length)],
          ],
        );
      } catch (e) {
        // Ignore duplicate errors
      }
    }
    console.log("✓ Created 60+ reviews");

    // Create some favorites
    for (let i = 0; i < 10; i++) {
      const randomWorker =
        workerIds[Math.floor(Math.random() * workerIds.length)];
      try {
        await client.query(
          `INSERT INTO favorites (user_id, worker_id) VALUES ($1, $2)`,
          [demoUserId, randomWorker],
        );
      } catch (e) {
        // Ignore duplicates
      }
    }
    console.log("✓ Created 10 favorites");

    client.release();
    console.log("\n✅ Database seeding completed successfully!");
    console.log("\n📝 Demo Account Credentials:");
    console.log("   Email: demo@karigo.com");
    console.log("   Password: demo@123");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedDatabase();
