import surveyCollection = require("./surveyCollection");
import storyCardDisplay = require("./storyCardDisplay");
import Globals = require("./Globals");
import m = require("mithril");
import sanitizeHTML = require("./sanitizeHTML");
import PatternExplorer = require("./applicationWidgets/PatternExplorer");
import ClusteringDiagram = require("./applicationWidgets/ClusteringDiagram");
import Project = require("./Project");
import charting = require("./applicationWidgets/charting");
import dialogSupport = require("./panelBuilder/dialogSupport");
import canvg = require("canvgModule");
import versions = require("./versions");
import translate = require("./panelBuilder/translate");

"use strict";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// General string functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function replaceSpacesWithDashes(text) {
    if (text) {
        return replaceAll(text.trim(), " ", "-");
    } else {
        return "";
    }
}

// ***************************************************************************************** General 

var referenceMarker = "@";

function printHTML(htmlToPrint: string) {
    // Display HTML in a new window
    var w = window.open();
    if (w) {
        w.document.write(htmlToPrint);
        w.document.close();
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// General HTML printing functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateHTMLForPage(title: string, stylesheetReference: string, customCSS: string, vdom, message:string) {
    var output = "";
    output += "<!DOCTYPE html>\n";
    output += "<head>\n";
    output += "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n";
    output += '<meta charset="utf-8">';
    output += "<title>" + escapeHtml(title) + "</title>\n";
    if (stylesheetReference) {
        output += "<link rel=\"stylesheet\" href=\"" + stylesheetReference + "\">\n";
    }
    if (customCSS) {
        output += "<style>" + customCSS + "</style>";
    }
    output += "</head>\n\n";
    output += "<body>\n";
    if (vdom) {
        output += htmlForMithril(vdom);
    } else if (message) {
        output += message;
    }
    output += "\n</body>\n</html>";
    
    return output;
}

function htmlForMithril(vdom) {
    // Convert Mithril vdom objects to HTML
    var temporaryDiv = document.createElement('div');
    m.render(temporaryDiv, vdom);
    
    return temporaryDiv.innerHTML;
}

// escapeHtml from: http://shebang.brandonmintern.com/foolproof-html-escaping-in-javascript/
function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};

function repeatTags(count, tags) {
    var result = [];
    for (var i = 0; i < count; i++) {
        result.push(tags);
    }
    return result;
}

function printText(text) {
    try {
        if (text) {
            var textWithCarriageReturns = replaceAll(text, "\n", "\n<br>"); 
            var result = sanitizeHTML.generateSanitizedHTMLForMithril(textWithCarriageReturns);
        } else {
            result = "";
        }
        return result;
    } catch (error) {
        alert(error);
        return text;
    }
}

function printReturn() {
    return [
        m("br"),
        "\n"
    ];
}

function printReturnAndBlankLine() {
    return [
        printReturn(),
        printReturn()
    ];
}

function printCheckbox(text) {
    return m("div.narrafirma-survey-print-checkbox", [
        "[ ] ",
        printText(text),
        "\n"
    ]);
}

function printOption(text) {
    return m("div.narrafirma-survey-print-radiobutton", 
        [
        "( ) ",
        printText(text),
        "\n"
        ]);
}

function printQuestionText(question, instructions = "") {
    var questionTextForPrinting = printText(question.displayPrompt);
    if (question.displayType === "header") {
       questionTextForPrinting = m("b", questionTextForPrinting); 
    }
    if (instructions) instructions = " (" + instructions + ")";
    return m("div.narrafirma-survey-print-question-text", [
        questionTextForPrinting,
        m("span.narrafirma-survey-print-instruction", instructions)
    ]);    
}

