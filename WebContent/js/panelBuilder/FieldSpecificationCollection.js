define([
], function (
) {
    "use strict";
    
    function isPanel(fieldSpecification) {
        return fieldSpecification.displayType === "page" || fieldSpecification.displayType === "panel" ;
    }
    
    function FieldSpecifications() {
        this. applicationFieldSpecifications = [];
    }
    
    FieldSpecifications.prototype.addFieldSpecifications = function(fieldSpecifications) {
        var displayPanel;
        var modelClass; //  = "ProjectModel";
        for (var i = 0; i < fieldSpecifications.length; i++) {
            var fieldSpecification = fieldSpecifications[i];
            if (isPanel(fieldSpecification)) {
                displayPanel = fieldSpecification.id;
                modelClass = fieldSpecification.modelClass;
                fieldSpecification.displayPanel = displayPanel;
            } else {
                fieldSpecification.displayPanel = displayPanel;
                fieldSpecification.modelClass = modelClass;
            }
            this.applicationFieldSpecifications.push(fieldSpecification);
            // console.log("adding field specification", fieldSpecification);
        }
    };
        
    // TODO: Optimize the lookup of questions for panels, and maybe others, by using a dictionary which caches a list
        
    FieldSpecifications.prototype.initialDataForField = function(fieldSpecification) {
        var dataType = fieldSpecification.dataType;
        if (dataType === "string") return "";
        if (dataType === "array") return [];
        if (dataType === "dictionary") return {};
        if (dataType === "object") return {};
        if (dataType === "boolean") return false;
        throw new Error("Unsupported model field dataType: " + dataType);
    };

    FieldSpecifications.prototype.buildModel = function(modelName) {
        var model = {__type: modelName};
        for (var i = 0; i < this.applicationFieldSpecifications.length; i++) {
            var fieldSpecification = this.applicationFieldSpecifications[i];
            if (!isPanel(fieldSpecification) && fieldSpecification.modelClass === modelName && fieldSpecification.dataType !== "none") {
                model[fieldSpecification.id] = this.initialDataForField(fieldSpecification);
            }
        }
        console.log("buildModel", modelName, model);
        return model;
    };
    
    FieldSpecifications.prototype.buildListOfPages = function() {
        var pages = [];
        for (var i = 0; i < this.applicationFieldSpecifications.length; i++) {
            var fieldSpecification = this.applicationFieldSpecifications[i];
            if (fieldSpecification.displayType === "page") {
                pages.push(fieldSpecification);
            }
        }
        return pages;
    };
    
    FieldSpecifications.prototype.buildListOfPanels = function() {
        var panels = [];
        for (var i = 0; i < this.applicationFieldSpecifications.length; i++) {
            var fieldSpecification = this.applicationFieldSpecifications[i];
            if (isPanel(fieldSpecification)) {
                panels.push(fieldSpecification);
            }
        }
        return panels;
    };
    
    FieldSpecifications.prototype.buildListOfQuestions = function() {
        var questions = [];
        for (var i = 0; i < this.applicationFieldSpecifications.length; i++) {
            var fieldSpecification = this.applicationFieldSpecifications[i];
            if (!isPanel(fieldSpecification)) {
                questions.push(fieldSpecification);
            }
        }
        return questions;
    };
    
    FieldSpecifications.prototype.buildQuestionsForPanel = function(panelID) {
        var questions = [];
        for (var i = 0; i < this.applicationFieldSpecifications.length; i++) {
            var fieldSpecification = this.applicationFieldSpecifications[i];
            if (!isPanel(fieldSpecification) && fieldSpecification.displayPanel === panelID) {
                questions.push(fieldSpecification);
            }
        }
        // console.log("buildQuestionsForPanel", panelID, questions);
        return questions;
    };
    
    return FieldSpecifications;
});