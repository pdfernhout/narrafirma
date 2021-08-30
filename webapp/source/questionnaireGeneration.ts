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
    storyAnnotationBrowser: 'none',
    graphBrowser: 'none',
    annotationGraphBrowser: 'none',
    patternExplorer: 'none',
    observationsList: 'none',
    accumulatedItemsGrid: 'none',
    storiesList: 'none'
};

export function convertEditorQuestions(editorQuestions, prefixQPA) {
    const adjustedQuestions = [];
    let valueOptions;
    let displayConfiguration;
    
    for (var questionIndex = 0; questionIndex < editorQuestions.length; questionIndex++) {
        var question = editorQuestions[questionIndex];

        // Including "S_" or "P_" or "A_" prefix for user-supplied question ID to prevent collisions with application fields like storyText and JavaScript functions and __proto__
        const prefixToKeyPrefixMap = {"S_": "storyQuestion_", "P_": "participantQuestion_", "A_": "annotationQuestion_"}
        const keyPrefix = prefixToKeyPrefixMap[prefixQPA];
        
        const shortName = question[keyPrefix + "shortName"];
        const id = prefixQPA + shortName;
        const questionType = question[keyPrefix + "type"];
        const prompt = question[keyPrefix + "text"];
        const writeInTextBoxLabel = question[keyPrefix + "writeInTextBoxLabel"];

        const options = [];
        const optionsString = question[keyPrefix + "options"];
        
        if (optionsString) {
            // TODO: Improve option handling so can have standard IDs for options
            const splitOptions = optionsString.split("\n");
            splitOptions.map(function(option) { if (option.trim()) options.push(option.trim()); })
        }
        const listBoxRows = question[keyPrefix + "listBoxRows"];

        const maxNumAnswers = question[keyPrefix + "maxNumAnswers"];

        const import_columnName = question[keyPrefix + "import_columnName"] || question[keyPrefix + "shortName"];
        const import_valueType = question[keyPrefix + "import_valueType"];
        const import_minScaleValue = question[keyPrefix + "import_minScaleValue"];
        const import_maxScaleValue = question[keyPrefix + "import_maxScaleValue"];

        let importOptions = [];
        const importOptionsString = question[keyPrefix + "import_answerNames"];
        if (importOptionsString && typeof importOptionsString === "string") {
            const splitImportOptions = importOptionsString.split("\n");
            splitImportOptions.map(function(option) { if (option.trim()) importOptions.push(option.trim()); })
        } else {
            importOptions = question[keyPrefix + "import_answerNames"];
        }

        // TODO: valueType might be a number or boolean sometimes
        const valueType = displayTypeToValueTypeMap[questionType];
        
        // Set these two vars to undefined so no object fields will appear set for these if not otherwise set
        valueOptions = undefined;
        displayConfiguration = undefined;
        
        if (!valueType) console.log("ERROR: Could not resolve valueType for ", question);
        if (["select", "radiobuttons", "checkboxes"].indexOf(questionType) >= 0) {
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
            maxNumAnswers: maxNumAnswers,
            listBoxRows: listBoxRows,
            writeInTextBoxLabel: writeInTextBoxLabel,
            displayName: shortName, 
            displayPrompt: prompt,
            displayConfiguration: displayConfiguration,
            import_columnName: import_columnName,
            import_valueType: import_valueType,
            import_answerNames: importOptions,
            import_minScaleValue: import_minScaleValue,
            import_maxScaleValue: import_maxScaleValue
        });
    }
    
    return adjustedQuestions;
}

function convertElicitingQuestions(elicitingQuestions) {
    var result = [];
    for (var elicitingQuestionIndex = 0; elicitingQuestionIndex < elicitingQuestions.length; elicitingQuestionIndex++) {
        var storySolicitationQuestionText = elicitingQuestions[elicitingQuestionIndex].elicitingQuestion_text;
        var storySolicitationQuestionShortName = elicitingQuestions[elicitingQuestionIndex].elicitingQuestion_shortName;
        var storySolicitationQuestionType = elicitingQuestions[elicitingQuestionIndex].elicitingQuestion_type;
        var storySolicitationQuestionImportName = elicitingQuestions[elicitingQuestionIndex].elicitingQuestion_dataColumnName;
        var elicitingQuestionInfo = {
            text: storySolicitationQuestionText,
            id: storySolicitationQuestionShortName,
            "type": storySolicitationQuestionType,
            importName: storySolicitationQuestionImportName,
        };
        result.push(elicitingQuestionInfo);
    }
    ensureAtLeastOneElicitingQuestion(result);
    return result;
}

export function ensureAtLeastOneElicitingQuestion(elicitingQuestions) {
    // TODO: How to prevent this potential problem of no eliciting questions during questionnaire design in GUI?
    if (elicitingQuestions.length === 0) {
        // TODO: Translate
        var defaultElicitingQuestion = "What happened?";
        var message = 'No eliciting questions were defined! Adding "' + defaultElicitingQuestion + '".';
        console.log("PROBLEM", message);
        console.log("Adding eliciting question: ", defaultElicitingQuestion);
        var testElicitingQuestionInfo = {
            text: defaultElicitingQuestion,
            id: defaultElicitingQuestion,
            type: {"what happened": true}
        };
        elicitingQuestions.push(testElicitingQuestionInfo);
    }
}

