const express = require('express');
const { CommandFailedEvent } = require('mongoose/node_modules/mongodb');
const apiRouter = express.Router();
const UrlShorts = require('./model')

apiRouter.post('/shorturl', (req, res) => {
  const url_input = req.body.url_input;
  UrlShorts.create({longUrl: url_input}, (err, doc) => {
      if (err) return res.json({status: 'failed', error: err});
      res.json({status: 'success', shortUrl: doc.shortUrl});
  }); 
  res.end();
})

apiRouter.get('/shorturl/:num', (req, res) => {
  UrlShorts.findOne({shortUrl: req.params.num}, (err, doc) => {
    if (err) return res.json({status: 'failed', error: err});
    res.redirect(doc.longUrl)
  });
});

exports.apiRouter = apiRouter;