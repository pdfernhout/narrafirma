import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import sanitizeHTML = require("../sanitizeHTML");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import Globals = require("../Globals");
import questionnaireGeneration = require("../questionnaireGeneration");
import csvImportExport = require("../csvImportExport");
import dialogSupport = require("../panelBuilder/dialogSupport");
import standardWidgets = require("../panelBuilder/standardWidgets");

"use strict";

function add_translationDictionaryEditorPanel(panelBuilder: PanelBuilder, model, fieldSpecification) {
    const project = Globals.project();
    let translateableTexts = [];
    let keysOfTranslationDictionary = [];
    let orphanedTexts = [];
    let additionalLanguages = [];
    let dictionarySetID = undefined;
    let dictionaryIDs = [];

    // deal with cases where necessary things are not available or set
    const storyFormID = Globals.clientState().storyFormIdentifier();
    if (!storyFormID) return m("div.questionExternal", sanitizeHTML.generateSanitizedHTMLForMithril("Please choose a story form to translate."));
    let storyForm = questionnaireGeneration.buildStoryFormUsingTripleStoreID(storyFormID, "");
    if (!storyForm) return m("div.questionExternal", sanitizeHTML.generateSanitizedHTMLForMithril("ERROR: Could not find story form " + storyFormID));
    if (!storyForm.defaultLanguage) return m("div.questionExternal", sanitizeHTML.generateSanitizedHTMLForMithril("Please enter a default language."));
    if (!storyForm.languageChoiceQuestion_choices) return m("div.questionExternal", sanitizeHTML.generateSanitizedHTMLForMithril("Please enter at least one additional language."));

    // set up data to be used in display
    storyForm = questionnaireGeneration.buildStoryFormUsingTripleStoreID(storyFormID, "");
    translateableTexts = questionnaireGeneration.translateableTextsInStoryForm(storyForm);
    keysOfTranslationDictionary = Object.keys(storyForm.translationDictionary);
    additionalLanguages = storyForm.languageChoiceQuestion_choices.split("\n").map(function(item) { return item.trim(); } );
    dictionarySetID = project.tripleStore.queryLatestC(storyFormID, "questionForm_translationDictionary");
    if (!dictionarySetID) {
        dictionarySetID = project.tripleStore.newIdForSet("TranslationDictionarySet");
        project.tripleStore.addTriple(storyFormID, "questionForm_translationDictionary", dictionarySetID);
    }
    dictionaryIDs = project.tripleStore.getListForSetIdentifier(dictionarySetID);
    removeEmptyOrphans();
    const textBoxIDs = [];

    // tell user counts of things
    let totalNumEntries = 0;
    const numEntriesByLanguage = {};
    additionalLanguages.forEach((language) => { numEntriesByLanguage[language] = 0; });
    keysOfTranslationDictionary.forEach((key) => {
        additionalLanguages.forEach((language) => {
            if (storyForm.translationDictionary[key][language]) {
                numEntriesByLanguage[language]++;
                totalNumEntries++;
            }
        });
    });
    let questionPrompt = "Texts to translate: " + translateableTexts.length + "."
    questionPrompt += " Translated texts: " + totalNumEntries + ". ";
    additionalLanguages.forEach((language, index) => { questionPrompt += language + ": " + numEntriesByLanguage[language] + ". "; });
    if (orphanedTexts.length) questionPrompt += " Orphaned translations (not found in story form or questions): " + orphanedTexts.length + ".";

    // lookup functions

    function dictionaryForText(text, dictionaryIDs) {
        for (let i = 0; i < dictionaryIDs.length; i++) {
            const id = dictionaryIDs[i];
            const storedDictionary = project.tripleStore.makeObject(id, true);
            if (storedDictionary.defaultText === text) {
                storedDictionary.id = id;
                return storedDictionary;
            }
        }
        return null;
    }

    function dictionaryHasAtLeastOneTranslatedText(dict, additionalLanguages) {
        for (let i = 0; i < additionalLanguages.length; i++) {
            const language = additionalLanguages[i];
            if (dict.hasOwnProperty(language) && dict[language] !== "") {
                return true;
            }
        }
        return false;
    }

    function removeEmptyOrphans() {
        // remove newly orphaned translations that have no alternative-language texts
        // the user will not benefit from seeing them
        orphanedTexts = questionnaireGeneration.orphanedTranslationsForStoryForm(storyForm);
        const idsToRemove = [];
        const keysToRemove = [];
        orphanedTexts.forEach((text) => {
            const storedDictionary = dictionaryForText(text, dictionaryIDs);
            if (storedDictionary && !dictionaryHasAtLeastOneTranslatedText(storedDictionary, additionalLanguages)) {
                idsToRemove.push(storedDictionary.id);
                keysToRemove.push(storedDictionary.id);
            } 
        });
        if (idsToRemove.length > 0) {
            idsToRemove.forEach((id) => { project.tripleStore.deleteSetItem(dictionarySetID, id); });
            keysToRemove.forEach((key) => { delete storyForm.translationDictionary[key]; });
            dictionaryIDs = project.tripleStore.getListForSetIdentifier(dictionarySetID);
            keysOfTranslationDictionary = Object.keys(storyForm.translationDictionary);
            orphanedTexts = questionnaireGeneration.orphanedTranslationsForStoryForm(storyForm);
        }
    }

    // button functions
    
    const thingsYouCanDo = [
        "-- select -- ",
        "Create or update translation dictionary",
        "Delete translation dictionary",
        "Show orphaned translations",
        "Remove orphaned translations",
        "Import translations from CSV",
        "Export translations to CSV",
        "Show all translations",
        "Preview story form"];

    const thingsYouCanDoSelectOptions = [];
    thingsYouCanDo.forEach((thing, index) => {
        thingsYouCanDoSelectOptions.push(m("option", {value: thing, selected: undefined}, thing));
    });

    function doThings() {
        const thingsYouCanDoElement = <HTMLTextAreaElement>document.getElementById("thingsYouCanDo_actionRequested");
        const thing = thingsYouCanDoElement.value;
        switch (thing) {
            case "Create or update translation dictionary":
                createOrUpdateTranslationDictionary();
                break;
            case "Delete translation dictionary":
                resetTranslationDictionary();
                break;
            case "Show orphaned translations":
                showOrphanedTranslations();
                break;
            case "Remove orphaned translations":
                removeOrphanedTranslations();
                break;
            case "Import translations from CSV":
                importTranslationDictionary();
                break;
            case "Export translations to CSV":
                exportTranslationDictionary();
                break;
            case "Show all translations":
                showAllTranslations();
                break;
            case "Preview story form":
                previewStoryForm();
                break;
            default:
                alert("Please choose an action from the list before you click the button.");
                break;
        }
    }

    function createOrUpdateTranslationDictionary() { 
        let numNewDictionariesCreated = 0;
        translateableTexts.forEach((text) => {
            const storedDictionary = dictionaryForText(text, dictionaryIDs);
            if (!storedDictionary) {
                project.tripleStore.makeNewSetItem(dictionarySetID, "TranslationDictionary", {"defaultText": text});
                numNewDictionariesCreated++;
            }
        });
        if (numNewDictionariesCreated == 0) {
            alert("The translation dictionary matches the story form.");
        } else {
            alert("The translation dictionary was updated. New entries added: " + numNewDictionariesCreated + ".");
        }
    }  

    function exportTranslationDictionary() {
        csvImportExport.exportTranslationDictionary(storyForm);
    }
    
    function importTranslationDictionary() {
        csvImportExport.importTranslationDictionary(storyForm);
    }

    function showOrphanedTranslations() {
        if (!orphanedTexts.length) {
            alert("This story form has no orphaned translations.");
            return;
        }
        const showParts = [];
        showParts.push('These "orphaned" translations are in the translation dictionary, but not in the questions or story form.\n');
        orphanedTexts.forEach((key) => {
            if (storyForm.translationDictionary.hasOwnProperty(key)) {
                showParts.push(key);
                let languagesWritten = 0;
                Object.keys(storyForm.translationDictionary[key]).forEach((innerKey) => {
                    if (["defaultText", "id"].indexOf(innerKey) < 0) {
                        if (storyForm.translationDictionary[key][innerKey]) {
                            languagesWritten++;
                            showParts.push("    " + innerKey + ": " + storyForm.translationDictionary[key][innerKey]);
                        }
                    }
                });
                if (!languagesWritten) showParts.push("    (no translations)");
            }
        });
        dialogSupport.openTextEditorDialog(showParts.join("\n"), "Orphaned translations", "Close", "Copy to Clipboard", closeShowDialogClicked, false, true);
    }

    function showAllTranslations() {
        const showParts = [];
        keysOfTranslationDictionary.forEach((key) => {
            showParts.push(key);
            let languagesWritten = 0;
            Object.keys(storyForm.translationDictionary[key]).forEach((innerKey) => {
                if (["defaultText", "id"].indexOf(innerKey) < 0) {
                    if (storyForm.translationDictionary[key][innerKey]) {
                        languagesWritten++;
                        showParts.push("    " + innerKey + ": " + storyForm.translationDictionary[key][innerKey]);
                    }
                }
            });
            if (!languagesWritten) showParts.push("    (no translations)");
        });
        dialogSupport.openTextEditorDialog(showParts.join("\n"), "All translations", "Close", "Copy to Clipboard", closeShowDialogClicked, false, true);       
    }
    
    function closeShowDialogClicked(text, hideDialogMethod) {     
        hideDialogMethod();
    }

    function removeOrphanedTranslations() {
        if (!orphanedTexts.length) {
            alert("This story form has no orphaned translations.");
            return;
        }
        let atLeastOneSetItemHasBeenRemoved = false;
        orphanedTexts.forEach((text) => {
            dictionaryIDs.forEach((id) => {
                const storedDictionary = project.tripleStore.makeObject(id, true);
                if (storedDictionary.defaultText === text) {
                    atLeastOneSetItemHasBeenRemoved = true;
                    project.tripleStore.deleteSetItem(dictionarySetID, id);
                }
            });
        });
        if (atLeastOneSetItemHasBeenRemoved) {
            dictionaryIDs = project.tripleStore.getListForSetIdentifier(dictionarySetID);
        }
        alert(orphanedTexts.length + " orphaned translations have been removed from the story form.");
    }
    
    function resetTranslationDictionary() {
        if (confirm("Are you certain that you want to remove the entire translation dictionary for this story form?")) {
            project.tripleStore.addTriple(storyFormID, "questionForm_translationDictionary", null);
            m.redraw();
        }
    }

    function previewStoryForm() {
        window["narraFirma_previewQuestionnaire"] = storyForm;
        const w = window.open("survey.html#preview=" + (new Date().toISOString()), "_blank");
    }

    function getOrSetDictValue(id, dict, language, value) {
        if (value === undefined) {
            return dict[language] || "";
        } else {
            changeTranslationForID(id, value);
        }
    }

    function htmlPartsForDictionary(text, dict) {
        if (!dict) return [];

        const partsForThisText = [];
        
        let explanationHTML = undefined;
        const explanation = questionnaireGeneration.explanationForFormFieldOrQuestion(storyForm, text);
        if (explanation) {
            explanationHTML = m("span.narrafirma-translation-explanation", explanation);
        }
        partsForThisText.push(m("div.narrafirma-text-to-be-translated", [text, explanationHTML || ""])); 

        const dictionaryTable = [];
        additionalLanguages.forEach((language) => {
            const partsForThisLanguage = [];
            partsForThisLanguage.push(m("td.narrafirma-translation-language", language));
            const inputID = text + "::" + language;
            let inputClass = "input[type=text].narrafirma-translation-textbox";
            if (text.length >= 200) {
                inputClass = "textarea.narrafirma-translation-textbox";
            }
            partsForThisLanguage.push(m("td.narrafirma-translation-textbox", m(inputClass, {
                id: inputID, 
                // switched from value to config to avoid clearing field when other user enters different data
                // value: dict[language] || "",
                config: standardWidgets.standardConfigMethod.bind(null, (value) => getOrSetDictValue(inputID, dict, language, value)),
                onchange: changeTranslationForEvent
            })));
            textBoxIDs.push(inputID);
            dictionaryTable.push(m("tr"), partsForThisLanguage);
        });
        partsForThisText.push(m("table.narrafirma-translation-dictionary", dictionaryTable));

        return m("div.questionExternal", partsForThisText);
    }

    function changeTranslationForEvent(event) {
        changeTranslationForID(event.target.id, event.target.value);
        if (event) event.target.nf_lastRetrievedValue = event.target.value;
    }

    function changeTranslationForID(id, value) {
        if (!id) return;
        const textAndLanguage = id.split("::");
        if (textAndLanguage.length < 2) return;

        const text = textAndLanguage[0];
        const language = textAndLanguage[1];
        let foundMatchingDictionary = undefined;

        dictionaryIDs.forEach((id) => {
            const storedDictionary = project.tripleStore.makeObject(id, true);
            if (storedDictionary.defaultText === text) {
                if (!storedDictionary.hasOwnProperty(language) || storedDictionary[language] !== value) {
                    project.tripleStore.addTriple(id, language, value); 
                }
                return;
            }
        });
    }

    const parts = [];
    parts.push(m("select", {id: "thingsYouCanDo_actionRequested", style: "margin-left: 0.5em;"}, thingsYouCanDoSelectOptions));
    parts.push(m("button", {id: "thingsYouCanDo_button", onclick: doThings}, m("span", {class: "buttonWithTextImage doItButtonImage"}), "Do it"));

    if (keysOfTranslationDictionary.length > 0) {
        const instructionsPrompt = `Enter translations for each text in the story form, as shown below. (Don't translate the explanations in italics.) 
            If you have made changes to your questions or story form, choose "Create or update translation dictionary," then click "Do it."`;
        parts.push(m("div.narrafirma-translation-prompt", instructionsPrompt));

        const sections = [
            "Starting out", 
            "Choosing a story-eliciting question", 
            "Eliciting questions",
            "Writing and naming a story", 
            "Answering questions about the story", 
            "Story questions",
            "Telling another story", 
            "Answering questions about the participant", 
            "Participant questions",
            "Finishing the form"];

        sections.forEach((section) => {
            const textsForThisSection = questionnaireGeneration.translateableTextsInStoryForm(storyForm, section);
            if (textsForThisSection.length) {
                if (["Eliciting questions", "Story questions", "Participant questions"].indexOf(section) < 0) {
                    parts.push(m("div", {class: "questionExternal narrafirma-question-type-header", style: "padding: 0.5em 0 0.5em 0.5em"}, section));
                }
                textsForThisSection.forEach((text) => {
                    if (keysOfTranslationDictionary.indexOf(text) >= 0) {
                        parts.push(htmlPartsForDictionary(text, storyForm.translationDictionary[text]));
                    }
                });
            }
        });
    }
    return [m("div.narrafirma-translation-prompt", sanitizeHTML.generateSanitizedHTMLForMithril(questionPrompt)), parts];
}

export = add_translationDictionaryEditorPanel;
