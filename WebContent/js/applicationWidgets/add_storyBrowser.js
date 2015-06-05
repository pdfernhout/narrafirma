define([
    "dojo/_base/array",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "js/storyCardDisplay",
    "js/surveyCollection",
    "js/panelBuilder/standardWidgets/GridWithItemPanel",
    "js/panelBuilder/widgetSupport",
    "dijit/layout/ContentPane",
    "dojox/layout/TableContainer",
    "js/panelBuilder/valuePathResolver"
], function(
    array,
    domConstruct,
    lang,
    storyCardDisplay,
    surveyCollection,
    GridWithItemPanel,
    widgetSupport,
    ContentPane,
    TableContainer,
    valuePathResolver
){
    "use strict";
    
    // story browser support
    
    // TODO: Probably should make this a class
    
    function filterPaneQuestionChoiceChanged(filterPane, newValue) {
        // console.log("event", newValue);
        var question = null;
        
        var questions = filterPane.storyBrowserInstance.questions;
        for (var index = 0; index < questions.length; index++) {
            var questionToCheck = questions[index];
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
        
        var stories = filterPane.storyBrowserInstance.dataStore.data;
        var options = optionsFromQuestion(question, stories);
        widgetSupport.setOptionsInMultiSelect(filterPane.answersMultiSelect, options);
        setStoryListForCurrentFilters(filterPane.storyBrowserInstance);
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
            if (choice === undefined || choice === null || choice === "") {
                // Do not include "0" as unanswered
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
            // console.log("select", question, question.valueOptions);
            array.forEach(question.valueOptions, function(each) {
                // console.log("option", question.id, each);
                count = totals[each];
                if (!count) count = 0;
                options.push({label: each + " (" +  count + ")", value: each});
            });
        } else if (question.displayType === "radiobuttons") {
            // console.log("radiobuttons", question, question.valueOptions);
            array.forEach(question.valueOptions, function(each) {
                // console.log("option", question.id, each);
                count = totals[each];
                if (!count) count = 0;
                options.push({label: each + " (" +  count + ")", value: each});
            });
        } else if (question.displayType === "checkboxes") {
            // console.log("checkboxes", question, question.valueOptions);
            array.forEach(question.valueOptions, function(each) {
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
    
    function clearFilterPane(storyBrowserInstance, filterPane) {
        filterPane.questionSelect.set("value", null);
        setStoryListForCurrentFilters(storyBrowserInstance);
    }
    
    function createFilterPane(storyBrowserInstance, id, questions, stories, containerPane) {
        var contentPane = new ContentPane();
        
        containerPane.addChild(contentPane);
  
        var filterPane = {};
            
        // TODO: Translate
        contentPane.containerNode.appendChild(domConstruct.toDom('Filter by: '));
        
        var questionSelect = widgetSupport.newSelect(contentPane, []);
        // questionSelect.set("style", "width: 98%; max-width: 98%");
        // questionSelect.set("style", "min-width: 50%");
        
        // TODO: Translate
        var clearButton = widgetSupport.newButton(contentPane, "Clear", lang.partial(clearFilterPane, storyBrowserInstance, filterPane));
        // domStyle.set(clearButton.domNode, "float", "right");
        
        contentPane.containerNode.appendChild(domConstruct.toDom('<br>'));
        
        var answersMultiSelect = widgetSupport.newMultiSelect([]);
        contentPane.addChild(answersMultiSelect);
        
        var filterPane2 = {
            contentPane: contentPane,
            questionSelect: questionSelect,
            answersMultiSelect: answersMultiSelect,
            storyBrowserInstance: storyBrowserInstance
        };

        for (var key in filterPane2) filterPane[key] = filterPane2[key];
        
        questionSelect.on("change", lang.partial(filterPaneQuestionChoiceChanged, filterPane));
        answersMultiSelect.on("change", lang.partial(setStoryListForCurrentFilters, storyBrowserInstance)); 
        
        return filterPane;
    }
    
    function currentStoryCollectionChanged(storyBrowserInstance, fieldName, oldValue, storyCollectionIdentifier) {
        console.log("currentStoryCollectionChanged", storyBrowserInstance, fieldName, oldValue, storyCollectionIdentifier);
        
        storyBrowserInstance.currentQuestionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);
        console.log("storyBrowserInstance.currentQuestionnaire", storyBrowserInstance.currentQuestionnaire);
        
        // Update filters
        var questions = surveyCollection.collectQuestionsForQuestionnaire(storyBrowserInstance.currentQuestionnaire);
        storyBrowserInstance.questions = questions;
        console.log("currentStoryCollectionChanged", questions);
        
        var choices = surveyCollection.optionsForAllQuestions(questions);
        widgetSupport.updateSelectChoices(storyBrowserInstance.filter1.questionSelect, choices);
        widgetSupport.updateSelectChoices(storyBrowserInstance.filter2.questionSelect, choices);
        
        // TODO: What to do about current selection in these widgets?
        
        // Update item panel in grid
        var itemPanelSpecification = makeItemPanelSpecificationForQuestions(storyBrowserInstance, questions);
        storyBrowserInstance.storyList.changeItemPanelSpecification(itemPanelSpecification);
        
        // update all stories for the specific collection
        var allStories = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier);
        console.log("allStories", allStories);
        loadLatestStories(storyBrowserInstance, allStories);
        
        // TODO: Should close up open grid view
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
    
    function loadLatestStories(storyBrowserInstance, allStories) {
        // console.log("loadLatestStories", storyBrowserInstance, allStories);
        storyBrowserInstance.dataStore.setData(allStories);
        
        // Need to update choices in filters or clear them out
        filterPaneQuestionChoiceChanged(storyBrowserInstance.filter1, storyBrowserInstance.filter1.questionSelect.get("value"));
        filterPaneQuestionChoiceChanged(storyBrowserInstance.filter2, storyBrowserInstance.filter2.questionSelect.get("value"));
        
        setStoryListForCurrentFilters(storyBrowserInstance);
    }
    
    function buildStoryDisplayPanel(storyBrowserInstance, panelBuilder, contentPane, model) {
        var storyContent = storyCardDisplay.generateStoryCardContent(model, storyBrowserInstance.currentQuestionnaire, "includeElicitingQuestion");
        
        var storyPane = new ContentPane({
            content: storyContent           
        });
        storyPane.placeAt(contentPane);
    }
    
    function makeItemPanelSpecificationForQuestions(storyBrowserInstance, questions) {
        // TODO: add more participant and survey info, like timestamps and participant ID
        
        var itemPanelSpecification = {
             id: "storyBrowserQuestions",
             panelFields: questions,
             buildPanel: lang.partial(buildStoryDisplayPanel, storyBrowserInstance)
        };
        
        return itemPanelSpecification;
    }
    
    // TODO: Fix so the filters get updated as the story questions get changed
    function insertStoryBrowser(panelBuilder, pagePane, model, fieldSpecification) {
        var id = fieldSpecification.id;
        console.log("insertStoryBrowser start", id);
        
        var questions = [];

        var stories = [];
        
        // Store will modify underlying array
        var dataStore = GridWithItemPanel.newMemoryTrackableStore(stories, "_storyID");
        
        // console.log("insertStoryBrowser middle 1", id);
        
        var table = new TableContainer({
            cols: 2,
            showLabels: false,
            customClass: "storyFilterTable",
            spacing: 10
        });
        
        // console.log("insertStoryBrowser middle 2", id);
        
     // TODO: Probably should become a class
        var storyBrowserInstance = {
            dataStore: dataStore,
            filter1: null,
            filter2: null,
            storyList: null,
            questions: questions,
            currentQuestionnaire: null
        };
        
        // Get questionnaire for selected story collection
        // TODO: What if the value is an array of stories to display directly?
        var choiceModelAndField = valuePathResolver.resolveModelAndFieldForFieldSpecification(panelBuilder, model, fieldSpecification);
        console.log("choiceModelAndField", choiceModelAndField);
        var choiceModel = choiceModelAndField.model;
        var choiceField = choiceModelAndField.field; 
        var storyCollectionIdentifier = choiceModel.get(choiceField);
        
        var itemPanelSpecification = makeItemPanelSpecificationForQuestions(storyBrowserInstance, questions);
        
        storyBrowserInstance.filter1 = createFilterPane(storyBrowserInstance, id + "_1", questions, stories, table);
        storyBrowserInstance.filter2 = createFilterPane(storyBrowserInstance, id + "_2", questions, stories, table);

        // pagePane.containerNode.appendChild(domConstruct.toDom('<br>'));
        
        // table needs to be added to container after its children are added to it so that the layout will happen correctly, otherwise startup called too soon internally
        pagePane.addChild(table);
        
        // TODO: Probably should become a class
        
        // var filterButton = widgetSupport.newButton(pagePane, "#button_Filter|Filter", lang.partial(setStoryListForCurrentFilters, storyBrowserInstance));
        
        // console.log("insertStoryBrowser middle 3", id);
        
        // Only allow view button for stories
        var configuration = {viewButton: true, includeAllFields: ["__survey_storyName", "__survey_storyText"]};
        storyBrowserInstance.storyList = new GridWithItemPanel(panelBuilder, pagePane, id, dataStore, itemPanelSpecification, configuration, model);
        
        // TODO: var loadLatestStoriesFromServerSubscription = topic.subscribe("loadLatestStoriesFromServer", lang.partial(loadLatestStories, storyBrowserInstance));
        
        // TODO: Kludge to get this other previous created widget to destroy a subscription when the page is destroyed...
        // TODO: table.own(loadLatestStoriesFromServerSubscription);
        
        // TODO: Should also have some subscription about when the questionnaire itself changes
        var currentQuestionnaireSubscription = choiceModel.watch(choiceField, lang.partial(currentStoryCollectionChanged, storyBrowserInstance));
        
        // TODO: Kludge to get this other previous created widget to destroy a subscription when the page is destroyed...
        table.own(currentQuestionnaireSubscription);
        
        // console.log("filterButton", filterButton);
        
        // Setup current values
        currentStoryCollectionChanged(storyBrowserInstance, null, null, storyCollectionIdentifier);

        console.log("insertStoryBrowser finished");

        return storyBrowserInstance;
    }
    
    // TODO: The best argument for short variable names might be that "code is poetry", in that it is only suggestive of intent not precisely complete. Thinking about that as code seems just lots and lots and so on...
    
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
        console.log("Filtered results", filteredResults);
        // var newStore = GridWithItemPanel.newMemoryTrackableStore(filteredResults.data, "_storyID");
        storyBrowserInstance.storyList.dataStoreChanged(filteredResults);
        // console.log("finished setting list with newStore", newStore);
    }
    
    function add_storyBrowser(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var storyBrowserInstance = insertStoryBrowser(panelBuilder, questionContentPane, model, fieldSpecification);
        questionContentPane.resize();
        return storyBrowserInstance;
    }

    return add_storyBrowser;
});