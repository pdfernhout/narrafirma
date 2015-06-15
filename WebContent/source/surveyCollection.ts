import questionnaireGeneration = require("./questionnaireGeneration");
import topic = require("./pointrel20150417/topic");
import translate = require("./panelBuilder/translate");

"use strict";
    
var project;

export function setProject(theProject) {
    project = theProject;
}

export function getStoriesForStoryCollection(storyCollectionIdentifier) {
    var result = [];
    var surveyMessages = project.pointrelClient.filterMessages(function (message) {
        var match = (message._topicIdentifier === "surveyResults" &&
            message.messageType === "surveyResult" &&
            message.change.projectIdentifier === project.projectIdentifier &&
            message.change.storyCollectionIdentifier === storyCollectionIdentifier);
        // console.log("message", match, message);
        return match;
    });
    console.log("getStoriesForStoryCollection filter surveyMessages", surveyMessages);
    
    surveyMessages.forEach(function (message) {
        // Now add stories in survey to results, with extra participant information
        try {
            var surveyResult = message.change.surveyResult;
            var stories = surveyResult.stories;
            for (var storyIndex in stories) {
                var story = stories[storyIndex];
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
                result.push(story);
            }
        } catch (e) {
            console.log("Problem processing survey result", message, e);
        }
    });
    
    return result;
}

// TODO: Similar to function in buttonActions except no alerts
export function getQuestionnaireForStoryCollection(storyCollectionIdentifier) {
    var storyCollection = questionnaireGeneration.findStoryCollection(project, storyCollectionIdentifier);
    if (!storyCollection) return null;
    
    var questionnaireName = storyCollection.storyCollection_questionnaireIdentifier;
    if (!questionnaireName) return null;

    var questionnaire = storyCollection.questionnaire;
    return questionnaire;
}

function urlForSurvey(storyCollectionName) {
    var href = window.location.href;
    var baseURL = href.substring(0, href.lastIndexOf("/"));
    // TODO: Duplicated project prefix; should refactor to have it in one place
    var projectName = project.journalIdentifier.substring("NarraFirmaProject-".length);
    return baseURL + "/survey.html#project=" + projectName + "&survey=" + storyCollectionName;
}

export function toggleWebActivationOfSurvey(contentPane, model, fieldSpecification, value) {
    var grid = fieldSpecification.grid;
    var selectedItem = grid.getSelectedItem();
    console.log("toggleWebActivationOfSurvey selectedItem", selectedItem, model, fieldSpecification); 
    
    if (selectedItem.storyCollection_activeOnWeb) {
        selectedItem.storyCollection_activeOnWeb = "";
    } else {
        selectedItem.storyCollection_activeOnWeb = urlForSurvey(selectedItem.storyCollection_shortName);
    }
    // TODO: Maybe only want to refresh grid, as there is a seperate update now for questionnaires?
    // broadcast the change to other clients and force grid refresh by recreating entire object
    var storyCollections = model.get(fieldSpecification.id);
    var recreatedData = JSON.parse(JSON.stringify(storyCollections));
    model.set(fieldSpecification.id, recreatedData);
    
    // TODO: Potential window of vulnerability here because not making both changes as a single transaction
    
    var questionnaires = {};
    for (var key in project.activeQuestionnaires) {
        questionnaires[key] = project.activeQuestionnaires[key];
    }
   
    var questionnaire = selectedItem.questionnaire;
    if (!questionnaire) {
        var questionnaireName = selectedItem.storyCollection_questionnaireIdentifier;
        console.log("Could not find questionnnaire for", questionnaireName);
        return;
    }
    if (selectedItem.storyCollection_activeOnWeb) {
        questionnaires[selectedItem.storyCollection_shortName] = questionnaire;
    } else {
       delete questionnaires[selectedItem.storyCollection_shortName];
    }
    // TODO: Decide: Publish here to be sure to get updates even when offline or just wait for server to relay it back?
    // topic.publish("questionnaires", change);

    // Now publish the new or removed questionnaire...
    updateActiveQuestionnaires(questionnaires, "sendMessage");
}
   
