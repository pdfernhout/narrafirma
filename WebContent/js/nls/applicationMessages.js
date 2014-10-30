// Application level translations
// Not indented correctly to make it easier to cut and paste to other language files
// See: http://dojotoolkit.org/documentation/tutorials/1.9/i18n/
define({
    root: {
     // Do not translate text in double braces since they are identifiers looked up and replaced by the program at runtime
     // For example: {{total}} should stay the same in the translation

    // Used for entering dashboard page status
    "dashboard_status_entry::prompt":  "The dashboard status of this page is:",
    "dashboard_status_entry::selection:intentionally skipped": "intentionally skipped",
    "dashboard_status_entry::selection:partially done": "partially done",
    "dashboard_status_entry::selection:completely finished": "completely finished",
    dashboard_status_label: "status:",
    
    question_not_yet_answered: "(Not Yet Entered)",
    
    // Translation of buttons
    button_home: "Home",
    button_previousPage: "Previous Page",
    button_nextPage: "Next Page",
    button_load: "Load",
    button_save: "Save",
    
    // Grid buttons
    button_OK: "OK",
    button_Cancel: "Cancel",
    button_Done: "Done",
    button_View: "View",
    button_Add: "Add",
    
    // Story browser button
    button_Filter: "Filter -- show only stories where both questions have the selected values",
    
    // select widgets
    selection_has_not_been_made: " -- select -- ",
    
    // calculations
    calculate_quizScoreResult_template: "{{total}} of a possible {{possibleTotal}} ({{percent}}%)",
    calculate_questionAnswerCountOfTotalOnPage_template: "answered {{questionAnsweredCount}} of {{questionAskedCount}} questions",
    
    // other
    copyDraftPNIQuestion_template: "Copied {{copiedAnswersCount}} answers\nNote that blank draft answers are not copied; non-blank final answers are not replaced",
    no_questions_answered_on_page: "(No questions answered on this page)",
    
    // Used for boolean choice widget
    boolean_choice_yes: "yes",
    boolean_choice_no: "no"
}
});