export function repeatCounts(array) {
    const values = {};
    
    for (let i = 0; i < array.length; i++) {
        const value = array[i];
        if (values[value] !== undefined) {
            values[value] += 1;
        } else {
            values[value] = 1;
        }
    }
    
    const result = [];
    for (let index in values) {
        const count = values[index];
        if (count > 1) result.push(count);
    }
    return result;
}

export function rankdata(a: number[]) {
    /*
    Ranks the data in a, dealing with ties appropriately.

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

    Returns
    -------
    An array of length equal to the size of a, containing rank scores.
   
    */
    const n = a.length;
    
    let i;
    let j;
    
    const sortedArray = [];
    for (let i = 0; i < n; i++) {
        sortedArray.push({originalPosition: i, value: a[i]});
    }
    
    sortedArray.sort(function(a, b) { return a.value - b.value; });
    
    const newarray = newFilledArray(n);
    
    let sumranks = 0;
    let dupcount = 0;
    
    for (let i = 0; i < n; i++) {
        sumranks += i;
        dupcount += 1;
        if (i === n - 1 || sortedArray[i].value !== sortedArray[i + 1].value) {
            const averank = sumranks / dupcount + 1;
            for (j = i - dupcount + 1; j < i + 1; j++) {
                newarray[sortedArray[j].originalPosition] = averank;
            }
            sumranks = 0;
            dupcount = 0;
        }
    }
    return newarray;
}

function rankdata_test() {
    const result = rankdata([0, 2, 2, 3]);
    console.log("rankdata self-test", result);
    // Should be: [ 1, 2.5, 2.5, 4 ]
}

// rankdata_test();

export function newFilledArray(length: number, val: number = 0): number[] {
    const array = [];
    for (let i = 0; i < length; i++) {
        array[i] = val;
    }
    return array;
}
