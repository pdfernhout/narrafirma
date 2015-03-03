define([

// ==================== SECTION page_dashboard Dashboard ==========================

// -------------  HEADER page_dashboard Dashboard page  ------------- 

{
  id: 'page_dashboard',
  displayName: 'Dashboard',
  displayType: 'page',
  isHeader: true,
  displayPage: 'page_dashboard',
  pageModel: 'ProjectModel' 
},
{
  id: 'project_mainDashboardLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'Welcome to NarraFirma. You can use this software to:\n<ul>\n<li>plan your Participatory Narrative Inquiry (PNI) project</li>\n<li>decide how you will collect stories</li>\n<li>write questions about stories</li>\n<li>plan group story sessions (and record what went on in them)</li>\n<li>collect or enter stories (and answers to questions)</li>\n<li>look at patterns in collected stories and answers</li>\n<li>build catalytic material</li>\n<li>plan sensemaking sessions (and record what went on in them)</li>\n<li>plan interventions (and record what went on in them)</li>\n<li>gather project feedback</li>\n<li>reflect on the project</li>\n<li>present the project to others</li>\n<li>preserve what you learned so you can use it on the next project</li>\n</ul>\n<p>Note: When finished, this page will bring together all of the dashboard pages from\nthe phases of the project.</p>',
  displayPage: 'page_dashboard',
  model: 'ProjectModel' 
},
{
  id: 'project_testImage',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'images/WWS_BookCover_front_small.png',
  displayType: 'image',
  displayName: undefined,
  displayPrompt: 'This software is a companion for the book "Working with Stories in  Your Community or Organization" by Cynthia F. Kurtz',
  displayPage: 'page_dashboard',
  model: 'ProjectModel' 
},

// ==================== SECTION page_planning Planning ==========================

// -------------  HEADER page_planning Planning page  ------------- 

{
  id: 'page_planning',
  displayName: 'Planning',
  displayType: 'page',
  isHeader: true,
  displayPage: 'page_planning',
  pageModel: 'ProjectModel' 
},
{
  id: 'project_projectPlanningLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'In the planning phase of your PNI project, you will make decisions about how your project will proceed.\nYou will think about your goals, your topic, your participants, and any opportunities and dangers you might encounter during the project.',
  displayPage: 'page_planning',
  model: 'ProjectModel' 
},
{
  id: 'project_generalNotes_planning',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Planning notes',
  displayPrompt: 'You can enter some general notes on planning in this project here.',
  displayPage: 'page_planning',
  model: 'ProjectModel' 
},

// -------------  PAGE page_projectFacts Enter project facts page  ------------- 

{
  id: 'page_projectFacts',
  displayName: 'Enter project facts',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_projectFacts',
  pageModel: 'ProjectModel' 
},
{
  id: 'project_projectFacts',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you will enter some facts about your project. The information you enter here will appear in your reports.',
  displayPage: 'page_projectFacts',
  model: 'ProjectModel' 
},
{
  id: 'project_title',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Project title',
  displayPrompt: 'What is the project\'s title?',
  displayPage: 'page_projectFacts',
  model: 'ProjectModel' 
},
{
  id: 'project_communityOrOrganizationName',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Community/organization name',
  displayPrompt: 'What is the name of your community or organization?',
  displayPage: 'page_projectFacts',
  model: 'ProjectModel' 
},
{
  id: 'project_topic',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Project topic',
  displayPrompt: 'Enter a brief name for the project\'s primary topic.',
  displayPage: 'page_projectFacts',
  model: 'ProjectModel' 
},
{
  id: 'project_startAndEndDates',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Project start and end',
  displayPrompt: 'What are the project\'s starting and ending dates?',
  displayPage: 'page_projectFacts',
  model: 'ProjectModel' 
},
{
  id: 'project_funders',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Project funders',
  displayPrompt: 'Who is funding or otherwise supporting the project?',
  displayPage: 'page_projectFacts',
  model: 'ProjectModel' 
},
{
  id: 'project_facilitators',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Project facilitators',
  displayPrompt: 'Who is facilitating the project?',
  displayPage: 'page_projectFacts',
  model: 'ProjectModel' 
},
{
  id: 'project_reportStartText',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Report start text',
  displayPrompt: 'Enter any other information you want to appear at the top of project reports.',
  displayPage: 'page_projectFacts',
  model: 'ProjectModel' 
},
{
  id: 'project_reportEndText',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Report end text',
  displayPrompt: 'Enter any other information you want to appear at the bottom of project reports.',
  displayPage: 'page_projectFacts',
  model: 'ProjectModel' 
},

// -------------  PAGE page_planningQuestionsDraft Answer PNI Planning questions page  ------------- 

{
  id: 'page_planningQuestionsDraft',
  displayName: 'Answer PNI Planning questions',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_planningQuestionsDraft',
  pageModel: 'ProjectModel' 
},
{
  id: 'project_draftQuestionsLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you will answer some questions about your project\'s goals, relationships, focus, range, scope, and emphasis.\nIf you don\'t have good answers for these questions right now, don\'t worry; you will have a chance to work on these answers again later.',
  displayPage: 'page_planningQuestionsDraft',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_goal_draft',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Project goal',
  displayPrompt: 'What is the goal of the project? Why are you doing it?',
  displayPage: 'page_planningQuestionsDraft',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_relationships_draft',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Project relationships',
  displayPrompt: 'What relationships are important to the project?',
  displayPage: 'page_planningQuestionsDraft',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_focus_draft',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Project focus',
  displayPrompt: 'What is the focus of the project? What is it about?',
  displayPage: 'page_planningQuestionsDraft',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_range_draft',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Project range',
  displayPrompt: 'What range(s) of experience will the project cover?',
  displayPage: 'page_planningQuestionsDraft',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_scope_draft',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Project scope',
  displayPrompt: 'What is the project\'s scope? (number of people, number of stories, number of questions about stories)',
  displayPage: 'page_planningQuestionsDraft',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_emphasis_draft',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Project emphasis',
  displayPrompt: 'Which phases of PNI will be important to the project? (indicate most and least important phases)',
  displayPage: 'page_planningQuestionsDraft',
  model: 'ProjectModel' 
},

// -------------  PAGE page_participantGroups Describe participant groups page  ------------- 

{
  id: 'page_participantGroups',
  displayName: 'Describe participant groups',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_participantGroups',
  pageModel: 'ProjectModel' 
},
{
  id: 'project_aboutParticipantGroups',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you will think about groups of participants you want to involve in your project.\nExamples might be: doctors and patients; staff and customers; natives, immigrants, and tourists.',
  displayPage: 'page_participantGroups',
  model: 'ProjectModel' 
},
{
  id: 'project_participantGroupsList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_addParticipantGroup',
  displayType: 'grid',
  displayName: 'Participant groups',
  displayPrompt: 'Please add participant groups in the list below (typically up to three groups).',
  displayPage: 'page_participantGroups',
  model: 'ProjectModel' 
},

// -------------  PAGE page_addParticipantGroup Participant group popup  ------------- 

{
  id: 'page_addParticipantGroup',
  displayName: 'Participant group',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_addParticipantGroup',
  pageModel: 'ParticipantGroupModel' 
},
// Generate model ParticipantGroupModel 

{
  id: 'participantGroup_name',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Name',
  displayPrompt: 'Please name this group of participants (for example, "doctors", "students", "staff").',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_description',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Description',
  displayPrompt: 'Please describe this group of participants.\nFor example, you might want to record any observations you have made about this group.\nWhat do you know about them?',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_detailsAboutParticipantGroup',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'Details for the participant group.',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_statusHeader',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'Status',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_status',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: 
   [ 'unknown',
     'very low',
     'low',
     'moderate',
     'high',
     'very high',
     'mixed' ],
  displayType: 'select',
  displayName: 'Status',
  displayPrompt: 'What is the status of these participants in the community or organization?',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_confidence',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: 
   [ 'unknown',
     'very low',
     'low',
     'medium',
     'high',
     'very high',
     'mixed' ],
  displayType: 'select',
  displayName: 'Self-confidence',
  displayPrompt: 'How much self-confidence do these participants have?',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_abilityHeader',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'Ability',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_time',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'very little', 'little', 'some', 'a lot', 'mixed' ],
  displayType: 'select',
  displayName: 'Free time',
  displayPrompt: 'How much free time do these participants have?',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_education',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: 
   [ 'unknown',
     'illiterate',
     'minimal',
     'moderate',
     'high',
     'very high',
     'mixed' ],
  displayType: 'select',
  displayName: 'Education level',
  displayPrompt: 'What is the education level of these participants?',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_physicalDisabilities',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'none', 'minimal', 'moderate', 'strong', 'mixed' ],
  displayType: 'select',
  displayName: 'Physical limitations',
  displayPrompt: 'Do these participants have physical limitations that will impact their participation?',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_emotionalImpairments',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'none', 'minimal', 'moderate', 'strong', 'mixed' ],
  displayType: 'select',
  displayName: 'Emotional limitations',
  displayPrompt: 'Do these participants have emotional impairments that will impact their participation (such as mental illness or traumatic stress)?',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_expectationsHeader',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'Expectations',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_performing',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: 
   [ 'unknown',
     'very unimportant',
     'somewhat unimportant',
     'somewhat important',
     'very important',
     'mixed' ],
  displayType: 'select',
  displayName: 'Performance',
  displayPrompt: 'For these participants, how important is performing well (with "high marks")?',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_conforming',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: 
   [ 'unknown',
     'very unimportant',
     'somewhat unimportant',
     'somewhat important',
     'very important',
     'mixed' ],
  displayType: 'select',
  displayName: 'Conformance',
  displayPrompt: 'For these participants, how important is conforming (to what is "normal" or expected)?',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_promoting',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: 
   [ 'unknown',
     'very unimportant',
     'somewhat unimportant',
     'somewhat important',
     'very important',
     'mixed' ],
  displayType: 'select',
  displayName: 'Self-promotion',
  displayPrompt: 'For these participants, how important is self-promotion (competing with others)?',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_venting',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: 
   [ 'unknown',
     'very unimportant',
     'somewhat unimportant',
     'somewhat important',
     'very important',
     'mixed' ],
  displayType: 'select',
  displayName: 'Speaking out',
  displayPrompt: 'For these participants, how important is speaking out (having a say, venting, sounding off)?',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_feelingsHeader',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'Feelings about the project',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_interest',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: 
   [ 'unknown',
     'very little',
     'a little',
     'some',
     'a lot',
     'extremely',
     'mixed' ],
  displayType: 'select',
  displayName: 'Motivated',
  displayPrompt: 'How motivated are these participants to participate in the project?',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_feelings_project',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'negative', 'neutral', 'positive', 'mixed' ],
  displayType: 'select',
  displayName: 'Feelings about project',
  displayPrompt: 'How are these participants likely to feel about the project?',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_feelings_facilitator',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'negative', 'neutral', 'positive', 'mixed' ],
  displayType: 'select',
  displayName: 'Feelings about you',
  displayPrompt: 'How do these participants feel about you?',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_feelings_stories',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'negative', 'neutral', 'positive', 'mixed' ],
  displayType: 'select',
  displayName: 'Feel about stories',
  displayPrompt: 'How do these participants feel about the idea of collecting stories?',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_topicHeader',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'Feelings about the topic',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_topic_feeling',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: 
   [ 'unknown',
     'strongly negative',
     'negative',
     'neutral',
     'positive',
     'strongly positive',
     'mixed' ],
  displayType: 'select',
  displayName: 'Experiences with topic',
  displayPrompt: 'What experiences have these participants had with the project\'s topic?',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_topic_private',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'very private', 'medium', 'not private', 'mixed' ],
  displayType: 'select',
  displayName: 'How private',
  displayPrompt: 'How private do these participants consider the topic to be?',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_topic_articulate',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'hard', 'medium', 'easy', 'mixed' ],
  displayType: 'select',
  displayName: 'Articulation',
  displayPrompt: 'How hard will it be for these participants to articulate their feelings about the topic?',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_topic_timeframe',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'hours', 'days', 'months', 'years', 'decades', 'mixed' ],
  displayType: 'select',
  displayName: 'Time period',
  displayPrompt: 'How long of a time period do you need these participants to look back on?',
  displayPage: 'page_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},

// -------------  PAGE page_aboutYou About you page  ------------- 

{
  id: 'page_aboutYou',
  displayName: 'About you',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_aboutYou',
  pageModel: 'Project.AboutYouModel' 
},
{
  id: 'aboutYou_youHeader',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'About you',
  displayPage: 'page_aboutYou',
  model: 'ProjectModel' 
},
{
  id: 'aboutYou_experience',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'none', 'a little', 'some', 'a lot' ],
  displayType: 'select',
  displayName: 'Experience',
  displayPrompt: 'How much experience do you have facilitating PNI projects?',
  displayPage: 'page_aboutYou',
  model: 'ProjectModel' 
},
{
  id: 'aboutYou_help',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'none', 'a little', 'some', 'a lot' ],
  displayType: 'select',
  displayName: 'Help',
  displayPrompt: 'How much help will you have carrying out this project?',
  displayPage: 'page_aboutYou',
  model: 'ProjectModel' 
},
{
  id: 'aboutYou_tech',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'none', 'a little', 'some', 'a lot' ],
  displayType: 'select',
  displayName: 'Technology',
  displayPrompt: 'How many technological resources will you have for carrying out this project?',
  displayPage: 'page_aboutYou',
  model: 'ProjectModel' 
},

// -------------  PAGE page_projectStories Tell project stories page  ------------- 

{
  id: 'page_projectStories',
  displayName: 'Tell project stories',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_projectStories',
  pageModel: 'ProjectModel' 
},
{
  id: 'project_projectStoriesList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_projectStory',
  displayType: 'grid',
  displayName: 'Project stories',
  displayPrompt: 'On this page you will tell yourself some stories about how your project might play out.\nThese "project stories" will help you think about how best to plan the project.',
  displayPage: 'page_projectStories',
  model: 'ProjectModel' 
},

// -------------  PAGE page_projectStory Project story popup  ------------- 

{
  id: 'page_projectStory',
  displayName: 'Project story',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_projectStory',
  pageModel: 'ProjectStoryModel' 
},
// Generate model ProjectStoryModel 

{
  id: 'projectStory_scenario',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: 
   [ 'ask me anything',
     'magic ears',
     'fly on the wall',
     'project aspects',
     'my own scenario type' ],
  displayType: 'select',
  displayName: 'Scenario',
  displayPrompt: 'Start by choosing a scenario for your project story.',
  displayPage: 'page_projectStory',
  model: 'ProjectStoryModel' 
},
{
  id: 'projectStory_outcome',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: 
   [ 'colossal success',
     'miserable failure',
     'acceptable outcome',
     'my own outcome' ],
  displayType: 'select',
  displayName: 'Outcome',
  displayPrompt: 'Now choose an outcome for your story.',
  displayPage: 'page_projectStory',
  model: 'ProjectStoryModel' 
},
{
  id: 'projectStory_text',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Story',
  displayPrompt: 'Now tell your project story as a future history (as though it has already happened).',
  displayPage: 'page_projectStory',
  model: 'ProjectStoryModel' 
},
{
  id: 'projectStory_name',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Name',
  displayPrompt: 'Please name your project story.',
  displayPage: 'page_projectStory',
  model: 'ProjectStoryModel' 
},
{
  id: 'projectStory_feelAbout',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Feel about',
  displayPrompt: 'How do you feel about this story?',
  displayPage: 'page_projectStory',
  model: 'ProjectStoryModel' 
},
{
  id: 'projectStory_surprise',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Surprised',
  displayPrompt: 'What surprised you about this story?',
  displayPage: 'page_projectStory',
  model: 'ProjectStoryModel' 
},
{
  id: 'projectStory_dangers',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Opportunities or dangers',
  displayPrompt: 'Describe any opportunities or dangers you see in this story.',
  displayPage: 'page_projectStory',
  model: 'ProjectStoryModel' 
},

// -------------  PAGE page_createProjectStoryElements Create project story elements page  ------------- 

