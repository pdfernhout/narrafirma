define([
    "dojo/_base/array",
    "dojo/_base/connect",
    "js/domain",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "js/panelBuilder/translate",
    "js/panelBuilder/GridWithItemPanel",
    "js/panelBuilder/widgetSupport",
    "dijit/layout/ContentPane",
    "dstore/Memory",
    "dojo/Stateful",
    "dojox/layout/TableContainer",
    "dstore/Trackable"
], function(
    array,
    connect,
    domain,
    domConstruct,
    lang,
    translate,
    GridWithItemPanel,
    widgetSupport,
    ContentPane,
    Memory,
    Stateful,
    TableContainer,
    Trackable
){
    "use strict";
    
    // story browser support
    
    // From: http://stackoverflow.com/questions/12815892/how-to-debug-javascript-when-it-goes-into-infinite-loops-and-recursive-calls-in
    // TODO: IMPORTANT --- Temporary -- For development bug catching only -- REMOVE FOR PRODUCTION!!!!
    var calls = 0;
    function suspectToBeLoopingInfinitely() {
      calls += 1;
      console.log("==== calls", calls);
      if (calls > 100) {
          console.log("trying to start debugger");
          debugger;
          console.log("Did it halt?");
      }
    }
    
    function filterPaneQuestionChoiceChanged(filterPane, newValue) {
        suspectToBeLoopingInfinitely();
        
        // console.log("event", newValue);
        var question = null;
        for (var index = 0; index < filterPane.questions.length; index++) {
            var questionToCheck = filterPane.questions[index];
            if (questionToCheck.id === newValue) {
                question = questionToCheck;
                break;
            }
        }
        if (!question) {
            if (newValue) console.log("could not find question for id", newValue);
            widgetSupport.setOptionsInMultiSelect(filterPane.answersMultiSelect, []);
            return;
        }
        //console.log("question", question);
        var options = optionsFromQuestion(question, filterPane.stories);
        widgetSupport.setOptionsInMultiSelect(filterPane.answersMultiSelect, options);
    }
    
    // TODO: Translate
    var unansweredIndicator = "{Unanswered}";
        
    function optionsFromQuestion(question, stories) {
        // console.log("*** optionsFromQuestion", question, stories);
        // TODO: Translate text for options, at least booleans?
        var options = [];
        
        if (!question) return options;
        
        // Compute how many of each answer -- assumes typically less than 200-1000 stories
        var totals = {};
        array.forEach(stories, function(item) {
            // console.log("optionsFromQuestion item", item, question.id, item[question.id]);
            var choice = item[question.id];
            if (!choice) {
                // console.log("&&&& Undefined or empty choice", choice);
                choice = unansweredIndicator;
            }
            var oldValue;
            if (question.displayType === "checkboxes") {
                for (var key in choice) {
                    oldValue = totals[key];
                    if (!oldValue) oldValue = 0;
                    if (choice[key]) totals[key] = oldValue + 1; 
                }
            } else {
                oldValue = totals[choice];
                if (!oldValue) oldValue = 0;
                totals[choice] = oldValue + 1;
            }
        });
        
        var count;
        
        // TODO: Maybe should not add the unanswered indicator if zero?
        // Always add the unanswered indicator if not checkboxes or checkbox
        if (question.displayType !== "checkbox" && question.displayType !== "checkboxes") {
            count = totals[unansweredIndicator];
            if (!count) count = 0;
            options.push({label: unansweredIndicator + " (" +  count + ")", value: unansweredIndicator});
        }
        
        if (question.displayType === "select") {
            // console.log("select", question, question.dataOptions);
            array.forEach(question.dataOptions, function(each) {
                // console.log("option", question.id, each);
                count = totals[each];
                if (!count) count = 0;
                options.push({label: each + " (" +  count + ")", value: each});
            });
        } else if (question.displayType === "radiobuttons") {
            // console.log("radiobuttons", question, question.dataOptions);
            array.forEach(question.dataOptions, function(each) {
                // console.log("option", question.id, each);
                count = totals[each];
                if (!count) count = 0;
                options.push({label: each + " (" +  count + ")", value: each});
            });
        } else if (question.displayType === "checkboxes") {
            // console.log("checkboxes", question, question.dataOptions);
            array.forEach(question.dataOptions, function(each) {
                // console.log("option", question.id, each);
                count = totals[each];
                if (!count) count = 0;
                options.push({label: each + " (" +  count + ")", value: each});
            });
        } else if (question.displayType === "slider") {
            // console.log("slider", question, question.displayConfiguration);
            for (var sliderTick = 0; sliderTick <= 100; sliderTick++) {
                count = totals[sliderTick];
                if (!count) count = 0;
                options.push({label: sliderTick + " (" +  count + ")", value: sliderTick});
            }
        } else if (question.displayType === "boolean") {
            // console.log("boolean", question);
            // TODO; Not sure this will really be right with true/false as booleans instead of strings
            array.forEach(["yes", "no"], function(each) {
                // console.log("option", id, each);
                count = totals[each];
                if (!count) count = 0;
                options.push({label: each + " (" +  count + ")", value: each});
            });
        } else if (question.displayType === "checkbox") {
            // console.log("checkbox", question);
            // TODO; Not sure this will really be right with true/false as checkbox instead of strings
            array.forEach([true, false], function(each) {
                // console.log("option", id, each);
                count = totals[each];
                if (!count) count = 0;
                options.push({label: each + " (" +  count + ")", value: each});
            });
        } else if (question.displayType === "text") {
            for (var eachTotal in totals){
                if (totals.hasOwnProperty(eachTotal)) {
                    count = totals[eachTotal];
                    if (!count) count = 0;
                    options.push({label: eachTotal + " (" +  count + ")", value: eachTotal});                    
                }
            }
        } else {
            console.log("ERROR: question type not supported: ", question.displayType, question);
            options.push({label: "*ALL*" + " (" +  stories.length + ")", value: "*ALL*"});
        }
        return options;
    }
    
    function createFilterPane(id, questions, stories, containerPane) {
        var contentPane = new ContentPane({
            id: id + "_content",
            style: "width: 95%;"
            // doLayout: false
        });
        
        containerPane.addChild(contentPane);
         
        var questionSelect = widgetSupport.newSelect(contentPane, widgetSupport.optionsForAllQuestions(questions));
        questionSelect.set("style", "width: 98%; max-width: 98%");
        
        contentPane.containerNode.appendChild(domConstruct.toDom('<br>'));
        
        var answersMultiSelect = widgetSupport.newMultiSelect([]);
        contentPane.addChild(answersMultiSelect);
        
        var filterPane = {"contentPane": contentPane, "questionSelect": questionSelect, "answersMultiSelect": answersMultiSelect, "questions": questions, "stories": stories};

        questionSelect.on("change", lang.partial(filterPaneQuestionChoiceChanged, filterPane)); 

        return filterPane;
    }

    function questionsChanged(storyBrowser, questions) {
        // TODO: Should respond to the rest of the application changing the questions
    }
    
    function isMatch(story, questionChoice, selectedAnswerChoices) {
        // console.log("isMatch", questionChoice, selectedAnswerChoices);
        if (!questionChoice) return true;
        var questionAnswer = story[questionChoice];
        if (questionAnswer === undefined || questionAnswer === null || questionAnswer === "") {
            questionAnswer = unansweredIndicator;
        } else if (lang.isObject(questionAnswer)) {
            // checkboxes
            // console.log("checkboxes", questionAnswer);
            for (var key in questionAnswer) {
                if ((selectedAnswerChoices.indexOf(key) !== -1) && questionAnswer[key]) return true;
            }
            return false;
        }
        questionAnswer = "" + questionAnswer;
        // console.log("questionAnswer", questionAnswer);
        return selectedAnswerChoices.indexOf(questionAnswer) !== -1;
    }
    
    function loadLatestStoriesFromServerCallback(storyBrowserInstance, allStories) {
        // console.log("loadLatestStoriesFromServerCallback", storyBrowserInstance, allStories);
        storyBrowserInstance.dataStore.setData(allStories);
        setStoryListForCurrentFilters(storyBrowserInstance);
    }
    
    // TODO: Fix so the filters get updated as the story questions get changed
    function insertStoryBrowser(panelBuilder, pagePane, model, id) {
        console.log("insertStoryBrowser start", id);
        
        // TODO: Fix this show also handles participant questions somehow
        var questionnaire = domain.getCurrentQuestionnaire();
        var storyQuestions = questionnaire.storyQuestions;
        
        // TODO: What about idea of having IDs that go with eliciting questions so store reference to ID not text prompt?
        var elicitingQuestionPrompts = [];
        for (var elicitingQuestionIndex = 0; elicitingQuestionIndex < questionnaire.elicitingQuestions.length; elicitingQuestionIndex++) {
            var elicitingQuestionSpecification = questionnaire.elicitingQuestions[elicitingQuestionIndex];
            elicitingQuestionPrompts.push(elicitingQuestionSpecification.text);
        }
        
        // TODO: Remove redundancy
        var leadingStoryQuestions = [];
        leadingStoryQuestions.unshift({id: "__survey_" + "storyName", displayName: "Story Name", displayPrompt: "Please give your story a name", displayType: "text", dataOptions:[]});
        leadingStoryQuestions.unshift({id: "__survey_" + "storyText", displayName: "Story Text", displayPrompt: "Please enter your response to the question above in the space below", displayType: "textarea", dataOptions:[]});
        leadingStoryQuestions.unshift({id: "__survey_" + "elicitingQuestion", displayName: "Eliciting Question", displayPrompt: "Please choose a question you would like to respond to", displayType: "select", dataOptions: elicitingQuestionPrompts});

        // console.log("DEBUG questions used by story browser", questions);
               
        var questions = [].concat(leadingStoryQuestions, storyQuestions);
        questions.push({id: "__survey_" + "participantData", displayName: "Participant Data", displayPrompt: "---- participant data below ----", displayType: "header", dataOptions:[]});
        translate.addExtraTranslationsForQuestions(questions);
        
        translate.addExtraTranslationsForQuestions(questionnaire.participantQuestions);
        
        // TODO: add more participant and survey info, like timestamps and participant ID
        
        var itemPanelSpecification = {
             "id": "storyBrowserQuestions",
             "questions": questions,
             buildPanel: function (panelBuilder, contentPane, model) {
                 panelBuilder.addQuestions(questions, contentPane, model);
                 // TODO: Load correct participant data
                 
                 var participantID = model.get("_participantID");
                 var participantData = domain.getParticipantDataForParticipantID(participantID);
                 var participantDataModel = new Stateful(participantData);
                 panelBuilder.addQuestions(questionnaire.participantQuestions, contentPane, participantDataModel);
             }
        };

        var stories = domain.projectData.surveyResults.allStories;

        // Store will modify underlying array
        var dataStore = new Memory({
            data: stories,
            idProperty: "_storyID"
        });
        
        // console.log("insertStoryBrowser middle 1", id);
        
        var table = new TableContainer({
            id: id + "_table",
            cols: 2,
            showLabels: false,
            customClass: "storyFilterTable",
            style: "width: 98%;",
            spacing: 10
        });
        
        // console.log("insertStoryBrowser middle 2", id);
        
        var filter1 = createFilterPane(id + "_1", questions, stories, table);
        var filter2 = createFilterPane(id + "_2", questions, stories, table);

        // pagePane.containerNode.appendChild(domConstruct.toDom('<br>'));
        
        // table needs to be added to container after its children are added to it so that the layout will happen correctly, otherwise startup called too soon internally
        pagePane.addChild(table);
        
        // TODO: Probably should become a class
        var storyBrowserInstance = {
            dataStore: dataStore,
            filter1: filter1,
            filter2: filter2,
            storyList: null,
            subscription: null,
        };
        
        var filterButton = widgetSupport.newButton(pagePane, "#button_Filter", lang.partial(setStoryListForCurrentFilters, storyBrowserInstance));
        
        // console.log("insertStoryBrowser middle 3", id);
        
        // Only allow view button for stories
        var configuration = {viewButton: true, includeAllFields: true};
        storyBrowserInstance.storyList = new GridWithItemPanel(panelBuilder, pagePane, id, dataStore, itemPanelSpecification, configuration);
        
        // TODO: Need to unsubscribe when widget removed
        storyBrowserInstance.subscription = connect.subscribe("loadLatestStoriesFromServer", lang.partial(loadLatestStoriesFromServerCallback, storyBrowserInstance));
        
        console.log("insertStoryBrowser finished");
        
        return storyBrowserInstance;
    }
    
    function setStoryListForCurrentFilters(storyBrowserInstance) {
        // console.log("filter pressed", storyBrowserInstance);
        var question1Choice = storyBrowserInstance.filter1.questionSelect.get("value");
        var answers1Choices = storyBrowserInstance.filter1.answersMultiSelect.get("value");
        // console.log("question1", question1Choice, "answers1", answers1Choices);
        var question2Choice = storyBrowserInstance.filter2.questionSelect.get("value");
        var answers2Choices = storyBrowserInstance.filter2.answersMultiSelect.get("value");
        // console.log("question2", question2Choice, "answers2", answers2Choices);  
        var filterFunction = function (item) {
            var match1 = isMatch(item, question1Choice, answers1Choices);
            var match2 = isMatch(item, question2Choice, answers2Choices);
            return match1 && match2;
        };
        var filteredResults = storyBrowserInstance.dataStore.filter(filterFunction);
        // console.log("Filtered results", filteredResults);
        var newStore = Trackable.create(filteredResults);
        storyBrowserInstance.storyList.grid.set("collection", newStore);
        // console.log("finished setting list with newStore", newStore);
    }
    
    function add_storyBrowser(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var storyBrowserInstance = insertStoryBrowser(panelBuilder, questionContentPane, model, fieldSpecification.id);
        questionContentPane.resize();
        return storyBrowserInstance;
    }

    return add_storyBrowser;
});