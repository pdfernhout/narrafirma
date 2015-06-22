import storyCardDisplay = require("../storyCardDisplay");
import surveyCollection = require("../surveyCollection");
import widgetSupport = require("../panelBuilder/widgetSupport");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import gridWithItemPanelInMithril = require("../panelBuilder/gridWithItemPanelInMithril");

"use strict";

/*
// story browser support

// TODO: Probably should make this a class

function filterPaneQuestionChoiceChanged(filterPane, newValue) {
    // console.log("event", newValue);
    var question = null;
    
    var questions = filterPane.storyBrowserInstance.questions;
    for (var index = 0; index < questions.length; index++) {
        var questionToCheck = questions[index];
        if (questionToCheck.id === newValue) {
            question = questionToCheck;
            break;
        }
    }
    
    if (!question) {
        if (newValue) console.log("could not find question for id", newValue);
        widgetSupport.setOptionsInMultiSelect(filterPane.answersMultiSelect, []);
        return;
    }
    
    //console.log("question", question);
    
    var stories = filterPane.storyBrowserInstance.dataStore.data;
    var options = optionsFromQuestion(question, stories);
    widgetSupport.setOptionsInMultiSelect(filterPane.answersMultiSelect, options);
    setStoryListForCurrentFilters(filterPane.storyBrowserInstance);
}

// TODO: Translate
var unansweredIndicator = "{Unanswered}";
    
function optionsFromQuestion(question, stories) {
    // console.log("*** optionsFromQuestion", question, stories);
    // TODO: Translate text for options, at least booleans?
    var options = [];
    
    if (!question) return options;
    
    // Compute how many of each answer -- assumes typically less than 200-1000 stories
    var totals = {};
    stories.forEach(function(item) {
        // console.log("optionsFromQuestion item", item, question.id, item[question.id]);
        var choice = item[question.id];
        if (choice === undefined || choice === null || choice === "") {
            // Do not include "0" as unanswered
            // console.log("&&&& Undefined or empty choice", choice);
            choice = unansweredIndicator;
        }
        var oldValue;
        if (question.displayType === "checkboxes") {
            for (var key in choice) {
                oldValue = totals[key];
                if (!oldValue) oldValue = 0;
                if (choice[key]) totals[key] = oldValue + 1; 
            }
        } else {
            oldValue = totals[choice];
            if (!oldValue) oldValue = 0;
            totals[choice] = oldValue + 1;
        }
    });
    
    var count;
    
    // TODO: Maybe should not add the unanswered indicator if zero?
    // Always add the unanswered indicator if not checkboxes or checkbox
    if (question.displayType !== "checkbox" && question.displayType !== "checkboxes") {
        count = totals[unansweredIndicator];
        if (!count) count = 0;
        options.push({label: unansweredIndicator + " (" +  count + ")", value: unansweredIndicator});
    }
    
    if (question.displayType === "select") {
        // console.log("select", question, question.valueOptions);
        question.valueOptions.forEach(function(each) {
            // console.log("option", question.id, each);
            count = totals[each];
            if (!count) count = 0;
            options.push({label: each + " (" +  count + ")", value: each});
        });
    } else if (question.displayType === "radiobuttons") {
        // console.log("radiobuttons", question, question.valueOptions);
        question.valueOptions.forEach(function(each) {
            // console.log("option", question.id, each);
            count = totals[each];
            if (!count) count = 0;
            options.push({label: each + " (" +  count + ")", value: each});
        });
    } else if (question.displayType === "checkboxes") {
        // console.log("checkboxes", question, question.valueOptions);
        question.valueOptions.forEach(function(each) {
            // console.log("option", question.id, each);
            count = totals[each];
            if (!count) count = 0;
            options.push({label: each + " (" +  count + ")", value: each});
        });
    } else if (question.displayType === "slider") {
        // console.log("slider", question, question.displayConfiguration);
        for (var sliderTick = 0; sliderTick <= 100; sliderTick++) {
            count = totals[sliderTick];
            if (!count) count = 0;
            options.push({label: sliderTick + " (" +  count + ")", value: sliderTick});
        }
    } else if (question.displayType === "boolean") {
        // console.log("boolean", question);
        // TODO; Not sure this will really be right with true/false as booleans instead of strings
        ["yes", "no"].forEach(function(each) {
            // console.log("option", id, each);
            count = totals[each];
            if (!count) count = 0;
            options.push({label: each + " (" +  count + ")", value: each});
        });
    } else if (question.displayType === "checkbox") {
        // console.log("checkbox", question);
        // TODO; Not sure this will really be right with true/false as checkbox instead of strings
        [true, false].forEach(function(each) {
            // console.log("option", id, each);
            count = totals["" + each];
            if (!count) count = 0;
            options.push({label: each + " (" +  count + ")", value: each});
        });
    } else if (question.displayType === "text") {
        for (var eachTotal in totals){
            if (totals.hasOwnProperty(eachTotal)) {
                count = totals[eachTotal];
                if (!count) count = 0;
                options.push({label: eachTotal + " (" +  count + ")", value: eachTotal});                    
            }
        }
    } else {
        console.log("ERROR: question type not supported: ", question.displayType, question);
        options.push({label: "*ALL*" + " (" +  stories.length + ")", value: "*ALL*"});
    }
    return options;
}

function clearFilterPane(storyBrowserInstance, filterPane) {
    filterPane.questionSelect.set("value", null);
    setStoryListForCurrentFilters(storyBrowserInstance);
}

function createFilterPane(storyBrowserInstance, id, questions, stories, containerPane) {
    var contentPane = new ContentPane();
    
    containerPane.addChild(contentPane);

    var filterPane = {};
        
    // TODO: Translate
    contentPane.containerNode.appendChild(domConstruct.toDom('Filter by: '));
    
    var questionSelect = widgetSupport.newSelect(contentPane, []);
    // questionSelect.set("style", "width: 98%; max-width: 98%");
    // questionSelect.set("style", "min-width: 50%");
    
    // TODO: Translate
    var clearButton = widgetSupport.newButton(contentPane, "Clear", clearFilterPane.bind(null, storyBrowserInstance, filterPane));
    // domStyle.set(clearButton.domNode, "float", "right");
    
    contentPane.containerNode.appendChild(domConstruct.toDom('<br>'));
    
    var answersMultiSelect = widgetSupport.newMultiSelect([]);
    contentPane.addChild(answersMultiSelect);
    
    var filterPane2 = {
        contentPane: contentPane,
        questionSelect: questionSelect,
        answersMultiSelect: answersMultiSelect,
        storyBrowserInstance: storyBrowserInstance
    };

    for (var key in filterPane2) filterPane[key] = filterPane2[key];
    
    questionSelect.on("change", filterPaneQuestionChoiceChanged.bind(null, filterPane));
    answersMultiSelect.on("change", setStoryListForCurrentFilters.bind(null, storyBrowserInstance)); 
    
    return filterPane;
}

function isMatch(story, questionChoice, selectedAnswerChoices) {
    // console.log("isMatch", questionChoice, selectedAnswerChoices);
    if (!questionChoice) return true;
    var questionAnswer = story[questionChoice];
    if (questionAnswer === undefined || questionAnswer === null || questionAnswer === "") {
        questionAnswer = unansweredIndicator;
    } else if (typeof questionAnswer === "object") {
        // checkboxes
        // console.log("checkboxes", questionAnswer);
        for (var key in questionAnswer) {
            if ((selectedAnswerChoices.indexOf(key) !== -1) && questionAnswer[key]) return true;
        }
        return false;
    }
    questionAnswer = "" + questionAnswer;
    // console.log("questionAnswer", questionAnswer);
    return selectedAnswerChoices.indexOf(questionAnswer) !== -1;
}

function loadLatestStories(storyBrowserInstance, allStories) {
    // console.log("loadLatestStories", storyBrowserInstance, allStories);
    storyBrowserInstance.dataStore.setData(allStories);
    
    // Need to update choices in filters or clear them out
    filterPaneQuestionChoiceChanged(storyBrowserInstance.filter1, storyBrowserInstance.filter1.questionSelect.get("value"));
    filterPaneQuestionChoiceChanged(storyBrowserInstance.filter2, storyBrowserInstance.filter2.questionSelect.get("value"));
    
    setStoryListForCurrentFilters(storyBrowserInstance);
}

// TODO: Fix so the filters get updated as the story questions get changed
function insertStoryBrowser(panelBuilder: PanelBuilder, pagePane, model, fieldSpecification) {
    var id = fieldSpecification.id;
    console.log("insertStoryBrowser start", id);
    
    var questions = [];

    var stories = [];
    
    // Store will modify underlying array
    var dataStore = GridWithItemPanel["newMemoryTrackableStore"](stories, "_storyID");
    
    // console.log("insertStoryBrowser middle 1", id);
    
    var table = new TableContainer({
        cols: 2,
        showLabels: false,
        customClass: "storyFilterTable",
        spacing: 2
    });
    
    // console.log("insertStoryBrowser middle 2", id);
    
 // TODO: Probably should become a class
    var storyBrowserInstance = {
        dataStore: dataStore,
        filter1: null,
        filter2: null,
        storyList: null,
        questions: questions,
        currentQuestionnaire: null
    };
    
&&    // Get questionnaire for selected story collection
&&    // TODO: What if the value is an array of stories to display directly?
&&    var choiceModelAndField = valuePathResolver.resolveModelAndFieldForFieldSpecification(panelBuilder, model, fieldSpecification);
&&    console.log("choiceModelAndField", choiceModelAndField);
&&    var choiceModel = choiceModelAndField.model;
&&    var choiceField = choiceModelAndField.field; 
&&    var storyCollectionIdentifier = choiceModel.get(choiceField);
    
&&    var itemPanelSpecification = makeItemPanelSpecificationForQuestions(storyBrowserInstance, questions);
    
    storyBrowserInstance.filter1 = createFilterPane(storyBrowserInstance, id + "_1", questions, stories, table);
    storyBrowserInstance.filter2 = createFilterPane(storyBrowserInstance, id + "_2", questions, stories, table);

    // pagePane.containerNode.appendChild(domConstruct.toDom('<br>'));
    
    // table needs to be added to container after its children are added to it
    // so that the layout will happen correctly, otherwise startup called too soon internally
    pagePane.addChild(table);
    
    // TODO: Probably should become a class
    
    // var filterButton = widgetSupport.newButton(pagePane, "#button_Filter|Filter", setStoryListForCurrentFilters.bind(null, storyBrowserInstance));
    
    // console.log("insertStoryBrowser middle 3", id);
    
    // Only allow view button for stories
    var configuration = {viewButton: true, includeAllFields: ["__survey_storyName", "__survey_storyText"], navigationButtons: true};
    storyBrowserInstance.storyList = new GridWithItemPanel(panelBuilder, pagePane, id, dataStore, itemPanelSpecification, configuration, model);
    
    // TODO: Track new incoming stories
    
    // TODO: Should also have some subscription about when the questionnaire itself changes
    var currentQuestionnaireSubscription = choiceModel.watch(choiceField, currentStoryCollectionChanged.bind(null, storyBrowserInstance));
    
    // TODO: Kludge to get this other previous created widget to destroy a subscription when the page is destroyed...
    table.own(currentQuestionnaireSubscription);
    
    // console.log("filterButton", filterButton);
    
    // Setup current values
    currentStoryCollectionChanged(storyBrowserInstance, null, null, storyCollectionIdentifier);

    console.log("insertStoryBrowser finished");

    return storyBrowserInstance;
}

// TODO: The best argument for short variable names might be that "code is poetry", in that it is only suggestive of intent not precisely complete. Thinking about that as code seems just lots and lots and so on...

function setStoryListForCurrentFilters(storyBrowserInstance) {
    // console.log("filter pressed", storyBrowserInstance);
    var question1Choice = storyBrowserInstance.filter1.questionSelect.get("value");
    var answers1Choices = storyBrowserInstance.filter1.answersMultiSelect.get("value");
    // console.log("question1", question1Choice, "answers1", answers1Choices);
    var question2Choice = storyBrowserInstance.filter2.questionSelect.get("value");
    var answers2Choices = storyBrowserInstance.filter2.answersMultiSelect.get("value");
    // console.log("question2", question2Choice, "answers2", answers2Choices);  
    var filterFunction = function (item) {
        var match1 = isMatch(item, question1Choice, answers1Choices);
        var match2 = isMatch(item, question2Choice, answers2Choices);
        return match1 && match2;
    };
    var filteredResults = storyBrowserInstance.dataStore.filter(filterFunction);
    console.log("Filtered results", filteredResults);
    // var newStore = GridWithItemPanel["newMemoryTrackableStore"](filteredResults.data, "_storyID");
    storyBrowserInstance.storyList.dataStoreChanged(filteredResults);
    // console.log("finished setting list with newStore", newStore);
}

*/

