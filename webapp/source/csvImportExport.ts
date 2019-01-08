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

//------------------------------------------------------------------------------------------------------------------------------------------
// string functions
//------------------------------------------------------------------------------------------------------------------------------------------

function replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function stringUpTo(aString: string, upToWhat: string) {
    if (upToWhat !== "") {
        return aString.split(upToWhat)[0];
    } else {
        return aString;
    }
}

function stringBeyond(aString: string, beyondWhat: string) {
    if (beyondWhat !== "") {
        return aString.split(beyondWhat).pop();
    } else {
        return aString;
    }
}

function padLeadingZeros(num: number, size: number) {
    var result = num + "";
    while (result.length < size) result = "0" + result;
    return result;
}

function shortenTextIfNecessary(text: string) {
    if (!text || text.length < 50) return text;
    return text.slice(0,50) + "...";
}

//------------------------------------------------------------------------------------------------------------------------------------------
// reading CSV - in general
//------------------------------------------------------------------------------------------------------------------------------------------

function processCSVContents(contents, callbackForItem) {
    var rows = d3.csv.parseRows(contents);
    var items = [];
    var header = null;
    
    for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        var row = rows[rowIndex];
        var rowIsEmpty = true;
        for (var i = 0; i < row.length; i++) {
            if (row[i] != "") {
                rowIsEmpty = false;
            }
        }
        var rowIsCommentedOut = row[0].trim().charAt(0) === ";";
        if (rowIsEmpty || rowIsCommentedOut) {
            ;
        } else {
            if (!header) { // no header yet - read header
                header = [];
                var headerEnded = false;
                for (var headerIndex = 0; headerIndex < row.length; headerIndex++) {
                    var headerCellValue = row[headerIndex];
                    if (headerCellValue) {
                        if (headerEnded) { // already read empty cell (so header appears to be ended) but it really isn't
                            console.log("ERROR: header has empty field before end");
                            alert("ERROR: The column at index " + headerIndex + " in the data file has no header. There should be no empty column headers. ");
                        }
                        header.push(headerCellValue);
                    } else { // empty header cell - assume header is over
                        headerEnded = true;
                    }
                }
            } else { // header already exists - read row, create item
                var newItem = callbackForItem(header, row);
                if (newItem) items.push(newItem);
            }
        }
    }
    return {header: header, items: items};
}