{
  id: 'page_createProjectStoryElements',
  displayName: 'Create project story elements',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_createProjectStoryElements',
  pageModel: 'ProjectModel' 
},
{
  id: 'project_storyElementsInstructions',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'Here are some instructions on how to create story elements from your project stories.\nCreating story elements helps you think about what is going on in the stories you told.\nYou can enter your story elements on the next page.\n<ol>\n<li>Choose one or two types of story element (characters, situations, values, themes, relationships, motivations, beliefs, conflicts).</li>\n<li>For each story, come up with as many answers to that element\'s question as you can. Write the answers on sticky notes.</li>\n<li>The questions are:</li>\n<ul>\n<li>Characters: Who is doing things in this story?</li>\n<li>Situations: What is going on in this story?</li>\n<li>Values: What matters to the characters in this story?</li>\n<li>Themes: What is this story about?</li>\n<li>Relationships: How are the characters related in this story?</li>\n<li>Motivations: Why do the characters do what they do in this story?</li>\n<li>Beliefs: What do people believe in this story?</li>\n<li>Conflicts: Who or what stands in opposition in this story?</li>\n</ul>\n<li>Once you have answered the question(s) you chose for each story, cluster the sticky notes into groups. Place like with like.</li>\n<li>Give each group of sticky notes a name.</li>\n<li>Clear a "halo" of space around each group\'s name.</li>\n<li>In the halo, write 2-5 good and bad attributes (advantages and disadvantages, opportunities and dangers) of each group of sticky notes.</li>\n<li>Copy or move the new good/bad attributes to a new space. Mix them all together.</li>\n<li>Cluster the attributes into groups.</li>\n<li>Name the groups. These are your story elements.</li>\n<li>You can enter your story elements on the next page.</li>\n</ol>',
  displayPage: 'page_createProjectStoryElements',
  model: 'ProjectModel' 
},
{
  id: 'project_projectStoryElementsAnswersClusteringDiagram',
  dataType: 'object',
  required: true,
  validators: undefined,
  options: 'project_storyElementsAnswersClusteringDiagram',
  displayType: 'clusteringDiagram',
  displayName: undefined,
  displayPrompt: 'You can work on a clustering diagram here:',
  displayPage: 'page_createProjectStoryElements',
  model: 'ProjectModel' 
},

// -------------  PAGE page_enterProjectStoryElements Enter project story elements page  ------------- 

{
  id: 'page_enterProjectStoryElements',
  displayName: 'Enter project story elements',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_enterProjectStoryElements',
  pageModel: 'ProjectModel' 
},
{
  id: 'project_projectStoryElementsList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_addStoryElement',
  displayType: 'grid',
  displayName: 'Story elements',
  displayPrompt: 'On this page you can enter the story elements you created on the previous page.',
  displayPage: 'page_enterProjectStoryElements',
  model: 'ProjectModel' 
},

// -------------  PAGE page_addStoryElement Add story element popup  ------------- 

{
  id: 'page_addStoryElement',
  displayName: 'Add story element',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_addStoryElement',
  pageModel: 'StoryElementModel' 
},
// Generate model StoryElementModel 

{
  id: 'storyElement_name',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Name',
  displayPrompt: 'What is the name of the story element?',
  displayPage: 'page_addStoryElement',
  model: 'StoryElementModel' 
},
{
  id: 'storyElement_type',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: 
   [ 'character',
     'situation',
     'value',
     'theme',
     'relationship',
     'motivation',
     'belief',
     'conflict' ],
  displayType: 'select',
  displayName: 'Type',
  displayPrompt: 'What type of story element is this?',
  displayPage: 'page_addStoryElement',
  model: 'StoryElementModel' 
},
{
  id: 'storyElement_description',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Description',
  displayPrompt: 'You can describe the story element more fully here.',
  displayPage: 'page_addStoryElement',
  model: 'StoryElementModel' 
},

// -------------  PAGE page_assessStorySharing Assess story sharing page  ------------- 

{
  id: 'page_assessStorySharing',
  displayName: 'Assess story sharing',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_assessStorySharing',
  pageModel: 'Project.AssessmentModel' 
},
{
  id: 'assessment_intro',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you can answer questions about your community or organization to assess its story sharing culture.\nBefore you answer these questions, you should spend some time listening to people share stories together\nin the places where they normally gather.',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_narrativeFreedom',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'Narrative freedom',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_counterStories',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'never', 'seldom', 'sometimes', 'often' ],
  displayType: 'select',
  displayName: 'Countering',
  displayPrompt: 'As you listened to people talk, how often did you hear a person respond to a story with another story that countered it in some way?',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_authority',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: 
   [ 'unknown',
     'enthrallment',
     'strong listening',
     'partial listening',
     'nothing special' ],
  displayType: 'select',
  displayName: 'Authority',
  displayPrompt: 'When someone who was obviously in authority was telling stories, how much time and attention did they get?',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_mistakes',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'never', 'seldom', 'sometimes', 'often' ],
  displayType: 'select',
  displayName: 'Mistakes',
  displayPrompt: 'How many times did you hear people tell stories about mistakes?',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_silencing',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'warning', 'caution', 'request', 'joke' ],
  displayType: 'select',
  displayName: 'Stepping in',
  displayPrompt: 'When somebody started telling a story and another person stopped them, how did they stop them?',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_conflict',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'demand', 'criticism', 'comment', 'joke' ],
  displayType: 'select',
  displayName: 'Disagreement',
  displayPrompt: 'When somebody was telling a story and another person disagreed with the storyteller, how did they disagree?',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_narrativeFlow',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'Narrative flow',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_remindings',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'never', 'seldom', 'sometimes', 'often' ],
  displayType: 'select',
  displayName: 'Reminding',
  displayPrompt: 'When you listened to people telling stories, did you ever hear people say "that reminds me of the time" and then tell a story in response?',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_retellings',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'never', 'seldom', 'sometimes', 'often' ],
  displayType: 'select',
  displayName: 'Passing on stories',
  displayPrompt: 'How often did you hear people pass on stories they heard from other people?',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_folklore',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'none', 'little', 'some', 'strong' ],
  displayType: 'select',
  displayName: 'Folklore',
  displayPrompt: 'How much evidence did you find for a narrative folklore in your community or organization?',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_storyTypes',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'no', 'maybe', 'I think so', 'definitely' ],
  displayType: 'select',
  displayName: 'Story types',
  displayPrompt: 'Did you hear comic stories, tragic stories, epic stories, and funny stories?',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_sensemaking',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'never', 'seldom', 'sometimes', 'often' ],
  displayType: 'select',
  displayName: 'Decision making',
  displayPrompt: 'Did you ever see people share stories as they prepared to make decisions?',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_narrativeKnowledge',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'Narrative knowledge',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_realStories',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'never', 'seldom', 'sometimes', 'often' ],
  displayType: 'select',
  displayName: 'Recountings of events',
  displayPrompt: 'Did you see people tell stories that were recountings of events based on emotional experiences from particular perspectives?',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_negotiations',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'never', 'seldom', 'sometimes', 'often' ],
  displayType: 'select',
  displayName: 'Vitality',
  displayPrompt: 'How lively were the negotiations you heard going on between storytellers and audiences?',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_cotelling',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'never', 'seldom', 'sometimes', 'often' ],
  displayType: 'select',
  displayName: 'Sharing storytelling',
  displayPrompt: 'Did you ever see two or more people tell a story together?',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_blunders',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'often', 'sometimes', 'seldom', 'never' ],
  displayType: 'select',
  displayName: 'Blunders',
  displayPrompt: 'How often did you see someone start telling the wrong story to the wrong people at the wrong time?',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_accounting',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'never', 'seldom', 'sometimes', 'often' ],
  displayType: 'select',
  displayName: 'Accountability',
  displayPrompt: 'Did you see people account for their actions and choices by telling each other stories?',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_narrativeUnity',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'Narrative unity',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_commonStories',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'impossible', 'difficult', 'doable', 'easy' ],
  displayType: 'select',
  displayName: 'Common stories',
  displayPrompt: 'How easy would it be to create a list of stories any member of your community or organization could be expected to know?',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_sacredStories',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'impossible', 'difficult', 'doable', 'easy' ],
  displayType: 'select',
  displayName: 'Sacred stories',
  displayPrompt: 'How easy would it be to create a list of sacred stories, those important to understanding the community or organization?',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_condensedStories',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'impossible', 'difficult', 'doable', 'easy' ],
  displayType: 'select',
  displayName: 'Condensed stories',
  displayPrompt: 'How easy would it be to create a list of condensed stories, in the form of proverbs or references?',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_intermingling',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'never', 'seldom', 'sometimes', 'often' ],
  displayType: 'select',
  displayName: 'Intermingling',
  displayPrompt: 'How often were the stories you heard intermingled with each other?',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_culture',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'unknown', 'impossible', 'difficult', 'doable', 'easy' ],
  displayType: 'select',
  displayName: 'Culture',
  displayPrompt: 'How easy would it be to describe the unique storytelling culture of your community or organization?',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_result_header',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'Narrative score results',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_result_freedomSubscore',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 
   [ 'assessment_counterStories',
     'assessment_authority',
     'assessment_mistakes',
     'assessment_silencing',
     'assessment_conflict' ],
  displayType: 'quizScoreResult',
  displayName: undefined,
  displayPrompt: 'Narrative freedom subscore:',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_result_flowSubscore',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 
   [ 'assessment_remindings',
     'assessment_retellings',
     'assessment_folklore',
     'assessment_storyTypes',
     'assessment_sensemaking' ],
  displayType: 'quizScoreResult',
  displayName: undefined,
  displayPrompt: 'Narrative flow subscore:',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_result_knowledgeSubscore',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 
   [ 'assessment_realStories',
     'assessment_negotiations',
     'assessment_cotelling',
     'assessment_blunders',
     'assessment_accounting' ],
  displayType: 'quizScoreResult',
  displayName: undefined,
  displayPrompt: 'Narrative knowledge subscore:',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_result_unitySubscore',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 
   [ 'assessment_commonStories',
     'assessment_sacredStories',
     'assessment_condensedStories',
     'assessment_intermingling',
     'assessment_culture' ],
  displayType: 'quizScoreResult',
  displayName: undefined,
  displayPrompt: 'Narrative unity subscore:',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_result_grandTotal',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 
   [ 'assessment_counterStories',
     'assessment_authority',
     'assessment_mistakes',
     'assessment_silencing',
     'assessment_conflict',
     'assessment_remindings',
     'assessment_retellings',
     'assessment_folklore',
     'assessment_storyTypes',
     'assessment_sensemaking',
     'assessment_realStories',
     'assessment_negotiations',
     'assessment_cotelling',
     'assessment_blunders',
     'assessment_accounting',
     'assessment_commonStories',
     'assessment_sacredStories',
     'assessment_condensedStories',
     'assessment_intermingling',
     'assessment_culture' ],
  displayType: 'quizScoreResult',
  displayName: undefined,
  displayPrompt: 'This is your combined test result:',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_notes',
  dataType: 'string',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Notes',
  displayPrompt: 'Here you can record some notes or comments about this assessment.',
  displayPage: 'page_assessStorySharing',
  model: 'ProjectModel' 
},

// -------------  PAGE page_revisePNIPlanningQuestions Revise PNI Planning questions page  ------------- 

{
  id: 'page_revisePNIPlanningQuestions',
  displayName: 'Revise PNI Planning questions',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_revisePNIPlanningQuestions',
  pageModel: 'ProjectModel' 
},
{
  id: 'project_improvePlanningDrafts',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you can review and improve your draft answers to the PNI planning questions\nbased on your consideration of project aspects and your project stories.',
  displayPage: 'page_revisePNIPlanningQuestions',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_copyDraftsButton',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'copyDraftPNIQuestionVersionsIntoAnswers',
  displayType: 'button',
  displayName: undefined,
  displayPrompt: 'Copy the original draft versions into any corresponding empty answer fields below',
  displayPage: 'page_revisePNIPlanningQuestions',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_goal_final',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Project goal',
  displayPrompt: 'What is the goal of the project? Why are you doing it?',
  displayPage: 'page_revisePNIPlanningQuestions',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_relationships_final',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Project relationships',
  displayPrompt: 'What relationships are important to the project?',
  displayPage: 'page_revisePNIPlanningQuestions',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_focus_final',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Project focus',
  displayPrompt: 'What is the focus of the project? What is it about?',
  displayPage: 'page_revisePNIPlanningQuestions',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_range_final',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Project range',
  displayPrompt: 'What range(s) of experience will the project cover?',
  displayPage: 'page_revisePNIPlanningQuestions',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_scope_final',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Project scope',
  displayPrompt: 'What is the project\'s scope? (number of people, number of stories, number of questions about stories)',
  displayPage: 'page_revisePNIPlanningQuestions',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_emphasis_final',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Project emphasis',
  displayPrompt: 'Which phases of PNI will be important to the project? (indicate most and least important phases)',
  displayPage: 'page_revisePNIPlanningQuestions',
  model: 'ProjectModel' 
},

// -------------  PAGE page_writeProjectSynopsis Write project synopsis page  ------------- 

{
  id: 'page_writeProjectSynopsis',
  displayName: 'Write project synopsis',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_writeProjectSynopsis',
  pageModel: 'ProjectModel' 
},
{
  id: 'project_synopsis',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Project synopsis',
  displayPrompt: 'On this page you can write your project synopsis, a one or two sentence summary of what matters most about your project.',
  displayPage: 'page_writeProjectSynopsis',
  model: 'ProjectModel' 
},

// -------------  PAGE page_readPlanningReport Read planning report page  ------------- 

{
  id: 'page_readPlanningReport',
  displayName: 'Read planning report',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_readPlanningReport',
  pageModel: 'ProjectModel' 
},
{
  id: 'project_readPlanningReportIntroductionLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'This report shows all of the information entered in the pages grouped under "Planning."',
  displayPage: 'page_readPlanningReport',
  model: 'ProjectModel' 
},
{
  id: 'project_planningReport',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'planning',
  displayType: 'report',
  displayName: undefined,
  displayPrompt: 'Project planning report',
  displayPage: 'page_readPlanningReport',
  model: 'ProjectModel' 
},

// ==================== SECTION page_collectionDesign Collection design ==========================

// -------------  HEADER page_collectionDesign Collection design page  ------------- 

{
  id: 'page_collectionDesign',
  displayName: 'Collection design',
  displayType: 'page',
  isHeader: true,
  displayPage: 'page_collectionDesign',
  pageModel: 'ProjectModel' 
},
{
  id: 'project_collectionDesignStartLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'In the collection design phase of your PNI project, you will decide on story collection venues,\ncreate some story eliciting and story interpretation questions, design your story collection form, and plan any story collection sessions you want to hold.',
  displayPage: 'page_collectionDesign',
  model: 'ProjectModel' 
},
{
  id: 'project_generalNotes_collectionDesign',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Collection design notes',
  displayPrompt: 'You can enter some general notes on collection design in this project here.',
  displayPage: 'page_collectionDesign',
  model: 'ProjectModel' 
},

// -------------  PAGE page_chooseCollectionVenues Choose collection venues page  ------------- 

{
  id: 'page_chooseCollectionVenues',
  displayName: 'Choose collection venues',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_chooseCollectionVenues',
  pageModel: 'ProjectModel' 
},
{
  id: 'project_venuesIntro',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you will plan your story collection venues, or the ways you will collect stories.',
  displayPage: 'page_chooseCollectionVenues',
  model: 'ProjectModel' 
},
{
  id: 'SPECIAL_venueRecommendations',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'Venues',
  displayType: 'recommendationTable',
  displayName: undefined,
  displayPrompt: 'Venue recommendations',
  displayPage: 'page_chooseCollectionVenues',
  model: 'ProjectModel' 
},
{
  id: 'project_venuesList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_addVenue',
  displayType: 'grid',
  displayName: 'Story collection venues',
  displayPrompt: 'These are the ways you will be collecting stories.',
  displayPage: 'page_chooseCollectionVenues',
  model: 'ProjectModel' 
},

// -------------  PAGE page_addVenue Plan story collection venue popup  ------------- 

{
  id: 'page_addVenue',
  displayName: 'Plan story collection venue',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_addVenue',
  pageModel: 'VenuePlanModel' 
},
// Generate model VenueModel 