function currentStoryCollectionChanged(storyBrowserInstance, storyCollectionIdentifier) {
    console.log("currentStoryCollectionChanged", storyBrowserInstance, storyCollectionIdentifier);
    
    storyBrowserInstance.currentQuestionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);
    // console.log("storyBrowserInstance.currentQuestionnaire", storyBrowserInstance.currentQuestionnaire);
    
    // Update filters
    var questions = surveyCollection.collectQuestionsForQuestionnaire(storyBrowserInstance.currentQuestionnaire);
    storyBrowserInstance.questions = questions;
    // console.log("currentStoryCollectionChanged", questions);
    
    var choices = surveyCollection.optionsForAllQuestions(questions);
    storyBrowserInstance.choices = choices;
    
    // update all stories for the specific collection
    var allStories = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier);
    // console.log("allStories", allStories);
    storyBrowserInstance.stories = allStories;
    
    var itemPanelSpecification = makeItemPanelSpecificationForQuestions(storyBrowserInstance, questions);
    storyBrowserInstance.itemPanelSpecification = itemPanelSpecification;
    
    /*
    widgetSupport.updateSelectChoices(storyBrowserInstance.filter1.questionSelect, choices);
    widgetSupport.updateSelectChoices(storyBrowserInstance.filter2.questionSelect, choices);
    
    // TODO: What to do about current selection in these widgets?
    
    // Update item panel in grid
    storyBrowserInstance.storyList.changeItemPanelSpecification(itemPanelSpecification);
    
    loadLatestStories(storyBrowserInstance, allStories);
    
    // TODO: Should close up open grid view
    */
}

