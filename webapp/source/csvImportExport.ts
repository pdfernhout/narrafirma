import Project = require("./Project");
import d3 = require("d3");
import generateRandomUuid = require("./pointrel20150417/generateRandomUuid");
import questionnaireGeneration = require("./questionnaireGeneration");
import surveyCollection = require("./surveyCollection");
import surveyStorage = require("./surveyStorage");
import dialogSupport = require("./panelBuilder/dialogSupport");
import Globals = require("./Globals");
import m = require("mithril");
import toaster = require("./panelBuilder/toaster");
import saveAs = require("FileSaver");
import sanitizeHTML = require("./sanitizeHTML");

"use strict";

var project: Project;

export function initialize(theProject) {
    project = theProject;
}

function stringUpTo(aString, upToWhat) {
    return aString.split(upToWhat)[0];
}

function stringBeyond(aString, beyondWhat) {
    return aString.split(beyondWhat).pop();
}

function processCSVContents(contents, callbackForItem) {
    var rows = d3.csv.parseRows(contents);
    var items = [];
    var header;
    
    for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        var row = rows[rowIndex];
        // Throw away comment lines and lines with blanks at first two positions
        if (!row.length || row.length < 2 || (!row[0].trim() && !row[1].trim()) || row[0].trim().charAt(0) === ";") {
            ;
        } else {
            if (!header) {
                header = [];
                var headerEnded = false;
                for (var headerIndex = 0; headerIndex < row.length; headerIndex++) {
                    var label = row[headerIndex];
                    if (label) {
                        // Should be an error if header fields are missing but more show up later
                        if (headerEnded) {
                            console.log("ERROR: header has empty field before end");
                            alert("ERROR: At least one column in the data file has no header. There should be no empty column headers. ");
                        }
                        header.push(label);
                    } else {
                        headerEnded = true;
                    }
                }
            } else {
                var newItem = callbackForItem(header, row);
                if (newItem) items.push(newItem);
            }
        }
    }
    return {header: header, items: items};
}

function padLeadingZeros(num: number, size: number) {
    var result = num + "";
    while (result.length < size) result = "0" + result;
    return result;
}

function questionForHeaderFieldName(fieldName, questionnaire, project) {
    if (!questionnaire) return null;
    if (!fieldName) return null;
    var matchingQuestion = null;
    for (var i = 0; i < questionnaire.storyQuestions.length; i++) {
        if (questionnaire.storyQuestions[i].displayName === fieldName) {
            matchingQuestion = questionnaire.storyQuestions[i];
            break;
        }
    }
    if (!matchingQuestion) {
            for (i = 0; i < questionnaire.participantQuestions.length; i++) {
            if (questionnaire.participantQuestions[i].displayName === fieldName) {
                matchingQuestion = questionnaire.participantQuestions[i];
                break;
            }
        }
    }
    if (!matchingQuestion) {
        var leadingStoryQuestions = questionnaireGeneration.getLeadingStoryQuestions(questionnaire.elicitingQuestions);
        for (i = 0; i < leadingStoryQuestions.length; i++) {
            if (leadingStoryQuestions[i].displayName === fieldName) {
                matchingQuestion = leadingStoryQuestions[i];
                break;
            }
        }
    }
    return matchingQuestion;
}

