import generateRandomUuid = require("../pointrel20150417/generateRandomUuid");
import surveyCollection = require("../surveyCollection");
import topic = require("../pointrel20150417/topic");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import GridWithItemPanel = require("../panelBuilder/GridWithItemPanel");
import Project = require("../Project");
import storyCardDisplay = require("../storyCardDisplay");

import Story = surveyCollection.Story;

"use strict";

// story themer support

/* TODO: Fix this!!!
function addThemeButtonPressed(themeEntryComboBox, storyThemesStore, allThemes) {
    console.log("Button pressed", storyThemesStore);
    
    var themeText = themeEntryComboBox.get("value");
    console.log("themeText", themeText);
    if (!themeText) return;
    
    themeEntryComboBox.set("value", "");
    
    //Check if the theme exists
    var existingTheme = null;
    for (var i = 0; i < allThemes.length; i++) {
        if (allThemes[i].name === themeText) {
            existingTheme = allThemes[i];
            break;
        }
    }
    
    // If the theme does not exist, create one and put into all themes correctly sorted by name
    if (!existingTheme) {
        var uuid = generateRandomUuid();
        var newTheme = {id: uuid, name: themeText};
        allThemes.push(newTheme);
        existingTheme = newTheme;
        allThemes.sort(function (a, b) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
    }
    
    // Check if theme already in list of added themes, and if so, delete it as we will later add it again at the bottom
    for (var j = 0; j < storyThemesStore.data.length; j++) {
        var themeInStore = storyThemesStore.data[j];
        if (themeInStore.name === existingTheme.name) {
            storyThemesStore.remove(themeInStore.id);
            break;
        }
    }
    
    storyThemesStore.add(existingTheme);
}

function buildThemerPanel(panelBuilder: PanelBuilder, model) {    
    // Encode all user-supplied text to ensure it does not create HTML issues
    var storyName = _.escape(model.storyName);
    var storyText = _.escape(model.storyText);
    
    var storyContent = "<b><h2>" + storyName + "</h2></b>" + storyText;
    
    var storyPane = new ContentPane({
        content: storyContent           
    });
    storyPane.placeAt(contentPane);
    
    var themesPane = new ContentPane();
    themesPane.placeAt(contentPane);
    
    // TODO: Need to hook up this with stories somehow, especially given they are loaded and saved outside the project
    // var testItem = {id: "test", name: "test"};
    var storyThemes = [];
    var storyThemesStore = GridWithItemPanel["newMemoryTrackableStore"](storyThemes, "id");
    
    var configuration2 = {removeButton: true, moveUpDownButtons: true, columnsToDisplay: true};
    var itemPanelSpecification2 = {
        "id": "storyThemeQuestions",
        panelFields: [
            {id: "name", displayName: "Theme", displayPrompt: "Theme", displayType: "text", valueOptions: []}
        ]
    };
    var themeList = new GridWithItemPanel(panelBuilder, themesPane, "storyThemeList", storyThemesStore, itemPanelSpecification2, configuration2, model);
    console.log("themeList", themeList);
    
    var allThemes = [];
    var allThemesStore = new Memory({
        data: allThemes,
        idProperty: "id"
    });
    
    var themeEntryComboBox = new ComboBox({
        store: allThemesStore,
        style: {width: "50%"}
    });
    themeEntryComboBox.placeAt(themesPane);
    
    var addThemeButton = widgetSupport.newButton(themesPane, "#button_addTheme|Add theme", addThemeButtonPressed.bind(null, themeEntryComboBox, storyThemesStore, allThemes));
    addThemeButton.placeAt(themesPane);
}

function currentCatalysisReportChanged(graphBrowserInstance, fieldName, oldValue, currentCatalysisReport) {
    console.log("currentCatalysisReportChanged", graphBrowserInstance, currentCatalysisReport);
    
}

// TODO: Fix so the filters get updated as the story questions get changed
function insertStoryThemer(panelBuilder: PanelBuilder, pagePane, model, fieldSpecification) {
    console.log("insertStoryThemer start", fieldSpecification.id);
    
    var choiceModelAndField = valuePathResolver.resolveModelAndFieldForFieldSpecification(panelBuilder, model, fieldSpecification);
    console.log("choiceModelAndField", choiceModelAndField);
    var choiceModel = choiceModelAndField.model;
    var choiceField = choiceModelAndField.field; 
    var catalysisReportIdentifier = choiceModel.get(choiceField);
    
    console.log("catalysisReportIdentifier", catalysisReportIdentifier);
    
    //  TODO: Update these based on selection
    var questions = [];
    var allStories = [];
    
    var itemPanelSpecification = {
         id: "storyBrowserQuestions",
         panelFields: questions,
         buildPanel: buildThemerPanel 
    };

    // Store will modify underlying array
    var dataStore = GridWithItemPanel["newMemoryTrackableStore"](allStories, "storyID");
    
    // Only allow view button for stories
    var configuration = {viewButton: true, navigationButtons: true, columnsToDisplay: ["storyName", "storyText"]};
    var storyList = new GridWithItemPanel(panelBuilder, pagePane, fieldSpecification.id, dataStore, itemPanelSpecification, configuration, model);
    storyList.grid.set("selectionMode", "single");
    
    var storyThemerInstance = {
        itemPanelSpecification: itemPanelSpecification,
        dataStore: dataStore, 
        storyList: storyList
    };
    
 var currentCatalysisReportSubscription = choiceModel.watch(choiceField, currentCatalysisReportChanged.bind(null, storyThemerInstance));        
    // TODO: Kludge to get this other previous created widget to destroy a subscription when the page is destroyed...
    pagePane.own(currentCatalysisReportSubscription);
    
    console.log("insertStoryThemer finished");
}
*/

