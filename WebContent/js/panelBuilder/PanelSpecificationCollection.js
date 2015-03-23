define([
], function (
) {
    "use strict";
    
    function PanelSpecificationCollection() {
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
    
    // TODO: Maybe should remove this function? Currently only used by one test
    PanelSpecificationCollection.prototype.addPanelSpecificationFromJSONText = function(panelSpecificationJSONText) {
        var panelSpecification = JSON.parse(panelSpecificationJSONText);
        this.addPanelSpecification(panelSpecification);
        return panelSpecification;
    };
    
    PanelSpecificationCollection.prototype.addPanelSpecification = function(panelSpecification) {
        // TODO: Maybe should copy panelSpecification to ensure it won't change if changed latar by caller?
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
        
        var modelClass = panelSpecification.modelClass;
        if (modelClass) {
            var model = this.modelClassToModelFieldSpecificationsMap[modelClass];
            if (!model) {
                model = [];
                this.modelClassToModelFieldSpecificationsMap[modelClass] = model;
            }
        }
        
        for (var i = 0; i < panelSpecification.panelFields.length; i++) {
            var fieldSpecification = panelSpecification.panelFields[i];
            this.addFieldSpecification(modelClass, fieldSpecification);
        }
    };
    
    PanelSpecificationCollection.prototype.addFieldSpecification = function(modelClass, fieldSpecification) {
        // console.log("adding field specification", fieldSpecification);
        var model = this.modelClassToModelFieldSpecificationsMap[modelClass];
        // TODO: Is this modelClass line still needed?
        fieldSpecification.modelClass = modelClass;
        this.allFieldSpecifications.push(fieldSpecification);
        this.fieldIDToFieldSpecificationMap[fieldSpecification.id] = fieldSpecification;
        if (model) model.push(fieldSpecification);
    };
    
    PanelSpecificationCollection.prototype.addFieldSpecificationToPanelSpecification = function(panelSpecification, fieldSpecification) {
        panelSpecification.panelFields.push(fieldSpecification);
        // Assumes the model has already been created if needed when the panel was added
        this.addFieldSpecification(panelSpecification.modelClass, fieldSpecification);
    };
     
    PanelSpecificationCollection.prototype.initialDataForField = function(fieldSpecification) {
        var dataType = fieldSpecification.dataType;
        if (dataType === "string") return "";
        if (dataType === "array") return [];
        if (dataType === "dictionary") return {};
        if (dataType === "object") return {};
        if (dataType === "boolean") return false;
        throw new Error("Unsupported model field dataType: " + dataType);
    };

    PanelSpecificationCollection.prototype.buildModel = function(modelName) {
        var model = {__type: modelName};
        var modelFieldSpecifications = this.modelClassToModelFieldSpecificationsMap[modelName];
        if (!modelFieldSpecifications) {
            console.log("ERROR: No model defined for model name", modelName);
            throw new Error("No model defined for model name: " + modelName);
        }
        
        for (var i = 0; i < modelFieldSpecifications.length; i++) {
            var fieldSpecification = modelFieldSpecifications[i];
            if (fieldSpecification.dataType !== "none") {
                model[fieldSpecification.id] = this.initialDataForField(fieldSpecification);
            }
        }
        console.log("buildModel", modelName, model);
        return model;
    };
    
    PanelSpecificationCollection.prototype.buildListOfPages = function() {
        return this.allPages;
    };
    
    PanelSpecificationCollection.prototype.buildListOfPanels = function() {
        return this.allPanels;
    };
    
    PanelSpecificationCollection.prototype.getPageSpecificationForPageID = function(pageID) {
        return this.pageIDToPageSpecificatiomMap[pageID];
    };
    
    PanelSpecificationCollection.prototype.getPanelSpecificationForPanelID = function(panelID) {
        return this.panelIDToPanelSpecificationMap[panelID];
    };
    
    PanelSpecificationCollection.prototype.getFieldSpecificationForFieldID = function(fieldID) {
        return this.fieldIDToFieldSpecificationMap[fieldID];
    };
    
    // TODO: This is needed in one place in main.js; could the architecture be refactored further to remove that need?
    // Note that questions added this way don't belong to a specific panel.
    // Note that fieldSpecifications added this way also will not be included in models
    PanelSpecificationCollection.prototype.addFieldSpecification = function(fieldSpecification) {
        this.allFieldSpecifications.push(fieldSpecification);
        this.fieldIDToFieldSpecificationMap[fieldSpecification.id] = fieldSpecification;
    };
    
    PanelSpecificationCollection.prototype.getChildPageIDListForHeaderID = function(fieldID) {
        return this.childPageIDListForHeaderID[fieldID];
    };
    
    return PanelSpecificationCollection;
});