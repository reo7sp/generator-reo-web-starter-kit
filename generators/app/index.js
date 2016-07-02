'use strict';

var yeoman = require('yeoman-generator');
var path = require('path');
var mkdirp = require('mkdirp');
var extend = require('extend');

module.exports = yeoman.Base.extend({
  initializing: function () {
    this.props = {};
  },

  prompting: function () {
    var prompts = [{
      name: 'name',
      message: 'Site name',
      default: path.basename(process.cwd())
    }, {
      name: 'author',
      message: 'Author of site',
      default: ''
    }];

    return this.prompt(prompts).then(function (props) {
      this.props = props;
    }.bind(this));
  },

  cd: function () {
    if (path.basename(this.destinationPath()) !== this.props.name) {
      mkdirp(this.destinationPath(this.props.name));
      this.destinationRoot(this.destinationPath(this.props.name));
    }
  },

  writing: function () {
    this.remote('reo7sp', 'reo-web-starter-kit', function (err, remote) {
      if (err) {
        throw err;
      }

      remote.directory('.', this.destinationPath());

      var packageJson = this.fs.readJSON(this.destinationPath('package.json'));
      extend(packageJson, {
        name: this.props.name,
        description: '',
        author: this.props.author
      });
      ['repository', 'bugs', 'homepage'].forEach(function (it) {
        delete packageJson[it];
      });
      this.fs.writeJSON(this.destinationPath('package.json'), packageJson);

      ['LICENSE', 'README.md'].forEach(function (it) {
        this.fs.delete(this.destinationPath(it));
      }.bind(this));
    }.bind(this));
  },

  install: function () {
    this.installDependencies({bower: false});
  }
});
