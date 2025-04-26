import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import debugBrowser = require("./DebugBrowser");

"use strict";

function add_debugBrowser(panelBuilder: PanelBuilder, model, fieldSpecification) {
    return m.component(<any>debugBrowser.DebugBrowser, {key: fieldSpecification.id, panelBuilder: panelBuilder, model: model, fieldSpecification: fieldSpecification});
}

export = add_debugBrowser;
