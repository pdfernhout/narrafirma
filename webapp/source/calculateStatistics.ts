import kendallsTau = require("./statistics/kendallsTau");
import chiSquare = require("./statistics/chiSquare");
import mannWhitneyU = require("./statistics/mannWhitneyU");
import surveyCollection = require("./surveyCollection");

"use strict";

// Library for statistics, imported by narrafirma.html
declare var jStat;

/*
function collectDataForField(stories: surveyCollection.Story[], fieldName) {
    var result = [];
    for (var i = 0; i < stories.length; i++) {
        var value = stories[i].fieldValue(fieldName);
        if (value === null || value === undefined) continue;
        result.push(value);
    }
    return result;
}
*/

function isValidNumber(value) {
    // console.log("isValidNumber", JSON.stringify(value));
    return value !== "" && !isNaN(value);
}

function collectXYDataForFields(stories: surveyCollection.Story[], xFieldName, yFieldName) {
    var xResult = [];
    var yResult = [];
    for (var i = 0; i < stories.length; i++) {
        var xValue = stories[i].fieldValue(xFieldName);
        if (!isValidNumber(xValue)) continue;
        var yValue = stories[i].fieldValue(yFieldName);
        if (!isValidNumber(yValue)) continue;
        xResult.push(xValue);
        yResult.push(yValue);
    }
    return {x: xResult, y: yResult};
}

function addValue(arrayHolder, fieldName, value) {
    var values = arrayHolder[fieldName];
    if (!values) values = [];
    values.push(value);
    arrayHolder[fieldName] = values;
}

function valuesForFieldChoices(stories: surveyCollection.Story[], scaleQuestionID, choiceQuestionID) {
    // console.log("countsForFieldChoices", stories, field1, field2);
    // TODO: Need to add in fields that were not selected with a zero count, using definition from questionnaire
    var values = {};
    for (var i = 0; i < stories.length; i++) {
        var scaleValue = stories[i].fieldValue(scaleQuestionID);
        if (scaleValue === null || scaleValue === undefined || scaleValue === "") continue; // value1 = "{N/A}";

        var choiceValue = stories[i].fieldValue(choiceQuestionID);
        if (choiceValue === null || choiceValue === undefined || scaleValue === "") continue; // value1 = "{N/A}";

        addValue(values, choiceValue, scaleValue);
    }
    return values;
}

/*
function countsForFieldChoices(stories: surveyCollection.Story[], field1, field2) {
    // console.log("countsForFieldChoices", stories, field1, field2);
    // TODO: Need to add in fields that were not selected with a zero count, using definition from questionnaire
    var counts = {};
    for (var i = 0; i < stories.length; i++) {
        var value1 = stories[i].fieldValue(field1);
        var value2 = stories[i].fieldValue(field2);
        var value = JSON.stringify([value1, value2]);
        // console.log("value", value, value1, value2);
        var count = counts[value];
        if (!count) count = 0;
        count++;
        counts[value] = count;
    }
    return counts;
}
*/

/*
function countsForFieldChoice(stories: surveyCollection.Story[], field1) {
    // console.log("countsForFieldChoice", stories, field1);
    // TODO: Need to add in fields that were not selected with a zero count, using definition from questionnaire
    var counts = {};
    for (var i = 0; i < stories.length; i++) {
        var value1 = stories[i].fieldValue(field1);
        if (value1 === null || value1 === undefined) continue; // value1 = "{N/A}";
        increment(counts, "" + value1);
    }
    return counts;
}
*/

function increment(countHolder, fieldName) {
    var count = countHolder[fieldName];
    if (!count) count = 0;
    count++;
    countHolder[fieldName] = count;
}

function valueTag(field1, field2) {
    if (field1 === null || field1 === undefined) field1 = "{N/A}";
    if (field2 === null || field2 === undefined) field2 = "{N/A}";
    var result = JSON.stringify([field1, field2]);
    // console.log("valueTag", result);
    return result;
}

