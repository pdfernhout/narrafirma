import kludgeForUseStrict = require("../kludgeForUseStrict");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import Globals = require("../Globals");

"use strict";

function add_storiesList(panelBuilder: PanelBuilder, model, fieldSpecification) {
    var prompt = panelBuilder.buildQuestionLabel(fieldSpecification);

    var tripleStore = Globals.project().tripleStore;

    // TODO: Generalize this so it can handle more complex value paths than just a project field name
    var storyIdentifierList = Globals.project().getListForField(fieldSpecification.valuePath);
    
    var storyNameField = "projectStory_name";
    var storyTextField = "projectStory_text";
   
    storyIdentifierList.sort(function(a, b) {
        var aName = tripleStore.queryLatestC(a, storyNameField) || "";
        var bName = tripleStore.queryLatestC(b, storyNameField) || "";
        return aName.localeCompare(bName);
    });
    
    return m("div.narrafirma-stories-list", [
        prompt,
       // m("div.narrafirma-stories-list-title", "Project stories:"),
        //m("br"),
        m("table", [
            m("tr", [m("th", "Story name"), m("th", "Story text")]),
            storyIdentifierList.map((storyIdentifier) => {
                // console.log("storyIdentifier", storyIdentifier);
                return [
                    m("tr"),
                    [m("td", tripleStore.queryLatestC(storyIdentifier, storyNameField)),
                    m("td", tripleStore.queryLatestC(storyIdentifier, storyTextField))]
                ];
            })
        ])
    ]);
}

export = add_storiesList;



