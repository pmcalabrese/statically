/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["render"] = render;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * TypeScript has a problem with precompiling templates literals
 * https://github.com/Microsoft/TypeScript/issues/17956
 *
 * TODO(justinfagnani): Run tests compiled to ES5 with both Babel and
 * TypeScript to verify correctness.
 */
const envCachesTemplates = ((t) => t() === t())(() => ((s) => s) ``);
// The first argument to JS template tags retain identity across multiple
// calls to a tag for the same literal, so we can cache work done per literal
// in a Map.
const templates = new Map();
const svgTemplates = new Map();
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */
const html = (strings, ...values) => litTag(strings, values, templates, false);
/* harmony export (immutable) */ __webpack_exports__["html"] = html;

/**
 * Interprets a template literal as an SVG template that can efficiently
 * render to and update a container.
 */
const svg = (strings, ...values) => litTag(strings, values, svgTemplates, true);
/* harmony export (immutable) */ __webpack_exports__["svg"] = svg;

function litTag(strings, values, templates, isSvg) {
    const key = envCachesTemplates ?
        strings :
        strings.join('{{--uniqueness-workaround--}}');
    let template = templates.get(key);
    if (template === undefined) {
        template = new Template(strings, isSvg);
        templates.set(key, template);
    }
    return new TemplateResult(template, values);
}
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class TemplateResult {
    constructor(template, values) {
        this.template = template;
        this.values = values;
    }
}
/* harmony export (immutable) */ __webpack_exports__["TemplateResult"] = TemplateResult;

/**
 * Renders a template to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 */
function render(result, container, partCallback = defaultPartCallback) {
    let instance = container.__templateInstance;
    // Repeat render, just call update()
    if (instance !== undefined && instance.template === result.template &&
        instance._partCallback === partCallback) {
        instance.update(result.values);
        return;
    }
    // First render, create a new TemplateInstance and append it
    instance = new TemplateInstance(result.template, partCallback);
    container.__templateInstance = instance;
    const fragment = instance._clone();
    instance.update(result.values);
    let child;
    while ((child = container.lastChild)) {
        container.removeChild(child);
    }
    container.appendChild(fragment);
}
/**
 * An expression marker with embedded unique key to avoid
 * https://github.com/PolymerLabs/lit-html/issues/62
 */
const attributeMarker = `{{lit-${Math.random()}}}`;
/**
 * Regex to scan the string preceding an expression to see if we're in a text
 * context, and not an attribute context.
 *
 * This works by seeing if we have a `>` not followed by a `<`. If there is a
 * `<` closer to the end of the strings, then we're inside a tag.
 */
const textRegex = />[^<]*$/;
const hasTagsRegex = /[^<]*/;
const textMarkerContent = '_-lit-html-_';
const textMarker = `<!--${textMarkerContent}-->`;
const attrOrTextRegex = new RegExp(`${attributeMarker}|${textMarker}`);
/**
 * A placeholder for a dynamic expression in an HTML template.
 *
 * There are two built-in part types: AttributePart and NodePart. NodeParts
 * always represent a single dynamic expression, while AttributeParts may
 * represent as many expressions are contained in the attribute.
 *
 * A Template's parts are mutable, so parts can be replaced or modified
 * (possibly to implement different template semantics). The contract is that
 * parts can only be replaced, not removed, added or reordered, and parts must
 * always consume the correct number of values in their `update()` method.
 *
 * TODO(justinfagnani): That requirement is a little fragile. A
 * TemplateInstance could instead be more careful about which values it gives
 * to Part.update().
 */
class TemplatePart {
    constructor(type, index, name, rawName, strings) {
        this.type = type;
        this.index = index;
        this.name = name;
        this.rawName = rawName;
        this.strings = strings;
    }
}
/* harmony export (immutable) */ __webpack_exports__["TemplatePart"] = TemplatePart;

class Template {
    constructor(strings, svg = false) {
        this.parts = [];
        this.svg = svg;
        this.element = document.createElement('template');
        this.element.innerHTML = this._getHtml(strings, svg);
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(this.element.content, 133 /* NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT |
               NodeFilter.SHOW_TEXT */, null, false);
        let index = -1;
        let partIndex = 0;
        const nodesToRemove = [];
        // The actual previous node, accounting for removals: if a node is removed
        // it will never be the previousNode.
        let previousNode;
        // Used to set previousNode at the top of the loop.
        let currentNode;
        while (walker.nextNode()) {
            index++;
            previousNode = currentNode;
            const node = currentNode = walker.currentNode;
            if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                if (!node.hasAttributes()) {
                    continue;
                }
                const attributes = node.attributes;
                for (let i = 0; i < attributes.length; i++) {
                    const attribute = attributes.item(i);
                    const attributeStrings = attribute.value.split(attrOrTextRegex);
                    if (attributeStrings.length > 1) {
                        // Get the template literal section leading up to the first
                        // expression in this attribute attribute
                        const attributeString = strings[partIndex];
                        // Trim the trailing literal value if this is an interpolation
                        const rawNameString = attributeString.substring(0, attributeString.length - attributeStrings[0].length);
                        // Find the attribute name
                        const rawName = rawNameString.match(/((?:\w|[.\-_$])+)=["']?$/)[1];
                        this.parts.push(new TemplatePart('attribute', index, attribute.name, rawName, attributeStrings));
                        node.removeAttribute(attribute.name);
                        partIndex += attributeStrings.length - 1;
                        i--;
                    }
                }
            }
            else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                const nodeValue = node.nodeValue;
                const strings = nodeValue.split(attributeMarker);
                if (strings.length > 1) {
                    const parent = node.parentNode;
                    const lastIndex = strings.length - 1;
                    // We have a part for each match found
                    partIndex += lastIndex;
                    // We keep this current node, but reset its content to the last
                    // literal part. We insert new literal nodes before this so that the
                    // tree walker keeps its position correctly.
                    node.textContent = strings[lastIndex];
                    // Generate a new text node for each literal section
                    // These nodes are also used as the markers for node parts
                    for (let i = 0; i < lastIndex; i++) {
                        parent.insertBefore(document.createTextNode(strings[i]), node);
                        this.parts.push(new TemplatePart('node', index++));
                    }
                }
                else {
                    // Strip whitespace-only nodes, only between elements, or at the
                    // beginning or end of elements.
                    const previousSibling = node.previousSibling;
                    const nextSibling = node.nextSibling;
                    if ((previousSibling === null ||
                        previousSibling.nodeType === 1 /* Node.ELEMENT_NODE */) &&
                        (nextSibling === null ||
                            nextSibling.nodeType === 1 /* Node.ELEMENT_NODE */) &&
                        nodeValue.trim() === '') {
                        nodesToRemove.push(node);
                        currentNode = previousNode;
                        index--;
                    }
                }
            }
            else if (node.nodeType === 8 /* Node.COMMENT_NODE */ &&
                node.nodeValue === textMarkerContent) {
                const parent = node.parentNode;
                // If we don't have a previous node add a marker node.
                // If the previousSibling is removed, because it's another part
                // placholder, or empty text, add a marker node.
                if (node.previousSibling === null ||
                    node.previousSibling !== previousNode) {
                    parent.insertBefore(new Text(), node);
                }
                else {
                    index--;
                }
                this.parts.push(new TemplatePart('node', index++));
                nodesToRemove.push(node);
                // If we don't have a next node add a marker node.
                // We don't have to check if the next node is going to be removed,
                // because that node will induce a marker if so.
                if (node.nextSibling === null) {
                    parent.insertBefore(new Text(), node);
                }
                else {
                    index--;
                }
                currentNode = previousNode;
                partIndex++;
            }
        }
        // Remove text binding nodes after the walk to not disturb the TreeWalker
        for (const n of nodesToRemove) {
            n.parentNode.removeChild(n);
        }
    }
    /**
     * Returns a string of HTML used to create a <template> element.
     */
    _getHtml(strings, svg) {
        const l = strings.length;
        const a = [];
        let isTextBinding = false;
        for (let i = 0; i < l - 1; i++) {
            const s = strings[i];
            a.push(s);
            // We're in a text position if the previous string matches the
            // textRegex. If it doesn't and the previous string has no tags, then
            // we use the previous text position state.
            isTextBinding = s.match(textRegex) !== null ||
                (s.match(hasTagsRegex) !== null && isTextBinding);
            a.push(isTextBinding ? textMarker : attributeMarker);
        }
        a.push(strings[l - 1]);
        const html = a.join('');
        return svg ? `<svg>${html}</svg>` : html;
    }
}
/* harmony export (immutable) */ __webpack_exports__["Template"] = Template;

