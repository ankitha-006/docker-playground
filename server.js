const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3030;

// Middleware for parsing JSON and form bodies (standard for Express CRUD APIs)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// MongoDB Connection URI and Client
const MONGO_URL = "mongodb://delta_admin:delta_password@localhost:27017";
const client = new MongoClient(MONGO_URL);

// GET all users
app.get("/getUsers", async (req, res) => {
  try {
    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db("my-sample-db");
    const data = await db.collection("users").find({}).toArray();

    res.send(data);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ error: "Failed to fetch users" });
  }
});

// POST signup
app.post("/signup", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("my-sample-db");

    // Form inputs: email, username, password
    const userPayload = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    };

    const result = await db.collection("users").insertOne(userPayload);

    // Send a confirmation or redirect
    res.send(`
      <h2>User registered successfully!</h2>
      <a href="/">Go back</a>
    `);
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).send({ error: "Failed to sign up user" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});