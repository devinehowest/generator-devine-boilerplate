const path = require(`path`);

const webpack = require(`webpack`);<% if (!node) { %>
const {HotModuleReplacementPlugin} = webpack;<% } %>
const {UglifyJsPlugin} = webpack.optimize;

const CopyWebpackPlugin = require(`copy-webpack-plugin`);
const ExtractTextWebpackPlugin = require(`extract-text-webpack-plugin`);
const configHtmls = require(`webpack-config-htmls`)();

const extractCSS = new ExtractTextWebpackPlugin(`css/style.css`);

// change for production build on different server path
const publicPath = `/`;<% if (!node) { %>

const port = 3000;<% } %>

// hard copy assets folder for:
// - srcset images (not loaded through html-loader )
// - json files (through fetch)
// - fonts via WebFontLoader

const copy = new CopyWebpackPlugin([{
  from: `./src/assets`,
  to: `assets`
}], {
  ignore: [ `.DS_Store` ]
});

const config = {
  <% if (!node) { %>
  // no HTML entry points for production build (bundled in JavaScript)<% } %>
  entry: [<% if (!node) { %>
    require.resolve(`react-dev-utils/webpackHotDevClient`),<% } %>
    `./src/css/style.css`,
    `./src/js/script.js`
  ],

  resolve: {
    // import files without extension import ... from './Test'
    extensions: [`.js`, `.jsx`, `.css`]
  },

  output: {
    path: path.join(__dirname, <% if (node) { %>`server`, `public`<% } else { %>`dist`<% } %>),
    filename: `js/[name].[hash].js`,
    publicPath
  },

  devtool: `source-map`,<% if (!node) { %>

  devServer: {
    contentBase: `./src`,
    historyApiFallback: true, // for use with client side router
    hot: true,
    port
  },<% } %>

  module: {

    rules: [
      {
        test: /\.css$/,
        <% if (node) { %>loader<% } else { %>use<% } %>: <% if (node) { %>extractCSS.extract(<% } %>[
          <% if (!node) { %>`style-loader`,
          <% } %>{
            loader: `css-loader`,
            options: {
              importLoaders: 1
            }
          },
          {
            loader: `postcss-loader`
          }
        ]<% if (node) { %>)<% } %>
      },
      {
        test: /\.html$/,
        loader: `html-loader`,
        options: {
          attrs: [
            `audio:src`,
            `img:src`,
            `video:src`,
            `source:srcset`
          ] // read src from video, img & audio tag
        }
      },
      {
        test: /\.(jsx?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: `babel-loader`
          },
          {
            loader: `eslint-loader`,
            options: {
              fix: true
            }
          }
        ]
      },
      {
        test: /\.(svg|png|jpe?g|gif|webp)$/,
        loader: `url-loader`,
        options: {
          limit: 1000, // inline if < 1 kb
          context: `./src`,
          name: `[path][name].[ext]`
        }
      },
      {
        test: /\.(mp3|mp4|wav)$/,
        loader: `file-loader`,
        options: {
          context: `./src`,
          name: `[path][name].[ext]`
        }
      }
    ]

  },

  plugins: [<% if (node) { %>
    extractCSS,
    copy<% } else { %>
    new HotModuleReplacementPlugin()<% } %>
  ]

};

if (process.env.NODE_ENV === `production`) {<% if (!node) { %>

  //remove hot reloading client
  config.entry.shift();

  //remove CSS rule and add new one, css in external file
  config.module.rules.shift();
  config.module.rules.push({
    test: /\.css$/,
    loader: extractCSS.extract([
      {
        loader: `css-loader`,
        options: {
          importLoaders: 1
        }
      },
      {
        loader: `postcss-loader`
      }
    ])
  });<% } %>

  //image optimizing
  config.module.rules.push({
    test: /\.(svg|png|jpe?g|gif)$/,
    loader: `image-webpack-loader`,
    enforce: `pre`
  });

  config.plugins = [<% if (node) { %>
    ...config.plugins<% } else { %>
    extractCSS,
    copy<% } %>,
    new UglifyJsPlugin({
      sourceMap: true, // false returns errors.. -p + plugin conflict
      comments: false
    })
  ];

} else {<% if (!node) { %>

  // only include HTMLs in NODE_ENV=development
  // for Hot Reloading
  config.entry = [...config.entry, ...configHtmls.entry];<% } %>

  config.performance = {
    hints: false
  };

}

config.plugins = [...config.plugins, ...configHtmls.plugins];

module.exports = config;
