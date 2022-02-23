import Project = require("./Project");
import d3 = require("d3");
import generateRandomUuid = require("./pointrel20150417/generateRandomUuid");
import questionnaireGeneration = require("./questionnaireGeneration");
import surveyBuilderMithril = require("./surveyBuilderMithril");
import surveyCollection = require("./surveyCollection");
import surveyStorage = require("./surveyStorage");
import dialogSupport = require("./panelBuilder/dialogSupport");
import ClusteringDiagram = require("./applicationWidgets/ClusteringDiagram");
import PatternExplorer = require("./applicationWidgets/PatternExplorer");
import Globals = require("./Globals");
import m = require("mithril");
import toaster = require("./panelBuilder/toaster");
import saveAs = require("FileSaver");
import sanitizeHTML = require("./sanitizeHTML");

"use strict";

const writeInTag = "WriteInEntry_";

let project: Project;

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
    let result = num + "";
    while (result.length < size) result = "0" + result;
    return result;
}

function shortenTextIfNecessary(text: string) {
    if (!text || text.length < 50) return text;
    return text.slice(0,50) + "...";
}

const observationNoteIdentifier = "[note]";

//------------------------------------------------------------------------------------------------------------------------------------------
// reading CSV - in general
//------------------------------------------------------------------------------------------------------------------------------------------

interface CSVItem {
    story: surveyCollection.Story;
    annotations: {};
    Type: string;
    Answers: string[];
    About: string;
}

function processCSVContents(contents, callbackForItem) {

    const delimiter = Globals.clientState().csvDelimiter();
    const csv = d3.dsv(delimiter, "text/plain");
    const rows = csv.parseRows(contents);
    const items: CSVItem[] = [];
    let header = null;
    
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex];
        let rowIsEmpty = true;
        for (let i = 0; i < row.length; i++) {
            if (row[i] != "") {
                rowIsEmpty = false;
            }
        }
        const rowIsCommentedOut = row[0].trim().charAt(0) === ";";
        if (rowIsEmpty || rowIsCommentedOut) {
            ;
        } else {
            if (!header) { // no header yet - read header
                header = [];
                let headerEnded = false;
                for (let headerIndex = 0; headerIndex < row.length; headerIndex++) {
                    const headerCellValue = row[headerIndex];
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
                const newItem = callbackForItem(header, row);
                if (newItem) items.push(newItem);
            }
        }
    }
    return {header: header, items: items};
}

function chooseCSVFileToImport(callback, saveStories: boolean, writeLog: boolean, questionnaire = null) {
    const cvsFileUploader = <HTMLInputElement>document.getElementById("csvFileLoader");
    cvsFileUploader.onchange = function() {
        const file = cvsFileUploader.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e: Event) {
            const contents = (<FileReader>e.target).result;
            callback(contents, saveStories, writeLog, questionnaire);
        };
        reader.readAsText(file);
    };
    cvsFileUploader.click();
}

//------------------------------------------------------------------------------------------------------------------------------------------
// reading stories
//------------------------------------------------------------------------------------------------------------------------------------------

