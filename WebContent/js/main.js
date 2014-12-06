"use strict";

require([
    "js/pages/allPages",
    "dojo/i18n!js/nls/applicationMessages",
    "dojo/_base/array",
    "dojox/mvc/at",
    "dojo/_base/connect",
    "js/domain",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/hash",
    "dojo/_base/lang",
    "dojo/i18n!js/nls/pageMessages",
    "js/storage",
    "js/survey",
    "js/test-data",
    "js/translate",
    "js/utility",
    "js/widgetBuilder",
    "js/widgets/grid-table",
    "dijit/layout/ContentPane",
    "dijit/form/Select",
    "dojo/domReady!"
], function(
    allPages,
    applicationMessages,
    array,
    at,
    connect,
    domain,
    domConstruct,
    domStyle,
    hash,
    lang,
    pageMessages,
    storage,
    survey,
    testData,
    translate,
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
    var loadButton = null;
    var saveButton = null;
    var startPage = "page_dashboard";

    function loadClicked(event) {
        console.log("load clicked");
                
        // TODO: Kludge of loading all stories when load data?
        // domain.buttonFunctions.loadLatestStoriesFromServer();
 
        // TODO: Check for unsaved data before loading project...
        storage.loadLatestProjectVersion(switchToLoadedProjectData);
    }
     
    function switchToLoadedProjectData(error, projectAnswers) {
        if (error) {
            alert("A problem happened when trying to load the latest version of the project:\n" + error);
            return;
        }
        console.log("loading saved version", projectAnswers);
        for (var key in projectAnswers) {
            if (projectAnswers.hasOwnProperty(key)) {
                domain.projectData.projectAnswers.set(key, projectAnswers[key]);
            }
        }
        // Update derived values
        widgetBuilder.updateQuestionsForPageChange();
        
        // Reload page looking at...
        showPage(currentPageID, "forceRefresh");
        
        // TODO: Translate and improve this feedback
        alert("Finished loading project data");        
    }
    
    function saveClicked(event) {
        console.log("save clicked", domain.projectData.projectAnswers);
        storage.storeProjectAnswersVersion(domain.projectData.projectAnswers, saveFinished);
    }
    
    function saveFinished(error, newVersionURI) {
        if (error) {return alert("could not write new version:\n" + error);}
        // TODO: Translate and improve this feedback
        console.log("Save finished to file", newVersionURI);
        alert("Finished saving");
    }
    
    function urlHashFragmentChanged(newHash) {
        // console.log("urlHashFragmentChanged", newHash);
        if (currentPageID !== newHash) {
            if (domain.pageDefinitions[newHash]) {
                changePage(newHash);
            } else {
                console.log("unsupported url hash fragment", newHash);
                alert("A page was not found for: " + newHash);
                if (newHash !== startPage) urlHashFragmentChanged(startPage);
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
    
    function showPage(id, forceRefresh) {
        if (currentPageID === id && !forceRefresh) return;
        
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
       
       page.buildPage(widgetBuilder, pagePane, domain.projectData.projectAnswers);
       
       if (!page.isHeader) {
           // Uses special domain dictionary to store translations synthesized for each indidivual widget
           var options = ["intentionally skipped", "partially done", "completely finished"];
           var statusEntryID = id + "_pageStatus";
           translate.extraTranslations[statusEntryID + "::prompt"] =  translate("dashboard_status_entry::prompt") + " ";
           for (var optionIndex in options) {
               var option = options[optionIndex];
               translate.extraTranslations[statusEntryID + "::selection:" + option] = translate("dashboard_status_entry::selection:" + option);
           }
           // TODO: Put blank line in here
           widgetBuilder.add_select(pagePane, domain.projectData.projectAnswers, statusEntryID, options);
       } else {
           // console.log("page dashboard as header", page.id, page.type, page);
           // Put in dashboard
           var pages = domain.pagesToGoWithHeaders[id];
           for (var pageIndex in pages) {
               var pageID = pages[pageIndex];
               var statusViewID = pageID + "_pageStatus_dashboard";
               // console.log("pageID", page, pageID, domain.pageDefinitions, domain.pageDefinitions[pageID]);
               if (!domain.pageDefinitions[pageID]) console.log("Error: problem finding page definition for", pageID, " -- Could the domain be out of date relative to the design and pages.js?");
               if (domain.pageDefinitions[pageID] && domain.pageDefinitions[pageID].type === "page") {
                   translate.extraTranslations[statusViewID + "::prompt"] = translate(pageID + "::title") + " " + translate("dashboard_status_label") + " ";
                   widgetBuilder.add_questionAnswer(pagePane, domain.projectData.projectAnswers, statusViewID, [pageID + "_pageStatus"]);
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
    
    function debugButtonClicked() {
        console.log("debug domain.projectData", domain.projectData);
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
        
        var homeButton = utility.newButton("button_home", null, "navigationDiv", homeButtonClicked);
        homeButton.set("showLabel", false);
        // homeButton.set("iconClass", "dijitEditorIcon dijitEditorIconOutdent");
        homeButton.set("iconClass", "homeButtonImage");
        
        for (var pageKey in allPages) {
            if (!allPages.hasOwnProperty(pageKey)) continue;
            var page = allPages[pageKey];
            // console.log("defining page", page.id);
            var title = translate(page.id + "::title");
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
                // Put in a dynamic question (incomplete for options) to be used to lookup page status; needed to check it is a select
                domain.questions[page.id + "_pageStatus"] = {id: page.id + "_pageStatus", type: "select"};
            }
        }
        
        /*
        // Now, premake pages only after all definitions are done (since some pages refer to others for question popups that may be defined later)
        array.forEach(pages, function(page) {
            // console.log("creating page", page.id)
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
        
        previousPageButton = utility.newButton("button_previousPage", null, "navigationDiv", previousPageClicked);
        previousPageButton.set("iconClass", "leftButtonImage");
        
        nextPageButton = utility.newButton("button_nextPage", null, "navigationDiv", nextPageClicked);
        nextPageButton.set("iconClass", "rightButtonImage");
        
        loadButton = utility.newButton("button_load", null, "navigationDiv", loadClicked);
        saveButton = utility.newButton("button_save", null, "navigationDiv", saveClicked);
        
        var debugButton = utility.newButton("button_debug", null, "navigationDiv", debugButtonClicked);
        
        // Setup the first page
        var fragment = hash();
        console.log("startup fragment", fragment);
        if (fragment && fragment !== startPage) {
            urlHashFragmentChanged(fragment);
        } else {
            urlHashFragmentChanged(startPage);
            showPage(startPage);
            currentPageID = startPage;
        }
        
        console.log("createLayout end");
        
        // Update if the URL hash fragment changes
        connect.subscribe("/dojo/hashchange", urlHashFragmentChanged);
    }
    
    function updatePagesForDomainValueChange() {
        widgetBuilder.updateQuestionsForPageChange();
        // widgetGridTable.resizeGridsKludge();
    }
    
    function takeSurvey() {
        // TODO: What version of questionnaire should be used? Should it really be the latest one? Or the one active on server?
        console.log("domain.projectData", domain.projectData);
        var questionnaire = domain.getCurrentQuestionnaire();
        
        survey.takeSurvey(questionnaire);
    }
    
    function startup() {
        translate.configure(pageMessages, applicationMessages);

        // Synchronizes the state of the domain for one status flag with what is on server
        domain.determineStatusOfCurrentQuestionnaire();

        // Setup important callback for page changes
        domain.setPageChangeCallback(widgetBuilder.updateQuestionsForPageChange);

        // Callback for this button
        // TODO: Temp for testing
        domain.buttonFunctions.enterSurveyResult = takeSurvey;
        domain.buttonFunctions.updateQuestionsForPageChangeCallback = updatePagesForDomainValueChange;
        
        // Call the main function
        createLayout();
        
        // turn off startup "please wait" display
        document.getElementById("startup").style.display = "none";
    }
    
    startup();
});