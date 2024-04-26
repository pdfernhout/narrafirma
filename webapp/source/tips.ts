
import translate = require("./panelBuilder/translate");

"use strict";

export function getRandomTip() {
        // TODO: Translate
        const tips = [
            // Getting started
            "One way to get started with NarraFirma is to page through its help system, one page a time, just to see what you can do with it.",       
            "If you aren't sure whether you need or want to use any page, click the Help button to read about its purpose.",
            `If you aren't sure how any page in NarraFirma will affect what happens on other pages, click the Help button and look for the section called \"Connections to other pages.\"`,
            "Click the Help button on any NarraFirma page to find out how the page is connected to other NarraFirma pages.",
            "The FAQ page at narrafirma.com has more answers to frequently asked questions.",
            "To see more tips, go to another NarraFirma page. To read all of the tips, go to the Home page, click Help, and look for a link to \"NarraFirma Tips\".",
        
            // General
            "You can safely ignore all of the pages of the types \"plan\" and \"journal.\". (But don't discount them! They might be useful.)",
            "Use the reminder at the bottom of any page to leave yourself a note. Reminders appear on section pages.",
            "On section pages (Planning, etc), if you don't like the page descriptions and page-type icons, you can hide them in Home - Project administration - Project options.",
            "You can print a whole-project report in Project administration - Print.",
            "You can use simple HTML codes (b, i, ul/li, etc) on most NarraFirma fields that end up in exported or printed reports.",
            "We recommend <a href=\"https://pandoc.org\">pandoc</a> for converting all of NarraFirma's HTML reports to other formats.",
        
            // Technical
            "Everything you enter into NarraFirma is saved as soon as you leave each field.",
            "You can export your whole project to a file, then import it into another NarraFirma installation.",
            "You can export a project file from a WordPress NarraFirma installation and import it into a Node.js NarraFirma installation (and vice versa).",
            "It's useful to occasionally back up your NarraFirma project (Project administration - Import &amp; Export).",
            "If you load a new version of NarraFirma and your browser doesn't show any changes, try clearing your browser cache.",
            "If you hover your mouse over the word \"NarraFirma\" in the upper left corner of any NarraFirma page, you will see the version of NarraFirma you have installed.",
            "If you type something into NarraFirma, then delete it, you might be able to find it again. On Node.js, look in the most recent files under server-data. In WordPress, find a plugin that shows you your table data.",
            
            // Bugs
            "If you find a bug in NarraFirma, tell us about it on the <a href=\"https://github.com/pdfernhout/narrafirma/issues\">GitHub issues page</a>.",
            "If NarraFirma isn't working the way it should, look at your browser's development console to see if there is an error message there.",
            "To report a NarraFirma bug, tell us as much as you can remember about what you were doing and what happened. Screenshots (especially of your browser's development console) are extra helpful.",
        
            // Planning
            "The Planning pages of NarraFirma can help you think through your project as you are getting started.",
            "None of the Planning pages in NarraFirma limit what you can do on other pages. They are just there to help you think.",
            "When you are clustering items on the \"Create project story elements\" page, two people can move items at the same time.",
        
            // Collection - General
            "You can enter stories into NarraFirma in three ways: using a web survey, by entering each story yourself, and by importing a CSV spreadsheet file.",
            "You can create printable agendas for your in-person or online story-sharing sessions.",
            "If you are importing data from another surveying system, click Help, then Collection, then find the Guide to Importing Data.",
        
            // Collection - Building story forms
            "The order of questions on the \"Write questions about\" pages does not matter. Only the order on the story form matters.",
            "The short names you give to questions will appear on your graphs. Make them brief but clear.",
            "You can include a video introduction in a story form.",
            "Checkboxes questions can include images.",
            "Write-in answers are particularly useful in pilot projects.",
            "Keep your slider labels (left and right) short but meaningful.",
            "Multiple-answer questions (of the checkboxes type) are often useful, but they cannot be used in some statistical tests because they are not mutually exclusive.",
            "When you look at question recommendations, it doesn't change your questions. It's just to help you think.",
            "You can give your survey participants the option to copy their contribution. Look at \"Finishing the form.\"",
            "You can use custom CSS to change how your survey looks.",
            "If you want to, you can build your entire story form in a CSV spreadsheet, then import it.",
            "To use the same story form in multiple projects, export it to a CSV file from one project, then import it into the other.",
            "If you want to translate your story form into multiple languages, build and test the form in one language first, then translate it.",
            "It's a good idea to export your story collection to an external CSV file, just in case you want to see it outside of NarraFirma later.",
            
            // Collection - Managing story collections
            "If you make major changes to your story form (e.g., changing a question's type or short name) after you start collecting stories, it is best to create a new story collection so your data matches your form.",
            "If you make so many test story collections that they slow down project loading, you can remove them by resetting the project (carefully!) in Project administration - Import &amp; Export.",
            "After you update the story form in an active story collection, you must deactivate, then activate the collection before the change will take effect.",
            "You can change the story form you are using to gather data in a story collection. NarraFirma will warn you if by doing so you will invalidate any of your existing data.",
            "When you create a new story collection, NarraFirma makes a snapshot copy of the story form you choose for it as it stands at that moment and stores it in the collection.",
            "Question data in different story collections can be graphed together as long as the question short names, types, and lists of available answers are the same.",
            "If you collect some answers to a question, then decide to change the type of data it collects, click Help on the \"Start story collection\" page for some pointers.",

            "To prevent accidental data loss, you cannot delete stories. But you can mark them to be ignored on the  \"Review incoming stories\" page.",
            "You can edit story names, texts, and answers to questions on the \"Review incoming stories\" page. Just be careful!",
            "If your stories do not have names, you can give them names on the \"Review incoming stories\" page.",
            "On the \"Review incoming stories\" page, you can see (and change) subsets of your stories as well as all of them.",
            "Use the \"Review graphs\" page to check over incoming stories to look for gaps in your coverage.",
            "You can look at patterns across multiple story collections on the \"Review graphs\" page.",
            "Stories in an exported story collection are in the same order as they are shown in the \"Review incoming stories\" page.",
        
            // Catalysis - General
            "What's catalysis? It's the same thing as analysis, but it generates questions to ponder, not conclusions to accept or reject.",
            "Save time during catalysis by unchecking questions with too little variation, leaving them out of your consideration.",
            "As you explore patterns in your data, you can use display lumping to merge similar answers.",
            "A catalysis report can include multiple story collections and multiple story forms.",
            "When you are clustering items on the \"Cluster interpretations and/or observations\" page, two people can move items at the same time.",
            "If you turn off a type of graph on the \"Configure catalysis report\" page, any observations linked to graphs of that type will still exist. You just won't be able to see them.",
            "Clustered observations or interpretations become the headings of your catalysis report.",
            "You can export observations, interpretations, and ideas from one catalysis report and import them into another one.",
            "On the \"Print catalysis report\" page, you can export all of your graphs to PNG, SVG, or CSV.",
            "You can change every English-language element of your catalysis report to your own language.",
            "You can use custom CSS to change how your catalysis report looks.",
            "We recommend <a href=\"https://pandoc.org\">pandoc</a> for converting NarraFirma's HTML catalysis reports to other formats.",
        
            // Catalysis - Annotating stories
            "You can use an annotation question to convert a free-text question to a fixed-list question (by reading and clustering the things people wrote in).",
            "You can use an annotation question to mark and count your observations of storytelling patterns and styles.",
            "You can use an annotation question to mark and count themes you find in your stories.",
            "You can enter answers to annotation questions in NarraFirma or import them from a CSV spreadsheet file.",
            "When annotating stories, you can use the Random button to code a randomly chosen subset of a large story collection.",
            "Annotation questions are not connected to particular story forms. They are available to the whole project.",
            "You can change the order your annotation questions appear on the \"Annotate stories\" page.",
        
            // Catalysis - Exploring patterns
            "The \"Explore patterns\" page is the most complicated page in NarraFirma. Budget some time to take it in and read its Help page.",
            "On the \"Explore patterns\" page, you can copy and paste excerpts from any story into an observation, interpretation, or idea.",
            "On the \"Explore patterns\" page, you can sort your patterns by statistical significance.",
            "On the \"Explore patterns\" page, you can sort your patterns by observation strength.",
            "If few people picked one answer to a question, you might be able to lump it in with another answer using the \"display lumping\" feature.",
            "You can override your general setting for display lumping on particular graphs.",
            "You can hide or show how many people chose not to answer questions.",
            "You can override your general setting for showing \"No answer\" counts on particular graphs.",
            "When you are looking at a graph on the Explore Patterns page, you can save it as a CSV spreadsheet or an image.",
            "When you are looking at a graph on the \"Explore patterns\" page, you can generate random subsets of selected stories. These are useful for reports.",
            
            // Sensemaking, Intervention, and Return
            "You can use the filtering function to print only some story cards.",
            "You can use display lumping to merge similar answers in your story cards.",
            "When you print your story cards, you can truncate especially long stories.", 
            "In story cards, for choice questions, you can print all the answers (with the selected answers in bold) or only the selected answers.",
            "Story cards can include all or only some of the questions you asked about stories and participants.", 
            "You can use multiple columns to make your story cards easier to use in sensemaking.", 
            "You can copy your generated HTML story cards and paste them into most word processors.", 
            "You can create highly customized story cards.",
            "You can create printable agendas for your in-person or online sensemaking workshops.",
            "We recommend <a href=\"https://pandoc.org\">pandoc</a> for converting NarraFirma's HTML story cards to other formats.",
         
        ];
        const randomIndex = Math.max(0, Math.min(tips.length - 1, Math.round(Math.random() * tips.length) - 1));
        const tip = "Tip: " + tips[randomIndex] + " <a href=\"help/administration/help_page_tips.html\" target=\"blank\">(More tips)</a>";
        return tip
    }

