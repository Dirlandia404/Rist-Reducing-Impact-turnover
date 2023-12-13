import React from "react";
import { TokenProvider } from "./TokenProvider";
import SearchRepo from "./SearchRepo";
import RepoContributorsWithTasks from "./RepoContributorsWithTasks";
import RepositoryInfo from "./RepositoryInfo";

function CombinedComponent(props) {
  const token = new URLSearchParams(props.location.search).get("token");

  return (
    <TokenProvider token={token}>
      <SearchRepo />
      <RepositoryInfo />
      <RepoContributorsWithTasks />
    </TokenProvider>
  );
}

export default CombinedComponent;
