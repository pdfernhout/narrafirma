import jStat = require("jstat");
import statisticsCommon = require("./statisticsCommon");

"use strict";

// Calculates Kendall's tau, a correlation measure for ordinal data, and an associated p-value.
// Returns: Kendall's tau, two-tailed p-value
// Derived from older SciPy: http://web.mit.edu/6.863/spring2011/packages/scipy_src/scipy/stats/stats.py

function friedmanchisquare(table: number[][]) {
    /*
    Friedman Chi-Square is a non-parametric, one-way within-subjects
    ANOVA.  This function calculates the Friedman Chi-square test for
    repeated measures and returns the result, along with the associated
    probability value.

    This function uses Chisquared aproximation of Friedman Chisquared
    distribution. This is exact only if n > 10 and factor levels > 6.

    Returns: friedman chi-square statistic, associated p-value 
    It assumes 3 or more repeated measures.  Only 3
    */
    
    var i;
    var k = table.length;
    
    if (k < 3) {
        throw new Error("ValueError: Less than 3 levels. Friedman test not appropriate.");
    }
    
    var n = table[0].length;
    for (i = 1; i < k; i++) {
        if (table[i].length !== n) {
            throw new Error("ValueError: Unequal N in friedmanchisquare. Aborting.");
        }
    }
    if (n < 10 && k < 6) {
        console.log('Warning: friedmanchisquare test using Chisquared aproximation');
    }

    // Rank data
    var data = table;
    
    for (i = 0; i < data.length; i++) {
        data[i] = statisticsCommon.rankdata(data[i]);
    }
    
    // Handle ties
    var ties = 0;
    for (i = 0; i < data.length; i++) {
        var repnum = statisticsCommon.repeatCounts(data[i]);
        for (var y = 0; y <  repnum.length; y++) {
            var t = repnum[y];
            ties += t * (t * t - 1);
        }
    }
    
    var c = 1 - ties / (k * (k * k - 1) * n);

    // TODO: SciPy was doing a second sum on result which would remove arrays -- is this needed?
    // var ssbn = pysum(pysum(data)**2);
    var sum = jStat.sum(data);
    var ssbn = sum * sum;
    
    var chisq = ( 12.0 / (k * n * (k + 1)) * ssbn - 3 * n * (k + 1) ) / c;
    
    return {chisq: chisq, p: jStat.chisquare.cdf(chisq, k - 1)};
}

export = friedmanchisquare