function countsForTableChoices(stories: surveyCollection.Story[], field1, field2) {
    // console.log("countsForFieldChoices", stories, field1, field2);
    // TODO: Maybe need to add in fields that were not selected with a zero count, using definition from questionnaire?
    var counts = {};
    var field1Options = {};
    var field2Options = {};
    var total = 0;
    for (var i = 0; i < stories.length; i++) {
        var value1 = stories[i].fieldValue(field1);
        if (value1 === null || value1 === undefined) continue; // value1 = "{N/A}";
        var value2 = stories[i].fieldValue(field2);
        if (value2 === null || value2 === undefined) continue; // value2 = "{N/A}";
        increment(counts, valueTag(value1, value2));
        increment(field1Options, "" + value1);
        increment(field2Options, "" + value2);
        total++;
    }
    var result = {counts: counts, field1Options: field1Options, field2Options: field2Options, total: total};
    // console.log("countsForTableChoices", result);
    return result;
}

/*
function collectValues(valueHolder) {
    var values = [];
    for (var key in valueHolder) {
        values.push(valueHolder[key]);
    }
    return values;
}
*/

export function calculateStatisticsForBarGraph(pattern, stories: surveyCollection.Story[], minimumStoryCountRequiredForTest: number = 0) {
    // not calculating statistics for bar graph
    pattern.significance = "N/A";
}

export function calculateStatisticsForHistogram(pattern, stories: surveyCollection.Story[], minimumStoryCountRequiredForTest: number = 0) {
    // TODO: ? look for differences of means on a distribution using Student's T test if normal, otherwise Kruskal-Wallis or maybe Mann-Whitney
    // TODO: Fix this - could report on normality
    
    // var counts = collectDataForField(stories, pattern.questions[0].id);
    // console.log("counts", counts);
    
    pattern.significance = "N/A";
}

export function calculateStatisticsForMultipleHistogram(pattern, stories: surveyCollection.Story[], minimumStoryCountRequiredForTest: number = 0) {
    // One of each continuous and not
    // for each option, look for differences of means on a distribution using Student's T test if normal, otherwise Kruskal-Wallis or maybe Mann-Whitney
    
    // TODO: use t-test when normal 

    var ratioQuestion = pattern.questions[0];
    var nominalQuestion = pattern.questions[1];
    
    // Can't calculate a statistic if one or both are mutiple answer checkboxes
    if (nominalQuestion.displayType === "checkboxes") {
        pattern.significance = "N/A (checkboxes)";
        return;
    }
    

    // var data = collectDataForField(stories, nominalQuestion.id);
    // var counts = countsForFieldChoice(stories, nominalQuestion.id);
    var values = valuesForFieldChoices(stories, ratioQuestion.id, nominalQuestion.id);
    var options = Object.keys(values);
    
    // console.log("calculateStatisticsForMultipleHistogram options", options, values);
    
    // For every pair, compute test, and take best p score
    var pLowest = Number.MAX_VALUE;
    var uLowest = NaN;
    var n = 0;
    
    for (var i = 0; i < options.length; i++) {
        var x = values[options[i]];
        if (x.length < minimumStoryCountRequiredForTest) continue;
        n += x.length;
        for (var j = i + 1; j < options.length; j++) {
            var y = values[options[j]];
            if (y.length < minimumStoryCountRequiredForTest) continue;
            var statResult = mannWhitneyU(x, y);
            // console.log("calculateStatisticsForMultipleHistogram statResult", statResult);
            if (statResult.p <= pLowest) {
                pLowest = statResult.p;
                uLowest = statResult.u;
            }
        }
    }
    
    if (pLowest === Number.MAX_VALUE) {
        pattern.significance = "N/A (below threshold)";
        return;
    }

    pattern.significance = " p=" + pLowest.toFixed(3) + " U=" + uLowest + " n=" + n;
}