{
  id: 'venue_name',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Name',
  displayPrompt: 'Please give this venue plan a name.',
  displayPage: 'page_addVenue',
  model: 'VenueModel' 
},
{
  id: 'venue_primary_type',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: 
   [ 'individual interviews',
     'group interviews',
     'peer interviews',
     'group story sessions',
     'surveys',
     'journals',
     'narrative incident reports',
     'gleaned stories',
     'other' ],
  displayType: 'select',
  displayName: 'Type',
  displayPrompt: 'Choose a primary means of story collection for this venue.',
  displayPage: 'page_addVenue',
  model: 'VenueModel' 
},
{
  id: 'venue_participantGroups',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Participants',
  displayPrompt: 'Which group(s) of participants will tell stories in this venue?',
  displayPage: 'page_addVenue',
  model: 'VenueModel' 
},
{
  id: 'venue_timeline',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Timeline',
  displayPrompt: 'What is your timeline for collecting stories using this venue?',
  displayPage: 'page_addVenue',
  model: 'VenueModel' 
},
{
  id: 'venue_locations',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Locations',
  displayPrompt: 'In what locations will stories be collected?',
  displayPage: 'page_addVenue',
  model: 'VenueModel' 
},
{
  id: 'venue_help',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Help',
  displayPrompt: 'Will anyone be helping to collect stories? What are your plans for organizing your help?',
  displayPage: 'page_addVenue',
  model: 'VenueModel' 
},
{
  id: 'venue_resources',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Technology',
  displayPrompt: 'What technologies, if any, will you use to collect stories?',
  displayPage: 'page_addVenue',
  model: 'VenueModel' 
},
{
  id: 'venue_description',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Other',
  displayPrompt: 'Describe any other details of your story collection plans for this venue.',
  displayPage: 'page_addVenue',
  model: 'VenueModel' 
},

// -------------  PAGE page_writeStoryElicitingQuestions Write story eliciting questions page  ------------- 

{
  id: 'page_writeStoryElicitingQuestions',
  displayName: 'Write story eliciting questions',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_writeStoryElicitingQuestions',
  pageModel: 'ProjectModel' 
},
{
  id: 'project_elicitingQuestionsLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you will design the eliciting questions you use to ask people to tell stories.\nYou need at least one question for people to answer. Giving people more than one question to choose from\nis recommended.',
  displayPage: 'page_writeStoryElicitingQuestions',
  model: 'ProjectModel' 
},
{
  id: 'project_elicitingQuestionsList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_addElicitingQuestion',
  displayType: 'grid',
  displayName: 'Story eliciting questions',
  displayPrompt: 'These are the questions you will be asking.',
  displayPage: 'page_writeStoryElicitingQuestions',
  model: 'ProjectModel' 
},
{
  id: 'SPECIAL_elicitingQuestionRecommendations',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'Eliciting questions',
  displayType: 'recommendationTable',
  displayName: undefined,
  displayPrompt: 'Recommendations for eliciting questions',
  displayPage: 'page_writeStoryElicitingQuestions',
  model: 'ProjectModel' 
},

// -------------  PAGE page_addElicitingQuestion Add story eliciting question popup  ------------- 

{
  id: 'page_addElicitingQuestion',
  displayName: 'Add story eliciting question',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_addElicitingQuestion',
  pageModel: 'ElicitingQuestionModel' 
},
// Generate model ElicitingQuestionModel 

{
  id: 'elicitingQuestion_text',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Question',
  displayPrompt: 'Enter a story-eliciting question.',
  displayPage: 'page_addElicitingQuestion',
  model: 'ElicitingQuestionModel' 
},
{
  id: 'elicitingQuestion_shortName',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Short Name',
  displayPrompt: 'Enter a short name for this story-eliciting question to use as a reference to it.',
  displayPage: 'page_addElicitingQuestion',
  model: 'ElicitingQuestionModel' 
},
{
  id: 'elicitingQuestion_type',
  dataType: 'dictionary',
  required: false,
  validators: undefined,
  options: 
   [ 'what happened',
     'directed question',
     'undirected questions',
     'point in time',
     'event',
     'extreme',
     'surprise',
     'people, places, things',
     'fictional scenario',
     'other' ],
  displayType: 'checkboxes',
  displayName: 'Type',
  displayPrompt: 'What type of question is this?',
  displayPage: 'page_addElicitingQuestion',
  model: 'ElicitingQuestionModel' 
},
{
  id: 'SPECIAL_templates_elicitingQuestions',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'elicitationQuestions',
  displayType: 'templateList',
  displayName: undefined,
  displayPrompt: 'You can copy a question from this list.',
  displayPage: 'page_addElicitingQuestion',
  model: 'ElicitingQuestionModel' 
},

// -------------  PAGE page_writeQuestionsAboutStories Write questions about stories page  ------------- 

{
  id: 'page_writeQuestionsAboutStories',
  displayName: 'Write questions about stories',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_writeQuestionsAboutStories',
  pageModel: 'ProjectModel' 
},
{
  id: 'project_storyQuestionsLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you will write your questions to ask people about their stories.',
  displayPage: 'page_writeQuestionsAboutStories',
  model: 'ProjectModel' 
},
{
  id: 'project_storyQuestionsList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_addStoryQuestion',
  displayType: 'grid',
  displayName: 'Questions about stories',
  displayPrompt: 'These are the questions you will be asking about stories.',
  displayPage: 'page_writeQuestionsAboutStories',
  model: 'ProjectModel' 
},
{
  id: 'SPECIAL_storyQuestionRecommendations',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'storyQuestions',
  displayType: 'recommendationTable',
  displayName: undefined,
  displayPrompt: 'Recommendations for story questions',
  displayPage: 'page_writeQuestionsAboutStories',
  model: 'ProjectModel' 
},

// -------------  PAGE page_addStoryQuestion Add story question popup  ------------- 

{
  id: 'page_addStoryQuestion',
  displayName: 'Add story question',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_addStoryQuestion',
  pageModel: 'StoryQuestionModel' 
},
// Generate model StoryQuestionModel 

{
  id: 'storyQuestion_text',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Question',
  displayPrompt: 'Enter a question to ask people about their stories.',
  displayPage: 'page_addStoryQuestion',
  model: 'StoryQuestionModel' 
},
{
  id: 'storyQuestion_type',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: 
   [ 'boolean',
     'label',
     'header',
     'checkbox',
     'checkboxes',
     'text',
     'textarea',
     'select',
     'radiobuttons',
     'slider' ],
  displayType: 'select',
  displayName: 'Type',
  displayPrompt: 'What type of question is this?\nThe question types are:\n<ul>\n<li>boolean: yes and no choices</li>\n<li>label: not a question, just text</li>\n<li>header: same as a label, only in bold</li>\n<li>checkbox: one check box (enter label in options)</li>\n<li>checkboxes: a series of checkboxes (enter label in options)</li>\n<li>text: a one-line free text field</li>\n<li>textarea: a multi-line free text field</li>\n<li>select: a drop-down box (enter choices in options)</li>\n<li>radiobuttons: a set of mutually-exclusive radio buttons (enter choices in options)</li>\n<li>slider: a range from 0 to 100 (enter end labels in options)</li>\n</ul>',
  displayPage: 'page_addStoryQuestion',
  model: 'StoryQuestionModel' 
},
{
  id: 'storyQuestion_shortName',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Short name',
  displayPrompt: 'Enter a short name we can use to refer to the question. (It must be unique within the project.)',
  displayPage: 'page_addStoryQuestion',
  model: 'StoryQuestionModel' 
},
{
  id: 'storyQuestion_options',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Options',
  displayPrompt: 'If your question requires choices, enter them here (one per line).',
  displayPage: 'page_addStoryQuestion',
  model: 'StoryQuestionModel' 
},
{
  id: 'storyQuestion_help',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Help',
  displayPrompt: 'If you want to provide popup help to people answering the question, enter it here.',
  displayPage: 'page_addStoryQuestion',
  model: 'StoryQuestionModel' 
},
{
  id: 'SPECIAL_templates_storyQuestions',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'storyQuestions',
  displayType: 'templateList',
  displayName: undefined,
  displayPrompt: 'You can copy a question from this list.',
  displayPage: 'page_addStoryQuestion',
  model: 'StoryQuestionModel' 
},

// -------------  PAGE page_writeQuestionsAboutParticipants Write questions about participants page  ------------- 

{
  id: 'page_writeQuestionsAboutParticipants',
  displayName: 'Write questions about participants',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_writeQuestionsAboutParticipants',
  pageModel: 'ProjectModel' 
},
{
  id: 'project_participantQuestionsLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you will write questions to ask people about themselves.',
  displayPage: 'page_writeQuestionsAboutParticipants',
  model: 'ProjectModel' 
},
{
  id: 'project_participantQuestionsList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_addParticipantQuestion',
  displayType: 'grid',
  displayName: 'Questions about people',
  displayPrompt: 'These are the questions you will be asking people about themselves.',
  displayPage: 'page_writeQuestionsAboutParticipants',
  model: 'ProjectModel' 
},
{
  id: 'SPECIAL_participantQuestionRecommendations',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'participantQuestions',
  displayType: 'recommendationTable',
  displayName: undefined,
  displayPrompt: 'Recommendations for participant questions',
  displayPage: 'page_writeQuestionsAboutParticipants',
  model: 'ProjectModel' 
},

// -------------  PAGE page_addParticipantQuestion Add participant question popup  ------------- 

{
  id: 'page_addParticipantQuestion',
  displayName: 'Add participant question',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_addParticipantQuestion',
  pageModel: 'ParticipantQuestionModel' 
},
// Generate model ParticipantQuestionModel 

{
  id: 'participantQuestion_text',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Question',
  displayPrompt: 'Enter a question to ask people about themselves.',
  displayPage: 'page_addParticipantQuestion',
  model: 'ParticipantQuestionModel' 
},
{
  id: 'participantQuestion_type',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: 
   [ 'boolean',
     'label',
     'header',
     'checkbox',
     'checkboxes',
     'text',
     'textarea',
     'select',
     'radiobuttons',
     'slider' ],
  displayType: 'select',
  displayName: 'Type',
  displayPrompt: 'What type of question is this?',
  displayPage: 'page_addParticipantQuestion',
  model: 'ParticipantQuestionModel' 
},
{
  id: 'participantQuestion_shortName',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Short name',
  displayPrompt: 'Enter a short name we can use to refer to the question. (It must be unique within the project.)',
  displayPage: 'page_addParticipantQuestion',
  model: 'ParticipantQuestionModel' 
},
{
  id: 'participantQuestion_options',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Options',
  displayPrompt: 'If your question has choices, enter them here (one per line).',
  displayPage: 'page_addParticipantQuestion',
  model: 'ParticipantQuestionModel' 
},
{
  id: 'participantQuestion_help',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Help',
  displayPrompt: 'If you want to provide help to people answering the question, enter it here.',
  displayPage: 'page_addParticipantQuestion',
  model: 'ParticipantQuestionModel' 
},
{
  id: 'SPECIAL_templates_participantQuestions',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'participantQuestions',
  displayType: 'templateList',
  displayName: undefined,
  displayPrompt: 'You can copy a question from this list.',
  displayPage: 'page_addParticipantQuestion',
  model: 'ParticipantQuestionModel' 
},

// -------------  PAGE page_designQuestionForm Design question form page  ------------- 

{
  id: 'page_designQuestionForm',
  displayName: 'Design question form',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_designQuestionForm',
  pageModel: 'Project.QuestionFormModel' 
},
{
  id: 'questionForm_Label',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you will add any information you want to place on your question form other than the questions on it.',
  displayPage: 'page_designQuestionForm',
  model: 'ProjectModel' 
},
{
  id: 'questionForm_title',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Title',
  displayPrompt: 'Please enter a title for the question form.',
  displayPage: 'page_designQuestionForm',
  model: 'ProjectModel' 
},
{
  id: 'questionForm_image',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Image',
  displayPrompt: 'You can link to a logo or other image to show at the top of the form.',
  displayPage: 'page_designQuestionForm',
  model: 'ProjectModel' 
},
{
  id: 'questionForm_startText',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Introduction',
  displayPrompt: 'Please enter an introduction to be shown at the start of the form, after the title.',
  displayPage: 'page_designQuestionForm',
  model: 'ProjectModel' 
},
{
  id: 'questionForm_endText',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'End of form text',
  displayPrompt: 'Please enter any text to be shown at the end of the form.',
  displayPage: 'page_designQuestionForm',
  model: 'ProjectModel' 
},

// -------------  PAGE page_planStoryCollectionSessions Plan story collection sessions page  ------------- 

{
  id: 'page_planStoryCollectionSessions',
  displayName: 'Plan story collection sessions',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_planStoryCollectionSessions',
  pageModel: 'ProjectModel' 
},
{
  id: 'project_collectionSessionsLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you will design group sessions in which you will collect stories.\nIf you don\'t plan to collect stories using group sessions, you can skip this page.',
  displayPage: 'page_planStoryCollectionSessions',
  model: 'ProjectModel' 
},
{
  id: 'SPECIAL_collectionSessionRecommendations',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'collectionSessions',
  displayType: 'recommendationTable',
  displayName: undefined,
  displayPrompt: 'Recommendations for story collection sessions',
  displayPage: 'page_planStoryCollectionSessions',
  model: 'ProjectModel' 
},
{
  id: 'project_collectionSessionPlansList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_addStoryCollectionSession',
  displayType: 'grid',
  displayName: 'Story collection session plans',
  displayPrompt: 'Plans for story collection sessions lay out what you will do and how.\nEach plan can be used in multiple sessions.',
  displayPage: 'page_planStoryCollectionSessions',
  model: 'ProjectModel' 
},

// -------------  PAGE page_addStoryCollectionSession Design story collection session popup  ------------- 

{
  id: 'page_addStoryCollectionSession',
  displayName: 'Design story collection session',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_addStoryCollectionSession',
  pageModel: 'CollectionSessionPlanModel' 
},
// Generate model StoryCollectionSessionModel 

{
  id: 'collectionSessionPlan_name',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Name',
  displayPrompt: 'Please give this session plan a name.',
  displayPage: 'page_addStoryCollectionSession',
  model: 'StoryCollectionSessionModel' 
},
{
  id: 'collectionSessionPlan_groups',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Participant groups',
  displayPrompt: 'From which participant groups will people be invited?',
  displayPage: 'page_addStoryCollectionSession',
  model: 'StoryCollectionSessionModel' 
},
{
  id: 'collectionSessionPlan_repetitions',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Repetitions',
  displayPrompt: 'How many repetitions of the session will there be?',
  displayPage: 'page_addStoryCollectionSession',
  model: 'StoryCollectionSessionModel' 
},
{
  id: 'collectionSessionPlan_duration',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Length',
  displayPrompt: 'How long will each session be?',
  displayPage: 'page_addStoryCollectionSession',
  model: 'StoryCollectionSessionModel' 
},
{
  id: 'collectionSessionPlan_times',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Time',
  displayPrompt: 'At what dates and times will these sessions take place?',
  displayPage: 'page_addStoryCollectionSession',
  model: 'StoryCollectionSessionModel' 
},
{
  id: 'collectionSessionPlan_location',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Location',
  displayPrompt: 'Where will these sessions take place?',
  displayPage: 'page_addStoryCollectionSession',
  model: 'StoryCollectionSessionModel' 
},
{
  id: 'collectionSessionPlan_numPeople',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Number of people',
  displayPrompt: 'How many people will be invited to each repetition of this session?',
  displayPage: 'page_addStoryCollectionSession',
  model: 'StoryCollectionSessionModel' 
},
{
  id: 'collectionSessionPlan_materials',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Materials',
  displayPrompt: 'What materials will this session require?',
  displayPage: 'page_addStoryCollectionSession',
  model: 'StoryCollectionSessionModel' 
},
{
  id: 'collectionSessionPlan_details',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Other',
  displayPrompt: 'Enter other details about this session.',
  displayPage: 'page_addStoryCollectionSession',
  model: 'StoryCollectionSessionModel' 
},
{
  id: 'collectionSessionPlan_activitiesList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_addCollectionSessionActivity',
  displayType: 'grid',
  displayName: 'Story collection activities',
  displayPrompt: 'Here you can enter some activities you plan for the session.\nActivities within story collection sessions can be simple instructions or complicated exercises (like the creation of timelines).',
  displayPage: 'page_addStoryCollectionSession',
  model: 'StoryCollectionSessionModel' 
},
{
  id: 'collectionSessionPlan_printCollectionSessionAgendaButton',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'button',
  displayName: undefined,
  displayPrompt: 'Print session agenda',
  displayPage: 'page_addStoryCollectionSession',
  model: 'StoryCollectionSessionModel' 
},

