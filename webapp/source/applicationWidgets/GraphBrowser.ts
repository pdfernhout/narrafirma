import charting = require("./charting");
import questionnaireGeneration = require("../questionnaireGeneration");
import surveyCollection = require("../surveyCollection");
import dialogSupport = require("../panelBuilder/dialogSupport");
import Project = require("../Project");
import Globals = require("../Globals");
import m = require("mithril");
import { GraphHolder } from "../GraphHolder";

"use strict";

function questionForID(questions, id) {
    if (!id) return null;
    for (let index in questions) {
        const question = questions[index];
        if (question.id === id) return question;
    }
    console.log("ERROR: question not found for id", id, questions);
    return null;
}

const showAnswersCheckboxID = 101;

class GraphBrowser {
    project: Project = null;
    xAxisSelectValue = null;
    yAxisSelectValue = null;
    questions = [];
    choices = [];
    collectionIDs = [];
    displayCollections = {};
    selectedStories = [];
    showAnswers = false;
    
    graphHolder: GraphHolder;
    
    constructor(args) {
        this.project = Globals.project();
        this.collectionIDs = Globals.project().listOfAllStoryCollectionNames();
        for (let id of this.collectionIDs) this.displayCollections[id] = false;
        this.graphHolder = {
            graphResultsPane: charting.createGraphResultsPane("narrafirma-graph-results-pane"),
            chartPanes: [],
            allStories: [],
            currentGraph: null,
            currentSelectionExtentPercentages: null,
            minimumStoryCountRequiredForTest: Project.default_minimumStoryCountRequiredForTest,
            minimumStoryCountRequiredForGraph: Project.default_minimumStoryCountRequiredForGraph,
            numHistogramBins: Project.default_numHistogramBins,
            numScatterDotOpacityLevels: Project.default_numScatterDotOpacityLevels,
            scatterDotSize: Project.default_scatterDotSize,
            correlationMapShape: Project.default_correlationMapShape,
            correlationMapIncludeScaleEndLabels: Project.default_correlationMapIncludeScaleEndLabels,
            correlationMapCircleDiameter: Project.default_correlationMapCircleDiameter,
            correlationLineChoice: Project.default_correlationLineChoice,
            customLabelLengthLimit: Project.default_customLabelLengthLimit,
            customGraphWidth: Project.default_customDisplayGraphWidth,
            customGraphHeight: Project.default_customDisplayGraphHeight,
            customGraphPadding: Project.default_customGraphPadding,
            hideNumbersOnContingencyGraphs: false,
            patternDisplayConfiguration: {hideNoAnswerValues: false, useLumpingCommands: true},
            graphTypesToCreate: {},
            lumpingCommands: {}
        }; 
        this.updateForChangeToDisplayedStoryCollections();
    }
    
    static controller(args) {
        return new GraphBrowser(args);
    }
    
    static view(controller, args) {
        return controller.calculateView(args);
    }

    isChecked(id, value = undefined) {
        if (value !== undefined) {
            const oldValue = this.displayCollections[id];
            this.displayCollections[id] = value;
            if (value !== oldValue) {
                this.updateForChangeToDisplayedStoryCollections();
            }
        } else {
            return this.displayCollections[id];
        }
    }

    buildCollectionCheckbox(id): any {
        const self = this;
        return m("div.graphBrowserCheckboxDiv", [
            m("input[type=checkbox].graphBrowserCheckbox", {
                id: id, 
                checked: this.isChecked(id), 
                onchange: function(event) { self.isChecked(id, event.target.checked); }
            }),
            m("label", {"for": id}, id),
            m("br")
        ]);
    }
    
