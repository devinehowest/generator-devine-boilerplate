const path = require(`path`);
const glob = require(`glob`);

module.exports.register = (server, options, next) => {
  glob(
    path.join(__dirname, `**/*.js`),
    {ignore: [`**/*/index.js`, `**/*/_*.js`]},
    (err, files) => files.forEach(f => server.route(require(f)))
  );

  next();
};

module.exports.register.attributes = {
  name: `routes`,
  version: `0.1.0`
};
