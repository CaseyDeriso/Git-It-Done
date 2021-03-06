const getUserRepos = function (user) {
  // format the github api url
  let apiUrl = "https://api.github.com/users/" + user + "/repos";
  // make a request to the url
  fetch(apiUrl).then(function (response) {
    //   request was successful
    if (response.ok) {
      response.json().then(function (data) {
        displayRepos(data, user);
      });
    } else {
      alert("ERROR: " + response.statusText);
    }
  })
  .catch(function(error) {
    //   catch chained to the end of .then()
    alert("Unable to connect to GitHub")
  })
};
const userFormEl = document.getElementById("user-form");
const nameInputEl = document.getElementById("username");
const repoContainerEl = document.getElementById("repos-container");
const repoSearchTerm = document.getElementById("repo-search-term");
const languageButtonsEl = document.getElementById("language-buttons");

const formSubmitHandler = function (event) {
  event.preventDefault();
  // get the value from input element
  let username = nameInputEl.value.trim();

  if (username) {
    getUserRepos(username);
    nameInputEl.value = "";
  } else {
    alert("Please enter a GitHub username");
  }
};

const buttonClickHandler = function(event) {
  let language = event.target.getAttribute("data-language")
  if (language) {
  getFeaturedRepos(language);
  // clear old content
  repoContainerEl.textContent = "";
  }
}

const getFeaturedRepos = function (language) {
  var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";
  
  fetch(apiUrl)
    .then(function(res) {
    if (res.ok) {
       res.json().then(function(data){
         displayRepos(data.items, language);
       });
    } else {
       alert("Error:" + res.statusText);
    }
  });
};
const displayRepos = function (repos, searchTerm) {
  // check if api returned any repos
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found.";
    return;
  }
  // clear out old content
  repoContainerEl.textContent = "";
  repoSearchTerm.textContent = searchTerm;
  // loop over repos
  for (let i = 0; i < repos.length; i++) {
    //   format repo name
    let repoName = repos[i].owner.login + "/" + repos[i].name;
    // create a container for reach repo
    let repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
    // create a span element to hold repository name
    let titleEl = document.createElement("span");
    titleEl.textContent = repoName;
    // append to container
    repoEl.appendChild(titleEl);
    // create a status element
    let statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";
    // check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        repos[i].open_issues_count +
        "issues(s)" + "<i class ='fas fa-times status-icon icon-danger'></i>";
    } else {
      statusEl.innerHTML =
        "<i class='fas fa-check-square status-icon icon-success'></i>";
    }
    // append to container
    repoEl.appendChild(statusEl);
    // append container to the dom
    repoContainerEl.appendChild(repoEl);
  }
};



userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);