export function calculateStatisticsForScatterPlot(pattern, stories: surveyCollection.Story[], minimumStoryCountRequiredForTest: number = 0) {
    // TODO: both continuous -- look for correlation with Pearson's R (if normal distribution) or Spearman's R / Kendall's Tau (if not normal distribution)"
    var data = collectXYDataForFields(stories, pattern.questions[0].id, pattern.questions[1].id);
    
    if (data.x.length < minimumStoryCountRequiredForTest) {
        pattern.significance = "N/A (below threshold)";
        return;
    }
    
    // TODO: Add a flag somewhere to use Kendall's Tau instead of Pearson/Spearman's R
    // var statResult = kendallsTau(data.x, data.y);
    // pattern.significance = statResult.prob.toFixed(4);
    
    // TODO: Use Pearson's R instead of Spearman if normally distributed
    var r = jStat.spearmancoeff(data.x, data.y);
    // https://en.wikipedia.org/wiki/Spearman's_rank_correlation_coefficient#Determining_significance
    var n = data.x.length;
    var t = r * Math.sqrt((n - 2.0) / (1.0 - r * r));
    var p = jStat.ttest(t, n, 2);
    pattern.significance = " p=" + p.toFixed(3) + " rho=" + r.toFixed(3) + " n=" + n;
    //  + " tt=" + statResult.test.toFixed(3) + " tz=" + statResult.z.toFixed(3) + " tp=" + statResult.prob.toFixed(3) ;
    // console.log("calculateStatisticsForScatterPlot", pattern, n, t, p);
}

export function calculateStatisticsForTable(pattern, stories: surveyCollection.Story[], minimumStoryCountRequiredForTest: number = 0) {
    // both not continuous -- look for a 'correspondence' between counts using Chi-squared test
    // Can't calculate a statistic if one or both are mutiple answer checkboxes
    // TODO: Fix this
    // TODO: test for missing patterns[1]
    
    // console.log("calculateStatisticsForTable", pattern);
    
    if (pattern.questions[0].displayType === "checkboxes" || pattern.questions[1].displayType === "checkboxes") {
        pattern.significance = "N/A (checkboxes)";
        return;
    }
    
    var counts = countsForTableChoices(stories, pattern.questions[0].id, pattern.questions[1].id);
    // console.log("counts", counts);
    
    var observed = [];
    var expected = [];
    
    for (var field1Option in counts.field1Options) {
        var field1Total = counts.field1Options[field1Option];
        if (field1Total < minimumStoryCountRequiredForTest) continue;
        for (var field2Option in counts.field2Options) {
            var field2Total = counts.field2Options[field2Option];
            if (field2Total < minimumStoryCountRequiredForTest) continue;
            var observedValue = counts.counts[valueTag(field1Option, field2Option)] ||  0;
            observed.push(observedValue);
            var expectedValue = field1Total * field2Total / counts.total;
            expected.push(expectedValue);
        }
    }

    var n1 = Object.keys(counts.field1Options).length;
    var n2 = Object.keys(counts.field2Options).length;
    
    if (n1 <= 1 || n2 <= 1) {
        pattern.significance = "N/A (below threshold)";
        return;
    }
    
    var degreesOfFreedom = (n1 - 1) * (n2 - 1);        
    
    // Conditions needed for test according to: https://en.wikipedia.org/wiki/Pearson's_chi-squared_test
    var tooLowCount = 0;
    var zeroInCell = false;
    for (var i = 0; i < expected.length; i++) {
        if (expected[i] < 5) tooLowCount++;
        if (expected[i] === 0) zeroInCell = true;
    }
    
    if (zeroInCell) {
        pattern.significance = "N/A (zero in expected cell)";
        return;
    }
    
    if (n1 <= 2 && n2 <= 2 && tooLowCount > 0) {
        pattern.significance = "N/A (2X2 with expected cell < 5)";
        return;
    }
    
    if (tooLowCount / observed.length > 0.2) {
        pattern.significance = "N/A (less than 80% expected cells >= 5)";
        return;
    }

    // console.log("observed", observed);
    // console.log("expected", expected);
    // console.log("degreesOfFreedom", degreesOfFreedom);
    
    var statResult = chiSquare.chiSquare(observed, expected, degreesOfFreedom);
    // console.log("statResult.n", statResult.n);
    
    if (statResult.n !== n1 * n2) {
        throw new Error("unexpected n1 * n2");
    }
    
    if (statResult.n === degreesOfFreedom) {
        throw new Error("unexpected statResult.n");
    }
    
    pattern.significance = " p=" + statResult.p.toFixed(3) + " x2=" + statResult.x2.toFixed(3) + " k=" + statResult.k + " n=" + statResult.n;
}
