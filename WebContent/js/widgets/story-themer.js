define([
    "dojo/_base/array",
    "dojo/_base/connect",
    "js/domain",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "dojo/query",
    "js/translate",
    "js/utility",
    "js/widgetBuilder",
    "./grid-table",
    "./widgetSupport",
    "dojo/_base/window",
    "dijit/layout/ContentPane",
    "dojo/store/Memory",
    "dijit/form/MultiSelect",
    "dijit/form/Select",
    "dojo/Stateful",
    "dojox/layout/TableContainer",
], function(
    array,
    connect,
    domain,
    domConstruct,
    lang,
    query,
    translate,
    utility,
    widgetBuilder,
    widgetGridTable,
    widgetSupport,
    win,
    ContentPane,
    Memory,
    MultiSelect,
    Select,
    Stateful,
    TableContainer
){
    "use strict";
    
    // story browser support
    
    function setOptionsInMultiSelect(widget, options) {
        // console.log("setOptionsInMultiSelect", widget, options);
        query('option', widget.domNode).forEach(function(node, index, arr) {
            // console.log("node", node);
            domConstruct.destroy(node);
        }); 
        
        for (var i in options){
            var c = win.doc.createElement('option');
            c.innerHTML = options[i].label;
            c.value = options[i].value;
            widget.domNode.appendChild(c);
        }
        // console.log("done");
    }
    
    function newMultiSelect(id, options) {
        var widget = new MultiSelect({
            "id": id + "answers1",
            "size": 12,
            "style": "width: 100%;"
            //"options": options
        });
        
        setOptionsInMultiSelect(widget, options);
        
        // selectWidget.on("change", mainSelectChanged);
        
        return widget;
    }
    
    function storiesChanged(storyBrowser, stories) {
        // TODO
    }
    
    function questionsChanged(storyBrowser, questions) {
        // TODO
    }
    
    // TODO: Fix so the filters get updated as the story questions get changed
    function insertStoryThemer(pagePane, model, id, pageDefinitions) {
        console.log("insertStoryThemer start", id);
        
        // TODO: Fix this show also handles participant questions somehow
        var questionnaire = domain.getCurrentQuestionnaire();
        var storyQuestions = questionnaire.storyQuestions;
        
        // TODO: What about idea of having IDs that go with eliciting questions so store reference to ID not text prompt?
        var elicitingQuestionPrompts = [];
        for (var elicitingQuestionIndex in questionnaire.elicitingQuestions) {
            var elicitingQuestionSpecification = questionnaire.elicitingQuestions[elicitingQuestionIndex];
            elicitingQuestionPrompts.push(elicitingQuestionSpecification.text);
        }
        
        // TODO: Remove redundancy
        var leadingStoryQuestions = [];
        leadingStoryQuestions.unshift({id: "__survey_" + "storyName", shortName: "storyName", prompt: "Please give your story a name", type: "text", options:[]});
        leadingStoryQuestions.unshift({id: "__survey_" + "storyText", shortName: "storyText", prompt: "Please enter your response to the question above in the space below", type: "textarea", options:[]});
        leadingStoryQuestions.unshift({id: "__survey_" + "elicitingQuestion", shortName: "elicitingQuestion", prompt: "Please choose a question you would like to respond to", type: "select", options: elicitingQuestionPrompts});

        // console.log("DEBUG questions used by story browser", questions);
               
        var questions = [].concat(leadingStoryQuestions, storyQuestions);
        questions.push({id: "__survey_" + "participantData", shortName: "participantData", prompt: "---- participant data below ----", type: "header", options:[]});
        translate.addExtraTranslationsForQuestions(questions);
        
        translate.addExtraTranslationsForQuestions(questionnaire.participantQuestions);
        
        // TODO: add more participant and survey info, like timestamps and participant ID
        
        var popupPageDefinition = {
             "id": "storyBrowserQuestions",
             "questions": questions,
             buildPage: function (builder, contentPane, model) {
                 widgetBuilder.addQuestions(questions, contentPane, model);
                 // TODO: Load correct participant data
                 
                 var participantID = model.get("_participantID");
                 var participantData = domain.getParticipantDataForParticipantID(participantID);
                 var participantDataModel = new Stateful(participantData);
                 widgetBuilder.addQuestions(questionnaire.participantQuestions, contentPane, participantDataModel);
             }
        };

        var stories = domain.projectData.surveyResults.allStories;

        // Store will modify underlying array
        var dataStore = new Memory({
            data: stories,
            idProperty: "_storyID"
        });

        var table = new TableContainer({
            id: id + "_table",
            cols: 2,
            showLabels: false,
            customClass: "storyFilterTable",
            style: "width: 98%;",
            spacing: 10
        });

        // pagePane.containerNode.appendChild(domConstruct.toDom('<br>'));
        
        // table needs to be added to container after its children are added to it so that the layout will happen correctly, otherwise startup called too soon internally
        if (!pagePane.addChild) {
            alert("TROUBLE -- see log for details");
            console.log("TROUBLE -- does not have addChild method!", pagePane);
            pagePane.containerNode.appendChild(table.domNode);
        } else {
            pagePane.addChild(table);
        }
        
        var storyList;
        
        // Only allow view button for stories
        var configuration = {viewButton: true, includeAllFields: true};
        storyList = widgetGridTable.insertGridTableBasic(pagePane, id, dataStore, popupPageDefinition, configuration);
        
        console.log("insertStoryThemer finished");
    }
    
    return {
        "insertStoryThemer": insertStoryThemer
    };
    
});