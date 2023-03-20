
import Project = require("./Project");
import dialogSupport = require("./panelBuilder/dialogSupport");
import ClientState = require("./ClientState");
import questionnaireGeneration = require("./questionnaireGeneration");
import surveyCollection = require("./surveyCollection");

"use strict";

let project: Project;
let clientState: ClientState;

// Call this to set up the project or other needed data
export function initialize(theProject: Project, theClientState: ClientState) {
    project = theProject;
    clientState = theClientState;
}

export function createNewStoryCollection() {

    function constructStoryCollectionDialog() {
        const storyFormNamesList = project.listOfAllStoryFormNames();
        console.log("storyFormNamesList", storyFormNamesList);
        const options = [];
        for (let index in storyFormNamesList) {
            options.push(m("option", {value: storyFormNamesList[index], selected: undefined}, storyFormNamesList[index]));
        }
        return m("div", 
            [m("div.narrafirma-create-collection-name-prompt", "Enter a name for the new story collection."),
                m("div.narrafirma-create-collection-input-name-div", 
                    m('input[type=text]', 
                        {
                            id: "storyCollection_shortName", 
                            class: "narrafirma-create-collection-input-name",
                            value: newCollectionName, 
                            onchange: (event) => { 
                                if (allCollectionNames.length && allCollectionNames.indexOf(event.target.value) >= 0) {
                                    alert("That name is already in use. Please enter a different name.");
                                    event.target.value = "";
                                } else {
                                    newCollectionName = event.target.value;
                                }
                            }
                        }
                    )
                ),
                m("div.narrafirma-create-collection-form-prompt", `Choose a story form to associate with the collection.`),
                m("div.narrafirma-create-collection-choose-form", 
                    [m('label', {for: "storyForms", class: "narrafirma-create-collection-choose-form-label"}, "Story form"),
                    m("select", 
                        {
                            id: "storyForms",
                            class: "narrafirma-create-collection-choose-form-select",
                            value: "",
                            onchange: (event) => {
                                newCollectionStoryFormName = event.target.value;
                            }
                        }, options),
                    ]),
            ]);
    } 

    let newCollectionName = "";
    const allCollectionNames = project.listOfAllStoryCollectionNames();
    let newCollectionStoryFormName = "";
    const dialogConfiguration = {
        dialogModel: null,
        dialogTitle: "Create New Story Collection",
        dialogEntryText: "",
        dialogClass: undefined,
        dialogConstructionFunction: constructStoryCollectionDialog,
        dialogOKButtonLabel: "Create Story Collection",
        dialogCancelButtonLabel: "Cancel",
        dialogOKCallback: 
            function(dialogConfiguration, hideDialogMethod) { 
                if (newCollectionName && newCollectionStoryFormName) {
                    const confirmationPrompt = 'Please confirm that you want to create a story collection called "' + newCollectionName
                        + '" using the story form called "' + newCollectionStoryFormName + '."';
                    if (confirm(confirmationPrompt)) {
                        const template = {};
                        template["storyCollection_shortName"] = newCollectionName;
                        template["storyCollection_questionnaireIdentifier"] = newCollectionStoryFormName;

                        let setIdentifier = project.tripleStore.queryLatestC(project.projectIdentifier, "project_storyCollections");
                        if (!setIdentifier) {
                            setIdentifier = project.tripleStore.newIdForSet("StoryCollectionSet");
                            project.tripleStore.addTriple(project.projectIdentifier, "project_storyCollections", setIdentifier);
                        }
                        const newCollectionID = project.tripleStore.makeNewSetItem(setIdentifier, "StoryCollection", template);
                        project.tripleStore.addTriple(newCollectionID, "id", newCollectionID);

                        const questionnaire = questionnaireGeneration.buildStoryForm(newCollectionStoryFormName);
                        if (!questionnaire) {
                            alert('The selected story form (' + newCollectionStoryFormName + ") was not found.");
                            return;
                        }
                        project.tripleStore.addTriple(newCollectionID, "questionnaire", questionnaire);
                    } else {
                        return;
                    }
                } else {
                    if (!newCollectionName) {
                        alert("Please enter a name for the story collection.");
                    } else if (!newCollectionStoryFormName) {
                        alert("Please choose a story form to associate with the new story collection.");
                    }
                    return;
                }
                hideDialogMethod(); 
            }
    };
    return dialogSupport.openDialog(dialogConfiguration);

}