    calculateView(args) {
        let parts = [];
        if (this.collectionIDs.length === 0) {
            parts.push(m("div.graphBrowserCollectionsIntro", "There are no story collections to show."));
        } else {
            parts.push(m("div.graphBrowserCollectionsIntro", "Select one or more story collections to view."));
            const checkboxDivs = [];
            for (let collectionID of this.collectionIDs) {
                checkboxDivs.push(this.buildCollectionCheckbox(collectionID));
            }
            parts.push(m("div.graphBrowserCheckboxesDiv", checkboxDivs));
            const moreParts = [
                m("div.graphBrowserQuestionsIntro", "Select one or two questions to view."),
                m("select.graphBrowserSelect", {onchange: (event) => { this.xAxisSelectValue = event.target.value; this.updateGraph(); }}, this.calculateOptionsForChoices(this.xAxisSelectValue)),
                m("span.narrafirma-graphbrowser-versus", "versus"),
                m("select.graphBrowserSelect", {onchange: (event) => { this.yAxisSelectValue = event.target.value; this.updateGraph(); }}, this.calculateOptionsForChoices(this.yAxisSelectValue)),
                m("br"),
                m("div", {config: this.insertGraphResultsPaneConfig.bind(this)}),
                (this.selectedStories.length > 0) ? 
                    m("div.narrafirma-graphbrowser-heading", "Selected stories (" + this.selectedStories.length + ")")
                    : m("div.narrafirma-graphbrowser-select-stories-tip", "Click and drag in the graph(s) above to select stories to view."),
                (this.selectedStories.length > 0) ? 
                    m("div.narrafirma-graphbrowser-showstories-buttons", [
                        m("button.narrafirma-graphbrowser-show-stories-button", {onclick: this.showAllSelectedStoriesInSeparateWindow.bind(this)}, "Show in separate window"),
                        m("button.narrafirma-graphbrowser-show-stories-button", {onclick: this.showRandom10SelectedStories.bind(this)}, "Sample 10"),
                        m("button.narrafirma-graphbrowser-show-stories-button", {onclick: this.showRandom20SelectedStories.bind(this)}, "20"),
                        m("button.narrafirma-graphbrowser-show-stories-button", {onclick: this.showRandom30SelectedStories.bind(this)}, "30"),
                        m("input[type=checkbox]", {id: showAnswersCheckboxID, checked: this.showAnswers, onchange: this.changeShowAnswers.bind(this)}),
                        m("label", {"for": showAnswersCheckboxID}, "Show answers to questions"),
                    ]) : m("div"),
                this.selectedStories.map((story) => {
                    return m("div", [
                        m("div.narrafirma-graphbrowser-story-number-and-name", story.indexInStoryCollection() + ". " + story.storyName()),
                        m("div.narrafirma-graphbrowser-story-text", story.storyText()),
                        m("div.narrafirma-graphbrowser-answers", (this.showAnswers) ? story.storyAnswersDisplay() : "")
                    ]);
                })
            ];
            parts = parts.concat(moreParts);
        }
        return m("div.graphBrowserOverallDiv", parts);
    }
    
    insertGraphResultsPaneConfig(element: HTMLElement, isInitialized: boolean, context: any) {
        if (!isInitialized) {
            element.appendChild(this.graphHolder.graphResultsPane);
        }       
    }
    
    storiesSelected(selectedStories) {
        this.selectedStories = selectedStories;
    }

    calculateOptionsForChoices(currentValue) {
        const options = this.choices.map((option) => {
            const optionOptions = {value: option.value, selected: undefined};
            if (currentValue === option.value) optionOptions.selected = 'selected';
            return m("option", optionOptions, option.label);
        });
        const hasNoSelection = (currentValue === null || currentValue === undefined || currentValue === "") || undefined;
        options.unshift(m("option", {value: "", selected: hasNoSelection}, "--- select ---"));
        return options;
    }
    
