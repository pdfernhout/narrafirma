import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import storyAnnotationBrowser = require("./StoryAnnotationBrowser");

"use strict";

function add_storyAnnotationBrowser(panelBuilder: PanelBuilder, model, fieldSpecification) {
    return m.component(<any>storyAnnotationBrowser.StoryAnnotationBrowser, {key: fieldSpecification.id, panelBuilder: panelBuilder, model: model, fieldSpecification: fieldSpecification});
}

export = add_storyAnnotationBrowser;
