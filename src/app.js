const path = require("path");
const express = require("express");
const dotenvExtended = require("dotenv-extended");
const dotenvParseVariables = require("dotenv-parse-variables");

// helper functions
const { getCustomDataBackend } = require("./helpers.js");

// load .env variables
dotenvParseVariables(
  dotenvExtended.load({
    // assign variables to process.env object for accessibility
    assignToProcessEnv: true,
    // displays "missing .env file", no need in production, where we use real env variables
    silent: process.env.APP_ENV === "production",
    errorOnMissing: true,
    // also use process.env to fill variables in, only in production
    includeProcessEnv: process.env.APP_ENV === "production"
  })
);

// instantiate an Algolia client
const algoliasearch = require("algoliasearch");
const algoliaClient = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_SEARCH_API_KEY
);

const app = express();
const port = process.env.PORT;

// define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");

// setup handlebars
app.set("view engine", "hbs"); // set templating engine
app.set("views", viewsPath); // point to custom views directory instead of /views

// setup static directory to serve
app.use(express.static(publicDirectoryPath));

// setup body parsing
app.use(express.json());

// Index view
app.get("/", (req, res) => {
  res.render("index");
});

// Search endpoint
app.post("/search", async ({ body }, res) => {
  try {
    const { requests } = body;
    const algoliaResults = await algoliaClient.search(requests);
    const results = {
      ...algoliaResults,
      results: algoliaResults.results.map((result) => {
        return {
          ...result,
          hits: result.hits.map((hit) => {
            return {
              ...hit,
              // hydrate with data here
              // `getCustomDataBackend()` is a proxy for retrieving data from your own database
              backendCustomData: getCustomDataBackend()
            };
          })
        };
      })
    };
    res.status(200).send(results);
  } catch (error) {
    return next(error);
  }
});

// Search for facet values endpoint
app.post("/sffv", async ({ body }, res) => {
  try {
    const { requests } = body;
    const results = await algoliaClient.searchForFacetValues(requests);
    res.status(200).send(results);
  } catch (error) {
    return next(error);
  }
});

app.listen(port, () => {
  console.log(`Server is up on Port ${port}`);
});
