"use strict";

define([
    "dojo/_base/array",
    "dojo/_base/connect",
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
    
    // Temporary test data
    var testDogQuestions = [
        {id: "name", type: "text", text: "Name | Your Name", help: 'Please enter your \'full\' name, like "John Smith".'},
        {id: "ownDog", type: "boolean", text: "Owner? | Do you currently have a dog?", help: "Enter yes or no"},
        {id: "broughtHome", type: "textarea", text: "Story | What happened when you first brought your dog home?"},
        {id: "broughtHomeTitle", type: "text", text: "Title | What is a good title for your story?"},
        {id: "feeling1", type: "slider", text: "Day Feeling | How good did you feel the day you brought your dog home?"},
        {id: "feeling2", type: "slider", text: "Next Day Feeling| How good did you feel the day after you brought your dog home?"},
        {id: "feeling3", type: "slider", text: "Now Feeling | How good do you feel right now?"},
        {id: "feeling4", type: "select", text: "Now Spouse Feeling | How good does your spouse feel right now?", options: "low\nmedium\nhigh"},
    ];
    
    array.forEach(testDogQuestions, function (question) {
        var split = question.text.split("|");
        question.text = string.trim(split[1]);
        question.shortText = string.trim(split[0]);
    });
    
    var testDogStories = [];
    
    var lorumText = ": Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, " +
    "totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. " +
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores " +
    "eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur," +
    " adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem." +
    " Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?" +
    " Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum " +
    "fugiat quo voluptas nulla pariatur?";
    
    console.log("making test dog stories");
    for (var i = 0; i < 100; i++) {
        var newStory = {
            id: i,
            name: "name " + i,
            ownDog: true,
            broughtHome: "Story " + i + lorumText,
            broughtHomeTitle: "Brought Home Title " + i,
            feeling1: i % 100,
            feeling2: i % 100,
            feeling3: i % 100,
            feeling4: ["low", "medium", "high"][i % 3]
        };
        testDogStories.push(newStory);
    }
    
    // console.log("testDogStories", testDogStories);
   
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
             "questions": testDogQuestions   
        };
        
        var dataStore = new Memory({
            // data: [],
            data: testDogStories,
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