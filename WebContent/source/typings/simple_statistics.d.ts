// Stub simple_statistics module by Paul Fernhout
declare module simple_statistics {
    export function chi_squared_goodness_of_fit(values: any, distribution: any, threshold: any);
    export var poisson_distribution: any;
}

declare module 'simple_statistics' {
    export = simple_statistics;
}