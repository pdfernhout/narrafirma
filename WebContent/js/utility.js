"use strict";

define([
        
], function() {
    
    function startsWith(str, prefix) {
        // console.log("startsWith", prefix, str.lastIndexOf(prefix, 0) === 0, str);
        if (!str) {
            return false;
        }
      return str.lastIndexOf(prefix, 0) === 0;
    }
    
    return {
        "startsWith": startsWith
    };
});