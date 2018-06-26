'use strict';

const request = require('request');
const _ = require('lodash');
const async = require('async');
const Q = require('q');
const moment = require('moment');

const config = {
    url: 'http://buddies.sk/denne-menu/'
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
                body = _.split(body, '<p class="bodytext">')[0];
                body = _.split(_.replace(body, /&nbsp;/g, ' '), '</p>');

                _.each(body, (row) => {

                    row = _.trim(row);

                    if (/[0-9],[0-9]{2}l/g.test(row)) {

                        row = _.split(row, ' ');
                        row.shift();
                        row = _.join(row, ' ');

                        result.push({
                            name: row,
                            type: 'soup'
                        })
                    }

                    if (/[0-9]{3}g/g.test(row)) {

                        row = _.split(row, ' ');
                        row.shift();
                        row = _.join(row, ' ');

                        result.push({
                            name: row,
                            type: 'meal'
                        })
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
