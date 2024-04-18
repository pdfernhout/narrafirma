import storyCardDisplay = require("../storyCardDisplay");
import questionnaireGeneration = require("../questionnaireGeneration");
import surveyCollection = require("../surveyCollection");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import Project = require("../Project");
import Globals = require("../Globals");
import m = require("mithril");
import GridWithItemPanel = require("../panelBuilder/GridWithItemPanel");

"use strict";

// TODO: Translate
const unansweredIndicator = "No answer";

export class StoryAnnotationBrowser {
    project: Project = null;
    storyCollectionIdentifier: string = null;
    questionnaire: null;
    annotationQuestions = [];
    gridColumnQuestions = [];
    storyQuestions = [];
    participantQuestions = [];
    allStories = [];
    itemPanelSpecification = {id: "temporary", modelClass: "Story", panelFields: []};
    gridFieldSpecification = null;

    grid: GridWithItemPanel = null;

    constructor(args) {   
        this.project = Globals.project();
        this.gridFieldSpecification = {
            id: "stories",
            displayConfiguration: {
                itemPanelSpecification: this.itemPanelSpecification,
                gridConfiguration: {
                    idProperty: "storyID",
                    viewButton: true,
                    editButton: true,
                    navigationButtons: true,
                    navigationButtonsAtBottom: true,
                    randomButton: true,
                    maxColumnCount: 13 // three for index, name, and text, 10 more for annotation questions
               }
            }
        };
        this.grid = new GridWithItemPanel({panelBuilder: args.panelBuilder, model: this, fieldSpecification: this.gridFieldSpecification});
    }

    static controller(args) {
        return new StoryAnnotationBrowser(args);
    }
    
    static view(controller, args) {
        return controller.calculateView(args);
    }
    
    calculateView(args) {
        const panelBuilder = args.panelBuilder;
        
        const storyCollectionIdentifier = valuePathResolver.newValuePathForFieldSpecification(args.model, args.fieldSpecification)();
        if (storyCollectionIdentifier !== this.storyCollectionIdentifier) {
            this.storyCollectionIdentifier = storyCollectionIdentifier;
            this.currentStoryCollectionChanged(this.storyCollectionIdentifier);
            this.gridFieldSpecification.displayConfiguration.itemPanelSpecification = this.itemPanelSpecification;
            this.grid.updateDisplayConfigurationAndData(this.gridFieldSpecification.displayConfiguration);
        }
        
        const promptText = panelBuilder.addAllowedHTMLToPrompt(args.fieldSpecification.displayPrompt) 
            + " (" + this.allStories.length + "). Click on a story to annotate it.";
        const prompt =  m("span", {"class": "questionPrompt"}, promptText);
        let parts; 
        
        if (!this.storyCollectionIdentifier) {
            parts = [m("div", "Please select a story collection to annotate.")];
        } else {
            parts = [prompt, this.grid.calculateView(args)];
        }
        
        return m("div", {"class": "questionExternal narrafirma-question-type-questionAnswer"}, parts);
    }

    stories() {
        return this.allStories;
    }
    
    currentStoryCollectionChanged(storyCollectionIdentifier) {
        this.storyCollectionIdentifier = storyCollectionIdentifier;

        this.annotationQuestions = [];
        this.storyQuestions = [];
        this.participantQuestions = [];
        
        this.annotationQuestions = questionnaireGeneration.convertEditorQuestions(this.project.collectAllAnnotationQuestions(), "A_");
        this.storyQuestions = this.project.storyQuestionsForStoryCollection(this.storyCollectionIdentifier);
        this.participantQuestions = this.project.participantQuestionsForStoryCollection(this.storyCollectionIdentifier);

        this.allStories = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier, true);

