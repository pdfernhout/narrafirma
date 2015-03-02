// Experiments with defining model
var ProjectPlanModel = {
    __name: "ProjectPlan",
    
    generalNotes: "string",
    generalNotes_hint: "textare",
    
    projectTitle: "string", 
    communityOrOrganizationName: "string",
    projectTopic: "string"
    
   
};


var ProjectPlanModel2 = {
        __name: "ProjectPlan",
        
        generalNotes: {
            fieldOf: "ProjectPlan",
            fieldID: "generalNotes",
            type: "string",
            displayType: "textarea",
            displayName: "Planning notes",
            prompt: "You can enter some general notes on planning in this project here.",
            reportName: "Some planning notes",
            help: "#generalNotes__help"
        },
        
        generalNotes_hint: "textare",
        
        projectTitle: "string", 
        communityOrOrganizationName: "string",
        projectTopic: "string"
        
       
    };


var fields = [
    // * Planning notes | You can enter some general notes on planning in this project here. [project_generalNotes_planning|textarea]
    {
        model: 'ProjectPlan',
        id: 'project_generalNates_planning',
        type: 'string',
        displayType: 'textarea',
        displayName: 'Planning notes',
        prompt: 'You can enter some general notes on planning in this project here.',
        // reportName: 'Some planning notes',
        help: 
            '#ProjectPlan__generalNotes__help This is some very long help ' + 
            'which extends to the next line' +
            'and then goes further and further and further on into <b>multiple</b> lines' +
            'and here is some more.',
        validators: [],
    }
];


buildmodel('ProjectPlan_generalNotes', 'ProjectPlan_funders');
buildmodel('ProjectPlan', fields);


/*



# Planning [page_planning|page|Project]

* In the planning phase of your PNI project, you will make decisions about how your project will proceed. [project_projectPlanningLabel|label]
You will think about your goals, your topic, your participants, and any opportunities and dangers you might encounter during the project.

* Planning notes | You can enter some general notes on planning in this project here. [project_generalNotes_planning|textarea]

## Enter project facts [page_projectFacts|page|Project]

* On this page you will enter some facts about your project. The information you enter here will appear in your reports. [project_projectFacts|label]

* Project title | What is the project's title? [project_title|text]
* Community/organization name | What is the name of your community or organization? [project_communityOrOrganizationName|text]
* Project topic | Enter a brief name for the project's primary topic. [project_topic|text]
* Project start and end | What are the project's starting and ending dates? [project_startAndEndDates|text]
* Project funders | Who is funding or otherwise supporting the project? [project_funders|textarea]
* Project facilitators | Who is facilitating the project? [project_facilitators|textarea]
* Report start text | Enter any other information you want to appear at the top of project reports. [project_reportStartText|textarea]
* Report end text | Enter any other information you want to appear at the bottom of project reports. [project_reportEndText|textarea]

## Answer PNI Planning questions [page_planningQuestionsDraft|page|Project]

* On this page you will answer some questions about your project's goals, relationships, focus, range, scope, and emphasis. [project_draftQuestionsLabel|label]
If you don't have good answers for these questions right now, don't worry; you will have a chance to work on these answers again later.

* Project goal | What is the goal of the project? Why are you doing it? [project_pniQuestions_goal_draft|textarea]
* Project relationships | What relationships are important to the project? [project_pniQuestions_relationships_draft|textarea]
* Project focus | What is the focus of the project? What is it about? [project_pniQuestions_focus_draft|textarea]
* Project range | What range(s) of experience will the project cover? [project_pniQuestions_range_draft|textarea]
* Project scope | What is the project's scope? (number of people, number of stories, number of questions about stories) [project_pniQuestions_scope_draft|textarea]
* Project emphasis | Which phases of PNI will be important to the project? (indicate most and least important phases) [project_pniQuestions_emphasis_draft|textarea]
*/


/*
---------- Original:

# Planning [page_planning|page|Project]

* In the planning phase of your PNI project, you will make decisions about how your project will proceed. [project_projectPlanningLabel|label]
You will think about your goals, your topic, your participants, and any opportunities and dangers you might encounter during the project.

* Planning notes | You can enter some general notes on planning in this project here. [project_generalNotes_planning|textarea]

## Enter project facts [page_projectFacts|page|Project]

* On this page you will enter some facts about your project. The information you enter here will appear in your reports. [project_projectFacts|label]

* Project title | What is the project's title? [project_title|text]
* Community/organization name | What is the name of your community or organization? [project_communityOrOrganizationName|text]
* Project topic | Enter a brief name for the project's primary topic. [project_topic|text]
* Project start and end | What are the project's starting and ending dates? [project_startAndEndDates|text]
* Project funders | Who is funding or otherwise supporting the project? [project_funders|textarea]
* Project facilitators | Who is facilitating the project? [project_facilitators|textarea]
* Report start text | Enter any other information you want to appear at the top of project reports. [project_reportStartText|textarea]
* Report end text | Enter any other information you want to appear at the bottom of project reports. [project_reportEndText|textarea]

## Answer PNI Planning questions [page_planningQuestionsDraft|page|Project]

* On this page you will answer some questions about your project's goals, relationships, focus, range, scope, and emphasis. [project_draftQuestionsLabel|label]
If you don't have good answers for these questions right now, don't worry; you will have a chance to work on these answers again later.

* Project goal | What is the goal of the project? Why are you doing it? [project_pniQuestions_goal_draft|textarea]
* Project relationships | What relationships are important to the project? [project_pniQuestions_relationships_draft|textarea]
* Project focus | What is the focus of the project? What is it about? [project_pniQuestions_focus_draft|textarea]
* Project range | What range(s) of experience will the project cover? [project_pniQuestions_range_draft|textarea]
* Project scope | What is the project's scope? (number of people, number of stories, number of questions about stories) [project_pniQuestions_scope_draft|textarea]
* Project emphasis | Which phases of PNI will be important to the project? (indicate most and least important phases) [project_pniQuestions_emphasis_draft|textarea]
*/