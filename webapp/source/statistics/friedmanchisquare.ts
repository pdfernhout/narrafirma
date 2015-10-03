import kludgeForUseStrict = require("../kludgeForUseStrict");
"use strict";

// Library for statistics, imported by narrafirma.html
declare var jStat;

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
    var data = apply(_support.abut, args);
    data = data.astype(float);
    for (i = 0; i < data.length; i++) {
        data[i] = rankdata(data[i]);
    }
    
    // Handle ties
    var ties = 0;
    for (i = 0; i < data.length; i++) {
        var repnum = repeatCounts(data[i]);
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

function repeatCounts(array) {
    var values = {};
    
    for (var i = 0; i < array.length; i++) {
        var value = array[i];
        if (values[value] !== undefined) {
            values[value] += 1;
        } else {
            values[value] = 1;
        }
    }
    
    var result = [];
    for (var key in values) {
        var count = values[key];
        if (count > 1) result.push(count);
    }
    return result;
}

def rankdata(a):
    """Ranks the data in a, dealing with ties appropriately.

    Equal values are assigned a rank that is the average of the ranks that
    would have been otherwise assigned to all of the values within that set.
    Ranks begin at 1, not 0.

    Example
    -------
    In [15]: stats.rankdata([0, 2, 2, 3])
    Out[15]: array([ 1. ,  2.5,  2.5,  4. ])

    Parameters
    ----------
    a : array
        This array is first flattened.

    Returns
    -------
    An array of length equal to the size of a, containing rank scores.
    """
    a = np.ravel(a)
    n = len(a)
    svec, ivec = fastsort(a)
    sumranks = 0
    dupcount = 0
    newarray = np.zeros(n, float)
    for i in xrange(n):
        sumranks += i
        dupcount += 1
        if i==n-1 or svec[i] != svec[i+1]:
            averank = sumranks / float(dupcount) + 1
            for j in xrange(i-dupcount+1,i+1):
                newarray[ivec[j]] = averank
            sumranks = 0
            dupcount = 0
    return newarray


export = friedmanchisquare