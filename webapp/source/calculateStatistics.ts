import jStat = require("jstat");
import kendallsTau = require("./statistics/kendallsTau");
import chiSquare = require("./statistics/chiSquare");
import mannWhitneyU = require("./statistics/mannWhitneyU");
import surveyCollection = require("./surveyCollection");
import toaster = require("./panelBuilder/toaster");
import m = require("mithril");

"use strict";

function isValidNumber(value) {
    return value !== "" && !isNaN(value);
}

export function getChoiceValueForQuestionAndStory(question, story, unansweredText, includeNAValues) {
    if (!question) return null;
    let value;

    if (question.id === "storyLength") {
        value = getStoryLengthValueForStory(story, question, unansweredText, includeNAValues);
    } else {
        value = story.fieldValue(question.id);

        if (question.displayType === "checkbox") {
            if (value) {
                return "true"
            } else {
                return "false"
            }
        } else if (question.displayType === "boolean") {
            if (value) {
                return "yes"
            } else {
                return "no"
            }
        } else if (value === undefined || value === null || value === "") {
            if (includeNAValues) {
                if (question.displayType === "checkboxes") {
                    let result = {};
                    result[unansweredText] = true;
                    return result;
                } else {
                    return unansweredText;
                }
            } else {
                return null;
            }
        }
    }
    return value;
}

export function getScaleValueForQuestionAndStory(question, story, unansweredText) {
    var value = story.fieldValue(question.id);
    if (value === undefined || value === null || value === "") return unansweredText;
    if (typeof value === "string") value = parseInt(value);
    return value;
}

function getStoryLengthValueForStory(story, question, unansweredText, includeNAValues) {
    var value = story.storyLength();
    if (value == 0) {
        if (includeNAValues) {
            return unansweredText;
        } else {
            return null;
        }
    } else {
        var result = null;
        for (var i = 0; i < question.valueOptions.length; i++) {
            const optionAsInt = parseInt(question.valueOptions[i]);
            if (value <= optionAsInt) {
                result = question.valueOptions[i];
                break;
            }
        }
        if (!result) result = question.valueOptions[question.valueOptions.length-1];
        return result;
    }
}

export function collectValuesForOneScale(stories: surveyCollection.Story[], fieldName, conversionFunction = null) {
    var result = [];
    for (var i = 0; i < stories.length; i++) {
        var value = stories[i].fieldValue(fieldName);
        if (value === null || value === undefined || value === "") continue;
        if (conversionFunction) value = conversionFunction(value);
        result.push(value);
    }
    return result;
}

export function choiceValueMatchesQuestionOption(value, question, option) {
    if (value === null) return false;
    if (question.displayType === "checkboxes") {
        if (!value[option]) return false;
    } else {
        if (value !== option) return false;
    }
    return true;
}

function collectValuesForTwoScalesAndMaybeOneChoiceOption(stories: surveyCollection.Story[], xFieldName, yFieldName, choiceQuestion, option, unansweredText, includeNAValues) {
    var xResult = [];
    var yResult = [];
    var unansweredCount = 0;
    for (var i = 0; i < stories.length; i++) {
        var xValue = stories[i].fieldValue(xFieldName);
        var yValue = stories[i].fieldValue(yFieldName);
        if (choiceQuestion) {
            var choiceValue = getChoiceValueForQuestionAndStory(choiceQuestion, stories[i], unansweredText, includeNAValues);
            if (choiceValueMatchesQuestionOption(choiceValue, choiceQuestion, option)) {
                if (!isValidNumber(xValue) || !isValidNumber(yValue)) {
                    unansweredCount += 1;
                } else {
                    xResult.push(xValue);
                    yResult.push(yValue);
                }
            }
        } else {
            xResult.push(xValue);
            yResult.push(yValue);
        }
    }
    return {x: xResult, y: yResult, unansweredCount: unansweredCount};
}

