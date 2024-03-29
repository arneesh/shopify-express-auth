# shopify-express-auth


[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/shopify-express-auth.svg)](https://badge.fury.io/js/shopify-express-auth)

Middleware to authenticate an Express application with Shopify. Works in sync with [```@shopify/shopify-api```](https://npmjs.com/package/@shopify/shopify-api) **version 2.0.0**

Why do I need this? What does this middleware do?

* **Auth Generation** - *This middleware creates the required oauth and session required to run your Shopify app, in case the current oauth/session is expired it creates a new one.*
* **Request Validation** - *This middleware validates all the API calls you make from your client-side to your express backend and secures your backend from malicious activity*


## Prerequisite

Make sure you have already installed [```@shopify/shopify-api```](https://npmjs.com/package/@shopify/shopify-api) **version 2.0.0** . In case you have not installed it yet. Use the following command to install it

**npm**
```bash
npm install @shopify/shopify-api@2.0.0
```

**yarn**
```bash
yarn add @shopify/shopify-api@2.0.0
```

**Initialize** [```@shopify/shopify-api```](https://npmjs.com/package/@shopify/shopify-api)

```js
import Shopify, {ApiVersion} from '@shopify/shopify-api';

Shopify.Context.initialize({
  API_KEY: 'YOUR_APP_API_KEY',
  API_SECRET_KEY: 'YOUR_APP_API_SECRET_KEY',
  SCOPES: ['APP_SCOPES'],
  HOST_NAME: ('YOUR_HOST').replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.July21,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});
```
 **Note:** Make sure you replace
 
 ```js
SESSION_STORAGE: new Shopify.Session.MemorySessionStorage()
 ```
by 
```js
SESSION_STORAGE: new Shopify.Session.CustomSessionStorage(
    'YOUR_CUSTOM_STORAGE'.storeCallback,
    'YOUR_CUSTOM_STORAGE'.loadCallback,
    'YOUR_CUSTOM_STORAGE'.deleteCallback)
```
in production environment once you have set up your Custom Session storage. ```MemorySessionStorage()``` should work fine in development environment.


## Installation
Once you have satisfied all the prerequisite conditions, install this package via:

**npm**
```bash
npm install shopify-express-auth
```

**yarn**
```bash
yarn add shopify-express-auth
```

## Usage

**Authenticate your app**

Add authentication function of this  middleware to your express app as a middleware. This function handles creating/re-creating oauth and session.

**Sample**

```js
const express = require("express");
const app = express();
...
...
...
app.use(
  shopifyAuth({
    // Default path prefix is '' i.e  the paths become /auth and /auth/callback
    // Incase your want to modify the base path due to some reason you can modify it by specifying a prefix value - such as /shopify
    // When /shopify prefix is added the paths will become /shopify/auth and /shopify/auth/callback
    prefix: '',
    // set access mode. Allowed values are 'online' and 'offline'. Note: online tokens expire every 24 hours and you will need to re-validate
    // if want the developed hassle free - keep the accessMode as 'offline'
    accessMode: 'offline',
    // Callback for when the auth procedure is complete. 
    afterAuth(req, res) {
      const { shop, accessToken } = req.shopify;

      console.log('The access token is: ', accessToken);

      res.redirect('/');
    },
  }),
);
```

Access the session information on `res.shopify` inside the `afterAuth` callback. Store the access token for future use - such as: for creating webhooks, retrieving order, customer information etc.

### `shopifyAuth` params

| Param | Options  | Description |
| :---:   | :-: | :-: |
| prefix | empty string/some custom route prefix string | If you want to add a customp prefix in the auth routes. |
| accessMode | offline/online | Corresponds to which access mode you want to use  |
| afterAuth() | - | A required callback function passed to **shopifyAuth**. After auth is successful, this callback function will be invoked and will contain the session information   |

**Note:** Online tokens expire every 24 hours and you will need to re-validate.

**Validate your API calls**

Use this middleware to authenticate all API calls you make from your app's frontend to your app's express backend. This middleware will check if a valid and active session token has been generated by your express app and your frontend has sent a valid & active `session token` along with the request or not.

Make sure you are using  [```@shopify/app-bridge```](https://www.npmjs.com/package/@shopify/app-bridge) v2.0.5 on the client side.

**Sample**

```js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const shopifyExpressAuth = require("shopify-express-auth");

router.post(
  "/create",
  shopifyExpressAuth.verifyRequest({ accessMode: "offline", returnHeader: false }),
  UserController.create
);

```

If the ```session/session token``` is not valid then the user will be redirected to the shopify oauth route (```/auth```) in order to generate a valid session.

### `verifyRequest` params

| Param | Options  | Description |
| :---:   | :-: | :-: |
| accessMode | offline/online | Checks for offline or online session |
| returnHeader | false/true | Returns re-auth headers on auth failure |