function processCSVContentsForStories(contents) {

    const multiChoiceDelimiter = "==";

    var storyCollectionName = Globals.clientState().storyCollectionName();
    if (!storyCollectionName) {
        alert("No story collection has been selected");
    }
    
    var questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionName, true);
    if (!questionnaire) return;
    
    var progressModel = dialogSupport.openProgressDialog("Processing CSV file...", "Progress writing imported stories", "Cancel", dialogCancelled);
  
    var headerAndItems = processCSVContents(contents, function (header, row) {
        var newItem = {};
        for (var fieldIndex = 0; fieldIndex < header.length; fieldIndex++) {
            // in situation where the row is shorter the the headers, because there is no value in the last cell(s), don't assign any value
            var value = undefined;
            if (row[fieldIndex] != undefined) value = row[fieldIndex].trim(); // Note the value is trimmed
            if (value !== "") {
                // get question (and sometimes answer text) out of header
                if (header[fieldIndex].indexOf(multiChoiceDelimiter) >= 0) {
                    var fieldName = stringUpTo(header[fieldIndex], multiChoiceDelimiter).trim();
                    var answerName = stringBeyond(header[fieldIndex], multiChoiceDelimiter).trim();
                } else {
                    var fieldName = header[fieldIndex];
                    var answerName = null;
                }
                var question = questionForHeaderFieldName(fieldName, questionnaire, project);
                if (question) { 
                    if (["Single choice", "Radiobuttons", "Boolean", "Checkbox", "Text", "Textarea"].indexOf(question.importType) >= 0) {
                        newItem[fieldName] = value;
                    } else if (question.importType === "Scale") {
                        newItem[fieldName] = parseInt(value);
                    } else if (question.importType === "Multiple choice") {
                        if (!newItem[fieldName]) newItem[fieldName] = {};
                        newItem[fieldName][value] = true;
                    } else if (question.importType === "Multiple choice yes/no") {
                        if (!newItem[fieldName]) newItem[fieldName] = {};
                        if (question["multiChoiceYesIndicator"] && value === question["multiChoiceYesIndicator"] && answerName) newItem[fieldName][answerName] = true;
                    } else if (question.importType === "Multiple choice delimited") {
                        newItem[fieldName] = {};
                        var delimitedItems = value.split(question["multiChoiceDelimiter"]);
                        delimitedItems.forEach((delimitedItem) => {
                            var trimmedDelimitedItem = delimitedItem.trim();
                            if (trimmedDelimitedItem !== "") newItem[fieldName][trimmedDelimitedItem] = true;
                        });
                    }
                }
            }
        }
        return newItem;
    });

    var header = headerAndItems.header;
    if (!header) {
        alert("ERROR: No header line found in CSV file.")
        return;
    }
    if (!(header.includes("Story title") && header.includes("Story text"))) {
        alert("ERROR: Header is missing at least one required cell. It must have entries for Story title and Story text. It also must be the first readable row in the CSV file.")
        return;
    }

    var errorsToReport = [];

    var items = headerAndItems.items;
    var surveyResults = [];
    var untitledCount = 0;
    // TODO: this is a kludgy way to get a string and seems brittle
    var importedByUserIdentifier = project.userIdentifier.userIdentifier;

    // group items by participant ID field, if entered
    var itemsByParticipantID = {};
    for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {
        var item = items[itemIndex];
        var participantID = item["Participant ID"] || generateRandomUuid("Participant");
        if (!itemsByParticipantID[participantID]) {
            itemsByParticipantID[participantID] = [];
        }
        itemsByParticipantID[participantID].push(item);
    }

    var totalStoryCount = 0;
    for (var participantIDIndex in itemsByParticipantID) {
        // TODO: Copied code from surveyBuilder module! Need a common function with surveyBuilder to make this!!!
        var newSurveyResult = {
            __type: "org.workingwithstories.QuestionnaireResponse",
            // TODO: Think about whether to include entire questionnaire or something else perhaps
            questionnaire: questionnaire,
            responseID: generateRandomUuid("QuestionnaireResponse"),
            stories: [],
            participantData: {
                __type: "org.workingwithstories.ParticipantData",
                participantID: participantIDIndex
            },
            // TODO: Should have timestamp in CSV file!!!
            timestampStart: "" + new Date().toISOString(),
            timestampEnd: "" + new Date().toISOString(),
            timeDuration_ms: 0,
            // TODO: this is a kludgy way to get a string and seems brittle
            importedBy: importedByUserIdentifier
        };

        for (var storyIndex in itemsByParticipantID[participantIDIndex]) {
            var storyItem = itemsByParticipantID[participantIDIndex][storyIndex];
        
            var elicitingQuestion = storyItem["Eliciting question"] || questionnaire.elicitingQuestions[0].id;
            var story = {
                __type: "org.workingwithstories.Story",
                // TODO: Can this "id" field be safely removed? id: generateRandomUuid("TODO:???"),
                storyID: generateRandomUuid("Story"),
                participantID: participantIDIndex,
                elicitingQuestion: elicitingQuestion,
                storyText: storyItem["Story text"],
                storyName: storyItem["Story title"] || ("Untitled #" + padLeadingZeros(++untitledCount, 4)),
                numStoriesTold: "" + itemsByParticipantID[participantIDIndex].length
            };
        
            var i;
            var question;
            for (i = 0; i < questionnaire.storyQuestions.length; i++) {
                question = questionnaire.storyQuestions[i];
                var value = storyItem[question.id.substring("S_".length)];
                story[question.id] = value;
                changeValueIfScaleAndCustomScaleValues(question, story, questionnaire);
                warnIfProblemWithCellValueForQuestion(value, question.displayName, question.displayType, question.valueOptions, errorsToReport);
            }

            newSurveyResult.stories.push(story);
            totalStoryCount += 1;
            for (i = 0; i < questionnaire.participantQuestions.length; i++) {
                question = questionnaire.participantQuestions[i];
                var value = storyItem[question.id.substring("S_".length)];
                newSurveyResult.participantData[question.id] = value;
                changeValueIfScaleAndCustomScaleValues(question, newSurveyResult.participantData, questionnaire);
                warnIfProblemWithCellValueForQuestion(value, question.displayName, question.displayType, question.valueOptions, errorsToReport);
            }
            
            // Add any annotations
            project.collectAllAnnotationQuestions().forEach((annotationQuestion) => {
                var id = annotationQuestion.annotationQuestion_shortName;
                var value = storyItem[id];
                if (value !== null && value !== undefined) {
                    newSurveyResult.participantData["A_" + id] = value;
                    changeValueIfScaleAndCustomScaleValues(question, newSurveyResult.participantData, questionnaire);
                    warnIfProblemWithCellValueForQuestion(value, annotationQuestion.annotationQuestion_shortName, annotationQuestion.annotationQuestion_type, annotationQuestion.annotationQuestion_options, errorsToReport);
                    
                }
            });
        }
        surveyResults.push(newSurveyResult);
    }
       
    if (!surveyResults.length) {
        alert("No stories to write");
        progressModel.hideDialogMethod();
        progressModel.redraw();
        return;
    }
    
    /*
    var newStoryCollection = {
        id: generateRandomUuid("StoryCollection"),
        storyCollection_shortName: storyCollectionIdentifier,
        storyCollection_questionnaireIdentifier: questionnaire.title,
        storyCollection_activeOnWeb: false,
        storyCollection_notes: "imported by: " + importedByUserIdentifier + " at: " + new Date().toISOString(),
        questionnaire: questionnaire
    };
    
    var storyCollections = project.getFieldValue("project_storyCollections");
    if (!storyCollections) {
        storyCollections = project.tripleStore.newIdForSet("StoryCollectionSet");
        project.setFieldValue("project_storyCollections", storyCollections);
    }

    project.tripleStore.makeNewSetItem(storyCollections, "StoryCollection", newStoryCollection);
     
    */

    var totalSurveyCount = surveyResults.length;

    function dialogCancelled(dialogConfiguration, hideDialogMethod) {
        progressModel.cancelled = true;
        hideDialogMethod();
    }
    
    var wizardPane = {
        forward: function () {
            console.log("survey sending success");
            if (progressModel.failed) return;
            sendNextSurveyResult();
        },
        failed: function () {
            console.log("survey sending failed");
            if (progressModel.failed) return;
            progressModel.failed = true;
            // TODO: Translate
            alert("Problem saving survey result; check the console for details.");
            progressModel.hideDialogMethod();
            progressModel.redraw();
        }
    };
    
    var surveyIndexToSend = 0;
    
    function sendNextSurveyResult() {
        if (progressModel.cancelled) {
            alert("Cancelled after sending " + totalStoryCount + " stories from " + surveyIndexToSend + " participants");
        } else if (surveyIndexToSend >= surveyResults.length) {
            alert("Finished sending " + totalStoryCount + " stories from " + totalSurveyCount + " participants to server.");
            progressModel.hideDialogMethod();
            progressModel.redraw();
        } else {
            var surveyResult = surveyResults[surveyIndexToSend++];
            // TODO: Translate
            progressModel.progressText = "Sending " + totalStoryCount + " stories from " + surveyIndexToSend + " of " + totalSurveyCount + " participants";
            progressModel.redraw();
            surveyStorage.storeSurveyResult(project.pointrelClient, project.projectIdentifier, storyCollectionName, surveyResult, wizardPane);
        }
    }
    
    // Start sending survey results
    sendNextSurveyResult();

    if (errorsToReport.length > 0) {
        var text = "Errors reading stories:\n\n";
        for (var index = 0; index < errorsToReport.length; index++) {
            text += index+1 + ". " + errorsToReport[index] + "\n";
        }
        alert(text);
        console.log(text);
    }
}

