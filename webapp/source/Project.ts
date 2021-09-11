import PointrelClient = require("./pointrel20150417/PointrelClient");
import surveyCollection = require("./surveyCollection");
import TripleStore = require("./pointrel20150417/TripleStore");
import PanelSpecificationCollection = require("./panelBuilder/PanelSpecificationCollection");
import questionnaireGeneration = require("./questionnaireGeneration");

"use strict";

const serverURL = "/api/pointrel20150417";

// TODO: Rethink this as a more general way to watch models within the project (so, with arbitrary object IDs, not just the project ID)

class Project {

    journalIdentifier: string;
    projectIdentifier: string;
    pointrelClient: PointrelClient;
    tripleStore: TripleStore;
    redrawCallback: Function;

    userIdentifier: any;
    readOnly: boolean = false;
    currentUserHasAdminAccess: boolean = false;
    currentUserIsSuperUser: boolean = false;

    static default_minimumStoryCountRequiredForTest = 20;
    static default_minimumStoryCountRequiredForGraph = 1;
    static default_numHistogramBins = 20;
    static default_numScatterDotOpacityLevels = 3;
    static default_scatterDotSize = 8;
    static default_correlationMapShape = "line with arcs";
    static default_correlationMapIncludeScaleEndLabels = "only when there is no choice question";
    static default_correlationMapCircleDiameter = 300;
    static default_correlationLineChoice = "0.05";
    static default_customLabelLengthLimit = "30";
    static default_customReportGraphWidth = 800;
    static default_customDisplayGraphWidth = 800;
    static default_customGraphPadding = 0;
    static default_numStoryLengthCategories = 4;
    static default_graphTypesToCreate = {
        "data integrity graphs": false,
        "texts": false,
        "write-in texts": false,
        "bar graphs": false,
        "histograms": false,
        "tables": false,
        "contingency-histogram tables": false,
        "multiple histograms": false,
        "scatterplots": false,
        "multiple scatterplots": false,
        "correlation maps": false
    }

    // The activeQuestionnaires field tracks what should be available to survey users and to construct related messages
    activeQuestionnaires = {};
    
    constructor(journalIdentifier, projectIdentifier, userIdentifier, updateServerStatus, redrawCallback) {
        this.journalIdentifier = journalIdentifier;
        this.projectIdentifier = projectIdentifier;
        this.userIdentifier = userIdentifier;
        this.redrawCallback = redrawCallback;
    
        this.pointrelClient = new PointrelClient(serverURL, this.journalIdentifier, this.userIdentifier, this.receivedMessage.bind(this), updateServerStatus);
        
        // For now, listen on all topics in the journal
        // TODO: Think about how to move topicIdentifier into pointrelClient initialization
        // const topicIdentifier = "project001";
        // pointrelClient.topicIdentifier = topicIdentifier;
        
        this.tripleStore = new TripleStore(this.pointrelClient, "narrafirmaProject");
        // console.log("tripleStore", this.tripleStore);
        
        // Redraw on any new tripleStore message (however, the ones we send will not get callbacks)
        this.tripleStore.subscribe(undefined, undefined, undefined, this.redrawCallback.bind(this));
    }

    startup(callback) {
        this.pointrelClient.reportJournalStatus((error, response) => {
            console.log("reportJournalStatus response", error, response);
            if (error) {
                console.log("Failed to startup project", error);
                callback(error);
            } else {
                this.pointrelClient.startup();
                this.currentUserIsSuperUser = response.permissions.superUser;
                callback(null, response);
            }
        });
    }

    projectName() {
        return this.journalIdentifier.substring("NarraFirmaProject-".length);
    }

    projectNameOrNickname() {
        const nickname = this.tripleStore.queryLatestC(this.projectIdentifier, "projectOptions_projectNickname");
        if (nickname) {
            return nickname;
        } else {
            return this.projectName();
        }
    }

    projectNameAndNickname() {
        const nickname = this.tripleStore.queryLatestC(this.projectIdentifier, "projectOptions_projectNickname");
        if (nickname) {
            return this.projectName() + ' (' + nickname + ')';
        } else {
            return this.projectName();
        }
    }
    
    // TODO: Redundant code with what is in GridWithItemPanel
    getListForField(fieldName) {
        const setIdentifier = this.getFieldValue(fieldName);
        return this.tripleStore.getListForSetIdentifier(setIdentifier);
    }
    
    getFieldValue(fieldName) {
        return this.tripleStore.queryLatestC(this.projectIdentifier, fieldName);
    }
    
    setFieldValue(fieldName, newValue, oldValue = undefined) {
        // TODO: Need to add support in tripleStore for oldValue; note callback is the fourth parameter
        this.tripleStore.addTriple(this.projectIdentifier, fieldName, newValue);
    }

    fieldValue(fieldName, newValue = undefined) {
        if (newValue === undefined) {
            return this.getFieldValue(fieldName);
        } else {
            return this.setFieldValue(fieldName, newValue);
        }
    }
    
