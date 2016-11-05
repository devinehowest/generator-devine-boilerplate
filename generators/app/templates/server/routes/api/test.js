const Scopes = require(`../../modules/mongoose/const/Scopes`);

module.exports = [
  {
    method: `GET`,
    path: `/api/test`,

    config: {

      auth: {
        strategy: `token`,
        scope: [Scopes.USER]
      }

    },

    handler: (req, res) => {
      return res(`ok`);
    }

  }
];
