import jStat = require("jstat");

"use strict";

// Calculates Kendall's tau, a correlation measure for ordinal data, and an associated p-value.
// Returns: Kendall's tau, two-tailed p-value
// Derived from older SciPy: http://web.mit.edu/6.863/spring2011/packages/scipy_src/scipy/stats/stats.py
function kendallsTau(x: number[], y: number[]) {
    var n1 = 0;
    var n2 = 0;
    var iss = 0;
    for (var j = 0; j < x.length - 1; j++) {
        for (var k = j + 1; k < y.length; k++) {
            var a1 = x[j] - x[k];
            var a2 = y[j] - y[k];
            var aa = a1 * a2;
            if (aa) {
                // neither array has a tie
                n1 = n1 + 1;
                n2 = n2 + 1;
                if (aa > 0) {
                    iss = iss + 1;
                } else {
                    iss = iss - 1;
                }
            } else {
                if (a1) {
                    n1 = n1 + 1;
                }
                if (a2) {
                    n2 = n2 + 1;
                }
           }
       }
    }
    var tau = iss / Math.sqrt(n1 * n2);
    var svar = (4.0 * x.length + 10.0) / (9.0 * x.length * (x.length - 1));
    var z = tau / Math.sqrt(svar);
    var prob = jStat.erfc(Math.abs(z) / 1.4142136);
    return {test: tau, z: z, prob: prob};
}

export = kendallsTau;
