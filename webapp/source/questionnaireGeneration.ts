import Project = require("./Project");
import Globals = require("./Globals");

"use strict";

var displayTypeToValueTypeMap = {
    // Used in questionnaire and other parts of the application
    boolean: 'boolean',
    label: "none",
    header: "none",
    checkbox: 'boolean',
    checkboxes: 'dictionary',
    text: 'string',
    textarea: 'string',
    select: "string",
    radiobuttons: "string",
    slider: "number",
    
    // Used only in other parts of the application
    image: "none",
    grid: 'array',
    clusteringDiagram: 'object',
    quizScoreResult: "none",
    button: "none",
    report: "none",
    recommendationTable: "none",
    templateList: "none",
    "function": "none",
    storyBrowser: 'none',
    graphBrowser: 'none',
    patternExplorer: 'none',
    observationsList: 'none',
    accumulatedItemsGrid: 'none',
    storiesList: 'none'
};

export function convertEditorQuestions(editorQuestions, prefixQPA) {
    var adjustedQuestions = [];
    var valueOptions;
    var displayConfiguration;
    
    for (var questionIndex = 0; questionIndex < editorQuestions.length; questionIndex++) {
        var question = editorQuestions[questionIndex];
        // console.log("question", question);
        var shortName = question.storyQuestion_shortName || question.participantQuestion_shortName || question.annotationQuestion_shortName;
        // Including "S_" or "P_" or "A_" prefix for user-supplied question ID to prevent collisions with application fields like storyText and JavaScript functions and __proto__
        var id = prefixQPA + shortName;
        var questionType = question.storyQuestion_type || question.participantQuestion_type || question.annotationQuestion_type;
        var prompt = question.storyQuestion_text || question.participantQuestion_text || question.annotationQuestion_text;
        
        var options = [];
        var optionsString = question.storyQuestion_options || question.participantQuestion_options || question.annotationQuestion_options;
        
        if (optionsString) {
            // TODO: Improve option handling so can have standard IDs for options
            var splitOptions = optionsString.split("\n");
            // Make sure options don't have leading or trailing space and are not otherwise blank
            for (var index in splitOptions) {
                var trimmedOption = splitOptions[index].trim();
                if (trimmedOption) {
                    options.push(trimmedOption);
                }
            }
        }
        // TODO: valueType might be a number or boolean sometimes
        var valueType = displayTypeToValueTypeMap[questionType];
        // Set these two vars to undefined so no object fields will appear set for these if not otherwise set
        valueOptions = undefined;
        displayConfiguration = undefined;
        
        if (!valueType) console.log("ERROR: Could not resolve valueType for ", question);
        if (questionType === "select" || questionType === "checkboxes" || questionType === "radiobuttons") {
            valueOptions = options;
        } else {
            if (options.length === 1) {
                displayConfiguration = options[0];
            } else if (options.length > 1) {
                displayConfiguration = options;
            }
        }
        adjustedQuestions.push({
            valueType: valueType,
            displayType: questionType,
            id: id, 
            valueOptions: valueOptions, 
            displayName: shortName, 
            displayPrompt: prompt,
            displayConfiguration: displayConfiguration
        });
    }
    
    return adjustedQuestions;
}

function buildIdToItemMap(itemListField, idField: string) {
    var project = Globals.project();
    var itemList = project.getListForField(itemListField);
    var result = {};
    itemList.forEach(function (item) {
        var id = project.tripleStore.queryLatestC(item, idField);
        result[id] = item;
    });
    return result;
}

function buildItemListFromIdList(idToItemMap, idItemList, idField) {
    var project = Globals.project();
    var result = [];
    idItemList.forEach(function (idItem) {
        // TODO: Fix access here for tripleStore use
        var id = project.tripleStore.queryLatestC(idItem, idField);
        var order = project.tripleStore.queryLatestC(idItem, "order");
        var item = idToItemMap[id];
        if (item) {
            // Retrieve the latest for all the fields of the object (which will include deleted/null fields)
            // TODO: Remove any deleted/null fields
            var itemObject = project.tripleStore.makeObject(item, true);
            itemObject.order = order;
            result.push(itemObject);
        } else {
            console.log("Editing error: Missing question definition for", idItem);
        }
    });
    result.sort(function(a, b) {
        if (a.order < b.order) return -1;
        if (a.order > b.order) return 1;
        return 0;
    });
    return result;
}

