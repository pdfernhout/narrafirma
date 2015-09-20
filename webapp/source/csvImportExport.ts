import Project = require("./Project");
import d3 = require("d3");
import generateRandomUuid = require("./pointrel20150417/generateRandomUuid");
import questionnaireGeneration = require("./questionnaireGeneration");
import surveyCollection = require("./surveyCollection");
import surveyStorage = require("./surveyStorage");
import dialogSupport = require("./panelBuilder/dialogSupport");
import Globals = require("./Globals");
import m = require("mithril");

"use strict";

// TODO: Fix big kludge of this module level variable across the app!
var lastQuestionnaireUploaded = null;

var project: Project;

export function initialize(theProject) {
    project = theProject;
}

function processCSVContents(contents, callbackForItem) {
    console.log("processCSVContents contents", contents);
    
    var rows = d3.csv.parseRows(contents);
    console.log("rows", rows);
    
    var items = [];
    var header;
    
    for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        var row = rows[rowIndex];
        // Throw away initial blank lines and comment lines
        if (!row.length || !row[0] || row[0].trim().charAt(0) === ";") {
            console.log("comment", row[0]);
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
                            alert("ERROR: header has empty field before end");
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
    // console.log("header", header);
    // console.log("items", items);
    return {header: header, items: items};
}

function processCSVContentsForStories(contents) {
    var storyCollectionIdentifier = prompt("Please give this new story collection a name.");
    if (!storyCollectionIdentifier) return;
    
    if (surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier)) {
        alert("A story collection with that name already exists: " + storyCollectionIdentifier);
        return;
    }
    
    var progressModel = dialogSupport.openProgressDialog("Processing CSV file...", "Progress writing imported stories", "Cancel", dialogCancelled);
  
    // Throws away line after header which starts with a blank
    var headerAndItems = processCSVContents(contents, function (header, row) {
        var newItem = {};
        for (var fieldIndex = 0; fieldIndex < header.length; fieldIndex++) {
            var fieldName = header[fieldIndex];
            // TODO: Should the value really be trimmed?
            var value = row[fieldIndex].trim();
            if (newItem[fieldName] === undefined) {
                newItem[fieldName] = value;
            } else {
                // Handle case where this is a multiple choice question, which is indicated by multiple columns
                var data = newItem[fieldName];
                if (data && typeof data === 'object') {
                    if (value !== "") data[value] = true;
                } else {
                   var newData = {};
                   if (data !== "") newData[data] = true;
                   if (value !== "") newData[value] = true;
                   newItem[fieldName] = newData;
                }
            }
        }
        return newItem;
    });
    console.log("processCSVContentsForStories headerAndItems", headerAndItems);
    var items = headerAndItems.items;
    var surveyResults = [];
    // TODO: this is a kludgy way to get a string and seems brittle
    var importedByUserIdentifier = project.userIdentifier.userIdentifier;
    for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {
        var item = items[itemIndex];
        console.log("item", item);
        // TODO: Copied code from surveyBuilder module! Need a common function with surveyBuilder to make this!!!
        var newSurveyResult = {
            __type: "org.workingwithstories.QuestionnaireResponse",
            // TODO: Think about whether to include entire questionnaire or something else perhaps
            // TODO: Big kludge to use (module) global here!!!
            questionnaire: lastQuestionnaireUploaded,
            responseID: generateRandomUuid("QuestionnaireResponse"),
            stories: [],
            participantData: {
                __type: "org.workingwithstories.ParticipantData",
                participantID: generateRandomUuid("Participant")
            },
            // TODO: Should have timestamp in CSV file!!!
            timestampStart: "" + new Date().toISOString(),
            timestampEnd: "" + new Date().toISOString(),
            timeDuration_ms: 0,
            // TODO: this is a kludgy way to get a string and seems brittle
            importedBy: importedByUserIdentifier
        };
        
        var elicitingQuestion = item["Eliciting question"] || lastQuestionnaireUploaded.elicitingQuestions[0].id;
        var story = {
            __type: "org.workingwithstories.Story",
            // TODO: Can this "id" field be safely removed? id: generateRandomUuid("TODO:???"),
            storyID: generateRandomUuid("Story"),
            participantID: newSurveyResult.participantData.participantID,
            elicitingQuestion: elicitingQuestion,
            storyText: item["Story text"],
            storyName: item["Story title"]
        };
    
        var i;
        var question;
        for (i = 0; i < lastQuestionnaireUploaded.storyQuestions.length; i++) {
            question = lastQuestionnaireUploaded.storyQuestions[i];
            story[question.id] = item[question.id.substring("S_".length)];
        }
        newSurveyResult.stories.push(story);
        for (i = 0; i < lastQuestionnaireUploaded.participantQuestions.length; i++) {
            question = lastQuestionnaireUploaded.participantQuestions[i];
            newSurveyResult.participantData[question.id] = item[question.id.substring("P_".length)];
        }
        console.log("newSurveyResult", newSurveyResult);
        surveyResults.push(newSurveyResult);
    }
    
    var newStoryCollection = {
        id: generateRandomUuid("StoryCollection"),
        storyCollection_shortName: storyCollectionIdentifier,
        storyCollection_questionnaireIdentifier: lastQuestionnaireUploaded.title,
        storyCollection_activeOnWeb: false,
        storyCollection_notes: "imported by: " + importedByUserIdentifier + " at: " + new Date().toISOString(),
        questionnaire: lastQuestionnaireUploaded
    };
    
    var storyCollections = project.getFieldValue("project_storyCollections");
    if (!storyCollections) {
        storyCollections = project.tripleStore.newIdForSet("StoryCollectionSet");
        project.setFieldValue("project_storyCollections", storyCollections);
    }
    
    if (!surveyResults.length) {
        alert("No stories to write");
        progressModel.hideDialogMethod();
        progressModel.redraw();
        return;
    }
    
    project.tripleStore.makeNewSetItem(storyCollections, "StoryCollection", newStoryCollection);
     
    var totalStoryCount = surveyResults.length;

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
    
    var storyIndexToSend = 0;
    
    function sendNextSurveyResult() {
        if (progressModel.cancelled) {
            alert("Cancelled after sending " + storyIndexToSend + " stories");
        } else if (storyIndexToSend >= surveyResults.length) {
            alert("Done sending stores");
            progressModel.hideDialogMethod();
            progressModel.redraw();
        } else {
            var surveyResult = surveyResults[storyIndexToSend++];
            // TODO: Translate
            progressModel.progressText = "Sending " + storyIndexToSend + " of " + totalStoryCount + " stories";
            progressModel.redraw();
            surveyStorage.storeSurveyResult(project.pointrelClient, project.projectIdentifier, storyCollectionIdentifier, surveyResult, wizardPane);
        }
    }
    
    // Start sending survey results
    sendNextSurveyResult();
}