function warnIfProblemWithCellValueForQuestion(value, questionName, questionType, options, errorsToReport) {
    if (questionType === "select" || questionType === "boolean" || questionType == "radiobuttons" || questionType == "checkbox") {
        // check for multiple choice data (Object) trying to fit a single-choice question
        if (typeof value === 'object') {
            var error = "The question '" + questionName + "' should be single-choice, but the data is in multiple-choice format.";
            if (errorsToReport.indexOf(error) === -1) errorsToReport.push(error);
        } else if (value && options.indexOf(value) === -1) {
            var error = "The cell value '" + value + "' does not match any of the options [" + options.join(";") + "] for the question '" + questionName + "'";
            if (errorsToReport.indexOf(error) === -1) errorsToReport.push(error);
        }
    } else if (questionType === "checkboxes") {
        if (typeof value === 'object') {
            for (var option in value) {
                if (option && options.indexOf(option) === -1) {
                    var error = "The cell value '" + option + "' does not match any of the options [" + options.join(";") + "] for the question '" + questionName + "'";
                    if (errorsToReport.indexOf(error) === -1) errorsToReport.push(error);
                }
            } 
        } else { // if only one value was read it might not be a dictionary
            if (value && options.indexOf(value) === -1) {
                var error = "The cell value '" + value + "' does not match any of the options [" + options.join(";") + "] for the question '" + questionName + "'";
                if (errorsToReport.indexOf(error) === -1) errorsToReport.push(error);   
            }             
        } 
    } else if (questionType === "slider") {
        if (isNaN(value)) {
            var error = "The cell value '" + value + "' for the question '" + questionName + "' should be a number but is not.";
            if (errorsToReport.indexOf(error) === -1) errorsToReport.push(error);
        }
    }
}

function changeValueIfScaleAndCustomScaleValues(question, thingWithValue, questionnaire) {
    if (question.displayType !== "slider") return;
    if (question.minScaleValue) {
        var min = question.minScaleValue;
    } else {
        var min = questionnaire.import_minScaleValue;
    }
    if (question.maxScaleValue) {
        var max = question.maxScaleValue;
    } else {
        var max = questionnaire.import_maxScaleValue;
    }
    if (min === undefined || min === NaN || max === undefined || max === NaN || min === max) return;
    if (thingWithValue[question.id] === undefined || thingWithValue[question.id] === "") return;

    var value = parseInt(thingWithValue[question.id]);
    if (value === min) {
        thingWithValue[question.id] = "0";
    } else if (value === max) {
        thingWithValue[question.id] = "100";
    } else {
        var multiplier = 100 / (max - min);
        if (multiplier && multiplier > 0) {
            thingWithValue[question.id] = "" + Math.round((value - min) * multiplier);
        }
    }
}

