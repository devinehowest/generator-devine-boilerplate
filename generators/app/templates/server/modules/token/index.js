const jwt = require(`jsonwebtoken`);

const {SECRET: key, URL: issuer} = process.env;

const pluginHandler = require(`../../lib/pluginHandler`);

module.exports.register = (server, options, next) => {

  server.register(require(`hapi-auth-jwt`), pluginHandler);

  server.decorate(`request`, `hasScope`, function(scope) {

    const req = this;

    const {auth} = req;

    if (auth.isAuthenticated) {

      const {credentials} = auth;

      if (Array.isArray(scope)) return scope.find(s => s === credentials.scope);
      else return scope === credentials.scope;

    }

    return false;

  });

  server.decorate(`reply`, `token`, function(user, {subject, audience, expiresIn = `7d`} = {}) {

    const reply = this;

    subject = `${subject}`;

    const token = jwt.sign(
      user,
      key,
      {
        expiresIn,
        issuer,
        audience,
        subject
      }
    );

    return reply({token});

  });

  server.auth.strategy(`token`, `jwt`, {key, verifyOptions: {
    issuer
  }});

  next();

};

module.exports.register.attributes = {
  name: `token`,
  version: `0.1.0`
};
