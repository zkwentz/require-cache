#!/usr/bin/env node
'use strict';
var nopt    = require('nopt');
var chalk   = require('chalk');
var path    = require('path');
var project = require('../');
var pkg     = require('../package.json');



var opts = nopt({
    help: Boolean,
    version: Boolean,
    config: path,
    assets: path,
    'base-url': path,
    baseUrl: path //alias
}, {
    h: '--help',
    v: '--version',
    c: '--config',
    a: '--assets',
    b: '--base-url',
});

if (opts['base-url']) {
    opts.baseUrl = opts['base-url'];
}

function init() {
    project(opts);
}


function help() {
    //to be continued...
}

function pre() {
    if (opts.version) {
        return console.log(pkg.version);
    }
    
    if (opts.help) {
        return console.log(help());
    }
    
    init();
}

pre();