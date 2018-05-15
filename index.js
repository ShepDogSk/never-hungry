'use strict';

const commandLineArgs = require('command-line-args');

const chalk = require('chalk');
const _ = require('lodash');
const async = require('async');
const diacriticsRemove = require('diacritics').remove;

const Multispinner = require('multispinner');
const ConfigSearch = require('./config-search');

const MenuLanogi = require('./menus/lanogi');
const MenuPrestoB5 = require('./menus/presto-b-5');
const MenuPrestoBBC1 = require('./menus/presto-b-b-c-1');
const MenuBuddies = require('./menus/buddies');


const spinnersConfig = ['Lanogi', 'PrestoB5', 'PrestoBBC1', 'Buddies'];
const spinners = new Multispinner(spinnersConfig);


async.parallel({

    Lanogi: (callback) => {

        MenuLanogi.get().then((result) => {

            spinners.success('Lanogi');
            callback(null, result);

        }).catch((error) => {

            spinners.error('Lanogi');
            callback(error);

        });

    },

    PrestoB5: (callback) => {

        MenuPrestoB5.get().then((result) => {

            spinners.success('PrestoB5');
            callback(null, result);

        }).catch((error) => {

            spinners.error('PrestoB5');
            callback(error);

        });

    },

    PrestoBBC1: (callback) => {

        MenuPrestoBBC1.get().then((result) => {

            spinners.success('PrestoBBC1');
            callback(null, result);

        }).catch((error) => {

            spinners.error('PrestoBBC1');
            callback(error);

        });

    },

    Buddies: (callback) => {

        MenuBuddies.get().then((result) => {

            spinners.success('Buddies');
            callback(null, result);

        }).catch((error) => {

            spinners.error('Buddies');
            callback(error);

        });

    }

}, (error, results) => {

    spinners.on('done', () => {

        console.log(`${chalk.keyword('white')(_.pad('', 25, '-'))}`);

        let top = [];

        _.each(results, (items, source) => {

            let color = 'red';

            color = (source === 'Buddies') ? 'green' : color;
            color = (source === 'PrestoB5') ? 'yellow' : color;
            color = (source === 'PrestoBBC1') ? 'cyan' : color;
            color = (source === 'Lanogi') ? 'magenta' : color;

            _.each(items, (row) => {

                let icon = '';
                let text = row.name;
                let setTop = false;

                icon = (row.type === 'meal') ? '🍗' : icon;
                icon = (row.type === 'soup') ? '🍲' : icon;

                text = diacriticsRemove(text);
                text = _.lowerCase(text);

                _.each(ConfigSearch || [], (s) => {

                    if (text.indexOf(s.string) >= 0) {
                        text = _.replace(text, s.string, chalk[s.color](s.string));
                        setTop = true;
                    }

                });

                text = _.upperFirst(text);
                text = `[ ${chalk[color](source)} ] ${chalk.magenta(icon)}  ${chalk.gray(text)}`;

                if (setTop) {
                    top.push({
                        text: text,
                        source: source
                    });
                }

                console.log(text);

            });

            if(_.size(items) > 0){
                console.log(` `);
            }

        });

        console.log(`${chalk.white(_.pad('', 25, '-'))}`);

        _.each(top, (item) => {
            console.log(`${chalk.red('[ TOP ]')}${item.text}`);
        })

        console.log(`${chalk.white(_.pad('', 25, '-'))}`);

        process.exit(1);

    });

    spinners.on('err', () => {

        console.log(`${chalk.red(`Error`)}: No work no fun`);
        process.exit(1);

    });

});