function buildStoryDisplayPanel(storyBrowserInstance, panelBuilder, model) {
    var storyContent = storyCardDisplay.generateStoryCardContent(model, storyBrowserInstance.currentQuestionnaire, "includeElicitingQuestion");
    
    return m("div[class=storyCard]", m.trust(storyContent));
}

function makeItemPanelSpecificationForQuestions(storyBrowserInstance, questions) {
    // TODO: add more participant and survey info, like timestamps and participant ID
    
    var itemPanelSpecification = {
         id: "storyBrowserQuestions",
         panelFields: questions,
         buildPanel: buildStoryDisplayPanel.bind(null, storyBrowserInstance)
    };
    
    return itemPanelSpecification;
}

function getCurrentStoryCollectionIdentifier(args) {
    var panelBuilder = args.panelBuilder;
    var model = args.model;
    var fieldSpecification = args.fieldSpecification;
    
    // Get questionnaire for selected story collection
    // TODO: What if the value is an array of stories to display directly?
    var choiceModelAndField = valuePathResolver.resolveModelAndFieldForFieldSpecification(panelBuilder, model, fieldSpecification);
    console.log("choiceModelAndField", choiceModelAndField);
    var choiceModel = choiceModelAndField.model;
    var choiceField = choiceModelAndField.field; 
    var storyCollectionIdentifier = choiceModel[choiceField];
    
    return storyCollectionIdentifier;
}

