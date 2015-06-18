import kludgeForUseStrict = require("../kludgeForUseStrict");
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
    
    var ranked = rankdata(x.concat(y));
    
    // get the x-ranks
    var rankx = ranked.slice(0, n1);    
    
    // the rest are y-ranks
    var ranky = ranked.slice(n1);
    
    // calc U for x
    var u1 = n1 * n2 + (n1 * (n1 + 1)) / 2.0 - sum(rankx);
    
    // remainder is U for y
    var u2 = n1 * n2 - u1;
    
    var bigu = Math.max(u1, u2);
    var smallu = Math.min(u1, u2);
    
    // correction factor for tied scores
    var T = Math.sqrt(tiecorrect(ranked));
    if (T === 0) {
        throw new Error("ValueError: All numbers are identical in amannwhitneyu");
    }
    var sd = Math.sqrt(T * n1 * n2 * (n1 + n2 + 1) / 12.0);
    
    // normal approximation for prob calc
    var z = Math.abs((bigu - n1 * n2 / 2.0) / sd);
    
    return {u: smallu, p: 1.0 - zprob(z)};
}

function sum(values: number[]): number {
    return values.reduce(function(a, b) {return a + b;});
}

//    Ranks the data in a, dealing with ties appropriately.
//
//    Equal values are assigned a rank that is the average of the ranks that
//    would have been otherwise assigned to all of the values within that set.
//    Ranks begin at 1, not 0.
//
//    Example
//    -------
//    In [15]: stats.rankdata([0, 2, 2, 3])
//    Out[15]: array([ 1. ,  2.5,  2.5,  4. ])
//
//    Parameters
//    ----------
//    a : array
//        This array is first flattened.
//
//    Returns
//    -------
//    An array of length equal to the size of a, containing rank scores.
function rankdata(a: number[]): number[] {
    a = ravel(a);
    var n = a.length;
    var svec = [];
    var ivec = [];
    // TODO: svec, ivec = fastsort(a);
    var sumranks = 0;
    var dupcount = 0;
    var newarray = newFilledArray(n, 0);
    for (var i = 0; i < n; i++) {
        sumranks += i;
        dupcount += 1;
        if (i === n-1 || svec[i] !== svec[i + 1]) {
            var averank = sumranks / dupcount + 1;
            for (var j = i - dupcount + 1; j < i + 1; j++) {
                newarray[ivec[j]] = averank;
            }
            sumranks = 0;
            dupcount = 0;
        }
    }
    return newarray;
}

function newFilledArray(length: number, val: number): number[] {
    var array = [];
    for (var i = 0; i < length; i++) {
        array[i] = val;
    }
    return array;
}

// Flattens an array
function ravel(values: number[]): number[] {
    return [].concat.apply([], values);
}

function tiecorrect(values: number[]): number {
    // TODO
    return 0;
}

function zprob(d: number): number {
    // TODO
    return 0;
}

export = mannWhitneyU;