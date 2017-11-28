import { html } from 'lit-html';

// This is a lit-html template function. It returns a lit-html template.
export const helloTemplate = (name: string) => html`<div>Hello ${name}!</div>`;