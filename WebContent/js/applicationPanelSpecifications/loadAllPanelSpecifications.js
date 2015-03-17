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
    
    function loadAllPanelSpecifications(panelSpecificationCollection) {
        // ==================== SECTION dashboard ==========================
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_dashboard);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_introduction);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_importExport);

        // ==================== SECTION planning ==========================
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_planning);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_projectFacts);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_planningQuestionsDraft);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_participantGroups);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_addParticipantGroup);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_aboutYou);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_projectStories);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_projectStory);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_createProjectStoryElements);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_enterProjectStoryElements);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_addStoryElement);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_assessStorySharing);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_revisePNIPlanningQuestions);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_writeProjectSynopsis);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_readPlanningReport);

        // ==================== SECTION collection_design ==========================
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_collectionDesign);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_chooseCollectionVenues);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_addVenue);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_writeStoryElicitingQuestions);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_addElicitingQuestion);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_writeQuestionsAboutStories);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_addStoryQuestion);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_writeQuestionsAboutParticipants);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_addParticipantQuestion);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_designQuestionForm);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_planStoryCollectionSessions);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_addStoryCollectionSession);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_addCollectionSessionActivity);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_readCollectionDesignReport);

        // ==================== SECTION collection_process ==========================
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_collectionProcess);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_finalizeQuestionForms);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_startStoryCollection);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_enterStories);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_reviewIncomingStories);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_stopStoryCollection);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_enterCollectionSessionRecords);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_addCollectionSessionRecord);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_newCollectionSessionConstruction);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_readCollectionProcessReport);

        // ==================== SECTION catalysis ==========================
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_catalysis);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_browseStories);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_themeStories);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_browseGraphs);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_reviewTrends);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_addToObservation);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_createOrEditObservation);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_selectExcerpt);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_addToExcerpt);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_createNewExcerpt);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_reviewExcerpts);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_interpretObservations);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_clusterInterpretations);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_describePerspectives);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_addPerspective);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_annotateResultForPerspective);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_annotateExcerptForPerspective);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_annotateInterpretationForPerspective);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_readCatalysisReport);

        // ==================== SECTION sensemaking ==========================
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_sensemaking);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_planSensemakingSessions);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_addSensemakingSessionPlan);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_addSensemakingSessionActivity);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_enterSensemakingSessionRecords);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_addSensemakingSessionRecord);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_addResonantStory);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_newSensemakingSessionOutcome);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_newSensemakingSessionConstruction);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_readSensemakingReport);

        // ==================== SECTION intervention ==========================
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_intervention);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_projectOutcomesForIntervention);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_projectOutcome);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_designInterventions);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_addIntervention);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_recordInterventions);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_addInterventionRecord);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_interventionReport);

        // ==================== SECTION return ==========================
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_return);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_gatherFeedback);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_enterFeedbackPiece);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_reflectOnProject);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_prepareProjectPresentation);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_addPresentationElement);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_projectRequests);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(panel_addNewReturnRequest);
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_returnReport);

        // ==================== SECTION project_report ==========================
        panelSpecificationCollection.addPanelSpecificationFromJSONText(page_projectReport);
    }

    return loadAllPanelSpecifications;
});