const getValue = (part, value) => {
    // `null` as the value of a Text node will render the string 'null'
    // so we convert it to undefined
    if (value != null && value.__litDirective === true) {
        value = value(part);
    }
    return value === null ? undefined : value;
};
/* harmony export (immutable) */ __webpack_exports__["getValue"] = getValue;

const directive = (f) => {
    f.__litDirective = true;
    return f;
};
/* harmony export (immutable) */ __webpack_exports__["directive"] = directive;

class AttributePart {
    constructor(instance, element, name, strings) {
        this.instance = instance;
        this.element = element;
        this.name = name;
        this.strings = strings;
        this.size = strings.length - 1;
    }
    setValue(values, startIndex) {
        const strings = this.strings;
        let text = '';
        for (let i = 0; i < strings.length; i++) {
            text += strings[i];
            if (i < strings.length - 1) {
                const v = getValue(this, values[startIndex + i]);
                if (v &&
                    (Array.isArray(v) || typeof v !== 'string' && v[Symbol.iterator])) {
                    for (const t of v) {
                        // TODO: we need to recursively call getValue into iterables...
                        text += t;
                    }
                }
                else {
                    text += v;
                }
            }
        }
        this.element.setAttribute(this.name, text);
    }
}
/* harmony export (immutable) */ __webpack_exports__["AttributePart"] = AttributePart;

class NodePart {
    constructor(instance, startNode, endNode) {
        this.instance = instance;
        this.startNode = startNode;
        this.endNode = endNode;
        this._previousValue = undefined;
    }
    setValue(value) {
        value = getValue(this, value);
        if (value === null ||
            !(typeof value === 'object' || typeof value === 'function')) {
            // Handle primitive values
            // If the value didn't change, do nothing
            if (value === this._previousValue) {
                return;
            }
            this._setText(value);
        }
        else if (value instanceof TemplateResult) {
            this._setTemplateResult(value);
        }
        else if (Array.isArray(value) || value[Symbol.iterator]) {
            this._setIterable(value);
        }
        else if (value instanceof Node) {
            this._setNode(value);
        }
        else if (value.then !== undefined) {
            this._setPromise(value);
        }
        else {
            // Fallback, will render the string representation
            this._setText(value);
        }
    }
    _insert(node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
    }
    _setNode(value) {
        this.clear();
        this._insert(value);
        this._previousValue = value;
    }
    _setText(value) {
        const node = this.startNode.nextSibling;
        if (node === this.endNode.previousSibling &&
            node.nodeType === Node.TEXT_NODE) {
            // If we only have a single text node between the markers, we can just
            // set its value, rather than replacing it.
            // TODO(justinfagnani): Can we just check if _previousValue is
            // primitive?
            node.textContent = value;
        }
        else {
            this._setNode(document.createTextNode(value === undefined ? '' : value));
        }
        this._previousValue = value;
    }
    _setTemplateResult(value) {
        let instance;
        if (this._previousValue &&
            this._previousValue.template === value.template) {
            instance = this._previousValue;
        }
        else {
            instance =
                new TemplateInstance(value.template, this.instance._partCallback);
            this._setNode(instance._clone());
            this._previousValue = instance;
        }
        instance.update(value.values);
    }
    _setIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If _previousValue is an array, then the previous render was of an
        // iterable and _previousValue will contain the NodeParts from the previous
        // render. If _previousValue is not an array, clear this part and make a new
        // array for NodeParts.
        if (!Array.isArray(this._previousValue)) {
            this.clear();
            this._previousValue = [];
        }
        // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this._previousValue;
        let partIndex = 0;
        for (const item of value) {
            // Try to reuse an existing part
            let itemPart = itemParts[partIndex];
            // If no existing part, create a new one
            if (itemPart === undefined) {
                // If we're creating the first item part, it's startNode should be the
                // container's startNode
                let itemStart = this.startNode;
                // If we're not creating the first part, create a new separator marker
                // node, and fix up the previous part's endNode to point to it
                if (partIndex > 0) {
                    const previousPart = itemParts[partIndex - 1];
                    itemStart = previousPart.endNode = document.createTextNode('');
                    this._insert(itemStart);
                }
                itemPart = new NodePart(this.instance, itemStart, this.endNode);
                itemParts.push(itemPart);
            }
            itemPart.setValue(item);
            partIndex++;
        }
        if (partIndex === 0) {
            this.clear();
            this._previousValue = undefined;
        }
        else if (partIndex < itemParts.length) {
            const lastPart = itemParts[partIndex - 1];
            // Truncate the parts array so _previousValue reflects the current state
            itemParts.length = partIndex;
            this.clear(lastPart.endNode.previousSibling);
            lastPart.endNode = this.endNode;
        }
    }
    _setPromise(value) {
        value.then((v) => {
            if (this._previousValue === value) {
                this.setValue(v);
            }
        });
        this._previousValue = value;
    }
    clear(startNode = this.startNode) {
        let node;
        while ((node = startNode.nextSibling) !== this.endNode) {
            node.parentNode.removeChild(node);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["NodePart"] = NodePart;

const defaultPartCallback = (instance, templatePart, node) => {
    if (templatePart.type === 'attribute') {
        return new AttributePart(instance, node, templatePart.name, templatePart.strings);
    }
    else if (templatePart.type === 'node') {
        return new NodePart(instance, node, node.nextSibling);
    }
    throw new Error(`Unknown part type ${templatePart.type}`);
};
/* harmony export (immutable) */ __webpack_exports__["defaultPartCallback"] = defaultPartCallback;

/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
    constructor(template, partCallback = defaultPartCallback) {
        this._parts = [];
        this.template = template;
        this._partCallback = partCallback;
    }
    update(values) {
        let valueIndex = 0;
        for (const part of this._parts) {
            if (part.size === undefined) {
                part.setValue(values[valueIndex]);
                valueIndex++;
            }
            else {
                part.setValue(values, valueIndex);
                valueIndex += part.size;
            }
        }
    }
    _clone() {
        const fragment = document.importNode(this.template.element.content, true);
        if (this.template.parts.length > 0) {
            // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
            // null
            const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT */, null, false);
            const parts = this.template.parts;
            let index = 0;
            let partIndex = 0;
            let templatePart = parts[0];
            let node = walker.nextNode();
            while (node != null && partIndex < parts.length) {
                if (index === templatePart.index) {
                    this._parts.push(this._partCallback(this, templatePart, node));
                    templatePart = parts[++partIndex];
                }
                else {
                    index++;
                    node = walker.nextNode();
                }
            }
        }
        if (this.template.svg) {
            const svgElement = fragment.firstChild;
            fragment.removeChild(svgElement);
            const nodes = svgElement.childNodes;
            for (let i = 0; i < nodes.length; i++) {
                fragment.appendChild(nodes.item(i));
            }
        }
        return fragment;
    }
}
/* harmony export (immutable) */ __webpack_exports__["TemplateInstance"] = TemplateInstance;

