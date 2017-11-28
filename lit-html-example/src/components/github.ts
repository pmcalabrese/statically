import { html } from 'lit-html';

// This is a lit-html template function. It returns a lit-html template.
export const githubTemplate = (name: string, location: string, bio:string, login:string, public_repos: number) => html`<p>Github username: ${name} is located in ${location} and is a ${bio.toLowerCase()} and is known on GitHub as ${login}, he has ${public_repos} repos</p>`;