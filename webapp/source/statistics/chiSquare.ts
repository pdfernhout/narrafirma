import jStat = require("jstat");

"use strict";

// Derived from: https://en.wikipedia.org/wiki/Pearson's_chi-squared_test

export function chiSquare(observed: number[], expected: number[], degreesOfFreedom: number = undefined) {
    if (observed.length !== expected.length) {
        throw new Error("chiSquare: observed.length !== expected.length");
    }
    
    if (!degreesOfFreedom) degreesOfFreedom = observed.length - 1; 
    
    if (degreesOfFreedom >= observed.length) {
        throw new Error("chiSquare: degreesOfFreedom is too large for length: " + degreesOfFreedom + " " + observed.length);
    } 
    
    let x2 = 0;
    let observedTotal = 0;
    let expectedTotal = 0;
    
    for (let i = 0; i < observed.length; i++) {
        x2 += Math.pow(observed[i] - expected[i], 2) / expected[i];
        observedTotal += observed[i];
        expectedTotal += expected[i];
    }
    
    if (observedTotal !== Math.round(expectedTotal)) {
        console.log("Error chiSquare observedTotal", observedTotal, "expectedTotal", expectedTotal, "observed", observed, "expected", expected);
        throw new Error("chiSquare: observedTotal !== expectedTotal");
    }
    
    // const p = 1 - jStat.lowRegGamma(degreesOfFreedom / 2, x2 / 2) / jStat.gammafn(degreesOfFreedom / 2);
    const p = 1 - jStat.chisquare.cdf(x2, degreesOfFreedom);
    
    const result = {x2: x2, p: p, k: degreesOfFreedom, n: observed.length};
    return result;
}

// Data from Apache Commons Math ChiSquareTestTest.java

function test() {
    const observed = [10, 9, 11];
    const expected = [10, 10, 10];
    // expected x2 = 0.2
    // expected p = 0.904837418036
    console.log("chiSquare", chiSquare(observed, expected));
    // was { x2: 0.2, p: 0.9048374180359595 }
    
    // The original test data seems buggy!!! Missing 90 somewhere in expected
    const observed1 = [ 500, 623, 72, 70, 31 ];
    const expected1 = [ 485, 541, 82, 61, 37 ];
    // Expected x2 = 9.023307936427388
    // Expected p = 0.06051952647453607
    // was // { x2: 16.413107036160778, p: 0.002512095663000702 }
    
    // Data from Wikipedia
    const observed2 = [ 5, 8, 9, 8, 10, 20 ];
    const expected2 = [ 10, 10, 10, 10, 10, 10 ];
    // Expect x2 = 13.4
    // Expected p = ???
    console.log("chiSquare", chiSquare(observed2, expected2));
    // Was  { x2: 13.4, p: 0.019905220334774376 }
}

// test();