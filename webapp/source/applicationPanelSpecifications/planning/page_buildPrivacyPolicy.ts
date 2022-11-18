import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_buildPrivacyPolicy",
    pageExplanation: "Create a policy you can show to participants who have questions about privacy.",
    pageCategories: "plan",
    displayName: "Build privacy policy",
    panelFields: [
         {
            id: "project_topic_intro",
            valueType: "none",
            displayType: "label",
            displayPrompt: `Use this page to craft a <strong>privacy policy</strong> you can use to show to your participants.
                You can use simple HTML (b, i, ul/li, etc) to format your answers. For example, you might want to add a bold-faced heading to each section.` 
        },

        {
            id: "project_privacyPolicy_collect",
            valueType: "string",
            displayType: "textarea",
            displayName: "What will are collecting",
            displayPrompt: `Describe <strong>what you are collecting</strong> and why. 
                (For example: "We are gathering accounts of experiences of ___ from ___ so we can ___.")`
        },
        {
            id: "project_privacyPolicy_identification",
            valueType: "string",
            displayType: "textarea",
            displayName: "How people will be identified",
            displayPrompt: `Describe the <strong>identifying information</strong> you are asking people to provide. 
                Explain how you will ensure that no other information will be collected.
                (For example: "Your contribution is anonymous. Every question is optional.")`
        },
        {
            id: "project_privacyPolicy_nondisclosure",
            valueType: "string",
            displayType: "textarea",
            displayName: "What you do not want participants to disclose",
            displayPrompt: `Explain <strong>what you do not want participants to reveal</strong>.
               (For example: "Do not include any identifying information about yourself or anyone else, including ___.")`
        },
        {
            id: "project_privacyPolicy_distribution",
            valueType: "string",
            displayType: "textarea",
            displayName: "How information will be distributed",
            displayPrompt: `Explain how the collected information will be <strong>distributed</strong> and used in the project. 
                Explain who will get to see what, when, how, and why.
                (For example: "Your ___ will be read and discussed, along with other ___ gathered from other ___, in ___.")`
        },
        {
            id: "project_privacyPolicy_invitation",
            valueType: "string",
            displayType: "textarea",
            displayName: "How participants will be invited to make sense of stories",
            displayPrompt: `If you want to <strong>invite the people who tell stories
                to your sensemaking sessions</strong>, make your invitation explicit.
                (For example: "You are invited to join us as we discuss the stories we have gathered in this project. To learn more, ___.")`
        },
        {
            id: "project_privacyPolicy_permission",
            valueType: "string",
            displayType: "textarea",
            displayName: "Asking for permission",
            displayPrompt: `If you want to <strong>publish</strong> any of your collected stories, ask for explicit permission. 
                (For example: "If you do not want to give us permission to use your ___ in our ___, please contact ___.")`
        },
        {
            id: "project_privacyPolicy_review",
            valueType: "string",
            displayType: "textarea",
            displayName: "Methods of review or change",
            displayPrompt: `Explain how your participants can <strong>review or change</strong> any information
                they have provided to the project. When people know they can change their minds later,
                it helps them to open up.
                (For example: "To review, change, or remove your ___, please contact ___.)`
        },
        {
            id: "project_privacyPolicy_copy",
            valueType: "none",
            displayType: "button",
            displayPreventBreak: true,
            displayConfiguration: "copyPrivacyPolicy",
            displayIconClass: "copyButtonImage",
            displayPrompt: "Copy Privacy Policy",
        },
        {
            id: "project_privacyPolicy_print",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "printPrivacyPolicy",
            displayIconClass: "printButtonImage",
            displayPrompt: "Print Privacy Policy",
        }
        
    ]
};

export = panel;