// -------------  PAGE page_addCollectionSessionActivity Add story collection session activity popup  ------------- 

{
  id: 'page_addCollectionSessionActivity',
  displayName: 'Add story collection session activity',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_addCollectionSessionActivity',
  pageModel: 'CollectionSessionActivityModel' 
},
// Generate model CollectionSessionActivityModel 

{
  id: 'collectionSessionActivity_name',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Name',
  displayPrompt: 'Please give this activity a name.',
  displayPage: 'page_addCollectionSessionActivity',
  model: 'CollectionSessionActivityModel' 
},
{
  id: 'collectionSessionActivity_type',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: 
   [ 'ice-breaker',
     'sharing stories (no task)',
     'sharing stories (simple task)',
     'discussing stories',
     'twice-told stories exercise',
     'timeline exercise',
     'landscape exercise',
     'my own exercise',
     'other' ],
  displayType: 'select',
  displayName: 'Type',
  displayPrompt: 'What type of activity is this?',
  displayPage: 'page_addCollectionSessionActivity',
  model: 'CollectionSessionActivityModel' 
},
{
  id: 'collectionSessionActivity_plan',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Plan',
  displayPrompt: 'Describe the plan for this activity.',
  displayPage: 'page_addCollectionSessionActivity',
  model: 'CollectionSessionActivityModel' 
},
{
  id: 'collectionSessionActivity_optionalParts',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Optional elaborations',
  displayPrompt: 'Describe any optional elaborations you might or might not use in this activity.',
  displayPage: 'page_addCollectionSessionActivity',
  model: 'CollectionSessionActivityModel' 
},
{
  id: 'collectionSessionActivity_duration',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Length',
  displayPrompt: 'How long will this activity take?',
  displayPage: 'page_addCollectionSessionActivity',
  model: 'CollectionSessionActivityModel' 
},
{
  id: 'collectionSessionActivity_recording',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Recording',
  displayPrompt: 'How will stories be recorded during this activity?',
  displayPage: 'page_addCollectionSessionActivity',
  model: 'CollectionSessionActivityModel' 
},
{
  id: 'collectionSessionActivity_materials',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Materials',
  displayPrompt: 'What materials will be provided for this activity?',
  displayPage: 'page_addCollectionSessionActivity',
  model: 'CollectionSessionActivityModel' 
},
{
  id: 'collectionSessionActivity_spaces',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Spaces',
  displayPrompt: 'What spaces will be used for this activity?',
  displayPage: 'page_addCollectionSessionActivity',
  model: 'CollectionSessionActivityModel' 
},
{
  id: 'collectionSessionActivity_facilitation',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Facilitation',
  displayPrompt: 'What sort of facilitation will be necessary for this activity?',
  displayPage: 'page_addCollectionSessionActivity',
  model: 'CollectionSessionActivityModel' 
},
{
  id: 'SPECIAL_templates_storyCollectionActivities',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'storyCollectionActivities',
  displayType: 'templateList',
  displayName: undefined,
  displayPrompt: 'You can copy an activity from this list.',
  displayPage: 'page_addCollectionSessionActivity',
  model: 'CollectionSessionActivityModel' 
},

// -------------  PAGE page_readCollectionDesignReport Read collection design report page  ------------- 

{
  id: 'page_readCollectionDesignReport',
  displayName: 'Read collection design report',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_readCollectionDesignReport',
  pageModel: 'ProjectModel' 
},
{
  id: 'project_readCollectionDesignReportIntroductionLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'This report shows all of the information entered in the pages grouped under "Collection design."',
  displayPage: 'page_readCollectionDesignReport',
  model: 'ProjectModel' 
},
{
  id: 'project_collectionDesignReport',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'collectionDesign',
  displayType: 'report',
  displayName: undefined,
  displayPrompt: 'Collection design report',
  displayPage: 'page_readCollectionDesignReport',
  model: 'ProjectModel' 
},

// ==================== SECTION page_collectionProcess Collection process ==========================

// -------------  HEADER page_collectionProcess Collection process page  ------------- 

{
  id: 'page_collectionProcess',
  displayName: 'Collection process',
  displayType: 'page',
  isHeader: true,
  displayPage: 'page_collectionProcess',
  pageModel: 'undefinedModel' 
},
{
  id: 'collectionProcessIntro',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'In the collection process phase of your PNI project, you will review incoming stories and enter records of story collection sessions.',
  displayPage: 'page_collectionProcess',
  model: 'ProjectModel' 
},
{
  id: 'project_generalNotes_collectionProcess',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Collection process notes',
  displayPrompt: 'You can enter some general notes on your collection process in this project here.',
  displayPage: 'page_collectionProcess',
  model: 'ProjectModel' 
},

// -------------  PAGE page_finalizeQuestionForms Print question forms page  ------------- 

{
  id: 'page_finalizeQuestionForms',
  displayName: 'Print question forms',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_finalizeQuestionForms',
  pageModel: 'undefinedModel' 
},
{
  id: 'printQuestionsForm_introduction',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you can print your story questions form for distribution to participants.\nYou can later enter the results from each form into the system.',
  displayPage: 'page_finalizeQuestionForms',
  model: 'ProjectModel' 
},
{
  id: 'printQuestionsForm_printFormButton',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'printStoryForm',
  displayType: 'button',
  displayName: undefined,
  displayPrompt: 'Print story form',
  displayPage: 'page_finalizeQuestionForms',
  model: 'ProjectModel' 
},

// -------------  PAGE page_startStoryCollection Start story collection page  ------------- 

{
  id: 'page_startStoryCollection',
  displayName: 'Start story collection',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_startStoryCollection',
  pageModel: 'undefinedModel' 
},
{
  id: 'webStoryCollection_startCollectionLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'If you are doing story collection over the internet, click this button to make the web form "live" and able to be used by people other than yourself.',
  displayPage: 'page_startStoryCollection',
  model: 'ProjectModel' 
},
{
  id: 'webStoryCollection_enableStoryCollectionButton',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'storyCollectionStart',
  displayType: 'button',
  displayName: undefined,
  displayPrompt: 'Start web story collection',
  displayPage: 'page_startStoryCollection',
  model: 'ProjectModel' 
},
{
  id: 'webStoryCollection_enabledTracker',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'isStoryCollectingEnabled',
  displayType: 'function',
  displayName: undefined,
  displayPrompt: 'Web story collection enabled:',
  displayPage: 'page_startStoryCollection',
  model: 'ProjectModel' 
},
{
  id: 'webStoryCollection_copyStoryFormURLButton',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'copyStoryFormURL',
  displayType: 'button',
  displayName: undefined,
  displayPrompt: 'Copy story form web URL link',
  displayPage: 'page_startStoryCollection',
  model: 'ProjectModel' 
},
{
  id: 'webStoryCollection_stopCollectionLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'You can also disable the data collection here.',
  displayPage: 'page_startStoryCollection',
  model: 'ProjectModel' 
},
{
  id: 'webStoryCollection_disableStoryCollectionButton',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'storyCollectionStop',
  displayType: 'button',
  displayName: undefined,
  displayPrompt: 'Stop web story collection',
  displayPage: 'page_startStoryCollection',
  model: 'ProjectModel' 
},

// -------------  PAGE page_enterStories Enter stories page  ------------- 

{
  id: 'page_enterStories',
  displayName: 'Enter stories',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_enterStories',
  pageModel: 'undefinedModel' 
},
{
  id: 'printQuestionsForm_enterStories',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'enterSurveyResult',
  displayType: 'button',
  displayName: undefined,
  displayPrompt: 'Enter survey result',
  displayPage: 'page_enterStories',
  model: 'ProjectModel' 
},

// -------------  PAGE page_reviewIncomingStories Review incoming stories page  ------------- 

{
  id: 'page_reviewIncomingStories',
  displayName: 'Review incoming stories',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_reviewIncomingStories',
  pageModel: 'undefinedModel' 
},
{
  id: 'collectedStoriesDuringCollectionLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you can see your collected stories as they come in.',
  displayPage: 'page_reviewIncomingStories',
  model: 'ProjectModel' 
},
{
  id: 'webStoryCollection_loadLatestStoriesFromServer',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'loadLatestStoriesFromServer',
  displayType: 'button',
  displayName: undefined,
  displayPrompt: 'Load latest stories from server',
  displayPage: 'page_reviewIncomingStories',
  model: 'ProjectModel' 
},
{
  id: 'webStoryCollection_totalResults',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'totalNumberOfSurveyResults',
  displayType: 'function',
  displayName: undefined,
  displayPrompt: 'Total number of survey results loaded from server:',
  displayPage: 'page_reviewIncomingStories',
  model: 'ProjectModel' 
},
{
  id: 'webStoryCollection_collectedStoriesDuringCollection',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'storyBrowser',
  displayName: undefined,
  displayPrompt: 'Collected stories',
  displayPage: 'page_reviewIncomingStories',
  model: 'ProjectModel' 
},

// -------------  PAGE page_stopStoryCollection Stop story collection page  ------------- 

{
  id: 'page_stopStoryCollection',
  displayName: 'Stop story collection',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_stopStoryCollection',
  pageModel: 'undefinedModel' 
},
{
  id: 'webStoryCollection_stopCollectionLabel2',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'If you are doing story collection over the internet, click this button to make the web form unavailable (to anyone but yourself). You can re-enable story collection later by going back to a previous page.',
  displayPage: 'page_stopStoryCollection',
  model: 'ProjectModel' 
},
{
  id: 'webStoryCollection_disableWebStoryFormAfterStoryCollectionButton',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'storyCollectionStop',
  displayType: 'button',
  displayName: undefined,
  displayPrompt: 'Disable web story collection',
  displayPage: 'page_stopStoryCollection',
  model: 'ProjectModel' 
},
{
  id: 'webStoryCollection_enabledTracker2',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'isStoryCollectingEnabled',
  displayType: 'function',
  displayName: undefined,
  displayPrompt: 'Web story collection enabled:',
  displayPage: 'page_stopStoryCollection',
  model: 'ProjectModel' 
},

// -------------  PAGE page_enterCollectionSessionRecords Enter story collection session records page  ------------- 

{
  id: 'page_enterCollectionSessionRecords',
  displayName: 'Enter story collection session records',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_enterCollectionSessionRecords',
  pageModel: 'undefinedModel' 
},
{
  id: 'project_collectionRecordsIntroductionLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you can enter records for the group story sessions you held.\nIf you did not hold any group story sessions, you can skip this page.',
  displayPage: 'page_enterCollectionSessionRecords',
  model: 'ProjectModel' 
},
{
  id: 'project_collectionSessionRecordsList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_addCollectionSessionRecord',
  displayType: 'grid',
  displayName: 'Story collection session records',
  displayPrompt: 'Enter here what went on in your story collection sessions.',
  displayPage: 'page_enterCollectionSessionRecords',
  model: 'ProjectModel' 
},

// -------------  PAGE page_addCollectionSessionRecord Add story collection session record popup  ------------- 

{
  id: 'page_addCollectionSessionRecord',
  displayName: 'Add story collection session record',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_addCollectionSessionRecord',
  pageModel: 'undefinedModel' 
},
// Generate model CollectionSessionRecordModel 

{
  id: 'collectionSessionRecord_name',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Name',
  displayPrompt: 'Please give this session record a name.',
  displayPage: 'page_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_whenWhere',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'When and where',
  displayPrompt: 'When and where did the session take place?',
  displayPage: 'page_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_groups',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Participant groups',
  displayPrompt: 'Which participant groups were involved in this session?',
  displayPage: 'page_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_participants',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Who attended',
  displayPrompt: 'Describe the participants at this session.',
  displayPage: 'page_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_plan',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Plan',
  displayPrompt: 'Which of your collection session plans did you follow in this session? (And did you stick to the plan?)',
  displayPage: 'page_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_notes',
  dataType: 'string',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Notes',
  displayPrompt: 'Enter additional notes on the session here.\nYour notes can include links to images or other documents.',
  displayPage: 'page_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_constructionsList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_newCollectionSessionConstruction',
  displayType: 'grid',
  displayName: 'Story collection session constructions',
  displayPrompt: 'People in your story collection sessions might have created constructions\nsuch as timelines or landscapes. You can enter details about those here.',
  displayPage: 'page_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflectionsLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'Use the questions below to reflect on the session.',
  displayPage: 'page_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflectionsOnChangeHeader',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'Change',
  displayPage: 'page_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflections_change_participantPerceptions',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Change in participant perceptions',
  displayPrompt: 'How did the perceptions of the participants change from the start to the end of the session?',
  displayPage: 'page_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflections_change_yourPerceptions',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Change in facilitator perceptions',
  displayPrompt: 'How did <i>your</i> perceptions change?',
  displayPage: 'page_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflections_change_project',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Changes to the project',
  displayPrompt: 'How has the overall project changed as a result of this session?',
  displayPage: 'page_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_interactionsHeader',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'Interactions',
  displayPage: 'page_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflections_interaction_participants',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Interactions among participants',
  displayPrompt: 'Describe the interactions between participants in this session.',
  displayPage: 'page_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflections_interaction_participantsAndFacilitator',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Interactions between participants and facilitators',
  displayPrompt: 'Describe interactions between participants and facilitators.',
  displayPage: 'page_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflections_interaction_stories',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Stories',
  displayPrompt: 'What did you notice about the stories people told, retold, chose, and worked with during the session?',
  displayPage: 'page_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_learningHeader',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'Learning',
  displayPage: 'page_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflections_learning_special',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Unique features',
  displayPrompt: 'What was special about these people in this place on this day?',
  displayPage: 'page_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflections_learning_surprise',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Surprise',
  displayPrompt: 'What surprised you about this session?',
  displayPage: 'page_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflections_learning_workedWell',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Worked and didn\'t work',
  displayPrompt: 'Which parts of your plans for this session worked out well? Which parts didn\'t?',
  displayPage: 'page_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflections_learning_newIdeas',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'New ideas',
  displayPrompt: 'What new ideas did you gain from this session? What did you learn from it?',
  displayPage: 'page_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflections_learning_wantToRemember',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Other',
  displayPrompt: 'What else do you want to remember about this session?',
  displayPage: 'page_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},

// -------------  PAGE page_newCollectionSessionConstruction Story collection construction popup  ------------- 

{
  id: 'page_newCollectionSessionConstruction',
  displayName: 'Story collection construction',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_newCollectionSessionConstruction',
  pageModel: 'undefinedModel' 
},
// Generate model NewCollectionSessionConstructionModel 

{
  id: 'collectionSessionRecord_construction_name',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Name',
  displayPrompt: 'Please give this construction a name.',
  displayPage: 'page_newCollectionSessionConstruction',
  model: 'NewCollectionSessionConstructionModel' 
},
{
  id: 'collectionSessionRecord_construction_type',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'timeline', 'landscape', 'other' ],
  displayType: 'select',
  displayName: 'Type',
  displayPrompt: 'What type of construction is it?',
  displayPage: 'page_newCollectionSessionConstruction',
  model: 'NewCollectionSessionConstructionModel' 
},
{
  id: 'collectionSessionRecord_construction_description',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Description',
  displayPrompt: 'Please describe the construction (or include a description given by participants).\nYour description can include links to images or other documents.',
  displayPage: 'page_newCollectionSessionConstruction',
  model: 'NewCollectionSessionConstructionModel' 
},

// -------------  PAGE page_readCollectionProcessReport Read collection process report page  ------------- 

{
  id: 'page_readCollectionProcessReport',
  displayName: 'Read collection process report',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_readCollectionProcessReport',
  pageModel: 'undefinedModel' 
},
{
  id: 'project_collectionProcessReportLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'This report shows all of the information entered in the pages grouped under "Collection process."',
  displayPage: 'page_readCollectionProcessReport',
  model: 'ProjectModel' 
},
{
  id: 'project_collectionProcessReport',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'collectionProcess',
  displayType: 'report',
  displayName: undefined,
  displayPrompt: 'Collection process report',
  displayPage: 'page_readCollectionProcessReport',
  model: 'ProjectModel' 
},

