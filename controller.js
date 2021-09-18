// Mongoose models
const URLS = require('./models/url');
const Counter = require('./models/counter');

const dns = require('dns');
const dnsPromises = dns.promises;

const verifyWWW = (req, res, next) => { // check that URL provided contains www
  // fcc requirement
  const url = req.body.url;
  if (!url.includes('www')) {
    console.error('www not in URL provided');
    return res.json({error: 'invalid url'});
  }
  next();
};

const parseURL = (req, res, next) => { // checks that URL is valid
  try { // if  URL parsing fails, will be caught by catch
    const url = new URL(req.body.url);
    // remove www for dns.lookup() in next middleware function
    req.body.hostName = url.hostname.replace('www.', '');
    next();
  } catch (err) {
    console.error(err);
    return res.json({error: 'invalid url'});
  }
};

const resolveHost = (req, res, next) => { // checks that URL points to real host
  dnsPromises.lookup(req.body.hostName).catch((err) => {
    console.error(err);
    return res.json({error: 'invalid url'});
  });
  next();
};

const processRequest = async (req, res, next) => {
  count = await Counter.findOneAndUpdate( // gets current count for short URL
      {_id: 'URL Counter'},
      {$inc: {seq_value: 1}},
      {returnNewDocument: true,
        upsert: true},
  ).exec();

  const url = new URLS({
    original_url: req.body.url,
    short_url: count.seq_value,
  });

  const newURL = await url.save();

  res.json({
    original_url: newURL.original_url,
    short_url: newURL.short_url,
  });
};

const postURL = [verifyWWW, parseURL, resolveHost, processRequest];

const getURL = async (req, res, next) => { // redirects to original URL
  const url = await URLS.findOne({short_url: req.params.short_url},
      'original_url').exec();
  res.redirect(url.original_url);
};

module.exports = {postURL, getURL};