var StoryBrowser = {
    controller: function(args) {
        this.storyCollectionIdentifier = null;
        this.currentQuestionnaire = null;
        this.questions = null;
        this.choices = null;
        this.stories = null;
        this.itemPanelSpecification = null;
    },
    
    view: function(controller, args) {
        console.log("StoryBrowser view");
        var panelBuilder = args.panelBuilder;
        
        // TODO: Probably need to handle tracking if list changed so can keep sorted list...
        controller.storyCollectionIdentifier = getCurrentStoryCollectionIdentifier(args);
        console.log("storyCollectionIdentifier", controller.storyCollectionIdentifier);
        
        if (!controller.storyCollectionIdentifier) {
            return m("div", "Please select a story collection to view");
        }
        
        currentStoryCollectionChanged(controller, controller.storyCollectionIdentifier);
        
        var prompt = args.panelBuilder.buildQuestionLabel(args.fieldSpecification);
        
        var rest = m("div", "story browser unfinished");

        var configuration = {
            idProperty: "_storyID",
            itemPanelSpecification: controller.itemPanelSpecification,
            viewButton: true,
            includeAllFields: ["__survey_storyName", "__survey_storyText"],
            navigationButtons: true
        }; 

        var gridFieldSpecification = {
            id: "stories",
            displayConfiguration: configuration
        };
        
        var grid = gridWithItemPanelInMithril.add_grid(panelBuilder, {stories: controller.stories}, gridFieldSpecification);
        
        var parts = [prompt, rest, grid];
        
        // TODO: set class etc.
        return m("div", {"class": "questionExternal narrafirma-question-type-questionAnswer"}, parts);
    }
};

function add_storyBrowser(panelBuilder: PanelBuilder, model, fieldSpecification) {
    return m.component(<any>StoryBrowser, {panelBuilder: panelBuilder, model: model, fieldSpecification: fieldSpecification});
    
    /*
    var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
    */
}

export = add_storyBrowser;
