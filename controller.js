// require mongoose models
const URLModel = require("./models/urls");
const counter = require("./models/counter");

// require DNS module
const dns = require("dns");

// POST request to /api/shorturl/
exports.add_new_url = [
  // check for protocol and WWW
  (req, res, next) => {
    const urlPattern = /^http(s?):\/\/www\./;
    if (!req.body.url.match(urlPattern)) {
      return res.status(400).json({ error: "invalid url" });
    }
    // console.log(`URL is ${req.body.url}`);
    req.body.hostName = new URL(req.body.url).hostname.replace("www.", "");
    // console.log(`host name is: ${req.body.hostName}`);
    return next();
  },
  // verify submitted href
  (req, res, next) => {
    dns.lookup(req.body.hostName, (err) => {
      // console.log(`THIS IS THE ERROR: ${err}`);
      if (err) return res.status(400).json({ error: "invalid url" });
    });
    return next();
  },
  // process request
  (req, res, next) => {
    // get a new number
    counter.findOneAndUpdate(
      { _id: "URL Counter" },
      { $inc: { seq_value: 1 } },
      { returnNewDocument: true, upsert: true },
      (err, data) => {
        if (err) return console.error(err);
        const url = new URLModel({
          original_url: req.body.url,
          short_url: data.seq_value,
        });
        url.save((err, data) => {
          if (err) return console.error(err);
          res.json({
            original_url: data.original_url,
            short_url: data.short_url,
          });
        });
      }
    );
  },
];

// GET request to api/shorturl/:short_url
exports.redir_to_url = (req, res, next) => {
  URLModel.findOne(
    { short_url: req.params.short_url },
    "original_url",
    (err, data) => {
      if (err) return console.error(err);
      res.redirect(data.original_url);
    }
  );
};
