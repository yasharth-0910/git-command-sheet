const express = require("express");
const simpleGit = require("simple-git");
const fs = require("fs");
const path = require("path");
const os = require("os");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000", 
  "http://localhost:5173",
  "https://git.cicr.in" // Add your Vercel domain
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type",
};
app.use(cors(corsOptions));

let sandboxDir = null;

// Initialize sandbox directory
app.post("/init-sandbox", (req, res) => {
  try {
    if (!sandboxDir) {
      sandboxDir = fs.mkdtempSync(path.join(os.tmpdir(), "git-sandbox-"));
    }
    console.log("Sandbox initialized at:", sandboxDir); 
    res.json({ success: true, sandboxDir });
  } catch (error) {
    console.error("Sandbox Init Error:", error);
    res.status(500).json({ error: "Failed to initialize sandbox" });
  }
});

// Execute Git or Shell command
app.post("/execute-command", async (req, res) => {
  console.log("Received request:", req.body);

  const { command } = req.body;
  console.log("command => ", command);
  if (!sandboxDir) {
    return res.status(500).json({ error: "Sandbox directory is not initialized." });
  }
  if (!command) {
    return res.status(400).json({ error: "Command is missing." });
  }

  const commandParts = command.trim().split(" ");
  const baseCommand = commandParts[0];
  const args = commandParts.slice(1);

  try {
    console.log(`Executing: ${command} in ${sandboxDir}`);

    // Define allowed commands
    const safeCommands = ["ls", "mkdir", "touch", "cd", "pwd", "git"];

    if (!safeCommands.includes(baseCommand)) {
      return res.status(400).json({ error: `Command '${baseCommand}' is not allowed.` });
    }

    // Handle Git commands
    if (baseCommand === "git") {
      const git = simpleGit(sandboxDir);
      if (args[0] === "clone" && args.length === 2) {
        await git.clone(args[1], sandboxDir);
        return res.json({ success: true, output: `Repository cloned into ${sandboxDir}` });
      }
      const output = await git.raw(args);
      return res.json({ success: true, output });
    }

    // Handle pwd command specifically for Windows
    if (baseCommand === "pwd") {
      return res.json({ success: true, output: sandboxDir });
    }

    // Execute other shell commands inside sandboxDir
    exec(command, { cwd: sandboxDir }, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: stderr || error.message });
      }
      res.json({ success: true, output: stdout.trim() });
    });

  } catch (error) {
    console.error("Command Execution Error:", error.message);
    res.status(500).json({ error: `Command failed: ${error.message}` });
  }
});

// Clean up sandbox
app.post("/cleanup-sandbox", (req, res) => {
  if (sandboxDir) {
    fs.rmSync(sandboxDir, { recursive: true, force: true });
    sandboxDir = null;
  }
  res.json({ success: true });
});

// Verify Git is installed
exec("git --version", (error, stdout, stderr) => {
  if (error) {
    console.error("Git not found:", error.message);
  } else {
    console.log("Git Version:", stdout.trim());
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
