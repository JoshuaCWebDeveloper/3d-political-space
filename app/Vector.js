/* Vector.js
 * Renders a a vector associated with a Location
 * Dependencies: three, whs modules functions
 * Author: Joshua Carter
 * Created: December 31, 2018
 */
"use strict";
//import modules
import { Quaternion, Vector3 } from 'three';
import { Cone, Cylinder } from 'whs';
//create class to represent a basic object
class Vector {
    
    // - vector (array - array[number]) Two [x, y, z] points to draw the vector
    // - thickness (number) Value to serve as thickness of components
    // - material (Material) Three.js material to use for the components
    constructor ({vector=[[0, 0, 0],[1, 1, 1]], thickness=0, material=null}) {
        //set length of arrow
        var arrowLength = 20,
            //set margin of vector at base
            baseMargin = 10,
            //create vectors
            [basePoint, pointB] = vector.map(p => new Vector3(...p)),
            //create additional vectors
            fullVector = pointB.clone(),
            threeVector = pointB.clone(),
            baseMarginPercent, pointA, cylinder, cylinderLength, cone, coneLength;
        //subtract basePoint from pointB
        fullVector.sub(basePoint);
        //caclculate base margin as a percentage of length
        baseMarginPercent = baseMargin/fullVector.length();
        //apply margin to basePoint to get pointA
        pointA = new Vector3(...basePoint.toArray().map((it, i) => {
            return it + (pointB.toArray()[i]-it)*baseMarginPercent;
        }));
        //subtract pointA from pointB
        threeVector.sub(pointA);
        //set lengths
        cylinderLength = threeVector.length() - arrowLength;
        coneLength = arrowLength;
        //normalize vector
        threeVector.normalize();
        //store components
        this.components = [];
        
        //create cylinder (line) of vector
        cylinder = new Cylinder({
            geometry: {
                radiusTop: thickness/2,
                radiusBottom: thickness/2,
                height: cylinderLength
            },
            material,
            //geometry will be translated so that position is at pointA
            //pos: [pointA.x, pointA.y, pointA.z]
            position: [pointA.x, pointA.y, pointA.z]
        });
        //add to components
        this.components.push(cylinder);
        //shift geometry up, so that position is at beginning of vector
        cylinder.geometry.translate(0, cylinderLength/2, 0);
        //update mesh
        //this.component.native = new Mesh(this.component.geometry, this.component.material);
        //align to vector
        this._alignToVector(cylinder, threeVector);
        
        //create cone (arrow) of vector
        cone = new Cone({
            geometry: {
                //radiusTop: thickness,
                //radiusBottom: thickness,
                radius: thickness,
                height: coneLength
            },
            material,
            //geometry will be translated so that position is at pointB
            //pos: [pointA.x, pointA.y, pointA.z]
            position: [pointB.x, pointB.y, pointB.z]
        });
        //add to components
        this.components.push(cone);
        //shift geometry down, so that position is at end of vector
        cone.geometry.translate(0, -coneLength/2, 0);
        //update mesh
        //this.component.native = new Mesh(this.component.geometry, this.component.material);
        //align to vector
        this._alignToVector(cone, threeVector);
    }
    
    _alignToVector (component, vector) {
        //create quaternion
        var quaternion = new Quaternion();
        //set vector on quarternion
        quaternion.setFromUnitVectors(new Vector3(0, 1, 0), vector);
        //apply quaternion to component
        component.native.applyQuaternion(quaternion);
    }
        
    addTo (instance) {
        //wraps .addTo() method of all of our WHS components
        //loop components
        for (let i=0; i<this.components.length; i++) {
            //call addTo()
            this.components[i].addTo(instance);
        }
    }
    
}
//export Vector class
export { Vector };
