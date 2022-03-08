var formEl = document.querySelector('#loc-search');
var inputEl = document.querySelector('#q');
var selectEl = document.querySelector('#format');
var resultsEl = document.querySelector('#results');
var resultsTitleEl = document.querySelector('#results-title');

var toJSON = function (response) {
  return response.json();
};

var logData = function (data) {
  console.log(data);
};

var getResults = function (q, format) {
  var baseFetchURL = 'https://www.loc.gov';
  var fetchURL = new URL(baseFetchURL);
  
  if (q && format) {
    // If there is a value for the format query parameter, use the format endpoint to search for something based on the chosen format.
    fetchURL.pathname = '/' + format;
    fetchURL.searchParams.append('q', q);
  } else if (q) {
    // If there is no value for the format query parameter, use the search endpoint to search for all types of data.
    fetchURL.pathname = '/search';
    fetchURL.searchParams.append('q', q);
  }
  
  fetchURL.searchParams.append('fo', 'json');

  fetch(fetchURL.href)
    .then(toJSON)
    .then(function (data) {
      displayResults(data, q);
    })
    .catch((err) => console.log(err));
}

var displayResults = function (data, searchTerm) {
  // The response from the API request will then be displayed on the page. It is up to you and your team to determine which data should be displayed from the overall response object, but you must use data from the results property in the response object. 
  
  resultsEl.innerHTML = '';

  if (data.results.length) {
    resultsTitleEl.textContent = 'Results for: ' + searchTerm;
  } else {
    resultsTitleEl.textContent = 'No Results Found';
  }

  for (var result of data.results) {
    // Card
    var cardEl = document.createElement('article');
    cardEl.classList.add('card','my-5','p-3');

    // Children
    var h3El = document.createElement('h3');
    var pEl = document.createElement('p');
    var hrefEl = document.createElement('a');

    h3El.textContent = result.title;
    
    if (result.description) {
      pEl.textContent = result.description[0];
    }

    hrefEl.href = result.url;
    hrefEl.textContent = result.url;

    cardEl.appendChild(h3El);
    cardEl.appendChild(pEl);
    cardEl.appendChild(hrefEl);

    resultsEl.appendChild(cardEl);
  }
};

// On page load, if there are query parameters, immediately parse them and use them in a request URL to fetch data from the Library of Congress API.
if (location.search) {
  // parse the search parameters
  var locationURL = new URL(location.href);
  var qParam = locationURL.searchParams.get('q');
  var formatParam = locationURL.searchParams.get('format');

  getResults(qParam, formatParam);
}

var handleSubmission = function (event) {
  event.preventDefault();
  console.log('INPUT', inputEl.value);
  console.log('SELECT', selectEl.value);
  if (location.pathname.includes('search-results.html')) {
    getResults(inputEl.value, selectEl.value);
  } else {
    location.replace('search-results.html?q=' + inputEl.value + '&format=' + selectEl.value);
  }
};

formEl.addEventListener('submit', handleSubmission);