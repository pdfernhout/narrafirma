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
    
    function loadAllFieldSpecifications(panelSpecificationCollection) {
        // ==================== SECTION dashboard ==========================
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_dashboard);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_introduction);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_importExport);

        // ==================== SECTION planning ==========================
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_planning);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_projectFacts);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_planningQuestionsDraft);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_participantGroups);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addParticipantGroup);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_aboutYou);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_projectStories);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_projectStory);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_createProjectStoryElements);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_enterProjectStoryElements);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addStoryElement);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_assessStorySharing);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_revisePNIPlanningQuestions);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_writeProjectSynopsis);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_readPlanningReport);

        // ==================== SECTION collection_design ==========================
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_collectionDesign);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_chooseCollectionVenues);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addVenue);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_writeStoryElicitingQuestions);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addElicitingQuestion);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_writeQuestionsAboutStories);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addStoryQuestion);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_writeQuestionsAboutParticipants);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addParticipantQuestion);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_designQuestionForm);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_planStoryCollectionSessions);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addStoryCollectionSession);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addCollectionSessionActivity);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_readCollectionDesignReport);

        // ==================== SECTION collection_process ==========================
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_collectionProcess);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_finalizeQuestionForms);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_startStoryCollection);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_enterStories);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_reviewIncomingStories);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_stopStoryCollection);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_enterCollectionSessionRecords);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addCollectionSessionRecord);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_newCollectionSessionConstruction);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_readCollectionProcessReport);

        // ==================== SECTION catalysis ==========================
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_catalysis);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_browseStories);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_themeStories);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_browseGraphs);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_reviewTrends);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addToObservation);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_createOrEditObservation);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_selectExcerpt);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addToExcerpt);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_createNewExcerpt);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_reviewExcerpts);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_interpretObservations);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_clusterInterpretations);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_describePerspectives);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addPerspective);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_annotateResultForPerspective);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_annotateExcerptForPerspective);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_annotateInterpretationForPerspective);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_readCatalysisReport);

        // ==================== SECTION sensemaking ==========================
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_sensemaking);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_planSensemakingSessions);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addSensemakingSessionPlan);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addSensemakingSessionActivity);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_enterSensemakingSessionRecords);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addSensemakingSessionRecord);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addResonantStory);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_newSensemakingSessionOutcome);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_newSensemakingSessionConstruction);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_readSensemakingReport);

        // ==================== SECTION intervention ==========================
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_intervention);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_projectOutcomesForIntervention);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_projectOutcome);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_designInterventions);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addIntervention);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_recordInterventions);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addInterventionRecord);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_interventionReport);

        // ==================== SECTION return ==========================
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_return);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_gatherFeedback);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_enterFeedbackPiece);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_reflectOnProject);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_prepareProjectPresentation);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addPresentationElement);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_projectRequests);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(panel_addNewReturnRequest);
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_returnReport);

        // ==================== SECTION project_report ==========================
        panelSpecificationCollection.addPanelWithFieldsFromJSONText(page_projectReport);
    }

    return loadAllFieldSpecifications;
});