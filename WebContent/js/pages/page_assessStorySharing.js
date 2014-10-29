// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"assessment_intro", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"assessment_narrativeFreedom", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"assessment_counterStories", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "never", "seldom", "sometimes", "often"]},
        {"id":"assessment_authority", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "enthrallment", "strong listening", "partial listening", "nothing special"]},
        {"id":"assessment_mistakes", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "never", "seldom", "sometimes", "often"]},
        {"id":"assessment_silencing", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "warning", "caution", "request", "joke"]},
        {"id":"assessment_conflict", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "demand", "criticism", "comment", "joke"]},
        {"id":"assessment_narrativeFlow", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"assessment_remindings", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "never", "seldom", "sometimes", "often"]},
        {"id":"assessment_retellings", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "never", "seldom", "sometimes", "often"]},
        {"id":"assessment_folklore", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "none", "little", "some", "strong"]},
        {"id":"assessment_storyTypes", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "no", "maybe", "I think so", "definitely"]},
        {"id":"assessment_sensemaking", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "never", "seldom", "sometimes", "often"]},
        {"id":"assessment_narrativeKnowledge", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"assessment_realStories", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "never", "seldom", "sometimes", "often"]},
        {"id":"assessment_negotiations", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "never", "seldom", "sometimes", "often"]},
        {"id":"assessment_cotelling", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "never", "seldom", "sometimes", "often"]},
        {"id":"assessment_blunders", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "often", "sometimes", "seldom", "never"]},
        {"id":"assessment_accounting", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "never", "seldom", "sometimes", "often"]},
        {"id":"assessment_narrativeUnity", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"assessment_commonStories", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "impossible", "difficult", "doable", "easy"]},
        {"id":"assessment_sacredStories", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "impossible", "difficult", "doable", "easy"]},
        {"id":"assessment_condensedStories", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "impossible", "difficult", "doable", "easy"]},
        {"id":"assessment_intermingling", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "never", "seldom", "sometimes", "often"]},
        {"id":"assessment_culture", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "impossible", "difficult", "doable", "easy"]},
        {"id":"assessment_result_header", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"assessment_result_freedomSubscore", "type":"quizScoreResult", "isInReport":true, "isGridColumn":false, "options":["assessment_counterStories", "assessment_authority", "assessment_mistakes", "assessment_silencing", "assessment_conflict"]},
        {"id":"assessment_result_flowSubscore", "type":"quizScoreResult", "isInReport":true, "isGridColumn":false, "options":["assessment_remindings", "assessment_retellings", "assessment_folklore", "assessment_storyTypes", "assessment_sensemaking"]},
        {"id":"assessment_result_knowledgeSubscore", "type":"quizScoreResult", "isInReport":true, "isGridColumn":false, "options":["assessment_realStories", "assessment_negotiations", "assessment_cotelling", "assessment_blunders", "assessment_accounting"]},
        {"id":"assessment_result_unitySubscore", "type":"quizScoreResult", "isInReport":true, "isGridColumn":false, "options":["assessment_commonStories", "assessment_sacredStories", "assessment_condensedStories", "assessment_intermingling", "assessment_culture"]},
        {"id":"assessment_result_grandTotal", "type":"quizScoreResult", "isInReport":true, "isGridColumn":false, "options":["assessment_counterStories", "assessment_authority", "assessment_mistakes", "assessment_silencing", "assessment_conflict", "assessment_remindings", "assessment_retellings", "assessment_folklore", "assessment_storyTypes", "assessment_sensemaking", "assessment_realStories", "assessment_negotiations", "assessment_cotelling", "assessment_blunders", "assessment_accounting", "assessment_commonStories", "assessment_sacredStories", "assessment_condensedStories", "assessment_intermingling", "assessment_culture"]},
        {"id":"assessment_notes", "type":"textarea", "isInReport":true, "isGridColumn":false}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_assessStorySharing",
        "name": "Assess story sharing",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});