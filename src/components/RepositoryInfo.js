// RepositoryInfo.js
import React, { useState, useEffect, useCallback } from "react";

function RepositoryInfo() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchContributors = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contributors`,
        {
          headers: {
            Authorization: "token " + localStorage.getItem("github_token"),
          },
        }
      );
      const data = await response.json();
      setContributors(data);
    } catch (error) {
      console.error("There was an error fetching the contributors:", error);
    }
    setLoading(false);
  }, [owner, repo]);

  useEffect(() => {
    if (owner && repo) {
      fetchContributors();
    }
  }, [owner, repo, fetchContributors]);
  return (
    <div>
      <h2>Enter Repository Info</h2>
      <div>
        <label>
          Owner:
          <input value={owner} onChange={(e) => setOwner(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Repository Name:
          <input value={repo} onChange={(e) => setRepo(e.target.value)} />
        </label>
      </div>
      <button onClick={fetchContributors}>Fetch Contributors</button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2>Contributors:</h2>
          <ul>
            {contributors.map((contributor) => (
              <li key={contributor.id}>{contributor.login}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default RepositoryInfo;
