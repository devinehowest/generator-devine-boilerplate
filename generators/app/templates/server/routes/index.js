const path = require(`path`);
const glob = require(`glob`);

module.exports.register = (server, options, next) => {

  const g = path.join(__dirname, `**/*.js`);

  glob(g, {ignore: [`**/*/index.js`, `**/*/_*.js`]}, (err, files) => {

    files.forEach(f => {

      const mod = {};
      mod[path.basename(f, `.js`)] = require(f);

      for (const route in mod) server.route(mod[route]);

    });

  });

  next();

};

module.exports.register.attributes = {
  name: `routes`,
  version: `0.1.0`
};
