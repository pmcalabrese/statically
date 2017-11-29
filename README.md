# Statically

## Install

```sh
$ npm install statically
```

## How it works

Statically is a simple tool that allows you to build static website from urls.

Let's say you want to build an app or a website, and you use a template engine like `lit-html` or `Preact` for example.Your code will look like something like the one in `lit-html-example` folder.
If you run `webpack` it will generate a `dist` folder containing an `index.html` file and `index.entry.js`. This is perfectly fine and it will work, in fact if you run:

```sh
$ http-server dist
```

you will see the site up and running. So what's the problem? Well there are 2 main problems with it:

- Client Rendering
- Network Request for data that could be statically rendered, which will results in a less performant website.

Since in this case we are _just_ rendering some static data, it would be much better to prerender them as much as possible, and remove the scripts that are not necessary anymore as well, so we do not have to request them over the network on runtime.

Basically we should go from something like:

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>Example</h1>

    <div id="hello"></div>
    <div id="github"></div>

    <script data-remove src="./index.static.js"></script>
</body>
</html>
```

_Note: The html nodes with the attribute `data-remove` will be removed automatically by the tool._

to something like:

```html
<!-- index.html -->
<!DOCTYPE html><html lang="en"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>Example</h1>

    <div id="hello"><div>Hello Kevin!</div></div>
    <div id="github"><p>Github username: Pachito Marco Calabrese is located in Denmark and is a a telecommunication engineer with the passion for mixing web and embedded systems and is known on GitHub as pmcalabrese, he has 30 repos</p></div>

    <!-- note there is no script here -->

</body></html>
```

This is nice, beacuse we can carry on developing with a comfortable rendering template like `lit-html` and prerendering (for example just before deploy) for good performance and SEO.

Statically will allow you to do that with ease. All you need is a simple config file. The config file `Statically.config.js` will contains the list of urls that need to became a file.

Let's have a look at the `lit-html-example` folder.

```js
// staticly.config.js
const path = require("path");

const urls = [{
    url: "http://localhost:8081",
    dist_file: path.resolve(process.cwd() + "/../../public-static/index.html")
}]

module.exports = urls;
```

After create the config file

```sh
$ cd lit-html-example
$ webpack
````

this will generate a dist folder, lets serve the folder with `http-server` tool like so:

```sh
$ http-server -p 8081 dist
```

Now we can run `staticly`. Remember that the port in the config file must match the port of the server (in this specifi example i chose 8081)

```sh
$ staticly --config ../staticly.config.js
```

_Final note: lit-html is just an example, this tool is appliacable for any render lib, like React Preact etc._

## CLI usage

you can use with a config file

```sh
$ staticly --config ../staticly.config.js
```

or passing an url and a file

```sh
staticly --url www.google.com --file google.html
```