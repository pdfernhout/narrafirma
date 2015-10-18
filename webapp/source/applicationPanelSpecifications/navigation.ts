import page_dashboard = require("./dashboard/page_dashboard");
import page_administration = require("./administration/page_administration");
import page_importExport = require("./administration/page_importExport");
import page_planning = require("./planning/page_planning");
import page_projectFacts = require("./planning/page_projectFacts");
import page_planningQuestionsDraft = require("./planning/page_planningQuestionsDraft");
import page_participantGroups = require("./planning/page_participantGroups");
import page_describeYourResources = require("./planning/page_describeYourResources");
import page_projectStories = require("./planning/page_projectStories");
import page_createProjectStoryElements = require("./planning/page_createProjectStoryElements");
import page_assessStorySharing = require("./planning/page_assessStorySharing");
import page_revisePNIPlanningQuestions = require("./planning/page_revisePNIPlanningQuestions");
import page_writeProjectSynopsis = require("./planning/page_writeProjectSynopsis");
import panel_addParticipantGroup = require("./planning/panel_addParticipantGroup");
import panel_projectStory = require("./planning/panel_projectStory");
import page_collection = require("./collection/page_collection");
import page_chooseCollectionMethods = require("./collection/page_chooseCollectionMethods");
import page_planStoryCollectionSessions = require("./collection/page_planStoryCollectionSessions");
import page_writeStoryElicitingQuestions = require("./collection/page_writeStoryElicitingQuestions");
import page_writeQuestionsAboutStories = require("./collection/page_writeQuestionsAboutStories");
import page_writeQuestionsAboutParticipants = require("./collection/page_writeQuestionsAboutParticipants");
import page_designStoryForms = require("./collection/page_designStoryForms");
import page_startStoryCollection = require("./collection/page_startStoryCollection");
import page_printQuestionForms = require("./collection/page_printQuestionForms");
import page_enterStories = require("./collection/page_enterStories");
import page_writeAnnotationsAboutStories = require("./collection/page_writeAnnotationsAboutStories");
import page_reviewIncomingStories = require("./collection/page_reviewIncomingStories");
import page_browseGraphs = require("./collection/page_browseGraphs");
import page_stopStoryCollection = require("./collection/page_stopStoryCollection");
import page_enterCollectionSessionRecords = require("./collection/page_enterCollectionSessionRecords");
import panel_addStoryCollectionMethod = require("./collection/panel_addStoryCollectionMethod");
import panel_addStoryCollectionSession = require("./collection/panel_addStoryCollectionSession");
import panel_addCollectionSessionActivity = require("./collection/panel_addCollectionSessionActivity");
import panel_addElicitingQuestion = require("./collection/panel_addElicitingQuestion");
import panel_addStoryQuestion = require("./collection/panel_addStoryQuestion");
import panel_addParticipantQuestion = require("./collection/panel_addParticipantQuestion");
import panel_addStoryForm = require("./collection/panel_addStoryForm");
import panel_chooseElicitingQuestion = require("./collection/panel_chooseElicitingQuestion");
import panel_chooseStoryQuestion = require("./collection/panel_chooseStoryQuestion");
import panel_chooseParticipantQuestion = require("./collection/panel_chooseParticipantQuestion");
import panel_addStoryCollection = require("./collection/panel_addStoryCollection");
import panel_addAnnotationQuestion = require("./collection/panel_addAnnotationQuestion");
import panel_addCollectionSessionRecord = require("./collection/panel_addCollectionSessionRecord");
import panel_newCollectionSessionConstruction = require("./collection/panel_newCollectionSessionConstruction");
import page_catalysis = require("./catalysis/page_catalysis");
import page_startCatalysisReport = require("./catalysis/page_startCatalysisReport");
import page_configureCatalysisReport = require("./catalysis/page_configureCatalysisReport");
import page_explorePatterns = require("./catalysis/page_explorePatterns");
import page_clusterInterpretations = require("./catalysis/page_clusterInterpretations");
import page_printCatalysisReport = require("./catalysis/page_printCatalysisReport");
import panel_addCatalysisReport = require("./catalysis/panel_addCatalysisReport");
import panel_chooseStoryCollection = require("./catalysis/panel_chooseStoryCollection");
import panel_addInterpretation = require("./catalysis/panel_addInterpretation");
import page_sensemaking = require("./sensemaking/page_sensemaking");
import page_printStoryCards = require("./sensemaking/page_printStoryCards");
import page_planSensemakingSessions = require("./sensemaking/page_planSensemakingSessions");
import page_enterSensemakingSessionRecords = require("./sensemaking/page_enterSensemakingSessionRecords");
import panel_addSensemakingSessionPlan = require("./sensemaking/panel_addSensemakingSessionPlan");
import panel_addSensemakingSessionActivity = require("./sensemaking/panel_addSensemakingSessionActivity");
import panel_addSensemakingSessionRecord = require("./sensemaking/panel_addSensemakingSessionRecord");
import panel_addResonantStory = require("./sensemaking/panel_addResonantStory");
import panel_addResonantPattern = require("./sensemaking/panel_addResonantPattern");
import panel_newSensemakingSessionOutcome = require("./sensemaking/panel_newSensemakingSessionOutcome");
import panel_newSensemakingSessionConstruction = require("./sensemaking/panel_newSensemakingSessionConstruction");
import page_intervention = require("./intervention/page_intervention");
import page_projectOutcomesForIntervention = require("./intervention/page_projectOutcomesForIntervention");
import page_designInterventions = require("./intervention/page_designInterventions");
import page_recordInterventions = require("./intervention/page_recordInterventions");
import panel_projectOutcome = require("./intervention/panel_projectOutcome");
import panel_addIntervention = require("./intervention/panel_addIntervention");
import panel_addInterventionRecord = require("./intervention/panel_addInterventionRecord");
import page_return = require("./return/page_return");
import page_gatherFeedback = require("./return/page_gatherFeedback");
import page_reflectOnProject = require("./return/page_reflectOnProject");
import page_prepareProjectPresentation = require("./return/page_prepareProjectPresentation");
import page_projectRequests = require("./return/page_projectRequests");
import panel_enterFeedbackPiece = require("./return/panel_enterFeedbackPiece");
import panel_addPresentationElement = require("./return/panel_addPresentationElement");
import panel_addNewReturnRequest = require("./return/panel_addNewReturnRequest");

