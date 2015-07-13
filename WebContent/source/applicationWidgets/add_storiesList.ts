import kludgeForUseStrict = require("../kludgeForUseStrict");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");

"use strict";

function add_storiesList(panelBuilder: PanelBuilder, model, fieldSpecification) {
    var prompt = panelBuilder.buildQuestionLabel(fieldSpecification);

    var tripleStore = panelBuilder.project.tripleStore;

    // TODO: Generalize this so it can be abut more than just project stories
    var storyIdentifierList = panelBuilder.project.getListForField("project_projectStoriesList");
    var storyNameField = "projectStory_name";
    var storyTextField = "projectStory_text";
   
    storyIdentifierList.sort(function(a, b) {
        var aName = tripleStore.queryLatestC(a, storyNameField) || "";
        var bName = tripleStore.queryLatestC(b, storyNameField) || "";
        return aName.localeCompare(bName);
    });
    
    return m("div.narrafirma-stories-list", [
        prompt,
        m("i", "Project stories:"),
        m("br"),
        m("table", [
            m("tr", [m("th", "Story name"), m("th", "Story text")]),
            storyIdentifierList.map((storyIdentifier) => {
                console.log("storyIdentifier", storyIdentifier);
                return [
                    m("td", tripleStore.queryLatestC(storyIdentifier, storyNameField)),
                    m("td", tripleStore.queryLatestC(storyIdentifier, storyTextField))
                ];
            })
        ])
    ]);
}

export = add_storiesList;



