import Project = require("../Project");
import Globals = require("../Globals");
import m = require("mithril");

"use strict";

// debug browser support

function stringify(stringOrObject) {
    if (typeof stringOrObject === "object") {
        return JSON.stringify(stringOrObject)
    }
    return "" + stringOrObject
}

export class DebugBrowser {
    project: Project = null;

    show = {};
    
    constructor() {   
        this.project = Globals.project();
    }

    static controller(args) {
        return new DebugBrowser();
    }
    
    static view(controller) {
        return controller.calculateView();
    }
    
    calculateView() {
        const tripleMessages = this.project.tripleStore.tripleMessages;
        const objects = {};
        for (const message of tripleMessages) {
            if (message.messageType === "tripleStore" && message.change.action === "addTriple") {
                const a = stringify(message.change.triple.a)
                const b = stringify(message.change.triple.b)
                const c = stringify(message.change.triple.c)
                if (!objects[a]) {
                    objects[a] = {};
                }
                const object = objects[a];
                object[b] = c;
            }
        }

        try {
            return m("div",
                { style: "padding-top: 1rem;" },
                m("h3", "Objects:"),
                // (() => { throw new Error("test error") })(),
                Object.keys(objects).sort().map(key => m("div",
                    { style: "padding-top: 1rem;" }, 
                    key, " = { ",
                    Object.keys(objects[key]).sort().map(attribute => m("div",
                        { style: "padding-left: 4rem; white-space: nowrap;" },
                        m("i", attribute) ,
                        ": ",
                        m("b", objects[key][attribute])
                    )),
                    m("div", "}")
                )),
                m("h3", "Messages:"),
                tripleMessages.map(message => 
                    m("div", 
                        { style: "white-space: nowrap;" },
                        message._topicTimestamp,
                        m("span", { 
                            onclick: () => this.show[message.__pointrel_sha256AndLength] = !this.show[message.__pointrel_sha256AndLength]
                        }, this.show[message.__pointrel_sha256AndLength] ? " V " : " > "),
                        (message.messageType === "tripleStore" && message.change.action === "addTriple") 
                            ? m("span", {style: "padding: 0.3rem;" }, 
                                stringify(message.change.triple.a), " | ",
                                m("i", stringify(message.change.triple.b)), " | ", 
                                m("b", stringify(message.change.triple.c)))
                            : null,
                        this.show[message.__pointrel_sha256AndLength] 
                            ? m("pre", 
                                { style: "border-style: solid; border-width: 1px; padding: 0.5rem; margin-left: 2rem" }, 
                                JSON.stringify(message, null, 4)) 
                            : null
                    )
                )
            );
        } catch (error) {
            console.error(error);
            return m("h2", "Problem displating debug data; check console log")
        }
    }
}