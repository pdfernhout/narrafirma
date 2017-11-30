import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import Globals = require("../Globals");

"use strict";

function add_catalysisReportGraphTypesChooser(panelBuilder: PanelBuilder, model, fieldSpecification) {
    var project = Globals.project();
    
    var catalysisReportIdentifier = Globals.clientState().catalysisReportIdentifier();
    if (!catalysisReportIdentifier) return m("div", "Please select a catalysis report");
    
    var prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
        
    var storageFunction = valuePathResolver.newValuePathForFieldSpecification(model, fieldSpecification);

    var allGraphTypes = {
        "data integrity graphs": true,
        "texts": true,
        "bar graphs": true,
        "histograms": true,
        "tables": true,
        "multiple histograms": true,
        "scatterplots": true,
        "multiple scatterplots": true
    }
    
    function isChecked(shortName, value = undefined) {
        var map = storageFunction() || {};
        if (value === undefined) {
            return !!map[shortName];
        }
        map[shortName] = !!value;
        storageFunction(map);
    }
    
    function buildQuestionCheckbox(aName): any {
        var id = aName;
        
        return m("div", [
            m("input[type=checkbox]", {id: id, checked: isChecked(id), onchange: function(event) { isChecked(id, event.target.checked); }}),
            m("label", {"for": id}, aName),
            m("br")
        ]);
    }
    
    function selectAll() {
        storageFunction(allGraphTypes);
    }
    
    function clearAll() {
        storageFunction({});
    }

    var allGraphTypesAsArray = Object.keys(allGraphTypes);
    
    // TODO: Translate
    return m("div.questionExternal", [
        prompt,
        m("div", [
            m("br"),  
            allGraphTypesAsArray.map((graphType) => {
                return buildQuestionCheckbox(graphType);
            }),
        ]),
    m("br"),
    m("button", { onclick: selectAll }, "Select all"),
    m("button", { onclick: clearAll }, "Clear all"),
    m("br"),
    m("br")
    ]);
}

export = add_catalysisReportGraphTypesChooser;