function chooseCSVFileToImport(callback, saveStories: boolean, writeLog: boolean) {
    var cvsFileUploader = <HTMLInputElement>document.getElementById("csvFileLoader");
    cvsFileUploader.onchange = function() {
        var file = cvsFileUploader.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e: Event) {
            var contents = (<FileReader>e.target).result;
            if (writeLog) {
                console.log("=================================== START OF LOG reading CSV story file: " + <FileReader>e.target);
            }
            callback(contents, saveStories, writeLog);
        };
        reader.readAsText(file);
    };
    cvsFileUploader.click();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// reading stories
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function processCSVContentsForStories(contents, saveStories, writeLog) {

    // set up log
    var logItems = [];
    var logQuestionAnswerCounts = {};

    function log(text) {
        if (writeLog) {
            if (logItems.indexOf(text) < 0) {
                logItems.push(text);
            }
        }
    }

    function count(questionName, answerName) {
        if (!logQuestionAnswerCounts[questionName]) {
            logQuestionAnswerCounts[questionName] = {};
        }
        if (!logQuestionAnswerCounts[questionName][answerName]) {
            logQuestionAnswerCounts[questionName][answerName] = 0;
        }
        logQuestionAnswerCounts[questionName][answerName]++;
    }

    // check for story collection
    var storyCollectionName = Globals.clientState().storyCollectionName();
    if (!storyCollectionName) alert("No story collection has been selected");
    
    // check for story form
    var questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionName, true);
    if (!questionnaire) return;

    // start log
    log("LOG||Data check for story collection: " + storyCollectionName);
    log("LOG||Data column headers and cell values are only logged the FIRST time their unique value is encountered. Subsequent identical messages are suppressed. Text answers are not reported.");
    
    // set up progress bar
    var messageText = "";
    if (saveStories) {
        messageText = "Progress importing stories";
    } else {
        messageText = "Progress checking stories";
    }
    var progressModel = dialogSupport.openProgressDialog("Processing CSV file...", messageText, "Cancel", dialogCancelled);

    // set up check for story length (to exclude too-short stories)
    var canCheckStoryLength = true;
    var minWordsToIncludeStory = 0;
    if (questionnaire.import_minWordsToIncludeStory) {
        minWordsToIncludeStory = parseInt(questionnaire.import_minWordsToIncludeStory);
        if (isNaN(minWordsToIncludeStory)) {
            log("ERROR||Import option for minimum words to include a story (" + questionnaire.import_minWordsToIncludeStory + ") is not a number.");
            canCheckStoryLength = false;
        }
    }
  
    var rowNumber = 0;
    var numRowsSkipped = 0;

    // callback function to process file contents
    var headerAndItems = processCSVContents(contents, function (header, row) {

        rowNumber++;
        log("LOG||<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< PROCESSING ROW " + rowNumber + " >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        var newItem = {};
        var saveStory = true;

        // get list of columns to append to story text (do not count as questions)
        var columnsToAppendToStoryText = [];
        if (questionnaire.import_columnsToAppendToStoryText) {
            columnsToAppendToStoryText = questionnaire.import_columnsToAppendToStoryText.split("\n");
        }

        // get list of columns to ignore completely
        var columnsToIgnore = [];
        if (questionnaire.import_columnsToIgnore) {
            columnsToIgnore = questionnaire.import_columnsToIgnore.split("\n");
        }

        // read row by column
        for (var fieldIndex = 0; fieldIndex < header.length; fieldIndex++) {

            if (!saveStory) {
                break; // if already decided not to save the story (based on story text length), skip every column after story text
            }

            // get cell value - but if row is shorter than header, don't assign any value
            var value = undefined;
            if (row[fieldIndex] != undefined) {
                value = row[fieldIndex].trim(); // note the value is trimmed
            }

            // if there is nothing in the cell, record nothing
            if (value === undefined || value === "") {
                continue; 
            }

            var headerName = header[fieldIndex];

            // check to see if the header name is in the list of names to be changed because they conflict with other things (like yes/no answer formatting)
            // yes this is done for EVERY row instead of once for the header, which is slow
            // but since the function that reads the header is also used for reading story forms, i don't know HOW to do it only once
            if (questionnaire.import_stringsToRemoveFromHeaders) {
                if (value != undefined && value !== "") {
                    var stringsToRemove = questionnaire.import_stringsToRemoveFromHeaders.split("\n");
                    if (stringsToRemove.length) {
                        for (var stringIndex = 0; stringIndex < stringsToRemove.length; stringIndex++) {
                            var stringToRemove = stringsToRemove[stringIndex];
                            if (headerName.indexOf(stringToRemove) >= 0) {
                                headerName = replaceAll(headerName, stringsToRemove[stringIndex], "");
                            }
                        }
                    }
                }
            }

            // column is story title
            if (headerName === questionnaire.import_storyTitleColumnName) {
                if (value.toLowerCase() === "testing123") {
                    log('WARN||Row with story name "testing123" skipped.');
                    saveStory = false;
                    numRowsSkipped++;
                } else {
                    newItem["Story title"] = value;
                    log("INFO||Story title: " + value);
                }

            // column is story text - check length if desired, and if too short, do not save story
            } else if (headerName === questionnaire.import_storyTextColumnName) {
                var saveStoryText = false;
                if (value === undefined || value === "") {
                    log("WARN||Row skipped because story text is empty.");
                    saveStory = false;
                    numRowsSkipped++;
                } else if (value.toLowerCase() === "testing123") {
                    log('WARN||Row ' + rowNumber + ' with story text "testing123" skipped.');
                    saveStory = false;
                    numRowsSkipped++;
                } else { 
                    if (canCheckStoryLength && minWordsToIncludeStory > 0) {
                        var storyAsWords = value.split(" ");
                        if (storyAsWords.length < minWordsToIncludeStory) {
                            log("WARN||Row skipped because story text length (" + storyAsWords.length + ") is below minimum of " + minWordsToIncludeStory + "; text is: " + shortenTextIfNecessary(value));
                            saveStory = false;
                            numRowsSkipped++;
                        } else {
                            saveStoryText = true;
                        }
                    } else { // cannot or should not check story length because (a) there is no minimum, (b) the minimum is zero, or (c) the minimum could not be read
                        saveStoryText = true;
                    }
                }
                if (saveStory && saveStoryText) {
                    newItem["Story text"] = value;
                    log("LOG||Story text (no word length check): " + shortenTextIfNecessary(value) + "...");
                }

            // column is one of additional text columns to be appended to story text (must be to the right of story text in data file)
            } else if (columnsToAppendToStoryText.indexOf(headerName) >= 0) {
                newItem["Story text"] = newItem["Story text"] + " ---- " + value;
                log("LOG||Text for column " + headerName + " (" + shortenTextIfNecessary(value) + ") added to story text.");

            // column is eliciting question chosen
            } else if (headerName === questionnaire.import_elicitingQuestionColumnName) {
                var questionShortName = getElicitingQuestionDisplayNameForColumnName(value, questionnaire);
                if (questionShortName) {
                    newItem["Eliciting question"] = questionShortName;
                    log("INFO||Eliciting question: " + questionShortName);
                } else {
                    var importNames = [];
                    questionnaire.elicitingQuestions.forEach(function(question) {
                        importNames.push(question.importName);
                    });
                    log("ERROR||NO MATCHING ANSWER FOUND for eliciting question name [" + value + "] out of list [" + importNames.join(" | ") + "]");
                }

            // column is participant ID
            } else if (headerName === questionnaire.import_participantIDColumnName) {
                newItem["Participant ID"] = value;
                log("LOG||Participant id: " + value);
            } else {

                // column is answer to question - get question name, and possibly answer name, from column header
                var fieldName = "";
                var answerName = "";
                var separator = questionnaire.import_multiChoiceYesQASeparator;
                if (separator != undefined && headerName.indexOf(separator) >= 0) {
                    if (separator.toLowerCase() === "space") {
                        separator = " ";
                    }
                    fieldName = stringUpTo(headerName, separator);
                    answerName = stringBeyond(headerName, separator).trim();
                    answerName = stringUpTo(answerName, questionnaire.import_multiChoiceYesQAEnding);
                } else {
                    fieldName = headerName;
                    answerName = null;
                }

                // get question referred to by header name from story form
                var question = questionForHeaderFieldName(fieldName, fieldIndex, questionnaire, project);

                if (question) { 

                    var questionName = question.displayName;
                    var importValueType = question.import_valueType;
                    log("INFO||Data column name: " + fieldName + " matched with question: " + questionName);

                    // simple data types, text is answer
                    if (["Single choice", "Radiobuttons", "Boolean", "Checkbox", "Text", "Textarea"].indexOf(importValueType) >= 0) {
                        var answerNameToUse = getDisplayAnswerNameForDataAnswerName(value, question);
                        if (answerNameToUse) {
                            if (["Text", "Textarea"].indexOf(importValueType) >= 0) { // don't log anything when reading text entries
                                newItem[questionName] = answerNameToUse;
                            } else {
                                // if you want to set a value but the value has already been set (because of lumping),
                                // it's okay to set it again, but you don't want to COUNT it twice, because the import counts will be too high
                                // so for all data types, the count is only incremented the FIRST time the value is set for the story
                                // the count must be incremented BEFORE the value is assigned, so you can tell if it has already been assigned
                                if (!newItem[questionName]) count(questionName, answerNameToUse);
                                newItem[questionName] = answerNameToUse;
                                log("INFO||Answer for " + questionName + " (" + importValueType + "): " + answerNameToUse);
                            }
                        } else { // no match, log error
                            if (["Text", "Textarea"].indexOf(importValueType) < 0) { 
                                var listToShow = question.import_answerNames;
                                if (!listToShow) listToShow = question.valueOptions;
                                log("ERROR||Answer for " + questionName + " (" + importValueType + "): NO MATCHING ANSWER FOUND for answer name [" + value + 
                                    "] out of list [" + listToShow.join(" | ") + "]");
                            }
                        }

                    // Single choice indexed, text is number of choice in list
                    } else if (importValueType === "Single choice indexed") {
                        var valueAsInt = parseInt(value);
                        var valueAssigned = false;
                        if (!isNaN(valueAsInt)) {
                            for (var index = 0; index < question.valueOptions.length; index++) {
                                if (valueAsInt-1 === index) {
                                    if (!newItem[questionName]) count(questionName, question.valueOptions[index]);
                                    newItem[questionName] = question.valueOptions[index];
                                    valueAssigned = true;
                                    log("INFO||Answer for " + questionName + " (" + importValueType + "): " + question.valueOptions[index] + "(" + valueAsInt + ")");
                                    break;
                                }
                            }
                        }
                        if (!valueAssigned) {
                            log("ERROR||Answer for " + questionName + " (" + importValueType + "): NO MATCHING ANSWER FOUND for answer index: " + valueAsInt);
                        }

                    // Scale, text is scale value
                    } else if (importValueType === "Scale") {
                        var valueAsInt = parseInt(value);
                        var adjustedValue = changeValueForCustomScaleValues(valueAsInt, question, questionnaire);
                        newItem[questionName] = adjustedValue;
                        var infoString = "INFO||Answer for " + questionName + " (" + importValueType + "): " + adjustedValue;
                        if (adjustedValue != valueAsInt) {
                            infoString += " (adjusted from " + valueAsInt + ")";
                        }
                        log(infoString);
                        count(questionName, adjustedValue);

                    // Multi-choice multi-column texts, text is one answer to add to list
                    // in case of lumping, dictionary entry will be set to true again
                    } else if (importValueType === "Multi-choice multi-column texts") {
                        var answerNameToUse = getDisplayAnswerNameForDataAnswerName(value, question);
                        if (answerNameToUse) {
                            if (!newItem[questionName]) newItem[questionName] = {};
                            if (!newItem[questionName][answerNameToUse]) count(questionName, answerNameToUse);
                            newItem[questionName][answerNameToUse] = true;
                            log("INFO||Answer for " + questionName + " (" + importValueType + "): " + answerNameToUse);
                            
                        } else { // no match, log error
                            var listToShow = question.import_answerNames;
                            if (!listToShow) listToShow = question.valueOptions;
                            log("ERROR||Answer for " + questionName + " (" + importValueType + "): NO MATCHING ANSWER FOUND for answer name [" + value + 
                                "] out of list [" + listToShow.join(" | ") + "]");
                        }

                    // Multi-choice multi-column yes/no, text is yes indicator (or something else), answer was in header
                    // in case of lumping, dictionary entry will be set to true again
                    } else if (importValueType === "Multi-choice multi-column yes/no") {
                        if (value === questionnaire.import_multiChoiceYesIndicator) {
                            if (!newItem[questionName]) newItem[questionName] = {};
                            var answerNameToUse = getDisplayAnswerNameForDataAnswerName(answerName, question);
                            if (answerNameToUse) {
                                if (!newItem[questionName][answerNameToUse]) count(questionName, answerNameToUse);
                                newItem[questionName][answerNameToUse] = true;
                                log("INFO||Answer for " + questionName + " (" + importValueType + "): " + answerNameToUse);
                            } else { // no match, log error
                                var listToShow = question.import_answerNames;
                                if (!listToShow) listToShow = question.valueOptions;
                                log("ERROR||Answer for " + questionName + " (" + importValueType + "): NO MATCHING ANSWER FOUND for answer name [" + answerName + 
                                    "] out of list [" + listToShow.join(" | ") + "]");
                            }
                        }

                    // Multi-choice single-column delimited, text is whole list of answers
                    // in case of lumping, dictionary entry will be set to true again
                    } else if (importValueType === "Multi-choice single-column delimited") {
                        newItem[questionName] = {};
                        var delimiter = questionnaire.import_multiChoiceDelimiter;
                        if (delimiter && delimiter.toLowerCase() === "space") delimiter = " ";
                        var delimitedItems = value.split(delimiter);
                        delimitedItems.forEach((delimitedItem) => {
                            var trimmedDelimitedItem = delimitedItem.trim();
                            if (trimmedDelimitedItem !== "") {
                                var answerNameToUse = getDisplayAnswerNameForDataAnswerName(trimmedDelimitedItem, question);
                                if (answerNameToUse) {
                                    if (!newItem[questionName][answerNameToUse]) count(questionName, answerNameToUse);
                                    newItem[questionName][answerNameToUse] = true;
                                    log("INFO||Answer for " + questionName + " (" + importValueType + "): " + answerNameToUse);
                                } else { // no match, log error
                                    var listToShow = question.import_answerNames;
                                    if (!listToShow) listToShow = question.valueOptions;
                                    log("ERROR||Answer for " + questionName + " (" + importValueType + "): NO MATCHING ANSWER FOUND for answer name [" + trimmedDelimitedItem + 
                                        "] out of list " + listToShow.join(" | ") + "]");
                                }
                            }
                        });

                    // Multi-choice single-column delimited indexed, text is whole list of multi-choice answers, except they are numerical indexes to answers
                    // in case of lumping, dictionary entry will be set to true again
                    } else if (importValueType === "Multi-choice single-column delimited indexed") {
                        newItem[questionName] = {};
                        var delimiter = questionnaire.import_multiChoiceDelimiter;
                        if (delimiter.toLowerCase() === "space") delimiter = " ";
                        var delimitedIndexTexts = value.split(delimiter);
                        delimitedIndexTexts.forEach((delimitedIndexText) => {
                            var delimitedIndex = parseInt(delimitedIndexText);
                            var valueAssigned = false;
                            if (!isNaN(delimitedIndex)) {
                                for (var index = 0; index < question.valueOptions.length; index++) {
                                    if (delimitedIndex-1 === index) {
                                        var answerNameToUse = question.valueOptions[index];
                                        if (!newItem[questionName][answerNameToUse]) count(questionName, answerNameToUse);
                                        newItem[questionName][answerNameToUse] = true;
                                        valueAssigned = true;
                                        log("INFO||Answer for " + questionName + " (" + importValueType + "): " + answerNameToUse);
                                        break;
                                    }
                                }
                            }
                        if (!valueAssigned) {
                            log("ERROR||Answer for " + questionName + " (" + importValueType + "): NO MATCHING ANSWER FOUND for answer index: " + delimitedIndex);
                        }
                        });
                    }
                    
                } else { // no question found
                    if (columnsToIgnore.indexOf(headerName) >= 0) {
                        log("INFO||Ignoring data column: " + fieldName);
                    } else {
                        log("ERROR||NO MATCHING QUESTION FOUND for data column name: " + fieldName);
                    }
                }
            }
        }
        if (saveStory) {
            return newItem;
        } else {
            return null;
        }
    });

    // warn user if problems with header
    // note that this is done after processing all the rows. I don't know how to change it given how processCSVContents works.
    // if I put it in the callback function the alert would be raised on every row
    // and I can't put it in the processCSVContents function because it's multiple purpose and also used for story forms
    var header = headerAndItems.header;
    if (!header) {
        alert("ERROR: No header line found in CSV data file.")
        progressModel.hideDialogMethod();
        progressModel.redraw();
        return;
    }
    if (!header.includes(questionnaire.import_storyTitleColumnName)) {
        if (questionnaire.import_storyTitleColumnName) {
            alert("ERROR: Data file header (first row) is missing an entry for the story title. It should have a header like this: " + questionnaire.import_storyTitleColumnName);
        } else {
            alert("ERROR: No story title header name is defined in the selected story form.");
        }
        progressModel.hideDialogMethod();
        progressModel.redraw();
        return;
    } else if (!header.includes(questionnaire.import_storyTextColumnName)) {
        if (questionnaire.import_storyTextColumnName) {
            alert("ERROR: Data file header (first row) is missing an entry for the story text. It should have a header like this: " + questionnaire.import_storyTextColumnName);
        } else {
            alert("ERROR: No story text header name is defined in the selected story form.");
        }
        progressModel.hideDialogMethod();
        progressModel.redraw();
        return;
    }

    //////////////////////////////////////// IF SAVING STORIES AND NOT WRITING LOG

    // convert arrays created while reading rows into proper stories (survey results)
    var items = headerAndItems.items;
    var surveyResults = [];
    var untitledCount = 0;
    var importedByUserIdentifier = project.userIdentifier.userIdentifier; // TODO: this is a kludgy way to get a string and seems brittle

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
            importedBy: importedByUserIdentifier // TODO: this is a kludgy way to get a string and seems brittle
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
            }

            newSurveyResult.stories.push(story);
            totalStoryCount += 1;
            for (i = 0; i < questionnaire.participantQuestions.length; i++) {
                question = questionnaire.participantQuestions[i];
                var value = storyItem[question.id.substring("S_".length)];
                newSurveyResult.participantData[question.id] = value;
            }
        }
        surveyResults.push(newSurveyResult);
    }
       
    if (!surveyResults.length) {
        alert("ERROR: No stories to write.");
        progressModel.hideDialogMethod();
        progressModel.redraw();
        return;
    }
    
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
    if (saveStories) {
        sendNextSurveyResult();
    }

    //////////////////////////////////////// IF WRITING LOG AND NOT SAVING STORIES

    // write accumulated log items to console
    if (logItems.length > 0) {
        console.clear();
        logItems.forEach(function(item) {
            var typeAndText = item.split("||");
            var type = typeAndText[0];
            var text = typeAndText[1];
            if (type === "INFO") {
                console.info(text);
            } else if (type === "WARN") {
                console.warn(text);
            } else if (type === "LOG") {
                console.log(text);
            } else if (type === "ERROR") {
                console.error(text);
            }
        });
    }

    // write answer counts to bottom of console log
    var questionNames = Object.keys(logQuestionAnswerCounts);
    if (questionNames.length > 0) {
        console.info("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ANSWER COUNTS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        for (var questionIndex = 0; questionIndex < questionNames.length; questionIndex++) {
            var questionName = questionNames[questionIndex];
            var answerOutputText = "";
            var answerInfo = logQuestionAnswerCounts[questionName];
            var answerNames = Object.keys(answerInfo);
            for (var answerIndex = 0; answerIndex < answerNames.length; answerIndex++) {
                var answerName = answerNames[answerIndex];
                answerOutputText += answerName + ": " + answerInfo[answerName];
                if (answerIndex < answerNames.length-1) {
                    answerOutputText += "; "
                }
            }
            console.info(questionName + ": " + answerOutputText);
        }
    }

    // tell user log is complete, remove progress bar
    if (!saveStories) {
        alert("Finished checking " + totalStoryCount + " stories. " + numRowsSkipped + " rows skipped. Check browser console for LOG, INFO, WARNING, and ERROR entries.");
        progressModel.hideDialogMethod();
        progressModel.redraw();
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------
// support functions for reading stories
//------------------------------------------------------------------------------------------------------------------------------------------

function questionForHeaderFieldName(fieldName, fieldIndex, questionnaire, project) {
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
            if (question.import_answerNames && i < question.import_answerNames.length) {
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

function getElicitingQuestionDisplayNameForColumnName(value, questionnaire) {
    for (var i = 0; i < questionnaire.elicitingQuestions.length; i++) {
        var question = questionnaire.elicitingQuestions[i];
        if (value === question.importName) {
            return question.id;
        }
    }
    return null;
}

function changeValueForCustomScaleValues(value, question, questionnaire) {
    if (question.displayType !== "slider") return null;
    var min = undefined;
    if (question.import_minScaleValue != undefined) {
        min = parseInt(question.import_minScaleValue);
    } else if (questionnaire.import_minScaleValue != undefined) {
        min = parseInt(questionnaire.import_minScaleValue);
    }
    var max = undefined;
    if (question.import_maxScaleValue != undefined) {
        max = parseInt(question.import_maxScaleValue);
    } else if (questionnaire.import_maxScaleValue != undefined) {
        max = parseInt(questionnaire.import_maxScaleValue);
    }
    if (min === undefined || min === NaN || max === undefined || max === NaN || min === max) {
        return value;
    }

    if (value <= min) {
        return 0;
    } else if (value >= max) {
        return 100;
    } else {
        var multiplier = 100 / (max - min);
        if (multiplier && multiplier > 0) {
             var adjustedValue = Math.round((value - min) * multiplier);
             if (adjustedValue > 100) adjustedValue = 100;
             if (adjustedValue < 0) adjustedValue = 0;
             return adjustedValue;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// reading story form
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
        return false;
    }
    if (!(header.includes("Short name") && header.includes("Long name") && header.includes("Type") && header.includes("About") && header.includes("Answers"))) {
        alert("ERROR: Header is missing at least one required cell. It must have entries for Short name, Long name, Type, About, and Answers. (It should also have a Data column name header, but for legacy files Short name will be taken to mean the same thing.) The header row must be the first readable row in the CSV file.")
        return false;
    }
    
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
        import_columnsToIgnore: [],
        import_columnsToAppendToStoryText: [],
        import_minWordsToIncludeStory: "0",
        import_stringsToRemoveFromHeaders: "",

        import_elicitingQuestionColumnName: "Eliciting question",
        import_elicitingQuestionGraphName: "Eliciting question",
        questionForm_chooseQuestionText: "What question would you like to answer?",
};
    
    project.tripleStore.makeNewSetItem(storyFormListIdentifier, "StoryForm", template);
    
    // For all items:
    //   Check if one with that name already exists
    //   if it does exist, ask if they want to overwrite it
    //   If does not exist, create it in the related set
    //   Add a reference to the question in the story form
        
    var questionTypeCounts = {};

    // in pre-1.2 files, headers for eliciting question, story title, story text, and participant ID were hard coded
    project.tripleStore.addTriple(template.id, "questionForm_import_elicitingQuestionColumnName", "Eliciting question");
    project.tripleStore.addTriple(template.id, "questionForm_import_storyTitleColumnName", "Story title");
    project.tripleStore.addTriple(template.id, "questionForm_import_storyTextColumnName", "Story text");
    project.tripleStore.addTriple(template.id, "import_participantIDColumnName", "Participant ID");

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
            template.import_elicitingQuestionColumnName = item["Data column name"] || "Eliciting question";
            project.tripleStore.addTriple(template.id, "questionForm_import_elicitingQuestionColumnName", item["Data column name"] || "Eliciting question");
            template.import_elicitingQuestionGraphName = item["Short name"] || "Eliciting question";
            project.tripleStore.addTriple(template.id, "questionForm_import_elicitingQuestionGraphName", item["Short name"] || "Eliciting question");
            template.questionForm_chooseQuestionText = item["Long name"] || "Eliciting question"; 
            project.tripleStore.addTriple(template.id, "questionForm_chooseQuestionText", item["Long name"] || "Eliciting question");
            var answers = item["Answers"];
            answers.forEach(function (elicitingQuestionDefinition) {
                if (!elicitingQuestionDefinition) elicitingQuestionDefinition = "ERROR: Missing eliciting question text";
                var sections = elicitingQuestionDefinition.split("|");
                var dataColumnName = "";
                var shortName = "";
                var longName = "";
                // If only one section, use it as import name, short name, AND text
                // if two sections, use first as both import name and short name, use second as text
                if (sections.length < 2) {
                    dataColumnName = sections[0];
                    shortName = sections[0];
                    longName = sections[0];
                // if two sections, copy import name to short name, leaving text alone
                } else if (sections.length < 3) {
                    dataColumnName = sections[0];
                    shortName = sections[0];
                    longName = sections[1];
                // if all three sections, correct order is import, short, long
                } else {
                    dataColumnName = sections[0];
                    shortName = sections[1];
                    longName = sections[2];
                }
                var elicitingQuestion = {
                    elicitingQuestion_dataColumnName: dataColumnName.trim(),
                    elicitingQuestion_shortName: shortName.trim(),
                    elicitingQuestion_text: longName.trim(),
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
                } else if (type === "Data columns to ignore") {
                    var answersAsLines = item["Answers"].join("\n");
                    template.import_columnsToIgnore = answersAsLines;
                    project.tripleStore.addTriple(template.id, "questionForm_import_columnsToIgnore", answersAsLines);
                } else if (type === "Data columns to append to story text") {
                    var answersAsLines = item["Answers"].join("\n");
                    template.import_columnsToAppendToStoryText = answersAsLines;
                    project.tripleStore.addTriple(template.id, "questionForm_import_columnsToAppendToStoryText", answersAsLines);
                } else if (type === "Minimum words to include story") {
                    var minWords = parseInt(text);
                    if (isNaN(minWords)) {
                        alert("The value you entered for the minimum words to include for a story (" + text + ") is not a number. It must be a number.");
                        template.import_minWordsToIncludeStory = "0";
                        project.tripleStore.addTriple(template.id, "questionForm_import_minWordsToIncludeStory", "0");
                    } else {
                        template.import_minWordsToIncludeStory = text;
                        project.tripleStore.addTriple(template.id, "questionForm_import_minWordsToIncludeStory", text);
                    }
                } else if (type === "Texts to remove from column headers") {
                    var answersAsLines = item["Answers"].join("\n");
                    template.import_stringsToRemoveFromHeaders = answersAsLines;
                    project.tripleStore.addTriple(template.id, "questionForm_import_stringsToRemoveFromHeaders", answersAsLines);
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

//------------------------------------------------------------------------------------------------------------------------------------------
// support functions for reading story form
//------------------------------------------------------------------------------------------------------------------------------------------

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
        var storyOrParticipant = "story";
        if (questionCategory === "participantQuestion") {
            storyOrParticipant = "participant";
        }
        if (confirm('A ' + storyOrParticipant + ' question with the name "' + matchingQuestion[questionCategory + "_shortName"] + '" already exists.\n\nDo you want to overwrite it?')) {
            project.deleteQuestionInCategory(matchingQuestion, questionCategory);
            project.addQuestionForCategory(question, questionCategory);
        }
    } 
    return question[idAccessor];
}

function questionForItem(item, questionCategory) {
    var valueType = "string";
    var questionType = "text";
    var valueOptions;
    var import_columnName;
    var import_answerNames;
    var import_minScaleValue = "";
    var import_maxScaleValue = "";
    
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
            var minAndMax = answers.slice(2);
            minAndMax.forEach(function (textValue) {
                var value = parseInt(textValue);
                if (isNaN(value)) {
                    var word = "minimum";
                    if (answerCount === 1) word = "maximum";
                    alert('The text you entered for the ' + word + ' scale value ("' + textValue + '") for the question "' + item["Short name"] + '" could not be converted to a number.');
                }
                if (answerCount === 0) {
                    import_minScaleValue = textValue;
                } else {
                    import_maxScaleValue = textValue;
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
    if (valueOptions) question[questionCategory + "_options"] = valueOptions.join("\n");

    question[questionCategory + "_import_columnName"] = item["Data column name"] || item["Short name"];
    question[questionCategory + "_import_valueType"] = itemType;
    question[questionCategory + "_import_minScaleValue"] = import_minScaleValue;
    question[questionCategory + "_import_maxScaleValue"] = import_maxScaleValue;
    if (import_answerNames) question[questionCategory + "_import_answerNames"] = import_answerNames.join("\n");
    return question;
}

function valueAndImportOptionsForAnswers(answers) {
    var valueOptions = [];
    var import_answerNames = [];
    for (var i = 0; i < answers.length; i++) {
        var dataAndDisplay = answers[i].split("|");
        if (dataAndDisplay.length > 1) {
            import_answerNames.push(dataAndDisplay[0]);
            valueOptions.push(dataAndDisplay[1]);
        } else {
            valueOptions.push(answers[i]);
            import_answerNames.push(answers[i]);
        }
    }
    return [valueOptions, import_answerNames];
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// generating story form
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// exporting story form
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function exportQuestionnaire() {
    var storyCollectionName = Globals.clientState().storyCollectionName();
    if (!storyCollectionName) {
        alert("Please select a story collection first");
        return;
    }
    
    var questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionName);
    if (!questionnaire) {
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
    questionnaire.elicitingQuestions.forEach(function (elicitingQuestionSpecification) {
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
    
    outputQuestions(questionnaire.storyQuestions, "story");
    outputQuestions(questionnaire.participantQuestions, "participant");
    
    var annotationQuestions = project.collectAllAnnotationQuestions();
    var adjustedAnnotationQuestions = questionnaireGeneration.convertEditorQuestions(annotationQuestions, "A_");
    outputQuestions(adjustedAnnotationQuestions, "annotation");

    addOutputLine(["", "Title", "form", "", "", questionnaire.title || ""]);
    addOutputLine(["", "Start text", "form", "", "", questionnaire.startText || ""]);
    addOutputLine(["", "Image", "form", "", "", questionnaire.image || ""]);
    addOutputLine(["", "End text", "form", "", "", questionnaire.endText || ""]);
    addOutputLine(["", "About you text", "form", "", "", questionnaire.aboutYouText || ""]);
    addOutputLine(["", "Thank you text", "form", "", "", questionnaire.thankYouPopupText || ""]);
    addOutputLine(["", "Custom CSS", "form", "", "", questionnaire.customCSS || ""]);
    addOutputLine(["", "Custom CSS for Printing", "form", "", "", questionnaire.customCSSForPrint || ""]);

    addOutputLine(["", "Choose question text", "form", "", "", questionnaire.chooseQuestionText || ""]);
    addOutputLine(["", "Enter story text", "form", "", "", questionnaire.enterStoryText || ""]);
    addOutputLine(["", "Name story text", "form", "", "", questionnaire.nameStoryText || ""]);
    addOutputLine(["", "Tell another story text", "form", "", "", questionnaire.tellAnotherStoryText || ""]);
    addOutputLine(["", "Tell another story button", "form", "", "", questionnaire.tellAnotherStoryButtonText || ""]);
    addOutputLine(["", "Max num stories", "form", "", "", questionnaire.maxNumStories || ""]);
    addOutputLine(["", "Slider value prompt", "form", "", "", questionnaire.sliderValuePrompt || ""]);

    addOutputLine(["", "Submit survey button", "form", "", "", questionnaire.submitSurveyButtonText || ""]);
    addOutputLine(["", "Sending survey text", "form", "", "", questionnaire.questionForm_sendingSurveyResultsText || ""]);
    addOutputLine(["", "Could not save survey text", "form", "", "", questionnaire.questionForm_couldNotSaveSurveyText || ""]);
    addOutputLine(["", "Resubmit survey button", "form", "", "", questionnaire.resubmitSurveyButtonText || ""]);
    
    addOutputLine(["", "Delete story button", "form", "", "", questionnaire.deleteStoryButtonText || ""]);
    addOutputLine(["", "Delete story prompt", "form", "", "", questionnaire.deleteStoryDialogPrompt || ""]);
    addOutputLine(["", "Survey stored message", "form", "", "", questionnaire.surveyStoredText || ""]);
    addOutputLine(["", "Show survey result", "form", "", "", questionnaire.showSurveyResultPane || ""]);
    addOutputLine(["", "Survey result header", "form", "", "", questionnaire.surveyResultPaneHeader || ""]);
    
    addOutputLine(["", "Error message no elicitation question chosen", "form", "", "", questionnaire.errorMessage_noElicitationQuestionChosen || ""]);
    addOutputLine(["", "Error message no story text", "form", "", "", questionnaire.errorMessage_noStoryText || ""]);

    // do not need to write "Scale range" because scale data was converted to 0-100 scale during import
    // do not need to write "Yes no questions Q-A separator" or "Yes no questions Q-A ending" or "Yes no questions yes indicator" or "Multi choice single column delimiter"
    // because only the original multi-choice format is used (Multi-choice multi-column texts) for which there are no import options
    // do not need to write "Story title column name" or "Story text column name" or "Eliciting question column name" or "Participant ID column name"
    // because the default (non specified) options will work for all of these things

    var questionnaireBlob = new Blob([output], {type: "text/csv;charset=utf-8"});
    // TODO: This seems to clear the console in FireFox 40; why?
    saveAs(questionnaireBlob, "export_story_form_" + storyCollectionName + ".csv");
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

function addCSVOutputLine(output, line) {
    var start = true;
    line.forEach(function (item) {
        if (start) {
            start = false;
        } else {
            output += ",";
        }
        if (typeof item == 'number') {
            item = "" + item;
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

export function exportQuestionnaireForImport() { // to preserve import options for externally derived data
    var storyCollectionName = Globals.clientState().storyCollectionName();
    if (!storyCollectionName) {
        alert("Please select a story collection first");
        return;
    }
    
    var questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionName);
    if (!questionnaire) {
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

    if (questionnaire.import_elicitingQuestionColumnName) {
        var elicitingLine = [
            questionnaire.import_elicitingQuestionColumnName, "eliciting", "eliciting", 
            questionnaire.import_elicitingQuestionGraphName, 
            questionnaire.chooseQuestionText];
            questionnaire.elicitingQuestions.forEach(function (elicitingQuestionSpecification) {
            elicitingLine.push(elicitingQuestionSpecification.importName + "|" + elicitingQuestionSpecification.id + "|" + elicitingQuestionSpecification.text);
        });
        addOutputLine(elicitingLine);
    }

    function outputQuestions(questions, about) {
        for (var i = 0; i < questions.length; i++) {
            var outputLine = [];
            var question = questions[i];

            outputLine.push(question.import_columnName || ""); 
            outputLine.push(question.import_valueType || "");
            outputLine.push(about || "");
            outputLine.push(question.displayName || ""); 
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
                    if (question.import_minScaleValue != undefined) {
                        outputLine.push("" + question.import_minScaleValue);
                    }
                    if (question.import_maxScaleValue != undefined) {
                        outputLine.push("" + question.import_maxScaleValue);
                    }
               }
            } else { 
                if (question.valueOptions) {
                    for (var j = 0; j < question.valueOptions.length; j++) {
                       var cellValue = "";
                       if (question.import_answerNames && j < question.import_answerNames.length) {
                           cellValue += question.import_answerNames[j] + "|";
                       }
                       cellValue += question.valueOptions[j];
                       outputLine.push(cellValue);   
                    }   
                }
            }
            addOutputLine(outputLine);
        }
    }
    
    outputQuestions(questionnaire.storyQuestions, "story");
    outputQuestions(questionnaire.participantQuestions, "participant");
    
    if (questionnaire.title) addOutputLine(["", "Title", "form", "", "", questionnaire.title || ""]);
    if (questionnaire.startText) addOutputLine(["", "Start text", "form", "", "", questionnaire.startText || ""]);
    if (questionnaire.image) addOutputLine(["", "Image", "form", "", "", questionnaire.image || ""]);
    if (questionnaire.endText) addOutputLine(["", "End text", "form", "", "", questionnaire.endText || ""]);
    if (questionnaire.aboutYouText) addOutputLine(["", "About you text", "form", "", "", questionnaire.aboutYouText || ""]);
    if (questionnaire.thankYouPopupText) addOutputLine(["", "Thank you text", "form", "", "", questionnaire.thankYouPopupText || ""]);
    if (questionnaire.customCSS) addOutputLine(["", "Custom CSS", "form", "", "", questionnaire.customCSS || ""]);
    if (questionnaire.customCSSForPrint) addOutputLine(["", "Custom CSS for Printing", "form", "", "", questionnaire.customCSSForPrint || ""]);

    if (questionnaire.chooseQuestionText) addOutputLine(["", "Choose question text", "form", "", "", questionnaire.chooseQuestionText || ""]);
    if (questionnaire.enterStoryText) addOutputLine(["", "Enter story text", "form", "", "", questionnaire.enterStoryText || ""]);
    if (questionnaire.nameStoryText) addOutputLine(["", "Name story text", "form", "", "", questionnaire.nameStoryText || ""]);
    if (questionnaire.tellAnotherStoryText) addOutputLine(["", "Tell another story text", "form", "", "", questionnaire.tellAnotherStoryText || ""]);
    if (questionnaire.tellAnotherStoryButtonText) addOutputLine(["", "Tell another story button", "form", "", "", questionnaire.tellAnotherStoryButtonText || ""]);
    if (questionnaire.maxNumStories) addOutputLine(["", "Max num stories", "form", "", "", questionnaire.maxNumStories || ""]);
    if (questionnaire.sliderValuePrompt) addOutputLine(["", "Slider value prompt", "form", "", "", questionnaire.sliderValuePrompt || ""]);

    if (questionnaire.submitSurveyButtonText) addOutputLine(["", "Submit survey button", "form", "", "", questionnaire.submitSurveyButtonText || ""]);
    if (questionnaire.questionForm_sendingSurveyResultsText) addOutputLine(["", "Sending survey text", "form", "", "", questionnaire.questionForm_sendingSurveyResultsText || ""]);
    if (questionnaire.questionForm_couldNotSaveSurveyText) addOutputLine(["", "Could not save survey text", "form", "", "", questionnaire.questionForm_couldNotSaveSurveyText || ""]);
    if (questionnaire.resubmitSurveyButtonText) addOutputLine(["", "Resubmit survey button", "form", "", "", questionnaire.resubmitSurveyButtonText || ""]);
    
    if (questionnaire.deleteStoryButtonText) addOutputLine(["", "Delete story button", "form", "", "", questionnaire.deleteStoryButtonText || ""]);
    if (questionnaire.deleteStoryDialogPrompt) addOutputLine(["", "Delete story prompt", "form", "", "", questionnaire.deleteStoryDialogPrompt || ""]);
    if (questionnaire.surveyStoredText) addOutputLine(["", "Survey stored message", "form", "", "", questionnaire.surveyStoredText || ""]);
    if (questionnaire.showSurveyResultPane) addOutputLine(["", "Show survey result", "form", "", "", questionnaire.showSurveyResultPane || ""]);
    if (questionnaire.surveyResultPaneHeader) addOutputLine(["", "Survey result header", "form", "", "", questionnaire.surveyResultPaneHeader || ""]);
    
    if (questionnaire.errorMessage_noElicitationQuestionChosen) addOutputLine(["", "Error message no elicitation question chosen", "form", "", "", questionnaire.errorMessage_noElicitationQuestionChosen || ""]);
    if (questionnaire.errorMessage_noStoryText) addOutputLine(["", "Error message no story text", "form", "", "", questionnaire.errorMessage_noStoryText || ""]);

    if (questionnaire.import_minScaleValue || questionnaire.import_maxScaleValue) addOutputLine(["", "Scale range", "import", "", "", "" + questionnaire.import_minScaleValue || "", "" + questionnaire.import_maxScaleValue || ""]);
    if (questionnaire.import_multiChoiceYesQASeparator) addOutputLine(["", "Yes no questions Q-A separator", "import", "", "", questionnaire.import_multiChoiceYesQASeparator || ""]);
    if (questionnaire.import_multiChoiceYesQAEnding) addOutputLine(["", "Yes no questions Q-A ending", "import", "", "", questionnaire.import_multiChoiceYesQAEnding || ""]);
    if (questionnaire.import_multiChoiceYesIndicator) addOutputLine(["", "Yes no questions yes indicator", "import", "", "", questionnaire.import_multiChoiceYesIndicator || ""]);
    if (questionnaire.import_multiChoiceDelimiter) addOutputLine(["", "Multi choice single column delimiter", "import", "", "", questionnaire.import_multiChoiceDelimiter || ""]);
    if (questionnaire.import_storyTitleColumnName) addOutputLine(["", "Story title column name", "import", "", "", questionnaire.import_storyTitleColumnName || ""]);
    if (questionnaire.import_storyTextColumnName) addOutputLine(["", "Story text column name", "import", "", "", questionnaire.import_storyTextColumnName || ""]);
    if (questionnaire.import_participantIDColumnName) addOutputLine(["", "Participant ID column name", "import", "", "", questionnaire.import_participantIDColumnName || ""]);
    if (questionnaire.import_minWordsToIncludeStory) addOutputLine(["", "Minimum words to include story", "import", "", "", questionnaire.import_minWordsToIncludeStory || ""]);

    if (questionnaire.import_stringsToRemoveFromHeaders) {
        var textsToRemoveOutputLine = ["", "Texts to remove from column headers", "import", "", ""];
        var textsList = questionnaire.import_stringsToRemoveFromHeaders.split("\n");
        if (textsList) {
            textsList.forEach(function(item) {
                textsToRemoveOutputLine.push(item);
            });
        }
        addOutputLine(textsToRemoveOutputLine);
    }
    
    if (questionnaire.import_columnsToIgnore) {
        var columnsToIgnoreOutputLine = ["", "Data columns to ignore", "import", "", ""];
        var columnList = questionnaire.import_columnsToIgnore.split("\n");
        if (columnList) {
            columnList.forEach(function(item) {
                columnsToIgnoreOutputLine.push(item);
            });
        }
        addOutputLine(columnsToIgnoreOutputLine);
    }
    
    
    if (questionnaire.import_columnsToAppendToStoryText) {
        var columnsToAppendOutputLine = ["", "Data columns to append to story text", "import", "", ""];
        var columnList = questionnaire.import_columnsToAppendToStoryText.split("\n");
        if (columnList) {
            columnList.forEach(function(item) {
                columnsToAppendOutputLine.push(item);
            });
        }
        addOutputLine(columnsToAppendOutputLine);
    }

    var questionnaireBlob = new Blob([output], {type: "text/csv;charset=utf-8"});
    // TODO: This seems to clear the console in FireFox 40; why?
    saveAs(questionnaireBlob, "export_story_form_for_import_" + storyCollectionName + ".csv");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// exporting stories
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function exportStoryCollection() {
    var storyCollectionName = Globals.clientState().storyCollectionName();
    if (!storyCollectionName) {
        alert("Please select a story collection first");
        return;
    }
    
    var questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionName);
    if (!questionnaire) {
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
    
    headersForQuestions(questionnaire.storyQuestions);
    headersForQuestions(questionnaire.participantQuestions);
    
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
        dataForQuestions(questionnaire.storyQuestions, story, outputLine);
        dataForQuestions(questionnaire.participantQuestions, story, outputLine);
        dataForQuestions(adjustedAnnotationQuestions, story, outputLine);
        addOutputLine(outputLine);
    }); 
    
    var storyCollectionBlob = new Blob([output], {type: "text/csv;charset=utf-8"});
    // TODO: This seems to clear the console in FireFox 40; why?
    saveAs(storyCollectionBlob, "export_story_collection_" + storyCollectionName + ".csv");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// exported functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function importCSVStories() {
    if (!Globals.clientState().storyCollectionName()) {
        // TODO: Translate
        return alert("You need to select a story collection before you can import stories.");
    }
    // save stories, do not write verbose log
    chooseCSVFileToImport(processCSVContentsForStories, true, false);
}

export function checkCSVStories() {
    if (!Globals.clientState().storyCollectionName()) {
        // TODO: Translate
        return alert("You need to select a story collection before you can check a story CSV file.");
    }
    // do not save stories, do write verbose log
    chooseCSVFileToImport(processCSVContentsForStories, false, true);
}

export function importCSVQuestionnaire() {
    chooseCSVFileToImport(processCSVContentsForQuestionnaire, true, false);
}
