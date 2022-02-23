import storyCardDisplay = require("../storyCardDisplay");
import questionnaireGeneration = require("../questionnaireGeneration");
import surveyCollection = require("../surveyCollection");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import Project = require("../Project");
import Globals = require("../Globals");
import m = require("mithril");
import GridWithItemPanel = require("../panelBuilder/GridWithItemPanel");
//import questionAndAnswerChooserSupport = require("questionAndAnswerChooserSupport");

"use strict";

// story browser support

// TODO: Need to update answer counts in filters if change value in story that affectes selected filter question

// TODO: Translate
const unansweredIndicator = "No answer";

function isMatch(story: surveyCollection.Story, questionChoice, selectedAnswerChoices) {
    if (!questionChoice) return true;
    let questionAnswer = story.fieldValue(questionChoice.id);
    if (questionAnswer === undefined || questionAnswer === null || questionAnswer === "") {
        questionAnswer = unansweredIndicator;
    } else if (typeof questionAnswer === "object") {
        // checkboxes
        for (let key in questionAnswer) {
            if (selectedAnswerChoices[key] && questionAnswer[key]) return true;
        }
        return false;
    }
    questionAnswer = "" + questionAnswer;
    return !!selectedAnswerChoices[questionAnswer];
}

function optionsFromQuestion(question, stories: surveyCollection.Story[]) {
    // TODO: Translate text for options, at least booleans?
    const options = [];
    if (!question) return options;
    
    // Compute how many of each answer -- assumes typically less than 200-1000 stories
    const totals = {};
    stories.forEach(function(story: surveyCollection.Story) {
        let choice = story.fieldValue(question.id);
        if (choice === undefined || choice === null || choice === "") {
            // Do not include "0" as unanswered
            choice = unansweredIndicator;
        }
        let oldValue;
        if (question.displayType === "checkboxes") {
            for (let key in choice) {
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
    
    let count;
    
    if (["select", "radiobuttons", "checkboxes"].indexOf(question.displayType) >= 0) {
        const answersAlreadyConsidered = [];
        for (let i = 0; i < question.valueOptions.length; i++) {
            const answer = question.valueOptions[i];
            if (answersAlreadyConsidered.indexOf(answer) >= 0) continue; // hide duplicate options, if any, due to lumping during import
            answersAlreadyConsidered.push(answer);
            count = totals[answer];
            if (!count) count = 0;
            options.push({label: answer + " - " +  count, value: answer});
        }
    } else if (question.displayType === "slider") {
        for (let sliderTick = 0; sliderTick <= 100; sliderTick++) {
            count = totals[sliderTick];
            if (!count) count = 0;
            const sliderTickText = "" + sliderTick;
            options.push({label: sliderTickText + " - " +  count, value: sliderTick});
        }
    } else if (question.displayType === "boolean") {
        [true, false].forEach(function(each) {
            count = totals["" + each];
            if (!count) count = 0;
            options.push({label: each + " - " +  count, value: each});
        });
    } else if (question.displayType === "checkbox") {
        [true, false].forEach(function(each) {
            count = totals["" + each];
            if (!count) count = 0;
            options.push({label: each + " - " +  count, value: each});
        });
    } else if (question.displayType === "text") {
        for (let eachTotal in totals) {
            if (totals.hasOwnProperty(eachTotal)) {
                count = totals[eachTotal];
                if (!count) count = 0;
                if (eachTotal !== unansweredIndicator) options.push({label: eachTotal + " - " +  count, value: eachTotal});                    
            }
        }
    } else {
        console.log("ERROR: question type not supported: ", question.displayType, question);
        options.push({label: "*ALL*" + " - " +  stories.length, value: "*ALL*"});
    }
    
    count = totals[unansweredIndicator];
    if (!count) count = 0;
    options.push({label: unansweredIndicator + " - " +  count, value: unansweredIndicator});
    
    return options;
}

function getSelectedOptions(select) {
    const selectedOptions = {};
    // select.selectedOptions is probably not implemented widely enough, so use this looping code instead over all options
    for (let i = 0; i < select.options.length; i++) {
        const option = select.options[i];
        if (option.selected) {
            selectedOptions[option.value] = option;
        }
    }
    return selectedOptions;
}

function getQuestionDataForSelection(questions, event) {
    const newValue = event.target.value;
    let question = null;
    for (let index = 0; index < questions.length; index++) {
        const questionToCheck = questions[index];
        if (questionToCheck.id === newValue) {
            question = questionToCheck;
            break;
        }
    }
    if (!question && newValue) console.log("Could not find question for id", newValue);
    return question; 
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
        return new Filter(args);
    }
    
    static view(controller, args) {
        return controller.calculateView();
    }

    hasQuestionAndAnswers() {
        return this.selectedQuestion && Object.keys(this.selectedAnswers).length;
    }

    hasQuestion() {
        return this.selectedQuestion;
    }

    displayInformation() {
        let result = "";
        if (this.hasQuestionAndAnswers()) {
            result += "[ " + this.selectedQuestion.displayName + ": ";
            result += Object.keys(this.selectedAnswers).join(", ") + " ]";
        } else if (this.hasQuestion()) {
            result += "[ " + this.selectedQuestion.displayName + " (no choice) " + " ]";
        }
    return result;
    }
        
    calculateView() {
        const choices = this.storyBrowser.choices || [];
        const selectOptions = choices.map((option) => {
            const optionOptions = {value: option.value, selected: undefined};
            if (this.selectedQuestion === option.value) optionOptions.selected = 'selected';
            return m("option", optionOptions, option.label);
        });
        
        const isNoSelection = (this.selectedQuestion === null) || undefined;
        selectOptions.unshift(m("option", {value: "", selected: isNoSelection}, "--- no filter ---"));
        
        const multiselectOptions = this.answerOptionsForSelectedQuestion.map((option) => {
            const optionOptions = {value: option.value, selected: undefined};
            if (this.selectedAnswers[option.value]) optionOptions.selected = 'selected';
            return m("option", optionOptions, option.label);
        });
        
        const isClearButtonDisabled = (this.selectedQuestion === null) || undefined;
        const displayOrNotText = (multiselectOptions.length > 0) ? "" : "[style='display:none']";
         
        return m("div.filter", [
            this.name,
            m("br"),
            m("select", {onchange: this.filterPaneQuestionChoiceChanged.bind(this)}, selectOptions),
            m("button", {disabled: isClearButtonDisabled, onclick: this.clearFilterPane.bind(this)}, "Clear"),
            m("br"),
            m("select" + displayOrNotText, {onchange: this.filterPaneAnswerChoiceChanged.bind(this), multiple: "multiple"}, multiselectOptions)
        ]);
    }
    
    filterPaneQuestionChoiceChanged(event) {
        const question = getQuestionDataForSelection(this.storyBrowser.questions, event);
        
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

export class StoryBrowser {
    project: Project = null;
    storyCollectionIdentifier: string = null;
    questionnaire: null;
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
        this.project = Globals.project();
        this.gridFieldSpecification = {
            id: "stories",
            displayConfiguration: {
                itemPanelSpecification: this.itemPanelSpecification,
                gridConfiguration: {
                    idProperty: "storyID",
                    columnsToDisplay: ["indexInStoryCollection", "storyName", "storyText", "ignore"],
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
        return new StoryBrowser(args);
    }
    
    static view(controller, args) {
        return controller.calculateView(args);
    }
    
    calculateView(args) {
        const panelBuilder = args.panelBuilder;
        
        // Handling of caching of questions and stories
        const storyCollectionIdentifier = valuePathResolver.newValuePathForFieldSpecification(args.model, args.fieldSpecification)();
        if (storyCollectionIdentifier !== this.storyCollectionIdentifier) {
            // TODO: Maybe need to handle tracking if list changed so can keep sorted list?
            this.storyCollectionIdentifier = storyCollectionIdentifier;
            this.currentStoryCollectionChanged(this.storyCollectionIdentifier);
            
            // What to do about resetting the filters?
            this.filter1.resetChoices();
            this.filter2.resetChoices();
            
            // Need to update grid for change
            this.gridFieldSpecification.displayConfiguration.itemPanelSpecification = this.itemPanelSpecification;
            this.filteredStories = this.allStories;
            this.grid.updateDisplayConfigurationAndData(this.gridFieldSpecification.displayConfiguration);
        }
        
        const promptText = panelBuilder.addAllowedHTMLToPrompt(args.fieldSpecification.displayPrompt) + " (" + this.allStories.length + ")";
        const prompt =  m("span", {"class": "questionPrompt"}, promptText);
        
        let parts;
        
        if (!this.storyCollectionIdentifier) {
            parts = [m("div", "Please select a story collection to view")];
        } else {
            const filter = m("table.filterTable", m("tr", [
                m("td", this.filter1.calculateView()),
                m("td", this.filter2.calculateView())
            ]));

            let filterInfoString = "Stories (" + this.filteredStories.length + ")";
            const filter1HasSelectedQuestion = this.filter1.hasQuestion();
            const filter2HasSelectedQuestion = this.filter2.hasQuestion();

            if (filter1HasSelectedQuestion || filter2HasSelectedQuestion) filterInfoString += " filtered by ";
            if (filter1HasSelectedQuestion) filterInfoString += this.filter1.displayInformation();
            if (filter1HasSelectedQuestion && filter2HasSelectedQuestion) filterInfoString += " and ";
            if (filter2HasSelectedQuestion) filterInfoString += this.filter2.displayInformation();

            // TODO: Translation
            const filteredCountText = m("div.narrafirma-story-browser-filtered-stories-count", filterInfoString);

            parts = [prompt, filter, filteredCountText, this.grid.calculateView()];
        }
        
        return m("div", {"class": "questionExternal narrafirma-question-type-questionAnswer"}, parts);
    }
    
    // Not using m.prop for stories property as it makes debugging harder?
    stories() {
        return this.filteredStories;
    }
    
    currentStoryCollectionChanged(storyCollectionIdentifier) {
        this.questions = [];
        this.storyCollectionIdentifier = storyCollectionIdentifier;
        this.questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);

        const storyNameAndTextQuestions = questionnaireGeneration.getStoryNameAndTextQuestions();
        
        const elicitingQuestion = this.project.elicitingQuestionForStoryCollection(this.storyCollectionIdentifier);
        const numStoriesToldQuestion = {
            id: "numStoriesTold",
            displayName: "Number of stories told",
            displayReadOnly: true,
            displayPrompt: "Number of stories told by this participant",
            displayType: "text",
            displayConfiguration: "10"
        }
        const storyLengthQuestion = {
            id: "storyLength",
            displayName: "Story length",
            displayReadOnly: true,
            displayPrompt: "Story length (in characters)",
            displayType: "text",
            displayConfiguration: "10"
        }
        const collectionDateQuestion = {
            id: "collectionDate",
            displayName: "Collection year",
            displayPrompt: "Collection year (format: YYYY-MM-DD)",
            displayType: "text",
            displayConfiguration: "20"
        }
        const languageQuestion = {
            id: "language",
            displayName: "Language",
            displayPrompt: "Language",
            displayType: "text",
            displayConfiguration: "20"
        }

        const storyQuestions = this.project.storyQuestionsForStoryCollection(this.storyCollectionIdentifier);
        const participantQuestions = this.project.participantQuestionsForStoryCollection(this.storyCollectionIdentifier);
        
        this.questions = this.questions.concat(
            storyNameAndTextQuestions, 
            [elicitingQuestion], 
            storyQuestions, 
            participantQuestions, 
            [collectionDateQuestion],
            [languageQuestion],
            [numStoriesToldQuestion], 
            [storyLengthQuestion]);

        this.choices = surveyCollection.optionsForAllQuestions(this.questions);
        this.allStories = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier, true);
        
        this.itemPanelSpecification = this.makeItemPanelSpecificationForQuestions(this.questions);
        
        this.itemPanelSpecification.panelFields.push({
            id: "indexInStoryCollection",
            valueType: "string",
            displayReadOnly: true,
            displayType: "text",
            displayName: "Index",
            displayConfiguration: "10",
            displayPrompt: "Index of story in collection",
            displayClass: "narrafirma-index-in-story-collection"
        });
        this.itemPanelSpecification.panelFields.push({
            id: "ignore",
            valueType: "string",
            displayType: "text",
            displayName: "Ignore",
            displayPrompt: "Reason to ignore story (enter any text here to leave this story out of all graphs and reports)",
            displayClass: "narrafirma-ignore-story"
        });
        this.itemPanelSpecification.panelFields.push({
            id: "showJSON",
            valueType: "none",
            displayType: "button",
            displayPrompt: "Show story as raw JSON data",
            displayConfiguration: "showStoryAsJSON"
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
        let storyDisplay;
        if (panelBuilder.readOnly) {
            // override questionnaire pointed to by storyModel because it may have been updated using the "update story form" button
            storyDisplay = storyCardDisplay.generateStoryCardContent(storyModel, undefined, {
                location: "storyBrowser", 
                questionnaire: this.questionnaire, 
                storyTextAtTop: true, 
                includeWriteInAnswers: true
            });
        } else {
            storyDisplay = panelBuilder.buildFields(this.questions, storyModel);
        }
        
        return storyDisplay;
    }
    
    makeItemPanelSpecificationForQuestions(questions) {
        // TODO: add more participant and survey info, like timestamps and participant ID
        
        const itemPanelSpecification = {
            id: "storyBrowserQuestions",
            modelClass: "Story",
            panelFields: questions,
            buildPanel: this.buildStoryDisplayPanel.bind(this)
        };
        return itemPanelSpecification;
    }
    
    getFilteredStoryList() {
        const question1Choice = this.filter1.selectedQuestion;
        const answers1Choices = this.filter1.selectedAnswers;
        const question2Choice = this.filter2.selectedQuestion;
        const answers2Choices = this.filter2.selectedAnswers;
        const filterFunction = function (item) {
            const match1 = isMatch(item, question1Choice, answers1Choices);
            const match2 = isMatch(item, question2Choice, answers2Choices);
            return match1 && match2;
        };
        
        const filteredResults = this.allStories.filter(filterFunction);
        return filteredResults;
    }
    
    setStoryListForCurrentFilters() {
        const filteredResults = this.getFilteredStoryList();
        this.filteredStories = filteredResults;
        this.grid.updateData();
    }
    
    /* TODO: Probably need to implement something like this
    function loadLatestStories(storyBrowserInstance, allStories) {
        storyBrowserInstance.dataStore.setData(allStories);
        
        // Need to update choices in filters or clear them out; reettign value forces update
        filterPaneQuestionChoiceChanged(storyBrowserInstance.filter1, storyBrowserInstance.filter1.questionSelect.get("value"));
        filterPaneQuestionChoiceChanged(storyBrowserInstance.filter2, storyBrowserInstance.filter2.questionSelect.get("value"));
        
        setStoryListForCurrentFilters(storyBrowserInstance);
    }
    */
}