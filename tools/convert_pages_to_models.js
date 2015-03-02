/*jslint node: true */
"use strict";

var fs = require('fs');

var pagesFileName = "../design/pages.json";

var pagesReadFromJSON = JSON.parse(fs.readFileSync(pagesFileName, 'utf8'));
// console.log("pages", pagesReadFromJSON);

// Generate models and pages
// Generate models

console.log("page count", pagesReadFromJSON.length);

function rewritetPageNameAsModel(pageName) {
    pageName = pageName.substring(5);
    if (pageName.indexOf("add") === 0) pageName = pageName.substring(3);
    pageName = pageName[0].toUpperCase() + pageName.substring(1);
    return pageName;
}

pagesReadFromJSON.forEach(function (page) {
    console.log("page", page.id, rewritetPageNameAsModel(page.id));
});

console.log("--------");

pagesReadFromJSON.forEach(function (page) {
    var pageType = "PAGE";
    if (page.isHeader) {
        pageType = "HEADER";
        console.log("==================== SECTION ==========================");
    }
    console.log("\n ------------- ", pageType, page.id, " ------------- \n");
    page.questions.forEach(function (question) {
        var optionsAsArray;
        if (question.options) {
            optionsAsArray = question.options.split(";");
        }
        var item = {
            page: page.id,
            id: question.id,
            type: question.type,
            name: question.shortText,
            prompt: question.text,
            options: optionsAsArray,
        };
        console.log("question", page.id, "\n", JSON.stringify(item, null, 4));
    });
});