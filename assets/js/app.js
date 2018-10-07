// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket"

import React from 'react';
import ReactDOM from 'react-dom';
import { Quiz } from './Quiz';
import { QuizHost } from './QuizHost';
import { QuizSpectator } from './QuizSpectator';

// Now that you are connected, you can join channels with a topic:
let channel = socket.channel("room:lobby", {user: "Kel"})

// I can accomplish the same sort of hackery with ReactRouter,
// but let's keep it simple.
console.log(window.location.href);
if (window.location.href.includes('show-host')) {
    console.log("first");
    ReactDOM.render(<QuizHost channel={channel} />, document.getElementById("container"));
} else if (window.location.href.includes("spectate")) {
    ReactDOM.render(<QuizSpectator channel={channel} />, document.getElementById('container'));
} else {
    ReactDOM.render(<Quiz channel={channel} />, document.getElementById('container'));
}