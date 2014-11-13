// TODO: Might need to think about decoding URLs passed back to user and encoding them for variables
"use strict";
	
/* global exports, define */
// Using module definition pattern from Mustache that can support CommonJS, AMD, or direct loading as a script
(function (global, factory) {
	if (typeof exports === "object" && exports) {
		console.log("Pointrel20130202 CommonJS init");
		factory(exports); // CommonJS
	} else if (typeof define === "function" && define.amd) {
		console.log("Pointrel20130202 AMD init");
		// define("Pointrel20130202", ['exports'], factory); // AMD
		define(['exports'], factory); // AMD
	} else {
		console.log("Pointrel20130202 script init", global, factory);
		global.Pointrel20130202 = {};
		factory(global.Pointrel20130202); // <script>
	}
}(this, function (pointrel) {
	
	// Default server method names for CGI scripts or server calss which can be overriden by user
	var serverMethods = {
	  resourceGet: "resource-get.php",
	  resourceAdd: "resource-add.php",
	  resourcePublish: "resource-publish.php",
	  variableQuery: "variable-query.php",
	  journalStore: "journal-store.php"
	};
	
	// "credentials" is either a string that is the userID or it is a dictionary with a field called "userID"
	
    // support functions

    function isString(something) {
    	return (typeof something === 'string' || something instanceof String);
    }
    
    function isFunction(something) {
    	return (typeof something === "function");
    } 
    
    /* global escape, unescape, window */

	/// encoding and decoding so can send binary data via pointrel and process it when it comes back
	function encodeAsUTF8(text) {
	    return unescape(encodeURIComponent(text));
	}
	
	// function decodeFromUTF8(text) {
	//    return decodeURIComponent(escape(text));
	//}
	
	//function validateBinaryData(dataString) {
	//    // slow for now...
	//    for (var i = 0; i < dataString.length; i++) {
	//        var c = dataString.charAt(i);
	//        // console.log("char", i, c.charCodeAt(0), c);
	//        // var charCode = c & 0xff;
	//        var charCode = c;
	//        if (charCode < 0 || charCode > 255) {
	//            alert("string had data outside the range of 0-255 at position: " + i);
	//            return false;
	//        }
	//    }
	//    return true;
	//}
	
	// From: http://phpjs.org/functions/base64_encode/
	function base64_encode(data) {
	    // http://kevin.vanzonneveld.net
	    // +   original by: Tyler Akins (http://rumkin.com)
	    // +   improved by: Bayron Guevara
	    // +   improved by: Thunder.m
	    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	    // +   bugfixed by: Pellentesque Malesuada
	    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	    // +   improved by: Rafał Kukawski (http://kukawski.pl)
	    // *     example 1: base64_encode('Kevin van Zonneveld');
	    // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
	    // mozilla has this native
	    // - but breaks in 2.0.0.12!
	    //if (isFunction(this.window['btoa']) {
	    //    return btoa(data);
	    //}
	    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	    //noinspection JSUnusedAssignment
	    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
	        ac = 0,
	        enc = "",
	        tmp_arr = [];

	    if (!data) {
	        return data;
	    }

	    do { // pack three octets into four hexets
	        o1 = data.charCodeAt(i++);
	        o2 = data.charCodeAt(i++);
	        o3 = data.charCodeAt(i++);

	        bits = o1 << 16 | o2 << 8 | o3;

	        h1 = bits >> 18 & 0x3f;
	        h2 = bits >> 12 & 0x3f;
	        h3 = bits >> 6 & 0x3f;
	        h4 = bits & 0x3f;

	        // use hexets to index into b64, and append result to encoded string
	        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	    } while (i < data.length);

	    enc = tmp_arr.join('');

	    var r = data.length % 3;

	    return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
	}

	// From: http://phpjs.org/functions/base64_decode/
	function base64_decode(data) {
	  // discuss at: http://phpjs.org/functions/base64_decode/
	  // original by: Tyler Akins (http://rumkin.com)
	  // improved by: Thunder.m
	  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  //   input by: Aman Gupta
	  //   input by: Brett Zamir (http://brett-zamir.me)
	  // bugfixed by: Onno Marsman
	  // bugfixed by: Pellentesque Malesuada
	  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  //   example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
	  //   returns 1: 'Kevin van Zonneveld'

		var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
		var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, dec = '', tmp_arr = [];

		if (!data) {
			return data;
		}

		data += '';

		do { // unpack four hexets into three octets using index points in b64
			h1 = b64.indexOf(data.charAt(i++));
			h2 = b64.indexOf(data.charAt(i++));
			h3 = b64.indexOf(data.charAt(i++));
			h4 = b64.indexOf(data.charAt(i++));

			bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

			o1 = bits >> 16 & 0xff;
			o2 = bits >> 8 & 0xff;
			o3 = bits & 0xff;

			if (h3 === 64) {
				tmp_arr[ac++] = String.fromCharCode(o1);
			} else if (h4 === 64) {
				tmp_arr[ac++] = String.fromCharCode(o1, o2);
			} else {
				tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
			}
		} while (i < data.length);

		dec = tmp_arr.join('');

		return dec;
	}
	
    // http://stackoverflow.com/questions/22582795/jquery-param-alternative-for-javascript
    function queryParams(data) {
        var array = [];
        
	    for(var key in data) {
	        array.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
	    }
	    
	   return array.join("&");
	}
    
    /* global XMLHttpRequest,  ActiveXObject */
    // Factories and creation method from: http://stackoverflow.com/questions/2557247/easiest-way-to-retrieve-cross-browser-xmlhttprequest
    var XMLHttpFactories = [
        function () {return new XMLHttpRequest();},
        function () {return new ActiveXObject("Msxml3.XMLHTTP");},
        function () {return new ActiveXObject("Msxml2.XMLHTTP");},
        function () {return new ActiveXObject("Msxml2.XMLHTTP.6.0");},
        function () {return new ActiveXObject("Msxml2.XMLHTTP.3.0");},
        function () {return new ActiveXObject("Microsoft.XMLHTTP");}
    ];

    function createXMLHTTPObject() {
        var xmlhttp = false;
        for (var i = 0; i < XMLHttpFactories.length; i++) {
            try {
                xmlhttp = XMLHttpFactories[i]();
            } catch (e) {
                continue;
            }
            break;
        }
        return xmlhttp;
    }
	
	// end support functions
    
    // SHA256 Support from http://www.movable-type.co.uk/scripts/sha256.html#src-code
    // Modified to assume string passed in is already in utf8 or binary form

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
    /*  SHA-256 implementation in JavaScript                (c) Chris Veness 2002-2014 / MIT Licence  */
    /*                                                                                                */
    /*  - see http://csrc.nist.gov/groups/ST/toolkit/secure_hashing.html                              */
    /*        http://csrc.nist.gov/groups/ST/toolkit/examples.html                                    */
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

    /**
     * SHA-256 hash function reference implementation.
     *
     * @namespace
     */
    var Sha256 = {};


    /**
     * Generates SHA-256 hash of string.
     *
     * @param   {string} msg - String to be hashed
     * @returns {string} Hash of msg as hex character string
     */
    Sha256.hash = function(msg) {
        
        // constants [§4.2.2]
        var K = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2 ];
        // initial hash value [§5.3.1]
        var H = [
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19 ];

        // PREPROCESSING 
     
        msg += String.fromCharCode(0x80);  // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

        // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
        var l = msg.length/4 + 2; // length (in 32-bit integers) of msg + ‘1’ + appended length
        var N = Math.ceil(l/16);  // number of 16-integer-blocks required to hold 'l' ints
        var M = new Array(N);
        
        var i;
        var t;

        for (i=0; i<N; i++) {
            M[i] = new Array(16);
            for (var j=0; j<16; j++) {  // encode 4 chars per integer, big-endian encoding
                M[i][j] = (msg.charCodeAt(i*64+j*4)<<24) | (msg.charCodeAt(i*64+j*4+1)<<16) | 
                          (msg.charCodeAt(i*64+j*4+2)<<8) | (msg.charCodeAt(i*64+j*4+3));
            } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
        }
        // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
        // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
        // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
        M[N-1][14] = ((msg.length-1)*8) / Math.pow(2, 32); M[N-1][14] = Math.floor(M[N-1][14]);
        M[N-1][15] = ((msg.length-1)*8) & 0xffffffff;


        // HASH COMPUTATION [§6.1.2]

        var W = new Array(64); var a, b, c, d, e, f, g, h;
        for (i=0; i<N; i++) {

            // 1 - prepare message schedule 'W'
            for (t=0;  t<16; t++) W[t] = M[i][t];
            for (t=16; t<64; t++) W[t] = (Sha256.σ1(W[t-2]) + W[t-7] + Sha256.σ0(W[t-15]) + W[t-16]) & 0xffffffff;

            // 2 - initialise working variables a, b, c, d, e, f, g, h with previous hash value
            a = H[0]; b = H[1]; c = H[2]; d = H[3]; e = H[4]; f = H[5]; g = H[6]; h = H[7];

            // 3 - main loop (note 'addition modulo 2^32')
            for (t=0; t<64; t++) {
                var T1 = h + Sha256.Σ1(e) + Sha256.Ch(e, f, g) + K[t] + W[t];
                var T2 =     Sha256.Σ0(a) + Sha256.Maj(a, b, c);
                h = g;
                g = f;
                f = e;
                e = (d + T1) & 0xffffffff;
                d = c;
                c = b;
                b = a;
                a = (T1 + T2) & 0xffffffff;
            }
             // 4 - compute the new intermediate hash value (note 'addition modulo 2^32')
            H[0] = (H[0]+a) & 0xffffffff;
            H[1] = (H[1]+b) & 0xffffffff; 
            H[2] = (H[2]+c) & 0xffffffff; 
            H[3] = (H[3]+d) & 0xffffffff; 
            H[4] = (H[4]+e) & 0xffffffff;
            H[5] = (H[5]+f) & 0xffffffff;
            H[6] = (H[6]+g) & 0xffffffff; 
            H[7] = (H[7]+h) & 0xffffffff; 
        }

        return Sha256.toHexStr(H[0]) + Sha256.toHexStr(H[1]) + Sha256.toHexStr(H[2]) + Sha256.toHexStr(H[3]) + 
               Sha256.toHexStr(H[4]) + Sha256.toHexStr(H[5]) + Sha256.toHexStr(H[6]) + Sha256.toHexStr(H[7]);
    };


    /**
     * Rotates right (circular right shift) value x by n positions [§3.2.4].
     * @private
     */
    Sha256.ROTR = function(n, x) {
        return (x >>> n) | (x << (32-n));
    };

    /**
     * Logical functions [§4.1.2].
     * @private
     */
    Sha256.Σ0  = function(x) { return Sha256.ROTR(2,  x) ^ Sha256.ROTR(13, x) ^ Sha256.ROTR(22, x); };
    Sha256.Σ1  = function(x) { return Sha256.ROTR(6,  x) ^ Sha256.ROTR(11, x) ^ Sha256.ROTR(25, x); };
    Sha256.σ0  = function(x) { return Sha256.ROTR(7,  x) ^ Sha256.ROTR(18, x) ^ (x>>>3);  };
    Sha256.σ1  = function(x) { return Sha256.ROTR(17, x) ^ Sha256.ROTR(19, x) ^ (x>>>10); };
    Sha256.Ch  = function(x, y, z) { return (x & y) ^ (~x & z); };
    Sha256.Maj = function(x, y, z) { return (x & y) ^ (x & z) ^ (y & z); };


    /**
     * Hexadecimal representation of a number.
     * @private
     */
    Sha256.toHexStr = function(n) {
        // note can't use toString(16) as it is implementation-dependant,
        // and in IE returns signed numbers when used on full words
        var s="", v;
        for (var i=7; i>=0; i--) { v = (n>>>(i*4)) & 0xf; s += v.toString(16); }
        return s;
    };
 
    // End SHA256 support
    
    
    // Currying two variables
    function success(callback, postProcessing, request, responseType) {
    	var response = request.response;
    	if (responseType === "json") {
    		// TODO: Exception handling
    		try {
    			response = JSON.parse(response);
    		} catch (err) {
    			callback("ERROR parsing JSON", response);
    		}
    	}
		// console.log("sendRequest result:", request, response);
		if (responseType === "text" || response.status === "OK") {
			if (isFunction(callback)) {
				if (isFunction(postProcessing)) {
					response = postProcessing(response);
				}
				callback(null, response);
			}
		} else {
			console.log("request failed", request, response);
			if (isFunction(callback)) {
				callback("FAILED", request);
			}
		}
    }
    
    function createOnReadyStateChangeCallback(responseType, remoteScript, callback, postProcessing, request) {
    	return function() {
			if (request.readyState != 4)  return;
			// 200 == success, 304 = not modified
			if  (request.status === 200 || request.status === 304) {
				success(callback, postProcessing, request, responseType);
			} else {
				// Otherwise an error
				console.log("sendRequest error", request, request.status, request.statusText);
				if (isFunction(callback)) {
					callback("ERROR", request);
				} else {
					alert("Failed POST to " + remoteScript + "\nstatus: " + request.status + " statusText: " + request.statusText);
				}
			}
		};
    }
    
	function sendRequest(serverURL, remoteScript, credentials, data, callback, postProcessing) {
		var userID = "anonymous";
		if (isString(credentials)) {
			userID = credentials;
		} else if (credentials.userID !== undefined) {
			userID = credentials.userID;
		}
		data.userID = userID;
		
		var requestType = "POST";
		var responseType = "json";
		
		// Everything else uses POST and returns JSON, except this one which returns immutable resources that could be cached
		if (remoteScript === serverMethods.resourceGet) {
			requestType = "GET";
			responseType = "text";
		}
		
		// console.log("sendRequest", remoteScript, requestType, dataType, data);
		
		var url = serverURL + remoteScript;
		if (requestType === "GET") {
			var urlParamsToAdd = queryParams(data);
			if (urlParamsToAdd) url += "?" + urlParamsToAdd;
		}
		
		var request = createXMLHTTPObject(); // new XMLHttpRequest();
		
        var async = true;
		request.open(requestType, url, async);
 
		// Not supported by older browsers like Safari 5
        // request.responseType = dataType;
        
        // TODO: Are these needed?
        // request.setRequestHeader('User-Agent','XMLHTTP/1.0');
        if (requestType === "POST") request.setRequestHeader('Content-type','application/x-www-form-urlencoded; charset=UTF-8');   
        
		// TODO: Are these headers really needed? They are not used in the other requests, although this one has encoded data
        // headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
		// cache: false,
        
	    request.onreadystatechange = createOnReadyStateChangeCallback(responseType, remoteScript, callback, postProcessing, request);
		
		if (requestType === "GET") {
			request.send();
		} else {
			var dataToSend = "";
			if (data) dataToSend = queryParams(data);
			request.send(dataToSend);
		}
	}

    //////// RESOURCES
	
	/* global Uint8Array */
	
    // TODO: Might need to think about decoding URLs passed back to user and encoding them for variables

    // Data passed to this needs to be only characters in the range 0-255 (byte)
    // That means you should encode and decode arbitrary JavaScript string text using the UTF8 functions if needed
	function pointrel_resource_add(serverURL, credentials, originalData, extension, callback) {
        console.log("pointrel_resource_add extension: ", extension);
        
        // originalData shauld be either a string or an ArrayBuffer
        
        var dataAsStringOfBytes;
        
        if (isString(originalData)) {
        	dataAsStringOfBytes = encodeAsUTF8(originalData);
            // special validation for now
            // if (!validateBinaryData(originalData)) { callback("FAILED Not Binary Data", null); return ""; }
        } else {
        	dataAsStringOfBytes = String.fromCharCode.apply(null, Array.prototype.slice.apply(new Uint8Array(originalData)));
         }

        //var stringInCryptoJSWords = CryptoJS.enc.Latin1.parse(dataAsStringOfBytes);
        //var hash = CryptoJS.SHA256(stringInCryptoJSWords);
        var hash = Sha256.hash(dataAsStringOfBytes);
        
        // console.log("pointrel_resource_add", originalData.length, dataAsStringOfBytes.length, "" + hash, originalData, dataAsStringOfBytes);

        var extensionSeperator = ".";
        if (extension === "") extensionSeperator = "";
        var uri = "pointrel://sha256_" + hash + "_" + dataAsStringOfBytes.length + extensionSeperator + extension;
        
        var byteStringEncodedAsBase64 = base64_encode(dataAsStringOfBytes);
        // console.log("encodedData", byteStringEncodedAsBase64);
        
        // check
        // var checkData = base64_decode(byteStringEncodedAsBase64);
        // if (checkData !== dataAsStringOfBytes) {
        // 	console.log("data check: does not match", checkData);
        // } else {
        //	console.log("data check matches");
        //}

        var data = {"resourceURI": uri, "resourceContent": byteStringEncodedAsBase64};
        // console.log("data sending", data);
        console.log("adding resource", uri);
        sendRequest(serverURL, serverMethods.resourceAdd, credentials, data, callback);

        // console.log("pointrel_resource_add returning: ", uri);
        return uri;
    }

	// The "charset" parameter of extraData (defaults to utf8 if not specified) will control how the binary data downloaded from the server is decoded into a string
    // To retrieve binary data from the server, try specifying "8BIT" or "BINARY" as the charset
	function pointrel_resource_get(serverURL, credentials, uri, extraData, callback) {
        console.log("pointrel_resource_get: ", uri);
        var data = {"resourceURI": uri};
        if (extraData) {
        	for (var key in extraData) {
        		if (extraData.hasOwnProperty(key)) {
        			data[key] = extraData[key];
        		}
        	}
        }
        sendRequest(serverURL, serverMethods.resourceGet, credentials, data, callback);
    }

    function pointrel_resource_publish(serverURL, credentials, resourceURI, destinationURL, callback) {
        console.log("pointrel_resource_publish: ", resourceURI, " to: ", destinationURL);
        
        var data = {"resourceURI": resourceURI, "destinationURL": destinationURL};
        sendRequest(serverURL, serverMethods.resourcePublish, credentials, data, callback);
    }

    //////// VARIABLES

    function pointrel_variable_new(serverURL, credentials, variableName, newValue, callback) {
        console.log("pointrel_variable_new: ", variableName);
        var data = {"variableName": variableName, "operation": "new", "newValue": newValue};
        sendRequest(serverURL, serverMethods.variableQuery, credentials, data, callback);
    }

    function pointrel_variable_get(serverURL, credentials, variableName, callback) {
        console.log("pointrel_variable_get: ", variableName);
        var data = {"variableName": variableName, "operation": "get"};
        sendRequest(serverURL, serverMethods.variableQuery, credentials, data, callback);
    }

    function pointrel_variable_set(serverURL, credentials, variableName, oldVersionURI, newVersionURI, callback) {
        console.log("pointrel_resource_set: ", variableName, " old: ", oldVersionURI, " new: ", newVersionURI);
        var data = {"variableName": variableName, "operation": "set", "currentValue": oldVersionURI, "newValue": newVersionURI};
        sendRequest(serverURL, serverMethods.variableQuery, credentials, data, callback);
    }

    function pointrel_variable_delete(serverURL, credentials, variableName, currentValue, callback) {
        console.log("pointrel_variable_delete: ", variableName);
        var data = {"variableName": variableName, "operation": "delete", currentValue: currentValue};
        sendRequest(serverURL, serverMethods.variableQuery, credentials, data, callback);
    }

    ///// JOURNALS
    
    // TODO: Aassuming utf8 by default when return data, but it maybe binary or other
    // TODO: Also, what happens if request data that ends in the middle of a multi-byte unicode character?
    
    function decodeResponseFromServer(responseFromServer) {
		responseFromServer.result = base64_decode(responseFromServer.result);
		return responseFromServer;
	}
    
    function pointrel_journal_ajax(operation, serverURL, credentials, journalName, journalType, callback, extra) {
        console.log("pointrel_journal_ajax", operation, journalName, journalType);
        
        // Build merged content with extra fields if needed
        var data = {"journalName": journalName, "journalType": journalType, "operation": operation};
        for (var attributeName in extra) {
            if (extra.hasOwnProperty(attributeName)) { data[attributeName] = extra[attributeName]; }
        }
        
        // console.log("data: ", data);
        
        var postProcessing = null;
        if (operation === "get") postProcessing = decodeResponseFromServer; 
        
        sendRequest(serverURL, serverMethods.journalStore, credentials, data, callback, postProcessing);
    }
    
    function pointrel_journal_exists(serverURL, credentials, journalName, journalType, callback) {
        pointrel_journal_ajax("exists", serverURL, credentials, journalName, journalType, callback, {});
    }
    
    function pointrel_journal_create(serverURL, credentials, journalName, journalType, journalFormat, callback) {
        pointrel_journal_ajax("create", serverURL, credentials, journalName, journalType, callback, {"journalFormat": journalFormat});
    }
    
    function pointrel_journal_delete(serverURL, credentials, journalName, journalType, header, size, callback) {
        pointrel_journal_ajax("delete", serverURL, credentials, journalName, journalType, callback, {"userSuppliedHeader": header, "userSuppliedSize": size});
    }
    
    function pointrel_journal_info(serverURL, credentials, journalName, journalType, callback) {
        pointrel_journal_ajax("info", serverURL, credentials, journalName, journalType, callback, {});
    }
    
    function pointrel_journal_get(serverURL, credentials, journalName, journalType, start, length, callback) {
        pointrel_journal_ajax("get", serverURL, credentials, journalName, journalType, callback, {"start": start, "length": length});
    }
    
    function pointrel_journal_put(serverURL, credentials, journalName, journalType, contentStringToAppend, callback) {
        var encodedContent = base64_encode(contentStringToAppend);
        // Maybe needed: headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
        pointrel_journal_ajax("put", serverURL, credentials, journalName, journalType, callback, {"encodedContent": encodedContent});
    }
    
    // Class that wraps the base functions and stores a base server URL and credentials
    function PointrelArchiver(serverURL, credentials) {
        this.serverURL = serverURL;
        this.credentials = credentials;

        // Resources
        
        this.resource_add = function (originalData, extension, callback) {
            return pointrel_resource_add(this.serverURL, this.credentials, originalData, extension, callback);

        };

        // extraParams is optional and cannot be a function; it can be used to specifiy a "charset" of "8bit" to return binary data
        this.resource_get = function (uri, extraParams, callback) {
        	if (isFunction(extraParams)) {
        		callback = extraParams;
        		extraParams = {};
        	}
            return pointrel_resource_get(this.serverURL, this.credentials, uri, extraParams, callback);

        };

        this.resource_publish = function (resourceURI, destinationURL, callback) {
            return pointrel_resource_publish(this.serverURL, this.credentials, resourceURI, destinationURL, callback);
        };
        
        // Variables

        this.variable_new = function (variableName, newVersionURI, callback) {
            return pointrel_variable_new(this.serverURL, this.credentials, variableName, newVersionURI, callback);

        };

        this.variable_get = function (variableName, callback) {
            return pointrel_variable_get(this.serverURL, this.credentials, variableName, callback);

        };

        this.variable_set = function (variableName, oldVersionURI, newVersionURI, callback) {
            return pointrel_variable_set(this.serverURL, this.credentials, variableName, oldVersionURI, newVersionURI, callback);

        };

        this.variable_delete = function (variableName, oldVersionURI, callback) {
            return pointrel_variable_delete(this.serverURL, this.credentials, variableName, oldVersionURI, callback);
        };
        
        // Journals
        
        this.journal_exists = function (journalName, callback) {
            return pointrel_journal_exists(this.serverURL, this.credentials, journalName, "journal", callback);
        };
        
        this.journal_create = function (journalName, journalFormat, callback) {
            return pointrel_journal_create(this.serverURL, this.credentials, journalName, "journal", journalFormat, callback);
        };
        
        this.journal_delete = function (journalName, header, size, callback) {
            return pointrel_journal_delete(this.serverURL, this.credentials, journalName, "journal", header, size, callback);
        };
        
        this.journal_info = function (journalName, callback) {
            return pointrel_journal_info(this.serverURL, this.credentials, journalName, "journal", callback);
        };
        
        this.journal_get = function (journalName, start, length, callback) {
            return pointrel_journal_get(this.serverURL, this.credentials, journalName, "journal", start, length, callback);
        };
        
        this.journal_put = function (journalName, contentStringToAppend, callback) {
            return pointrel_journal_put(this.serverURL, this.credentials, journalName, "journal", contentStringToAppend, callback);
        };
        
        // Indexes -- type can be either journal, index, or all
        
        this.index_exists = function (indexName, indexType, callback) {
            return pointrel_journal_exists(this.serverURL, this.credentials, indexName, indexType, callback);
        };
        
        this.index_info = function (indexName, indexType, callback) {
            return pointrel_journal_info(this.serverURL, this.credentials, indexName, indexType, callback);
        };
        
        this.index_get = function (indexName, indexType, start, length, callback) {
            return pointrel_journal_get(this.serverURL, this.credentials, indexName, indexType, start, length, callback);
        };
    }
	
	// Support classes that define conventient ways to use the Pointrel system as one approach
	// TODO: Move these function definitions into prototype definitions instead of setting when instance is created with this.X = function ...

	// A single use class to do a recursive search for versions in a linked list
	// Recursively go through a linked list of versions, up to but not including the stopAtVersionURI
	// stopAtVersionURI can be empty or null to load all versions
	// the search depth can be limited by specifying a maximumSearchDepth as a positive integer, otherwise use null
	// has a endingStatus of "end" if reached the end, "more" if there are more not searched due to maximum search limits,
	// "match" if stopped because reach matching URI, or "error" if something went wrong
	function PointrelVersionFollower(archiver, startingVersionURI, stopAtVersionURI, maximumSearchDepth, callbackForAllVersions, callbackForNextVersion) {
	    this.archiver = archiver;
	    this.startingVersionURI = startingVersionURI;
	    this.stopAtVersionURI = stopAtVersionURI;
	    this.maximumSearchDepth = maximumSearchDepth;
	    this.callbackForAllVersions = callbackForAllVersions;
	    this.callbackForNextVersion = callbackForNextVersion;
	    // reachedEnd can be "end", "more", "match", or "error"
	    this.versions = [];
	    this.searchStarted = false;
	    this.endingStatus = null;
	    this.errorStatus = null;
	    // Maybe add filtering and then counting versions read
	    // Maybe make a variant that can follow multiple diverging and converging branches

	    this.done = function (status) {
	        this.endingStatus = status;
	        // console.log("endingStatus", this.endingStatus);
	        if (isFunction(this.callbackForAllVersions)) this.callbackForAllVersions(null, this.versions, this.endingStatus, this);
	    };

	    this.nextVersion = function (version) {
	        if (isFunction(this.callbackForNextVersion)) this.callbackForNextVersion(null, version, this);
	    };

	    this.doneBecauseOfError = function (error) {
	        this.endingStatus = "error";
	        this.errorStatus = error;
	        console.log("endingStatus", this.endingStatus);
	        console.log("errorStatus", this.errorStatus);
	        if (isFunction(this.callbackForAllVersions)) {
	            this.callbackForAllVersions(this.errorStatus, this.versions, this.endingStatus, this);
	        } else {
	            alert("Some kind of error happened in VersionFollower");
	        }
	    };

	    // TODO: Could be an issue if this function is called a second time by someone else before it is done? May need guard variable to fail if called while running (or some other approach to pass around state through the recursion).
	    this.getPreviousVersionsRecursively = function (versionURI, currentSearchDepth) {
	        // console.log("getPreviousVersionsRecursively", versionURI, currentSearchDepth);
	        if (!versionURI) {
	            this.done("end");
	        } else if (versionURI === this.stopAtVersionURI) {
	            this.done("match");
	        } else if (this.maximumSearchDepth && currentSearchDepth >= this.maximumSearchDepth) {
	            this.done("more");
	        } else {
	            // JavaScript has "this" refer to the object a function is called on, or the global object
	            var self = this;
	            this.archiver.resource_get(versionURI, function (error, versionContents) {
	                // console.log("callback from archiver.resource_get", versionURI);
	                if (error) {
	                    var message = "Error happened on versionContents get: " + JSON.stringify(error);
	                    console.log("error in getPreviousVersionsRecursively", message, error, versionContents);
	                    self.doneBecauseOfError(message);
	                    return;
	                }
	                // console.log("versionContents:", versionContents);
	                var version = JSON.parse(versionContents);
	                // console.log("version read", version);
	                // Make a note of the place the version was read from in the version itself
	                version._readFromVersionURI = versionURI;
	                self.versions.push(version);
	                var previousVersion = version.previousVersion;
	                self.nextVersion(version);
	                self.getPreviousVersionsRecursively(previousVersion, currentSearchDepth + 1);
	            });
	        }
	    };

	    this.search = function () {
	        if (this.searchStarted) throw "Search can only be called once";
	        this.searchStarted = true;
	        this.getPreviousVersionsRecursively(this.startingVersionURI, 0);
	    };
	}

	function PointrelVariable(archiver, variableName) {
	    this.archiver = archiver;
	    this.variableName = variableName;
	    this.latestVariableVersionURI = null;
	    this.mostRecentlyLoadedVersionURI = null;
	    this.callbackWhenVersionsLoaded = null;

	    // TODO: Handle issue of searching with previous version not latest version -- semantic issue to resolve on meaning of those

//	        this.getLatestVersionX = function(callback) {
//	            var self = this;
//	            this.archiver.variable_get(this.variableName, function (error, variableGetResult) {
//	                console.log("in callback from variable_get");
//	                if (error) {
//	                    alert("Error happened on variable get");
//	                    self.latestVersionURI = null;
//	                    self.latestVersion = null;
//	                    callback(error, variableGetResult);
//	                    return;
//	                }
//	                self.latestVersionURI = variableGetResult.currentValue;
//	                this.archiver.resource_get(self.latestVersionURI, function (error, versionContents) {
//	                    console.log("in callback from resource_get");
//	                    if (error) {
//	                        alert("Error happened on versionContents get");
//	                        self.latestVersionURI = null;
//	                        self.latestVersion = null;
//	                        callback(error, versionContents);
//	                        return;
//	                    }
//	                    console.log("versionContents:", versionContents);
//	                    var version  = JSON.parse(versionContents);
//	                    // Make a note of the place the version was read from in the version itself
//	                    version._readFromVersionURI = self.latestVersionURI;
//	                    self.latestVersion = version;
//	                    callback(null, self.latestVersion);
//	                });
//	            });
//	        };

	    this.getLatestVariableVersionURI = function(callback) {
			// console.log("getLatestVariableVersionURI -- callback", callback);
			var self = this;
			this.archiver.variable_get(this.variableName, function(error, variableGetResult) {
				// console.log("callback for archiver.variable_get in getLatestVariableVersionURI");
				if (error) {
					console.log("error in getLastestVariableVersionURI", error);
					if (isFunction(callback)) {
						callback(error, variableGetResult);
					} else {
						alert("Error happened on variable get");
					}
					return;
				}
				self.latestVariableVersionURI = variableGetResult.currentValue;
				// console.log("getLatestVariableVersionURI result", self.latestVariableVersionURI);
				// console.log("Callback", callback);
				if (isFunction(callback)) callback(null, self.latestVariableVersionURI);
			});
	    };

	    this.newVersionsDone = function (error, versions, endingStatus, follower) {
			// console.log("newVersionsDone in variable", error, endingStatus, versions);
			// console.log("newVersionsDone this", this);
			if (error) {
				console.log("error in NewVersionsDone", error, versions, endingStatus, follower);
				if (isFunction(this.callbackWhenVersionsLoaded)) {
					this.callbackWhenVersionsLoaded(error, versions, endingStatus, follower);
				} else {
					alert("error in nevVersionsDone");
				}
				return;
			}
			if (versions) {
				this.mostRecentlyLoadedVersionURI = this.latestVariableVersionURI;
			}
			// console.log("about to try callback", this.callbackWhenVersionsLoaded);
			if (isFunction(this.callbackWhenVersionsLoaded)) this.callbackWhenVersionsLoaded(error, versions, endingStatus, follower);
			// console.log("after tried callback");
		};

	    this.getNewVersions = function (callbackWhenVersionsLoaded) {
			// console.log("getNewVersions -- ", callbackWhenVersionsLoaded);
			this.callbackWhenVersionsLoaded = callbackWhenVersionsLoaded;
			// console.log("after set: ", this.callbackWhenVersionsLoaded);
			var self = this;
			this.getLatestVariableVersionURI(function(error, variableGetResult) {
				// console.log("callback in getNewVersions after getLatestVariableVersionURI", variableGetResult);
				if (error) {
					console.log("error getting latest value of variable");
					if (isFunction(this.callbackWhenVersionsLoaded)) {
						this.callbackWhenVersionsLoaded(error, null, null, null);
					} else {
						alert("error in getNewVersions when getting latest value of variable");
					}
					return;
				}
				self.follower = new PointrelVersionFollower(self.archiver, self.latestVariableVersionURI, self.mostRecentlyLoadedVersionURI, 100, self.newVersionsDone.bind(self), null);
				// console.log("about to do follower.search");
				self.follower.search();
			});
	    };

		this.setNewVersionURI = function(newVersionURI, callback) {
			var self = this;
			this.archiver.variable_set(this.variableName, this.latestVariableVersionURI, newVersionURI, function(error, status) {
				if (error) {
					console.log("Error in setNewVersionURI", error, status);
					if (isFunction(callback)) {
						callback(error, status, null);
					} else {
						alert("Error happened when trying to set variable: " + JSON.stringify(status));
					}
					return;
				}
				// console.log("after updating to: ", newVersionURI);
				self.latestVariableVersionURI = newVersionURI;
				if (isFunction(callback)) callback(error, status, newVersionURI);
			});
		};
	}

	function PointrelJournal(archiver, journalName) {
		this.archiver = archiver;
		this.journalName = journalName;
		this.header = "";
		this.content = "";

		this.getNewContents = function(callback) {
			// console.log("geNewContents -- callback", callback);
			var self = this;

			this.archiver.journal_get(this.journalName, this.content.length, "END", function(error, journalGetResult) {
				// console.log("callback for archiver.journal_get in getNewContents");
				if (error) {
					console.log("Error happened on journal get", error, journalGetResult);
					// self.latestVariableVersionURI = null;
					if (isFunction(callback)) {
						callback(error, journalGetResult);
					} else {
						alert("Error happened on journal get");
					}
					return;
				}

				var newContent = journalGetResult.result;
				// console.log("getLatestVariableVersionURI result", newContent);
				if (newContent) {
					if (!self.content) {
						// Record the header
						self.header = newContent.split("\n")[0];
					}
					self.content = self.content + newContent;
				}
				// console.log("Callback", callback);
				if (isFunction(callback)) callback(null, self.content, newContent);
			});
		};
	}

	// The indexType can be: 
	// "journal" (but for that you could use PointrelJournal)
	// "index" (for a specific named index, returns a list of all resources and who added them)
	// "allResources" (for a list of all resources in the system and who added them)
	// "allIndexes" (for a list of all indexes)
	// "allJournals (for a list of all journals and who created them)
	// "allVariables" (for a list of all variables and who created them)
	// TODO: The allResources list or potentially other all lists could eventually be so big as to cause out-of-memory errors or similar problems like excessive CPU use delays, so need to use incremental loading to limit requests
	function PointrelIndex(archiver, indexName, indexType, fetchResources) {
		// Default some parameters
		if (indexType === undefined) indexType = "index";
		if (fetchResources === undefined && indexType === "index") {
			fetchResources = true;
		} else {
			fetchResources = false;
		}
		
		this.archiver = archiver;
		this.indexName = indexName;
		this.indexType = indexType;
		this.fetchResources = fetchResources;
		this.header = "";
		this.headerObject = null;
		this.content = "";
		this.entries = [];
		this.newEntries = [];

		this.getNewEntries = function(callback) {
			// console.log("geNewContents -- callback", callback);
			var self = this;
			var start = this.content.length;

			// TODO: Limit the length requested if the index is too big; would require getting the info first and some kind of looping
			this.archiver.index_get(this.indexName, this.indexType, start, "END", function (error, indexGetResult) {
				// console.log("callback for archiver.index_get in getNewEntries");
				if (error) {
					console.log("Error happened on index get", error, indexGetResult);
					// self.latestVariableVersionURI = null;
					if (isFunction(callback)) {
						callback(error, indexGetResult);
					} else {
						alert("Error happened on index get");
					}
					return;
				}
				var newContent = indexGetResult.result;
				// console.log("start", start, "content.length", self.content.length, "newContent.length", newContent.length, "getNewEntries result", newContent);
				self.newEntries = [];
				self.newResources = [];
				if (newContent) {
					// TODO: Error handling if there is only one new line or if JSON parse fails due to data corruption or failure while writing to index
					var lines = newContent.split("\n\n");
					for (var i = 0; i < lines.length; i++) {
						var indexEntry = lines[i];
						var parsedIndexEntry = null;
						try {
							parsedIndexEntry = JSON.parse(indexEntry);
						} catch (e) {
							console.log("Problem parsing JSON", indexEntry, e);
						}
						if (parsedIndexEntry !== null) {
							if (i === 0 && self.content ==="" && self.header === "") {
								// Handle the header on the first line as a special case
								self.header = lines[0];
								self.headerObject = parsedIndexEntry;
							} else {
								self.entries.push(parsedIndexEntry);
								self.newEntries.push(parsedIndexEntry);
							}
						}
					}
					self.content = self.content + newContent;
				}
				
				if (fetchResources) {
//					// Thinking about using JSDeferred to handle asynchronous chain of requests
//					loop(self.newEntries.length, function(i) {
//						return next(function() {
//							var entry = self.newEntries[i];
//							self.archiver.resource_get(entry, function (error, data) {
//								if (error) {
//									console.log("Error while fetching", i, entry, error);
//									// TODO: How to signal this issue? Maybe should just proceed anyway, in case it is a missing resource but more are available?
//								} else {
//									var resourceParsed = JSON.parse(data);
//									entry.resource = resourceParsed;
//								}
//							});
//							// Somehow need to do this at end: if (isFunction(callback)) callback(null, self.entries, self.newEntries);
//						});
//					});
					self.fetchEntries(self, 0, self.newEntries, callback);
				} else {
					// console.log("Callback", callback);
					if (isFunction(callback)) callback(null, self.entries, self.newEntries);
				}
			});
		};
		
		// indirectly recursive function -- could this lead to stack overflow if there are too many new entries in the index? Especially for main index?
		this.fetchEntries = function(self, entryIndex, newEntries, callback) {
			if (entryIndex >= newEntries.length) {
				// console.log("Callback", callback);
				if (isFunction(callback)) callback(null, self.entries, newEntries);
				return;
			}
			var entry = newEntries[entryIndex];
			var resourceURI = entry.name;
			
			// Support some legacy data from initial testing and development
			if (resourceURI === undefined) resourceURI = entry.resourceUUID;
			
			// console.log("fetchNewEntries about to request", resourceURI);
			if (!resourceURI) {
				// console.log("No resourceUUID", entry);
				self.fetchEntries(self, entryIndex + 1, newEntries, callback);
			} else if (entry.xContent !== undefined) {
				// Handle situation where resource data was directly embedded in index (to save network lookups)
				var data = base64_decode(entry.xContent);
				try {
					var resourceParsed = JSON.parse(data);
					entry.resourceContent = resourceParsed;
				} catch (e) {
					console.log("Problem parsing xContent as JSON", entry.xContent, data, e);
				}
				self.fetchEntries(self, entryIndex + 1, newEntries, callback);
			} else {
				self.archiver.resource_get(resourceURI, function (error, data) {
					if (error) {
						console.log("Error while fetching", entryIndex, entry, error);
						// TODO: How to signal this issue? Maybe should just proceed anyway, in case it is a missing resource but more are available?
					} else {
						// We know the resource must be JSON otherwise it would not have been indexed
						// TODO: Error handling
						var resourceParsed = JSON.parse(data);
						entry.resourceContent = resourceParsed;
					}
					// Continue to try to fetch other entries even if the current one failed
					self.fetchEntries(self, entryIndex + 1, newEntries, callback);
				});
			}
		};
		
	}

	// Useful for use by other code which would want to sort the index entries
	PointrelIndex.compareIndexEntriesByName = function(entry1, entry2) {
		var a = entry1.name;
		// Support some legacy data from initial testing and development
		if (a === undefined) a = entry1.resourceUUID;
		if (a) a = a.toLowerCase();
		var b = entry2.name;
		// Support some legacy data from initial testing and development
		if (b === undefined) b = entry2.resourceUUID;
		if (b) b = b.toLowerCase();
		return a < b ? -1 : a > b ? 1 : 0;
	};
        
    /// EXPORT

    // pointrel.resource_add = pointrel_resource_add;
    // pointrel.resource_get = pointrel_resource_get;
    // pointrel.resource_publish = pointrel_resource_publish;
    
    // pointrel.variable_new = pointrel_variable_new;
    // pointrel.variable_get = pointrel_variable_get;
    // pointrel.variable_set = pointrel_variable_set;
    // pointrel.variable_delete = pointrel_variable_delete;
    
    // pointrel.journal_exists = pointrel_journal_exists;
    // pointrel.journal_create = pointrel_journal_create;
    // pointrel.journal_delete = pointrel_journal_delete;
    // pointrel.journal_info = pointrel_journal_info;
    // pointrel.journal_get = pointrel_journal_get;
    // pointrel.journal_put = pointrel_journal_put;
    
    pointrel.PointrelArchiver = PointrelArchiver;
    pointrel.PointrelVersionFollower = PointrelVersionFollower;
    pointrel.PointrelVariable = PointrelVariable;
    pointrel.PointrelJournal = PointrelJournal;
    pointrel.PointrelIndex = PointrelIndex;
    pointrel.serverMethods = serverMethods;
    
    return pointrel;
}));
