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
    if (upToWhat !== "") {
        return aString.split(upToWhat)[0];
    } else {
        return aString;
    }
}

function stringBeyond(aString, beyondWhat) {
    if (beyondWhat !== "") {
        return aString.split(beyondWhat).pop();
    } else {
        return aString;
    }
}

function rowIsEmpty(row) {
    for (var i = 0; i < row.length; i++) {
        if (row[i] != "") {
            return false;
        }
    }
    return true;
}

function processCSVContents(contents, callbackForItem) {
    var rows = d3.csv.parseRows(contents);
    var items = [];
    var header;
    
    for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        var row = rows[rowIndex];
        if (rowIsEmpty(row)) {
            ;
        } else if (row[0].trim().charAt(0) === ";") { 
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
                        // don't actually want item; this is just a way to check if the header is correct before the rest of the data is read
                        var headerIsOkay = callbackForItem(header, row, true); 
                        if (!headerIsOkay) return {header: null, items: null};
                    }
                }
            } else {
                var newItem = callbackForItem(header, row, false);
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
        if (questionnaire.storyQuestions[i].import_columnName === fieldName) {
            matchingQuestion = questionnaire.storyQuestions[i];
            break;
        }
    }
    if (!matchingQuestion) {
            for (i = 0; i < questionnaire.participantQuestions.length; i++) {
            if (questionnaire.participantQuestions[i].import_columnName === fieldName) {
                matchingQuestion = questionnaire.participantQuestions[i];
                break;
            }
        }
    }
    if (!matchingQuestion) {
        var leadingStoryQuestions = questionnaireGeneration.getLeadingStoryQuestions(questionnaire.elicitingQuestions);
        for (i = 0; i < leadingStoryQuestions.length; i++) {
            if (leadingStoryQuestions[i].import_columnName === fieldName) {
                matchingQuestion = leadingStoryQuestions[i];
                break;
            }
        }
    }
    return matchingQuestion;
}

function getDisplayAnswerNameForDataAnswerName(value, question) {
    // the question MIGHT have import_answerNames, but it will ALWAYS have valueOptions
    if (!question.valueOptions || question.valueOptions.length < 1) {
        return value;
    } else {
        for (var i = 0; i < question.valueOptions.length; i++) {
            // first check to see if it matches the import option name
            if (i < question.import_answerNames.length) {
                if (value === question.import_answerNames[i]) {
                    return question.valueOptions[i];
                }
            }
            if (value === question.valueOptions[i]) {
                return question.valueOptions[i];
            }

            
        }
    }
    return null;
}