// Are names just hints as to purpose of code? Can never convey all aspects of interrelationships?

export function collectAllQuestions(putAnnotationQuestionsUpFront = null): any[]  {
    var project = Globals.project();
    
    var elicitingQuestions = project.collectAllElicitingQuestions();
    elicitingQuestions = convertElicitingQuestions(elicitingQuestions);
    
    var storyQuestions = project.collectAllStoryQuestions();
    storyQuestions = convertEditorQuestions(storyQuestions, "S_");
    
    var participantQuestions = project.collectAllParticipantQuestions();
    participantQuestions = convertEditorQuestions(participantQuestions, "P_");
    
    var annotationQuestions = project.collectAllAnnotationQuestions();
    annotationQuestions = convertEditorQuestions(annotationQuestions, "A_");
        
    var allQuestions = getLeadingStoryQuestions(elicitingQuestions);
    if (putAnnotationQuestionsUpFront) {
        allQuestions = allQuestions.concat(annotationQuestions, storyQuestions, participantQuestions);
    } else {
        allQuestions = allQuestions.concat(storyQuestions, participantQuestions, annotationQuestions);
    }
    
    // console.log("collectAllQuestions", allQuestions);
    return allQuestions;
}

export function getLeadingStoryQuestions(elicitingQuestions) {
    
    // TODO: What about idea of having IDs that go with eliciting questions so store reference to ID not text prompt?
    var elicitingQuestionValues = [];
    for (var elicitingQuestionIndex = 0; elicitingQuestionIndex < elicitingQuestions.length; elicitingQuestionIndex++) {
        var elicitingQuestionSpecification = elicitingQuestions[elicitingQuestionIndex];
        // elicitingQuestionValues.push({value: elicitingQuestionSpecification.id, text: elicitingQuestionSpecification.label});
        elicitingQuestionValues.push(elicitingQuestionSpecification.id || elicitingQuestionSpecification.shortName || elicitingQuestionSpecification.text);
    }
    
    // TODO: Remove redundancy
    var leadingStoryQuestions = [];
    leadingStoryQuestions.unshift({
        id: "storyName",
        displayName: "Story Name",
        displayPrompt: "Please give your story a name",
        displayType: "text",
        valueOptions: []
    });
    leadingStoryQuestions.unshift({
        id: "storyText",
        displayName: "Story Text",
        displayPrompt: "Please enter your response to the question above in the space below",
        displayType: "textarea",
        valueOptions: []
    });
    leadingStoryQuestions.unshift({
        id: "elicitingQuestion",
        displayName: "Eliciting Question",
        displayPrompt: "Please choose a question you would like to respond to",
        displayType: "select",
        valueOptions: elicitingQuestionValues
    });
    
    return leadingStoryQuestions;
}

// TODO: How to save the fact we have exported this in the project? Make a copy??? Or keep original in document somewhere? Versus what is returned from server for surveys?
export function buildQuestionnaire(shortName) {
    // TODO: Redo for if questionnaire template is made of triples
    var project = Globals.project();
    
    var questionnaireTemplate = project.findQuestionnaireTemplate(shortName);
    if (!questionnaireTemplate) return null;
    
    // console.log("questionnaireTemplate", questionnaireTemplate);
    
    return buildQuestionnaireFromTemplate(questionnaireTemplate);
}

function convertElicitingQuestions(elicitingQuestions) {
    var result = [];
    for (var elicitingQuestionIndex = 0; elicitingQuestionIndex < elicitingQuestions.length; elicitingQuestionIndex++) {
        var storySolicitationQuestionText = elicitingQuestions[elicitingQuestionIndex].elicitingQuestion_text;
        var storySolicitationQuestionShortName = elicitingQuestions[elicitingQuestionIndex].elicitingQuestion_shortName;
        var storySolicitationQuestionType = elicitingQuestions[elicitingQuestionIndex].elicitingQuestion_type;
        var elicitingQuestionInfo = {
            text: storySolicitationQuestionText,
            id: storySolicitationQuestionShortName,
            "type": storySolicitationQuestionType
        };
        result.push(elicitingQuestionInfo);
    }
    ensureAtLeastOneElicitingQuestion(result);
    return result;
}

