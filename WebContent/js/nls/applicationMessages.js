// Application level translations
// Not indented correctly to make it easier to cut and paste to other language files
// See: http://dojotoolkit.org/documentation/tutorials/1.9/i18n/
define({
    root: {
     // Do not translate text in double braces since they are identifiers looked up and replaced by the program at runtime
     // For example: {{total}} should stay the same in the translation

    dashboard_status_label: "reminders:", 
    question_not_yet_answered: "(Not Yet Entered)",
    
    // Translation of buttons
    button_home: "Home",
    button_home_title: "Go home to main dashboard",
    button_previousPage: "Previous Page",
    button_nextPage: "Next Page",
    button_loadLatest: "Load latest",
    button_loadVersion: "Load version",
    button_save: "Save",
    button_debug: "Debug",
    button_importExport: "Import/Export",
    
    // Grid buttons
    button_OK: "OK",
    button_Cancel: "Cancel",
    button_Done: "Done",
    button_View: "View",
    button_Add: "Add",
    button_Remove: "Remove",
    button_Edit: "Edit",
    button_Duplicate: "Duplicate",
    button_Up: "Move Up",
    button_Down: "Move Down",
    button_navigateStart: "[<<", 
    button_navigatePrevious: "<",
    button_navigateNext: ">",
    button_navigateEnd: ">>]",
    
    // Story browser button
    button_Filter: "Filter -- show only stories where both questions have the selected values",
    
    // Used for test of survey in main.js
    "surveySubmit": "Submit survey",
    "surveyCancel": "Cancel",
    "button_tellAnotherStory": "Tell another story",
    "button_dontTellAnotherStory": "Done with adding stories",
    
    // select widgets
    selection_has_not_been_made: " -- select -- ",
    
    // calculations
    calculate_quizScoreResult_template: "{{total}} of a possible {{possibleTotal}} ({{percent}}%)",
    
    // other
    copyDraftPNIQuestion_template: "Copied {{copiedAnswersCount}} answers\nNote that blank draft answers are not copied; non-blank final answers are not replaced",
    no_questions_answered_on_page: "(No questions answered on this page)",
    
    // Used for boolean choice widget
    boolean_choice_yes: "yes",
    boolean_choice_no: "no",
    
    // Used for graph browser
    updateGraph: "Update Graph",
    
    // Used for templates
    
    button_chooseATemplateToInsert: "Choose a template to insert...",
    title_chooseATemplate: "Choose a template",

    // eliciting or questions
    "category::shortName": "category",
    "id::shortName": "id",
    "shortName::shortName": "short name",
    "text::shortName": "text",
    "type::shortName": "type",
    "options::shortName": "options",
    
    "category::prompt": "category",
    "id::prompt": "id",
    "shortName::prompt": "short name",
    "text::prompt": "text",
    "type::prompt": "type",
    "options::prompt": "options",
    
    // activities
    "name::shortName": "name",
    // duplicated above for questions: "type::shortName": "type",
    "plan::shortName": "plan",
    "optionalParts::shortName": "optionalParts",
    "duration::shortName": "duration",
    "recording::shortName": "recording",
    "materials::shortName": "materials",
    "spaces::shortName": "spaces",
    "facilitation::shortName": "facilitation",
    
    "name::prompt": "name",
    // duplicated above for questions: "type::prompt": "type",
    "plan::prompt": "plan",
    "optionalParts::prompt": "optionalParts",
    "duration::prompt": "duration",
    "recording::prompt": "recording",
    "materials::prompt": "materials",
    "spaces::prompt": "spaces",
    "facilitation::prompt": "facilitation",
    
    "button_UseTemplate": "Use template",
     
    // use for recommendations table
    button_showRecommendationsTable: "Show recommendations table",
    title_recommendationsTable: "Recommendations table",
    
    // For clustering diagram
    clusterDiagramSource_titleID: "Cluster Diagram Source",
    clusterDiagramSource_okButtonID:  "Update",
        
    // For project import/export dialog
    projectImportExportDialog_title: "Project Design Import/Export",
    projectImportExportDialog_okButtonText: "Import",
    
    // For theming
    button_addTheme: "Add theme"
}
});