    // TODO: What do do about this function? Especially if want to track chat messages or log messages or undoable changes for project?
    receivedMessage(message) {
        // console.log("Project receivedMessage", message);
        
        if (message.change && message.change.action === "addTriple") {
            // Ignore addTriple messages as we handle only the ones we did not send via a subscription
            // console.log("Ignoring tripleStore message", message);
            return;
        }
        
        if (message.messageType === "questionnairesMessage") {
            // console.log("Project receivedMessage questionnairesMessage", message);
            surveyCollection.updateActiveQuestionnaires(message.change, false, null);
        }

        // Since this event came from the network, queue a Mithril redraw
        // The tripleStore may not be updated yet, so this redraw needs to get queued for later by the application
        if (this.redrawCallback) {
            // console.log("project calling redrawCallback");
            this.redrawCallback();
        }
    }

    // Project-specific data lookup
    
    findCatalysisReport(shortName) {
        const catalysisReports = this.tripleStore.queryLatestC(this.projectIdentifier, "project_catalysisReports");
        if (!catalysisReports) return null;
        const catalysisReportIdentifiers = this.tripleStore.getListForSetIdentifier(catalysisReports);
        for (let i = 0; i < catalysisReportIdentifiers.length; i++) {
            const reportShortName = this.tripleStore.queryLatestC(catalysisReportIdentifiers[i], "catalysisReport_shortName");
            if (reportShortName === shortName) {
                return catalysisReportIdentifiers[i];
            }
        }
        return null;
    }

    findStoryFormID(shortName): string {
        const storyFormIDs: Array<string> = this.getListForField("project_storyForms");
        for (let i = 0; i < storyFormIDs.length; i++) {
            const formShortName = this.tripleStore.queryLatestC(storyFormIDs[i], "questionForm_shortName");
            if (formShortName === shortName) {
                return storyFormIDs[i];
            }
        }
        return null;
    }
    
    findStoryCollectionID(shortName): string {
        const storyCollections: Array<string> = this.getListForField("project_storyCollections");
        for (let i = 0; i < storyCollections.length; i++) {
            if (this.tripleStore.queryLatestC(storyCollections[i], "storyCollection_shortName") === shortName) {
                return storyCollections[i];
            }
        }
        return null;
    }
    
    private collectAllQuestionsForQuestionList(questionListName: string) {
        const questionIdentifiers: Array<string> = this.getListForField(questionListName);
        const questions = [];
        questionIdentifiers.forEach((questionIdentifier) => {
            const question = this.tripleStore.makeObject(questionIdentifier, true);
            if (!question.id) question.id = questionIdentifier;
            questions.push(question);
        });
        return questions;
    }
    
    collectAllElicitingQuestions() {
        const questions = this.collectAllQuestionsForQuestionList("project_elicitingQuestionsList");
        return questions;
    }
    
    collectAllStoryQuestions() {
        const questions = this.collectAllQuestionsForQuestionList("project_storyQuestionsList");
        return questions;
    }
    
    collectAllParticipantQuestions() {
        const questions = this.collectAllQuestionsForQuestionList("project_participantQuestionsList");
        return questions;
    }
    
    collectAllAnnotationQuestions() {
        const questions = this.collectAllQuestionsForQuestionList("project_annotationQuestionsList");
        return questions;
    }

    collectAllQuestionsOfAnyKind() {
        let questions = [];
        questions = questions.concat(
            this.collectAllElicitingQuestions(), 
            this.collectAllStoryQuestions(), 
            this.collectAllParticipantQuestions(), 
            this.collectAllAnnotationQuestions()
        )
        return questions;
    }

    questionsForCategory(questionCategory: string) {
        switch (questionCategory) {
            case "elicitingQuestion":
                return this.collectAllElicitingQuestions();
            case "storyQuestion":
                return this.collectAllStoryQuestions();
            case "participantQuestion":
                return this.collectAllParticipantQuestions();
            case "annotationQuestion":
                return this.collectAllAnnotationQuestions();
            default:
                throw new Error("Unexpected question category: " + questionCategory);
        }
    }

    addQuestionForCategory(question, questionCategory: string) {
        let questionListName;
        let questionClass;
        
        switch (questionCategory) {
            case "elicitingQuestion":
                questionListName = "project_elicitingQuestionsList";
                questionClass = "ElicitingQuestion";
                break;
            case "storyQuestion":
                questionListName = "project_storyQuestionsList";
                questionClass = "StoryQuestion";
                break;
            case "participantQuestion":
                questionListName = "project_participantQuestionsList";
                questionClass = "ParticipantQuestion";
                break;
            case "annotationQuestion":
                questionListName = "project_annotationQuestionsList";
                questionClass = "AnnotationQuestion";
                break;
            default:
                throw new Error("Unexpected question category: " + questionCategory);
        }
        
        let setIdentifier = this.getFieldValue(questionListName);
        if (!setIdentifier) {
            // Need to create list
            setIdentifier = this.tripleStore.newIdForSet(questionClass + "Set");
            // console.log("Making set for ", questionListName, setIdentifier); 
            this.setFieldValue(questionListName, setIdentifier);
        }
        this.tripleStore.makeNewSetItem(setIdentifier, questionClass, question);
    }

