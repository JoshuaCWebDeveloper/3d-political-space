/* ThreeOrbitControls.js
 * Allows all Three properties to be set on the OrbitControls module
 * Dependencies: whs module
 * Author: Joshua Carter
 * Created: November 11, 2018
 */
"use strict";
//include modules
import { OrbitControlsModule } from 'whs';
//create class to represent a basic object
class ThreeOrbitControls {
    
    constructor (params) {
        //wrap OrbitControlsModule.constructor()
        this.OrbitControls = new OrbitControlsModule(params);
        //store params
        this.params = params;
        //remove OrbitControlsModule params
        delete this.params.follow;
        delete this.params.object;
        delete this.params.target;
    }
    
    manager (manager) {
        //wrap OrbitControlsModule.manager()
        this.OrbitControls.manager(manager);
        //apply params to controls
        Object.assign(this.OrbitControls.controls, this.params);
    }

}
//export ThreeOrbitControls class
export { ThreeOrbitControls };
