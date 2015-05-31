define([
    "lib/d3/d3",
    "js/questionnaireGeneration",
    "js/surveyBuilder",
    "js/surveyCollection",
    "dojo/domReady!"
], function(
    d3,
    questionnaireGeneration,
    surveyBuilder,
    surveyCollection
){
    "use strict";
    
    var project;
    
    function initialize(theProject) {
        project = theProject;
    }
 
    function processCSVContents(contents, callbackForItem) {
        console.log("processCSVContents contents", contents);
        
        var rows = d3.csv.parseRows(contents);
        console.log("rows", rows);
        
        var items = [];
        var header;
        
        for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            var row = rows[rowIndex];
            // Throw away initial blank lines and comment lines
            if (!row.length || !row[0] || row[0].trim().charAt(0) === ";") {
                console.log("comment", row[0]);
            } else {
                if (!header) {
                    header = [];
                    var headerEnded = false;
                    for (var headerIndex = 0; headerIndex < row.length; headerIndex++) {
                        var label = row[headerIndex];
                        if (label) {
                            // Should be an error if header fields are missing but more show up later
                            if (headerEnded) {
                                console.log("ERROR: header has empty field before end");
                                alert("ERROR: header has empty field before end");
                            }
                            header.push(label);
                        } else {
                            headerEnded = true;
                        }
                    }
                } else {
                    var newItem = callbackForItem(header, row);
                    if (newItem) items.push(newItem);
                }
            }
        }
        // console.log("header", header);
        // console.log("items", items);
        return {header: header, items: items};
    }
    
    function processCSVContentsForStories(contents) {
        // Throws away line after header which starts with a blank
        var headerAndItems = processCSVContents(contents, function (header, row) {
            var newItem = {};
            for (var fieldIndex = 0; fieldIndex < header.length; fieldIndex++) {
                var fieldName = header[fieldIndex];
                // TODO: Should the value really be trimmed?
                var value = row[fieldIndex].trim();
                if (newItem[fieldName] === undefined) {
                    newItem[fieldName] = value;
                } else {
                    // Handle case where this is a multiple choice question, which is indicated by multiple columns
                    var data = newItem[fieldName];
                    if (data && typeof data === 'object') {
                        if (value !== "") data[value] = true;
                    } else {
                       var newData = {};
                       if (data !== "") newData[data] = true;
                       if (value !== "") newData[value] = true;
                       newItem[fieldName] = newData;
                    }
                }
            }
            return newItem;
        });
        console.log("processCSVContentsForStories headerAndItems", headerAndItems);
    }
    
    function processCSVContentsForQuestionnaire(contents) {
        var headerAndItems = processCSVContents(contents, function (header, row) {
            console.log("callback", header, row);
            var newItem = {};
            var lastFieldIndex;
            for (var fieldIndex = 0; fieldIndex < row.length; fieldIndex++) {
                var fieldName = header[fieldIndex];
                if (fieldName) {
                    lastFieldIndex = fieldIndex;
                } else {
                    fieldName = header[lastFieldIndex];
                }
                // TODO: Should the value really be trimmed?
                var value = row[fieldIndex].trim();
                console.log("fieldName, value", fieldName, value);
                if (fieldIndex < header.length - 1) {
                    newItem[fieldName] = value;
                } else {
                    // Handle multiple values for last header items
                    var list = newItem[fieldName];
                    console.log("list", list, fieldIndex, fieldName);
                    if (!list) {
                        list = [];
                        newItem[fieldName] = list;
                    }
                    if (value) list.push(value);
                }
            }
            return newItem;
        });
        console.log("processCSVContentsForQuestionnaire headerAndItems", headerAndItems);
        
        var name = prompt("Please enter a short name for this questionnaire");
        if (!name) return;
        if (questionnaireGeneration.buildQuestionnaire(project, name)) {
            alert("A questionnaire already exists with that name");
            return;
        }
    }
    
    function chooseCSVFileToImport(callback) {
        // console.log("chooseFileToImport");
        var cvsFileUploader = document.getElementById("csvFileLoader");
        // console.log("cvsFileUploader", cvsFileUploader);
        cvsFileUploader.onchange = function() {
            var file = cvsFileUploader.files[0];
            if (!file) {
                return;
            }
            var reader = new FileReader();
            reader.onload = function(e) {
                var contents = e.target.result;
                callback(contents);
            };
            reader.readAsText(file);
        };
        cvsFileUploader.click();
    }
    
    function importCSVStories() {
        chooseCSVFileToImport(processCSVContentsForStories);
    }
    
    function importCSVQuestionnaire() {
        chooseCSVFileToImport(processCSVContentsForQuestionnaire);
    }
    
    return {
        initialize: initialize,
        importCSVStories: importCSVStories,
        importCSVQuestionnaire: importCSVQuestionnaire
    };
});