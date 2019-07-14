/* AppComponent.js
 * Top-level react component for rendering the 3D space
 * Dependencies: 
    - modules: query-string, react, react-dom
    - classes: PoliticalSpace
    - other: url utils
 * Author: Joshua Carter
 * Created: July 14, 2019
 */
"use strict";
//import modules
import ReactDom from 'react-dom';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import qs from 'query-string';
//import classes
import { PoliticalSpace } from './PoliticalSpace.js';
//include utils
import url from './url.js';

//create AppComponent component
function AppComponent (props) {
    //set id
    var id = "app-container",
        //define data getter
        getData = function () {
            return props.Space.get(['title', 'location', 'vectors']);
        },
        //get state
        [spaceData, setSpaceData] = useState(getData());
    
    //subscribe to store
    useEffect(function () {
        var spaceListener = function () {
            //get data
            var data = getData();
            //update if changed
            if (JSON.stringify(data) != JSON.stringify(spaceData)) {
                setSpaceData(data);
                //update url
                history.pushState({}, "", window.location.href.replace(
                    window.location.search, "?"+url.stringify(data)
                ));
            }
        };
        props.Space.addChangeListener(spaceListener);
        //unsubscribe
        return function unsubscribe () {
            props.Space.removeChangeListener(spaceListener);
        };
    });
    
    //render
    return (
        <div className="app">
            <div id="space-title">
                <h1>{spaceData.title}</h1>
            </div>
        
            <PoliticalSpace {...spaceData} />
        </div>
    );
}
//define prop types
AppComponent.propTypes = {
    Space: PropTypes.object.isRequired
};

//export AppComponent component
export { AppComponent as App };
