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
        const panelSpecification = JSON.parse(panelSpecificationJSONText);
        this.addPanelSpecification(panelSpecification);
        return panelSpecification;
    }
    
    addPanelSpecification(panelSpecification) {
        // TODO: Maybe should copy panelSpecification to ensure it won't change if changed latar by caller?
        this.allPanels.push(panelSpecification);
        this.panelIDToPanelSpecificationMap[panelSpecification.id] = panelSpecification;
        
        if (panelSpecification.displayType === "page") {
            this.allPages.push(panelSpecification);
            this.pageIDToPageSpecificatiomMap[panelSpecification.id] = panelSpecification;
            
            if (!panelSpecification.isHeader) {
                const list = this.childPageIDListForHeaderID[this.lastHeader] || [];
                list.push(panelSpecification.id);
                this.childPageIDListForHeaderID[this.lastHeader] = list;
            } else {
                this.lastHeader = panelSpecification.id;
            }
        }
        
        const modelClass = panelSpecification.modelClass;
        if (modelClass) {
            let model = this.modelClassToModelFieldSpecificationsMap[modelClass];
            if (!model) {
                model = [];
                this.modelClassToModelFieldSpecificationsMap[modelClass] = model;
            }
        }
        
        for (let i = 0; i < panelSpecification.panelFields.length; i++) {
            const fieldSpecification = panelSpecification.panelFields[i];
            this.addFieldSpecification(modelClass, fieldSpecification);
        }
    }
    
    addFieldSpecification(modelClass, fieldSpecification) {
        const model = this.modelClassToModelFieldSpecificationsMap[modelClass];
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
        const valueType = fieldSpecification.valueType;
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
        const model = {__type: modelName};
        const modelFieldSpecifications = this.modelClassToModelFieldSpecificationsMap[modelName];
        if (!modelFieldSpecifications) {
            console.log("ERROR: No model defined for model name", modelName);
            throw new Error("No model defined for model name: " + modelName);
        }
        
        for (let i = 0; i < modelFieldSpecifications.length; i++) {
            const fieldSpecification = modelFieldSpecifications[i];
            if (!fieldSpecification.valueType) console.log("WARNING: Missing valueType for fieldSpecification", fieldSpecification);
            if (fieldSpecification.valueType && fieldSpecification.valueType !== "none") {
                model[fieldSpecification.id] = this.initialDataForField(fieldSpecification);
            }
        }
        return model;
    }
    
    // This ignores the model type for the page or panel and just puts all the model fields into the supplied model
    addFieldsToModel(model, fieldSpecifications) {
        for (let i = 0; i < fieldSpecifications.length; i++) {
            const fieldSpecification = fieldSpecifications[i];
            if (!fieldSpecification.valueType) console.log("WARNING: Missing valueType for fieldSpecification", fieldSpecification);
            if (fieldSpecification.valueType && fieldSpecification.valueType !== "none") {
                model[fieldSpecification.id] = this.initialDataForField(fieldSpecification);
            }
        }
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
