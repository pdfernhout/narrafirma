"use strict";

// This supports globals shared by modules

define([
    "dojo/_base/array",
    "dijit/registry",
    "dojo/string",
    "dojo/Stateful"
], function(
    array,
    registry,
    string,
    Stateful
) {
    var pageDefinitions = {};
    var pageInstantiations = {};
    
    var exportedSurveyQuestions = [];
    var surveyResults = [];
    
    // Temporary test data
    var testDogQuestions = [
        {id: "name", type: "text", text: "Name | Your Name", help: 'Please enter your \'full\' name, like "John Smith".'},
        {id: "ownDog", type: "boolean", text: "Owner? | Do you currently have a dog?", help: "Enter yes or no"},
        {id: "broughtHome", type: "textarea", text: "Story | What happened when you first brought your dog home?"},
        {id: "broughtHomeTitle", type: "text", text: "Title | What is a good title for your story?"},
        {id: "feeling1", type: "slider", text: "Day Feeling | How good did you feel the day you brought your dog home?"},
        {id: "feeling2", type: "slider", text: "Next Day Feeling| How good did you feel the day after you brought your dog home? ----- just making this question really long for testing -------------------------------------------------------------- ???"},
        {id: "feeling3", type: "slider", text: "Now Feeling | How good do you feel right now?"},
        {id: "feeling4", type: "select", text: "Now Spouse Feeling | How good does your spouse feel right now?", options: "low\nmedium\nhigh"},
    ];
    
    array.forEach(testDogQuestions, function (question) {
        var split = question.text.split("|");
        question.text = string.trim(split[1]);
        question.shortText = string.trim(split[0]);
    });
    
    var testDogStories = [];
    
    var lorumText = ": Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, " +
    "totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. " +
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores " +
    "eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur," +
    " adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem." +
    " Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?" +
    " Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum " +
    "fugiat quo voluptas nulla pariatur?";
    
    console.log("making test dog stories");
    for (var i = 0; i < 100; i++) {
        var newStory = {
            id: i,
            name: "name " + i,
            ownDog: (i % 2 === 0),
            broughtHome: "Story " + i + lorumText,
            broughtHomeTitle: "Brought Home Title " + i,
            feeling1: i % 100,
            feeling2: i % 100,
            feeling3: i % 100,
            feeling4: ["low", "medium", "high"][i % 3]
        };
        if (newStory.ownDog) {
            newStory.ownDog = "yes";
        } else {
            newStory.ownDog = "no";
        }
        testDogStories.push(newStory);
    }
    
    // console.log("testDogStories", testDogStories);
    
    function countNumberOfVenuesChosen(question) {
        return "countNumberOfVenuesChosen UNFINISHED";
    }
    
    function callDashboardFunction(functionName, question) {
        if (functionName === "countNumberOfVenuesChosen") {
            return countNumberOfVenuesChosen(question);
        } else {
            console.log("TODO: callDashboardFunction ", functionName, question);
            return "callDashboardFunction UNFINISHED: " + functionName + " for: " + question.id;
        }
    }
    
    
    // Store page change callback to prevent circular reference when loading domain and question editor
    var pageChangeCallback = null;
    
    function setPageChangeCallback(pageChangeCallbackNewValue) {
        pageChangeCallback = pageChangeCallbackNewValue;
    }
    
    // questionOrValue will be value for toggleButtons, question for other types
    function buttonClicked(id, questionOrValue) {
         console.log("buttonClicked", id, questionOrValue);
         if (id === "printStoryForm") {
             // TODO
         } else if (id === "copyStoryFormURLDuringFinalize") {
             // TODO
         } else if (id === "copyStoryFormURLDuringStart") {
             // TODO
         } else if (id === "webStoryCollectionEnabled") {
             // TODO: Overkill to recalculate them all...
             pageChangeCallback();
             // TODO
             console.log("TODO webStoryCollectionEnabled");
             return;
         } else if (id === "disableWebStoryFormAfterStoryCollection") {
             // TODO; Shut down the process....
             registry.byId("webStoryCollectionEnabled").set("checked", false);
             registry.byId("webStoryCollectionEnabled").set("value", false);
             console.log("updated webStoryCollectionEnabled to false", registry.byId("webStoryCollectionEnabled").get("value"));
             // TODO: Overkill to recalculate them all...
             pageChangeCallback();
             // TODO
             console.log("TODO webStoryCollectionEnabled");
             return;
         } else if (id === "exportPresentationOutline") {
             // TODO
         } else if (id === "showHideCollectedStories") {
             // This is in a popup...
             // TODO
         } else {
             console.log("unknown button id: ", id, questionOrValue);
             return alert("unknown button id: " + id);
         }
         alert("Unfinished handling for: " + id);
    }
    
    var pagesToGoWithHeaders = {
        "page_dashboard": [],
        "page_planning": [
          "page_projectFacts",
          "page_planningQuestionsDraft",
          "page_participantGroups",
          "page_addParticipantGroup",
          "page_projectAspects",
          "page_projectStories",
          "page_projectStory",
          "page_createProjectStoryElements",
          "page_enterProjectStoryElements",
          "page_addStoryElement",
          "page_assessStorySharing",
          "page_revisePNIPlanningQuestions",
          "page_writeProjectSynopsis",
          "page_readPlanningReport"
        ],
        "page_collectionDesign": [
          "page_chooseCollectionVenues",
          "page_venuesTable",
          "page_writeStoryElicitingQuestions",
          "page_addElicitingQuestion",
          "page_writeQuestionsAboutStories",
          "page_addStoryQuestion",
          "page_writeQuestionsAboutParticipants",
          "page_addParticipantQuestion",
          "page_designQuestionForm",
          "page_planStoryCollectionSessions",
          "page_addStoryCollectionSession",
          "page_addCollectionSessionActivity",
          "readCollectionDesignReport"
        ],
        "page_collectionProcess": [
          "page_finalizeQuestionForms",
          "page_startStoryCollection",
          "page_enterStories",
          "page_reviewIncomingStories",
          "page_stopStoryCollection",
          "page_enterCollectionSessionRecords",
          "page_addCollectionSessionRecord",
          "page_newCollectionSessionConstruction",
          "page_readCollectionProcessReport"
        ],
        "page_catalysis": [
          "page_browseStories",
          "page_themeStories",
          "page_browseGraphs",
          "page_reviewTrends",
          "page_addToObservation",
          "page_createOrEditObservation",
          "page_selectExcerpt",
          "page_addToExcerpt",
          "page_createNewExcerpt",
          "page_reviewExcerpts",
          "page_interpretObservations",
          "page_clusterInterpretations",
          "page_describePerspectives",
          "page_addPerspective",
          "page_annotateResultForPerspective",
          "page_annotateExcerptForPerspective",
          "page_annotateInterpretationForPerspective",
          "page_readCatalysisReport"
        ],
        "page_sensemaking": [
          "page_planSensemakingSessions",
          "page_addSensemakingSessionPlan",
          "page_addSensemakingSessionActivity",
          "page_enterSensemakingSessionRecords",
          "page_addSensemakingSessionRecord",
          "page_addResonantStory",
          "page_newSensemakingSessionOutcome",
          "page_newSensemakingSessionConstruction",
          "page_readSensemakingReport"
        ],
        "page_intervention": [
          "page_projectOutcomesForIntervention",
          "page_outcomesTable",
          "page_designInterventions",
          "page_addIntervention",
          "page_recordInterventions",
          "page_addInterventionRecord",
          "page_interventionReport"
        ],
        "page_return": [
          "page_gatherFeedback",
          "page_enterFeedbackPiece",
          "page_reflectOnProject",
          "page_prepareProjectPresentation",
          "page_addPresentationElement",
          "page_projectRequests",
          "page_addNewReturnRequest",
          "page_returnReport"
        ],
        "page_projectReport": []
    };
    
    // All the data collected by the project
    var data = {
        "planningGeneralNotes": "",
        "projectTitle": "",
        "communityOrOrganizationName": "",
        "projectPrimaryTopicName": "",
        "projectStartAndEndDates": "",
        "projectFacilitators": "",
        "reportStartText": "",
        "reportEndText": "",
        "planning_final_goal": "",
        "planning_final_relationships": "",
        "planning_final_focus": "",
        "planning_final_range": "",
        "planning_final_scope": "",
        "planning_final_emphasis": "",
        "participantGroups": [],
        "projectStoryList": [],
        "projectStoryElementsList": [],
        "quiz_counterStories": null,
        "quiz_authority": null,
        "quiz_mistakes": null,
        "quiz_silencing": null,
        "quiz_conflict": null,
        "quiz_remindings": null,
        "quiz_retellings": null,
        "quiz_folklore": null,
        "quiz_storyTypes": null,
        "quiz_sensemaking": null,
        "quiz_realStories": null,
        "quiz_negotiations": null,
        "quiz_cotelling": null,
        "quiz_blunders": null,
        "quiz_accounting": null,
        "quiz_commonStories": null,
        "quiz_sacredStories": null,
        "quiz_condensedStories": null,
        "quiz_intermingling": null,
        "quiz_culture": null,
        "quiz_notes": "",
        "planning_goal": "",
        "planning_draft_relationships": "",
        "planning_draft_focus": "",
        "planning_draft_range": "",
        "planning_scope": "",
        "planning_emphasis": "",
        "projectSynopsis": "",
        "projectSynopsisComplete": null,
        "collectionDesignGeneralNotes": "",
        "elicitingQuestionsList": [],
        "elicitingQuestionsAreFinal": null,
        "storyQuestionsList": [],
        "storyQuestionsAreFinal": null,
        "participantQuestionsList": [],
        "participantQuestionsAreFinal": null,
        "questionFormTitle": "",
        "questionFormLogo": null,
        "questionFormIntro": "",
        "questionFormEndText": "",
        "questionFormIsComplete": null,
        "willBeUsingStoryCollectionSessions": null,
        "storyCollectionSessionPlansList": [],
        "collectionSessionPlansAreFinal": null,
        "collectionProcessGeneralNotes": "",
        "questionFormInFinalForm": null,
        "webStoryCollectionEnabled": null,
        "storyCollectionSessionRecordsList": [],
        "storyCollectionSessionReflectionsList": [],
        "catalysisGeneralNotes": "",
        "statTests": null,
        "minSubsetSize": null,
        "significanceThreshold": null,
        "trendResults": null,
        "interpretationText": "",
        "interpretationName": "",
        "firstInterpIdea": "",
        "interpretationExcerptsList": [],
        "savedExcerptsList": [],
        "observationsListDisplay": [],
        "finishedCollectingObservations": null,
        "perspectivesList": [],
        "interpretationLinkedToPerspectiveNotes": "",
        "sensemakingGeneralNotes": "",
        "sensemakingSessionPlansList": [],
        "sensemakingSessionPlansAreFinal": null,
        "sensemakingSessionRecordsList": [],
        "sensemakingSessionRecordsAreFinal": null,
        "resonantStoryType": null,
        "resonantStoryReason": "",
        "resonantStoryWhom": null,
        "resonantStoryNotes": "",
        "sensemakingSessionName": "",
        "interventionGeneralNotes": "",
        "interventionPlansList": [],
        "interventionPlansAreFinal": null,
        "interventionRecordsList": [],
        "interventionRecordsAreFinal": null,
        "interventionsList": [],
        "returnGeneralNotes": "",
        "feedbackList": [],
        "generalFeedback": "",
        "reflectProjectStories": "",
        "reflectProjectFacilitation": "",
        "reflectProjectPlanning": "",
        "reflectProjectOwnPNI": "",
        "reflectProjectCommunity": "",
        "reflectProjectPersonalStrengths": "",
        "reflectProjectTeam": "",
        "reflectProjectIdeas": "",
        "reflectProjectNotes": "",
        "reflectProjectImage": null,
        "projectPresentationElementsList": [],
        "presentationReportFinished": null,
        "interestedPeopleList": [],
        "projectRequestsList": []
    };
    

    var other = [
        {
            "__id" : "page_addParticipantGroup",
            "__type" : "popup",
            "participants_groupName" : "",
            "participants_groupDescription" : ""
        }, {
            "__id" : "page_projectAspects",
            "__type" : "repeating",
            "aspects_status" : null,
            "aspects_confidence" : null,
            "aspects_time" : null,
            "aspects_education" : null,
            "aspects_physicalDisabilities" : null,
            "aspects_emotionalImpairments" : null,
            "aspects_performing" : null,
            "aspects_conforming" : null,
            "aspects_promoting" : null,
            "aspects_venting" : null,
            "aspects_interest" : null,
            "aspects_feelings_project" : null,
            "aspects_feelings_facilitator" : null,
            "aspects_feelings_stories" : null,
            "aspects_topic_feeling" : null,
            "aspects_topic_private" : null,
            "aspects_topic_articulate" : null,
            "aspects_topic_timeframe" : null,
            "aspects_you_experience" : null,
            "aspects_you_help" : null,
            "aspects_you_tech" : null
        }, {
            "__id" : "page_projectStory",
            "__type" : "popup",
            "projectStory_scenario" : null,
            "projectStory_outcome" : null,
            "projectStory_text" : "",
            "projectStory_name" : "",
            "projectStory_feelAbout" : "",
            "projectStory_surprise" : "",
            "projectStory_dangers" : ""
        }, {
            "__id" : "page_addStoryElement",
            "__type" : "popup",
            "storyElementName" : "",
            "storyElementType" : null,
            "storyElementDescription" : "",
            "storyElementPhoto" : null
        }, {
            "__id" : "page_venuesTable",
            "__type" : "questionsTable",
            "primaryVenue" : null,
            "primaryVenue_plans" : "",
            "secondaryVenue" : null,
            "secondaryVenue_plans" : ""
        }, {
            "__id" : "page_addElicitingQuestion",
            "__type" : "popup",
            "elicitingQuestion" : "",
            "elicitingQuestionType" : null
        }, {
            "__id" : "page_addStoryQuestion",
            "__type" : "popup",
            "storyQuestionText" : "",
            "storyQuestionType" : null,
            "storyQuestionShortName" : "",
            "storyQuestionHelp" : ""
        }, {
            "__id" : "page_addParticipantQuestion",
            "__type" : "popup",
            "participantQuestionText" : "",
            "participantQuestionType" : null,
            "participantQuestionShortName" : "",
            "participantQuestionHelp" : ""
        }, {
            "__id" : "page_addStoryCollectionSession",
            "__type" : "popup",
            "collectionSessionName" : "",
            "collectionSessionRepetitions" : "",
            "collectionSessionLength" : "",
            "collectionSessionTime" : "",
            "collectionSessionLocation" : "",
            "collectionSessionSize" : "",
            "collectionSessionGroups" : null,
            "collectionSessionMaterials" : "",
            "collectionSessionDetails" : "",
            "collectionSessionActivitiesList" : []
        }, {
            "__id" : "page_addCollectionSessionActivity",
            "__type" : "popup",
            "collectionSessionActivityName" : "",
            "collectionSessionActivityType" : null,
            "collectionActivityPlan" : "",
            "collectionActivityOptionalParts" : "",
            "collectionActivityTime" : "",
            "collectionActivityRecording" : "",
            "collectionActivityMaterials" : "",
            "collectionActivitySpaces" : "",
            "collectionActivityFacilitation" : ""
        }, {
            "__id" : "page_addCollectionSessionRecord",
            "__type" : "popup",
            "collectionSessionConstructionsList" : [],
            "collectionSessionNotesList" : []
        }, {
            "__id" : "page_newCollectionSessionConstruction",
            "__type" : "popup",
            "collectionSessionConstructionName" : "",
            "collectionSessionConstructionType" : null,
            "collectionSessionContructionText" : "",
            "collectionSessionConstructionLink" : "",
            "collectionSessionConstructionImagesList" : []
        }, {
            "__id" : "page_newCollectionConstructionImage",
            "__type" : "popup",
            "collectionSessionConstructionImage" : null,
            "collectionSessionConstructionImageName" : "",
            "collectionSessionConstructionImageNotes" : ""
        }, {
            "__id" : "page_newCollectionSessionNotes",
            "__type" : "popup",
            "collectionSessionNotesName" : "",
            "collectionSessionNotesText" : "",
            "collectionSessionNoteImagesList" : []
        }, {
            "__id" : "page_newCollectionSessionImage",
            "__type" : "popup",
            "collectionSessionNotesImage" : null,
            "collectionSessionImageName" : "",
            "collectionSessionNotesImageNotes" : ""
        }, {
            "__id" : "page_answerQuestionsAboutCollectionSession",
            "__type" : "popup",
            "collectionReflectChangeEmotions" : "",
            "collectionReflectChangeYourEmotions" : "",
            "collectionReflectProjectChanged" : "",
            "collectionReflectInteractionsParticipants" : "",
            "collectionReflectInteractionsFacilitators" : "",
            "collectionReflectStories" : "",
            "collectionReflectSpecial" : "",
            "collectionReflectSurprise" : "",
            "collectionReflectWorkedWellAndNot" : "",
            "collectionReflectNewIdeas" : "",
            "collectionReflectExtra" : ""
        }, {
            "__id" : "page_addToObservation",
            "__type" : "popup"
        }, {
            "__id" : "page_createOrEditObservation",
            "__type" : "popup",
            "observationName" : "",
            "observation" : "",
            "observationInterpretationsList" : [],
            "observationFullyExplored" : null
        }, {
            "__id" : "page_selectExcerpt",
            "__type" : "popup"
        }, {
            "__id" : "page_addToExcerpt",
            "__type" : "popup"
        }, {
            "__id" : "page_createNewExcerpt",
            "__type" : "popup",
            "excerptName" : "",
            "excerptText" : "",
            "excerptNotes" : ""
        }, {
            "__id" : "page_addPerspective",
            "__type" : "popup",
            "perspectiveName" : "",
            "perspectiveDescription" : "",
            "perspectiveComplete" : null
        }, {
            "__id" : "page_annotateResultForPerspective",
            "__type" : "popup",
            "resultLinkedToPerspectiveNotes" : ""
        }, {
            "__id" : "page_annotateExcerptForPerspective",
            "__type" : "popup",
            "excerptLinkedToPerspectiveNotes" : ""
        }, {
            "__id" : "page_addSensemakingSessionPlan",
            "__type" : "popup",
            "sensemakingSessionPlanName" : "",
            "sensemakingSessionPlanRepetitions" : "",
            "sensemakingSessionPlanLength" : "",
            "sensemakingSessionPlanTime" : "",
            "sensemakingSessionLocation" : "",
            "sensemakingSessionPlanSize" : "",
            "sensemakingSessionPlanGroups" : null,
            "sensemakingSessionPlanMaterials" : "",
            "sensemakingSessionPlanDetails" : "",
            "sensemakingSessionPlanActivitiesList" : []
        }, {
            "__id" : "page_addSensemakingSessionActivity",
            "__type" : "popup",
            "sensemakingSessionActivityName" : "",
            "sensemakingSessionActivity" : null,
            "sensemakingActivityPlan" : "",
            "sensemakingActivityOptionalParts" : "",
            "sensemakingActivityTime" : "",
            "sensemakingActivityRecording" : "",
            "sensemakingActivityMaterials" : "",
            "sensemakingActivitySpaces" : "",
            "sensemakingActivityFacilitation" : ""
        }, {
            "__id" : "page_addSensemakingSessionRecord",
            "__type" : "popup",
            "sensemakingSessionRecordName" : "",
            "showHideCollectedStories" : null,
            "sensemakingSessionRecordOutcomesList" : [],
            "sensemakingSessionRecordConstructionsList" : [],
            "sensemakingSessionRecordNotesList" : [],
            "sensemakingSessionReflectionsList" : []
        }, {
            "__id" : "page_newSensemakingSessionOutcome",
            "__type" : "popup",
            "sensemakingSessionOutcomeType" : null,
            "sensemakingSessionOutcomeName" : "",
            "sensemakingSessionOutcomeText" : ""
        }, {
            "__id" : "page_newSensemakingSessionConstruction",
            "__type" : "popup",
            "sensemakingSessionConstructionName" : "",
            "sensemakingSessionConstructionType" : null,
            "sensemakingSessionContructionText" : "",
            "sensemakingSessionConstructionLink" : "",
            "sensemakingSessionConstructionImages" : []
        }, {
            "__id" : "page_newSensemakingConstructionImage",
            "__type" : "popup",
            "sensemakingSessionConstructionImage" : null,
            "sensemakingSessionConstructionImageName" : "",
            "sensemakingSessionConstructionImageNotes" : ""
        }, {
            "__id" : "page_newSensemakingSessionNotes",
            "__type" : "popup",
            "sensemakingSessionNotesName" : "",
            "sensemakingSessionNotesText" : "",
            "sensemakingSessionNoteImages" : []
        }, {
            "__id" : "page_newSensemakingSessionImage",
            "__type" : "popup",
            "sensemakingSessionNotesImage" : null,
            "sensemakingSessionImageName" : "",
            "sensemakingSessionNotesImageNotes" : ""
        }, {
            "__id" : "page_answerQuestionsAboutSensemakingSession",
            "__type" : "popup",
            "sensemakingReflectChangeEmotions" : "",
            "sensemakingReflectChangeYourEmotions" : "",
            "sensemakingReflectProjectChanged" : "",
            "sensemakingReflectInteractionsParticipants" : "",
            "sensemakingReflectInteractionsFacilitators" : "",
            "sensemakingReflectStories" : "",
            "sensemakingReflectSpecial" : "",
            "sensemakingReflectSurprise" : "",
            "sensemakingReflectWorkedWellAndNot" : "",
            "sensemakingReflectNewIdeas" : "",
            "sensemakingReflectExtra" : ""
        }, {
            "__id" : "page_outcomesTable",
            "__type" : "questionsTable",
            "outcomesHeard" : null,
            "outcomesInvolved" : null,
            "outcomesLearnedAboutComm" : null,
            "outcomesMoreStories" : null,
            "outcomesWantedToShareMore" : null,
            "outcomesNeededToBeHeard" : null,
            "outcomesNobodyCares" : null,
            "outcomesNobodyCanMeetNeeds" : null,
            "outcomesNeedNewStories" : null,
            "outcomesKeepExploring" : null,
            "outcomesCrisisPoints" : null,
            "outcomesBeyondWords" : null,
            "outcomesLearnedAboutTopic" : null,
            "outcomesNewMembersStruggling" : null,
            "outcomesInfoWithoutUnderstanding" : null,
            "outcomesOverConfident" : null,
            "outcomesCuriousAboutStoryWork" : null
        }, {
            "__id" : "page_addIntervention",
            "__type" : "popup",
            "interventionPlansName" : "",
            "interventionPlansType" : null,
            "interventionPlansText" : "",
            "interventionPlansLength" : "",
            "interventionPlansTime" : "",
            "interventionPlansLocation" : "",
            "interventionPlansHelp" : "",
            "interventionPlansPermission" : "",
            "interventionPlansParticipation" : "",
            "interventionPlansMaterials" : "",
            "interventionPlansSpace" : "",
            "interventionPlansTech" : "",
            "interventionPlansRecording" : ""
        }, {
            "__id" : "page_addInterventionRecord",
            "__type" : "popup",
            "interventionNotesName" : "",
            "interventionNotesText" : "",
            "interventionRecordImages" : []
        }, {
            "__id" : "page_newInterventionImage",
            "__type" : "popup",
            "interventionNotesImage" : null,
            "interventionImageName" : "",
            "interventionNotesImageNotes" : ""
        }, {
            "__id" : "page_answerQuestionsAboutIntervention",
            "__type" : "popup",
            "interventionName" : "",
            "interventionReflectChangeEmotions" : "",
            "interventionReflectChangeYourEmotions" : "",
            "interventionReflectProjectChanged" : "",
            "interventionReflectInteractionsParticipants" : "",
            "interventionReflectInteractionsFacilitators" : "",
            "interventionReflectStories" : "",
            "interventionReflectSpecial" : "",
            "interventionReflectSurprise" : "",
            "interventionReflectWorkedWellAndNot" : "",
            "interventionReflectNewIdeas" : "",
            "interventionReflectExtra" : ""
        }, {
            "__id" : "page_enterFeedbackPiece",
            "__type" : "popup",
            "feedbackText" : "",
            "feedbackName" : "",
            "feedbackType" : null,
            "feedbackWho" : "",
            "feedbackQuestion" : "",
            "feedbackNotes" : "",
            "feedbackImage" : null
        }, {
            "__id" : "page_addPresentationElement",
            "__type" : "popup",
            "presentationElementName" : "",
            "presentationElementStatement" : "",
            "presentationElementEvidence" : "",
            "presentationElementQA" : "",
            "presentationElementNotes" : ""
        }, {
            "__id" : "page_addInterestedPerson",
            "__type" : "popup",
            "interestedPersonName" : "",
            "interestedPersonContactDetails" : "",
            "interestedPersonType" : null,
            "interestedPersonNotes" : ""
        }, {
            "__id" : "page_addNewProjectRequest",
            "__type" : "popup",
            "requestText" : "",
            "requestType" : null,
            "requestMet" : null,
            "requestWhatHappened" : "",
            "requestNotes" : ""
        }
    ];
    
    for (var headerPageID in pagesToGoWithHeaders) {
        var pages = pagesToGoWithHeaders[headerPageID];
        for (var pageIndex in pages) {
            var pageID = pages[pageIndex];
            data[pageID + "_pageStatus"] = null;
        }
    }
    
    data = new Stateful(data);
    
    return {
        "data": data,
        "pagesToGoWithHeaders": pagesToGoWithHeaders,
        "testDogQuestions": testDogQuestions,
        "testDogStories": testDogStories,
        "exportedSurveyQuestions": exportedSurveyQuestions,
        "surveyResults": surveyResults,
        "pageInstantiations": pageInstantiations,
        "pageDefinitions": pageDefinitions,
        "callDashboardFunction": callDashboardFunction,
        "buttonClicked": buttonClicked,
        "setPageChangeCallback": setPageChangeCallback
    };
});