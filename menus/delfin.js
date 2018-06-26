'use strict';

const request = require('request');
const _ = require('lodash');
const async = require('async');
const Q = require('q');
const moment = require('moment');

const config = {
    url: 'http://restauraciadelfin.sk/aktualne-denne-menu'
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

                moment.locale("sk");

                body = _.split(body, moment().format('dddd').toUpperCase())[1];
                body = _.split(body, '<br></p>')[0];

                body = _.split(body, '<br>');
                body = _.compact(_.first(_.chunk(body, 7)));
                
                _.each(body, (row, key) => {

                    row = _.replace(row, /&nbsp;/g, ' ');
                    row = _.replace(row, /\r\n/g, ' ');

                    if (key === 1) {

                        return result.push({
                            name: row,
                            type: 'soup'
                        });

                    } else if (key > 1) {

                        row = _.split(row, '. ')[1];

                        result.push({
                            name: row,
                            type: 'meal'
                        });
                    }

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
