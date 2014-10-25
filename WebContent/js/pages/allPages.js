"use strict";

define([
    "./page_dashboard",
    "./page_planning",
    "./page_projectFacts",
    "./page_planningQuestionsDraft",
    "./page_participantGroups",
    "./page_addParticipantGroup",
    "./page_aboutYou",
    "./page_projectStories",
    "./page_projectStory",
    "./page_createProjectStoryElements",
    "./page_enterProjectStoryElements",
    "./page_addStoryElement",
    "./page_assessStorySharing",
    "./page_revisePNIPlanningQuestions",
    "./page_writeProjectSynopsis",
    "./page_readPlanningReport",
    "./page_collectionDesign",
    "./page_chooseCollectionVenues",
    "./page_venuesTable",
    "./page_writeStoryElicitingQuestions",
    "./page_addElicitingQuestion",
    "./page_writeQuestionsAboutStories",
    "./page_addStoryQuestion",
    "./page_writeQuestionsAboutParticipants",
    "./page_addParticipantQuestion",
    "./page_designQuestionForm",
    "./page_planStoryCollectionSessions",
    "./page_addStoryCollectionSession",
    "./page_addCollectionSessionActivity",
    "./page_readCollectionDesignReport",
    "./page_collectionProcess",
    "./page_finalizeQuestionForms",
    "./page_startStoryCollection",
    "./page_enterStories",
    "./page_reviewIncomingStories",
    "./page_stopStoryCollection",
    "./page_enterCollectionSessionRecords",
    "./page_addCollectionSessionRecord",
    "./page_newCollectionSessionConstruction",
    "./page_readCollectionProcessReport",
    "./page_catalysis",
    "./page_browseStories",
    "./page_themeStories",
    "./page_browseGraphs",
    "./page_reviewTrends",
    "./page_addToObservation",
    "./page_createOrEditObservation",
    "./page_selectExcerpt",
    "./page_addToExcerpt",
    "./page_createNewExcerpt",
    "./page_reviewExcerpts",
    "./page_interpretObservations",
    "./page_clusterInterpretations",
    "./page_describePerspectives",
    "./page_addPerspective",
    "./page_annotateResultForPerspective",
    "./page_annotateExcerptForPerspective",
    "./page_annotateInterpretationForPerspective",
    "./page_readCatalysisReport",
    "./page_sensemaking",
    "./page_planSensemakingSessions",
    "./page_addSensemakingSessionPlan",
    "./page_addSensemakingSessionActivity",
    "./page_enterSensemakingSessionRecords",
    "./page_addSensemakingSessionRecord",
    "./page_addResonantStory",
    "./page_newSensemakingSessionOutcome",
    "./page_newSensemakingSessionConstruction",
    "./page_readSensemakingReport",
    "./page_intervention",
    "./page_projectOutcomesForIntervention",
    "./page_outcomesTable",
    "./page_designInterventions",
    "./page_addIntervention",
    "./page_recordInterventions",
    "./page_addInterventionRecord",
    "./page_interventionReport",
    "./page_return",
    "./page_gatherFeedback",
    "./page_enterFeedbackPiece",
    "./page_reflectOnProject",
    "./page_prepareProjectPresentation",
    "./page_addPresentationElement",
    "./page_projectRequests",
    "./page_addNewReturnRequest",
    "./page_returnReport",
    "./page_projectReport"
], function(
    page_dashboard,
    page_planning,
    page_projectFacts,
    page_planningQuestionsDraft,
    page_participantGroups,
    page_addParticipantGroup,
    page_aboutYou,
    page_projectStories,
    page_projectStory,
    page_createProjectStoryElements,
    page_enterProjectStoryElements,
    page_addStoryElement,
    page_assessStorySharing,
    page_revisePNIPlanningQuestions,
    page_writeProjectSynopsis,
    page_readPlanningReport,
    page_collectionDesign,
    page_chooseCollectionVenues,
    page_venuesTable,
    page_writeStoryElicitingQuestions,
    page_addElicitingQuestion,
    page_writeQuestionsAboutStories,
    page_addStoryQuestion,
    page_writeQuestionsAboutParticipants,
    page_addParticipantQuestion,
    page_designQuestionForm,
    page_planStoryCollectionSessions,
    page_addStoryCollectionSession,
    page_addCollectionSessionActivity,
    page_readCollectionDesignReport,
    page_collectionProcess,
    page_finalizeQuestionForms,
    page_startStoryCollection,
    page_enterStories,
    page_reviewIncomingStories,
    page_stopStoryCollection,
    page_enterCollectionSessionRecords,
    page_addCollectionSessionRecord,
    page_newCollectionSessionConstruction,
    page_readCollectionProcessReport,
    page_catalysis,
    page_browseStories,
    page_themeStories,
    page_browseGraphs,
    page_reviewTrends,
    page_addToObservation,
    page_createOrEditObservation,
    page_selectExcerpt,
    page_addToExcerpt,
    page_createNewExcerpt,
    page_reviewExcerpts,
    page_interpretObservations,
    page_clusterInterpretations,
    page_describePerspectives,
    page_addPerspective,
    page_annotateResultForPerspective,
    page_annotateExcerptForPerspective,
    page_annotateInterpretationForPerspective,
    page_readCatalysisReport,
    page_sensemaking,
    page_planSensemakingSessions,
    page_addSensemakingSessionPlan,
    page_addSensemakingSessionActivity,
    page_enterSensemakingSessionRecords,
    page_addSensemakingSessionRecord,
    page_addResonantStory,
    page_newSensemakingSessionOutcome,
    page_newSensemakingSessionConstruction,
    page_readSensemakingReport,
    page_intervention,
    page_projectOutcomesForIntervention,
    page_outcomesTable,
    page_designInterventions,
    page_addIntervention,
    page_recordInterventions,
    page_addInterventionRecord,
    page_interventionReport,
    page_return,
    page_gatherFeedback,
    page_enterFeedbackPiece,
    page_reflectOnProject,
    page_prepareProjectPresentation,
    page_addPresentationElement,
    page_projectRequests,
    page_addNewReturnRequest,
    page_returnReport,
    page_projectReport
) {
    return {
    "page_dashboard": page_dashboard,
    "page_planning": page_planning,
    "page_projectFacts": page_projectFacts,
    "page_planningQuestionsDraft": page_planningQuestionsDraft,
    "page_participantGroups": page_participantGroups,
    "page_addParticipantGroup": page_addParticipantGroup,
    "page_aboutYou": page_aboutYou,
    "page_projectStories": page_projectStories,
    "page_projectStory": page_projectStory,
    "page_createProjectStoryElements": page_createProjectStoryElements,
    "page_enterProjectStoryElements": page_enterProjectStoryElements,
    "page_addStoryElement": page_addStoryElement,
    "page_assessStorySharing": page_assessStorySharing,
    "page_revisePNIPlanningQuestions": page_revisePNIPlanningQuestions,
    "page_writeProjectSynopsis": page_writeProjectSynopsis,
    "page_readPlanningReport": page_readPlanningReport,
    "page_collectionDesign": page_collectionDesign,
    "page_chooseCollectionVenues": page_chooseCollectionVenues,
    "page_venuesTable": page_venuesTable,
    "page_writeStoryElicitingQuestions": page_writeStoryElicitingQuestions,
    "page_addElicitingQuestion": page_addElicitingQuestion,
    "page_writeQuestionsAboutStories": page_writeQuestionsAboutStories,
    "page_addStoryQuestion": page_addStoryQuestion,
    "page_writeQuestionsAboutParticipants": page_writeQuestionsAboutParticipants,
    "page_addParticipantQuestion": page_addParticipantQuestion,
    "page_designQuestionForm": page_designQuestionForm,
    "page_planStoryCollectionSessions": page_planStoryCollectionSessions,
    "page_addStoryCollectionSession": page_addStoryCollectionSession,
    "page_addCollectionSessionActivity": page_addCollectionSessionActivity,
    "page_readCollectionDesignReport": page_readCollectionDesignReport,
    "page_collectionProcess": page_collectionProcess,
    "page_finalizeQuestionForms": page_finalizeQuestionForms,
    "page_startStoryCollection": page_startStoryCollection,
    "page_enterStories": page_enterStories,
    "page_reviewIncomingStories": page_reviewIncomingStories,
    "page_stopStoryCollection": page_stopStoryCollection,
    "page_enterCollectionSessionRecords": page_enterCollectionSessionRecords,
    "page_addCollectionSessionRecord": page_addCollectionSessionRecord,
    "page_newCollectionSessionConstruction": page_newCollectionSessionConstruction,
    "page_readCollectionProcessReport": page_readCollectionProcessReport,
    "page_catalysis": page_catalysis,
    "page_browseStories": page_browseStories,
    "page_themeStories": page_themeStories,
    "page_browseGraphs": page_browseGraphs,
    "page_reviewTrends": page_reviewTrends,
    "page_addToObservation": page_addToObservation,
    "page_createOrEditObservation": page_createOrEditObservation,
    "page_selectExcerpt": page_selectExcerpt,
    "page_addToExcerpt": page_addToExcerpt,
    "page_createNewExcerpt": page_createNewExcerpt,
    "page_reviewExcerpts": page_reviewExcerpts,
    "page_interpretObservations": page_interpretObservations,
    "page_clusterInterpretations": page_clusterInterpretations,
    "page_describePerspectives": page_describePerspectives,
    "page_addPerspective": page_addPerspective,
    "page_annotateResultForPerspective": page_annotateResultForPerspective,
    "page_annotateExcerptForPerspective": page_annotateExcerptForPerspective,
    "page_annotateInterpretationForPerspective": page_annotateInterpretationForPerspective,
    "page_readCatalysisReport": page_readCatalysisReport,
    "page_sensemaking": page_sensemaking,
    "page_planSensemakingSessions": page_planSensemakingSessions,
    "page_addSensemakingSessionPlan": page_addSensemakingSessionPlan,
    "page_addSensemakingSessionActivity": page_addSensemakingSessionActivity,
    "page_enterSensemakingSessionRecords": page_enterSensemakingSessionRecords,
    "page_addSensemakingSessionRecord": page_addSensemakingSessionRecord,
    "page_addResonantStory": page_addResonantStory,
    "page_newSensemakingSessionOutcome": page_newSensemakingSessionOutcome,
    "page_newSensemakingSessionConstruction": page_newSensemakingSessionConstruction,
    "page_readSensemakingReport": page_readSensemakingReport,
    "page_intervention": page_intervention,
    "page_projectOutcomesForIntervention": page_projectOutcomesForIntervention,
    "page_outcomesTable": page_outcomesTable,
    "page_designInterventions": page_designInterventions,
    "page_addIntervention": page_addIntervention,
    "page_recordInterventions": page_recordInterventions,
    "page_addInterventionRecord": page_addInterventionRecord,
    "page_interventionReport": page_interventionReport,
    "page_return": page_return,
    "page_gatherFeedback": page_gatherFeedback,
    "page_enterFeedbackPiece": page_enterFeedbackPiece,
    "page_reflectOnProject": page_reflectOnProject,
    "page_prepareProjectPresentation": page_prepareProjectPresentation,
    "page_addPresentationElement": page_addPresentationElement,
    "page_projectRequests": page_projectRequests,
    "page_addNewReturnRequest": page_addNewReturnRequest,
    "page_returnReport": page_returnReport,
    "page_projectReport": page_projectReport
    };
});