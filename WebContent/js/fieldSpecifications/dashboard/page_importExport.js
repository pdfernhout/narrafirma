define([], function() {
    "use strict";
    return [
{
    id: 'page_importExport',
    displayName: 'Import & Export',
    displayType: 'page',
    isHeader: false,
    modelClass: 'ProjectModel',
    section: 'dashboard'
},
{
    id: 'project_importExport_header',
    dataType: 'none',
    displayType: 'label',
    displayPrompt: 'This page can be used to import or export project data in various ways'
},
{
    id: 'project_importExport_loadLatest',
    dataType: 'none',
    displayType: 'button',
    displayConfiguration: "loadLatest",
    displayPrompt: 'Load latest (also going away?)'
},
{
    id: 'project_importExport_loadVersion',
    dataType: 'none',
    displayType: 'button',
    displayConfiguration: "loadVersion",
    displayPrompt: 'Load version from a list (going away?)'
},
{
    id: 'project_importExport_importExportOld',
    dataType: 'none',
    displayType: 'button',
    displayConfiguration: "importExportOld",
    displayPrompt: 'Import/Export (old approach)'
},
];
});