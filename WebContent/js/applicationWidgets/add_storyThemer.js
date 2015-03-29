define([
    "js/domain",
    'dojox/html/entities',
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
    
    function displayHTMLForSlider(fieldSpecification, fieldName, value) {
        if (fieldSpecification.displayConfiguration.length !== 2) {
            console.log("missing displayConfiguration for slider", fieldSpecification);
            return "ERROR: Problem displaying slider " + fieldSpecification.id;
        }
        // Assumes values go from 0 to 100; places 100.0 in last bucket
        var lowLabel = fieldSpecification.displayConfiguration[0];
        var highLabel = fieldSpecification.displayConfiguration[1];
        var sliderText = "";
        var bucketCount = 40;
        var bucketSize = 100.0 / bucketCount;
        var placed = false;
        for (var i = 0; i < bucketCount; i++) {
            var bucketLow = i * bucketSize;
            var bucketHigh = i * bucketSize + bucketSize;
            if (!placed && ((value < bucketHigh) || (i === bucketCount - 1))) {
                sliderText += "<b>|</b>";
                placed = true;
            } else {
                sliderText += "-";
            }
        }
        return '<tr><td class="narrafirma-themer-slider-name">' + fieldName + '</td><td class="narrafirma-themer-slider-label-left">' + lowLabel + '</td><td class="narrafirma-themer-slider-contents">' + sliderText + '</td><td class="narrafirma-themer-slider-label-right">' + highLabel + '</td></tr>\n'; 
    }
    
    function displayHTMLForCheckboxes(fieldSpecification, fieldName, value) {
        var result = "";
        for (var i = 0; i < fieldSpecification.dataOptions.length; i++) {
            var option = fieldSpecification.dataOptions[i];
            // console.log("checkboxes", option, fieldSpecification, value);
            if (result) result += ", ";
            if (value[option]) {
                result += '<span class="narrafirma-themer-checkboxes-selected">' + option + '</span>';
            } else {
                result += '<span class="narrafirma-themer-checkboxes-unselected">' + option + '</span>';
            }
        }
        return fieldName + ": " + result;
    }
    
    function displayHTMLForSelect(fieldSpecification, fieldName, value) {
        var result = "";
        for (var i = 0; i < fieldSpecification.dataOptions.length; i++) {
            var option = fieldSpecification.dataOptions[i];
            if (result) result += ", ";
            if (value === option) {
                result += '<span class="narrafirma-themer-select-selected">' + option + '</span>';
            } else {
                result += '<span class="narrafirma-themer-select-unselected">' + option + '</span>';
            }
        }
        return fieldName + ": " + result;
    }
    
    function displayHTMLForField(model, fieldSpecification, nobreak) {
        if (!model.get(fieldSpecification.id)) return "";
        var value = model.get(fieldSpecification.id);
        // TODO: extra checking here for problems with test data -- could probably be changed back to just displayName eventually
        var fieldName = fieldSpecification.displayName || fieldSpecification.displayPrompt;
        var result = fieldName + ": " + value;
        if (fieldSpecification.displayType === "slider") {
            result =  displayHTMLForSlider(fieldSpecification, fieldName, value);
        }
        if (fieldSpecification.displayType === "checkboxes") {
            result = displayHTMLForCheckboxes(fieldSpecification, fieldName, value);
        }
        if (fieldSpecification.displayType === "select") {
            result = displayHTMLForSelect(fieldSpecification, fieldName, value);
        }
        if (nobreak) return result;
        return result + "<br><br>\n";  
    }
    
    function buildThemerPanel(panelBuilder, contentPane, model) {    
        // Encode all user-supplied text to ensure it does not create HTML issues
        var storyName = entities.encode(model.get("__survey_storyName"));
        var storyText = entities.encode(model.get("__survey_storyText"));
        var otherFields = "";
        
        var currentQuestionnaire = domain.currentQuestionnaire;
        
        var questions = [];
        if (currentQuestionnaire) questions = questions.concat(currentQuestionnaire.storyQuestions);
        if (currentQuestionnaire) questions = questions.concat(currentQuestionnaire.participantQuestions);
        
        var question;
        var i;
        
        // Put sliders in a table at the start, so loop twice with different conditions
        
        for (i = 0; i < questions.length; i++) {
            question = questions[i];
            if (question.displayType !== "slider") continue;
            console.log("making slider", question);
            if (!otherFields) otherFields += "<table>\n";
            otherFields += displayHTMLForField(model, question, "nobreak");
        }
        if (otherFields) otherFields += "\n</table>\n<br>\n";
        
        for (i = 0; i < questions.length; i++) {
            question = questions[i];
            if (question.displayType === "slider") continue;
            console.log("making other than slider", question);
            otherFields += displayHTMLForField(model, question);
        }
        
        console.log("otherFields", otherFields);
        
        var storyPane = new ContentPane({
            content:
                "<b><h2>" + storyName + "</h2></b>" +
                 storyText + "<br><br>" +
                 otherFields
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
                {id: "name", displayName: "Theme", displayPrompt: "Theme", displayType: "text", dataOptions:[]}
            ]
        };
        var themeList = new GridWithItemPanel(panelBuilder, themesPane, "storyThemeList", storyThemesStore, itemPanelSpecification2, configuration2);
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
        storyThemerInstance.storyList.grid.set("collection", storyThemerInstance.dataStore);
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
        var storyList = new GridWithItemPanel(panelBuilder, pagePane, id, dataStore, itemPanelSpecification, configuration);
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