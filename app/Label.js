/* Label.js
 * Text component that allows geometry operations to be queued immediately after creation
 * Dependencies: Q, sinon, whs modules
 * Author: Joshua Carter
 * Created: November 17, 2018
 */
"use strict";
//include modules
import Q from 'q';
import sinon from 'sinon';
import { Text } from 'whs';
//create class to represent a basic object
class Label extends Text {
    
    constructor (params) {
        var spyNames;
        //callText.constructor()
        super(params);
        //create spies
        this.geometrySpies = {};
        spyNames = ["center"];
        for (let i=0; i<spyNames.length; i++) {
            this.geometrySpies[spyNames[i]] = sinon.spy();
        }
    }
    
    build () {
        //call Text.build(), store promise
        var promise = super.build(...arguments);
        //when built
        Q(promise).done(() => {
            //loop spies, and call them on our geometry
            for (let name in this.geometrySpies) {
                //loop calls
                let calls = this.geometrySpies[name].getCalls();
                for (let i=0; i<calls.length; i++) {
                    //call method
                    this.geometry[name](...calls[i].args);
                }
            }
        });
        //return our promise
        return promise;
    }
    
    get geometry () {
        //if we have a geometry
        if (this.native) {
            //return it instead
            return super.geometry;
        }   //else, we don't have one yet
        //return proxy of spies
        return this.geometrySpies;
    }

}
//export Label class
export { Label };
