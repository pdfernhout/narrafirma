// Application level translations
// Not indented correctly to make it easier to cut and paste to other language files
// See: http://dojotoolkit.org/documentation/tutorials/1.9/i18n/
import kludgeForUseStrict = require("../kludgeForUseStrict");
"use strict";
var messages = {
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
    "surveySubmit": "Submit Survey",
    "surveyCancel": "Cancel",
    "button_tellAnotherStory": "Tell another story",
    "button_dontTellAnotherStory": "Done with adding stories",
    
    // select widgets
    selection_has_not_been_made: " -- select -- ",
    
    // calculations
    calculate_quizScoreResult_template: "{{total}} of {{possibleTotal}} ({{percent}}%)",
    
    // other
    copyDraftPNIQuestion_template: "Copied {{copiedAnswersCount}} answers.\n\n(Note that blank draft answers are not copied, and non-blank final answers are not replaced.)",
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
    "category::shortName": "Category",
    "id::shortName": "ID",
    "shortName::shortName": "Short name",
    "text::shortName": "Text",
    "type::shortName": "Type",
    "options::shortName": "Options",
    
    "category::prompt": "Category",
    "id::prompt": "ID",
    "shortName::prompt": "Short name",
    "text::prompt": "Text",
    "type::prompt": "Type",
    "options::prompt": "Options",
    
    // activities
    "name::shortName": "Name",
    // duplicated above for questions: "type::shortName": "type",
    "plan::shortName": "Plan",
    "optionalParts::shortName": "Optional parts",
    "duration::shortName": "Duration",
    "recording::shortName": "Recording",
    "materials::shortName": "Materials",
    "spaces::shortName": "Spaces",
    "facilitation::shortName": "Facilitation",
    
    "name::prompt": "Name",
    // duplicated above for questions: "type::prompt": "type",
    "plan::prompt": "Plan",
    "optionalParts::prompt": "Optional parts",
    "duration::prompt": "Duration",
    "recording::prompt": "Recording",
    "materials::prompt": "Materials",
    "spaces::prompt": "Spaces",
    "facilitation::prompt": "Facilitation",
    
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
    button_addTheme: "Add theme",
    
    // For general recommendations:
    "participantGroup_status::shortName": "Status",
    "participantGroup_confidence::shortName": "Self-confidence",
    "participantGroup_time::shortName": "Free time", 
    "participantGroup_education::shortName": "Education level",
    "participantGroup_physicalDisabilities::shortName": "Physical disabilities",
    "participantGroup_emotionalImpairments::shortName": "Emotional impairments",
    "participantGroup_performing::shortName": "Performance",
    "participantGroup_conforming::shortName": "Conformance", 
    "participantGroup_promoting::shortName": "Self-promotion",
    "participantGroup_venting::shortName": "Speaking out",
    "participantGroup_interest::shortName": "Motivated",
    "participantGroup_feelings_project::shortName": "Feelings about project",
    "participantGroup_feelings_facilitator::shortName": "Feelings about you",
    "participantGroup_feelings_stories::shortName": "Feelings about stories",
    "participantGroup_topic_feeling::shortName": "Feelings about topic",
    "participantGroup_topic_private::shortName": "Privacy of topic",
    "participantGroup_topic_articulate::shortName": "How articulate",
    "participantGroup_topic_timeframe::shortName": "Timeframe",
    "aboutYou_experience::shortName": "Your experience with PNI",
    "aboutYou_help::shortName": "Your available help",
    "aboutYou_tech::shortName": "Your technology experience",
    
    // For interventions recommendations
    "outcomes_peopleFeltHeard::shortName": "Felt heard",
    "outcomes_peopleFeltInvolved::shortName": "Felt involved",
    "outcomes_peopleLearnedAboutCommOrg::shortName": "Learned about community",
    "outcomes_peopleWantedToTellMoreStories::shortName": "Wanted to tell more",
    "outcomes_peopleWantedToShareMoreStoriesWithEachOther::shortName": "Wanted to share more",
    "outcomes_peopleFeltStoriesNeededToBeHeard::shortName": "Felt that stories needed to be heard",
    "outcomes_peopleFeltNobodyCares::shortName": "Felt that nobody cares",
    "outcomes_peopleFeltNobodyCanMeetNeeds::shortName": "Needs could not be met",
    "outcomes_peopleFeltTheyNeedNewStories::shortName": "Needed to tell themselves new stories",
    "outcomes_peopleWantedToKeepExploring::shortName": "Wanted more exploration",
    "outcomes_crisisPointsWereFound::shortName": "Crisis points",
    "outcomes_issuesWereBeyondWords::shortName": "Beyond words",
    "outcomes_peopleLearnedAboutTopic::shortName": "Learned about topic",
    "outcomes_issuesNewMembersStruggleWith::shortName": "New members needed help",
    "outcomes_foundInfoWithoutUnderstanding::shortName": "Had more information than understanding",
    "outcomes_foundOverConfidence::shortName": "Had more confidence than skill",
    "outcomes_peopleCuriousAboutStoryWork::shortName": "Wanted to learn about story work"
    }
};

export = messages;