module.exports = [

  {

    method: `GET`,
    path: `/{param*}`,

    handler: {
      directory: {
        path: `.`,
        redirectToSlash: true,
        index: true
      }
    }

  },

  {

    method: `GET`,
    path: `/uploads/{param*}`,

    handler: {
      directory: {
        path: `../uploads`
      }
    }

  }

];