// ==================== SECTION page_catalysis Catalysis ==========================

// -------------  HEADER page_catalysis Catalysis page  ------------- 

{
  id: 'page_catalysis',
  displayName: 'Catalysis',
  displayType: 'page',
  isHeader: true,
  displayPage: 'page_catalysis',
  pageModel: 'undefinedModel' 
},
{
  id: 'catalysisIntro',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'In the catalysis phase of your PNI project, you will look for patterns\nand prepare materials for use in sensemaking.',
  displayPage: 'page_catalysis',
  model: 'ProjectModel' 
},
{
  id: 'project_generalNotes_catalysis',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Catalysis notes',
  displayPrompt: 'You can enter some general notes on catalysis in this project here.',
  displayPage: 'page_catalysis',
  model: 'ProjectModel' 
},

// -------------  PAGE page_browseStories Browse stories page  ------------- 

{
  id: 'page_browseStories',
  displayName: 'Browse stories',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_browseStories',
  pageModel: 'undefinedModel' 
},
{
  id: 'browseStories_collectedStoriesAfterCollectionLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you will review your collected stories.\nYou can save stories (or groups of stories) to observations for later use.\nYou can also save excerpts (parts of stories) for later use.',
  displayPage: 'page_browseStories',
  model: 'ProjectModel' 
},
{
  id: 'browseStories_loadLatestStoriesFromServer',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'loadLatestStoriesFromServer',
  displayType: 'button',
  displayName: undefined,
  displayPrompt: 'Load latest stories from server',
  displayPage: 'page_browseStories',
  model: 'ProjectModel' 
},
{
  id: 'browseStories_totalResults',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'totalNumberOfSurveyResults',
  displayType: 'function',
  displayName: undefined,
  displayPrompt: 'Total number of survey results loaded from server:',
  displayPage: 'page_browseStories',
  model: 'ProjectModel' 
},
{
  id: 'browseStories_collectedStoriesAfterCollection',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 
   [ 'addToObservation:"page_addToObservation"',
     'addToExcerpt:"page_addToExcerpt"' ],
  displayType: 'storyBrowser',
  displayName: undefined,
  displayPrompt: 'Collected stories',
  displayPage: 'page_browseStories',
  model: 'ProjectModel' 
},

// -------------  PAGE page_themeStories Theme stories page  ------------- 

{
  id: 'page_themeStories',
  displayName: 'Theme stories',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_themeStories',
  pageModel: 'undefinedModel' 
},
{
  id: 'themeStoriesLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you will derive emergent themes from the collected stories.\nThe themes will appear in your data as answers to a "Theme" question, creating patterns you can use.',
  displayPage: 'page_themeStories',
  model: 'ProjectModel' 
},
{
  id: 'themeStories',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'storyThemer',
  displayName: undefined,
  displayPrompt: 'Theme stories',
  displayPage: 'page_themeStories',
  model: 'ProjectModel' 
},
{
  id: 'mockupThemingLabel_unfinished',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: '(Unfinished: The user will use this area to theme stories.',
  displayPage: 'page_themeStories',
  model: 'ProjectModel' 
},
{
  id: 'mockup_theming',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'images/mockups/mockupTheming.png',
  displayType: 'image',
  displayName: undefined,
  displayPrompt: 'It will look something like this.)',
  displayPage: 'page_themeStories',
  model: 'ProjectModel' 
},

// -------------  PAGE page_browseGraphs Browse graphs page  ------------- 

{
  id: 'page_browseGraphs',
  displayName: 'Browse graphs',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_browseGraphs',
  pageModel: 'undefinedModel' 
},
{
  id: 'graphBrowserLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you can look at patterns in the answers people gave about their stories,\nand save patterns to observations for later use.',
  displayPage: 'page_browseGraphs',
  model: 'ProjectModel' 
},
{
  id: 'graphBrowserDisplay',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'graphBrowser',
  displayName: undefined,
  displayPrompt: 'Graph browser',
  displayPage: 'page_browseGraphs',
  model: 'ProjectModel' 
},
{
  id: 'graphBrowserMockupLabel_unfinished',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: '(Unfinished: This area will show graphs of patterns in the data.',
  displayPage: 'page_browseGraphs',
  model: 'ProjectModel' 
},
{
  id: 'mockup_graphBrowser',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'images/mockups/mockupGraphs.png',
  displayType: 'image',
  displayName: undefined,
  displayPrompt: 'It will look something like this.)',
  displayPage: 'page_browseGraphs',
  model: 'ProjectModel' 
},

// -------------  PAGE page_reviewTrends Review trends page  ------------- 

{
  id: 'page_reviewTrends',
  displayName: 'Review trends',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_reviewTrends',
  pageModel: 'undefinedModel' 
},
{
  id: 'reviewTrendsLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you will look over the most significant statistical results\nand save some to observations for later use.',
  displayPage: 'page_reviewTrends',
  model: 'ProjectModel' 
},
{
  id: 'reviewTrends_minSubsetSize',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ '20', '30', '40', '50' ],
  displayType: 'select',
  displayName: 'Minimum subset size',
  displayPrompt: 'How large should subsets of stories be to be considered for comparison?',
  displayPage: 'page_reviewTrends',
  model: 'ProjectModel' 
},
{
  id: 'reviewTrends_significanceThreshold',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ '0.05', '0.01' ],
  displayType: 'select',
  displayName: 'Significance threshold',
  displayPrompt: 'What significance threshold do you want reported?',
  displayPage: 'page_reviewTrends',
  model: 'ProjectModel' 
},
{
  id: 'reviewTrends_display',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'trendsReport',
  displayName: undefined,
  displayPrompt: 'Trends report',
  displayPage: 'page_reviewTrends',
  model: 'ProjectModel' 
},
{
  id: 'mockupTrendsLabel_unfinished',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: '(Unfinished: This area will show the most significant statistical trends.',
  displayPage: 'page_reviewTrends',
  model: 'ProjectModel' 
},
{
  id: 'mockup_trends',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'images/mockups/mockupTrends.png',
  displayType: 'image',
  displayName: undefined,
  displayPrompt: 'It will look something like this.)',
  displayPage: 'page_reviewTrends',
  model: 'ProjectModel' 
},

// -------------  PAGE page_addToObservation Add to observation popup  ------------- 

{
  id: 'page_addToObservation',
  displayName: 'Add to observation',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_addToObservation',
  pageModel: 'undefinedModel' 
},
// Generate model ToObservationModel 

{
  id: 'addToObservation_introduction',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'Note: You should not add any observations that depend on patterns among stories until after\nall stories have been entered.',
  displayPage: 'page_addToObservation',
  model: 'ToObservationModel' 
},
{
  id: 'observationsListChoose',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'observationsList',
  displayName: undefined,
  displayPrompt: 'Choose an observation from this list to which to add the selected result, or create a new observation.',
  displayPage: 'page_addToObservation',
  model: 'ToObservationModel' 
},
{
  id: 'addToObservation_addResultToExistingObservationButton',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'button',
  displayName: undefined,
  displayPrompt: 'Add result to selected observation',
  displayPage: 'page_addToObservation',
  model: 'ToObservationModel' 
},
{
  id: 'addToObservation_createNewObservationWithResultButton',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'page_createNewObservation',
  displayType: 'button',
  displayName: undefined,
  displayPrompt: 'Create new observation with this result',
  displayPage: 'page_addToObservation',
  model: 'ToObservationModel' 
},

// -------------  PAGE page_createOrEditObservation Create new observation popup  ------------- 

{
  id: 'page_createOrEditObservation',
  displayName: 'Create new observation',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_createOrEditObservation',
  pageModel: 'undefinedModel' 
},
// Generate model ObservationModel 

{
  id: 'observation_name',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Name',
  displayPrompt: 'Please give this observation a name.',
  displayPage: 'page_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_text',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Observation',
  displayPrompt: 'Please describe this observation.',
  displayPage: 'page_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation__observationResultsList',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'collectedStoriesAfterCollection',
  displayType: 'accumulatedItemsGrid',
  displayName: 'Results',
  displayPrompt: 'These are the results you have selected to include in this observation.',
  displayPage: 'page_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_firstInterpretation_text',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'First interpretation',
  displayPrompt: 'Enter an interpretation of this observation.\nWhat does it mean?',
  displayPage: 'page_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_firstInterpretation_name',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'First interpretation name',
  displayPrompt: 'Please give this interpretation a short name (so you can refer to it later).',
  displayPage: 'page_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_firstInterpretation_idea',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'First interpretation idea',
  displayPrompt: 'If you like, you can record an idea that follows from this interpretation.',
  displayPage: 'page_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_firstInterpretation_excerptsList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_selectExcerpt',
  displayType: 'grid',
  displayName: 'First interpretation excerpts',
  displayPrompt: 'You can add excerpts to this interpretation.',
  displayPage: 'page_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_competingInterpretation_text',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Competing interpretation',
  displayPrompt: 'Now enter an interpretation that competes with the first one.\nWhat <i>else</i> could this pattern mean?',
  displayPage: 'page_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_competingInterpretation_name',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Competing interpretation name',
  displayPrompt: 'Please give this competing interpretation a short name.',
  displayPage: 'page_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_competingInterpretation_idea',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Competing interpretation idea',
  displayPrompt: 'If you like, enter an idea that follows from your competing interpretation.',
  displayPage: 'page_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_competingInterpretation_excerptsList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_selectExcerpt',
  displayType: 'grid',
  displayName: 'Competing interpretation excerpts',
  displayPrompt: 'You can add excerpts to the competing interpretation.',
  displayPage: 'page_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_thirdInterpretation_text',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Third interpretation',
  displayPrompt: 'If a third interpretation of the pattern comes to mind, enter it here.\nIs there a third thing this pattern could mean?',
  displayPage: 'page_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_thirdInterpretation_name',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Third interpretation name',
  displayPrompt: 'Please give this third interpretation a short name.',
  displayPage: 'page_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_thirdInterpretation_idea',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Third interpretation idea',
  displayPrompt: 'If you like, enter an idea that follows from your third interpretation.',
  displayPage: 'page_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_thirdInterpretation_excerptsList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_selectExcerpt',
  displayType: 'grid',
  displayName: 'Third interpretation excerpts',
  displayPrompt: 'You can add excerpts to the third interpretation.',
  displayPage: 'page_createOrEditObservation',
  model: 'ObservationModel' 
},

// -------------  PAGE page_selectExcerpt Add excerpt to interpretation popup  ------------- 

{
  id: 'page_selectExcerpt',
  displayName: 'Add excerpt to interpretation',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_selectExcerpt',
  pageModel: 'undefinedModel' 
},
// Generate model SelectExcerptModel 

{
  id: 'selectExcerpt_excerptsListDisplay',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'excerptsList',
  displayName: undefined,
  displayPrompt: 'Collected excerpts',
  displayPage: 'page_selectExcerpt',
  model: 'SelectExcerptModel' 
},
{
  id: 'selectExcerpt_addExcerptToInterpretationButton',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'button',
  displayName: undefined,
  displayPrompt: 'Add selected excerpt to interpretation',
  displayPage: 'page_selectExcerpt',
  model: 'SelectExcerptModel' 
},

// -------------  PAGE page_addToExcerpt Add text to excerpt popup  ------------- 

{
  id: 'page_addToExcerpt',
  displayName: 'Add text to excerpt',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_addToExcerpt',
  pageModel: 'undefinedModel' 
},
// Generate model ToExcerptModel 

{
  id: 'addToExcerpt_excerptsListChoose',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'excerptsList',
  displayName: undefined,
  displayPrompt: 'Choose an excerpt from this list to which to add the selected text, or create a new excerpt.',
  displayPage: 'page_addToExcerpt',
  model: 'ToExcerptModel' 
},
{
  id: 'addToExcerpt_addTextToExistingExcerptButton',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'button',
  displayName: undefined,
  displayPrompt: 'Add text to selected excerpt',
  displayPage: 'page_addToExcerpt',
  model: 'ToExcerptModel' 
},
{
  id: 'addToExcerpt_createNewExcerptWithTextButton',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'page_createNewExcerpt',
  displayType: 'button',
  displayName: undefined,
  displayPrompt: 'Create new excerpt with this text',
  displayPage: 'page_addToExcerpt',
  model: 'ToExcerptModel' 
},

// -------------  PAGE page_createNewExcerpt Create new excerpt popup  ------------- 

{
  id: 'page_createNewExcerpt',
  displayName: 'Create new excerpt',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_createNewExcerpt',
  pageModel: 'ExcerptModel' 
},
// Generate model CreateNewExcerptModel 

{
  id: 'excerpt_name',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Name',
  displayPrompt: 'Please give this excerpt a name.',
  displayPage: 'page_createNewExcerpt',
  model: 'CreateNewExcerptModel' 
},
{
  id: 'excerpt_text',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Excerpt',
  displayPrompt: 'You can edit the excerpt here.',
  displayPage: 'page_createNewExcerpt',
  model: 'CreateNewExcerptModel' 
},
{
  id: 'excerpt_notes',
  dataType: 'string',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Notes',
  displayPrompt: 'Enter some notes about the excerpt.',
  displayPage: 'page_createNewExcerpt',
  model: 'CreateNewExcerptModel' 
},

// -------------  PAGE page_reviewExcerpts Review excerpts page  ------------- 

{
  id: 'page_reviewExcerpts',
  displayName: 'Review excerpts',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_reviewExcerpts',
  pageModel: 'undefinedModel' 
},
{
  id: 'project_savedExcerptsList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_createNewExcerpt',
  displayType: 'grid',
  displayName: 'Story excerpts',
  displayPrompt: 'These are the story excerpts you have saved.',
  displayPage: 'page_reviewExcerpts',
  model: 'ProjectModel' 
},

// -------------  PAGE page_interpretObservations Review and interpret observations page  ------------- 

{
  id: 'page_interpretObservations',
  displayName: 'Review and interpret observations',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_interpretObservations',
  pageModel: 'undefinedModel' 
},
{
  id: 'project_observationsDisplayList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_createOrEditObservation',
  displayType: 'grid',
  displayName: 'Catalysis observations',
  displayPrompt: 'These are the observations you have collected from the\nbrowse, graph, and trends pages.',
  displayPage: 'page_interpretObservations',
  model: 'ProjectModel' 
},

// -------------  PAGE page_clusterInterpretations Cluster interpretations page  ------------- 

{
  id: 'page_clusterInterpretations',
  displayName: 'Cluster interpretations',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_clusterInterpretations',
  pageModel: 'undefinedModel' 
},
{
  id: 'project_interpretationsClusteringLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you will cluster together the interpretations you have collected (based on observations)\nto create perspectives for your catalysis report.\nNote: Do not cluster your interpretations unless you are sure you have finished collecting them.',
  displayPage: 'page_clusterInterpretations',
  model: 'ProjectModel' 
},
{
  id: 'project_interpretationsClusteringDiagram',
  dataType: 'object',
  required: true,
  validators: undefined,
  options: 'project_interpretationsClusteringDiagram',
  displayType: 'clusteringDiagram',
  displayName: undefined,
  displayPrompt: 'Cluster interpretations into perspectives',
  displayPage: 'page_clusterInterpretations',
  model: 'ProjectModel' 
},

// -------------  PAGE page_describePerspectives Describe perspectives page  ------------- 

{
  id: 'page_describePerspectives',
  displayName: 'Describe perspectives',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_describePerspectives',
  pageModel: 'undefinedModel' 
},
{
  id: 'project_perspectivesLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you will describe the perspectives that resulted from clustering\nyour interpretations.',
  displayPage: 'page_describePerspectives',
  model: 'ProjectModel' 
},
{
  id: 'project_perspectivesList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_addPerspective',
  displayType: 'grid',
  displayName: 'Catalysis perspectives',
  displayPrompt: 'These are the perspectives you have created from interpretations.',
  displayPage: 'page_describePerspectives',
  model: 'ProjectModel' 
},

// -------------  PAGE page_addPerspective Add or change perspective popup  ------------- 