function questionsOnlyInFirstList(listOne, listTwo, idField) {
    const result = [];
    for (let itemOne of listOne) {
        let foundItemOneInListTwo = false;
        for (let itemTwo of listTwo) {
            if (itemTwo[idField] === itemOne[idField]) {
                foundItemOneInListTwo = true;
                break;
            }
        }
        if (!foundItemOneInListTwo) {
            result.push(itemOne);
        }
    }
    return result;
}

function questionsInBothLists(listOne, listTwo, idField) {
    const result = [];
    for (let itemOne of listOne) {
        for (let itemTwo of listTwo) {
            if (itemTwo[idField] === itemOne[idField]) {
                result.push(itemOne);
            }
        }
    }
    return result;
}

function questionForID(list, idField, idValue) {
    let result = null;
    for (let item of list) {
        if (item[idField] == idValue) {
            result = item;
        }
    }
    return result;
}

function displayQuestionIDs(list, idField) {
    let ids = [];
    for (let item of list) {
        ids.push(item[idField].replace("S_", "").replace("P_", ""));
    }
    return ids.join(", ");
}

function displayQuestionName(id) {
    return id.replace("S_", "").replace("P_", "");
}

export function updateQuestionnaireForStoryCollection(storyCollectionIdentifier) {
    updateOrCheckQuestionnaireForStoryCollection(storyCollectionIdentifier, true);
}

export function checkStoryFormsForDataConflicts(storyCollectionIdentifier) {
    updateOrCheckQuestionnaireForStoryCollection(storyCollectionIdentifier, false);
}

