import PanelSetup = require("./PanelSetup");
import Project = require("./Project");

"use strict";

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
    private _storyCollectionName: string = null;
    private _catalysisReportName: string = null;
    private _debugMode: string = null;
    private _serverStatus: string = "narrafirma-serverstatus-ok";
    private _serverStatusText: string = "";
    
    // This should only be set by Globals
    _project: Project = null;
    
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

    storyCollectionName(newValue: string = undefined): string {
        if (newValue !== undefined) {
            this._storyCollectionName = newValue;
        }
        return this._storyCollectionName;
    }
    
    catalysisReportName(newValue: string = undefined): string {
        if (newValue !== undefined) {
            this._catalysisReportName = newValue;
        }
        return this._catalysisReportName;
    }
    
    // Read-only convenience accessor
    catalysisReportIdentifier(newValue = undefined) {
        if (newValue) throw new Error("catalysisReportIdentifier: setting value is not supported");
        var catalysisReportIdentifier = this._project.findCatalysisReport(this._catalysisReportName);
        if (!catalysisReportIdentifier) {
            console.log("Problem finding catalysisReportIdentifier for: " + this._catalysisReportName);
            return null;
        }
        return catalysisReportIdentifier;
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
        if (initialHashParameters["storyCollection"]) this._storyCollectionName = initialHashParameters["storyCollection"];
        if (initialHashParameters["catalysisReport"]) this._catalysisReportName = initialHashParameters["catalysisReport"];
        if (initialHashParameters["debugMode"]) this._debugMode = initialHashParameters["debugMode"];
        
        // Ensure defaults
        if (!initialHashParameters["page"]) this._pageIdentifier = PanelSetup.startPage();
    }
    
    hashStringForClientState() {
        var result = "";
        
        var fields = [
            {id: "_projectIdentifier", key: "project"},
            {id: "_pageIdentifier", key: "page"},
            {id: "_storyCollectionName", key: "storyCollection"},
            {id: "_catalysisReportName", key: "catalysisReport"},
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
        
        if (hashParameters.storyCollection && hashParameters.storyCollection !== this._storyCollectionName) {
            // console.log("changing client state for storyCollection", this._storyCollectionIdentifier, hashParameters.storyCollection);
            this._storyCollectionName = hashParameters.storyCollection;
        }
        
        if (hashParameters.catalysisReport && hashParameters.catalysisReport !== this._catalysisReportName) {
            // console.log("changing client state for catalysisReport", this._catalysisReportName, hashParameters.catalysisReport);
            this._catalysisReportName = hashParameters.catalysisReport;
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
}

export = ClientState;