{
  id: 'page_addPerspective',
  displayName: 'Add or change perspective',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_addPerspective',
  pageModel: 'undefinedModel' 
},
// Generate model PerspectiveModel 

{
  id: 'perspective_name',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Name',
  displayPrompt: 'Please give this perspective a name.',
  displayPage: 'page_addPerspective',
  model: 'PerspectiveModel' 
},
{
  id: 'perspective_description',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Perspective',
  displayPrompt: 'Describe this perspective.',
  displayPage: 'page_addPerspective',
  model: 'PerspectiveModel' 
},
{
  id: 'perspective_linkedResultsList',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'page_annotateResultForPerspective',
  displayType: 'annotationsGrid',
  displayName: undefined,
  displayPrompt: 'Results linked to this perspective',
  displayPage: 'page_addPerspective',
  model: 'PerspectiveModel' 
},
{
  id: 'perspective_linkedExcerptsList',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'page_annotateExcerptForPerspective',
  displayType: 'annotationsGrid',
  displayName: undefined,
  displayPrompt: 'Excerpts linked to this perspective',
  displayPage: 'page_addPerspective',
  model: 'PerspectiveModel' 
},
{
  id: 'perspective_linkedInterpretationsList',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'page_annotateInterpretationForPerspective',
  displayType: 'annotationsGrid',
  displayName: undefined,
  displayPrompt: 'Interpretations linked to this perspective',
  displayPage: 'page_addPerspective',
  model: 'PerspectiveModel' 
},

// -------------  PAGE page_annotateResultForPerspective Annotate result for perspective popup  ------------- 

{
  id: 'page_annotateResultForPerspective',
  displayName: 'Annotate result for perspective',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_annotateResultForPerspective',
  pageModel: 'undefinedModel' 
},
// Generate model AnnotateResultForPerspectiveModel 

{
  id: 'perspective_resultLinkageNotes',
  dataType: 'string',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Notes',
  displayPrompt: 'Enter any notes you want to remember about this result with respect to this perspective.',
  displayPage: 'page_annotateResultForPerspective',
  model: 'AnnotateResultForPerspectiveModel' 
},

// -------------  PAGE page_annotateExcerptForPerspective Annotate excerpt for perspective popup  ------------- 

{
  id: 'page_annotateExcerptForPerspective',
  displayName: 'Annotate excerpt for perspective',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_annotateExcerptForPerspective',
  pageModel: 'undefinedModel' 
},
// Generate model AnnotateExcerptForPerspectiveModel 

{
  id: 'perspective_excerptLinkageNotes',
  dataType: 'string',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Notes',
  displayPrompt: 'Enter any notes you want to remember about this excerpt with respect to this perspective.',
  displayPage: 'page_annotateExcerptForPerspective',
  model: 'AnnotateExcerptForPerspectiveModel' 
},

// -------------  PAGE page_annotateInterpretationForPerspective Annotate interpretation for perspective popup  ------------- 

{
  id: 'page_annotateInterpretationForPerspective',
  displayName: 'Annotate interpretation for perspective',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_annotateInterpretationForPerspective',
  pageModel: 'undefinedModel' 
},
// Generate model AnnotateInterpretationForPerspectiveModel 

{
  id: 'perspective_interpretationLinkageNotes',
  dataType: 'string',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Notes',
  displayPrompt: 'Enter any notes you want to remember about this interpretation as it is linked to this perspective.',
  displayPage: 'page_annotateInterpretationForPerspective',
  model: 'AnnotateInterpretationForPerspectiveModel' 
},

// -------------  PAGE page_readCatalysisReport Read catalysis report page  ------------- 

{
  id: 'page_readCatalysisReport',
  displayName: 'Read catalysis report',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_readCatalysisReport',
  pageModel: 'undefinedModel' 
},
{
  id: 'catalysisReport_introductionLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'This report shows all of the information entered in the pages grouped under "Catalysis."',
  displayPage: 'page_readCatalysisReport',
  model: 'ProjectModel' 
},
{
  id: 'catalysisReport',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'catalysis',
  displayType: 'report',
  displayName: undefined,
  displayPrompt: 'Catalysis report',
  displayPage: 'page_readCatalysisReport',
  model: 'ProjectModel' 
},

// ==================== SECTION page_sensemaking Sensemaking ==========================

// -------------  HEADER page_sensemaking Sensemaking page  ------------- 

{
  id: 'page_sensemaking',
  displayName: 'Sensemaking',
  displayType: 'page',
  isHeader: true,
  displayPage: 'page_sensemaking',
  pageModel: 'undefinedModel' 
},
{
  id: 'sensemakingIntroLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'In the sensemaking phase of your PNI project, you will plan sensemaking sessions and record what happened in them.',
  displayPage: 'page_sensemaking',
  model: 'ProjectModel' 
},
{
  id: 'project_generalNotes_sensemaking',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Sensemaking notes',
  displayPrompt: 'You can enter some general notes on sensemaking in this project here.',
  displayPage: 'page_sensemaking',
  model: 'ProjectModel' 
},

// -------------  PAGE page_planSensemakingSessions Plan sensemaking sessions page  ------------- 

{
  id: 'page_planSensemakingSessions',
  displayName: 'Plan sensemaking sessions',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_planSensemakingSessions',
  pageModel: 'undefinedModel' 
},
{
  id: 'project_sensemakingSessionPlansLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you can create plans for your sensemaking sessions.',
  displayPage: 'page_planSensemakingSessions',
  model: 'ProjectModel' 
},
{
  id: 'sensemakingSessionRecommendations',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'sensemakingSessions',
  displayType: 'recommendationTable',
  displayName: undefined,
  displayPrompt: 'Recommendations for sensemaking sessions',
  displayPage: 'page_planSensemakingSessions',
  model: 'ProjectModel' 
},
{
  id: 'project_sensemakingSessionPlansList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_addSensemakingSessionPlan',
  displayType: 'grid',
  displayName: 'Sensemaking session plans',
  displayPrompt: 'Enter your plans for sensemaking sessions here.',
  displayPage: 'page_planSensemakingSessions',
  model: 'ProjectModel' 
},

// -------------  PAGE page_addSensemakingSessionPlan Enter sensemaking session plan popup  ------------- 

{
  id: 'page_addSensemakingSessionPlan',
  displayName: 'Enter sensemaking session plan',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_addSensemakingSessionPlan',
  pageModel: 'undefinedModel' 
},
// Generate model SensemakingSessionPlanModel 

{
  id: 'sensemakingSessionPlan_name',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Name',
  displayPrompt: 'Please give this session plan a name.',
  displayPage: 'page_addSensemakingSessionPlan',
  model: 'SensemakingSessionPlanModel' 
},
{
  id: 'sensemakingSessionPlan_groups',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Participant groups',
  displayPrompt: 'Which participant group(s) will be involved?',
  displayPage: 'page_addSensemakingSessionPlan',
  model: 'SensemakingSessionPlanModel' 
},
{
  id: 'sensemakingSessionPlan_repetitions',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Repetitions',
  displayPrompt: 'How many repetitions of the session will there be?',
  displayPage: 'page_addSensemakingSessionPlan',
  model: 'SensemakingSessionPlanModel' 
},
{
  id: 'sensemakingSessionPlan_duration',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Length',
  displayPrompt: 'How long will this session last?',
  displayPage: 'page_addSensemakingSessionPlan',
  model: 'SensemakingSessionPlanModel' 
},
{
  id: 'sensemakingSessionPlan_times',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Time',
  displayPrompt: 'At what dates and times will the session take place?',
  displayPage: 'page_addSensemakingSessionPlan',
  model: 'SensemakingSessionPlanModel' 
},
{
  id: 'sensemakingSessionPlan_location',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Location',
  displayPrompt: 'Where will these sessions take place?',
  displayPage: 'page_addSensemakingSessionPlan',
  model: 'SensemakingSessionPlanModel' 
},
{
  id: 'sensemakingSessionPlan_numPeople',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Number of people',
  displayPrompt: 'How many people will be invited to each repetition of this session?',
  displayPage: 'page_addSensemakingSessionPlan',
  model: 'SensemakingSessionPlanModel' 
},
{
  id: 'sensemakingSessionPlan_materials',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Materials',
  displayPrompt: 'What materials will this session require?',
  displayPage: 'page_addSensemakingSessionPlan',
  model: 'SensemakingSessionPlanModel' 
},
{
  id: 'sensemakingSessionPlan_details',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Other',
  displayPrompt: 'Enter other details about this session.',
  displayPage: 'page_addSensemakingSessionPlan',
  model: 'SensemakingSessionPlanModel' 
},
{
  id: 'sensemakingSessionPlan_activitiesList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_addSensemakingSessionActivity',
  displayType: 'grid',
  displayName: 'Sensemaking session activities',
  displayPrompt: 'Here you can enter some activities you plan for the session.\nActivities within story collection sessions can be simple instructions or complicated exercises (like the creation of timelines).',
  displayPage: 'page_addSensemakingSessionPlan',
  model: 'SensemakingSessionPlanModel' 
},
{
  id: 'sensemakingSessionPlan_printSensemakingSessionAgendaButton',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'button',
  displayName: undefined,
  displayPrompt: 'Print session agenda',
  displayPage: 'page_addSensemakingSessionPlan',
  model: 'SensemakingSessionPlanModel' 
},

// -------------  PAGE page_addSensemakingSessionActivity Add sensemaking session activity popup  ------------- 

{
  id: 'page_addSensemakingSessionActivity',
  displayName: 'Add sensemaking session activity',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_addSensemakingSessionActivity',
  pageModel: 'undefinedModel' 
},
// Generate model SensemakingSessionActivityModel 

{
  id: 'sensemakingSessionPlan_activity_name',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Name',
  displayPrompt: 'Please give this activity a name.',
  displayPage: 'page_addSensemakingSessionActivity',
  model: 'SensemakingSessionActivityModel' 
},
{
  id: 'sensemakingSessionPlan_activity_type',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: 
   [ 'ice-breaker',
     'encountering stories (no task)',
     'encountering stories (simple task)',
     'discussing stories',
     'twice-told stories exercise',
     'timeline exercise',
     'landscape exercise',
     'story elements exercise',
     'composite stories exercise',
     'my own exercise',
     'other' ],
  displayType: 'select',
  displayName: 'Type',
  displayPrompt: 'What type of activity is this?',
  displayPage: 'page_addSensemakingSessionActivity',
  model: 'SensemakingSessionActivityModel' 
},
{
  id: 'sensemakingSessionPlan_activity_plan',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Plan',
  displayPrompt: 'Describe the plan for this activity.',
  displayPage: 'page_addSensemakingSessionActivity',
  model: 'SensemakingSessionActivityModel' 
},
{
  id: 'sensemakingSessionPlan_activity_optionalParts',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Optional elaborations',
  displayPrompt: 'Describe any optional elaborations you might or might not use in this activity.',
  displayPage: 'page_addSensemakingSessionActivity',
  model: 'SensemakingSessionActivityModel' 
},
{
  id: 'sensemakingSessionPlan_activity_duration',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Length',
  displayPrompt: 'How long will this activity take?',
  displayPage: 'page_addSensemakingSessionActivity',
  model: 'SensemakingSessionActivityModel' 
},
{
  id: 'sensemakingSessionPlan_activity_recording',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'New stories',
  displayPrompt: 'Will new stories be recorded during this activity, and if so, how?',
  displayPage: 'page_addSensemakingSessionActivity',
  model: 'SensemakingSessionActivityModel' 
},
{
  id: 'sensemakingSessionPlan_activity_materials',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Materials',
  displayPrompt: 'What materials will be provided for this activity?',
  displayPage: 'page_addSensemakingSessionActivity',
  model: 'SensemakingSessionActivityModel' 
},
{
  id: 'sensemakingSessionPlan_activity_spaces',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Spaces',
  displayPrompt: 'What spaces will be used for this activity?',
  displayPage: 'page_addSensemakingSessionActivity',
  model: 'SensemakingSessionActivityModel' 
},
{
  id: 'sensemakingSessionPlan_activity_facilitation',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Facilitation',
  displayPrompt: 'What sort of facilitation will be necessary for this activity?',
  displayPage: 'page_addSensemakingSessionActivity',
  model: 'SensemakingSessionActivityModel' 
},
{
  id: 'templates_sensemakingActivities',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'sensemakingActivities',
  displayType: 'templateList',
  displayName: undefined,
  displayPrompt: 'You can copy an activity from this list.',
  displayPage: 'page_addSensemakingSessionActivity',
  model: 'SensemakingSessionActivityModel' 
},

// -------------  PAGE page_enterSensemakingSessionRecords Enter sensemaking session records page  ------------- 

{
  id: 'page_enterSensemakingSessionRecords',
  displayName: 'Enter sensemaking session records',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_enterSensemakingSessionRecords',
  pageModel: 'undefinedModel' 
},
{
  id: 'project_sensemakingSessionRecordsLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you will enter records of what happened at your sensemaking sessions.',
  displayPage: 'page_enterSensemakingSessionRecords',
  model: 'ProjectModel' 
},
{
  id: 'project_sensemakingSessionRecordsList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_addSensemakingSessionRecord',
  displayType: 'grid',
  displayName: 'Sensemaking session records',
  displayPrompt: 'Enter your sensemaking session records here.',
  displayPage: 'page_enterSensemakingSessionRecords',
  model: 'ProjectModel' 
},

// -------------  PAGE page_addSensemakingSessionRecord Add sensemaking session record popup  ------------- 

{
  id: 'page_addSensemakingSessionRecord',
  displayName: 'Add sensemaking session record',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_addSensemakingSessionRecord',
  pageModel: 'undefinedModel' 
},
// Generate model SensemakingSessionRecordModel 

{
  id: 'sensemakingSessionRecord_name',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Name',
  displayPrompt: 'Please give this session record a name.',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_whenWhere',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'When and where',
  displayPrompt: 'When and where did this session take place?',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_groups',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Participant groups',
  displayPrompt: 'Which participant group(s) were at the session?',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_participants',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Who attended',
  displayPrompt: 'Describe the participants at this session.',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_plan',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Plan',
  displayPrompt: 'Which of your collection session plans did you follow in this session? (And did you stick to the plan?)',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_notes',
  dataType: 'string',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Notes',
  displayPrompt: 'Enter general notes on the session here.\nYour notes can include links to images or other documents.',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_resonantStoriesList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_addResonantStory',
  displayType: 'grid',
  displayName: 'Sensemaking session resonant stories',
  displayPrompt: 'If you discovered any resonant stories (pivot, voice, discovery) in this session,\nenter them here.',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_outcomesList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_newSensemakingSessionOutcome',
  displayType: 'grid',
  displayName: 'Sensemaking session outcomes',
  displayPrompt: 'If your session ended with creating lists of outcomes (like discoveries and ideas),\nyou can enter them here.',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_constructionsList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_newSensemakingSessionConstruction',
  displayType: 'grid',
  displayName: 'Sensemaking session constructions',
  displayPrompt: 'If your session involve creating any group constructions (like landscapes or timelines),\nyou can describe them here.',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflectionsLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'Use the questions below to reflect on the session.',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflectionsOnChangeHeader',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'Change',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflections_change_participantPerceptions',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Change in participant perceptions',
  displayPrompt: 'How did the perceptions of the participants change from the start to the end of the session?',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflections_change_yourPerceptions',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Change in facilitator perceptions',
  displayPrompt: 'How did <i>your</i> perceptions change?',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflections_change_project',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Changes to the project',
  displayPrompt: 'How has the overall project changed as a result of this session?',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_interactionsHeader',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'Interactions',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflections_interaction_participants',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Interactions among participants',
  displayPrompt: 'Describe the interactions between participants in this session.',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflections_interaction_participantsAndFacilitator',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Interactions between participants and facilitators',
  displayPrompt: 'Describe interactions between participants and facilitators.',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflections_interaction_stories',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Stories',
  displayPrompt: 'What did you notice about the stories people told, retold, chose, and worked with during the session?',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_learningHeader',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'Learning',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflections_learning_special',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Unique features',
  displayPrompt: 'What was special about these people in this place on this day?',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflections_learning_surprise',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Surprise',
  displayPrompt: 'What surprised you about this session?',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflections_learning_workedWell',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Worked and didn\'t work',
  displayPrompt: 'Which parts of your plans for this session worked out well? Which parts didn\'t?',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflections_learning_newIdeas',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'New ideas',
  displayPrompt: 'What new ideas did you gain from this session? What did you learn from it?',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflections_learning_wantToRemember',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Other',
  displayPrompt: 'What else do you want to remember about this session?',
  displayPage: 'page_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},

// -------------  PAGE page_addResonantStory Add resonant story popup  ------------- 

{
  id: 'page_addResonantStory',
  displayName: 'Add resonant story',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_addResonantStory',
  pageModel: 'undefinedModel' 
},
// Generate model ResonantStoryModel 

{
  id: 'sensemakingSessionRecord_resonantStory_selection',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'storiesList',
  displayName: 'Resonant story',
  displayPrompt: 'Choose a story to mark as a resonant story for this sensemaking session.',
  displayPage: 'page_addResonantStory',
  model: 'ResonantStoryModel' 
},
{
  id: 'sensemakingSessionRecord_resonantStory_type',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'pivot', 'voice', 'discovery', 'other' ],
  displayType: 'select',
  displayName: 'Type',
  displayPrompt: 'Which type of resonant story is this?',
  displayPage: 'page_addResonantStory',
  model: 'ResonantStoryModel' 
},
{
  id: 'sensemakingSessionRecord_resonantStory_reason',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Why',
  displayPrompt: 'Why did this story stand out?',
  displayPage: 'page_addResonantStory',
  model: 'ResonantStoryModel' 
},
{
  id: 'sensemakingSessionRecord_resonantStory_groups',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Groups',
  displayPrompt: 'For which participant groups was this story important?',
  displayPage: 'page_addResonantStory',
  model: 'ResonantStoryModel' 
},
{
  id: 'sensemakingSessionRecord_resonantStory_notes',
  dataType: 'string',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Notes',
  displayPrompt: 'Would you like to make any other notes about this story?',
  displayPage: 'page_addResonantStory',
  model: 'ResonantStoryModel' 
},

