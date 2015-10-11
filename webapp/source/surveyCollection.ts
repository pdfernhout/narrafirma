import Project = require("./Project");
import translate = require("./panelBuilder/translate");
import questionnaireGeneration = require("./questionnaireGeneration");

"use strict";
    
var project: Project;

export function setProject(theProject) {
    project = theProject;
}

function getStoryField(storyID, fieldName, defaultValue) {
    var result = project.tripleStore.queryLatestC(storyID, fieldName);
    if (result === undefined || result === null) result = defaultValue;
    return result;
}

function setStoryField(storyID, fieldName, value) {
    project.tripleStore.addTriple(storyID, fieldName, value);
    return value;
}

// A Story class where data can be overriden
export class Story {
    constructor(public model) {
    }
    
    storyID() {
        return this.model.storyID;
    }
    
    isIgnored(): boolean {
        return getStoryField(this.model.storyID, "ignore", "").trim() !== "";
    }
     
    questionnaire() {
        return this.model.questionnaire;
    }
    
    ignore(newValue = undefined) {
        return this.fieldValue("ignore", newValue);
    }
    
    storyText(newValue = undefined) {
        return this.fieldValue("storyText", newValue);
    }
    
    storyName(newValue = undefined) {
        return this.fieldValue("storyName", newValue);
    }
    
    elicitingQuestion(newValue = undefined) {
        return this.fieldValue("elicitingQuestion", newValue);
    }
    
    fieldValue(fieldName, newValue = undefined) {
        if (newValue === undefined) {
            return getStoryField(this.model.storyID, fieldName, this.model[fieldName]) || "";
        } else {
            return setStoryField(this.model.storyID, fieldName, newValue);
        }
    }
}

export function getStoriesForStoryCollection(storyCollectionIdentifier, includeIgnored = false): Story[] {
    var result = [];
    var surveyMessages = project.pointrelClient.filterMessages(function (message) {
        var match = (message._topicIdentifier === "surveyResults" &&
            message.messageType === "surveyResult" &&
            message.change.projectIdentifier === project.projectIdentifier &&
            message.change.storyCollectionIdentifier === storyCollectionIdentifier);
        // console.log("message", match, message);
        return match;
    });
    // console.log("getStoriesForStoryCollection surveyMessages", surveyMessages);
    
    surveyMessages.forEach(function (message) {
        // Now add stories in survey to results, with extra participant information
        try {
            var surveyResult = message.change.surveyResult;
            var stories = surveyResult.stories;
            for (var storyIndex in stories) {
                // Make a copy of the story so as not to modify original in message
                var story = JSON.parse(JSON.stringify(stories[storyIndex]));
                // console.log("=== story", story);
                
                // Add participant info for story
                var participantData = surveyResult.participantData;
                for (var key in participantData) {
                    if (key !== "__type") {
                        story[key] = participantData[key];
                    }
                }
                
                // Add questionnaire for display
                story.questionnaire = surveyResult.questionnaire;
                var wrappedStory = new Story(story);
                if (includeIgnored || !wrappedStory.isIgnored()) { 
                    result.push(wrappedStory);
                }
            }
        } catch (e) {
            console.log("Problem processing survey result", message, e);
        }
    });
    
    return result;
}

export function getQuestionnaireForStoryCollection(storyCollectionName: string, alertIfProblem = false) {
    var storyCollection = project.findStoryCollection(storyCollectionName);
  
    if (!storyCollection) {
        // TODO: translate
        if (alertIfProblem) alert("The selected story collection could not be found.");
        return null;
    }
    
    var questionnaireName = project.tripleStore.queryLatestC(storyCollection, "storyCollection_questionnaireIdentifier");
    
    if (!questionnaireName) {
        // TODO: translate
        if (alertIfProblem) alert("The story collection has no selection for a questionnaire.");
        return null;
    }
    
    var questionnaire = project.tripleStore.queryLatestC(storyCollection, "questionnaire");
    
    if (!questionnaire) {
        // TODO: translate
        if (alertIfProblem) alert("The questionnaire selected in the story collection could not be found.");
        return null;
    }
    
    return questionnaire;
}


export function urlForSurvey(storyCollectionIdentifier) {
    var href = window.location.href;
    var baseURL = href.substring(0, href.lastIndexOf("/"));
    // TODO: Duplicated project prefix; should refactor to have it in one place
    var projectName = project.journalIdentifier.substring("NarraFirmaProject-".length);
    var shortName = project.tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_shortName");
    return baseURL + "/survey.html#project=" + projectName + "&survey=" + shortName;
}

