'use strict';

let fs = require('fs');
let validateFileName = require('../modules/validateFileName');

const pluginHandler = err => {
  if(err) console.error(err);
};

module.exports.register = (server, options, next) => {

  fs.readdirSync(__dirname).forEach(file => {
    if(!validateFileName(file)) return;
    server.register(require(`./${file}`), pluginHandler);
  });

  next();

};

module.exports.register.attributes = {
  name: 'plugins',
  version: '0.1.0'
};