// -------------  PAGE page_newSensemakingSessionOutcome Sensemaking session outcome popup  ------------- 

{
  id: 'page_newSensemakingSessionOutcome',
  displayName: 'Sensemaking session outcome',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_newSensemakingSessionOutcome',
  pageModel: 'undefinedModel' 
},
// Generate model NewSensemakingSessionOutcomeModel 

{
  id: 'sensemakingSessionRecord_outcome_type',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: 
   [ 'discovery',
     'opportunity',
     'issue',
     'idea',
     'recommendation',
     'perspective',
     'dilemma',
     'other' ],
  displayType: 'select',
  displayName: 'Type',
  displayPrompt: 'What type of session outcome is this?',
  displayPage: 'page_newSensemakingSessionOutcome',
  model: 'NewSensemakingSessionOutcomeModel' 
},
{
  id: 'sensemakingSessionRecord_outcome_name',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Name',
  displayPrompt: 'Please give this outcome a name.',
  displayPage: 'page_newSensemakingSessionOutcome',
  model: 'NewSensemakingSessionOutcomeModel' 
},
{
  id: 'sensemakingSessionRecord_outcome_description',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Description',
  displayPrompt: 'Describe the outcome.',
  displayPage: 'page_newSensemakingSessionOutcome',
  model: 'NewSensemakingSessionOutcomeModel' 
},

// -------------  PAGE page_newSensemakingSessionConstruction Sensemaking construction popup  ------------- 

{
  id: 'page_newSensemakingSessionConstruction',
  displayName: 'Sensemaking construction',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_newSensemakingSessionConstruction',
  pageModel: 'undefinedModel' 
},
// Generate model NewSensemakingSessionConstructionModel 

{
  id: 'sensemakingSessionRecord_construction_name',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Name',
  displayPrompt: 'Please give this construction a name.',
  displayPage: 'page_newSensemakingSessionConstruction',
  model: 'NewSensemakingSessionConstructionModel' 
},
{
  id: 'sensemakingSessionRecord_construction_type',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: 
   [ 'timeline',
     'landscape',
     'story elements',
     'composite story',
     'other' ],
  displayType: 'select',
  displayName: 'Type',
  displayPrompt: 'What type of construction is it?',
  displayPage: 'page_newSensemakingSessionConstruction',
  model: 'NewSensemakingSessionConstructionModel' 
},
{
  id: 'sensemakingSessionRecord_construction_description',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Description',
  displayPrompt: 'Please describe the construction (or include a description given by participants).\nYour description can include links to images or documents.',
  displayPage: 'page_newSensemakingSessionConstruction',
  model: 'NewSensemakingSessionConstructionModel' 
},

// -------------  PAGE page_readSensemakingReport Read sensemaking report page  ------------- 

{
  id: 'page_readSensemakingReport',
  displayName: 'Read sensemaking report',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_readSensemakingReport',
  pageModel: 'undefinedModel' 
},
{
  id: 'sensemakingReportLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'This report shows all of the information entered in the pages grouped under "Sensemaking."',
  displayPage: 'page_readSensemakingReport',
  model: 'ProjectModel' 
},
{
  id: 'sensemakingReport',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'sensemaking',
  displayType: 'report',
  displayName: undefined,
  displayPrompt: 'Sensemaking report',
  displayPage: 'page_readSensemakingReport',
  model: 'ProjectModel' 
},

// ==================== SECTION page_intervention Intervention ==========================

// -------------  HEADER page_intervention Intervention page  ------------- 

{
  id: 'page_intervention',
  displayName: 'Intervention',
  displayType: 'page',
  isHeader: true,
  displayPage: 'page_intervention',
  pageModel: 'undefinedModel' 
},
{
  id: 'interventionIntroLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'In the intervention phase of your PNI project, you will plan interventions and record information about them.',
  displayPage: 'page_intervention',
  model: 'ProjectModel' 
},
{
  id: 'project_generalNotes_intervention',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Intervention notes',
  displayPrompt: 'You can enter some general notes on intervention in this project here.',
  displayPage: 'page_intervention',
  model: 'ProjectModel' 
},

// -------------  PAGE page_projectOutcomesForIntervention Answer questions about project outcomes page  ------------- 

{
  id: 'page_projectOutcomesForIntervention',
  displayName: 'Answer questions about project outcomes',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_projectOutcomesForIntervention',
  pageModel: 'undefinedModel' 
},
{
  id: 'project_outcomesList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_projectOutcome',
  displayType: 'grid',
  displayName: 'Project outcomes',
  displayPrompt: 'In order to choose interventions that will be useful in your project, it will be helpful to think about some\nof the issues (positive and negative) you discovered in your project. Please answer these questions in reference to\nthe participant groups you set up in the project planning phase. Please enter one record for each participant group.',
  displayPage: 'page_projectOutcomesForIntervention',
  model: 'ProjectModel' 
},

// -------------  PAGE page_projectOutcome Project outcomes popup  ------------- 

{
  id: 'page_projectOutcome',
  displayName: 'Project outcomes',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_projectOutcome',
  pageModel: 'undefinedModel' 
},
// Generate model ProjectOutcomeModel 

{
  id: 'outcomes_group',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Participant group',
  displayPrompt: 'Which participant group is this outcome for?',
  displayPage: 'page_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_hopesHeader',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'Hopes',
  displayPage: 'page_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleFeltHeard',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'never', 'occasionally', 'sometimes', 'often', 'mixed' ],
  displayType: 'select',
  displayName: 'Felt heard',
  displayPrompt: 'During your project, did the people in this group say they felt heard for the first time?',
  displayPage: 'page_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleFeltInvolved',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'never', 'occasionally', 'sometimes', 'often', 'mixed' ],
  displayType: 'select',
  displayName: 'Felt involved',
  displayPrompt: 'Did they say they felt involved for the first time?',
  displayPage: 'page_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleLearnedAboutCommOrg',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'never', 'occasionally', 'sometimes', 'often', 'mixed' ],
  displayType: 'select',
  displayName: 'Learned about community',
  displayPrompt: 'Did they say they learned a lot about their community or organization?',
  displayPage: 'page_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_voicesHeader',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'Voices',
  displayPage: 'page_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleWantedToTellMoreStories',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'never', 'occasionally', 'sometimes', 'often', 'mixed' ],
  displayType: 'select',
  displayName: 'Wanted to tell more',
  displayPrompt: 'During your story collection, did these people seem to want to tell more stories than you collected?',
  displayPage: 'page_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleWantedToShareMoreStoriesWithEachOther',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'never', 'occasionally', 'sometimes', 'often', 'mixed' ],
  displayType: 'select',
  displayName: 'Wanted to share more',
  displayPrompt: 'Did you ever feel that they wanted to share more experiences with each other than they did?',
  displayPage: 'page_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleFeltStoriesNeededToBeHeard',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'not at all', 'somewhat', 'definitely', 'mixed' ],
  displayType: 'select',
  displayName: 'Felt that stories needed to be heard',
  displayPrompt: 'Did these people feel that some of the stories you collected "needed to be heard" by anyone?',
  displayPage: 'page_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleFeltNobodyCares',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'not at all', 'somewhat', 'definitely', 'mixed' ],
  displayType: 'select',
  displayName: 'Felt that nobody cares',
  displayPrompt: 'Were there any issues that these people thought "nobody cares" about?',
  displayPage: 'page_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_needsHeader',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'Needs',
  displayPage: 'page_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleFeltNobodyCanMeetNeeds',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'not at all', 'somewhat', 'definitely', 'mixed' ],
  displayType: 'select',
  displayName: 'Needs could not be met',
  displayPrompt: 'Do the people in this group have needs that <i>nobody</i> can meet?',
  displayPage: 'page_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleFeltTheyNeedNewStories',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'not at all', 'somewhat', 'definitely', 'mixed' ],
  displayType: 'select',
  displayName: 'Needed to tell themselves new stories',
  displayPrompt: 'Do these people need to start telling themselves <i>new</i> stories?',
  displayPage: 'page_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleWantedToKeepExploring',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'not at all', 'somewhat', 'definitely', 'mixed' ],
  displayType: 'select',
  displayName: 'Wanted more exploration',
  displayPrompt: 'Were there any issues about which the people in this group seemed to want to keep exploring?',
  displayPage: 'page_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_crisisPointsWereFound',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'not at all', 'somewhat', 'definitely', 'mixed' ],
  displayType: 'select',
  displayName: 'Crisis points',
  displayPrompt: 'Did you discover any "crisis points" where people in this group needed help and didn\'t get it?',
  displayPage: 'page_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_issuesWereBeyondWords',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'not at all', 'somewhat', 'definitely', 'mixed' ],
  displayType: 'select',
  displayName: 'Beyond words',
  displayPrompt: 'Did you find any issues for this group that were beyond words, that no amount of discussion could resolve?',
  displayPage: 'page_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_learningHeader',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'Learning',
  displayPage: 'page_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleLearnedAboutTopic',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'never', 'occasionally', 'sometimes', 'often', 'mixed' ],
  displayType: 'select',
  displayName: 'Learned about topic',
  displayPrompt: 'Did these people say that they learned a lot about the topic by participating in the project?',
  displayPage: 'page_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_issuesNewMembersStruggleWith',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'not at all', 'somewhat', 'definitely', 'mixed' ],
  displayType: 'select',
  displayName: 'New members needed help',
  displayPrompt: 'Did you notice that new members of the community or organization were having a harder time making sense of things?',
  displayPage: 'page_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_foundInfoWithoutUnderstanding',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'not at all', 'somewhat', 'definitely', 'mixed' ],
  displayType: 'select',
  displayName: 'Had more information than understanding',
  displayPrompt: 'Were there any issues that these people found difficult to understand, even though abundant information was available?',
  displayPage: 'page_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_foundOverConfidence',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'not at all', 'somewhat', 'definitely', 'mixed' ],
  displayType: 'select',
  displayName: 'Had more confidence than skill',
  displayPrompt: 'Did you discover any areas in which these people had more confidence than skill?',
  displayPage: 'page_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleCuriousAboutStoryWork',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: [ 'never', 'occasionally', 'sometimes', 'often', 'mixed' ],
  displayType: 'select',
  displayName: 'Wanted to learn about story work',
  displayPrompt: 'Did any of these participants express an interest in learning more about story work?',
  displayPage: 'page_projectOutcome',
  model: 'ProjectOutcomeModel' 
},

// -------------  PAGE page_designInterventions Design intervention plans page  ------------- 

{
  id: 'page_designInterventions',
  displayName: 'Design intervention plans',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_designInterventions',
  pageModel: 'undefinedModel' 
},
{
  id: 'project_interventionLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you can design interventions that change the stories people tell\nin your community or organization.',
  displayPage: 'page_designInterventions',
  model: 'ProjectModel' 
},
{
  id: 'interventionRecommendations',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'interventions',
  displayType: 'recommendationTable',
  displayName: undefined,
  displayPrompt: 'Recommendations for intervention plans',
  displayPage: 'page_designInterventions',
  model: 'ProjectModel' 
},
{
  id: 'project_interventionPlansList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_addIntervention',
  displayType: 'grid',
  displayName: 'Intervention plans',
  displayPrompt: 'Enter your plans for narrative interventions here.',
  displayPage: 'page_designInterventions',
  model: 'ProjectModel' 
},

// -------------  PAGE page_addIntervention Plan an intervention popup  ------------- 

{
  id: 'page_addIntervention',
  displayName: 'Plan an intervention',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_addIntervention',
  pageModel: 'InterventionPlanModel' 
},
// Generate model InterventionModel 

{
  id: 'interventionPlan_name',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Name',
  displayPrompt: 'Please name this intervention plan.',
  displayPage: 'page_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_type',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: 
   [ 'narrative ombudsman',
     'narrative suggestion box',
     'story sharing space',
     'narrative orientation',
     'narrative learning resource',
     'narrative simulation',
     'narrative presentation',
     'dramatic action',
     'sensemaking space',
     'sensemaking pyramid',
     'narrative mentoring program',
     'narrative therapy',
     'participatory theatre',
     'other' ],
  displayType: 'select',
  displayName: 'Type',
  displayPrompt: 'What type of intervention will this be?',
  displayPage: 'page_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_description',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Description',
  displayPrompt: 'Please describe your plan for this intervention.',
  displayPage: 'page_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_groups',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Participant groups',
  displayPrompt: 'Which participant group(s) will be involved?',
  displayPage: 'page_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_times',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Time',
  displayPrompt: 'When will the intervention start and end?',
  displayPage: 'page_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_locations',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Location',
  displayPrompt: 'Where will the intervention take place?',
  displayPage: 'page_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_help',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Help',
  displayPrompt: 'What sort of help will you need to carry out this intervention?',
  displayPage: 'page_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_permission',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Permission',
  displayPrompt: 'Describe any permissions you will need to carry out this intervention.',
  displayPage: 'page_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_participation',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Participation',
  displayPrompt: 'How will you get people to participate in this intervention?',
  displayPage: 'page_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_materials',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Materials',
  displayPrompt: 'What physical materials will you need?',
  displayPage: 'page_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_space',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Spaces',
  displayPrompt: 'What spaces will you use?',
  displayPage: 'page_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_techResources',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Technology',
  displayPrompt: 'What technological resources will you need?',
  displayPage: 'page_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_recording',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Recording',
  displayPrompt: 'How will you record the results of this intervention?',
  displayPage: 'page_addIntervention',
  model: 'InterventionModel' 
},

// -------------  PAGE page_recordInterventions Enter intervention records page  ------------- 

{
  id: 'page_recordInterventions',
  displayName: 'Enter intervention records',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_recordInterventions',
  pageModel: 'undefinedModel' 
},
{
  id: 'project_interventionRecordsLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you will enter records of your interventions.',
  displayPage: 'page_recordInterventions',
  model: 'ProjectModel' 
},
{
  id: 'project_interventionRecordsList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_addInterventionRecord',
  displayType: 'grid',
  displayName: 'Intervention records',
  displayPrompt: 'Use this list to keep records of the interventions you carried out.',
  displayPage: 'page_recordInterventions',
  model: 'ProjectModel' 
},

// -------------  PAGE page_addInterventionRecord Add intervention record popup  ------------- 

