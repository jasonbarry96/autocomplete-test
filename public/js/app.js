console.log("Client side JS file loaded");
const { autocomplete, getAlgoliaResults } = window['@algolia/autocomplete-js'];

 const h = window['preact'];
// create custom client
const searchClient = {
  search(requests) {
    return fetch(`/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ requests })
    })
      .then((res) => {
        return res.json();
      })
      .catch((err) => {
        console.log(err);
      });
  }
};


const INSTANT_SEARCH_INDEX_NAME = 'instant_search'
const instantSearchRouter = instantsearch.routers.history()

const search = instantsearch({
  indexName: INSTANT_SEARCH_INDEX_NAME,
  searchClient,
  routing: instantSearchRouter,
});

/*search.addWidgets([
  autocompleteSearchBox({
    container: "#autocomplete"
  })
]);*/

// Mount a virtual search box to manipulate InstantSearch's `query` UI
// state parameter.
const virtualSearchBox = instantsearch.connectors.connectSearchBox(() => {})

search.addWidgets([
  virtualSearchBox({})
]);

search.start();

// Set the InstantSearch index UI state from external events.
function setInstantSearchUiState(indexUiState) {
  search.setUiState(uiState => ({
    ...uiState,
    [INSTANT_SEARCH_INDEX_NAME]: {
      ...uiState[INSTANT_SEARCH_INDEX_NAME],
      // We reset the page when the search state changes.
      page: 1,
      ...indexUiState,
    },
  }))
}

// Return the InstantSearch index UI state.
function getInstantSearchUiState() {
  const uiState = instantSearchRouter.read()

  return (uiState && uiState[INSTANT_SEARCH_INDEX_NAME]) || {}
}

const searchPageState = getInstantSearchUiState()


autocomplete({
  container: '#autocomplete',
  showCompletion: true,
  openOnFocus: true,
  initialState: {
  query: searchPageState.query || '',
  },
  onSubmit({ state }) {
    setInstantSearchUiState({ query: state.query })
  },
  onReset() {
    setInstantSearchUiState({ query: '' })
  },
  onStateChange({ prevState, state }) {
    if (prevState.query !== state.query) {
      setInstantSearchUiState({ query: state.query })
    }
  },
  getSources() {
    return [
    {
    getItems({ query }) {
      return getAlgoliaResults({
        searchClient,
        queries: [
          {
            indexName: "instant_search",
            query,
            params: {
              hitsPerPage: 5
            }
          }
        ]
      })
    },
    templates: {
      item({ item, createElement }) {
        //Returning a string
        //return `${item.name}, Price: ${item.backendCustomData }`;
        //Returning an HTML block
        return createElement('div', {
            dangerouslySetInnerHTML: {
              __html: `<article>
                <h1>${ item.name }</h1>
                <p>Price: ${ item.backendCustomData }</p>
                </article>`,
            },
        });
      },
    },
    }
  ];
  }
});
