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

"use strict";

var project: Project;

export function initialize(theProject) {
    project = theProject;
}

function processCSVContents(contents, callbackForItem) {
    // console.log("processCSVContents contents", contents);
    
    var rows = d3.csv.parseRows(contents);
    // console.log("rows", rows);
    
    var items = [];
    var header;
    
    for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        var row = rows[rowIndex];
        // Throw away comment lines and lines with blanks at first two positions
        if (!row.length || row.length < 2 || (!row[0].trim() && !row[1].trim()) || row[0].trim().charAt(0) === ";") {
            // console.log("comment", row[0]);
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

function padLeadingZeros(num: number, size: number) {
    var result = num + "";
    while (result.length < size) result = "0" + result;
    return result;
}

function processCSVContentsForStories(contents) {
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
            var fieldName = header[fieldIndex];
            // Note the value is trimmed
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
    // console.log("processCSVContentsForStories headerAndItems", headerAndItems);
    var items = headerAndItems.items;
    var surveyResults = [];
    var untitledCount = 0;
    // TODO: this is a kludgy way to get a string and seems brittle
    var importedByUserIdentifier = project.userIdentifier.userIdentifier;
    for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {
        var item = items[itemIndex];
        // console.log("item", item);
        // TODO: Copied code from surveyBuilder module! Need a common function with surveyBuilder to make this!!!
        var newSurveyResult = {
            __type: "org.workingwithstories.QuestionnaireResponse",
            // TODO: Think about whether to include entire questionnaire or something else perhaps
            questionnaire: questionnaire,
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
        
        var elicitingQuestion = item["Eliciting question"] || questionnaire.elicitingQuestions[0].id;
        var story = {
            __type: "org.workingwithstories.Story",
            // TODO: Can this "id" field be safely removed? id: generateRandomUuid("TODO:???"),
            storyID: generateRandomUuid("Story"),
            participantID: newSurveyResult.participantData.participantID,
            elicitingQuestion: elicitingQuestion,
            storyText: item["Story text"],
            storyName: item["Story title"] || ("Untitled #" + padLeadingZeros(++untitledCount, 4))
        };
    
        var i;
        var question;
        for (i = 0; i < questionnaire.storyQuestions.length; i++) {
            question = questionnaire.storyQuestions[i];
            story[question.id] = item[question.id.substring("S_".length)];
        }
        newSurveyResult.stories.push(story);
        for (i = 0; i < questionnaire.participantQuestions.length; i++) {
            question = questionnaire.participantQuestions[i];
            newSurveyResult.participantData[question.id] = item[question.id.substring("P_".length)];
        }
        
        // Add any annotations
        project.collectAllAnnotationQuestions().forEach((annotationQuestion) => {
            var id = annotationQuestion.annotationQuestion_shortName;
            var value = item[id];
            if (value !== null && value !== undefined) {
                newSurveyResult.participantData["A_" + id] = value;
            }
        });
        
        // console.log("newSurveyResult", newSurveyResult);
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
            alert("Finished sending stories to server.");
            progressModel.hideDialogMethod();
            progressModel.redraw();
        } else {
            var surveyResult = surveyResults[storyIndexToSend++];
            // TODO: Translate
            progressModel.progressText = "Sending " + storyIndexToSend + " of " + totalStoryCount + " stories";
            progressModel.redraw();
            surveyStorage.storeSurveyResult(project.pointrelClient, project.projectIdentifier, storyCollectionName, surveyResult, wizardPane);
        }
    }
    
    // Start sending survey results
    sendNextSurveyResult();
}

function processCSVContentsForQuestionnaire(contents) {
    var headerAndItems = processCSVContents(contents, function (header, row) {
        // console.log("callback", header, row);
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
            // console.log("fieldName, value", fieldName, value);
            if (fieldIndex < header.length - 1) {
                newItem[fieldName] = value;
            } else {
                // Handle multiple values for last header items
                var list = newItem[fieldName];
                // console.log("list", list, fieldIndex, fieldName);
                if (!list) {
                    list = [];
                    newItem[fieldName] = list;
                }
                if (value) list.push(value);
            }
        }
        return newItem;
    });
    // console.log("processCSVContentsForQuestionnaire headerAndItems", headerAndItems);
    
    var shortName = prompt("Please enter a short name for a new story form.");
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
    // console.log("storyFormListIdentifier");
 
    // TODO: Generalize random uuid function to take class name
    // TODO: Maybe rename quesitonForm_ to storyForm_ ?

    var template = {
        id: generateRandomUuid("StoryForm"),
        questionForm_shortName: shortName,
        questionForm_elicitingQuestions: project.tripleStore.newIdForSet("ElicitingQuestionChoiceSet"),
        questionForm_storyQuestions: project.tripleStore.newIdForSet("StoryQuestionChoiceSet"),
        questionForm_participantQuestions: project.tripleStore.newIdForSet("ParticipantQuestionChoiceSet")
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
        } else if (about === "ignore") {
            // Ignore value so do nothing
        } else {
            console.log("Error: unexpected About type of", about);
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

function ensureQuestionExists(question, questionCategory: string) {
    var idAccessor = questionCategory + "_shortName";
    var existingQuestionsInCategory = project.questionsForCategory(questionCategory);
    var matchingQuestion = null;
    existingQuestionsInCategory.forEach((existingQuestion) => {
        if (existingQuestion[idAccessor] === question[idAccessor]) matchingQuestion = existingQuestion;
    });
    if (!matchingQuestion) {
        // console.log("adding question that does not exist yet", question, questionCategory); 
        project.addQuestionForCategory(question, questionCategory);
    } else {
        // TODO: What if questions with the same shortName but different options already exist?
        // TODO: Should check type as well
        if (matchingQuestion[questionCategory + "_options"] !== question[questionCategory + "_options"]) {
            console.log("IMPORT ISSUE: options don't match for questions", question, matchingQuestion);
            alert("Options do not match for existing question: " + question[idAccessor]);
        }
    } 

    return question[idAccessor];
}

function questionForItem(item, questionCategory) {
    var valueType = "string";
    var questionType = "text";
    var valueOptions;
    var answers = item["Answers"];
    
    var itemType = item["Type"].trim();
    if (itemType === "Single choice") {
        questionType = "select";
        valueOptions = answers;
    } else if (itemType === "Scale") {
        valueType = "number";
        questionType = "slider";
        valueOptions = [answers[0], answers[1]];
    } else if (itemType === "Multiple choice") {
        questionType = "checkboxes";
        valueOptions = item["Answers"];
    } else if (itemType === "Radiobuttons") {
        questionType = "radiobuttons";
        valueOptions = item["Answers"];
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
    
    return question;
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
    // console.log("line", line);
    var start = true;
    line.forEach(function (item) {
        // console.log("item", item);
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
    // console.log("exportStoryCollection", storyCollectionName);
    
    var currentQuestionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionName);
    if (!currentQuestionnaire) {
        alert("The story collection has not been initialized with a story form: " + storyCollectionName);
        return;
    }
    // console.log("currentQuestionnaire", currentQuestionnaire);
    
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
    // console.log("exportStoryCollection", storyCollectionName);
    
    var currentQuestionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionName);
    if (!currentQuestionnaire) {
        alert("The story collection has not been initialized with a story form: " + storyCollectionName);
        return;
    }

    var allStories = surveyCollection.getStoriesForStoryCollection(storyCollectionName, true);
    // console.log("allStories", allStories);
    
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
    
    var annotationQuestions = project.collectAllAnnotationQuestions();
    var adjustedAnnotationQuestions = questionnaireGeneration.convertEditorQuestions(annotationQuestions, "A_");
    headersForQuestions(adjustedAnnotationQuestions);
  
    // console.log("header1", header1);
    // console.log("header2", header2);
    
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
