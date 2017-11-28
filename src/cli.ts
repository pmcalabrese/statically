import * as yargs from 'yargs';
import * as path from 'path';
import { generateSite, IUrl } from './index';

path.resolve

export function cli() {
    const argv_config = yargs
    .options({
        config: {
            alias: 'c',
            describe: 'Configuration file',
            type: 'string',
        },
        url: {
            alias: 'u',
            describe : 'Url to fetch',
            type: 'string',
        },
        file: {
            alias: 'f',
            describe : 'File to save the page',
            type: 'string',
        }
    })
    .help()
    .argv

    if (argv_config) {
        let urls: Array<IUrl> | null = null;
        
        if (argv_config.url && argv_config.file) {
            urls = [{
                url: argv_config.url.toString(),
                dist_file: argv_config.file.toString()
            }]
        } else if (argv_config.config) {
            try {
                urls = require(path.resolve(argv_config.config));
            } catch (error) {
                console.log(error.toString());
            }
        } else {
            console.log("Either --config or --url and --file must be present, check staticly --help");
            process.exit(1);
        }

        if (urls) {
            try {
                generateSite(urls);
            } catch (error) {
                console.log(error.toString());
            }
        }
    }
}