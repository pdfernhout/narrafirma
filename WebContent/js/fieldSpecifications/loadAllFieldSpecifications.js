define([
    // dashboard
    "dojo/text!./dashboard/page_dashboard.json",
    "dojo/text!./dashboard/page_introduction.json",
    "dojo/text!./dashboard/page_importExport.json",

    // planning
    "dojo/text!./planning/page_planning.json",
    "dojo/text!./planning/page_projectFacts.json",
    "dojo/text!./planning/page_planningQuestionsDraft.json",
    "dojo/text!./planning/page_participantGroups.json",
    "dojo/text!./planning/panel_addParticipantGroup.json",
    "dojo/text!./planning/page_aboutYou.json",
    "dojo/text!./planning/page_projectStories.json",
    "dojo/text!./planning/panel_projectStory.json",
    "dojo/text!./planning/page_createProjectStoryElements.json",
    "dojo/text!./planning/page_enterProjectStoryElements.json",
    "dojo/text!./planning/panel_addStoryElement.json",
    "dojo/text!./planning/page_assessStorySharing.json",
    "dojo/text!./planning/page_revisePNIPlanningQuestions.json",
    "dojo/text!./planning/page_writeProjectSynopsis.json",
    "dojo/text!./planning/page_readPlanningReport.json",

    // collection_design
    "dojo/text!./collection_design/page_collectionDesign.json",
    "dojo/text!./collection_design/page_chooseCollectionVenues.json",
    "dojo/text!./collection_design/panel_addVenue.json",
    "dojo/text!./collection_design/page_writeStoryElicitingQuestions.json",
    "dojo/text!./collection_design/panel_addElicitingQuestion.json",
    "dojo/text!./collection_design/page_writeQuestionsAboutStories.json",
    "dojo/text!./collection_design/panel_addStoryQuestion.json",
    "dojo/text!./collection_design/page_writeQuestionsAboutParticipants.json",
    "dojo/text!./collection_design/panel_addParticipantQuestion.json",
    "dojo/text!./collection_design/page_designQuestionForm.json",
    "dojo/text!./collection_design/page_planStoryCollectionSessions.json",
    "dojo/text!./collection_design/panel_addStoryCollectionSession.json",
    "dojo/text!./collection_design/panel_addCollectionSessionActivity.json",
    "dojo/text!./collection_design/page_readCollectionDesignReport.json",

    // collection_process
    "dojo/text!./collection_process/page_collectionProcess.json",
    "dojo/text!./collection_process/page_finalizeQuestionForms.json",
    "dojo/text!./collection_process/page_startStoryCollection.json",
    "dojo/text!./collection_process/page_enterStories.json",
    "dojo/text!./collection_process/page_reviewIncomingStories.json",
    "dojo/text!./collection_process/page_stopStoryCollection.json",
    "dojo/text!./collection_process/page_enterCollectionSessionRecords.json",
    "dojo/text!./collection_process/panel_addCollectionSessionRecord.json",
    "dojo/text!./collection_process/panel_newCollectionSessionConstruction.json",
    "dojo/text!./collection_process/page_readCollectionProcessReport.json",

    // catalysis
    "dojo/text!./catalysis/page_catalysis.json",
    "dojo/text!./catalysis/page_browseStories.json",
    "dojo/text!./catalysis/page_themeStories.json",
    "dojo/text!./catalysis/page_browseGraphs.json",
    "dojo/text!./catalysis/page_reviewTrends.json",
    "dojo/text!./catalysis/panel_addToObservation.json",
    "dojo/text!./catalysis/panel_createOrEditObservation.json",
    "dojo/text!./catalysis/panel_selectExcerpt.json",
    "dojo/text!./catalysis/panel_addToExcerpt.json",
    "dojo/text!./catalysis/panel_createNewExcerpt.json",
    "dojo/text!./catalysis/page_reviewExcerpts.json",
    "dojo/text!./catalysis/page_interpretObservations.json",
    "dojo/text!./catalysis/page_clusterInterpretations.json",
    "dojo/text!./catalysis/page_describePerspectives.json",
    "dojo/text!./catalysis/panel_addPerspective.json",
    "dojo/text!./catalysis/panel_annotateResultForPerspective.json",
    "dojo/text!./catalysis/panel_annotateExcerptForPerspective.json",
    "dojo/text!./catalysis/panel_annotateInterpretationForPerspective.json",
    "dojo/text!./catalysis/page_readCatalysisReport.json",

    // sensemaking
    "dojo/text!./sensemaking/page_sensemaking.json",
    "dojo/text!./sensemaking/page_planSensemakingSessions.json",
    "dojo/text!./sensemaking/panel_addSensemakingSessionPlan.json",
    "dojo/text!./sensemaking/panel_addSensemakingSessionActivity.json",
    "dojo/text!./sensemaking/page_enterSensemakingSessionRecords.json",
    "dojo/text!./sensemaking/panel_addSensemakingSessionRecord.json",
    "dojo/text!./sensemaking/panel_addResonantStory.json",
    "dojo/text!./sensemaking/panel_newSensemakingSessionOutcome.json",
    "dojo/text!./sensemaking/panel_newSensemakingSessionConstruction.json",
    "dojo/text!./sensemaking/page_readSensemakingReport.json",

    // intervention
    "dojo/text!./intervention/page_intervention.json",
    "dojo/text!./intervention/page_projectOutcomesForIntervention.json",
    "dojo/text!./intervention/panel_projectOutcome.json",
    "dojo/text!./intervention/page_designInterventions.json",
    "dojo/text!./intervention/panel_addIntervention.json",
    "dojo/text!./intervention/page_recordInterventions.json",
    "dojo/text!./intervention/panel_addInterventionRecord.json",
    "dojo/text!./intervention/page_interventionReport.json",

    // return
    "dojo/text!./return/page_return.json",
    "dojo/text!./return/page_gatherFeedback.json",
    "dojo/text!./return/panel_enterFeedbackPiece.json",
    "dojo/text!./return/page_reflectOnProject.json",
    "dojo/text!./return/page_prepareProjectPresentation.json",
    "dojo/text!./return/panel_addPresentationElement.json",
    "dojo/text!./return/page_projectRequests.json",
    "dojo/text!./return/panel_addNewReturnRequest.json",
    "dojo/text!./return/page_returnReport.json",

    // project_report
    "dojo/text!./project_report/page_projectReport.json"
], function(
    // dashboard
    page_dashboard,
    page_introduction,
    page_importExport,

    // planning
    page_planning,
    page_projectFacts,
    page_planningQuestionsDraft,
    page_participantGroups,
    panel_addParticipantGroup,
    page_aboutYou,
    page_projectStories,
    panel_projectStory,
    page_createProjectStoryElements,
    page_enterProjectStoryElements,
    panel_addStoryElement,
    page_assessStorySharing,
    page_revisePNIPlanningQuestions,
    page_writeProjectSynopsis,
    page_readPlanningReport,

    // collection_design
    page_collectionDesign,
    page_chooseCollectionVenues,
    panel_addVenue,
    page_writeStoryElicitingQuestions,
    panel_addElicitingQuestion,
    page_writeQuestionsAboutStories,
    panel_addStoryQuestion,
    page_writeQuestionsAboutParticipants,
    panel_addParticipantQuestion,
    page_designQuestionForm,
    page_planStoryCollectionSessions,
    panel_addStoryCollectionSession,
    panel_addCollectionSessionActivity,
    page_readCollectionDesignReport,

    // collection_process
    page_collectionProcess,
    page_finalizeQuestionForms,
    page_startStoryCollection,
    page_enterStories,
    page_reviewIncomingStories,
    page_stopStoryCollection,
    page_enterCollectionSessionRecords,
    panel_addCollectionSessionRecord,
    panel_newCollectionSessionConstruction,
    page_readCollectionProcessReport,

    // catalysis
    page_catalysis,
    page_browseStories,
    page_themeStories,
    page_browseGraphs,
    page_reviewTrends,
    panel_addToObservation,
    panel_createOrEditObservation,
    panel_selectExcerpt,
    panel_addToExcerpt,
    panel_createNewExcerpt,
    page_reviewExcerpts,
    page_interpretObservations,
    page_clusterInterpretations,
    page_describePerspectives,
    panel_addPerspective,
    panel_annotateResultForPerspective,
    panel_annotateExcerptForPerspective,
    panel_annotateInterpretationForPerspective,
    page_readCatalysisReport,

    // sensemaking
    page_sensemaking,
    page_planSensemakingSessions,
    panel_addSensemakingSessionPlan,
    panel_addSensemakingSessionActivity,
    page_enterSensemakingSessionRecords,
    panel_addSensemakingSessionRecord,
    panel_addResonantStory,
    panel_newSensemakingSessionOutcome,
    panel_newSensemakingSessionConstruction,
    page_readSensemakingReport,

    // intervention
    page_intervention,
    page_projectOutcomesForIntervention,
    panel_projectOutcome,
    page_designInterventions,
    panel_addIntervention,
    page_recordInterventions,
    panel_addInterventionRecord,
    page_interventionReport,

    // return
    page_return,
    page_gatherFeedback,
    panel_enterFeedbackPiece,
    page_reflectOnProject,
    page_prepareProjectPresentation,
    panel_addPresentationElement,
    page_projectRequests,
    panel_addNewReturnRequest,
    page_returnReport,

    // project_report
    page_projectReport
) {
    "use strict";
    
    function loadAllFieldSpecifications(fieldSpecificationCollection) {
        // ==================== SECTION dashboard ==========================
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_dashboard);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_introduction);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_importExport);

        // ==================== SECTION planning ==========================
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_planning);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_projectFacts);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_planningQuestionsDraft);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_participantGroups);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addParticipantGroup);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_aboutYou);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_projectStories);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_projectStory);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_createProjectStoryElements);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_enterProjectStoryElements);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addStoryElement);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_assessStorySharing);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_revisePNIPlanningQuestions);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_writeProjectSynopsis);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_readPlanningReport);

        // ==================== SECTION collection_design ==========================
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_collectionDesign);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_chooseCollectionVenues);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addVenue);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_writeStoryElicitingQuestions);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addElicitingQuestion);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_writeQuestionsAboutStories);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addStoryQuestion);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_writeQuestionsAboutParticipants);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addParticipantQuestion);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_designQuestionForm);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_planStoryCollectionSessions);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addStoryCollectionSession);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addCollectionSessionActivity);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_readCollectionDesignReport);

        // ==================== SECTION collection_process ==========================
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_collectionProcess);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_finalizeQuestionForms);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_startStoryCollection);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_enterStories);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_reviewIncomingStories);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_stopStoryCollection);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_enterCollectionSessionRecords);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addCollectionSessionRecord);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_newCollectionSessionConstruction);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_readCollectionProcessReport);

        // ==================== SECTION catalysis ==========================
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_catalysis);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_browseStories);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_themeStories);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_browseGraphs);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_reviewTrends);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addToObservation);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_createOrEditObservation);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_selectExcerpt);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addToExcerpt);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_createNewExcerpt);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_reviewExcerpts);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_interpretObservations);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_clusterInterpretations);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_describePerspectives);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addPerspective);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_annotateResultForPerspective);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_annotateExcerptForPerspective);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_annotateInterpretationForPerspective);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_readCatalysisReport);

        // ==================== SECTION sensemaking ==========================
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_sensemaking);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_planSensemakingSessions);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addSensemakingSessionPlan);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addSensemakingSessionActivity);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_enterSensemakingSessionRecords);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addSensemakingSessionRecord);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addResonantStory);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_newSensemakingSessionOutcome);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_newSensemakingSessionConstruction);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_readSensemakingReport);

        // ==================== SECTION intervention ==========================
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_intervention);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_projectOutcomesForIntervention);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_projectOutcome);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_designInterventions);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addIntervention);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_recordInterventions);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addInterventionRecord);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_interventionReport);

        // ==================== SECTION return ==========================
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_return);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_gatherFeedback);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_enterFeedbackPiece);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_reflectOnProject);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_prepareProjectPresentation);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addPresentationElement);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_projectRequests);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addNewReturnRequest);
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_returnReport);

        // ==================== SECTION project_report ==========================
        fieldSpecificationCollection.addPanelWithFieldsFromJSONText(page_projectReport);
    }

    return loadAllFieldSpecifications;
});