{
  id: 'page_addInterventionRecord',
  displayName: 'Add intervention record',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_addInterventionRecord',
  pageModel: 'undefinedModel' 
},
// Generate model InterventionRecordModel 

{
  id: 'interventionRecord_name',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Name',
  displayPrompt: 'Please give this intervention record a name.',
  displayPage: 'page_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_description',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Description',
  displayPrompt: 'Please describe what happened during the intervention, in general.',
  displayPage: 'page_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_groups',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Participant groups',
  displayPrompt: 'Which participant group(s) were involved?',
  displayPage: 'page_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflectLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'Use the questions below to reflect on the intervention.',
  displayPage: 'page_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflectionsOnChangeHeader',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'Change',
  displayPage: 'page_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflections_change_participantPerceptions',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Change in participant perceptions',
  displayPrompt: 'How did the perceptions of the participants change from the start to the end of the intervention?',
  displayPage: 'page_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflections_change_yourPerceptions',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Change in facilitator perceptions',
  displayPrompt: 'How did <i>your</i> perceptions change?',
  displayPage: 'page_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflections_change_project',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Changes to the project',
  displayPrompt: 'How has the overall project changed as a result of this intervention?',
  displayPage: 'page_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_interactionsHeader',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'Interactions',
  displayPage: 'page_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflections_interaction_participants',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Interactions among participants',
  displayPrompt: 'Describe the interactions between participants in this intervention.',
  displayPage: 'page_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflections_interaction_participantsAndFacilitator',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Interactions between participants and facilitators',
  displayPrompt: 'Describe interactions between participants and facilitators.',
  displayPage: 'page_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflections_interaction_stories',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Stories',
  displayPrompt: 'What did you notice about the stories people told, retold, chose, and worked with during the intervention?',
  displayPage: 'page_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_learningHeader',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'header',
  displayName: undefined,
  displayPrompt: 'Learning',
  displayPage: 'page_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflections_learning_special',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Unique features',
  displayPrompt: 'What was special about this intervention?',
  displayPage: 'page_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflections_learning_surprise',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Surprise',
  displayPrompt: 'What surprised you about this intervention?',
  displayPage: 'page_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflections_learning_workedWell',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Worked and didn\'t work',
  displayPrompt: 'Which parts of your plans for this intervention worked out well? Which parts didn\'t?',
  displayPage: 'page_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflections_learning_newIdeas',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'New ideas',
  displayPrompt: 'What new ideas did you gain from this intervention? What did you learn from it?',
  displayPage: 'page_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflections_learning_wantToRemember',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Other',
  displayPrompt: 'What else do you want to remember about this intervention?',
  displayPage: 'page_addInterventionRecord',
  model: 'InterventionRecordModel' 
},

// -------------  PAGE page_interventionReport Read intervention report page  ------------- 

{
  id: 'page_interventionReport',
  displayName: 'Read intervention report',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_interventionReport',
  pageModel: 'undefinedModel' 
},
{
  id: 'interventionReportLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'This report shows all of the information entered in the pages grouped under "Intervention."',
  displayPage: 'page_interventionReport',
  model: 'ProjectModel' 
},
{
  id: 'interventionReport',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'intervention',
  displayType: 'report',
  displayName: undefined,
  displayPrompt: 'Intervention report',
  displayPage: 'page_interventionReport',
  model: 'ProjectModel' 
},

// ==================== SECTION page_return Return ==========================

// -------------  HEADER page_return Return page  ------------- 

{
  id: 'page_return',
  displayName: 'Return',
  displayType: 'page',
  isHeader: true,
  displayPage: 'page_return',
  pageModel: 'undefinedModel' 
},
{
  id: 'returnIntroLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'In the return phase of your PNI project, you will gather feedback, reflect on the project, possibly present\nthe project to someone, and help people with requests about the project.',
  displayPage: 'page_return',
  model: 'ProjectModel' 
},
{
  id: 'project_generalNotes_return',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Return phase notes',
  displayPrompt: 'You can enter some general notes on the return phase of this project here.',
  displayPage: 'page_return',
  model: 'ProjectModel' 
},

// -------------  PAGE page_gatherFeedback Gather feedback page  ------------- 

{
  id: 'page_gatherFeedback',
  displayName: 'Gather feedback',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_gatherFeedback',
  pageModel: 'undefinedModel' 
},
{
  id: 'project_feedbackLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you will enter any feedback you gather about your project.',
  displayPage: 'page_gatherFeedback',
  model: 'ProjectModel' 
},
{
  id: 'project_feedbackItemsList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_enterFeedbackPiece',
  displayType: 'grid',
  displayName: 'Pieces of feedback',
  displayPrompt: 'You can enter specific pieces of feedback you have gathered here.',
  displayPage: 'page_gatherFeedback',
  model: 'ProjectModel' 
},
{
  id: 'feedback_generalNotes',
  dataType: 'string',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Notes',
  displayPrompt: 'If you would like to enter any general notes on the feedback you\'ve seen to the project, write them here.',
  displayPage: 'page_gatherFeedback',
  model: 'ProjectModel' 
},

// -------------  PAGE page_enterFeedbackPiece Enter piece of feedback on project popup  ------------- 

{
  id: 'page_enterFeedbackPiece',
  displayName: 'Enter piece of feedback on project',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_enterFeedbackPiece',
  pageModel: 'undefinedModel' 
},
// Generate model EnterFeedbackPieceModel 

{
  id: 'feedback_text',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Feedback',
  displayPrompt: 'What did someone say or do?',
  displayPage: 'page_enterFeedbackPiece',
  model: 'EnterFeedbackPieceModel' 
},
{
  id: 'feedback_name',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Name',
  displayPrompt: 'Please give this piece of feedback a name.',
  displayPage: 'page_enterFeedbackPiece',
  model: 'EnterFeedbackPieceModel' 
},
{
  id: 'feedback_type',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: 
   [ 'a story',
     'a reference to something that came up in the project',
     'a wish about the future',
     'an opinion',
     'a complaint',
     'an action',
     'other' ],
  displayType: 'select',
  displayName: 'Type',
  displayPrompt: 'What type of feedback is this?',
  displayPage: 'page_enterFeedbackPiece',
  model: 'EnterFeedbackPieceModel' 
},
{
  id: 'feedback_who',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Source',
  displayPrompt: 'Who said or did this?',
  displayPage: 'page_enterFeedbackPiece',
  model: 'EnterFeedbackPieceModel' 
},
{
  id: 'feedback_prompt',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Prompt',
  displayPrompt: 'What did you say or do (if anything) that led to this feedback?',
  displayPage: 'page_enterFeedbackPiece',
  model: 'EnterFeedbackPieceModel' 
},
{
  id: 'feedback_response',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Response',
  displayPrompt: 'What did you say or do (if anything) in response?',
  displayPage: 'page_enterFeedbackPiece',
  model: 'EnterFeedbackPieceModel' 
},
{
  id: 'feedback_notes',
  dataType: 'string',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Notes',
  displayPrompt: 'Please enter any other notes you have about this piece of feedback.',
  displayPage: 'page_enterFeedbackPiece',
  model: 'EnterFeedbackPieceModel' 
},

// -------------  PAGE page_reflectOnProject Reflect on the project page  ------------- 

{
  id: 'page_reflectOnProject',
  displayName: 'Reflect on the project',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_reflectOnProject',
  pageModel: 'undefinedModel' 
},
{
  id: 'project_reflectLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you will answer some questions to reflect in general on the entire project.',
  displayPage: 'page_reflectOnProject',
  model: 'ProjectModel' 
},
{
  id: 'project_reflect_stories',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'From stories',
  displayPrompt: 'What have you learned from the stories you heard in this project?',
  displayPage: 'page_reflectOnProject',
  model: 'ProjectModel' 
},
{
  id: 'project_reflect_facilitation',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'About facilitation practice',
  displayPrompt: 'What did you learn about your facilitation practice in this project?',
  displayPage: 'page_reflectOnProject',
  model: 'ProjectModel' 
},
{
  id: 'project_reflect_planning',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'About project stories',
  displayPrompt: 'What did you learn about project planning?',
  displayPage: 'page_reflectOnProject',
  model: 'ProjectModel' 
},
{
  id: 'project_reflect_ownPNI',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'About own PNI',
  displayPrompt: 'How has this project changed your own version of PNI?',
  displayPage: 'page_reflectOnProject',
  model: 'ProjectModel' 
},
{
  id: 'project_reflect_community',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'About community',
  displayPrompt: 'What have you learned about your community or organization because of this project?',
  displayPage: 'page_reflectOnProject',
  model: 'ProjectModel' 
},
{
  id: 'project_reflect_personalStrengths',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'About strengths',
  displayPrompt: 'What did this project teach you about your personal strengths and weaknesses?',
  displayPage: 'page_reflectOnProject',
  model: 'ProjectModel' 
},
{
  id: 'project_reflect_teamStrengths',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'About team',
  displayPrompt: 'What did this project teach you about your team?',
  displayPage: 'page_reflectOnProject',
  model: 'ProjectModel' 
},
{
  id: 'project_reflect_newIdeas',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Ideas',
  displayPrompt: 'Describe any new ideas that came up during this project.',
  displayPage: 'page_reflectOnProject',
  model: 'ProjectModel' 
},
{
  id: 'project_reflect_notes',
  dataType: 'string',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Notes',
  displayPrompt: 'Enter any additional notes you\'d like to remember about the project.',
  displayPage: 'page_reflectOnProject',
  model: 'ProjectModel' 
},

// -------------  PAGE page_prepareProjectPresentation Prepare outline of project presentation page  ------------- 

{
  id: 'page_prepareProjectPresentation',
  displayName: 'Prepare outline of project presentation',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_prepareProjectPresentation',
  pageModel: 'undefinedModel' 
},
{
  id: 'project_presentationLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you can build a presentation about your project to show to others.',
  displayPage: 'page_prepareProjectPresentation',
  model: 'ProjectModel' 
},
{
  id: 'project_presentationElementsList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_addPresentationElement',
  displayType: 'grid',
  displayName: 'Presentation elements',
  displayPrompt: 'There are elements (points of discussion) to present about your project.',
  displayPage: 'page_prepareProjectPresentation',
  model: 'ProjectModel' 
},
{
  id: 'projectPresentation_presentationLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'After you finish adding elements for your presentation, you can export the elements, open them in your word processor, and add material\nfrom any of the stage reports (or the final project report).',
  displayPage: 'page_prepareProjectPresentation',
  model: 'ProjectModel' 
},
{
  id: 'projectPresentation_exportPresentationOutlineButton',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'button',
  displayName: undefined,
  displayPrompt: 'Export these elements',
  displayPage: 'page_prepareProjectPresentation',
  model: 'ProjectModel' 
},

// -------------  PAGE page_addPresentationElement Add element to project presentation outline popup  ------------- 

{
  id: 'page_addPresentationElement',
  displayName: 'Add element to project presentation outline',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_addPresentationElement',
  pageModel: 'undefinedModel' 
},
// Generate model PresentationElementModel 

{
  id: 'projectPresentationElement_name',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'text',
  displayName: 'Name',
  displayPrompt: 'What name would you like to give this element in your presentation?',
  displayPage: 'page_addPresentationElement',
  model: 'PresentationElementModel' 
},
{
  id: 'projectPresentationElement_statement',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Description',
  displayPrompt: 'How would you like to describe this element in your presentation?',
  displayPage: 'page_addPresentationElement',
  model: 'PresentationElementModel' 
},
{
  id: 'projectPresentationElement_evidence',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Evidence',
  displayPrompt: 'What evidence does this element present that your project met its goals?',
  displayPage: 'page_addPresentationElement',
  model: 'PresentationElementModel' 
},
{
  id: 'projectPresentationElement_QA',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Q&A',
  displayPrompt: 'What questions do you anticipate about this element, and how would you like to answer them?',
  displayPage: 'page_addPresentationElement',
  model: 'PresentationElementModel' 
},
{
  id: 'projectPresentationElement_notes',
  dataType: 'string',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Notes',
  displayPrompt: 'Enter any other notes you want to remember about this element as you present it.',
  displayPage: 'page_addPresentationElement',
  model: 'PresentationElementModel' 
},

// -------------  PAGE page_projectRequests Respond to requests for post-project support page  ------------- 

{
  id: 'page_projectRequests',
  displayName: 'Respond to requests for post-project support',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_projectRequests',
  pageModel: 'undefinedModel' 
},
{
  id: 'project_returnRequestsLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'On this page you can keep track of requests for help as your project winds down.',
  displayPage: 'page_projectRequests',
  model: 'ProjectModel' 
},
{
  id: 'project_returnRequestsList',
  dataType: 'array',
  required: true,
  validators: undefined,
  options: 'page_addNewReturnRequest',
  displayType: 'grid',
  displayName: 'Help requests',
  displayPrompt: 'Enter requests for help here.',
  displayPage: 'page_projectRequests',
  model: 'ProjectModel' 
},

// -------------  PAGE page_addNewReturnRequest Enter project request popup  ------------- 

{
  id: 'page_addNewReturnRequest',
  displayName: 'Enter project request',
  displayType: 'popup',
  isHeader: false,
  displayPage: 'page_addNewReturnRequest',
  pageModel: 'undefinedModel' 
},
// Generate model ReturnRequestModel 

{
  id: 'returnRequest_text',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Request',
  displayPrompt: 'What is the request?',
  displayPage: 'page_addNewReturnRequest',
  model: 'ReturnRequestModel' 
},
{
  id: 'returnRequest_type',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: 
   [ 'help with their own projects',
     'help with sustaining story exchange',
     'help with examining this project\'s stories and results',
     'help learning about story work',
     'other' ],
  displayType: 'select',
  displayName: 'Type',
  displayPrompt: 'What type of request is this?',
  displayPage: 'page_addNewReturnRequest',
  model: 'ReturnRequestModel' 
},
{
  id: 'returnRequest_isMet',
  dataType: 'boolean',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'boolean',
  displayName: 'Satisfied',
  displayPrompt: 'Do you consider this request to have been satisfied?',
  displayPage: 'page_addNewReturnRequest',
  model: 'ReturnRequestModel' 
},
{
  id: 'returnRequest_whatHappened',
  dataType: 'string',
  required: true,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'What happened',
  displayPrompt: 'What has happened in relation to this request?',
  displayPage: 'page_addNewReturnRequest',
  model: 'ReturnRequestModel' 
},
{
  id: 'returnRequest_notes',
  dataType: 'string',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'textarea',
  displayName: 'Notes',
  displayPrompt: 'Enter any notes about the request here.',
  displayPage: 'page_addNewReturnRequest',
  model: 'ReturnRequestModel' 
},

// -------------  PAGE page_returnReport Read return report page  ------------- 

{
  id: 'page_returnReport',
  displayName: 'Read return report',
  displayType: 'page',
  isHeader: false,
  displayPage: 'page_returnReport',
  pageModel: 'undefinedModel' 
},
{
  id: 'returnReportLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'This report shows all of the information entered in the pages grouped under "Return."',
  displayPage: 'page_returnReport',
  model: 'ProjectModel' 
},
{
  id: 'returnReport',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'return',
  displayType: 'report',
  displayName: undefined,
  displayPrompt: 'Return report',
  displayPage: 'page_returnReport',
  model: 'ProjectModel' 
},

// ==================== SECTION page_projectReport Project report ==========================

// -------------  HEADER page_projectReport Project report page  ------------- 

{
  id: 'page_projectReport',
  displayName: 'Project report',
  displayType: 'page',
  isHeader: true,
  displayPage: 'page_projectReport',
  pageModel: 'undefinedModel' 
},
{
  id: 'wholeProjectReportLabel',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: undefined,
  displayType: 'label',
  displayName: undefined,
  displayPrompt: 'This report shows all of the information entered in all of the pages of this software.',
  displayPage: 'page_projectReport',
  model: 'ProjectModel' 
},
{
  id: 'projectReport',
  dataType: 'none',
  required: false,
  validators: undefined,
  options: 'project',
  displayType: 'report',
  displayName: undefined,
  displayPrompt: 'Project report',
  displayPage: 'page_projectReport',
  model: 'ProjectModel' 
},

]);
