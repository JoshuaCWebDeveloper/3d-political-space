/* PoliticalSpace.js
 * Top-level react component for rendering the 3D space
 * Dependencies: 
    - modules: query-string, react, react-dom
    - classes: ThreeSpace
 * Author: Joshua Carter
 * Created: July 13, 2019
 */
"use strict";
//import modules
import ReactDom from 'react-dom';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
//import classes
import { ThreeSpace } from './three-space/ThreeSpace.js';
//create PoliticalSpace component
function PoliticalSpace (props) {
    //set id
    var id = "app-container";
    
    //create and display three space
    useEffect(function () {
        //construct
        var space = new ThreeSpace({
            containerElement: document.getElementById(id),
            location: props.location,
            vectors: props.vectors
        });
        //destruct
        return function destruct () {
            space.destroy();
        };
    }, []); //only run effect single time
    
    //render
    return (
        <div id={id}></div>
    );
}
//define default props
PoliticalSpace.defaultProps = {
    location: [],
    vectors: []
};
//define prop types
PoliticalSpace.propTypes = {
    location: PropTypes.arrayOf(PropTypes.number),
    vectors: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
};
//export PoliticalSpace component
export { PoliticalSpace };
