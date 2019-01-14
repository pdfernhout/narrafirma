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
        "bar graphs": true,
        "histograms": true,
        "tables": true,
        "multiple histograms": true,
        "scatterplots": true,
        "contingency-histogram tables": true,
        "multiple scatterplots": true,
        "data integrity graphs": true,
        "texts": true,
    }
    
    var graphTypesToDisplayNamesMap = {
        "bar graphs": "choices (bar graphs)",
        "histograms": "scales (histograms)",
        "tables": "choice x choice combinations (contingency tables)",
        "multiple histograms": "scale x choice combinations (side-by-side histograms)",
        "scatterplots": "scale x scale combinations (scatterplots)",
        "contingency-histogram tables": "choice x choice x scale combinations (contingency-histogram tables)",
        "multiple scatterplots": "scale x scale x choice combinations (side-by-side scatterplots)",
        "data integrity graphs": "data integrity graphs",
        "texts": "texts",
    }
    
    function isChecked(shortName, value = undefined) {
        var map = storageFunction() || {};
        if (value === undefined) {
            return !!map[shortName];
        }
        map[shortName] = !!value;
        storageFunction(map);
    }
    
    function buildQuestionCheckbox(aName, id): any {
        const spaceAfter = [
            "scales (histograms)", 
            "scale x scale combinations (scatterplots)",
            "scale x scale x choice combinations (side-by-side scatterplots)"
        ].indexOf(aName) >= 0;
        
        return m("div", [
            m("input[type=checkbox]", {id: id, checked: isChecked(id), onchange: function(event) { isChecked(id, event.target.checked); }}),
            m("label", {"for": id}, aName),
            m("br"),
            spaceAfter ? m("br") : ""
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
                return buildQuestionCheckbox(graphTypesToDisplayNamesMap[graphType], graphType);
            }),
        ]),
    m("br"),
    m("button", { onclick: selectAll }, "Select all"),
    m("button", { onclick: clearAll }, "Clear all"),
    m("br"),
    m("p[style=margin-left:1em]", "Tip: If the Explore patterns page loads slowly, choose only some graph types and/or questions here.")
    ]);
}

export = add_catalysisReportGraphTypesChooser;
