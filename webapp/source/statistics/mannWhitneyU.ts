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
    const n1 = x.length;
    const n2 = y.length;
    
    const allValues = x.concat(y);
    const ranked = statisticsCommon.rankdata(allValues);
    
    // get the x-ranks
    const rankx = ranked.slice(0, n1);    
    
    // the rest are y-ranks
    const ranky = ranked.slice(n1);
    
    // calc U for x
    const u1 = n1 * n2 + (n1 * (n1 + 1)) / 2.0 - jStat.sum(rankx);
    
    // remainder is U for y
    const u2 = n1 * n2 - u1;
    
    const bigu = Math.max(u1, u2);
    const smallu = Math.min(u1, u2);
    
    // correction factor for tied scores
    // was: const T = Math.sqrt(tiecorrect(ranked));
    // Note: in the scipy commit of Mar 26, 2009 (https://github.com/scipy/scipy/commit/e40b50ef1600c25d1a31005a71b9c148271aa8e5)
    // the sqrt was removed. The commit says "correct tiecorrection" but does not say WHY the correction was made.
    // In this mailing list post (https://mail.python.org/pipermail/scipy-user/2009-February/019766.html), it says:
    // ------------------------------------------------------------------------
    // I think there is a mistake in the tie handling of stats.mannwhitneyu
    // In the calculation of the standard error the sqrt is taken twice.
    // 
    //     T = np.sqrt(tiecorrect(ranked))  # correction factor for tied scores
    //     if T == 0:
    //         raise ValueError, 'All numbers are identical in amannwhitneyu'
    //     sd = np.sqrt(T*n1*n2*(n1+n2+1)/12.0)
    // 
    // I don't have the formulas for the tie correction, but from looking at the tie correction
    // in Sturlas version of ranksums, it seems that the first sqrt shouldn't be there.
    // ------------------------------------------------------------------------
    // The post is signed by "Josef," which is the same name as the person who made the commit (probably Josef Perktold).
    // The correction does seem to fit the calculations on the Wikipedia page:
    // https://en.wikipedia.org/wiki/Mann%E2%80%93Whitney_U_test#Normal_approximation_and_tie_correction
    const T = tiecorrect(ranked);
    
    if (T === 0) {
        throw new Error("Mann-Whitney U test: All numbers are identical.");
    }

    const sd = Math.sqrt(T * n1 * n2 * (n1 + n2 + 1) / 12.0);

    // Note: scipy has a "use_continuity" argument for the continuity correction of 0.5 in the calculation of z
    // I think that because NF often deals with small sample sizes, 
    // and because it has pseudo-continuous data (scale markings are integers, and they are not measurements),
    // it is best to apply the correction in all cases rather than ask the user what they want to do for each test.
    // However, let us keep the option (set to a constant) in case we want to offer it to users later.
    const use_continuity = true;
    let z;
    if (use_continuity) {
        // normal approximation for prob calc with continuity correction
        z = Math.abs((bigu - 0.5 - n1 * n2 / 2.0) / sd);
    } else {
        // normal approximation for prob calc without continuity correction
        z = Math.abs((bigu - n1 * n2 / 2.0) / sd);
    }

    const p = 1.0 - jStat.normal.cdf(z, 0, 1);

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
    
    const sorted = rankvals.slice().sort(function(a, b) {
        return a - b;
    });
    
    const n = sorted.length;
    let T = 0.0;
    let i = 0;
    while (i < n - 1) {
        if (sorted[i] === sorted[i + 1]) {
            let nties = 1;
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
    const result1 = mannWhitneyU([1, 2, 3], [1, 2, 4]);
    console.log("result1", result1);
    // Result { u: 4, p: 0.5 }
    
    // Values from: http://www.stat.purdue.edu/~tqin/system101/method/method_wilcoxon_rank_sum_sas.htm
    const result2 = mannWhitneyU([17, 20, 170, 315, 22, 190, 64], [22, 29, 13, 16, 15, 18, 15, 6]);
    console.log("result2", result2);
    // Result { u: 6.5, p: 0.007453528422421307 }
    
    // Values from: http://geographyfieldwork.com/Mann%20Whitney.htm
    const result3 = mannWhitneyU([7, 3, 6, 2, 4, 3, 5, 5], [3, 5, 6, 4, 6, 5, 7, 5]);
    console.log("result3", result3);
    // result3 { u: 23, p: 0.18060905238025948 }
    
    // Useful for comparing, but off a bit for p: http://www.socscistatistics.com/tests/mannwhitney/default2.aspx
}

// test();

export = mannWhitneyU;
