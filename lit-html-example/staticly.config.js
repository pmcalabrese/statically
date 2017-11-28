const path = require("path");

const urls = [{
    url: "http://localhost:8081",
    dist_file: path.resolve(process.cwd() + "/public-static/index.html")
}]

module.exports = urls;