function processCSVContentsForQuestionnaire(contents) {
    var headerAndItems = processCSVContents(contents, function (header, row) {
        var newItem = {};
        var lastFieldIndex;
        for (var fieldIndex = 0; fieldIndex < row.length; fieldIndex++) {
            var fieldName = header[fieldIndex];
            if (fieldName) {
                lastFieldIndex = fieldIndex;
            } else {
                fieldName = header[lastFieldIndex];
            }
            // TODO: Should the value really be trimmed?
            var value = row[fieldIndex].trim();
            if (fieldIndex < header.length - 1) {
                newItem[fieldName] = value;
            } else {
                // Handle multiple values for last header items
                var list = newItem[fieldName];
                if (!list) {
                    list = [];
                    newItem[fieldName] = list;
                }
                if (value) list.push(value);
            }
        }
        return newItem;
    });
    
    var header = headerAndItems.header;
    if (!header) {
        alert("ERROR: No header line found in CSV file.")
        return;
    }
    if (!(header.includes("Long name") && header.includes("Short name") && header.includes("Type") && header.includes("About") && header.includes("Answers"))) {
        alert("ERROR: Header is missing at least one required cell. It must have entries for Long name, Short name, Type, About, and Answers. It also must be the first readable row in the CSV file.")
        return;
    }

    var shortName = prompt("Please enter a short name for the new story form. (It should be unique within the project.)");
    if (!shortName) return;
    if (questionnaireGeneration.buildQuestionnaire(shortName)) {
        alert('A story form already exists with that name: "' + shortName + '"');
        return;
    }
    
    var storyFormListIdentifier = project.getFieldValue("project_storyForms");
    
    if (!storyFormListIdentifier) {
        storyFormListIdentifier = project.tripleStore.newIdForSet("StoryFormSet");
        project.setFieldValue("project_storyForms", storyFormListIdentifier);
    }
 
    // TODO: Generalize random uuid function to take class name
    // TODO: Maybe rename quesitonForm_ to storyForm_ ?

    var template = {
        id: generateRandomUuid("StoryForm"),
        questionForm_shortName: shortName,
        questionForm_elicitingQuestions: project.tripleStore.newIdForSet("ElicitingQuestionChoiceSet"),
        questionForm_storyQuestions: project.tripleStore.newIdForSet("StoryQuestionChoiceSet"),
        questionForm_participantQuestions: project.tripleStore.newIdForSet("ParticipantQuestionChoiceSet"),
        questionForm_title: "",
        questionForm_startText: "",
        questionForm_image: "",
        questionForm_endText: "",
        questionForm_thankYouPopupText: "",
        questionForm_customCSS: "",
        questionForm_customCSSForPrint: "",
        import_minScaleValue: 0,
        import_maxScaleValue: 0,

        questionForm_chooseQuestionText: "",
        questionForm_enterStoryText: "",
        questionForm_nameStoryText: "",
        questionForm_tellAnotherStoryText: "",
        questionForm_tellAnotherStoryButtonText: "",
        questionForm_maxNumStories: "no limit",
        questionForm_sliderValuePrompt: "",

        questionForm_submitSurveyButtonText: "",
        questionForm_sendingSurveyResultsText: "",
        questionForm_couldNotSaveSurveyText: "",
        questionForm_resubmitSurveyButtonText: "",

        questionForm_deleteStoryButtonText: "",
        questionForm_deleteStoryDialogPrompt: "",
        questionForm_surveyStoredText: "",
        questionForm_showSurveyResultPane: "",
        questionForm_surveyResultPaneHeader: "",

        questionForm_errorMessage_noElicitationQuestionChosen: "",
        questionForm_errorMessage_noStoryText: "",
        questionForm_errorMessage_noStoryName: "",
        };
    
    project.tripleStore.makeNewSetItem(storyFormListIdentifier, "StoryForm", template);
    
    // For all items:
    //   Check if one with that name already exists; warn if options or type is different
    //   If does not exist, create it in the related set
    //   Add a reference to the question in the story form
        
    var questionTypeCounts = {};
    
    var items = headerAndItems.items;
    for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {
        var item = items[itemIndex];
        var about = item.About;
        var reference;
        var question;
        if (about === "story") {
            question = questionForItem(item, "storyQuestion");
            reference = ensureQuestionExists(question, "storyQuestion");
            addReferenceToList(template.questionForm_storyQuestions, reference, "storyQuestion", "StoryQuestionChoice");
        } else if (about === "participant") {
            question = questionForItem(item, "participantQuestion");
            reference = ensureQuestionExists(question, "participantQuestion");
            addReferenceToList(template.questionForm_participantQuestions, reference, "participantQuestion", "ParticipantQuestionChoice");
        } else if (about === "annotation") {
            question = questionForItem(item, "annotationQuestion");
            reference = ensureQuestionExists(question, "annotationQuestion");
            // addReference(template.questionForm_annotationQuestions, reference, "annotationQuestion", "AnnotationQuestionChoice");
        } else if (about === "eliciting") {
            var answers = item["Answers"];
            answers.forEach(function (elicitingQuestionDefinition) {
                if (!elicitingQuestionDefinition) elicitingQuestionDefinition = "ERROR:MissingElicitingText";
                var sections = elicitingQuestionDefinition.split("|");
                // If only one section, use it as both id and text
                if (sections.length < 2) {
                    sections.push(sections[0]);
                }
                var elicitingQuestion = {
                    elicitingQuestion_text: sections[1].trim(),
                    elicitingQuestion_shortName: sections[0].trim(),
                    elicitingQuestion_type: {}
                };
                reference = ensureQuestionExists(elicitingQuestion, "elicitingQuestion");
                addReferenceToList(template.questionForm_elicitingQuestions, reference, "elicitingQuestion", "ElicitingQuestionChoice");
            });
        } else if (about === "form") {
            var type = item.Type;
            var text = item.Answers[0];
            if (text && text != "") {
                switch (type) {
                    case "Title":
                        template.questionForm_title = text; 
                        project.tripleStore.addTriple(template.id, "questionForm_title", text);
                        break;
                    case "Start text":
                        template.questionForm_startText = text;
                        project.tripleStore.addTriple(template.id, "questionForm_startText", text);
                        break;
                    case "Image":
                        template.questionForm_image = text;
                        project.tripleStore.addTriple(template.id, "questionForm_image", text);
                        break;
                    case "End text":
                        template.questionForm_endText = text;
                        project.tripleStore.addTriple(template.id, "questionForm_endText", text);
                        break;
                    case "Thank you text":
                        template.questionForm_thankYouPopupText = text;
                        project.tripleStore.addTriple(template.id, "questionForm_thankYouPopupText", text);
                        break;
                    case "Custom CSS":
                        template.questionForm_customCSS = text;
                        project.tripleStore.addTriple(template.id, "questionForm_customCSS", text);
                        break;
                    case "Custom CSS for Printing":
                        template.questionForm_customCSSForPrint = text;
                        project.tripleStore.addTriple(template.id, "questionForm_customCSSForPrint", text);
                        break;
                    case "Choose question text":
                        template.questionForm_chooseQuestionText = text;
                        project.tripleStore.addTriple(template.id, "questionForm_chooseQuestionText", text);
                        break;
                    case "Enter story text":
                        template.questionForm_enterStoryText = text;
                        project.tripleStore.addTriple(template.id, "questionForm_enterStoryText", text);
                        break;
                    case "Name story text":
                        template.questionForm_nameStoryText = text;
                        project.tripleStore.addTriple(template.id, "questionForm_nameStoryText", text);
                        break;
                    case "Tell another story text":
                        template.questionForm_tellAnotherStoryText = text;
                        project.tripleStore.addTriple(template.id, "questionForm_tellAnotherStoryText", text);
                        break;
                    case "Tell another story button":
                        template.questionForm_tellAnotherStoryButtonText = text;
                        project.tripleStore.addTriple(template.id, "questionForm_tellAnotherStoryButtonText", text);
                        break;
                    case "Max num stories":
                        template.questionForm_maxNumStories = text;
                        project.tripleStore.addTriple(template.id, "questionForm_maxNumStories", text);
                        break;
                    case "Slider value prompt":
                        template.questionForm_sliderValuePrompt = text;
                        project.tripleStore.addTriple(template.id, "questionForm_sliderValuePrompt", text);
                        break;

                    case "Submit survey button":
                        template.questionForm_submitSurveyButtonText = text;
                        project.tripleStore.addTriple(template.id, "questionForm_submitSurveyButtonText", text);
                        break;
                    case "Sending survey text":
                        template.questionForm_sendingSurveyResultsText = text;
                        project.tripleStore.addTriple(template.id, "questionForm_sendingSurveyResultsText", text);
                        break;
                    case "Could not save survey text":
                        template.questionForm_couldNotSaveSurveyText = text;
                        project.tripleStore.addTriple(template.id, "questionForm_couldNotSaveSurveyText", text);
                        break;
                    case "Resubmit survey button":
                        template.questionForm_resubmitSurveyButtonText = text;
                        project.tripleStore.addTriple(template.id, "questionForm_resubmitSurveyButtonText", text);
                        break;
                    case "Delete story button":
                        template.questionForm_deleteStoryButtonText = text;
                        project.tripleStore.addTriple(template.id, "questionForm_deleteStoryButtonText", text);
                        break;
                    case "Delete story prompt":
                        template.questionForm_deleteStoryDialogPrompt = text;
                        project.tripleStore.addTriple(template.id, "questionForm_deleteStoryDialogPrompt", text);
                        break;
                    case "Survey stored message":
                        template.questionForm_surveyStoredText = text;
                        project.tripleStore.addTriple(template.id, "questionForm_surveyStoredText", text);
                        break;
                    case "Show survey result":
                        template.questionForm_showSurveyResultPane = text;
                        project.tripleStore.addTriple(template.id, "questionForm_showSurveyResultPane", text);
                        break;
                    case "Survey result header":
                        template.questionForm_surveyResultPaneHeader = text;
                        project.tripleStore.addTriple(template.id, "questionForm_surveyResultPaneHeader", text);
                        break;
                    
                    case "Error message no elicitation question chosen":
                        template.questionForm_errorMessage_noElicitationQuestionChosen = text;
                        project.tripleStore.addTriple(template.id, "questionForm_errorMessage_noElicitationQuestionChosen", text);
                        break;
                    case "Error message no story text":
                        template.questionForm_errorMessage_noStoryText = text;
                        project.tripleStore.addTriple(template.id, "questionForm_errorMessage_noStoryText", text);
                        break;
                    case "Error message no story name":
                        template.questionForm_errorMessage_noStoryName = text;
                        project.tripleStore.addTriple(template.id, "questionForm_errorMessage_noStoryName", text);
                        break;
                }
            }
        } else if (about === "import") {
            var type = item.Type;
            var text = item.Answers[0];
            if (text && text != "") {
                switch (type) {
                    case "Scale range":
                        var answers = item["Answers"];
                        var answerCount = 0;
                        answers.forEach(function (textValue) {
                            var value = parseInt(textValue);
                            if (isNaN(value)) {
                                var word = "minimum";
                                if (answerCount === 1) word = "maximum";
                                alert('The text you entered for the ' + word + ' scale value ("' + textValue + '") could not be converted to a number.');
                            }
                            if (answerCount === 0) {
                                template.import_minScaleValue = value;
                                project.tripleStore.addTriple(template.id, "import_minScaleValue", value);
                            } else {
                                template.import_maxScaleValue = value;
                                project.tripleStore.addTriple(template.id, "import_maxScaleValue", value);
                            }
                            answerCount += 1;
                        });
                        break;
                // might add other import options here later
                }
            }
        } else if (about === "ignore") {
            // Ignore value so do nothing
        } else {
            console.log("Error: unexpected About type of ", about);
        }
    }
    
    m.redraw();
    
    toaster.toast("Finished reading story form: " + shortName);
    toaster.toast("Updating server in progress in background");
    
    function addReferenceToList(listIdentifier: string, reference: string, fieldName: string, className: string) {
        var order = questionTypeCounts[fieldName];
        if (!order) {
            order = 0;
        }
        order = order + 1;
        questionTypeCounts[fieldName] = order;
        
        var choice = {
            order: order
        };
        choice[fieldName] = reference;
        
        project.tripleStore.makeNewSetItem(listIdentifier, className, choice);
    }
}