function processCSVContentsForQuestionnaire(contents) {
    var headerAndItems = processCSVContents(contents, function (header, row) {
        console.log("callback", header, row);
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
            console.log("fieldName, value", fieldName, value);
            if (fieldIndex < header.length - 1) {
                newItem[fieldName] = value;
            } else {
                // Handle multiple values for last header items
                var list = newItem[fieldName];
                console.log("list", list, fieldIndex, fieldName);
                if (!list) {
                    list = [];
                    newItem[fieldName] = list;
                }
                if (value) list.push(value);
            }
        }
        return newItem;
    });
    console.log("processCSVContentsForQuestionnaire headerAndItems", headerAndItems);
    
    var shortName = prompt("Please enter a short name for a new story form.");
    if (!shortName) return;
    if (questionnaireGeneration.buildQuestionnaire(shortName)) {
        alert('A story form already exists with that name: "' + shortName + '"');
        return;
    }
    
    var storyCollectionsListIdentifier = project.getFieldValue("project_storyCollections");
    console.log("storyCollectionsListIdentifier");
 
    // TODO: Generalize random uuid function to take class name
    // TODO: Maybe rename quesitonForm_ to storyForm_ ?

    var template = {
        id: generateRandomUuid("StoryForm"),
        questionForm_shortName: shortName
    };
    
    project.tripleStore.makeNewSetItem(storyCollectionsListIdentifier, "StoryForm", template);
    
    /*
    
    // For now, no eliciting questions, so the default one would be used
    
    // Add story questions
    // TODO: What if questions with the same shortName but different options already exist?
    
    var questionnaire = {
        title: shortName,
        startText: "",
        image: "",
        elicitingQuestions: [],
        storyQuestions: [],
        participantQuestions: [],
        endText: ""
    };
    
    var items = headerAndItems.items;
    for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {
        var item = items[itemIndex];
        var about = item.About;
        if (about === "story") {
            questionnaire.storyQuestions.push(questionForItem(item, "S_"));
        } else if (about === "participant") {
            questionnaire.participantQuestions.push(questionForItem(item, "P_"));
        } else if (about === "eliciting") {
            var temp = questionForItem(item, "");
            temp.valueOptions.forEach(function (elicitingQuestionDefinition) {
                if (!elicitingQuestionDefinition) elicitingQuestionDefinition = "ERROR:MissingElicitingText";
                var sections = elicitingQuestionDefinition.split("|");
                // If only one section, use it as both id and text
                if (sections.length < 2) {
                    sections.push(sections[0]);
                }
                questionnaire.elicitingQuestions.push({id: sections[0].trim(), text: sections[1].trim()});
            });
        } else {
            console.log("Error: unexpected About type of", about);
        }
    }
    
    questionnaireGeneration.ensureAtLeastOneElicitingQuestion(questionnaire);
    console.log("CSV questionnaire made", questionnaire);
    lastQuestionnaireUploaded = questionnaire;
    return questionnaire;
    
    */
    
    m.redraw();
}

