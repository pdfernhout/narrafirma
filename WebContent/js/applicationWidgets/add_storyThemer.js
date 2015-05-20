define([
    "js/domain",
    "dojox/html/entities",
    "dojox/uuid/generateRandomUuid",
    "dojo/_base/lang",
    "js/surveyCollection",
    "dojo/topic",
    "js/panelBuilder/standardWidgets/GridWithItemPanel",
    "dijit/form/ComboBox",
    "dijit/layout/ContentPane",
    "dojo/store/Memory",
    "dojo/Stateful",
    "js/panelBuilder/widgetSupport"
], function(
    domain,
    entities,
    generateRandomUuid,
    lang,
    surveyCollection,
    topic,
    GridWithItemPanel,
    ComboBox,
    ContentPane,
    Memory,
    Stateful,
    widgetSupport
 ){
    "use strict";
    
    // story themer support
    
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
    
    function buildThemerPanel(panelBuilder, contentPane, model) {    
        // Encode all user-supplied text to ensure it does not create HTML issues
        var storyName = entities.encode(model.get("__survey_storyName"));
        var storyText = entities.encode(model.get("__survey_storyText"));
        
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
        var storyThemesStore = GridWithItemPanel.newMemoryTrackableStore(storyThemes, "id");
        
        var configuration2 = {removeButton: true, moveUpDownButtons: true, includeAllFields: true};
        var itemPanelSpecification2 = {
            "id": "storyThemeQuestions",
            panelFields: [
                {id: "name", displayName: "Theme", displayPrompt: "Theme", displayType: "text", valueOptions:[]}
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
        
        var addThemeButton = widgetSupport.newButton(themesPane, "#button_addTheme|Add theme", lang.partial(addThemeButtonPressed, themeEntryComboBox, storyThemesStore, allThemes));
        addThemeButton.placeAt(themesPane);
    }
    
    function currentQuestionnaireChanged(storyThemerInstance, currentQuestionnaire) {
        // Update filters
        var questions = surveyCollection.collectQuestionsForCurrentQuestionnaire();
        storyThemerInstance.itemPanelSpecification.panelFields = questions;
        
        // Update item panel in grid
        storyThemerInstance.storyList.changeItemPanelSpecification(storyThemerInstance.itemPanelSpecification);
    }
    
    function loadLatestStoriesFromServerChanged(storyThemerInstance, newEnvelopeCount, allStories) {
        console.log("loadLatestStoriesFromServerChanged", storyThemerInstance, newEnvelopeCount, allStories);
        if (!newEnvelopeCount) return;
        // console.log("loadLatestStoriesFromServerChanged", storyBrowserInstance, allStories);
        storyThemerInstance.dataStore.setData(allStories);
        // Apparently, trackable stored don't send a general update message when you change their data, so explicitely set grid store here to force update
        storyThemerInstance.storyList.dataStoreChanged(storyThemerInstance.dataStore);
    }
    
    // TODO: Fix so the filters get updated as the story questions get changed
    function insertStoryThemer(panelBuilder, pagePane, model, id) {
        console.log("insertStoryThemer start", id);
        
        // TODO: Handle the fact that currentQuestionnaire may be null if this is the first page loaded, and also may update as topic
        var questions = surveyCollection.collectQuestionsForCurrentQuestionnaire();
        
        var itemPanelSpecification = {
             id: "storyBrowserQuestions",
             panelFields: questions,
             buildPanel: buildThemerPanel 
        };

        var stories = domain.allStories;

        // Store will modify underlying array
        var dataStore = GridWithItemPanel.newMemoryTrackableStore(stories, "_storyID");
        
        // Only allow view button for stories
        var configuration = {viewButton: true, navigationButtons: true, includeAllFields: ["__survey_storyName", "__survey_storyText"]};
        var storyList = new GridWithItemPanel(panelBuilder, pagePane, id, dataStore, itemPanelSpecification, configuration, model);
        storyList.grid.set("selectionMode", "single");
        
        var storyThemerInstance = {
            itemPanelSpecification: itemPanelSpecification,
            dataStore: dataStore, 
            storyList: storyList
        };
        
        var loadLatestStoriesFromServerSubscription = topic.subscribe("loadLatestStoriesFromServer", lang.partial(loadLatestStoriesFromServerChanged, storyThemerInstance));
        
        // TODO: Kludge to get this other previous created widget to destroy a subscription when the page is destroyed...
        pagePane.own(loadLatestStoriesFromServerSubscription);
        
        var currentQuestionnaireSubscription = topic.subscribe("currentQuestionnaire", lang.partial(currentQuestionnaireChanged, storyThemerInstance));
        
        // TODO: Kludge to get this other previous created widget to destroy a subscription when the page is destroyed...
        pagePane.own(currentQuestionnaireSubscription);
        
        console.log("insertStoryThemer finished");
    }
    
    function add_storyThemer(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var storyThemerInstance = insertStoryThemer(panelBuilder, questionContentPane, model, fieldSpecification.id);
        questionContentPane.resize();
        return storyThemerInstance;
    }

    return add_storyThemer;
    
});