// TODO: Next two functions from add_storyBrowser and so are duplicate code

function buildStoryDisplayPanel(panelBuilder: PanelBuilder, model) {
    var storyCardDiv = storyCardDisplay.generateStoryCardContent(model, model.questionnaire());
    
    return storyCardDiv;
}

function makeItemPanelSpecificationForQuestions(questions) {
    // TODO: add more participant and survey info, like timestamps and participant ID
    
    var storyItemPanelSpecification = {
         id: "patternBrowserQuestions",
         panelFields: questions,
         buildPanel: buildStoryDisplayPanel
    };
    
    return storyItemPanelSpecification;
}

class StoryThemer {
    project: Project = null;
    catalysisReportIdentifier: string = null;
    
    allStories = [];
    questions = [];
    
    modelForStoryGrid = {storiesSelectedInGraph: []};
    storyGridFieldSpecification: GridDisplayConfiguration = null;
    storyGrid: GridWithItemPanel = null;
     
    constructor(args) {
        this.project = args.panelBuilder.project;
        
        // Story grid initialization
        
        var storyItemPanelSpecification = makeItemPanelSpecificationForQuestions(this.questions);

        var storyGridConfiguration = {
            idProperty: "storyID",
            columnsToDisplay: ["storyName", "storyText"],
            viewButton: true,
            navigationButtons: true
        };
        
        this.storyGridFieldSpecification = {
            id: "storiesSelectedInGraph",
            itemPanelID: undefined,
            itemPanelSpecification: storyItemPanelSpecification,
            displayConfiguration: {
                itemPanelSpecification: storyItemPanelSpecification,
                gridConfiguration: storyGridConfiguration
            },
            gridConfiguration: storyGridConfiguration
        };

        this.storyGrid = new GridWithItemPanel({panelBuilder: args.panelBuilder, model: this.modelForStoryGrid, fieldSpecification: this.storyGridFieldSpecification});
    }
    
    static controller(args) {
        // console.log("Making PatternBrowser: ", args);
        return new StoryThemer(args);
    }
    
    static view(controller, args) {
        // console.log("PatternBrowser view called");
        
        return controller.calculateView(args);
    }
    
