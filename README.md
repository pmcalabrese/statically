# Staticly

Staticaly is a simple tool that allows you to build static website from urls.

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
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>Vamos</h1>

    <div id="app"></div>

    <script data-remove src="./index.entry.js"></script>
</body>
</html>
```

_Note: The html nodes with the attribute `data-remove` will be removed automatically by the tool._

to something like:

```html
<!DOCTYPE html><html lang="en"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>Vamos</h1>

    <div id="app"><div>Hello Kevin!</div></div>

    <!-- no script here and the name app has been replaced and prerendered -->    
</body></html>
```

This is nice, beacuse we can carry on developing with a comfortable rendering template like `lit-html` and prerendering (for example just before deploy) for good performance and SEO.

Staticly will allow you to do that with ease. All you need is a simple config file. The config file `staticly.config.js` will contains the list of urls that need to became a file.

Let's have a look at the `lit-html-example`.

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

this will generate a dist folder, lets serve the folder with http-server tool.

```sh
$ http-server -p 8081 dist
```
now we can run staticly. Watch out that the port of the config must match the port of the server
```sh
$ staticly --config ../staticly.config.js
```

lit-html is just an example, this tool is appliacable for any render lib, like React Preact etc.