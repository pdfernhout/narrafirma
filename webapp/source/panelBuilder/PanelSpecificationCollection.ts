import kludgeForUseStrict = require("../kludgeForUseStrict");
"use strict";

class PanelSpecificationCollection {
    // TODO: Think about whether can refactor to remove need for allFieldSpecifications array and/or map
    // Keep all questions together for use by things like calculating derived values from options for quiz score results
    allFieldSpecifications = [];
    fieldIDToFieldSpecificationMap = {};
    
    allPanels = [];
    panelIDToPanelSpecificationMap = {};
    
    allPages = [];
    pageIDToPageSpecificatiomMap = {};
    
    childPageIDListForHeaderID = {};
    
    modelClassToModelFieldSpecificationsMap = {};
    
    // For use while building pages; this assumes pages are added in some linear order where headers are added before child pages
    lastHeader = null;

    // TODO: Maybe should remove this function? Currently only used by one test
    addPanelSpecificationFromJSONText(panelSpecificationJSONText) {
        var panelSpecification = JSON.parse(panelSpecificationJSONText);
        this.addPanelSpecification(panelSpecification);
        return panelSpecification;
    }
    
    addPanelSpecification(panelSpecification) {
        // console.log("addPanelSpecification", panelSpecification);
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
        
        // console.log("about to loop over panelFields", panelSpecification.panelFields.length);
        for (var i = 0; i < panelSpecification.panelFields.length; i++) {
            var fieldSpecification = panelSpecification.panelFields[i];
            // console.log("about to call addFieldSpecification", fieldSpecification);
            this.addFieldSpecification(modelClass, fieldSpecification);
            // console.log("done with call");
        }
    }
    
    addFieldSpecification(modelClass, fieldSpecification) {
        // console.log("addFieldSpecification called", modelClass, fieldSpecification);
        var model = this.modelClassToModelFieldSpecificationsMap[modelClass];
        // console.log("adding field specification", modelClass, fieldSpecification, model);
        // TODO: Is this modelClass line still needed?
        fieldSpecification.modelClass = modelClass;
        this.allFieldSpecifications.push(fieldSpecification);
        this.fieldIDToFieldSpecificationMap[fieldSpecification.id] = fieldSpecification;
        if (model) model.push(fieldSpecification);
    }
    
    addFieldSpecificationToPanelSpecification(panelSpecification, fieldSpecification) {
        panelSpecification.panelFields.push(fieldSpecification);
        // Assumes the model has already been created if needed when the panel was added
        this.addFieldSpecification(panelSpecification.modelClass, fieldSpecification);
    }
     
    initialDataForField(fieldSpecification) {
        var valueType = fieldSpecification.valueType;
        if (valueType === "string") return "";
        if (valueType === "array") return [];
        if (valueType === "dictionary") return {};
        if (valueType === "object") return {};
        if (valueType === "boolean") return false;
        if (valueType === "set") return {};
        console.log("ERROR: Unsupported model field valueType", valueType, fieldSpecification);
        throw new Error("Unsupported model field valueType: " + valueType + " for field: " + fieldSpecification.id);
    }
    
    // This builds a specific model based on the name of the model, using data from one or more pages or panels that define that model
    buildModel(modelName) {
        // console.log("buildModel request", modelName);
        var model = {__type: modelName};
        var modelFieldSpecifications = this.modelClassToModelFieldSpecificationsMap[modelName];
        if (!modelFieldSpecifications) {
            console.log("ERROR: No model defined for model name", modelName);
            throw new Error("No model defined for model name: " + modelName);
        }
        
        for (var i = 0; i < modelFieldSpecifications.length; i++) {
            var fieldSpecification = modelFieldSpecifications[i];
            if (!fieldSpecification.valueType) console.log("WARNING: Missing valueType for fieldSpecification", fieldSpecification);
            if (fieldSpecification.valueType && fieldSpecification.valueType !== "none") {
                model[fieldSpecification.id] = this.initialDataForField(fieldSpecification);
            }
        }
        // console.log("buildModel result", modelName, model);
        return model;
    }
    
    // This ignores the model type for the page or panel and just puts all the model fields into the supplied model
    addFieldsToModel(model, fieldSpecifications) {
        // console.log("addFieldsToModel request", fieldSpecifications);
    
        for (var i = 0; i < fieldSpecifications.length; i++) {
            var fieldSpecification = fieldSpecifications[i];
            if (!fieldSpecification.valueType) console.log("WARNING: Missing valueType for fieldSpecification", fieldSpecification);
            if (fieldSpecification.valueType && fieldSpecification.valueType !== "none") {
                model[fieldSpecification.id] = this.initialDataForField(fieldSpecification);
            }
        }
        // console.log("addFieldsToModel result", model);
        return model;
    }
    
    buildListOfPages() {
        return this.allPages;
    }
    
    buildListOfPanels() {
        return this.allPanels;
    }
    
    getPageSpecificationForPageID(pageID) {
        return this.pageIDToPageSpecificatiomMap[pageID];
    }
    
    getPanelSpecificationForPanelID(panelID) {
        return this.panelIDToPanelSpecificationMap[panelID];
    }
    
    getFieldSpecificationForFieldID(fieldID) {
        return this.fieldIDToFieldSpecificationMap[fieldID];
    }
    
    getChildPageIDListForHeaderID(fieldID) {
        return this.childPageIDListForHeaderID[fieldID];
    }
}

export = PanelSpecificationCollection;