export function collectValuesForOneScaleAndOneOrTwoChoices(stories: surveyCollection.Story[], unansweredText, includeNAValues, scaleQuestion, choiceQuestion, secondChoiceQuestion = null) {

    function addValue(arrayHolder, fieldName, value, secondFieldName = null) {
        var key = fieldName;
        if (secondFieldName) key += ", " + secondFieldName;
        var values = arrayHolder[key];
        if (!values) values = [];
        values.push(value);
        arrayHolder[key] = values;
    }

    var values = {};
    for (var i = 0; i < stories.length; i++) {
        const story = stories[i];
        var scaleValue = stories[i].fieldValue(scaleQuestion.id);
        if (scaleValue === null || scaleValue === undefined || scaleValue === "") continue; 

        const choiceValue = getChoiceValueForQuestionAndStory(choiceQuestion, story, unansweredText, includeNAValues);
        if (choiceValue === null || Object.keys(choiceValue).length === 0) continue;

        let secondChoiceValue = null;
        if (secondChoiceQuestion) {
            secondChoiceValue = getChoiceValueForQuestionAndStory(secondChoiceQuestion, story, unansweredText, includeNAValues);
            if (secondChoiceValue === null) continue;
        }
        addValue(values, choiceValue, scaleValue, secondChoiceValue);
    }
    return values;
}

function valueTag(field1, field2) {
    if (field1 === null || field1 === undefined || field1 === "") field1 = "{N/A}";
    if (field2 === null || field2 === undefined || field2 === "") field2 = "{N/A}";
    var result = JSON.stringify([field1, field2]);
    return result;
}

function collectValuesForTwoChoices(stories: surveyCollection.Story[], field1, field2, unansweredText, includeNAValues) {

    function increment(countHolder, fieldName) {
        var count = countHolder[fieldName];
        if (!count) count = 0;
        count++;
        countHolder[fieldName] = count;
    }

    var counts = {};
    var field1Options = {};
    var field2Options = {};
    var total = 0;
    for (var i = 0; i < stories.length; i++) {
        // in this case the value cannot be an object, because stats are not run when either question is checkboxes 
        var value1 = getChoiceValueForQuestionAndStory(field1, stories[i], unansweredText, includeNAValues);
        var value2 = getChoiceValueForQuestionAndStory(field2, stories[i], unansweredText, includeNAValues);
        increment(counts, valueTag(value1, value2));
        increment(field1Options, "" + value1);
        increment(field2Options, "" + value2);
        total++;
    }
    var result = {counts: counts, field1Options: field1Options, field2Options: field2Options, total: total};
    return result;
}

export function calculateStatisticsForPattern(pattern, stories, minimumStoryCountRequiredForTest, unansweredText, includeNAValues, progressUpdater, patternNumber, numPatterns, howOftenToUpdateProgressMessage) {
    var graphType = pattern.graphType;
    var statistics = null;

    if (graphType === "bar") {
        statistics = {statsSummary: "None", statsDetailed: []};
    } else if (graphType === "table") {
        statistics = calculateStatisticsForTable(pattern.questions[0], pattern.questions[1], stories, minimumStoryCountRequiredForTest, unansweredText, includeNAValues);
    } else if (graphType === "contingency-histogram") {
        statistics = calculateStatisticsForMiniHistograms(pattern.questions[2], pattern.questions[0], pattern.questions[1], stories, minimumStoryCountRequiredForTest, unansweredText, includeNAValues); 
    } else if (graphType === "histogram") {
        statistics = calculateStatisticsForHistogram(pattern.questions[0], stories, minimumStoryCountRequiredForTest, unansweredText);
    } else if (graphType === "multiple histogram") {
        statistics = calculateStatisticsForMultipleHistogram(pattern.questions[0], pattern.questions[1], stories, minimumStoryCountRequiredForTest, unansweredText, includeNAValues);
    } else if (graphType === "scatter") {
        statistics = calculateStatisticsForScatterPlot(pattern.questions[0], pattern.questions[1], null, null, stories, minimumStoryCountRequiredForTest, unansweredText, includeNAValues);
    } else if (graphType ===  "multiple scatter") {
        statistics = calculateStatisticsForMultipleScatterPlot(pattern.questions[0], pattern.questions[1], pattern.questions[2], stories, minimumStoryCountRequiredForTest, unansweredText, includeNAValues);
    } else if (graphType == "data integrity") {
        statistics = {statsSummary: "None", statsDetailed: []};
    } else if (graphType == "texts") {
        statistics = {statsSummary: "None", statsDetailed: []};   
    } else if (graphType == "correlation map") {
        statistics = {statsSummary: "None", statsDetailed: []};          // cfk fix later 
    } else {
        console.log("ERROR: Unexpected graphType: " + graphType);
        throw new Error("ERROR: Not suported graphType: " + graphType);
    }
    
    if (statistics) {
        pattern.statsSummary = statistics.statsSummary;
    } else {
        pattern.statsSummary = "ERROR";
    }

    if (progressUpdater && (patternNumber % howOftenToUpdateProgressMessage == 0)) { // only report progress every total/100 graphs; makes it go faster
        progressUpdater.progressMessage = "Calculating statistics for pattern " + patternNumber + " of " + numPatterns;
        progressUpdater.redraw();
    }
}

