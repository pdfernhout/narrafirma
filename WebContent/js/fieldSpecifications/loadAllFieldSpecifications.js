define([
    // dashboard
    "./dashboard/page_dashboard",

    // planning
    "./planning/page_planning",
    "./planning/page_projectFacts",
    "./planning/page_planningQuestionsDraft",
    "./planning/page_participantGroups",
    "./planning/panel_addParticipantGroup",
    "./planning/page_aboutYou",
    "./planning/page_projectStories",
    "./planning/panel_projectStory",
    "./planning/page_createProjectStoryElements",
    "./planning/page_enterProjectStoryElements",
    "./planning/panel_addStoryElement",
    "./planning/page_assessStorySharing",
    "./planning/page_revisePNIPlanningQuestions",
    "./planning/page_writeProjectSynopsis",
    "./planning/page_readPlanningReport",

    // collection_design
    "./collection_design/page_collectionDesign",
    "./collection_design/page_chooseCollectionVenues",
    "./collection_design/panel_addVenue",
    "./collection_design/page_writeStoryElicitingQuestions",
    "./collection_design/panel_addElicitingQuestion",
    "./collection_design/page_writeQuestionsAboutStories",
    "./collection_design/panel_addStoryQuestion",
    "./collection_design/page_writeQuestionsAboutParticipants",
    "./collection_design/panel_addParticipantQuestion",
    "./collection_design/page_designQuestionForm",
    "./collection_design/page_planStoryCollectionSessions",
    "./collection_design/panel_addStoryCollectionSession",
    "./collection_design/panel_addCollectionSessionActivity",
    "./collection_design/page_readCollectionDesignReport",

    // collection_process
    "./collection_process/page_collectionProcess",
    "./collection_process/page_finalizeQuestionForms",
    "./collection_process/page_startStoryCollection",
    "./collection_process/page_enterStories",
    "./collection_process/page_reviewIncomingStories",
    "./collection_process/page_stopStoryCollection",
    "./collection_process/page_enterCollectionSessionRecords",
    "./collection_process/panel_addCollectionSessionRecord",
    "./collection_process/panel_newCollectionSessionConstruction",
    "./collection_process/page_readCollectionProcessReport",

    // catalysis
    "./catalysis/page_catalysis",
    "./catalysis/page_browseStories",
    "./catalysis/page_themeStories",
    "./catalysis/page_browseGraphs",
    "./catalysis/page_reviewTrends",
    "./catalysis/panel_addToObservation",
    "./catalysis/panel_createOrEditObservation",
    "./catalysis/panel_selectExcerpt",
    "./catalysis/panel_addToExcerpt",
    "./catalysis/panel_createNewExcerpt",
    "./catalysis/page_reviewExcerpts",
    "./catalysis/page_interpretObservations",
    "./catalysis/page_clusterInterpretations",
    "./catalysis/page_describePerspectives",
    "./catalysis/panel_addPerspective",
    "./catalysis/panel_annotateResultForPerspective",
    "./catalysis/panel_annotateExcerptForPerspective",
    "./catalysis/panel_annotateInterpretationForPerspective",
    "./catalysis/page_readCatalysisReport",

    // sensemaking
    "./sensemaking/page_sensemaking",
    "./sensemaking/page_planSensemakingSessions",
    "./sensemaking/panel_addSensemakingSessionPlan",
    "./sensemaking/panel_addSensemakingSessionActivity",
    "./sensemaking/page_enterSensemakingSessionRecords",
    "./sensemaking/panel_addSensemakingSessionRecord",
    "./sensemaking/panel_addResonantStory",
    "./sensemaking/panel_newSensemakingSessionOutcome",
    "./sensemaking/panel_newSensemakingSessionConstruction",
    "./sensemaking/page_readSensemakingReport",

    // intervention
    "./intervention/page_intervention",
    "./intervention/page_projectOutcomesForIntervention",
    "./intervention/panel_projectOutcome",
    "./intervention/page_designInterventions",
    "./intervention/panel_addIntervention",
    "./intervention/page_recordInterventions",
    "./intervention/panel_addInterventionRecord",
    "./intervention/page_interventionReport",

    // return
    "./return/page_return",
    "./return/page_gatherFeedback",
    "./return/panel_enterFeedbackPiece",
    "./return/page_reflectOnProject",
    "./return/page_prepareProjectPresentation",
    "./return/panel_addPresentationElement",
    "./return/page_projectRequests",
    "./return/panel_addNewReturnRequest",
    "./return/page_returnReport",

    // project_report
    "./project_report/page_projectReport"
], function(
    // dashboard
    page_dashboard,

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
        fieldSpecificationCollection.addFieldSpecifications(page_dashboard);

        // ==================== SECTION planning ==========================
        fieldSpecificationCollection.addFieldSpecifications(page_planning);
        fieldSpecificationCollection.addFieldSpecifications(page_projectFacts);
        fieldSpecificationCollection.addFieldSpecifications(page_planningQuestionsDraft);
        fieldSpecificationCollection.addFieldSpecifications(page_participantGroups);
        fieldSpecificationCollection.addFieldSpecifications(panel_addParticipantGroup);
        fieldSpecificationCollection.addFieldSpecifications(page_aboutYou);
        fieldSpecificationCollection.addFieldSpecifications(page_projectStories);
        fieldSpecificationCollection.addFieldSpecifications(panel_projectStory);
        fieldSpecificationCollection.addFieldSpecifications(page_createProjectStoryElements);
        fieldSpecificationCollection.addFieldSpecifications(page_enterProjectStoryElements);
        fieldSpecificationCollection.addFieldSpecifications(panel_addStoryElement);
        fieldSpecificationCollection.addFieldSpecifications(page_assessStorySharing);
        fieldSpecificationCollection.addFieldSpecifications(page_revisePNIPlanningQuestions);
        fieldSpecificationCollection.addFieldSpecifications(page_writeProjectSynopsis);
        fieldSpecificationCollection.addFieldSpecifications(page_readPlanningReport);

        // ==================== SECTION collection_design ==========================
        fieldSpecificationCollection.addFieldSpecifications(page_collectionDesign);
        fieldSpecificationCollection.addFieldSpecifications(page_chooseCollectionVenues);
        fieldSpecificationCollection.addFieldSpecifications(panel_addVenue);
        fieldSpecificationCollection.addFieldSpecifications(page_writeStoryElicitingQuestions);
        fieldSpecificationCollection.addFieldSpecifications(panel_addElicitingQuestion);
        fieldSpecificationCollection.addFieldSpecifications(page_writeQuestionsAboutStories);
        fieldSpecificationCollection.addFieldSpecifications(panel_addStoryQuestion);
        fieldSpecificationCollection.addFieldSpecifications(page_writeQuestionsAboutParticipants);
        fieldSpecificationCollection.addFieldSpecifications(panel_addParticipantQuestion);
        fieldSpecificationCollection.addFieldSpecifications(page_designQuestionForm);
        fieldSpecificationCollection.addFieldSpecifications(page_planStoryCollectionSessions);
        fieldSpecificationCollection.addFieldSpecifications(panel_addStoryCollectionSession);
        fieldSpecificationCollection.addFieldSpecifications(panel_addCollectionSessionActivity);
        fieldSpecificationCollection.addFieldSpecifications(page_readCollectionDesignReport);

        // ==================== SECTION collection_process ==========================
        fieldSpecificationCollection.addFieldSpecifications(page_collectionProcess);
        fieldSpecificationCollection.addFieldSpecifications(page_finalizeQuestionForms);
        fieldSpecificationCollection.addFieldSpecifications(page_startStoryCollection);
        fieldSpecificationCollection.addFieldSpecifications(page_enterStories);
        fieldSpecificationCollection.addFieldSpecifications(page_reviewIncomingStories);
        fieldSpecificationCollection.addFieldSpecifications(page_stopStoryCollection);
        fieldSpecificationCollection.addFieldSpecifications(page_enterCollectionSessionRecords);
        fieldSpecificationCollection.addFieldSpecifications(panel_addCollectionSessionRecord);
        fieldSpecificationCollection.addFieldSpecifications(panel_newCollectionSessionConstruction);
        fieldSpecificationCollection.addFieldSpecifications(page_readCollectionProcessReport);

        // ==================== SECTION catalysis ==========================
        fieldSpecificationCollection.addFieldSpecifications(page_catalysis);
        fieldSpecificationCollection.addFieldSpecifications(page_browseStories);
        fieldSpecificationCollection.addFieldSpecifications(page_themeStories);
        fieldSpecificationCollection.addFieldSpecifications(page_browseGraphs);
        fieldSpecificationCollection.addFieldSpecifications(page_reviewTrends);
        fieldSpecificationCollection.addFieldSpecifications(panel_addToObservation);
        fieldSpecificationCollection.addFieldSpecifications(panel_createOrEditObservation);
        fieldSpecificationCollection.addFieldSpecifications(panel_selectExcerpt);
        fieldSpecificationCollection.addFieldSpecifications(panel_addToExcerpt);
        fieldSpecificationCollection.addFieldSpecifications(panel_createNewExcerpt);
        fieldSpecificationCollection.addFieldSpecifications(page_reviewExcerpts);
        fieldSpecificationCollection.addFieldSpecifications(page_interpretObservations);
        fieldSpecificationCollection.addFieldSpecifications(page_clusterInterpretations);
        fieldSpecificationCollection.addFieldSpecifications(page_describePerspectives);
        fieldSpecificationCollection.addFieldSpecifications(panel_addPerspective);
        fieldSpecificationCollection.addFieldSpecifications(panel_annotateResultForPerspective);
        fieldSpecificationCollection.addFieldSpecifications(panel_annotateExcerptForPerspective);
        fieldSpecificationCollection.addFieldSpecifications(panel_annotateInterpretationForPerspective);
        fieldSpecificationCollection.addFieldSpecifications(page_readCatalysisReport);

        // ==================== SECTION sensemaking ==========================
        fieldSpecificationCollection.addFieldSpecifications(page_sensemaking);
        fieldSpecificationCollection.addFieldSpecifications(page_planSensemakingSessions);
        fieldSpecificationCollection.addFieldSpecifications(panel_addSensemakingSessionPlan);
        fieldSpecificationCollection.addFieldSpecifications(panel_addSensemakingSessionActivity);
        fieldSpecificationCollection.addFieldSpecifications(page_enterSensemakingSessionRecords);
        fieldSpecificationCollection.addFieldSpecifications(panel_addSensemakingSessionRecord);
        fieldSpecificationCollection.addFieldSpecifications(panel_addResonantStory);
        fieldSpecificationCollection.addFieldSpecifications(panel_newSensemakingSessionOutcome);
        fieldSpecificationCollection.addFieldSpecifications(panel_newSensemakingSessionConstruction);
        fieldSpecificationCollection.addFieldSpecifications(page_readSensemakingReport);

        // ==================== SECTION intervention ==========================
        fieldSpecificationCollection.addFieldSpecifications(page_intervention);
        fieldSpecificationCollection.addFieldSpecifications(page_projectOutcomesForIntervention);
        fieldSpecificationCollection.addFieldSpecifications(panel_projectOutcome);
        fieldSpecificationCollection.addFieldSpecifications(page_designInterventions);
        fieldSpecificationCollection.addFieldSpecifications(panel_addIntervention);
        fieldSpecificationCollection.addFieldSpecifications(page_recordInterventions);
        fieldSpecificationCollection.addFieldSpecifications(panel_addInterventionRecord);
        fieldSpecificationCollection.addFieldSpecifications(page_interventionReport);

        // ==================== SECTION return ==========================
        fieldSpecificationCollection.addFieldSpecifications(page_return);
        fieldSpecificationCollection.addFieldSpecifications(page_gatherFeedback);
        fieldSpecificationCollection.addFieldSpecifications(panel_enterFeedbackPiece);
        fieldSpecificationCollection.addFieldSpecifications(page_reflectOnProject);
        fieldSpecificationCollection.addFieldSpecifications(page_prepareProjectPresentation);
        fieldSpecificationCollection.addFieldSpecifications(panel_addPresentationElement);
        fieldSpecificationCollection.addFieldSpecifications(page_projectRequests);
        fieldSpecificationCollection.addFieldSpecifications(panel_addNewReturnRequest);
        fieldSpecificationCollection.addFieldSpecifications(page_returnReport);

        // ==================== SECTION project_report ==========================
        fieldSpecificationCollection.addFieldSpecifications(page_projectReport);
    }

    return loadAllFieldSpecifications;
});