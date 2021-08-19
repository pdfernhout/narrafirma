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
var unansweredIndicator = "No answer";

export class StoryAnnotationBrowser {
    project: Project = null;
    storyCollectionIdentifier: string = null;
    questionnaire: null;
    questions = [];
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
                    massEditingMode: true,
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
        var panelBuilder = args.panelBuilder;
        
        var storyCollectionIdentifier = valuePathResolver.newValuePathForFieldSpecification(args.model, args.fieldSpecification)();
        if (storyCollectionIdentifier !== this.storyCollectionIdentifier) {
            this.storyCollectionIdentifier = storyCollectionIdentifier;
            this.currentStoryCollectionChanged(this.storyCollectionIdentifier);
            this.gridFieldSpecification.displayConfiguration.itemPanelSpecification = this.itemPanelSpecification;
            this.grid.updateDisplayConfigurationAndData(this.gridFieldSpecification.displayConfiguration);
        }
        
        var promptText = panelBuilder.addAllowedHTMLToPrompt(args.fieldSpecification.displayPrompt) + " (" + this.allStories.length + ")";
        var prompt =  m("span", {"class": "questionPrompt"}, promptText);
        
        var parts;
        
        if (!this.storyCollectionIdentifier) {
            parts = [m("div", "Please select a story collection to annotate.")];
        } else {
            parts = [prompt, this.grid.calculateView()];
        }
        
        return m("div", {"class": "questionExternal narrafirma-question-type-questionAnswer"}, parts);
    }
    
    stories() {
        return this.allStories;
    }
    
    currentStoryCollectionChanged(storyCollectionIdentifier) {
        this.questions = [];
        this.storyCollectionIdentifier = storyCollectionIdentifier;
        this.buildQuestionsList();
        this.allStories = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier, true);
        this.itemPanelSpecification = this.makeItemPanelSpecificationForQuestions(this.questions);
    }

    buildQuestionsList() {
        const storyNameAndTextQuestions = [];
        storyNameAndTextQuestions.push({id: "storyName", displayName: "Story name", displayPrompt: "Story name", displayType: "text"});
        storyNameAndTextQuestions.push({id: "storyText", displayName: "Story text", displayPrompt: "Story text", displayType: "textarea"});
        const annotationQuestions = questionnaireGeneration.convertEditorQuestions(this.project.collectAllAnnotationQuestions(), "A_");
        this.questions = [];
        this.questions = this.questions.concat(storyNameAndTextQuestions, annotationQuestions);
    }
    
    buildStoryDisplayPanel(panelBuilder: PanelBuilder, storyModel: surveyCollection.Story) {
        let storyDisplay;
        if (panelBuilder.readOnly) {
            // override questionnaire pointed to by storyModel because it may have been updated using the "update story form" button
            // generateStoryCardContent wants dictionary with ids as keys
            const questionsInDictionaryWithIDs = {};
            this.questions.map(function(question, index) {questionsInDictionaryWithIDs[question.id] = question;})
            storyDisplay = storyCardDisplay.generateStoryCardContent(storyModel, questionsInDictionaryWithIDs, 
                {"location": "storyAnnotationBrowser", "questionnaire": this.questionnaire, "storyTextAtTop": true});
        } else {
            storyDisplay = panelBuilder.buildFields(this.questions, storyModel);
        }
        return storyDisplay;
    }
    
    makeItemPanelSpecificationForQuestions(questions) {
        // want indexInStoryCollection to appear as column, but don't want it to appear as editable field in panel display below grid
        let panelFieldsToCreateForGridColumns = [];
        panelFieldsToCreateForGridColumns.push({
            id: "indexInStoryCollection",
            valueType: "string",
            displayType: "text",
            displayName: "Index",
            displayPrompt: "Index in story collection",
            displayClass: "narrafirma-index-in-story-collection"
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