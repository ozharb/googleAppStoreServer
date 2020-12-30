'use strict';

const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common')); // let's see what 'common' format looks like
const apps = require('./playstore.js');

app.get('/apps', (req, res) => {
  const { sort, genre='' } = req.query;

 
 
  let results = apps
    .filter(item =>
      item
        .Genres
        .toLowerCase()
        .includes(genre.toLowerCase()));


  if (sort) {
    if (!['Rating', 'App'].includes(sort)){
      return res
        .status(400)
        .send('Sort absolutely must be "Rating or "App"! It simply must.');
    }
 
    results = apps.sort((curr, next) =>{ 
      if (curr[sort] < next[sort]) {
        return -1;
      } else if(next[sort] < curr[sort]){
        return 1;
      } else return 0;
    });
  }  

    
  res
    .json(results);
});

module.exports = app;
