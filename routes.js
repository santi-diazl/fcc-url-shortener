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

// POST - new URL
router.post('/', controller.postURL[0], controller.postURL[1],
    asyncRoute(controller.postURL[2]));

// GET -  short URL and redirect
router.get('/:short_url', controller.getURL);

module.exports = router;
