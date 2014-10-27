// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "assessment_intro");
        widgets.add_header(contentPane, model, "assessment_narrativeFreedom");
        widgets.add_select(contentPane, model, "assessment_counterStories", ["unknown","never","seldom","sometimes","often"]);
        widgets.add_select(contentPane, model, "assessment_authority", ["unknown","enthrallment","strong listening","partial listening","nothing special"]);
        widgets.add_select(contentPane, model, "assessment_mistakes", ["unknown","never","seldom","sometimes","often"]);
        widgets.add_select(contentPane, model, "assessment_silencing", ["unknown","warning","caution","request","joke"]);
        widgets.add_select(contentPane, model, "assessment_conflict", ["unknown","demand","criticism","comment","joke"]);
        widgets.add_header(contentPane, model, "assessment_narrativeFlow");
        widgets.add_select(contentPane, model, "assessment_remindings", ["unknown","never","seldom","sometimes","often"]);
        widgets.add_select(contentPane, model, "assessment_retellings", ["unknown","never","seldom","sometimes","often"]);
        widgets.add_select(contentPane, model, "assessment_folklore", ["unknown","none","little","some","strong"]);
        widgets.add_select(contentPane, model, "assessment_storyTypes", ["unknown","no","maybe","I think so","definitely"]);
        widgets.add_select(contentPane, model, "assessment_sensemaking", ["unknown","never","seldom","sometimes","often"]);
        widgets.add_header(contentPane, model, "assessment_narrativeKnowledge");
        widgets.add_select(contentPane, model, "assessment_realStories", ["unknown","never","seldom","sometimes","often"]);
        widgets.add_select(contentPane, model, "assessment_negotiations", ["unknown","never","seldom","sometimes","often"]);
        widgets.add_select(contentPane, model, "assessment_cotelling", ["unknown","never","seldom","sometimes","often"]);
        widgets.add_select(contentPane, model, "assessment_blunders", ["unknown","often","sometimes","seldom","never"]);
        widgets.add_select(contentPane, model, "assessment_accounting", ["unknown","never","seldom","sometimes","often"]);
        widgets.add_header(contentPane, model, "assessment_narrativeUnity");
        widgets.add_select(contentPane, model, "assessment_commonStories", ["unknown","impossible","difficult","doable","easy"]);
        widgets.add_select(contentPane, model, "assessment_sacredStories", ["unknown","impossible","difficult","doable","easy"]);
        widgets.add_select(contentPane, model, "assessment_condensedStories", ["unknown","impossible","difficult","doable","easy"]);
        widgets.add_select(contentPane, model, "assessment_intermingling", ["unknown","never","seldom","sometimes","often"]);
        widgets.add_select(contentPane, model, "assessment_culture", ["unknown","impossible","difficult","doable","easy"]);
        widgets.add_header(contentPane, model, "assessment_result_header");
        widgets.add_quizScoreResult(contentPane, model, "assessment_result_freedomSubscore", ["assessment_counterStories","assessment_authority","assessment_mistakes","assessment_silencing","assessment_conflict"]);
        widgets.add_quizScoreResult(contentPane, model, "assessment_result_flowSubscore", ["assessment_remindings","assessment_retellings","assessment_folklore","assessment_storyTypes","assessment_sensemaking"]);
        widgets.add_quizScoreResult(contentPane, model, "assessment_result_knowledgeSubscore", ["assessment_realStories","assessment_negotiations","assessment_cotelling","assessment_blunders","assessment_accounting"]);
        widgets.add_quizScoreResult(contentPane, model, "assessment_result_unitySubscore", ["assessment_commonStories","assessment_sacredStories","assessment_condensedStories","assessment_intermingling","assessment_culture"]);
        widgets.add_quizScoreResult(contentPane, model, "assessment_result_grandTotal", ["assessment_counterStories","assessment_authority","assessment_mistakes","assessment_silencing","assessment_conflict","assessment_remindings","assessment_retellings","assessment_folklore","assessment_storyTypes","assessment_sensemaking","assessment_realStories","assessment_negotiations","assessment_cotelling","assessment_blunders","assessment_accounting","assessment_commonStories","assessment_sacredStories","assessment_condensedStories","assessment_intermingling","assessment_culture"]);
        widgets.add_textarea(contentPane, model, "assessment_notes");
    }

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

    return {
        "id": "page_assessStorySharing",
        "name": "Assess story sharing",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});