export function toggleWebActivationOfSurvey(model: string, fieldSpecification, value) {
    // TODO: Fix this for mover to using triples for projectModel
    var grid = fieldSpecification.grid;
    var selectedItem: string = grid.getSelectedItem();
    console.log("toggleWebActivationOfSurvey selectedItem", selectedItem, model, fieldSpecification); 
    
    var shortName = project.tripleStore.queryLatestC(selectedItem, "storyCollection_shortName");
    var activeOnWeb = project.tripleStore.queryLatestC(selectedItem, "storyCollection_activeOnWeb");
    activeOnWeb = !activeOnWeb;
    if (activeOnWeb) {
        // urlForSurvey(shortName)
        project.tripleStore.addTriple(selectedItem, "storyCollection_activeOnWeb", true);
    } else {
        project.tripleStore.addTriple(selectedItem, "storyCollection_activeOnWeb", false);
    }
    
    // TODO: Potential window of vulnerability here because not making both changes (to item and survey questionnaires) as a single transaction
    
    var questionnaires = {};
    for (var key in project.activeQuestionnaires) {
        questionnaires[key] = project.activeQuestionnaires[key];
    }
   
    var questionnaire = project.tripleStore.queryLatestC(selectedItem, "questionnaire");
    if (!questionnaire) {
        var questionnaireName = project.tripleStore.queryLatestC(selectedItem, "storyCollection_questionnaireIdentifier");
        console.log("Could not find questionnnaire for", questionnaireName);
        return;
    }
    if (activeOnWeb) {
        questionnaires[shortName] = questionnaire;
    } else {
       delete questionnaires[shortName];
    }

    // Now publish the new or removed questionnaire so surveys can pick up the change...
    updateActiveQuestionnaires(questionnaires, "sendMessage", activeOnWeb);
}
   
export function updateActiveQuestionnaires(questionnaires, sendMessage, activeOnWeb) {
    project.activeQuestionnaires = questionnaires;
   
    if (!sendMessage) return;
   
    // TODO: Should not have GUI actions in here like alert; either do as Toast or publish on topic that can be hooked up to alert or Toast
    project.pointrelClient.createAndSendChangeMessage("questionnaires", "questionnairesMessage", questionnaires, null, function(error, result) {
       if (error) {
           // TODO: Translate
           var errorMessage = "Problem activating web form";
           if (!activeOnWeb) errorMessage = "Problem deactivating web form";
           alert(errorMessage);
           return;
       }
       // TODO: Translate
       var message = "The web form has been activated.";
       if (!activeOnWeb) message = "The web form has been deactivated.";
       alert(message);
    });
}
   
export function storyCollectionStop() {
    // TODO: translate
    // TODO: probably should not have GUI action in here; need to rethink?
    if (!isStoryCollectingEnabled()) {
        alert("Story collection via the web is already not currently enabled.");
        return;
    }
    if (!confirm("Deactivate all story collection via the web?")) return;
    var storyCollections = project.getListForField("project_storyCollections");
    for (var i = 0; i < storyCollections.length; i++) {
        var storyCollectionIdentifier = storyCollections[i];
        if (project.tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_activeOnWeb")) {
            project.tripleStore.addTriple(storyCollectionIdentifier, "storyCollection_activeOnWeb", false);
        }
    }

    updateActiveQuestionnaires({}, "sendMessage", false);
    console.log("Deactivated all web questionnaires");
}
   
export function isStoryCollectingEnabled() {
    for (var key in project.activeQuestionnaires) {
        return true;
    }
    return false;
}

export function collectQuestionsForQuestionnaire(questionnaire) {
    // console.log("collectQuestionsForQuestionnaire", questionnaire);
   
    if (!questionnaire) return [];
   
    var leadingStoryQuestions = questionnaireGeneration.getLeadingStoryQuestions(questionnaire.elicitingQuestions);

    // console.log("DEBUG questions used by story browser", questions);
          
    var questions = [].concat(leadingStoryQuestions, questionnaire.storyQuestions);
    questions.push({
        id: "participantData_header",
        displayName: "Participant Data",
        displayPrompt: "---- participant data below ----",
        displayType: "header",
        valueOptions: []
    });

    // TODO: add more participant and survey info, like timestamps and participant ID
   
    // Participant data has elsewhere been copied into story, so these questions can access it directly
    questions = questions.concat(questionnaire.participantQuestions);
   
    return questions;
}
   
// Types of questions that have data associated with them for filters and graphs
var filterableQuestionTypes = ["select", "slider", "boolean", "text", "checkbox", "checkboxes", "radiobuttons"];

// function updateFilterPaneForCurrentQuestions(questions) {
export function optionsForAllQuestions(questions, excludeTextQuestionsFlag = null) {
    var questionOptions = [];
    questions.forEach(function (question) {
        if (filterableQuestionTypes.indexOf(question.displayType) !== -1) {
            if (!excludeTextQuestionsFlag || question.displayType !== "text") {
                var defaultText = question.displayName;
                if (!defaultText) defaultText = question.displayPrompt;
                questionOptions.push({label: translate(question.id + "::shortName", defaultText), value: question.id});
            }
        }
    });
    // Sort options by their name
    questionOptions.sort(function(a, b) {
        if (a.label.toLowerCase() < b.label.toLowerCase()) return -1;
        if (a.label.toLowerCase() > b.label.toLowerCase()) return 1;
        return 0;
    });
    return questionOptions;
}