// TODO: Translate
function printQuestion(question) {
    var result;
    switch (question.displayType) {
        case "boolean":
            result = [
                printQuestionText(question, "Choose only one"),
                printOption("yes"),
                printOption("no")
            ];
            break;
            
        case "label":
            result = [
                printQuestionText(question),
            ];
            break;
            
        case "header":
            result = [
                printQuestionText(question),
            ];
            break;
            
        case "checkbox":
            result = [
                printQuestionText(question),
                printCheckbox("yes")
            ];
            break;
            
        case "checkboxes":
             result = [
                printQuestionText(question, "Choose any combination"),
                question.valueOptions.map(function (option, index) {
                    return printCheckbox(option);
                })
            ];
            break;
            
        case "text":
            result = [
                printQuestionText(question),
                m("div.narrafirma-survey-print-blank-text-line", "_________________________________________________________________________")
            ];
            break;
            
        case "textarea":
            result = [
                printQuestionText(question),
                m("div.narrafirma-survey-print-textarea", printReturnAndBlankLine())
            ];
            break;
            
        case "select":
            result = [
                printQuestionText(question, "Choose only one"),
                question.valueOptions.map(function (option, index) {
                    return printOption(option);
                })
            ];
            break;
            
        case "radiobuttons":
            result = [
                printQuestionText(question, "Choose only one"),
                question.valueOptions.map(function (option, index) {
                    return printOption(option);
                })
            ];
            break;
            
        case "slider":
            result = [
                printQuestionText(question, "Mark on the line"),
                m("div.narrafirma-survey-print-slider", [
                question.displayConfiguration[0],
                " -------------------------------------------------- ",
                question.displayConfiguration[1]])
            ];
            break;
    }
    
    return result;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Catalysis report - printing main report elements
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function printCatalysisReport() {

    var project = Globals.project();
    var catalysisReportName = Globals.clientState().catalysisReportName();
    if (!catalysisReportName) {
        alert("Please choose a catalysis report to print.");
        return;
    }

    var catalysisReportIdentifier = project.findCatalysisReport(catalysisReportName);
    var printWhat = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReportPrint_reportType");
    if (!printWhat) {
        alert("Please choose what kind of report you want to print.")
        return;
    }

    var printStrengthsChoice = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReportPrint_observationStrengths");
    if (!printStrengthsChoice) {
        alert("Please choose which observation strengths you want to print.")
        return;
    }

    var catalysisReportObservationSetIdentifier = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_observations");
    if (!catalysisReportObservationSetIdentifier) {
        console.log("catalysisReportObservationSetIdentifier not defined");
        return;
    }
    var observationIDs = project.tripleStore.getListForSetIdentifier(catalysisReportObservationSetIdentifier);
    var allStories = project.storiesForCatalysisReport(catalysisReportIdentifier);

    var options = {};
    options["reportNotes"] = getAndCleanUserText(project, catalysisReportIdentifier, "catalysisReport_notes", "introduction", false);
    options["aboutReport"] = getAndCleanUserText(project, catalysisReportIdentifier, "catalysisReport_about", "about text", false);
    options["conclusion"] = getAndCleanUserText(project, catalysisReportIdentifier, "catalysisReport_conclusion", "conclusion", false);
    options["perspectiveLabel"] = getAndCleanUserText(project, catalysisReportIdentifier, "catalysisReport_perspectiveLabel", "perspective label", false);
    options["themeLabel"] = getAndCleanUserText(project, catalysisReportIdentifier, "catalysisReport_themeLabel", "theme label", false);
    options["interpretationLabel"] = getAndCleanUserText(project, catalysisReportIdentifier, "catalysisReport_interpretationLabel", "interpretation label", false);
    options["observationLabel"] = getAndCleanUserText(project, catalysisReportIdentifier, "catalysisReport_observationLabel", "observation label", false);
    options["minimumStoryCountRequiredForTest"] = project.minimumStoryCountRequiredForTest(catalysisReportIdentifier);
    options["minimumStoryCountRequiredForGraph"] = project.minimumStoryCountRequiredForGraph(catalysisReportIdentifier);
    options["numHistogramBins"] = project.numberOfHistogramBins(catalysisReportIdentifier);
    options["numScatterDotOpacityLevels"] = project.numScatterDotOpacityLevels(catalysisReportIdentifier);
    options["scatterDotSize"] = project.scatterDotSize(catalysisReportIdentifier);
    options["correlationLineChoice"] = project.correlationLineChoice(catalysisReportIdentifier);
    options["outputGraphFormat"] = project.outputGraphFormat(catalysisReportIdentifier);
    options["showStatsPanelsInReport"] = project.showStatsPanelsInReport(catalysisReportIdentifier);
    
    let printStrengthsToInclude = [];
    if (printStrengthsChoice["strong"] != undefined && printStrengthsChoice["strong"] === true) printStrengthsToInclude.push("3 (strong)");
    if (printStrengthsChoice["medium"] != undefined && printStrengthsChoice["medium"] === true) printStrengthsToInclude.push("2 (medium)");
    if (printStrengthsChoice["weak"] != undefined && printStrengthsChoice["weak"] === true) printStrengthsToInclude.push("1 (weak)");
    const includeObservationsWithoutStrengths = printStrengthsChoice["no strength value set"] != undefined && printStrengthsChoice["no strength value set"] == true;
    const includeObservationsWithNoInterpretations = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReportPrint_includeObservationsWithNoInterpretations") || false;

    var observationIDsToInclude = [];
    observationIDs.forEach((id) => {
        var observation = project.tripleStore.makeObject(id, true);
        if (!observation.observationTitle || !observation.observationTitle.trim()) return;
        if (observation.observationStrength) {
            if (printStrengthsToInclude.indexOf(observation.observationStrength) < 0) return;
        } else {
            if (!includeObservationsWithoutStrengths) return;
        }
        if (!includeObservationsWithNoInterpretations) {
            const interpretationsListIdentifier = project.tripleStore.queryLatestC(id, "observationInterpretations");
            const interpretationIDsForThisObservation = project.tripleStore.getListForSetIdentifier(interpretationsListIdentifier);
            if (!interpretationIDsForThisObservation || interpretationIDsForThisObservation.length == 0) return;
        }
        observationIDsToInclude.push(id);
    });

    if (observationIDsToInclude.length === 0) {
        alert("No observations in this report match your choice of observation strengths to include.")
        return;
    }

    if (printWhat === "observations (disregarding any clustering)") {
        printCatalysisReportWithUnclusteredObservations(project, catalysisReportIdentifier, catalysisReportName, allStories, observationIDsToInclude, options);
    } else if (printWhat === "themes (clustered observations)") {
        printCatalysisReportWithClusteredObservations(project, catalysisReportIdentifier, catalysisReportName, allStories, observationIDsToInclude, options);
    } else if (printWhat === "perspectives (clustered interpretations)") {
        printCatalysisReportWithClusteredInterpretations(project, catalysisReportIdentifier, catalysisReportName, allStories, observationIDsToInclude, options);
    } else {
        alert("The catalysis report type " + printWhat + " was not recognized.");
    }
}

function printCatalysisReportWithUnclusteredObservations(project, catalysisReportIdentifier, catalysisReportName, allStories, observationIDs, options) {

    var progressModel = dialogSupport.openProgressDialog("Starting up...", "Generating unclustered-observations catalysis report", "Cancel", dialogCancelled);

    function progressText(observationIndex: number) {
        return "Observation " + (observationIndex + 1) + " of " + observationIDs.length;
    }
    
    function dialogCancelled(dialogConfiguration, hideDialogMethod) {
        progressModel.cancelled = true;
        hideDialogMethod();
    }
    
    let printItems = [];
    addPrintItemsForReportStart(printItems, project, catalysisReportName, catalysisReportIdentifier, allStories, options);
    
    var observationIndex = 0;

    function printNextObservation() {

        if (progressModel.cancelled) {
            alert("Cancelled after working on " + (observationIndex + 1) + " observation(s)");
        } else if (observationIndex >= observationIDs.length) {
            finishCatalysisReport(project, catalysisReportName, catalysisReportIdentifier, printItems, progressModel, options);
        } else {
            printItems.push(<any>printListOfObservations([observationIDs[observationIndex]], options["observationLabel"], "", "", allStories, options));
            printItems.push(m(".narrafirma-catalysis-report-observations-only-page-break", ""));
            progressModel.progressText = progressText(observationIndex);
            progressModel.redraw();
            observationIndex++;
            setTimeout(function() { printNextObservation(); }, 0);
        }
    }
    setTimeout(function() { printNextObservation(); }, 0);
}

function printCatalysisReportWithClusteredObservations(project, catalysisReportIdentifier, catalysisReportName, allStories, observationIDs, options) {

        var clusteringDiagram = project.tripleStore.queryLatestC(catalysisReportIdentifier, "observationsClusteringDiagram");
        if (!clusteringDiagram) {
            alert("Please cluster observations before printing.");
            return;
        }
    
        var progressModel = dialogSupport.openProgressDialog("Starting up...", "Generating clustered-observations catalysis report", "Cancel", dialogCancelled);
    
        function progressText(clusterIndex: number, observationIndex: number) {
            return "Theme " + (clusterIndex + 1) + " of " + clustersToPrint.length + ", observation " + (observationIndex + 1) + " of " + clustersToPrint[clusterIndex].items.length;
        }
        
        function dialogCancelled(dialogConfiguration, hideDialogMethod) {
            progressModel.cancelled = true;
            hideDialogMethod();
        }
    
        let printItems = [];
        addPrintItemsForReportStart(printItems, project, catalysisReportName, catalysisReportIdentifier, allStories, options);
        
        let clustersToPrint = clustersThatMatchObservationIDList(project, clusteringDiagram, "themes", observationIDs);
        clustersToPrint.sort(function(a,b) {
            if (a.y < b.y) return -1;
            if (a.y > b.y) return 1;
            return 0;
        });

        var tocHeaderRaw = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_tocHeaderFirstLevel_observations");
        addPrintItemsForTOCLevelOne(printItems, tocHeaderRaw, clustersToPrint, "Themes");
        
        var clusterIndex = 0;
        let itemIndex = 0;
    
        function printNextObservation() {
    
            if (progressModel.cancelled) {
                alert("Cancelled after working on " + (clusterIndex + 1) + " theme(s)");
            } else if (clusterIndex >= clustersToPrint.length) {
                finishCatalysisReport(project, catalysisReportName, catalysisReportIdentifier, printItems, progressModel, options);
            } else {
                var cluster = clustersToPrint[clusterIndex];
                if (itemIndex === 0) { // first item in cluster

                    let numItemsToPrintInThisCluster = numItemsOutOfListToPrint(cluster.items);

                    var clusterNameToPrintWithoutSpaces = replaceSpacesWithDashes(cluster.name);
                    printItems.push(m("h2.narrafirma-catalysis-report-theme", 
                        [m("span", {"class": "narrafirma-catalysis-report-theme-label " + clusterNameToPrintWithoutSpaces, "id": "c_" + clusterIndex}, options["themeLabel"]),
                        cluster.name]));
                    if (cluster.notes) printItems.push(m("div.narrafirma-catalysis-report-theme-notes", printText(cluster.notes)));
    
                    // table of contents level two - observations in this theme
                    var tocHeaderLevelTwoRaw = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_tocHeaderSecondLevel_observations");
                    if (!tocHeaderLevelTwoRaw) tocHeaderLevelTwoRaw = "Observations in this theme (#):";
                    var numberSignIndex = tocHeaderLevelTwoRaw.indexOf("#");
                    if (numberSignIndex >= 0) {
                        tocHeaderLevelTwoRaw = tocHeaderLevelTwoRaw.replace("#", numItemsToPrintInThisCluster);
                    }
                    try {
                        var tocHeaderLevelTwo = sanitizeHTML.generateSmallerSetOfSanitizedHTMLForMithril(tocHeaderLevelTwoRaw);
                    } catch (error) {
                        alert("Problem in catalysis report contents header (second level): " + error);
                    }
                    printItems.push(m("br"));
                    printItems.push(m("div.narrafirma-catalysis-report-observation-link-header", tocHeaderLevelTwo));
                
                    var printItemsForThisCluster = [];
                    for (var i = 0; i < cluster.items.length ; i++) {
                        if (cluster.items[i].print) {
                            const idTag = "#c_" + clusterIndex + "_o_" + i;
                            const clusteredItem = cluster.items[i];
                            var observation = project.tripleStore.makeObject(clusteredItem.referenceUUID, true);
                            printItemsForThisCluster.push(m("div", {"class": "narrafirma-catalysis-report-observation-link"}, 
                                [m("span", {"class": "narrafirma-catalysis-report-observation-name"}, m("a", {"href": idTag}, clusteredItem.name || clusteredItem.notes)),
                                m("span", {"class": "narrafirma-catalysis-report-observation-strength"}, observation.observationStrength || "")]));
                        }
                    }
                    printItems.push(m("div", {"class": "narrafirma-catalysis-report-observation-links"}, printItemsForThisCluster));
                    printItems.push(m("br"));
                }
    
                if (itemIndex >= cluster.items.length) {
                    clusterIndex++;
                    itemIndex = 0;
                } else {
                    const item = cluster.items[itemIndex];
                    if (item.print) {

                        const idTag = "c_" + clusterIndex + "_o_" + itemIndex;
                        printItems.push(<any>printListOfObservations([item.referenceUUID], options["observationLabel"], idTag, "", allStories, options));
                        
                        const interpretationsListIdentifier = project.tripleStore.queryLatestC(item.referenceUUID, "observationInterpretations");
                        const interpretationIDsForThisObservation = project.tripleStore.getListForSetIdentifier(interpretationsListIdentifier);
                        printItems.push(<any>printListOfInterpretations(interpretationIDsForThisObservation, options["interpretationLabel"], idTag, item.notes, allStories, options));
                        
                        progressModel.progressText = progressText(clusterIndex, itemIndex);
                        progressModel.redraw();
                    }
                    itemIndex++;
                }
                setTimeout(function() { printNextObservation(); }, 0);
            }
        }
        setTimeout(function() { printNextObservation(); }, 0);
    }

function printCatalysisReportWithClusteredInterpretations(project, catalysisReportIdentifier, catalysisReportName, allStories, observationIDs, options) {

    // H1 - Report title
    // H2 - Perspective title
    // H3 - Observation title
    // H4 - Interpretation title
    // H5 - Graph title
    // H6 - Statistics

    var clusteringDiagram = project.tripleStore.queryLatestC(catalysisReportIdentifier, "interpretationsClusteringDiagram");
    if (!clusteringDiagram) {
        alert("Please cluster interpretations before printing.");
        return;
    }

    // set up progress bar
    var progressModel = dialogSupport.openProgressDialog("Starting up...", "Generating clustered-interpretations catalysis report", "Cancel", dialogCancelled);

    function progressText(clusterIndex: number, itemIndex: number) {
        return "Perspective " + (clusterIndex + 1) + " of " + clustersToPrint.length + ", interpretation " + (itemIndex + 1) + " of " + clustersToPrint[clusterIndex].items.length;
    }
    
    function dialogCancelled(dialogConfiguration, hideDialogMethod) {
        progressModel.cancelled = true;
        hideDialogMethod();
    }

    let printItems = [];
    addPrintItemsForReportStart(printItems, project, catalysisReportName, catalysisReportIdentifier, allStories, options);
    
    let clustersToPrint = clustersThatMatchObservationIDList(project, clusteringDiagram, "perspectives", observationIDs);
    clustersToPrint.sort(function(a,b) {
        if (a.y < b.y) return -1;
        if (a.y > b.y) return 1;
        return 0;
    });

    var tocHeaderRaw = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_tocHeaderFirstLevel");
    addPrintItemsForTOCLevelOne(printItems, tocHeaderRaw, clustersToPrint, "Perspectives");

    var clusterIndex = 0;
    let itemIndex = 0;
    var observationsIDsForInterpretation = {};

    function printNextInterpretation() {

        if (progressModel.cancelled) {

            alert("Cancelled after working on " + (clusterIndex + 1) + " perspective(s)");

        } else if (clusterIndex >= clustersToPrint.length) {

            finishCatalysisReport(project, catalysisReportName, catalysisReportIdentifier, printItems, progressModel, options);

        } else {

            var cluster = clustersToPrint[clusterIndex];

            if (itemIndex === 0) {

                let numItemsToPrintInThisCluster = numItemsOutOfListToPrint(cluster.items);

                // name and description of perspective
                var perspectiveNameToPrintWithoutSpaces = replaceSpacesWithDashes(cluster.name);
                printItems.push(m("h2.narrafirma-catalysis-report-perspective", 
                    [m("span", {"class": "narrafirma-catalysis-report-perspective-label " + perspectiveNameToPrintWithoutSpaces, "id": "c_" + clusterIndex}, options["perspectiveLabel"]),
                    cluster.name]));
                if (cluster.notes) printItems.push(m("div.narrafirma-catalysis-report-perspective-notes", printText(cluster.notes)));

                // table of contents level two - list of interpretations / observations / strengths in this perspective
                var tocHeaderLevelTwoRaw = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_tocHeaderSecondLevel");
                if (!tocHeaderLevelTwoRaw) tocHeaderLevelTwoRaw = "Interpretations and observations in this perspective (#):";
                var numberSignIndex = tocHeaderLevelTwoRaw.indexOf("#");
                if (numberSignIndex >= 0) {
                    tocHeaderLevelTwoRaw = tocHeaderLevelTwoRaw.replace("#", numItemsToPrintInThisCluster);
                }
                try {
                    var tocHeaderLevelTwo = sanitizeHTML.generateSmallerSetOfSanitizedHTMLForMithril(tocHeaderLevelTwoRaw);
                } catch (error) {
                    alert("Problem in catalysis report contents header (second level): " + error);
                }
                printItems.push(m("br"));
                printItems.push(m("div.narrafirma-catalysis-report-interp-link-header", tocHeaderLevelTwo));
            
                var printItemsForThisPerspective = [];
                for (var i = 0; i < cluster.items.length ; i++) {
                    const item = cluster.items[i];
                    if (item.print) {
                        var observationIDsForThisInterpretation = makeObservationIDsListForInterpretation(project, observationIDs, item);
                        observationsIDsForInterpretation[item.uuid] = observationIDsForThisInterpretation; // save to use later

                        for (var observationIndex = 0; observationIndex < observationIDsForThisInterpretation.length; observationIndex++) {
                            var observation = project.tripleStore.makeObject(observationIDsForThisInterpretation[observationIndex], true);
                            if (observation) {
                                var printItemsForThisOIPair = [];
                                printItemsForThisOIPair.push(m("td", {"class": "narrafirma-catalysis-report-interpretation-links-table-td"}, 
                                    m("a", {href: "#c_" + clusterIndex + "_i_" + i}, item.name || item.notes)));
                                var observationTitleToPrint = portionOfTextMatchingReference(observation.observationTitle || observation.observationDescription, item.notes);
                                printItemsForThisOIPair.push(m("td", {"class": "narrafirma-catalysis-report-interpretation-links-table-td"}, 
                                    m("a", {href: "#c_" + clusterIndex + "_i_" + i + "_o_" + observationIndex}, observationTitleToPrint)));
                                    printItemsForThisOIPair.push(m("td", {"class": "narrafirma-catalysis-report-interpretation-links-table-td"}, observation.observationStrength || ""));
                                printItemsForThisPerspective.push(m("tr", {"class": "narrafirma-catalysis-report-interpretation-links-table-tr"}, printItemsForThisOIPair)); 
                            }
                        }
                    }
                }
                printItemsForThisPerspective.sort(compareRowsInPerspectiveLinksTable);
                printItems.push(m("table", {"class": "narrafirma-catalysis-report-interpretation-links-table"}, printItemsForThisPerspective));
                printItems.push(m("br"));
            }
            if (itemIndex >= cluster.items.length) {
                clusterIndex++;
                itemIndex = 0;
            } else {
                const item = cluster.items[itemIndex];
                if (item.print) {
                    // if interpretation has no name OR notes, don't print anything at all
                    if (item.name || item.notes) {

                        // interpretation name and description
                        const interpretationNameWithoutSpaces = replaceSpacesWithDashes(item.name || item.notes);
                        const idTag = "c_" + clusterIndex + "_i_" + itemIndex;

                        const printItemsForHeader = [];
                        if (options["interpretationLabel"]) {
                            printItemsForHeader.push(m("span", {"class": "narrafirma-catalysis-report-interpretation-label " + interpretationNameWithoutSpaces}, options["interpretationLabel"]));
                        }
                        printItemsForHeader.push(item.name || item.notes);
                        printItems.push(m("h4.narrafirma-catalysis-report-interpretation", {"id": idTag}, printItemsForHeader));
                        
                        if (item.notes) {
                            var notesToPrint = item.notes;
                            // if interpretation has tag to mark part of observation to print, don't print tag
                            var reference = findMarkedReferenceInText(item.notes);
                            if (reference) {
                                var referenceTag = referenceMarker + reference + referenceMarker;
                                var refIndexInNotes = item.notes.indexOf(referenceTag);
                                if (refIndexInNotes >= 0) 
                                    notesToPrint = item.notes.substring(refIndexInNotes + referenceTag.length + 1);
                            }
                            printItems.push(m("div.narrafirma-catalysis-report-interpretation-notes", printText(notesToPrint)));
                        }

                        // interpretation idea
                        if (item.idea) {
                            printItems.push(m("div.narrafirma-catalysis-report-interpretation-idea", printText(item.idea)));
                        }

                        printItems.push(<any>printListOfObservations(observationsIDsForInterpretation[item.uuid], 
                            options["observationLabel"], idTag, item.notes, allStories, options));
                        
                        progressModel.progressText = progressText(clusterIndex, itemIndex);
                        progressModel.redraw();
                    }
                }
                itemIndex++;
            }
   
            setTimeout(function() { printNextInterpretation(); }, 0);
        }
    }
    setTimeout(function() { printNextInterpretation(); }, 0);
}

function printListOfObservations(observationList, observationLabel, idTag, interpretationNotes, allStories, options) {

    return printList(observationList, {}, function (item, index) {
        var project = Globals.project();
        var pattern = item.pattern;
        var selectionCallback = function() { return this; };
        var graphHolder: GraphHolder = {
            graphResultsPane: charting.createGraphResultsPane("narrafirma-graph-results-pane chartEnclosure"),
            chartPanes: [],
            allStories: allStories,
            currentGraph: null,
            currentSelectionExtentPercentages: null,
            excludeStoryTooltips: true,
            minimumStoryCountRequiredForTest: options.minimumStoryCountRequiredForTest,
            minimumStoryCountRequiredForGraph: options.minimumStoryCountRequiredForGraph,
            numHistogramBins: options.numHistogramBins,
            numScatterDotOpacityLevels: options.numScatterDotOpacityLevels,
            scatterDotSize: options.scatterDotSize,
            correlationLineChoice: options.correlationLineChoice,
            outputGraphFormat: options.outputGraphFormat,
            showStatsPanelsInReport: options.showStatsPanelsInReport,
            graphTypesToCreate: {}
        };

        var observationTitleToPrint = portionOfTextMatchingReference(item.observationTitle, interpretationNotes);
        var strengthStringToPrint = item.observationStrength ? " Strength: " + item.observationStrength : ""; 
        var observationDescriptionToPrint = portionOfTextMatchingReference(item.observationDescription, interpretationNotes);

        const headerItems = [];
        headerItems.push(m("span", {"class": "narrafirma-catalysis-report-observation-label"}, observationLabel));
        headerItems.push(m("span", {"class": "narrafirma-catalysis-report-observation-title"}, observationTitleToPrint));
        headerItems.push(m("span", {"class": "narrafirma-catalysis-report-observation-strength"}, strengthStringToPrint));

        const resultItems = [];
        resultItems.push(m("h3.narrafirma-catalysis-report-observation", {"id": idTag}, headerItems));
        resultItems.push(m("div.narrafirma-catalysis-report-observation-description", printText(observationDescriptionToPrint)));

        if (item.pattern.graphType === "texts") {
            resultItems.push(printReturnAndBlankLine());
        } else {
            var graph = PatternExplorer.makeGraph(pattern, graphHolder, selectionCallback, !options.showStatsPanelsInReport);
            if (graph) { 
                resultItems.push(printGraphWithGraphHolder(graphHolder));
            }
        }
        return resultItems;
    });
}

function printListOfInterpretations(interpretationList, interpretationLabel, idTagStart, observationDescription, allStories, options) {

    return printList(interpretationList, {}, function (item, index) {
        var project = Globals.project();
        var pattern = item.pattern;
        var selectionCallback = function() { return this; };
        var graphHolder: GraphHolder = {
            graphResultsPane: charting.createGraphResultsPane("narrafirma-graph-results-pane chartEnclosure"),
            chartPanes: [],
            allStories: allStories,
            currentGraph: null,
            currentSelectionExtentPercentages: null,
            excludeStoryTooltips: true,
            minimumStoryCountRequiredForTest: options.minimumStoryCountRequiredForTest,
            minimumStoryCountRequiredForGraph: options.minimumStoryCountRequiredForGraph,
            numHistogramBins: options.numHistogramBins,
            numScatterDotOpacityLevels: options.numScatterDotOpacityLevels,
            scatterDotSize: options.scatterDotSize,
            correlationLineChoice: options.correlationLineChoice,
            outputGraphFormat: options.outputGraphFormat,
            showStatsPanelsInReport: options.showStatsPanelsInReport,
            graphTypesToCreate: {}
        };

        const headerItems = [];
        headerItems.push(m("span", {"class": "narrafirma-catalysis-report-interpretation-label"}, interpretationLabel));
        headerItems.push(m("span", {"class": "narrafirma-catalysis-report-observation-title"}, item.interpretation_name));

        const resultItems = [];
        resultItems.push(m("h3.narrafirma-catalysis-report-interpretation", {"id": idTagStart + "_i_" + index}, headerItems));
        resultItems.push(m("div.narrafirma-catalysis-report-interpretation-notes", printText(item.interpretation_text)));

        return resultItems;
    });
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Catalysis report - printing graphs
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function printGraphWithGraphHolder(graphHolder: GraphHolder) {
    // TODO: why are bar graphs and histograms drawn with a left axis color of #C26E00 when this never appears in the code? canvg thing?
    if (graphHolder.chartPanes.length > 1) {
        // multiple histograms
        var result = [];
        
        // Add the title
        result.push(m.trust(graphHolder.chartPanes[0].outerHTML));
        
        // Add the charts, in rows of three across
        // chartPanes starts at 1 because 0 is the title
        var numRowsToCreate = Math.floor((graphHolder.chartPanes.length - 1) / 3) + 1;
        var rows = [];
        for (var rowIndex = 0; rowIndex < numRowsToCreate; rowIndex++) {
            var columnsForThisRow = [];
            for (var colIndex = 0; colIndex < 3; colIndex++) {
                var graphIndex = rowIndex * 3 + colIndex + 1;
                if (graphIndex >= graphHolder.chartPanes.length) break;
                var graphPane = graphHolder.chartPanes[graphIndex];
                columnsForThisRow.push(m("td", printGraphWithGraphNode(graphPane, graphHolder)));
            }
            rows.push(m("tr", columnsForThisRow));
        } 
        result.push(m("table", {"class": "narrafirma-print-multiple-histograms"}, rows));
        
        // Add the overall statistics (for all panes)
        if (graphHolder.showStatsPanelsInReport) {
            var statisticsPanel = <HTMLElement>graphHolder.graphResultsPane.lastChild;
            result.push(m.trust(statisticsPanel.outerHTML));
        }
        
        return result;
    } else {
        var result = [];
        var graph = printGraphWithGraphNode(<HTMLElement>graphHolder.graphResultsPane.firstChild, graphHolder);
        result.push(graph);
        return result;
    }
}
    
function printGraphWithGraphNode(graphNode: HTMLElement, graphHolder: GraphHolder) {

    const svgNode = graphNode.querySelector("svg");
    const titleNode = graphNode.querySelector(".narrafirma-graph-title");
    const statisticsNode = graphNode.querySelector(".narrafirma-statistics-panel");

    const styleNode = document.createElement("style");
    styleNode.type = 'text/css';
    styleNode.innerHTML = "<![CDATA[" + graphResultsPaneCSS + "]]>";
    svgNode.insertBefore(styleNode, svgNode.firstChild);
    
    const svgOuterHTML = svgNode.outerHTML;

    const result = [];
    if (titleNode) result.push(m.trust(titleNode.outerHTML));
    
    if (graphHolder.outputGraphFormat === "PNG") {

        const canvas = document.createElement("canvas");
        canvg(canvas, svgOuterHTML);
        const imgData = canvas.toDataURL("image/png");
        const imageForGraph = m("img", {
            class: "narrafirma-catalysis-report-graph",
            alt: "observation graph",
            src: imgData
        });
        result.push(m("div.narrafirma-graph-image", imageForGraph || []));

    } else if (graphHolder.outputGraphFormat === "SVG") {
        result.push(m("div.narrafirma-graph-image", m.trust(svgOuterHTML)));
    } else {
        throw Error("Unsupported graph type: " + graphHolder.outputGraphFormat);
    }

    if (graphHolder.showStatsPanelsInReport && statisticsNode) {
        result.push(m.trust(statisticsNode.outerHTML));
    }
    return result;
   
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Catalysis report - support functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function numItemsOutOfListToPrint(items) {
    let result = 0;
    items.forEach( function(item) {
        if (item.print) result++;
    });
    return result;
}

function finishCatalysisReport(project, catalysisReportName, catalysisReportIdentifier, printItems, progressModel, options) {
    printItems.push(m("div.narrafirma-catalysis-report-conclusion", options["conclusion"]));
    progressModel.hideDialogMethod();
    // Trying to avoid popup warning if open window from timeout by using finish dialog button press to display results
    var finishModel = dialogSupport.openFinishedDialog("Done creating report; display it?", "Finished generating catalysis report", "Display", "Cancel", function(dialogConfiguration, hideDialogMethod) {
        var customCSS = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_customCSS");
        var htmlForPage = generateHTMLForPage(catalysisReportName, "css/standard.css", customCSS, printItems, null);
        printHTML(htmlForPage);
        hideDialogMethod();
        progressModel.redraw();
    });
    finishModel.redraw();
}

function clustersThatMatchObservationIDList(project, clusteringDiagram, perspectivesOrThemes, observationIDs) {
    let [clusters, items] = ClusteringDiagram.calculateClusteringForDiagram(clusteringDiagram);
    let clustersToPrint = [];
    clusters.forEach( function(cluster) {
        if (cluster.hidden) return;
        cluster.items.forEach( function(item) {
            if (perspectivesOrThemes === "perspectives") {
                if (item.hidden) {
                    item.print = false;
                } else {
                    // the item is an interpretation; find out if any of these observations are connected to it
                    const includedObservationIDsLinkedToThisInterpretation = makeObservationIDsListForInterpretation(project, observationIDs, item);
                    if (includedObservationIDsLinkedToThisInterpretation.length > 0) {
                        if (clustersToPrint.indexOf(cluster) < 0) clustersToPrint.push(cluster);
                        item.print = true;
                    } else {
                        item.print = false;
                    }
                }
            } else if (perspectivesOrThemes === "themes") {
                if (item.hidden) {
                    item.print = false;
                } else {
                    // the item is an observation; just check the id 
                    if (observationIDs.indexOf(item.referenceUUID) >= 0) {
                        if (clustersToPrint.indexOf(cluster) < 0) clustersToPrint.push(cluster);
                        item.print = true;
                    } else {
                        item.print = false;
                    }
                }
            }
        });
    });
    return clustersToPrint;
}

function addPrintItemsForTOCLevelOne(printItems, tocHeaderRaw, clusters, clusterName) {
    if (!tocHeaderRaw) tocHeaderRaw = clusterName + " in this report (#):";
    var numberSignIndex = tocHeaderRaw.indexOf("#");
    if (numberSignIndex >= 0) {
        tocHeaderRaw = tocHeaderRaw.replace("#", clusters.length);
    }
    try {
        var tocHeader = sanitizeHTML.generateSmallerSetOfSanitizedHTMLForMithril(tocHeaderRaw);
    } catch (error) {
        alert("Problem in catalysis report contents header (first level): " + error);
    }
    printItems.push(m("br"));
    printItems.push(m("div.narrafirma-catalysis-report-toc-link-header", tocHeader));
    for (var i = 0; i < clusters.length ; i++) {
        var cluster = clusters[i];
        printItems.push(m("div.narrafirma-catalysis-report-toc-link", m("a", {href: "#c_" + i}, cluster.name)));
    }
    printItems.push(m("br"));
}

function addPrintItemsForReportStart(printItems, project, catalysisReportName, catalysisReportIdentifier, allStories, options) {
    // title and report creation info
    printItems.push(m("h1.narrafirma-catalysis-report-title", catalysisReportName));
    printItems.push(m("div.narrafirma-catalysis-report-project-name-and-date", 
        "This report for project " + project.projectIdentifier + " was generated by NarraFirma " + versions.narrafirmaApplication + " on "  + new Date().toString()));

    // filter (if applicable)
    var filter = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_filter");  
    if (filter) printItems.push(filterWarningForCatalysisReport(filter, allStories));

    // introduction and "about this report" section
    printItems.push(m("div.narrafirma-catalysis-report-intro-note", options["reportNotes"]));
    printItems.push(m("div.narrafirma-catalysis-report-about", options["aboutReport"]));
}

function getAndCleanUserText(project, catalysisReportIdentifier, id, errorMsg, smallerSet: boolean) {
    var textRaw = project.tripleStore.queryLatestC(catalysisReportIdentifier, id);
    try {
        if (smallerSet) {
            var text = sanitizeHTML.generateSmallerSetOfSanitizedHTMLForMithril(textRaw);
        } else {
            var text = sanitizeHTML.generateSanitizedHTMLForMithril(textRaw);
        }
    } catch (error) {
        alert("Problem in catalysis report " + errorMsg + ": " + error);
    }
    return text;
}
     
function filterWarningForCatalysisReport(filter, allStories) {
    var storyOrStoriesText = " stories";
    if (allStories.length == 1) storyOrStoriesText = " story";
    // todo: translation
    var labelText = 'This report only pertains to stories that match the filter "' +  filter + '" (' + allStories.length + storyOrStoriesText + ")";
    return m("div", {"class": "narrafirma-catalysis-report-filter-warning"}, sanitizeHTML.generateSanitizedHTMLForMithril(labelText));
}

function compareRowsInPerspectiveLinksTable (a, b) {
    var strengthStrings = ["1 (weak)", "2 (medium)", "3 (strong)"];
    var strengthInA = "";
    var strengthInB = "";

    // this will not work if strength is not in the third column of the table; need to change if change format of table
    if (a.children.length > 2 && a.children[2].children.length > 0) {
        strengthInA = a.children[2].children[0];
    }
    if (b.children.length > 2 && b.children[2].children.length > 0) {
        strengthInB = b.children[2].children[0];
    }
    
    if (strengthInA && strengthInB) {
        const indexOfA = strengthStrings.indexOf(strengthInA);
        const indexOfB = strengthStrings.indexOf(strengthInB);
        if (indexOfA > indexOfB) {
            return -1;
        } else if (indexOfB > indexOfA) {
            return 1;
        } else {
            return 0;
        }
    } else if (strengthInA) {
        return -1;
    } else if (strengthInB) {
        return 1;
    } else {
        return 0;
    }
}

function portionOfTextMatchingReference(textToDrawPortionFrom, textWithReferenceInit) {
    if (!textToDrawPortionFrom) return textToDrawPortionFrom;
    var textPortion = textToDrawPortionFrom;
    var reference = findMarkedReferenceInText(textWithReferenceInit);
    if (reference) {
        var referenceTag = referenceMarker + reference + referenceMarker;
        var refIndexInTextToDrawPortionFrom = textToDrawPortionFrom.indexOf(referenceTag);
        if (refIndexInTextToDrawPortionFrom >= 0) {
            textPortion = "";
            var charIndex = refIndexInTextToDrawPortionFrom + referenceTag.length + 1;
            while (charIndex < textToDrawPortionFrom.length) {
                if (textToDrawPortionFrom[charIndex] === referenceMarker) {
                    break;
                } else {
                    textPortion += textToDrawPortionFrom[charIndex];
                }
                charIndex++;
            }
        }
    } else {
        textPortion = replaceAll(textPortion, referenceMarker, ""); // if no reference, is being printed alone; remove tags so they don't look ugly
    }
    return textPortion;
}

function findMarkedReferenceInText(text) {
    var startIndex = text.indexOf(referenceMarker);
    if (startIndex >= 0) { 
        var stopIndex = text.indexOf(referenceMarker, startIndex+1);
        if (stopIndex >= 0 && stopIndex < text.length) 
            return text.substring(startIndex+1, stopIndex);
    } else return null;
}

export function makeObservationIDsListForInterpretation(project: Project, observationIDs, item) {
    var result = [];
    observationIDs.forEach((observationID) => {
        var interpretationsListIdentifier = project.tripleStore.queryLatestC(observationID, "observationInterpretations");
        var interpretationsList = project.tripleStore.getListForSetIdentifier(interpretationsListIdentifier);
        interpretationsList.forEach((interpretationIdentifier) => {
            var interpretation = project.tripleStore.makeObject(interpretationIdentifier, true);
            if (item.referenceUUID !== undefined) {
                if (interpretation.id === item.referenceUUID) {
                    result.push(observationID);
                }
            } else { // this is to deal with legacy (pre version 1.0) data that has no referenceUUID field
                if (interpretation.interpretation_name === item.name || interpretation.interpretation_text === item.text) {
                    item.referenceUUID = interpretation.id;
                    result.push(observationID);
                }
            }
        });
    });
    return result;
}

// TODO: Rules should be read from loaded stylesheet
export var graphResultsPaneCSS = `
    .narrafirma-graph-results-pane {
        width: 850px;
        margin: 5px auto 0px auto;
    }
    
    .chartBackground {
        width: 700px;
        fill: none;
    }
    
    .chartBodyBackground {
        fill: none;
    }
    
    .chart {
        background-color: white;
        fill: none;
    }
    
    .bar {
      fill: none;
    }
    
    .x-axis {
        fill: none;
        stroke: #231f20;
        stroke-width: 1px;
        shape-rendering: crispEdges;    
    }
    
    .y-axis {
        fill: none;
        stroke: #231f20;
        stroke-width: 1px;
        shape-rendering: crispEdges;    
    }
    
    .x-axis text {
        fill: #231f20;
        stroke-width: 0.5px;
        font-family: sans-serif;
        font-size: 1em;
    }
    
    .y-axis text {
        fill: #231f20;
        stroke-width: 0.5px;
        font-family: sans-serif;
        font-size: 1em;
    }
    
    .x-axis-label {
        fill: #231f20;
        stroke-width: 0.5px;
        font-family: sans-serif;
        font-size: 1em;
    }
    
    .y-axis-label {
        fill: #231f20;
        stroke-width: 0.5px;
        font-family: sans-serif;
        font-size: 1em;
    }

    .barChart.x-axis-label {
        font-size: 1.2em;
    }
    
    .barChart.y-axis-label {
        font-size: 1em;
    }
    
    .histogram.x-axis-label.middle, .histogram.y-axis-label.middle {
        font-size: 1.1em;
    }
    
    .histogram.x-axis-label.small.middle {
        font-size: 0.9em;
    }
    
    .histogram.x-axis-label.start, .histogram.x-axis-label.end {
        font-size: 0.9em;
    }
    
    .table.x-axis-label.middle, .table.y-axis-label.middle {
        font-size: 1.1em;
    }
    
    .scatterplot.x-axis-label.middle, .scatterplot.y-axis-label.middle {
        font-size: 1.1em;
    }
    
    .scatterplot.x-axis-label.small.middle, .scatterplot.y-axis-label.small.middle {
        font-size: 0.9em;
    }
    
    .scatterplot.x-axis-label.start, .scatterplot.y-axis-label.start, .scatterplot.x-axis-label.end, .scatterplot.y-axis-label.end {
        font-size: 0.9em;
    }
    
    .story.even {
      fill: #2e4a85;
    }
    
    .story.odd {
      fill: #7b8cb2;
    }
    
    .brush .extent {
      fill-opacity: 0.3;
      fill: #ff7d00;
      stroke: #cc6400;
      stroke-width: 1px;
      shape-rendering: auto; /* was crispEdges; auto turns on anti-aliasing */
    }
    
    .histogram-mean {
        stroke: red;
        stroke-width: 2px;
    }
    
    .histogram-standard-deviation-low {
        stroke: #8db500;
        stroke-width: 1.5px;
    }
    
    .histogram-standard-deviation-high {
        stroke: #8db500;    
        stroke-width: 1.5px;
    }
    
    .scatterPlot .story {
      stroke: #2e4a85;
      stroke-width: 0.2px;
      fill: #2e4a85;
      fill-opacity: 0.7;
    }
    
    .contingencyChart .storyCluster.observed {
      stroke-width: 3px;
      stroke: #2e4a85;
      fill: #d5dae6;
    }
    
    .contingencyChart .expected {
      stroke-width: 1px;
      stroke: #8e8789;
      stroke-dasharray: "5, 5";
      fill: none;
    }
    
    .contingencyChart .axis path {
      display: none;
    }
    
    .contingencyChart .axis line {
      shape-rendering: crispEdges;
      stroke: gray;
    }

    .contingencyChart .miniHistogram {
        fill: #eff4ff;
        stroke: black;
        stroke-width: 1px;
    }
    
    .contingencyChart .miniHistogram.selected {
        fill: #ffbb84;
        stroke: black;
        stroke-width: 1px;
    }
    
    .contingencyChart .miniHistogramMean {
        fill: blue;
        stroke: none;
    }
    
    .contingencyChart .miniHistogramStdDev {
        fill: #b0d4d4; 
        stroke: black;
        stroke-width: 1px;
    }
    
`;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Printing story form
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateHTMLForQuestionnaire(questionnaire) {
     
    // TODO: Translate
    var vdom = m(".narrafirma-questionnaire-for-printing", [
        "\n",
        
        m("div.narrafirma-survey-print-title", printText(questionnaire.title)),
        m("div.narrafirma-survey-print-intro", printText(questionnaire.startText)),
        m("div.narrafirma-survey-print-please-select", printText(questionnaire.chooseQuestionText) || "Please choose a question to which you would like to respond."),
        questionnaire.elicitingQuestions.map(function (elicitingQuestion) {
            return printOption(elicitingQuestion.text);
        }),
        m("div.narrafirma-survey-print-enter-response", printText(questionnaire.enterStoryText) || "Please enter your response here."),
        m("div.narrafirma-survey-print-name-story", printText(questionnaire.nameStoryText) || "Please give your story a name."),
        questionnaire.storyQuestions.map(function (storyQuestion) {
            return printQuestion(storyQuestion);
        }),
        questionnaire.participantQuestions.length >= 1 ? m("div.narrafirma-survey-print-about-you-text", printText(questionnaire.aboutYouText || "About you"))  : "",
        questionnaire.participantQuestions.map(function (participantQuestion) {
            return printQuestion(participantQuestion);
        }),
        m("div.narrafirma-survey-print-end-text", printText(questionnaire.endText || ""))
    ]);

    return generateHTMLForPage(questionnaire.title || "NarraFirma Story Form", "css/survey.css", questionnaire.customCSSForPrint, vdom, null);
}

export function printStoryForm(model, fieldSpecification, value) {
    var storyCollectionName: string = Globals.clientState().storyCollectionName();
    if (!storyCollectionName) {
        // TODO: translate
        alert("Please select a story collection first.");
        return null;
    }
    var questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionName);
    if (!questionnaire) return;
    var output = generateHTMLForQuestionnaire(questionnaire);
    printHTML(output);
}

// ***************************************************************************************** Story cards 

export function printStoryCards() {
    var storyCollectionName = Globals.clientState().storyCollectionName();
    var storyCollectionIdentifier = Globals.clientState().storyCollectionIdentifier();
    if (!storyCollectionName) {
        alert("Please select a story collection for which to print story cards.");
        return;
    }
    
    var project = Globals.project();
    var filter = project.tripleStore.queryLatestC(storyCollectionName, "printStoryCards_filter"); 
    var storiesForThisCollection = surveyCollection.getStoriesForStoryCollection(storyCollectionName);
    var questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionName);

    var filteredStories = null;
    if (filter) {
        filter = filter.trim();
        filteredStories = project.storiesForStoryCollectionWithFilter(storyCollectionIdentifier, storiesForThisCollection, questionnaire, filter, true);
    } else {
        filteredStories = storiesForThisCollection;
    }
    if (!filteredStories.length) {
        alert("There are no stories in the collection. Please add some stories before you print story cards.");
        return;
    }
    var questionsToInclude = project.tripleStore.queryLatestC(storyCollectionName, "printStoryCards_questionsToInclude"); 
    var customCSS = project.tripleStore.queryLatestC(storyCollectionName, "printStoryCards_customCSS"); 
    var beforeSliderCharacter = project.tripleStore.queryLatestC(storyCollectionName, "printStoryCards_beforeSliderCharacter"); 
    var sliderButtonCharacter = project.tripleStore.queryLatestC(storyCollectionName, "printStoryCards_sliderButtonCharacter"); 
    var afterSliderCharacter = project.tripleStore.queryLatestC(storyCollectionName, "printStoryCards_afterSliderCharacter"); 
    var noAnswerSliderCharacter = project.tripleStore.queryLatestC(storyCollectionName, "printStoryCards_noAnswerSliderCharacter"); 
    var order = project.tripleStore.queryLatestC(storyCollectionName, "printStoryCards_order"); 
    var cutoff = project.tripleStore.queryLatestC(storyCollectionName, "printStoryCards_storyTextCutoff"); 
    var cutoffMessage = project.tripleStore.queryLatestC(storyCollectionName, "printStoryCards_storyTextCutoffMessage"); 
    var includeIndex = project.tripleStore.queryLatestC(storyCollectionName, "printStoryCards_includeIndexInStoryCollection");
    
    var storyDivs = [];
    if (filter) storyDivs.push(m(".storyCardFilterWarning", "Stories that match filter: " + filter));

    for (var storyIndex = 0; storyIndex < filteredStories.length; storyIndex++) {
        var storyModel = filteredStories[storyIndex];
        var options = {
            storyTextAtTop: true,
            beforeSliderCharacter: beforeSliderCharacter,
            sliderButtonCharacter: sliderButtonCharacter,
            afterSliderCharacter: afterSliderCharacter,
            noAnswerSliderCharacter: noAnswerSliderCharacter,
            order: order,
            cutoff: cutoff,
            cutoffMessage: cutoffMessage,
            includeIndex: includeIndex
        }
        var storyContent = storyCardDisplay.generateStoryCardContent(storyModel, questionsToInclude, options);
        
        var storyDiv = m(".storyCardForPrinting", storyContent);
        storyDivs.push(storyDiv);
    }
    
   var htmlForPage = generateHTMLForPage("Story cards for: " + storyCollectionIdentifier, "css/standard.css", customCSS, storyDivs, null);
   printHTML(htmlForPage);
}

function printItem(item, fieldsToIgnore = {}) {
    var result = [];
    for (var fieldName in item) {
        if (fieldsToIgnore[fieldName]) continue;
        var fieldSpecification = Globals.panelSpecificationCollection().getFieldSpecificationForFieldID(fieldName);
        var shortName = fieldSpecification ? fieldSpecification.displayName : "Problem with: " + fieldName;
        var fieldValue = item[fieldName];
        result.push([
            m("div", shortName + ": " + fieldValue)
        ]);
    };
    return result;
}

function printList(list, fieldsToIgnore = {}, printItemFunction: Function = printItem) {
    var result = [];
    var project = Globals.project();
    list.forEach((id, index) => {
        var item = project.tripleStore.makeObject(id, true);
        result.push(printItemFunction(item, index, fieldsToIgnore));
        result.push([
            printReturn()
        ]);
    });
    return result;
}

// ***************************************************************************************** Presentation outline 

export function exportPresentationOutline() {
    var project = Globals.project();
    var presentationElementsList = project.getListForField("project_presentationElementsList");
    var printItems = [
        m("div", "Presentation Outline generated " + new Date()),
        printReturnAndBlankLine()
    ]; 
    
    printItems.push(printList(presentationElementsList));
    
    var htmlForPage = generateHTMLForPage("Presentation Outline", "css/standard.css", null, printItems, null);
    printHTML(htmlForPage);
}

// ***************************************************************************************** Session agendas 

export function exportCollectionSessionAgenda(itemID) {
    var project = Globals.project();
    var collectionSessionAgenda = project.tripleStore.makeObject(itemID, true);
    var activitiesListID = collectionSessionAgenda["collectionSessionPlan_activitiesList"];
    var activitiesList = project.tripleStore.getListForSetIdentifier(activitiesListID);
    
    var printItems = [
        m("div", "Story collection session agenda generated " + new Date()),
        printReturnAndBlankLine()
    ];
    
    printItems.push([
        printItem(collectionSessionAgenda, {collectionSessionPlan_activitiesList: true}),
        printReturnAndBlankLine()
    ]);
    
    printItems.push(printList(activitiesList));
    
    var htmlForPage = generateHTMLForPage("Story collection session agenda", "css/standard.css", null, printItems, null);
    printHTML(htmlForPage);
}

export function printSensemakingSessionAgenda(itemID) {
    var project = Globals.project();
    var sensemakingSessionAgenda = project.tripleStore.makeObject(itemID, true);
    var activitiesListID = sensemakingSessionAgenda["sensemakingSessionPlan_activitiesList"];
    var activitiesList = project.tripleStore.getListForSetIdentifier(activitiesListID);
    
    var printItems = [
        m("div", "Sensemaking session agenda generated " + new Date()),
        printReturnAndBlankLine()
    ];
    
    printItems.push([
        printItem(sensemakingSessionAgenda, {sensemakingSessionPlan_activitiesList: true}),
        printReturnAndBlankLine()
    ]);
    
    printItems.push(printList(activitiesList));
    
    var htmlForPage = generateHTMLForPage("Sensemaking session agenda", "css/standard.css", null, printItems, null);
    printHTML(htmlForPage);
}


// ***************************************************************************************** Project Report 

function cssForProjectReport() {
    var result = `div {
        margin: 0.5em 0 0.5em 0;
        padding: 0.2em 0 0.2em 0;
    }
    
    .narrafirma-report-title {
        font-size: 2em;
    }
     
     .narrafirma-report-intro {
         font-size: 0.9em;
     }
     
     .narrafirma-report-headerpagename {
         font-size: 1.5em;
         font-weight: bold;
         background-color: lightgray;
         padding: 0.5em;
     }
    
     .narrafirma-report-pagename {
         font-size: 1.3em;
         font-weight: bold;
         border-bottom: 1px solid gray;
     }
    
     .narrafirma-report-header {
        font-size: 1.2em;
        font-weight: bold;
     }
    
     .narrafirma-report-label {
        font-size: 1em;
     }
    
     .narrafirma-report-question-prompt {
        font-size: 1em;
     }
    
     .narrafirma-report-question-answer {
         margin-left: 2em;
         border: 1px solid lightgray;
         padding-left: 0.5em;
     }
    
     .narrafirma-report-grid-item {
        margin-left: 2em;
        border: 2px solid lightgray;
        padding: 0.5em;
    }
    
    .narrafirma-report-grid-item-name {
        background-color: #eeeeee;
        padding: 0.5em;
    }
         
    .narrafirma-report-clusteringdiagram, .narrafirma-report-observationlist, .narrafirma-report-project-story {
        margin-left: 2em;
        border: 1px solid lightgray;
        padding-left: 0.6em;
     }
     `;
    return result;
}

function printPartsForField(displayType, value) {
    var parts = [];
    if (typeof value === "object") {
        if (displayType === "checkboxes") {
            const options = Object.keys(value);
            parts.push("<div class=\"narrafirma-report-question-answer\">");
            options.forEach(function(option) {
                if (option) parts.push(option + "<br/>");
            });
            parts.push("</div>");
        }
    } else {
        if (typeof value === "string") value = replaceAll(value, "\n", "<br/>"); 
        parts.push("<div class=\"narrafirma-report-question-answer\">" + value + "</div>");
    }
    return parts;
}

function printPartsForGrid(field, panelSpecificationCollection, tripleStore, parentID, displayTypesNotToShow) {
    var parts = [];
    var gridHasUserContent = false;
    var gridPanel = panelSpecificationCollection.getPanelSpecificationForPanelID(field.displayConfiguration);
    if (gridPanel) {
        parts.push("<div class=\"narrafirma-report-question-prompt\">" + field.displayPrompt + "</div>");
        var singularGridItemName = "";
        var lastThreeChars = field.displayName.slice(-3);
        if (lastThreeChars === "ies") {
            singularGridItemName = field.displayName.slice(0,-3) + "y";
        } else {
            singularGridItemName = field.displayName.slice(0,-1);
        }

        var setIdentifier = tripleStore.queryLatestC(parentID, field.id);
        var itemIDs = tripleStore.getListForSetIdentifier(setIdentifier);

        var items = [];
        itemIDs.forEach(function(itemID) {
            var item = tripleStore.makeObject(itemID);
            item.itemID = itemID;
            if (item) items.push(item);
        });
        items = items.sort(function(a, b) { return (a.order > b.order) ? 1 : -1 });

        var itemCount = 1;
        items.forEach(function(item) {
            parts.push("<div class=\"narrafirma-report-grid-item\">");
            parts.push("<div class=\"narrafirma-report-grid-item-name\">" + singularGridItemName + " " + itemCount + "</div>");
            gridPanel.panelFields.forEach(function(gridField) {
                if (displayTypesNotToShow.indexOf(gridField.displayType) >= 0) return;
                if (gridField.displayType === "grid") {
                    const gridParts = printPartsForGrid(gridField, panelSpecificationCollection, tripleStore, item.itemID, displayTypesNotToShow);
                    if (gridParts) parts = parts.concat(gridParts);
                } else {
                    var value = item[gridField.id];
                    if (value) {
                        parts.push("<div class=\"narrafirma-report-question-prompt\">" + gridField.displayPrompt + "</div>");
                        var fieldParts = printPartsForField(gridField.displayType, value);
                        if (fieldParts) {
                            parts = parts.concat(fieldParts);
                            gridHasUserContent = true;
                        }
                    }
                }
            });
            parts.push("</div>");
            itemCount++;
        });
    }
    if (gridHasUserContent) {
        return parts;
    } else {
        return null;
    }
}

function printObservations(page, project, tripleStore, catalysisReportIdentifier) {
    var parts = [];
    var observationsHaveUserContent = false;
    var observationSetIdentifier = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_observations");
    if (observationSetIdentifier) {
        var observations = project.tripleStore.queryAllLatestBCForA(observationSetIdentifier);
        parts.push("<div class=\"narrafirma-report-observationlist\">");
        for (var key in observations) {
            var observationIdentifier = observations[key];
            var observation = tripleStore.makeObject(observationIdentifier);
            if (observation.observationTitle) {
                parts.push("<p><b>" + observation.pattern.patternName + ": " + observation.observationTitle + "</b> " + observation.observationDescription + "</p>");
                var interpretationsSetIdentifier = project.tripleStore.queryLatestC(observationIdentifier, "observationInterpretations");
                if (interpretationsSetIdentifier) {
                    var interpretations = project.tripleStore.getListForSetIdentifier(interpretationsSetIdentifier);  
                    parts.push("<ul>")
                    for (var key in interpretations) {
                        var interpretationIdentifier = interpretations[key];
                        var interpretation = tripleStore.makeObject(interpretationIdentifier);
                        let printText = "<li><b>" + interpretation.interpretation_name + "</b> " + interpretation.interpretation_text
                        if (interpretation.interpretation_idea) printText += " <i>" + interpretation.interpretation_idea + "</i>";
                        parts.push(printText + "</li>");
                        observationsHaveUserContent = true;
                    }
                    parts.push("</ul>")
                } 
            }
        }
        parts.push("</div>");             
    }
    if (observationsHaveUserContent) {
        return parts 
    } else {
        return null;
    }
}

function printClusteringDiagram(field, tripleStore, lookupID) {
    var parts = [];
    var diagramHasUserContent = false;
    parts.push("<div class=\"narrafirma-report-question-prompt\">" + field.displayPrompt + "</div>");
    parts.push("<div class=\"narrafirma-report-clusteringdiagram\">");
    var data = tripleStore.queryLatestC(lookupID, field.id);
    if (data !== undefined) {
        var items = [];
        var clusters = [];
        [clusters, items] = ClusteringDiagram.calculateClusteringForDiagram(data);
        clusters.forEach(function(cluster) {
            parts.push("<p><b>" + cluster.name + "</b> " + cluster.notes + "</p><ul>");
            cluster.items.forEach(function(item) {
                parts.push("<li><i>" + item.name + "</i> " + item.notes + "</li>");
                diagramHasUserContent = true;
            });
            parts.push("</ul>");
        });
    }
    parts.push("</div>");
    if (diagramHasUserContent) {
        return parts 
    } else {
        return null;
    }
}

function printQuizScoreResult(field, tripleStore, lookupID, panelSpecificationCollection) {
    var total = 0;
    for (var i = 0; i < field.displayConfiguration.length; i++) {
        var questionAnswer = tripleStore.queryLatestC(lookupID, field.displayConfiguration[i]);
        var answerWeight = 0;
        var index = 0;
        if (questionAnswer) {
            var choices = panelSpecificationCollection.getFieldSpecificationForFieldID(field.displayConfiguration[i]).valueOptions;
            index = choices.indexOf(questionAnswer);
            if (index === choices.length - 1) {
                answerWeight = 0;
            } else {
                answerWeight = index;
            }
            if (answerWeight < 0) answerWeight = 0;
            total += answerWeight;
        }
    }
    var possibleTotal = field.displayConfiguration.length * 3;
    var percent = Math.round(100 * total / possibleTotal);
    var template = translate("#calculate_quizScoreResult_template", "{{total}} of {{possibleTotal}} ({{percent}}%)");
    var scoreResult = template.replace("{{total}}", total).replace("{{possibleTotal}}", possibleTotal).replace("{{percent}}", "" + percent);
    return scoreResult;
}

function printPage(page, project, tripleStore, catalysisReportIdentifier, storyCollectionName, storyCollectionIdentifier, displayTypesNotToShow, panelSpecificationCollection) {
    var pageHasUserContent = false;
    var parts = [];

    page.panelFields.forEach(function(field) {
        if (displayTypesNotToShow.indexOf(field.displayType) >= 0) return;
        var displayTypeToUse = field.displayType;
        if (["catalysisReportGraphTypesChooser", "catalysisReportQuestionChooser", "printStoryCardsQuestionChooser"].indexOf(field.displayType) >= 0) displayTypeToUse = "checkboxes";

        var lookupID = project.projectIdentifier;
        if (field.valuePath) {
            if (field.valuePath.indexOf("catalysisReportIdentifier") >= 0) {
                lookupID = catalysisReportIdentifier;
            } else if (field.valuePath.indexOf("storyCollectionName") >= 0) {
                lookupID = storyCollectionName;
            } else if (field.valuePath.indexOf("storyCollectionIdentifier") >= 0) {
                lookupID = storyCollectionIdentifier;
            }
        }

        if (displayTypeToUse === "grid") {
            const gridParts = printPartsForGrid(field, panelSpecificationCollection, tripleStore, lookupID, displayTypesNotToShow);
            if (gridParts) {
                parts = parts.concat(gridParts);
                pageHasUserContent = true;
            }

        } else if (displayTypeToUse === "clusteringDiagram") {
            const diagramParts = printClusteringDiagram(field, tripleStore, lookupID);
            if (diagramParts) {
                parts = parts.concat(diagramParts);
                pageHasUserContent = true;
            }

        } else if (displayTypeToUse === "storiesList") {
            parts.push('<div class=\"narrafirma-report-question-prompt\">' + field.displayPrompt + "</div>");
            var projectStoryIdentifiers = project.getListForField("project_projectStoriesList");
            projectStoryIdentifiers.forEach((projectStoryIdentifier) => {
                var projectStory = project.tripleStore.makeObject(projectStoryIdentifier);
                parts.push("<div class=\"narrafirma-report-project-story\"><i>" + projectStory.projectStory_name + "</i> " + projectStory.projectStory_text + "</div>");
                pageHasUserContent = true;
            });

        } else if (displayTypeToUse === "quizScoreResult") {
            var scoreResult = printQuizScoreResult(field, tripleStore, lookupID, panelSpecificationCollection);
            parts.push("<p><b>" + field.displayPrompt + "</b> " + scoreResult + "</p>");

        } else if (displayTypeToUse === "header") {
            parts.push("<div class=\"narrafirma-report-header\">" + field.displayPrompt + "</div>");

        } else if (displayTypeToUse === "label") {
            if (field.id !== "configureCatalysisReport_promptToSelectCatalysisReportForInterpretations" && field.id !== "promptToSelectCatalysisReportForInterpretations") {
                // skip those two prompting fields; they are messages to the user that only appear sometimes
                parts.push("<div class=\"narrafirma-report-label\">" + field.displayPrompt + "</div>");
            }

        } else {
            var data = tripleStore.queryLatestC(lookupID, field.id);
            if (data !== undefined) {
                parts.push('<div class=\"narrafirma-report-question-prompt\">' + field.displayPrompt + "</div>");
                var fieldParts = printPartsForField(displayTypeToUse, data);
                parts = parts.concat(fieldParts);
                pageHasUserContent = true;
            } else {
                // there are some cases where the field id does not match the value path
                // in these cases the value path is the correct lookup id, so we need to get it from there
                // but we can't always get it from the value path, because sometimes there isn't one
                if (field.valuePath) {
                    const lastSlash = field.valuePath.lastIndexOf("/");
                    var fieldIDFromValuePath = field.valuePath.substring(lastSlash+1);
                    var data = tripleStore.queryLatestC(lookupID, fieldIDFromValuePath);
                    if (data !== undefined) {
                        parts.push('<div class=\"narrafirma-report-question-prompt\">' + field.displayPrompt + "</div>");
                        var fieldParts = printPartsForField(displayTypeToUse, data);
                        parts = parts.concat(fieldParts);
                        pageHasUserContent = true;
                    } 
                }

                
            }
        }
    });

    // must print observations separately because they are not linked to the page specification structure
    // want this to print after the label that describes it
    if (page.displayName === "Explore patterns" && catalysisReportIdentifier) {
        var observationParts = printObservations(page, project, tripleStore, catalysisReportIdentifier);
        if (observationParts) {
            parts = parts.concat(observationParts);
            pageHasUserContent = true;
        }
    }

    if (pageHasUserContent) {
        return parts;
    } else {
        return null;
    }
}

export function printProjectReport() {
    var parts = [];
    const project = Globals.project();
    const tripleStore = project.tripleStore;
    const clientState = Globals.clientState();
    const panelSpecificationCollection = Globals.panelSpecificationCollection();
    const allPages = panelSpecificationCollection.buildListOfPages();
    const displayTypesNotToShow = ["button", "html", "recommendationTable", "templateList", "storyBrowser", "graphBrowser", "functionResult"];
    const pagesNeverToPrint = ["page_startStoryCollection", "page_printQuestionForms", "page_enterStories", "page_importExportStories", "page_removeData", "page_reviewIncomingStories", "page_browseGraphs",
        "page_stopStoryCollection", "page_startCatalysisReport", "page_printCatalysisReport"];

    parts.push("<div class=\"narrafirma-report-title\">Project Report for " + project.projectName() + "</div>");
    parts.push("<div class=\"narrafirma-report-intro\">Generated by NarraFirma " + versions.narrafirmaApplication + " on "  + new Date().toString() + ".</div>");
    
    allPages.forEach(function(page) {
        if (page.section === "dashboard" || page.section === "administration") return;
        if (pagesNeverToPrint.indexOf(page.id) >= 0) return;
        if (page.isHeader) {
            parts.push("<div class=\"narrafirma-report-headerpagename\">" + page.displayName + "</div>");
        } 

        if (["page_configureCatalysisReport", "page_explorePatterns", "page_clusterInterpretations"].indexOf(page.id) >= 0) {
            var catalysisReports = tripleStore.queryLatestC(project.projectIdentifier, "project_catalysisReports");
            if (catalysisReports) {
                var catalysisReportIdentifiers = tripleStore.getListForSetIdentifier(catalysisReports);
                for (var i = 0; i < catalysisReportIdentifiers.length; i++) {
                    var reportShortName = tripleStore.queryLatestC(catalysisReportIdentifiers[i], "catalysisReport_shortName");
                    var pageParts = printPage(page, project, tripleStore, catalysisReportIdentifiers[i], null, null, displayTypesNotToShow, panelSpecificationCollection);
                    if (pageParts) {
                        parts.push("<div class=\"narrafirma-report-grid-item\">");
                        parts.push("<div class=\"narrafirma-report-grid-item-name\">Catalysis report: " + reportShortName + "</div>");
                        parts = parts.concat(pageParts);
                        parts.push("</div>");
                    }
                }
            } 

        } else if (page.id === "page_printStoryCards") {
            var storyCollections = tripleStore.queryLatestC(project.projectIdentifier, "project_storyCollections");
            if (storyCollections) {
                var storyCollectionIdentifiers = tripleStore.getListForSetIdentifier(storyCollections);
                for (var i = 0; i < storyCollectionIdentifiers.length; i++) {
                    var collectionShortName = tripleStore.queryLatestC(storyCollectionIdentifiers[i], "storyCollection_shortName");
                    var pageParts = printPage(page, project, tripleStore, null, collectionShortName, storyCollectionIdentifiers[i], displayTypesNotToShow, panelSpecificationCollection);
                    if (pageParts) {
                        parts.push("<div class=\"narrafirma-report-grid-item\">");
                        parts.push("<div class=\"narrafirma-report-grid-item-name\">Story collection: " + collectionShortName + "</div>");
                        parts = parts.concat(pageParts);
                        parts.push("</div>");
                    }
                }
            } 
            
        } else {
            var pageParts = printPage(page, project, tripleStore, null, null, null, displayTypesNotToShow, panelSpecificationCollection);
            if (pageParts) {
                parts.push("<div class=\"narrafirma-report-pagename\">" + page.displayName + "</div>");
                parts = parts.concat(pageParts);
            }
        }
    });

    var html = generateHTMLForPage("Report - " + project.projectName(), null, cssForProjectReport(), null, parts.join("\n"));
    printHTML(html);
}