function processCSVContentsForStories(contents, saveStories, writeLog, questionnaire = null) {

    // set up log
    const logItems = [];
    const logQuestionAnswerCounts = {};

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

    let storyCollectionName;
    if (!questionnaire) {
        // check for story collection
        storyCollectionName = Globals.clientState().storyCollectionName();
        if (!storyCollectionName) alert("No story collection has been selected");
        // check for story form
        questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionName, true);
    }
    if (!questionnaire) return;

    // start log
    if (storyCollectionName) log("INFO||Data check for story collection: " + storyCollectionName);
    log("INFO||Data column headers and cell values are only logged the FIRST time their unique value is encountered. Subsequent identical messages are suppressed. Text answers are not reported.");
    
    // set up progress bar
    let messageText = "";
    if (saveStories) {
        messageText = "Progress importing stories";
    } else {
        messageText = "Progress checking stories";
    }
    const progressModel = dialogSupport.openProgressDialog("Processing CSV file...", messageText, "Cancel", dialogCancelled);

    // set up check for story length (to exclude too-short stories)
    let canCheckStoryLength = true;
    let minWordsToIncludeStory = 0;
    if (questionnaire.import_minWordsToIncludeStory) {
        minWordsToIncludeStory = parseInt(questionnaire.import_minWordsToIncludeStory);
        if (isNaN(minWordsToIncludeStory)) {
            log("ERROR||Import option for minimum words to include a story (" + questionnaire.import_minWordsToIncludeStory + ") is not a number.");
            canCheckStoryLength = false;
        }
    }
  
    let rowNumber = 0;
    let numRowsSkipped = 0;

    // callback function to process file contents
    const headerAndItems = processCSVContents(contents, function (header, row) {

        rowNumber++;
        log("DEBUG||----- PROCESSING ROW " + rowNumber);
        const newItem = {};
        let saveStory = true;

        // get list of columns to append to story text (do not count as questions)
        let columnsToAppendToStoryText = [];
        if (questionnaire.import_columnsToAppendToStoryText) {
            columnsToAppendToStoryText = questionnaire.import_columnsToAppendToStoryText.split("\n");
        }

        // get list of things to write before appended texts
        let textsToWriteBeforeAppendedColumns = [];
        if (questionnaire.import_textsToWriteBeforeAppendedColumns) {
            if (typeof questionnaire.import_textsToWriteBeforeAppendedColumns === "string") {
                textsToWriteBeforeAppendedColumns = questionnaire.import_textsToWriteBeforeAppendedColumns.split("\n");
            } else {
                textsToWriteBeforeAppendedColumns = questionnaire.import_textsToWriteBeforeAppendedColumns;
            }
        }

        // get list of columns to ignore completely
        let columnsToIgnore = [];
        if (questionnaire.import_columnsToIgnore) {
            columnsToIgnore = questionnaire.import_columnsToIgnore.split("\n");
        }

        // read row by column
        for (let fieldIndex = 0; fieldIndex < header.length; fieldIndex++) {

            if (!saveStory) {
                break; // if already decided not to save the story (based on story text length), skip every column after story text
            }

            // get cell value - but if row is shorter than header, don't assign any value
            let value = undefined;
            if (row[fieldIndex] != undefined) {
                value = row[fieldIndex].trim(); // note the value is trimmed
            }

            // if there is nothing in the cell, record nothing
            if (value === undefined || value === "") {
                continue; 
            }

            let headerName = header[fieldIndex];

            // check to see if the header name is in the list of names to be changed because they conflict with other things (like yes/no answer formatting)
            // yes this is done for EVERY row instead of once for the header, which is slow
            // but since the function that reads the header is also used for reading story forms, i don't know HOW to do it only once
            if (questionnaire.import_stringsToRemoveFromHeaders) {
                if (value != undefined && value !== "") {
                    const stringsToRemove = questionnaire.import_stringsToRemoveFromHeaders.split("\n");
                    if (stringsToRemove.length) {
                        for (let stringIndex = 0; stringIndex < stringsToRemove.length; stringIndex++) {
                            const stringToRemove = stringsToRemove[stringIndex];
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
                    //log("DEBUG||Story title: " + value);
                }

            // column is story text - check length if desired, and if too short, do not save story
            } else if (headerName === questionnaire.import_storyTextColumnName) {
                let saveStoryText = false;
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
                        const storyAsWords = value.split(" ");
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
                    //log("DEBUG||Story text (no word length check): " + shortenTextIfNecessary(value) + "...");
                }

            // column is story collection date - expected format: ISO 8601 (YYYY-MM-DD)
            } else if (headerName === questionnaire.import_storyCollectionDateColumnName) {
                let saveDate = true;
                if (value.length < 10) {
                    log("WARN||Story collection date (" + value + ") is too short; it should consist of at least ten characters (YYYY-MM-DD).");
                    saveDate = false;
                }
                const year = value.substr(0, 4);
                if (isNaN(Number(year))) {
                    log("WARN||Story collection year (" + year + ") is not a number.");
                    saveDate = false;
                }
                const month = value.substr(5, 2);
                if (isNaN(Number(month))) {
                    log("WARN||Story collection month (" + month + ") is not a number.");
                    saveDate = false;
                }
                const day = value.substr(8, 2);
                if (isNaN(Number(day))) {
                    log("WARN||Story collection day of month (" + day + ") is not a number.");
                    saveDate = false;
                }
                if (saveDate) {
                    newItem["Collection date"] = value.substr(0, 10);
                } 

            // column is story language (or language of form story was collected using, whichever the user wants it to be)
            } else if (headerName === questionnaire.import_storyFormLanguageColumnName) {
                newItem["Language"] = value;

            // column is one of additional text columns to be appended to story text (must be to the right of story text in data file)
            } else if (columnsToAppendToStoryText.indexOf(headerName) >= 0) {
                const indexOfColumnInList = columnsToAppendToStoryText.indexOf(headerName);
                let textBefore = " --- ";
                if (textsToWriteBeforeAppendedColumns.length > indexOfColumnInList && textsToWriteBeforeAppendedColumns[indexOfColumnInList]) {
                    textBefore = textsToWriteBeforeAppendedColumns[indexOfColumnInList];
                }
                newItem["Story text"] = newItem["Story text"] + " " + textBefore + " " + value;
                //log('DEBUG||Text for column [' + headerName + '] (' + shortenTextIfNecessary(value) + ') added to story text, with "' + textBefore + '" before it.');

            // column is eliciting question chosen
            } else if (headerName === questionnaire.import_elicitingQuestionColumnName) {
                const questionShortName = getElicitingQuestionDisplayNameForColumnName(value, questionnaire);
                if (questionShortName) {
                    newItem["Eliciting question"] = questionShortName;
                    log("LOG||Eliciting question: " + questionShortName);
                } else {
                    const importNames = [];
                    questionnaire.elicitingQuestions.forEach(function(question) {
                        importNames.push(question.importName);
                    });
                    log("ERROR||NO MATCHING ANSWER FOUND for eliciting question name [" + value + "] out of list [" + importNames.join(" | ") + "]");
                }

            // column is participant ID
            } else if (headerName === questionnaire.import_participantIDColumnName) {
                newItem["Participant ID"] = value;
                //log("DEBUG||Participant id: " + value);

            // column is write-in answer 
            } else if (headerName.indexOf("WRITEIN_") == 0) {
                const fieldName = stringBeyond(headerName, "WRITEIN_").trim();
                const question = questionForHeaderFieldName(fieldName, fieldIndex, questionnaire, project);
                if (question && question.writeInTextBoxLabel) { 
                    newItem[writeInTag + question.displayName] = value;
                }

            } else {

                // column is answer to question - get question name, and possibly answer name, from column header
                let fieldName = "";
                let answerName = "";
                let separator = questionnaire.import_multiChoiceYesQASeparator;
                if (separator != undefined && headerName.indexOf(separator) >= 0) {
                    if (separator.toLowerCase() === "space") {
                        separator = " ";
                    }
                    fieldName = stringUpTo(headerName, separator).trim();
                    answerName = stringBeyond(headerName, separator).trim();
                    answerName = stringUpTo(answerName, questionnaire.import_multiChoiceYesQAEnding);
                } else {
                    fieldName = headerName;
                    answerName = null;
                }

                // get question referred to by header name from story form
                const question = questionForHeaderFieldName(fieldName, fieldIndex, questionnaire, project);

                if (question) { 

                    const questionName = question.displayName;
                    const importValueType = question.import_valueType;
                    log("LOG||Data column name: " + fieldName + " matched with question: " + questionName);

                    // simple data types, text is answer
                    if (["Single choice", "Radiobuttons", "Boolean", "Checkbox", "Text", "Textarea"].indexOf(importValueType) >= 0) {
                        const answerNameToUse = getDisplayAnswerNameForDataAnswerName(value, question);
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
                                log("LOG||Answer for " + questionName + " (" + importValueType + "): " + answerNameToUse);
                            }
                        } else { // no match, log error
                            if (["Text", "Textarea"].indexOf(importValueType) < 0) { 
                                let listToShow = question.import_answerNames;
                                if (!listToShow) listToShow = question.valueOptions;
                                log("ERROR||Answer for " + questionName + " (" + importValueType + "): NO MATCHING ANSWER FOUND for answer name [" + value + 
                                    "] out of list [" + listToShow.join(" | ") + "]");
                            }
                        }

                    // Single choice indexed, text is number of choice in list
                    } else if (importValueType === "Single choice indexed") {
                        const valueAsInt = parseInt(value);
                        let valueAssigned = false;
                        if (!isNaN(valueAsInt)) {
                            for (let index = 0; index < question.valueOptions.length; index++) {
                                if (valueAsInt-1 === index) {
                                    if (!newItem[questionName]) count(questionName, question.valueOptions[index]);
                                    newItem[questionName] = question.valueOptions[index];
                                    valueAssigned = true;
                                    log("LOG||Answer for " + questionName + " (" + importValueType + "): " + question.valueOptions[index] + "(" + valueAsInt + ")");
                                    break;
                                }
                            }
                        }
                        if (!valueAssigned) {
                            log("ERROR||Answer for " + questionName + " (" + importValueType + "): NO MATCHING ANSWER FOUND for answer index: " + valueAsInt);
                        }

                    // Scale, text is scale value
                    } else if (importValueType === "Scale") {
                        // parseFloat does not take a locale parameter and cannot process a comma as the decimal delimiter
                        // so we should test for the presence of a comma, assuming that if it's present in a scale value
                        // it is meant to be a decimal delimiter 
                        let valueAsFloat = parseFloat(value.replace(",", "."));
                        if (valueAsFloat % 1 !== 0) {
                            // we only want to give this error once per question, or the console will fill up with hundreds of these messages
                            // parseInt stops when it encounters anything but a digit, so the number will be truncated
                            log("ERROR||Answer for " + questionName + " (" + importValueType + "): Should be an integer but is not. It has been truncated.");
                        }
                        const valueAsInt = parseInt(value);
                        const adjustedValue = changeValueForCustomScaleValues(valueAsInt, question, questionnaire);
                        newItem[questionName] = adjustedValue;
                        let infoString = "LOG||Answer for " + questionName + " (" + importValueType + "): " + adjustedValue;
                        if (adjustedValue != valueAsInt) {
                            infoString += " (adjusted from " + valueAsInt + ")";
                        }
                        log(infoString);
                        count(questionName, adjustedValue);

                    // Multi-choice multi-column texts, text is one answer to add to list
                    // in case of lumping, dictionary entry will be set to true again
                    } else if (importValueType === "Multi-choice multi-column texts") {
                        const answerNameToUse = getDisplayAnswerNameForDataAnswerName(value, question);
                        if (answerNameToUse) {
                            if (!newItem[questionName]) newItem[questionName] = {};
                            if (!newItem[questionName][answerNameToUse]) count(questionName, answerNameToUse);
                            newItem[questionName][answerNameToUse] = true;
                            log("LOG||Answer for " + questionName + " (" + importValueType + "): " + answerNameToUse);
                            
                        } else { // no match, log error
                            let listToShow = question.import_answerNames;
                            if (!listToShow) listToShow = question.valueOptions;
                            log("ERROR||Answer for " + questionName + " (" + importValueType + "): NO MATCHING ANSWER FOUND for answer name [" + value + 
                                "] out of list [" + listToShow.join(" | ") + "]");
                        }

                    // Multi-choice multi-column yes/no, text is yes indicator (or something else), answer was in header
                    // in case of lumping, dictionary entry will be set to true again
                    } else if (importValueType === "Multi-choice multi-column yes/no") {
                        if (value === questionnaire.import_multiChoiceYesIndicator) {
                            if (!newItem[questionName]) newItem[questionName] = {};
                            const answerNameToUse = getDisplayAnswerNameForDataAnswerName(answerName, question);
                            if (answerNameToUse) {
                                if (!newItem[questionName][answerNameToUse]) count(questionName, answerNameToUse);
                                newItem[questionName][answerNameToUse] = true;
                                log("LOG||Answer for " + questionName + " (" + importValueType + "): " + answerNameToUse);
                            } else { // no match, log error
                                let listToShow = question.import_answerNames;
                                if (!listToShow) listToShow = question.valueOptions;
                                log("ERROR||Answer for " + questionName + " (" + importValueType + "): NO MATCHING ANSWER FOUND for answer name [" + answerName + 
                                    "] out of list [" + listToShow.join(" | ") + "]");
                            }
                        }

                    // Multi-choice single-column delimited, text is whole list of answers
                    // in case of lumping, dictionary entry will be set to true again
                    } else if (importValueType === "Multi-choice single-column delimited") {
                        newItem[questionName] = {};
                        let delimiter = questionnaire.import_multiChoiceDelimiter;
                        if (delimiter && delimiter.toLowerCase() === "space") delimiter = " ";
                        const delimitedItems = value.split(delimiter);
                        delimitedItems.forEach((delimitedItem) => {
                            const trimmedDelimitedItem = delimitedItem.trim();
                            if (trimmedDelimitedItem !== "") {
                                const answerNameToUse = getDisplayAnswerNameForDataAnswerName(trimmedDelimitedItem, question);
                                if (answerNameToUse) {
                                    if (!newItem[questionName][answerNameToUse]) count(questionName, answerNameToUse);
                                    newItem[questionName][answerNameToUse] = true;
                                    log("LOG||Answer for " + questionName + " (" + importValueType + "): " + answerNameToUse);
                                } else { // no match, log error
                                    let listToShow = question.import_answerNames;
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
                        let delimiter = questionnaire.import_multiChoiceDelimiter;
                        if (delimiter.toLowerCase() === "space") delimiter = " ";
                        const delimitedIndexTexts = value.split(delimiter);
                        delimitedIndexTexts.forEach((delimitedIndexText) => {
                            const delimitedIndex = parseInt(delimitedIndexText);
                            let valueAssigned = false;
                            if (!isNaN(delimitedIndex)) {
                                for (let index = 0; index < question.valueOptions.length; index++) {
                                    if (delimitedIndex-1 === index) {
                                        const answerNameToUse = question.valueOptions[index];
                                        if (!newItem[questionName][answerNameToUse]) count(questionName, answerNameToUse);
                                        newItem[questionName][answerNameToUse] = true;
                                        valueAssigned = true;
                                        log("LOG||Answer for " + questionName + " (" + importValueType + "): " + answerNameToUse);
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
                        log("LOG||Ignoring data column: " + fieldName);
                    } else {
                        log("LOG||NO MATCHING QUESTION FOUND for data column name: " + fieldName);
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
    const header = headerAndItems.header;
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
    const items = headerAndItems.items;
    const surveyResults = [];
    let untitledCount = 0;
    const importedByUserIdentifier = project.userIdentifier.userIdentifier; // TODO: this is a kludgy way to get a string and seems brittle

    // group items by participant ID field, if entered
    const itemsByParticipantID = {};
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        const item = items[itemIndex];
        const participantID = item["Participant ID"] || generateRandomUuid("Participant");
        if (!itemsByParticipantID[participantID]) {
            itemsByParticipantID[participantID] = [];
        }
        itemsByParticipantID[participantID].push(item);
    }

    let totalStoryCount = 0;
    for (let participantIDIndex in itemsByParticipantID) {
        // TODO: Copied code from surveyBuilder module! Need a common function with surveyBuilder to make this!!!
        const newSurveyResult = {
            __type: "org.workingwithstories.QuestionnaireResponse",
            // TODO: Think about whether to include entire questionnaire or something else perhaps
            questionnaire: questionnaire,
            responseID: generateRandomUuid("QuestionnaireResponse"),
            stories: [],
            language: undefined,
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

        for (let storyIndex in itemsByParticipantID[participantIDIndex]) {
            const storyItem = itemsByParticipantID[participantIDIndex][storyIndex];
        
            const elicitingQuestion = storyItem["Eliciting question"] || questionnaire.elicitingQuestions[0].id;
            const story = {
                __type: "org.workingwithstories.Story",
                // TODO: Can this "id" field be safely removed? id: generateRandomUuid("TODO:???"),
                storyID: generateRandomUuid("Story"),
                participantID: participantIDIndex,
                elicitingQuestion: elicitingQuestion,
                storyText: storyItem["Story text"],
                storyName: storyItem["Story title"] || ("Untitled #" + padLeadingZeros(++untitledCount, 4)),
                collectionDate: storyItem["Collection date"],
                numStoriesTold: "" + itemsByParticipantID[participantIDIndex].length
            };
        
            for (let i = 0; i < questionnaire.storyQuestions.length; i++) {
                const question = questionnaire.storyQuestions[i];
                const value = storyItem[question.id.substring("S_".length)];
                story[question.id] = value;
                if (question.writeInTextBoxLabel) {
                    const writeInValue = storyItem[writeInTag + question.id.substring("S_".length)];
                    story[writeInTag + question.id] = writeInValue;
                }
            }

            newSurveyResult.stories.push(story);
            newSurveyResult.language = storyItem["Language"];
            totalStoryCount += 1;
            for (let i = 0; i < questionnaire.participantQuestions.length; i++) {
                const question = questionnaire.participantQuestions[i];
                const value = storyItem[question.id.substring("P_".length)];
                newSurveyResult.participantData[question.id] = value;
                if (question.writeInTextBoxLabel) {
                    const writeInValue = storyItem[writeInTag + question.id.substring("P_".length)];
                    newSurveyResult.participantData[writeInTag + question.id] = writeInValue;
                }
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
    
    function dialogCancelled(dialogConfiguration, hideDialogMethod) {
        progressModel.cancelled = true;
        hideDialogMethod();
    }
    
    const wizardPane = {
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
    
    const totalSurveyCount = surveyResults.length;
    let surveyIndexToSend = 0;
    let numStoriesSentSoFar = 0;
    
    function sendNextSurveyResult() {
        if (progressModel.cancelled) {
            alert("Cancelled after sending " + numStoriesSentSoFar + " stories from " + surveyIndexToSend + " participants to server.");
        } else if (surveyIndexToSend >= surveyResults.length) {
            alert("Finished sending " + numStoriesSentSoFar + " stories from " + surveyIndexToSend + " participants to server.");
            progressModel.hideDialogMethod();
            progressModel.redraw();
        } else {
            const surveyResult = surveyResults[surveyIndexToSend++];
            // TODO: Translate
            numStoriesSentSoFar += surveyResult.stories.length;
            progressModel.progressText = "Sending " + numStoriesSentSoFar + "/" + totalStoryCount + " stories from " + surveyIndexToSend + "/" + totalSurveyCount + " participants to server";
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
    if (writeLog) {

        const consoleMessageCounts = {"INFO": 0, "WARN": 0, "LOG": 0, "DEBUG": 0, "ERROR": 0};
        if (logItems.length > 0) {
            console.clear();
            logItems.forEach(function(item) {
                const typeAndText = item.split("||");
                const type = typeAndText[0];
                const text = typeAndText[1];
                if (type === "INFO") {
                    console.info(text);
                    consoleMessageCounts["INFO"]++;
                } else if (type === "WARN") {
                    console.warn(text);
                    consoleMessageCounts["WARN"]++;
                } else if (type === "LOG") {
                    console.log(text);
                    consoleMessageCounts["LOG"]++;
                } else if (type === "DEBUG") {
                    console.debug(text);
                    consoleMessageCounts["DEBUG"]++;
                } else if (type === "ERROR") {
                    console.error(text);
                    consoleMessageCounts["ERROR"]++;
                }
            });
        }

        // write answer counts to bottom of console log
        const questionNames = Object.keys(logQuestionAnswerCounts);
        if (questionNames.length > 0) {
            console.info("---------- Answer counts");
            for (let questionIndex = 0; questionIndex < questionNames.length; questionIndex++) {
                const questionName = questionNames[questionIndex];
                let answerOutputText = "";
                const answerInfo = logQuestionAnswerCounts[questionName];
                const answerNames = Object.keys(answerInfo);
                for (let answerIndex = 0; answerIndex < answerNames.length; answerIndex++) {
                    const answerName = answerNames[answerIndex];
                    answerOutputText += answerName + ": " + answerInfo[answerName];
                    if (answerIndex < answerNames.length-1) {
                        answerOutputText += "; "
                    }
                }
                console.info(questionName + ": " + answerOutputText);
            }
        }

        // tell user log is complete, remove progress bar
        alert("Finished checking " + totalStoryCount + " stories. " 
            + numRowsSkipped + " rows skipped. Check browser console for these messages: "
            + consoleMessageCounts["DEBUG"] + " debug, "
            + consoleMessageCounts["LOG"] + " log, "
            + consoleMessageCounts["INFO"] + " info, "
            + consoleMessageCounts["WARN"] + " warning, "
            + consoleMessageCounts["ERROR"] + " error. ");
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
    let matchingQuestion = null;
    for (let i = 0; i < questionnaire.storyQuestions.length; i++) {
        if (questionnaire.storyQuestions[i].import_columnName === fieldName) {
            matchingQuestion = questionnaire.storyQuestions[i];
            break;
        }
    }
    if (!matchingQuestion) {
            for (let i = 0; i < questionnaire.participantQuestions.length; i++) {
            if (questionnaire.participantQuestions[i].import_columnName === fieldName) {
                matchingQuestion = questionnaire.participantQuestions[i];
                break;
            }
        }
    }
    if (!matchingQuestion) {
        const leadingStoryQuestions = questionnaireGeneration.getLeadingStoryQuestions(questionnaire.elicitingQuestions);
        for (let i = 0; i < leadingStoryQuestions.length; i++) {
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
        for (let i = 0; i < question.valueOptions.length; i++) {
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
    for (let i = 0; i < questionnaire.elicitingQuestions.length; i++) {
        const question = questionnaire.elicitingQuestions[i];
        if (value === question.importName) {
            return question.id;
        }
    }
    return null;
}

function changeValueForCustomScaleValues(value, question, questionnaire) {
    if (question.displayType !== "slider") return null;
    let min = undefined;
    // the "" + is because apparently there are situations in which the scale value is an integer
    if (question.import_minScaleValue !== undefined && question.import_minScaleValue != "") { // could be zero
        min = parseInt("" + question.import_minScaleValue);
    } else if (questionnaire.import_minScaleValue !== undefined && questionnaire.import_minScaleValue !== "") { 
        min = parseInt("" + questionnaire.import_minScaleValue);
    }
    let max = undefined;
    if (question.import_maxScaleValue !== undefined && question.import_maxScaleValue != "") {
        max = parseInt("" + question.import_maxScaleValue);
    } else if (questionnaire.import_maxScaleValue != undefined && questionnaire.import_maxScaleValue != "") {
        max = parseInt("" + questionnaire.import_maxScaleValue);
    }
    if (min === undefined || min === NaN || max === undefined || max === NaN || min === max) {
        return value;
    }

    if (value <= min) {
        return 0;
    } else if (value >= max) {
        return 100;
    } else {
        const multiplier = 100 / (max - min);
        if (multiplier && multiplier > 0) {
            let adjustedValue = Math.round((value - min) * multiplier);
            if (adjustedValue > 100) adjustedValue = 100;
            if (adjustedValue < 0) adjustedValue = 0;
            return adjustedValue;
        }
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------
// reading annotations
//------------------------------------------------------------------------------------------------------------------------------------------

function processCSVContentsForAnnotations(contents, saveAnnotations, writeLog, questionnaire = null) {

    // set up log
    const logItems = [];
    const logQuestionAnswerCounts = {};

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

    // check for a story collection, story form, and annotation questions
    const storyCollectionName = Globals.clientState().storyCollectionName();
    if (!storyCollectionName) {
        alert("Please select a story collection.");
        return;
    }
    if (!questionnaire) {
        questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionName, true); // second param is alertIfProblem
        if (!questionnaire) {
            alert("The currently selected story collection has no associated story form.");
            return;
        }
    }
    const stories = surveyCollection.getStoriesForStoryCollection(storyCollectionName, true); // second param is includeIgnored
    if (stories.length < 1) {
        alert("The currently selected story collection has no stories in it.");
        return;
    }
    const annotationQuestions = questionnaireGeneration.convertEditorQuestions(project.collectAllAnnotationQuestions(), "A_");
    if (annotationQuestions.length < 1) {
        alert("The current project has no annotation questions.");
        return;
    }

    // start log
    log("INFO||Annotation import check for story collection: " + storyCollectionName);
    log("INFO||Data column headers and cell values are only logged the FIRST time their unique value is encountered. Subsequent identical messages are suppressed.");

    // set up progress bar
    let messageText = "";
    if (saveAnnotations) {
        messageText = "Progress importing annotations";
    } else {
        messageText = "Progress checking annotations";
    }
    const progressModel = dialogSupport.openProgressDialog("Processing CSV file...", messageText, "Cancel", dialogCancelled);
    
    let rowNumber = 0;

    // callback function to process file contents
    const headerAndItems = processCSVContents(contents, function (header, row) {
        rowNumber++;
        log("DEBUG||----- Processing row " + rowNumber);
        
        let storyToAnnotate = null;
        const annotationsForThisStory = {};

        // story name MUST be first cell in row, and story text MUST be second cell in row
        // this is because the match between row and story can depend on name, text, or both - so they must be read together
        const annotationStoryName = row[0];
        const annotationStoryText = row[1];
        const matchingStories = stories.filter(function(story) {
            return story.storyName() === annotationStoryName && story.storyText() === annotationStoryText;
        });
        const storyTextForMessage = (annotationStoryText.length > 100) ? annotationStoryText.slice(0, 100) + " ..." : annotationStoryText;
        if (matchingStories.length == 0) {
            log('WARN||No story matched the name "' + annotationStoryName + '" and text "' + storyTextForMessage + '".');
        } else if (matchingStories.length == 1) {
            storyToAnnotate = matchingStories[0];
            log('INFO||Matched annotation to story "' + annotationStoryName + '" with text "' + storyTextForMessage + '".');
        } else {
            log('WARN||Multiple stories match the name "' + annotationStoryName + '" and text "' + storyTextForMessage + '".');
        }
        if (!storyToAnnotate) {
            return null;
        }

        for (let fieldIndex = 2; fieldIndex < header.length; fieldIndex++) {
            let value = row[fieldIndex];
            if (value === undefined) continue; 
            value = value.trim();
            if (value === "") continue; 

            let headerName = header[fieldIndex];
            let question = null;
            for (let i = 0; i < annotationQuestions.length; i++) {
                if (annotationQuestions[i].displayName === headerName) {
                    question = annotationQuestions[i];
                    break;
                } 
            }
            if (!question) {
                log("LOG||NO MATCHING QUESTION FOUND for data column name: " + headerName);
                continue; 
            }

            const questionName = question.displayName;
            const questionType = question.displayType;
            log("LOG||Data column name: " + headerName + " matched with question: " + questionName);

            if (["text", "textarea"].indexOf(questionType) >= 0) {
                annotationsForThisStory[questionName] = value;
            } else if (["boolean", "checkbox"].indexOf(questionType) >= 0) {
                const trimmedValue = value.trim().toLowerCase();
                if (trimmedValue === "yes" || trimmedValue === "true") {
                    annotationsForThisStory[questionName] = true;
                } else if (trimmedValue === "no" || trimmedValue === "false") {
                    annotationsForThisStory[questionName] = false;
                }
            } else if (["select", "radiobuttons"].indexOf(questionType) >= 0) {
                const answerNameToUse = getDisplayAnswerNameForDataAnswerName(value, question);
                if (answerNameToUse) {
                    if (!annotationsForThisStory[questionName]) count(questionName, answerNameToUse);
                    annotationsForThisStory[questionName] = answerNameToUse;
                    log("LOG||Answer for " + questionName + " (" + questionType + "): " + answerNameToUse);
                } else { 
                    let listToShow = question.import_answerNames;
                    if (!listToShow) listToShow = question.valueOptions;
                    log("ERROR||Answer for " + questionName + " (" + questionType + "): NO MATCHING ANSWER FOUND for answer name [" + value + 
                        "] out of list [" + listToShow.join(" | ") + "]");
                }
            } else if (questionType === "slider") {
                let valueAsFloat = parseFloat(value.replace(",", "."));
                if (valueAsFloat % 1 !== 0) 
                    log("ERROR||Answer for " + questionName + " (" + questionType + "): Should be an integer but is not. It has been truncated.");
                const valueAsInt = parseInt(value);
                const adjustedValue = changeValueForCustomScaleValues(valueAsInt, question, questionnaire);
                annotationsForThisStory[questionName] = adjustedValue;
                let infoString = "LOG||Answer for " + questionName + " (" + questionType + "): " + adjustedValue;
                if (adjustedValue != valueAsInt) 
                    infoString += " (adjusted from " + valueAsInt + ")";
                log(infoString);
                count(questionName, adjustedValue);
            } else if (questionType === "checkboxes") {
                const answerNameToUse = getDisplayAnswerNameForDataAnswerName(value, question);
                if (answerNameToUse) {
                    if (!annotationsForThisStory[questionName]) annotationsForThisStory[questionName] = {};
                    if (!annotationsForThisStory[questionName][answerNameToUse]) count(questionName, answerNameToUse);
                    annotationsForThisStory[questionName][answerNameToUse] = true;
                    log("LOG||Answer for " + questionName + " (" + questionType + "): " + answerNameToUse);
                    
                } else { // no match, log error
                    let listToShow = question.import_answerNames;
                    if (!listToShow) listToShow = question.valueOptions;
                    log("ERROR||Answer for " + questionName + " (" + questionType + "): NO MATCHING ANSWER FOUND for answer name [" + value + 
                        "] out of list [" + listToShow.join(" | ") + "]");
                }             
            }
        }
        if (saveAnnotations) {
            return {story: storyToAnnotate, annotations: annotationsForThisStory};
        } else {
            return null;
        }
    });

    const header = headerAndItems.header;
    if (!header) {
        alert("ERROR: No header line found in CSV data file.")
        return;
    }

    const changes = [];
    if (saveAnnotations) {
        const items = headerAndItems.items;
        items.forEach((item) => {
            const story = item.story;
            const annotations = item.annotations;
            const questionNames = Object.keys(annotations);
            questionNames.forEach((questionName) => {
                if (story.storyID() && questionName && (annotations[questionName] !== undefined)) {
                    changes.push({id: story.storyID(), field: "A_" + questionName, value: annotations[questionName]});
                } else {
                    log('INFO||For the story "' + story.storyName() + '", there is no answer for the question "' + questionName + '".'); 
                }
            });
        });
    } 

    if (saveAnnotations && !changes.length) {
        alert("ERROR: No annotations to import.");
        progressModel.hideDialogMethod();
        progressModel.redraw();
        return;
    }
    
    function dialogCancelled(dialogConfiguration, hideDialogMethod) {
        progressModel.cancelled = true;
        hideDialogMethod();
    }
    
    const wizardPane = {
        forward: function () {
            console.log("annotation import success");
            if (progressModel.failed) return;
            sendNextChange();
        },
        failed: function () {
            console.log("annotation import failed");
            if (progressModel.failed) return;
            progressModel.failed = true;
            alert("Problem saving annotation; check the console for details.");
            progressModel.hideDialogMethod();
            progressModel.redraw();
        }
    };
    
    const totalChangeCount = changes.length;
    let changeIndexToSend = 0;
    let numChangesSentSoFar = 0;
    
    function sendNextChange() {
        if (progressModel.cancelled) {
            alert("Cancelled after sending " + numChangesSentSoFar + " annotations to server.");
        } else if (changeIndexToSend >= changes.length) {
            alert("Finished sending " + numChangesSentSoFar + " annotations to server.");
            progressModel.hideDialogMethod();
            progressModel.redraw();
        } else {
            const change = changes[changeIndexToSend++];
            numChangesSentSoFar++;
            progressModel.progressText = "Sending " + numChangesSentSoFar + "/" + totalChangeCount + " annotations to server";
            progressModel.redraw();
            const message = project.tripleStore.makeAddTripleMessage(change.id, change.field, change.value);
            project.pointrelClient.sendMessage(message, function(error, result) {
                if (error) {
                    console.log("Problem saving annotation", error);
                    if (wizardPane && wizardPane.failed) {
                        wizardPane.failed();
                    } else {
                        alert("Problem saving annotation; check the console for details.");
                    }
                    return;
                }
                console.log("Annotation stored");
                if (wizardPane) {
                    wizardPane.forward();
                } else {
                    // TODO: Translate
                    alert("Annotations stored.");
                }
            });
        }
    }
    
    // Start sending survey results
    if (saveAnnotations) {
        sendNextChange();
    }
    
    if (writeLog) {
        const consoleMessageCounts = {"INFO": 0, "WARN": 0, "LOG": 0, "DEBUG": 0, "ERROR": 0};
        if (logItems.length > 0) {
            console.clear();
            logItems.forEach(function(item) {
                const typeAndText = item.split("||");
                const type = typeAndText[0];
                const text = typeAndText[1];
                if (type === "INFO") {
                    console.info(text);
                    consoleMessageCounts["INFO"]++;
                } else if (type === "WARN") {
                    console.warn(text);
                    consoleMessageCounts["WARN"]++;
                } else if (type === "LOG") {
                    console.log(text);
                    consoleMessageCounts["LOG"]++;
                } else if (type === "DEBUG") {
                    console.debug(text);
                    consoleMessageCounts["DEBUG"]++;
                } else if (type === "ERROR") {
                    console.error(text);
                    consoleMessageCounts["ERROR"]++;
                }
            });
        }
        // write answer counts to bottom of console log
        const questionNames = Object.keys(logQuestionAnswerCounts);
        if (questionNames.length > 0) {
            console.info("---------- Answer counts");
            for (let questionIndex = 0; questionIndex < questionNames.length; questionIndex++) {
                const questionName = questionNames[questionIndex];
                let answerOutputText = "";
                const answerInfo = logQuestionAnswerCounts[questionName];
                const answerNames = Object.keys(answerInfo);
                for (let answerIndex = 0; answerIndex < answerNames.length; answerIndex++) {
                    const answerName = answerNames[answerIndex];
                    answerOutputText += answerName + ": " + answerInfo[answerName];
                    if (answerIndex < answerNames.length-1) {
                        answerOutputText += "; "
                    }
                }
                console.info(questionName + ": " + answerOutputText);
            }
        }
        // tell user log is complete
        alert("Finished checking " + rowNumber + " rows. Check browser console for these messages: "
            + consoleMessageCounts["DEBUG"] + " debug, "
            + consoleMessageCounts["LOG"] + " log, "
            + consoleMessageCounts["INFO"] + " info, "
            + consoleMessageCounts["WARN"] + " warning, "
            + consoleMessageCounts["ERROR"] + " error. ");
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// exporting annotations
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function exportAnnotationsForCurrentStoryCollectionToCSV() {
    const storyCollectionName = Globals.clientState().storyCollectionName();
    if (!storyCollectionName) {
        alert("Please select a story collection first.");
        return;
    }
    
    const questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionName);
    if (!questionnaire) {
        alert("The story collection has not been initialized with a story form: " + storyCollectionName);
        return;
    }

    const allStories = surveyCollection.getStoriesForStoryCollection(storyCollectionName, true);
    const header1 = [];
    const header2 = [];
      
    function header(contents, secondHeader = "") {
        header1.push(contents);
        header2.push(secondHeader);
    }
    
    // Put initial header
    header("Story title", ";"); // use semicolon to make second line a comment
    header("Story text");
    
    function headersForQuestions(questions) {
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            if (["label", "header"].indexOf(question.displayType) >= 0) break;
            if (question.valueOptions && question.displayType === "checkboxes") {
                question.valueOptions.forEach(function(option) {
                    header(question.displayName, option);   
               });
            } else {
                header(question.displayName);
            }
        }
    }
    const annotationQuestions = project.collectAllAnnotationQuestions();
    const adjustedAnnotationQuestions = questionnaireGeneration.convertEditorQuestions(annotationQuestions, "A_");
    headersForQuestions(adjustedAnnotationQuestions);
  
    let output = "";
    const delimiter = Globals.clientState().csvDelimiter();
    function addOutputLine(line) { output = addCSVOutputLine(output, line, delimiter); }
    
    addOutputLine(header1);
    addOutputLine(header2);
    
    function dataForQuestions(questions, story: surveyCollection.Story, outputLine) {
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            if (["label", "header"].indexOf(question.displayType) >= 0) break;
            let value = story.fieldValue(question.id);
            if (value === undefined || value === null) value = "";
            if (question.valueOptions && question.displayType === "checkboxes") {
               question.valueOptions.forEach(function(option) {
                   outputLine.push(value[option] ? option : "");   
               });
            } else {
                outputLine.push(value);
            }
            if (question.writeInTextBoxLabel) {
                const writeInValue = story.fieldValueWriteIn(question.id);
                outputLine.push(writeInValue ? writeInValue : "");
            }
        }
    }
    
    allStories.forEach(function (story) {
        const outputLine = [];
        outputLine.push(story.storyName()); 
        outputLine.push(story.storyText());
        dataForQuestions(adjustedAnnotationQuestions, story, outputLine);
        addOutputLine(outputLine);
    }); 
    
    const storyCollectionBlob = new Blob([output], {type: "text/csv;charset=utf-8"});
    // TODO: This seems to clear the console in FireFox 40; why?
    saveAs(storyCollectionBlob, "export_annotations_" + storyCollectionName + ".csv");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// reading story form
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function processCSVContentsForQuestionnaire(contents) {

    const headerAndItems = processCSVContents(contents, function (header, row) {
        const newItem = {};
        let lastFieldIndex;
        for (let fieldIndex = 0; fieldIndex < row.length; fieldIndex++) {
            let fieldName = header[fieldIndex];
            if (fieldName) {
                lastFieldIndex = fieldIndex;
            } else {
                fieldName = header[lastFieldIndex];
            }
            // TODO: Should the value really be trimmed?
            const value = row[fieldIndex].trim();
            if (fieldIndex < header.length - 1) {
                newItem[fieldName] = value;
            } else {
                // Handle multiple values for last header items
                let list = newItem[fieldName];
                if (!list) {
                    list = [];
                    newItem[fieldName] = list;
                }
                if (value) list.push(value);
            }
        }
        return newItem;
    });

    const header = headerAndItems.header;
    if (!header) {
        alert("ERROR: No header line found in CSV file.")
        return false;
    }
    if (!(header.includes("Short name") && header.includes("Long name") && header.includes("Type") && header.includes("About") && header.includes("Answers"))) {
        alert("ERROR: Header is missing at least one required cell. It must have entries for Short name, Long name, Type, About, and Answers. (It should also have a Data column name header, but for legacy files Short name will be taken to mean the same thing.) The header row must be the first readable row in the CSV file.")
        return false;
    }
    
    const shortName = prompt("Please enter a short name for the new story form. (It must be unique within the project.)");
    if (!shortName) return;
    if (questionnaireGeneration.buildStoryForm(shortName)) {
        alert('A story form already exists with that name: "' + shortName + '"');
        return;
    }
    
    let storyFormListIdentifier = project.getFieldValue("project_storyForms");
    if (!storyFormListIdentifier) {
        storyFormListIdentifier = project.tripleStore.newIdForSet("StoryFormSet");
        project.setFieldValue("project_storyForms", storyFormListIdentifier);
    }

    const template: StoryFormTemplate = {};
    questionnaireGeneration.formFieldsInfo.forEach((fieldInfo) => {
        if (fieldInfo.default) {
            template[fieldInfo.tripleStoreFieldID] = fieldInfo.default;
        } else {
            template[fieldInfo.tripleStoreFieldID] = "";
        }
    });
    template.id = generateRandomUuid("StoryForm"); 
    template.questionForm_shortName = shortName;
    template.questionForm_elicitingQuestions = project.tripleStore.newIdForSet("ElicitingQuestionChoiceSet");
    template.questionForm_storyQuestions = project.tripleStore.newIdForSet("StoryQuestionChoiceSet");
    template.questionForm_participantQuestions = project.tripleStore.newIdForSet("ParticipantQuestionChoiceSet");
    questionnaireGeneration.setDefaultImportFieldsForTemplate(template);

    let overrideOption = project.tripleStore.queryLatestC(project.projectIdentifier, "project_csvQuestionOverwriteOption");
    if (overrideOption === "always replace existing questions with matching questions from the CSV file") {
        overrideOption = "always";
    } else if (overrideOption === "always keep existing questions; ignore any matching questions in the CSV file") {
        overrideOption = "never";
    } else if (overrideOption === "show me the list of existing questions and ask if I still want to import the file") {
        overrideOption = "ask all";
    } else if (overrideOption === "ask me whether to replace each existing question") {
        overrideOption = "ask each";
    } else if (overrideOption === "stop the import if any existing questions are found") {
        overrideOption = "stop";
    }

    const storyQuestionsThatAlreadyExist = [];
    const participantQuestionsThatAlreadyExist = [];
    const items = headerAndItems.items;

    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        const item = items[itemIndex];
        const about = item.About;
        let question;
        let existingQuestion = null;
        if (about === "story") {
            question = questionForItem(item, "storyQuestion");
            existingQuestion = existingQuestionThatMatchesNewQuestion(question, "storyQuestion");
            if (existingQuestion) storyQuestionsThatAlreadyExist.push(existingQuestion);
        } else if (about === "participant") {
            question = questionForItem(item, "participantQuestion");
            existingQuestion = existingQuestionThatMatchesNewQuestion(question, "participantQuestion");
            if (existingQuestion) participantQuestionsThatAlreadyExist.push(existingQuestion);
        }
    }

    if (storyQuestionsThatAlreadyExist.length || participantQuestionsThatAlreadyExist.length) {
        let message = 'These questions already exist';

        switch (overrideOption) {
            case "always":
                message += " and are being overwritten.\n\n";
                break;
            case "never":
                message += " and are being preserved. The questions with the same name in the CSV file are being ignored.\n\n";
                break;
            case "ask all": 
            case "ask each":
            case "stop":
                message += ":\n\n";
                break;
            default: 
                throw Error("ERROR: No override option chosen.");
        }

        storyQuestionsThatAlreadyExist.forEach(function(question) { message += "    " + question["storyQuestion_shortName"] + "\n"; });
        participantQuestionsThatAlreadyExist.forEach(function(question) { message += "    " + question["participantQuestion_shortName"] + "\n"; });

        switch (overrideOption) {
            case "always":
            case "never":
                alert(message);
                break;
            case "ask all":
                message += "\nDo you want to overwrite them?";
                if (confirm(message)) {
                    alert("Okay. The story form has been created, and the existing questions have been overwritten.");
                } else {
                    alert("Okay. No story form has been created. No questions have been imported.");
                    return;
                }
                break;
            case "ask each":
                break;
            case "stop":
                message += "\nNo story form will be created.";
                alert(message);
                return;
            default: 
                throw Error("ERROR: No override option chosen.");
        }
    }

    project.tripleStore.makeNewSetItem(storyFormListIdentifier, "StoryForm", template);
    
    // For all items:
    //   Check if one with that name already exists
    //   if it does exist, ask if they want to overwrite it
    //   If does not exist, create it in the related set
    //   Add a reference to the question in the story form
        
    const questionTypeCounts = {};

    // in pre-1.2 files, headers for eliciting question, story title, story text, and participant ID were hard coded
    project.tripleStore.addTriple(template.id, "questionForm_import_elicitingQuestionColumnName", "Eliciting question");
    project.tripleStore.addTriple(template.id, "questionForm_import_storyTitleColumnName", "Story title");
    project.tripleStore.addTriple(template.id, "questionForm_import_storyTextColumnName", "Story text");
    project.tripleStore.addTriple(template.id, "questionForm_import_participantIDColumnName", "Participant ID");
    project.tripleStore.addTriple(template.id, "questionForm_import_storyCollectionDateColumnName", "Collection date");
    project.tripleStore.addTriple(template.id, "questionForm_import_storyFormLanguageColumnName", "Language");

    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        const item = items[itemIndex];
        const about = item.About;
        let reference;
        let question;
        if (about === "story") {
            question = questionForItem(item, "storyQuestion");
            reference = ensureQuestionExists(question, "storyQuestion", overrideOption);
            addReferenceToList(template.questionForm_storyQuestions, reference, "storyQuestion", "StoryQuestionChoice");
        } else if (about === "participant") {
            question = questionForItem(item, "participantQuestion");
            reference = ensureQuestionExists(question, "participantQuestion", overrideOption);
            addReferenceToList(template.questionForm_participantQuestions, reference, "participantQuestion", "ParticipantQuestionChoice");
        } else if (about === "eliciting") {
            template.import_elicitingQuestionColumnName = item["Data column name"] || "Eliciting question";
            project.tripleStore.addTriple(template.id, "questionForm_import_elicitingQuestionColumnName", item["Data column name"] || "Eliciting question");
            template.import_elicitingQuestionGraphName = item["Short name"] || "Eliciting question";
            project.tripleStore.addTriple(template.id, "questionForm_import_elicitingQuestionGraphName", item["Short name"] || "Eliciting question");
            template.questionForm_chooseQuestionText = item["Long name"] || "Eliciting question"; 
            project.tripleStore.addTriple(template.id, "questionForm_chooseQuestionText", item["Long name"] || "Eliciting question");
            const answers = item["Answers"];
            answers.forEach(function (elicitingQuestionDefinition) {
                if (!elicitingQuestionDefinition) elicitingQuestionDefinition = "ERROR: Missing eliciting question text";
                const sections = elicitingQuestionDefinition.split("|");
                let dataColumnName = "";
                let shortName = "";
                let longName = "";
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
                const elicitingQuestion = {
                    elicitingQuestion_dataColumnName: dataColumnName.trim(),
                    elicitingQuestion_shortName: shortName.trim(),
                    elicitingQuestion_text: longName.trim(),
                    elicitingQuestion_type: {}
                };
                reference = ensureQuestionExists(elicitingQuestion, "elicitingQuestion", "always");
                addReferenceToList(template.questionForm_elicitingQuestions, reference, "elicitingQuestion", "ElicitingQuestionChoice");
            });
        } else if (about === "form") {
            const type = item.Type;
            const text = item.Answers[0];
            if (text && text != "") {
                let fieldInfoFound = false;
                questionnaireGeneration.formFieldsInfo.forEach((fieldInfo) => {
                    if (fieldInfo.exportImportID === type) {
                        fieldInfoFound = true;
                        template[fieldInfo.tripleStoreFieldID] = text;
                        project.tripleStore.addTriple(template.id, fieldInfo.tripleStoreFieldID, text);
                    } 
                });
                if (!fieldInfoFound) {
                    alert("ERROR: Unrecognized form field: " + type);
                }
            }
        } else if (about === "import") {
            const type = item.Type;
            const text = item.Answers[0];
            if (text && text != "") {
                if (type === "Scale range") {
                    const answers = item["Answers"];
                    let answerCount = 0;
                    answers.forEach(function (textValue) {
                        const value = parseInt(textValue);
                        if (isNaN(value)) {
                            let word = "minimum";
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
                } else if (type === "Story collection date column name") {
                    template.import_storyCollectionDateColumnName = text;
                    project.tripleStore.addTriple(template.id, "questionForm_import_storyCollectionDateColumnName", text);
                } else if (type === "Language column name") {
                    template.import_storyFormLanguageColumnName = text;
                    project.tripleStore.addTriple(template.id, "questionForm_import_storyFormLanguageColumnName", text);
                } else if (type === "Participant ID column name") {
                    template.import_participantIDColumnName = text;
                    project.tripleStore.addTriple(template.id, "questionForm_import_participantIDColumnName", text);
                } else if (type === "Data columns to ignore") {
                    const answersAsLines = item["Answers"].join("\n");
                    template.import_columnsToIgnore = answersAsLines;
                    project.tripleStore.addTriple(template.id, "questionForm_import_columnsToIgnore", answersAsLines);
                } else if (type === "Data columns to append to story text") {
                    const columnsToAppend = [];
                    const textsBeforeColumns = [];
                    item["Answers"].forEach(function (answer) {
                        const sections = answer.split("|");
                        if (sections.length > 0) {
                            columnsToAppend.push(sections[0]);
                        }
                        if (sections.length > 1) {
                            textsBeforeColumns.push(sections[1]);
                        } 
                    });
                    const columnsAsLines = columnsToAppend.join("\n");
                    template.import_columnsToAppendToStoryText = columnsAsLines;
                    project.tripleStore.addTriple(template.id, "questionForm_import_columnsToAppendToStoryText", columnsAsLines);
                    const textsAsLines = textsBeforeColumns.join("\n");
                    template.import_textsToWriteBeforeAppendedColumns = textsAsLines;
                    project.tripleStore.addTriple(template.id, "questionForm_import_textsToWriteBeforeAppendedColumns", textsBeforeColumns);
                } else if (type === "Minimum words to include story") {
                    const minWords = parseInt(text);
                    if (isNaN(minWords)) {
                        alert("The value you entered for the minimum words to include for a story (" + text + ") is not a number. It must be a number.");
                        template.import_minWordsToIncludeStory = "0";
                        project.tripleStore.addTriple(template.id, "questionForm_import_minWordsToIncludeStory", "0");
                    } else {
                        template.import_minWordsToIncludeStory = text;
                        project.tripleStore.addTriple(template.id, "questionForm_import_minWordsToIncludeStory", text);
                    }
                } else if (type === "Texts to remove from column headers") {
                    const answersAsLines = item["Answers"].join("\n");
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
        let order = questionTypeCounts[fieldName];
        if (!order) {
            order = 0;
        }
        order = order + 1;
        questionTypeCounts[fieldName] = order;
        
        const choice = { order: order };
        choice[fieldName] = reference;
        
        project.tripleStore.makeNewSetItem(listIdentifier, className, choice);
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------
// support functions for reading story form
//------------------------------------------------------------------------------------------------------------------------------------------

function ensureQuestionExists(question, questionCategory: string, overrideOption: string) {
    const matchingQuestion = existingQuestionThatMatchesNewQuestion(question, questionCategory);
    if (!matchingQuestion) {
        project.addQuestionForCategory(question, questionCategory);
        return question[questionCategory + "_shortName"];
    } else {
        switch (overrideOption) {
            case "always": // will fall through to next
            case "ask all": // if ask all, would not be here if they didn't say to override
                project.deleteQuestionInCategory(matchingQuestion, questionCategory);
                project.addQuestionForCategory(question, questionCategory);
                return question[questionCategory + "_shortName"];
            case "ask each":
                const message = 'A question with the name "' + matchingQuestion[questionCategory + "_shortName"] 
                    + '" already exists. Do you want to overwrite it? Click OK to ovewrite the existing question. Click Cancel to keep the existing question.';
                if (confirm(message)) {
                    project.deleteQuestionInCategory(matchingQuestion, questionCategory);
                    project.addQuestionForCategory(question, questionCategory);
                    return question[questionCategory + "_shortName"];
                } else {
                    return matchingQuestion[questionCategory + "_shortName"];
                }
            case "never":
                return matchingQuestion[questionCategory + "_shortName"];
            case "stop":
                throw Error("ERROR: Should not be checking questions if user asked to stop importing.")
            default: 
                throw Error("ERROR: No override option chosen.");
        }
    }
}

function existingQuestionThatMatchesNewQuestion(question, questionCategory: string) {
    const idAccessor = questionCategory + "_shortName";
    const existingQuestionsInCategory = project.questionsForCategory(questionCategory);
    for (let i = 0; i < existingQuestionsInCategory.length; i++) {
        const existingQuestion = existingQuestionsInCategory[i];
        if (existingQuestion[idAccessor] === question[idAccessor]) {
            return existingQuestion;
        }
    }
    return null;
}

function questionForItem(item, questionCategory) {
    let valueType = "string";
    let questionType = "text";
    let valueOptions;
    let optionImageLinks;
    let import_columnName;
    let import_answerNames;
    let import_minScaleValue = "";
    let import_maxScaleValue = "";
    
    let itemType = item["Type"].trim();
    let answers = item["Answers"];

    let maxNumAnswers = undefined;
    let writeInTextBoxLabel = "";
    let listBoxRows = undefined;
    let textBoxLength = undefined;
    let optionImagesWidth = undefined;
    const optionsString = item["Options"] || "";
    if (optionsString) {
        const optionParts = optionsString.split("|");
        optionParts.forEach(function(part) {
            if (part.indexOf("maxNumAnswers=") >= 0) {
                maxNumAnswers = stringBeyond(part, "maxNumAnswers=");
                if (maxNumAnswers && isNaN(maxNumAnswers)) {
                    alert('Import error: For the Multiple choice question "' + item["Short name"] + '," the maximum number of answers ("' + maxNumAnswers + '") is not a number.');
                    maxNumAnswers = "";
                }
            } else if (part.indexOf("writeInTextBoxLabel=") >= 0) {
                writeInTextBoxLabel = stringBeyond(part, "writeInTextBoxLabel=");
            } else if (part.indexOf("textBoxLength=") >= 0) {
                textBoxLength = stringBeyond(part, "textBoxLength=");
                if (textBoxLength && isNaN(textBoxLength)) {
                    alert('Import error: For the text question "' + item["Short name"] + '," the text box length ("' + textBoxLength + '") is not a number.');
                    textBoxLength = "";
                }
            } else if (part.indexOf("listBoxRows=") >= 0) {
                listBoxRows = stringBeyond(part, "listBoxRows=");
                if (listBoxRows && isNaN(listBoxRows)) {
                    alert('Import error: For the Multiple choice question "' + item["Short name"] + '," the number of list box rows ("' + listBoxRows + '") is not a number.');
                    listBoxRows = "";
                }
            } else if (part.indexOf("optionImagesWidth=") >= 0) {
                optionImagesWidth = stringBeyond(part, "optionImagesWidth=");
                if (optionImagesWidth && isNaN(optionImagesWidth)) {
                    alert('Import error: For the Multiple choice question "' + item["Short name"] + '," the option image width ("' + optionImagesWidth + '") is not a number.');
                    optionImagesWidth = "";
                }
            }
        });
    }

    // legacy - old name for "Multi-choice multi-column texts" was "Multiple choice"
    if (itemType === "Multiple choice") {
        itemType = "Multi-choice multi-column texts";
    }

    if (["Single choice", "Single choice indexed"].indexOf(itemType) >= 0) {
        questionType = "select";
        const valueAndImportOptions = valueAndImportOptionsForAnswers(answers);
        valueOptions = valueAndImportOptions[0];
        import_answerNames = valueAndImportOptions[1];
        if (answers.length < 2) {
            alert('Import error: For the Single choice question "' + item["Short name"] + '", there must be at least two entries in the Answers columns.');
        }
    } else if (["Multi-choice multi-column texts", "Multi-choice multi-column yes/no", "Multi-choice single-column delimited", "Multi-choice single-column delimited indexed"].indexOf(itemType) >= 0) {
        questionType = "checkboxes";
        const valueAndImportOptions = valueAndImportOptionsForAnswers(answers);
        valueOptions = valueAndImportOptions[0];
        import_answerNames = valueAndImportOptions[1];
        optionImageLinks = valueAndImportOptions[2];
        if (answers.length < 2) {
            alert('Import error: For the Multiple choice question "' + item["Short name"] + '", there must be at least two entries in the Answers columns.');
        }
    } else if (itemType === "Radiobuttons") {
        questionType = "radiobuttons";
        const valueAndImportOptions = valueAndImportOptionsForAnswers(answers);
        valueOptions = valueAndImportOptions[0];
        import_answerNames = valueAndImportOptions[1];
        optionImageLinks = valueAndImportOptions[2];
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
            let answerCount = 0;
            const minAndMax = answers.slice(2);
            minAndMax.forEach(function (textValue) {
                const value = parseInt(textValue);
                if (isNaN(value)) {
                    let word = "minimum";
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
    
    const question = {};
    question[questionCategory + "_type"] = questionType;
    question[questionCategory + "_shortName"] = item["Short name"];
    question[questionCategory + "_text"] = item["Long name"];
    if (valueOptions) question[questionCategory + "_options"] = valueOptions.join("\n");
    if (optionImageLinks) question[questionCategory + "_optionImageLinks"] = optionImageLinks.join("\n");
    if (maxNumAnswers) question[questionCategory + "_maxNumAnswers"] = maxNumAnswers;
    if (optionImagesWidth) question[questionCategory + "_optionImagesWidth"] = optionImagesWidth;
    if (listBoxRows) question[questionCategory + "_listBoxRows"] = listBoxRows;
    if (writeInTextBoxLabel) question[questionCategory + "_writeInTextBoxLabel"] = writeInTextBoxLabel;
    if (textBoxLength) question[questionCategory + "_textBoxLength"] = textBoxLength;

    question[questionCategory + "_import_columnName"] = item["Data column name"] || item["Short name"];
    question[questionCategory + "_import_valueType"] = itemType;
    question[questionCategory + "_import_minScaleValue"] = import_minScaleValue;
    question[questionCategory + "_import_maxScaleValue"] = import_maxScaleValue;
    if (import_answerNames) question[questionCategory + "_import_answerNames"] = import_answerNames.join("\n");
    return question;
}

function valueAndImportOptionsForAnswers(answers) {
    const valueOptions = [];
    const import_answerNames = [];
    const optionImageLinks = [];
    for (let i = 0; i < answers.length; i++) {
        const splitAnswersString = answers[i].split("|");
        if (splitAnswersString.length > 2) {
            import_answerNames.push(splitAnswersString[0]);
            valueOptions.push(splitAnswersString[1]);
            optionImageLinks.push(splitAnswersString[2]);
        } else if (splitAnswersString.length > 1) {
            import_answerNames.push(splitAnswersString[0]);
            valueOptions.push(splitAnswersString[1]);
        } else {
            valueOptions.push(answers[i]);
            import_answerNames.push(answers[i]);
        }
    }
    return [valueOptions, import_answerNames, optionImageLinks];
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// generating story form
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function autoFillStoryForm() {
    const questionnaireName = prompt("Please enter a short name for the new story form.");
    if (!questionnaireName) return;
    if (questionnaireGeneration.buildStoryForm(questionnaireName)) {
        alert('A story form already exists with that name: "' + questionnaireName + '"');
        return;
    }
   
    let storyFormListIdentifier = project.getFieldValue("project_storyForms");
    if (!storyFormListIdentifier) {
        storyFormListIdentifier = project.tripleStore.newIdForSet("StoryFormSet");
        project.setFieldValue("project_storyForms", storyFormListIdentifier);
    }
    const template = {
        id: generateRandomUuid("StoryForm"),
        questionForm_shortName: questionnaireName,
        questionForm_elicitingQuestions: project.tripleStore.newIdForSet("ElicitingQuestionChoiceSet"),
        questionForm_storyQuestions: project.tripleStore.newIdForSet("StoryQuestionChoiceSet"),
        questionForm_participantQuestions: project.tripleStore.newIdForSet("ParticipantQuestionChoiceSet")
    };
    project.tripleStore.makeNewSetItem(storyFormListIdentifier, "StoryForm", template);

    const questionTypeCounts = {};        
    let question;
    let questionIndex;

    const elicitingQuestions = project.collectAllElicitingQuestions();
    for (questionIndex in elicitingQuestions) {
        question = elicitingQuestions[questionIndex];
        addReferenceToList(template.questionForm_elicitingQuestions, question.elicitingQuestion_shortName, "elicitingQuestion", "ElicitingQuestionChoice");
    }

    const storyQuestions = project.collectAllStoryQuestions();
    for (questionIndex in storyQuestions) {
        question = storyQuestions[questionIndex];
        addReferenceToList(template.questionForm_storyQuestions, question.storyQuestion_shortName, "storyQuestion", "StoryQuestionChoice");
    }

    const participantQuestions = project.collectAllParticipantQuestions();
    for (questionIndex in participantQuestions) {
        question = participantQuestions[questionIndex];
        addReferenceToList(template.questionForm_participantQuestions, question.participantQuestion_shortName, "participantQuestion", "ParticipantQuestionChoice");
    }

    m.redraw();
    
    toaster.toast("Finished generating story form \"" + questionnaireName + "\" from available questions.");
    
    function addReferenceToList(listIdentifier: string, reference: string, fieldName: string, className: string) {
        let order = questionTypeCounts[fieldName];
        if (!order) {
            order = 0;
        }
        order = order + 1;
        questionTypeCounts[fieldName] = order;
        
        const choice = {
            order: order
        };
        choice[fieldName] = reference;
        
        project.tripleStore.makeNewSetItem(listIdentifier, className, choice);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// exporting story form
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function exportQuestionnaire(questionnaire = null) {
    let nameToSave = "";
    if (!questionnaire || typeof questionnaire === "string") { 
        const storyCollectionName = Globals.clientState().storyCollectionName();
        if (!storyCollectionName) {
            alert("Please select a story collection first.");
            return;
        }
        nameToSave = storyCollectionName;
        questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionName);
        if (!questionnaire) {
            alert("The story collection has not been initialized with a story form: " + storyCollectionName);
            return;
        }
    } else {
        nameToSave = questionnaire.shortName;
    }
    
    let output = "";
    let lineIndex = 1;
    const delimiter = Globals.clientState().csvDelimiter();
    function addOutputLine(line) { output = addCSVOutputLine(output, line, delimiter); }
    
    const header = ["Data column name", "Type", "About", "Short name", "Long name", "Options", "Answers"];
    addOutputLine(header);
    
    const elicitingLine = ["Eliciting question", "eliciting", "eliciting", "Eliciting question", "Eliciting question", ""];
    questionnaire.elicitingQuestions.forEach(function (elicitingQuestionSpecification) {
        elicitingLine.push(elicitingQuestionSpecification.id + "|" + elicitingQuestionSpecification.text);
    });
    addOutputLine(elicitingLine);

    function outputQuestions(questions, about) {
        for (let i = 0; i < questions.length; i++) {
            const outputLine = [];
            const question = questions[i];
            outputLine.push(question.displayName || ""); // short name is also data column name for export
            let questionType = exportQuestionTypeMap[question.displayType];
            if (!questionType) {
                console.log("EXPORT ERROR: unsupported question type: ", question.displayType);
                questionType = "UNSUPPORTED:" + question.displayType;
            }
            outputLine.push(questionType);
            outputLine.push(about);
            outputLine.push(question.displayName || ""); 
            outputLine.push(question.displayPrompt || ""); 
            const options = [];
            if (question.maxNumAnswers) {
                options.push("maxNumAnswers=" + question.maxNumAnswers);
            }
            if (question.writeInTextBoxLabel) {
                options.push("writeInTextBoxLabel=" + question.writeInTextBoxLabel);
            }
            if (question.listBoxRows) {
                options.push("listBoxRows=" + question.listBoxRows);
            }
            if (question.textBoxLength) {
                options.push("textBoxLength=" + question.textBoxLength);
            }
            if (question.optionImagesWidth) {
                options.push("optionImagesWidth=" + question.optionImagesWidth);
            }
            outputLine.push(options.join("|"));  
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
    
    const annotationQuestions = project.collectAllAnnotationQuestions();
    const adjustedAnnotationQuestions = questionnaireGeneration.convertEditorQuestions(annotationQuestions, "A_");
    outputQuestions(adjustedAnnotationQuestions, "annotation");

    questionnaireGeneration.formFieldsInfo.forEach((fieldInfo) => {
        if (fieldInfo.exportImportID) {
            addOutputLine(["", fieldInfo.exportImportID, "form", "", "", "", questionnaire[fieldInfo.objectFieldID] || ""]);
        }
    });

    // do not need to write "Scale range" because scale data was converted to 0-100 scale during import
    // do not need to write "Yes no questions Q-A separator" or "Yes no questions Q-A ending" or "Yes no questions yes indicator" or "Multi choice single column delimiter"
    // because only the original multi-choice format is used (Multi-choice multi-column texts) for which there are no import options
    // do not need to write "Story title column name" or "Story text column name" or "Eliciting question column name" or "Participant ID column name"
    // because the default (non specified) options will work for all of these things

    const questionnaireBlob = new Blob([output], {type: "text/csv;charset=utf-8"});
    // TODO: This seems to clear the console in FireFox 40; why?
    saveAs(questionnaireBlob, "export_story_form_" + nameToSave + ".csv");
}

const exportQuestionTypeMap = {
    "select": "Single choice",
    "slider": "Scale",
    "checkboxes": "Multi-choice multi-column texts",
    "radiobuttons": "Radiobuttons",
    "boolean": "Boolean",
    "checkbox": "Checkbox",
    "text": "Text",
    "textarea": "Textarea"
};

function addCSVOutputLine(output, line, delimiter) {
    let start = true;
    line.forEach(function (item) {
        let itemToSave = "";
        if (start) {
            start = false;
        } else {
            output += delimiter;
        }
        if (item === undefined) { 
            itemToSave = "";
        } else if (typeof item == 'number') {
            itemToSave = "" + item;
        } else if (typeof item == "boolean") {
            itemToSave = item ? "true" : "false";
        } else {
            itemToSave = item;
        }
        if (itemToSave.indexOf(delimiter) !== -1) {
            itemToSave = itemToSave.replace(/"/g, '""');
            itemToSave = '"' + itemToSave + '"';
        }
        if (itemToSave.indexOf("\n") !== -1) {
            itemToSave = itemToSave.replace(/"/g, '""');
            itemToSave = '"' + itemToSave + '"';
        }
        output += itemToSave;
    });
    output += "\n";
    return output;
}

export function exportQuestionnaireForImport(questionnaire = null) { // to preserve import options for externally derived data
    let nameToSave = "";
    if (!questionnaire || typeof questionnaire === "string") { 
        const storyCollectionName = Globals.clientState().storyCollectionName();
        if (!storyCollectionName) {
            alert("Please select a story collection first.");
            return;
        }
        nameToSave = storyCollectionName;
        questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionName);
        if (!questionnaire) {
            alert("The story collection has not been initialized with a story form: " + storyCollectionName);
            return;
        }
    } else {
        nameToSave = questionnaire.shortName;
    }
    let output = "";
    let lineIndex = 1;
    const delimiter = Globals.clientState().csvDelimiter();
    function addOutputLine(line) { output = addCSVOutputLine(output, line, delimiter); }
    
    const header = ["Data column name", "Type", "About", "Short name", "Long name", "Options", "Answers"];
    addOutputLine(header);

    if (questionnaire.import_elicitingQuestionColumnName) {
        const elicitingLine = [
            questionnaire.import_elicitingQuestionColumnName, "eliciting", "eliciting", 
            questionnaire.import_elicitingQuestionGraphName || "", 
            questionnaire.chooseQuestionText, 
            ""]; // empty column for "Options" field
            questionnaire.elicitingQuestions.forEach( (question) => {
                elicitingLine.push(question.importName || question.id + "|" + question.id + "|" + question.text);
            });
        addOutputLine(elicitingLine);
    }

    function outputQuestions(questions, about) {
        for (let i = 0; i < questions.length; i++) {
            const outputLine = [];
            const question = questions[i];

            outputLine.push(question.import_columnName || ""); 
            outputLine.push(question.import_valueType || "");
            outputLine.push(about || "");
            outputLine.push(question.displayName || ""); 
            outputLine.push(question.displayPrompt || ""); 

            const options = [];
            if (question.maxNumAnswers) {
                options.push("maxNumAnswers=" + question.maxNumAnswers);
            }
            if (question.writeInTextBoxLabel) {
                options.push("writeInTextBoxLabel=" + question.writeInTextBoxLabel);
            }
            if (question.listBoxRows) {
                options.push("listBoxRows=" + question.listBoxRows);
            }
            if (question.textBoxLength) {
                options.push("textBoxLength=" + question.textBoxLength);
            }
            if (question.optionImagesWidth) {
                options.push("optionImagesWidth=" + question.optionImagesWidth);
            }
            outputLine.push(options.join("|"));  

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
                    for (let j = 0; j < question.valueOptions.length; j++) {
                       let cellValue = "";
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

    questionnaireGeneration.formFieldsInfo.forEach((fieldInfo) => {
        if (fieldInfo.exportImportID && fieldInfo.objectFieldID && questionnaire[fieldInfo.objectFieldID]) {
            addOutputLine(["", fieldInfo.exportImportID, "form", "", "", "", questionnaire[fieldInfo.objectFieldID] || ""]);
        }
    });

    if (questionnaire.import_minScaleValue || questionnaire.import_maxScaleValue) addOutputLine(["", "Scale range", "import", "", "", "", "" + questionnaire.import_minScaleValue || "", "" + questionnaire.import_maxScaleValue || ""]);
    if (questionnaire.import_multiChoiceYesQASeparator) addOutputLine(["", "Yes no questions Q-A separator", "import", "", "", "", questionnaire.import_multiChoiceYesQASeparator || ""]);
    if (questionnaire.import_multiChoiceYesQAEnding) addOutputLine(["", "Yes no questions Q-A ending", "import", "", "", "", questionnaire.import_multiChoiceYesQAEnding || ""]);
    if (questionnaire.import_multiChoiceYesIndicator) addOutputLine(["", "Yes no questions yes indicator", "import", "", "", "", questionnaire.import_multiChoiceYesIndicator || ""]);
    if (questionnaire.import_multiChoiceDelimiter) addOutputLine(["", "Multi choice single column delimiter", "import", "", "", "", questionnaire.import_multiChoiceDelimiter || ""]);
    if (questionnaire.import_storyTitleColumnName) addOutputLine(["", "Story title column name", "import", "", "", "", questionnaire.import_storyTitleColumnName || ""]);
    if (questionnaire.import_storyTextColumnName) addOutputLine(["", "Story text column name", "import", "", "", "", questionnaire.import_storyTextColumnName || ""]);
    if (questionnaire.import_storyCollectionDateColumnName) addOutputLine(["", "Story text column name", "import", "", "", "", questionnaire.import_storyCollectionDateColumnName || ""]);

    if (questionnaire.import_participantIDColumnName) addOutputLine(["", "Participant ID column name", "import", "", "", "", questionnaire.import_participantIDColumnName || ""]);
    if (questionnaire.import_minWordsToIncludeStory) addOutputLine(["", "Minimum words to include story", "import", "", "", "", questionnaire.import_minWordsToIncludeStory || ""]);

    if (questionnaire.import_stringsToRemoveFromHeaders) {
        const textsToRemoveOutputLine = ["", "Texts to remove from column headers", "import", "", "", ""];
        const textsList = questionnaire.import_stringsToRemoveFromHeaders.split("\n");
        if (textsList) {
            textsList.forEach(function(item) {
                textsToRemoveOutputLine.push(item);
            });
        }
        addOutputLine(textsToRemoveOutputLine);
    }
    
    if (questionnaire.import_columnsToIgnore) {
        const columnsToIgnoreOutputLine = ["", "Data columns to ignore", "import", "", "", ""];
        const columnList = questionnaire.import_columnsToIgnore.split("\n");
        if (columnList) {
            columnList.forEach(function(item) {
                columnsToIgnoreOutputLine.push(item);
            });
        }
        addOutputLine(columnsToIgnoreOutputLine);
    }
    
    
    if (questionnaire.import_columnsToAppendToStoryText) {
        const columnsToAppendOutputLine = ["", "Data columns to append to story text", "import", "", "", ""];
        const columnsToAppend = questionnaire.import_columnsToAppendToStoryText.split("\n");
        if (columnsToAppend) {
            let textsBeforeColumns = [];
            if (questionnaire.import_textsToWriteBeforeAppendedColumns) {
                if (typeof questionnaire.import_textsToWriteBeforeAppendedColumns === "string") {
                    textsBeforeColumns = questionnaire.import_textsToWriteBeforeAppendedColumns.split("\n");
                } else {
                    textsBeforeColumns = questionnaire.import_textsToWriteBeforeAppendedColumns;
                }
            }
            for (let i = 0; i < columnsToAppend.length; i++) {
                let textToWrite = columnsToAppend[i];
                if (textsBeforeColumns) {
                    textToWrite += "|" + textsBeforeColumns[i];
                }
            columnsToAppendOutputLine.push(textToWrite);
            }
        }
        addOutputLine(columnsToAppendOutputLine);
    }

    const questionnaireBlob = new Blob([output], {type: "text/csv;charset=utf-8"});
    // TODO: This seems to clear the console in FireFox 40; why?
    saveAs(questionnaireBlob, "export_story_form_for_import_" + nameToSave + ".csv");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// exporting and importing story form translation dictionaries
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function exportTranslationDictionary(questionnaire = null) {
    let nameToSave = "";
    if (!questionnaire || typeof questionnaire === "string") { 
        const storyCollectionName = Globals.clientState().storyCollectionName();
        if (!storyCollectionName) {
            alert("Please select a story collection first.");
            return;
        }
        nameToSave = storyCollectionName;
        questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionName);
        if (!questionnaire) {
            alert("The story collection has not been initialized with a story form: " + storyCollectionName);
            return;
        }
    } else {
        nameToSave = questionnaire.shortName;
    }
    if (!questionnaire.defaultLanguage) {
        alert("Please enter a default language before you export the translation dictionary.");
        return;
    }
    if (!questionnaire.languageChoiceQuestion_choices) {
        alert("Please enter some additional language names before you export the translation dictionary.");
        return;
    }
    
    let output = "";
    let lineIndex = 1;
    const delimiter = Globals.clientState().csvDelimiter();

    function addOutputLine(line) { 
        output = addCSVOutputLine(output, line, delimiter); 
    }

    function addOutputLineWithTranslations(text) {
        const parts = [];
        parts.push(lineIndex);
        parts.push(text || "");
        if (questionnaire.translationDictionary[text]) {
            additionalLanguages.forEach((language) => { parts.push(questionnaire.translationDictionary[text][language] || ""); });
        }
        addOutputLine(parts);
        lineIndex++;
    }

    let header = ["Order in survey"];
    const additionalLanguages = questionnaire.languageChoiceQuestion_choices.split("\n").map(function(item) { return item.trim(); } );
    header = header.concat(["Default language: " + questionnaire.defaultLanguage], additionalLanguages);
    addOutputLine(header);

    const instructionsLine = ["; Do not edit the default-language texts in this file. Only change the translated texts (to the right of the default-language texts)."];
    addOutputLine(instructionsLine);

    questionnaireGeneration.formFieldsInfo.forEach((fieldInfo) => {
        if (fieldInfo.canBeTranslated) {
            addOutputLineWithTranslations(questionnaire[fieldInfo.objectFieldID] || surveyBuilderMithril.defaultFormTexts[fieldInfo.objectFieldID] || "");
        }
    });
    questionnaire.elicitingQuestions.forEach(function (elicitingQuestionSpecification) { 
        addOutputLineWithTranslations(elicitingQuestionSpecification.text); 
    });
    [questionnaire.storyQuestions, questionnaire.participantQuestions].forEach((questionList) => {
        questionList.forEach((question) => {
            addOutputLineWithTranslations(question.displayPrompt);
            if (question.displayType === "slider") {
                question.displayConfiguration.forEach(function(option, index) { addOutputLineWithTranslations(option); });
            } else if (question.valueOptions) {
                question.valueOptions.forEach(function(option, index) { addOutputLineWithTranslations(option); });
            }
        });
    });
    
    const questionnaireBlob = new Blob([output], {type: "text/csv;charset=utf-8"});
    saveAs(questionnaireBlob, "export_translation_dictionary_" + nameToSave + ".csv");    
}

function processCSVContentsForTranslationDictionary(contents, saveStories, writeLog, questionnaire = null) {
    if (!questionnaire) return;

    const delimiter = Globals.clientState().csvDelimiter();
    const csv = d3.dsv(delimiter, "text/plain");
    const rows = csv.parseRows(contents);

    let dictionarySetID = project.tripleStore.queryLatestC(questionnaire.id, "questionForm_translationDictionary");
    if (!dictionarySetID) {
        dictionarySetID = project.tripleStore.newIdForSet("TranslationDictionarySet");
        project.tripleStore.addTriple(questionnaire.id, "questionForm_translationDictionary", dictionarySetID);
    }
    const alternativeLanguageNames = [];
    let numLanguageEntriesAdded = 0;
    let numNewDictionariesCreated = 0;
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex];
        if (row.length < 3) continue; 
        if (row[0][0] === ";") continue; 
        if (row[0] === "") continue; 
        if (rowIndex === 0) { 
            // "Order" | Default language | Alternative language | Alternative language | Alternative language
            for (let columnIndex = 2; columnIndex < row.length; columnIndex++) {
                alternativeLanguageNames.push(row[columnIndex]);
            }
        } else {
            // "Order" | Default language text | Alternative language text | Alternative language text | Alternative language text
            const defaultLanguageText = row[1];
            if (defaultLanguageText) {
                for (let columnIndex = 2; columnIndex < row.length; columnIndex++) {
                    const value = row[columnIndex];
                    if (value) {
                        const languageName = alternativeLanguageNames[columnIndex-2];
                        let foundMatchingDictionary = false;
                        const dictionaryIDs = project.tripleStore.getListForSetIdentifier(dictionarySetID);
                        dictionaryIDs.forEach((id) => {
                            const storedDictionary = project.tripleStore.makeObject(id, true);
                            if (storedDictionary.defaultText === defaultLanguageText) {
                                foundMatchingDictionary = true;
                                if (storedDictionary[languageName] !== value) {
                                    project.tripleStore.addTriple(id, languageName, value);
                                    numLanguageEntriesAdded++;
                                }
                            }
                        });
                        if (!foundMatchingDictionary) {
                            const template = {"defaultText": defaultLanguageText};
                            template[languageName] = value;
                            project.tripleStore.makeNewSetItem(dictionarySetID, "TranslationDictionary", template);
                            numNewDictionariesCreated++;
                        }
                    }
                }
            }
        }   
    }
    project.tripleStore.addTriple(questionnaire.id, "languageChoiceQuestion_choices", alternativeLanguageNames.join("\n"));
    let prompt;
    if (numLanguageEntriesAdded == 0 && numNewDictionariesCreated == 0) {
        prompt = "The imported translation dictionary matches the currently stored dictionary. No changes were made.";
    } else {
        prompt = "Import complete. New entries added: " + numNewDictionariesCreated + ". Language fields added or updated: " + numLanguageEntriesAdded + ".";
    }
    alert(prompt);
    m.redraw();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// exporting stories
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function exportStoryCollection() {
    const storyCollectionName = Globals.clientState().storyCollectionName();
    if (!storyCollectionName) {
        alert("Please select a story collection first");
        return;
    }
    
    const questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionName);
    if (!questionnaire) {
        alert("The story collection has not been initialized with a story form: " + storyCollectionName);
        return;
    }

    const allStories = surveyCollection.getStoriesForStoryCollection(storyCollectionName, true);
    const header1 = [];
    const header2 = [];
      
    function header(contents, secondHeader = "") {
        header1.push(contents);
        header2.push(secondHeader);
    }
    
    // Put initial header
    header("Story title", ";"); // use semicolon to make second line a comment
    header("Story text");
    header("Collection date");
    header("Language");
    header("Eliciting question");
    
    function headersForQuestions(questions) {
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            // TODO: Maybe should export ID instead? Or more header lines with ID and prompt?
            if (question.valueOptions && question.displayType === "checkboxes") {
                question.valueOptions.forEach(function(option) {
                    header(question.displayName, option);   
               });
            } else {
                header(question.displayName);
            }
            if (question.writeInTextBoxLabel) {
                header("WRITEIN_" + question.displayName);
            }
        }
    }
    
    headersForQuestions(questionnaire.storyQuestions);
    headersForQuestions(questionnaire.participantQuestions);
    
    const annotationQuestions = project.collectAllAnnotationQuestions();
    const adjustedAnnotationQuestions = questionnaireGeneration.convertEditorQuestions(annotationQuestions, "A_");
    headersForQuestions(adjustedAnnotationQuestions);
  
    let output = "";
    const delimiter = Globals.clientState().csvDelimiter();
    function addOutputLine(line) { output = addCSVOutputLine(output, line, delimiter); }
    
    addOutputLine(header1);
    addOutputLine(header2);
    
    function dataForQuestions(questions, story: surveyCollection.Story, outputLine) {
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            let value = story.fieldValue(question.id);
            if (value === undefined || value === null) value = "";
            if (question.valueOptions && question.displayType === "checkboxes") {
               question.valueOptions.forEach(function(option) {
                   outputLine.push(value[option] ? option : "");   
               });
            } else {
                outputLine.push(value);
            }
            if (question.writeInTextBoxLabel) {
                const writeInValue = story.fieldValueWriteIn(question.id);
                outputLine.push(writeInValue ? writeInValue : "");
            }
        }
    }
    
    allStories.forEach(function (story) {
        const outputLine = [];
        outputLine.push(story.storyName()); 
        outputLine.push(story.storyText());
        outputLine.push(story.storyCollectionDate() || "");
        outputLine.push(story.storyLanguage() || "");
        outputLine.push(story.elicitingQuestion());
        dataForQuestions(questionnaire.storyQuestions, story, outputLine);
        dataForQuestions(questionnaire.participantQuestions, story, outputLine);
        dataForQuestions(adjustedAnnotationQuestions, story, outputLine);
        addOutputLine(outputLine);
    }); 
    
    const storyCollectionBlob = new Blob([output], {type: "text/csv;charset=utf-8"});
    // TODO: This seems to clear the console in FireFox 40; why?
    saveAs(storyCollectionBlob, "export_story_collection_" + storyCollectionName + ".csv");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// exporting and importing catalysis elements
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function exportCatalysisReportElementsToCSV() {
    let output = "";
    let i = 0;

    const delimiter = Globals.clientState().csvDelimiter();
    function addOutputLine(line) { output = addCSVOutputLine(output, line, delimiter); }

    const catalysisReportName = Globals.clientState().catalysisReportName();
    const catalysisReportIdentifier = project.findCatalysisReport(catalysisReportName);  
    const catalysisReportObservationSetIdentifier = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_observations");
    if (!catalysisReportObservationSetIdentifier) {
        console.log("catalysisReportObservationSetIdentifier not defined");
        return;
    }  
    const observationIDs = project.tripleStore.getListForSetIdentifier(catalysisReportObservationSetIdentifier);

    addOutputLine(["; Export of catalysis elements for catalysis report " + catalysisReportName + " in project " + project.projectNameOrNickname()]);
    addOutputLine([""]);
    addOutputLine(["; Observation", "Name", "Description", "Strength", "Linking question", "Pattern", "Graph type", "Question 1", "Question 2", "Question 3", "Additional patterns", "X", "Y", "Interpretation name|description|idea|questions|x|y", "(repeat for each interpretation)"]);

    let perspectives = [];
    let clusteredInterpretations = [];
    const interpretationsClusteringDiagram = project.tripleStore.queryLatestC(catalysisReportIdentifier, "interpretationsClusteringDiagram");
    if (interpretationsClusteringDiagram) [perspectives, clusteredInterpretations] = ClusteringDiagram.calculateClusteringForDiagram(interpretationsClusteringDiagram);

    let themes = [];
    let clusteredObservations = [];
    const observationsClusteringDiagram = project.tripleStore.queryLatestC(catalysisReportIdentifier, "observationsClusteringDiagram");
    if (observationsClusteringDiagram) [themes, clusteredObservations] = ClusteringDiagram.calculateClusteringForDiagram(observationsClusteringDiagram);

    for (let observationIndex = 0; observationIndex < observationIDs.length ; observationIndex++) {

        const observationID = observationIDs[observationIndex];
        const observation = project.tripleStore.makeObject(observationID, true);

        if (observation.observationTitle || observation.observationDescription) {

            const observationLine = [];
            observationLine.push("Observation");
            observationLine.push(observation.observationTitle || "");
            observationLine.push(observation.observationDescription || "");
            observationLine.push(observation.observationStrength || "");
            observationLine.push(observation.observationLinkingQuestion || "");
            observationLine.push(observation.pattern.patternName || "");
            observationLine.push(observation.pattern.graphType || "");

            if (observation.pattern.graphType === "data integrity") {
                observationLine.push(observation.pattern.patternName || "");
                observationLine.push("");
                observationLine.push("");
            } else {
                if (observation.pattern.questions.length === 1) {
                    observationLine.push(observation.pattern.questions[0].id);
                    observationLine.push("");
                    observationLine.push("");
                } else if (observation.pattern.questions.length === 2) {
                    observationLine.push(observation.pattern.questions[0].id);
                    observationLine.push(observation.pattern.questions[1].id);
                    observationLine.push("");
                } else if (observation.pattern.questions.length === 3) {
                    observationLine.push(observation.pattern.questions[0].id);
                    observationLine.push(observation.pattern.questions[1].id);
                    observationLine.push(observation.pattern.questions[2].id);
                }
            }
            observationLine.push(observation.observationExtraPatterns || "");

            let foundClusteredObservation = null;
            for (let i = 0; i < clusteredObservations.length; i++) {
                if (clusteredObservations[i].referenceUUID === observationID) {
                    foundClusteredObservation = clusteredObservations[i];
                    break;
                }
            }
            if (foundClusteredObservation) {
                observationLine.push(foundClusteredObservation.x);
                observationLine.push(foundClusteredObservation.y);
            } else {
                observationLine.push("");
                observationLine.push("");
            }

            const interpretationsList = project.tripleStore.getListForSetIdentifier(observation.observationInterpretations);

            interpretationsList.forEach((interpretationID) => {

                const interpretation = project.tripleStore.makeObject(interpretationID, true);

                if (interpretation.interpretation_name || interpretation.interpretation_text) {

                    const interpretationCell = [];
                    interpretationCell.push(interpretation.interpretation_name || "");
                    interpretationCell.push(interpretation.interpretation_text || "");
                    interpretationCell.push(interpretation.interpretation_idea || "");
                    interpretationCell.push(interpretation.interpretation_questions || "");

                    if (clusteredInterpretations.length) {
                        let foundClusteredInterpretation = null;
                        for (let i = 0; i < clusteredInterpretations.length; i++) {
                            if (clusteredInterpretations[i].referenceUUID === interpretationID) {
                                foundClusteredInterpretation = clusteredInterpretations[i];
                                break;
                            }
                        }
                        if (foundClusteredInterpretation) {
                            interpretationCell.push(foundClusteredInterpretation.x);
                            interpretationCell.push(foundClusteredInterpretation.y);
                        }
                    }
                    observationLine.push(interpretationCell.join("|"));
                }
            });

            if (observation.observationNote) observationLine.push(observationNoteIdentifier + observation.observationNote);
            addOutputLine(observationLine);
        }
    }

    if (perspectives.length) {

        addOutputLine([""]);
        addOutputLine(["; Perspective", "Name", "Notes", "X", "Y", "Order"]);

        for (let i = 0; i < perspectives.length; i++) {
            const perspective = perspectives[i];
            addOutputLine(["Perspective", perspective.name || "", perspective.notes || "", perspective.x || "", perspective.y || "", perspective.order || ""]);
        }
    }

    if (themes.length) {

        addOutputLine([""]);
        addOutputLine(["; Theme", "Name", "Notes", "X", "Y", "Order"]);

        for (let i = 0; i < themes.length; i++) {
            const theme = themes[i];
            addOutputLine(["Theme", theme.name || "", theme.notes || "", theme.x || "", theme.y || "", theme.order || ""]);
        }
    }

    const exportBlob = new Blob([output], {type: "text/csv;charset=utf-8"});
    saveAs(exportBlob, "Catalysis_report_elements_" + catalysisReportName + ".csv");
} 

export function processCSVContentsForCatalysisElements(contents) {

    // there is a general assumption here that the catalysis report is empty (so we do not need to look for existing items for any of these things)

    let numObservationsCreated = 0;
    let numInterpretationsCreated = 0;
    let numPerspectivesCreated = 0;
    let numThemesCreated = 0;
    const numObservationsAlreadyProcessedPerPattern = {};

    const catalysisReportIdentifier = Globals.clientState().catalysisReportIdentifier();
    let observationSetIdentifier = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_observations");
    if (!observationSetIdentifier) {
        observationSetIdentifier = generateRandomUuid("ObservationSet");
        project.tripleStore.addTriple(catalysisReportIdentifier, "catalysisReport_observations", observationSetIdentifier);
    }

    const allQuestions = project.allQuestionsThatCouldBeGraphedForCatalysisReport(catalysisReportIdentifier, false);

    let interpretationsClusteringDiagram: ClusteringDiagramModel = project.tripleStore.queryLatestC(catalysisReportIdentifier, "interpretationsClusteringDiagram");
    if (!interpretationsClusteringDiagram) {
        interpretationsClusteringDiagram = ClusteringDiagram.newDiagramModel();
    }
    let interpretationsClusteringDiagramChanged = false;

    let observationsClusteringDiagram = project.tripleStore.queryLatestC(catalysisReportIdentifier, "observationsClusteringDiagram");
    if (!observationsClusteringDiagram) {
        observationsClusteringDiagram = ClusteringDiagram.newDiagramModel();
    }
    let observationsClusteringDiagramChanged = false;

    const delimiter = Globals.clientState().csvDelimiter();
    const csv = d3.dsv(delimiter, "text/plain");
    const rows = csv.parseRows(contents);

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {

        const row = rows[rowIndex];
        if (row.length < 2) continue;
        if (row[0][0] === ";") continue;
        if (row[0] === "") continue;

        if (row[0] === "Observation") {

            // addOutputLine(["; Observation", "Name", "Description", "Strength", "Linking question", "Pattern", "Graph type", "Question 1", "Question 2", "Question 3", 
            // "Additional patterns", "X", "Y", "Interpretation name|description|idea|questions|x|y", "(repeat for each interpretation)"]);
            // optional note at the end, prefaced by observationNoteIdentifier
            
            const observationName = row[1];
            const observationDescription = row[2];
            const observationStrength = row[3];
            const observationLinkingQuestion = row[4];
            const patternName = row[5];
            const graphType = row[6];

            let patternQuestionIDs = [];
            if (graphType === "data integrity") {
                patternQuestionIDs = [patternName];
            } else {
                if (row[7]) patternQuestionIDs.push(row[7]);
                if (row[8]) patternQuestionIDs.push(row[8]);
                if (row[9]) patternQuestionIDs.push(row[9]);
            }
            const observationExtraPatterns = row[10];

            let x = 100;
            if (row.length > 11) {
                x = parseInt(row[11] || "");
                if (isNaN(x)) x = 100;
            }
            let y = 100;
            if (row.length > 12) {
                y = parseInt(row[12] || "");
                if (isNaN(y)) y = 100;
            }

            const interpretationSpecs = [];
            let observationNote = null;
            if (row.length > 13) {
                for (let colIndex = 13; colIndex < row.length; colIndex++) {
                    // the note field was added after this export format was designed
                    // i am writing out the note after the interpretations
                    // but the only way to test for it during import is to use an identifier
                    // to distinguish it from the interpretations
                    // hence I am testing for the prefix observationNoteIdentifier
                    if (row[colIndex].indexOf(observationNoteIdentifier) >= 0) {
                        observationNote = row[colIndex].substring(observationNoteIdentifier.length);
                    } else {
                        interpretationSpecs.push(row[colIndex]);
                    }
                }
            }

            const patternQuestions = [];
            patternQuestionIDs.forEach(function(id) {
                for (let questionIndex = 0; questionIndex < allQuestions.length; questionIndex++) {
                    if (allQuestions[questionIndex].id === id) {
                        patternQuestions.push(allQuestions[questionIndex]);
                    }
                }
            });

            const patternQuestionsAsString = JSON.stringify(patternQuestions);
            if (numObservationsAlreadyProcessedPerPattern[patternQuestionsAsString] === undefined) { 
                numObservationsAlreadyProcessedPerPattern[patternQuestionsAsString] = 0;
            }

            const pattern = {graphType: graphType, patternName: patternName, questions: patternQuestions};
            const patternReference = PatternExplorer.patternReferenceForPatternAndIndex(pattern, numObservationsAlreadyProcessedPerPattern[patternQuestionsAsString]);
            numObservationsAlreadyProcessedPerPattern[patternQuestionsAsString] += 1; // increment after saving, because first one saved should be index 0

            const observationIdentifier = generateRandomUuid("Observation");
            project.tripleStore.addTriple(observationSetIdentifier, patternReference, observationIdentifier);
            
            project.tripleStore.addTriple(observationIdentifier, "pattern", pattern);
            project.tripleStore.addTriple(observationIdentifier, "observationTitle", observationName); 
            project.tripleStore.addTriple(observationIdentifier, "observationDescription", observationDescription); 
            project.tripleStore.addTriple(observationIdentifier, "observationStrength", observationStrength); 
            project.tripleStore.addTriple(observationIdentifier, "observationLinkingQuestion", observationLinkingQuestion); 
            project.tripleStore.addTriple(observationIdentifier, "observationExtraPatterns", observationExtraPatterns); 
            if (observationNote) project.tripleStore.addTriple(observationIdentifier, "observationNote", observationNote); 

            const newItem = ClusteringDiagram.addNewItemToDiagram(observationsClusteringDiagram, "item", observationName, observationDescription);
            newItem.x = x;
            newItem.y = y;
            ClusteringDiagram.setItemColorBasedOnStrength(newItem, observationStrength);
            observationsClusteringDiagramChanged = true;

            numObservationsCreated++;

            if (interpretationSpecs.length) {

                let interpretationSetID = project.tripleStore.queryLatestC(observationIdentifier, "observationInterpretations");
                if (!interpretationSetID) {
                    interpretationSetID = generateRandomUuid("InterpretationSet");
                    project.tripleStore.addTriple(observationIdentifier, "observationInterpretations", interpretationSetID);
                }

                interpretationSpecs.forEach(function(spec) {
                    const partsOfSpec = spec.split("|");

                    // "Interpretation name|description|idea|questions|x|y"

                    const name = partsOfSpec[0] || "";
                    const text = partsOfSpec[1] || "";
                    const idea = partsOfSpec[2] || "";
                    const questions = partsOfSpec[3] || "";

                    
                    let x = 100;
                    if (partsOfSpec.length > 4) {
                        x = parseInt(partsOfSpec[4] || "");
                        if (isNaN(x)) x = 100;
                    }
                    let y = 100;
                    if (partsOfSpec.length > 5) {
                        y = parseInt(partsOfSpec[5] || "");
                        if (isNaN(y)) y = 100;
                    }

                    if (name && text) {

                        const template = {
                            id: generateRandomUuid("Interpretation"),
                            interpretation_name: name, 
                            interpretation_text: text,  
                            interpretation_idea: idea,
                            interpretation_questions: questions
                        };
                        project.tripleStore.makeNewSetItem(interpretationSetID, "Interpretation", template);
                        numInterpretationsCreated++;

                        const newItem = ClusteringDiagram.addNewItemToDiagram(interpretationsClusteringDiagram, "item", name, text);
                        newItem.x = x;
                        newItem.y = y;
                        ClusteringDiagram.setItemColorBasedOnStrength(newItem, observationStrength);
                        interpretationsClusteringDiagramChanged = true;
                    }

                });
            }

        } else if (row[0] === "Perspective") {

            // addOutputLine(["; Perspective", "Name", "Notes", "X", "Y", "Order"]);

            const name = row[1];
            const notes = row[2];

            let x = 100;
            if (row.length > 3) {
                x = parseInt(row[3] || "");
                if (isNaN(x)) x = 100;
            }
            let y = 100;
            if (row.length > 4) {
                y = parseInt(row[4] || "");
                if (isNaN(y)) y = 100;
            }
            let order = 1;
            if (row.length > 5) {
                order = parseInt(row[5] || "");
                if (isNaN(order)) order = 1;
            }

            const newItem = ClusteringDiagram.addNewItemToDiagram(interpretationsClusteringDiagram, "cluster", name, notes);
            newItem.x = x;
            newItem.y = y;
            newItem.order = order;
            interpretationsClusteringDiagramChanged = true;
            numPerspectivesCreated++;

        } else if (row[0] === "Theme") {

            // addOutputLine(["; Theme", "Name", "Notes", "X", "Y", "Order"]);

            const name = row[1];
            const notes = row[2];

            let x = 100;
            if (row.length > 3) {
                x = parseInt(row[3] || "");
                if (isNaN(x)) x = 100;
            }
            let y = 100;
            if (row.length > 4) {
                y = parseInt(row[4] || "");
                if (isNaN(y)) y = 100;
            }
            let order = 1;
            if (row.length > 5) {
                order = parseInt(row[5] || "");
                if (isNaN(order)) order = 1;
            }

            const newItem = ClusteringDiagram.addNewItemToDiagram(observationsClusteringDiagram, "cluster", name, notes);
            newItem.x = x;
            newItem.y = y;
            newItem.order = order;
            observationsClusteringDiagramChanged = true;
            numThemesCreated++;

        } else {
            alert('Unrecognized first cell in CSV row: "' + row[0] + '". The first cell in each row must be either "Observation", "Perspective", or "Theme". If this is a comment row, make sure the first character in the first cell is a semicolon.');
        }
    }

    if (interpretationsClusteringDiagramChanged) {
        project.tripleStore.addTriple(catalysisReportIdentifier, "interpretationsClusteringDiagram", interpretationsClusteringDiagram);
    }

    if (observationsClusteringDiagramChanged) {
        project.tripleStore.addTriple(catalysisReportIdentifier, "observationsClusteringDiagram", observationsClusteringDiagram);
    }

    const reportItems = [];
    reportItems.push(numObservationsCreated + (numObservationsCreated === 1 ? " observation" : " observations"));
    reportItems.push(numInterpretationsCreated + (numInterpretationsCreated === 1 ? " interpretation" : " interpretations"));
    reportItems.push(numPerspectivesCreated + (numPerspectivesCreated === 1 ? " perspective" : " perspectives"));
    reportItems.push(numThemesCreated + (numThemesCreated === 1 ? " theme" : " themes"));
    const reportText = "Successfully imported " + reportItems.join(", ") + ".";
    alert(reportText);
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

export function checkCSVStoriesWithStoryForm(questionnaire) {
    // do not save stories, do write verbose log
    chooseCSVFileToImport(processCSVContentsForStories, false, true, questionnaire);
}

export function importCSVQuestionnaire() {
    const overrideOption = project.tripleStore.queryLatestC(project.projectIdentifier, "project_csvQuestionOverwriteOption");
    if (!overrideOption) {
        alert("Please choose how you want to deal with existing questions while importing your CSV file.");
        return;
    }
    chooseCSVFileToImport(processCSVContentsForQuestionnaire, true, false);
}

export function importCSVAnnotations() {
    if (!Globals.clientState().storyCollectionName()) {
        // TODO: Translate
        return alert("You need to select a story collection before you can import annotations to it.");
    }
    // save stories, do not write verbose log
    chooseCSVFileToImport(processCSVContentsForAnnotations, true, false);
}

export function checkCSVAnnotations() {
    if (!Globals.clientState().storyCollectionName()) {
        // TODO: Translate
        return alert("You need to select a story collection before you can check a story CSV file.");
    }
    // do not save stories, do write verbose log
    chooseCSVFileToImport(processCSVContentsForAnnotations, false, true);
}

export function exportAnnotationsToCSV() {
    if (!Globals.clientState().storyCollectionName()) {
        // TODO: Translate
        return alert("You need to select a story collection before you can export annotations from it.");
    }
    exportAnnotationsForCurrentStoryCollectionToCSV();
}

export function importTranslationDictionary(questionnaire) {
    chooseCSVFileToImport(processCSVContentsForTranslationDictionary, true, false, questionnaire);
}

export function importCSVCatalysisElements() {
    if (!Globals.clientState().catalysisReportIdentifier()) {
        // TODO: Translate
        return alert("You need to select a catalysis report before you can import elements to it.");
    }
    const catalysisReportName = Globals.clientState().catalysisReportName();
    const message = 'You are about to import observations, interpretations, and perspectives into the current catalysis report, ' + 
        catalysisReportName + '. You should only do this with an empty report. Are you sure you want to do this?';
    if (!confirm(message)) return;
    chooseCSVFileToImport(processCSVContentsForCatalysisElements, false, false);
}

export function exportCatalysisReportElements() {
    if (!Globals.clientState().catalysisReportIdentifier()) {
        // TODO: Translate
        return alert("You need to select a catalysis report before you can export elements from it.");
    }
    exportCatalysisReportElementsToCSV();
}