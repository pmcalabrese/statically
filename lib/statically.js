"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const util_1 = require("util");
const chromeless_1 = require("chromeless");
const cheerio = require("cheerio");
const writeFileAsync = util_1.promisify(fs.writeFile);
function run(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const chromeless = new chromeless_1.Chromeless();
        let html = yield chromeless
            .goto(url.url)
            .wait(5000)
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
            if (err)
                throw err;
            console.log(`${url.dist_file} generated!`);
        }).catch(console.error.bind(console));
        yield chromeless.end();
    });
}
function generateSite(urls) {
    urls.forEach((url) => {
        run(url).catch(console.error.bind(console));
    });
}
exports.generateSite = generateSite;
