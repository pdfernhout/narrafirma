import kludgeForUseStrict = require("../../kludgeForUseStrict");
import Globals = require("../../Globals");
"use strict";

var panel: Panel = {
    id: "page_printStoryCards",
    displayName: "Print story cards",
    tooltipText: "Print out the stories you collected so people can use them during sensemaking sessions.",
    headerAbove: "Get Ready for Sensemaking",
    panelFields: [
        {
            id: "printStoryCards_introduction",
            valueType: "none",
            displayType: "label",
            displayPrompt: `On this page you can print or export <strong>story cards</strong>, printed versions 
                of stories that people can arrange and compare as they 
                encounter stories and work on sensemaking exercises.
                `
        },
        {
            id: "storyCollectionChoice_printing",
            valuePath: "/clientState/storyCollectionName",
            valueType: "string",
            valueOptions: "project_storyCollections",
            valueOptionsSubfield: "storyCollection_shortName",
            displayType: "select",
            displayName: "Story collection",
            displayPrompt: "Choose the <strong>story collection</strong> whose story cards you want to print."
        },
        {
            id: "printStoryCards_output",
            valueType: "none",
            displayType: "label",
            displayPrompt: ""
        },
        {
            id: "printStoryCards_questionsToInclude",
            valueType: "object",
            valuePath: "/clientState/storyCollectionName/printStoryCards_questionsToInclude",
            displayType: "printStoryCardsQuestionChooser",
            displayPrompt: "Which <strong>questions</strong> should be included in the story cards?",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().storyCollectionIdentifier();
            }
        },
        {
            id: "printStoryCards_order",
            valueType: "string",
            valuePath: "/clientState/storyCollectionName/printStoryCards_order",
            valueOptions: [
                "order on story form, scales separate",
                "order on story form, scales mixed in",
                "alphabetical order, scales separate",
                "alphabetical order, scales mixed in"
            ],
            displayType: "select",
            displayName: "Order",
            displayPrompt: "In what <strong>order</strong> would you like the answers to questions to appear?",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().storyCollectionIdentifier();
            }
        },

        {
            id: "printStoryCards_showOrHideAdvancedOptions",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "showOrHideAdvancedOptions",
            displayName: "Show/hide advanced options",
            displayPrompt: function(panelBuilder, model) {
                return Globals.clientState().showAdvancedOptions() ? "Hide advanced options" : "Show advanced options";
            },
            displayPreventBreak: false,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().storyCollectionIdentifier();
            }
        },

        {
            id: "printStoryCards_MoreThingsToShowAndHideHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Things you can show or hide",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveStoryCollectionAndShowingAdvancedOptions();
            }
        }, 
        {
            id: "printStoryCards_filter",
            valuePath: "/clientState/storyCollectionName/printStoryCards_filter",
            valueType: "string",
            displayType: "text",
            displayPrompt: `
            If you want to <strong>filter</strong> the stories printed, enter your filter here.
            (For details on how to use this function, click Help.)`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveStoryCollectionAndShowingAdvancedOptions();
            }
        },
        {
            id: "printStoryCards_storyTextCutoff",
            valueType: "string",
            valuePath: "/clientState/storyCollectionName/printStoryCards_storyTextCutoff",
            valueOptions: ["no limit", "100", "150", "200", "250", "300", "350", "400", "450", "500", "600", "700", "800", "900", "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700", "1800", "1900", "2000", "2200", "2400", "2600", "2800", "3000", "3500", "4000"],
            displayType: "select",
            displayName: "Story text length",
            displayPrompt: "At what <strong>length</strong> (number of characters) should stories be truncated?",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveStoryCollectionAndShowingAdvancedOptions();
            }
        },
        {
            id: "printStoryCards_storyTextCutoffMessage",
            valueType: "string",
            valuePath: "/clientState/storyCollectionName/printStoryCards_storyTextCutoffMessage",
            displayType: "text",
            displayName: "Story text cutoff message",
            displayPrompt: `What should the story card say <strong>after a story that has been truncated</strong>? (If this field is left blank, it will say "... (truncated)".)`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveStoryCollectionAndShowingAdvancedOptions();
            }
        },
        {
            id: "printStoryCards_includeIndexInStoryCollection",
            valueType: "boolean",
            valuePath: "/clientState/storyCollectionName/printStoryCards_includeIndexInStoryCollection",
            displayType: "checkbox",
            displayName: "Include index in story collection?",
            displayConfiguration: "Yes, include the story index",
            displayPrompt: "Do you want to <strong>print each story's index</strong> in the story collection before its title?",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveStoryCollectionAndShowingAdvancedOptions();
            }
        },

        {
            id: "printStoryCards_CustomTextsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Custom texts",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveStoryCollectionAndShowingAdvancedOptions();
            }
        },
        {
            id: "printStoryCards_beforeSliderCharacter",
            valueType: "string",
            valuePath: "/clientState/storyCollectionName/printStoryCards_beforeSliderCharacter",
            displayType: "text",
            displayName: "Character to print before slider button",
            displayPrompt: `
            Enter a character to print <strong>before</strong> (to the left of) the slider "button". If empty, the character "-" will be used.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveStoryCollectionAndShowingAdvancedOptions();}
        },
        {
            id: "printStoryCards_sliderButtonCharacter",
            valueType: "string",
            valuePath: "/clientState/storyCollectionName/printStoryCards_sliderButtonCharacter",
            displayType: "text",
            displayName: "Slider button character",
            displayPrompt: `
            Enter a character to print as the slider <strong>button</strong>. If empty, the character "|" will be used.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveStoryCollectionAndShowingAdvancedOptions();}
        },
        {
            id: "printStoryCards_afterSliderCharacter",
            valueType: "string",
            valuePath: "/clientState/storyCollectionName/printStoryCards_afterSliderCharacter",
            displayType: "text",
            displayName: "Character to print after slider button",
            displayPrompt: `
            Enter a character to print <strong>after</strong> (to the right of) the slider "button". If empty, the character "-" will be used.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveStoryCollectionAndShowingAdvancedOptions();}
        },
        {
            id: "printStoryCards_noAnswerSliderCharacter",
            valueType: "string",
            valuePath: "/clientState/storyCollectionName/printStoryCards_noAnswerSliderCharacter",
            displayType: "text",
            displayName: "Character to print on slider with no answer",
            displayPrompt: `
            Enter a character to print on the slider space if there was <strong>no answer</strong> to the question. If empty, the character "-" will be used.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveStoryCollectionAndShowingAdvancedOptions();}
        },
        {
            id: "printStoryCards_customCSS",
            valueType: "string",
            valuePath: "/clientState/storyCollectionName/printStoryCards_customCSS",
            displayType: "textarea",
            displayName: "Custom CSS",
            displayPrompt: "You can enter <strong>custom CSS</strong> that modifies elements of your story cards here. (For more information on how this works, see the help system.)",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveStoryCollectionAndShowingAdvancedOptions();}
        },
        {
            id: "printStoryCards_printFormButton",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "printStoryCards",
            displayPrompt: "Print Story Cards",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveStoryCollectionAndShowingAdvancedOptions();}
        }
    ]
};

export = panel;