    updateForChangeToDisplayedStoryCollections() {
        this.questions = [];
        if (this.collectionIDs.length > 0) {
            const selectedCollections = [];
            for (let collectionID of this.collectionIDs) {
                if (this.displayCollections[collectionID]) {
                    selectedCollections.push(collectionID);
                }
            }
            if (selectedCollections.length > 0) {

                // built-in questions should be the same for all story collections, so just use the first one chosen
                const elicitingQuestion = this.project.elicitingQuestionForStoryCollection(selectedCollections[0]);
                if (elicitingQuestion) this.questions.push(elicitingQuestion);
                const numStoriesToldQuestions = this.project.numStoriesToldQuestionForStoryCollection(selectedCollections[0]);
                const storyLengthQuestions = this.project.storyLengthQuestionForStoryCollection(selectedCollections[0]);
                const collectionDateQuestions = this.project.collectionDateQuestionForStoryCollection(selectedCollections[0]);
                const languageQuestions = this.project.languageQuestionForStoryCollection(selectedCollections[0]);

                // annotations are not per collection/questionnaire
                const annotationQuestions = questionnaireGeneration.convertEditorQuestions(this.project.collectAllAnnotationQuestions(), "A_");

                // for questions that could vary, combine all questions with the same short names
                const storyQuestions = [];
                const participantQuestions = [];
                for (let collectionID of selectedCollections) {
                    const storyQuestionsForThisCollection = this.project.storyQuestionsForStoryCollection(collectionID);
                    for (let thisQuestion of storyQuestionsForThisCollection) {
                        let foundQuestion = false;
                        for (let existingQuestion of storyQuestions) {
                            if (existingQuestion.id === thisQuestion.id) {
                                foundQuestion = true;
                            }
                        }
                        if (!foundQuestion) {
                            storyQuestions.push(thisQuestion);
                        }
                    }
                    const participantQuestionsForThisCollection = this.project.participantQuestionsForStoryCollection(collectionID);
                    for (let thisQuestion of participantQuestionsForThisCollection) {
                        let foundQuestion = false;
                        for (let existingQuestion of participantQuestions) {
                            if (existingQuestion.id === thisQuestion.id) {
                                foundQuestion = true;
                            }
                        }
                        if (!foundQuestion) {
                            participantQuestions.push(thisQuestion);
                        }
                    }
                }
                this.questions = this.questions.concat(
                    storyQuestions, participantQuestions, annotationQuestions, 
                    numStoriesToldQuestions, storyLengthQuestions, collectionDateQuestions, languageQuestions);
                this.choices = surveyCollection.optionsForAllQuestions(this.questions, "excludeTextQuestions");
            }
        }
        // update all stories for the specific collection and update graph
        this.loadLatestStories();
    }
    
    loadLatestStories() {
        let allStories = [];
        for (let collectionID of this.collectionIDs) {
            if (this.displayCollections[collectionID]) {
                const storiesForThisCollection = surveyCollection.getStoriesForStoryCollection(collectionID);
                allStories = allStories.concat(storiesForThisCollection);
            }
        }
        this.graphHolder.allStories = allStories;
        this.updateGraph();
    }
    
    updateGraph() {

        const xAxisQuestionID = this.xAxisSelectValue;
        const yAxisQuestionID = this.yAxisSelectValue;
        
        // Remove old graph(s)
        while (this.graphHolder.chartPanes.length) {
            const chartPane = this.graphHolder.chartPanes.pop();
            this.graphHolder.graphResultsPane.removeChild(chartPane);
            // TODO: Do these need to be destroyed or freed somehow?
        }
        
        // Need to remove the float end node, if any        
        while (this.graphHolder.graphResultsPane.firstChild) {
            this.graphHolder.graphResultsPane.removeChild(this.graphHolder.graphResultsPane.firstChild);
        }
        
        this.selectedStories = [];

        const selectedCollections = [];
        for (let collectionID of this.collectionIDs) {
            if (this.displayCollections[collectionID]) {
                selectedCollections.push(collectionID);
            }
        }
        if (selectedCollections.length === 0) {
            return;
        }
        
        // TODO: Translated or improve checking or provide alternate handling if only one selected
        if (!xAxisQuestionID && !yAxisQuestionID) return; // alert("Please select a question for one or both graph axes");
          
        let xAxisQuestion = questionForID(this.questions, xAxisQuestionID);
        let yAxisQuestion = questionForID(this.questions, yAxisQuestionID);
        
        // Ensure xAxisQuestion is always defined
        if (!xAxisQuestion) {
            xAxisQuestion = yAxisQuestion;
            yAxisQuestion = null;
        }
        
        if (!xAxisQuestion) return;
        
        let xType = "choice";
        let yType = null;
        if (xAxisQuestion.displayType === "slider") {
            xType = "scale";
        }
        if (yAxisQuestion) {
            if (yAxisQuestion.displayType === "slider") {
                yType = "scale";
            } else {
                yType = "choice";
            }
        }
        
        if (xType === "choice" && yType === null) {
            charting.d3BarChartForQuestion(this.graphHolder, xAxisQuestion, this.storiesSelected.bind(this), true);
        } else if (xType === "choice" && yType === "choice") {
            charting.d3ContingencyTable(this.graphHolder, xAxisQuestion, yAxisQuestion, null, this.storiesSelected.bind(this), true);
        } else if (xType === "choice" && yType === "scale") {
            charting.multipleHistograms(this.graphHolder, xAxisQuestion, yAxisQuestion, this.storiesSelected.bind(this), true);
        } else if (xType === "scale" && yType === null) {
            charting.d3HistogramChartForQuestion(this.graphHolder, xAxisQuestion, null, null, this.storiesSelected.bind(this), true);
        } else if (xType === "scale" && yType === "choice") {
            charting.multipleHistograms(this.graphHolder, yAxisQuestion, xAxisQuestion, this.storiesSelected.bind(this), true);
        } else if (xType === "scale" && yType === "scale") {
            charting.d3ScatterPlot(this.graphHolder, xAxisQuestion, yAxisQuestion, null, null, this.storiesSelected.bind(this), true);
        } else {
            console.log("ERROR: Unexpected graph type");
            alert("ERROR: Unexpected graph type");
            return;
        }
    }

