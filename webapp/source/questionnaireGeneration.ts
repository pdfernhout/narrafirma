import Project = require("./Project");
import Globals = require("./Globals");
import surveyBuilderMithril = require("./surveyBuilderMithril");

"use strict";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// setting up info about fields to look up in get/set methods
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const formFieldsInfo: FormFieldInfo[] = [

    // Starting out

    {tripleStoreFieldID: "questionForm_title", 
        exportImportID: "Title", 
        canBeTranslated: true, 
        section: "Starting out", 
        explanation: "Title shown at top of page"},
    {tripleStoreFieldID: "questionForm_startText", 
        exportImportID: "Start text", 
        canBeTranslated: true, 
        section: "Starting out", 
        explanation: "Introduction to story form"},

    // Choosing a story-eliciting question

    {tripleStoreFieldID: "questionForm_chooseQuestionText", 
        exportImportID: "Choose question text", 
        canBeTranslated: true, 
        default: "Please choose a question to which you would like to respond.", 
        section: "Choosing a story-eliciting question", 
        explanation: "Instructions for choosing eliciting question"},
    {tripleStoreFieldID: "questionForm_errorMessage_noElicitationQuestionChosen", 
        exportImportID: "Error message no elicitation question chosen", 
        canBeTranslated: true, 
        section: "Choosing a story-eliciting question",
        explanation: "Popup message if participant chose no elicitation question"},

    // Writing and naming a story

    {tripleStoreFieldID: "questionForm_enterStoryText", 
        exportImportID: "Enter story text", 
        canBeTranslated: true, 
        section: "Writing and naming a story",
        explanation: "Instruction to write story in text box"},
    {tripleStoreFieldID: "questionForm_errorMessage_noStoryText", 
        exportImportID: "Error message no story text", 
        canBeTranslated: true, 
        section: "Writing and naming a story",
        explanation: "Popup message if participant wrote no story; # is replaced with number of story on page"},
    {tripleStoreFieldID: "questionForm_nameStoryText", 
        exportImportID: "Name story text", 
        canBeTranslated: true, 
        section: "Writing and naming a story",
        explanation: "Instruction to name story"},
    {tripleStoreFieldID: "questionForm_errorMessage_noStoryName", 
        exportImportID: "Error message no story name", 
        canBeTranslated: true, 
        section: "Writing and naming a story",
        explanation: "Popup message if participant did not name story; # is replaced with number of story on page"},

    // Answering questions about the story

    {tripleStoreFieldID: "questionForm_sliderValuePrompt", 
        exportImportID: "Slider value prompt", 
        canBeTranslated: true, 
        section: "Answering questions about the story",
        explanation: "Popup message when participant clicks slider value"},
    {tripleStoreFieldID: "questionForm_selectNoChoiceName", 
        exportImportID: "Select no-choice name", 
        canBeTranslated: true, 
        section: "Answering questions about the story",
        explanation: "What a drop-down list says when no selection has been made"},
    {tripleStoreFieldID: "questionForm_booleanYesNoNames", 
        exportImportID: "Boolean yes/no names", 
        canBeTranslated: true, 
        section: "Answering questions about the story",
        explanation: "The yes and no choices on a boolean question, separated by a forward slash (/)"},
    {tripleStoreFieldID: "questionForm_maxNumAnswersPrompt", 
        exportImportID: "Max number of answers prompt", 
        canBeTranslated: true, 
        section: "Answering questions about the story",
        explanation: "Telling participants how many answers they can choose for a limited-answers question"},

    // Telling another story

    {tripleStoreFieldID: "questionForm_tellAnotherStoryText", 
        exportImportID: "Tell another story text", 
        canBeTranslated: true, 
        section: "Telling another story",
        explanation: "Asking participant if they want to tell another story"},
    {tripleStoreFieldID: "questionForm_tellAnotherStoryButtonText", 
        exportImportID: "Tell another story button", 
        canBeTranslated: true, 
        section: "Telling another story",
        explanation: "Text on tell-another-story button"},
    {tripleStoreFieldID: "questionForm_deleteStoryButtonText", 
        exportImportID: "Delete story button", 
        canBeTranslated: true, 
        section: "Telling another story",
        explanation: "Text on delete-this-story button"},
    {tripleStoreFieldID: "questionForm_deleteStoryDialogPrompt", 
        exportImportID: "Delete story prompt", 
        canBeTranslated: true, 
        section: "Telling another story",
        explanation: "Popup message confirming story deletion"},
    

    // Answering questions about the participant

    {tripleStoreFieldID: "questionForm_aboutYouText", 
        exportImportID: "About you text", 
        canBeTranslated: true, 
        section: "Answering questions about the participant",
        explanation: "Header for questions about participant"},
    
    // Finishing the form

    {tripleStoreFieldID: "questionForm_endText", 
        exportImportID: "End text", 
        canBeTranslated: true, 
        section: "Finishing the form",
        explanation: "Conclusion at end of story form"},
    {tripleStoreFieldID: "questionForm_thankYouPopupText", 
        exportImportID: "Thank you text", 
        canBeTranslated: true, 
        section: "Finishing the form",
        explanation: "Popup message thanking participant for submitting story"},
    {tripleStoreFieldID: "questionForm_surveyResultPaneHeader", 
        exportImportID: "Survey result header", 
        canBeTranslated: true, 
        section: "Finishing the form",
        explanation: "Header for copy-paste story texts"},
    {tripleStoreFieldID: "questionForm_submitSurveyButtonText", 
        exportImportID: "Submit survey button", 
        canBeTranslated: true, 
        section: "Finishing the form",
        explanation: "Text on submit-story button"},
    {tripleStoreFieldID: "questionForm_sendingSurveyResultsText", 
        exportImportID: "Sending survey text", 
        canBeTranslated: true, 
        section: "Finishing the form",
        explanation: "Message saying survey is being sent to the server"},
    {tripleStoreFieldID: "questionForm_surveyStoredText", 
        exportImportID: "Survey stored message", 
        canBeTranslated: true, 
        section: "Finishing the form",
        explanation: "Message saying survey has been saved"},
    {tripleStoreFieldID: "questionForm_couldNotSaveSurveyText", 
        exportImportID: "Could not save survey text", 
        canBeTranslated: true, 
        section: "Finishing the form",
        explanation: "Message saying survey could not be saved"},
    {tripleStoreFieldID: "questionForm_resubmitSurveyButtonText", 
        exportImportID: "Resubmit survey button", 
        canBeTranslated: true, 
        section: "Finishing the form",
        explanation: "Text on submit-story button after first attempt at sending survey failed"},

    // not translateable

    {tripleStoreFieldID: "questionForm_image", exportImportID: "Image", canBeTranslated: false},
    {tripleStoreFieldID: "questionForm_maxNumStories", exportImportID: "Max num stories", default: "no limit", canBeTranslated: false},
    {tripleStoreFieldID: "questionForm_showSurveyResultPane", exportImportID: "Show survey result", canBeTranslated: false},
    {tripleStoreFieldID: "questionForm_defaultLanguage", exportImportID: "Default language", canBeTranslated: false},
    {tripleStoreFieldID: "questionForm_languageChoiceQuestion_text", exportImportID: "Language choice question", canBeTranslated: false},
    {tripleStoreFieldID: "questionForm_languageChoiceQuestion_choices", exportImportID: "Additional languages", canBeTranslated: false},
    {tripleStoreFieldID: "questionForm_customCSS", exportImportID: "Custom CSS", canBeTranslated: false},
    {tripleStoreFieldID: "questionForm_customCSSForPrint", exportImportID: "Custom CSS for Printing", canBeTranslated: false}
]
const prefixLength = "questionForm_".length;
formFieldsInfo.forEach((field) => { field.objectFieldID = field.tripleStoreFieldID.substr(prefixLength); });

