// This supports globals shared by modules

define([
], function(
) {
    "use strict";
    
    // TODO: Fix hardcoded questionnaire ID
    var defaultQuestionnaireID = 'questionnaire-test-003';
    
    // Singleton domain object shared across application
    var domain = {
        
        // TODO: Fix hardcoded questionnaire ID
        currentQuestionnaireID: defaultQuestionnaireID,

        // TODO: This field should be updated with a heartbeat or by other means to pick up changes to it by other users
        // The most recently loaded (or saved) questionnarie
        currentQuestionnaire: null,
        
        allCompletedSurveys: [],
        
        allStories: [],

        // TODO: When does this get updated?
        questionnaireStatus: {questionnaireID: defaultQuestionnaireID, active: false},
        
    };
    
    return domain;
});