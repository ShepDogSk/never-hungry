'use strict';

const request = require('request');
const _ = require('lodash');
const async = require('async');
const Q = require('q');
const moment = require('moment');
const striptags = require('striptags');

const config = {
    url: 'https://www.lanogi.sk/denne-menu/'
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

                body = _.split(body, moment().format("D.M.YYYY"))[1];
                body = _.split(body, '<div class="wpb_wrapper">')[1];
                body = _.split(body, '</div>')[0];
                body = _.trim(striptags(body));
                body = _.split(body, '\n');

                _.each(body, (row) => {

                    if (/[0-9],[0-9]{2}l/g.test(row)) {

                        row = _.split(row, ' ');
                        row.shift();
                        row = _.join(row, ' ');
                        row = _.trim(_.split(row, '/')[0]);

                        result.push({
                            name: row,
                            type: 'soup'
                        })
                    }

                    if (/[A-Z]:[0-9]{3}|[A-Z]: [0-9]{3}/g.test(row)) {

                        row = _.split(row, ' ');
                        row.shift();
                        row = _.join(row, ' ');
                        row = _.trim(_.split(row, '/')[0]);

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