const displayTypeToValueTypeMap = {
    // Used in survey and in other parts of the application
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// converting from tripleStore format to object format
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function convertEditorQuestions(editorQuestions, prefixQPA) {
    const adjustedQuestions = [];
    let valueOptions;
    let displayConfiguration;
    
    for (let questionIndex = 0; questionIndex < editorQuestions.length; questionIndex++) {
        const question = editorQuestions[questionIndex];

        // Including "S_" or "P_" or "A_" prefix for user-supplied question ID to prevent collisions with application fields like storyText and JavaScript functions and __proto__
        const prefixToKeyPrefixMap = {"S_": "storyQuestion_", "P_": "participantQuestion_", "A_": "annotationQuestion_"}
        const keyPrefix = prefixToKeyPrefixMap[prefixQPA];
        
        const shortName = question[keyPrefix + "shortName"];
        const id = prefixQPA + shortName;
        const questionType = question[keyPrefix + "type"];
        const prompt = question[keyPrefix + "text"];
        const writeInTextBoxLabel = question[keyPrefix + "writeInTextBoxLabel"];

        let options = [];
        const optionsString = question[keyPrefix + "options"];
        if (optionsString) {
            // TODO: Improve option handling so can have standard IDs for options
            const splitOptions = optionsString.split("\n");
            options = splitOptions.map(function(option) { if (option.trim()) return option.trim(); })
        }

        let optionImageLinks = [];
        const optionImageLinksString = question[keyPrefix + "optionImageLinks"];
        if (optionImageLinksString) {
            const splitOptionImageLinks = optionImageLinksString.split("\n");
            optionImageLinks = splitOptionImageLinks.map(function(link) { if (link.trim()) return link.trim(); })
        }
        const optionImagesWidth = question[keyPrefix + "optionImagesWidth"];

        const valueType = displayTypeToValueTypeMap[questionType];
        if (!valueType) console.log("ERROR: Could not resolve valueType for ", question);

        // default valueOptions and displayConfiguration to undefined so no object fields will appear set for these if not otherwise set
        valueOptions = undefined;
        if (["select", "radiobuttons", "checkboxes"].indexOf(questionType) >= 0) {
            valueOptions = options;
        } 

        // use displayConfiguration for configuration options that are specific to the question type
        displayConfiguration = undefined;
        if (questionType === "slider") {
            if (options.length === 1) {
                displayConfiguration = options[0];
            } else if (options.length > 1) {
                displayConfiguration = options;
            }
        } else if (questionType === "text") {
            displayConfiguration = !isNaN(Number(question[keyPrefix + "textBoxLength"])) ? question[keyPrefix + "textBoxLength"] : "";
        } else if (questionType === "select") {
            displayConfiguration = !isNaN(Number(question[keyPrefix + "listBoxRows"])) ? question[keyPrefix + "listBoxRows"] : "";
        } else if (questionType === "checkboxes") {
            displayConfiguration = !isNaN(Number(question[keyPrefix + "maxNumAnswers"])) ? question[keyPrefix + "maxNumAnswers"] : "";
        }

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

        adjustedQuestions.push({
            id: id, 
            valueType: valueType,
            displayName: shortName, 
            displayPrompt: prompt,
            displayType: questionType,
            valueOptions: valueOptions, 
            optionImageLinks: optionImageLinks,
            optionImagesWidth: optionImagesWidth,
            displayConfiguration: displayConfiguration,
            writeInTextBoxLabel: writeInTextBoxLabel,
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
    const result = [];
    for (let i = 0; i < elicitingQuestions.length; i++) {
        result.push( {
            text: elicitingQuestions[i].elicitingQuestion_text,
            id: elicitingQuestions[i].elicitingQuestion_shortName,
            "type": elicitingQuestions[i].elicitingQuestion_type,
            importName: elicitingQuestions[i].elicitingQuestion_dataColumnName,
        });
    }
    ensureAtLeastOneElicitingQuestion(result);
    return result;
}

export function ensureAtLeastOneElicitingQuestion(elicitingQuestions) {
    // TODO: How to prevent this potential problem of no eliciting questions during questionnaire design in GUI?
    if (elicitingQuestions.length === 0) {
        // TODO: Translate
        const defaultElicitingQuestion = "What happened?";
        const message = 'No eliciting questions were defined! Adding "' + defaultElicitingQuestion + '".';
        console.log("PROBLEM", message);
        console.log("Adding eliciting question: ", defaultElicitingQuestion);
        elicitingQuestions.push( {
            text: defaultElicitingQuestion,
            id: defaultElicitingQuestion,
            type: {"what happened": true}
        });
    }
}

export function getStoryNameAndTextQuestions() {
    const result = [];
    result.unshift({
        id: "storyName",
        displayName: "Story title",
        displayPrompt: "Please give your story a name",
        displayType: "text",
        displayConfiguration: "20",
        valueOptions: [],
    });
    result.unshift({
        id: "storyText",
        displayName: "Story text",
        displayPrompt: "Please enter your response to the question above in the space below",
        displayType: "textarea",
        valueOptions: [],
    });
    return result;
}

export function getLeadingStoryQuestions(elicitingQuestions) {  
    const result = getStoryNameAndTextQuestions();

    // TODO: What about idea of having IDs that go with eliciting questions so store reference to ID not text prompt?
    const elicitingQuestionValues = [];
    for (let elicitingQuestionIndex = 0; elicitingQuestionIndex < elicitingQuestions.length; elicitingQuestionIndex++) {
        const elicitingQuestionSpecification = elicitingQuestions[elicitingQuestionIndex];
        // elicitingQuestionValues.push({value: elicitingQuestionSpecification.id, text: elicitingQuestionSpecification.label});
        elicitingQuestionValues.push(elicitingQuestionSpecification.id || elicitingQuestionSpecification.shortName || elicitingQuestionSpecification.text);
    }

    result.unshift({
        id: "elicitingQuestion",
        displayName: "Eliciting question",
        displayPrompt: "Please choose a question you would like to respond to",
        displayType: "select",
        valueOptions: elicitingQuestionValues,
    });
    
    return result;
}

function buildShortNamesToQuestionIDsDictionary(questionIDsListName, shortNameField: string) {
    const project = Globals.project();
    const questionIDsList = project.getListForField(questionIDsListName);
    const result = {};
    questionIDsList.forEach(function (questionID) {
        const shortName = project.tripleStore.queryLatestC(questionID, shortNameField);
        result[shortName] = questionID;
    });
    return result;
}

function buildQuestionsFromQuestionChoiceIDs(questionChoiceIDs, shortNameField, shortNamesToQuestionIDsDictionary) {
    const project = Globals.project();
    const result = [];
    questionChoiceIDs.forEach(function (questionChoiceID) {
        // TODO: Fix access here for tripleStore use
        const shortName = project.tripleStore.queryLatestC(questionChoiceID, shortNameField);
        const order = project.tripleStore.queryLatestC(questionChoiceID, "order");
        const questionID = shortNamesToQuestionIDsDictionary[shortName];
        if (questionID) {
            // Retrieve the latest for all the fields of the object (which will include deleted/null fields)
            // TODO: Remove any deleted/null fields
            const question = project.tripleStore.makeObject(questionID, true);
            question.order = order;
            question.id = shortName;
            result.push(question);
        } else {
            console.log("Editing error: Missing question definition for ", questionChoiceID);
        }
    });
    result.sort(function(a, b) {
        // in legacy data, the "order" field could have letters in it
        if (!isNaN(Number(a.order)) && !isNaN(Number(b.order))) {
            if (Number(a.order) < Number(b.order)) return -1;
            if (Number(a.order) > Number(b.order)) return 1;
            return 0;
        } else {
            if (a.order.toLowerCase() < b.order.toLowerCase()) return -1;
            if (a.order.toLowerCase() > b.order.toLowerCase()) return 1;
            return 0;
        }
    });
    return result;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// handling translation dictionaries
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function buildTranslationDictionariesFromIDs(dictIDs) {
    const project = Globals.project();
    const result = {};
    dictIDs.forEach(function (dictID) {
        const storedDictionary = project.tripleStore.makeObject(dictID, true);
        if (storedDictionary && storedDictionary.defaultText) {
            result[storedDictionary.defaultText] = storedDictionary;
        }
    });
    return result;
}

export function translateableTextsInStoryForm(storyForm, section = undefined) {
    const result = [];
    if (!section || section === "Eliciting questions") {
        storyForm.elicitingQuestions.forEach((question) => { result.push(question.text); });
    }
    const questionListsToConsider = [];
    if (!section || section === "Story questions") { questionListsToConsider.push(storyForm.storyQuestions); }
    if (!section || section === "Participant questions") { questionListsToConsider.push(storyForm.participantQuestions); }
    questionListsToConsider.forEach((questionList) => {
        questionList.forEach((question) => { 
            result.push(question.displayPrompt); 
            if (question.displayType === "slider") {
                question.displayConfiguration.forEach((option) => { result.push(option); });
            } else if (question.valueOptions) {
                question.valueOptions.forEach((option) => { result.push(option); });
            }
        });
    });
    formFieldsInfo.forEach((fieldInfo) => {
        if (fieldInfo.canBeTranslated) {
            if (!section || fieldInfo.section === section) {
                let textToTranslate = storyForm[fieldInfo.objectFieldID];
                if (!textToTranslate) textToTranslate = surveyBuilderMithril.defaultFormTexts[fieldInfo.objectFieldID];
                if (textToTranslate) result.push(textToTranslate);
            }
        }
    });
    return result;
}

export function explanationForFormFieldOrQuestion(storyForm, text) {
    let result = explanationForFormField(storyForm, text);
    if (!result) result = explanationForQuestionText(storyForm, text);
    return result;
}

function explanationForFormField(storyForm, text) {
    for (let i = 0; i < formFieldsInfo.length; i++) {
        const fieldInfo = formFieldsInfo[i];
        if (fieldInfo.canBeTranslated && fieldInfo.explanation) {
            if (storyForm[fieldInfo.objectFieldID] === text || surveyBuilderMithril.defaultFormTexts[fieldInfo.objectFieldID] === text) {
                return fieldInfo.explanation;
            }
        }
    }
    return null;
}

function explanationForQuestionText(storyForm, text) {
    for (let i = 0; i < storyForm.elicitingQuestions.length; i++) {
        const question = storyForm.elicitingQuestions[i];
        if (question.text === text) { 
            return "Question: " + question.id; // this is the shortName, not the uuid
        } 
    }
    let questionsToConsider = [];
    questionsToConsider = questionsToConsider.concat(storyForm.storyQuestions, storyForm.participantQuestions);
    for (let i = 0; i < questionsToConsider.length; i++) {
        const question = questionsToConsider[i];
        if (question.displayPrompt === text) {
            return "Question: " + question.displayName; // also the shortName
        }
    }
    return null;
}

export function orphanedTranslationsForStoryForm(storyForm) {
    const textsInForm = translateableTextsInStoryForm(storyForm);
    if (textsInForm.length == 0) return [];

    if (!storyForm.translationDictionary) return [];
    const textsInTranslationDictionary = Object.keys(storyForm.translationDictionary);
    
    const orphanedTexts = [];
    textsInTranslationDictionary.forEach((text) => {
        if (textsInForm.indexOf(text) < 0) {
            orphanedTexts.push(text);
        }
    });
    return orphanedTexts;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// building the story form 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// TODO: How to save the fact we have exported this in the project? Make a copy??? Or keep original in document somewhere? Versus what is returned from server for surveys?
export function buildStoryForm(shortName) {
    const project = Globals.project();
    const storyFormID = project.findStoryFormID(shortName);
    if (!storyFormID) return null;
    return buildStoryFormUsingTripleStoreID(storyFormID, shortName);
}

export function buildStoryFormUsingTripleStoreID(storyFormTripleStoreID: string, shortName) {
    const project = Globals.project();
    const usedIDs = { __createdIDCount: 0 };

    const template: StoryFormTemplate = {};
    formFieldsInfo.forEach((fieldInfo) => {
        template[fieldInfo.tripleStoreFieldID] = fieldInfo.default ? fieldInfo.default : "";
    });
    template.__type = "org.workingwithstories.Questionnaire";
    template.id = storyFormTripleStoreID; 
    template.questionForm_shortName = shortName;
    template.questionForm_elicitingQuestions = project.tripleStore.newIdForSet("ElicitingQuestionChoiceSet");
    template.questionForm_storyQuestions = project.tripleStore.newIdForSet("StoryQuestionChoiceSet");
    template.questionForm_participantQuestions = project.tripleStore.newIdForSet("ParticipantQuestionChoiceSet");
    setDefaultImportFieldsForTemplate(template);

    const storyForm: StoryFormFields = {};
    formFieldsInfo.forEach((fieldInfo) => {
        if (template[fieldInfo.tripleStoreFieldID]) {
            storyForm[fieldInfo.objectFieldID] = template[fieldInfo.tripleStoreFieldID];
        } else if (fieldInfo.default) {
            storyForm[fieldInfo.objectFieldID] = fieldInfo.default;
        } else {
            storyForm[fieldInfo.objectFieldID] = "";
        }
    });

    storyForm.id = storyFormTripleStoreID;
    storyForm.shortName = project.tripleStore.queryLatestC(storyFormTripleStoreID, "questionForm_shortName"); // special handling
    formFieldsInfo.forEach((fieldInfo) => {
        if (fieldInfo.objectFieldID) {
            storyForm[fieldInfo.objectFieldID] = project.tripleStore.queryLatestC(storyFormTripleStoreID, fieldInfo.tripleStoreFieldID);
        }
    });
    getStoredImportFieldsForStoryForm(project, storyFormTripleStoreID, storyForm);
    
    const translationDictIDs = project.tripleStore.getListForSetIdentifier(project.tripleStore.queryLatestC(storyFormTripleStoreID, "questionForm_translationDictionary"));
    storyForm.translationDictionary = buildTranslationDictionariesFromIDs(translationDictIDs);

    const projectElicitingQuestionShortNamesMappedToIDs = buildShortNamesToQuestionIDsDictionary("project_elicitingQuestionsList", "elicitingQuestion_shortName");
    const formElicitingQuestionChoiceIDs = project.tripleStore.getListForSetIdentifier(project.tripleStore.queryLatestC(storyFormTripleStoreID, "questionForm_elicitingQuestions"));
    const elicitingQuestions = buildQuestionsFromQuestionChoiceIDs(formElicitingQuestionChoiceIDs, "elicitingQuestion", projectElicitingQuestionShortNamesMappedToIDs);       
    storyForm.elicitingQuestions = convertElicitingQuestions(elicitingQuestions);
    
    const projectStoryQuestionShortNamesMappedToIDs = buildShortNamesToQuestionIDsDictionary("project_storyQuestionsList", "storyQuestion_shortName");
    const formStoryQuestionChoiceIDs = project.tripleStore.getListForSetIdentifier(project.tripleStore.queryLatestC(storyFormTripleStoreID, "questionForm_storyQuestions"));
    const storyQuestions = buildQuestionsFromQuestionChoiceIDs(formStoryQuestionChoiceIDs, "storyQuestion", projectStoryQuestionShortNamesMappedToIDs);       
    ensureUniqueQuestionIDs(usedIDs, storyQuestions);
    storyForm.storyQuestions = convertEditorQuestions(storyQuestions, "S_");
    
    const projectParticipantQuestionShortNamesMappedToIDs = buildShortNamesToQuestionIDsDictionary("project_participantQuestionsList", "participantQuestion_shortName");
    const formParticipantQuestionChoiceIDs = project.tripleStore.getListForSetIdentifier(project.tripleStore.queryLatestC(storyFormTripleStoreID, "questionForm_participantQuestions"));
    const participantQuestions = buildQuestionsFromQuestionChoiceIDs(formParticipantQuestionChoiceIDs, "participantQuestion", projectParticipantQuestionShortNamesMappedToIDs);       
    ensureUniqueQuestionIDs(usedIDs, participantQuestions);      
    storyForm.participantQuestions = convertEditorQuestions(participantQuestions, "P_");
    
    return storyForm;
}

export function setDefaultImportFieldsForTemplate(template) {
    template.import_minScaleValue = 0;
    template.import_maxScaleValue = 0;
    template.import_multiChoiceYesIndicator = "Yes";
    template.import_multiChoiceYesQASeparator = "";
    template.import_multiChoiceYesQAEnding = "";
    template.import_multiChoiceDelimiter = ";";
    template.import_storyTitleColumnName = "Story title";
    template.import_storyTextColumnName = "Story text";
    template.import_storyCollectionDateColumnName = "Collection date";
    template.import_storyFormLanguageColumnName = "Language";
    template.import_participantIDColumnName = "Participant ID";
    template.import_columnsToIgnore = [];
    template.import_columnsToAppendToStoryText = "";
    template.import_textsToWriteBeforeAppendedColumns = "";
    template.import_minWordsToIncludeStory = "0";
    template.import_stringsToRemoveFromHeaders = "";
    template.import_elicitingQuestionColumnName = "Eliciting question";
    template.import_elicitingQuestionGraphName = "Eliciting question";
}

export function getStoredImportFieldsForStoryForm(project, id, storyForm) {
    storyForm.import_minScaleValue = project.tripleStore.queryLatestC(id, "questionForm_import_minScaleValue"); 
    storyForm.import_maxScaleValue = project.tripleStore.queryLatestC(id, "questionForm_import_maxScaleValue"); 
    storyForm.import_multiChoiceYesQASeparator = project.tripleStore.queryLatestC(id, "questionForm_import_multiChoiceYesQASeparator"); 
    storyForm.import_multiChoiceYesQAEnding = project.tripleStore.queryLatestC(id, "questionForm_import_multiChoiceYesQAEnding"); 
    storyForm.import_multiChoiceYesIndicator = project.tripleStore.queryLatestC(id, "questionForm_import_multiChoiceYesIndicator"); 
    storyForm.import_multiChoiceDelimiter = project.tripleStore.queryLatestC(id, "questionForm_import_multiChoiceDelimiter"); 
    storyForm.import_storyTitleColumnName = project.tripleStore.queryLatestC(id, "questionForm_import_storyTitleColumnName"); 
    storyForm.import_storyTextColumnName = project.tripleStore.queryLatestC(id, "questionForm_import_storyTextColumnName"); 
    storyForm.import_storyCollectionDateColumnName = project.tripleStore.queryLatestC(id, "questionForm_import_storyCollectionDateColumnName"); 
    storyForm.import_storyFormLanguageColumnName = project.tripleStore.queryLatestC(id, "questionForm_import_storyFormLanguageColumnName"); 
    storyForm.import_elicitingQuestionColumnName = project.tripleStore.queryLatestC(id, "questionForm_import_elicitingQuestionColumnName"); 
    storyForm.elicitingQuestionGraphName = project.tripleStore.queryLatestC(id, "import_elicitingQuestionGraphName");
    storyForm.import_minWordsToIncludeStory = project.tripleStore.queryLatestC(id, "questionForm_import_minWordsToIncludeStory"); 
    storyForm.import_stringsToRemoveFromHeaders = project.tripleStore.queryLatestC(id, "questionForm_import_stringsToRemoveFromHeaders"); 
    storyForm.import_participantIDColumnName = project.tripleStore.queryLatestC(id, "questionForm_import_participantIDColumnName"); 
    storyForm.import_columnsToIgnore = project.tripleStore.queryLatestC(id, "questionForm_import_columnsToIgnore"); 
    storyForm.import_columnsToAppendToStoryText = project.tripleStore.queryLatestC(id, "questionForm_import_columnsToAppendToStoryText"); 
    storyForm.import_textsToWriteBeforeAppendedColumns = project.tripleStore.queryLatestC(id, "questionForm_import_textsToWriteBeforeAppendedColumns"); 
}

function ensureUniqueQuestionIDs(usedIDs, editorQuestions) {
    // Validate the survey ids to prevent duplicates and missing ones; ideally this should be done in GUI somehow
    for (let index in editorQuestions) {
        const editorQuestion = editorQuestions[index];
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

