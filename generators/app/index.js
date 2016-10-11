'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');

var fs = require('fs');
var mkdirp = require('mkdirp');

var spawn = require('child_process').spawnSync;
var exec = require('child_process').execSync;

module.exports = yeoman.generators.Base.extend({

  prompting: function(){

    var done = this.async();

    var default_author = exec('yarn config get init.author.name', {encoding: 'utf-8'}) || '';

    if(default_author.indexOf('\n') !== -1){
      default_author = default_author.split('\n')[0];
    }

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the splendid ' + chalk.red('Devine Project') + ' generator!'
    ));

    var prompts = [
      {
        type: 'input',
        name: 'projectname',
        message: 'Your project name',
        default: process.cwd().split(path.sep).pop()
      },{
        type: 'input',
        name: 'author',
        message: 'Your name',
        default: default_author
      },{
        type: 'confirm',
        name: 'test',
        message: 'Need testing (Mocha & Chai)? (Yes)',
        default: true
      },{
        type: 'confirm',
        name: 'hbs_client',
        message: 'Do you need templates on the client (Handlebars)? (No)',
        default: false
      },{
        when: function(response) {
          return !response.hbs_client;
        },
        type: 'confirm',
        name: 'react',
        message: 'Using React (with JSX)? (No)',
        default: false
      },{
        when: function(response) {
          return response.react;
        },
        type: 'confirm',
        name: 'react_router',
        message: 'Using react-router? (No)',
        default: false
      },{
        when: function(response) {
          return response.react;
        },
        type: 'confirm',
        name: 'redux',
        message: 'Using redux? (No)',
        default: false
      },{
        type: 'confirm',
        name: 'node',
        message: 'Do you need a Node server (Hapi)? (Yes)',
        default: true
      },{
        when: function(response) {
          return response.node;
        },
        type: 'confirm',
        name: 'hbs_server',
        message: 'Do you need templates on the server (Handlebars)? (No)',
        default: false
      },{
        when: function(response) {
          return response.node;
        },
        type: 'confirm',
        name: 'mongoose',
        message: 'Using MongoDB (Mongoose)? (No)',
        default: false
      },{
        when: function(response) {
          return response.node;
        },
        type: 'confirm',
        name: 'heroku',
        message: 'Make your project ready for Heroku deployment? (No)',
        default: false
      },{
        type: 'confirm',
        name: 'git',
        message: 'create a git repository (+ initial commit)? (Yes)',
        default: true
      }
    ];

    this.prompt(prompts, function(props){

      this.props = props;

      if(!this.props.hbs_server){
        this.hbs_server = false;
      }

      if(!this.props.heroku){
        this.heroku = false;
      }

      if(!this.props.mongoose){
        this.mongoose = false;
      }

      if(!this.props.react_router){
        this.react_router = false;
      }

      if(!this.props.redux){
        this.redux = false;
      }

      if(!this.props.react){
        this.react = false;
      }

      if(!this.props.test){
        this.test = false;
      }

      for(var prop in this.props){
        this[prop] = this.props[prop];
      }

      this.year = new Date().getFullYear();
      this.pwd = Math.random().toString(36).substring(5);

      done();

    }.bind(this));

  },

  _copy: function(file){
    this.fs.copyTpl(
      this.templatePath(file),
      this.destinationPath(file),
      this,
      {
        interpolate: /<%=([\s\S]+?)%>/g
      }
    );
  },

  writing: {

    app: function(){

      var files = [
        '_js/script.js',
        '_scss/style.scss', '_scss/_reset.scss'
      ];

      if(this.hbs_client){
        files.push('_hbs/helloworld.hbs');
      }

      if(this.hbs_client && !this.hbs_server){

        this.fs.copyTpl(
          this.templatePath('templates/helpers/uppercase.js'),
          this.destinationPath('_helpers/uppercase.js'),
          this,
          {
            interpolate: /<%=([\s\S]+?)%>/g
          }
        );

      }

      if(!this.node){

        files.push('index.html');

      }else{

        if(this.hbs_client){
          fs.mkdir('./_helpers');
        }

        files.push('server.js', 'routes/index.js',
          'routes/static.js',
          'plugins/index.js', 'plugins/helloplugin.js',
          'modules/validateFileName.js');

        if(this.mongoose){
          mkdirp('./models/mongoose');
        }

        files.push('routes/api.js');

        if(this.hbs_server){

          files.push('routes/views.js', 'templates/index.hbs',
            'templates/helpers/uppercase.js', 'templates/helpers/section.js',
            'templates/partials/welcome.hbs');

          this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath('templates/layouts/layout.hbs'),
            this,
            {
              interpolate: /<%=([\s\S]+?)%>/g
            }
          );

        }else{

          this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath('public/index.html'),
            this,
            {
              interpolate: /<%=([\s\S]+?)%>/g
            }
          );

        }

        fs.mkdir('./models');

      }

      if(this.test){
        fs.mkdir('./test');
      }

      if(this.react){

        files.push('./_js/components/index.js');
        files.push('./_js/components/HelloWorld.jsx');

        if(this.react_router){
          files.push('./_js/router/index.js');
          files.push('./_js/pages/index.js');
          files.push('./_js/pages/Home.jsx');
        }

        if(this.redux){
          mkdirp('./_js/actions');
          mkdirp('./_js/constants');
          mkdirp('./_js/containers');
          mkdirp('./_js/reducers');
          mkdirp('./_js/store');
        }


      }

      for(var i = 0; i < files.length; i++){
        this._copy(files[i]);
      }

    },

    projectfiles: function(){

      var files = [
        '.babelrc', '.editorconfig',
        '.eslintignore',
        '_config.js', 'webpack.config.js',
        'package.json',
        'README.md', 'LICENSE'
      ];

      if(this.node){

        files.push('nodemon.json', '.env');

        if(this.heroku){
          files.push('Procfile', '.slugignore');
        }
      }

      for(var i = 0; i < files.length; i++){
        this._copy(files[i]);
      }

      this.fs.copyTpl(
        this.templatePath('_.eslintrc'),
        this.destinationPath('.eslintrc'),
        this,
        {
          interpolate: /<%=([\s\S]+?)%>/g
        }
      );

      if(this.git){

        this.fs.copyTpl(
          this.templatePath('_gitignore'),
          this.destinationPath('.gitignore'),
          this,
          {
            interpolate: /<%=([\s\S]+?)%>/g
          }
        );

      }

    }

  },

  install: function(){

    if(this.git){
      spawn('git', ['init'], { stdio: 'inherit' });
    }

    spawn('yarn', ['install'], { stdio: 'inherit' });

    spawn('webpack', { stdio: 'inherit' });

    if(this.git){
      spawn('git', ['add', '.'], { stdio: 'inherit' });
      spawn('git', ['commit', '-m', '"initial commit"'], { stdio: 'inherit' });
    }

    spawn('yarn', ['run', 'development'], { stdio: 'inherit' });

  }

});
