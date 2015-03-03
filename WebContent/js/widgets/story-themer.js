define([
    "js/domain",
    'dojox/html/entities',
    "dojox/uuid/generateRandomUuid",
    "js/translate",
    "js/utility",
    "./grid-table",
    "dijit/form/ComboBox",
    "dijit/layout/ContentPane",
    "dojo/store/Memory",
    "dstore/Memory",
    "dojo/Stateful"
], function(
    domain,
    entities,
    generateRandomUuid,
    translate,
    utility,
    widgetGridTable,
    ComboBox,
    ContentPane,
    Memory,
    MemoryDstore,
    Stateful){
    "use strict";
    
    // story themer support
    
    // TODO: Fix so the filters get updated as the story questions get changed
    function insertStoryThemer(widgetBuilder, pagePane, model, id, pageDefinitions) {
        console.log("insertStoryThemer start", id);
        
        // TODO: Fix this show also handles participant questions somehow
        var questionnaire = domain.getCurrentQuestionnaire();
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
        leadingStoryQuestions.unshift({id: "__survey_storyName", shortName: "storyName", prompt: "Please give your story a name", type: "text", options:[]});
        leadingStoryQuestions.unshift({id: "__survey_storyText", shortName: "storyText", prompt: "Please enter your response to the question above in the space below", type: "textarea", options:[]});
        leadingStoryQuestions.unshift({id: "__survey_elicitingQuestion", shortName: "elicitingQuestion", prompt: "Please choose a question you would like to respond to", type: "select", options: elicitingQuestionPrompts});

        // console.log("DEBUG questions used by story browser", questions);
               
        var questions = [].concat(leadingStoryQuestions, storyQuestions);
        questions.push({id: "__survey_" + "participantData", shortName: "participantData", prompt: "---- participant data below ----", type: "header", options:[]});
        translate.addExtraTranslationsForQuestions(questions);
        
        translate.addExtraTranslationsForQuestions(participantQuestions);
        
        // TODO: add more participant and survey info, like timestamps and participant ID
        
        var popupPageDefinition = {
             "id": "storyBrowserQuestions",
             "questions": questions,
             buildPanel: function (widgetBuilder, contentPane, model) {
                 var participantID = model.get("_participantID");
                 var participantData = domain.getParticipantDataForParticipantID(participantID);
                 var participantDataModel = new Stateful(participantData);
                 
                 /*
                 widgetBuilder.addQuestions(questions, contentPane, model);
                 // TODO: Load correct participant data
                 
                 widgetBuilder.addQuestions(questionnaire.participantQuestions, contentPane, participantDataModel);
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
                 var popupPageDefinition2 = {
                     "id": "storyThemeQuestions",
                     questions: [
                         {id: "name", shortName: "Theme", prompt: "Theme", type: "text", options:[]}
                     ]
                 };
                 var themeList = widgetGridTable.insertGridTableBasic(widgetBuilder, themesPane, "storyThemeList", storyThemesStore, popupPageDefinition2, configuration2);
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
                 
                 var addThemeButton = utility.newButton(id + "_addThemeButton", "button_addTheme", pagePane, function () {
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

        var stories = domain.projectData.surveyResults.allStories;

        // Store will modify underlying array
        var dataStore = new MemoryDstore({
            data: stories,
            idProperty: "_storyID"
        });
        
        // Only allow view button for stories
        var configuration = {viewButton: true, navigationButtons: true, includeAllFields: ["__survey_storyName", "__survey_storyText"]};
        var storyList = widgetGridTable.insertGridTableBasic(widgetBuilder, pagePane, id, dataStore, popupPageDefinition, configuration);
        storyList.grid.set("selectionMode", "single");
        
        console.log("insertStoryThemer finished");
    }
    
    return {
        "insertStoryThemer": insertStoryThemer
    };
    
});