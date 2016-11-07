const fs = require(`fs`);
const path = require(`path`);

const pluginHandler = require(`../lib/pluginHandler`);
const isValidName = require(`../lib/isValidName`);

module.exports.register = (server, options, next) => {

  fs.readdirSync(__dirname).forEach(f => {

    /** if DIR, load index.js **/
    const stat = fs.lstatSync(path.join(__dirname, f));
    if (stat.isDirectory() && !f.startsWith(`_`)) {
      server.register(require(path.join(__dirname, f)), pluginHandler);
    }

    if (!isValidName(f)) return;

    server.register(require(`./${f}`), pluginHandler);

  });

  server.register(require(`inert`), pluginHandler);

  next();

};

module.exports.register.attributes = {
  name: `modules`,
  version: `0.1.0`
};
