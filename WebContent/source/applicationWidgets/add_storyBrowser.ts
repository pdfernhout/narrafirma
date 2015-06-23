import storyCardDisplay = require("../storyCardDisplay");
import surveyCollection = require("../surveyCollection");
import widgetSupport = require("../panelBuilder/widgetSupport");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import gridWithItemPanelInMithril = require("../panelBuilder/gridWithItemPanelInMithril");

"use strict";

// story browser support

// TODO: Probably should make this a class

function clearFilterPane(filterPane) {
    filterPane.selectedQuestion = null;
    filterPane.answerOptionsForSelectedQuestion = [];
    filterPane.selectedAnswers = {};
    setStoryListForCurrentFilters(filterPane.storyBrowser);
}

/*
function loadLatestStories(storyBrowserInstance, allStories) {
    // console.log("loadLatestStories", storyBrowserInstance, allStories);
    storyBrowserInstance.dataStore.setData(allStories);
    
    // Need to update choices in filters or clear them out
    filterPaneQuestionChoiceChanged(storyBrowserInstance.filter1, storyBrowserInstance.filter1.questionSelect.get("value"));
    filterPaneQuestionChoiceChanged(storyBrowserInstance.filter2, storyBrowserInstance.filter2.questionSelect.get("value"));
    
    setStoryListForCurrentFilters(storyBrowserInstance);
}
*/

function setStoryListForCurrentFilters(storyBrowserInstance) {
    // console.log("filter pressed", storyBrowserInstance);
    var question1Choice = storyBrowserInstance.filter1.selectedQuestion;
    var answers1Choices = storyBrowserInstance.filter1.selectedAnswers;
    console.log("question1", question1Choice, "answers1", answers1Choices);
    var question2Choice = storyBrowserInstance.filter2.selectedQuestion;
    var answers2Choices = storyBrowserInstance.filter2.selectedAnswers;
    console.log("question2", question2Choice, "answers2", answers2Choices);  
    var filterFunction = function (item) {
        var match1 = isMatch(item, question1Choice, answers1Choices);
        var match2 = isMatch(item, question2Choice, answers2Choices);
        return match1 && match2;
    };
    
    var filteredResults = storyBrowserInstance.stories.filter(filterFunction);
    
    console.log("Filtered results", filteredResults);
    // var newStore = GridWithItemPanel["newMemoryTrackableStore"](filteredResults.data, "_storyID");
    // TODO: storyBrowserInstance.storyList.dataStoreChanged(filteredResults);
    // console.log("finished setting list with newStore", newStore);
}

// TODO: Translate
var unansweredIndicator = "{Unanswered}";

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
        for (var eachTotal in totals) {
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

function filterPaneQuestionChoiceChanged(filterPane, event) {
    var newValue = event.target.value;
 
    var question = null;
    
    var questions = filterPane.storyBrowser.questions;
    for (var index = 0; index < questions.length; index++) {
        var questionToCheck = questions[index];
        if (questionToCheck.id === newValue) {
            question = questionToCheck;
            break;
        }
    }
    
    //console.log("filterPaneQuestionChoiceChanged", question);
    
    if (!question && newValue) console.log("could not find question for id", newValue);
    
    filterPane.selectedQuestion = question;
    filterPane.answerOptionsForSelectedQuestion = optionsFromQuestion(filterPane.selectedQuestion, filterPane.storyBrowser.stories);
    filterPane.selectedAnswers = {};
    
    setStoryListForCurrentFilters(filterPane.storyBrowser);  
}

// select.selectedOptions is probably not implemented widely enough, so use this code instead
function getSelectedOptions(select) {
    var selectedOptions = {};
    
    for (var i = 0; i < select.options.length; i++) {
        var option = select.options[i];
        
        if (option.selected) {
            selectedOptions[option.value] = option;
        }
    }
    
    return selectedOptions;
}

function filterPaneAnswerChoiceChanged(filterPane, event) {
    filterPane.selectedAnswers = getSelectedOptions(event.target);
    // console.log("selected options", filterPane.selectedAnswers, event.target.selectedOptions);
    
    setStoryListForCurrentFilters(filterPane.storyBrowser);
}

class Filter {
    storyBrowser = null;
    questions = [];
    selectedQuestion = null;
    answerOptionsForSelectedQuestion = [];
    selectedAnswers = {};
    
    constructor(storyBrowser, questions) {
        this.storyBrowser = storyBrowser;
        this.questions = questions;
    }
    
    static controller(args) {
        console.log("Making Filter: ", args.name);
        return new Filter(args.storyBrowser, args.questions);
    }
    
    static view(controller, args) {
        console.log("Filter view called");
        
        return controller.calculateView(args);
    }
        
    calculateView(args) {
        console.log("calculateView this", this);
        var choices = this.storyBrowser.choices || [];
        // console.log("^^^^^^^^^^^^ filter choices", choices);
        var selectOptions = choices.map((option) => {
            var optionOptions = {value: option.value, selected: undefined};
            if (this.selectedQuestion === option.value) optionOptions.selected = 'selected';
            return m("option", optionOptions, option.label);
        });
        
        var isNoSelection = (this.selectedQuestion === null) || undefined;
        selectOptions.unshift(m("option", {value: "", selected: isNoSelection}, "--- no filter ---"));
        
        var multiselectOptions = this.answerOptionsForSelectedQuestion.map((option) => {
            var optionOptions = {value: option.value, selected: undefined};
            if (this.selectedAnswers[option.value]) optionOptions.selected = 'selected';
            return m("option", optionOptions, option.label);
        });
        
        var isClearButtonDisabled = (this.selectedQuestion === null) || undefined;
         
        return m("div.filter", [
            args.name,
            m("br"),
            m("select", {onchange: filterPaneQuestionChoiceChanged.bind(null, this)}, selectOptions),
            m("button", {disabled: isClearButtonDisabled, onclick: clearFilterPane.bind(null, this)}, "Clear"),
            m("br"),
            m("select", {onchange: filterPaneAnswerChoiceChanged.bind(null, this), multiple: "multiple"}, multiselectOptions)
        ]);
    }
};

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
    // console.log("^^^^^^^^^^^^ choices", storyBrowserInstance.choices);
    
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
        
        this.filter1 = m.component(<any>Filter, {name: "Filter 1", storyBrowser: this});
        this.filter2 = m.component(<any>Filter, {name: "Filter 2", storyBrowser: this});
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
        
        var filter = m("table.filterTable", m("tr", [
            m("td", controller.filter1),
            m("td", controller.filter2)
        ]));

        var gridFieldSpecification = {
            id: "stories",
            displayConfiguration: {
                itemPanelSpecification: controller.itemPanelSpecification,
                gridConfiguration: {
                    idProperty: "_storyID",
                    includeAllFields: ["__survey_storyName", "__survey_storyText"],
                    viewButton: true,
                    navigationButtons: true
               }
            }
        };
        
        var grid = gridWithItemPanelInMithril.add_grid(panelBuilder, {stories: controller.stories}, gridFieldSpecification);
        
        var parts = [prompt, filter, grid];
        
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