export function autoFillStoryForm() {
        var questionnaireName = prompt("Please enter a short name for the new story form.");
        if (!questionnaireName) return;
        if (questionnaireGeneration.buildQuestionnaire(questionnaireName)) {
            alert('A story form already exists with that name: "' + questionnaireName + '"');
            return;
        }
       
        var storyFormListIdentifier = project.getFieldValue("project_storyForms");
        if (!storyFormListIdentifier) {
            storyFormListIdentifier = project.tripleStore.newIdForSet("StoryFormSet");
            project.setFieldValue("project_storyForms", storyFormListIdentifier);
        }
        var template = {
            id: generateRandomUuid("StoryForm"),
            questionForm_shortName: questionnaireName,
            questionForm_elicitingQuestions: project.tripleStore.newIdForSet("ElicitingQuestionChoiceSet"),
            questionForm_storyQuestions: project.tripleStore.newIdForSet("StoryQuestionChoiceSet"),
            questionForm_participantQuestions: project.tripleStore.newIdForSet("ParticipantQuestionChoiceSet")
        };
        project.tripleStore.makeNewSetItem(storyFormListIdentifier, "StoryForm", template);

        var questionTypeCounts = {};        
        var question;
        var questionIndex;
    
        var elicitingQuestions = project.collectAllElicitingQuestions();
        for (questionIndex in elicitingQuestions) {
            question = elicitingQuestions[questionIndex];
            addReferenceToList(template.questionForm_elicitingQuestions, question.elicitingQuestion_shortName, "elicitingQuestion", "ElicitingQuestionChoice");
        }

        var storyQuestions = project.collectAllStoryQuestions();
        for (questionIndex in storyQuestions) {
            question = storyQuestions[questionIndex];
            addReferenceToList(template.questionForm_storyQuestions, question.storyQuestion_shortName, "storyQuestion", "StoryQuestionChoice");
        }

        var participantQuestions = project.collectAllParticipantQuestions();
        for (questionIndex in participantQuestions) {
            question = participantQuestions[questionIndex];
            addReferenceToList(template.questionForm_participantQuestions, question.participantQuestion_shortName, "participantQuestion", "ParticipantQuestionChoice");
        }

        m.redraw();
        
        toaster.toast("Finished generating story form \"" + questionnaireName + "\" from available questions.");
        
        function addReferenceToList(listIdentifier: string, reference: string, fieldName: string, className: string) {
            var order = questionTypeCounts[fieldName];
            if (!order) {
                order = 0;
            }
            order = order + 1;
            questionTypeCounts[fieldName] = order;
            
            var choice = {
                order: order
            };
            choice[fieldName] = reference;
            
            project.tripleStore.makeNewSetItem(listIdentifier, className, choice);
        }
}

