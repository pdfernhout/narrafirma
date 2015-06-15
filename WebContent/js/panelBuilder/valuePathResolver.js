define(["require", "exports", "dojox/mvc/at"], function (require, exports, at) {
    "use strict";
    function resolveModelAndFieldForFieldSpecification(panelBuilder, model, fieldSpecification) {
        var valuePath = fieldSpecification.valuePath;
        if (!valuePath)
            valuePath = fieldSpecification.id;
        var dataModelAndField = resolveModelAndFieldForValuePath(panelBuilder, model, valuePath);
        return resolveModelAndFieldForValuePath(panelBuilder, model, valuePath);
    }
    exports.resolveModelAndFieldForFieldSpecification = resolveModelAndFieldForFieldSpecification;
    function resolveModelAndFieldForValuePath(panelBuilder, model, valuePath) {
        // Parse the dependency path
        var pathParts = valuePath.split("/");
        if (pathParts[0] === "") {
            model = panelBuilder[pathParts[1]];
            if (!model)
                throw new Error("model is null");
            pathParts.shift();
            pathParts.shift();
        }
        if (pathParts.length < 1)
            throw new Error("Incorrect dependency path specified: " + valuePath);
        while (pathParts.length > 1) {
            // TODO: Should ideally establish dependencies all along the line in case something along path changes
            model = model[pathParts[0]];
            if (!model)
                throw new Error("model is null while iterating");
            pathParts.shift();
        }
        var field = pathParts[0];
        return {
            model: model,
            field: field
        };
    }
    exports.resolveModelAndFieldForValuePath = resolveModelAndFieldForValuePath;
    function resolveValueForFieldSpecification(panelBuilder, model, fieldSpecification) {
        var modelAndField = resolveModelAndFieldForFieldSpecification(panelBuilder, model, fieldSpecification);
        return modelAndField.model.get(modelAndField.field);
    }
    exports.resolveValueForFieldSpecification = resolveValueForFieldSpecification;
    function resolveValueForValuePath(panelBuilder, model, valuePath) {
        var modelAndField = resolveModelAndFieldForValuePath(panelBuilder, model, valuePath);
        return modelAndField.model.get(modelAndField.field);
    }
    exports.resolveValueForValuePath = resolveValueForValuePath;
    function atPath(panelBuilder, model, valuePath) {
        var modelAndField = resolveModelAndFieldForValuePath(panelBuilder, model, valuePath);
        return at(modelAndField.model, modelAndField.field);
    }
    exports.atPath = atPath;
    function atFieldSpecification(panelBuilder, model, fieldSpecification) {
        var modelAndField = resolveModelAndFieldForFieldSpecification(panelBuilder, model, fieldSpecification);
        return at(modelAndField.model, modelAndField.field);
    }
    exports.atFieldSpecification = atFieldSpecification;
});
