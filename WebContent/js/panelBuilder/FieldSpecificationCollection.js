define([
], function (
) {
    "use strict";
    
    function isPanel(fieldSpecification) {
        return fieldSpecification.displayType === "page" || fieldSpecification.displayType === "panel" ;
    }
    
    function FieldSpecifications() {
        // TODO: Think about whether can refactor to remove need for allFieldSpecifications array and/or map
        // Keep all questions together for use by things like calculating derived values from options for quiz score results
        this.allFieldSpecifications = [];
        this.fieldIDToFieldSpecificationMap = {};
        
        this.allPanels = [];
        this.panelIDToPanelSpecificationMap = {};
        
        this.allPages = [];
        this.pageIDToPageSpecificatiomMap = {};
        
        this.childPageIDListForHeaderID = {};
        
        this.modelClassToModelFieldSpecificationsMap = {};
        
        // For use while building pages; this assumes pages are added in some linear order where headers are added before child pages
        this.lastHeader = null;
    }
    
    FieldSpecifications.prototype.addPanelWithFieldsFromJSONText = function(panelSpecificationJSONText) {
        var panelSpecification = JSON.parse(panelSpecificationJSONText);
        var displayPanel;
        
        this.allPanels.push(panelSpecification);
        this.panelIDToPanelSpecificationMap[panelSpecification.id] = panelSpecification;
        
        if (panelSpecification.displayType === "page") {
            this.allPages.push(panelSpecification);
            this.pageIDToPageSpecificatiomMap[panelSpecification.id] = panelSpecification;
            
            if (!panelSpecification.isHeader) {
                var list = this.childPageIDListForHeaderID[this.lastHeader] || [];
                list.push(panelSpecification.id);
                this.childPageIDListForHeaderID[this.lastHeader] = list;
            } else {
                this.lastHeader = panelSpecification.id;
            }
        }
        
        var model;
        var modelClass = panelSpecification.modelClass;
        if (modelClass) {
            model = this.modelClassToModelFieldSpecificationsMap[modelClass];
            if (!model) {
                model = [];
                this.modelClassToModelFieldSpecificationsMap[modelClass] = model;
            }
        }
        
        for (var i = 0; i < panelSpecification.panelFields.length; i++) {
            var fieldSpecification = panelSpecification.panelFields[i];
            // TODO: Is the first or even second of these lines still needed?
            fieldSpecification.displayPanel = panelSpecification.displayPanel;
            fieldSpecification.modelClass = modelClass;
            this.allFieldSpecifications.push(fieldSpecification);
            this.fieldIDToFieldSpecificationMap[fieldSpecification.id] = fieldSpecification;
            if (model) model.push(fieldSpecification);
            // console.log("adding field specification", fieldSpecification);
        }
    };
     
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
        var modelFieldSpecifications = this.modelClassToModelFieldSpecificationsMap[modelName];
        
        for (var i = 0; i < modelFieldSpecifications.length; i++) {
            var fieldSpecification = modelFieldSpecifications[i];
            if (!isPanel(fieldSpecification) && fieldSpecification.modelClass === modelName && fieldSpecification.dataType !== "none") {
                model[fieldSpecification.id] = this.initialDataForField(fieldSpecification);
            }
        }
        console.log("buildModel", modelName, model);
        return model;
    };
    
    FieldSpecifications.prototype.buildListOfPages = function() {
        return this.allPages;
    };
    
    FieldSpecifications.prototype.buildListOfPanels = function() {
        return this.allPanels;
    };
    
    FieldSpecifications.prototype.buildListOfQuestions = function() {
        return this.allFieldSpecifications;
    };
    
    FieldSpecifications.prototype.getPageSpecificationForPageID = function(pageID) {
        return this.pageIDToPageSpecificatiomMap[pageID];
    };
    
    FieldSpecifications.prototype.getPanelSpecificationForPanelID = function(panelID) {
        return this.panelIDToPanelSpecificationMap[panelID];
    };
    
    FieldSpecifications.prototype.getFieldSpecificationForFieldID = function(fieldID) {
        return this.fieldIDToFieldSpecificationMap[fieldID];
    };
    
    // TODO: This is needed in one place in main.js; could the architecture be refactored further to remove that need?
    // Note that questions added this way don't belong to a specific panel.
    FieldSpecifications.prototype.addFieldSpecification = function(fieldSpecification) {
        this.allFieldSpecifications.push(fieldSpecification);
        this.fieldIDToFieldSpecificationMap[fieldSpecification.id] = fieldSpecification;
    };
    
    FieldSpecifications.prototype.getChildPageIDListForHeaderID = function(fieldID) {
        return this.childPageIDListForHeaderID[fieldID];
    };
    
    return FieldSpecifications;
});