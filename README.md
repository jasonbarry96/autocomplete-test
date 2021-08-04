# algolia-backend-instantsearch-js-demo

Node.js and Express demo for backend InstantSearch

# Running Locally

1. Clone the repo:

```bash
$ git clone https://github.com/agdavid/algolia-backend-instantsearch-js-demo.git
```

2. Navigate into the root folder and install the node modules:

```bash
$ npm install
```

3. Copy the `.env.defaults` file and name it `.env` for your configuration variables:

```bash
$ cp .env.defaults .env
```

4. [ OPTIONAL: Default Credentials Included ] **Go to the [Algolia homepage](https://www.algolia.com/). In the top-right corner of the screen, click the "Login" button.** (If you don't already have an account, you can **create a new one for free [here](https://www.algolia.com/users/sign_up)**.)

5. [ OPTIONAL: Default Credentials Included ] Once you have signed into the Algolia Dashboard, navigate to the lefthand side of the screen and Select the **API keys** Link to find the Application ID and Search API Key. Set the following values in your `.env` file:

```
ALGOLIA_APP_ID=YOUR_APP_ID
ALGOLIA_SEARCH_API_KEY=YOUR_INDEX_NAME_OF_YOUR_CHOICE
```

6. Start the app and view it at `localhost:3000`:

```bash
$ npm run dev
```
