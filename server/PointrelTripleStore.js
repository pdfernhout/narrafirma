/*jslint node: true */
"use strict";

function TripleStore() {
    this.documents = {};
    //this.a = {}
    //this.b = {};
    //this.c = {};
    this.ab = {};
    this.bc = {};
    this.ac = {};
}

TripleStore.standardDocumentTagRelationship = "{http://pointrel.org/pointrel20141201}document_tag";

function getTripleListFromMap(map, key) {
    // TODO: In practice, current users could be adapted to react to a null and not need to allocated empty list
    var list = map[key];
    if (!list) return [];
    return list;
}

function addTripleToMap(map, key, triple) {
    // console.log("------------------------------------------ addTripleToMap key", key);
    // console.log("addTripleToMap triple", triple);
    // console.log("addTripleToMap map before", map);
    if (!triple) console.log("addTripleToMap problem triple", key, triple, map);
    var list = map[key];
    if (!list) {
        list = [];
        map[key] = list;
    }
    // console.log("addTripleToMap list before", list);
    list.push(triple);
    
    // Keep items sorted in ascending timestamp order
    list.sort(function(tripleA, tripleB) {
        var difference = tripleA.timestamp - tripleB.timestamp;
        if (difference) return difference;
        // TODO: Could sort on other triple fields to be consistent?
        return 0; 
    });
    // console.log("after list", list);
    // console.log("after map", map);
}

TripleStore.prototype.addTriple = function(documentTriple, documentID, documentTimestamp) {
    var timestamp = documentTriple.timestamp;
    if (!timestamp) timestamp = documentTimestamp;
    
    // Assure timestamp is a number...
    if (isNaN(timestamp)) timestamp = 0;
    
    var a = documentTriple.a;
    var b = documentTriple.b;
    var c = documentTriple.c;
    
    // TODO: what about UUID for documentTriple?
    var tripleToStore = {a: a, b: b, c: c, timestamp: timestamp, documentID: documentID};

    var abKey = JSON.stringify([a, b, null]);
    addTripleToMap(this.ab, abKey, tripleToStore);
    
    var acKey = JSON.stringify([a, null, c]);
    addTripleToMap(this.ac, acKey, tripleToStore);
    
    var bcKey = JSON.stringify([null, b, c]);
    addTripleToMap(this.bc, bcKey, tripleToStore);
    
    return tripleToStore;
};
    
function removeTripleFromMap(map, key, storedTripleToRemove) {
    // console.log("----------- removeTripleFromMap", key, "\n", storedTripleToRemove, "\n", map);
    var list = map[key];
    if (!list) {
        console.log("ERROR: Unexpectedly missing map entries for triple", key, "\n", storedTripleToRemove, "\n", map);
        return;
    }
    
    // This loop assumes it will return immediately after any change to the array, otherwise length might change during run
    for (var i = 0; i < list.length; i++) {
        if (list[i] === storedTripleToRemove) {
            // remove that element; splice updates the original array
            list.splice(i, 1);
            // console.log("List after change: ", list);
            if (list.length === 0) delete map[key];
            return;
        }
    }
    
    console.log("ERROR: Could not find triple to delete in map list", key, "\ntriple:", storedTripleToRemove, "\nlist:", list, "\nmap:", map);
}

TripleStore.prototype.removeTriple = function(storedTriple) {
    // console.log("============== removeTriple", storedTriple);
    // TODO: Could check based on a Triple UUID?
    var a = storedTriple.a;
    var b = storedTriple.b;
    var c = storedTriple.c;
    
    var abKey = JSON.stringify([a, b, null]);
    removeTripleFromMap(this.ab, abKey, storedTriple);
    
    var bcKey = JSON.stringify([null, b, c]);
    removeTripleFromMap(this.bc, bcKey, storedTriple);
    
    var acKey = JSON.stringify([a, null, c]);
    removeTripleFromMap(this.ac, acKey, storedTriple);
};

