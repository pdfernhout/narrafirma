import PointrelClient = require("./pointrel20150417/PointrelClient");
import surveyCollection = require("./surveyCollection");
import TripleStore = require("./pointrel20150417/TripleStore");
import PanelSpecificationCollection = require("./panelBuilder/PanelSpecificationCollection");

"use strict";

var serverURL = "/api/pointrel20150417";

// TODO: Rethink this as a more general way to watch models within the project (so, with arbitrary object IDs, not just the project ID)

class Project {
    journalIdentifier: string;
    projectIdentifier: string;
    userIdentifier: any;
    readOnly: boolean = false;
    currentUserHasAdminAccess: boolean = false;
    currentUserIsSuperUser: boolean = false;
    pointrelClient: PointrelClient;
    tripleStore: TripleStore;
    redrawCallback: Function;
    static defaultMinimumStoryCountRequiredForTest = 20;
    static defaultMinimumStoryCountRequiredForGraph = 1;
    static defaultNumHistogramBins = 20;
    static defaultShowInterpretationsInGrid = false;
    static defaultGraphMultiChoiceQuestionsAgainstThemselves = false;
    static defaultNumScatterDotOpacityLevels = 3;
    static defaultScatterDotSize = 8;
    static defaultCorrelationLineChoice = "0.05";
    static defaultOutputGraphFormat = "SVG";
    static defaultGraphTypesToCreate = {
        "data integrity graphs": false,
        "texts": false,
        "bar graphs": false,
        "histograms": false,
        "tables": false,
        "contingency-histogram tables": false,
        "multiple histograms": false,
        "scatterplots": false,
        "multiple scatterplots": false
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
        // var topicIdentifier = "project001";
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
    
    // TODO: Redundant code with what is in GridWithItemPanel
    getListForField(fieldName) {
        var setIdentifier = this.getFieldValue(fieldName);
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
        var catalysisReports = this.tripleStore.queryLatestC(this.projectIdentifier, "project_catalysisReports");
        if (!catalysisReports) return null;
        var catalysisReportIdentifiers = this.tripleStore.getListForSetIdentifier(catalysisReports);
        for (var i = 0; i < catalysisReportIdentifiers.length; i++) {
            var reportShortName = this.tripleStore.queryLatestC(catalysisReportIdentifiers[i], "catalysisReport_shortName");
            if (reportShortName === shortName) {
                return catalysisReportIdentifiers[i];
            }
        }
        return null;
    }
    
    findQuestionnaireTemplate(shortName): string {
        var questionnaires: Array<string> = this.getListForField("project_storyForms");
        for (var i = 0; i < questionnaires.length; i++) {
            if (this.tripleStore.queryLatestC(questionnaires[i], "questionForm_shortName") === shortName) {
                return questionnaires[i];
            }
        }
        return null;
    }
    
    /*
    allStoryFormShortNames(): string[] {
        var result = [];
        var questionnaires: Array<string> = this.getListForField("project_storyForms");
        for (var i = 0; i < questionnaires.length; i++) {
            result.push(this.tripleStore.queryLatestC(questionnaires[i], "questionForm_shortName"));
        }
        return result;
    }
    */
    
    findStoryCollection(shortName): string {
        var storyCollections: Array<string> = this.getListForField("project_storyCollections");
        for (var i = 0; i < storyCollections.length; i++) {
            if (this.tripleStore.queryLatestC(storyCollections[i], "storyCollection_shortName") === shortName) {
                return storyCollections[i];
            }
        }
        return null;
    }
    
    private collectAllQuestionsForQuestionList(questionListName: string) {
        var questionIdentifiers: Array<string> = this.getListForField(questionListName);
        var questions = [];
        questionIdentifiers.forEach((questionIdentifier) => {
            var question = this.tripleStore.makeObject(questionIdentifier, true);
            questions.push(question);
        });
        return questions;
    }
    
    collectAllElicitingQuestions() {
        var questions = this.collectAllQuestionsForQuestionList("project_elicitingQuestionsList");
        return questions;
    }
    
    collectAllStoryQuestions() {
        var questions = this.collectAllQuestionsForQuestionList("project_storyQuestionsList");
        return questions;
    }
    
    collectAllParticipantQuestions() {
        var questions = this.collectAllQuestionsForQuestionList("project_participantQuestionsList");
        return questions;
    }
    
    collectAllAnnotationQuestions() {
        var questions = this.collectAllQuestionsForQuestionList("project_annotationQuestionsList");
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
        var questionListName;
        var questionClass;
        
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
        
        var setIdentifier = this.getFieldValue(questionListName);
        if (!setIdentifier) {
            // Need to create list
            setIdentifier = this.tripleStore.newIdForSet(questionClass + "Set");
            // console.log("Making set for ", questionListName, setIdentifier); 
            this.setFieldValue(questionListName, setIdentifier);
        }
        this.tripleStore.makeNewSetItem(setIdentifier, questionClass, question);
    }

    deleteQuestionInCategory(question, questionCategory: string) {
        var questionListName;
        var questionClass;
        
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
        
        var setIdentifier = this.getFieldValue(questionListName);
        if (!setIdentifier) {
            // Need to create list
            setIdentifier = this.tripleStore.newIdForSet(questionClass + "Set");
            // console.log("Making set for ", questionListName, setIdentifier); 
            this.setFieldValue(questionListName, setIdentifier);
        }
        this.tripleStore.deleteSetItem(setIdentifier, question.id);
    }
    
    storiesForCatalysisReport(catalysisReportIdentifier, showWarnings = false) {
        // the reason to have showWarnings is that this method gets called twice on the configure report page (once by the filter warning and once by the questions chooser)
        var result = [];
        var storyCollectionsIdentifier = this.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_storyCollections");
        var storyCollectionItems = this.tripleStore.getListForSetIdentifier(storyCollectionsIdentifier);
        if (storyCollectionItems.length === 0) return [];

        var filter = this.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_filter");
        if (filter) {
            return this.storiesForCatalysisReportWithFilter(catalysisReportIdentifier, storyCollectionItems, filter.trim(), showWarnings);
        } else {
            storyCollectionItems.forEach((storyCollectionPointer) => {
                if (!storyCollectionPointer) {
                    console.log("ERROR: null or undefined story collection pointer in catalysis report ", catalysisReportIdentifier);
                } else {
                    const storyCollectionIdentifier = this.tripleStore.queryLatestC(storyCollectionPointer, "storyCollection");
                    var storiesForThisCollection = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier);
                    result = result.concat(storiesForThisCollection);
                }
            });
        }
        return result;
    }
    
