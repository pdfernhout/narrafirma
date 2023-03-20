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
    const result = {};
    let match;
    // Regex for replacing addition symbol with a space
    const plusMatcher = /\+/g;
    const parameterSplitter = /([^&;=]+)=?([^&;]*)/g;
    const decode = function (s) { return decodeURIComponent(s.replace(plusMatcher, " ")); };
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
    private _storyFormName: string = null;
    private _observationAccessor: Object = null;
    private _debugMode: string = null;
    private _serverStatus: string = "narrafirma-serverstatus-ok";
    private _serverStatusText: string = "";
    private _leavingPageCallback: () => void;
    private _redrawingDueToIncomingMessage: boolean = null;
    private _cachedOverwrittenTexts = {};
    private _showAdvancedOptions: boolean = false;
    private _showImportOptions: boolean = false;
    
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
    
    // Read-only convenience accessor
    storyCollectionIdentifier(newValue = undefined) {
        if (newValue) throw new Error("storyCollectionIdentifier: setting value is not supported");
        const storyCollectionIdentifier = this._project.findStoryCollectionID(this._storyCollectionName);
        if (!storyCollectionIdentifier) return null;
        return storyCollectionIdentifier;
    }

    haveStoryCollectionAndShowingAdvancedOptions() {
        const storyCollectionIdentifier = this._project.findStoryCollectionID(this._storyCollectionName);
        if (!storyCollectionIdentifier) return null;
        return this._showAdvancedOptions;
    }

    atLeastOneAnnotationQuestionExists() {
        if (!this._project) return false;
        const questions = this._project.collectAllAnnotationQuestions();
        return questions.length > 0;
    }

    csvDelimiter() {
        const defaultValue = ",";
        if (!this._project) return defaultValue;
        const value = this._project.tripleStore.queryLatestC(this._project.projectIdentifier, "projectOptions_csvDelimiter");
        if (value) {
            switch (value) {
                case "comma":
                    return ",";
                case "semicolon":
                    return ";";
                case "tab":
                    return "\t";
                default:
                    alert("ERROR: Unexpected value for csv delimiter: " + value);
                    return defaultValue;
            }
        } else {
            return defaultValue;
        }
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
        const catalysisReportIdentifier = this._project.findCatalysisReport(this._catalysisReportName);
        if (!catalysisReportIdentifier) return null;
        return catalysisReportIdentifier;
    }

    haveCatalysisReportAndShowingAdvancedOptions() {
        const catalysisReportIdentifier = this._project.findCatalysisReport(this._catalysisReportName);
        if (!catalysisReportIdentifier) return null;
        return this._showAdvancedOptions;
    }

    storyFormName(newValue: string = undefined): string {
        if (newValue !== undefined) {
            this._storyFormName = newValue;
        }
        return this._storyFormName;
    }

    storyFormIdentifier() {
        const storyFormIdentifier = this._project.findStoryFormID(this._storyFormName);
        if (!storyFormIdentifier) return null;
        return storyFormIdentifier;
    }

    haveStoryFormAndShowingAdvancedOptions() {
        const storyFormIdentifier = this._project.findStoryFormID(this._storyFormName);
        if (!storyFormIdentifier) return null;
        return this._showAdvancedOptions;
    }

    observationAccessor(newValue: Object = undefined) {
        if (newValue !== undefined) {
            this._observationAccessor = newValue;
        }
        return this._observationAccessor;
    }

    leavingPageCallback(newValue: () => void = undefined) {
        if (newValue !== undefined) {
            this._leavingPageCallback = newValue;
        }
        return this._leavingPageCallback;
    }

    redrawingDueToIncomingMessage(newValue: boolean = undefined) {
        if (newValue !== undefined) {
            this._redrawingDueToIncomingMessage = newValue;
        }
        return this._redrawingDueToIncomingMessage;
    }

    cachedOverwrittenTexts(fieldID: string, newValue: string = undefined) {
        if (fieldID === undefined) return null;
        if (newValue === null) {
            delete this._cachedOverwrittenTexts[fieldID];
        } else if (newValue !== undefined) {
            this._cachedOverwrittenTexts[fieldID] = newValue;
        }
        return this._cachedOverwrittenTexts[fieldID];
    }

    showAdvancedOptions(newValue: boolean = undefined) {
        if (newValue !== undefined) {
            this._showAdvancedOptions = newValue;
        }
        return this._showAdvancedOptions;
    }

    showImportOptions(newValue: boolean = undefined) {
        if (newValue !== undefined) {
            this._showImportOptions = newValue;
        }
        return this._showImportOptions;
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
        const fragment = hash();
        const initialHashParameters = getHashParameters(fragment);
        if (initialHashParameters["project"]) this._projectIdentifier = initialHashParameters["project"];
        if (initialHashParameters["page"]) this._pageIdentifier = "page_" + initialHashParameters["page"];
        if (initialHashParameters["storyCollection"]) this._storyCollectionName = initialHashParameters["storyCollection"];
        if (initialHashParameters["catalysisReport"]) this._catalysisReportName = initialHashParameters["catalysisReport"];
        if (initialHashParameters["debugMode"]) this._debugMode = initialHashParameters["debugMode"];
        
        // Ensure defaults
        if (!initialHashParameters["page"]) this._pageIdentifier = PanelSetup.startPage();
    }
    
    hashStringForClientState() {
        let result = "";
        const fields = [
            {id: "_projectIdentifier", key: "project"},
            {id: "_pageIdentifier", key: "page"},
            {id: "_storyCollectionName", key: "storyCollection"},
            {id: "_catalysisReportName", key: "catalysisReport"},
            {id: "_debugMode", key: "debugMode"}
        ];
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            let value = this[field.id];
            if (!value) continue;
            if (field.key === "page" && value) value = value.substring("page_".length);
            if (result) result += "&";
            result += field.key + "=" + encodeURIComponent(value);
        }
        return result;
    }
     
    urlHashFragmentChanged(pageDisplayer) {
        const newHash = hash();
        console.log("urlHashFragmentChanged", newHash);
        const hashParameters = getHashParameters(newHash);
        
        const currentProjectIdentifier = this._projectIdentifier;
        if (currentProjectIdentifier) {
            if (hashParameters.project && hashParameters.project !== currentProjectIdentifier) {
                // Force a complete page reload for now, as needs to create a new Pointrel client
                // TODO: Should we shut down the current Pointrel client first?
                alert("About to trigger page reload for changed project");
                location.reload();
                return;
            }
        } else {
            this._projectIdentifier = hashParameters.project;
        }
         
        let selectedPage = hashParameters.page;
        if (!selectedPage) {
            selectedPage = PanelSetup.startPage();
        } else {
            selectedPage = "page_" + selectedPage;
        }
        if (selectedPage !== this._pageIdentifier) {
            this._pageIdentifier = selectedPage;
        }
        
        if (hashParameters.storyCollection && hashParameters.storyCollection !== this._storyCollectionName) {
            this._storyCollectionName = hashParameters.storyCollection;
        }
        
        if (hashParameters.catalysisReport && hashParameters.catalysisReport !== this._catalysisReportName) {
            this._catalysisReportName = hashParameters.catalysisReport;
        }
        
        if (hashParameters.debugMode && hashParameters.debugMode !== this._debugMode) {
            this._debugMode = hashParameters.debugMode;
        }
        
        // Page displayer will handle cases where the hash is not valid and also optimizing out page redraws if staying on same page
        pageDisplayer.showPage(this._pageIdentifier);
    }
    
    updateHashIfNeededForChangedClientState() {
        const newHash = this.hashStringForClientState();
        if (newHash !== hash()) hash(newHash);
    }  
}

export = ClientState;