export function buildQuestionnaireFromTemplate(questionnaireTemplate: string) {
    var project = Globals.project();
    
    var usedIDs = {
        __createdIDCount: 0
    };
    
    var questionnaire = {
        __type: "org.workingwithstories.Questionnaire",
        title: "",
        image: "",
        startText: "",
        endText: "",
        elicitingQuestions: [],
        storyQuestions: [],
        participantQuestions: []
    };
 
    questionnaire.title = project.tripleStore.queryLatestC(questionnaireTemplate, "questionForm_title");
    questionnaire.image = project.tripleStore.queryLatestC(questionnaireTemplate, "questionForm_image");
    questionnaire.startText = project.tripleStore.queryLatestC(questionnaireTemplate, "questionForm_startText");
    questionnaire.endText = project.tripleStore.queryLatestC(questionnaireTemplate, "questionForm_endText"); 
    
    // TODO: Should maybe ensure unique IDs for eliciting questions?
    var allElicitingQuestions = buildIdToItemMap("project_elicitingQuestionsList", "elicitingQuestion_shortName");
    var elicitingQuestionIdentifiers = project.tripleStore.getListForSetIdentifier(project.tripleStore.queryLatestC(questionnaireTemplate, "questionForm_elicitingQuestions"));
    var elicitingQuestions = buildItemListFromIdList(allElicitingQuestions, elicitingQuestionIdentifiers, "elicitingQuestion");       
    // console.log("elicitingQuestions", elicitingQuestions);
    
    questionnaire.elicitingQuestions = convertElicitingQuestions(elicitingQuestions);
    
    var allStoryQuestions = buildIdToItemMap("project_storyQuestionsList", "storyQuestion_shortName");
    var storyQuestionIdentifiers = project.tripleStore.getListForSetIdentifier(project.tripleStore.queryLatestC(questionnaireTemplate, "questionForm_storyQuestions"));
    var storyQuestions = buildItemListFromIdList(allStoryQuestions, storyQuestionIdentifiers, "storyQuestion");       
    ensureUniqueQuestionIDs(usedIDs, storyQuestions);
    questionnaire.storyQuestions = convertEditorQuestions(storyQuestions, "S_");
    
    var allParticipantQuestions = buildIdToItemMap("project_participantQuestionsList", "participantQuestion_shortName");
    var participantQuestionIdentifiers = project.tripleStore.getListForSetIdentifier(project.tripleStore.queryLatestC(questionnaireTemplate, "questionForm_participantQuestions"));
    var participantQuestions = buildItemListFromIdList(allParticipantQuestions, participantQuestionIdentifiers, "participantQuestion");       
    ensureUniqueQuestionIDs(usedIDs, participantQuestions);      
    questionnaire.participantQuestions = convertEditorQuestions(participantQuestions, "P_");
    
    // console.log("buildQuestionnaire result", questionnaire);
    return questionnaire;
}

function ensureUniqueQuestionIDs(usedIDs, editorQuestions) {
    // Validate the survey ids to prevent duplicates and missing ones; ideally this should be done in GUI somehow
    for (var index in editorQuestions) {
        var editorQuestion = editorQuestions[index];
        if (!editorQuestion.id) {
            editorQuestion.id = "question " + (++(usedIDs.__createdIDCount));
            console.log("SURVEY DESIGN ERROR: question had missing ID and one was assigned", editorQuestion);
        }
        while (usedIDs[editorQuestion.id]) {
            // ID already exists
            console.log("SURVEY DESIGN ERROR: duplicate ID", editorQuestion.id);
            editorQuestion.id = "question " + (++(usedIDs.__createdIDCount));
            console.log("SURVEY DESIGN ERROR: question had duplicate ID and a new one was assigned", editorQuestion);
       }
         usedIDs[editorQuestion.id] = true;
    }
}

export function ensureAtLeastOneElicitingQuestion(elicitingQuestions) {
    // TODO: How to prevent this potential problem of no eliciting questions during questionnaire design in GUI?
    if (elicitingQuestions.length === 0) {
        // TODO: Translate
        var message = "No eliciting questions were defined! Adding one with 'What happened?' for testing.";
        console.log("PROBLEM", message);
        console.log("Adding an eliciting question for testing", message);
        var testElicitingQuestionInfo = {
            text: "What happened?",
            id: "what happened",
            type: {"what happened": true}
        };
        elicitingQuestions.push(testElicitingQuestionInfo);
    }
}