export function calculateStatisticsForBarGraphValues(values) {
    return {statsSummary: "None", statsDetailed: []};
}

export function calculateStatisticsForHistogram(ratioQuestion, stories: surveyCollection.Story[], minimumStoryCountRequiredForTest: number, unansweredText) {
    var values = collectValuesForOneScale(stories, ratioQuestion.id, parseFloat);
    return calculateStatisticsForHistogramValues(values, -1, unansweredText); // unanswered count not needed for this use
}

export function calculateStatisticsForHistogramValues(values, unansweredCount, unansweredText) {
    var n = values.length;
    var result;
    if (n <= 0) {
        result = {statsSummary: "None", statsDetailed: [ "n"], n: n};
    } else {
        var mean = jStat.mean(values);
        var median = jStat.median(values);
        var mode = jStat.mode(values);
        var sd = jStat.stdev(values, true);
        var skewness = jStat.skewness(values);
        var kurtosis = jStat.kurtosis(values);
        result = {statsSummary: "None", statsDetailed: ["mean", "median", "mode", "sd", "skewness", "kurtosis", "n"], mean: mean, median: median, mode: mode, sd: sd, skewness: skewness, kurtosis: kurtosis, n: n};
        if (unansweredCount >= 0) {
            result["statsDetailed"].push(unansweredText);
            result[unansweredText] = unansweredCount;
        }
    }
    return result;
}

export function calculateStatisticsForMiniHistograms(scaleQuestion, firstChoiceQuestion, secondChoiceQuestion, stories: surveyCollection.Story[], 
        minimumStoryCountRequiredForTest: number, unansweredText, includeNAValues): any {
    // Can't calculate a statistic if one or both are mutiple answer checkboxes
    if (firstChoiceQuestion.displayType === "checkboxes" || secondChoiceQuestion.displayType === "checkboxes") {
        return {statsSummary: "None (choices not mutually exclusive)", statsDetailed: []};
    }

    var values = collectValuesForOneScaleAndOneOrTwoChoices(stories, unansweredText, includeNAValues, scaleQuestion, firstChoiceQuestion, secondChoiceQuestion);
    var options = Object.keys(values);

    // For every pair, compute test, and take best p score
    var pLowest = Number.MAX_VALUE;
    var uLowest = NaN;
    var n = 0;
    var allNs = [];

    var allResults = {};

    for (var i = 0; i < options.length; i++) {
        var x = values[options[i]];
        allNs.push(x.length);
        if (x.length < minimumStoryCountRequiredForTest) continue;
        n += x.length;

        if (options.length === 1) {
            return {statsSummary: "None (too few options to compare)", statsDetailed: ["n"], n: n};
        }

        for (var j = i + 1; j < options.length; j++) {
            var y = values[options[j]];
            if (y.length < minimumStoryCountRequiredForTest) continue;
            try {
                var statResult = mannWhitneyU(x, y);
            } catch(err) {
                console.log('Error in Mann-Whitney U test for questions [' + scaleQuestion.displayName + ", " 
                    + firstChoiceQuestion.displayName + ", " + secondChoiceQuestion.displayName + "]: " + err);
                return {statsSummary: "None (error)", statsDetailed: []};
            }
            allResults[options[i] + " x " + options[j]] = {p: statResult.p, U: statResult.u, n1: statResult.n1, n2: statResult.n2};
            
            if (statResult.p <= pLowest) {
                pLowest = statResult.p;
                uLowest = statResult.u;
            }
        }
    }

    if (pLowest === Number.MAX_VALUE) {
        return {statsSummary: "None (at least one count in [" + allNs.join(", ") + "] below threshold)", statsDetailed: ["n"], n: n};
    }

    if (pLowest < 0.001) {
        var significance = " p<0.001" + " U=" + uLowest + " n=" + n;
    } else {
        var significance = " p=" + pLowest.toFixed(3) + " U=" + uLowest + " n=" + n;
    }
    return {statsSummary: significance, statsDetailed: ["p", "U", "n"], p: pLowest, U: uLowest, n: n, allResults: allResults};
}

