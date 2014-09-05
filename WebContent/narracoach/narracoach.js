"use strict";

// TODO: How to handle these two globals shared by modules?

var exportedSurveyQuestions = [];
var surveyResults = [];

require([
    "dojo/_base/array",
    "dojo/_base/connect",
    "dojo/dom-construct",
    "dojo/dom-style",

    "dojo/hash",
    "narracoach/page_design-questions",
    "narracoach/page_export-survey",
    "narracoach/page_graph-results",
    "narracoach/page_take-survey",
    "narracoach/pages",
    "narracoach/question_editor",
    "dijit/registry",
    "dojo/string",
    "narracoach/widgets",
    "narracoach/widget-grid-table",
    "narracoach/widget-questions-table",
    "narracoach/widget-story-browser",
    "dojo/window",
    "dijit/layout/ContentPane",
    "dijit/form/Select",
    "dijit/layout/TabContainer",
    "dojox/layout/TableContainer",
    "dojo/domReady!"
], function(
    array,
    connect,
    domConstruct,
    domStyle,
    hash,
    page_designQuestions,
    page_exportSurvey,
    page_graphResults,
    page_takeSurvey,
    pages,
    questionEditor,
    registry,
    string,
    widgets,
    widgetGridTable,
    widgetQuestionsTable,
    widgetStoryBrowser,
    windowDojo,
    ContentPane,
    Select,
    TabContainer,
    TableContainer
){
    // TODO: Add page validation
    // TODO: Add translations for GUI strings used here
    
    var pageDefinitions = {};
    var pageInstantiations = {};
    var currentPageID = null;
    var selectWidget = null;
    var previousPageButton = null;
    var nextPageButton = null;
    
    function urlHashFragmentChanged(newHash) {
        // console.log("urlHashFragmentChanged", newHash);
        if (currentPageID !== newHash) {
            if (pageDefinitions[newHash]) {
            changePage(newHash);
            } else {
                console.log("unsupported url hash fragment", newHash);
            }
        }
    }
    
    function changePage(id) {
        selectWidget.set("value", id);
    }
    
    function mainSelectChanged(event) {
        var id = event;
        console.log("changing page to:", id);
        showPage(id);
    }
    
    function buttonUnfinishedClick(event) {
        console.log("buttonUnfinishedClick", event);
        alert("Unfinished");
    }
    
    function showPage(id) {
        if (currentPageID === id) return;
        
        var page = pageDefinitions[id];
        if (!page) {
            console.log("no such page", id);
            alert("No such page: " + id);
            return;
        }
        
        if (currentPageID) {
            domStyle.set(currentPageID, "display", "none");
        }
        
        domStyle.set(id, "display", "block");
        
        currentPageID = id;
        hash(currentPageID);
        
        previousPageButton.setDisabled(!page.previousPageID);
        nextPageButton.setDisabled(!page.nextPageID);
        
        windowDojo.scrollIntoView(selectWidget.domNode);
    }
    
    // TODO: Put this in utility
    function startsWith(str, prefix) {
        // console.log("startsWith", prefix, str.lastIndexOf(prefix, 0) === 0, str);
      return str.lastIndexOf(prefix, 0) === 0;
    }

    function createPage(id, visible) {
        console.log("createPage", id);
        var page = pageDefinitions[id];
        
        if (!page) {
            console.log("ERROR: No definition for page: ", id);
            return;
        }
        
        var pagePane = new ContentPane({
            "id": id,
            title: page.title,
            content: page.description.replace(/\n/g, "<br>\n"),
            // Set to 99% so grid scroll bar shows up not clipped
            style: "width: 99%",
            display: "none",
       });
        
       // console.log("about to place pane", id);
        // Dojo seems to require these pages be in the visual hierarchy before some components like grid that are added to them are have startUp called.
        // Otherwise the grid header is not sized correctly and will be overvritten by data
        // This is as opposed to what one might think would reduce resizing and redrawing by adding the page only after components are added
       pagePane.placeAt("pageDiv");
        
       // console.log("Made content pane", id);
       
       array.forEach(page.questions, function(question) {
           if (question.type === "button") {
               widgets.newButton(question.id, question.text, pagePane.domNode, buttonUnfinishedClick);
           } else if (startsWith(question.type, "page_")) {
               widgetQuestionsTable.insertQuestionsTable(question, pagePane, pageDefinitions);
           } else if (question.type === "storyBrowser") {
               widgetStoryBrowser.insertStoryBrowser(question, pagePane, pageDefinitions);
           } else if (question.type === "grid") {
               var gridAndStore = widgetGridTable.insertGridTable(question, pagePane, pageDefinitions);
           } else {
               questionEditor.insertQuestionIntoDiv(question, pagePane.domNode);
           }
       });
       
       pageInstantiations[id] = pagePane;
       
       // console.log("about to set visibility", id);
       if (visible) {
            domStyle.set(id, "display", "block");
       } else {
            domStyle.set(id, "display", "none");
       }
       
       pagePane.startup();
    }
    
    function previousPageClicked(event) {
        // console.log("previousPageClicked", event);
        if (!currentPageID) {
            // Should never get here
            alert("Something wrong with currentPageID");
            return;
        }
        var page = pageDefinitions[currentPageID];
        var previousPageID = page.previousPageID;
        if (previousPageID) {
            changePage(previousPageID);
        } else {
            // Should never get here based on button enabling
            alert("At first page");
        }
    }
    
    function nextPageClicked(event) {
        // console.log("nextPageClicked", event);
        if (!currentPageID) {
            // Should never get here
            alert("Something wrong with currentPageID");
            return;
        }
        var page = pageDefinitions[currentPageID];
        var nextPageID = page.nextPageID;
        if (nextPageID) {
            changePage(nextPageID)
        } else {
            // Should never get here based on button enabling
            alert("At last page");
        }
    }
    
    // Make all NarraCoach pages and put them in a TabContainer
    function createLayout() {
        // console.log("createLayout start");
        var pageSelectOptions = [];
        
        var questionIndex = 0;
        var lastPageID = null;
        
        array.forEach(pages, function(page) {
            // console.log("defining page", page.name)
            var title = page.name;
            // TODO: Eventually remove legacy support for old way of defining pages
            // TODO: Eventually don't include popups or other special page types in list to display to user
            var sections = title.split("-");
            if (sections.length >= 2) {
                title = sections[0];
                page.description = " " + sections + "<br>\n" + page.description;
            }
            if (page.isHeader) {
                title = "<i>" + title + "</i>";
            } else {
                title = "&nbsp;&nbsp;&nbsp;&nbsp;" + title;
            }
            if (page.type) {
                title += " SPECIAL: " + page.type;
            }
            
            page.title = title;
            
            // Cleanup options
            // TODO: Ensure options get translated
            array.forEach(page.questions, function(question) {
                 if (question.type === "select" && question.options.indexOf(";") != -1) {
                   // console.log("replacing select options", question.options);
                   question.options = question.options.replace(/;/g, "\n");
                   // console.log("result of replacement", question.options);
               }
            });
            
            pageDefinitions[page.id] = page;      
            
            // console.log("about to make page");
            // Skip over special page types
            if (!page.type) {
                // Make it easy to lookup previous and next pages from a page
                if (lastPageID) pageDefinitions[lastPageID].nextPageID = page.id;
                page.previousPageID = lastPageID;
                lastPageID = page.id;
                
                // Looks like Dojo select has a limitation where it can only take strings as values
                // so can't pass page in as value here and need indirect pageDefinitions lookup dictionary
                pageSelectOptions.push({label: title, value: page.id});
            }
        });
        
        // Now, premake pages only after all definitons are done (since some pages refer to others for question popups that may be defined later)
        array.forEach(pages, function(page) {
            // console.log("creating page", page.name)
            // Skip over special page types
            if (!page.type) {
                // Pre-make base pages
                createPage(page.id);
            }
        });        
        
        /* TODO: Delete these pages after making sure any needed functionality is moved elsewhere (into widgets or more general code) 
        page_designQuestions(tabContainer);
        page_exportSurvey(tabContainer);
        page_takeSurvey(tabContainer);
        page_graphResults(tabContainer);
        */

        widgets.newSelect("mainSelect", pageSelectOptions, null, "navigationDiv", "NoUnselectedOption");
        
        selectWidget = registry.byId("mainSelect");
        // console.log("widget", selectWidget);
        // TODO: Width should be determined from contents of select options using font metrics etc.
        domStyle.set(selectWidget.domNode, "width", "400px");
        selectWidget.on("change", mainSelectChanged);
        
        // TODO: Translation of buttons
        widgets.newButton("previousPage", "Previous Page", "navigationDiv", previousPageClicked);
        previousPageButton = registry.byId("previousPage");
            
        widgets.newButton("nextPage", "Next Page", "navigationDiv", nextPageClicked);
        nextPageButton = registry.byId("nextPage");
        
        // Setup the first page
        showPage(pages[0].id);
        
        console.log("createLayout end");
        
        // Update if the URL hash fragment changes
        connect.subscribe("/dojo/hashchange", urlHashFragmentChanged);
    }
    
    // TODO: Challenge of repeating sections....

    // Call the main function
    createLayout();
    document.getElementById("startup").style.display = "none";
});