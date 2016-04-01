import storyCardDisplay = require("../storyCardDisplay");
import questionnaireGeneration = require("../questionnaireGeneration");
import surveyCollection = require("../surveyCollection");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import GridWithItemPanel = require("../panelBuilder/GridWithItemPanel");

"use strict";

// story browser support

// TODO: Need to update answer counts in filters if change value in story that affectes selected filter question

// TODO: Translate
var unansweredIndicator = "{Unanswered}";

function isMatch(story: surveyCollection.Story, questionChoice, selectedAnswerChoices) {
    // console.log("isMatch", questionChoice, selectedAnswerChoices);
    if (!questionChoice) return true;
    var questionAnswer = story.fieldValue(questionChoice.id);
    if (questionAnswer === undefined || questionAnswer === null || questionAnswer === "") {
        questionAnswer = unansweredIndicator;
    } else if (typeof questionAnswer === "object") {
        // checkboxes
        // console.log("checkboxes", questionAnswer);
        for (var key in questionAnswer) {
            if (selectedAnswerChoices[key] && questionAnswer[key]) return true;
        }
        return false;
    }
    questionAnswer = "" + questionAnswer;
    // console.log("questionAnswer", questionAnswer);
    return !!selectedAnswerChoices[questionAnswer];
}
    
function optionsFromQuestion(question, stories) {
    // console.log("*** optionsFromQuestion", question, stories);
    // TODO: Translate text for options, at least booleans?
    var options = [];
    
    if (!question) return options;
    
    // Compute how many of each answer -- assumes typically less than 200-1000 stories
    var totals = {};
    stories.forEach(function(story: surveyCollection.Story) {
        // console.log("optionsFromQuestion item", item, question.id, item[question.id]);
        var choice = story.fieldValue(question.id);
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
            var sliderTickText = "" + sliderTick;
            /*
            if (sliderTickText.length < 2) {
                sliderTickText = "0" + sliderTickText;
            }
            if (sliderTickText.length < 3) {
                sliderTickText = "0" + sliderTickText;
            }
            */
            options.push({label: sliderTickText + " (" +  count + ")", value: sliderTick});
        }
    } else if (question.displayType === "boolean") {
        // console.log("boolean", question);
        // TODO; Not sure this will really be right with true/false as booleans instead of strings
        ["true", "false"].forEach(function(each) {
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
    
    // TODO: Maybe should not add the unanswered indicator if zero?
    // Always add the unanswered indicator if not checkboxes or checkbox
    if (question.displayType !== "checkbox" && question.displayType !== "checkboxes") {
        count = totals[unansweredIndicator];
        if (!count) count = 0;
        options.push({label: unansweredIndicator + " (" +  count + ")", value: unansweredIndicator});
    }
    
    /*
    // Sort options by their name -- only if not slider numbers which are already ordered
    if (question.displayType !== "slider") {
        options.sort(function(a, b) {
            if (a.label.toLowerCase() < b.label.toLowerCase()) return -1;
            if (a.label.toLowerCase() > b.label.toLowerCase()) return 1;
            return 0;
        });
    }
    */
    
    return options;
}

function getSelectedOptions(select) {
    var selectedOptions = {};
    
    // select.selectedOptions is probably not implemented widely enough, so use this looping code instead over all options
    for (var i = 0; i < select.options.length; i++) {
        var option = select.options[i];
        
        if (option.selected) {
            selectedOptions[option.value] = option;
        }
    }
    
    return selectedOptions;
}

class Filter {
    name: string = null;
    storyBrowser: StoryBrowser = null;
    selectedQuestion = null;
    answerOptionsForSelectedQuestion = [];
    selectedAnswers = {};
    
    constructor(args) {
        this.storyBrowser = args.storyBrowser;
        this.name = args.name;
    }
    
    static controller(args) {
        // console.log("Making Filter: ", args.name);
        return new Filter(args);
    }
    
    static view(controller, args) {
        // console.log("Filter view called");
        
        return controller.calculateView();
    }
        
    calculateView() {
        // console.log("calculateView this", this);
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
            this.name,
            m("br"),
            m("select", {onchange: this.filterPaneQuestionChoiceChanged.bind(this)}, selectOptions),
            m("button", {disabled: isClearButtonDisabled, onclick: this.clearFilterPane.bind(this)}, "Clear"),
            m("br"),
            m("select", {onchange: this.filterPaneAnswerChoiceChanged.bind(this), multiple: "multiple"}, multiselectOptions)
        ]);
    }
    
    filterPaneQuestionChoiceChanged(event) {
        var question = getQuestionDataForSelection(this.storyBrowser.questions, event);
        
        this.selectedQuestion = question;
        this.answerOptionsForSelectedQuestion = optionsFromQuestion(this.selectedQuestion, this.storyBrowser.allStories);
        this.selectedAnswers = {};
        
        this.storyBrowser.setStoryListForCurrentFilters();  
    }
    
    filterPaneAnswerChoiceChanged(event) {
        this.selectedAnswers = getSelectedOptions(event.target);        
        this.storyBrowser.setStoryListForCurrentFilters();
    }
    
    resetChoices() {
        this.selectedQuestion = null;
        this.answerOptionsForSelectedQuestion = [];
        this.selectedAnswers = {};
    }     
        
    clearFilterPane() {
        this.resetChoices();
        this.storyBrowser.setStoryListForCurrentFilters();
    }
}

function getQuestionDataForSelection(questions, event) {
    var newValue = event.target.value;
     
    var question = null;
    
    for (var index = 0; index < questions.length; index++) {
        var questionToCheck = questions[index];
        if (questionToCheck.id === newValue) {
            question = questionToCheck;
            break;
        }
    }
    
    //console.log("filterPaneQuestionChoiceChanged", question);
    
    if (!question && newValue) console.log("could not find question for id", newValue);
    
    return question; 
}

class StoryBrowser {
    storyCollectionIdentifier: string = null;
    questions = [];
    choices = [];
    allStories = [];
    filteredStories = [];
    itemPanelSpecification = {id: "temporary", modelClass: "Story", panelFields: []};
    gridFieldSpecification = null;
    
    // Embedded components
    filter1: Filter;
    filter2: Filter;
    
    grid: GridWithItemPanel = null;
    
    constructor(args) {   
        this.gridFieldSpecification = {
            id: "stories",
            displayConfiguration: {
                itemPanelSpecification: this.itemPanelSpecification,
                gridConfiguration: {
                    idProperty: "storyID",
                    columnsToDisplay: ["storyName", "storyText", "ignore"],
                    viewButton: true,
                    editButton: true,
                    navigationButtons: true
               }
            }
        };
        
        this.filter1 = new Filter({key: "First filter", name: "First filter", storyBrowser: this});
        this.filter2 = new Filter({key: "Second filter", name: "Second filter", storyBrowser: this});
        this.grid = new GridWithItemPanel({panelBuilder: args.panelBuilder, model: this, fieldSpecification: this.gridFieldSpecification});
    }

    static controller(args) {
        // console.log("Making StoryBrowser: ", args.name);
        return new StoryBrowser(args);
    }
    
    static view(controller, args) {
        // console.log("StoryBrowser view called");
        
        return controller.calculateView(args);
    }
    
    calculateView(args) {
        // console.log("StoryBrowser view");
        var panelBuilder = args.panelBuilder;
        
        // Handling of caching of questions and stories
        var storyCollectionIdentifier = valuePathResolver.newValuePathForFieldSpecification(args.model, args.fieldSpecification)();
        if (storyCollectionIdentifier !== this.storyCollectionIdentifier) {
            // TODO: Maybe need to handle tracking if list changed so can keep sorted list?
            this.storyCollectionIdentifier = storyCollectionIdentifier;
            // console.log("storyCollectionIdentifier changed", this.storyCollectionIdentifier);
            this.currentStoryCollectionChanged(this.storyCollectionIdentifier);
            
            // What to do about resetting the filters?
            this.filter1.resetChoices();
            this.filter2.resetChoices();
            
            // Need to update grid for change
            this.gridFieldSpecification.displayConfiguration.itemPanelSpecification = this.itemPanelSpecification;
            this.filteredStories = this.allStories;
            this.grid.updateDisplayConfigurationAndData(this.gridFieldSpecification.displayConfiguration);
        }
        
        var promptText = panelBuilder.addAllowedHTMLToPrompt(args.fieldSpecification.displayPrompt) + " (" + this.allStories.length + ")";
        var prompt =  m("span", {"class": "questionPrompt"}, promptText);
        
        var parts;
        
        if (!this.storyCollectionIdentifier) {
            parts = [m("div", "Please select a story collection to view")];
        } else {
            var filter = m("table.filterTable", m("tr", [
                m("td", this.filter1.calculateView()),
                m("td", this.filter2.calculateView())
            ]));
            
            // TODO: Translation
            var filteredCountText = m("div.narrafirma-story-browser-filtered-stories-count", "Filtered stories (" + this.filteredStories.length + ")");

            parts = [prompt, filter, filteredCountText, this.grid.calculateView()];
        }
        
        return m("div", {"class": "questionExternal narrafirma-question-type-questionAnswer"}, parts);
    }
    
    // Not using m.prop for stories property as it makes debugging harder?
    stories() {
        return this.filteredStories;
    }
    
    currentStoryCollectionChanged(storyCollectionIdentifier) {
        // console.log("currentStoryCollectionChanged", this, storyCollectionIdentifier);
        
        // Update filters
        this.questions = questionnaireGeneration.collectAllQuestions("putAnnotationQuestionsUpFront");
                
        this.choices = surveyCollection.optionsForAllQuestions(this.questions);
        
        // update all stories for the specific collection
        this.allStories = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier, true);
        
        this.itemPanelSpecification = this.makeItemPanelSpecificationForQuestions(this.questions);
        
        this.itemPanelSpecification.panelFields.push({
            id: "ignore",
            valueType: "string",
            displayType: "text",
            displayName: "Ignore",
            displayPrompt: "Reason to ignore story (enter any text here to leave this story out of all graphs and reports)",
            displayClass: "narrafirma-ignore-story"
        });
        
        /*
        // TODO: What to do about current selection in filter widgets?
        
        // Update item panel in grid
        this.storyList.changeItemPanelSpecification(itemPanelSpecification);
        
        this.loadLatestStories(allStories);
        
        // TODO: Should close up open grid view
        */
    }
    
    buildStoryDisplayPanel(panelBuilder: PanelBuilder, storyModel: surveyCollection.Story) {
        var storyDisplay;
        if (panelBuilder.readOnly) {
            storyDisplay = storyCardDisplay.generateStoryCardContent(storyModel, {"location": "storyBrowser"});
        } else {
            storyDisplay = panelBuilder.buildFields(this.questions, storyModel);
        }
        
        return storyDisplay;
    }
    
    makeItemPanelSpecificationForQuestions(questions) {
        // TODO: add more participant and survey info, like timestamps and participant ID
        
        var itemPanelSpecification = {
            id: "storyBrowserQuestions",
            modelClass: "Story",
            panelFields: questions,
            buildPanel: this.buildStoryDisplayPanel.bind(this)
        };
        
        return itemPanelSpecification;
    }
    
    getFilteredStoryList() {
        // console.log("filter pressed", storyBrowserInstance);
        var question1Choice = this.filter1.selectedQuestion;
        var answers1Choices = this.filter1.selectedAnswers;
        // console.log("question1", question1Choice, "answers1", answers1Choices);
        var question2Choice = this.filter2.selectedQuestion;
        var answers2Choices = this.filter2.selectedAnswers;
        // console.log("question2", question2Choice, "answers2", answers2Choices);  
        var filterFunction = function (item) {
            var match1 = isMatch(item, question1Choice, answers1Choices);
            var match2 = isMatch(item, question2Choice, answers2Choices);
            return match1 && match2;
        };
        
        var filteredResults = this.allStories.filter(filterFunction);
        return filteredResults;
    }
    
    setStoryListForCurrentFilters() {
        var filteredResults = this.getFilteredStoryList();
        // console.log("Filtered results", filteredResults);
        this.filteredStories = filteredResults;
        this.grid.updateData();
        // console.log("finished setting list with filtered results", filteredResults);
    }
    
    /* TODO: Probably need to implement something like this
    function loadLatestStories(storyBrowserInstance, allStories) {
        // console.log("loadLatestStories", storyBrowserInstance, allStories);
        storyBrowserInstance.dataStore.setData(allStories);
        
        // Need to update choices in filters or clear them out; reettign value forces update
        filterPaneQuestionChoiceChanged(storyBrowserInstance.filter1, storyBrowserInstance.filter1.questionSelect.get("value"));
        filterPaneQuestionChoiceChanged(storyBrowserInstance.filter2, storyBrowserInstance.filter2.questionSelect.get("value"));
        
        setStoryListForCurrentFilters(storyBrowserInstance);
    }
    */
}

export = StoryBrowser;