import Project = require("./Project");
import translate = require("./panelBuilder/translate");
import questionnaireGeneration = require("./questionnaireGeneration");

"use strict";
    
let project: Project;

export function setProject(theProject) {
    project = theProject;
}

function getStoryField(storyID, fieldName, defaultValue) {
    let result = project.tripleStore.queryLatestC(storyID, fieldName);
    if (result === undefined || result === null) result = defaultValue;
    return result;
}

function setStoryField(storyID, fieldName, value) {
    project.tripleStore.addTriple(storyID, fieldName, value);
    return value;
}

// A Story class where data can be overridden
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

    numStoriesTold(newValue = undefined) {
        return this.fieldValue("numStoriesTold", newValue);
    }

    storyLength() {
        const storyText = this.fieldValue("storyText");
        if (storyText) {
            return storyText.length;
        } else {
            return 0;
        }
    }

    indexInStoryCollection(newValue = undefined) {
        return this.fieldValue("indexInStoryCollection", newValue);
    }

    storyCollectionIdentifier(newValue = undefined) {
        return this.fieldValue("storyCollectionIdentifier", newValue);
    }
    
    fieldValue(fieldName, newValue = undefined) {
        if (newValue === undefined) {
            let defaultValue = (this.model[fieldName] !== undefined && this.model[fieldName] !== null) ? this.model[fieldName] : "";
            return getStoryField(this.model.storyID, fieldName, defaultValue); 
        } else {
            return setStoryField(this.model.storyID, fieldName, newValue);
        }
    }
}