function updateOrCheckQuestionnaireForStoryCollection(storyCollectionIdentifier, actuallyCopy = false) {

    function numStoriesWithDataForQuestionID(question, stories) {
        const storiesWithThisQuestion = [];
        for (let story of stories) {
            const value = story.fieldValue(question.id);
            // value could be string, number, or dictionary
            if (typeof value === "string" || typeof value === "number") {
                if (value !== undefined && value !== null && value !== "") {
                    storiesWithThisQuestion.push(story);
                }
            } else { 
                // for dictionary, cannot just check if it exists; must also check if there are any true values 
                // because if a respondent checks then unchecks a value, the dictionary persists
                if (value !== undefined && value !== null) {
                    const keys = Object.keys(value);
                    let hasTrueEntry = false;
                    for (let key of keys) {
                        if (value[key] === true) {
                            hasTrueEntry = true;
                        }
                    }
                    if (hasTrueEntry) {
                        storiesWithThisQuestion.push(story);
                    }
                }
            }
        }
        return storiesWithThisQuestion.length;
    }

    function messageForTypeMismatch(snapshotQuestion, currentQuestion, name, stories) {
        let result = "";
        const snapshotType = snapshotQuestion.displayType;
        const currentType = currentQuestion.displayType;
        if (snapshotType != currentType) {
            let okay = false;
            okay = okay || (snapshotType == "label" && currentType == "header");
            okay = okay || (snapshotType == "header" && currentType == "label");
            
            okay = okay || (snapshotType == "text" && currentType == "textarea");
            okay = okay || (snapshotType == "textarea" && currentType == "text");
            
            okay = okay || (snapshotType == "select" && currentType == "radiobuttons");
            okay = okay || (snapshotType == "radiobuttons" && currentType == "select");
            
            okay = okay || (snapshotType == "boolean" && currentType == "checkbox");
            okay = okay || (snapshotType == "checkbox" && currentType == "boolean");
            
            if (!okay) {
                const numStoriesWithDataForQuestion = numStoriesWithDataForQuestionID(snapshotQuestion, stories);
                const storiesHave = (numStoriesWithDataForQuestion !== 1) ? " stories have" : " story has";
                if (numStoriesWithDataForQuestion > 0) {
                    result += 'For the question:\n  - ' + name
                    + '\nthe snapshot version has the type:\n  - ' + snapshotType
                    + '\nand the current version has the type\n  - ' + currentType;
                    result += "\nThese question types are incompatible, and " 
                        + numStoriesWithDataForQuestion + storiesHave + " data for the snapshot version.";
                }
            }
        }
        return result;
    }
    
    function messageForAnswerListMismatch(snapshotQuestion, currentQuestion, name, stories) {
        let result = "";
        const snapshotAnswers = snapshotQuestion.valueOptions;
        const currentAnswers = currentQuestion.valueOptions;
        if (JSON.stringify(snapshotAnswers) != JSON.stringify(currentAnswers)) {
            const matchingAnswers = [];
            const answersOnlyInSnapshot = [];
            for (let snapshotAnswer of snapshotAnswers) {
                for (let currentAnswer of currentAnswers) {
                    if (currentAnswer === snapshotAnswer) {
                        matchingAnswers.push(snapshotAnswer);
                    }
                }
                if (matchingAnswers.indexOf(snapshotAnswer) < 0) {
                    answersOnlyInSnapshot.push(snapshotAnswer);
                }
            }
            if (answersOnlyInSnapshot.length > 0) {
                const answerCountsOnlyInSnapshot = {};
                let totalNumAnswers = 0;
                for (let sAnswer of answersOnlyInSnapshot) {
                    let numStoriesWithSAnswer = 0;
                    for (let story of stories) {
                        const value = story.fieldValue(snapshotQuestion.id);
                        let match = false;
                        if (typeof value === "string" || typeof value === "number") {
                            match = value == sAnswer;
                        } else {
                            match = value.hasOwnProperty(sAnswer);
                        }
                        if (match) {
                            numStoriesWithSAnswer++;
                        }
                    }
                    answerCountsOnlyInSnapshot[sAnswer] = numStoriesWithSAnswer;
                    totalNumAnswers += numStoriesWithSAnswer
                }
                if (totalNumAnswers > 0) {
                    result += 'For the question "' + name + '" the answers:\n  - ' + answersOnlyInSnapshot.join("\n  - ")
                        + '\nappear in the snapshot version, do not appear in the current version, and are connected to stories.\n';
                    const storyCountMessages = [];
                    Object.keys(answerCountsOnlyInSnapshot).forEach(function(anAnswer) {
                        storyCountMessages.push('   - the answer "' + anAnswer + '" appears in ' + answerCountsOnlyInSnapshot[anAnswer] 
                            + (answerCountsOnlyInSnapshot[anAnswer] > 1) ? " stories." : " story.");
                    });
                    result += storyCountMessages.join("\n");
                } 
            } 
        }
        return result;
    }
    
    function checkTwoQuestionsForTypeAndListMismatches(snapshotQuestion, currentQuestion, stories) {
        let result = "";
        const typeMismatchMessage = messageForTypeMismatch(snapshotQuestion, currentQuestion, displayQuestionName(snapshotQuestion.id), stories);
        if (typeMismatchMessage) {
            result += typeMismatchMessage;
        } else {
            const typesWithValueOptions = ["select", "radiobuttons", "checkboxes"];
            if (typesWithValueOptions.indexOf(snapshotQuestion.displayType) >= 0) {
                result += messageForAnswerListMismatch(snapshotQuestion, currentQuestion, displayQuestionName(snapshotQuestion.id), stories);
            } 
        }
        return result;
    }

    function constructResultDialog(startText, noticeText, problemsText, endText, snapshot) {
        const snapshotText = JSON.stringify(snapshot, null, "\t");
        const currentText = JSON.stringify(current, null, "\t");
        return m("div", 
            [
                m("div.narrafirma-update-story-form-start", startText),
                noticeText ? m("div.narrafirma-update-story-form-notice", noticeText) : "",
                problemsText ? m("pre.narrafirma-update-story-form-problems", problemsText): "",
                problemsText ? m("button.narrafirma-update-story-form-copy-button", {onclick: function(event) {
                    const textareas = document.getElementsByClassName("narrafirma-update-story-form-problems");
                    if (textareas.length > 0) window.navigator['clipboard'].writeText(textareas[0].innerHTML);
                }}, "Copy") : m("div"),
                m("div.narrafirma-update-story-form-end", endText),
                m("div.narrafirma-update-story-form-type-label", "The snapshot version saved in the story collection"),
                m("pre.narrafirma-update-story-form-snapshot", snapshotText),
                m("button.narrafirma-update-story-form-copy-button", {onclick: function(event) {
                    const textareas = document.getElementsByClassName("narrafirma-update-story-form-snapshot");
                    if (textareas.length > 0) window.navigator['clipboard'].writeText(textareas[0].innerHTML);
                }}, "Copy"),
                m("div.narrafirma-update-story-form-type-label", "The current version"),
                m("pre.narrafirma-update-story-form-current", currentText),
                m("button.narrafirma-update-story-form-copy-button", {onclick: function(event) {
                    const textareas = document.getElementsByClassName("narrafirma-update-story-form-current");
                    if (textareas.length > 0) window.navigator['clipboard'].writeText(textareas[0].innerHTML);
                }}, "Copy"),
            ]
        );
    } 
    
    function doCopy(activeOnWeb, override) {
        let prompt = "";
        if (!override) prompt += 'No data conflicts were found. ';
        prompt += "Please confirm that you want to update the snapshot story form associated with the story collection " 
                    + storyCollectionName + '" so that it matches the current version.';
        if (!confirm(prompt)) {
            return;
        }
        const copyOfSnapshotBeforeChange = snapshot;
        const updateResult = setQuestionnaireForStoryCollection(storyCollectionIdentifier);
        if (!updateResult) {
            alert("Problem: Could not build story form.");
            return;
        }
        const activeNotice = activeOnWeb ? 
            "This story collection is currently accepting stories over the internet. "
            + "When you are ready to make these changes live, deactivate the collection's web form. "
            + "Then, when you activate the form again, it will pick up your changes." : null;
        const dialogConfiguration = {
            dialogTitle: "Update successful",
            dialogConstructionFunction: function () {
                return constructResultDialog(
                    "The snapshot version of the story form was successfully updated.",
                    activeNotice,
                    null,
                    "Here are the two versions of the story form as they were before the update (now they are identical).",
                    copyOfSnapshotBeforeChange)
                },
            dialogOKCallback: function(dialogConfiguration, hideDialogMethod) { hideDialogMethod(); }
        };
        return dialogSupport.openDialog(dialogConfiguration);
    }

    if (!storyCollectionIdentifier) {
        alert("Problem: No story collection identifier.");
        return;
    }
    const storyCollectionName = project.tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_shortName");
    if (!storyCollectionName) {
        alert("Problem: No story collection name.");
        return;
    }

    const storyCollection = project.tripleStore.makeObject(storyCollectionIdentifier, true);
    const activeOnWeb = project.tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_activeOnWeb");
    const snapshot = storyCollection.questionnaire;
    const linkedStoryFormName = project.tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_questionnaireIdentifier");
    const linkedStoryFormID = project.findStoryFormID(linkedStoryFormName);
    const current = questionnaireGeneration.buildStoryFormUsingTripleStoreID(linkedStoryFormID, linkedStoryFormName);
    const stories = surveyCollection.getStoriesForStoryCollection(storyCollectionName);

    if (stories.length === 0) {
        if (actuallyCopy) { 
            doCopy(activeOnWeb, false);
            return;
        } else {
            alert("This story collection has no stories in it, so you can update the story form without creating any data conflicts.");
            return;
        }
    }

    const indent = "  - ";
    const problemTexts = [];

    // for eliciting questions, just look for questions (with data) that are missing in the current version
    // this could happen because questions were removed, but it could also happen if question short names were changed
    const eqInSnapshotOnly = questionsOnlyInFirstList(snapshot.elicitingQuestions, current.elicitingQuestions, "id");
    if (eqInSnapshotOnly.length > 0) {
        const eqInSnapshotOnlyWithStoryData = [];
        for (let eq of eqInSnapshotOnly) {
            const storiesWithThisQuestion = [];
            for (let story of stories) {
                const value = story.fieldValue("elicitingQuestion");
                if (value && value === eq["id"]) {
                    storiesWithThisQuestion.push(story);
                }
            }
            if (storiesWithThisQuestion.length > 0) {
                eqInSnapshotOnlyWithStoryData.push(eq);
            }
        }
        if (eqInSnapshotOnlyWithStoryData.length > 0) {
            const text = "The eliciting questions in this list:\n" + indent + displayQuestionIDs(eqInSnapshotOnlyWithStoryData, "id") 
                + "\nare:\n" + indent + "in the snapshot version of the form\n" 
                + indent + "not in the current version of the form\n" 
                + indent + "connected to at least one story";
            problemTexts.push(text);
        }
    }

    // for story and participant questions, also need to check for type mismatches and answer list mismatches
    for (let qType of ["story", "participant"]) {
        const qInSnapshotOnly = questionsOnlyInFirstList(snapshot[qType + "Questions"], current[qType + "Questions"], "id");
        if (qInSnapshotOnly.length > 0) {
            const qInSnapshotOnlyWithStoryData = [];
            for (let question of qInSnapshotOnly) {
                const storiesWithDataForThisQuestion = numStoriesWithDataForQuestionID(question, stories);
                if (storiesWithDataForThisQuestion > 0) {
                    qInSnapshotOnlyWithStoryData.push(question);
                }
            }
            if (qInSnapshotOnlyWithStoryData.length > 0) {
                const text = "The " + qType + " questions in this list:\n" + indent + displayQuestionIDs(qInSnapshotOnlyWithStoryData, "id") 
                    + "\nare:\n" + indent + "in the snapshot version of the form\n" 
                    + indent + "not in the current version of the form\n" 
                    + indent + "answered for at least one story";
                problemTexts.push(text);
            }
        }
        const qInBothLists = questionsInBothLists(snapshot[qType + "Questions"], current[qType + "Questions"], "id");
        for (let question of qInBothLists) {
            const snapshotQuestion = questionForID(snapshot[qType + "Questions"], "id", question.id);
            const currentQuestion = questionForID(current[qType + "Questions"], "id", question.id);
            const problemText = checkTwoQuestionsForTypeAndListMismatches(snapshotQuestion, currentQuestion, stories);
            if (problemText.length > 0) {
                problemTexts.push(problemText);
            }
        }
    }

    if (problemTexts.length === 0) {
        if (actuallyCopy) {
            doCopy(activeOnWeb, false);
        } else {
            const dialogConfiguration = {
                dialogTitle: "No data conflicts found",
                dialogConstructionFunction: function () {
                    return constructResultDialog(
                        "No data conflicts were found. You can safely update this story form.", null,
                        null, "For your reference, here are the two story forms in detail.", snapshot)
                    },
                dialogOKCallback: function(dialogConfiguration, hideDialogMethod) { hideDialogMethod(); }
            };
            return dialogSupport.openDialog(dialogConfiguration);
        }
    } else {
        let allProblemsText = "";
        for (let i = 0; i < problemTexts.length; i++) {
            allProblemsText += i+1 + ". " + problemTexts[i] + "\n\n";
        }
        if (actuallyCopy) {
            const dialogConfiguration = {
                dialogTitle: "There are data conflicts",
                dialogConstructionFunction: function () {
                    return constructResultDialog(
                        "The snapshot story form should not be updated because of the following issues.", null,
                        allProblemsText, "Here are the two story forms in detail.", snapshot)
                    },
                dialogOKButtonLabel: "Override (Update anyway)",
                dialogOKCallback: function(dialogConfiguration, hideDialogMethod) { hideDialogMethod(); doCopy(activeOnWeb, true); },
                dialogCancelButtonLabel: actuallyCopy ? "Cancel" : "Close"
            };
            return dialogSupport.openDialog(dialogConfiguration);
        } else {
            const dialogConfiguration = {
                dialogTitle: "There are data conflicts",
                dialogConstructionFunction: function () {
                    return constructResultDialog(
                        "The snapshot story form should not be updated because of the following issues.", null,
                        allProblemsText, "Here are the two story forms in detail.", snapshot)
                    },
                dialogCloseCallback: function(dialogConfiguration, hideDialogMethod) { hideDialogMethod(); }
            };
            return dialogSupport.openDialog(dialogConfiguration);
        }
    }
} 

function setQuestionnaireForStoryCollection(storyCollectionIdentifier): boolean {
    if (!storyCollectionIdentifier) return false;
    const questionnaireName = project.tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_questionnaireIdentifier");
    const questionnaire = questionnaireGeneration.buildStoryForm(questionnaireName);
    if (!questionnaire) return false;
    project.tripleStore.addTriple(storyCollectionIdentifier, "questionnaire", questionnaire);
    return true;
}