'use strict';

const menu = require('./menus/buddies');

menu.get().then((result) => {

    console.log('result',result);

    process.exit(0);

}).catch((error) => {

    console.log('error',error);
    process.exit(1);

});
