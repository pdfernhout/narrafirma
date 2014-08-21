"use strict";

define([
     "narracoach/add_page"
], function(
     addPage
){
	
	var page_generalIntro = {
		id: "page_generalIntro",
	};
	
	function create_page_introduction(tabContainer) {
		addPage(tabContainer, page_generalIntro);
	}
	
	return create_page_introduction;
	
});