function processCSVContentsForStories(contents) {

    var storyCollectionName = Globals.clientState().storyCollectionName();
    if (!storyCollectionName) {
        alert("No story collection has been selected");
    }
    
    var questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionName, true);
    if (!questionnaire) return;
    
    var progressModel = dialogSupport.openProgressDialog("Processing CSV file...", "Progress writing imported stories", "Cancel", dialogCancelled);
  
    var headerAndItems = processCSVContents(contents, function (header, row, rowIsHeader) {
        if (rowIsHeader) {
            if (!row) {
                alert("ERROR: No header line found in CSV file.")
                return false;
            }
            if (!(row.includes(questionnaire.import_storyTitleColumnName) && row.includes(questionnaire.import_storyTextColumnName))) {
                alert("ERROR: Data file header (first row) is missing at least one required cell. It must have entries for Story title and Story text, as specified in the story form.")
                return false;
            }
            return true; // header is okay, can read data
        } else {
            var newItem = {};
            for (var fieldIndex = 0; fieldIndex < header.length; fieldIndex++) {
                // in situation where the row is shorter the the headers, because there is no value in the last cell(s), don't assign any value
                var value = undefined;
                if (row[fieldIndex] != undefined) value = row[fieldIndex].trim(); // Note the value is trimmed
                if (value !== "") {
                    if (header[fieldIndex] === questionnaire.import_storyTitleColumnName) {
                        newItem["Story title"] = value;
                    } else if (header[fieldIndex] === questionnaire.import_storyTextColumnName) {
                        newItem["Story text"] = value;
                    } else if (header[fieldIndex] === questionnaire.import_elicitingQuestionColumnName) {
                        newItem["Eliciting question"] = value;
                    } else if (header[fieldIndex] === questionnaire.import_participantIDColumnName) {
                        newItem["Participant ID"] = value;
                    } else {
                        if (header[fieldIndex].indexOf(questionnaire.import_multiChoiceYesQASeparator) >= 0) {
                            var separator = questionnaire.import_multiChoiceYesQASeparator;
                            if (separator.toLowerCase() === "space") {
                                separator = " ";
                            }
                            var fieldName = stringUpTo(header[fieldIndex], separator);
                            var answerName = stringBeyond(header[fieldIndex], separator).trim();
                            answerName = stringUpTo(answerName, questionnaire.import_multiChoiceYesQAEnding);
                        } else {
                            var fieldName = header[fieldIndex];
                            var answerName = null;
                        }
                        var question = questionForHeaderFieldName(fieldName, questionnaire, project);
                        if (question) { 
                            if (["Single choice", "Radiobuttons", "Boolean", "Checkbox", "Text", "Textarea"].indexOf(question.import_valueType) >= 0) {
                                var answerNameToUse = getDisplayAnswerNameForDataAnswerName(value, question);
                                if (answerNameToUse) {
                                    newItem[fieldName] = answerNameToUse;
                                }
                            } else if (question.import_valueType === "Single choice indexed") {
                                var valueAsInt = parseInt(value);
                                if (!isNaN(valueAsInt)) {
                                    for (var index = 0; index < question.valueOptions.length; index++) {
                                        if (valueAsInt-1 === index) {
                                            newItem[fieldName] = question.valueOptions[index];
                                            break;
                                        }
                                    }
                                }
                            } else if (question.import_valueType === "Scale") {
                                newItem[fieldName] = parseInt(value);
                            } else if (question.import_valueType === "Multi-choice multi-column texts") {
                                var answerNameToUse = getDisplayAnswerNameForDataAnswerName(value, question);
                                if (answerNameToUse) {
                                    if (!newItem[fieldName]) newItem[fieldName] = {};
                                    newItem[fieldName][answerNameToUse] = true;
                                }
                            } else if (question.import_valueType === "Multi-choice multi-column yes/no") {
                                if (value === questionnaire.import_multiChoiceYesIndicator) {
                                    if (!newItem[fieldName]) newItem[fieldName] = {};
                                    var answerNameToUse = getDisplayAnswerNameForDataAnswerName(answerName, question);
                                    if (answerNameToUse) newItem[fieldName][answerNameToUse] = true;
                                }
                            } else if (question.import_valueType === "Multi-choice single-column delimited") {
                                newItem[fieldName] = {};
                                var delimiter = questionnaire.import_multiChoiceDelimiter;
                                if (delimiter.toLowerCase() === "space") delimiter = " ";
                                var delimitedItems = value.split(delimiter);
                                delimitedItems.forEach((delimitedItem) => {
                                    var trimmedDelimitedItem = delimitedItem.trim();
                                    if (trimmedDelimitedItem !== "") {
                                        var answerNameToUse = getDisplayAnswerNameForDataAnswerName(trimmedDelimitedItem, question);
                                        if (answerNameToUse) {
                                            newItem[fieldName][answerNameToUse] = true;
                                        }
                                    }
                                });
                            } else if (question.import_valueType === "Multi-choice single-column delimited indexed") {
                                newItem[fieldName] = {};
                                var delimiter = questionnaire.import_multiChoiceDelimiter;
                                if (delimiter.toLowerCase() === "space") delimiter = " ";
                                var delimitedIndexTexts = value.split(delimiter);
                                delimitedIndexTexts.forEach((delimitedIndexText) => {
                                    var delimitedIndex = parseInt(delimitedIndexText);
                                    if (!isNaN(delimitedIndex)) {
                                        for (var index = 0; index < question.valueOptions.length; index++) {
                                            if (delimitedIndex-1 === index) {
                                                newItem[fieldName][question.valueOptions[index]] = true;
                                                break;
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
            return newItem;
        }
    });

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
                warnIfProblemWithCellValueForQuestion(value, question.displayName, question.import_valueType, question.storyQuestion_import_answerNames || question.valueOptions, errorsToReport);
            }

            newSurveyResult.stories.push(story);
            totalStoryCount += 1;
            for (i = 0; i < questionnaire.participantQuestions.length; i++) {
                question = questionnaire.participantQuestions[i];
                var value = storyItem[question.id.substring("S_".length)];
                newSurveyResult.participantData[question.id] = value;
                changeValueIfScaleAndCustomScaleValues(question, newSurveyResult.participantData, questionnaire);
                warnIfProblemWithCellValueForQuestion(value, question.displayName, question.import_valueType, question.participantQuestion_import_answerNames || question.valueOptions, errorsToReport);
            }
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
    if (!options || !value) return;
    if (questionType === "Single choice") {
        if (value && options.indexOf(value) === -1) {
            var error = "The answer '" + value + "' does not match any of the available answers [" + options.join(";") + "] for the question '" + questionName + "'";
            if (errorsToReport.indexOf(error) === -1) errorsToReport.push(error);
        }
    } else if (questionType === "Multi-choice multi-column texts" || questionType === "Multi-choice single-column delimited") {
        for (var i = 0; i < value.length; i++) {
            var valueElement = value[i];
            if (valueElement && options.indexOf(valueElement) === -1) {
                var error = "The answer '" + valueElement + "' does not match any of the answers [" + options.join(";") + "] for the question '" + questionName + "'";
                if (errorsToReport.indexOf(error) === -1) errorsToReport.push(error);
            }
        }
    }
    // nothing to check for Single choice indexed, Multi-choice single-column delimited indexed, Multi-choice multi-column yes/no
    // because these were all converted to the available answers during initial processing
    // so  at this point they will either be corrector missing
    // the Scale type was already dealt with in changeValueIfScaleAndCustomScaleValues 
}

function changeValueIfScaleAndCustomScaleValues(question, thingWithValue, questionnaire) {
    if (question.displayType !== "slider") return;
    var min = undefined;
    if (question.import_minScaleValue) {
        min = question.import_minScaleValue;
    } else if (questionnaire.import_minScaleValue) {
        min = questionnaire.import_minScaleValue;
    }
    var max = undefined;
    if (question.import_maxScaleValue) {
        max = question.import_maxScaleValue;
    } else if (questionnaire.import_maxScaleValue) {
        max = questionnaire.import_maxScaleValue;
    }
    if (min === undefined || min === NaN || max === undefined || max === NaN || min === max) return;
    if (thingWithValue[question.id] === undefined || thingWithValue[question.id] === "") return;

    var value = parseInt(thingWithValue[question.id]);
    if (value <= min) {
        thingWithValue[question.id] = "0";
    } else if (value >= max) {
        thingWithValue[question.id] = "100";
    } else {
        var multiplier = 100 / (max - min);
        if (multiplier && multiplier > 0) {
             var adjustedValue = Math.round((value - min) * multiplier);
             if (adjustedValue > 100) adjustedValue = 100;
             if (adjustedValue < 0) adjustedValue = 0;
             thingWithValue[question.id] = "" + adjustedValue;
        }
    }
}

function processCSVContentsForQuestionnaire(contents) {
    var headerAndItems = processCSVContents(contents, function (header, row, rowIsHeader) {
        if (rowIsHeader) { // this is to check header before the rest of the file is read
            if (!row) {
                alert("ERROR: No header line found in CSV file.")
                return false;
            }
            if (!(row.includes("Data column name") && row.includes("Short name") && row.includes("Long name") && row.includes("Type") && row.includes("About") && row.includes("Answers"))) {
                alert("ERROR: Header is missing at least one required cell. It must have entries for Data column name, Short name, Long name, Type, About, and Answers. It also must be the first readable row in the CSV file.")
                return false;
            }
            return true; // header is okay, can go on to read data
        } else {
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
        }
    });
    
    var shortName = prompt("Please enter a short name for the new story form. (It must be unique within the project.)");
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
    // TODO: Maybe rename questionForm_ to storyForm_ ?

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
    
        import_minScaleValue: 0,
        import_maxScaleValue: 0,
        import_multiChoiceYesIndicator: "Yes",
        import_multiChoiceYesQASeparator: "",
        import_multiChoiceYesQAEnding: "",
        import_multiChoiceDelimiter: ",",
        import_storyTitleColumnName: "Story title",
        import_storyTextColumnName: "Story text",
        import_participantIDColumnName: "Participant ID",

        import_elicitingQuestionColumnName: "Eliciting question",
        import_elicitingQuestionGraphName: "Eliciting question",
        questionForm_chooseQuestionText: "What question would you like to answer?",
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
        } else if (about === "eliciting") {
            template.import_elicitingQuestionColumnName = item["Data column name"],
            template.import_elicitingQuestionGraphName = item["Short name"];
            template.questionForm_chooseQuestionText = item["Long name"]; 
            var answers = item["Answers"];
            answers.forEach(function (elicitingQuestionDefinition) {
                if (!elicitingQuestionDefinition) elicitingQuestionDefinition = "ERROR:MissingElicitingText";
                var sections = elicitingQuestionDefinition.split("|");
                // If only one section, use it as import name, short name, AND text
                // if two sections, use first as both import name and short name, use second as text
                if (sections.length < 2) {
                    sections.push(sections[0]); // copy import name to short name
                    sections.push(sections[0]); // copy import name to text
                } else if (sections.length < 3) {
                    sections.splice(1, 0, sections[0]); // copy import name to short name, leaving text alone
                }
                var elicitingQuestion = {
                    elicitingQuestion_importName: sections[0].trim(),
                    elicitingQuestion_shortName: sections[1].trim(),
                    elicitingQuestion_text: sections[2].trim(),
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
                    case "Enter story text":
                        template.questionForm_enterStoryText = text;
                        project.tripleStore.addTriple(template.id, "questionForm_enterStoryText", text);
                        break;
                    case "Choose question text": // this is legacy; i've moved it to the eliciting question long name, but some old files may still have this
                        template.questionForm_chooseQuestionText = text;
                        project.tripleStore.addTriple(template.id, "questionForm_chooseQuestionText", text);
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
                if (type === "Scale range") {
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
                            project.tripleStore.addTriple(template.id, "questionForm_import_minScaleValue", value);
                        } else {
                            template.import_maxScaleValue = value;
                            project.tripleStore.addTriple(template.id, "questionForm_import_maxScaleValue", value);
                        }
                        answerCount += 1;
                    });
                } else if (type === "Multi choice single column delimiter") {
                    template.import_multiChoiceDelimiter = text;
                    project.tripleStore.addTriple(template.id, "questionForm_import_multiChoiceDelimiter", text);
                } else if (type === "Yes no questions yes indicator") {
                    template.import_multiChoiceYesIndicator = text;
                    project.tripleStore.addTriple(template.id, "questionForm_import_multiChoiceYesIndicator", text);
                } else if (type === "Yes no questions Q-A separator") {
                    template.import_multiChoiceYesQASeparator = text;
                    project.tripleStore.addTriple(template.id, "questionForm_import_multiChoiceYesQASeparator", text);
                } else if (type === "Yes no questions Q-A ending") {
                    template.import_multiChoiceYesQAEnding = text;
                    project.tripleStore.addTriple(template.id, "questionForm_import_multiChoiceYesQAEnding", text);
                } else if (type === "Story title column name") {
                    template.import_storyTitleColumnName = text;
                    project.tripleStore.addTriple(template.id, "questionForm_import_storyTitleColumnName", text);
                } else if (type === "Story text column name") {
                    template.import_storyTextColumnName = text;
                    project.tripleStore.addTriple(template.id, "questionForm_import_storyTextColumnName", text);
                } else if (type === "Participant ID column name") {
                    template.import_participantIDColumnName = text;
                    project.tripleStore.addTriple(template.id, "questionForm_import_participantIDColumnName", text);
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

function valueAndImportOptionsForAnswers(answers) {
    var valueOptions = [];
    var import_answerNames = [];
    for (var i = 0; i < answers.length; i++) {
        if (answers[i].indexOf("|") >= 0) {
            var dataAndDisplay = answers[i].split("|");
            if (dataAndDisplay.length > 1) {
                import_answerNames.push(dataAndDisplay[0]);
                valueOptions.push(dataAndDisplay[1]);
            } else {
                valueOptions.push(dataAndDisplay[0]);
                import_answerNames.push(dataAndDisplay[0]); // there could be different answers for only some entries
            }
        } else {
            valueOptions.push(answers[i]);
        }
    }
    return [valueOptions, import_answerNames];
}

function questionForItem(item, questionCategory) {
    var valueType = "string";
    var questionType = "text";
    var valueOptions;
    var import_columnName;
    var import_answerNames;
    var import_minScaleValue = null;
    var import_maxScaleValue = null;
    
    var itemType = item["Type"].trim();
    var answers = item["Answers"];

    // legacy - old name for "Multi-choice multi-column texts" was "Multiple choice"
    if (itemType === "Multiple choice") {
        itemType = "Multi-choice multi-column texts";
    }

    if (["Single choice", "Single choice indexed"].indexOf(itemType) >= 0) {
        questionType = "select";
        var valueAndImportOptions = valueAndImportOptionsForAnswers(answers);
        valueOptions = valueAndImportOptions[0];
        import_answerNames = valueAndImportOptions[1];
        if (answers.length < 2) {
            alert('Import error: For the Single choice question "' + item["Short name"] + '", there must be at least two entries in the Answers columns.');
        }
    } else if (["Multi-choice multi-column texts", "Multi-choice multi-column yes/no", "Multi-choice single-column delimited", "Multi-choice single-column delimited indexed"].indexOf(itemType) >= 0) {
        questionType = "checkboxes";
        var valueAndImportOptions = valueAndImportOptionsForAnswers(answers);
        valueOptions = valueAndImportOptions[0];
        import_answerNames = valueAndImportOptions[1];
        if (answers.length < 2) {
            alert('Import error: For the Multiple choice question "' + item["Short name"] + '", there must be at least two entries in the Answers columns.');
        }
    } else if (itemType === "Radiobuttons") {
        questionType = "radiobuttons";
        var valueAndImportOptions = valueAndImportOptionsForAnswers(answers);
        valueOptions = valueAndImportOptions[0];
        import_answerNames = valueAndImportOptions[1];
        if (answers.length < 2) {
            alert('Import error: For the Radiobuttons question "' + item["Short name"] + '", there must be at least two entries in the Answers columns.');
        }
    } else if (itemType === "Boolean") {
        questionType = "boolean";
    } else if (itemType === "Checkbox") {
        questionType = "checkbox";
        valueOptions = answers;
    } else if (itemType === "Text") {
        questionType = "text";
    } else if (itemType === "Textarea") {
        questionType = "textarea";
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
                    import_minScaleValue = value;
                } else {
                    import_maxScaleValue = value;
                }
                answerCount += 1;
            });
        }
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

    // legacy - older files will not have the "Data column name" field, but the "Short name" field should work for it
    if (!item["Data column name"]) {
        question["import_columnName"] = item["Short name"];
    } else {
        question["import_columnName"] = item["Data column name"];
    }

    question["import_valueType"] = itemType;
    question["import_minScaleValue"] = import_minScaleValue;
    question["import_maxScaleValue"] = import_maxScaleValue;
    if (import_answerNames && import_answerNames.length > 0) question["import_answerNames"] = import_answerNames;
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
    "checkboxes": "Multi-choice multi-column texts",
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
    
    var output = "";
    var lineIndex = 1;
    function addOutputLine(line) {
        output = addCSVOutputLine(output, line);
    }
    
    var header = ["Data column name", "Type", "About", "Short name", "Long name", "Answers"];
    addOutputLine(header);
    
    var elicitingLine = ["Eliciting question", "eliciting", "eliciting", "Eliciting question", "Eliciting question"];
    currentQuestionnaire.elicitingQuestions.forEach(function (elicitingQuestionSpecification) {
        elicitingLine.push(elicitingQuestionSpecification.id + "|" + elicitingQuestionSpecification.text);
    });
    addOutputLine(elicitingLine);

    function outputQuestions(questions, about) {
        for (var i = 0; i < questions.length; i++) {
            var outputLine = [];
            var question = questions[i];

            // data column name
            outputLine.push(question.displayName || ""); // short name is also data column name for export
            
            // type
            var questionType = exportQuestionTypeMap[question.displayType];
            if (!questionType) {
                console.log("EXPORT ERROR: unsupported question type: ", question.displayType);
                questionType = "UNSUPPORTED:" + question.displayType;
            }
            outputLine.push(questionType);

            // about
            outputLine.push(about);

            // short name
            outputLine.push(question.displayName || ""); 

            // long name
            outputLine.push(question.displayPrompt || ""); 

            // answers
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

    addOutputLine(["", "Title", "form", "", "", currentQuestionnaire.title || ""]);
    addOutputLine(["", "Start text", "form", "", "", currentQuestionnaire.startText || ""]);
    addOutputLine(["", "Image", "form", "", "", currentQuestionnaire.image || ""]);
    addOutputLine(["", "End text", "form", "", "", currentQuestionnaire.endText || ""]);
    addOutputLine(["", "About you text", "form", "", "", currentQuestionnaire.aboutYouText || ""]);
    addOutputLine(["", "Thank you text", "form", "", "", currentQuestionnaire.thankYouPopupText || ""]);
    addOutputLine(["", "Custom CSS", "form", "", "", currentQuestionnaire.customCSS || ""]);
    addOutputLine(["", "Custom CSS for Printing", "form", "", "", currentQuestionnaire.customCSSForPrint || ""]);

    addOutputLine(["", "Choose question text", "form", "", "", currentQuestionnaire.chooseQuestionText || ""]);
    addOutputLine(["", "Enter story text", "form", "", "", currentQuestionnaire.enterStoryText || ""]);
    addOutputLine(["", "Name story text", "form", "", "", currentQuestionnaire.nameStoryText || ""]);
    addOutputLine(["", "Tell another story text", "form", "", "", currentQuestionnaire.tellAnotherStoryText || ""]);
    addOutputLine(["", "Tell another story button", "form", "", "", currentQuestionnaire.tellAnotherStoryButtonText || ""]);
    addOutputLine(["", "Max num stories", "form", "", "", currentQuestionnaire.maxNumStories || ""]);
    addOutputLine(["", "Slider value prompt", "form", "", "", currentQuestionnaire.sliderValuePrompt || ""]);

    addOutputLine(["", "Submit survey button", "form", "", "", currentQuestionnaire.submitSurveyButtonText || ""]);
    addOutputLine(["", "Sending survey text", "form", "", "", currentQuestionnaire.questionForm_sendingSurveyResultsText || ""]);
    addOutputLine(["", "Could not save survey text", "form", "", "", currentQuestionnaire.questionForm_couldNotSaveSurveyText || ""]);
    addOutputLine(["", "Resubmit survey button", "form", "", "", currentQuestionnaire.resubmitSurveyButtonText || ""]);
    
    addOutputLine(["", "Delete story button", "form", "", "", currentQuestionnaire.deleteStoryButtonText || ""]);
    addOutputLine(["", "Delete story prompt", "form", "", "", currentQuestionnaire.deleteStoryDialogPrompt || ""]);
    addOutputLine(["", "Survey stored message", "form", "", "", currentQuestionnaire.surveyStoredText || ""]);
    addOutputLine(["", "Show survey result", "form", "", "", currentQuestionnaire.showSurveyResultPane || ""]);
    addOutputLine(["", "Survey result header", "form", "", "", currentQuestionnaire.surveyResultPaneHeader || ""]);
    
    addOutputLine(["", "Error message no elicitation question chosen", "form", "", "", currentQuestionnaire.errorMessage_noElicitationQuestionChosen || ""]);
    addOutputLine(["", "Error message no story text", "form", "", "", currentQuestionnaire.errorMessage_noStoryText || ""]);

    // do not need to write "Scale range" because scale data was converted to 0-100 scale during import
    // do not need to write "Yes no questions Q-A separator" or "Yes no questions Q-A ending" or "Yes no questions yes indicator" or "Multi choice single column delimiter"
    // because only the original multi-choice format is used (Multi-choice multi-column texts) for which there are no import options
    // do not need to write "Story title column name" or "Story text column name" or "Eliciting question column name" or "Participant ID column name"
    // because the default (non specified) options will work for all of these things

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
    
    var storyCollectionBlob = new Blob([output], {type: "text/csv;charset=utf-8"});
    // TODO: This seems to clear the console in FireFox 40; why?
    saveAs(storyCollectionBlob, "export_story_collection_" + storyCollectionName + ".csv");
}
