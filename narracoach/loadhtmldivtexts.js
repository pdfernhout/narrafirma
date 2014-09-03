// Probably no longer needed.
// Intended to load text from divs in an html file to use for translation

/*
    var helpTexts = {};
    var helpTextsURL = "narracoach/nls/en/strings_long.html";

    function loadHTMLDivTexts(callback) {
        // Load the help texts; this is needed to know whether to put up help icons, and so must be done before creating pages
        xhr.get({
            url: helpTextsURL,
            load: function(data) {
                if (data && !data.error) {
                    //console.log("Got helptexts: ", data);
                    //var fragment = document.createDocumentFragment();
                    var div = document.createElement("div");
                    div.innerHTML = data;
                    console.log("div", div);
                    //console.log("fragment", fragment);
                    var children = div.childNodes;
                    for (var i = 0; i < children.length; i++) {
                        var node = children[i];
                        // console.log("node", node, node.tagName);
                        if (node.tagName === "DIV") {
                            helpTexts[node.id] = node.innerHTML;
                            translations[node.id] = node.innerHTML;
                            // console.log("helptext", node.id, node.innerHTML);
                        }
                    }
                    // console.log("done with query", helpTexts);
                } else {
                    console.log("Problem loading " + helpTextsURL);
                }
                createLayout();
            },
            error: function(error) {
                alert("An unexpected error occurred loading: " + helpTextsURL + " error: " + error);
                createLayout();
            },
         });
    }
    
    loadHTMLDivTexts(createLayout);
    */