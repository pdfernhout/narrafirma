"use strict"

export function storeSurveyResult(pointrelClient, projectIdentifier, storyCollectionIdentifier, completedSurvey, wizardPane) {
    var surveyResultWrapper  = {
        projectIdentifier: projectIdentifier,
        storyCollectionIdentifier: storyCollectionIdentifier,
        surveyResult: completedSurvey
    };
    
    console.log("storeSurveyResult", surveyResultWrapper);
    
    pointrelClient.createAndSendChangeMessage("surveyResults", "surveyResult", surveyResultWrapper, null, function(error, result) {
        if (error) {
            console.log("Problem saving survey result", error);
            // TODO: Translate
            // alert("Problem saving survey result");
            alert("Problem saving survey result.\nPlease try to submit the survey result later;\nCould not write new survey result to server:\n" + error);
            if (wizardPane && wizardPane.failed) wizardPane.failed();
            return;
        }
        console.log("Survey result stored");
        if (wizardPane) alert("Your story has been added to the story collection.");
        if (wizardPane) wizardPane.forward();
    });
}
