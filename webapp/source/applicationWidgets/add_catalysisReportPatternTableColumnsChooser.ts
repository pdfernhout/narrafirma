import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import Globals = require("../Globals");

"use strict";

function add_catalysisReportPatternTableColumnsChooser(panelBuilder: PanelBuilder, model, fieldSpecification) {
    var project = Globals.project();
    
    var catalysisReportIdentifier = Globals.clientState().catalysisReportIdentifier();
    if (!catalysisReportIdentifier) return m("div", "Please select a catalysis report");
    
    var prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
        
    var storageFunction = valuePathResolver.newValuePathForFieldSpecification(model, fieldSpecification);

    const allColumnIDs = {
        "patternName": true,
        "remarkable": true,
        "q1DisplayName": true,
        "q2DisplayName": true,
        "q3DisplayName": true,
        "graphType": true,
        "statsSummary": true,
        "observation": true,
        "strength": true,
        "interpretations": true,
    }

    const columnIDsToDisplayNamesMap = {
        "patternName": "Name -- appears on graph",
        "remarkable": "Remarkable? -- mark to keep track of progress",
        "q1DisplayName": "Q1 -- first question in pattern (use these to find particular questions)",
        "q2DisplayName": "Q2 -- second question in pattern",
        "q3DisplayName": "Q3 -- third question in pattern",
        "graphType": "Type -- of graph",
        "statsSummary": "Significance -- summary of test results",
        "observation": "Observations -- name(s) of observations(s) you wrote",
        "strength": "Strengths -- strong/medium/weak flag(s) you set to sort observations",
        "interpretations": "Interpretations -- perspectives you explained",
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
        return m("div", [
            m("input[type=checkbox]", {id: id, checked: isChecked(id), 
                style: "margin-left: 1.5em; margin-bottom: 0.3em",
                onchange: function(event) { isChecked(id, event.target.checked); }}),
            m("label", {"for": id}, aName),
            m("br")
        ]);
    }
    
    function selectAll() {
        storageFunction(allColumnIDs);
    }
    
    function clearAll() {
        storageFunction({});
    }

    const columnIDsToShow = project.tripleStore.queryLatestC(catalysisReportIdentifier, "columnIDsToShowInPatternsTable");
    const checkboxes = [];
    Object.keys(allColumnIDs).forEach(function(columnID) {
        let checkbox = buildQuestionCheckbox(columnIDsToDisplayNamesMap[columnID], columnID);
        checkboxes.push(checkbox);
    })

    // TODO: Translate

    return m("div.questionExternal", [prompt, m("div", checkboxes)]);
}



export = add_catalysisReportPatternTableColumnsChooser;
