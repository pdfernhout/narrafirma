"use strict";

define([
     "narracoach/add_page"
], function(
     add_page
){
	
	var page_generalIntro = {
		id: "page_generalIntro",
	};
	
	function create_page(tabContainer) {
		add_page.addPage(tabContainer, page_generalIntro);
	}
	
	return create_page;
	
});