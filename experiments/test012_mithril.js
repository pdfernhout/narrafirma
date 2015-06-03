// Derived from: http://jsfiddle.net/milesmatthias/fbgypzbr/1/

require(["dojo/_base/lang"], function(lang) {
    "use strict";
    
    /* global m */
    
    //this application only has one module: ToDoModule
    var ToDoModule = {};
    
    //for simplicity, we use this module to namespace the model classes
    
    //the Todo class has two properties
    ToDoModule.Todo = function(data) {
        this.description = m.prop(data.description);
        this.done = m.prop(false);
    };
    
    //the TodoList class is a list of Todo's
    ToDoModule.TodoList = Array;
    
    //the view-model tracks a running list of todos,
    //stores a description for new todos before they are created
    //and takes care of the logic surrounding when adding is permitted
    //and clearing the input after adding a todo to the list
    ToDoModule.vm = (function() {
        var vm = {};
        vm.init = function() {
            //a running list of todos
            vm.list = new ToDoModule.TodoList();
    
            //a slot to store the name of a new todo before it is created
            vm.description = m.prop("");
    
            //adds a todo to the list, and clears the description field for user convenience
            vm.add = function() {
                if (vm.description()) {
                    vm.list.push(new ToDoModule.Todo({description: vm.description()}));
                    vm.description("");
                }
            };
            
            // TODO: understand how view gets update when this gets called
            vm.remove = function(task, event) {
                console.log("remove clicked", event, task);
                if (task) {
                    console.log("task list", JSON.stringify(vm.list));
                    var index = vm.list.indexOf(task);
                    if (index === -1) return;
                    vm.list.splice(index, 1);
                    console.log("removed item at", index);
                }
            };
        };
        return vm;
    }());
    
    //the controller defines what part of the model is relevant for the current page
    //in our case, there's only one view-model that handles everything
    ToDoModule.controller = function() {
        ToDoModule.vm.init();
    };
    
    //here's the view
    ToDoModule.view = function() {
        // TODO: For some reason, view is being called twice on add
        console.log("view called");
        return m("html", [
            m("body", [
                m("input", {onchange: m.withAttr("value", ToDoModule.vm.description), value: ToDoModule.vm.description()}),
                m("button", {onclick: ToDoModule.vm.add}, "Add"),
                m("table", [
                    ToDoModule.vm.list.map(function(task, index) {
                        return m("tr", [
                            m("td", [
                                m("input[type=checkbox]", {onclick: m.withAttr("checked", task.done), checked: task.done()})
                            ]),
                            m("td", {style: {textDecoration: task.done() ? "line-through" : "none"}}, task.description()),
                            m("button", {onclick: lang.partial(ToDoModule.vm.remove, task)}, "Remove"),
                        ]);
                    })
                ])
            ])
        ]);
    };
    
    //initialize the application
    m.module(document, {controller: ToDoModule.controller, view: ToDoModule.view});
    
    console.log("Done loading");
});