    deleteQuestionInCategory(question, questionCategory: string) {
        let questionListName;
        let questionClass;
        
        switch (questionCategory) {
            case "elicitingQuestion":
                questionListName = "project_elicitingQuestionsList";
                questionClass = "ElicitingQuestion";
                break;
            case "storyQuestion":
                questionListName = "project_storyQuestionsList";
                questionClass = "StoryQuestion";
                break;
            case "participantQuestion":
                questionListName = "project_participantQuestionsList";
                questionClass = "ParticipantQuestion";
                break;
            case "annotationQuestion":
                questionListName = "project_annotationQuestionsList";
                questionClass = "AnnotationQuestion";
                break;
            default:
                throw new Error("Unexpected question category: " + questionCategory);
        }

        // sometimes questions are missing ids? not sure why
        if (!question.id) {
            question.id = this.questionIDForQuestionShortNameGivenQuestionCategory(question.shortName, questionCategory);
        }
        
        let setIdentifier = this.getFieldValue(questionListName);
        if (!setIdentifier) {
            // Need to create list
            setIdentifier = this.tripleStore.newIdForSet(questionClass + "Set");
            // console.log("Making set for ", questionListName, setIdentifier); 
            this.setFieldValue(questionListName, setIdentifier);
        }
        this.tripleStore.deleteSetItem(setIdentifier, question.id);
    }

    addOptionToAnnotationChoiceQuestion(questionID, newAnswer) {
        const annotationQuestions = this.collectAllAnnotationQuestions();
        for (let i = 0; i < annotationQuestions.length; i++) {
            const aQuestion = annotationQuestions[i];
            if ("A_" + aQuestion.annotationQuestion_shortName == questionID) {
                if (!aQuestion.annotationQuestion_options) aQuestion.annotationQuestion_options = "";
                const parts = aQuestion.annotationQuestion_options.split("\n");
                if (parts.indexOf(newAnswer) < 0) {
                    parts.push(newAnswer);
                    aQuestion.annotationQuestion_options = parts.join("\n");
                    if (aQuestion.id) {
                        this.tripleStore.addTriple(aQuestion.id, "annotationQuestion_options", aQuestion.annotationQuestion_options);
                    }
                }
            }
        }
    }

    allQuestionsThatCouldBeGraphedForCatalysisReport(catalysisReportIdentifier, considerExclusions = true) {
        const elicitingQuestions = this.elicitingQuestionsForCatalysisReport(catalysisReportIdentifier);
        const numStoriesToldQuestions = this.numStoriesToldQuestionsForCatalysisReport(catalysisReportIdentifier);
        const storyLengthQuestions = this.storyLengthQuestionsForCatalysisReport(catalysisReportIdentifier);
        const collectionDateQuestions = this.collectionDateQuestionsForCatalysisReport(catalysisReportIdentifier);
        const languageQuestions = this.languageQuestionsForCatalysisReport(catalysisReportIdentifier);
        const storyQuestions = this.storyQuestionsForCatalysisReport(catalysisReportIdentifier); 
        const participantQuestions = this.participantQuestionsForCatalysisReport(catalysisReportIdentifier);
        const annotationQuestions = questionnaireGeneration.convertEditorQuestions(this.collectAllAnnotationQuestions(), "A_");
        let allQuestions = [];
        allQuestions = allQuestions.concat(elicitingQuestions, numStoriesToldQuestions, storyLengthQuestions, collectionDateQuestions, languageQuestions, storyQuestions, participantQuestions, annotationQuestions);
        
        if (considerExclusions) {
            const questionIDsToInclude = this.tripleStore.queryLatestC(catalysisReportIdentifier, "questionsToInclude"); 
            const result = [];
            allQuestions.forEach( function(question) {
                if (questionIDsToInclude && questionIDsToInclude[question.id]) {
                    result.push(question);
                }
            });
            return result;
        } else {
            return allQuestions;
        }
    }

    numStoryCollectionsInCatalysisReport(catalysisReportIdentifier) {
        const storyCollectionsIdentifier = this.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_storyCollections");
        const storyCollectionItems = this.tripleStore.getListForSetIdentifier(storyCollectionsIdentifier);
        return storyCollectionItems.length;
    }

