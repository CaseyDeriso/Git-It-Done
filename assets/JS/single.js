// get reference to the issue limit warning display element
const limitWarningEl = document.getElementById("limit-warning");
const repoNameEl = document.getElementById("repo-name");
// get and format query string from https link
const getRepoName = function () {
  // grab repo name from url query string
  let queryString = document.location.search;
  let repoName = queryString.split("=")[1];
  // validate input before performing fetch
  if (repoName) {
    // display issues
    getRepoIssues(repoName);
    // display repo name
    repoNameEl.textContent = repoName;
  } else {
    // if no repo was given, redirect to the homepage
    document.location.replace("./index.html");
  }
};
// fetch a list of issues with a given username/reponame
const getRepoIssues = function (repo) {
  let apiUrl = `https://api.github.com/repos/${repo}/issues?direction=asc`;
  fetch(apiUrl).then(function (response) {
    // request was successful
    if (response.ok) {
      response.json().then(function (data) {
        displayIssues(data);
        // check if the api has paginated issues
        if (response.headers.get("link")) {
          displayWarning(repo);
        }
      });
    } else {
      // if not successful, rediret to homepage
      document.location.replace("./index.html");
    }
  });
};
// turn data into DOM elements
const displayIssues = function (issues) {
  let issueContainerEl = document.getElementById("issues-container");
  if (issues.length === 0) {
    issueContainerEl.textContent = "This repo has no open issues!";
    return;
  }
  // loop over the data
  for (let i = 0; i < issues.length; i++) {
    // create link element to take users to the github issue
    let issuesEl = document.createElement("a");
    issuesEl.classList =
      "list-item flex-row justify-space-between align-center";
    issuesEl.setAttribute("href", issues[i].html_url);
    issuesEl.setAttribute("target", "_blank");
    // create span to hold issue title
    let titleEl = document.createElement("span");
    titleEl.textContent = issues[i].title;
    // append to container
    issuesEl.appendChild(titleEl);
    // create a type element
    let typeEl = document.createElement("span");
    // check if issue is an actual issue of a pull request
    if (issues[i].pull_request) {
      typeEl.textContent = "(Pull request)";
    } else {
      typeEl.textContent = "(Issue)";
    }
    // append to container
    issuesEl.appendChild(typeEl);
    issueContainerEl.appendChild(issuesEl);
  }
};

// display warning if repo has more than 30 issues
const displayWarning = function (repo) {
  // add test to warning container
  limitWarningEl.textContent = "To see more than 30 issues, visit ";
  let linkEl = document.createElement("a");
  linkEl.textContent = "This Repo on GitHub.";
  linkEl.setAttribute("href", `https://github.com/${repo}/issues`);
  linkEl.setAttribute("target", "_blank");
  // append to warning container
  limitWarningEl.appendChild(linkEl);
};
getRepoName();
