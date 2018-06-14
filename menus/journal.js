'use strict';

const request = require('request');
const _ = require('lodash');
const async = require('async');
const Q = require('q');
const moment = require('moment');

const config = {
    url: 'http://www.journalrestaurant.sk/#menu'
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

                body = _.split(body, moment().format('D.M.YYYY'))[1];
                body = _.split(body, '<h3>')[0];

                body = _.split(body, '</p><p>');

                _.each(body, (row) => {

                    if (/[0-9],[0-9]{2} l/g.test(row)) {
                        //
                        row = _.split(row, '\t\t')[0];
                        row = _.replace(row, /\t/g, ' ');

                        row = _.split(row, 'l ');
                        row.shift();
                        row = _.join(row, ' ');

                        result.push({
                            name: row,
                            type: 'soup'
                        })
                    }

                    if (/[0-9]{3}g/g.test(row)) {

                        row = _.split(row, '\t\t')[0];
                        row = _.replace(row, /\t/g, ' ');

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