export function calculateStatisticsForMultipleHistogram(scaleQuestion, choiceQuestion, stories: surveyCollection.Story[], minimumStoryCountRequiredForTest: number, unansweredText, includeNAValues): any {
    
    // Can't calculate a statistic if one or both are mutiple answer checkboxes
    if (choiceQuestion.displayType === "checkboxes") {
        return {statsSummary: "None (choices not mutually exclusive)", statsDetailed: []};
    }
    
    var values = collectValuesForOneScaleAndOneOrTwoChoices(stories, unansweredText, includeNAValues, scaleQuestion, choiceQuestion);
    var options = Object.keys(values);

    // For every pair, compute test, and take best p score
    var pLowest = Number.MAX_VALUE;
    var uLowest = NaN;
    var n = 0;
    var allNs = [];
    
    var allResults = {};
    
    for (var i = 0; i < options.length; i++) {
        var x = values[options[i]];
        allNs.push(x.length);
        if (x.length < minimumStoryCountRequiredForTest) continue;
        n += x.length;

        if (options.length === 1) {
            return {statsSummary: "None (too few options to compare)", statsDetailed: ["n"], n: n};
        }

        for (var j = i + 1; j < options.length; j++) {
            var y = values[options[j]];
            if (y.length < minimumStoryCountRequiredForTest) continue;
            try {
                var statResult = mannWhitneyU(x, y);
            } catch(err) {
                console.log('Error in Mann-Whitney U test for questions [' + scaleQuestion.displayName + ", " + choiceQuestion.displayName + "]: " + err);
                return {statsSummary: "None (error)", statsDetailed: []};
            }
            allResults[options[i] + " x " + options[j]] = {p: statResult.p, U: statResult.u, n1: statResult.n1, n2: statResult.n2};
            
            if (statResult.p <= pLowest) {
                pLowest = statResult.p;
                uLowest = statResult.u;
            }
        }
    }
    
    if (pLowest === Number.MAX_VALUE) {
        return {statsSummary: "None (at least one count in [" + allNs.join(", ") + "] below threshold)", statsDetailed: ["n"], n: n};
    }

    if (pLowest < 0.001) {
        var significance = " p<0.001" + " U=" + uLowest + " n=" + n;
    } else {
        var significance = " p=" + pLowest.toFixed(3) + " U=" + uLowest + " n=" + n;
    }
    return {statsSummary: significance, statsDetailed: ["p", "U", "n"], p: pLowest, U: uLowest, n: n, allResults: allResults};
}