    calculateView(args) {
        // console.log("%%%%%%%%%%%%%%%%%%% PatternBrowser view called");
        var panelBuilder: PanelBuilder = args.panelBuilder;
        
        // Handling of caching of questions and stories
        var catalysisReportIdentifier = this.getCurrentCatalysisReportIdentifier(args);
        if (catalysisReportIdentifier !== this.catalysisReportIdentifier) {
            this.catalysisReportIdentifier = catalysisReportIdentifier;
            // console.log("storyCollectionIdentifier changed", this.catalysisReportIdentifier);
            this.currentCatalysisReportChanged(this.catalysisReportIdentifier);
        }
        
        var parts;
        
        var selectedStory: Story = this.storyGrid.getSelectedItem();
        
        if (!this.catalysisReportIdentifier) {
            parts = [m("div.narrafirma-choose-catalysis-report", "Please select a catalysis report to work with")];
        } else {
            parts = [
                this.storyGrid.calculateView(),
                selectedStory ?
                    m("div", "Story themer goes here for: " + selectedStory.storyName()) :
                    m("div", "Please select a story to theme")
            ];
        }
        
        // TODO: Need to set class
        return m("div", parts);
    }
    
    themePanelView(story: Story) {
        return m("div", "Story themer goes here for: " + story.storyName());
    }
    
    currentCatalysisReportChanged(catalysisReportIdentifier) {
        // console.log("currentCatalysisReportChanged", catalysisReportIdentifier);
        
        if (!catalysisReportIdentifier) {
            // TODO: should clear everything
            return;
        }
        
        // TODO: Handle multiple story collections
        // TODO: Better handling when can't find something
        
        var storyCollectionsIdentifier = this.project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_storyCollections");
        var storyCollectionItems = this.project.tripleStore.getListForSetIdentifier(storyCollectionsIdentifier);
        
        if (storyCollectionItems.length === 0) return;
        
        var storyCollectionPointer = storyCollectionItems[storyCollectionItems.length - 1];
        if (!storyCollectionPointer) return;
    
        var storyCollectionIdentifier = this.project.tripleStore.queryLatestC(storyCollectionPointer, "storyCollection");
        
        var questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);
        if (!questionnaire) {
            // TODO: Should clear more stuff?
            return;
        }
        
        this.allStories = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier);
        // console.log("allStories", this.allStories);
        
        this.questions = surveyCollection.collectQuestionsForQuestionnaire(questionnaire);
        // console.log("questions", this.questions);
        
        // Update item panel in story list so it has the correct header
        this.storyGridFieldSpecification.itemPanelSpecification = makeItemPanelSpecificationForQuestions(this.questions);
        this.storyGrid.updateDisplayConfigurationAndData(this.storyGridFieldSpecification);
        this.updateStoriesPane(this.allStories);
    }
    
    findCatalysisReport(shortName) {
        var catalysisReports = this.project.tripleStore.queryLatestC(this.project.projectIdentifier, "project_catalysisReports");
        if (!catalysisReports) return null;
        var catalysisReportIdentifiers = this.project.tripleStore.getListForSetIdentifier(catalysisReports);
        for (var i = 0; i < catalysisReportIdentifiers.length; i++) {
            var reportShortName = this.project.tripleStore.queryLatestC(catalysisReportIdentifiers[i], "catalysisReport_shortName");
            if (reportShortName === shortName) {
                return catalysisReportIdentifiers[i];
            }
        }
        return null;
    }
    
    // TODO: Similar to what is in add_graphBrowser
    getCurrentCatalysisReportIdentifier(args) {
        var panelBuilder = args.panelBuilder;
        var model = args.model;
        var fieldSpecification = args.fieldSpecification;
        
        // Get selected catalysis report
        var catalysisReportShortName = valuePathResolver.newValuePathForFieldSpecification(panelBuilder, model, fieldSpecification)();
    
        // console.log("catalysisReportShortName", catalysisReportShortName);
        
        if (!catalysisReportShortName) return null;
        
        return this.findCatalysisReport(catalysisReportShortName);
    }
    
    updateStoriesPane(stories) {
        this.modelForStoryGrid.storiesSelectedInGraph = stories;
        this.storyGrid.updateData();
    }
}

function add_storyThemer(panelBuilder: PanelBuilder, model, fieldSpecification) {
    var prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
    
    var patternBrowser = m.component(<any>StoryThemer, {key: fieldSpecification.id, panelBuilder: panelBuilder, model: model, fieldSpecification: fieldSpecification});
 
    return m("div", [
        prompt,
        patternBrowser
     ]);
}

export = add_storyThemer;
