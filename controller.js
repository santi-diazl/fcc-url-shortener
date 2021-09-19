// Mongoose models
const URLS = require('./models/url');
const Counter = require('./models/counter');

const dns = require('dns');
const dnsPromises = dns.promises;
// checks that input URL is valid
const parseURL = (req, res, next) => {
  console.log(`input URL is: ${req.body.url}`);
  try {
    // if  URL parsing fails, will be caught by catch
    const url = new URL(req.body.url);
    if (!url.protocol.startsWith('http')) { // only accept http protocols
      throw new Error('invalid protocol, must be http[s]');
    }
    // if www in host name remove for dns.lookup() in next middleware function
    let hostName = url.hostname;
    if (hostName.startsWith('www')) {
      hostName = hostName.replace('www.', '');
    }
    req.body.hostName = hostName;
    next();
  } catch (err) {
    console.error(err);
    return res.json({error: 'invalid url'});
  }
};
// checks that input URL resolves
const resolveHost = (req, res, next) => {
  dnsPromises.lookup(req.body.hostName).then((resp) => {
    console.log(resp);
    next();
  }).catch((err) => { // error means not found
    console.error(err);
    res.json({error: 'invalid url'});
  });
};
// generates a short URL: http://example.com -> api/shorturl/13
const processReq = async (req, res, next) => {
  // get currentCount for short url (i.e /api/shorturl/currentCount)
  currentCount = await Counter.findOneAndUpdate(
      {_id: 'URL Counter'},
      {$inc: {seq_value: 1}},
      {returnNewDocument: true,
        upsert: true},
  ).exec();
  // save original and short
  const newURL = await new URLS({
    original_url: req.body.url,
    short_url: count.seq_value,
  }).save();
  // respond
  res.json({
    original_url: newURL.original_url,
    short_url: newURL.short_url,
  });
};

const postURL = [parseURL, resolveHost, processReq];
// redirects to original URL: api/shorturl/13 -> http://example.com
const getURL = async (req, res, next) => {
  // finds corresponding URL
  const url = await URLS.findOne({short_url: req.params.short_url}, // find URL
      'original_url').exec();
  res.redirect(url.original_url);
};

module.exports = {postURL, getURL};
