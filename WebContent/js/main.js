require([
    "dojo/i18n!js/nls/applicationMessages",
    "js/panelBuilder/dialogSupport",
    "js/domain",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/hash",
    "dojo/_base/lang",
    "js/applicationWidgets/loadAllApplicationWidgets",
    "js/applicationPanelSpecifications/loadAllPanelSpecifications",
    "js/storage",
    "js/survey",
    "js/panelBuilder/toaster",
    "dojo/topic",
    "js/panelBuilder/translate",
    "js/panelBuilder/PanelBuilder",
    "js/panelBuilder/widgetSupport",
    "dijit/layout/ContentPane",
    "dijit/form/Select",
    "js/panelBuilder/PanelSpecificationCollection",
    "dojo/domReady!"
], function(
    applicationMessages,
    dialogSupport,
    domain,
    domConstruct,
    domStyle,
    hash,
    lang,
    loadAllApplicationWidgets,
    loadAllPanelSpecifications,
    storage,
    survey,
    toaster,
    topic,
    translate,
    PanelBuilder,
    widgetSupport,
    ContentPane,
    Select,
    PanelSpecificationCollection
){
    "use strict";

    // TODO: Add page validation
    // TODO: Add translations for GUI strings used here
    
    var panelSpecificationCollection = new PanelSpecificationCollection();
    
    // For building panels based on field specifications
    var panelBuilder = new PanelBuilder();
    
    // For tricking what page the application is on
    var startPage = "page_dashboard";
    var currentSectionID;
    var currentPageID;
    var currentPage;
    
    // Navigation widgets
    var navigationPane;
    var pageControlsPane;
    var homeButton;
    var pageNavigationSelect;
    var previousPageButton;
    var nextPageButton;
    var saveButton;
    var debugButton;
    
    // The mostly recently loaded project version
    var currentProjectVersionReference; 
    
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
        
        console.log("got versions", versions);
        
        versions.sort(function(a, b) {return a.timestamp.localeCompare(b.timestamp);});
        
        // TODO: Translate
        var columns = {timestamp: "Timestamp", committer: "Committer", sha256AndLength: "Reference"};
        dialogSupport.openListChoiceDialog(null, versions, columns, "Project versions", "Load selected version", function (choice) {
            console.log("choice:", choice);
            if (choice) {
                var sha256AndLength = choice.sha256AndLength;
                storage.loadProjectVersion(sha256AndLength, switchToLoadedProjectData);
            }
        });
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
                if (!_.startsWith(key, "_")) fieldsToRemove[key] = true;
            }
        }
        for (key in fieldsToRemove) {
            console.log("removing old field/data", key, domain.projectData.projectAnswers.get(key));
            domain.projectData.projectAnswers.set(key, undefined);
        }
        
        // Rebuild the current page to ensure it gets latest data...
        showPage(currentPageID, "forceRefresh");
        
        // Store a reference so can pass it to storage as "previous" for next version to get chain or tree of versions
        currentProjectVersionReference = envelope.__sha256HashAndLength;
        
        // TODO: Translate and improve this feedback
        toaster.toast("Finished loading project data");
        
        // TODO: Kludge of loading all stories when load data?
        console.log("Going to try to load latest stories from server");
        domain.loadLatestStoriesFromServer(function (newEnvelopeCount) {
            console.log("Forcing refresh of current page");
            // TODO: KLUDGE: Updating gui a second time so get flicker -- and maybe lose edits?
            if (newEnvelopeCount) showPage(currentPageID, "forceRefresh");
        });
        
        return;
    }
    
    function saveClicked(event) {
        console.log("save clicked", domain.projectData.projectAnswers);
        storage.storeProjectVersion(domain.projectData.projectAnswers, currentProjectVersionReference, saveFinished);
    }
    
    function saveFinished(error, newVersionURI) {
        if (error) {return alert("could not write new version:\n" + error);}
        // TODO: Translate and improve this feedback
        console.log("Save finished to file", newVersionURI);
        currentProjectVersionReference = newVersionURI;
        toaster.toast("Finished saving");
    }
    
    function getPageSpecification(pageID) {
        // For now, any "page" defined in the panelSpecificationCollection is available
        return panelSpecificationCollection.getPageSpecificationForPageID(pageID);
    }
    
    function urlHashFragmentChanged(newHash) {
        console.log("urlHashFragmentChanged", newHash);
        if (currentPageID !== newHash) {
            var pageSpecification = getPageSpecification(newHash);
            if (pageSpecification && pageSpecification.displayType === "page") {
                showPage(newHash);
            } else {
                console.log("unsupported url hash fragment", newHash);
                alert("A page was not found for: " + newHash);
                if (newHash !== startPage) urlHashFragmentChanged(startPage);
            }
        }
    }
    
    function pageNavigationSelectChanged(event) {
        var pageID = event;
        console.log("changing page to:", pageID);
        showPage(pageID);
    }
    
    function showPage(pageID, forceRefresh) {
        if (currentPageID === pageID && !forceRefresh) return;
        
        var pageSpecification = getPageSpecification(pageID);
        if (!pageSpecification) {
            console.log("no such page", pageID);
            alert("No such page: " + pageID);
            return;
        }
        
        // Hide the current page temporarily
        domStyle.set("pageDiv", "display", "none");
        
        if (currentPageID && currentPage) {
            // domStyle.set(currentPageID, "display", "none");
            console.log("destroying", currentPageID, currentPage);
            currentPage.destroyRecursive();
            domConstruct.destroy(currentPage.domNode);
        }
        
        currentPage = createPage(pageID, true);
        
        currentPageID = pageID;
        hash(currentPageID);
        
        previousPageButton.setDisabled(!pageSpecification.previousPageID);
        nextPageButton.setDisabled(!pageSpecification.nextPageID);
        
        // Show the current page again
        domStyle.set("pageDiv", "display", "block");
        
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    
        // Because the page was hidden when created, all the grids need to be resized so grid knows how tall to make header so it is not overwritten
        currentPage.resize();
        
        // Ensure the navigation dropdown has the list for this section
        if (currentSectionID !== pageSpecification.section) {   
            currentSectionID = pageSpecification.section;
            console.log("getting options for", pageSpecification.section, pageSpecification);
            var options = pageSelectOptionsForSection(pageSpecification.section);
            pageNavigationSelect.set("options", options);
        }
        
        // Ensure select is pointing to this page; this may trigger an update but it should be ignored as we're already on this page
        pageNavigationSelect.set("value", pageID);
    }
    
    var completionStatusOptions = ["intentionally skipped", "partially done", "completely finished"];
    
    function createPage(pageID, visible) {
        console.log("createPage", pageID);
        
        var pageSpecification = getPageSpecification(pageID);
       
        if (!pageSpecification) {
            console.log("ERROR: No definition for page: ", pageID);
            return;
        }
        
        var pagePane = new ContentPane({
            "id": pageID,
            title: pageSpecification.title,
            // Shorten width so grid scroll bar shows up not clipped
            // Also, looks like nested ContentPanes tend to walk off the right side of the page for some reason
            style: "width: 94%",
            display: "none" // "block" // 
       });
       
       // console.log("about to place pane", pageID);
       // Dojo seems to require these pages be in the visual hierarchy before some components like grid that are added to them are have startUp called.
       // Otherwise the grid header is not sized correctly and will be overwritten by data
       // This is as opposed to what one might think would reduce resizing and redrawing by adding the page only after components are added
       pagePane.placeAt("pageDiv");
       pagePane.startup();
        
       // console.log("Made content pane", pageID);
       
       panelBuilder.buildPanel(pageID, pagePane, domain.projectData.projectAnswers);
       
       if (pageSpecification.section !== "page_dashboard") {
           if (!pageSpecification.isHeader) {
               var statusEntryID = pageID + "_pageStatus";
               var completionStatusEntryFieldSpecification = {
                   id: statusEntryID,
                   displayType: "select",
                   displayName: "Completion status",
                   displayPrompt: translate("#dashboard_status_entry::prompt", "The dashboard status of this page is:"),
                   dataOptions: completionStatusOptions
               };
               panelBuilder.buildField(pagePane, domain.projectData.projectAnswers, completionStatusEntryFieldSpecification);
           } else {
               console.log("page dashboard as header", pageSpecification.id, pageSpecification.displayType, pageSpecification);
               // Put in dashboard
               var childPageIDs = panelSpecificationCollection.getChildPageIDListForHeaderID(pageID);
               console.log("child pages", pageID, childPageIDs);
               if (!childPageIDs) childPageIDs = [];
               for (var childPageIndex = 0; childPageIndex < childPageIDs.length; childPageIndex++) {
                   var childPageID = childPageIDs[childPageIndex];
                   var statusViewID = childPageID + "_pageStatus_dashboard";
                   var childPageSpecification = getPageSpecification(childPageID);
                   console.log("childPageID", childPageSpecification, childPageID);
                   if (!childPageSpecification) console.log("Error: problem finding page definition for", childPageID);
                   if (childPageSpecification && childPageSpecification.displayType === "page") {
                       var prompt = translate(childPageID + "::title", childPageSpecification.displayName) + " " + translate("#dashboard_status_label", "status:") + " ";
                       console.log("about to call panelBuilder to add one questionAnswer for child page's status", childPageID);
                       var completionStatusDisplayFieldSpecification = {
                           id: statusViewID,
                           displayType: "questionAnswer",
                           displayName: prompt,
                           displayPrompt: prompt,
                           displayConfiguration: [childPageID + "_pageStatus"]
                       };
                       panelBuilder.buildField(pagePane, domain.projectData.projectAnswers, completionStatusDisplayFieldSpecification);
                   }
               }
           }
       }
       
       /*
       var nextPageButtonQuestion = {
           "id": pageID + "_nextPageButton",
           "displayPrompt": "Mark page complete and proceed to next page",
           "displayType": "button"
       };
       
       questionEditor.insertQuestionIntoDiv(nextPageButtonQuestion, pagePane);
       */
       
       // console.log("about to set visibility", pageID);
       if (visible) {
            domStyle.set(pageID, "display", "block");
       } else {
            domStyle.set(pageID, "display", "none");
       }
              
       return pagePane;
    }

    function previousPageClicked(event) {
        // console.log("previousPageClicked", event);
        if (!currentPageID) {
            // Should never get here
            alert("Something wrong with currentPageID");
            return;
        }
        var pageSpecification = getPageSpecification(currentPageID);
        var previousPageID = pageSpecification.previousPageID;
        if (previousPageID) {
            showPage(previousPageID);
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
        var pageSpecification = getPageSpecification(currentPageID);
        var nextPageID = pageSpecification.nextPageID;
        if (nextPageID) {
            showPage(nextPageID);
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
        showPage(startPage);
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
        dialogSupport.confirm("This will overwrite your current project design.\nAny active survey and any previously stored survey results will remain as-is,\nhowever any new project design might have a different survey design.\nAre you sure you want to replace the current project definition?", function() {

            // TODO: Not sure what to do for what is essentially a new currentProjectVersionReference defined here
            switchToLoadedProjectData(null, updatedProjectAnswers, {__sha256HashAndLength: null});
            
            console.log("Updated OK");
            hideDialogMethod();
        });
    }
        
    function importExportClicked() {
        console.log("importExportClicked");
        var projectDefinitionText = JSON.stringify(domain.projectData.projectAnswers, null, 2);
        dialogSupport.openTextEditorDialog(projectDefinitionText, "#projectImportExportDialog_title|Project Import/Export", "#projectImportExportDialog_okButtonText|OK", importButtonClicked);
    }
    
    // TODO: somehow unify this with code in widget-questions-table?
    function newSpecialSelect(addToDiv, options) {
        var select = new Select({
            options: options
        });
        select.placeAt(addToDiv);
        return select;
    }
    
    // Calculate title to be displayed in navigation select
    function titleForPanel(panelSpecification) {
        var title = translate(panelSpecification.id + "::title", panelSpecification.displayName);
        if (panelSpecification.isHeader) {
            title = "<i>" + title + "</i>";
        } else {
            title = "&nbsp;&nbsp;&nbsp;&nbsp;" + title;
        }
        if (panelSpecification.displayType !== "page") {
            title += " SPECIAL: " + panelSpecification.displayType;
        }
        return title;
    }
    
    function pageSelectOptionsForSection(sectionHeaderPageID) {
        if (!sectionHeaderPageID) throw new Error("sectionHeaderPageID cannot be null or empty");
        console.log("pageSelectOptionsForSection", sectionHeaderPageID);
        var pageIDs = panelSpecificationCollection.getChildPageIDListForHeaderID(sectionHeaderPageID);
        var options = [];
        var title = titleForPanel(getPageSpecification(sectionHeaderPageID));
        // It seems like a Dojo "select" widget has a limitation where it can only take strings as values.
        // This means we need to look up page definitions indirectly based on a pageID usind a PanelSpecificationCollection instance.
        options.push({label: title, value: sectionHeaderPageID});
        _.forEach(pageIDs, function (pageID) {
            title = titleForPanel(getPageSpecification(pageID));
            options.push({label: title, value: pageID});
        });
        return options;
    }
    
    function processAllPanels() {
        var panels = panelSpecificationCollection.buildListOfPanels();
        console.log("processAllPanels", panels);
        
        var lastPageID = null;
        var lastHeader = null;
        var lastSection = null;
        
        for (var panelIndex = 0; panelIndex < panels.length; panelIndex++) {
            var panel = panels[panelIndex];
            
            // console.log("defining panel", panel.id);

            // For panels that are a "page", add to top level pages choices and set up navigation
            if (panel.displayType === "page") {
                var pageID = panel.id;
                // console.log("pushing page", panel);
                // Make it easy to lookup previous and next pages from a page
                if (!panel.isHeader) {
                    var previousPage = getPageSpecification(lastPageID);
                    previousPage.nextPageID = pageID;
                    panel.previousPageID = lastPageID;
                }
                lastPageID = pageID;

                // Put in a dynamic question (incomplete for options) to be used to lookup page status.
                // This is needed so add_qustionAnswer can check the field is a "select" to translate the options if needed
                panelSpecificationCollection.addFieldSpecification({id: pageID + "_pageStatus", displayType: "select"});
                
                if (panel.isHeader) {
                    lastHeader = pageID;
                    lastSection = panel.section;
                }
            }
            
            panel.helpSection = lastSection;
            panel.helpPage = panel.id;
            // TODO: Think about what "section" should really mean -- conceptual section (e.g. "catalysis") versus section header page ID (e.g. "page_catalysis");
            panel.section = lastHeader;
            
            for (var fieldIndex = 0; fieldIndex < panel.panelFields.length; fieldIndex++) {
                var fieldSpec = panel.panelFields[fieldIndex];
                fieldSpec.helpSection = lastSection;
                fieldSpec.helpPage = panel.id;
            }
        }
    }

    function createNavigationPane() {
        // Startup needs to be called here to ensure a top level content pane is started
        navigationPane = new ContentPane({}, "navigationDiv");
        navigationPane.startup();
        
        // Any items like buttons added to the navigationPane will have startup() called automatically,
        // since the navigationPane they are being added to has already been started
        
        // var imageButton = widgets.newButton("wwsImageButton", "Working With Stories image button", navigationPane, wwsButtonClicked);
        // imageButton.set("showLabel", false);
        // imageButton.set("iconClass", "wwsButtonImage");
        
        // Document controls
        
        // Page controls
        
        pageControlsPane = new ContentPane();
        pageControlsPane.placeAt(navigationPane);
        
        domConstruct.place('<span id="narrafirma-name">NarraFirma&#0153;</span>', pageControlsPane.domNode);
        
        homeButton = widgetSupport.newButton(pageControlsPane, "#button_home|Home", homeButtonClicked);
        homeButton.set("showLabel", false);
        // homeButton.set("iconClass", "dijitEditorIcon dijitEditorIconOutdent");
        homeButton.set("iconClass", "homeButtonImage");
        homeButton.set("title", translate("#button_home_title|Go to main dashboard"));

        // TODO: Select width should be determined from contents of select options using font metrics etc.
        pageNavigationSelect = newSpecialSelect(pageControlsPane, []);
        domStyle.set(pageNavigationSelect.domNode, "width", "400px");
        pageNavigationSelect.on("change", pageNavigationSelectChanged);
        
        previousPageButton = widgetSupport.newButton(pageControlsPane, "", previousPageClicked);
        previousPageButton.set("iconClass", "leftButtonImage");
        previousPageButton.set("title", translate("#button_previousPage", "Go to previous page"));
        
        nextPageButton = widgetSupport.newButton(pageControlsPane, "", nextPageClicked);
        nextPageButton.set("iconClass", "rightButtonImage");
        nextPageButton.set("title", translate("#button_nextPage", "Go to next page"));
        
        saveButton = widgetSupport.newButton(pageControlsPane, "#button_save|Save", saveClicked);

        debugButton = widgetSupport.newButton(pageControlsPane, "#button_debug|Debug", debugButtonClicked);
    }
    
    // Make all of the application pages selectable from the dropdown list and back/next buttons and put them in a TabContainer
    function createLayout() {
        console.log("createLayout start");
        
        createNavigationPane();
        
        // Setup the first page
        var fragment = hash();
        console.log("fragment when page first loaded", fragment);
        if (fragment && fragment !== startPage) {
            urlHashFragmentChanged(fragment);
        } else {
            urlHashFragmentChanged(startPage);
            showPage(startPage);
            currentPageID = startPage;
        }
        
        console.log("createLayout end");
    }
    
    function openSurveyDialog() {
        // TODO: What version of questionnaire should be used? Should it really be the latest one? Or the one active on server?
        console.log("domain.projectData", domain.projectData);
        var questionnaire = domain.getCurrentQuestionnaire();
        
        survey.openSurveyDialog(questionnaire);
    }
    
    function loadedMoreSurveyResults(newEnvelopeCount) {
        if (newEnvelopeCount === 0) {
            // TODO: Translate
            toaster.toast("No new survey results were found.");
        } else {
            // TODO: Translate
            toaster.toast("" + newEnvelopeCount + " new survey result(s) were found.");
        }
    }
    
    ///////// Button functions 
    
    function copyStoryFormURL() {
        alert("Story form URL is: " + "http://localhost:8080/survey.html");
    }
    
    function guiOpenSection(contentPane, model, fieldSpecification, value) {
        var section = fieldSpecification.displayConfiguration.section;
        console.log("guiOpenSection", section, fieldSpecification);
        showPage(section);
    }
    
    function printStoryForm(contentPane, model, fieldSpecification, value) {
        console.log("printStoryForm unfinished");
        
        alert("unfinished");
    }
    
    function copyDraftPNIQuestionVersionsIntoAnswers() {
        var copiedAnswersCount = domain.copyDraftPNIQuestionVersionsIntoAnswers();
        var template = translate("#copyDraftPNIQuestion_template", "Copied {{copiedAnswersCount}} answers\nNote that blank draft answers are not copied; non-blank final answers are not replaced");
        var message = template.replace("{{copiedAnswersCount}}", copiedAnswersCount);
        alert(message);
    }
      
    var buttonFunctions = {
        "printStoryForm": printStoryForm,
        "copyDraftPNIQuestionVersionsIntoAnswers": copyDraftPNIQuestionVersionsIntoAnswers,
        "loadLatestStoriesFromServer": domain.loadLatestStoriesFromServer,
        "enterSurveyResult": openSurveyDialog,
        "storyCollectionStart": domain.storyCollectionStart,
        "storyCollectionStop": domain.storyCollectionStop,
        "copyStoryFormURL": copyStoryFormURL,
        "guiOpenSection": guiOpenSection,
        "loadLatest": loadLatestClicked,
        "loadVersion": loadVersionClicked,
        "importExportOld": importExportClicked
    };
    
    // dispatch the button click
    function buttonClicked(contentPane, model, fieldSpecification, value) {
         console.log("buttonClicked", fieldSpecification);
         
         var functionName = fieldSpecification.id;
         if (fieldSpecification.displayConfiguration) {
             if (_.isString(fieldSpecification.displayConfiguration)) {
                 functionName = fieldSpecification.displayConfiguration;
             } else {
                 functionName = fieldSpecification.displayConfiguration.action;
             }
         }
         
         var actualFunction = buttonFunctions[functionName];
         if (!actualFunction) {
             var message = "Unfinished handling for: " + fieldSpecification.id + " with functionName: " + functionName;
             console.log(message, contentPane, model, fieldSpecification, value);
             alert(message);
             return;
         } else {
             actualFunction(contentPane, model, fieldSpecification, value);
         }
    }
    
    ///////////////
    
    function initialize() {
        translate.configure({}, applicationMessages);
        
        // Initialize toaster
        toaster.createToasterWidget("navigationDiv");
        
        loadAllApplicationWidgets(PanelBuilder);
        
        console.log("loadAllPanelSpecifications", loadAllPanelSpecifications);
        // Load the application design
        loadAllPanelSpecifications(panelSpecificationCollection);
        
        // Setup the domain with the base model defined by field specifications
        domain.setupDomain(panelSpecificationCollection);
 
        processAllPanels();
        
        // Tell the panel builder how to build panels
        panelBuilder.setPanelSpecifications(panelSpecificationCollection);
        
        // Tell the panelBuilder what do do if a button is clicked
        panelBuilder.setButtonClickedCallback(function(panelBuilder, contentPane, model, fieldSpecification, value) {
            buttonClicked(contentPane, model, fieldSpecification, value);
        });
        
        createLayout();
        
        // Update if the URL hash fragment changes
        topic.subscribe("/dojo/hashchange", urlHashFragmentChanged); 
        
        topic.subscribe("loadLatestStoriesFromServer", loadedMoreSurveyResults);
        
        // Synchronizes the state of the domain for one status flag with what is on server
        domain.determineStatusOfCurrentQuestionnaire();
        
        // Get the latest project data
        loadLatestClicked();
        
        // turn off initial "please wait" display
        document.getElementById("pleaseWaitDiv").style.display = "none";
    }
    
    initialize();
});