import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_dashboard",
    displayName: "Home",
    panelFields: [
        {
            id: "project_mainDashboardPNIPhasesDiagram",
            valueType: "none",
            displayType: "html",
            displayPrompt: "<img class=\"narrafirma-pni-phases-image\" src=\"images/PNIPhasesDiagram-trimmed.png\" alt=\"PNI Phase Diagram\" usemap=\"#pniphasesmap\"></img>"
        },
        {
            id: "project_mainDashboardPNIPhasesImageMap",
            valueType: "none",
            displayType: "html",
            displayPrompt: "<map name=\"pniphasesmap\"><area shape=\"rect\" coords=\"4,44,111,162\" href=\"javascript:narrafirma_openPage('page_planning')\" alt=\"Planning\" title=\"Click here to go to the Planning section\"><area shape=\"rect\" coords=\"224,66,336,182\" href=\"javascript:narrafirma_openPage('page_collection')\" alt=\"Collection\" title=\"Click here to go to the Collection section\"><area shape=\"rect\" coords=\"447,46,553,162\" href=\"javascript:narrafirma_openPage('page_catalysis')\" alt=\"Catalysis\" title=\"Click here to go to the Catalysis section\"><area shape=\"rect\" coords=\"104,199,213,321\" href=\"javascript:narrafirma_openPage('page_return')\" alt=\"Return\" title=\"Click here to go to the Return section\"><area shape=\"rect\" coords=\"344,199,454,320\" href=\"javascript:narrafirma_openPage('page_sensemaking')\" alt=\"Sensemaking\" title=\"Click here to go to the Sensemaking section\"><area shape=\"rect\" coords=\"212,354,437,451\" href=\"javascript:narrafirma_openPage('page_intervention')\" alt=\"Intervention\" title=\"Click here to go to the Intervention section\"></map>"
        },
        {
            id: "project_launchSection_administration",
            valueType: "none",
            displayType: "dashboardSectionStatusDisplay",
            displayPreventBreak: false,
            displayConfiguration: {
                action: "guiOpenSection",
                section: "page_administration"
            },
            displayPrompt: "Administration"
        },
        {
            id: "project_launchSection_planning",
            valueType: "none",
            displayType: "dashboardSectionStatusDisplay",
            displayPreventBreak: false,
            displayConfiguration: {
                action: "guiOpenSection",
                section: "page_planning"
            },
            displayPrompt: "Planning"
        },
        {
            id: "project_launchSection_collection",
            valueType: "none",
            displayType: "dashboardSectionStatusDisplay",
            displayPreventBreak: false,
            displayConfiguration: {
                action: "guiOpenSection",
                section: "page_collection"
            },
            displayPrompt: "Collection"
        },
        {
            id: "project_launchSection_catalysis",
            valueType: "none",
            displayType: "dashboardSectionStatusDisplay",
            displayPreventBreak: false,
            displayConfiguration: {
                action: "guiOpenSection",
                section: "page_catalysis"
            },
            displayPrompt: "Catalysis"
        },
        {
            id: "project_launchSection_sensemaking",
            valueType: "none",
            displayType: "dashboardSectionStatusDisplay",
            displayPreventBreak: false,
            displayConfiguration: {
                action: "guiOpenSection",
                section: "page_sensemaking"
            },
            displayPrompt: "Sensemaking"
        },
        {
            id: "project_launchSection_intervention",
            valueType: "none",
            displayType: "dashboardSectionStatusDisplay",
            displayPreventBreak: false,
            displayConfiguration: {
                action: "guiOpenSection",
                section: "page_intervention"
            },
            displayPrompt: "Intervention"
        },
        {
            id: "project_launchSection_return",
            valueType: "none",
            displayType: "dashboardSectionStatusDisplay",
            displayPreventBreak: false,
            displayConfiguration: {
                action: "guiOpenSection",
                section: "page_return"
            },
            displayPrompt: "Return"
        },
        {
            id: "project_mainDashboardStoryCollectionStatus",
            valueType: "none",
            displayType: "dashboardStoryCollectionStatusDisplay",
            displayPrompt: "Story collections"
        }
     ]
};

export = panel;

