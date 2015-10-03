import statisticsCommon = require("./statisticsCommon");
"use strict";

// Library for statistics, imported by narrafirma.html
declare var jStat;

// Calculates Mann-Whitney U test
// Derived from older SciPy: http://web.mit.edu/6.863/spring2011/packages/scipy_src/scipy/stats/stats.py
// Calculates a Mann-Whitney U statistic on the provided scores and returns the result.
// Use only when the n in each condition is < 20 and you have 2 independent samples of ranks.
// REMEMBER: Mann-Whitney U is significant if the u-obtained is LESS THAN or equal to the critical value of U.
// Returns: u-statistic, one-tailed p-value (i.e., p(z(U)))
function mannWhitneyU(x: number[], y: number[]) {
    var n1 = x.length;
    var n2 = y.length;
    
    var ranked = statisticsCommon.rankdata(x.concat(y));
    
    // get the x-ranks
    var rankx = ranked.slice(0, n1);    
    
    // the rest are y-ranks
    var ranky = ranked.slice(n1);
    
    // calc U for x
    var u1 = n1 * n2 + (n1 * (n1 + 1)) / 2.0 - jStat.sum(rankx);
    
    // remainder is U for y
    var u2 = n1 * n2 - u1;
    
    var bigu = Math.max(u1, u2);
    var smallu = Math.min(u1, u2);
    
    // correction factor for tied scores
    var T = Math.sqrt(tiecorrect(ranked));
    if (T === 0) {
        throw new Error("ValueError: All numbers are identical in mannWhitneyU");
    }
    var sd = Math.sqrt(T * n1 * n2 * (n1 + n2 + 1) / 12.0);
    
    // normal approximation for prob calc
    var z = Math.abs((bigu - n1 * n2 / 2.0) / sd);
    
    // TODO: Is the call to jStat.ztest correct, and should it be 1 or 2 sides?
    return {u: smallu, p: 1.0 - jStat.ztest(z, 1)};
}

function tiecorrect(rankvals: number[]): number {
    /*
    Tie-corrector for ties in Mann Whitney U and Kruskal Wallis H tests.
    See Siegel, S. (1956) Nonparametric Statistics for the Behavioral
    Sciences.  New York: McGraw-Hill.  Code adapted from |Stat rankind.c
    code.

    Returns: T correction factor for U or H
    */
    
    var sorted = rankvals.slice().sort();
    
    var n = sorted.length;
    var T = 0.0;
    var i = 0;
    while (i < n - 1) {
        if (sorted[i] === sorted[i + 1]) {
            var nties = 1;
            while ((i < n - 1) && (sorted[i] === sorted[i + 1])) {
                nties = nties + 1;
                i = i + 1;
            }
            T = T + nties * nties * nties - nties;
        i = i + 1;
        }
    }
    T = T / (n * n * n - n);
    return 1.0 - T;
}

export = mannWhitneyU;