function ensureQuestionExists(question, questionCategory: string) {
    var idAccessor = questionCategory + "_shortName";
    var existingQuestionsInCategory = project.questionsForCategory(questionCategory);
    var matchingQuestion = null;
    existingQuestionsInCategory.forEach((existingQuestion) => {
        if (existingQuestion[idAccessor] === question[idAccessor]) matchingQuestion = existingQuestion;
    });
    if (!matchingQuestion) {
        project.addQuestionForCategory(question, questionCategory);
    } else {
        // TODO: What if questions with the same shortName but different options already exist?
        // TODO: Should check type as well
        if (matchingQuestion[questionCategory + "_options"] !== question[questionCategory + "_options"]) {
            console.log("IMPORT ISSUE: options don't match for questions", question, matchingQuestion);
            alert("The question " + question[idAccessor] + " already exists, but with different answers. To reuse the same question name with different answers, remove the existing question first.");
        }
    } 

    return question[idAccessor];
}

function questionForItem(item, questionCategory) {
    var valueType = "string";
    var questionType = "text";
    var valueOptions;
    var answers = item["Answers"];
    var multiChoiceDelimiter = null;
    var multiChoiceYesIndicator = null;
    var minScaleValue = null;
    var maxScaleValue = null;
    
    var itemType = item["Type"].trim();
    if (itemType === "Single choice") {
        questionType = "select";
        valueOptions = answers;
        if (answers.length < 2) {
            alert('Import error: For the Single choice question "' + item["Short name"] + '", there must be at least two entries in the Answers columns.');
        }
    } else if (itemType === "Scale") {
        valueType = "number";
        questionType = "slider";
        if (answers.length < 2) {
            alert('Import error: For the Slider question "' + item["Short name"] + '", there must be two labels (for the left and right of the slider) in the Answers columns.');
            valueOptions = ["",""]; // put in empty slider labels so that the graphs will at least draw 
        } else {
            valueOptions = [answers[0], answers[1]];
        }
        if (answers.length > 2) {
            var answerCount = 0;
            answers.slice(2).forEach(function (textValue) {
                var value = parseInt(textValue);
                if (isNaN(value)) {
                    var word = "minimum";
                    if (answerCount === 1) word = "maximum";
                    alert('The text you entered for the ' + word + ' scale value ("' + textValue + '") for the question "' + item["Short name"] + '" could not be converted to a number.');
                }
                if (answerCount === 0) {
                    minScaleValue = value;
                } else {
                    maxScaleValue = value;
                }
                answerCount += 1;
            });
        }
    } else if (itemType === "Multiple choice") {
        questionType = "checkboxes";
        valueOptions = answers;
        if (answers.length < 2) {
            alert('Import error: For the Multiple choice question "' + item["Short name"] + '", there must be at least two entries in the Answers columns.');
        }
    } else if (itemType === "Multiple choice yes/no") { 
        questionType = "checkboxes";
        multiChoiceYesIndicator = answers[0];
        valueOptions = answers.slice(1);
        if (answers.length < 2) {
            alert('Import error: For the Multiple choice yes/no question "' + item["Short name"] + '", there must be at least three entries in the Answers columns (and the first should be the yes indicator).');
        }
    } else if (itemType === "Multiple choice delimited") { 
        questionType = "checkboxes";
        multiChoiceDelimiter = answers[0];
        valueOptions = answers.slice(1);
        if (answers.length < 3) {
            alert('Import error: For the Multiple choice delimited question "' + item["Short name"] + '", there must be at least three entries in the Answers columns (and the first should be the delimiter).');
        }
    } else if (itemType === "Radiobuttons") {
        questionType = "radiobuttons";
        valueOptions = answers;
        if (answers.length < 2) {
            alert('Import error: For the Radiobuttons question "' + item["Short name"] + '", there must be at least two entries in the Answers columns.');
        }
    } else if (itemType === "Boolean") {
        questionType = "boolean";
    } else if (itemType === "Checkbox") {
        questionType = "checkbox";
    } else if (itemType === "Text") {
        questionType = "text";
    } else if (itemType === "Textarea") {
        questionType = "textarea";
    } else {
        console.log("IMPORT ERROR: unsupported question type: ", itemType);
    }
    
    var question = {};
    question[questionCategory + "_type"] = questionType;
    question[questionCategory + "_shortName"] = item["Short name"];
    question[questionCategory + "_text"] = item["Long name"];
    if (valueOptions) {
        question[questionCategory + "_options"] = valueOptions.join("\n");
    }
    question["importType"] = itemType;
    question["multiChoiceDelimiter"] = multiChoiceDelimiter;
    question["multiChoiceYesIndicator"] = multiChoiceYesIndicator;
    question["minScaleValue"] = minScaleValue;
    question["maxScaleValue"] = maxScaleValue;
    return question;
}