export function calculateStatisticsForScatterPlot(ratioQuestion1, ratioQuestion2, choiceQuestion, option, stories: surveyCollection.Story[], 
        minimumStoryCountRequiredForTest: number, unansweredText, includeNAValues): any {
    // TODO: both continuous -- look for correlation with Pearson's R (if normal distribution) or Spearman's R / Kendall's Tau (if not normal distribution)"
    var data = collectValuesForTwoScalesAndMaybeOneChoiceOption(stories, ratioQuestion1.id, ratioQuestion2.id, choiceQuestion, option, unansweredText, includeNAValues);
    
    if (data.x.length < minimumStoryCountRequiredForTest) {
        return {statsSummary: "None (count of " + data.x.length + " below threshold)", statsDetailed: ["n", unansweredText], n: data.x.length, "No answer": data.unansweredCount};
    }
    
    // TODO: Add a flag somewhere to use Kendall's Tau instead of Pearson/Spearman's R
    // var statResult = kendallsTau(data.x, data.y);
    
    // TODO: Use Pearson's R instead of Spearman if normally distributed
    var r = jStat.spearmancoeff(data.x, data.y);
    // https://en.wikipedia.org/wiki/Spearman's_rank_correlation_coefficient#Determining_significance
    var n = data.x.length;
    var p;
    if (r >= 1) {
        // Perfectly correlated; handle sepearetly to avoid divide by zero error otherwise
        p = 0;
    } else {
        var t = r * Math.sqrt((n - 2.0) / (1.0 - r * r));
        p = jStat.ttest(t, n, 2);
    }
    if (p < 0.001) {
        var significance = " p<0.001" + " rho=" + r.toFixed(3) + " n=" + n;
    } else {
        var significance = " p=" + p.toFixed(3) + " rho=" + r.toFixed(3) + " n=" + n;
    }
    //  + " tt=" + statResult.test.toFixed(3) + " tz=" + statResult.z.toFixed(3) + " tp=" + statResult.prob.toFixed(3) ;
    return {statsSummary: significance, statsDetailed: ["p", "rho", "n", "No answer"], p: p, rho: r, n: n, "No answer": data.unansweredCount};
}

export function calculateStatisticsForMultipleScatterPlot(ratioQuestion1, ratioQuestion2, choiceQuestion, stories: surveyCollection.Story[], 
        minimumStoryCountRequiredForTest: number, unansweredText, includeNAValues): any {
    var options = [];
    var index;
    if (choiceQuestion.displayType !== "checkbox" && choiceQuestion.displayType !== "checkboxes") {
        if (includeNAValues) options.push(unansweredText);
    }
    if (choiceQuestion.displayType === "boolean" || choiceQuestion.displayType === "checkbox") {
        options.push("false");
        options.push("true");
    } else if (choiceQuestion.valueOptions) {
        for (index in choiceQuestion.valueOptions) {
            options.push(choiceQuestion.valueOptions[index]);
        }
    }
    var minSignificanceOptionStats = {statsSummary: "None", statsDetailed: []};
    var minSignificance = 1000;
    var maxSignificance = 0;
    for (index in options) {
        var option = options[index];
        var optionStats = calculateStatisticsForScatterPlot(ratioQuestion1, ratioQuestion2, choiceQuestion, option, stories, minimumStoryCountRequiredForTest, unansweredText, includeNAValues);
        if (optionStats.p && optionStats.p > maxSignificance) {
            maxSignificance = optionStats.p;
        }
        if (optionStats.p && optionStats.p < minSignificance) {
            minSignificance = optionStats.p;
            minSignificanceOptionStats = optionStats;
        }
    }
    var difference = maxSignificance - minSignificance;
    var differenceText = "";
    if (difference == -1000) { // no optionStats (probably because all graphs had too few items in them)
        differenceText = "(none)";
    } else {
        differenceText = "" + difference.toFixed(3);
    }
    minSignificanceOptionStats.statsSummary = "p range: " + differenceText + ", p lowest: [" + minSignificanceOptionStats.statsSummary.trim() + "]";
    return minSignificanceOptionStats;
}

