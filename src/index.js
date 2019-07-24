import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import { useAsyncEndpoint } from "./hooks/useAsyncEndpoint";
import GithubRepo from "./components/GithubRepo";

function App() {
  const [keyword, setKeyword] = React.useState("react");
  const [showRepo, setShowRepo] = React.useState(false);
  useEffect(() => {
    console.log("fooooooo");
    return () => {
      console.log("barbarbar");
    };
  }, []);
  const { res, setReq, cancel } = useAsyncEndpoint({
    url: `/repositories?q=react`,
    method: "get"
  });

  // console.log("response:: ", res);
  const { data, errorInfo } = res;
  const handleSubmit = () => {
    console.log("keyword:: ", keyword);
    setReq({
      url: `/repositories?q=${keyword}`
    });
  };

  // console.log("data:: ", data, errorInfo);
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <div>
        <button onClick={() => cancel("Manually cancelled...")}>
          Cancel request
        </button>
      </div>
      <div>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input onChange={e => setKeyword(e.target.value)} />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div>
        {errorInfo && <p>{errorInfo}</p>}
        <ul>
          {data &&
            data.items &&
            data.items.map(item => <li key={item.html_url}>{item.name}</li>)}
        </ul>
      </div>
      <div>
        <button onClick={() => setShowRepo(prev => !prev)}>Toggle stuff</button>
      </div>
      <hr />
      {showRepo ? <GithubRepo /> : <h2>Hide Repo</h2>}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