    storiesForCatalysisReportWithFilter(catalysisReportIdentifier, storyCollectionItems, filter, showWarnings = false) {
        var result = [];
        storyCollectionItems.forEach((storyCollectionPointer) => {
            if (!storyCollectionPointer) {
                console.log("ERROR: null or undefined story collection pointer in catalysis report ", catalysisReportIdentifier);
            } else {
                const storyCollectionIdentifier = this.tripleStore.queryLatestC(storyCollectionPointer, "storyCollection");
                var storiesForThisCollection = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier);
                var questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);
                result = result.concat(this.storiesForStoryCollectionWithFilter(storyCollectionIdentifier, storiesForThisCollection, questionnaire, filter, showWarnings));
            }
        }); 
        return result;
    }

    storiesForStoryCollectionWithFilter(storyCollectionIdentifier, storiesForThisCollection, questionnaire, filter, showWarnings = false) {
        var result = [];
        var questionAndAnswers = filter.split("==").map(function(item) {return item.trim()});
        var warningShown = false;
        var questionShortName = questionAndAnswers[0];
        var questionID = this.questionIDForQuestionShortNameGivenQuestionnaire(questionShortName, questionnaire);
        var question = this.questionForQuestionIDGivenQuestionnaire(questionID, questionnaire, storyCollectionIdentifier);
        if (question) {
            var answers = questionAndAnswers.slice(1);
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
                var lowerLimit = parseInt(answers[0]);
                if (isNaN(lowerLimit)) {
                    if (showWarnings && !warningShown) 
                        alert("This question (" + questionShortName + ") has a numerical range, and the lower limit you specified (" + answers[0] + ") doesn't seem to be a number.");
                    question = null;
                    warningShown = true;
                }
                if (answers.length > 1) {
                    var upperLimit = parseInt(answers[1]);
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
            var storiesThatMatchFilter = [];
            for (var storyIndex = 0; storyIndex < storiesForThisCollection.length; storyIndex++) {
                var story = storiesForThisCollection[storyIndex];
                var value = story.fieldValue(question.id)
                var storyMatches = false;
                if (question.displayType == "boolean") {
                    storyMatches = (answers[0] == "yes" && value) || (answers[0] == "no" && !value);
                } else if (question.displayType == "checkbox") {
                    storyMatches = (answers[0] == "true" && value) || (answers[0] == "false" && !value);
                } else if (value !== undefined && value !== null && value !== {} && value !== "") {
                    if (question.displayType == "slider") {
                        var valueAsInt = parseInt(value);
                        if (valueAsInt >= lowerLimit && valueAsInt <= upperLimit) {
                            storyMatches = true;
                        }
                    } else if (typeof(value) == "string") { // select, radiobuttons
                        for (var answerIndex = 0; answerIndex < answers.length; answerIndex++) {
                            if (value.trim() == answers[answerIndex]) {
                                storyMatches = true;
                                break;
                            }
                        }
                    } else { // checkboxes
                        for (var answerIndex = 0; answerIndex < answers.length; answerIndex++) {
                            if (value[answers[answerIndex]] && value[answers[answerIndex]] == true) {
                                storyMatches = true;
                                break;
                            }
                        }
                    }
                }
                if (storyMatches) {
                    storiesThatMatchFilter.push(story);
                }
            }
            result = result.concat(storiesThatMatchFilter);
        } // if question
        return result;
    }

    questionIDForQuestionShortNameGivenQuestionnaire(questionShortName, questionnaire) {
        // to add correct prefix (S_, P_, A_) to question name supplied by user (for catalysis report filter)
        if (questionShortName == "Eliciting question") {
            return "elicitingQuestion";
        }
        // not an eliciting question, check story questions next
        for (var i = 0; i < questionnaire.storyQuestions.length; i++) {
            if (questionnaire.storyQuestions[i].displayName == questionShortName) {
                return questionnaire.storyQuestions[i].id;
            }
        }
        // not eliciting or story question, check participant questions next
        for (i = 0; i < questionnaire.participantQuestions.length; i++) {
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
        for (var index in questionnaire.storyQuestions) {
            var question = questionnaire.storyQuestions[index];
            if (question.id === questionID) return question;
        }
        for (var index in questionnaire.participantQuestions) {
            var question = questionnaire.participantQuestions[index];
            if (question.id === questionID) return question;
        }
        var annotationQuestions = this.collectAllAnnotationQuestions();
        for (var index in annotationQuestions) {
            var question = annotationQuestions[index];
            if ("A_" + question.annotationQuestion_shortName === questionID) return question;
        }
        console.log("ERROR: question not found for id", questionID);
        return null;
    }

    elicitingQuestionForStoryCollection(storyCollectionIdentifier) {
        var convertedElicitingQuestion = null;
        var questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);
        if (questionnaire) {
            var elicitingQuestionValues = [];
            for (var elicitingQuestionIndex in questionnaire.elicitingQuestions) {
                var elicitingQuestionSpecification = questionnaire.elicitingQuestions[elicitingQuestionIndex];
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
        var result = [];
        var elicitingQuestionValues = [];
        var storyCollectionsIdentifier = this.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_storyCollections");
        var storyCollectionItems = this.tripleStore.getListForSetIdentifier(storyCollectionsIdentifier);
        if (storyCollectionItems.length === 0) return null; 

        storyCollectionItems.forEach((storyCollectionPointer) => {
            if (storyCollectionPointer) {
                var storyCollectionIdentifier = this.tripleStore.queryLatestC(storyCollectionPointer, "storyCollection");
                var questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);
                if (questionnaire) {
                    for (var elicitingQuestionIndex in questionnaire.elicitingQuestions) {
                        var elicitingQuestionSpecification = questionnaire.elicitingQuestions[elicitingQuestionIndex];
                        elicitingQuestionValues.push(elicitingQuestionSpecification.id || elicitingQuestionSpecification.shortName || elicitingQuestionSpecification.text);
                    }
                }
            }
        });
            
        // create ONE eliciting question to cover all story collections, with all possible answers to question
        var convertedElicitingQuestion = {
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
        var questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);
        if (questionnaire) {
            return questionnaire.storyQuestions;
        } else {
            return [];
        }
    }

    storyQuestionsForCatalysisReport(catalysisReportIdentifier) {
        var result = [];  
        var storyCollectionsIdentifier = this.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_storyCollections");
        var storyCollectionItems = this.tripleStore.getListForSetIdentifier(storyCollectionsIdentifier);
        if (storyCollectionItems.length === 0) return []; 

        storyCollectionItems.forEach((storyCollectionPointer) => {
            if (storyCollectionPointer) {
                var storyCollectionIdentifier = this.tripleStore.queryLatestC(storyCollectionPointer, "storyCollection");
                var questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);

                if (questionnaire) {

                    for (var questionIndex in questionnaire.storyQuestions) {
                        var question = questionnaire.storyQuestions[questionIndex];

                        // check for existing question (possibly from another story collection) in results
                        var alreadyThere = false;
                        for (var resultQuestionIndex in result) {
                            var resultQuestion = result[resultQuestionIndex];
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
        var questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);
        if (questionnaire) {
            return questionnaire.participantQuestions;
        } else {
            return [];
        }
    }

    participantQuestionsForCatalysisReport(catalysisReportIdentifier) {
        var result = [];  
        var storyCollectionsIdentifier = this.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_storyCollections");
        var storyCollectionItems = this.tripleStore.getListForSetIdentifier(storyCollectionsIdentifier);
        if (storyCollectionItems.length === 0) return []; 

        storyCollectionItems.forEach((storyCollectionPointer) => {
            if (storyCollectionPointer) {
                var storyCollectionIdentifier = this.tripleStore.queryLatestC(storyCollectionPointer, "storyCollection");
                var questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);

                if (questionnaire) {

                    for (var questionIndex in questionnaire.participantQuestions) {
                        var question = questionnaire.participantQuestions[questionIndex];
                        var alreadyThere = false;
                        for (var resultQuestionIndex in result) {
                            var resultQuestion = result[resultQuestionIndex];
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

    storyLengthQuestion(maxStoryLength) {
        var choices = [];
        var increment = Math.round(maxStoryLength / 10);
        for (var i = 1; i <= 10; i++) {
            choices.push("" + i * increment);
        }
        var storyLengthQuestion = {
            id: "storyLength",
            displayName: "Story length",
            displayPrompt: "This is the length (in characters) of the story.",
            displayType: "select",
            valueOptions: choices 
        }
        return storyLengthQuestion;
    }

    storyLengthQuestionForStoryCollection(storyCollectionIdentifier) {
        var stories = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier);
        var maxStoryLength = 0;
        for (var storyIndex in stories) {
            var storyLength = stories[storyIndex].storyLength();
            if (storyLength > maxStoryLength) maxStoryLength = storyLength;
        }
        // outside of catalysis report, use hard-coded upper limit
        if (maxStoryLength > 5000) {
            maxStoryLength = 5000;
        }
        return this.storyLengthQuestion(maxStoryLength);
    }

    storyLengthQuestionsForCatalysisReport(catalysisReportIdentifier) {
        var maxStoryLength = 0;
        var storyCollectionsIdentifier = this.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_storyCollections");
        var storyCollectionItems = this.tripleStore.getListForSetIdentifier(storyCollectionsIdentifier);
        if (storyCollectionItems.length === 0) return [];
        
        storyCollectionItems.forEach((storyCollectionPointer) => {
            if (storyCollectionPointer) {
                var storyCollectionIdentifier = this.tripleStore.queryLatestC(storyCollectionPointer, "storyCollection");
                var stories = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier);
                for (var storyIndex in stories) {
                    var storyLength = stories[storyIndex].storyLength();
                    if (storyLength > maxStoryLength) maxStoryLength = storyLength;
                }
            }
        });
        const maxStoryLengthToShow = this.tripleStore.queryLatestC(catalysisReportIdentifier, "maxStoryLengthToShow");
        if (maxStoryLengthToShow) {
            const maxStoryLengthToShowAsNumber = parseInt(maxStoryLengthToShow);
            maxStoryLength = Math.min(maxStoryLengthToShowAsNumber, maxStoryLength);
        }
        return this.storyLengthQuestion(maxStoryLength);
    }

    numStoriesToldQuestion(maxNumQuestions) {
        var choices = [];
        for (var i = 1; i <= maxNumQuestions; i++) {
            choices.push("" + i);
        }
        var numStoriesToldQuestion = {
            id: "numStoriesTold",
            displayName: "Number of stories told",
            displayPrompt: "This is the number of stories told by each participant.",
            displayType: "select",
            valueOptions: choices 
        }
        return numStoriesToldQuestion;
    }

    numStoriesToldQuestionForStoryCollection(storyCollectionIdentifier) {
        var stories = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier);
        var maxNumStoriesTold = 0;
        for (var storyIndex in stories) {
            var numStoriesToldForThisStory = stories[storyIndex].numStoriesTold();
            if (typeof numStoriesToldForThisStory === "string") {
                var numStoriesToldForThisStoryAsInt = parseInt(numStoriesToldForThisStory);
                if (numStoriesToldForThisStoryAsInt > maxNumStoriesTold) maxNumStoriesTold = numStoriesToldForThisStoryAsInt;
            } 
        }
        return this.numStoriesToldQuestion(maxNumStoriesTold);
    }

    numStoriesToldQuestionsForCatalysisReport(catalysisReportIdentifier) {
        var maxNumStoriesTold = 0;
        var storyCollectionsIdentifier = this.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_storyCollections");
        var storyCollectionItems = this.tripleStore.getListForSetIdentifier(storyCollectionsIdentifier);
    
        if (storyCollectionItems.length === 0) return [];
        
        storyCollectionItems.forEach((storyCollectionPointer) => {
            if (storyCollectionPointer) {
                var storyCollectionIdentifier = this.tripleStore.queryLatestC(storyCollectionPointer, "storyCollection");
                var stories = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier);
                for (var storyIndex in stories) {
                    var numStoriesToldForThisStory = stories[storyIndex].numStoriesTold();
                    if (typeof numStoriesToldForThisStory === "string") {
                        var numStoriesToldForThisStoryAsInt = parseInt(numStoriesToldForThisStory);
                        if (numStoriesToldForThisStoryAsInt > maxNumStoriesTold) maxNumStoriesTold = numStoriesToldForThisStoryAsInt;
                    }
                }
            }
        });
        return this.numStoriesToldQuestion(maxNumStoriesTold);
    }

    minimumStoryCountRequiredForTest(catalysisReportIdentifier) {
        if (!catalysisReportIdentifier) {
            throw new Error("catalysisReportIdentifier was not supplied");
        }
        var minimumStoryCountRequiredForTest = this.tripleStore.queryLatestC(catalysisReportIdentifier, "minimumSubsetSize");
        if (minimumStoryCountRequiredForTest) {
            return parseInt(minimumStoryCountRequiredForTest, 10);
        } else {
            return Project.defaultMinimumStoryCountRequiredForTest;
        }
    }

    minimumStoryCountRequiredForGraph(catalysisReportIdentifier) {
        if (!catalysisReportIdentifier) {
            throw new Error("catalysisReportIdentifier was not supplied");
        }
        var minimumStoryCountRequiredForGraph = this.tripleStore.queryLatestC(catalysisReportIdentifier, "minimumStoryCountRequiredForGraph");
        if (minimumStoryCountRequiredForGraph) {
            return parseInt(minimumStoryCountRequiredForGraph, 10);
        } else {
            return Project.defaultMinimumStoryCountRequiredForGraph;
        }
    }

    numberOfHistogramBins(catalysisReportIdentifier) {
        if (!catalysisReportIdentifier) {
            throw new Error("catalysisReportIdentifier was not supplied");
        }
        var numHistogramBins = this.tripleStore.queryLatestC(catalysisReportIdentifier, "numHistogramBins");
        if (numHistogramBins) {
            return parseInt(numHistogramBins, 10);
        } else {
            return Project.defaultNumHistogramBins;
        }
    }

    showInterpretationsInGrid(catalysisReportIdentifier) {
        if (!catalysisReportIdentifier) {
            throw new Error("catalysisReportIdentifier was not supplied");
        }
        var showInterpretationsInGrid = this.tripleStore.queryLatestC(catalysisReportIdentifier, "showInterpretationsInGrid");
        if (showInterpretationsInGrid) {
            return showInterpretationsInGrid;
        } else {
            return Project.defaultShowInterpretationsInGrid;
        }
    }

    graphMultiChoiceQuestionsAgainstThemselves(catalysisReportIdentifier) {
        if (!catalysisReportIdentifier) {
            throw new Error("catalysisReportIdentifier was not supplied");
        }
        var graphMultiChoiceQuestionsAgainstThemselves = this.tripleStore.queryLatestC(catalysisReportIdentifier, "graphMultiChoiceQuestionsAgainstThemselves");
        if (graphMultiChoiceQuestionsAgainstThemselves) {
            return graphMultiChoiceQuestionsAgainstThemselves;
        } else {
            return Project.defaultGraphMultiChoiceQuestionsAgainstThemselves;
        }
    }

    numScatterDotOpacityLevels(catalysisReportIdentifier) {
        if (!catalysisReportIdentifier) {
            throw new Error("catalysisReportIdentifier was not supplied");
        }
        var numScatterDotOpacityLevels = this.tripleStore.queryLatestC(catalysisReportIdentifier, "numScatterDotOpacityLevels");
        if (numScatterDotOpacityLevels) {
            return parseInt(numScatterDotOpacityLevels, 10);
        } else {
            return Project.defaultNumScatterDotOpacityLevels;
        }
    }
    
    scatterDotSize(catalysisReportIdentifier) {
        if (!catalysisReportIdentifier) {
            throw new Error("catalysisReportIdentifier was not supplied");
        }
        var scatterDotSize = this.tripleStore.queryLatestC(catalysisReportIdentifier, "scatterDotSize");
        if (scatterDotSize) {
            return parseInt(scatterDotSize, 10);
        } else {
            return Project.defaultScatterDotSize;
        }
    }

    correlationLineChoice(catalysisReportIdentifier) {
        if (!catalysisReportIdentifier) {
            throw new Error("catalysisReportIdentifier was not supplied");
        }
        var correlationLineChoice = this.tripleStore.queryLatestC(catalysisReportIdentifier, "correlationLineChoice");
        if (correlationLineChoice) {
            return correlationLineChoice;
        } else {
            return Project.defaultCorrelationLineChoice;
        }
    }

    outputGraphFormat(catalysisReportIdentifier) {
        if (!catalysisReportIdentifier) {
            throw new Error("catalysisReportIdentifier was not supplied");
        }
        var outputGraphFormat = this.tripleStore.queryLatestC(catalysisReportIdentifier, "outputGraphFormat");
        if (outputGraphFormat) {
            return outputGraphFormat;
        } else {
            return Project.defaultOutputGraphFormat;
        }
    }

    graphTypesToCreate(catalysisReportIdentifier) {
        if (!catalysisReportIdentifier) {
            throw new Error("catalysisReportIdentifier was not supplied");
        }
        var graphTypesToCreate = this.tripleStore.queryLatestC(catalysisReportIdentifier, "graphTypesToCreate");
        if (graphTypesToCreate) {
            return graphTypesToCreate;
        } else {
            return Project.defaultGraphTypesToCreate;
        }
    }
}

export = Project;
