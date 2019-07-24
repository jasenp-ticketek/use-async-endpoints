import React, { useEffect } from "react";
import { useAsyncEndpoint } from "../hooks/useAsyncEndpoint";

const GithubRepo = () => {
  const { res, setReq } = useAsyncEndpoint({
    url: `/repositories?q=react`,
    method: "get"
  });

  useEffect(() => {
    setReq({
      url: `/repositories?q=redux`,
      method: "get"
    });
  }, [setReq]);
  const { data } = res;
  return (
    <ul>
      {((data && data.items) || []).map(item => (
        <li key={item.html_url}>{item.name}</li>
      ))}
    </ul>
  );
};

export default GithubRepo;