//# sourceMappingURL=lit-html.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var lit_html_1 = __webpack_require__(0);
var simple_1 = __webpack_require__(2);
var github_1 = __webpack_require__(4);
lit_html_1.render(simple_1.helloTemplate('Kevin'), document.getElementById("hello"));
fetch("https://api.github.com/users/pmcalabrese").then(function (response) {
    return response.json();
}).then(function (data) {
    lit_html_1.render(github_1.githubTemplate(data.name, data.location, data.bio, data.login, data.public_repos), document.getElementById("github"));
});


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lit_html_1 = __webpack_require__(0);
// This is a lit-html template function. It returns a lit-html template.
exports.helloTemplate = function (name) { return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<div>Hello ", "!</div>"], ["<div>Hello ", "!</div>"])), name); };
var templateObject_1;


/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lit_html_1 = __webpack_require__(0);
// This is a lit-html template function. It returns a lit-html template.
exports.githubTemplate = function (name, location, bio, login, public_repos) { return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<p>Github username: ", " is located in ", " and is a ", " and is known on GitHub as ", ", he has ", " repos</p>"], ["<p>Github username: ", " is located in ", " and is a ", " and is known on GitHub as ", ", he has ", " repos</p>"])), name, location, bio.toLowerCase(), login, public_repos); };
var templateObject_1;


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzEyM2Q3YzJmMDJjOGUxMDMzODgiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xpdC1odG1sL2xpdC1odG1sLmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5zdGF0aWMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvc2ltcGxlLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2dpdGh1Yi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQzdEQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDJCQUEyQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsTUFBTSxnQkFBZ0I7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsa0JBQWtCO0FBQzVDLHNDQUFzQyxnQkFBZ0IsR0FBRyxXQUFXO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQix1QkFBdUI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsZUFBZTtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsV0FBVztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLEtBQUs7QUFDbEM7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsb0JBQW9CO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLEVBQUU7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsa0JBQWtCO0FBQzNEO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtREFBbUQ7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsa0JBQWtCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSxvQzs7Ozs7OztBQ3ZmQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLENBQUM7Ozs7Ozs7O0FDVkQ7QUFDQTtBQUNBLGdDQUFnQyx1Q0FBdUMsYUFBYSxFQUFFLEVBQUUsT0FBTyxrQkFBa0I7QUFDakg7QUFDQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQSx5Q0FBeUMscUpBQXFKO0FBQzlMOzs7Ozs7Ozs7QUNUQTtBQUNBO0FBQ0EsZ0NBQWdDLHVDQUF1QyxhQUFhLEVBQUUsRUFBRSxPQUFPLGtCQUFrQjtBQUNqSDtBQUNBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBLDhFQUE4RSx5WEFBeVg7QUFDdmMiLCJmaWxlIjoiLi9pbmRleC5zdGF0aWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAzMTIzZDdjMmYwMmM4ZTEwMzM4OCIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAoYykgMjAxNyBUaGUgUG9seW1lciBQcm9qZWN0IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBUaGlzIGNvZGUgbWF5IG9ubHkgYmUgdXNlZCB1bmRlciB0aGUgQlNEIHN0eWxlIGxpY2Vuc2UgZm91bmQgYXRcbiAqIGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9MSUNFTlNFLnR4dFxuICogVGhlIGNvbXBsZXRlIHNldCBvZiBhdXRob3JzIG1heSBiZSBmb3VuZCBhdFxuICogaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0FVVEhPUlMudHh0XG4gKiBUaGUgY29tcGxldGUgc2V0IG9mIGNvbnRyaWJ1dG9ycyBtYXkgYmUgZm91bmQgYXRcbiAqIGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9DT05UUklCVVRPUlMudHh0XG4gKiBDb2RlIGRpc3RyaWJ1dGVkIGJ5IEdvb2dsZSBhcyBwYXJ0IG9mIHRoZSBwb2x5bWVyIHByb2plY3QgaXMgYWxzb1xuICogc3ViamVjdCB0byBhbiBhZGRpdGlvbmFsIElQIHJpZ2h0cyBncmFudCBmb3VuZCBhdFxuICogaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL1BBVEVOVFMudHh0XG4gKi9cbi8qKlxuICogVHlwZVNjcmlwdCBoYXMgYSBwcm9ibGVtIHdpdGggcHJlY29tcGlsaW5nIHRlbXBsYXRlcyBsaXRlcmFsc1xuICogaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8xNzk1NlxuICpcbiAqIFRPRE8oanVzdGluZmFnbmFuaSk6IFJ1biB0ZXN0cyBjb21waWxlZCB0byBFUzUgd2l0aCBib3RoIEJhYmVsIGFuZFxuICogVHlwZVNjcmlwdCB0byB2ZXJpZnkgY29ycmVjdG5lc3MuXG4gKi9cbmNvbnN0IGVudkNhY2hlc1RlbXBsYXRlcyA9ICgodCkgPT4gdCgpID09PSB0KCkpKCgpID0+ICgocykgPT4gcykgYGApO1xuLy8gVGhlIGZpcnN0IGFyZ3VtZW50IHRvIEpTIHRlbXBsYXRlIHRhZ3MgcmV0YWluIGlkZW50aXR5IGFjcm9zcyBtdWx0aXBsZVxuLy8gY2FsbHMgdG8gYSB0YWcgZm9yIHRoZSBzYW1lIGxpdGVyYWwsIHNvIHdlIGNhbiBjYWNoZSB3b3JrIGRvbmUgcGVyIGxpdGVyYWxcbi8vIGluIGEgTWFwLlxuY29uc3QgdGVtcGxhdGVzID0gbmV3IE1hcCgpO1xuY29uc3Qgc3ZnVGVtcGxhdGVzID0gbmV3IE1hcCgpO1xuLyoqXG4gKiBJbnRlcnByZXRzIGEgdGVtcGxhdGUgbGl0ZXJhbCBhcyBhbiBIVE1MIHRlbXBsYXRlIHRoYXQgY2FuIGVmZmljaWVudGx5XG4gKiByZW5kZXIgdG8gYW5kIHVwZGF0ZSBhIGNvbnRhaW5lci5cbiAqL1xuZXhwb3J0IGNvbnN0IGh0bWwgPSAoc3RyaW5ncywgLi4udmFsdWVzKSA9PiBsaXRUYWcoc3RyaW5ncywgdmFsdWVzLCB0ZW1wbGF0ZXMsIGZhbHNlKTtcbi8qKlxuICogSW50ZXJwcmV0cyBhIHRlbXBsYXRlIGxpdGVyYWwgYXMgYW4gU1ZHIHRlbXBsYXRlIHRoYXQgY2FuIGVmZmljaWVudGx5XG4gKiByZW5kZXIgdG8gYW5kIHVwZGF0ZSBhIGNvbnRhaW5lci5cbiAqL1xuZXhwb3J0IGNvbnN0IHN2ZyA9IChzdHJpbmdzLCAuLi52YWx1ZXMpID0+IGxpdFRhZyhzdHJpbmdzLCB2YWx1ZXMsIHN2Z1RlbXBsYXRlcywgdHJ1ZSk7XG5mdW5jdGlvbiBsaXRUYWcoc3RyaW5ncywgdmFsdWVzLCB0ZW1wbGF0ZXMsIGlzU3ZnKSB7XG4gICAgY29uc3Qga2V5ID0gZW52Q2FjaGVzVGVtcGxhdGVzID9cbiAgICAgICAgc3RyaW5ncyA6XG4gICAgICAgIHN0cmluZ3Muam9pbigne3stLXVuaXF1ZW5lc3Mtd29ya2Fyb3VuZC0tfX0nKTtcbiAgICBsZXQgdGVtcGxhdGUgPSB0ZW1wbGF0ZXMuZ2V0KGtleSk7XG4gICAgaWYgKHRlbXBsYXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGVtcGxhdGUgPSBuZXcgVGVtcGxhdGUoc3RyaW5ncywgaXNTdmcpO1xuICAgICAgICB0ZW1wbGF0ZXMuc2V0KGtleSwgdGVtcGxhdGUpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFRlbXBsYXRlUmVzdWx0KHRlbXBsYXRlLCB2YWx1ZXMpO1xufVxuLyoqXG4gKiBUaGUgcmV0dXJuIHR5cGUgb2YgYGh0bWxgLCB3aGljaCBob2xkcyBhIFRlbXBsYXRlIGFuZCB0aGUgdmFsdWVzIGZyb21cbiAqIGludGVycG9sYXRlZCBleHByZXNzaW9ucy5cbiAqL1xuZXhwb3J0IGNsYXNzIFRlbXBsYXRlUmVzdWx0IHtcbiAgICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgdmFsdWVzKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSB2YWx1ZXM7XG4gICAgfVxufVxuLyoqXG4gKiBSZW5kZXJzIGEgdGVtcGxhdGUgdG8gYSBjb250YWluZXIuXG4gKlxuICogVG8gdXBkYXRlIGEgY29udGFpbmVyIHdpdGggbmV3IHZhbHVlcywgcmVldmFsdWF0ZSB0aGUgdGVtcGxhdGUgbGl0ZXJhbCBhbmRcbiAqIGNhbGwgYHJlbmRlcmAgd2l0aCB0aGUgbmV3IHJlc3VsdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcihyZXN1bHQsIGNvbnRhaW5lciwgcGFydENhbGxiYWNrID0gZGVmYXVsdFBhcnRDYWxsYmFjaykge1xuICAgIGxldCBpbnN0YW5jZSA9IGNvbnRhaW5lci5fX3RlbXBsYXRlSW5zdGFuY2U7XG4gICAgLy8gUmVwZWF0IHJlbmRlciwganVzdCBjYWxsIHVwZGF0ZSgpXG4gICAgaWYgKGluc3RhbmNlICE9PSB1bmRlZmluZWQgJiYgaW5zdGFuY2UudGVtcGxhdGUgPT09IHJlc3VsdC50ZW1wbGF0ZSAmJlxuICAgICAgICBpbnN0YW5jZS5fcGFydENhbGxiYWNrID09PSBwYXJ0Q2FsbGJhY2spIHtcbiAgICAgICAgaW5zdGFuY2UudXBkYXRlKHJlc3VsdC52YWx1ZXMpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIEZpcnN0IHJlbmRlciwgY3JlYXRlIGEgbmV3IFRlbXBsYXRlSW5zdGFuY2UgYW5kIGFwcGVuZCBpdFxuICAgIGluc3RhbmNlID0gbmV3IFRlbXBsYXRlSW5zdGFuY2UocmVzdWx0LnRlbXBsYXRlLCBwYXJ0Q2FsbGJhY2spO1xuICAgIGNvbnRhaW5lci5fX3RlbXBsYXRlSW5zdGFuY2UgPSBpbnN0YW5jZTtcbiAgICBjb25zdCBmcmFnbWVudCA9IGluc3RhbmNlLl9jbG9uZSgpO1xuICAgIGluc3RhbmNlLnVwZGF0ZShyZXN1bHQudmFsdWVzKTtcbiAgICBsZXQgY2hpbGQ7XG4gICAgd2hpbGUgKChjaGlsZCA9IGNvbnRhaW5lci5sYXN0Q2hpbGQpKSB7XG4gICAgICAgIGNvbnRhaW5lci5yZW1vdmVDaGlsZChjaGlsZCk7XG4gICAgfVxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG59XG4vKipcbiAqIEFuIGV4cHJlc3Npb24gbWFya2VyIHdpdGggZW1iZWRkZWQgdW5pcXVlIGtleSB0byBhdm9pZFxuICogaHR0cHM6Ly9naXRodWIuY29tL1BvbHltZXJMYWJzL2xpdC1odG1sL2lzc3Vlcy82MlxuICovXG5jb25zdCBhdHRyaWJ1dGVNYXJrZXIgPSBge3tsaXQtJHtNYXRoLnJhbmRvbSgpfX19YDtcbi8qKlxuICogUmVnZXggdG8gc2NhbiB0aGUgc3RyaW5nIHByZWNlZGluZyBhbiBleHByZXNzaW9uIHRvIHNlZSBpZiB3ZSdyZSBpbiBhIHRleHRcbiAqIGNvbnRleHQsIGFuZCBub3QgYW4gYXR0cmlidXRlIGNvbnRleHQuXG4gKlxuICogVGhpcyB3b3JrcyBieSBzZWVpbmcgaWYgd2UgaGF2ZSBhIGA+YCBub3QgZm9sbG93ZWQgYnkgYSBgPGAuIElmIHRoZXJlIGlzIGFcbiAqIGA8YCBjbG9zZXIgdG8gdGhlIGVuZCBvZiB0aGUgc3RyaW5ncywgdGhlbiB3ZSdyZSBpbnNpZGUgYSB0YWcuXG4gKi9cbmNvbnN0IHRleHRSZWdleCA9IC8+W148XSokLztcbmNvbnN0IGhhc1RhZ3NSZWdleCA9IC9bXjxdKi87XG5jb25zdCB0ZXh0TWFya2VyQ29udGVudCA9ICdfLWxpdC1odG1sLV8nO1xuY29uc3QgdGV4dE1hcmtlciA9IGA8IS0tJHt0ZXh0TWFya2VyQ29udGVudH0tLT5gO1xuY29uc3QgYXR0ck9yVGV4dFJlZ2V4ID0gbmV3IFJlZ0V4cChgJHthdHRyaWJ1dGVNYXJrZXJ9fCR7dGV4dE1hcmtlcn1gKTtcbi8qKlxuICogQSBwbGFjZWhvbGRlciBmb3IgYSBkeW5hbWljIGV4cHJlc3Npb24gaW4gYW4gSFRNTCB0ZW1wbGF0ZS5cbiAqXG4gKiBUaGVyZSBhcmUgdHdvIGJ1aWx0LWluIHBhcnQgdHlwZXM6IEF0dHJpYnV0ZVBhcnQgYW5kIE5vZGVQYXJ0LiBOb2RlUGFydHNcbiAqIGFsd2F5cyByZXByZXNlbnQgYSBzaW5nbGUgZHluYW1pYyBleHByZXNzaW9uLCB3aGlsZSBBdHRyaWJ1dGVQYXJ0cyBtYXlcbiAqIHJlcHJlc2VudCBhcyBtYW55IGV4cHJlc3Npb25zIGFyZSBjb250YWluZWQgaW4gdGhlIGF0dHJpYnV0ZS5cbiAqXG4gKiBBIFRlbXBsYXRlJ3MgcGFydHMgYXJlIG11dGFibGUsIHNvIHBhcnRzIGNhbiBiZSByZXBsYWNlZCBvciBtb2RpZmllZFxuICogKHBvc3NpYmx5IHRvIGltcGxlbWVudCBkaWZmZXJlbnQgdGVtcGxhdGUgc2VtYW50aWNzKS4gVGhlIGNvbnRyYWN0IGlzIHRoYXRcbiAqIHBhcnRzIGNhbiBvbmx5IGJlIHJlcGxhY2VkLCBub3QgcmVtb3ZlZCwgYWRkZWQgb3IgcmVvcmRlcmVkLCBhbmQgcGFydHMgbXVzdFxuICogYWx3YXlzIGNvbnN1bWUgdGhlIGNvcnJlY3QgbnVtYmVyIG9mIHZhbHVlcyBpbiB0aGVpciBgdXBkYXRlKClgIG1ldGhvZC5cbiAqXG4gKiBUT0RPKGp1c3RpbmZhZ25hbmkpOiBUaGF0IHJlcXVpcmVtZW50IGlzIGEgbGl0dGxlIGZyYWdpbGUuIEFcbiAqIFRlbXBsYXRlSW5zdGFuY2UgY291bGQgaW5zdGVhZCBiZSBtb3JlIGNhcmVmdWwgYWJvdXQgd2hpY2ggdmFsdWVzIGl0IGdpdmVzXG4gKiB0byBQYXJ0LnVwZGF0ZSgpLlxuICovXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVQYXJ0IHtcbiAgICBjb25zdHJ1Y3Rvcih0eXBlLCBpbmRleCwgbmFtZSwgcmF3TmFtZSwgc3RyaW5ncykge1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMucmF3TmFtZSA9IHJhd05hbWU7XG4gICAgICAgIHRoaXMuc3RyaW5ncyA9IHN0cmluZ3M7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlIHtcbiAgICBjb25zdHJ1Y3RvcihzdHJpbmdzLCBzdmcgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLnBhcnRzID0gW107XG4gICAgICAgIHRoaXMuc3ZnID0gc3ZnO1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy5fZ2V0SHRtbChzdHJpbmdzLCBzdmcpO1xuICAgICAgICAvLyBFZGdlIG5lZWRzIGFsbCA0IHBhcmFtZXRlcnMgcHJlc2VudDsgSUUxMSBuZWVkcyAzcmQgcGFyYW1ldGVyIHRvIGJlIG51bGxcbiAgICAgICAgY29uc3Qgd2Fsa2VyID0gZG9jdW1lbnQuY3JlYXRlVHJlZVdhbGtlcih0aGlzLmVsZW1lbnQuY29udGVudCwgMTMzIC8qIE5vZGVGaWx0ZXIuU0hPV19FTEVNRU5UIHwgTm9kZUZpbHRlci5TSE9XX0NPTU1FTlQgfFxuICAgICAgICAgICAgICAgTm9kZUZpbHRlci5TSE9XX1RFWFQgKi8sIG51bGwsIGZhbHNlKTtcbiAgICAgICAgbGV0IGluZGV4ID0gLTE7XG4gICAgICAgIGxldCBwYXJ0SW5kZXggPSAwO1xuICAgICAgICBjb25zdCBub2Rlc1RvUmVtb3ZlID0gW107XG4gICAgICAgIC8vIFRoZSBhY3R1YWwgcHJldmlvdXMgbm9kZSwgYWNjb3VudGluZyBmb3IgcmVtb3ZhbHM6IGlmIGEgbm9kZSBpcyByZW1vdmVkXG4gICAgICAgIC8vIGl0IHdpbGwgbmV2ZXIgYmUgdGhlIHByZXZpb3VzTm9kZS5cbiAgICAgICAgbGV0IHByZXZpb3VzTm9kZTtcbiAgICAgICAgLy8gVXNlZCB0byBzZXQgcHJldmlvdXNOb2RlIGF0IHRoZSB0b3Agb2YgdGhlIGxvb3AuXG4gICAgICAgIGxldCBjdXJyZW50Tm9kZTtcbiAgICAgICAgd2hpbGUgKHdhbGtlci5uZXh0Tm9kZSgpKSB7XG4gICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgcHJldmlvdXNOb2RlID0gY3VycmVudE5vZGU7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gY3VycmVudE5vZGUgPSB3YWxrZXIuY3VycmVudE5vZGU7XG4gICAgICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSAvKiBOb2RlLkVMRU1FTlRfTk9ERSAqLykge1xuICAgICAgICAgICAgICAgIGlmICghbm9kZS5oYXNBdHRyaWJ1dGVzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXMuaXRlbShpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlU3RyaW5ncyA9IGF0dHJpYnV0ZS52YWx1ZS5zcGxpdChhdHRyT3JUZXh0UmVnZXgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlU3RyaW5ncy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIHRlbXBsYXRlIGxpdGVyYWwgc2VjdGlvbiBsZWFkaW5nIHVwIHRvIHRoZSBmaXJzdFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXhwcmVzc2lvbiBpbiB0aGlzIGF0dHJpYnV0ZSBhdHRyaWJ1dGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGF0dHJpYnV0ZVN0cmluZyA9IHN0cmluZ3NbcGFydEluZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRyaW0gdGhlIHRyYWlsaW5nIGxpdGVyYWwgdmFsdWUgaWYgdGhpcyBpcyBhbiBpbnRlcnBvbGF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByYXdOYW1lU3RyaW5nID0gYXR0cmlidXRlU3RyaW5nLnN1YnN0cmluZygwLCBhdHRyaWJ1dGVTdHJpbmcubGVuZ3RoIC0gYXR0cmlidXRlU3RyaW5nc1swXS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmluZCB0aGUgYXR0cmlidXRlIG5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhd05hbWUgPSByYXdOYW1lU3RyaW5nLm1hdGNoKC8oKD86XFx3fFsuXFwtXyRdKSspPVtcIiddPyQvKVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFydHMucHVzaChuZXcgVGVtcGxhdGVQYXJ0KCdhdHRyaWJ1dGUnLCBpbmRleCwgYXR0cmlidXRlLm5hbWUsIHJhd05hbWUsIGF0dHJpYnV0ZVN0cmluZ3MpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRJbmRleCArPSBhdHRyaWJ1dGVTdHJpbmdzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSAzIC8qIE5vZGUuVEVYVF9OT0RFICovKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZVZhbHVlID0gbm9kZS5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RyaW5ncyA9IG5vZGVWYWx1ZS5zcGxpdChhdHRyaWJ1dGVNYXJrZXIpO1xuICAgICAgICAgICAgICAgIGlmIChzdHJpbmdzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyZW50ID0gbm9kZS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXN0SW5kZXggPSBzdHJpbmdzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgYSBwYXJ0IGZvciBlYWNoIG1hdGNoIGZvdW5kXG4gICAgICAgICAgICAgICAgICAgIHBhcnRJbmRleCArPSBsYXN0SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIGtlZXAgdGhpcyBjdXJyZW50IG5vZGUsIGJ1dCByZXNldCBpdHMgY29udGVudCB0byB0aGUgbGFzdFxuICAgICAgICAgICAgICAgICAgICAvLyBsaXRlcmFsIHBhcnQuIFdlIGluc2VydCBuZXcgbGl0ZXJhbCBub2RlcyBiZWZvcmUgdGhpcyBzbyB0aGF0IHRoZVxuICAgICAgICAgICAgICAgICAgICAvLyB0cmVlIHdhbGtlciBrZWVwcyBpdHMgcG9zaXRpb24gY29ycmVjdGx5LlxuICAgICAgICAgICAgICAgICAgICBub2RlLnRleHRDb250ZW50ID0gc3RyaW5nc1tsYXN0SW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAvLyBHZW5lcmF0ZSBhIG5ldyB0ZXh0IG5vZGUgZm9yIGVhY2ggbGl0ZXJhbCBzZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZXNlIG5vZGVzIGFyZSBhbHNvIHVzZWQgYXMgdGhlIG1hcmtlcnMgZm9yIG5vZGUgcGFydHNcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsYXN0SW5kZXg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzdHJpbmdzW2ldKSwgbm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnRzLnB1c2gobmV3IFRlbXBsYXRlUGFydCgnbm9kZScsIGluZGV4KyspKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU3RyaXAgd2hpdGVzcGFjZS1vbmx5IG5vZGVzLCBvbmx5IGJldHdlZW4gZWxlbWVudHMsIG9yIGF0IHRoZVxuICAgICAgICAgICAgICAgICAgICAvLyBiZWdpbm5pbmcgb3IgZW5kIG9mIGVsZW1lbnRzLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91c1NpYmxpbmcgPSBub2RlLnByZXZpb3VzU2libGluZztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dFNpYmxpbmcgPSBub2RlLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICBpZiAoKHByZXZpb3VzU2libGluZyA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNTaWJsaW5nLm5vZGVUeXBlID09PSAxIC8qIE5vZGUuRUxFTUVOVF9OT0RFICovKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKG5leHRTaWJsaW5nID09PSBudWxsIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNpYmxpbmcubm9kZVR5cGUgPT09IDEgLyogTm9kZS5FTEVNRU5UX05PREUgKi8pICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlVmFsdWUudHJpbSgpID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZXNUb1JlbW92ZS5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudE5vZGUgPSBwcmV2aW91c05vZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleC0tO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gOCAvKiBOb2RlLkNPTU1FTlRfTk9ERSAqLyAmJlxuICAgICAgICAgICAgICAgIG5vZGUubm9kZVZhbHVlID09PSB0ZXh0TWFya2VyQ29udGVudCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICAvLyBJZiB3ZSBkb24ndCBoYXZlIGEgcHJldmlvdXMgbm9kZSBhZGQgYSBtYXJrZXIgbm9kZS5cbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcHJldmlvdXNTaWJsaW5nIGlzIHJlbW92ZWQsIGJlY2F1c2UgaXQncyBhbm90aGVyIHBhcnRcbiAgICAgICAgICAgICAgICAvLyBwbGFjaG9sZGVyLCBvciBlbXB0eSB0ZXh0LCBhZGQgYSBtYXJrZXIgbm9kZS5cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5wcmV2aW91c1NpYmxpbmcgPT09IG51bGwgfHxcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5wcmV2aW91c1NpYmxpbmcgIT09IHByZXZpb3VzTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKG5ldyBUZXh0KCksIG5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXgtLTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJ0cy5wdXNoKG5ldyBUZW1wbGF0ZVBhcnQoJ25vZGUnLCBpbmRleCsrKSk7XG4gICAgICAgICAgICAgICAgbm9kZXNUb1JlbW92ZS5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgIC8vIElmIHdlIGRvbid0IGhhdmUgYSBuZXh0IG5vZGUgYWRkIGEgbWFya2VyIG5vZGUuXG4gICAgICAgICAgICAgICAgLy8gV2UgZG9uJ3QgaGF2ZSB0byBjaGVjayBpZiB0aGUgbmV4dCBub2RlIGlzIGdvaW5nIHRvIGJlIHJlbW92ZWQsXG4gICAgICAgICAgICAgICAgLy8gYmVjYXVzZSB0aGF0IG5vZGUgd2lsbCBpbmR1Y2UgYSBtYXJrZXIgaWYgc28uXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUubmV4dFNpYmxpbmcgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShuZXcgVGV4dCgpLCBub2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4LS07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGN1cnJlbnROb2RlID0gcHJldmlvdXNOb2RlO1xuICAgICAgICAgICAgICAgIHBhcnRJbmRleCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFJlbW92ZSB0ZXh0IGJpbmRpbmcgbm9kZXMgYWZ0ZXIgdGhlIHdhbGsgdG8gbm90IGRpc3R1cmIgdGhlIFRyZWVXYWxrZXJcbiAgICAgICAgZm9yIChjb25zdCBuIG9mIG5vZGVzVG9SZW1vdmUpIHtcbiAgICAgICAgICAgIG4ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChuKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIG9mIEhUTUwgdXNlZCB0byBjcmVhdGUgYSA8dGVtcGxhdGU+IGVsZW1lbnQuXG4gICAgICovXG4gICAgX2dldEh0bWwoc3RyaW5ncywgc3ZnKSB7XG4gICAgICAgIGNvbnN0IGwgPSBzdHJpbmdzLmxlbmd0aDtcbiAgICAgICAgY29uc3QgYSA9IFtdO1xuICAgICAgICBsZXQgaXNUZXh0QmluZGluZyA9IGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGwgLSAxOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHMgPSBzdHJpbmdzW2ldO1xuICAgICAgICAgICAgYS5wdXNoKHMpO1xuICAgICAgICAgICAgLy8gV2UncmUgaW4gYSB0ZXh0IHBvc2l0aW9uIGlmIHRoZSBwcmV2aW91cyBzdHJpbmcgbWF0Y2hlcyB0aGVcbiAgICAgICAgICAgIC8vIHRleHRSZWdleC4gSWYgaXQgZG9lc24ndCBhbmQgdGhlIHByZXZpb3VzIHN0cmluZyBoYXMgbm8gdGFncywgdGhlblxuICAgICAgICAgICAgLy8gd2UgdXNlIHRoZSBwcmV2aW91cyB0ZXh0IHBvc2l0aW9uIHN0YXRlLlxuICAgICAgICAgICAgaXNUZXh0QmluZGluZyA9IHMubWF0Y2godGV4dFJlZ2V4KSAhPT0gbnVsbCB8fFxuICAgICAgICAgICAgICAgIChzLm1hdGNoKGhhc1RhZ3NSZWdleCkgIT09IG51bGwgJiYgaXNUZXh0QmluZGluZyk7XG4gICAgICAgICAgICBhLnB1c2goaXNUZXh0QmluZGluZyA/IHRleHRNYXJrZXIgOiBhdHRyaWJ1dGVNYXJrZXIpO1xuICAgICAgICB9XG4gICAgICAgIGEucHVzaChzdHJpbmdzW2wgLSAxXSk7XG4gICAgICAgIGNvbnN0IGh0bWwgPSBhLmpvaW4oJycpO1xuICAgICAgICByZXR1cm4gc3ZnID8gYDxzdmc+JHtodG1sfTwvc3ZnPmAgOiBodG1sO1xuICAgIH1cbn1cbmV4cG9ydCBjb25zdCBnZXRWYWx1ZSA9IChwYXJ0LCB2YWx1ZSkgPT4ge1xuICAgIC8vIGBudWxsYCBhcyB0aGUgdmFsdWUgb2YgYSBUZXh0IG5vZGUgd2lsbCByZW5kZXIgdGhlIHN0cmluZyAnbnVsbCdcbiAgICAvLyBzbyB3ZSBjb252ZXJ0IGl0IHRvIHVuZGVmaW5lZFxuICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlLl9fbGl0RGlyZWN0aXZlID09PSB0cnVlKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUocGFydCk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCA/IHVuZGVmaW5lZCA6IHZhbHVlO1xufTtcbmV4cG9ydCBjb25zdCBkaXJlY3RpdmUgPSAoZikgPT4ge1xuICAgIGYuX19saXREaXJlY3RpdmUgPSB0cnVlO1xuICAgIHJldHVybiBmO1xufTtcbmV4cG9ydCBjbGFzcyBBdHRyaWJ1dGVQYXJ0IHtcbiAgICBjb25zdHJ1Y3RvcihpbnN0YW5jZSwgZWxlbWVudCwgbmFtZSwgc3RyaW5ncykge1xuICAgICAgICB0aGlzLmluc3RhbmNlID0gaW5zdGFuY2U7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuc3RyaW5ncyA9IHN0cmluZ3M7XG4gICAgICAgIHRoaXMuc2l6ZSA9IHN0cmluZ3MubGVuZ3RoIC0gMTtcbiAgICB9XG4gICAgc2V0VmFsdWUodmFsdWVzLCBzdGFydEluZGV4KSB7XG4gICAgICAgIGNvbnN0IHN0cmluZ3MgPSB0aGlzLnN0cmluZ3M7XG4gICAgICAgIGxldCB0ZXh0ID0gJyc7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyaW5ncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGV4dCArPSBzdHJpbmdzW2ldO1xuICAgICAgICAgICAgaWYgKGkgPCBzdHJpbmdzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2ID0gZ2V0VmFsdWUodGhpcywgdmFsdWVzW3N0YXJ0SW5kZXggKyBpXSk7XG4gICAgICAgICAgICAgICAgaWYgKHYgJiZcbiAgICAgICAgICAgICAgICAgICAgKEFycmF5LmlzQXJyYXkodikgfHwgdHlwZW9mIHYgIT09ICdzdHJpbmcnICYmIHZbU3ltYm9sLml0ZXJhdG9yXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCB0IG9mIHYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IHdlIG5lZWQgdG8gcmVjdXJzaXZlbHkgY2FsbCBnZXRWYWx1ZSBpbnRvIGl0ZXJhYmxlcy4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCArPSB0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0ICs9IHY7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUodGhpcy5uYW1lLCB0ZXh0KTtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgTm9kZVBhcnQge1xuICAgIGNvbnN0cnVjdG9yKGluc3RhbmNlLCBzdGFydE5vZGUsIGVuZE5vZGUpIHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZSA9IGluc3RhbmNlO1xuICAgICAgICB0aGlzLnN0YXJ0Tm9kZSA9IHN0YXJ0Tm9kZTtcbiAgICAgICAgdGhpcy5lbmROb2RlID0gZW5kTm9kZTtcbiAgICAgICAgdGhpcy5fcHJldmlvdXNWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgc2V0VmFsdWUodmFsdWUpIHtcbiAgICAgICAgdmFsdWUgPSBnZXRWYWx1ZSh0aGlzLCB2YWx1ZSk7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgISh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICAgIC8vIEhhbmRsZSBwcmltaXRpdmUgdmFsdWVzXG4gICAgICAgICAgICAvLyBJZiB0aGUgdmFsdWUgZGlkbid0IGNoYW5nZSwgZG8gbm90aGluZ1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLl9wcmV2aW91c1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fc2V0VGV4dCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBUZW1wbGF0ZVJlc3VsdCkge1xuICAgICAgICAgICAgdGhpcy5fc2V0VGVtcGxhdGVSZXN1bHQodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpIHx8IHZhbHVlW1N5bWJvbC5pdGVyYXRvcl0pIHtcbiAgICAgICAgICAgIHRoaXMuX3NldEl0ZXJhYmxlKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldE5vZGUodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHZhbHVlLnRoZW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fc2V0UHJvbWlzZSh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBGYWxsYmFjaywgd2lsbCByZW5kZXIgdGhlIHN0cmluZyByZXByZXNlbnRhdGlvblxuICAgICAgICAgICAgdGhpcy5fc2V0VGV4dCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2luc2VydChub2RlKSB7XG4gICAgICAgIHRoaXMuZW5kTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCB0aGlzLmVuZE5vZGUpO1xuICAgIH1cbiAgICBfc2V0Tm9kZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuX2luc2VydCh2YWx1ZSk7XG4gICAgICAgIHRoaXMuX3ByZXZpb3VzVmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gICAgX3NldFRleHQodmFsdWUpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlLm5leHRTaWJsaW5nO1xuICAgICAgICBpZiAobm9kZSA9PT0gdGhpcy5lbmROb2RlLnByZXZpb3VzU2libGluZyAmJlxuICAgICAgICAgICAgbm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcbiAgICAgICAgICAgIC8vIElmIHdlIG9ubHkgaGF2ZSBhIHNpbmdsZSB0ZXh0IG5vZGUgYmV0d2VlbiB0aGUgbWFya2Vycywgd2UgY2FuIGp1c3RcbiAgICAgICAgICAgIC8vIHNldCBpdHMgdmFsdWUsIHJhdGhlciB0aGFuIHJlcGxhY2luZyBpdC5cbiAgICAgICAgICAgIC8vIFRPRE8oanVzdGluZmFnbmFuaSk6IENhbiB3ZSBqdXN0IGNoZWNrIGlmIF9wcmV2aW91c1ZhbHVlIGlzXG4gICAgICAgICAgICAvLyBwcmltaXRpdmU/XG4gICAgICAgICAgICBub2RlLnRleHRDb250ZW50ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9zZXROb2RlKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6IHZhbHVlKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcHJldmlvdXNWYWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgICBfc2V0VGVtcGxhdGVSZXN1bHQodmFsdWUpIHtcbiAgICAgICAgbGV0IGluc3RhbmNlO1xuICAgICAgICBpZiAodGhpcy5fcHJldmlvdXNWYWx1ZSAmJlxuICAgICAgICAgICAgdGhpcy5fcHJldmlvdXNWYWx1ZS50ZW1wbGF0ZSA9PT0gdmFsdWUudGVtcGxhdGUpIHtcbiAgICAgICAgICAgIGluc3RhbmNlID0gdGhpcy5fcHJldmlvdXNWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGluc3RhbmNlID1cbiAgICAgICAgICAgICAgICBuZXcgVGVtcGxhdGVJbnN0YW5jZSh2YWx1ZS50ZW1wbGF0ZSwgdGhpcy5pbnN0YW5jZS5fcGFydENhbGxiYWNrKTtcbiAgICAgICAgICAgIHRoaXMuX3NldE5vZGUoaW5zdGFuY2UuX2Nsb25lKCkpO1xuICAgICAgICAgICAgdGhpcy5fcHJldmlvdXNWYWx1ZSA9IGluc3RhbmNlO1xuICAgICAgICB9XG4gICAgICAgIGluc3RhbmNlLnVwZGF0ZSh2YWx1ZS52YWx1ZXMpO1xuICAgIH1cbiAgICBfc2V0SXRlcmFibGUodmFsdWUpIHtcbiAgICAgICAgLy8gRm9yIGFuIEl0ZXJhYmxlLCB3ZSBjcmVhdGUgYSBuZXcgSW5zdGFuY2VQYXJ0IHBlciBpdGVtLCB0aGVuIHNldCBpdHNcbiAgICAgICAgLy8gdmFsdWUgdG8gdGhlIGl0ZW0uIFRoaXMgaXMgYSBsaXR0bGUgYml0IG9mIG92ZXJoZWFkIGZvciBldmVyeSBpdGVtIGluXG4gICAgICAgIC8vIGFuIEl0ZXJhYmxlLCBidXQgaXQgbGV0cyB1cyByZWN1cnNlIGVhc2lseSBhbmQgZWZmaWNpZW50bHkgdXBkYXRlIEFycmF5c1xuICAgICAgICAvLyBvZiBUZW1wbGF0ZVJlc3VsdHMgdGhhdCB3aWxsIGJlIGNvbW1vbmx5IHJldHVybmVkIGZyb20gZXhwcmVzc2lvbnMgbGlrZTpcbiAgICAgICAgLy8gYXJyYXkubWFwKChpKSA9PiBodG1sYCR7aX1gKSwgYnkgcmV1c2luZyBleGlzdGluZyBUZW1wbGF0ZUluc3RhbmNlcy5cbiAgICAgICAgLy8gSWYgX3ByZXZpb3VzVmFsdWUgaXMgYW4gYXJyYXksIHRoZW4gdGhlIHByZXZpb3VzIHJlbmRlciB3YXMgb2YgYW5cbiAgICAgICAgLy8gaXRlcmFibGUgYW5kIF9wcmV2aW91c1ZhbHVlIHdpbGwgY29udGFpbiB0aGUgTm9kZVBhcnRzIGZyb20gdGhlIHByZXZpb3VzXG4gICAgICAgIC8vIHJlbmRlci4gSWYgX3ByZXZpb3VzVmFsdWUgaXMgbm90IGFuIGFycmF5LCBjbGVhciB0aGlzIHBhcnQgYW5kIG1ha2UgYSBuZXdcbiAgICAgICAgLy8gYXJyYXkgZm9yIE5vZGVQYXJ0cy5cbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMuX3ByZXZpb3VzVmFsdWUpKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgICAgICB0aGlzLl9wcmV2aW91c1ZhbHVlID0gW107XG4gICAgICAgIH1cbiAgICAgICAgLy8gTGV0cyB1cyBrZWVwIHRyYWNrIG9mIGhvdyBtYW55IGl0ZW1zIHdlIHN0YW1wZWQgc28gd2UgY2FuIGNsZWFyIGxlZnRvdmVyXG4gICAgICAgIC8vIGl0ZW1zIGZyb20gYSBwcmV2aW91cyByZW5kZXJcbiAgICAgICAgY29uc3QgaXRlbVBhcnRzID0gdGhpcy5fcHJldmlvdXNWYWx1ZTtcbiAgICAgICAgbGV0IHBhcnRJbmRleCA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB2YWx1ZSkge1xuICAgICAgICAgICAgLy8gVHJ5IHRvIHJldXNlIGFuIGV4aXN0aW5nIHBhcnRcbiAgICAgICAgICAgIGxldCBpdGVtUGFydCA9IGl0ZW1QYXJ0c1twYXJ0SW5kZXhdO1xuICAgICAgICAgICAgLy8gSWYgbm8gZXhpc3RpbmcgcGFydCwgY3JlYXRlIGEgbmV3IG9uZVxuICAgICAgICAgICAgaWYgKGl0ZW1QYXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB3ZSdyZSBjcmVhdGluZyB0aGUgZmlyc3QgaXRlbSBwYXJ0LCBpdCdzIHN0YXJ0Tm9kZSBzaG91bGQgYmUgdGhlXG4gICAgICAgICAgICAgICAgLy8gY29udGFpbmVyJ3Mgc3RhcnROb2RlXG4gICAgICAgICAgICAgICAgbGV0IGl0ZW1TdGFydCA9IHRoaXMuc3RhcnROb2RlO1xuICAgICAgICAgICAgICAgIC8vIElmIHdlJ3JlIG5vdCBjcmVhdGluZyB0aGUgZmlyc3QgcGFydCwgY3JlYXRlIGEgbmV3IHNlcGFyYXRvciBtYXJrZXJcbiAgICAgICAgICAgICAgICAvLyBub2RlLCBhbmQgZml4IHVwIHRoZSBwcmV2aW91cyBwYXJ0J3MgZW5kTm9kZSB0byBwb2ludCB0byBpdFxuICAgICAgICAgICAgICAgIGlmIChwYXJ0SW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzUGFydCA9IGl0ZW1QYXJ0c1twYXJ0SW5kZXggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbVN0YXJ0ID0gcHJldmlvdXNQYXJ0LmVuZE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2luc2VydChpdGVtU3RhcnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpdGVtUGFydCA9IG5ldyBOb2RlUGFydCh0aGlzLmluc3RhbmNlLCBpdGVtU3RhcnQsIHRoaXMuZW5kTm9kZSk7XG4gICAgICAgICAgICAgICAgaXRlbVBhcnRzLnB1c2goaXRlbVBhcnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaXRlbVBhcnQuc2V0VmFsdWUoaXRlbSk7XG4gICAgICAgICAgICBwYXJ0SW5kZXgrKztcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFydEluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgICAgICB0aGlzLl9wcmV2aW91c1ZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHBhcnRJbmRleCA8IGl0ZW1QYXJ0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGxhc3RQYXJ0ID0gaXRlbVBhcnRzW3BhcnRJbmRleCAtIDFdO1xuICAgICAgICAgICAgLy8gVHJ1bmNhdGUgdGhlIHBhcnRzIGFycmF5IHNvIF9wcmV2aW91c1ZhbHVlIHJlZmxlY3RzIHRoZSBjdXJyZW50IHN0YXRlXG4gICAgICAgICAgICBpdGVtUGFydHMubGVuZ3RoID0gcGFydEluZGV4O1xuICAgICAgICAgICAgdGhpcy5jbGVhcihsYXN0UGFydC5lbmROb2RlLnByZXZpb3VzU2libGluZyk7XG4gICAgICAgICAgICBsYXN0UGFydC5lbmROb2RlID0gdGhpcy5lbmROb2RlO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9zZXRQcm9taXNlKHZhbHVlKSB7XG4gICAgICAgIHZhbHVlLnRoZW4oKHYpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9wcmV2aW91c1ZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUodik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9wcmV2aW91c1ZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIGNsZWFyKHN0YXJ0Tm9kZSA9IHRoaXMuc3RhcnROb2RlKSB7XG4gICAgICAgIGxldCBub2RlO1xuICAgICAgICB3aGlsZSAoKG5vZGUgPSBzdGFydE5vZGUubmV4dFNpYmxpbmcpICE9PSB0aGlzLmVuZE5vZGUpIHtcbiAgICAgICAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydCBjb25zdCBkZWZhdWx0UGFydENhbGxiYWNrID0gKGluc3RhbmNlLCB0ZW1wbGF0ZVBhcnQsIG5vZGUpID0+IHtcbiAgICBpZiAodGVtcGxhdGVQYXJ0LnR5cGUgPT09ICdhdHRyaWJ1dGUnKSB7XG4gICAgICAgIHJldHVybiBuZXcgQXR0cmlidXRlUGFydChpbnN0YW5jZSwgbm9kZSwgdGVtcGxhdGVQYXJ0Lm5hbWUsIHRlbXBsYXRlUGFydC5zdHJpbmdzKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGVtcGxhdGVQYXJ0LnR5cGUgPT09ICdub2RlJykge1xuICAgICAgICByZXR1cm4gbmV3IE5vZGVQYXJ0KGluc3RhbmNlLCBub2RlLCBub2RlLm5leHRTaWJsaW5nKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHBhcnQgdHlwZSAke3RlbXBsYXRlUGFydC50eXBlfWApO1xufTtcbi8qKlxuICogQW4gaW5zdGFuY2Ugb2YgYSBgVGVtcGxhdGVgIHRoYXQgY2FuIGJlIGF0dGFjaGVkIHRvIHRoZSBET00gYW5kIHVwZGF0ZWRcbiAqIHdpdGggbmV3IHZhbHVlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFRlbXBsYXRlSW5zdGFuY2Uge1xuICAgIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBwYXJ0Q2FsbGJhY2sgPSBkZWZhdWx0UGFydENhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX3BhcnRzID0gW107XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICAgICAgdGhpcy5fcGFydENhbGxiYWNrID0gcGFydENhbGxiYWNrO1xuICAgIH1cbiAgICB1cGRhdGUodmFsdWVzKSB7XG4gICAgICAgIGxldCB2YWx1ZUluZGV4ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBwYXJ0IG9mIHRoaXMuX3BhcnRzKSB7XG4gICAgICAgICAgICBpZiAocGFydC5zaXplID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBwYXJ0LnNldFZhbHVlKHZhbHVlc1t2YWx1ZUluZGV4XSk7XG4gICAgICAgICAgICAgICAgdmFsdWVJbmRleCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFydC5zZXRWYWx1ZSh2YWx1ZXMsIHZhbHVlSW5kZXgpO1xuICAgICAgICAgICAgICAgIHZhbHVlSW5kZXggKz0gcGFydC5zaXplO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIF9jbG9uZSgpIHtcbiAgICAgICAgY29uc3QgZnJhZ21lbnQgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRoaXMudGVtcGxhdGUuZWxlbWVudC5jb250ZW50LCB0cnVlKTtcbiAgICAgICAgaWYgKHRoaXMudGVtcGxhdGUucGFydHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gRWRnZSBuZWVkcyBhbGwgNCBwYXJhbWV0ZXJzIHByZXNlbnQ7IElFMTEgbmVlZHMgM3JkIHBhcmFtZXRlciB0byBiZVxuICAgICAgICAgICAgLy8gbnVsbFxuICAgICAgICAgICAgY29uc3Qgd2Fsa2VyID0gZG9jdW1lbnQuY3JlYXRlVHJlZVdhbGtlcihmcmFnbWVudCwgMTMzIC8qIE5vZGVGaWx0ZXIuU0hPV19FTEVNRU5UIHwgTm9kZUZpbHRlci5TSE9XX0NPTU1FTlQgfCBOb2RlRmlsdGVyLlNIT1dfVEVYVCAqLywgbnVsbCwgZmFsc2UpO1xuICAgICAgICAgICAgY29uc3QgcGFydHMgPSB0aGlzLnRlbXBsYXRlLnBhcnRzO1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgICAgICAgIGxldCBwYXJ0SW5kZXggPSAwO1xuICAgICAgICAgICAgbGV0IHRlbXBsYXRlUGFydCA9IHBhcnRzWzBdO1xuICAgICAgICAgICAgbGV0IG5vZGUgPSB3YWxrZXIubmV4dE5vZGUoKTtcbiAgICAgICAgICAgIHdoaWxlIChub2RlICE9IG51bGwgJiYgcGFydEluZGV4IDwgcGFydHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSB0ZW1wbGF0ZVBhcnQuaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFydHMucHVzaCh0aGlzLl9wYXJ0Q2FsbGJhY2sodGhpcywgdGVtcGxhdGVQYXJ0LCBub2RlKSk7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlUGFydCA9IHBhcnRzWysrcGFydEluZGV4XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUgPSB3YWxrZXIubmV4dE5vZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudGVtcGxhdGUuc3ZnKSB7XG4gICAgICAgICAgICBjb25zdCBzdmdFbGVtZW50ID0gZnJhZ21lbnQuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIGZyYWdtZW50LnJlbW92ZUNoaWxkKHN2Z0VsZW1lbnQpO1xuICAgICAgICAgICAgY29uc3Qgbm9kZXMgPSBzdmdFbGVtZW50LmNoaWxkTm9kZXM7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQobm9kZXMuaXRlbShpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZyYWdtZW50O1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpdC1odG1sLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xpdC1odG1sL2xpdC1odG1sLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGxpdF9odG1sXzEgPSByZXF1aXJlKFwibGl0LWh0bWxcIik7XG52YXIgc2ltcGxlXzEgPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL3NpbXBsZVwiKTtcbnZhciBnaXRodWJfMSA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvZ2l0aHViXCIpO1xubGl0X2h0bWxfMS5yZW5kZXIoc2ltcGxlXzEuaGVsbG9UZW1wbGF0ZSgnS2V2aW4nKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoZWxsb1wiKSk7XG5mZXRjaChcImh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vdXNlcnMvcG1jYWxhYnJlc2VcIikudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xufSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIGxpdF9odG1sXzEucmVuZGVyKGdpdGh1Yl8xLmdpdGh1YlRlbXBsYXRlKGRhdGEubmFtZSwgZGF0YS5sb2NhdGlvbiwgZGF0YS5iaW8sIGRhdGEubG9naW4sIGRhdGEucHVibGljX3JlcG9zKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnaXRodWJcIikpO1xufSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbmRleC5zdGF0aWMudHNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19tYWtlVGVtcGxhdGVPYmplY3QgPSAodGhpcyAmJiB0aGlzLl9fbWFrZVRlbXBsYXRlT2JqZWN0KSB8fCBmdW5jdGlvbiAoY29va2VkLCByYXcpIHtcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxuICAgIHJldHVybiBjb29rZWQ7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGxpdF9odG1sXzEgPSByZXF1aXJlKFwibGl0LWh0bWxcIik7XG4vLyBUaGlzIGlzIGEgbGl0LWh0bWwgdGVtcGxhdGUgZnVuY3Rpb24uIEl0IHJldHVybnMgYSBsaXQtaHRtbCB0ZW1wbGF0ZS5cbmV4cG9ydHMuaGVsbG9UZW1wbGF0ZSA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBsaXRfaHRtbF8xLmh0bWwodGVtcGxhdGVPYmplY3RfMSB8fCAodGVtcGxhdGVPYmplY3RfMSA9IF9fbWFrZVRlbXBsYXRlT2JqZWN0KFtcIjxkaXY+SGVsbG8gXCIsIFwiITwvZGl2PlwiXSwgW1wiPGRpdj5IZWxsbyBcIiwgXCIhPC9kaXY+XCJdKSksIG5hbWUpOyB9O1xudmFyIHRlbXBsYXRlT2JqZWN0XzE7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21wb25lbnRzL3NpbXBsZS50c1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX21ha2VUZW1wbGF0ZU9iamVjdCA9ICh0aGlzICYmIHRoaXMuX19tYWtlVGVtcGxhdGVPYmplY3QpIHx8IGZ1bmN0aW9uIChjb29rZWQsIHJhdykge1xuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XG4gICAgcmV0dXJuIGNvb2tlZDtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgbGl0X2h0bWxfMSA9IHJlcXVpcmUoXCJsaXQtaHRtbFwiKTtcbi8vIFRoaXMgaXMgYSBsaXQtaHRtbCB0ZW1wbGF0ZSBmdW5jdGlvbi4gSXQgcmV0dXJucyBhIGxpdC1odG1sIHRlbXBsYXRlLlxuZXhwb3J0cy5naXRodWJUZW1wbGF0ZSA9IGZ1bmN0aW9uIChuYW1lLCBsb2NhdGlvbiwgYmlvLCBsb2dpbiwgcHVibGljX3JlcG9zKSB7IHJldHVybiBsaXRfaHRtbF8xLmh0bWwodGVtcGxhdGVPYmplY3RfMSB8fCAodGVtcGxhdGVPYmplY3RfMSA9IF9fbWFrZVRlbXBsYXRlT2JqZWN0KFtcIjxwPkdpdGh1YiB1c2VybmFtZTogXCIsIFwiIGlzIGxvY2F0ZWQgaW4gXCIsIFwiIGFuZCBpcyBhIFwiLCBcIiBhbmQgaXMga25vd24gb24gR2l0SHViIGFzIFwiLCBcIiwgaGUgaGFzIFwiLCBcIiByZXBvczwvcD5cIl0sIFtcIjxwPkdpdGh1YiB1c2VybmFtZTogXCIsIFwiIGlzIGxvY2F0ZWQgaW4gXCIsIFwiIGFuZCBpcyBhIFwiLCBcIiBhbmQgaXMga25vd24gb24gR2l0SHViIGFzIFwiLCBcIiwgaGUgaGFzIFwiLCBcIiByZXBvczwvcD5cIl0pKSwgbmFtZSwgbG9jYXRpb24sIGJpby50b0xvd2VyQ2FzZSgpLCBsb2dpbiwgcHVibGljX3JlcG9zKTsgfTtcbnZhciB0ZW1wbGF0ZU9iamVjdF8xO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy9naXRodWIudHNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==