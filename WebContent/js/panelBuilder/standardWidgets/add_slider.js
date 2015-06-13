define([
    "dojo/dom-construct",
    "dijit/form/HorizontalRule",
    "dijit/form/HorizontalRuleLabels",
    "dijit/form/HorizontalSlider",
    "../valuePathResolver"
], function (domConstruct, HorizontalRule, HorizontalRuleLabels, HorizontalSlider, valuePathResolver) {
    "use strict";
    function add_slider(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        // A div that contains rules, labels, and slider
        var panelDiv = domConstruct.create("div");
        // TODO: Maybe these rules and labels need to go into a containing div?
        // TODO: But then what to return for this function if want to return actual slider to get value?
        var hasTextLabels = false;
        var labels = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        var questionOptions = fieldSpecification.displayConfiguration;
        if (questionOptions && questionOptions.length !== 0) {
            // console.log("questionOptions", questionOptions);
            labels = questionOptions;
            if (labels.length !== 2) {
                console.log("Need to specify low and high labels for question: ", fieldSpecification.id);
            }
            else {
                hasTextLabels = true;
                var labelLow = labels[0].trim();
                var labelHigh = labels[1].trim();
                labels = [labelLow, labelHigh];
            }
        }
        // console.log("labels", labels, labels.length);
        var slider = new HorizontalSlider({
            minimum: 0,
            maximum: 100,
            discreteValues: 101,
            showButtons: true,
            // Doesn't work: style: "align: center; width: 80%;"
            // style: "width: 98%; max-width: 98%",
            value: valuePathResolver.atFieldSpecification(panelBuilder, model, fieldSpecification)
        });
        slider.placeAt(panelDiv);
        // TODO: Review these two uses of containerNode
        // TODO: also, do the HorizontalRule and HorizontalRuleLabels need startup() to be called if not added to a content pane directly?
        //if (!hasTextLabels) {}
        // Create the rules
        var rulesNode = domConstruct.create("div", {}, slider.containerNode);
        var sliderRules = new HorizontalRule({
            container: "bottomDecoration",
            count: labels.length,
            style: "height: 5px"
        }, rulesNode);
        //}
        // Create the labels
        if (!hasTextLabels) {
            var labelsNode = domConstruct.create("div", {}, slider.containerNode);
            var sliderLabels = new HorizontalRuleLabels({
                container: "bottomDecoration",
                style: "height: 1.5em",
                minimum: 0,
                maximum: 100,
                count: labels.length,
                numericMargin: 1,
                labels: labels
            }, labelsNode);
        }
        else {
            var nodeConstructor = '<div><span style="float: left">' + labels[0] + '</span><span style="float: right">' + labels[1] + '</span></div>';
            var textLabelsNode = domConstruct.toDom(nodeConstructor);
            // slider.containerNode
            panelDiv.appendChild(textLabelsNode);
        }
        // TODO: Issue -- should return a new sort of component that can be placed an includes the slider and the rules and labels
        var sliderContentPane = panelBuilder.newContentPane({
            content: panelDiv
        });
        sliderContentPane.placeAt(questionContentPane);
        return contentPane;
    }
    return add_slider;
});
