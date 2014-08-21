define([
    "dojo/dom-construct",
    "narracoach/question_editor",
    "narracoach/translate",
    "dijit/layout/ContentPane"
    ], function(
        domConstruct,
        question_editor,
        translate,
        ContentPane
    ){
    
	function addPage(tabContainer, page) {
        var pageTitle = translate(page.id + "_title");
        if (!pageTitle) {
            var errorMessage = "ERROR: No page title for " + page.id;
            console.log(errorMessage);
            pageTitle = errorMessage;
        }
        
        var pagePane = new ContentPane({
            title: pageTitle,
            style: "width: 100%"
       });

       var pageText = translate(page.id + "_text");
                                
       if (pageText) {
           pagePane.containerNode.appendChild(domConstruct.toDom(pageText));
           pagePane.containerNode.appendChild(domConstruct.toDom("<br><br>"));
       }

       if (page.questions) {
           console.log("questions for page", page.id);
           question_editor.insertQuestionsIntoDiv(page.questions, pagePane.containerNode);
       }
   
       tabContainer.addChild(pagePane); 
       pagePane.startup();
    }
    
	return addPage;
});