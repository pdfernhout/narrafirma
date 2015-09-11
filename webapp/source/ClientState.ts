import PanelSetup = require("./PanelSetup");

// m.route.mode = "hash";

function hash(newValue = null) {
    if (newValue === null) return window.location.hash.substr(1);
    
    if (history.pushState) {
        history.pushState(null, null, "#" + newValue);
    } else {
        location.hash = "#" + newValue;
    }
}

// getHashParameters derived from: http://stackoverflow.com/questions/4197591/parsing-url-hash-fragment-identifier-with-javascript
function getHashParameters(hash): any {
    var result = {};
    var match;
    // Regex for replacing addition symbol with a space
    var plusMatcher = /\+/g;
    var parameterSplitter = /([^&;=]+)=?([^&;]*)/g;
    var decode = function (s) { return decodeURIComponent(s.replace(plusMatcher, " ")); };
    while (true) {
        match = parameterSplitter.exec(hash);
        if (!match) break;
        result[decode(match[1])] = decode(match[2]);
    }
    return result;
}

class ClientState {
    private _projectIdentifier: string = null;
    private _pageIdentifier: string = null;
    private _storyCollectionIdentifier: string = null;
    private _catalysisReportIdentifier: string = null;
    private _debugMode: string = null;
    private _serverStatus: string = "narrafirma-serverstatus-ok";
    private _serverStatusText: string = "";
    
    projectIdentifier(newValue: string = undefined): string {
        if (newValue !== undefined) {
            this._projectIdentifier = newValue;
        }
        return this._projectIdentifier;
    }
    
    pageIdentifier(newValue: string = undefined): string {
        if (newValue !== undefined) {
            this._pageIdentifier = newValue;
        }
        return this._pageIdentifier;
    }

    storyCollectionIdentifier(newValue: string = undefined): string {
        if (newValue !== undefined) {
            this._storyCollectionIdentifier = newValue;
        }
        return this._storyCollectionIdentifier;
    }
    
    catalysisReportIdentifier(newValue: string = undefined): string {
        if (newValue !== undefined) {
            this._catalysisReportIdentifier = newValue;
        }
        return this._catalysisReportIdentifier;
    }
    
    debugMode(newValue: string = undefined): string {
        if (newValue !== undefined) {
            this._debugMode = newValue;
        }
        return this._debugMode;
    }
    
    serverStatus(newValue: string = undefined): string {
        if (newValue !== undefined) {
            this._serverStatus = newValue;
        }
        return this._serverStatus;
    }
    
    serverStatusText(newValue: string = undefined): string {
        if (newValue !== undefined) {
            this._serverStatusText = newValue;
        }
        return this._serverStatusText;
    }
    
    initialize() {
        var fragment = hash();
        // console.log("fragment when page first loaded", fragment);
        var initialHashParameters = getHashParameters(fragment);
        if (initialHashParameters["project"]) this._projectIdentifier = initialHashParameters["project"];
        if (initialHashParameters["page"]) this._pageIdentifier = "page_" + initialHashParameters["page"];
        if (initialHashParameters["storyCollection"]) this._storyCollectionIdentifier = initialHashParameters["storyCollection"];
        if (initialHashParameters["catalysisReport"]) this._catalysisReportIdentifier = initialHashParameters["catalysisReport"];
        if (initialHashParameters["debugMode"]) this._debugMode = initialHashParameters["debugMode"];
        
        // Ensure defaults
        if (!initialHashParameters["page"]) this._pageIdentifier = PanelSetup.startPage();
    }
    
    hashStringForClientState() {
        var result = "";
        
        var fields = [
            {id: "_projectIdentifier", key: "project"},
            {id: "_pageIdentifier", key: "page"},
            {id: "_storyCollectionIdentifier", key: "storyCollection"},
            {id: "_catalysisReportIdentifier", key: "catalysisReport"},
            {id: "_debugMode", key: "debugMode"}
        ];
        
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
    
            var value = this[field.id];
            if (!value) continue;
            
            if (field.key === "page" && value) value = value.substring("page_".length);
            
            if (result) result += "&";
            result += field.key + "=" + encodeURIComponent(value);
        }
        
        // console.log("hashStringForClientState", result, clientState);
        
        return result;
    }
     
    urlHashFragmentChanged(pageDisplayer) {
        var newHash = hash();
        console.log("urlHashFragmentChanged", newHash);
        
        // console.log("current clientState", clientState);
        
        var hashParameters = getHashParameters(newHash);
        // console.log("new hashParameters", hashParameters);
        
        var currentProjectIdentifier = this._projectIdentifier;
        if (currentProjectIdentifier) {
            if (hashParameters.project && hashParameters.project !== currentProjectIdentifier) {
                // Force a complete page reload for now, as needs to create a new Pointrel client
                // TODO: Should we shut down the current Pointrel client first?
                alert("About to trigger page reload for changed project");
                location.reload();
                return;
            }
        } else {
            // console.log("changing client state for page", this._projectIdentifier, hashParameters.project);
            this._projectIdentifier = hashParameters.project;
        }
         
        var selectedPage = hashParameters.page;
        if (!selectedPage) {
            selectedPage = PanelSetup.startPage();
        } else {
            selectedPage = "page_" + selectedPage;
        }
        if (selectedPage !== this._pageIdentifier) {
            // console.log("changing client state for page from:", this._pageIdentifier, "to:", selectedPage);
            this._pageIdentifier = selectedPage;
        }
        
        if (hashParameters.storyCollection && hashParameters.storyCollection !== this._storyCollectionIdentifier) {
            // console.log("changing client state for storyCollection", this._storyCollectionIdentifier, hashParameters.storyCollection);
            this._storyCollectionIdentifier = hashParameters.storyCollection;
        }
        
        if (hashParameters.catalysisReport && hashParameters.catalysisReport !== this._catalysisReportIdentifier) {
            // console.log("changing client state for catalysisReport", this._catalysisReportIdentifier, hashParameters.catalysisReport);
            this._catalysisReportIdentifier = hashParameters.catalysisReport;
        }
        
        if (hashParameters.debugMode && hashParameters.debugMode !== this._debugMode) {
            // console.log("changing client state for debugMode", this._debugMode, hashParameters.debugMode);
            this._debugMode = hashParameters.debugMode;
        }
        
        // Page displayer will handle cases where the hash is not valid and also optimizing out page redraws if staying on same page
        pageDisplayer.showPage(this._pageIdentifier);
    
        // console.log("done with urlHashFragmentChanged");
    }
    
    updateHashIfNeededForChangedClientState() {
        var newHash = this.hashStringForClientState();
        if (newHash !== hash()) hash(newHash);
    }  
};

export = ClientState;