"use strict";

define([
     "narracoach/add_page"
], function(
     addPage
){
	
	var question_storyList = {
	    id: "widget_storyList",
	    text: "Please add stories below", // cfk not putting this into translation as it will go away later
	    // type: "storyList",
	    type: "textarea",
	    options: "page_projectStoryEntry",
	};

	var page_projectStoriesIntro = {
	    id: "page_projectStoriesIntro",
	    // this page will list stories the user has entered
	    // on the story list widget will be an "add story" button (which will not be seen in other uses of the widget)
	    questions: [
	        question_storyList
	    ],
	};

	function create_page(tabContainer) {
		addPage(tabContainer, page_projectStoriesIntro);
	}
	
	return create_page;
	
});