const express = require('express');
const apiRouter = express.Router();
const {UrlShorts} = require('./model');
const {lookup} = require('dns');
const url = require('url');

apiRouter.post('/shorturl', (req, res) => {
  const url_input = req.body.url;
  const urlRegex = new RegExp(/(?<=(http|https):\/\/)[^\/]+/)
  if(!url_input.match(urlRegex)) return res.json({error: 'Invalid URL'});
  try { 
    const url_string = new URL(url_input);
    lookup(url_string.hostname, (err, _, __) => {
      if (err) return res.json({error: 'invalid url'});
      postNewUrl(req, res, url_input);
    })
  }
  catch (err) {
    return res.json({error: 'invalid url'});
  }
});

const postNewUrl = (req, res, url_input) => {
  UrlShorts.find({longUrl: url_input}, (err, doc) => {
    if (err) return res.status(400).json({status: 'failed to find', error: err});
    if (doc.length > 0) {
      console.log('url present already', doc[0].shortUrl);
      return res.status(204).send();
    };
    UrlShorts
    .find({})
    .select('shortUrl')
    .sort({shortUrl: -1})
    .limit(1)
    .exec((err, doc) => {
      if (err) return res.json({status: 'failed to get max', error: err});
      const shortUrl = (doc.length === 0) ? 0 : doc[0].shortUrl + 1;
      UrlShorts.create({longUrl: url_input, shortUrl}, (err, doc) => {
        if (err) return res.json({status: 'failed to create', error: err});
        res.json({original_url: url_input, short_url: doc.shortUrl});
      });    
    })
  })
}; 

apiRouter.get('/shorturl/:num', (req, res) => {
  UrlShorts.findOne({shortUrl: req.params.num}, (err, doc) => {
    if (err) return res.json({status: 'failed', error: err});
    res.redirect(doc.longUrl)
  });
});

apiRouter.get('/shorturls', (req, res) => {
  UrlShorts.find({}, (err, docs)=> {
    if (err) return res.json({status: 'failed retrieval', error: err});
    res.json({status: 'success', docs})
  })
})

exports.router = apiRouter;