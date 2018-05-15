'use strict';

const request = require('request');
const _ = require('lodash');
const async = require('async');
const Q = require('q');
const moment = require('moment');
const striptags = require('striptags');

const config = {
    url: 'http://www.restaurantpresto.sk/sk/menu/presto-b-v/' + moment().format('D.M.YYYY') + '/'
};

const get = () => {

    let defer = Q.defer();

    async.waterfall([

        (callback) => {

            request(config.url, (error, response, body) => {

                if (error) {
                    return callback(error);
                }

                callback(null, body);

            });

        },

        (body, callback) => {

            let result = [];

            let soups = _.split(body, '<h2 class="blue-bg"><strong>Polievka</strong></h2>')[1];
            soups = _.split(soups, '</section>')[0];
            soups = soups.match(/<h3>(.*?)<\/h3>/g);

            _.each(soups, (row) => {

                row = _.split(row, '<small class="allergens">')[0];
                row = _.trim(striptags(row));

                result.push({
                    name: row,
                    type: 'soup'
                })

            });

            let meal = _.split(body, '<h2 class="green-bg"><strong>Hlavné jedlo</strong></h2>')[1];
            meal = _.split(meal, '</section>')[0];
            meal = meal.match(/<h3>(.*?)<\/h3>/g);

            _.each(meal, (row) => {

                row = _.split(row, '<small class="allergens">')[0];
                row = _.trim(striptags(row));

                result.push({
                    name: row,
                    type: 'meal'
                })

            });

            callback(null, result);

        }
    ],
        (error, result) => {

            if (error) {
                return defer.reject(error);
            }

            defer.resolve(result);

        });

    return defer.promise;

};

module.exports = {
    get: get
};
