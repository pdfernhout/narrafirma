"use strict";

require([
    "js/pages/allPages",
    "dojo/_base/array",
    "dojox/mvc/at",
    "dojo/_base/connect",
    "js/domain",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/hash",
    "js/utility",
    "js/widgetBuilder",
    "js/widgets/grid-table",
    "dijit/layout/ContentPane",
    "dijit/form/Select",
    "dojo/domReady!"
], function(
    allPages,
    array,
    at,
    connect,
    domain,
    domConstruct,
    domStyle,
    hash,
    utility,
    widgetBuilder,
    widgetGridTable,
    ContentPane,
    Select
){
    // TODO: Add page validation
    // TODO: Add translations for GUI strings used here
    
    var currentPage = null;
    var currentPageID = null;
    var selectWidget = null;
    var previousPageButton = null;
    var nextPageButton = null;
    var startPage = "page_dashboard";
    
    function urlHashFragmentChanged(newHash) {
        // console.log("urlHashFragmentChanged", newHash);
        if (currentPageID !== newHash) {
            if (domain.pageDefinitions[newHash]) {
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
    
    function showPage(id) {
        if (currentPageID === id) return;
        
        var page = allPages[id];
        if (!page) {
            console.log("no such page", id);
            alert("No such page: " + id);
            return;
        }
        
        domStyle.set("pageDiv", "display", "none");
        // domStyle.set("startup", "display", "block");
        
        if (currentPageID && currentPage) {
            // domStyle.set(currentPageID, "display", "none");
            console.log("destroying", currentPageID, currentPage);
            currentPage.destroyRecursive();
            domConstruct.destroy(currentPage);
        }
        
        // domStyle.set(id, "display", "block");
        
        currentPage = createPage(id, true);
        
        currentPageID = id;
        hash(currentPageID);
        
        previousPageButton.setDisabled(!page.previousPageID);
        nextPageButton.setDisabled(!page.nextPageID);
        
        // domStyle.set("startup", "display", "none");
        domStyle.set("pageDiv", "display", "block");
        
        // Because the page was hidden when created, all the grids need to be resized --- seems like bad design in dgrid
        widgetGridTable.resizeGridsKludge();
        
        window.scrollTo(0, 0); 
        
        widgetBuilder.updateQuestionsForPageChange();
    }
    
    function createPage(id, visible) {
        console.log("createPage", id);
        var page = allPages[id];
        
        if (!page) {
            console.log("ERROR: No definition for page: ", id);
            return;
        }
        
        // Kludge for grids -- clearing out
        widgetGridTable.clearGridsKludge();
        
        var pagePane = new ContentPane({
            "id": id,
            title: page.title,
            // Shorten width so grid scroll bar shows up not clipped
            // Also, looks like nested ContentPanes tend to walk off the right side of the page for some reason
            style: "width: 94%",
            display: "none" // "block" // 
       });
        
       // console.log("about to place pane", id);
       // Dojo seems to require these pages be in the visual hierarchy before some components like grid that are added to them are have startUp called.
       // Otherwise the grid header is not sized correctly and will be overvritten by data
       // This is as opposed to what one might think would reduce resizing and redrawing by adding the page only after components are added
       pagePane.placeAt("pageDiv");
        
       // console.log("Made content pane", id);
       
       page.addWidgets(pagePane, domain.data);
       
       // TODO: Fix this to store data
       // TODO: Translate -- putting in English versions as kludge for now into special domain dictionary
       var options = ["intentionally skipped", "partially done", "completely finished"];
       var fullID = pageID + "_pageStatus";
       var option;
       var optionIndex;
       if (!page.isHeader) {
           domain.extraTranslations[fullID + "::prompt"] =  "The dashboard status of this page is: ";
           for (optionIndex in options) {
               option = options[optionIndex];
               domain.extraTranslations[fullID + "::selection:" + option] = option;
           }
           // TODO: Put blank line in here
           widgetBuilder.add_select(pagePane, domain.data, fullID, options);
       } else {
           // console.log("page dashboard as header", page.id, page.type, page);
           // Put in dashboard
           var pages = domain.pagesToGoWithHeaders[id];
           for (var pageIndex in pages) {
               var pageID = pages[pageIndex];
               fullID = pageID + "_pageStatus_dashboard";
               // console.log("pageID", page, pageID, domain.pageDefinitions, domain.pageDefinitions[pageID]);
               if (!domain.pageDefinitions[pageID]) console.log("Error: problem finding page definition for", pageID, " -- Could the domain be out of date relative to the design and pages.js?");
               if (domain.pageDefinitions[pageID] && domain.pageDefinitions[pageID].type === "page") {
                   domain.extraTranslations[fullID + "::prompt"] = domain.pageDefinitions[pageID].name;
                   for (optionIndex in options) {
                       option = options[optionIndex];
                       domain.extraTranslations[fullID + "::selection:" + option] = option;
                   }
                   widgetBuilder.add_select(pagePane, domain.data, pageID + "_pageStatus_dashboard", options);
               }
           }
       }
       
       /*
       var nextPageButtonQuestion = {
           "id": id + "_nextPageButton",
           "text": "Mark page complete and proceed to next page",
           "type": "button"
       };
       
       questionEditor.insertQuestionIntoDiv(nextPageButtonQuestion, pagePane);
       */
       
       // console.log("about to set visibility", id);
       if (visible) {
            domStyle.set(id, "display", "block");
       } else {
            domStyle.set(id, "display", "none");
       }
                  
       pagePane.startup();
              
       return pagePane;
    }
    
    function previousPageClicked(event) {
        // console.log("previousPageClicked", event);
        if (!currentPageID) {
            // Should never get here
            alert("Something wrong with currentPageID");
            return;
        }
        var page = domain.pageDefinitions[currentPageID];
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
        var page = domain.pageDefinitions[currentPageID];
        var nextPageID = page.nextPageID;
        if (nextPageID) {
            changePage(nextPageID);
        } else {
            // Should never get here based on button enabling
            alert("At last page");
        }
    }

    function wwsButtonClicked() {
        console.log("wwsButtonClicked");
        location.href = "http://www.workingwithstories.org/";
    }
    
    function homeButtonClicked() {
        console.log("homeButtonClicked");
        urlHashFragmentChanged(startPage);
    }
    
    // TODO: somehow unify this with code in widget-questions-table?
    function newSpecialSelect(id, options, addToDiv) {
        var select = new Select({
            id: id,
            options: options
        });
        select.placeAt(document.getElementById(addToDiv));
        select.startup();
        return select;
    }
    
    // Make all of the application pages selectable from the dropdown list and back/next buttons and put them in a TabContainer
    function createLayout() {
        console.log("createLayout start", allPages);
        var pageSelectOptions = [];
        
        var questionIndex = 0;
        var lastPageID = null;
        
        // var imageButton = widgets.newButton("wwsImageButton", "Working With Stories image button", "navigationDiv", wwsButtonClicked);
        // imageButton.set("showLabel", false);
        // imageButton.set("iconClass", "wwsButtonImage");
        
        var homeButton = utility.newButton("homeImageButton", "Home image button", "navigationDiv", homeButtonClicked);
        homeButton.set("showLabel", false);
        // homeButton.set("iconClass", "dijitEditorIcon dijitEditorIconOutdent");
        homeButton.set("iconClass", "homeButtonImage");
        
        for (var pageKey in allPages) {
            if (!allPages.hasOwnProperty(pageKey)) continue;
            var page = allPages[pageKey];
            console.log("defining page", page.id);
            // TODO: Translate this
            var title = page.name;
            if (page.isHeader) {
                title = "<i>" + title + "</i>";
            } else {
                title = "&nbsp;&nbsp;&nbsp;&nbsp;" + title;
            }
            if (page.type !== "page") {
                title += " SPECIAL: " + page.type;
            }
            
            page.title = title;
            
            // Lump all questions together in domain for use by things like calculating derived values from options for quiz score results
            for (questionIndex in page.questions) {
                var question = page.questions[questionIndex];
                domain.questions[question.id] = question;
            }
            
            domain.pageDefinitions[page.id] = page;      
            
            // console.log("about to make page");
            // Skip over special page types
            if (page.type === "page") {
                // console.log("pushing page", page);
                // Make it easy to lookup previous and next pages from a page
                if (lastPageID) domain.pageDefinitions[lastPageID].nextPageID = page.id;
                page.previousPageID = lastPageID;
                lastPageID = page.id;
                
                // Looks like Dojo select has a limitation where it can only take strings as values
                // so can't pass page in as value here and need indirect pageDefinitions lookup dictionary
                pageSelectOptions.push({label: title, value: page.id});
            }
        }
        
        /*
        // Now, premake pages only after all definitions are done (since some pages refer to others for question popups that may be defined later)
        array.forEach(pages, function(page) {
            // console.log("creating page", page.name)
            // Skip over special page types
            if (page.type === "page") {
                // Premake base pages
                createPage(page.id);
            }
        });  
        */      
        
        /* TODO: Delete these pages after making sure any needed functionality is moved elsewhere (into widgets or more general code) 
        page_designQuestions(tabContainer);
        page_exportSurvey(tabContainer);
        page_takeSurvey(tabContainer);
        page_graphResults(tabContainer);
        */

        selectWidget = newSpecialSelect("mainSelect", pageSelectOptions, "navigationDiv");
        
        // console.log("widget", selectWidget);
        // TODO: Width should be determined from contents of select options using font metrics etc.
        domStyle.set(selectWidget.domNode, "width", "400px");
        selectWidget.on("change", mainSelectChanged);
        
        // TODO: Translation of buttons
        previousPageButton = utility.newButton("previousPage", "Previous Page", "navigationDiv", previousPageClicked);
        previousPageButton.set("iconClass", "leftButtonImage");
        
        nextPageButton = utility.newButton("nextPage", "Next Page", "navigationDiv", nextPageClicked);
        nextPageButton.set("iconClass", "rightButtonImage");
        
        // Setup the first page
        var fragment = hash();
        console.log("startup fragment", fragment);
        if (fragment && fragment !== startPage) {
            urlHashFragmentChanged(fragment);
        } else {
            urlHashFragmentChanged(startPage);
            showPage("page_dashboard");
            currentPageID = startPage;
        }
        
        console.log("createLayout end");
        
        // Update if the URL hash fragment changes
        connect.subscribe("/dojo/hashchange", urlHashFragmentChanged);
    }
    
    // Setup important callback for page changes
    domain.setPageChangeCallback(widgetBuilder.updateQuestionsForPageChange);
    
    // Call the main function
    createLayout();
    
    // turn off startup "please wait" display
    document.getElementById("startup").style.display = "none";
});