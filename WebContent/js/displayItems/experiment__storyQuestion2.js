// Generated from design
"use strict";

define([], function() {
    
    var models = [
        {
            _class: "StoryQuestion",
            text: "",
            type: null,
            shortName: "",
            options: "",
            help: "",
            experiment_options1: []
        },
        {
            _class: "StoryQuestion",
            fields: {
                text: "text",
                type: "choice",
                shortName: "text",
                options: "text",
                help: "text",
                experiment_options1: "array",
                experiment_options2: {
                    type: "array",
                    make: "Option"
                }
            }
        }
    ];
    


    function StoryQuestion () {
        this._version = "0.0.0";
        this.id = "";
        this.text = "";
        this.type = null;
        this.shortName = "";
        this.options = "";
        this.help = "";
        this.experiment_options1 = [];
    }
     
    StoryQuestion.prototype.getName = function() {
        return this.shortName || this.id;
    };



    var questions = [
        {
            id: "storyQuestion_text",
            type: "textarea",
            modelClass: "StoryQuestion",
            modelPath: "text",
            shortName: "Question",
            prompt: "Enter a question to ask people about their stories."
        },
        {
            id: "storyQuestion_type",
            type: "select",
            options: ["boolean", "label", "header", "checkbox", "checkboxes", "text", "textarea", "select", "radiobuttons", "slider"],
            shortName: "Type",
            prompt: "What type of question is this?\nThe question types are:\n<ul>\n<li>boolean: yes and no choices</li>\n<li>label: not a question, just text</li>\n<li>header: same as a label, only in bold</li>\n<li>checkbox: one check box (enter label in options)</li>\n<li>checkboxes: a series of checkboxes (enter label in options)</li>\n<li>text: a one-line free text field</li>\n<li>textarea: a multi-line free text field</li>\n<li>select: a drop-down box (enter choices in options)</li>\n<li>radiobuttons: a set of mutually-exclusive radio buttons (enter choices in options)</li>\n<li>slider: a range from 0 to 100 (enter end labels in options)</li>\n</ul>",
            /*
            "storyQuestion_type::selection:boolean": "boolean",
            "storyQuestion_type::selection:checkbox": "checkbox",
            "storyQuestion_type::selection:checkboxes": "checkboxes",
            "storyQuestion_type::selection:header": "header",
            "storyQuestion_type::selection:label": "label",
            "storyQuestion_type::selection:radiobuttons": "radiobuttons",
            "storyQuestion_type::selection:select": "select",
            "storyQuestion_type::selection:slider": "slider",
            "storyQuestion_type::selection:text": "text",
            "storyQuestion_type::selection:textarea": "textarea"
            */
        },
        {
            id: "storyQuestion_shortName",
            type: "text",
            "isInReport":true,
            "isGridColumn":true
        },
        {
            id: "storyQuestion_options",
            type: "textarea",
            "isInReport":true,
            "isGridColumn":true
        },
        {
            id: "storyQuestion_help",
            type: "textarea",
            "isInReport":true,
            "isGridColumn":true
        },
        {
            id: "templates_storyQuestions", 
            type: "templateList",
            options: ["storyQuestions"],
            prompt: "Or choose a question from this list."
        },
        {
            id: "templates_storyQuestions_unfinished",
            type: "label",
            "isInReport":false,
            "isGridColumn":false
        }
    ];
    
    function setup(domain) {
        domain.addQuestions(questions);
        domain.addModel("StoryQuestion", StoryQuestion);
    }
    
    return {
        questions: questions,
        setup: setup
    };
});