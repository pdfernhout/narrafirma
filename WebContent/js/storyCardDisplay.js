define(["require", "exports"], function (require, exports) {
    "use strict";
    function wrap(elementType, cssClass, text) {
        return '<' + elementType + ' class="' + cssClass + '">' + text + '</' + elementType + '>';
    }
    function displayHTMLForSlider(fieldSpecification, fieldName, value) {
        if (fieldSpecification.displayConfiguration.length !== 2) {
            console.log("missing displayConfiguration for slider", fieldSpecification);
            return "ERROR: Problem displaying slider " + fieldSpecification.id;
        }
        // Assumes values go from 0 to 100; places 100.0 in last bucket
        var lowLabel = fieldSpecification.displayConfiguration[0];
        var highLabel = fieldSpecification.displayConfiguration[1];
        var sliderText = "";
        var bucketCount = 40;
        var bucketSize = 100.0 / bucketCount;
        var placed = false;
        for (var i = 0; i < bucketCount; i++) {
            var bucketLow = i * bucketSize;
            var bucketHigh = i * bucketSize + bucketSize;
            if (!placed && ((value < bucketHigh) || (value && i === bucketCount - 1))) {
                sliderText += "<b>|</b>";
                placed = true;
            }
            else {
                sliderText += "-";
            }
        }
        return '<tr>' + wrap("td", "narrafirma-story-card-slider-name", fieldName) + wrap("td", "narrafirma-story-card-slider-label-left", lowLabel) + wrap("td", "narrafirma-story-card-slider-contents", sliderText) + wrap("td", "narrafirma-story-card-slider-label-right", highLabel) + '</tr>\n';
    }
    function displayHTMLForCheckboxes(fieldSpecification, fieldName, value) {
        var result = "";
        for (var i = 0; i < fieldSpecification.valueOptions.length; i++) {
            var option = fieldSpecification.valueOptions[i];
            // console.log("checkboxes", option, fieldSpecification, value);
            if (result)
                result += ", ";
            if (value && value[option]) {
                result += wrap("span", "narrafirma-story-card-checkboxes-selected", option);
            }
            else {
                result += wrap("span", "narrafirma-story-card-checkboxes-unselected", option);
            }
        }
        return fieldName + ": " + result;
    }
    function displayHTMLForSelect(fieldSpecification, fieldName, value) {
        var result = "";
        for (var i = 0; i < fieldSpecification.valueOptions.length; i++) {
            var option = fieldSpecification.valueOptions[i];
            if (result)
                result += ", ";
            if (value === option) {
                result += wrap("span", "narrafirma-story-card-select-selected", option);
            }
            else {
                result += wrap("span", "narrafirma-story-card-select-unselected", option);
            }
        }
        return fieldName + ": " + result;
    }
    function htmlEncode(text) {
        return _.escape(text);
    }
    function displayHTMLForField(model, fieldSpecification, nobreak) {
        if (nobreak === void 0) { nobreak = null; }
        // if (!model.get(fieldSpecification.id)) return "";
        var value = model.get(fieldSpecification.id);
        // TODO: extra checking here for problems with test data -- could probably be changed back to just displayName eventually
        var fieldName = fieldSpecification.displayName || fieldSpecification.displayPrompt;
        var result;
        if (fieldSpecification.displayType === "slider") {
            result = displayHTMLForSlider(fieldSpecification, fieldName, value);
        }
        else if (fieldSpecification.displayType === "checkboxes") {
            result = displayHTMLForCheckboxes(fieldSpecification, fieldName, value);
        }
        else if (fieldSpecification.displayType === "select") {
            result = displayHTMLForSelect(fieldSpecification, fieldName, value);
        }
        else {
            // TODO: May need more handling here for other cases
            result = fieldName + ": " + htmlEncode(value);
        }
        if (nobreak)
            return result;
        return result + "<br><br>\n";
    }
    function generateStoryCardContent(storyModel, currentQuestionnaire, includeElicitingQuestion) {
        // Encode all user-supplied text to ensure it does not create HTML issues
        var elicitingQuestion = htmlEncode(storyModel.get("__survey_elicitingQuestion"));
        var storyName = htmlEncode(storyModel.get("__survey_storyName"));
        var storyText = htmlEncode(storyModel.get("__survey_storyText"));
        var otherFields = "";
        var questions = [];
        if (currentQuestionnaire)
            questions = questions.concat(currentQuestionnaire.storyQuestions);
        if (currentQuestionnaire)
            questions = questions.concat(currentQuestionnaire.participantQuestions);
        var question;
        var i;
        for (i = 0; i < questions.length; i++) {
            question = questions[i];
            if (question.displayType !== "slider")
                continue;
            console.log("making slider", question);
            if (!otherFields)
                otherFields += "<table>\n";
            otherFields += displayHTMLForField(storyModel, question, "nobreak");
        }
        if (otherFields)
            otherFields += "\n</table>\n<br>\n";
        for (i = 0; i < questions.length; i++) {
            question = questions[i];
            if (question.displayType === "slider")
                continue;
            console.log("making other than slider", question);
            otherFields += displayHTMLForField(storyModel, question);
        }
        console.log("otherFields", otherFields);
        var textForElicitingQuestion = "";
        if (includeElicitingQuestion) {
            textForElicitingQuestion = wrap("div", "narrafirma-story-card-eliciting-question", elicitingQuestion) + "<br>";
        }
        var storyCardContent = wrap("div", "narrafirma-story-card-story-title", storyName) + "<br>" + wrap("div", "narrafirma-story-card-story-text", storyText + "<br>" + otherFields + "<hr>" + textForElicitingQuestion);
        return storyCardContent;
    }
    exports.generateStoryCardContent = generateStoryCardContent;
});
//# sourceMappingURL=storyCardDisplay.js.map