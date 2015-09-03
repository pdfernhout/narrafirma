import generateRandomUuid = require("../pointrel20150417/generateRandomUuid");
import surveyCollection = require("../surveyCollection");
import topic = require("../pointrel20150417/topic");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");

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
    var storyName = _.escape(model.__survey_storyName);
    var storyText = _.escape(model.__survey_storyText);
    
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
    var dataStore = GridWithItemPanel["newMemoryTrackableStore"](allStories, "_storyID");
    
    // Only allow view button for stories
    var configuration = {viewButton: true, navigationButtons: true, columnsToDisplay: ["__survey_storyName", "__survey_storyText"]};
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

function add_storyThemer(panelBuilder: PanelBuilder, model, fieldSpecification) {
    /*
    var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(fieldSpecification);
    
    var storyThemerInstance = insertStoryThemer(panelBuilder, questionContentPane, model, fieldSpecification);
    questionContentPane.resize();
    return storyThemerInstance;
    */
    
    return m("div", "Need to convert story themer to Mithril");
}

export = add_storyThemer;
