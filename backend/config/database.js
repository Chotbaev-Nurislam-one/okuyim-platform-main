const fs = require("fs").promises;
const path = require("path");

class DatabaseManager {
  constructor() {
    this.dbType = process.env.DB_TYPE || "json";
    this.pool = null;
  }

  async connect() {
    if (this.dbType === "postgres") {
      try {
        const { Pool } = require("pg");
        this.pool = new Pool({
          host: process.env.DB_HOST || "localhost",
          port: process.env.DB_PORT || 5432,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          max: 20,
          idleTimeoutMillis: 30000,
        });
        await this.pool.query("SELECT NOW()");
        console.log("✅ PostgreSQL connected");
        return true;
      } catch (error) {
        console.error(
          "PostgreSQL connection failed, falling back to JSON:",
          error.message,
        );
        this.dbType = "json";
      }
    }

    if (this.dbType === "json") {
      console.log("📁 Using JSON file storage");
      return true;
    }

    return false;
  }

  async query(sql, params = []) {
    if (this.dbType === "postgres" && this.pool) {
      return this.pool.query(sql, params);
    }
    return null;
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}

module.exports = new DatabaseManager();
