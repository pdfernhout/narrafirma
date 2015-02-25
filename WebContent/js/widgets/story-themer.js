define([
    "dojo/_base/array",
    "dojo/_base/connect",
    "js/domain",
    "dojo/dom-construct",
    'dojox/html/entities',
    "dojox/uuid/generateRandomUuid",
    "dojo/_base/lang",
    "dojo/query",
    "js/translate",
    "js/utility",
    "js/widgetBuilder",
    "./grid-table",
    "./widgetSupport",
    "dojo/_base/window",
    "dijit/form/ComboBox",
    "dijit/layout/ContentPane",
    "dgrid/List",
    "dojo/store/Memory",
    "dstore/Memory",
    "dijit/form/MultiSelect",
    "dijit/form/Select",
    "dojo/Stateful",
    "dojox/layout/TableContainer",
], function(
    array,
    connect,
    domain,
    domConstruct,
    entities,
    generateRandomUuid,
    lang,
    query,
    translate,
    utility,
    widgetBuilder,
    widgetGridTable,
    widgetSupport,
    win,
    ComboBox,
    ContentPane,
    List,
    Memory,
    MemoryDstore,
    MultiSelect,
    Select,
    Stateful,
    TableContainer
){
    "use strict";
    
    // story themer support
    
    // TODO: Fix so the filters get updated as the story questions get changed
    function insertStoryThemer(pagePane, model, id, pageDefinitions) {
        console.log("insertStoryThemer start", id);
        
        // TODO: Fix this show also handles participant questions somehow
        var questionnaire = domain.getCurrentQuestionnaire();
        var storyQuestions = questionnaire.storyQuestions;
        var participantQuestions = questionnaire.participantQuestions;
        
        // TODO: What about idea of having IDs that go with eliciting questions so store reference to ID not text prompt?
        var elicitingQuestionPrompts = [];
        for (var elicitingQuestionIndex in questionnaire.elicitingQuestions) {
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
             buildPage: function (builder, contentPane, model) {
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
                 
                 var themeListPane = new ContentPane();
                 themeListPane.placeAt(themesPane);
                 
                 var allThemes = [];
                 var itemStore = new Memory({
                     data: allThemes
                 });
                 
                 var itemEntryComboBox = new ComboBox({
                     store: itemStore,
                     style: {width: "50%"}
                 });
                 itemEntryComboBox.placeAt(themesPane);
                 
                 var addThemeButton = utility.newButton(id + "_addThemeButton", "button_addTheme", pagePane, function () {
                     console.log("Button pressed");
                     var themeText = itemEntryComboBox.get("value");
                     // TODO: Unfinished
                     console.log("themeText", themeText);
                     if (!themeText) return;
                     itemEntryComboBox.set("value", "");
                     var existingTheme = false;
                     for (var i = 0; i < allThemes.length; i++) {
                         if (allThemes[i].name === themeText) {
                             existingTheme = true;
                             break;
                         }
                     }
                     if (!existingTheme) {
                         var uuid = generateRandomUuid();
                         allThemes.push({id: uuid, name: themeText});
                     }
                     // TODO: Check if theme already in list of added theme, and if so, put it at the bottom
                     var themeTextContentPane = new ContentPane({content: "<b>" + themeText + "<b>"});
                     themeTextContentPane.placeAt(themeListPane);
                     
                     console.log("themeTextContentPane", themeTextContentPane);
                     
                     var newSpan = domConstruct.create("span",{
                         "class" : "closeText",
                         title : "close",
                         innerHTML : "x",
                         style: "padding-left:10px; color: red"
                     });
                     
                     console.log("newSpan", newSpan);
                     
                     domConstruct.place(newSpan, themeTextContentPane.domNode, "last");
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
        var storyList = widgetGridTable.insertGridTableBasic(pagePane, id, dataStore, popupPageDefinition, configuration);
        storyList.grid.set("selectionMode", "single");
        
        console.log("insertStoryThemer finished");
    }
    
    return {
        "insertStoryThemer": insertStoryThemer
    };
    
});