// Public API
TripleStore.prototype.addOrRemoveTriplesForDocument = function(document, sha256AndLength) {
    // remove previous document
    var oldDocumentInformation = this.documents[document.id];
    if (oldDocumentInformation) {
        if (oldDocumentInformation.timestamp > document.timestamp) {
            console.log("already indexed document is older than version being added", oldDocumentInformation, document);
            return;
        }
        var oldTriples = oldDocumentInformation.triples;
        for (var oldTripleIndex = 0; oldTripleIndex < oldTriples.length; oldTripleIndex++) {
            var oldTriple = oldTriples[oldTripleIndex];
            this.removeTriple(oldTriple);
        }
    }
    
    var documentTriples = document.triples;
    var newTriples = [];
    
    if (documentTriples) {
        for (var newTripleIndex = 0; newTripleIndex < documentTriples.length; newTripleIndex++) {
            var documentTriple = documentTriples[newTripleIndex];
            var tripleToStore = this.addTriple(documentTriple, document.id, document.timestamp);
            newTriples.push(tripleToStore);
        }
    }
    
    // TODO: Legacy support for previous approach to tags and previously saved documents -- remove this eventually
    if (!document.__envelopeVersion && document.tags) {
        for (var i = 0; i < document.tags.length; i++) {
            var tag = document.tags[i];
            if (!tag) continue;
            var tagTriple = ({a: document.id, b: TripleStore.standardDocumentTagRelationship, c: tag});
            var tagTripleToStore = this.addTriple(tagTriple, document.id, document.timestamp);
            newTriples.push(tagTripleToStore);
        }
    }
    // TODO: End of legacy support above
    
    if (newTriples.length) {
        this.documents[document.id] = {documentID: document.id, documentTimestamp: document.timestamp, sha256AndLength: sha256AndLength, triples: newTriples};
    } else if (oldDocumentInformation) {
        delete this.documents[document.id];
    }
};

// Public API
TripleStore.prototype.findAllCForAB = function(a, b) {
    var abKey = JSON.stringify([a, b, null]);
    var triples = getTripleListFromMap(this.ab, abKey);
    var result = [];
    for (var i = 0; i < triples.length; i++) {
        // TODO: Eliminate duplicates and/or sort using dictionary?
        result.push(triples[i].c);
    }
    return result;
};

// Public API
TripleStore.prototype.findAllBForAC = function(a, c) {
    var acKey = JSON.stringify([a, null, c]);
    var triples = getTripleListFromMap(this.ac, acKey);
    var result = [];
    for (var i = 0; i < triples.length; i++) {
        // TODO: Eliminate duplicates and/or sort using dictionary?
        result.push(triples[i].b);
    }
    return result;
};

// Public API
TripleStore.prototype.findAllAForBC = function(b, c) {
    var bcKey = JSON.stringify([null, b, c]);
    var triples = getTripleListFromMap(this.bc, bcKey);
    // console.log("findAllAForBC", b, c, "triples", triples, triples.length);
    var result = [];
    for (var i = 0; i < triples.length; i++) {
        // TODO: Eliminate duplicates and/or sort using dictionary?
        // console.log("triple, i", triples[i], i);
        result.push(triples[i].a);
    }
    return result;
};

// Public API
TripleStore.prototype.findLatestCForAB = function(a, b) {
    var abKey = JSON.stringify([a, b, null]);
    var triples = getTripleListFromMap(this.ab, abKey);
    if (triples.length === 0) return null;
    return triples[triples.length - 1].c;
};

// Public API
TripleStore.prototype.findLatestBForAC = function(a, c) {
    var acKey = JSON.stringify([a, null, c]);
    var triples = getTripleListFromMap(this.ac, acKey);
    if (triples.length === 0) return null;
    return triples[triples.length - 1].b;
};

// Public API
TripleStore.prototype.findLatestAForBC = function(b, c) {
    var bcKey = JSON.stringify([null, b, c]);
    var triples = getTripleListFromMap(this.bc, bcKey);
    if (triples.length === 0) return null;
    return triples[triples.length - 1].a;
};

// TODO: API and indexing to return all B's for an A or C? Or A or Cs for a B?

module.exports = TripleStore;