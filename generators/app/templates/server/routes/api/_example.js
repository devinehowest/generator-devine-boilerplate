const Scopes = require(`../../modules/mongoose/const/Scopes`);

const base = `/api`;

module.exports = [

  {

    method: `GET`,
    path: `${base}/test`,

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
