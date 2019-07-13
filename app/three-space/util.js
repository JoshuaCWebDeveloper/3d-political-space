/* util.js
 * Utility methods for app
 * Dependencies: three modules
 * Author: Joshua Carter
 * Created: November 11, 2018
 */
"use strict";
//include modules
import { Texture } from 'three';

function applyImageToTexture ({
    canvas=null,
    imageUrl='',
    opacity=0.5,
    texture=null
}) {
    var image;
    //contcanvasext and texture are required
    if (!canvas || !texture) {
        throw new Error(`Missing required canvas (${canvas}) and texture (${texture})`);
    }
    //create new image object
    image = new Image();
    //set src
    image.src = imageUrl;
    //when loaded
    image.onload = function () {
        //create temporary canvas
        var tempCanvas = document.createElement("canvas"),
            tempContext = tempCanvas.getContext('2d'),
            //get context
            context = canvas.getContext('2d');
        //set dimensions of temporary canvas
        tempCanvas.width = image.width;
        tempCanvas.height = image.height;
        //draw image onto temporary canvas
        tempContext.drawImage(image, 0, 0, tempCanvas.width, tempCanvas.height);
        //set global alpha on context to apply image semi-transparently
        context.globalAlpha = opacity;
        //apply image as pattern
        context.fillStyle = context.createPattern(tempCanvas, 'repeat');
        context.fillRect(0, 0, canvas.width, canvas.height);
        //set update flag on texture so that it is re-rendered
        texture.needsUpdate = true;
    };
}

function generateGradientTexture ({
    canvasDimensions=[512, 512],
    colors=["#000000", "#ffffff"],
    imageOpacity=0.5,
    imageTexture='',
    linearCoordinates=[0, 256, 512, 256],
    rotation=0
}) {
    // create canvas
    var canvas = document.createElement( 'canvas' ),
        [cw, ch] = canvasDimensions,
        context, gradient, texture;
    canvas.width = cw;
    canvas.height = ch;

    // get context
    context = canvas.getContext( '2d' );

    // draw gradient
    context.rect( 0, 0, cw, ch );
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
    
    //apply image
    applyImageToTexture({
        canvas,
        imageUrl: imageTexture,
        opacity: imageOpacity,
        texture
    });
    
    //return texture
    return texture;
}
    
//export functions
export { generateGradientTexture };
