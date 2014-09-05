"use strict";

define([
    "dojo/_base/array",
    "dojo/_base/connect",
    "narracoach/domain",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/_base/lang",
    "dojo/query",
    "narracoach/question_editor",
    "dijit/registry",
    "dojo/string",
    "narracoach/widgets",
    "narracoach/widget-grid-table",
    "dojo/_base/window",
    "dijit/layout/ContentPane",
    "dojo/store/Memory",
    "dijit/form/MultiSelect",
    "dijit/form/Select",
    "dojox/layout/TableContainer",
    "dojo/domReady!"
], function(
    array,
    connect,
    domain,
    domConstruct,
    domStyle,
    lang,
    query,
    questionEditor,
    registry,
    string,
    widgets,
    widgetGridTable,
    win,
    ContentPane,
    Memory,
    MultiSelect,
    Select,
    TableContainer
){
    // story browser support
    
    function newSpecialSelect(id, options) {
        var theOptions = [];
        array.forEach(options, function(option) {
            //console.log("newSpecialSelect option", id, option);
            theOptions.push({label: option, value: option});
        });
        var select = new Select({
            id: id,
            options: theOptions,
            // TODO: Width should be determined from content using font metrics across all dropdowns
            width: "150px"
        });
        return select;
    }
    
    function setOptionsInMultiSelect(widget, options) {
        console.log("setOptionsInMultiSelect", widget, options);
        query('option', widget.domNode).forEach(function(node, index, arr) {
            console.log("node", node);
            domConstruct.destroy(node);
        }); 
        
        for (var i in options){
            var c = win.doc.createElement('option');
            c.innerHTML = options[i].label;
            c.value = options[i].value;
            widget.domNode.appendChild(c);
        }
        console.log("done");
    }
    
    function newMultiSelect(id, options) {
        var widget = new MultiSelect({
            "id": id + "answers1",
            //"options": options
        });
        
        setOptionsInMultiSelect(widget, options);
        
        // selectWidget.on("change", mainSelectChanged);
        
        return widget;
    }
    
    function questionChanged(questionsById, multiSelect, newValue) {
        console.log("event", newValue);
        var question = questionsById[newValue];
        var options = optionsFromQuestion(question);
        setOptionsInMultiSelect(multiSelect, options);
    }
    
    function optionsFromQuestion(question) {
        var options = [];
        if (question.type === "select") {
            console.log("select", question, question.options);
            array.forEach(question.options.split("\n"), function(each) {
                // console.log("option", id, each);
                options.push({label: each, value: each});
            });
            //lang.extend(result, question.options);
        } else {
            options.push({"label": "a", "value": "b"});
            options.push({"label": "c", "value": "d"});
        }
        return options;
    }
    
    function insertStoryBrowser(pseudoQuestion, pagePane, pageDefinitions) {
        console.log("insertStoryBrowser", pseudoQuestion);

        var label = widgets.newLabel(pseudoQuestion.id + "label", pseudoQuestion.text, pagePane.domNode);

        var unfinished = widgets.newLabel(pseudoQuestion.id + "unfinished", "<b>UNFINISHED</b>", pagePane.domNode);

        // TODO: do something here
        
        var popupPageDefinition = {
             "id": "testDogQuestions",
             "questions": domain.testDogQuestions   
        };
        
        var dataStore = new Memory({
            // data: [],
            data: domain.testDogStories,
            // TODO: what should this be, if anything?
            // idProperty: "name",
        }); 
        
        var questionOptions = [];
        var questionsById = {};
        array.forEach(popupPageDefinition.questions, function (question) {
            questionOptions.push({label: question.text, value: question.id});
            questionsById[question.id] = question;
        });
        
        var question1 = widgets.newSelect(pseudoQuestion.id + "questions1", questionOptions, null);
        pagePane.addChild(registry.byId(pseudoQuestion.id + "questions1"));
        
        pagePane.domNode.appendChild(domConstruct.toDom('<br>'));
        
        var answers1 = newMultiSelect(pseudoQuestion.id + "answer1", []);
        pagePane.addChild(answers1);
        answers1.startup();

        registry.byId(pseudoQuestion.id + "questions1").on("change", lang.partial(questionChanged, questionsById, answers1));
        
        // var question2  = widgets.newSelect(pseudoQuestion.id + "questions2", questionOptions, null);
        // pagePane.addChild(registry.byId(pseudoQuestion.id + "questions2"));
            
        var storyList = widgetGridTable.insertGridTableBasic(pseudoQuestion.id + "grid", pagePane, popupPageDefinition, dataStore, true);
        
        // First choice
        // Second choice
        // List of results
        // Actual selected story
        
        console.log("insertStoryBrowser finished");
    }
    
    return {
        "insertStoryBrowser": insertStoryBrowser
    };
    
});