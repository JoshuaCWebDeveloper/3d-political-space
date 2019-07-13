/* app.js
 * Main 3D Political Space app file
 * Dependencies: 
    - modules: query-string, react, react-dom
    - components: PoliticalSpace
 * Author: Joshua Carter
 * Created: November 11, 2018
 */
"use strict";
//import modules
import qs from 'query-string';
import ReactDom from 'react-dom';
import React from 'react';
//include components
import { PoliticalSpace } from './PoliticalSpace.js';

//fetch params
const params = Object.assign({
    title: '',
    location: "",
    vectors: []
}, qs.parse(window.location.search, {arrayFormat: 'index'}));
//sanitize
if (params.vectors && !Array.isArray(params.vectors)) {
    params.vectors = [params.vectors];
}
//parse
params.location = params.location ? params.location.split(",")
    .map(it => parseFloat(it)) : [];
params.vectors = params.vectors ? params.vectors.map(
    it => it.split(",").map(it => parseFloat(it))
) : [];
        
//render HTML
ReactDom.render(
    (
        <div className="app">
            <div id="space-title">
                <h1>{params.title}</h1>
            </div>
        
            <PoliticalSpace location={params.location} vectors={params.vectors} />
        </div>
    ), document.getElementById('view-container')
);
