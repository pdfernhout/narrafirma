"use strict";

define(
[
    {
        "id": "FIXME_11",
        "name": "Dashboard",
        "description": "// all checklists combined\n",
        "isHeader": true,
        "type": "FIXME_11",
        "questions": []
    },
    {
        "id": "FIXME_14",
        "name": "Planning",
        "description": "// Project facts - x of x questions answered\n// Planning questions - [ ] draft\n// Project aspects - x of x questions answered\n// Project stories - x stories told\n// Project story elements - x elements entered\n// Story sharing assessment - x of 20 questions answered\n// Project synopsis - [ ] complete\n",
        "isHeader": true,
        "type": "headerpage_planning",
        "questions": []
    },
    {
        "id": "FIXME_23",
        "name": "Enter project facts",
        "description": "",
        "isHeader": false,
        "type": "page_projectFacts",
        "questions": [
            {
                "id": "FIXME_25",
                "text": "On this page you will enter some facts about your project. The things you enter here will appear in your reports.",
                "type": "label"
            },
            {
                "id": "FIXME_27",
                "text": "What is the project's title?",
                "type": "text"
            },
            {
                "id": "FIXME_28",
                "text": "What is the name of your community or organization?",
                "type": "text"
            },
            {
                "id": "FIXME_29",
                "text": "Who is facilitating the project? (names and titles)",
                "type": "text"
            },
            {
                "id": "FIXME_30",
                "text": "What are the project's start and ending dates?",
                "type": "text"
            },
            {
                "id": "FIXME_31",
                "text": "Please enter any other information you want to appear at the top of project reports.",
                "type": "textarea"
            },
            {
                "id": "FIXME_32",
                "text": "Please enter any other information you want to appear at the bottom of project reports (as notes).",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "FIXME_34",
        "name": "Answer PNI Planning questions",
        "description": "",
        "isHeader": false,
        "type": "page_planningQuestionsDraft",
        "questions": [
            {
                "id": "FIXME_36",
                "text": "On this page you will answer some questions about your project's goals, relationships, focus, range, scope, and emphasis.\nIf you don't have good answers for these questions right now, don't worry; you will have a chance to come back and work on these answers again later.",
                "type": "label"
            },
            {
                "id": "FIXME_39",
                "text": "What is the goal of the project? Why are you doing it?",
                "type": "textarea"
            },
            {
                "id": "FIXME_40",
                "text": "What relationships are important to the project?",
                "type": "textarea"
            },
            {
                "id": "FIXME_41",
                "text": "What is the focus of the project? What is it about?",
                "type": "textarea"
            },
            {
                "id": "FIXME_42",
                "text": "What range(s) of experience will the project cover?",
                "type": "textarea"
            },
            {
                "id": "FIXME_43",
                "text": "What is the project's scope? (number of people, number of stories, number of questions about stories)",
                "type": "textarea"
            },
            {
                "id": "FIXME_44",
                "text": "Which phases of PNI will be important to the project? (indicate most and least important phases)",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "FIXME_46",
        "name": "Consider project aspects",
        "description": "",
        "isHeader": false,
        "type": "page_projectAspects",
        "questions": [
            {
                "id": "FIXME_48",
                "text": "On this page you will think about groups of participants you want to involve in your project.\nExamples might be: doctors and patients; staff and customers; natives, immigrants, and tourists.\nNarraCoach supports planning for up to three groups of project participants.",
                "type": "label"
            },
            {
                "id": "FIXME_52",
                "text": "Please name the group of participants from whom the project most needs to hear.",
                "type": "text"
            },
            {
                "id": "FIXME_53",
                "text": "Please describe this group of participants.\nFor example, you might want to record any observations you have made about this group.\nWhat do you know about them?",
                "type": "textarea"
            },
            {
                "id": "FIXME_57",
                "text": "Please name the group of participants from whom the project needs to hear next.",
                "type": "text"
            },
            {
                "id": "FIXME_58",
                "text": "Please describe the second-most critical group of participants.",
                "type": "textarea"
            },
            {
                "id": "FIXME_59",
                "text": "If there is a third group of participants from whom the project needs to hear, please name them.",
                "type": "text"
            },
            {
                "id": "FIXME_60",
                "text": "Please describe the third-most critical group of participants.",
                "type": "textarea"
            },
            {
                "id": "FIXME_62",
                "text": "Please answer these questions about each participant group.",
                "type": "page_aspectsTable",
                "options": "participants_firstGroupName,participants_secondGroupName,participants_thirdGroupName"
            }
        ]
    },
    {
        "id": "FIXME_64",
        "name": "Aspects table",
        "description": "",
        "isHeader": false,
        "type": "questionsTable",
        "questions": [
            {
                "id": "FIXME_66",
                "text": "Status",
                "type": "header"
            },
            {
                "id": "FIXME_67",
                "text": "What is the status of these participants in the community or organization?",
                "type": "select",
                "options": "unknown;very low;low;moderate;high;very high;mixed"
            },
            {
                "id": "FIXME_68",
                "text": "How much self-confidence do these participants have?",
                "type": "select",
                "options": "unknown;very low;low;medium;high;very high;mixed"
            },
            {
                "id": "FIXME_70",
                "text": "Ability",
                "type": "header"
            },
            {
                "id": "FIXME_71",
                "text": "How much free time do these participants have?",
                "type": "select",
                "options": "unknown;very little;little;some;much;mixed"
            },
            {
                "id": "FIXME_72",
                "text": "What is the education level of these participants?",
                "type": "select",
                "options": "unknown;illiterate;minimal;moderate;high;very high;mixed"
            },
            {
                "id": "FIXME_73",
                "text": "Do these participants have physical limitations that will impact their participation?",
                "type": "select",
                "options": "unknown;none;minimal;moderate;strong;mixed"
            },
            {
                "id": "FIXME_74",
                "text": "Do these participants have emotional impairments that will impact their participation (such as mental illness or traumatic stress)?",
                "type": "select",
                "options": "unknown;none;minimal;moderate;strong;mixed"
            },
            {
                "id": "FIXME_76",
                "text": "Expectations",
                "type": "header"
            },
            {
                "id": "FIXME_77",
                "text": "For these participants, how important is performing well (with \"high marks\")?",
                "type": "select",
                "options": "unknown;very unimportant;somewhat unimportant;somewhat important;very important;mixed"
            },
            {
                "id": "FIXME_78",
                "text": "For these participants, how important is conforming (to what is \"normal\" or expected)?",
                "type": "select",
                "options": "unknown;very unimportant;somewhat unimportant;somewhat important;very important;mixed"
            },
            {
                "id": "FIXME_79",
                "text": "For these participants, how important is self-promotion (competing with others)?",
                "type": "select",
                "options": "unknown;very unimportant;somewhat unimportant;somewhat important;very important;mixed"
            },
            {
                "id": "FIXME_80",
                "text": "For these participants, how important is speaking out (having a say, venting, sounding off)?",
                "type": "select",
                "options": "unknown;very unimportant;somewhat unimportant;somewhat important;very important;mixed"
            },
            {
                "id": "FIXME_82",
                "text": "Feelings about the project",
                "type": "header"
            },
            {
                "id": "FIXME_83",
                "text": "How motivated are these participants to participate in the project?",
                "type": "select",
                "options": "unknown;very little;a little;some;a lot;extremely;mixed"
            },
            {
                "id": "FIXME_84",
                "text": "How are these participants likely to feel about the project?",
                "type": "select",
                "options": "unknown;negative;neutral;positive;mixed"
            },
            {
                "id": "FIXME_85",
                "text": "How do these participants feel about you?",
                "type": "select",
                "options": "unknown;negative;neutral;positive;mixed"
            },
            {
                "id": "FIXME_86",
                "text": "How do these participants feel about the idea of collecting stories?",
                "type": "select",
                "options": "unknown;negative;neutral;positive;mixed"
            },
            {
                "id": "FIXME_88",
                "text": "Feelings about the topic",
                "type": "header"
            },
            {
                "id": "FIXME_89",
                "text": "What experiences have these participants had with the project's topic?",
                "type": "select",
                "options": "unknown;strongly negative;negative;neutral;positive;strongly positive;mixed"
            },
            {
                "id": "FIXME_90",
                "text": "How private do these participants consider the topic to be?",
                "type": "select",
                "options": "unknown;very private;medium;not private;mixed"
            },
            {
                "id": "FIXME_91",
                "text": "How hard will it be for these participants to articulate their feelings about the topic?",
                "type": "select",
                "options": "unknown;hard;medium;easy;mixed"
            },
            {
                "id": "FIXME_92",
                "text": "How long of a time period do you need these participants to look back on?",
                "type": "select",
                "options": "unknown;hours;days;months;years;decades;mixed"
            }
        ]
    },
    {
        "id": "FIXME_94",
        "name": "Tell project stories",
        "description": "",
        "isHeader": false,
        "type": "page_projectStories",
        "questions": [
            {
                "id": "FIXME_96",
                "text": "Project story list",
                "type": "grid",
                "options": "page_projectStory"
            }
        ]
    },
    {
        "id": "FIXME_98",
        "name": "Project story",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "FIXME_100",
                "text": "Start by choosing a scenario that starts your project story.",
                "type": "select",
                "options": "ask me anything;magic ears;fly on the wall;project aspects;my own scenario type"
            },
            {
                "id": "FIXME_101",
                "text": "Now choose an outcome for your story.",
                "type": "select",
                "options": "colossal success;miserable failure;acceptable outcome;my own outcome"
            },
            {
                "id": "FIXME_102",
                "text": "Now tell your project story as a future history (as though it has already happened).",
                "type": "textarea"
            },
            {
                "id": "FIXME_103",
                "text": "Please name your project story.",
                "type": "text"
            },
            {
                "id": "FIXME_104",
                "text": "How do you feel about this story?",
                "type": "textarea"
            },
            {
                "id": "FIXME_105",
                "text": "What surprised you about this story?",
                "type": "textarea"
            },
            {
                "id": "FIXME_106",
                "text": "Describe any opportunities or dangers you see in this story.",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "FIXME_108",
        "name": "Create project story elements",
        "description": "",
        "isHeader": false,
        "type": "page_projectStoryElements",
        "questions": [
            {
                "id": "FIXME_110",
                "text": "Here are some instructions on how to create story elements from your project stories.\n<ol>\n<li>Choose one or two types of story element (characters, situations, values, themes, relationships, motivations, beliefs, conflicts).</li>\n<li>For each story, come up with as many answers to that element's question as you can. Write the answers on sticky notes.</li>\n<li>The questions are:</li>\n<ul>\n<li>Characters: Who is doing things in this story?</li>\n<li>Situations: What is going on in this story?</li>\n<li>Values: What matters to the characters in this story?</li>\n<li>Themes: What is this story about?</li>\n<li>Relationships: How are the characters related in this story?</li>\n<li>Motivations: Why do the characters do what they do in this story?</li>\n<li>Beliefs: What do people believe in this story?</li>\n<li>Conflicts: Who or what stands in opposition in this story?</li>\n</ul>\n<li>Once you have answered the question(s) you chose for each story, cluster the sticky notes into groups. Place like with like.</li>\n<li>Give each group of sticky notes a name.</li>\n<li>Clear a \"halo\" of space around each group's name.</li>\n<li>In the halo, write 2-5 good and bad attributes (advantages and disadvantages, opportunities and dangers) of each group of sticky notes.</li>\n<li>Copy or move the new good/bad attributes to a new space. Mix them all together.</li>\n<li>Cluster the attributes into groups.</li>\n<li>Name the groups. These are your story elements.</li>\n</ol>",
                "type": "label"
            },
            {
                "id": "FIXME_134",
                "text": "Project story elements",
                "type": "grid",
                "options": "page_addStoryElement"
            }
        ]
    },
    {
        "id": "FIXME_136",
        "name": "Add story element",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "FIXME_138",
                "text": "What is the name of the story element?",
                "type": "text"
            },
            {
                "id": "FIXME_139",
                "text": "What type of story element is this?",
                "type": "select",
                "options": "character;situation;value;theme;relationship;motivation;belief;conflict"
            },
            {
                "id": "FIXME_140",
                "text": "You can describe it more fully here.",
                "type": "textarea"
            },
            {
                "id": "FIXME_141",
                "text": "You can enter a photograph of the element here.",
                "type": "imageUploader"
            }
        ]
    },
    {
        "id": "FIXME_143",
        "name": "Assess story sharing",
        "description": "// should have results overall and for each category of question\n\n",
        "isHeader": false,
        "type": "FIXME_143",
        "questions": [
            {
                "id": "FIXME_145",
                "text": "On this page you can answer questions about your community or organization to assess its story sharing culture.\nBefore you answer these questions, you should spend some time listening to people share stories together\nin the places where they normally gather.",
                "type": "label"
            },
            {
                "id": "FIXME_149",
                "text": "Narrative freedom",
                "type": "header"
            },
            {
                "id": "FIXME_150",
                "text": "As you listened to people talk, how often did you hear a person respond to a story with another story that countered it in some way?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "FIXME_151",
                "text": "When someone who was obviously in authority was telling stories, how much time and attention did they get?",
                "type": "select",
                "options": "unknown;enthrallment;strong listening;partial listening;nothing special"
            },
            {
                "id": "FIXME_152",
                "text": "How many times did you hear people tell stories about mistakes?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "FIXME_153",
                "text": "When somebody started telling a story and another person stopped them, how did they stop them?",
                "type": "select",
                "options": "unknown;warning;caution;request;joke"
            },
            {
                "id": "FIXME_154",
                "text": "When somebody was telling a story and another person disagreed with the storyteller, how did they disagree?",
                "type": "select",
                "options": "unknown;demand;criticism;comment;joke"
            },
            {
                "id": "FIXME_156",
                "text": "Narrative flow",
                "type": "header"
            },
            {
                "id": "FIXME_157",
                "text": "When you listened to people telling stories, did you ever hear people say �that reminds me of the time� and then tell a story in response?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "FIXME_158",
                "text": "How often did you hear people pass on stories they heard from other people?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "FIXME_159",
                "text": "How much evidence did you find for a narrative folklore in your community or organization?",
                "type": "select",
                "options": "unknown;none;little;some;strong"
            },
            {
                "id": "FIXME_160",
                "text": "Did you hear comic stories, tragic stories, epic stories, and funny stories?",
                "type": "select",
                "options": "unknown;no;maybe;I think so;definitely"
            },
            {
                "id": "FIXME_161",
                "text": "Did you ever see people share stories as they prepared to make decisions?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "FIXME_163",
                "text": "Narrative knowledge",
                "type": "header"
            },
            {
                "id": "FIXME_164",
                "text": "Did you see people tell stories that were recountings of events based on emotional experiences from particular perspectives?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "FIXME_165",
                "text": "How lively were the negotiations you heard going on between storytellers and audiences?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "FIXME_166",
                "text": "Did you ever see two or more people tell a story together?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "FIXME_167",
                "text": "How often did you see someone start telling the wrong story to the wrong people at the wrong time?",
                "type": "select",
                "options": "unknown;often;sometimes;seldom;never"
            },
            {
                "id": "FIXME_168",
                "text": "Did you see people account for their actions and choices by telling each other stories?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "FIXME_170",
                "text": "Narrative unity",
                "type": "header"
            },
            {
                "id": "FIXME_171",
                "text": "How easy would it be to create a list of stories any member of your community or organization could be expected to know?",
                "type": "select",
                "options": "unknown;impossible;difficult;doable;easy"
            },
            {
                "id": "FIXME_172",
                "text": "How easy would it be to create a list of sacred stories, those important to understanding the community or organization?",
                "type": "select",
                "options": "unknown;impossible;difficult;doable;easy"
            },
            {
                "id": "FIXME_173",
                "text": "How easy would it be to create a list of condensed stories, in the form of proverbs or references?",
                "type": "select",
                "options": "unknown;impossible;difficult;doable;easy"
            },
            {
                "id": "FIXME_174",
                "text": "How often were the stories you heard intermingled with each other?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "FIXME_175",
                "text": "How easy would it be to describe the unique storytelling culture of your community or organization?",
                "type": "select",
                "options": "unknown;impossible;difficult;doable;easy"
            },
            {
                "id": "FIXME_178",
                "text": "This is your combined test result.",
                "type": "quizScoreResult"
            },
            {
                "id": "FIXME_180",
                "text": "Here you can record some notes or comments about this assessment.",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "FIXME_182",
        "name": "Revise PNI Planning questions",
        "description": "",
        "isHeader": false,
        "type": "FIXME_182",
        "questions": [
            {
                "id": "FIXME_184",
                "text": "Please review and improve your draft answers based on your consideration of project aspects and your project stories.",
                "type": "label"
            },
            {
                "id": "FIXME_186",
                "text": "What is the goal of the project? Why are you doing it?",
                "type": "textarea",
                "options": "planning_goal"
            },
            {
                "id": "FIXME_187",
                "text": "What relationships are important to the project?",
                "type": "textarea",
                "options": "planning_relationships"
            },
            {
                "id": "FIXME_188",
                "text": "What is the focus of the project? What is it about?",
                "type": "textarea",
                "options": "planning_focus"
            },
            {
                "id": "FIXME_189",
                "text": "What range(s) of experience will the project cover?",
                "type": "textarea",
                "options": "planning_range"
            },
            {
                "id": "FIXME_190",
                "text": "What is the project's scope? (number of people, number of stories, number of questions about stories)",
                "type": "textarea",
                "options": "planning_draft_scope"
            },
            {
                "id": "FIXME_191",
                "text": "Which phases of PNI will be important to the project? (indicate most and least important phases)",
                "type": "textarea",
                "options": "planning_draft_emphasis"
            }
        ]
    },
    {
        "id": "FIXME_193",
        "name": "Write project synopsis",
        "description": "",
        "isHeader": false,
        "type": "FIXME_193",
        "questions": [
            {
                "id": "FIXME_195",
                "text": "Please summarize your project in one or two sentences.",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "FIXME_197",
        "name": "Read planning report - text with all stuff entered",
        "description": "",
        "isHeader": false,
        "type": "FIXME_197",
        "questions": []
    },
    {
        "id": "FIXME_199",
        "name": "Collection design",
        "description": "// Collection venues - X venues chosen\n// Story eliciting questions - x questions written\n// Questions about stories - x questions written\n// Questions about people - x stories written\n// Question form - [ ] designed [ ] committed\n",
        "isHeader": true,
        "type": "FIXME_199",
        "questions": []
    },
    {
        "id": "FIXME_206",
        "name": "Choose collection venues",
        "description": "",
        "isHeader": false,
        "type": "FIXME_206",
        "questions": [
            {
                "id": "FIXME_208",
                "text": "On this page you will choose story collection venues, or ways to collect stories.",
                "type": "label"
            },
            {
                "id": "FIXME_210",
                "text": "Venue recommendations",
                "type": "recommendationTable",
                "options": "venues"
            },
            {
                "id": "FIXME_212",
                "text": "Please answer these questions about your collection venues for each participant group.",
                "type": "page_venuesTable",
                "options": "participants_firstGroupName,participants_secondGroupName,participants_thirdGroupName"
            }
        ]
    },
    {
        "id": "FIXME_214",
        "name": "Aspects table",
        "description": "",
        "isHeader": false,
        "type": "questionsTable",
        "questions": [
            {
                "id": "FIXME_216",
                "text": "Choose a primary means of story collection for this group.",
                "type": "select",
                "options": "individual interviews;group interviews;peer interviews;group story sessions;surveys;journals;narrative incident reports;gleaned stories"
            },
            {
                "id": "FIXME_217",
                "text": "Describe your story collection plans for this group and venue.",
                "type": "textarea"
            },
            {
                "id": "FIXME_218",
                "text": "If you want to collect stories in a second way for this same group, choose one of these options.",
                "type": "select",
                "options": "individual interviews;group interviews;peer interviews;group story sessions;surveys;journals;narrative incident reports;gleaned stories"
            },
            {
                "id": "FIXME_219",
                "text": "Describe your secondary story collection for this group and venue.",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "FIXME_221",
        "name": "Write story eliciting questions - write questions (question list, recommendations, copy from templates, review project aspects and story elements, reorder questions in list)",
        "description": "// list of questions with \"add\" button, popup\n\n// need to help them choose which TYPE of eliciting questions\n// they want to use - asking for times, directed and undirected, etc\n// CFK write this list\n\n// note that the story eliciting questions don't need a lot of\n// extra info - they are just text strings, because all\n// story eliciting questions are of one type\n\n// template questions in separate file?\n",
        "isHeader": false,
        "type": "FIXME_221",
        "questions": []
    },
    {
        "id": "FIXME_235",
        "name": "Write questions about stories - write questions (question list, recommendations, copy from templates, review project aspects and story elements, reorder questions in list)",
        "description": "(already have prototype of this)\n// need templates file for this\n",
        "isHeader": false,
        "type": "FIXME_235",
        "questions": []
    },
    {
        "id": "FIXME_239",
        "name": "Write questions about people - write questions (question list, recommendations, copy from templates, review project aspects and story elements, reorder questions in list)",
        "description": "(same structure as previous page, just calling up different data)\n// need templates file for this\n",
        "isHeader": false,
        "type": "FIXME_239",
        "questions": []
    },
    {
        "id": "FIXME_243",
        "name": "Design question form - add more elements to form than questions (add intro, disclaimers, help info, etc)",
        "description": "",
        "isHeader": false,
        "type": "FIXME_243",
        "questions": [
            {
                "id": "text",
                "text": "Please enter a title for the form."
            },
            {
                "id": "FIXME_246",
                "text": "Please enter an introduction to be shown at the start of the form, after the title",
                "type": "textarea"
            },
            {
                "id": "FIXME_247",
                "text": "Please enter any text to be shown at the end of the form",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "FIXME_249",
        "name": "Commit question forms - review and print forms to hand out in story sessions or use in interviews, or give out URL",
        "description": "// buttons: [Finalize form] [Copy form URL] [Print forms]\n// buttons 2 and 3 are disabled until button 1 is clicked\n// and there should be a confirm dialog\n// once form is finalized quetsions cannot be changed - unless for typos - how to do that?\n// should they be able to fix typos? how to keep them from invalidating data?\n",
        "isHeader": false,
        "type": "FIXME_249",
        "questions": []
    },
    {
        "id": "FIXME_257",
        "name": "Design story collection sessions - same as for sensemaign sessions only different",
        "description": "// recommendations table based on descriptions of groups in planning\n\n// list of sessions with \"add\" button\n// for each session added:\n",
        "isHeader": false,
        "type": "FIXME_257",
        "questions": [
            {
                "id": "text",
                "text": "How long will this session be?"
            },
            {
                "id": "text",
                "text": "When will it take place?"
            },
            {
                "id": "text",
                "text": "Where will it take place?"
            },
            {
                "id": "text",
                "text": "How many people will be invited to this session?"
            },
            {
                "id": "FIXME_267",
                "text": "From which participant group(s) will people be invited? (one or more) (drop down)",
                "type": "FIXME_267"
            },
            {
                "id": "FIXME_268",
                "text": "What materials will need to be made available?",
                "type": "textarea"
            },
            {
                "id": "FIXME_269",
                "text": "Enter other details about this session.",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "FIXME_271",
        "name": "Write session agenda(s) - choose activities, rearrange (list of activities, copy from templates, rearrange, describe)",
        "description": "// for each session in list\n// list of activities with \"add\" button\n// for each activity added:\n\n// ability to move activities up and down in list\n// button to print session agenda (simply) for facilitators\n",
        "isHeader": false,
        "type": "FIXME_271",
        "questions": [
            {
                "id": "FIXME_276",
                "text": "Choose type of (drop down)\n- ice breaker\n- sharing stories (no exercise)\n- sharing stories with task\n- discussion of stories/patterns\n- exercise: twice-told stories\n- exercise: timelines\n- exercise: landscapes\n- other",
                "type": "FIXME_276"
            },
            {
                "id": "text",
                "text": "How long will this activity take?"
            },
            {
                "id": "FIXME_286",
                "text": "What materials will be provided for this activity?",
                "type": "textarea"
            },
            {
                "id": "FIXME_287",
                "text": "What spaces will be used for this activity?",
                "type": "textarea"
            },
            {
                "id": "FIXME_288",
                "text": "Describe activity plan",
                "type": "textarea"
            },
            {
                "id": "FIXME_289",
                "text": "Describe optional elaborations you might or might not use",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "FIXME_294",
        "name": "Read collection design report - text with summary of venues and questions",
        "description": "",
        "isHeader": false,
        "type": "FIXME_294",
        "questions": []
    },
    {
        "id": "FIXME_296",
        "name": "Collection process - checklist",
        "description": "Online story collection is [ ] enabled\nNumber of stories entered - x\nNumber of participants who told stories - x\n",
        "isHeader": true,
        "type": "FIXME_296",
        "questions": []
    },
    {
        "id": "FIXME_301",
        "name": "Start story collection - make URL live",
        "description": "(just a button)\n",
        "isHeader": false,
        "type": "FIXME_301",
        "questions": []
    },
    {
        "id": "FIXME_304",
        "name": "Enter stories - enter stories (show list of stories with add story button; if collecting stories over web participants will see only the \"add story\" window)",
        "description": "(already have this)\n// note: need way to show \"menu\" of eliciting questions, participants can choose which question to answer (this choice gets recorded and stored with data)\n",
        "isHeader": false,
        "type": "FIXME_304",
        "questions": []
    },
    {
        "id": "FIXME_308",
        "name": "Review incoming stories - general story browser without catalysis functions",
        "description": "// smalltalk like with answers to questions\n",
        "isHeader": false,
        "type": "FIXME_308",
        "questions": []
    },
    {
        "id": "FIXME_311",
        "name": "Stop story collection - stop URL working",
        "description": "// just a button\n",
        "isHeader": false,
        "type": "FIXME_311",
        "questions": []
    },
    {
        "id": "FIXME_314",
        "name": "Read collection process report - text with summary of how many stories collected etc",
        "description": "",
        "isHeader": false,
        "type": "FIXME_314",
        "questions": []
    },
    {
        "id": "FIXME_316",
        "name": "Catalysis - checklist",
        "description": "Observations - x\nInterpretations - x\nIdeas - x\nPerspectives - x\n",
        "isHeader": true,
        "type": "FIXME_316",
        "questions": []
    },
    {
        "id": "FIXME_322",
        "name": "Add observations about stories - story browser (smalltalk-like browser with question answers; \"add observation\" button)",
        "description": "",
        "isHeader": false,
        "type": "FIXME_322",
        "questions": []
    },
    {
        "id": "FIXME_323",
        "name": "Add observations about graphs - graph browser (pairwise comparison graph browser; \"add observation\" button)",
        "description": "",
        "isHeader": false,
        "type": "FIXME_323",
        "questions": []
    },
    {
        "id": "FIXME_324",
        "name": "Add observations about trends - top trends list (most significant statistical differences; \"add observation\" button creates observation with image/text)",
        "description": "// when click \"add observation\" get popup where they enter title and text to go with saved result\n// \"add excerpt\" button - add selected text to list of excerpts\n\n// maybe transition this to one tab with three sub-tabs (on top) later\n// no questions in this part\n\n// it should be possible to add more than one result to an observation,\n// so when they click \"add observation\" they should choose between an existing one (in a list) and a new one)\n",
        "isHeader": false,
        "type": "FIXME_324",
        "questions": []
    },
    {
        "id": "FIXME_335",
        "name": "Interpret observations - edit observations in list (\"edit\" each to open form with title, text, interpretations (2 or more), example stories or excerpts, graph result (from \"add obs\" button))",
        "description": "",
        "isHeader": false,
        "type": "FIXME_335",
        "questions": [
            {
                "id": "text",
                "text": "Observation name"
            },
            {
                "id": "FIXME_338",
                "text": "Observation",
                "type": "textarea"
            },
            {
                "id": "FIXME_339",
                "text": "Result(s) - saved info from thing they clicked on",
                "type": "FIXME_339"
            },
            {
                "id": "text",
                "text": "First interpretation name"
            },
            {
                "id": "FIXME_342",
                "text": "First interpretation text",
                "type": "textarea"
            },
            {
                "id": "FIXME_343",
                "text": "Stories or excerpts for first interpretation",
                "type": "textarea"
            },
            {
                "id": "FIXME_344",
                "text": "First idea",
                "type": "textarea"
            },
            {
                "id": "FIXME_346",
                "text": "Opposing interpretation name",
                "type": "FIXME_346"
            },
            {
                "id": "FIXME_347",
                "text": "Opposing interpretation",
                "type": "textarea"
            },
            {
                "id": "FIXME_348",
                "text": "Stories or excerpts for opposing interpretation",
                "type": "textarea"
            },
            {
                "id": "FIXME_349",
                "text": "Oppposing idea",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "FIXME_351",
        "name": "Cluster interpretations - list of interps, cluster (space or grid, drag interps together, name groups)",
        "description": "// some kind of \"are you really ready to cluster\" confirmation before they do this, because adding new interps afterward will mess up clustering\n// no questions here\n// (if this works well we could copy it for the story elements\n// exercise in the planning stage...)\n",
        "isHeader": false,
        "type": "FIXME_351",
        "questions": []
    },
    {
        "id": "FIXME_357",
        "name": "Read catalysis report - text with clustered interpretations and all info for them (including pictures)",
        "description": "",
        "isHeader": false,
        "type": "FIXME_357",
        "questions": []
    },
    {
        "id": "FIXME_359",
        "name": "Sensemaking - checklist",
        "description": "//Planning sessions - x of x questions answered\n//Write session agenda - x of x questions answered\n//Print story cards - x cards printed (or checkmark)\n//Post-session review - x of x questions answered\n",
        "isHeader": true,
        "type": "FIXME_359",
        "questions": []
    },
    {
        "id": "FIXME_365",
        "name": "Plan sensemaking sessions - answer questions about how many, when, etc (with recommendations)",
        "description": "// recommendations table based on descriptions of groups in planning\n\n// list of sessions with \"add\" button\n// for each session added:\n",
        "isHeader": false,
        "type": "FIXME_365",
        "questions": [
            {
                "id": "text",
                "text": "How long will this session be?"
            },
            {
                "id": "text",
                "text": "When will it take place?"
            },
            {
                "id": "text",
                "text": "Where will it take place?"
            },
            {
                "id": "text",
                "text": "How many people will be invited to this session?"
            },
            {
                "id": "FIXME_375",
                "text": "From which participant group(s) will people be invited? (one or more) (drop down)",
                "type": "FIXME_375"
            },
            {
                "id": "FIXME_376",
                "text": "What materials will need to be made available?",
                "type": "textarea"
            },
            {
                "id": "FIXME_377",
                "text": "Enter other details about this session.",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "FIXME_379",
        "name": "Write session agenda(s) - choose activities, rearrange (list of activities, copy from templates, rearrange, describe)",
        "description": "// for each session in list\n// list of activities with \"add\" button\n// for each activity added:\n\n// ability to move activities up and down in list\n// button to print session agenda (simply) for facilitators\n// button to print story cards - choose how many per page, etc\n\n// session 1 - friday 2 pm\n//      activity 1 - ice breaker\n//      activity 2 - encounter stories\n// session 2 - monday 2 pm\n//      activity 1 - encounter stories\n//      activity 2 - twice told stories\n",
        "isHeader": false,
        "type": "FIXME_379",
        "questions": [
            {
                "id": "FIXME_384",
                "text": "Choose type of (drop down)\n- ice breaker\n- encountering stories (no exercise)\n- encountering stories with task\n- exploring patterns in story cards\n- discussion of stories/patterns\n- exercise: twice-told stories\n- exercise: timelines\n- exercise: landscapes\n- exercise: story elements\n- exercise: composite stories\n- list making\n- wrap-up\n- other",
                "type": "FIXME_384"
            },
            {
                "id": "text",
                "text": "How long will this activity take?"
            },
            {
                "id": "FIXME_399",
                "text": "What materials will be provided for this activity?",
                "type": "textarea"
            },
            {
                "id": "FIXME_400",
                "text": "What spaces will be used for this activity?",
                "type": "textarea"
            },
            {
                "id": "FIXME_401",
                "text": "Describe activity plan",
                "type": "textarea"
            },
            {
                "id": "FIXME_402",
                "text": "Describe optional elaborations you might or might not use",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "FIXME_415",
        "name": "Enter session records - add pictures, audio, video, transcripts, lists of things people ended up with, pivot/voice/discovery stories",
        "description": "// this is per session\n\n// list with 'add\" button\n// pg 375 in book\n// for each outcome, title, type and text (not complicated)\n// types are:\n\n// text, audio, image, video\n// how to connect audio/video to content? link to it?\n// if we host it, how much can people upload? how long will we keep it around?\n// limits on number and size of images\n\n// text, audio, image, video\n\n// textarea but could be audio or video or image also\n\n// could be anything\n",
        "isHeader": false,
        "type": "FIXME_415",
        "questions": [
            {
                "id": "FIXME_419",
                "text": "Enter any lists of outcomes people arrived at during this session.\n- discovery\n- opportunity\n- issue\n- idea\n- recommendation\n- perspective\n- dilemma",
                "type": "FIXME_419"
            },
            {
                "id": "FIXME_432",
                "text": "Enter any summaries prepared by session participants",
                "type": "FIXME_432"
            },
            {
                "id": "FIXME_438",
                "text": "Describe any constructions created during the session.",
                "type": "FIXME_438"
            },
            {
                "id": "FIXME_441",
                "text": "Enter any notes you took during the session",
                "type": "FIXME_441"
            },
            {
                "id": "FIXME_444",
                "text": "Enter any additional info about the session",
                "type": "FIXME_444"
            }
        ]
    },
    {
        "id": "FIXME_447",
        "name": "Answer questions about sessions - bunch of questions about what happened (all textareas, can be multiple for multiple sessions)",
        "description": "// for each session in list, click \"review\" or something button\n\n@@Change\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
        "isHeader": false,
        "type": "FIXME_447",
        "questions": [
            {
                "id": "FIXME_453",
                "text": "How did the behavior of the participants change from the start to the end of the session?",
                "type": "textarea"
            },
            {
                "id": "FIXME_454",
                "text": "How did their emotions change?",
                "type": "textarea"
            },
            {
                "id": "FIXME_455",
                "text": "How did your emotions change?\n@@Interactions",
                "type": "textarea"
            },
            {
                "id": "FIXME_459",
                "text": "Describe the interactions between participants (including changes during the session).",
                "type": "textarea"
            },
            {
                "id": "FIXME_460",
                "text": "Describe interactions between participants and facilitators (including change).\n@@Stories",
                "type": "textarea"
            },
            {
                "id": "FIXME_464",
                "text": "What did you notice about the stories people told, retold, chose, worked with, and built during the session?\n@@Context",
                "type": "textarea"
            },
            {
                "id": "FIXME_468",
                "text": "What is the story of what happened during this session?",
                "type": "textarea"
            },
            {
                "id": "FIXME_469",
                "text": "What was special about these people in this place on this day?\n@@Methods",
                "type": "textarea"
            },
            {
                "id": "FIXME_473",
                "text": "What parts of your plans went as you expected? WHat parts didn't?",
                "type": "textarea"
            },
            {
                "id": "FIXME_474",
                "text": "What parts of your plans worked out well? WHat parts didn't work out well?",
                "type": "textarea"
            },
            {
                "id": "FIXME_475",
                "text": "What new ideas did you gain from the participants in this session?\n@@Project",
                "type": "textarea"
            },
            {
                "id": "FIXME_479",
                "text": "How has the project changed as a result of this session?\n@@Summary",
                "type": "textarea"
            },
            {
                "id": "FIXME_483",
                "text": "What do you want most to remember about this session?",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "FIXME_485",
        "name": "Read sensemaking report - text with all stuff entered",
        "description": "",
        "isHeader": false,
        "type": "FIXME_485",
        "questions": []
    },
    {
        "id": "FIXME_487",
        "name": "Intervention - checklist",
        "description": "Choose interventions - x planned\nAnswer questions about interventions - x questions answered\n",
        "isHeader": true,
        "type": "FIXME_487",
        "questions": []
    },
    {
        "id": "FIXME_491",
        "name": "Choose interventions - answer questions about which interventions to use",
        "description": "// recommendations based on groups in planning\n\n// questions help to choose interventions\n// cfk stopped here\n",
        "isHeader": false,
        "type": "FIXME_491",
        "questions": []
    },
    {
        "id": "FIXME_498",
        "name": "Answer questions about interventions - answer questions about interventions used",
        "description": "",
        "isHeader": false,
        "type": "FIXME_498",
        "questions": []
    },
    {
        "id": "FIXME_499",
        "name": "Read intervention report - text with all stuff entered",
        "description": "",
        "isHeader": false,
        "type": "FIXME_499",
        "questions": []
    },
    {
        "id": "FIXME_501",
        "name": "Return - checklist",
        "description": "",
        "isHeader": true,
        "type": "FIXME_501",
        "questions": []
    },
    {
        "id": "FIXME_503",
        "name": "Gather feedback - enter what people said (mostly textareas)",
        "description": "",
        "isHeader": false,
        "type": "FIXME_503",
        "questions": []
    },
    {
        "id": "FIXME_504",
        "name": "Answer questions about project - answer questions about project (mostly textareas)",
        "description": "",
        "isHeader": false,
        "type": "FIXME_504",
        "questions": []
    },
    {
        "id": "FIXME_505",
        "name": "Prepare project presentation - enter things you want to tell people about project (to be shown to steering committee)",
        "description": "",
        "isHeader": false,
        "type": "FIXME_505",
        "questions": []
    },
    {
        "id": "FIXME_506",
        "name": "Read return report - text with all stuff entered",
        "description": "",
        "isHeader": false,
        "type": "FIXME_506",
        "questions": []
    },
    {
        "id": "FIXME_508",
        "name": "Project report - text summary (everything in the six stage reports appended)",
        "description": "",
        "isHeader": true,
        "type": "FIXME_508",
        "questions": []
    }
]
);