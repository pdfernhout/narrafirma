"use strict";
/*jslint browser:true */

define("conceptMap", [
    "dojo/ready",
    "dojo/dom-attr",
    "dojo/io-query",
    "dijit/registry",
    "dojox/gfx",
    "dojox/gfx/move",
    "dojox/gfx/Moveable",
    "dijit/form/TextBox",
    "dijit/form/Button",
    "dijit/form/Textarea",
    "dijit/Dialog",
    "dojo/touch",
    "Pointrel20130202",
    "Pointrel20130202Utility"], function (ready, domAttr, ioQuery, registry, gfx, move, Moveable, TextBox, Button, SimpleTextarea, Dialog, touch, Pointrel20130202, Pointrel20130202Utility) {

   // Resources:
   // # http://dojotdg.zaffra.com/2009/03/dojo-now-with-drawing-tools-linux-journal-reprint/

    var archiveURL = "../server/";
    var credentials = Pointrel20130202Utility.LoginHelper.getUserIDOrAnonymous();
    var archiver = new Pointrel20130202.PointrelArchiver(archiveURL, credentials);

    var textBox = null;
    var urlBox = null;

    var surfaceWidth = 800;
    var surfaceHeight = 500;
    var _mainSurface = null;
    var mainSurface = null;

    var items = null;
    var changesCount = 0;

    var lastSelectedItem = null;

    var diagramName = "saved";

    var currentVersionURI = "";

    // Some Dom nodes
    var loginButton;
    var logoutButton;
    var accountText;

    // dialogs
    var sourceDialog;
    var entryDialog;
    var loginDialog;
    // var signupDialog;
    
    // uuidFast from http://www.broofa.com/2008/09/javascript-uuid-function/
    // Copyright (c) 2010 Robert Kieffer
    // Dual licensed under the MIT and GPL licenses.
    // A more performant, but slightly bulkier, RFC4122v4 solution. 
    // We boost performance by minimizing calls to random()
    var CHARS2 = '0123456789abcdefghijklmnopqrstuvwxyz'.split(''); 
    function uuidFast() {
    	var chars = CHARS2, uuid = new Array(32), rnd=0, r;
    	for (var i = 0; i < 32; i++) {
    		if (i === 14) {
    			uuid[i] = '4';
    		} else {
    			if (rnd <= 0x02) {rnd = 0x2000000 + (Math.random() * 0x1000000) | 0; }
    			r = rnd & 0xf;
    			rnd = rnd >> 4;
    			uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
    		}
    	}
    	return uuid.join('');
    }

    function forEach(array, theFunction) {
        for(var index = 0, length = array.length; index < length; ++index) {
            theFunction(index, array[index], array);
        }
    }

    function setHTML(field, value) {
        domAttr.set(field, "innerHTML", value);
    }

    function getHiddenJSONData(fieldName) {
        // Idea from: http://www.webdeveloper.com/forum/showthread.php?t=137518
        var hiddenDataElement = document.getElementById(fieldName);
        var hiddenDataString = hiddenDataElement.value;
        if (hiddenDataString === "") {
            // console.log("First time loading");
            return null;
        } else {
            // console.log("Already loaded");
            return JSON.parse(hiddenDataString);
        }
    }

    function setHiddenJSONData(fieldName, data) {
        // Idea from: http://www.webdeveloper.com/forum/showthread.php?t=137518
        var hiddenDataElement = document.getElementById(fieldName);
        var hiddenDataString = JSON.stringify(data);
        hiddenDataElement.value = hiddenDataString;
        return hiddenDataString;
    }

    function conceptMapPageLoaded() {
        console.log("Called twirlip conceptMap code");
        setHTML("nojavascript", 'Twirlip Concept Map');

        console.log("location.href", location.href);
        console.log("document.URL", document.URL);

        var uri = document.URL;
        var queryString = uri.substring(uri.indexOf("?") + 1, uri.length);
        console.log("queryString", queryString);
        if (queryString) {
            var q = ioQuery.queryToObject(queryString);
            console.log("query", q);
            //noinspection JSUnresolvedVariable
            if (q && q.diagram) {
                //noinspection JSUnresolvedVariable
                diagramName = q.diagram;
            }
        }

        // Idea from: http://www.webdeveloper.com/forum/showthread.php?t=137518
        items = getHiddenJSONData("items");

        if (items === null) {
            console.log("First time loading");
            items = [];
            requestLatestItemsToLoad();
        } else {
            console.log("Already loaded");
            console.log("items", items);
        }

        changesCount = 0;

        defineEntryDialog();
        defineSourceDialog();

        setupMainButtons();

        defineLoginDialog();
        // defineSignupDialog();

        setupAccountRelatedButton();

        var newBr = document.createElement("br");
        document.body.appendChild(newBr);

        addItemEditor();

        setupMainSurface();

        updateDisplayedAccountInformation();
    }

    function setFieldValue(name, value) {
        registry.byId(name).set("value", value);
    }

    function setTextAreaValue(name, value) {
        registry.byId(name).set("value", value);
    }

    function newButton(name, label, callback) {
        var theButton = new Button({
            label: label,
            onClick: callback
        }, name);
        document.body.appendChild(theButton.domNode);

        return theButton;
    }

    function setupMainButtons() {

        var addButton = newButton("addButton", "New item", function () {
            setFieldValue("name", "");
            setFieldValue("url", "");
            entryDialog.show();
        });

        var newDiagramButton = newButton("newDiagramButton", "Link to new diagram", function () {
            var uuid = "pce:org.twirlip.ConceptMap:uuid:" + uuidFast();
            var url = "conceptMap.html?diagram=" + uuid;
            setFieldValue("name", "");
            setFieldValue("url", url);
            entryDialog.show();
        });

        var sourceButton = newButton("sourceButton", "Diagram Source", function () {
            setTextAreaValue("sourceTextArea", JSON.stringify(items));
            sourceDialog.show();
        });

        var saveChangesButton = newButton("saveChangesButton", "Save Changes", function () {
            console.log("About to save");
            saveChanges();
        });
    }

    function setupAccountRelatedButton() {
        accountText = document.createTextNode("Not logged in");
        document.body.appendChild(accountText);

        loginButton = newButton("loginButton", "Login", function () {
            //setFieldValue("loginName", "");
            //setFieldValue("loginPassword", "");
            loginDialog.show();
        });

        // signupButton = newButton("signupButton", "Signup", function() {
        //   setFieldValue("signupPassword", "");
        //   setFieldValue("signupPassword2", "");
        //   signupDialog.show();
        // });

        logoutButton = newButton("logoutButton", "Logout", function () {
            Pointrel20130202Utility.LoginHelper.setUserID("");
            updateDisplayedAccountInformation();
        });

        // TODO maybe: updateDisplayedAccountInformation();
    }

    function updateDisplayedAccountInformation() {
        var userID = Pointrel20130202Utility.LoginHelper.getUserID();
        console.log("user name", userID);
        if (userID) {
            loginButton.domNode.style.display = "none";
            // signupButton.domNode.style.display = "none";
            logoutButton.domNode.style.display = "";
            accountText.textContent = "Logged in as: " + userID;
        } else {
            loginButton.domNode.style.display = "";
            // signupButton.domNode.style.display = "";
            logoutButton.domNode.style.display = "none";
            accountText.textContent = "Not logged in";
        }
    }

    function setupMainSurface() {
        var node = document.createElement("div");
        var divForCanvasInfo = {width: surfaceWidth, height: surfaceHeight, border: "solid 1px"};
        domAttr.set(node, "style", divForCanvasInfo);
        document.body.appendChild(node);
        _mainSurface = gfx.createSurface(node, divForCanvasInfo.width, divForCanvasInfo.height);
        mainSurface = _mainSurface.createGroup();

        // surface.whenLoaded(drawStuff);

        rebuildItems(mainSurface, items);
        //   items.push({text: theText, url: theURL, x: circle.cx, y: circle.cy});
    }

    function defineSourceDialog() {
        sourceDialog = new Dialog({
            title: "Diagram source",
            id: "sourceDialog",
            style: {width: "800px", height: "600px", overflow: "auto"},
            content: "source: <input data-dojo-type='dijit/form/SimpleTextarea' type='text' name='sourceTextArea' rows='30' id='sourceTextArea'>" +
                '<br/><button data-dojo-type="dijit/form/Button" type="submit" onClick="document.updateSource();">Update</button>' +
                '<button data-dojo-type="dijit/form/Button" type="submit">Cancel</button>'
        });
        // Make our function available globally so the dialog can find it
        document.updateSource = updateSource;
    }

    function defineEntryDialog() {
        entryDialog = new Dialog({
            title: "New item",
            id: "formDialog",
            style: "width: 300px",
            content: "name: <input data-dojo-type='dijit/form/TextBox' type='text' name='name' id='name'>" +
                "<br/>url: <input data-dojo-type='dijit/form/TextBox' type='text' name='url' id='url'>" +
                //'<br/><button data-dojo-type="dijit/form/Button" type="submit" onClick="return registry.byId("formDialog").isValid();">OK</button>'
                '<br/><button data-dojo-type="dijit/form/Button" type="submit" onClick="document.clickedNewEntryOK();">OK</button>'
        });
        document.clickedNewEntryOK = clickedNewEntryOK;
    }

    function defineLoginDialog() {
        loginDialog = new Dialog({
            title: "Login",
            id: "loginDialog",
            style: "width: 300px",
            content: "name: <input data-dojo-type='dijit/form/TextBox' type='text' name='loginName' id='loginName'>" +
                // "<br/>password: <input data-dojo-type='dijit/form/TextBox' type='password' name='loginPassword' id='loginPassword'>" +
                '<br/><button data-dojo-type="dijit/form/Button" type="submit" onClick="document.clickedLogin();">Login</button>'
        });
        document.clickedLogin = clickedLogin;
    }

//    function defineSignupDialog() {
//        signupDialog = new Dialog({
//            title: "Signup for new account",
//            id: "signupDialog",
//            style: "width: 300px",
//            content: "name: <input data-dojo-type='dijit/form/TextBox' type='text' name='signupName' id='signupName'>" +
//                "<br>email: <input data-dojo-type='dijit/form/TextBox' type='text' name='signupEmail' id='signupEmail'>" +
//                "<br><i>Please <b>do not use a valuable password</b> like one already used for a bank or significant social media site.</i>" +
//                "<br/>password: <input data-dojo-type='dijit/form/TextBox' type='password' name='signupPassword' id='signupPassword'>" +
//                "<br/>confirm: <input data-dojo-type='dijit/form/TextBox' type='password' name='signupPassword2' id='signupPassword2'>" +
//                '<br/><button data-dojo-type="dijit/form/Button" type="submit" onClick="document.clickedSignup();">Create account</button>'
//        });
//        document.clickedSignup = clickedSignup
//    }

    function addItemEditor() {
        var textBoxWidth = "width: 50em; margin-left: 2em;";
        textBox = new TextBox({
            name: "conceptTextBox",
            value: "",
            placeHolder: "type in a concept",
            style: textBoxWidth
        }, "conceptTextBox");
        document.body.appendChild(textBox.domNode);

        var updateItemButton = newButton("updateItemButton", "Update item", function () {
            if (lastSelectedItem) {
                lastSelectedItem.text = textBox.get("value");
                lastSelectedItem.url = urlBox.get("value");
                changesCount++;
                // Wasteful to do all of them
                rebuildItems(mainSurface, items);
            }
        });

        var newBreak = document.createElement("br");
        document.body.appendChild(newBreak);

        // var urlBoxWidth = "width: 500em; border: 5px solid #C4C4C4; padding: 6px;";
        var urlBoxWidth = "width: 50em; margin-left: 2em;";
        urlBox = new TextBox({
            name: "urlTextBox",
            value: "", // http://www.rakontu.org
            placeHolder: "type in a url",
            style: urlBoxWidth
        }, "urlTextBox");
        document.body.appendChild(urlBox.domNode);

        var goButton = newButton("goButton", "Go", function () {
            go(urlBox.get("value"));
        });

        //  var newBreak = document.createElement("br");
        //  document.body.appendChild(newBreak);
    }

    function clickedLogin(event) {
        console.log("Clicked Login", event);
        var data = loginDialog.get("value");
        console.log("login data", data);
        // setFieldValue("loginPassword", "");
        //noinspection JSUnresolvedVariable
        Pointrel20130202Utility.LoginHelper.setUserID(data.loginName);
        updateDisplayedAccountInformation();
        loginDialog.hide();

        credentials = Pointrel20130202Utility.LoginHelper.getUserIDOrAnonymous();
        archiver = new Pointrel20130202.PointrelArchiver(archiveURL, credentials);
    }

//    function clickedSignup(event) {
//        console.log("Clicked Signup", event);
//        var data = signupDialog.get("value");
//        console.log("data", data);
//        var valid = false;
//        if (!data.signupEmail) {
//            alert("No email address entered");
//        } else if (!data.signupPassword) {
//            alert("No password entered");
//        } else if (data.signupPassword.length < 3) {
//            alert("Password must be at least three characters");
//        } else if (data.signupPassword != data.signupPassword2) {
//            alert("Two passwords do not match");
//        } else {
//            valid = true;
//        }
//        setFieldValue("signupPassword", "");
//        setFieldValue("signupPassword2", "");
//        if (valid) {
//            var userDocument = {name: data.signupName, email: data.signupEmail};
//            jQuery.couch.signup(userDocument, data.signupPassword, {success: function () {
//                console.log("Created account OK");
//                alert("Account created OK");
//                jQuery.couch.login({name: data.signupName, password: data.signupPassword, success: function () {
//                    updateDisplayedAccountInformation(data.signupName);
//                }});
//            }});
//        }
//    }

    function clickedNewEntryOK(event) {
        console.log("Clicked OK", event);
        var data = entryDialog.get("value");
        console.log("data", data);
        var group = addItem(mainSurface, null, data.name, data.url);
        items.push(group.item);
        console.log("items", items);
        changesCount++;
        // item.text = textBox.get("value");
        // item.url = urlBox.get("value");
    }

    function updateSource(event) {
        console.log("Clicked updateSource", event);
        var data = sourceDialog.get("value");
        console.log("data", data);

        //noinspection JSUnresolvedVariable
        var jsonText = data.sourceTextArea;
        console.log("data", jsonText);

        items = JSON.parse(jsonText);

        console.log("parsed", items);

        rebuildItems(mainSurface, items);
        changesCount++;
        console.log("Updated OK");
    }

    function rebuildItems(surface, items) {
        // console.log("rebuildItems");
        surface.clear();
        forEach(items, function (index, item) {
            // console.log("looping over: " + item);
            addItem(surface, item);
        });
        // console.log("done rebuildItems");
    }

    function requestLatestItemsToLoad() {
        //dojo.when(twirlipStore.get(diagramName), function(old) {
        //  console.log("old", old);
        //  if (old) {
        //    items = old.items;
        //    rebuildItems(mainSurface, items);
        //  }
        // }, function(error) {console.log("error", error);});

        archiver.variable_get(diagramName, function (error, variableGetResult) {
            console.log("in callback from variable_get");
            if (error) {
                alert("Error happened on variable get; variable name may be new? Result: " + variableGetResult.message);
                return;
            }
            var versionURI = variableGetResult.currentValue;
            archiver.resource_get(versionURI, function (error, versionContents) {
                console.log("in callback from resource_get");
                if (error) {
                    alert("Error happened on versionContents get");
                    return;
                }
                console.log("versionContents:", versionContents);
                var version = JSON.parse(versionContents);
                var textURI = version.value;
                archiver.resource_get(textURI, function (error, text) {
                    console.log("in callback from resource_get");
                    if (error) {
                        alert("Error happened when getting text of version");
                        return;
                    }
                    currentVersionURI = versionURI;
                    items = JSON.parse(text).items;
                    rebuildItems(mainSurface, items);
                    changesCount = 0;
                });
            });
        });
    }

    function saveChanges() {
        if (!Pointrel20130202Utility.LoginHelper.isLoggedIn()) { alert ("Please login first"); return;}
        // Try to get old value to update it...
        // Although maybe you should not, as it is a conflict?
        // Could warn?
        var newItemsDocument = {_id: diagramName, items: items};

        //twirlipStore.get(diagramName).then(function(oldItemsDocument) {
        //   console.log("save then", oldItemsDocument);
        //  saveChanges2(oldItemsDocument, newItemsDocument);
        // }, function(error) {
        //  console.log("save error1", error);
        //  saveChanges2(null, newItemsDocument);
        // });

        // TODO: Does not deal with editing conflicts except by failing

        var newItemsDocumentText = JSON.stringify(newItemsDocument);
        var textURI = archiver.resource_add(newItemsDocumentText, "ConceptMapItems.json");
        console.log(textURI);
        var timestamp = new Date().toISOString();
        var previousVersionURI = currentVersionURI;
        var version = {timestamp: timestamp, userID: Pointrel20130202Utility.LoginHelper.getUserID(), previousVersion: previousVersionURI, value: textURI};
        console.log("version:", version);
        var versionAsString = JSON.stringify(version);
        console.log("versionAsString:", versionAsString);
        var newVersionURI = archiver.resource_add(versionAsString, "Version.json");
        console.log("newVersionURI:", newVersionURI);
        //noinspection JSUnusedLocalSymbols
        archiver.variable_set(diagramName, currentVersionURI, newVersionURI, function (error, result) {
            if (error) {
                alert("Error happened when trying to set variable");
                return;
            }
            console.log("store updating before:", currentVersionURI);
            console.log("store updating after:", newVersionURI);
            currentVersionURI = newVersionURI;
            changesCount = 0;
            alert("Saved concept map");
        });

    }

//    function saveChanges2(oldItemsDocument, newItemsDocument) {
//        if (oldItemsDocument != null) {
//            newItemsDocument._rev = oldItemsDocument._rev;
//            //alert("old rev: " + old._rev);
//        } else {
//            //alert("old is null");
//        }
//        twirlipStore.put(newItemsDocument).then(
//            function () {
//                changesCount = 0;
//                console.log("Saved OK");
//                alert("Saved OK...");
//            },
//            function (error) {
//                console.log("error2", error);
//                alert("Save failed. Try logging in first.");
//                console.log("done writing out error");
//            }
//        );
//    }

    function go(url) {
        console.log("go: ", url);
        if (!url) {
            console.log("empty url, not going");
            return;
        }
        console.log("items: ", items);
        setHiddenJSONData("items", items);
        if (changesCount !== 0) {
            console.log("trying to go with changes...");
            var okToGo = confirm("You have unsaved changes");
            if (!okToGo) return;
        }
        console.log("going to url", url);
        // document.location.href = url;
        window.open(url);
    }

    function addItem(surface, item, text, url) {
        // alert("Add button pressed");
        //arrow = drawArrow(surface, {start: {x: 200, y: 200}, end: {x: 335, y: 335}});
        //new Moveable(arrow);
        // console.log("addClick");

        if (item === null) {
            item = {};
            item.text = text;
            item.url = url;
            item.x = 200;
            item.y = 200;
            item.uuid = uuidFast();
        }
        console.log("item", item);

        var group = surface.createGroup();
        group.item = item;

        console.log("group", group);

        var circle = {cx: 0, cy: 0, r: 50 };
        var color = "black";
        if (item.url) color = "green";
        //noinspection JSUnusedLocalSymbols
        var blueCircle = group.createCircle(circle).
            setFill([0, 0, 155, 0.5]).
            setStroke({color: color, width: 4, cap: "butt", join: 4}).
            applyTransform(gfx.matrix.identity);

        addText(group, item.text, 75);

        //console.log("group", group);
        //console.log("blueCircle", blueCircle);

        //touch.press(group, function(e) {
        //touch.press(blueCircle, function(e) {
        //noinspection JSUnusedLocalSymbols
        group.connect("onmousedown", function (e) {
            // require(["dojo/on"], function(on) {
            //  var handle = on(group, "mousedown", function(e) {
            // console.log("triggered down", e);
            lastSelectedItem = item;
            // console.log("onmousedown item", item);
            updateForItemClick(item);
        });

        //noinspection JSUnusedLocalSymbols
        group.connect("ondblclick", function (e) {
            // var handle = on(group, "dblclick", function(e) {
            // alert("triggered ondblclick");
            go(group.item.url);
        });
        // });

        var moveable = new Moveable(group);
        moveable.item = item;

        moveable.onMoved = function (mover, shift) {
            item.x += shift.dx;
            item.y += shift.dy;
            changesCount++;

            // Kludge for Android as not setting on mouse down
            updateForItemClick(item);
        };

        group.applyTransform(gfx.matrix.translate(item.x, item.y));

        return group;
    }

    function updateForItemClick(item) {
        textBox.set("value", item.text);
        urlBox.set("value", item.url);
    }

    function addText(group, text, maxWidth) {
        var style = {family: "Arial", size: "10pt", weight: "bold"};
        var lineHeight = 12;
        var tb = gfx._base._getTextBox;
        var words = text.split(" ");
        var lines = [];
        var line = "";
        forEach(words, function (index, word) {
            if (lines.length >= 5) {
                line = "...";
                return;
            }
            if (line === "") {
                line = word;
            } else if (tb(line + " " + word).w < maxWidth) {
                line += " " + word;
            } else {
                lines.push(line);
                line = word;
            }
        });
        if (line !== "") lines.push(line);
        var startY = -((lines.length - 1) / 2) * lineHeight;
        if (lines.length == 6) startY += lineHeight;
        var y = startY;
        forEach(lines, function (index, line) {
            //noinspection JSUnusedLocalSymbols
            var theTextItem = group.createText({text: line, x: 0, y: y, align: "middle"}).
                setFont(style).
                setFill("black");
            console.log(theTextItem);
            y += lineHeight;
        }); 
    }
    
    ready(conceptMapPageLoaded);
});