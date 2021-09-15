import jStat = require("jstat");

"use strict";

// Calculates Kendall's tau, a correlation measure for ordinal data, and an associated p-value.
// Returns: Kendall's tau, two-tailed p-value
// Derived from older SciPy: http://web.mit.edu/6.863/spring2011/packages/scipy_src/scipy/stats/stats.py
function kendallsTau(x: number[], y: number[]) {
    let n1 = 0;
    let n2 = 0;
    let iss = 0;
    for (let j = 0; j < x.length - 1; j++) {
        for (let k = j + 1; k < y.length; k++) {
            const a1 = x[j] - x[k];
            const a2 = y[j] - y[k];
            const aa = a1 * a2;
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
    const tau = iss / Math.sqrt(n1 * n2);
    const svar = (4.0 * x.length + 10.0) / (9.0 * x.length * (x.length - 1));
    const z = tau / Math.sqrt(svar);
    const prob = jStat.erfc(Math.abs(z) / 1.4142136);
    return {test: tau, z: z, prob: prob};
}

export = kendallsTau;
