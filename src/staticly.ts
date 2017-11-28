import * as fs from 'fs';
import { promisify } from 'util';
import { Chromeless } from 'chromeless';
import * as cheerio from 'cheerio';

declare module 'util' {
    export function promisify<T>(
        func: (data: any, cb: (err: NodeJS.ErrnoException, data?: T) => void,
        ) => void): (...input: any[]) => Promise<T>;
}

export interface IUrl {
    url: string;
    dist_file: string;
}

const writeFileAsync = promisify(fs.writeFile);

async function run(url: IUrl) {
    const chromeless = new Chromeless()

    let html = await chromeless
        .goto(url.url)
        .html();

    let $ = cheerio.load(html);
    let keepgoing = true;
    while (keepgoing) {
        const t = $('[data-remove]').first().toString();
        if (t) {
            html = html.replace(t, '');
            $ = cheerio.load(html);
        }
        keepgoing = !!t;
    }

    writeFileAsync(url.dist_file, html).then((err) => {
        if (err) throw err;
        console.log(`${url.dist_file} generated!`)
    }).catch((err) => {
        if (err) {
            console.log(err);
        }
    });

    await chromeless.end()
}

export function generateSite(urls: Array<IUrl>) {
    urls.forEach((url: IUrl) => {
        run(url).catch(console.error.bind(console))
    })
}