define([
   "dojo/_base/declare"
], function (
   declare
) {
    "use strict";
    
    return declare([], {
        
        applicationFieldSpecifications: [],
    
        addFieldSpecifications: function(fieldSpecifications) {
            for (var i = 0; i < fieldSpecifications.length; i++) {
                var fieldSpecification = fieldSpecifications[i];
                this.applicationFieldSpecifications.push(fieldSpecification);
            }
        },
        
        // TODO: Optimize the lookup of questions for panels, and maybe others, by using a dictionary which caches a list
        
        initialDataForField: function(fieldSpecification) {
            var dataType = fieldSpecification.dataType;
            if (dataType === "string") return "";
            if (dataType === "array") return [];
            if (dataType === "dictionary") return {};
            if (dataType === "object") return {};
            if (dataType === "boolean") return false;
            throw new Error("Unsupported model field dataType: " + dataType);
        },
        
        buildModel: function(modelName) {
            var model = {__type: modelName};
            for (var i = 0; i < this.applicationFieldSpecifications.length; i++) {
                var fieldSpecification = this.applicationFieldSpecifications[i];
                if (fieldSpecification.model === modelName && fieldSpecification.dataType !== "none") {
                    model[fieldSpecification.id] = this.initialDataForField(fieldSpecification);
                }
            }
            console.log("buildModel", modelName, model);
            return model;
        },
        
        buildListOfPages: function() {
            var pages = [];
            for (var i = 0; i < this.applicationFieldSpecifications.length; i++) {
                var fieldSpecification = this.applicationFieldSpecifications[i];
                if (fieldSpecification.displayType === "page") {
                    pages.push(fieldSpecification);
                }
            }
            return pages;
        },
        
        buildListOfPanels: function() {
            var panels = [];
            for (var i = 0; i < this.applicationFieldSpecifications.length; i++) {
                var fieldSpecification = this.applicationFieldSpecifications[i];
                if (fieldSpecification.displayType === "page" || fieldSpecification.displayType === "panel" ) {
                    panels.push(fieldSpecification);
                }
            }
            return panels;
        },
        
        buildListOfQuestions: function() {
            var questions = [];
            for (var i = 0; i < this.applicationFieldSpecifications.length; i++) {
                var fieldSpecification = this.applicationFieldSpecifications[i];
                if (fieldSpecification.displayType !== "page" && fieldSpecification.displayType !== "panel" ) {
                    questions.push(fieldSpecification);
                }
            }
            return questions;
        },
        
        buildQuestionsForPanel: function(panelID) {
            var questions = [];
            for (var i = 0; i < this.applicationFieldSpecifications.length; i++) {
                var fieldSpecification = this.applicationFieldSpecifications[i];
                if (fieldSpecification.isHeader === undefined && fieldSpecification.displayPanel === panelID) {
                    questions.push(fieldSpecification);
                }
            }
            return questions;
        }
    });
});