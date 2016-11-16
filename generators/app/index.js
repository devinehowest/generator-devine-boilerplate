const generator = require(`yeoman-generator`);

const {isPlainObject} = require(`lodash`);

const {
  spawnSync: spawn,
  execSync: exec
} = require(`child_process`);

const mkdir = require(`mkdirp`);

module.exports = generator.Base.extend({

  _spawn(cmd) {

    const parts = cmd.split(` `);
    const [first, ...rest] = parts;

    spawn(first, rest, {stdio: `inherit`});

  },

  _copyFile(f) {

    let from = f;
    let to = f;

    if (isPlainObject(f)) ({from, to} = f);

    this.fs.copyTpl(
      this.templatePath(from),
      this.destinationPath(to),
      this.props,
      {
        interpolate: /<%=([\s\S]+?)%>/g
      }
    );

  },

  _createDir(d) {

    mkdir(d, e => {
      if (e) console.error(e);
    });

  },

  initializing() {

    this.props = {

      react: false,
      redux: false,
      reactRouter: false,

      node: false,
      mongo: false,
      heroku: false,

      jest: false,
      api: false,
      jwt: false,

      yarn: true,

      nodeVersion: process.version.split(`v`)[1],

      secret: Math.random().toString(36).substring(5) + Math.random().toString(36).substring(5)

    };

    try {
      exec(`yarn --version >/dev/null 2>&1`, {encoding: `utf8`});
    } catch (e) {
      this.props.yarn = false;
    }

  },

  prompting() {

    return this.prompt([{
      type: `input`,
      name: `name`,
      message: `Your project name`,
      default: this.appname
    }, {
      type: `confirm`,
      name: `react`,
      default: false,
      message: `Do you need React? (No)`
    }, {
      when: r => r.react,
      type: `confirm`,
      name: `reactRouter`,
      default: false,
      message: `with React-Router? (No)`
    }, {
      when: r => r.react,
      type: `confirm`,
      name: `redux`,
      default: false,
      message: `with Redux? (No)`
    }, {
      type: `confirm`,
      name: `node`,
      default: false,
      message: `Do you need a Node server? (Hapi) (No)`
    }, {
      when: r => r.node,
      type: `confirm`,
      name: `mongo`,
      default: false,
      message: `with MongoDB? (Mongoose) (No)`
    }, {
      when: r => r.mongo,
      type: `confirm`,
      name: `api`,
      default: false,
      message: `Do you need an API? (No)`
    }, {
      when: r => r.api,
      type: `confirm`,
      name: `jwt`,
      default: false,
      message: `with authentication? (JWT)? (No)`
    }, {
      when: r => r.node,
      type: `confirm`,
      name: `heroku`,
      default: false,
      message: `ready for deployment to Heroku? (No)`
    }, {
      type: `confirm`,
      name: `jest`,
      default: false,
      message: `need testing? (Jest) (No)`
    }]).then(props => {
      this.props = Object.assign(this.props, props);
    });

  },

  writing: {

    appFiles() {

      const css = [
        `src/css/reset.css`,
        `src/css/style.css`
      ];

      const js = [
        `src/js/script.js`
      ];

      const html = [
        `src/index.html`
      ];

      let files = [
        ...css,
        ...html,
        ...js
      ];

      const react = [
        `src/js/containers/App.jsx`,
        `src/js/containers/index.js`
      ];

      const reactRouter = [
        `src/js/pages/Home.jsx`,
        `src/js/pages/index.js`
      ];

      const redux = [
        `src/js/store/index.js`
      ];

      const node = [

        `server/lib/pluginHandler.js`,
        `server/lib/isValidName.js`,

        `server/modules/index.js`,
        `server/routes/index.js`,

        `server/index.js`

      ];

      const reactRouterNode = [
        `server/routes/static/spa.js`
      ];

      const noReactRouterNode = [
        `server/routes/static/public.js`
      ];

      const mongo = [
        `server/modules/mongoose/index.js`
      ];

      const jwt = [

        `server/modules/token/index.js`,

        `server/modules/mongoose/const/Scopes.js`,
        `server/modules/mongoose/models/User.js`,

        `server/routes/api/_example.js`,
        `server/routes/api/auth.js`,
        `server/routes/api/notFound.js`,
        `server/routes/api/users.js`

      ];

      if (this.props.react) {

        files = [
          ...files,
          ...react
        ];

        if (this.props.reactRouter) {

          files = [
            ...files,
            ...reactRouter
          ];

        }

        if (this.props.redux) {

          files = [
            ...files,
            ...redux
          ];

        }

      }

      if (this.props.node) {

        files = [
          ...files,
          ...node
        ];

        if (this.props.mongo) {

          files = [
            ...files,
            ...mongo
          ];

          if (this.props.api) {

            if (this.props.jwt) {

              files = [
                ...files,
                ...jwt
              ];

            }

          }

        }

        if (this.props.reactRouter) {

          files = [
            ...files,
            ...reactRouterNode
          ];

        } else {

          files = [
            ...files,
            ...noReactRouterNode
          ];

        }

      }

      files.forEach(f => this._copyFile(f));

    },

    appDirs() {

      let dirs = [];

      const node = [
        `server/public`,
        `server/uploads`
      ];

      const noNode = [
        `dist`
      ];

      const react = [
        `src/js/components`
      ];

      const redux = [
        `src/js/actions`,
        `src/js/constants`,
        `src/js/reducers`
      ];

      const jest = [
        `__tests__`
      ];

      const mongo = [
        `server/modules/mongoose/models`
      ];

      const api = [
        `server/routes/api`
      ];

      if (this.props.node) {

        if (this.props.api) {

          dirs = [
            ...dirs,
            ...api
          ];

        }

        dirs = [
          ...dirs,
          ...node
        ];

        if (this.props.mongo && !this.props.jwt) {

          dirs = [
            ...dirs,
            ...mongo
          ];


        }

      } else {

        dirs = [
          ...dirs,
          ...noNode
        ];

      }

      if (this.props.react) {

        dirs = [
          ...dirs,
          ...react
        ];

        if (this.props.redux) {

          dirs = [
            ...dirs,
            ...redux
          ];

        }

      }

      if (this.props.jest) {

        dirs = [
          ...dirs,
          ...jest
        ];

      }

      dirs.forEach(d => this._createDir(d));

    },

    settings() {

      const eslint = [
        `.eslintignore`,
        `.eslintrc`,
      ];

      const editor = [
        `.editorconfig`
      ];

      const git = [
        `README.md`,
        {from: `_gitignore`, to: `.gitignore`}
      ];

      const babel = [
        `.babelrc`
      ];

      const postcss = [
        `postcss.config.js`
      ];

      const stylelint = [
        `.stylelintrc`
      ];

      const webpack = [
        `webpack.config.js`
      ];

      const npm = [
        {from: `_package.json`, to: `package.json`}
      ];

      let files = [
        ...eslint,
        ...git,
        ...babel,
        ...postcss,
        ...stylelint,
        ...webpack,
        ...npm,
        ...editor
      ];

      if (this.props.node) {

        const node = [
          `.env`,
          `nodemon.json`,
        ];

        files = [
          ...files,
          ...node
        ];

      }

      files.forEach(f => this._copyFile(f));

    }

  },

  install() {

    this._spawn(`git init`);

    if (this.props.yarn) this._spawn(`yarn`);
    else this._spawn(`npm install`);

    this._spawn(`git add .`);
    this._spawn(`git commit -m "initial"`);

    if (this.props.heroku) {
      this._spawn(`heroku create`);
      if (this.props.yarn) {
        this._spawn(`heroku buildbacks:set https://github.com/heroku/heroku-buildpack-nodejs#yarn`);
      }
    }

    this._spawn(`npm run development`);

  }

});
