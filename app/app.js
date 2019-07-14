/* app.js
 * Main 3D Political Space app file
 * Dependencies: 
    - modules: jcscript, query-string, react, react-dom
    - components: PoliticalSpace
    - other: url utils
 * Author: Joshua Carter
 * Created: November 11, 2018
 */
"use strict";
//import modules
import { JCFluxStore } from 'jcscript';
import ReactDom from 'react-dom';
import React from 'react';
//include components
import { App } from './AppComponent.js';
//include utils
import url from './url.js';

//create flux store
var Space = new JCFluxStore({
    title: '',
    location: [],
    vectors: []
});

//update store with url params
Space.update(url.parse(window.location.search));
        
//render HTML
ReactDom.render(
    (
        <App Space={Space} />
    ), document.getElementById('view-container')
);
