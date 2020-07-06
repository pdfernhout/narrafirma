import kludgeForUseStrict = require("../kludgeForUseStrict");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import Globals = require("../Globals");

"use strict";

function add_storiesList(panelBuilder: PanelBuilder, model, fieldSpecification) {
    const prompt = panelBuilder.buildQuestionLabel(fieldSpecification);

    const tripleStore = Globals.project().tripleStore;

    // TODO: Generalize this so it can handle more complex value paths than just a project field name
    const storyIdentifierList = Globals.project().getListForField(fieldSpecification.valuePath);
    
    const storyNameField = "projectStory_name";
    const storyTextField = "projectStory_text";
   
    storyIdentifierList.sort(function(a, b) {
        const aName = tripleStore.queryLatestC(a, storyNameField) || "";
        const bName = tripleStore.queryLatestC(b, storyNameField) || "";
        return aName.localeCompare(bName);
    });
    
    return m("div.narrafirma-stories-list", [
        prompt,
       // m("div.narrafirma-stories-list-title", "Project stories:"),
        //m("br"),
        m("table", [
            m("tr", [m("th", "Story name"), m("th", "Story text")]),
            storyIdentifierList.map((storyIdentifier) => {
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



