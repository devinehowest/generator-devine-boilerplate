module.exports = [

  {

    method: `GET`,
    path: `/{param*}`,

    handler: {
      file: `index.html`
    }

  },

  {

    method: `GET`,
    path: `/css/{param*}`,

    handler: {
      directory: {
        path: `./css`
      }
    }

  },

  {

    method: `GET`,
    path: `/js/{param*}`,

    handler: {
      directory: {
        path: `./js`
      }
    }

  },

  {

    method: `GET`,
    path: `/assets/{param*}`,

    handler: {
      directory: {
        path: `./assets`
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
