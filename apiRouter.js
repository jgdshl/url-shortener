const express = require('express');
const apiRouter = express.Router();
const {UrlShorts} = require('./model')

apiRouter.post('/shorturl', (req, res) => {
  console.log(req.body);
  const url_input = req.body.url;
  UrlShorts.create({longUrl: url_input}, (err, doc) => {
      if (err) return res.json({status: 'failed', error: err});
      res.json({status: 'success', shortUrl: doc.shortUrl});
  }); 
})

apiRouter.get('/shorturl/:num', (req, res) => {
  UrlShorts.findOne({shortUrl: req.params.num}, (err, doc) => {
    if (err) return res.json({status: 'failed', error: err});
    res.redirect(doc.longUrl)
  });
});

exports.router = apiRouter;