    storiesForCatalysisReport(catalysisReportIdentifier, showWarnings = false) {
        // the reason to have showWarnings is that this method gets called twice on the configure report page (once by the filter warning and once by the questions chooser)
        let result = [];
        const storyCollectionsIdentifier = this.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_storyCollections");
        const storyCollectionItems = this.tripleStore.getListForSetIdentifier(storyCollectionsIdentifier);
        if (storyCollectionItems.length === 0) return [];
        const filter = this.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_filter");
        if (filter) {
            return this.storiesForCatalysisReportWithFilter(catalysisReportIdentifier, storyCollectionItems, filter.trim(), showWarnings);
        } else {
            storyCollectionItems.forEach((storyCollectionPointer) => {
                if (!storyCollectionPointer) {
                    console.log("ERROR: null or undefined story collection pointer in catalysis report ", catalysisReportIdentifier);
                } else {
                    const storyCollectionIdentifier = this.tripleStore.queryLatestC(storyCollectionPointer, "storyCollection");
                    const storiesForThisCollection = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier);
                    result = result.concat(storiesForThisCollection);
                }
            });
        }
        return result;
    }
    
    storiesForCatalysisReportWithFilter(catalysisReportIdentifier, storyCollectionItems, filter, showWarnings = false) {
        let result = [];
        storyCollectionItems.forEach((storyCollectionPointer) => {
            if (!storyCollectionPointer) {
                console.log("ERROR: null or undefined story collection pointer in catalysis report ", catalysisReportIdentifier);
            } else {
                const storyCollectionIdentifier = this.tripleStore.queryLatestC(storyCollectionPointer, "storyCollection");
                const storiesForThisCollection = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier);
                const questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);
                result = result.concat(storiesForThisCollection);
                const filterParts = filter.split("&&").map(function(item) {return item.trim()});
                for (let partIndex = 0; partIndex < filterParts.length; partIndex++) {
                    const filteredResult = this.storiesForStoryCollectionWithFilter(storyCollectionIdentifier, result, questionnaire, filterParts[partIndex], showWarnings);
                    result = filteredResult;
                }
            }
        }); 
        return result;
    }

    storiesForStoryCollectionWithFilter(storyCollectionIdentifier, storiesForThisCollection, questionnaire, filter, showWarnings = false) {
        let result = [];
        const questionAndAnswers = filter.split("==").map(function(item) {return item.trim()});
        let warningShown = false;
        let questionShortName = questionAndAnswers[0];

        let negateFilter = false;
        if (questionShortName[0] === "!") {
            negateFilter = true;
            questionShortName = questionShortName.slice(1);
        }

        const questionID = this.questionIDForQuestionShortNameGivenQuestionnaire(questionShortName, questionnaire);
        let question = this.questionForQuestionIDGivenQuestionnaire(questionID, questionnaire, storyCollectionIdentifier);
        let answers = [];
        let lowerLimit = undefined;
        let upperLimit = undefined;

        if (question) {
            answers = questionAndAnswers.slice(1);
            if (question.displayType == "boolean") {
                if (answers[0] != "yes" && answers[0] != "no") {
                    if (showWarnings && !warningShown) 
                        alert("This question (" + questionShortName + ") is a boolean question. The specified answer must be either yes or no.");
                    question = null;
                    warningShown = true;
                }
            } else if (question.displayType == "checkbox") {
                if (answers[0] != "true" && answers[0] != "false") {
                    if (showWarnings && !warningShown) 
                        alert("This question (" + questionShortName + ")  is a checkbox question. The specified answer must be either true or false.");
                    question = null;
                    warningShown = true;
                }
            } else if (question.displayType == "slider") { 
                lowerLimit = parseInt(answers[0]);
                if (isNaN(lowerLimit)) {
                    if (showWarnings && !warningShown) 
                        alert("This question (" + questionShortName + ") has a numerical range, and the lower limit you specified (" + answers[0] + ") doesn't seem to be a number.");
                    question = null;
                    warningShown = true;
                }
                if (answers.length > 1) {
                    upperLimit = parseInt(answers[1]);
                    if (isNaN(upperLimit)) {
                        if (showWarnings && !warningShown) 
                            alert("This question (" + questionShortName + ") has a numerical range, and the upper limit you specified (" + answers[1] + ") doesn't seem to be a number.");
                        question = null;
                        warningShown = true;
                    }
                } else { 
                    if (showWarnings && !warningShown) 
                        alert("This question (" + questionShortName + ") has a numerical range, but you only specified one number. You need to specify a lower and upper limit (inclusive).");
                    question = null;
                    warningShown = true;
                }
            }
        } else {
            if (showWarnings && !warningShown) 
                alert('No question used by the story collection "' + storyCollectionIdentifier + '" matches the name: ' + questionShortName);
            result = result.concat(storiesForThisCollection);
            warningShown = true;
        }

        if (question) {
            const storiesThatMatchFilter = [];
            for (let storyIndex = 0; storyIndex < storiesForThisCollection.length; storyIndex++) {
                const story = storiesForThisCollection[storyIndex];
                const value = story.fieldValue(question.id)
                let storyMatches = false;
                if (question.displayType == "boolean") {
                    storyMatches = (answers[0] == "yes" && value) || (answers[0] == "no" && !value);
                } else if (question.displayType == "checkbox") {
                    storyMatches = (answers[0] == "true" && value) || (answers[0] == "false" && !value);
                } else if (value !== undefined && value !== null && value !== {} && value !== "") {
                    if (question.displayType == "slider") {
                        const valueAsInt = parseInt(value);
                        if (valueAsInt >= lowerLimit && valueAsInt <= upperLimit) {
                            storyMatches = true;
                        }
                    } else if (typeof(value) == "string") { // select, radiobuttons
                        for (let answerIndex = 0; answerIndex < answers.length; answerIndex++) {
                            if (value.trim() == answers[answerIndex]) {
                                storyMatches = true;
                                break;
                            }
                        }
                    } else { // checkboxes
                        for (let answerIndex = 0; answerIndex < answers.length; answerIndex++) {
                            if (value[answers[answerIndex]] && value[answers[answerIndex]] == true) {
                                storyMatches = true;
                                break;
                            }
                        }
                    }
                }
                if (negateFilter) {
                    if (!storyMatches) {
                        storiesThatMatchFilter.push(story);
                    }
                } else {
                    if (storyMatches) {
                        storiesThatMatchFilter.push(story);
                    }
                }
            }
            result = result.concat(storiesThatMatchFilter);
        } // if question
        return result;
    }

    allStoriesInProject() {
        let result = [];
        const storyCollectionsIdentifier = this.tripleStore.queryLatestC(this.projectIdentifier, "project_storyCollections");
        const storyCollectionItems = this.tripleStore.getListForSetIdentifier(storyCollectionsIdentifier);
        if (storyCollectionItems.length === 0) return [];

        storyCollectionItems.forEach((storyCollectionPointer) => {
            if (!storyCollectionPointer) {
                console.log("ERROR: null or undefined story collection pointer");
            } else {
                const storyCollectionName = this.tripleStore.queryLatestC(storyCollectionPointer, "storyCollection_shortName");
                const storiesForThisCollection = surveyCollection.getStoriesForStoryCollection(storyCollectionName);
                result = result.concat(storiesForThisCollection);
            }
        });
        return result;
    }

    questionIDForQuestionShortNameGivenQuestionnaire(questionShortName, questionnaire) {
        // to add correct prefix (S_, P_, A_) to question name supplied by user (for catalysis report filter)
        if (questionShortName == "Eliciting question") {
            return "elicitingQuestion";
        }
        // not an eliciting question, check story questions next
        for (let i = 0; i < questionnaire.storyQuestions.length; i++) {
            if (questionnaire.storyQuestions[i].displayName == questionShortName) {
                return questionnaire.storyQuestions[i].id;
            }
        }
        // not eliciting or story question, check participant questions next
        for (let i = 0; i < questionnaire.participantQuestions.length; i++) {
            if (questionnaire.participantQuestions[i].displayName == questionShortName) {
                return questionnaire.participantQuestions[i].id;
            }
        }
        // must be an annotation question - these are ID'd differently
        return "A_" + questionShortName;
    }

    questionIDForQuestionShortNameGivenQuestionCategory(questionShortName, questionCategory) {
        // to add correct prefix (S_, P_, A_) to question name supplied by user (for catalysis report filter)
        switch (questionCategory) {
            case "elicitingQuestion":
                return "elicitingQuestion";
            case "storyQuestion":
                return "S_" + questionShortName;
            case "participantQuestion":
                return "P_" + questionShortName;
            case "annotationQuestion":
                return "A_" + questionShortName;
            default:
                throw new Error("Unexpected question category: " + questionCategory);
        } 
    }

    questionForQuestionIDGivenQuestionnaire(questionID, questionnaire, storyCollectionIdentifier) {
        if (!questionID) return null;
        if (questionID == "elicitingQuestion") {
            return this.elicitingQuestionForStoryCollection(storyCollectionIdentifier);
        }
        for (let index in questionnaire.storyQuestions) {
            const question = questionnaire.storyQuestions[index];
            if (question.id === questionID) return question;
        }
        for (let index in questionnaire.participantQuestions) {
            const question = questionnaire.participantQuestions[index];
            if (question.id === questionID) return question;
        }
        const annotationQuestions = this.collectAllAnnotationQuestions();
        for (let index in annotationQuestions) {
            const question = annotationQuestions[index];
            if ("A_" + question.annotationQuestion_shortName === questionID) return question;
        }
        console.log("ERROR: question not found for id", questionID);
        return null;
    }

    elicitingQuestionForStoryCollection(storyCollectionIdentifier) {
        let convertedElicitingQuestion = null;
        const questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);
        if (questionnaire) {
            const elicitingQuestionValues = [];
            for (let elicitingQuestionIndex in questionnaire.elicitingQuestions) {
                const elicitingQuestionSpecification = questionnaire.elicitingQuestions[elicitingQuestionIndex];
                elicitingQuestionValues.push(elicitingQuestionSpecification.id || elicitingQuestionSpecification.shortName || elicitingQuestionSpecification.text);
            }
            convertedElicitingQuestion = {
                id: "elicitingQuestion",
                displayName: "Eliciting question",
                displayPrompt: "Please choose a question you would like to respond to",
                displayType: "select",
                valueOptions: elicitingQuestionValues
            }
        }
        return convertedElicitingQuestion;
    }

    elicitingQuestionsForCatalysisReport(catalysisReportIdentifier) {
        const result = [];
        const elicitingQuestionValues = [];
        const storyCollectionsIdentifier = this.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_storyCollections");
        const storyCollectionItems = this.tripleStore.getListForSetIdentifier(storyCollectionsIdentifier);
        if (storyCollectionItems.length === 0) return null; 

        storyCollectionItems.forEach((storyCollectionPointer) => {
            if (storyCollectionPointer) {
                const storyCollectionIdentifier = this.tripleStore.queryLatestC(storyCollectionPointer, "storyCollection");
                const questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);
                if (questionnaire) {
                    for (let elicitingQuestionIndex in questionnaire.elicitingQuestions) {
                        const elicitingQuestionSpecification = questionnaire.elicitingQuestions[elicitingQuestionIndex];
                        elicitingQuestionValues.push(elicitingQuestionSpecification.id || elicitingQuestionSpecification.shortName || elicitingQuestionSpecification.text);
                    }
                }
            }
        });
            
        // create ONE eliciting question to cover all story collections, with all possible answers to question
        const convertedElicitingQuestion = {
            id: "elicitingQuestion",
            displayName: "Eliciting question",
            displayPrompt: "Please choose a question you would like to respond to",
            displayType: "select",
            valueOptions: elicitingQuestionValues
        }
        result.push(convertedElicitingQuestion);
        return result;
    }

    storyQuestionsForStoryCollection(storyCollectionIdentifier) {
        const questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);
        if (questionnaire) {
            return questionnaire.storyQuestions;
        } else {
            return [];
        }
    }

    storyQuestionsForCatalysisReport(catalysisReportIdentifier) {
        const result = [];  
        const storyCollectionsIdentifier = this.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_storyCollections");
        const storyCollectionItems = this.tripleStore.getListForSetIdentifier(storyCollectionsIdentifier);
        if (storyCollectionItems.length === 0) return []; 

        storyCollectionItems.forEach((storyCollectionPointer) => {
            if (storyCollectionPointer) {
                const storyCollectionIdentifier = this.tripleStore.queryLatestC(storyCollectionPointer, "storyCollection");
                const questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);

                if (questionnaire) {

                    for (let questionIndex in questionnaire.storyQuestions) {
                        const question = questionnaire.storyQuestions[questionIndex];

                        // check for existing question (possibly from another story collection) in results
                        let alreadyThere = false;
                        for (let resultQuestionIndex in result) {
                            const resultQuestion = result[resultQuestionIndex];
                            if (question.displayName === resultQuestion.displayName) {
                                alreadyThere = true;
                                break;
                            }
                        }
                        if (!alreadyThere) {
                            result.push(question);
                        }
                    }
                }
            }
        });
        return result;
    }

    participantQuestionsForStoryCollection(storyCollectionIdentifier) {
        const questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);
        if (questionnaire) {
            return questionnaire.participantQuestions;
        } else {
            return [];
        }
    }

    participantQuestionsForCatalysisReport(catalysisReportIdentifier) {
        const result = [];  
        const storyCollectionsIdentifier = this.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_storyCollections");
        const storyCollectionItems = this.tripleStore.getListForSetIdentifier(storyCollectionsIdentifier);
        if (storyCollectionItems.length === 0) return []; 

        storyCollectionItems.forEach((storyCollectionPointer) => {
            if (storyCollectionPointer) {
                const storyCollectionIdentifier = this.tripleStore.queryLatestC(storyCollectionPointer, "storyCollection");
                const questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);

                if (questionnaire) {

                    for (let questionIndex in questionnaire.participantQuestions) {
                        const question = questionnaire.participantQuestions[questionIndex];
                        let alreadyThere = false;
                        for (let resultQuestionIndex in result) {
                            const resultQuestion = result[resultQuestionIndex];
                            if (question.displayName === resultQuestion.displayName) {
                                alreadyThere = true;
                                break;
                            }
                        }
                        if (!alreadyThere) {
                            result.push(question);
                        }
                    }
                }
            }
        });
        return result;
    }

    storyLengthQuestion(maxStoryLength, numStoryLengthBins) {
        const choices = [];
        const increment = Math.round(maxStoryLength / numStoryLengthBins);
        for (let i = 1; i <= numStoryLengthBins; i++) {
            choices.push("" + i * increment);
        }
        const storyLengthQuestion = {
            id: "storyLength",
            displayName: "Story length",
            displayPrompt: "This is the length (in characters) of the story.",
            displayType: "select",
            valueOptions: choices 
        }
        return storyLengthQuestion;
    }

    storyLengthQuestionForStoryCollection(storyCollectionIdentifier) {
        const stories = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier);
        let maxStoryLength = 0;
        for (let storyIndex in stories) {
            const storyLength = stories[storyIndex].storyLength();
            if (storyLength > maxStoryLength) maxStoryLength = storyLength;
        }
        // outside of catalysis report, use hard-coded upper limit
        if (maxStoryLength > 5000) {
            maxStoryLength = 5000;
        }
        // outside of catalysis report, use hard-coded number of bins
        const numStoryLengthBins = 4;
        return this.storyLengthQuestion(maxStoryLength, numStoryLengthBins);
    }

    storyLengthQuestionsForCatalysisReport(catalysisReportIdentifier) {
        let maxStoryLength = 0;
        const storyCollectionsIdentifier = this.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_storyCollections");
        const storyCollectionItems = this.tripleStore.getListForSetIdentifier(storyCollectionsIdentifier);
        if (storyCollectionItems.length === 0) return [];
        
        storyCollectionItems.forEach((storyCollectionPointer) => {
            if (storyCollectionPointer) {
                const storyCollectionIdentifier = this.tripleStore.queryLatestC(storyCollectionPointer, "storyCollection");
                const stories = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier);
                for (let storyIndex in stories) {
                    const storyLength = stories[storyIndex].storyLength();
                    if (storyLength > maxStoryLength) maxStoryLength = storyLength;
                }
            }
        });
        const maxStoryLengthToShow = this.tripleStore.queryLatestC(catalysisReportIdentifier, "maxStoryLengthToShow");
        if (maxStoryLengthToShow) {
            const maxStoryLengthToShowAsNumber = parseInt(maxStoryLengthToShow);
            maxStoryLength = Math.min(maxStoryLengthToShowAsNumber, maxStoryLength);
        }
        let numStoryLengthBinsAsNumber = Project.default_numStoryLengthCategories; 
        const numStoryLengthBins = this.tripleStore.queryLatestC(catalysisReportIdentifier, "numStoryLengthBins");
        if (numStoryLengthBins) {
            numStoryLengthBinsAsNumber = parseInt(numStoryLengthBins);
        } 
        return this.storyLengthQuestion(maxStoryLength, numStoryLengthBinsAsNumber);
    }

    collectionDateQuestionForStoryCollection(storyCollectionIdentifier) {
        const stories = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier);
        const dateUnit = "days"; // outside of catalysis report, hard-code option
        let binNames = this.collectionDateBinNamesForListOfStories(stories, dateUnit);
        binNames = binNames.sort(); 
        return this.collectionDateQuestion(dateUnit, binNames);
    }

    collectionDateQuestionsForCatalysisReport(catalysisReportIdentifier) {
        const dateUnit = this.tripleStore.queryLatestC(catalysisReportIdentifier, "storyCollectionDateUnit") || "days";

        const storyCollectionsIdentifier = this.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_storyCollections");
        const storyCollectionItems = this.tripleStore.getListForSetIdentifier(storyCollectionsIdentifier);
        if (storyCollectionItems.length === 0) return [];

        let binNames = [];
        storyCollectionItems.forEach((storyCollectionPointer) => {
            if (storyCollectionPointer) {
                const storyCollectionIdentifier = this.tripleStore.queryLatestC(storyCollectionPointer, "storyCollection");
                const stories = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier);
                const binNamesForStoryCollection = this.collectionDateBinNamesForListOfStories(stories, dateUnit);
                for (let i = 0; i < binNamesForStoryCollection.length; i++) {
                    if (binNames.indexOf(binNamesForStoryCollection[i]) < 0) {
                        binNames.push(binNamesForStoryCollection[i]);
                    }
                }
            }
        });
        binNames = binNames.sort(); 
        return this.collectionDateQuestion(dateUnit, binNames);
    }

    collectionDateBinNamesForListOfStories(stories, dateUnit) {
        const binNames = [];
        stories.forEach((story) => {
            let valueToAdd = undefined;
            if (dateUnit === "years") {
                valueToAdd = story.storyCollectionYear();
            } else if (dateUnit === "quarters") {
                valueToAdd = story.storyCollectionQuarter();
            } else if (dateUnit === "months") {
                valueToAdd = story.storyCollectionYearAndMonth();
            } else if (dateUnit === "days") {
                valueToAdd = story.storyCollectionDate();
            }
            if (valueToAdd && binNames.indexOf(valueToAdd) < 0) {
                binNames.push(valueToAdd);
            }
        });
        return binNames;
    }

    collectionDateQuestion(dateUnit, unitDescriptors) {
        return {
            id: "collectionDate",
            displayName: "Collection date",
            displayPrompt: "This is the date on which the story was collected.",
            displayType: "select",
            displayConfiguration: dateUnit || "days",
            valueOptions: unitDescriptors 
        }
    }

    languageQuestionForStoryCollection(storyCollectionIdentifier) {
        const stories = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier);
        let languages = this.languagesForListOfStories(stories);
        languages = languages.sort(); 
        return this.languageQuestion(languages);
    }

    languageQuestionsForCatalysisReport(catalysisReportIdentifier) {
        const storyCollectionsIdentifier = this.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_storyCollections");
        const storyCollectionItems = this.tripleStore.getListForSetIdentifier(storyCollectionsIdentifier);
        if (storyCollectionItems.length === 0) return [];

        let languages = [];
        storyCollectionItems.forEach((storyCollectionPointer) => {
            if (storyCollectionPointer) {
                const storyCollectionIdentifier = this.tripleStore.queryLatestC(storyCollectionPointer, "storyCollection");
                const stories = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier);
                const languagesForStoryCollection = this.languagesForListOfStories(stories);
                languagesForStoryCollection.forEach((language) => {
                    if (languages.indexOf(language) < 0) {
                        languages.push(language);
                    }
                });
            }
        });
        languages = languages.sort(); 
        return this.languageQuestion(languages);
    }

    languagesForListOfStories(stories) {
        const languages = [];
        stories.forEach((story) => { 
            const language = story.storyLanguage();
            if (language && languages.indexOf(language) < 0) {
                languages.push(language);
            }
        });
        return languages;
    }

    languageQuestion(languages) {
        return {
            id: "language",
            displayName: "Language",
            displayPrompt: "This is the language in which the story form was displayed when the story was collected.",
            displayType: "select",
            valueOptions: languages 
        }
    }

    numStoriesToldQuestion(maxNumQuestions) {
        const choices = [];
        for (let i = 1; i <= maxNumQuestions; i++) {
            choices.push("" + i);
        }
        const numStoriesToldQuestion = {
            id: "numStoriesTold",
            displayName: "Number of stories told",
            displayPrompt: "This is the number of stories told by each participant.",
            displayType: "select",
            valueOptions: choices 
        }
        return numStoriesToldQuestion;
    }

    numStoriesToldQuestionForStoryCollection(storyCollectionIdentifier) {
        const stories = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier);
        let maxNumStoriesTold = 0;
        for (let storyIndex in stories) {
            const numStoriesToldForThisStory = stories[storyIndex].numStoriesTold();
            if (typeof numStoriesToldForThisStory === "string") {
                let numStoriesToldForThisStoryAsInt = parseInt(numStoriesToldForThisStory);
                if (numStoriesToldForThisStoryAsInt > maxNumStoriesTold) {
                    maxNumStoriesTold = numStoriesToldForThisStoryAsInt;
                }
            } 
        }
        return this.numStoriesToldQuestion(maxNumStoriesTold);
    }

    numStoriesToldQuestionsForCatalysisReport(catalysisReportIdentifier) {
        let maxNumStoriesTold = 0;
        const storyCollectionsIdentifier = this.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_storyCollections");
        const storyCollectionItems = this.tripleStore.getListForSetIdentifier(storyCollectionsIdentifier);
    
        if (storyCollectionItems.length === 0) return [];
        
        storyCollectionItems.forEach((storyCollectionPointer) => {
            if (storyCollectionPointer) {
                const storyCollectionIdentifier = this.tripleStore.queryLatestC(storyCollectionPointer, "storyCollection");
                const stories = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier);
                for (let storyIndex in stories) {
                    const numStoriesToldForThisStory = stories[storyIndex].numStoriesTold();
                    if (typeof numStoriesToldForThisStory === "string") {
                        let numStoriesToldForThisStoryAsInt = parseInt(numStoriesToldForThisStory);
                        if (numStoriesToldForThisStoryAsInt > maxNumStoriesTold) {
                            maxNumStoriesTold = numStoriesToldForThisStoryAsInt;
                        }
                    }
                }
            }
        });
        return this.numStoriesToldQuestion(maxNumStoriesTold);
    }

    lumpingCommandsForCatalysisReport(catalysisReportIdentifier) {
        const lumpingCommandsString = this.tripleStore.queryLatestC(catalysisReportIdentifier, "lumpingCommands") || ""; 
        if (lumpingCommandsString) return this.lumpingCommandsFromString(lumpingCommandsString);
        return "";
    }


    lumpingCommandsForStoryCollection(storyCollectionIdentifier) {
        const lumpingCommandsString = this.tripleStore.queryLatestC(storyCollectionIdentifier, "printStoryCards_lumpingCommands") || ""; 
        if (lumpingCommandsString) return this.lumpingCommandsFromString(lumpingCommandsString);
        return "";
    }

    lumpingCommandsFromString(lumpingCommandsString) {
        // example: Come from == second hand || rumor == not first hand
        const lumpingCommands = {};
        const lines = lumpingCommandsString.split("\n");
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const lineParts = lines[lineIndex].split("==");
            if (lineParts.length == 3) { // line must have 3 parts: question name, answers to lump, lumped answer
                const answersToLump = lineParts[1].split("||").map(function(part) {return part.trim()});
                if (answersToLump.length >= 2) { // must have at least two answers to lump
                    const questionName = lineParts[0].trim();
                    const lumpedAnswer = lineParts[2].trim();
                    if (!lumpingCommands.hasOwnProperty(questionName)) lumpingCommands[questionName] = {};
                    for (let answerIndex = 0; answerIndex < answersToLump.length; answerIndex++) {
                        const key = answersToLump[answerIndex];
                        lumpingCommands[questionName][key] = lumpedAnswer;
                    }
                }
            }
        }
        return lumpingCommands;
    }

}

export = Project;
