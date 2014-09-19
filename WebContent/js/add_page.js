"use strict";

define([
    "dojo/dom-construct",
    "js/question_editor",
    "js/translate",
    "dijit/layout/ContentPane"
], function(
    domConstruct,
    questionEditor,
    translate,
    ContentPane
){
    
    function addPageContents(node, page) {
       var pageText = translate(page.id + "_text", "");
                                
       if (pageText) {
           node.appendChild(domConstruct.toDom(pageText));
           node.appendChild(domConstruct.toDom("<br><br>"));
       }

       if (page.questions) {
           console.log("questions for page", page.id, questionEditor);
           questionEditor.insertQuestionsIntoDiv(page.questions, node);
       }
    }
    
    // TODO: Maybe should split this up so adding to tabContainer done in seperate function
    // TODO: so can be called to start page as for general info about participtants?
    function addPage(tabContainer, page, delayPageStartup) {
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

       addPageContents(pagePane.containerNode, page);
   
       tabContainer.addChild(pagePane); 
       if (delayPageStartup !== true) pagePane.startup();
       
       return pagePane;
    }
    
    return {
        "addPage": addPage,
        "addPageContents": addPageContents
    };
});