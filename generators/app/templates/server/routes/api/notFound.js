const Boom = require(`Boom`);

module.exports = [

  {

    method: `GET`,
    path: `/api/{param*}`,

    handler: (req, res) => res(Boom.notFound())

  }

];
