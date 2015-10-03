import kludgeForUseStrict = require("../kludgeForUseStrict");
"use strict";

// Library for statistics, imported by narrafirma.html
declare var jStat;

// Calculates Kendall's tau, a correlation measure for ordinal data, and an associated p-value.
// Returns: Kendall's tau, two-tailed p-value
// Derived from older SciPy: http://web.mit.edu/6.863/spring2011/packages/scipy_src/scipy/stats/stats.py

def friedmanchisquare(*args):
    """Friedman Chi-Square is a non-parametric, one-way within-subjects
    ANOVA.  This function calculates the Friedman Chi-square test for
    repeated measures and returns the result, along with the associated
    probability value.

    This function uses Chisquared aproximation of Friedman Chisquared
    distribution. This is exact only if n > 10 and factor levels > 6.

    Returns: friedman chi-square statistic, associated p-valueIt assumes 3 or more repeated measures.  Only 3
    """
    k = len(args)
    if k < 3:
        raise ValueError, '\nLess than 3 levels.  Friedman test not appropriate.\n'
    n = len(args[0])
    for i in range(1,k):
        if len(args[i]) <> n:
            raise ValueError, 'Unequal N in friedmanchisquare.  Aborting.'
    if n < 10 and k < 6:
        print 'Warning: friedmanchisquare test using Chisquared aproximation'

    # Rank data
    data = apply(_support.abut,args)
    data = data.astype(float)
    for i in range(len(data)):
        data[i] = rankdata(data[i])

    # Handle ties
    ties = 0
    for i in range(len(data)):
        replist, repnum = find_repeats(array(data[i]))
        for t in repnum:
            ties += t*(t*t-1)
    c = 1 - ties / float(k*(k*k-1)*n)

    ssbn = pysum(pysum(data)**2)
    chisq = ( 12.0 / (k*n*(k+1)) * ssbn - 3*n*(k+1) ) / c
    return chisq, chisqprob(chisq,k-1)

export = friedmanchisquare