// This supports globals shared by modules

import kludgeForUseStrict = require("./kludgeForUseStrict");
"use strict";

var testDataItemsToMake = 100;

// Some test data
  
export var testSurveyResponses = [];

var lorumText = ": Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, " +
"totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. " +
"Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores " +
"eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur," +
" adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem." +
" Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?" +
" Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum " +
"fugiat quo voluptas nulla pariatur?";

// TODO: Using older survey format, including with options instead of valueOptions and displayConfiguration
    
export var testSurvey = {
    "__type": "org.pointrel.pointrel20141201.PointrelContentEnvelope",
    "tags": [
        "questionnaire-test-003"
    ],
    "contentType": "org.workingwithstories.Questionnaire",
    "contentVersion": "0.1.0",
    "committer": "anonymous",
    "timestamp": "2015-02-11T13:43:17.725Z",
    "content": {
        "__type": "org.workingwithstories.Questionnaire",
        "title": "Pet owner survey",
        "image": "",
        "startText": "Please help us learn more about dog ownership. We need your help!",
        "endText": "Thanks for helping!",
        "elicitingQuestions": [
            {
                "text": "What happened when you first brought your dog home?",
                "type": {
                    "what happened": true,
                    "directed question": false,
                    "point in time": false,
                    "event": true
                }
            }
        ],
        "storyQuestions": [
            {
                "type": "select",
                "id": "Feel about",
                "options": [
                    "happy",
                    "sad",
                    "angry",
                    "relieved",
                    "enthused",
                    "indifferent",
                    "not sure"
                ],
                "shortName": "Feel about",
                "prompt": "How do you feel about this story?"
            },
            {
                "type": "slider",
                "id": "remember",
                "options": [
                    "tomorrow",
                    "forever"
                ],
                "shortName": "remember",
                "prompt": "How long will you remember this story?"
            },
            {
                "type": "slider",
                "id": "Common or rare",
                "options": [
                    "happens to everyone",
                    "happens to one in a million"
                ],
                "shortName": "Common or rare",
                "prompt": "Based on what you know of our community, do you consider the events described in this story to be common or rare?"
            },
            {
                "type": "checkboxes",
                "id": "Groups need to hear story",
                "options": [
                    "dog owners",
                    "cat owners",
                    "ASPCA",
                    "public officials"
                ],
                "shortName": "Groups need to hear story",
                "prompt": "Which of these groups particularly need to hear this story?"
            }
        ],
        "participantQuestions": [
            {
                "type": "select",
                "id": "Age",
                "options": [
                    "<25",
                    "25-34",
                    "35-44",
                    "45-64",
                    "65-74",
                    "75+"
                ],
                "shortName": "Age",
                "prompt": "Which age range do you fall into?"
            },
            {
                "type": "slider",
                "id": "Feel about rules",
                "options": [
                    "rules keep life working",
                    "rules are for breaking"
                ],
                "shortName": "",
                "prompt": "How do you feel about rules?"
            },
            {
                "type": "select",
                "id": "Location",
                "options": [
                    "South Park Avenue",
                    "Dallas Street",
                    "13th Parallel Boulevard",
                    "Dock Road",
                    "Other"
                ],
                "shortName": "Location",
                "prompt": "Where do you live?"
            }
        ],
        "questionnaireID": "questionnaire-test-003"
    }
};

function makeResponse(responseNumber) {
    return {
        "__type": "org.pointrel.pointrel20141201.PointrelContentEnvelope",
        "id": "test-" + responseNumber,
        "tags": [
            "Test-NarraFirma-003-Surveys"
        ],
        "contentType": "org.workingwithstories.NarraFirmaSurveyResult",
        "committer": "anonymous",
        "timestamp": "2014-12-13T04:18:29.182Z",
        "content": {
            "__type": "org.workingwithstories.QuestionnaireResponse",
            "questionnaire": { // Deleting most of survey for test...
                "questionnaireID": "questionnaire-test-003"
            },
            "responseID": "responseID-" + responseNumber,
            "stories": [
                {
                    "__type": "org.workingwithstories.Story",
                    "storyID": "storyID-" + responseNumber,
                    "participantID": "ParticipantID-" + responseNumber,
                    "storyText": lorumText,
                    "storyName": "StoryName-" + responseNumber,
                    "elicitingQuestion": testSurvey.content.elicitingQuestions[0].text,
                    "S_Groups need to hear story": {
                        "dog owners": (responseNumber + 0) % 4 === 0,
                        "cat owners": (responseNumber + 1) % 4 === 0,
                        "ASPCA": (responseNumber + 2) % 4 === 0,
                        "public officials": (responseNumber + 3) % 4 === 0
                    },
                    "S_Common or rare": responseNumber % 100,
                    "S_remember": responseNumber % 100,
                    "P_Feel about": testSurvey.content.storyQuestions[0].options[responseNumber % 7]
                }
            ],
            "participantData": {
                "__type": "org.workingwithstories.ParticipantData",
                "participantID": "participantID-" + responseNumber,
                "P_Age": testSurvey.content.participantQuestions[0].options[responseNumber % 6],
                // TODO: Problem with test design as missing the name here..!!!!
                "P_Feel about rules": responseNumber % 100,
                "P_Location": testSurvey.content.participantQuestions[2].options[responseNumber % 5]
            },
            "timestampStart": "2014-12-13T04:14:02.916Z",
            "timestampEnd": "2014-12-13T04:18:27.286Z",
            "timeDuration_ms": 264370
        }
    };
}
  
console.log("making test stories");
for (var i = 0; i < testDataItemsToMake; i++) {
    var testResponse = makeResponse(i);
    testSurveyResponses.push(testResponse);
}