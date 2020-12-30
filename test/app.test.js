'use strict';

const { expect } = require('chai');
const supertest = require('supertest');
const { get } = require('../app');
const app = require('../app');
const apps = require('../playstore');

describe('the google apps server', () => {
  it('should return an array of objects',()=>{
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        // make sure you get an array
        expect(res.body).to.be.an('array');
        // array must not be empty
        expect(res.body).to.have.lengthOf.at.least(1);
      });
  });
  const validSorts = ['Rating', 'App'];
  validSorts.forEach(validSort => {
    it(`should return ${validSort}-sorted array if sort query requested`, ()=>{
      return supertest(app)
        .get('/apps')
        .query({ sort: validSort })
        .expect(200)
        .then(res => {
          expect (res.body).to.be.an('array');
          let i = 0, sorted = true;
          while (sorted && i < res.body.length -1) {
            sorted = res.body[i].validSort <  res.body[i+1].validSort || res.body[i].validSort >  res.body[i+1].validSort || res.body[i].validSort ===  res.body[i+1].validSort;
            i++;
          }
          expect(sorted).to.be.true;
        });
    });
  });
  const validGenres = apps.map(item => item.Genres);
  validGenres.forEach( validGenre => {
    it(`should return ${validGenre}-filtered array if genre query requested`, () => {
      
      return supertest(app)
        .get('/apps')
        .query({ genre: validGenre})
        .expect(200)
        .then (res => {
          expect (res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf.at.least(1);
          const firstApp = res.body[0];
          expect(firstApp.Genres).to.include(validGenre);
        });
    

    });
  });
});