var navigationModules = {};
navigationModules["page_dashboard"] = page_dashboard;
navigationModules["page_administration"] = page_administration;
navigationModules["page_importExport"] = page_importExport;
navigationModules["page_planning"] = page_planning;
navigationModules["page_projectFacts"] = page_projectFacts;
navigationModules["page_planningQuestionsDraft"] = page_planningQuestionsDraft;
navigationModules["page_participantGroups"] = page_participantGroups;
navigationModules["page_describeYourResources"] = page_describeYourResources;
navigationModules["page_projectStories"] = page_projectStories;
navigationModules["page_createProjectStoryElements"] = page_createProjectStoryElements;
navigationModules["page_assessStorySharing"] = page_assessStorySharing;
navigationModules["page_revisePNIPlanningQuestions"] = page_revisePNIPlanningQuestions;
navigationModules["page_writeProjectSynopsis"] = page_writeProjectSynopsis;
navigationModules["panel_addParticipantGroup"] = panel_addParticipantGroup;
navigationModules["panel_projectStory"] = panel_projectStory;
navigationModules["page_collection"] = page_collection;
navigationModules["page_chooseCollectionMethods"] = page_chooseCollectionMethods;
navigationModules["page_planStoryCollectionSessions"] = page_planStoryCollectionSessions;
navigationModules["page_writeStoryElicitingQuestions"] = page_writeStoryElicitingQuestions;
navigationModules["page_writeQuestionsAboutStories"] = page_writeQuestionsAboutStories;
navigationModules["page_writeQuestionsAboutParticipants"] = page_writeQuestionsAboutParticipants;
navigationModules["page_designStoryForms"] = page_designStoryForms;
navigationModules["page_startStoryCollection"] = page_startStoryCollection;
navigationModules["page_printQuestionForms"] = page_printQuestionForms;
navigationModules["page_enterStories"] = page_enterStories;
navigationModules["page_writeAnnotationsAboutStories"] = page_writeAnnotationsAboutStories;
navigationModules["page_reviewIncomingStories"] = page_reviewIncomingStories;
navigationModules["page_browseGraphs"] = page_browseGraphs;
navigationModules["page_stopStoryCollection"] = page_stopStoryCollection;
navigationModules["page_enterCollectionSessionRecords"] = page_enterCollectionSessionRecords;
navigationModules["panel_addStoryCollectionMethod"] = panel_addStoryCollectionMethod;
navigationModules["panel_addStoryCollectionSession"] = panel_addStoryCollectionSession;
navigationModules["panel_addCollectionSessionActivity"] = panel_addCollectionSessionActivity;
navigationModules["panel_addElicitingQuestion"] = panel_addElicitingQuestion;
navigationModules["panel_addStoryQuestion"] = panel_addStoryQuestion;
navigationModules["panel_addParticipantQuestion"] = panel_addParticipantQuestion;
navigationModules["panel_addStoryForm"] = panel_addStoryForm;
navigationModules["panel_chooseElicitingQuestion"] = panel_chooseElicitingQuestion;
navigationModules["panel_chooseStoryQuestion"] = panel_chooseStoryQuestion;
navigationModules["panel_chooseParticipantQuestion"] = panel_chooseParticipantQuestion;
navigationModules["panel_addStoryCollection"] = panel_addStoryCollection;
navigationModules["panel_addAnnotationQuestion"] = panel_addAnnotationQuestion;
navigationModules["panel_addCollectionSessionRecord"] = panel_addCollectionSessionRecord;
navigationModules["panel_newCollectionSessionConstruction"] = panel_newCollectionSessionConstruction;
navigationModules["page_catalysis"] = page_catalysis;
navigationModules["page_startCatalysisReport"] = page_startCatalysisReport;
navigationModules["page_configureCatalysisReport"] = page_configureCatalysisReport;
navigationModules["page_explorePatterns"] = page_explorePatterns;
navigationModules["page_clusterInterpretations"] = page_clusterInterpretations;
navigationModules["page_printCatalysisReport"] = page_printCatalysisReport;
navigationModules["panel_addCatalysisReport"] = panel_addCatalysisReport;
navigationModules["panel_chooseStoryCollection"] = panel_chooseStoryCollection;
navigationModules["panel_addInterpretation"] = panel_addInterpretation;
navigationModules["page_sensemaking"] = page_sensemaking;
navigationModules["page_printStoryCards"] = page_printStoryCards;
navigationModules["page_planSensemakingSessions"] = page_planSensemakingSessions;
navigationModules["page_enterSensemakingSessionRecords"] = page_enterSensemakingSessionRecords;
navigationModules["panel_addSensemakingSessionPlan"] = panel_addSensemakingSessionPlan;
navigationModules["panel_addSensemakingSessionActivity"] = panel_addSensemakingSessionActivity;
navigationModules["panel_addSensemakingSessionRecord"] = panel_addSensemakingSessionRecord;
navigationModules["panel_addResonantStory"] = panel_addResonantStory;
navigationModules["panel_addResonantPattern"] = panel_addResonantPattern;
navigationModules["panel_newSensemakingSessionOutcome"] = panel_newSensemakingSessionOutcome;
navigationModules["panel_newSensemakingSessionConstruction"] = panel_newSensemakingSessionConstruction;
navigationModules["page_intervention"] = page_intervention;
navigationModules["page_projectOutcomesForIntervention"] = page_projectOutcomesForIntervention;
navigationModules["page_designInterventions"] = page_designInterventions;
navigationModules["page_recordInterventions"] = page_recordInterventions;
navigationModules["panel_projectOutcome"] = panel_projectOutcome;
navigationModules["panel_addIntervention"] = panel_addIntervention;
navigationModules["panel_addInterventionRecord"] = panel_addInterventionRecord;
navigationModules["page_return"] = page_return;
navigationModules["page_gatherFeedback"] = page_gatherFeedback;
navigationModules["page_reflectOnProject"] = page_reflectOnProject;
navigationModules["page_prepareProjectPresentation"] = page_prepareProjectPresentation;
navigationModules["page_projectRequests"] = page_projectRequests;
navigationModules["panel_enterFeedbackPiece"] = panel_enterFeedbackPiece;
navigationModules["panel_addPresentationElement"] = panel_addPresentationElement;
navigationModules["panel_addNewReturnRequest"] = panel_addNewReturnRequest;

