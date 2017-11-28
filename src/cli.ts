import * as yargs from 'yargs';
import * as path from 'path';
import { generateSite } from './index';

path.resolve

export function cli() {
    const argv_config = yargs
    .option('config', {
        alias: 'c',
        describe: 'Configuration file',
        type: 'string'
    })
    .demandOption(['config'], 'Please provide a Configuration file')
    .help()
    .argv

    if (argv_config) {
        try {
            const urls = require(path.resolve(argv_config.config));
            generateSite(urls);
        } catch (error) {
            console.log(error.toString());
        }
    }
}