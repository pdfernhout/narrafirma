import jStat = require("jstat");
import statisticsCommon = require("./statisticsCommon");

"use strict";

// Calculates Mann-Whitney U test
// Derived from older SciPy: http://web.mit.edu/6.863/spring2011/packages/scipy_src/scipy/stats/stats.py
// Calculates a Mann-Whitney U statistic on the provided scores and returns the result.
// Use only when the n in each condition is < 20 and you have 2 independent samples of ranks.
// REMEMBER: Mann-Whitney U is significant if the u-obtained is LESS THAN or equal to the critical value of U.
// Returns: u-statistic, one-tailed p-value (i.e., p(z(U)))
function mannWhitneyU(x: number[], y: number[]) {
    var n1 = x.length;
    var n2 = y.length;
    
    var allValues = x.concat(y);
    // console.log("mannWhitneyU allValues", allValues);
    
    var ranked = statisticsCommon.rankdata(allValues);
    // console.log("mannWhitneyU ranked", ranked);
    
    // get the x-ranks
    var rankx = ranked.slice(0, n1);    
    
    // the rest are y-ranks
    var ranky = ranked.slice(n1);
    
    // console.log("mannWhitneyU rankx, ranky", rankx, ranky);
    
    // calc U for x
    var u1 = n1 * n2 + (n1 * (n1 + 1)) / 2.0 - jStat.sum(rankx);
    
    // remainder is U for y
    var u2 = n1 * n2 - u1;
    
    var bigu = Math.max(u1, u2);
    var smallu = Math.min(u1, u2);
    
    // console.log("mannWhitneyU bigu smallu", bigu, smallu);
    
    // correction factor for tied scores
    var T = Math.sqrt(tiecorrect(ranked));
    if (T === 0) {
        throw new Error("ValueError: All numbers are identical in mannWhitneyU");
    }
    // console.log("mannWhitneyU T tiecorrect", T);
    
    var sd = Math.sqrt(T * n1 * n2 * (n1 + n2 + 1) / 12.0);
    // console.log("mannWhitneyU sd", sd);
    
    // normal approximation for prob calc
    var z = Math.abs((bigu - n1 * n2 / 2.0) / sd);
    // console.log("mannWhitneyU z", z);
    
    var p = 1.0 - jStat.normal.cdf(z, 0, 1);
    // console.log("mannWhitneyU p", p);
    
    return {p: p, u: smallu, n1: n1, n2: n2};
}

function tiecorrect(rankvals: number[]): number {
    /*
    Tie-corrector for ties in Mann Whitney U and Kruskal Wallis H tests.
    See Siegel, S. (1956) Nonparametric Statistics for the Behavioral
    Sciences.  New York: McGraw-Hill.  Code adapted from |Stat rankind.c
    code.

    Returns: T correction factor for U or H
    */
    
    var sorted = rankvals.slice().sort(function(a, b) {
        return a - b;
    });
    
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
        }
        i = i + 1;
    }
    T = T / (n * n * n - n);
    return 1.0 - T;
}

function test() {
    console.log("mannWhitneyU self diagnostic");
    var result1 = mannWhitneyU([1, 2, 3], [1, 2, 4]);
    console.log("result1", result1);
    // Result { u: 4, p: 0.4123703981236436 }
    
    // Values from: http://www.stat.purdue.edu/~tqin/system101/method/method_wilcoxon_rank_sum_sas.htm
    var result2 = mannWhitneyU([17, 20, 170, 315, 22, 190, 64], [22, 29, 13, 16, 15, 18, 15, 6]);
    console.log("result2", result2);
    // Result { u: 6.5, p: 0.006380543605407185 }
    
    // Values from: http://geographyfieldwork.com/Mann%20Whitney.htm
    var result3 = mannWhitneyU([7, 3, 6, 2, 4, 3, 5, 5], [3, 5, 6, 4, 6, 5, 7, 5]);
    console.log("result3", result3);
    // result3 { u: 23, p: 0.16955853681823607 }
    
    // Useful for comparing, but off a bit for p: http://www.socscistatistics.com/tests/mannwhitney/default2.aspx
}

// test();

export = mannWhitneyU;