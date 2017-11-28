"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const index_1 = require("./index");
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
        const urls = require(argv_config.config);
        index_1.generateSite(urls);
    }
}
exports.cli = cli;
