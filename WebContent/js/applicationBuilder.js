define(["js/applicationFields"], function (applicationFields) {
    "use strict";
    
    function initialDataForField(fieldSpecification) {
        var dataType = fieldSpecification.dataType;
        if (dataType === "string") return "";
        if (dataType === "array") return [];
        if (dataType === "dictionary") return {};
        if (dataType === "object") return {};
        if (dataType === "boolean") return false;
        throw new Error("Unsupported model field dataType: " + dataType);
    }
    
    function buildModel(modelName) {
        var model = {__type: modelName};
        for (var i = 0; i < applicationFields.length; i++) {
            var fieldSpecification = applicationFields[i];
            if (fieldSpecification.model === modelName && fieldSpecification.dataType !== "none") {
                model[fieldSpecification.id] = initialDataForField(fieldSpecification);
            }
        }
        console.log("buildModel", modelName, model);
        return model;
    }
    
    function buildListOfPages() {
        var pages = [];
        for (var i = 0; i < applicationFields.length; i++) {
            var fieldSpecification = applicationFields[i];
            if (fieldSpecification.displayType === "page") {
                pages.push(fieldSpecification);
            }
        }
        return pages;
    }
    
    function buildListOfPanels() {
        var panels = [];
        for (var i = 0; i < applicationFields.length; i++) {
            var fieldSpecification = applicationFields[i];
            if (fieldSpecification.displayType === "page" || fieldSpecification.displayType === "popup" ) {
                panels.push(fieldSpecification);
            }
        }
        return panels;
    }
    
    function buildQuestionsForPanel(panelID) {
        var questions = [];
        for (var i = 0; i < applicationFields.length; i++) {
            var fieldSpecification = applicationFields[i];
            if (fieldSpecification.isHeader === undefined && fieldSpecification.displayPanel === panelID) {
                // TODO: Temporary for testing with next two lines
                fieldSpecification.type = fieldSpecification.displayType;
                if (!fieldSpecification.options) {
                    var options = [];
                    if (fieldSpecification.displayConfiguration) {
                        options.push(fieldSpecification.displayConfiguration);
                    }
                    fieldSpecification.options = options;
                }
                questions.push(fieldSpecification);
            }
        }
        return questions;
    }
    
    return {
        buildModel: buildModel,
        buildListOfPages: buildListOfPages,
        buildListOfPanels: buildListOfPanels,
        buildQuestionsForPanel: buildQuestionsForPanel
    };
});