/*!
 * require-cache - lib/require-cache.js
 * Copyright(c) 2013 Zach Wentz <zkwentz@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */
var requirejs   = require('requirejs/bin/r.js');
var fs          = require('fs');
var chalk       = require('chalk');
var path        = require('path');
var file        = require('file-utils');


module.exports = function(opts,done) {
    opts = opts || {};
    
    var baseUrl         = opts.baseUrl,
        configPath      = opts.config,
        assetsPath      = opts.assets,
        config,
        assets,
        configDir;
    
    if (configPath) {
        configDir = path.dirname(configPath);
        baseUrl = baseUrl || configDir;
        
        // Grab the config file
        if (file.exists(configPath)) {
            config = fs.readFileSync(String(configPath),'utf8');
        } else {
            //log error no config file found at specified path
            console.log(chalk.yellow('No config file found at: '+configPath));
        }
    }
    else 
    {
        //log error no config file specified
        console.log(chalk.red('No config file path specified.'));
    }
    
    // set empty callback if not defined
    if (!done) {
        done = function(){};
    }
    
    if (assetsPath) {
        
        // Grab the config file
        if (file.exists(assetsPath)) {
            assets = JSON.parse(fs.readFileSync(String(assetsPath),'utf8'));
        } else {
            //log error no assets file found
            console.log(chalk.yellow('No assets file found at: '+assetsPath));
        }
    }
    else 
    {
        //log error no assets file specified
        console.log(chalk.red('No assets file path specified.'));
    }
    
    function run() {
        var rjsConfig;
        requirejs.tools.useLib(function(require){
            rjsConfig = require('transform').modifyConfig(config,function(config){
               for (var aPath in config.paths) {
                 if (typeof(assets[aPath]) !== 'undefined') {
                    config.paths[aPath] = assets[aPath].replace(/\.js$/, '');
                 }
               }           
               
               console.log(config);
               return config;
            });
            
            fs.writeFileSync(configPath,rjsConfig,'utf8');
            console.log(chalk.green('Update RequireJS config with cache bust paths'));
            done(rjsConfig);
        });
    }
    
    run();
}

