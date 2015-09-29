import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import StoryBrowser = require("./StoryBrowser");

"use strict";

function add_storyBrowser(panelBuilder: PanelBuilder, model, fieldSpecification) {
    return m.component(<any>StoryBrowser, {key: fieldSpecification.id, panelBuilder: panelBuilder, model: model, fieldSpecification: fieldSpecification});
}

export = add_storyBrowser;
