/* util.js
 * Utility methods for app
 * Dependencies: three modules
 * Author: Joshua Carter
 * Created: November 11, 2018
 */
"use strict";
//include modules
import { Texture } from 'three';

function generateGradientTexture ({
    colors=["#000000", "#ffffff"],
    linearCoordinates=[0, 256, 512, 256],
    rotation=0,
    size=512
}) {
    // create canvas
    var canvas = document.createElement( 'canvas' ),
        context, gradient, texture;
    canvas.width = size;
    canvas.height = size;

    // get context
    context = canvas.getContext( '2d' );

    // draw gradient
    context.rect( 0, 0, size, size );
    gradient = context.createLinearGradient(...linearCoordinates);
    //add colors
    for (let i=0; i<colors.length; i++) {
        gradient.addColorStop(i, colors[i]);
    }
    context.fillStyle = gradient;
    context.fill();
    
    //create texture
    texture = new Texture(canvas);
    //texture needs to trigger update
    texture.needsUpdate = true;
    //set rotation
    texture.rotation = rotation;
    //return texture
    return texture;
}
    
//export functions
export { generateGradientTexture };
