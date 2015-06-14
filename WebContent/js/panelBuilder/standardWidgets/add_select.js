define([
    "dojo/_base/array",
    "dijit/form/FilteringSelect",
    "dojo/store/Memory",
    "../translate",
    "../valuePathResolver"
], function (array, FilteringSelect, Memory, translate, valuePathResolver) {
    "use strict";
    function add_select(panelBuilder, contentPane, model, fieldSpecification, addNoSelectionOption) {
        // console.log("add_select", fieldSpecification.id, model, fieldSpecification);
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        var dataStore = new Memory({ "data": [] });
        var select = new FilteringSelect({
            store: dataStore,
            searchAttr: "name",
            // TODO: Work on validation...
            required: false,
            // style: "width: 100%"
            value: valuePathResolver.atFieldSpecification(panelBuilder, model, fieldSpecification)
        });
        console.log("Select", fieldSpecification);
        var readOnly = fieldSpecification.displayReadOnly || false;
        if (readOnly || (fieldSpecification.valueImmutable && valuePathResolver.resolveValueForFieldSpecification(panelBuilder, model, fieldSpecification))) {
            select.attr("readOnly", true);
            select.attr("disabled", true);
        }
        var specifiedChoices = fieldSpecification.valueOptions;
        var choices = specifiedChoices;
        if (_.isString(specifiedChoices)) {
            var choicesModelAndField = valuePathResolver.resolveModelAndFieldForValuePath(panelBuilder, model, specifiedChoices);
            console.log("choicesModelAndField", choicesModelAndField);
            var choicesModel = choicesModelAndField.model;
            var choicesField = choicesModelAndField.field;
            choices = choicesModel.get(choicesField);
            // Need to track when choices change; problematical if array?
            var subscription = choicesModel.watch(specifiedChoices, function (name, oldChoices, newChoices) {
                // console.log("name, oldChoices, newChoices", name, oldChoices, JSON.stringify(newChoices, null, 4));
                // Should validate that the current choice is still acceptable -- although that would entail then changing the data
                var currentValue = choicesModel.get(fieldSpecification.id);
                // console.log("currentValue", currentValue, fieldSpecification, choicesModel);
                var isValueInChoices = updateChoices(newChoices, choicesModel.get(fieldSpecification.id));
                // console.log("isValueInChoices", isValueInChoices);
                if (!isValueInChoices) {
                    console.log("Selected value no longer in specified choices", currentValue, choices);
                }
            });
            select.own(subscription);
        }
        if (choices) {
            updateChoices(choices, model.get(fieldSpecification.id));
        }
        else {
            console.log("No choices or options defined for select", fieldSpecification.id);
        }
        function updateChoices(choices, currentValue) {
            var options = [];
            if (addNoSelectionOption)
                options.push({ name: translate("#selection_has_not_been_made|(no selection)"), id: "", selected: true });
            var isValueInChoices = false;
            array.forEach(choices, function (each) {
                var label;
                var value;
                // console.log("choice", id, each);
                if (_.isString(each)) {
                    label = translate(fieldSpecification.id + "::selection:" + each, each);
                    options.push({ name: label, id: each });
                    if (currentValue === each)
                        isValueInChoices = true;
                }
                else {
                    // TODO: Maybe bug in dojo select that it does not handle values that are not strings
                    // http://stackoverflow.com/questions/16205699/programatically-change-selected-option-of-a-dojo-form-select-that-is-populated-b
                    if (fieldSpecification.valueOptionsSubfield) {
                        value = each[fieldSpecification.valueOptionsSubfield];
                    }
                    else {
                        value = each.value;
                    }
                    if (fieldSpecification.displayDataOptionField) {
                        label = each[fieldSpecification.displayDataOptionField];
                    }
                    else {
                        label = value;
                    }
                    label = translate(fieldSpecification.id + "::selection:" + label, label);
                    options.push({ name: label, id: value });
                    if (currentValue === value)
                        isValueInChoices = true;
                }
            });
            dataStore.setData(options);
            // console.log("updateChoices", currentValue, isValueInChoices, (currentValue === null || currentValue === undefined || currentValue === ""));
            return isValueInChoices || (currentValue === null || currentValue === undefined || currentValue === "");
        }
        select.placeAt(questionContentPane);
        return select;
    }
    return add_select;
});