export function getStoriesForStoryCollection(storyCollectionIdentifier, includeIgnored = false): Story[] {
    const result = [];
    const surveyMessages = project.pointrelClient.filterMessages(function (message) {
        const match = (message._topicIdentifier === "surveyResults" &&
            message.messageType === "surveyResult" &&
            message.change.projectIdentifier === project.projectIdentifier &&
            message.change.storyCollectionIdentifier === storyCollectionIdentifier);
        return match;
    });
    
    let numStoriesAddedForCollection = 0;
    surveyMessages.forEach(function (message) {
        // Now add stories in survey to results, with extra participant information
        try {
            const surveyResult = message.change.surveyResult;
            const stories = surveyResult.stories;
            for (const storyIndex in stories) {
                // calculate derived count of number of stories told in each survey session (to be shown in graphs)
                stories[storyIndex].numStoriesTold = "" + stories.length;
                stories[storyIndex].storyLength = "" + stories[storyIndex].length;
                // Make a copy of the story so as not to modify original in message
                const story = JSON.parse(JSON.stringify(stories[storyIndex]));
                
                // Add participant info for story
                const participantData = surveyResult.participantData;
                for (const key in participantData) {
                    if (key !== "__type") {
                        story[key] = participantData[key];
                    }
                }

                // Add some fields for displaying information
                story.questionnaire = surveyResult.questionnaire;
                story.indexInStoryCollection = ++numStoriesAddedForCollection;
                story.storyCollectionIdentifier = storyCollectionIdentifier;
                const wrappedStory = new Story(story);
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
    const storyCollection = project.findStoryCollection(storyCollectionName);
  
    if (!storyCollection) {
        // TODO: translate
        if (alertIfProblem) alert("The selected story collection could not be found.");
        return null;
    }
    
    const questionnaireName = project.tripleStore.queryLatestC(storyCollection, "storyCollection_questionnaireIdentifier");
    
    if (!questionnaireName) {
        // TODO: translate
        if (alertIfProblem) alert("The story collection has no selection for a questionnaire.");
        return null;
    }
    
    const questionnaire = project.tripleStore.queryLatestC(storyCollection, "questionnaire");
    
    if (!questionnaire) {
        // TODO: translate
        if (alertIfProblem) alert("The questionnaire selected in the story collection could not be found.");
        return null;
    }
    
    return questionnaire;
}


export function urlForSurvey(storyCollectionIdentifier) {
    const href = window.location.href;
    const baseURL = href.substring(0, href.lastIndexOf("/"));
    // TODO: Duplicated project prefix; should refactor to have it in one place
    const projectName = project.journalIdentifier.substring("NarraFirmaProject-".length);
    const shortName = project.tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_shortName");
    const url = baseURL + "/survey.html#project=" + projectName + "&survey=" + shortName;
    const result = m("a[id=narrafirma-survey-url]", {href: url, title: url, target: "_blank"}, url)
    return result;
}

export function urlForSurveyAsString(storyCollectionIdentifier) {
    const href = window.location.href;
    const baseURL = href.substring(0, href.lastIndexOf("/"));
    // TODO: Duplicated project prefix; should refactor to have it in one place
    const projectName = project.journalIdentifier.substring("NarraFirmaProject-".length);
    const shortName = project.tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_shortName");
    const url = baseURL + "/survey.html#project=" + projectName + "&survey=" + shortName;
    return url;
}

export function urlForStoryCollectionReview(storyCollectionIdentifier, pageName: string) {
    const href = window.location.href;
    const baseURL = href.substring(0, href.lastIndexOf("/"));
    // TODO: Duplicated project prefix; should refactor to have it in one place
    const projectName = project.journalIdentifier.substring("NarraFirmaProject-".length);
    const shortName = project.tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_shortName");
    const url = baseURL + "/narrafirma.html#project=" + projectName + "&page=" +  pageName + "&storyCollection=" + shortName;
    return url;
}

export function toggleWebActivationOfSurvey(model: string, fieldSpecification, value) {
    // TODO: Fix this for mover to using triples for projectModel
    const grid = fieldSpecification.grid;
    const selectedItem: string = grid.getSelectedItem();
    console.log("toggleWebActivationOfSurvey selectedItem", selectedItem, model, fieldSpecification); 
    
    const shortName = project.tripleStore.queryLatestC(selectedItem, "storyCollection_shortName");
    let activeOnWeb = project.tripleStore.queryLatestC(selectedItem, "storyCollection_activeOnWeb");
    activeOnWeb = !activeOnWeb;
    if (activeOnWeb) {
        // urlForSurvey(shortName)
        project.tripleStore.addTriple(selectedItem, "storyCollection_activeOnWeb", true);
    } else {
        project.tripleStore.addTriple(selectedItem, "storyCollection_activeOnWeb", false);
    }
    
    // TODO: Potential window of vulnerability here because not making both changes (to item and survey questionnaires) as a single transaction
    
    const questionnaires = {};
    for (const key in project.activeQuestionnaires) {
        questionnaires[key] = project.activeQuestionnaires[key];
    }
   
    const questionnaire = project.tripleStore.queryLatestC(selectedItem, "questionnaire");
    if (!questionnaire) {
        const questionnaireName = project.tripleStore.queryLatestC(selectedItem, "storyCollection_questionnaireIdentifier");
        console.log("Could not find questionnaire for", questionnaireName);
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
           let errorMessage = "Problem activating web form";
           if (!activeOnWeb) errorMessage = "Problem deactivating web form";
           alert(errorMessage);
           return;
       }
       // TODO: Translate
       let message = "The web form has been activated.";
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
    const storyCollections = project.getListForField("project_storyCollections");
    for (let i = 0; i < storyCollections.length; i++) {
        const storyCollectionIdentifier = storyCollections[i];
        if (project.tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_activeOnWeb")) {
            project.tripleStore.addTriple(storyCollectionIdentifier, "storyCollection_activeOnWeb", false);
        }
    }

    updateActiveQuestionnaires({}, "sendMessage", false);
    console.log("Deactivated all web questionnaires");
}
   
export function isStoryCollectingEnabled() {
    for (const key in project.activeQuestionnaires) {
        return true;
    }
    return false;
}

export function collectQuestionsForQuestionnaire(questionnaire) {
    if (!questionnaire) return [];
    const leadingStoryQuestions = questionnaireGeneration.getLeadingStoryQuestions(questionnaire.elicitingQuestions);
    let questions = [].concat(leadingStoryQuestions, questionnaire.storyQuestions);
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
const filterableQuestionTypes = ["select", "slider", "boolean", "text", "checkbox", "checkboxes", "radiobuttons"];

// function updateFilterPaneForCurrentQuestions(questions) {
export function optionsForAllQuestions(questions, excludeTextQuestionsFlag = null) {
    const questionOptions = [];
    questions.forEach(function (question) {
        if (filterableQuestionTypes.indexOf(question.displayType) !== -1) {
            if (!excludeTextQuestionsFlag || question.displayType !== "text") {
                let defaultText = question.displayName;
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
