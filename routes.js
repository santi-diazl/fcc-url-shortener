const express = require('express');
const router = express.Router();

// Composed function to wrap around async routes, if there is an error with
// async routes, it well be caught by Promise.catch(), with next function
// Being passed to it
// Shutout to David Sag of ITNEXT for elegant solution:
// (https://itnext.io/using-async-routes-with-express-bcde8ead1de8)
const asyncRoute = (route) => (req, res, next) =>
  Promise.resolve(route(req, res).catch(next));

// Controller
const controller = require('./controller');
const postFunctions = controller.postURL;
[verifyWWW, parseURL, resolveHost, processRequest] =
  [postFunctions[0], postFunctions[1], postFunctions[2], postFunctions[3]];

// POST - new URL
router.post('/', verifyWWW, parseURL, resolveHost, asyncRoute(processRequest));

// GET -  short URL and redirect
router.get('/:short_url', controller.getURL);

module.exports = router;
