define(["js/domain", "dojox/html/entities"], function(domain, entities) {
    "use strict";
    
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
            } else {
                sliderText += "-";
            }
        }
        return '<tr><td class="narrafirma-themer-slider-name">' + fieldName + '</td><td class="narrafirma-themer-slider-label-left">' + lowLabel + '</td><td class="narrafirma-themer-slider-contents">' + sliderText + '</td><td class="narrafirma-themer-slider-label-right">' + highLabel + '</td></tr>\n'; 
    }
    
    function displayHTMLForCheckboxes(fieldSpecification, fieldName, value) {
        var result = "";
        // TODO: What if value is not current available option?
        for (var i = 0; i < fieldSpecification.dataOptions.length; i++) {
            var option = fieldSpecification.dataOptions[i];
            // console.log("checkboxes", option, fieldSpecification, value);
            if (result) result += ", ";
            if (value && value[option]) {
                result += '<span class="narrafirma-themer-checkboxes-selected">' + option + '</span>';
            } else {
                result += '<span class="narrafirma-themer-checkboxes-unselected">' + option + '</span>';
            }
        }
        return fieldName + ": " + result;
    }
    
    function displayHTMLForSelect(fieldSpecification, fieldName, value) {
        var result = "";
        // TODO: What if value is not current available option?
        for (var i = 0; i < fieldSpecification.dataOptions.length; i++) {
            var option = fieldSpecification.dataOptions[i];
            if (result) result += ", ";
            if (value === option) {
                result += '<span class="narrafirma-themer-select-selected">' + option + '</span>';
            } else {
                result += '<span class="narrafirma-themer-select-unselected">' + option + '</span>';
            }
        }
        return fieldName + ": " + result;
    }
    
    function displayHTMLForField(model, fieldSpecification, nobreak) {
        // if (!model.get(fieldSpecification.id)) return "";
        var value = model.get(fieldSpecification.id);
        // TODO: extra checking here for problems with test data -- could probably be changed back to just displayName eventually
        var fieldName = fieldSpecification.displayName || fieldSpecification.displayPrompt;
        var result;
        if (fieldSpecification.displayType === "slider") {
            result =  displayHTMLForSlider(fieldSpecification, fieldName, value);
        } else if (fieldSpecification.displayType === "checkboxes") {
            result = displayHTMLForCheckboxes(fieldSpecification, fieldName, value);
        } else if (fieldSpecification.displayType === "select") {
            result = displayHTMLForSelect(fieldSpecification, fieldName, value);
        } else {
            // TODO: May need more handling here for other cases
            result = fieldName + ": " + entities.encode(value);
        }
        if (nobreak) return result;
        return result + "<br><br>\n";  
    }
    
    function generateStoryCardContent(model) {
        // Encode all user-supplied text to ensure it does not create HTML issues
        var storyName = entities.encode(model.get("__survey_storyName"));
        var storyText = entities.encode(model.get("__survey_storyText"));
        var otherFields = "";
        
        var currentQuestionnaire = domain.currentQuestionnaire;
        
        var questions = [];
        if (currentQuestionnaire) questions = questions.concat(currentQuestionnaire.storyQuestions);
        if (currentQuestionnaire) questions = questions.concat(currentQuestionnaire.participantQuestions);
        
        var question;
        var i;
        
        // Put sliders in a table at the start, so loop twice with different conditions
        
        for (i = 0; i < questions.length; i++) {
            question = questions[i];
            if (question.displayType !== "slider") continue;
            console.log("making slider", question);
            if (!otherFields) otherFields += "<table>\n";
            otherFields += displayHTMLForField(model, question, "nobreak");
        }
        if (otherFields) otherFields += "\n</table>\n<br>\n";
        
        for (i = 0; i < questions.length; i++) {
            question = questions[i];
            if (question.displayType === "slider") continue;
            console.log("making other than slider", question);
            otherFields += displayHTMLForField(model, question);
        }
        
        console.log("otherFields", otherFields);
        
        var storyCardContent = "<b><h2>" + storyName + "</h2></b>" + otherFields + "<br><br>" + storyText;
        
        return storyCardContent;
    }
});