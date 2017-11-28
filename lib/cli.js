"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const path = require("path");
const index_1 = require("./index");
path.resolve;
function cli() {
    const argv_config = yargs
        .option('config', {
        alias: 'c',
        describe: 'Configuration file',
        type: 'string'
    })
        .demandOption(['config'], 'Please provide a Configuration file')
        .help()
        .argv;
    if (argv_config) {
        try {
            const urls = require(path.resolve(argv_config.config));
            index_1.generateSite(urls);
        }
        catch (error) {
            console.log(error.toString());
        }
    }
}
exports.cli = cli;
