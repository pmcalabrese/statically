import { render } from 'lit-html';
import { helloTemplate } from './components/simple';
import { githubTemplate } from './components/github';

render(helloTemplate('Kevin'), document.getElementById("hello"));

fetch("https://api.github.com/users/pmcalabrese").then((response) => {
    return response.json()
}).then((data) => {
    render(githubTemplate(data.name, data.location, data.bio, data.login, data.public_repos), document.getElementById("github"));
})