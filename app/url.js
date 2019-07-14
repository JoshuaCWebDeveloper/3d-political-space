/* url.js
 * Utility methods for url params
 * Dependencies: query-string modules
 * Author: Joshua Carter
 * Created: July 14, 2018
 */
"use strict";
//include modules
import qs from 'query-string';

function parse (query="") {
    //backwards compatible params
    var backParams = Object.assign({
            vectors: false
        }, qs.parse(query)),
        //fetch params
        params = Object.assign({
            title: '',
            location: "",
            vectors: []
        }, qs.parse(query, {arrayFormat: 'index'}));
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
    //merge backwards compatible params
    if (Array.isArray(backParams.vectors)) {
        params.vectors = params.vectors.concat(backParams.vectors);
    }
    return params;
}

function stringify (params) {
    //encode
    params.location = params.location.join(",");
    params.vectors = params.vectors.map(it => it.join(","));
    //stringify
    return qs.stringify(params, {arrayFormat: 'index'});
}
    
//export functions
export default { parse, stringify };
