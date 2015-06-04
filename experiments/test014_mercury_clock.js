// Derived from: http://eom.surge.sh/

// See also my previous mercury experiment derived from a different example at: http://jsfiddle.net/pdfernhout/q9daof6j/

require([], function() {
    "use strict";
    
    /* global mercury */
    var hg = mercury;
    
    var state = hg.struct({
        time: hg.value(new Date())
    });
    
    // TODO: Problem at startup; displays code source instead of time, until fixed apprarently on first time tick
    function render(state) {
        // toTimeString did not work...
        // return h('h1', state.time.toTimeString().split(' ')[0]);
        console.log("render", state.time, state);
        return hg.h('h1', state.time.toString());
    }
    
    var vtree = render(state);
    var el = hg.create(vtree);
    document.body.appendChild(el);
    
    state(function (state) {
        var _vtree = render(state);
        el = hg.patch(el, hg.diff(vtree, _vtree));
        vtree = _vtree;
    });
    
    setInterval(function () { state.time.set(new Date()); }, 1000); 
});