export function calculateStatisticsForTable(nominalQuestion1, nominalQuestion2, stories: surveyCollection.Story[], minimumStoryCountRequiredForTest: number, unansweredText, includeNAValues): any {
    // both not continuous -- look for a 'correspondence' between counts using Chi-squared test
    // Can't calculate a statistic if one or both are mutiple answer checkboxes
    
    if (nominalQuestion1.displayType === "checkboxes" || nominalQuestion2.displayType === "checkboxes") {
        return {statsSummary: "None (choices not mutually exclusive)", statsDetailed: []};
    }
    
    var counts = collectValuesForTwoChoices(stories, nominalQuestion1, nominalQuestion2, unansweredText, includeNAValues);
    var observed = [];
    var expected = [];
    
    // Only calculate observed and expected considering the fields which pass threshold and are actually used
    
    var field1OptionsUsed = {};
    var field2OptionsUsed = {};
    var field1Option;
    var field2Option;
    var field1Total;
    var field2Total;
    var observedValue;
    
    for (field1Option in counts.field1Options) {
        field1Total = counts.field1Options[field1Option];
        if (field1Total < minimumStoryCountRequiredForTest) continue;
        field1OptionsUsed[field1Option] = 0;
    }
    
    for (field2Option in counts.field2Options) {
        field2Total = counts.field2Options[field2Option];
        if (field2Total < minimumStoryCountRequiredForTest) continue;
        field2OptionsUsed[field2Option] = 0;
    }

    var usedTotal = 0;
    for (field1Option in field1OptionsUsed) {
        field1Total = 0;
        for (field2Option in field2OptionsUsed) {
            observedValue = counts.counts[valueTag(field1Option, field2Option)] ||  0;
            field1Total += observedValue;
            usedTotal += observedValue;
        }
        field1OptionsUsed[field1Option] = field1Total;
    }
    
    for (field2Option in field2OptionsUsed) {
        field2Total = 0;
        for (field1Option in field1OptionsUsed) {
            observedValue = counts.counts[valueTag(field1Option, field2Option)] ||  0;
            field2Total += observedValue;
        }
        field2OptionsUsed[field2Option] = field2Total; 
    }    
    

    for (field1Option in field1OptionsUsed) {
        field1Total = field1OptionsUsed[field1Option];
        for (field2Option in field2OptionsUsed) {
            field2Total = field2OptionsUsed[field2Option];
            observedValue = counts.counts[valueTag(field1Option, field2Option)] ||  0;
            observed.push(observedValue);
            var expectedValue = field1Total * field2Total / usedTotal;
            expected.push(expectedValue);           
        }
    }
    
    var n1 = Object.keys(field1OptionsUsed).length;
    var n2 = Object.keys(field2OptionsUsed).length;
    
    if (n1 <= 1 || n2 <= 1) {
        return {statsSummary: "None (count below threshold)", statsDetailed: []};
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
        return {statsSummary: "None (zero in expected cell)", statsDetailed: []};
    }
    
    if (n1 <= 2 && n2 <= 2 && tooLowCount > 0) {
        return {statsSummary: "None (2X2 with expected cell < 5)", statsDetailed: []};
    }
    
    if (tooLowCount / observed.length > 0.2) {
        return {statsSummary: "None (less than 80% of expected cells >= 5)", statsDetailed: []};
    }

    try {
        var statResult = chiSquare.chiSquare(observed, expected, degreesOfFreedom);
    } catch(err) {
        var errorMessage = 'Error in chi-squared test for questions [' + nominalQuestion1.displayName + ", " + nominalQuestion2.displayName + "]: " + err + ". See console for details."
        console.log(errorMessage, n1, n2, statResult, observed, expected);
        // toaster.toast(errorMessage);
        return {statsSummary: "None (error)", statsDetailed: []};        
    }
    
    if (statResult.n !== n1 * n2) {
        var errorMessage = 'Error in chi-squared test for questions [' + nominalQuestion1.displayName + ", " + nominalQuestion2.displayName + "]: Unexpected n1 * n2. See console for details."
        console.log(errorMessage, n1, n2, statResult, observed, expected);
        // toaster.toast(errorMessage);
        return {statsSummary: "None (error)", statsDetailed: []};
        //throw new Error("unexpected n1 * n2");
    }
    
    if (statResult.n === degreesOfFreedom) {
        var errorMessage = 'Error in chi-squared test for questions [' + nominalQuestion1.displayName + ", " + nominalQuestion2.displayName + "]: Unexpected n. See console for details."
        console.log(errorMessage, n1, n2, statResult, observed, expected);
        // toaster.toast(errorMessage);
        return {statsSummary: "None (error)", statsDetailed: []};
        //throw new Error("unexpected statResult.n");
    }
    
    if (statResult.p < 0.001) {
        var significance = " p<0.001" + " x2=" + statResult.x2.toFixed(3) + " k=" + statResult.k + " n=" + statResult.n;
    } else {
        var significance = " p=" + statResult.p.toFixed(3) + " x2=" + statResult.x2.toFixed(3) + " k=" + statResult.k + " n=" + statResult.n;
    }
    return {statsSummary: significance, statsDetailed: ["p", "x2", "k", "n"], p: statResult.p, x2: statResult.x2, k: statResult.k, n: statResult.n};
}
