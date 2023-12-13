// 1. Imports
const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

// 2. Initial Configurations
const app = express();
const PORT = 4000;

// GitHub OAuth Credentials
const GITHUB_CLIENT_ID = "GITHUB_CLIENT_ID";
const GITHUB_CLIENT_SECRET = "GITHUB_CLIENT_SECRET";

app.use(bodyParser.json());

// 3. Route to Exchange GitHub Code for Access Token
app.post("/backend/exchangeCode", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).send("GitHub code not provided.");
  }

  try {
    const response = await fetchGithubToken(code);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error exchanging GitHub OAuth code:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 4. GitHub OAuth Callback
app.get("/api/github-oauth-callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("GitHub code not provided.");
  }

  try {
    const tokenResponse = await fetchGithubToken(code);
    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return res.status(500).send("Failed to get access token.");
    }

    const userData = await fetchGithubUser(tokenData.access_token);
    console.log(userData);

    res.redirect(
      `http://localhost:3000/search-repo?token=${tokenData.access_token}`
    );
  } catch (error) {
    console.error("GitHub Auth Error:", error);
    res.status(500).send("Internal Server Error.");
  }
});

// 5. Fetch GitHub Repository Contributors
app.post("/backend/getContributors", async (req, res) => {
  const { owner, repo, token } = req.body;

  try {
    const data = await fetchRepoContributors(owner, repo, token);

    if (!Array.isArray(data)) {
      throw new Error(data.message || "Unexpected response format");
    }

    const contributors = data.map((contrib) => ({
      login: contrib.login,
      contributions: contrib.contributions,
    }));

    res.json(contributors);
  } catch (error) {
    console.error("Error fetching contributors:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 6. Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Helper Functions
async function fetchGithubToken(code) {
  return fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code: code,
    }),
  });
}

async function fetchGithubUser(token) {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: "token " + token,
    },
  });
  return response.json();
}

async function fetchRepoContributors(owner, repo, token) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contributors`,
    {
      headers: {
        Authorization: "token " + token,
      },
    }
  );

  if (response.status !== 200) {
    const data = await response.json();
    console.error("GitHub API Response:", data);
    throw new Error(data.message);
  }

  return response.json();
}