var sections = [
    {
        section: "dashboard",
        sectionName: "Dashboard",
        pages: [
            "page_dashboard"
        ],
        panels: []
    },
    {
        section: "administration",
        sectionName: "Administration",
        pages: [
            "page_administration",
            "page_importExport"
        ],
        panels: []
    },
    {
        section: "planning",
        sectionName: "Planning",
        pages: [
            "page_planning",
            "page_projectFacts",
            "page_planningQuestionsDraft",
            "page_participantGroups",
            "page_describeYourResources",
            "page_projectStories",
            "page_createProjectStoryElements",
            "page_assessStorySharing",
            "page_revisePNIPlanningQuestions",
            "page_writeProjectSynopsis"
        ],
        panels: [
            "panel_addParticipantGroup",
            "panel_projectStory"
        ]
    },
    {
        section: "collection",
        sectionName: "Collection",
        pages: [
            "page_collection",
            "page_chooseCollectionMethods",
            "page_planStoryCollectionSessions",
            "page_writeStoryElicitingQuestions",
            "page_writeQuestionsAboutStories",
            "page_writeQuestionsAboutParticipants",
            "page_designStoryForms",
            "page_startStoryCollection",
            "page_printQuestionForms",
            "page_enterStories",
            "page_writeAnnotationsAboutStories",
            "page_reviewIncomingStories",
            "page_browseGraphs",
            "page_stopStoryCollection",
            "page_enterCollectionSessionRecords"
        ],
        panels: [
            "panel_addStoryCollectionMethod",
            "panel_addStoryCollectionSession",
            "panel_addCollectionSessionActivity",
            "panel_addElicitingQuestion",
            "panel_addStoryQuestion",
            "panel_addParticipantQuestion",
            "panel_addStoryForm",
            "panel_chooseElicitingQuestion",
            "panel_chooseStoryQuestion",
            "panel_chooseParticipantQuestion",
            "panel_addStoryCollection",
            "panel_addAnnotationQuestion",
            "panel_addCollectionSessionRecord",
            "panel_newCollectionSessionConstruction"
        ]
    },
    {
        section: "catalysis",
        sectionName: "Catalysis",
        pages: [
            "page_catalysis",
            "page_startCatalysisReport",
            "page_configureCatalysisReport",
            "page_explorePatterns",
            "page_clusterInterpretations",
            "page_printCatalysisReport"
        ],
        panels: [
            "panel_addCatalysisReport",
            "panel_chooseStoryCollection",
            "panel_addInterpretation"
        ]
    },
    {
        section: "sensemaking",
        sectionName: "Sensemaking",
        pages: [
            "page_sensemaking",
            "page_printStoryCards",
            "page_planSensemakingSessions",
            "page_enterSensemakingSessionRecords"
        ],
        panels: [
            "panel_addSensemakingSessionPlan",
            "panel_addSensemakingSessionActivity",
            "panel_addSensemakingSessionRecord",
            "panel_addResonantStory",
            "panel_addResonantPattern",
            "panel_newSensemakingSessionOutcome",
            "panel_newSensemakingSessionConstruction"
        ]
    },
    {
        section: "intervention",
        sectionName: "Intervention",
        pages: [
            "page_intervention",
            "page_projectOutcomesForIntervention",
            "page_designInterventions",
            "page_recordInterventions"
        ],
        panels: [
            "panel_projectOutcome",
            "panel_addIntervention",
            "panel_addInterventionRecord"
        ]
    },
    {
        section: "return",
        sectionName: "Return",
        pages: [
            "page_return",
            "page_gatherFeedback",
            "page_reflectOnProject",
            "page_prepareProjectPresentation",
            "page_projectRequests"
        ],
        panels: [
            "panel_enterFeedbackPiece",
            "panel_addPresentationElement",
            "panel_addNewReturnRequest"
        ]
    }
];

sections["navigationModules"] = navigationModules;

/*
function generateImports() {
    var result = "";
    
    function output(text) {
        result += text + "\n";
    }
    
    sections.forEach((section) => {
        section.pages.forEach((page) => {
            output('import ' + page + ' = require("./' + section.section + "/" + page + '");');
        });
        section.panels.forEach((panel) => {
            output('import ' + panel + ' = require("./' + section.section + "/" + panel + '");');
        });
    });
    
    output("");
    
    output("var navigationModules = {};");
    sections.forEach((section) => {
        section.pages.forEach((page) => {
            output('navigationModules["' + page + '"] = ' + page + ';');
        });
        section.panels.forEach((panel) => {
            output('navigationModules["' + panel + '"] = ' + panel + ';');
        });
    });
    output("");
    output('sections["navigationModules"] = navigationModules;');
    
    console.log("IMPORTS:\n", result);
}

// Run this if you want to update the imports for this file
generateImports();
*/

export = sections;