    changeShowAnswers(event) {
        this.showAnswers = event.target.checked;
    }

    showSelectedStoriesInSeparateWindow(stories, windowTitle, textTitle) {
        let text = textTitle + "\n";
        const header = "\n----------------------------------------------------------------------------------------------------\n";
        for (let i = 0; i < stories.length; i++) {
            text += "\n" + stories[i].indexInStoryCollection() + ". " + stories[i].storyName();
            text += header + stories[i].storyText() + "\n\n";
            if (this.showAnswers) {
                text += stories[i].storyAnswersDisplay() + "\n"; 
            }
        }
        dialogSupport.openTextEditorDialog(text, windowTitle, "Close", "Copy to Clipboard", this.closeCopyStoriesDialogClicked.bind(this), false, true);
    }

    closeCopyStoriesDialogClicked(text, hideDialogMethod) {     
        hideDialogMethod();
    }

    showAllSelectedStoriesInSeparateWindow(event) {
        this.showSelectedStoriesInSeparateWindow(this.selectedStories, "Selected stories", "Selected stories");
    }

    sampleSelectedStories(sampleSize) {
        const stories = this.selectedStories;
        if (!stories.length) {
            alert("Please select some stories to show.");
            return;
        }
        let sampledStories = [];
        if (stories.length <= sampleSize) {
            sampledStories = sampledStories.concat(stories);
        } else {   
            const sampledStoryIDs = [];   
            while (sampledStoryIDs.length < sampleSize) { 
                const randomIndex = Math.max(0, Math.min(stories.length - 1, Math.round(Math.random() * stories.length) - 1));
                if (sampledStoryIDs.indexOf(randomIndex) < 0) {
                    sampledStoryIDs.push(randomIndex);
                }
            }
            sampledStoryIDs.forEach(function(id) {
                sampledStories.push(stories[id]);
            });
        }
        sampledStories.sort(function(a, b) {
            if (a.indexInStoryCollection() < b.indexInStoryCollection()) return -1;
            if (a.indexInStoryCollection() > b.indexInStoryCollection()) return 1;
            return 0;
        });

        const title = "Random sample of " + sampledStories.length + " stories from selection of " + this.selectedStories.length;
        this.showSelectedStoriesInSeparateWindow(sampledStories, title, title);
    }

    showRandom10SelectedStories(event) {
        this.sampleSelectedStories(10);
    }

    showRandom20SelectedStories(event) {
        this.sampleSelectedStories(20);
    }

    showRandom30SelectedStories(event) {
        this.sampleSelectedStories(30);
    }

}

export = GraphBrowser;
