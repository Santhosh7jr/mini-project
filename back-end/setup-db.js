import pkg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Pool, Client } = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function setupDatabase() {
  // First, create the database using default connection
  const client = new Client({
    user: "postgres",
    host: "localhost",
    password: "yhwh",
    port: 5432,
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL...");

    // Drop existing database if it exists
    try {
      await client.query("DROP DATABASE IF EXISTS karigo;");
      console.log("Dropped existing karigo database...");
    } catch (err) {
      console.log("No existing database to drop");
    }

    // Create database
    await client.query("CREATE DATABASE karigo;");
    console.log("✓ Database 'karigo' created");

    await client.end();

    // Now connect to the karigo database and run schema
    const pool = new Pool({
      user: "postgres",
      host: "localhost",
      database: "karigo",
      password: "yhwh",
      port: 5432,
    });

    // Read and execute schema
    const schemaPath = path.join(__dirname, "database_schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");
    const statements = schema.split(";").filter((s) => s.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
      }
    }

    console.log("✓ Database schema executed successfully");
    console.log("✓ All tables created with sample data");

    await pool.end();
    console.log("Database setup complete!");
  } catch (err) {
    console.error("Database setup failed:", err.message);
    process.exit(1);
  }
}

setupDatabase();