function chooseCSVFileToImport(callback) {
    var cvsFileUploader = <HTMLInputElement>document.getElementById("csvFileLoader");
    cvsFileUploader.onchange = function() {
        var file = cvsFileUploader.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e: Event) {
            var contents = (<FileReader>e.target).result;
            callback(contents);
        };
        reader.readAsText(file);
    };
    cvsFileUploader.click();
}

export function importCSVStories() {
    if (!Globals.clientState().storyCollectionName()) {
        // TODO: Translate
        return alert("You need to select a story collection before you can import stories.");
    }
    chooseCSVFileToImport(processCSVContentsForStories);
}

export function importCSVQuestionnaire() {
    chooseCSVFileToImport(processCSVContentsForQuestionnaire);
}

function addCSVOutputLine(output, line) {
    var start = true;
    line.forEach(function (item) {
        if (start) {
            start = false;
        } else {
            output += ",";
        }
        if (item && item.indexOf(",") !== -1) {
            item = item.replace(/"/g, '""');
            item = '"' + item + '"';
        }
        output += item;
    });
    output += "\n";
    return output;
}

var exportQuestionTypeMap = {
    "select": "Single choice",
    "slider": "Scale",
    "checkboxes": "Multiple choice",
    "radiobuttons": "Radiobuttons",
    "boolean": "Boolean",
    "checkbox": "Checkbox",
    "text": "Text",
    "textarea": "Textarea"
};

export function exportQuestionnaire() {
    var storyCollectionName = Globals.clientState().storyCollectionName();
    if (!storyCollectionName) {
        alert("Please select a story collection first");
        return;
    }
    
    var currentQuestionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionName);
    if (!currentQuestionnaire) {
        alert("The story collection has not been initialized with a story form: " + storyCollectionName);
        return;
    }
    
    // Order Long name   Short name  Type    About   Answers
    var output = "";
    var lineIndex = 1;
    function addOutputLine(line) {
        output = addCSVOutputLine(output, line);
    }
    
    var header = ["Order", "Long name", "Short name", "Type", "About", "Answers"];
    addOutputLine(header);
    
    var elicitingLine = ["1", "Eliciting question", "Eliciting question", "Eliciting question", "eliciting"];
    currentQuestionnaire.elicitingQuestions.forEach(function (elicitingQuestionSpecification) {
        elicitingLine.push(elicitingQuestionSpecification.id + "|" + elicitingQuestionSpecification.text);
    });
    addOutputLine(elicitingLine);

    function outputQuestions(questions, about) {
        for (var i = 0; i < questions.length; i++) {
            var outputLine = [];
            var question = questions[i];
            outputLine.push("" + (++lineIndex));
            outputLine.push(question.displayPrompt || "");
            outputLine.push(question.displayName || "");
            
            var questionType = exportQuestionTypeMap[question.displayType];
            if (!questionType) {
                console.log("EXPORT ERROR: unsupported question type: ", question.displayType);
                questionType = "UNSUPPORTED:" + question.displayType;
            }
            outputLine.push(questionType);
            outputLine.push(about);
            
            if (question.displayType === "slider") {
                if (question.displayConfiguration) {
                    if (question.displayConfiguration.length === 1) {
                        outputLine.push(question.displayConfiguration);
                    } else if (question.displayConfiguration.length > 1) {
                        question.displayConfiguration.forEach(function(option) {
                           outputLine.push(option);   
                       });
                    }
               }
            } else { 
                if (question.valueOptions) {
                   question.valueOptions.forEach(function(option) {
                       outputLine.push(option);   
                   });
                }
            }
            addOutputLine(outputLine);
        }
    }
    
    outputQuestions(currentQuestionnaire.storyQuestions, "story");
    outputQuestions(currentQuestionnaire.participantQuestions, "participant");
    
    var annotationQuestions = project.collectAllAnnotationQuestions();
    var adjustedAnnotationQuestions = questionnaireGeneration.convertEditorQuestions(annotationQuestions, "A_");
    outputQuestions(adjustedAnnotationQuestions, "annotation");

    addOutputLine(["" + (++lineIndex), "", "", "Title", "form", currentQuestionnaire.title || ""]);
    addOutputLine(["" + (++lineIndex), "", "", "Start text", "form", currentQuestionnaire.startText || ""]);
    addOutputLine(["" + (++lineIndex), "", "", "Image", "form", currentQuestionnaire.image || ""]);
    addOutputLine(["" + (++lineIndex), "", "", "End text", "form", currentQuestionnaire.endText || ""]);
    addOutputLine(["" + (++lineIndex), "", "", "About you text", "form", currentQuestionnaire.aboutYouText || ""]);
    addOutputLine(["" + (++lineIndex), "", "", "Thank you text", "form", currentQuestionnaire.thankYouPopupText || ""]);
    addOutputLine(["" + (++lineIndex), "", "", "Custom CSS", "form", currentQuestionnaire.customCSS || ""]);
    addOutputLine(["" + (++lineIndex), "", "", "Custom CSS for Printing", "form", currentQuestionnaire.customCSSForPrint || ""]);

    addOutputLine(["" + (++lineIndex), "", "", "Choose question text", "form", currentQuestionnaire.chooseQuestionText || ""]);
    addOutputLine(["" + (++lineIndex), "", "", "Enter story text", "form", currentQuestionnaire.enterStoryText || ""]);
    addOutputLine(["" + (++lineIndex), "", "", "Name story text", "form", currentQuestionnaire.nameStoryText || ""]);
    addOutputLine(["" + (++lineIndex), "", "", "Tell another story text", "form", currentQuestionnaire.tellAnotherStoryText || ""]);
    addOutputLine(["" + (++lineIndex), "", "", "Tell another story button", "form", currentQuestionnaire.tellAnotherStoryButtonText || ""]);
    addOutputLine(["" + (++lineIndex), "", "", "Max num stories", "form", currentQuestionnaire.maxNumStories || ""]);
    addOutputLine(["" + (++lineIndex), "", "", "Slider value prompt", "form", currentQuestionnaire.sliderValuePrompt || ""]);

    addOutputLine(["" + (++lineIndex), "", "", "Submit survey button", "form", currentQuestionnaire.submitSurveyButtonText || ""]);
    addOutputLine(["" + (++lineIndex), "", "", "Sending survey text", "form", currentQuestionnaire.questionForm_sendingSurveyResultsText || ""]);
    addOutputLine(["" + (++lineIndex), "", "", "Could not save survey text", "form", currentQuestionnaire.questionForm_couldNotSaveSurveyText || ""]);
    addOutputLine(["" + (++lineIndex), "", "", "Resubmit survey button", "form", currentQuestionnaire.resubmitSurveyButtonText || ""]);
    
    addOutputLine(["" + (++lineIndex), "", "", "Delete story button", "form", currentQuestionnaire.deleteStoryButtonText || ""]);
    addOutputLine(["" + (++lineIndex), "", "", "Delete story prompt", "form", currentQuestionnaire.deleteStoryDialogPrompt || ""]);
    addOutputLine(["" + (++lineIndex), "", "", "Survey stored message", "form", currentQuestionnaire.surveyStoredText || ""]);
    addOutputLine(["" + (++lineIndex), "", "", "Show survey result", "form", currentQuestionnaire.showSurveyResultPane || ""]);
    addOutputLine(["" + (++lineIndex), "", "", "Survey result header", "form", currentQuestionnaire.surveyResultPaneHeader || ""]);
    
    addOutputLine(["" + (++lineIndex), "", "", "Error message no elicitation question chosen", "form", currentQuestionnaire.errorMessage_noElicitationQuestionChosen || ""]);
    addOutputLine(["" + (++lineIndex), "", "", "Error message no story text", "form", currentQuestionnaire.errorMessage_noStoryText || ""]);
    addOutputLine(["" + (++lineIndex), "", "", "Error message no story name", "form", currentQuestionnaire.errorMessage_noStoryName || ""]);
    

// Export questionnaire
    var questionnaireBlob = new Blob([output], {type: "text/csv;charset=utf-8"});
    // TODO: This seems to clear the console in FireFox 40; why?
    saveAs(questionnaireBlob, "export_story_form_" + storyCollectionName + ".csv");
}

