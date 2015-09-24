import ClientState = require("./ClientState");
import Project = require("./Project");
import PanelSpecificationCollection = require("./panelBuilder/PanelSpecificationCollection");

"use strict";

class Globals {
    // ClientState is for this local instance only (not shared with other users or other browser tabs)
    private static _clientState: ClientState = new ClientState();
    
    // A Project has data that all users are updating across the network
    private static _project: Project;
    
    private static _panelSpecificationCollection: PanelSpecificationCollection;

    static clientState(): ClientState {
        return Globals._clientState;
    }
    
    static project(newValue: Project = undefined): Project {
        if (newValue !== undefined) {
            if (Globals._project) throw new Error("Global project was previously initalized");
            Globals._project = newValue;
            Globals._clientState._project = newValue;
        }
        return Globals._project;
    }
    
    static panelSpecificationCollection(newValue: PanelSpecificationCollection = undefined): PanelSpecificationCollection {
        if (newValue !== undefined) {
            if (Globals._panelSpecificationCollection) throw new Error("Global panelSpecificationCollection was previously initalized");
            Globals._panelSpecificationCollection = newValue;
        }
        return Globals._panelSpecificationCollection;
    }
    
}

export = Globals;
    