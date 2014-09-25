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
          "page_projectStoryElements",
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
        "project_generalNotes_planning": "",
        "project_title": "",
        "project_communityOrOrganizationName": "",
        "project_topic": "",
        "project_startAndEndDates": "",
        "project_funders": "",
        "project_facilitators": "",
        "project_reportStartText": "",
        "project_reportEndText": "",
        "project_PNIquestions_goal_draft": "",
        "project_PNIquestions_relationships_draft": "",
        "project_PNIquestions_focus_draft": "",
        "project_PNIquestions_range_draft": "",
        "project_PNIquestions_scope_draft": "",
        "project_PNIquestions_emphasis_draft": "",
        "project_participantGroupsList": [],
        "project_projectStoriesList": [],
        "project_projectStoryElementsList": [],
        "assessment_counterStories": null,
        "assessment_authority": null,
        "assessment_mistakes": null,
        "assessment_silencing": null,
        "assessment_conflict": null,
        "assessment_remindings": null,
        "assessment_retellings": null,
        "assessment_folklore": null,
        "assessment_storyTypes": null,
        "assessment_sensemaking": null,
        "assessment_realStories": null,
        "assessment_negotiations": null,
        "assessment_cotelling": null,
        "assessment_blunders": null,
        "assessment_accounting": null,
        "assessment_commonStories": null,
        "assessment_sacredStories": null,
        "assessment_condensedStories": null,
        "assessment_intermingling": null,
        "assessment_culture": null,
        "assessment_notes": "",
        "project_PNIquestions_goal_final": "",
        "project_PNIquestions_relationships_final": "",
        "project_PNIquestions_focus_final": "",
        "project_PNIquestions_range_final": "",
        "project_PNIquestions_scope_final": "",
        "project_PNIquestions_emphasis_final": "",
        "project_synopsis": "",
        "project_generalNotes_collectionDesign": "",
        "project_elicitingQuestionsList": [],
        "project_storyQuestionsList": [],
        "project_participantQuestionsList": [],
        "questionForm_title": "",
        "questionForm_image": null,
        "questionForm_startText": "",
        "questionForm_endText": "",
        "willBeUsingStoryCollectionSessions": null,
        "project_collectionSessionPlansList": [],
        "project_generalNotes_collectionProcess": "",
        "webStoryCollectionEnabled": null,
        "project_collectionSessionRecordsList": [],
        "project_generalNotes_catalysis": "",
        "reviewTrends_statTests": null,
        "reviewTrends_minSubsetSize": null,
        "reviewTrends_significanceThreshold": null,
        "reviewTrends_trendResults": null,
        "project_savedExcerptsList": [],
        "project_observationsDisplayList": [],
        "project_perspectivesList": [],
        "perspective_interpretationLinkageNotes": "",
        "project_generalNotes_sensemaking": "",
        "project_sensemakingSessionPlansList": [],
        "project_sensemakingSessionRecordsList": [],
        "sensemakingSessionRecord_resonantStory_type": null,
        "sensemakingSessionRecord_resonantStory_reason": "",
        "sensemakingSessionRecord_resonantStory_groups": null,
        "sensemakingSessionRecord_resonantStory_notes": "",
        "project_generalNotes_intervention": "",
        "project_interventionPlansList": [],
        "project_interventionRecordsList": [],
        "project_generalNotes_return": "",
        "project_feedbackItemsList": [],
        "feedback_generalNotes": "",
        "project_reflect_stories": "",
        "project_reflect_facilitation": "",
        "project_reflect_planning": "",
        "project_reflect_ownPNI": "",
        "project_reflect_community": "",
        "project_reflect_personalStrengths": "",
        "project_reflect_teamStrengths": "",
        "project_reflect_newIdeas": "",
        "project_reflect_notes": "",
        "project_presentationElementsList": [],
        "project_returnRequestsList": []
    };
    

    var other = [
         {
             "__id": "page_addParticipantGroup",
             "__type": "popup",
             "participantGroup_name": "",
             "participantGroup_description": ""
           },
           {
             "__id": "page_projectAspects",
             "__type": "repeating",
             "participantGroupAspects__status": null,
             "participantGroupAspects__confidence": null,
             "participantGroupAspects__time": null,
             "participantGroupAspects__education": null,
             "participantGroupAspects__physicalDisabilities": null,
             "participantGroupAspects__emotionalImpairments": null,
             "participantGroupAspects__performing": null,
             "participantGroupAspects__conforming": null,
             "participantGroupAspects__promoting": null,
             "participantGroupAspects__venting": null,
             "participantGroupAspects__interest": null,
             "participantGroupAspects__feelings_project": null,
             "participantGroupAspects__feelings_facilitator": null,
             "participantGroupAspects__feelings_stories": null,
             "participantGroupAspects__topic_feeling": null,
             "participantGroupAspects__topic_private": null,
             "participantGroupAspects__topic_articulate": null,
             "participantGroupAspects__topic_timeframe": null,
             "participantGroupAspects__you_experience": null,
             "participantGroupAspects__you_help": null,
             "participantGroupAspects__you_tech": null
           },
           {
             "__id": "page_projectStory",
             "__type": "popup",
             "projectStory_scenario": null,
             "projectStory_outcome": null,
             "projectStory_text": "",
             "projectStory_name": "",
             "projectStory_feelAbout": "",
             "projectStory_surprise": "",
             "projectStory_dangers": ""
           },
           {
             "__id": "page_addStoryElement",
             "__type": "popup",
             "storyElement_name": "",
             "storyElement_type": null,
             "storyElement_description": "",
             "storyElement_image": null
           },
           {
             "__id": "page_venuesTable",
             "__type": "questionsTable",
             "venue_primaryForGroup_type": null,
             "venue_primaryForGroup_plans": "",
             "venue_secondaryForGroup_type": null,
             "venue_secondaryForGroup_plans": ""
           },
           {
             "__id": "page_addElicitingQuestion",
             "__type": "popup",
             "elicitingQuestion_text": "",
             "elicitingQuestion_type": null
           },
           {
             "__id": "page_addStoryQuestion",
             "__type": "popup",
             "storyQuestion_text": "",
             "storyQuestion_type": null,
             "storyQuestion_shortName": "",
             "storyQuestion_help": ""
           },
           {
             "__id": "page_addParticipantQuestion",
             "__type": "popup",
             "participantQuestion_text": "",
             "participantQuestion_type": null,
             "participantQuestion_shortName": "",
             "participantQuestion_help": ""
           },
           {
             "__id": "page_addStoryCollectionSession",
             "__type": "popup",
             "collectionSessionPlan_name": "",
             "collectionSessionPlan_repetitions": "",
             "collectionSessionPlan_duration": "",
             "collectionSessionPlan_times": "",
             "collectionSessionPlan_location": "",
             "collectionSessionPlan_numPeople": "",
             "collectionSessionPlan_groups": null,
             "collectionSessionPlan_materials": "",
             "collectionSessionPlan_details": "",
             "project_collectionSessionActivitiesList": []
           },
           {
             "__id": "page_addCollectionSessionActivity",
             "__type": "popup",
             "collectionSessionPlan_activity_name": "",
             "collectionSessionPlan_activity_type": null,
             "collectionSessionPlan_activity_plan": "",
             "collectionSessionPlan_activity_optionalParts": "",
             "collectionSessionPlan_activity_duration": "",
             "collectionSessionPlan_activity_recording": "",
             "collectionSessionPlan_activity_spaces": "",
             "collectionSessionPlan_activity_facilitation": ""
           },
           {
             "__id": "page_addCollectionSessionRecord",
             "__type": "popup",
             "collectionSessionRecord_name": "",
             "collectionSessionRecord_whenWhere": "",
             "collectionSessionRecord_participants": "",
             "collectionSessionRecord_plan": "",
             "collectionSessionRecord_notes": "",
             "collectionSessionRecord_constructionsList": [],
             "collectionSessionRecord_reflections_change_participantPerceptions": "",
             "collectionSessionRecord_reflections_change_yourPerceptions": "",
             "collectionSessionRecord_reflections_change_project": "",
             "collectionSessionRecord_reflections_interaction_participants": "",
             "collectionSessionRecord_reflections_interaction_participantsAndFacilitator": "",
             "collectionSessionRecord_reflections_interaction_stories": "",
             "collectionSessionRecord_reflections_learning_special": "",
             "collectionSessionRecord_reflections_learning_surprise": "",
             "collectionSessionRecord_reflections_learning_workedWell": "",
             "collectionSessionRecord_reflections_learning_newIdeas": "",
             "collectionSessionRecord_reflections_learning_wantToRemember": ""
           },
           {
             "__id": "page_newCollectionSessionConstruction",
             "__type": "popup",
             "collectionSessionRecord_construction_name": "",
             "collectionSessionRecord_construction_type": null,
             "collectionSessionRecord_construction_description": ""
           },
           {
             "__id": "page_addToObservation",
             "__type": "popup"
           },
           {
             "__id": "page_createOrEditObservation",
             "__type": "popup",
             "observation_name": "",
             "observation_text": "",
             "firstInterpretation_text": "",
             "firstInterpretation_name": "",
             "firstInterpretation_idea": "",
             "firstInterpretation_excerptsList": [],
             "competingInterpretation_text": "",
             "competingInterpretation_name": "",
             "competingInterpretation_idea": "",
             "competingInterpretation_excerptsList": [],
             "thirdInterpretation_text": "",
             "thirdnterpretation_name": "",
             "thirdInterpretation_idea": "",
             "thirdInterpretation_excerptsList": []
           },
           {
             "__id": "page_selectExcerpt",
             "__type": "popup"
           },
           {
             "__id": "page_addToExcerpt",
             "__type": "popup"
           },
           {
             "__id": "page_createNewExcerpt",
             "__type": "popup",
             "excerpt_name": "",
             "excerpt_text": "",
             "excerpt_notes": ""
           },
           {
             "__id": "page_addPerspective",
             "__type": "popup",
             "perspective_name": "",
             "perspective_description": ""
           },
           {
             "__id": "page_annotateResultForPerspective",
             "__type": "popup",
             "perspective_resultLinkageNotes": ""
           },
           {
             "__id": "page_annotateExcerptForPerspective",
             "__type": "popup",
             "perspective_excerptLinkageNotes": ""
           },
           {
             "__id": "page_addSensemakingSessionPlan",
             "__type": "popup",
             "sensemakingSessionPlan_name": "",
             "sensemakingSessionPlan_repetitions": "",
             "sensemakingSessionPlan_duration": "",
             "sensemakingSessionPlan_times": "",
             "sensemakingSessionPlan_location": "",
             "sensemakingSessionPlan_numPeople": "",
             "sensemakingSessionPlan_groups": null,
             "sensemakingSessionPlan_materials": "",
             "sensemakingSessionPlan_details": "",
             "sensemakingSessionPlan_activitiesList": []
           },
           {
             "__id": "page_addSensemakingSessionActivity",
             "__type": "popup",
             "sensemakingSessionPlan_activity_name": "",
             "sensemakingSessionPlan_activity_type": null,
             "sensemakingSessionPlan_activity_plan": "",
             "sensemakingSessionPlan_activity_optionalParts": "",
             "sensemakingSessionPlan_activity_duration": "",
             "sensemakingSessionPlan_activity_recording": "",
             "sensemakingSessionPlan_activity_materials": "",
             "sensemakingSessionPlan_activity_spaces": "",
             "sensemakingSessionPlan_activity_facilitation": ""
           },
           {
             "__id": "page_addSensemakingSessionRecord",
             "__type": "popup",
             "sensemakingSessionRecord_name": "",
             "showHideCollectedStories": null,
             "sensemakingSessionRecord_outcomesList": [],
             "sensemakingSessionRecord_constructionsList": [],
             "FIXME_704": "",
             "sensemakingSessionRecord_whenWhere": "",
             "sensemakingSessionRecord_participants": "",
             "sensemakingSessionRecord_plan": "",
             "sensemakingSessionRecord_notes": "",
             "sensemakingSessionRecord_reflections_change_participantPerceptions": "",
             "sensemakingSessionRecord_reflections_change_yourPerceptions": "",
             "sensemakingSessionRecord_reflections_change_project": "",
             "sensemakingSessionRecord_reflections_interaction_participants": "",
             "sensemakingSessionRecord_reflections_interaction_participantsAndFacilitator": "",
             "sensemakingSessionRecord_reflections_interaction_stories": "",
             "sensemakingSessionRecord_reflections_learning_special": "",
             "sensemakingSessionRecord_reflections_learning_surprise": "",
             "sensemakingSessionRecord_reflections_learning_workedWell": "",
             "sensemakingSessionRecord_reflections_learning_newIdeas": "",
             "sensemakingSessionRecord_reflections_learning_wantToRemember": ""
           },
           {
             "__id": "page_newSensemakingSessionOutcome",
             "__type": "popup",
             "sensemakingSessionRecord_outcome_type": null,
             "sensemakingSessionRecord_outcome_name": "",
             "sensemakingSessionRecord_outcome_description": ""
           },
           {
             "__id": "page_newSensemakingSessionConstruction",
             "__type": "popup",
             "sensemakingSessionRecord_construction_name": "",
             "sensemakingSessionRecord_construction_type": null,
             "sensemakingSessionRecord_construction_description": ""
           },
           {
             "__id": "page_outcomesTable",
             "__type": "questionsTable",
             "outcomes_peopleFeltHeard": null,
             "outcomes_peopleFeltInvolved": null,
             "outcomes_peopleLearnedAboutCommOrg": null,
             "outcomes_peopleWantedToTellMoreStories": null,
             "outcomes_peopleWantedToShareMoreStoriesWithEachOther": null,
             "outcomes_peopleFeltStoriesNeededToBeHeard": null,
             "outcomes_peopleFeltNobodyCares": null,
             "outcomes_peopleFeltNobodyCanMeetNeeds": null,
             "outcomes_peopleFeltTheyNeedNewStories": null,
             "outcomes_peopleWantedToKeepExploring": null,
             "outcomes_crisisPointsWereFound": null,
             "outcomes_issuesWereBeyondWords": null,
             "outcomes_peopleLarnedAboutTopic": null,
             "outcomes_issuesNewMembersStruggleWith": null,
             "outcomes_foundInfoWithoutUnderstanding": null,
             "outcomes_foundOverConfidence": null,
             "outcomes_peopleCuriousAboutStoryWork": null
           },
           {
             "__id": "page_addIntervention",
             "__type": "popup",
             "interventionPlan_name": "",
             "interventionPlan_type": null,
             "interventionPlan_description": "",
             "interventionPlan_duration": "",
             "interventionPlan_times": "",
             "interventionPlan_locations": "",
             "interventionPlan_help": "",
             "interventionPlan_permission": "",
             "interventionPlan_participation": "",
             "interventionPlan_materials": "",
             "interventionPlan_space": "",
             "interventionPlan_techResources": "",
             "interventionPlan_recording": ""
           },
           {
             "__id": "page_addInterventionRecord",
             "__type": "popup",
             "interventionRecord_name": "",
             "interventionRecord_notes": "",
             "interventionRecord_reflections_change_participantPerceptions": "",
             "interventionRecord_reflections_change_yourPerceptions": "",
             "interventionRecord_reflections_change_project": "",
             "interventionRecord_reflections_interaction_participants": "",
             "interventionRecord_reflections_interaction_participantsAndFacilitator": "",
             "interventionRecord_reflections_interaction_stories": "",
             "interventionRecord_reflections_learning_special": "",
             "interventionRecord_reflections_learning_surprise": "",
             "interventionRecord_reflections_learning_workedWell": "",
             "interventionRecord_reflections_learning_newIdeas": "",
             "interventionRecord_reflections_learning_wantToRemember": ""
           },
           {
             "__id": "page_enterFeedbackPiece",
             "__type": "popup",
             "feedback_text": "",
             "feedback_name": "",
             "feedback_type": null,
             "feedbackWho": "",
             "feedback_prompt": "",
             "feedback_notes": ""
           },
           {
             "__id": "page_addPresentationElement",
             "__type": "popup",
             "projectPresentationElement_name": "",
             "projectPresentationElement_statement": "",
             "projectPresentationElement_evidence": "",
             "projectPresentationElement_QA": "",
             "projectPresentationElement_notes": ""
           },
           {
             "__id": "page_addNewReturnRequest",
             "__type": "popup",
             "returnRequest_text": "",
             "returnRequest_type": null,
             "returnRequest_isMet": null,
             "returnRequest_whatHappened": "",
             "returnRequest_notes": ""
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