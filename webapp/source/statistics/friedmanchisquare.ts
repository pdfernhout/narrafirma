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
    
    let i;
    const numTableRows = table.length;
    
    if (numTableRows < 3) {
        throw new Error("ValueError: Less than 3 levels. Friedman Chi-square test not appropriate.");
    }
    
    const n = table[0].length;
    for (i = 1; i < numTableRows; i++) {
        if (table[i].length !== n) {
            throw new Error("ValueError: Unequal N in Friedman Chi-square test. Aborting.");
        }
    }
    if (n < 10 && numTableRows < 6) {
        console.log('Warning: Friedman Chi-square test is using Chi-squared aproximation.');
    }

    // Rank data
    const data = table;
    
    for (let i = 0; i < data.length; i++) {
        data[i] = statisticsCommon.rankdata(data[i]);
    }
    
    // Handle ties
    let ties = 0;
    for (let i = 0; i < data.length; i++) {
        const repnum = statisticsCommon.repeatCounts(data[i]);
        for (let y = 0; y <  repnum.length; y++) {
            const t = repnum[y];
            ties += t * (t * t - 1);
        }
    }
    
    const c = 1 - ties / (numTableRows * (numTableRows * numTableRows - 1) * n);

    // TODO: SciPy was doing a second sum on result which would remove arrays -- is this needed?
    // const ssbn = pysum(pysum(data)**2);
    const sum = jStat.sum(data);
    const ssbn = sum * sum;
    
    const chiSquared = ( 12.0 / (numTableRows * n * (numTableRows + 1)) * ssbn - 3 * n * (numTableRows + 1) ) / c;
    
    return {chisq: chiSquared, p: jStat.chisquare.cdf(chiSquared, numTableRows - 1)};
}

export = friedmanchisquare