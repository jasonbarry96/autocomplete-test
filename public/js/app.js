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

const autocompleteSearchBox = instantsearch.connectors.connectSearchBox(
  (props, isFirstRender) => {
    if (!isFirstRender) {
      return;
    }

    autocomplete({
      container: '#autocomplete',
      showCompletion: true,
      openOnFocus: true,
      initialState: {
         query: props.query
       },
       onSubmit({ state }) {
         props.refine(state.query);
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
          item({ item }) {
            //return h(<div>{item.name}</div>);
            return `${item.name}, Price: ${item.backendCustomData }`;
          },
        },
      }
      ];
      }
    });
  }
);

const search = instantsearch({
  indexName: "instant_search",
  searchClient
});

search.addWidgets([
  autocompleteSearchBox({
    container: "#autocomplete"
  }) /*,
  instantsearch.widgets.hits({
    container: "#hits",
    transformItems(items) {
      return items.map((item) => {
        return {
          ...item,
          // hydrate with data here
          frontendCustomData: "hydratedInFrontend"
        };
      });
    },
    templates: {
      item: `
    <article>
        <h1>{{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}</h1>
        <p>Custom: {{ backendCustomData }}</p>
        <p>Custom: {{ frontendCustomData }}</p>
    </article>
    `
    }
  })*/
]);

search.start();