export function getStoryNameAndTextQuestions() {
    var leadingStoryQuestions = [];
    leadingStoryQuestions.unshift({
        id: "storyName",
        displayName: "Story title",
        displayPrompt: "Please give your story a name",
        displayType: "text",
        valueOptions: [],
    });
    leadingStoryQuestions.unshift({
        id: "storyText",
        displayName: "Story text",
        displayPrompt: "Please enter your response to the question above in the space below",
        displayType: "textarea",
        valueOptions: [],
    });
    return leadingStoryQuestions;
}

export function getLeadingStoryQuestions(elicitingQuestions) {  
    var leadingStoryQuestions = getStoryNameAndTextQuestions();

    // TODO: What about idea of having IDs that go with eliciting questions so store reference to ID not text prompt?
    var elicitingQuestionValues = [];
    for (var elicitingQuestionIndex = 0; elicitingQuestionIndex < elicitingQuestions.length; elicitingQuestionIndex++) {
        var elicitingQuestionSpecification = elicitingQuestions[elicitingQuestionIndex];
        // elicitingQuestionValues.push({value: elicitingQuestionSpecification.id, text: elicitingQuestionSpecification.label});
        elicitingQuestionValues.push(elicitingQuestionSpecification.id || elicitingQuestionSpecification.shortName || elicitingQuestionSpecification.text);
    }

    leadingStoryQuestions.unshift({
        id: "elicitingQuestion",
        displayName: "Eliciting question",
        displayPrompt: "Please choose a question you would like to respond to",
        displayType: "select",
        valueOptions: elicitingQuestionValues,
    });
    
    return leadingStoryQuestions;
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
            itemObject.id = id;
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

// TODO: How to save the fact we have exported this in the project? Make a copy??? Or keep original in document somewhere? Versus what is returned from server for surveys?
export function buildQuestionnaire(shortName) {
    // TODO: Redo for if questionnaire template is made of triples
    var project = Globals.project();
    
    var questionnaireTemplate = project.findQuestionnaireTemplate(shortName);
    if (!questionnaireTemplate) return null;
    
    return buildQuestionnaireFromTemplate(questionnaireTemplate, shortName);
}

export function buildQuestionnaireFromTemplate(storyFormTemplate: string, shortName) {
    var project = Globals.project();
    
    var usedIDs = {
        __createdIDCount: 0
    };
    
    var storyForm = {
        __type: "org.workingwithstories.Questionnaire",
        shortName: shortName,
        title: "",
        image: "",
        startText: "",
        endText: "",
        aboutYouText: "",
        thankYouPopupText: "",
        customCSS: "",
        customCSSForPrint: "",

        import_minScaleValue: "",
        import_maxScaleValue: "",
        import_multiChoiceYesQASeparator: "",
        import_multiChoiceYesQAEnding: "",
        import_multiChoiceYesIndicator: "Yes",
        import_multiChoiceDelimiter: ",",
        import_storyTitleColumnName: "Story title",
        import_storyTextColumnName: "Story text",
        import_participantIDColumnName: "Participant ID",
        import_columnsToIgnore: [],
        import_columnsToAppendToStoryText: "",
        import_textsToWriteBeforeAppendedColumns: "",
        import_elicitingQuestionColumnName: "Eliciting question",
        import_minWordsToIncludeStory: "",
        import_stringsToRemoveFromHeaders: "",
        elicitingQuestionGraphName: "Eliciting question",

        elicitingQuestions: [],
        storyQuestions: [],
        participantQuestions: [],

        chooseQuestionText: "",
        enterStoryText: "",
        nameStoryText: "",
        tellAnotherStoryText: "",
        tellAnotherStoryButtonText: "",
        maxNumStories: "no limit",
        sliderValuePrompt: "",
        maxNumAnswersPrompt: "",

        submitSurveyButtonText: "",
        sendingSurveyResultsText: "",
        resubmitSurveyButtonText: "",
        couldNotSaveSurveyText: "",
        deleteStoryButtonText: "",
        deleteStoryDialogPrompt: "",
        surveyStoredText: "",
        showSurveyResultPane: "",
        surveyResultPaneHeader: "",
        
        errorMessage_noElicitationQuestionChosen: "",
        errorMessage_noStoryText: "",
        errorMessage_noStoryName: ""
    };

    storyForm.shortName = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_shortName");
    storyForm.title = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_title");
    storyForm.image = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_image");
    storyForm.startText = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_startText");
    storyForm.endText = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_endText"); 
    storyForm.aboutYouText = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_aboutYouText");
    storyForm.thankYouPopupText = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_thankYouPopupText");
    storyForm.customCSS = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_customCSS");
    storyForm.customCSSForPrint = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_customCSSForPrint");
    
    storyForm.import_minScaleValue = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_import_minScaleValue"); 
    storyForm.import_maxScaleValue = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_import_maxScaleValue"); 
    storyForm.import_multiChoiceYesQASeparator = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_import_multiChoiceYesQASeparator"); 
    storyForm.import_multiChoiceYesQAEnding = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_import_multiChoiceYesQAEnding"); 
    storyForm.import_multiChoiceYesIndicator = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_import_multiChoiceYesIndicator"); 
    storyForm.import_multiChoiceDelimiter = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_import_multiChoiceDelimiter"); 
    storyForm.import_storyTitleColumnName = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_import_storyTitleColumnName"); 
    storyForm.import_storyTextColumnName = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_import_storyTextColumnName"); 
    storyForm.import_elicitingQuestionColumnName = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_import_elicitingQuestionColumnName"); 
    storyForm.import_minWordsToIncludeStory = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_import_minWordsToIncludeStory"); 
    storyForm.import_stringsToRemoveFromHeaders = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_import_stringsToRemoveFromHeaders"); 

    storyForm.import_participantIDColumnName = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_import_participantIDColumnName"); 
    storyForm.import_columnsToIgnore = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_import_columnsToIgnore"); 
    storyForm.import_columnsToAppendToStoryText = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_import_columnsToAppendToStoryText"); 
    storyForm.import_textsToWriteBeforeAppendedColumns = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_import_textsToWriteBeforeAppendedColumns"); 
    
    storyForm.chooseQuestionText = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_chooseQuestionText");
    storyForm.elicitingQuestionGraphName = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_elicitingQuestionGraphName");
    
    storyForm.enterStoryText = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_enterStoryText");
    storyForm.nameStoryText = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_nameStoryText");
    storyForm.tellAnotherStoryText = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_tellAnotherStoryText");
    storyForm.tellAnotherStoryButtonText = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_tellAnotherStoryButtonText");
    storyForm.maxNumStories = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_maxNumStories");
    storyForm.sliderValuePrompt = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_sliderValuePrompt");
    storyForm.maxNumAnswersPrompt = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_maxNumAnswersPrompt");

    storyForm.submitSurveyButtonText = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_submitSurveyButtonText");
    storyForm.sendingSurveyResultsText = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_sendingSurveyResultsText");
    storyForm.couldNotSaveSurveyText = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_couldNotSaveSurveyText");
    storyForm.resubmitSurveyButtonText = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_resubmitSurveyButtonText");
    
    storyForm.deleteStoryButtonText = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_deleteStoryButtonText");
    storyForm.deleteStoryDialogPrompt = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_deleteStoryDialogPrompt");
    storyForm.surveyStoredText = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_surveyStoredText");
    storyForm.showSurveyResultPane = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_showSurveyResultPane");
    storyForm.surveyResultPaneHeader = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_surveyResultPaneHeader");

    storyForm.errorMessage_noElicitationQuestionChosen = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_errorMessage_noElicitationQuestionChosen");
    storyForm.errorMessage_noStoryText = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_errorMessage_noStoryText");
    storyForm.errorMessage_noStoryName = project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_errorMessage_noStoryName");
    
    // TODO: Should maybe ensure unique IDs for eliciting questions?
    var allElicitingQuestions = buildIdToItemMap("project_elicitingQuestionsList", "elicitingQuestion_shortName");
    var elicitingQuestionIdentifiers = project.tripleStore.getListForSetIdentifier(project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_elicitingQuestions"));
    var elicitingQuestions = buildItemListFromIdList(allElicitingQuestions, elicitingQuestionIdentifiers, "elicitingQuestion");       
    storyForm.elicitingQuestions = convertElicitingQuestions(elicitingQuestions);
    
    var allStoryQuestions = buildIdToItemMap("project_storyQuestionsList", "storyQuestion_shortName");
    var storyQuestionIdentifiers = project.tripleStore.getListForSetIdentifier(project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_storyQuestions"));
    var storyQuestions = buildItemListFromIdList(allStoryQuestions, storyQuestionIdentifiers, "storyQuestion");       
    ensureUniqueQuestionIDs(usedIDs, storyQuestions);
    storyForm.storyQuestions = convertEditorQuestions(storyQuestions, "S_");
    
    var allParticipantQuestions = buildIdToItemMap("project_participantQuestionsList", "participantQuestion_shortName");
    var participantQuestionIdentifiers = project.tripleStore.getListForSetIdentifier(project.tripleStore.queryLatestC(storyFormTemplate, "questionForm_participantQuestions"));
    var participantQuestions = buildItemListFromIdList(allParticipantQuestions, participantQuestionIdentifiers, "participantQuestion");       
    ensureUniqueQuestionIDs(usedIDs, participantQuestions);      
    storyForm.participantQuestions = convertEditorQuestions(participantQuestions, "P_");
    
    return storyForm;
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

