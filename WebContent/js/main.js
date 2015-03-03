require([
    "js/applicationBuilder",
    "dojo/i18n!js/nls/applicationMessages",
    "dojo/_base/connect",
    "js/domain",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/hash",
    "js/storage",
    "js/survey",
    "js/toaster",
    "js/translate",
    "js/utility",
    "js/widgetBuilder",
    "js/widgets/widgetSupport",
    "js/widgets/grid-table",
    "dijit/layout/ContentPane",
    "dijit/form/Select",
    "dojo/domReady!"
], function(
    applicationBuilder,
    applicationMessages,
    connect,
    domain,
    domConstruct,
    domStyle,
    hash,
    storage,
    survey,
    toaster,
    translate,
    utility,
    widgetBuilder,
    widgetSupport,
    widgetGridTable,
    ContentPane,
    Select
){
    "use strict";

    // TODO: Add page validation
    // TODO: Add translations for GUI strings used here
    
    var startPage = "page_dashboard";
    
    var allPages = {};

    var currentPage = null;
    var currentPageID = null;
    var selectWidget = null;
    
    var currentProjectVersionReference = null; 
    
    var previousPageButton = null;
    var nextPageButton = null;
    var loadLatestButton = null;
    var loadVersionButton = null;
    var saveButton = null;
    var importExportButton = null;
    
    function loadLatestClicked(event) {
        console.log("load latest clicked");
                
        // TODO: Check for unsaved data before loading project...
        storage.loadLatestProjectVersion(switchToLoadedProjectData);
    }
    
    function loadVersionClicked(event) {
        console.log("load version clicked");
                
        // TODO: Kludge of loading all stories when load data?
        // domain.buttonFunctions.loadLatestStoriesFromServer();
 
        // TODO: Check for unsaved data before loading project...
        storage.loadAllProjectVersions(loadedProjectVersions);
    }
    
    function loadedProjectVersions(error, versions) {
        console.log("loadedProjectVersions", error, versions);
        if (error) {
            alert("A problem happened when trying to load all the versions of the project:\n" + error);
            return;
        }
        // TODO: Put up a dialog to choose from
        
        // STOPPED HERE
        // TODO: Use widgetSupport.openDialog to create dialog similar to that for picking a template
    }
     
    function switchToLoadedProjectData(error, projectAnswers, envelope) {
        if (error) {
            alert("A problem happened when trying to load the latest version of the project:\n" + error);
            return;
        }
        console.log("loading saved version", projectAnswers);
        var key;
        for (key in projectAnswers) {
            if (projectAnswers.hasOwnProperty(key)) {
                domain.projectData.projectAnswers.set(key, projectAnswers[key]);
            }
        }
        // TODO: A little dangerous to remove stuff, should this be kept?
        var fieldsToRemove = {};
        for (key in domain.projectData.projectAnswers) {
            if (domain.projectData.projectAnswers.hasOwnProperty(key) && !projectAnswers.hasOwnProperty(key)) {
                // Stateful model adds "_watchCallbacks" so don't remove it
                if (!utility.startsWith(key, "_")) fieldsToRemove[key] = true;
            }
        }
        for (key in fieldsToRemove) {
            console.log("removing old field/data", key, domain.projectData.projectAnswers.get(key));
            domain.projectData.projectAnswers.set(key, undefined);
        }
        
        // Update derived values
        widgetBuilder.updateQuestionsForPageChange();
        
        // Reload page looking at to ensure it gets latest data...
        showPage(currentPageID, "forceRefresh");
        
        // Store a reference so can pass it to storage as "previous" for next version to get chain or tree of versions
        currentProjectVersionReference = envelope.__sha256HashAndLength;
        
        // TODO: Translate and improve this feedback
        toaster.toast("Finished loading project data");
        
        /* TODO: !!!!!!!!!!!! Removed for now while testing changeover to field approach !!!!!!!!!!!!!!!
         * 
        // TODO: Kludge of loading all stories when load data?
        console.log("Going to try to load latest stories from server");
        domain.buttonFunctions.loadLatestStoriesFromServer(function (newEnvelopeCount) {
            console.log("Forcing refresh of current page");
            // TODO: KLUDGE: Updating gui a second time so get flicker -- and maybe lose edits?
            if (newEnvelopeCount) showPage(currentPageID, "forceRefresh");
        });
        */
        
        return;
    }
    
    function saveClicked(event) {
        console.log("save clicked", domain.projectData.projectAnswers);
        storage.storeProjectAnswersVersion(domain.projectData.projectAnswers, currentProjectVersionReference, saveFinished);
    }
    
    function saveFinished(error, newVersionURI) {
        if (error) {return alert("could not write new version:\n" + error);}
        // TODO: Translate and improve this feedback
        console.log("Save finished to file", newVersionURI);
        currentProjectVersionReference = newVersionURI;
        toaster.toast("Finished saving");
    }
    
    function urlHashFragmentChanged(newHash) {
        // console.log("urlHashFragmentChanged", newHash);
        if (currentPageID !== newHash) {
            var page = panelForPageID(newHash);
            if (page && page.displayType === "page") {
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
        
        var panelID = id.replace("page_", "panel_");
        var page = allPages[panelID];
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
        var panelID = id.replace("page_", "panel_");
        var page = allPages[panelID];
        
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
       // Otherwise the grid header is not sized correctly and will be overwritten by data
       // This is as opposed to what one might think would reduce resizing and redrawing by adding the page only after components are added
       pagePane.placeAt("pageDiv");
        
       // console.log("Made content pane", id);
       
       widgetBuilder.buildPanel(panelID, pagePane, domain.projectData.projectAnswers);
       
       if (!page.isHeader) {
           // TODO: Will need translations for these eventually
           var options = ["intentionally skipped", "partially done", "completely finished"];
           var statusEntryID = id + "_pageStatus";
           // TODO: Put blank line in here
           widgetBuilder.add_select(pagePane, domain.projectData.projectAnswers, statusEntryID, options);
       } else {
           console.log("page dashboard as header", page.id, page.type, page);
           // Put in dashboard
           var childPages = domain.pagesToGoWithHeaders[panelID];
           console.log("child pages", id, panelID, childPages);
           for (var childPageIndex in childPages) {
               var childPageID = childPages[childPageIndex];
               var statusViewID = childPageID + "_pageStatus_dashboard";
               var childPage = panelForPageID(childPageID);
               console.log("childPageID", childPage, childPageID, domain.pageDefinitions);
               if (!childPage) console.log("Error: problem finding page definition for", childPageID);
               if (childPage && childPage.displayType === "page") {
                   translate.extraTranslations[statusViewID + "::prompt"] = translate("#" + childPageID + "::title", childPage.displayName) + " " + translate("#dashboard_status_label") + " ";
                   console.log("about to call widgetBuilder for childPage", childPageID);
                   widgetBuilder.add_questionAnswer(pagePane, domain.projectData.projectAnswers, statusViewID, [childPageID + "_pageStatus"]);
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
    
    function panelForPageID(pageID) {
        var panelID = pageID.replace("page_", "panel_");
        return domain.pageDefinitions[panelID];
    }
    
    function previousPageClicked(event) {
        // console.log("previousPageClicked", event);
        if (!currentPageID) {
            // Should never get here
            alert("Something wrong with currentPageID");
            return;
        }
        var page = panelForPageID(currentPageID);
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
        var page = panelForPageID(currentPageID);
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
    
    function importButtonClicked(projectDefinitionText, hideDialogMethod) {     
        console.log("importButtonClicked", projectDefinitionText);
        
        var updatedProjectAnswers;
        
        try {
            updatedProjectAnswers = JSON.parse(projectDefinitionText);
        } catch(e) {
            alert("Problem parsing project definition text\n" + e);
            return;
        }

        console.log("parsed projectDefinitionText", updatedProjectAnswers);
        
        // TODO: Translate
        widgetSupport.confirm("This will overwrite your current project design.\nAny active survey and any previously stored survey results will remain as-is,\nhowever any new project design might have a different survey design.\nAre you sure you want to replace the current project definition?", function() {

            // TODO: Not sure what to do for what is essentially a new currentProjectVersionReference defined here
            switchToLoadedProjectData(null, updatedProjectAnswers, {__sha256HashAndLength: null});
            
            console.log("Updated OK");
            hideDialogMethod();
        });
    }
        
    function importExportClicked() {
        console.log("importExportClicked");
        var projectDefinitionText = JSON.stringify(domain.projectData.projectAnswers, null, 2);
        widgetSupport.openTextEditorDialog(projectDefinitionText, "dialog_projectImportExport", "projectImportExportDialog_title", "projectImportExportDialog_okButtonText", importButtonClicked);
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
        var pages = applicationBuilder.buildListOfPanels();
        
        console.log("createLayout start", pages);
        var pageSelectOptions = [];
        
        var questionIndex = 0;
        var lastPageID = null;
        var lastHeader = null;
        
        // Initialize toaster
        toaster.createToasterWidget("navigationDiv");
        
        // var imageButton = widgets.newButton("wwsImageButton", "Working With Stories image button", "navigationDiv", wwsButtonClicked);
        // imageButton.set("showLabel", false);
        // imageButton.set("iconClass", "wwsButtonImage");
        
        var homeButton = utility.newButton("button_home", null, "navigationDiv", homeButtonClicked);
        homeButton.set("showLabel", false);
        // homeButton.set("iconClass", "dijitEditorIcon dijitEditorIconOutdent");
        homeButton.set("iconClass", "homeButtonImage");
        // Buttons in this file must have startup called because they are each being added directly to the live visual hierarchy
        // This is as opposed to being added to some container that will have startup called on it later or already is running after startup was called
        homeButton.startup();
        
        for (var pageIndex = 0; pageIndex < pages.length; pageIndex++) {
            var page = pages[pageIndex];
            allPages[page.id] = page;
            console.log("defining page", page.id);
            var title = translate("#" + page.id + "::title", page.displayName);
            if (page.isHeader) {
                title = "<i>" + title + "</i>";
            } else {
                title = "&nbsp;&nbsp;&nbsp;&nbsp;" + title;
            }
            if (page.displayType !== "page") {
                title += " SPECIAL: " + page.type;
            }
            
            // TODO: Should this really be modifying the original???
            page.title = title;
            
            // Lump all questions together in domain for use by things like calculating derived values from options for quiz score results
            for (questionIndex in page.questions) {
                var question = page.questions[questionIndex];
                domain.questions[question.id] = question;
            }
            
            domain.pageDefinitions[page.id] = page;      
            
            // console.log("about to make page");
            // Skip over special page types
            if (page.displayType === "page") {
                var pageID = page.id.replace("panel_", "page_");
                console.log("pushing page", page);
                // Make it easy to lookup previous and next pages from a page
                if (lastPageID) panelForPageID(lastPageID).nextPageID = pageID;
                page.previousPageID = lastPageID;
                lastPageID = pageID;
                
                if (!page.isHeader) {
                    var list = domain.pagesToGoWithHeaders[lastHeader] || [];
                    list.push(page.id);
                    domain.pagesToGoWithHeaders[lastHeader] = list;
                } else {
                    lastHeader = page.id;
                }
                
                // Looks like Dojo select has a limitation where it can only take strings as values
                // so can't pass page in as value here and need indirect pageDefinitions lookup dictionary
                pageSelectOptions.push({label: title, value: pageID});
                // Put in a dynamic question (incomplete for options) to be used to lookup page status; needed to check it is a select
                domain.questions[page.id + "_pageStatus"] = {id: pageID + "_pageStatus", type: "select"};
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
        previousPageButton.startup();
        
        nextPageButton = utility.newButton("button_nextPage", null, "navigationDiv", nextPageClicked);
        nextPageButton.set("iconClass", "rightButtonImage");
        nextPageButton.startup();

        saveButton = utility.newButton("button_save", null, "navigationDiv", saveClicked);
        saveButton.startup();

        loadLatestButton = utility.newButton("button_loadLatest", null, "navigationDiv", loadLatestClicked);
        loadLatestButton.startup();
        loadVersionButton = utility.newButton("button_loadVersion", null, "navigationDiv", loadVersionClicked);
        loadVersionButton.startup();

        importExportButton = utility.newButton("button_importExport", null, "navigationDiv", importExportClicked);
        importExportButton.startup();

        var debugButton = utility.newButton("button_debug", null, "navigationDiv", debugButtonClicked);
        debugButton.startup();
        
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
    
    function openSurveyDialog() {
        // TODO: What version of questionnaire should be used? Should it really be the latest one? Or the one active on server?
        console.log("domain.projectData", domain.projectData);
        var questionnaire = domain.getCurrentQuestionnaire();
        
        survey.openSurveyDialog(questionnaire);
    }
    
    function startup() {
        widgetBuilder.setApplicationBuilder(applicationBuilder);
        translate.configure({}, applicationMessages);

        // Synchronizes the state of the domain for one status flag with what is on server
        domain.determineStatusOfCurrentQuestionnaire();

        // Setup important callback for page changes
        domain.setPageChangeCallback(widgetBuilder.updateQuestionsForPageChange);

        // Callback for this button
        // TODO: Temp for testing
        domain.buttonFunctions.enterSurveyResult = openSurveyDialog;
        domain.buttonFunctions.updateQuestionsForPageChangeCallback = updatePagesForDomainValueChange;
        
        // Call the main function
        createLayout();
        
        /* TODO: Commented out while testing changeover to fields
        // Get the latest project data
        loadLatestClicked();
        */
        
        // turn off startup "please wait" display
        document.getElementById("startup").style.display = "none";
    }
    
    startup();
});