function questionForItem(item, prefixQPA: string) {
    var valueType = "string";
    var questionType = "text";
    var valueOptions;
    var displayConfiguration;
    var answers = item["Answers"];
    
    var itemType = item["Type"].trim();
    if (itemType === "Single choice") {
        questionType = "select";
        valueOptions = answers;
    } else if (itemType === "Scale") {
        valueType = "number";
        questionType = "slider";
        displayConfiguration = [answers[0], answers[1]];
    } else if (itemType === "Multiple choice") {
        questionType = "checkboxes";
        valueOptions = item["Answers"];
    } else if (itemType === "Radiobuttons") {
        questionType = "radiobuttons";
        valueOptions = item["Answers"];
    } else if (itemType === "Boolean") {
        questionType = "boolean";
    } else if (itemType === "Text") {
        questionType = "text";
    } else if (itemType === "Textarea") {
        questionType = "textarea";
    } else if (itemType === "Eliciting question") {
        questionType = "eliciting";
        valueOptions = item["Answers"];
    } else {
        console.log("IMPORT ERROR: unsupported question type: ", itemType);
    }
    return {
        valueType: valueType,
        displayType: questionType,
        id: prefixQPA + item["Short name"], 
        valueOptions: valueOptions,
        displayName: item["Short name"], 
        displayPrompt: item["Long name"],
        displayConfiguration: displayConfiguration
    };
}

function chooseCSVFileToImport(callback) {
    // console.log("chooseFileToImport");
    var cvsFileUploader = <HTMLInputElement>document.getElementById("csvFileLoader");
    // console.log("cvsFileUploader", cvsFileUploader);
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
	// TODO: Translate
    if (!lastQuestionnaireUploaded) return alert("You need to import a story form before you can import story data into a collection.");
    chooseCSVFileToImport(processCSVContentsForStories);
}

export function importCSVQuestionnaire() {
    chooseCSVFileToImport(processCSVContentsForQuestionnaire);
}

// Library for saving files, imported by narrafirma.html
declare var saveAs;

function addCSVOutputLine(output, line) {
    console.log("line", line);
    var start = true;
    line.forEach(function (item) {
        console.log("item", item);
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
    "checkboxes": "Multiple choice",
    "select": "Single choice",
    "slider": "Scale",
    "boolean": "Boolean",
    "radiobuttons": "Radiobuttons",
    "text": "Text",
    "textarea": "Textarea"
};

export function exportQuestionnaire() {
    var storyCollectionIdentifier = Globals.clientState().storyCollectionIdentifier();
    
    console.log("exportStoryCollection", storyCollectionIdentifier);
    var currentQuestionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);
    console.log("exportQuestionnaire", currentQuestionnaire);
    
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
    
    function dataForQuestions(questions, about) {
        for (var i = 0; i < questions.length; i++) {
            var outputLine = [];
            var question = questions[i];
            outputLine.push("" + (++lineIndex));
            outputLine.push(question.displayPrompt);
            outputLine.push(question.displayName);
            var questionType = exportQuestionTypeMap[question.displayType];
            if (!questionType) {
                console.log("EXPORT ERROR: unsupported question type: ", question.displayType);
                questionType = "UNSUPPORTED:" + question.displayType;
            }
            outputLine.push(questionType);
            outputLine.push(about);
            if (question.valueOptions) {
               question.valueOptions.forEach(function(option) {
                   outputLine.push(option);   
               });
            }
            addOutputLine(outputLine);
        }
    }
    
    dataForQuestions(currentQuestionnaire.storyQuestions, "story");
    dataForQuestions(currentQuestionnaire.participantQuestions, "participant");
    
     // Export questionnaire
    var questionnaireBlob = new Blob([output], {type: "text/csv;charset=utf-8"});
    // TODO: This seems to clear the console in FireFox 40; why?
    saveAs(questionnaireBlob, "export_story_form_" + storyCollectionIdentifier + ".csv");
}

export function exportStoryCollection() {
    var storyCollectionIdentifier = Globals.clientState().storyCollectionIdentifier();
    
    console.log("exportStoryCollection", storyCollectionIdentifier);
    var currentQuestionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);
    console.log("currentQuestionnaire", currentQuestionnaire);

    var allStories = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier, true);
    console.log("allStories", allStories);
    
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
            var storyQuestion = questions[i];
            // TODO: Maybe should export ID instead? Or more header lines with ID and prompt?
            if (storyQuestion.valueOptions && storyQuestion.displayType === "checkboxes") {
               storyQuestion.valueOptions.forEach(function(option) {
                   header(storyQuestion.displayName, option);   
               });
            } else {
                header(storyQuestion.displayName);
            }
        }
    }
    
    headersForQuestions(currentQuestionnaire.storyQuestions);
    headersForQuestions(currentQuestionnaire.participantQuestions);
    
    console.log("header1", header1);
    console.log("header2", header2);
    
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
        addOutputLine(outputLine);
    }); 
    
    // Testing
    //var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
    //saveAs(blob, "hello world.csv");
    
    // Export story collection
    var storyCollectionBlob = new Blob([output], {type: "text/csv;charset=utf-8"});
    // TODO: This seems to clear the console in FireFox 40; why?
    saveAs(storyCollectionBlob, "export_story_collection_" + storyCollectionIdentifier + ".csv");
}