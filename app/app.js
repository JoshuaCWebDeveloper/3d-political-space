/* app.js
 * Main 3D Political Space app file
 * Dependencies: 
    - modules: query-string, react, react-dom, three, whs
    - classes: Cube, Location, ThreeOrbitControls
 * Author: Joshua Carter
 * Created: November 11, 2018
 */
"use strict";

//import modules
import qs from 'query-string';
import ReactDom from 'react-dom';
import React from 'react';
import * as THREE from 'three';
import * as WHS from 'whs';
//include classes
import { Cube } from './Cube.js';
import { Location } from './Location.js';
import { ThreeOrbitControls } from './ThreeOrbitControls.js';

//parse params
const params = Object.assign({
    title: '',
    location: "",
    vectors: []
}, qs.parse(window.location.search));
//sanitize
if (params.vectors && !Array.isArray(params.vectors)) {
    params.vectors = [params.vectors];
}

//render HTML
ReactDom.render(
    (
        <div className="app">
            <div id="space-title">
                <h1>{params.title}</h1>
            </div>
        
            <div id="app-container"></div>
        </div>
    ), document.getElementById('view-container')
);
