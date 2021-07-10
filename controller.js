// require mongoose models
const URL = require("./models/urls");
const counter = require("./models/counter");

// require express validator
const { body, validationResult } = require("express-validator");

// URL Post controller
exports.add_new_url = [
  // validate that it is proper URL
  body("url").isURL({ require_protocol: true }),

  (req, res, next) => {
    // get validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "invalid url" });
    }
    // get url
    counter.findOneAndUpdate(
      { _id: "URL Counter" },
      { $inc: { seq_value: 1 } },
      { returnNewDocument: true, upsert: true },
      (err, data) => {
        if (err) return console.error(err);
        const url = new URL({
          long_url: req.body.url,
          short_url: data.seq_value,
        });
        url.save((err, data) => {
          if (err) return console.error(err);
          res.json({
            original_url: data.long_url,
            short_url: data.short_url,
          });
        });
      }
    );
  },
];

// api/urlshortener/:short_url
exports.redir_to_url = (req, res, next) => {
  URL.findOne({ short_url: req.params.short_url }, "long_url", (err, data) => {
    if (err) return console.error(err);
    res.redirect(data.long_url);
  });
};
