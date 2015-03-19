define([
    'dojox/html/entities',
    "dojox/uuid/generateRandomUuid",
    "js/questionnaireGeneration",
    "js/surveyCollection",
    "js/panelBuilder/translate",
    "js/panelBuilder/standardWidgets/GridWithItemPanel",
    "dijit/form/ComboBox",
    "dijit/layout/ContentPane",
    "dojo/store/Memory",
    "dstore/Memory",
    "dojo/Stateful",
    "js/panelBuilder/widgetSupport"
], function(
    entities,
    generateRandomUuid,
    questionnaireGeneration,
    surveyCollection,
    translate,
    GridWithItemPanel,
    ComboBox,
    ContentPane,
    Memory,
    MemoryDstore,
    Stateful,
    widgetSupport
 ){
    "use strict";
    
    // story themer support
    
    // TODO: Fix so the filters get updated as the story questions get changed
    function insertStoryThemer(panelBuilder, pagePane, model, id) {
        console.log("insertStoryThemer start", id);
        
        // TODO: Fix this show also handles participant questions somehow
        var questionnaire = questionnaireGeneration.getCurrentQuestionnaire();
        var storyQuestions = questionnaire.storyQuestions;
        var participantQuestions = questionnaire.participantQuestions;
        
        // TODO: What about idea of having IDs that go with eliciting questions so store reference to ID not text prompt?
        var elicitingQuestionPrompts = [];
        for (var elicitingQuestionIndex = 0; elicitingQuestionIndex < questionnaire.elicitingQuestions.length; elicitingQuestionIndex++) {
            var elicitingQuestionSpecification = questionnaire.elicitingQuestions[elicitingQuestionIndex];
            elicitingQuestionPrompts.push(elicitingQuestionSpecification.text);
        }
        
        // TODO: Remove redundancy
        var leadingStoryQuestions = [];
        leadingStoryQuestions.unshift({id: "__survey_storyName", displayName: "storyName", displayPrompt: "Please give your story a name", displayType: "text", dataOptions:[]});
        leadingStoryQuestions.unshift({id: "__survey_storyText", displayName: "storyText", displayPrompt: "Please enter your response to the question above in the space below", displayType: "textarea", dataOptions:[]});
        leadingStoryQuestions.unshift({id: "__survey_elicitingQuestion", displayName: "elicitingQuestion", displayPrompt: "Please choose a question you would like to respond to", displayType: "select", dataOptions: elicitingQuestionPrompts});

        // console.log("DEBUG questions used by story browser", questions);
               
        var questions = [].concat(leadingStoryQuestions, storyQuestions);
        questions.push({id: "__survey_" + "participantData", displayName: "participantData", displayPrompt: "---- participant data below ----", displayType: "header", dataOptions:[]});
        
        // TODO: add more participant and survey info, like timestamps and participant ID
        
        var itemPanelSpecification = {
             id: "storyBrowserQuestions",
             panelFields: questions,
             buildPanel: function (panelBuilder, contentPane, model) {
                 var participantID = model.get("_participantID");
                 var participantData = surveyCollection.getParticipantDataForParticipantID(participantID);
                 var participantDataModel = new Stateful(participantData);
                 
                 /*
                 panelBuilder.buildFields(questions, contentPane, model);
                 // TODO: Load correct participant data
                 
                 panelBuilder.buildFields(questionnaire.participantQuestions, contentPane, participantDataModel);
                 */
                 
                 // Encode all user-supplied text to ensure it does not create HTML issues
                 var storyName = entities.encode(model.get("__survey_storyName"));
                 var storyText = entities.encode(model.get("__survey_storyText"));
                 var otherFields = "";
                 
                 for (var i = 0; i < storyQuestions.length; i++) {
                     var storyQuestion = storyQuestions[i];
                     // otherFields[storyQuestion.shortName] = model.get(storyQuestion.id);
                     if (!model.get(storyQuestion.id)) continue;
                     otherFields += storyQuestion.shortName + ": " + JSON.stringify(model.get(storyQuestion.id)) + "<br>";
                 }
                 for (i = 0; i < participantQuestions.length; i++) {
                     var participantQuestion = participantQuestions[i];
                     // otherFields[participantQuestion.shortName] = model.get(participantQuestion.id);
                     if (!participantDataModel.get(participantQuestion.id)) continue;
                     otherFields += participantQuestion.shortName + ": " + JSON.stringify(participantDataModel.get(participantQuestion.id)) + "<br>";
                 }
                 
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
                 var storyThemesStore = new MemoryDstore({data: storyThemes, idProperty: "id"});
                 
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
                 
                 var addThemeButton = widgetSupport.newButton(pagePane, "#button_addTheme|Add theme", function () {
                     console.log("Button pressed", themeList, storyThemes, storyThemesStore);
                     var themeText = themeEntryComboBox.get("value");
                     console.log("themeText", themeText);
                     if (!themeText) return;
                     themeEntryComboBox.set("value", "");
                     var existingTheme = null;
                     for (var i = 0; i < allThemes.length; i++) {
                         if (allThemes[i].name === themeText) {
                             existingTheme = allThemes[i];
                             break;
                         }
                     }
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
                     // Check if theme already in list of added theme, and if so, delete it and add it again at the bottom
                     for (var j = 0; j < storyThemes.length; j++) {
                         if (storyThemes[j].name === existingTheme.name) {
                             // storyThemes.splice(j, 1); 
                             storyThemesStore.remove(storyThemes[j].id);
                             break;
                         }
                     }
                     storyThemesStore.add(existingTheme);
                 });
                 
                 addThemeButton.placeAt(themesPane);
             }
        };

        var stories = surveyCollection.allStories;

        // Store will modify underlying array
        var dataStore = new MemoryDstore({
            data: stories,
            idProperty: "_storyID"
        });
        
        // Only allow view button for stories
        var configuration = {viewButton: true, navigationButtons: true, includeAllFields: ["__survey_storyName", "__survey_storyText"]};
        var storyList = new GridWithItemPanel(panelBuilder, pagePane, id, dataStore, itemPanelSpecification, configuration);
        storyList.grid.set("selectionMode", "single");
        
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