export function exportStoryCollection() {
    var storyCollectionName = Globals.clientState().storyCollectionName();
    if (!storyCollectionName) {
        alert("Please select a story collection first");
        return;
    }
    
    var currentQuestionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionName);
    if (!currentQuestionnaire) {
        alert("The story collection has not been initialized with a story form: " + storyCollectionName);
        return;
    }

    var allStories = surveyCollection.getStoriesForStoryCollection(storyCollectionName, true);
    var header1 = [];
    var header2 = [];
      
    function header(contents, secondHeader = "") {
        header1.push(contents);
        header2.push(secondHeader);
    }
    
    // Put initial header
    header("Story title");
    header("Story text");
    header("Eliciting question");
    
    function headersForQuestions(questions) {
        for (var i = 0; i < questions.length; i++) {
            var question = questions[i];
            // TODO: Maybe should export ID instead? Or more header lines with ID and prompt?
            if (question.valueOptions && question.displayType === "checkboxes") {
                question.valueOptions.forEach(function(option) {
                   header(question.displayName, option);   
               });
            } else {
                header(question.displayName);
            }
        }
    }
    
    headersForQuestions(currentQuestionnaire.storyQuestions);
    headersForQuestions(currentQuestionnaire.participantQuestions);
    
    var annotationQuestions = project.collectAllAnnotationQuestions();
    var adjustedAnnotationQuestions = questionnaireGeneration.convertEditorQuestions(annotationQuestions, "A_");
    headersForQuestions(adjustedAnnotationQuestions);
  
    var output = "";
    function addOutputLine(line) {
        output = addCSVOutputLine(output, line);
    }
    
    addOutputLine(header1);
    addOutputLine(header2);
    
    function dataForQuestions(questions, story: surveyCollection.Story, outputLine) {
        for (var i = 0; i < questions.length; i++) {
            var question = questions[i];
            var value = story.fieldValue(question.id);
            if (value === undefined || value === null) value = "";
            if (question.valueOptions && question.displayType === "checkboxes") {
               question.valueOptions.forEach(function(option) {
                   outputLine.push(value[option] ? option : "");   
               });
            } else {
                outputLine.push(value);
            }
        }
    }
    
    allStories.forEach(function (story) {
        var outputLine = [];
        outputLine.push(story.storyName());
        outputLine.push(story.storyText());
        outputLine.push(story.elicitingQuestion());
        dataForQuestions(currentQuestionnaire.storyQuestions, story, outputLine);
        dataForQuestions(currentQuestionnaire.participantQuestions, story, outputLine);
        dataForQuestions(adjustedAnnotationQuestions, story, outputLine);
        addOutputLine(outputLine);
    }); 
    
    // Testing
    //var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
    //saveAs(blob, "hello world.csv");
    
    // Export story collection
    var storyCollectionBlob = new Blob([output], {type: "text/csv;charset=utf-8"});
    // TODO: This seems to clear the console in FireFox 40; why?
    saveAs(storyCollectionBlob, "export_story_collection_" + storyCollectionName + ".csv");
}