        this.updateAnnotationQuestionsForPossibleChange();
        this.itemPanelSpecification = this.makeItemPanelSpecificationForQuestions(this.gridColumnQuestions);
    }

    updateAnnotationQuestionsForPossibleChange() {
        let headerCount = 0;
        this.annotationQuestions = [];
        this.gridColumnQuestions = [];
        const retrievedQuestions = questionnaireGeneration.convertEditorQuestions(this.project.collectAllAnnotationQuestions(), "A_");

        const orderedShortNamesText = this.project.getFieldValue("project_annotationQuestionsOrder");
        let orderedShortNames = [];
        if (orderedShortNamesText) {
            orderedShortNames = orderedShortNamesText.split("\n").map(function(item) { return item.trim(); } );
        }
        
        if (orderedShortNames.length > 0) {
            const orderedQuestions = [];
            const orderedQuestionsToShowInGrid = [];
            orderedShortNames.map((questionShortName) => {
                let foundQuestion = false;
                let questionShortNameToUse = questionShortName;
                let showThisQuestionInTheGrid = false;
                if (questionShortName.indexOf("*") == 0) {
                    showThisQuestionInTheGrid = true;
                    questionShortNameToUse = questionShortName.split("*")[1];
                }
                for (let i = 0; i <= retrievedQuestions.length; i++) {
                    if (retrievedQuestions[i] && retrievedQuestions[i].displayName == questionShortNameToUse) {
                        orderedQuestions.push(retrievedQuestions[i]);
                        if (showThisQuestionInTheGrid) orderedQuestionsToShowInGrid.push(retrievedQuestions[i]);
                        foundQuestion = true;
                        break;
                    }
                }
                if (!foundQuestion) {
                    const headerQuestion = { id: "header" + ++headerCount, valueType: "none", displayPrompt: questionShortNameToUse, displayType: "header" };
                    orderedQuestions.push(headerQuestion);
                    }
                });
            this.annotationQuestions = this.annotationQuestions.concat(orderedQuestions);
            if (orderedQuestionsToShowInGrid.length > 0) {
                this.gridColumnQuestions = this.gridColumnQuestions.concat(orderedQuestionsToShowInGrid);
            } else {
                this.gridColumnQuestions = this.gridColumnQuestions.concat(orderedQuestions);
            }
        } else {
            this.annotationQuestions = this.annotationQuestions.concat(retrievedQuestions);
            this.gridColumnQuestions = this.gridColumnQuestions.concat(retrievedQuestions);
        }
    }

    buildStoryDisplayPanel(panelBuilder: PanelBuilder, storyModel: surveyCollection.Story) {
        let storyDisplayPanel;
        let readOnlyDisplayPanel;

        let questionsToEdit = [];
        let questionsToDisplay = [];

        this.updateAnnotationQuestionsForPossibleChange();

        if (panelBuilder.readOnly) {
            questionsToEdit = [];
            questionsToDisplay = questionsToDisplay.concat(this.annotationQuestions, this.storyQuestions, this.participantQuestions);
        } else {
            questionsToEdit = this.annotationQuestions;
            questionsToDisplay = questionsToDisplay.concat(this.storyQuestions, this.participantQuestions);
        }

        const questionsInDictionaryWithIDs = {};
        questionsToDisplay.map(function(question, index) { questionsInDictionaryWithIDs[question.id] = question; })
        readOnlyDisplayPanel = storyCardDisplay.generateStoryCardContent(storyModel, questionsInDictionaryWithIDs, {
            location: "storyAnnotationBrowser", 
            questionnaire: this.questionnaire,
            storyTextAtTop: true, 
            includeWriteInAnswers: true
        });

        if (panelBuilder.readOnly) {
            storyDisplayPanel = readOnlyDisplayPanel;
        } else {
            storyDisplayPanel = panelBuilder.buildFields(questionsToEdit, storyModel);
            storyDisplayPanel.push(readOnlyDisplayPanel);
        }
        return storyDisplayPanel;
    }
    
    makeItemPanelSpecificationForQuestions(questions) {
        // I want these fields to appear as columns, but I don't want them to appear as editable fields 
        let panelFieldsToCreateForGridColumns = [];
        panelFieldsToCreateForGridColumns.push({
            id: "indexInStoryCollection",
            valueType: "string",
            displayType: "text",
            displayName: "Index",
            displayConfiguration: "10",
            displayPrompt: "Index of story in collection",
            displayClass: "narrafirma-index-in-story-collection"
        });
        panelFieldsToCreateForGridColumns.push({
            id: "storyName",
            valueType: "string",
            displayType: "text",
            displayName: "Story name",
            displayConfiguration: "20",
            displayPrompt: "Name of story"
        });
        panelFieldsToCreateForGridColumns.push({
            id: "storyText",
            valueType: "string",
            displayType: "text",
            displayName: "Story text",
            displayPrompt: "Text of story"
        });
        panelFieldsToCreateForGridColumns = panelFieldsToCreateForGridColumns.concat(questions);
        const itemPanelSpecification = {
            id: "storyAnnotationBrowserQuestions",
            modelClass: "Story",
            panelFields: panelFieldsToCreateForGridColumns,
            buildPanel: this.buildStoryDisplayPanel.bind(this)
        };
        return itemPanelSpecification;
    }

}