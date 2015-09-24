import kludgeForUseStrict = require("./kludgeForUseStrict");
import PointrelClient = require("./pointrel20150417/PointrelClient");

"use strict";

export function storeSurveyResult(pointrelClient: PointrelClient, projectIdentifier, storyCollectionName, completedSurvey, wizardPane) {
    var surveyResultWrapper  = {
        projectIdentifier: projectIdentifier,
        // TODO: Mismatch of stored string's intent and the field name
        storyCollectionIdentifier: storyCollectionName,
        surveyResult: completedSurvey
    };
    
    console.log("storeSurveyResult", surveyResultWrapper);
    
    pointrelClient.createAndSendChangeMessage("surveyResults", "surveyResult", surveyResultWrapper, null, function(error, result) {
        if (error) {
            console.log("Problem saving survey result", error);
            if (wizardPane && wizardPane.failed) {
                wizardPane.failed();
            } else {
                // TODO: Translate
                alert("Problem saving survey result; check the console for details.\nPlease try to submit the survey result later.");
            }
            return;
        }
        console.log("Survey result stored");
        if (wizardPane) {
            wizardPane.forward();
        } else {
            // TODO: Translate
            alert("Your contribution has been added to the story collection. Thank you.");
        }
    });
}
