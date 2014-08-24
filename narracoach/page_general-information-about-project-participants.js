"use strict";

define([
    "narracoach/add_page",
    "dojo/_base/array",
    "dojo/dom-construct",
    "narracoach/question_editor"
], function(
    add_page,
    array,
    domConstruct,
    questionEditor
){
	
	// TODO: Translate
	var questions = [
		"#Position in community",
		"How much does the project depend on the participation of this group?",
		"How much authority, prestige, or power do these participants have in the community or organization?",
		"How much time and effort have these participants put into the community or organization?",
		"How long have these participants been part of the community or organization?",

		"#Personality / State of mind / Ability",
		"How much importance do these participants place on authority?",
		"What is the confidence level of the participants in this group?",
		"How much importance do the participants in this group place on succeeding?",
		"How large is the scope of responsibility held by these participants?",
		"How much time can the participants in this group give to the project?",
		"To what extent can these participants read and write?",
		"To what extent are these participants physically able to participate in the project?",
		"To what extent are these participants cognitively able to participate in the project?",
		"To what extent are these participants emotionally able to participate in the project?",

		"#Feelings about project",
		"How much do these participants know about the project?",
		"How much do these participants know about you?",
		"To what extent are these participants likely to care whether the project succeeds?",
		"To what extent are these participants likely to believe the project will succeed?",
		"To what extent do these participants have positive feelings about you?",
		"How similar in background and beliefs are these participants to you?",
		"To what extent are these participants likely to believe that sharing stories can lead to positive results?",

		"#Probable responses",
		"How likely are these participants to see the project as a test of their competence?",
		"How likely are these participants to see the project as an opportunity to air their grievances?",
		"How likely are these participants to see the project as an opportunity to promote themselves?",
		"How likely are these participants to see the project as a chance to reminisce?",
		"How likely are these participants to see the project as an opportunity to help create change?",

		"#With respect to the project topic",
		"How positive are the emotions of these participants with respect to the project's topic?",
		"To these participants, how emotionally sensitive is this topic?",
		"To these participants, how private is this topic?",
		"To these participants, how close to the surface are their feelings about this topic?",
		"For these participants, how long of a time period does the topic cover?",
		"How likely are these participants to feel proud and confident about this topic?",
		"How likely are these participants to feel insecure or defensive while being asked about this topic?",
		"How likely are these participants to feel afraid to speak out about this topic?",
		"How likely are these participants to feel hopeful about this topic?",
	];
	
	var question_participantType1 = {
	    id: "participantType1",
	    text: "What is a name for participant type 1?", // TODO: pdf not putting this into translation as it will change or go away later
	    type: "text",
	};
	
	var question_participantType2 = {
	    id: "participantType2",
	    text: "What is a name for participant type 2?", // TODO: pdf not putting this into translation as it will change or go away later
	    type: "text",
	};
	
	var question_participantType3 = {
	    id: "participantType3",
	    text: "What is a name for participant type 3?", // TODO: pdf not putting this into translation as it will change or go away later
	    type: "text",
	};

	var page_generalInformationAboutParticipants = {
		id: "page_generalInformationAboutProjectParticipants",
	    questions: [
	        question_participantType1,
	        question_participantType2,
	        question_participantType3
	    ],
	};
	
	function create_page(tabContainer) {
		var page = add_page.addPage(tabContainer, page_generalInformationAboutParticipants);
		console.log("page", page);
		console.log("arrary", array);
		
		var index = 0;
		array.forEach(questions, function(questionText) {
			console.log("question", questionText);
			if (questionText[0] == "#") {
				page.containerNode.appendChild(domConstruct.toDom("<br><b>" + questionText.substring(1) + "</b><br>"));
			} else {
				var question = {type: "select", options: "unknown\nlow\nmedium\nhigh\nmixed", text: questionText, id: "QP" + ++index};
				questionEditor.insertQuestionIntoDiv(question, page.containerNode);
			}
		});
	}
	
	return create_page;
	
});