export function updateActiveQuestionnaires(questionnaires, sendMessage) {
    project.activeQuestionnaires = questionnaires;
   
    // TODO: Should compare against current canonicalized value to see if anything changed and only update then -- assuming updates already issued by code that makes changes
    // TODO: Does not publish which specific questionnaire changed, so inefficient
    topic.publish("activeQuestionnaires", project.activeQuestionnaires);
    topic.publish("isStoryCollectingEnabled", isStoryCollectingEnabled());
   
    if (!sendMessage) return;
   
    // TODO: Should not have GUI actions in here like alert; either do as Toast or publish on topic that can be hooked up to alert or Toast
    project.pointrelClient.createAndSendChangeMessage("questionnaires", "questionnairesMessage", questionnaires, null, function(error, result) {
       if (error) {
           // TODO: Translate
           alert("Problem activating or deactivating web form");
           return;
       }
       // TODO: Translate
       alert("The web form has been activated or deactivated.");
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
    var storyCollections = project.projectModel.get("project_storyCollections");
    for (var i = 0; i < storyCollections.length; i++) {
        var storyCollection = storyCollections[i];
        if (!storyCollection.storyCollection_activeOnWeb) continue;
        storyCollection.storyCollection_activeOnWeb = "";
    }
   
    // broadcast the change to other clients and force grid refresh by recreating entire object
    var recreatedData = JSON.parse(JSON.stringify(storyCollections));
    project.projectModel.set("project_storyCollections", recreatedData);
   
    updateActiveQuestionnaires({}, "sendMessage");
    console.log("Deactivated all web questionnaires");
}
   
export function isStoryCollectingEnabled() {
    for (var key in project.activeQuestionnaires) {
        return true;
    }
    return false;
}
   
export function collectQuestionsForQuestionnaire(questionnaire) {
    console.log("questionnaire", questionnaire);
   
    if (!questionnaire) return [];
   
    var storyQuestions = questionnaire.storyQuestions;
   
    // TODO: What about idea of having IDs that go with eliciting questions so store reference to ID not text prompt?
    var elicitingQuestionPrompts = [];
    for (var elicitingQuestionIndex = 0; elicitingQuestionIndex < questionnaire.elicitingQuestions.length; elicitingQuestionIndex++) {
        var elicitingQuestionSpecification = questionnaire.elicitingQuestions[elicitingQuestionIndex];
        elicitingQuestionPrompts.push(elicitingQuestionSpecification.text);
    }
   
    // TODO: Remove redundancy
    var leadingStoryQuestions = [];
    leadingStoryQuestions.unshift({id: "__survey_" + "storyName", displayName: "Story Name", displayPrompt: "Please give your story a name", displayType: "text", valueOptions:[]});
    leadingStoryQuestions.unshift({id: "__survey_" + "storyText", displayName: "Story Text", displayPrompt: "Please enter your response to the question above in the space below", displayType: "textarea", valueOptions:[]});
    leadingStoryQuestions.unshift({id: "__survey_" + "elicitingQuestion", displayName: "Eliciting Question", displayPrompt: "Please choose a question you would like to respond to", displayType: "select", valueOptions: elicitingQuestionPrompts});

    // console.log("DEBUG questions used by story browser", questions);
          
    var questions = [].concat(leadingStoryQuestions, storyQuestions);
    questions.push({id: "__survey_" + "participantData", displayName: "Participant Data", displayPrompt: "---- participant data below ----", displayType: "header", valueOptions:[]});

    // TODO: add more participant and survey info, like timestamps and participant ID
   
    // Participant data has elsewhere been copied into story, so these questions can access it directly
    questions = questions.concat(questionnaire.participantQuestions);
   
    return questions;
}
   
// Types of questions that have data associated with them for filters and graphs
var filterableQuestionTypes = ["select", "slider", "boolean", "text", "checkbox", "checkboxes", "radiobuttons"];

// function updateFilterPaneForCurrentQuestions(questions) {
export function optionsForAllQuestions(questions, excludeTextQuestionsFlag) {
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
    return questionOptions;
}
