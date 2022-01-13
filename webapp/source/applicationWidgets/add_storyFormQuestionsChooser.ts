import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import Globals = require("../Globals");
import standardWidgets = require("../panelBuilder/standardWidgets")

"use strict";

function add_storyFormQuestionsChooser(panelBuilder: PanelBuilder, model, fieldSpecification) {
    const project = Globals.project();
    if (!model || !project) return m("div");

    const storyForm = project.tripleStore.makeObject(model, true);
    if (!storyForm) return m("div");
    
    const prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
    const questionCategory = fieldSpecification.displayConfiguration.toLowerCase();

    /////////////////// left side - questions chosen for form
    // these are not questions; they are "QuestionChoice" objects 
    // with only two fields: elicitingQuestion, storyQuestion, or participantQuestion, and order

    const questionChoicesSelectBoxID = fieldSpecification.displayConfiguration + "_questions_chosen";
    let questionChoicesInForm = [];
    const setClassName = "questionForm_" + questionCategory + "Questions";
    let questionChoicesSetID = storyForm[setClassName];
    if (questionChoicesSetID) {
        const questionChoicesIDsList = project.tripleStore.getListForSetIdentifier(questionChoicesSetID);
        questionChoicesIDsList.forEach((id) => {
            const questionChoice = project.tripleStore.makeObject(id, true);
            questionChoice.id = id;
            questionChoicesInForm.push(questionChoice);
        });
    } else {
        questionChoicesSetID = project.tripleStore.newIdForSet(setClassName);
        project.tripleStore.addTriple(model, setClassName, questionChoicesSetID);
    }
    questionChoicesInForm.sort(function(a, b) {
        // in legacy data, the "order" field could have letters in it
        if (!isNaN(Number(a.order)) && !isNaN(Number(b.order))) {
            if (Number(a.order) < Number(b.order)) return -1;
            if (Number(a.order) > Number(b.order)) return 1;
            return 0;
        } else {
            if (a.order.toLowerCase() < b.order.toLowerCase()) return -1;
            if (a.order.toLowerCase() > b.order.toLowerCase()) return 1;
            return 0;
        }
    });

    // create mithril options for list box with question lookup ids
    const questionChoicesInFormSelectOptions = [];
    questionChoicesInForm.forEach((questionChoice, index) => {
        questionChoicesInFormSelectOptions.push(m("option", {value: questionChoice.id, selected: undefined}, questionChoice[questionCategory + "Question"]));
    });

    /////////////////// right side - questions available to choose
    // these are questions, not question choices

    const questionsCreatedSelectBoxID = fieldSpecification.displayConfiguration + "_questions_created";
    let createdQuestions = [];
    if (fieldSpecification.displayConfiguration === "Eliciting") {
        createdQuestions = project.collectAllElicitingQuestions();
    } else if (fieldSpecification.displayConfiguration === "Story") {
        createdQuestions = project.collectAllStoryQuestions();
    } else if (fieldSpecification.displayConfiguration === "Participant") {
        createdQuestions = project.collectAllParticipantQuestions();
    }

    // only display created questions that are not already in the form
    const createdQuestionsNotInForm = [];
    createdQuestions.forEach((createdQuestion) => {
        let questionIsAleadyInForm = false;
        questionChoicesInForm.forEach((questionChoice) => {
            if (questionChoice[questionCategory + "Question"] === createdQuestion[questionCategory + "Question_shortName"]) {
                questionIsAleadyInForm = true;
                return;
            }
        });
        if (!questionIsAleadyInForm) {
            createdQuestionsNotInForm.push(createdQuestion);
        }
    });

    // create mithril options for list box with question lookup ids
    const createdQuestionsNotInFormSelectOptions = [];
    createdQuestionsNotInForm.forEach((question) => {
        let name = question[questionCategory + "Question_shortName"];
        createdQuestionsNotInFormSelectOptions.push(m("option", {value: question.id, selected: undefined}, name));
    });

    // these up and down methods swap rather than set the "order" fields of the "QuestionChoice" objects
    // because in the past (before NF 1.5.0), the order was typed in by the user and could include letters

    function moveSelectedQuestionChoiceUp() {
        const element = <HTMLSelectElement>document.getElementById(questionChoicesSelectBoxID);
        if (!element || element.selectedIndex < 0) return;

        const selectedOption = element.options[element.selectedIndex];
        let optionAboveSelectedOption = undefined;
        if (element.selectedIndex > 0) {
            optionAboveSelectedOption = element.options[element.selectedIndex - 1];
        }
        if (!optionAboveSelectedOption) return;

        const selectedObject = project.tripleStore.makeObject(selectedOption.value, true);
        const objectAboveSelectedObject = project.tripleStore.makeObject(optionAboveSelectedOption.value, true);
        if (!selectedObject || !objectAboveSelectedObject) return;

        const oldSelectedObjectOrder = selectedObject.order;
        project.tripleStore.addTriple(selectedOption.value, "order", objectAboveSelectedObject.order); 
        project.tripleStore.addTriple(optionAboveSelectedOption.value, "order", oldSelectedObjectOrder); 

        if (element.selectedIndex > 0) element.selectedIndex--; 
    }

    function moveSelectedQuestionChoiceDown() {
        const element = <HTMLSelectElement>document.getElementById(questionChoicesSelectBoxID);
        if (!element || element.selectedIndex < 0) return;

        const selectedOption = element.options[element.selectedIndex];
        let optionBelowSelectedOption = undefined;
        if (element.selectedIndex < element.options.length - 1) {
            optionBelowSelectedOption = element.options[element.selectedIndex + 1];
        }
        if (!optionBelowSelectedOption) return;

        const selectedObject = project.tripleStore.makeObject(selectedOption.value, true);
        const objectBelowSelectedObject = project.tripleStore.makeObject(optionBelowSelectedOption.value, true);
        if (!selectedObject || !objectBelowSelectedObject) return;

        const oldSelectedObjectOrder = selectedObject.order;
        project.tripleStore.addTriple(selectedOption.value, "order", objectBelowSelectedObject.order); 
        project.tripleStore.addTriple(optionBelowSelectedOption.value, "order", oldSelectedObjectOrder); 

        if (element.selectedIndex < element.options.length - 1) element.selectedIndex++; 
    }

    function addSelectedQuestion () {

        function highestOrderInExistingQuestionChoices() {
            let highestOrder = 0;
            questionChoicesInForm.forEach((questionChoice) => {
                let orderAsNumber = 0;
                try {
                    orderAsNumber = Number(questionChoice.order);
                } catch(err) {
                    orderAsNumber = 0;
                }
                if (orderAsNumber > highestOrder) {
                    highestOrder = orderAsNumber;
                }
            });
            return highestOrder;
        }

        const element = <HTMLSelectElement>document.getElementById(questionsCreatedSelectBoxID);
        if (!element || element.selectedIndex < 0) return;
        const selectedOption = element.options[element.selectedIndex];
        const newOrder = highestOrderInExistingQuestionChoices() + 1;

        const template = {"order": newOrder};
        if (questionCategory === "eliciting") {
            template["elicitingQuestion"] = selectedOption.text;
        } else if (questionCategory === "story") {
            template["storyQuestion"] = selectedOption.text;
        } else if (questionCategory === "participant") {
            template["participantQuestion"] = selectedOption.text;
        }
        const itemClassName = fieldSpecification.displayConfiguration + "QuestionChoice";

        project.tripleStore.makeNewSetItem(questionChoicesSetID, itemClassName, template, "id");
    }

    function removeSelectedQuestionChoice() {
        const element = <HTMLSelectElement>document.getElementById(questionChoicesSelectBoxID);
        if (!element || element.selectedIndex < 0) return;
        const selectedOption = element.options[element.selectedIndex];
        project.tripleStore.deleteSetItem(questionChoicesSetID, selectedOption.value);
    }

    const columnTDs = [];
    
    // left side - questions in form
    columnTDs.push(m("td", {"class": "narrafirma-story-form-questions-chooser-table-td"}, m("fieldset", [
        m("div", fieldSpecification.displayConfiguration + " questions in this form"),
        m("select.narrafirma-story-form-questions-chooser-list", {size: 7, disabled: panelBuilder.readOnly, id: questionChoicesSelectBoxID}, questionChoicesInFormSelectOptions),
        m("br"),
        m("button", {id: "move" + questionCategory + "QuestionChoiceUp", disabled: panelBuilder.readOnly, onclick: moveSelectedQuestionChoiceUp}, "↑"),
        m("button", {id: "move" + questionCategory + "QuestionChoiceDown", disabled: panelBuilder.readOnly, onclick: moveSelectedQuestionChoiceDown}, "↓")
        ])));
    
    // add, remove buttons
    columnTDs.push(m("td", {"class": "narrafirma-story-form-questions-chooser-table-td-middle"}, [
        m("button", {style: "text-align: center", disabled: panelBuilder.readOnly, onclick: addSelectedQuestion}, "←"),
        m("br"),
        m("button", {style: "text-align: center", disabled: panelBuilder.readOnly, onclick: removeSelectedQuestionChoice}, "→")
    ]));

    // right side - questions created (that are not in the form)
    columnTDs.push(m("td", {"class": "narrafirma-story-form-questions-chooser-table-td"}, m("fieldset", [
        m("div", "Other " + fieldSpecification.displayConfiguration.toLowerCase() + " questions you have created"),
        m("select.narrafirma-story-form-questions-chooser-list", {size: 7, disabled: panelBuilder.readOnly, id: questionsCreatedSelectBoxID}, createdQuestionsNotInFormSelectOptions)
        ])));

    return m("div.questionExternal", [
        prompt, m("div", [m("table", {"class": "narrafirma-questions-chooser-table"}, m("tr", columnTDs))]),
    ]);
}



export = add_storyFormQuestionsChooser;
