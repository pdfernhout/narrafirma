import m = require("mithril");
import translate = require("./translate");
import PanelBuilder = require("panelBuilder/PanelBuilder");
import generateRandomUuid = require("../pointrel20150417/generateRandomUuid");
import TripleStore = require("../pointrel20150417/TripleStore");
import valuePathResolver = require("./valuePathResolver");
import Globals = require("../Globals");
import _ = require("lodash");

"use strict";

// This defines a gui component which has a grid, some buttons, and a detail panel do display the currently selected item or enter a new item
// TODO: Probably need to prevent user surveys from having a question with a short name of "_id".

let gridsMade = 0;
const debug = false;

const displayTypesToDisplayAsColumns = {
   text: true,
   textarea: true,
   boolean: true,
   checkbox: true,
   select: true,
   radiobuttons: true,
   checkboxes: true,
   slider: true
};

// embedded sets to copy when duplicating item
const SetClassNames = {
    // planning
    ObservedStorySet: true,
    // collection
    CollectionSessionActivitySet: true,
    StoryFormSet: true,
    ElicitingQuestionChoiceSet: true,
    StoryQuestionChoiceSet: true,
    ParticipantQuestionChoiceSet: true,
    TranslationDictionarySet: true,
    CollectionSessionConstructionSet: true,
    // catalysis
    StoryCollectionChoiceSet: true,
    ObservationSet: true,
    InterpretationSet: true,
    // sensemaking
    SensemakingSessionActivityPlanSet: true,
    SensemakingSessionConstructionSet: true,
    SensemakingSessionOutcomeSet: true,
    ResonantPatternSet: true,
    ResonantStorySet: true,
    // intervention
    // return
}

// embedded set items to copy when duplicating item
const ItemClassNames = {
    // planning
    ObservedStory: true,
    // collection
    CollectionSessionActivity: true,
    StoryForm: true,
    ElicitingQuestionChoice: true,
    StoryQuestionChoice: true,
    ParticipantQuestionChoice: true,
    TranslationDictionary: true,
    CollectionSessionConstruction: true,
    // catalysis
    StoryCollectionChoice: true,
    Observation: true,
    Interpretation: true,
    // sensemaking
    SensemakingSessionActivityPlan: true,
    SensemakingSessionConstruction: true,
    SensemakingSessionOutcome: true,
    ResonantPattern: true,
    ResonantStory: true,
    // intervention
    // return
}

// item sets not given duplicate buttons, because it doesn't seem like people would want them
// basically all of these things are stories, and it seems ridiculous to have two identical (or even nearly identical) ones
// planning: project stories, observed stories
// return: points of feedback, requests for support

// items for which short names are lookups:
// eliciting, story, and participant questions
// story forms
// story collections
// none of these are ever listed in nested grids

function computeColumnsForItemPanelSpecification(itemPanelSpecification, gridConfiguration: GridConfiguration) {
    const columns = [];
    
    const panelFields = itemPanelSpecification.panelFields;
    if (!panelFields || !gridConfiguration) return columns;

    if (gridConfiguration.maxColumnCount == undefined) gridConfiguration.maxColumnCount = 5;
    let columnCount = 0;
    const fieldsToInclude = [];
    const columnsToDisplay = gridConfiguration.columnsToDisplay;
    
    // Put the columns in the order supplied if using columnsToDisplay, otherwise put them in order of panel specification
    if (columnsToDisplay && columnsToDisplay.constructor === Array) {
        (<Array<string>>columnsToDisplay).forEach(function (fieldName) {
            panelFields.forEach(function (fieldSpecification) {
                if (fieldSpecification.id === fieldName) fieldsToInclude.push(fieldSpecification);
            });
        });
    } else {
        panelFields.forEach(function (fieldSpecification) {
            if (columnsToDisplay) {
                // TODO: improve this check if need to exclude other fields?
                if (fieldSpecification.displayType !== "label" && fieldSpecification.displayType !== "header") {
                    fieldsToInclude.push(fieldSpecification);
                }
            } else {
                if (columnCount < gridConfiguration.maxColumnCount) {
                    if (displayTypesToDisplayAsColumns[fieldSpecification.displayType]) fieldsToInclude.push(fieldSpecification);
                    columnCount++;
                }
            }
        });
    }
    
    fieldsToInclude.forEach(function (fieldSpecification) {

        // this is for one particular case (the patterns table in PatternExplorer) 
        // where the string to translate is literally "id" 
        // this causes the translate function to show "ID" instead of fieldSpecification.displayName 
        // because the "messages" data structure in applicationMessages has the lookup string "id::shortname"
        // this was a mistake that can't be changed because the "id" field is saved in the data for patterns
        let columnLabel = "";
        if (fieldSpecification.id === "id") {
            columnLabel = fieldSpecification.displayName;
        } else {
            columnLabel = translate(fieldSpecification.id + "::shortName", fieldSpecification.displayName);
        }

        const newColumn =  {
            field: fieldSpecification.id,
            label: columnLabel,
            displayType: fieldSpecification.displayType
        };
        columns.push(newColumn);
    });
    
    return columns;
}

function isElementInViewport(parent, element) {
    const elementRect = element.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    return (
        elementRect.top >= parentRect.top &&
        elementRect.left >= parentRect.left &&
        elementRect.bottom <= parentRect.bottom &&
        elementRect.right <= parentRect.right
    );
}

class ItemPanel {
    
    static controller(args) {
        return new ItemPanel();
    }
    
    static view(controller, args) {
        return controller.calculateView(args);
    }
    
    calculateView(args) {
        // TODO: Should provide copy of item?
        const panelBuilder: PanelBuilder = args.panelBuilder;
        // Possible recursion if the panels contain a table
        
        let theClass = "narrafirma-griditempanel-viewing";
        if (args.mode === "edit") {
            theClass = "narrafirma-griditempanel-editing";  
        }
        
        const oldReadOnly = panelBuilder.readOnly;
        if (args.mode === "view") {
            panelBuilder.readOnly = true;
        }
        try {
            const div = m("div", {"class": theClass}, panelBuilder.buildPanel(args.grid.itemPanelSpecification, args.item));
            return div;
        } finally {
            panelBuilder.readOnly = oldReadOnly;
        }
    }
}

const defaultGridConfiguration: GridConfiguration = {
    idProperty: undefined,
    
    addButton: true,
    removeButton: true,

    columnsToDisplay: false,
    inlineButtons: false,
    navigationButtons: true, 
    
    customButton: null,
    validateAdd: null,
    validateEdit: null,
};

const sortCharacterUp = "\u25B2";
const sortCharacterDown = "\u25BC";
const sortCharacterBoth = "\u2003"; // Blank space equal to 1em

// GridWithItemPanel needs to be a component so it can maintain a local sorted list
class GridWithItemPanel {
    
    gridID = "grid_" + (++gridsMade);
    
    gridConfiguration: GridConfiguration = null;
    dataStore: DataStore;
    columns = [];
    fieldSpecification = null;
    itemPanelSpecification = null;
    idProperty: string = "_id";
    model = null;
    valueProperty: Function;
    panelBuilder: PanelBuilder = null;
    
    // viewing, editing, adding - these are no longer being used
    // except for the one case, in the pattern explorer, where nothing is shown
    displayMode = null;
    
    // TODO: Multiple select
    private selectedItem = null;
    
    isNavigationalScrollingNeeded: string = null;
    
    sortBy: string = null;
    sortDirection: string = "ascending";
    
    readOnly = false;
    
    onunload() {
    }
    
    constructor(args) {
        this.panelBuilder = args.panelBuilder;
        this.fieldSpecification = args.fieldSpecification;
        this.model = args.model;
        this.readOnly = args.readOnly;
        this.updateDisplayConfigurationAndData(this.fieldSpecification.displayConfiguration);
    }
    
    updateDisplayConfigurationAndData(theDisplayConfiguration: GridDisplayConfiguration) {
        let itemPanelID: string;
        let itemPanelSpecification = null;
        
        if (_.isString(theDisplayConfiguration)) {
            itemPanelID = <any>theDisplayConfiguration;
            this.gridConfiguration = defaultGridConfiguration;
        } else {
            itemPanelID = theDisplayConfiguration.itemPanelID;
            if (theDisplayConfiguration.gridConfiguration) {
                this.gridConfiguration = theDisplayConfiguration.gridConfiguration;
            } else {
                this.gridConfiguration = defaultGridConfiguration;
            }
            itemPanelSpecification = theDisplayConfiguration.itemPanelSpecification;
        }
   
        if (!itemPanelSpecification && itemPanelID) {
            itemPanelSpecification = this.panelBuilder.getPanelDefinitionForPanelID(itemPanelID);
        }
        this.itemPanelSpecification = itemPanelSpecification;
        
        if (!this.itemPanelSpecification) {
            console.log("Error: no itemPanelSpecification for options: ", this.fieldSpecification);
        }
        
        if (!this.model) {
            console.log("Error: no model is defined for grid", this.fieldSpecification);
            throw new Error("Error: no model is defined for grid");
        }
        
        if (this.gridConfiguration.idProperty) this.idProperty = this.gridConfiguration.idProperty;
        
        this.columns = computeColumnsForItemPanelSpecification(this.itemPanelSpecification, this.gridConfiguration);
        if (this.columns.length) {
            this.sortBy = this.columns[0].field;
        }
        
        // viewing, editing
        this.displayMode = null;
        
        // TODO: Multiple select
        this.setSelectedItem(null);
        
        this.isNavigationalScrollingNeeded = null;
        
        this.valueProperty = valuePathResolver.newValuePathForFieldSpecification(this.model, this.fieldSpecification);
        
        const itemClassName = itemPanelSpecification.modelClass;
        if (!itemClassName) {
            console.log("Error: No modelClass in panel specification", itemPanelSpecification);
            throw new Error("Error: No modelClass in panel specification for grid");
        }
        const setClassName = itemPanelSpecification.modelClass + "Set";
        
        if (this.useTriples()) {
            this.dataStore = new TripleSetDataStore(this.valueProperty, this.idProperty, this.gridConfiguration.transformDisplayedValues, setClassName, itemClassName, Globals.project().tripleStore);
        } else {
            this.dataStore = new DataStore(this.valueProperty, this.idProperty, this.gridConfiguration.transformDisplayedValues, setClassName, itemClassName);
        }
        this.updateData();
    }
    
    updateData() {
        this.dataStore.getDataArrayFromModel();
        this.sortData();
        if (this.selectedItem) {
            if (this.dataStore.data.indexOf(this.selectedItem) === -1) {
                this.setSelectedItem(null);
            }
        }
    }
      
    private sortData() {
        // TODO: This may need work for set???
        this.dataStore.sortData(this.sortBy, this.sortDirection);
    }
    
    static controller(args) {
        return new GridWithItemPanel(args);
    }
    
    static view(controller: GridWithItemPanel, args) {
        return controller.calculateView(args);
    }
    
    addNavigationButtons(buttons) {
        const navigationDisabled = this.dataStore.data.indexOf(this.selectedItem) === -1 || this.dataStore.isEmpty() || undefined;

        if (this.dataStore.data.length >= 6)
            buttons.push(m("button", {onclick: this.navigateClicked.bind(this, "start"), disabled: navigationDisabled}, 
                m("span", {class: "buttonWithNoTextImage navigateToStartIconImage"})));

        if (this.dataStore.data.length >= 2)
            buttons.push(m("button", {onclick: this.navigateClicked.bind(this, "previous"), disabled: navigationDisabled}, 
                m("span", {class: "buttonWithNoTextImage navigatePreviousIconImage"})));
        if (this.dataStore.data.length >= 2)
            buttons.push(m("button", {onclick: this.navigateClicked.bind(this, "next"), disabled: navigationDisabled}, 
                m("span", {class: "buttonWithNoTextImage navigateNextIconImage"})));

        if (this.dataStore.data.length >= 6)
            buttons.push(m("button", {onclick: this.navigateClicked.bind(this, "end"), disabled: navigationDisabled}, 
                m("span", {class: "buttonWithNoTextImage navigateToEndIconImage"})));

        if (this.gridConfiguration.randomButton)
            buttons.push(m("button", {onclick: this.navigateClicked.bind(this, "random"), disabled: navigationDisabled}, 
                m("span", {class: "buttonWithTextImage navigateRandomButtonImage"}), translate("#button_navigateRandom|Random")));
    }

    calculateView(args) {
        // Deal with the fact that new items might be added at any time by other users
        // TODO: This is very inefficient. Alternatives include: listening for changes that add or remove items; or determing nature of change prompting redraw
        this.updateData();
        
        const panelBuilder = this.panelBuilder;
        
        const columnHeaders = this.columns.map((column) => {
            let sortCharacter = sortCharacterBoth;
            if (column.field === this.sortBy) {
                if (this.sortDirection === "ascending") {
                    sortCharacter = sortCharacterDown;
                } else if (this.sortDirection === "descending") {
                    sortCharacter = sortCharacterUp;
                }
            }
            return m("th[data-sort-by=" + column.field  + "]", {"text-overflow": "ellipsis"}, column.label + sortCharacter);
        });
        
        if (this.gridConfiguration.inlineButtons) {
            columnHeaders.push(m("th", ""));
        }
        
        const table = m("table.scrolling", this.tableConfigurationWithSortingOnHeaderClick(), [
            m("tr", {"class": "grid-header-row"}, columnHeaders),
            <any>this.dataStore.map((item, index) => {
                return this.rowForItem(item, index);
            })
        ]);
        
        const addButtonDisabled = this.readOnly || this.isEditing() || undefined;
        
        let buttons = [];
        if (this.gridConfiguration.addButton) {
            const addButton = m("button", {onclick: this.addItem.bind(this), disabled: addButtonDisabled}, 
                m("span", {class: "buttonWithTextImage addButtonImage"}), translate("#button_Add|Add"));
            buttons.push(addButton);
        }
        
        if (!this.gridConfiguration.inlineButtons) {
            buttons = buttons.concat(this.createButtons());
        }
        
        if (this.gridConfiguration.navigationButtons) {
            this.addNavigationButtons(buttons);
        }
        
        const buttonPanel = m("div.narrafirma-button-panel", buttons);
        
        const parts = [m("div.narrafirm-grid", {id: this.gridID}, [table]), buttonPanel];
        
        if (this.isViewing()) {
            parts.push(this.bottomEditorForItem(panelBuilder, this.selectedItem, "view"));
        } 

        if (this.isEditing()) {
            parts.push(this.bottomEditorForItem(panelBuilder, this.selectedItem, "edit"));
        }

        return m("div", {"class": "questionExternal narrafirma-question-type-grid"}, parts);
    }

    private tableConfigurationWithSortingOnHeaderClick() {
        return {
            onclick: (e) => {
                const sortBy = e.target.getAttribute("data-sort-by");
                if (sortBy) {
                    // Sorting derived from: http://lhorie.github.io/mithril-blog/vanilla-table-sorting.htm
                    if (this.sortBy === sortBy) {
                        if (this.sortDirection === "ascending") {
                            this.sortDirection = "descending";
                            this.dataStore.reverseData();
                        } else {
                            this.sortDirection = "ascending";
                            this.dataStore.reverseData();
                        }
                    } else {
                        this.sortBy = sortBy;
                        this.sortDirection = "ascending";
                        this.sortData();
                    }
                } else {
                    this.selectItemInList(e);
                }
            },
            config: this.ensureTableRowIsVisibleConfig.bind(this)
        };
    }
    
    private selectItemInList(e) {
        if (!this.validateSelectedItem()) return;
        const itemID = e.target.getAttribute("data-item-index");
        const item = this.dataStore.itemForId(itemID);
        if (item !== undefined) {
            this.setSelectedItem(item);
            if (!this.gridConfiguration.specialHiddenPanelForPatternExplorer) {
                this.displayMode = "editing";
            }
         }
    }
    
    setSelectedItem(item) {
        this.selectedItem = item;

        // invalidate any gridwithitempanel inside this panel so it will be reconstructed with new model
        
        if (this.gridConfiguration.selectCallback) {
            this.gridConfiguration.selectCallback(this.selectedItem);
        } 
    }

    private isEditing() {
        return (this.displayMode === "editing" || this.displayMode === "adding") && this.selectedItem;
    }
    
    private isViewing() {
        return (this.displayMode === "viewing") && this.selectedItem;
    }
    
    getSelectedItem() {
        return this.selectedItem;
    }
    
    private validateItem(item) {
        let validationMethodIdentifier = this.gridConfiguration.validateEdit;
        if (this.displayMode === "adding") validationMethodIdentifier = this.gridConfiguration.validateAdd || validationMethodIdentifier;
        if (validationMethodIdentifier) {
            const fakeFieldSpecification = { displayConfiguration: validationMethodIdentifier, value: item };
            const errors = this.panelBuilder.calculateFunctionResult(null, fakeFieldSpecification);
            if (!errors) return [];
            return errors;
        }
        return [];
    }

    private validateSelectedItem() {
        if (this.isEditing()) {
            const item = this.selectedItem;
            if (item) {
                const errors = this.validateItem(item);
                if (errors.length) {
                    // TODO: Translate
                    alert(errors);
                    return false;
                }
            }
        }
        return true;
    }
    
    private bottomEditorForItem(panelBuilder, item, mode) {
        const itemID = item && (typeof item === "string" ? item : item.id);
        return m("div.narrafirma-griditempanel-divwithbutton" + "-" + mode + "ing", [
            m("button", {onclick: this.doneClicked.bind(this, item), class: "narrafirma-griditempanel-close-button"}, 
                m("span", {class: "buttonWithTextImage closeButtonImage"}), "Close"),
            m.component(<any>ItemPanel, 
                {key: this.fieldSpecification.id + "_" + itemID + "_" + "bottomEditor" + "_" + mode, panelBuilder: panelBuilder, item: item, grid: this, mode: mode}),
            m("button", {onclick: this.doneClicked.bind(this, item), class: "narrafirma-griditempanel-close-button"}, 
                m("span", {class: "buttonWithTextImage closeButtonImage"}), "Close")
        ]);
    }

    // Event handlers
    
    private addItem() {
        const newItem = this.dataStore.makeNewItem();
        this.setSelectedItem(newItem);
        this.displayMode = "adding";
    }
    
    private deleteItem(item) {
        if (!item) item = this.selectedItem; 
        
        // TODO: Translate
        if (!confirm("Are you sure you want to delete this item?")) return;

        let index = this.dataStore.deleteItem(item);
        
        if (item === this.selectedItem) {
            this.setSelectedItem(null);
        }
    }

    duplicateItem(item) {
        if (!item) item = this.selectedItem; 
        this.dataStore.makeCopyOfItemWithNewId(item);
    }
    
    private editItem(item) {
        if (!item) item = this.selectedItem;
       // TODO: This needs to create an action that affects original list  
        this.setSelectedItem(item);
        this.displayMode = "editing";
    }
    
    private viewItem(item, index) {
        if (!item) item = this.selectedItem;
        this.setSelectedItem(item);
        this.displayMode = "viewing";
    }
        
    private doneClicked(item) {
        // TODO: Should ensure the data is saved
        if (this.isEditing()) {
            const errors = this.validateItem(item);
            if (errors.length) {
                // TODO: Translate
                alert(errors);
                return;
            }
        }
        // Leave item selected: this.setSelection(null);
        this.displayMode = null;
    }

    navigateClicked(direction: string) {
        if (this.dataStore.isEmpty()) return;
        let newPosition;
        switch (direction) {
            case "start":
                newPosition = 0;
                break;
            case "previous":
                newPosition = this.dataStore.indexOf(this.selectedItem);
                if (newPosition === -1) newPosition = 0;
                if (newPosition > 0) newPosition--;
                break;
            case "next":
                newPosition = this.dataStore.indexOf(this.selectedItem);
                if (newPosition < this.dataStore.length() - 1) newPosition++;
                break;
            case "end":
                newPosition = this.dataStore.length() - 1;
                break;
            case "random":
                newPosition = Math.round(Math.random() * (this.dataStore.length() - 1));
                break;
            default:
               throw new Error("Unexpected direction: " + direction);
        }
        if (!this.validateSelectedItem()) return;
        this.setSelectedItem(this.dataStore.itemForIndex(newPosition));
        this.isNavigationalScrollingNeeded = direction;
    }

    private createButtons(item = undefined) {
        const buttons = [];
       
        const unavailable = (!item && !this.selectedItem) || undefined;
        const disabled = this.readOnly || unavailable;
        
        if (this.gridConfiguration.removeButton) {
            const removeButton = m("button", {onclick: this.deleteItem.bind(this, item), disabled: disabled, "class": "fader"}, 
                m("span", {class: "buttonWithTextImage removeButtonImage"}), translate("#button_Remove|Remove"));
            buttons.push(removeButton);
        }

        if (this.gridConfiguration.duplicateButton) {
            const duplicateButton = m("button", {onclick: this.duplicateItem.bind(this, item), disabled: disabled, "class": "fader"}, 
                m("span", {class: "buttonWithTextImage copyButtonImage"}), translate("#button_Duplicate|Duplicate"));
            buttons.push(duplicateButton);
        }

        if (this.gridConfiguration.customButton) {
            const options = this.gridConfiguration.customButton;
            let customButtonClickedPartial;
            if (_.isString(options.callback)) {
                const fakeFieldSpecification = {id: this.fieldSpecification.id, displayConfiguration: options.callback, grid: this, item: item};
                customButtonClickedPartial = this.panelBuilder.buttonClicked.bind(this.panelBuilder, this.model, fakeFieldSpecification);
            } else {
                customButtonClickedPartial = (event) => { options.callback(this, item); };
            }
            const customButton = m("button", {onclick: customButtonClickedPartial, disabled: disabled}, 
                m("span", {class: options.customButtonIconClass}), translate(options.customButtonLabel));
            buttons.push(customButton);
        }
        
        return buttons;
    }

    private rowForItem(item, index) {
        const selected = (item === this.selectedItem);

        let selectionClass = "";
        if (selected) {
            if (index % 2 === 0) {
                selectionClass = "narrafirma-grid-row-selected-even";
            } else {
                selectionClass = "narrafirma-grid-row-selected-odd";
            }
        } else {
            if (index % 2 === 0) {
                selectionClass = "narrafirma-grid-row-unselected-even";
            } else {
                selectionClass = "narrafirma-grid-row-unselected-odd";
            }
        }
        
        let fields = this.columns.map((column) => {
            let value = this.dataStore.valueForField(item, column.field);
            let reformattedValue = undefined;
            if (value !== undefined && value !== "") {
                if (column.field === "indexInStoryCollection") { // value is a number
                    reformattedValue = value.toString();
                } else if (column.displayType == "boolean") { // value is true or false
                    reformattedValue = value ? "yes" : "no";
                } else if (column.displayType == "checkbox") { // value is true or false
                    if (typeof(value) === "string") {
                        reformattedValue = value; // for "is web form enabled" on "start story collection" page, the value is "yes" or "no"
                    } else {
                        reformattedValue = value ? "checked" : "unchecked";
                    }
                } else if (column.displayType == "checkboxes") { // value is a dictionary; some values could be false
                    const positiveValues = [];
                    Object.keys(value).forEach(function(key, index) { if (key && value[key]) positiveValues.push(key); });
                    reformattedValue = positiveValues.join(" / ");

                // everything else is (probably) a string
                // if there are carriage returns, convert them to slashes to fit into the table cell
                } else { 
                    if (typeof value == "string") {
                        const find = "\n";
                        const re = new RegExp(find, 'g');
                        value = value.replace(re, " / ");
                        reformattedValue = value;
                    } else {
                        reformattedValue = value;
                    }
                }
            }
            if (reformattedValue == undefined) reformattedValue = "";
            
            if (debug) {
                return m("td", {"text-overflow": "ellipsis", "data-item-index": this.dataStore.idForItem(item), 
                    id: this.makeHtmlIdForItem(item)}, reformattedValue + "|" + this.dataStore.idForItem(item) + ", " + this.dataStore["setIdentifier"]);
            } else {
                return m("td", {"text-overflow": "ellipsis", "data-item-index": this.dataStore.idForItem(item), id: this.makeHtmlIdForItem(item)}, reformattedValue);
            }
        });
        if (this.gridConfiguration.inlineButtons) {
            const buttons = this.createButtons(item);
            fields = fields.concat(m("td", {nowrap: true}, buttons));
        }
        return m("tr", {key: this.dataStore.idForItem(item), "class": selectionClass}, fields);
    }
    
    ensureTableRowIsVisibleConfig(tableElement: HTMLElement, isInitialized: boolean, context: any) {
        // Ensure the selected item is visible in the table
        // TODO: Could improve this so when navigating down the item is still near the bottom
        if (this.selectedItem && this.isNavigationalScrollingNeeded) {
            const rowElement = document.getElementById(this.makeHtmlIdForItem(this.selectedItem));
            if (rowElement && !isElementInViewport(tableElement, rowElement)) {
                if (this.isNavigationalScrollingNeeded === "next" || this.isNavigationalScrollingNeeded === "end") {
                    tableElement.scrollTop = rowElement.offsetTop - tableElement.clientHeight + rowElement.offsetHeight;
                } else {
                    tableElement.scrollTop = rowElement.offsetTop;
                }
            }
            this.isNavigationalScrollingNeeded = null;
        }
    }
         
    private makeHtmlIdForItem(item): string {
        return this.gridID + this.dataStore.idForItem(item);
    }
    
    useTriples() {
        if (typeof this.model === "string") return true;
        const storage = this.valueProperty(); 
        return typeof storage === "string";
    }
}

// ObjectArray datastore as base

class DataStore {
    data: Array<any>;
    
    constructor(public valueProperty: Function, public idProperty: string, public valueTransform: Function, public setClassName: string, public itemClassName: string) {
    }
    
    newIdForItem() {
        return generateRandomUuid(this.itemClassName);
    }
    
    length() {
        return this.data.length;
    }
    
    isEmpty() {
        return this.data.length === 0;
    }
    
    getDataArrayFromModel() {
        let data = this.valueProperty();
        if (!data) {
            data = [];
            this.valueProperty(data);
        }
        // Make a copy of the data because we will be sorting it
        // TODO: Copying data creates a problem because up/down movement wil not be reflected in original
        this.data = data.slice();
    }

    makeCopyOfItemWithNewId(item) {
        // TODO: This needs to create an action that affects original list
        // Make a copy of the selected item
        const newItem = JSON.parse(JSON.stringify(item));
                  
        // Set new id for copy
        // TODO: Will not work right if item is an object with some class
        newItem[this.idProperty] = this.newIdForItem();
        
        this.data.push(newItem);
        
        // TODO: This item will not be sorted
        return newItem;
    }
    
    makeNewItem(): any {
        // TODO: This needs to create an action that affects original list
        const newItem = {};
        // TODO: Will not work right if item is an object with some class
        newItem[this.idProperty] = this.newIdForItem();
        this.data.push(newItem);
        
        // TODO: This item will not be sorted
        return newItem;
    }
    
    deleteItem(item) {
        // TODO: This needs to create an action that affects original list
        const index = this.data.indexOf(item);
        this.data.splice(index, 1);
        return index;
    }

    moveItemUp(item) {
        // TODO: How to move this change back to project data???
        const index = this.data.indexOf(item);
        if (index <= 0) return;
        this.data[index] = this.data[index - 1];
        this.data[index - 1] = item;
    }
    
    moveItemDown(item) {
        // TODO: How to move this change back to project data???
        const index = this.data.indexOf(item);
        if (index === -1 || index === this.data.length - 1) return;
        this.data[index] = this.data[index + 1];
        this.data[index + 1] = item;
    }
    
    idForItem(item) {
        let value = item[this.idProperty];
        if (typeof value === "function") {
            value = value.bind(item)();
        }
        return value;
    }
    
    itemForId(itemID: string) {
        for (let i = 0; i < this.data.length; i++) {
            const item = this.data[i];
            if (this.idForItem(item) === itemID) {
                return item;
            }
        }
        return undefined;
    }
    
    valueForField(item, fieldName: string) {
        let value = item[fieldName];
        if (typeof item === "object" && item.model) value = item.fieldValue(fieldName);
        if (typeof value === "function") value = value.bind(item)();
        if (this.valueTransform) value = this.valueTransform(value, fieldName);
        return value;
    }
    
    itemForIndex(index: number) {
        return this.data[index];
    }
    
    map(callback: Function) {
        return this.data.map(<any>callback);
    }
    
    indexOf(item) {
        return this.data.indexOf(item);
    }
    
    sortData(fieldIdentifier: string, sortDirection: string) {
        // TODO: This may need work for set???
        this.data.sort((a, b) => {

            let aValue: string = this.valueForField(a, fieldIdentifier);
            if (aValue === null || aValue === undefined) aValue = "";
            if (typeof aValue === "string") aValue = aValue.toLowerCase();

            let bValue: string = this.valueForField(b, fieldIdentifier);
            if (bValue === null || bValue === undefined) bValue = "";
            if (typeof bValue === "string") bValue = bValue.toLowerCase();

            // always sort empty values at the end, even if reversing the sort order
            if (sortDirection === "ascending") {
                if (aValue === "" && bValue !== "") return 1;
                if (aValue !== "" && bValue === "") return -1;
            } else {
                if (aValue === "" && bValue !== "") return -1;
                if (aValue !== "" && bValue === "") return 1;
            }

            // deal with special case of sider values, which are numbers converted to text
            // and will sort alphabetically if not converted back to numbers before sorting
            if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
                return Number(aValue) > Number(bValue) ? 1 : Number(aValue) < Number(bValue) ? -1 : 0;
            }

            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        });
        
        if (sortDirection === "descending") {
            this.data.reverse();
        }
    }
    
    reverseData() {
        this.data.reverse();
    }
}

class TripleSetDataStore extends DataStore {    
    tripleStore: TripleStore;
    setIdentifier: string;
    
    constructor(valueProperty: Function, idProperty: string, valueTransform: Function, setClassName: string, itemClassName: string, tripleStore: TripleStore) {
        super(valueProperty, idProperty, valueTransform, setClassName, itemClassName);
        this.tripleStore = tripleStore;
    }
    
    getDataArrayFromModel() {
        this.setIdentifier = this.valueProperty();
        
        // Design issue: Should we make a set if none exists at this time as opposed to lazily at first insertion of data?

        if (this.setIdentifier) {
            this.data = this.tripleStore.getListForSetIdentifier(this.setIdentifier);
        } else {
            this.data = [];
        }
    }
    
    // We don't make the set at startup; lazily make it if needed now
    ensureSetExists() {
        // TODO: Remove temporary addition with comparison on string type (for upgrading old data)
        if (!this.setIdentifier || typeof this.setIdentifier !== "string") {
            this.setIdentifier = this.tripleStore.newIdForSet(this.setClassName);
            this.valueProperty(this.setIdentifier);
        }
    }

    updateIDsInClusteringDiagram(newID, diagramFieldName, oldAndNewIDs) {
        const newReport = this.tripleStore.makeObject(newID, true);
        if (!newReport) return;
        const newDiagram = newReport[diagramFieldName];
        if (!newDiagram || !newDiagram.items) return;
        for (let newItem of newDiagram.items) {
            newItem.uuid = this.tripleStore.newIdForItemClass("ClusteringDiagramItem");
            newItem.referenceUUID = oldAndNewIDs[newItem.referenceUUID];
        }
        this.tripleStore.addTriple(newID, diagramFieldName, newDiagram);
    }

    makeCopyOfItemWithNewId(item) {
        // TODO: This needs to create an action that affects original list
        // Make a copy of the selected item
        this.ensureSetExists();

        const oldAndNewIDs = {};
        const newId = this.tripleStore.makeCopyOfItemOrSetWithNewId(0, item, this.itemClassName, SetClassNames, ItemClassNames, oldAndNewIDs);
        this.tripleStore.addTriple(this.setIdentifier, {setItem: newId}, newId);
        this.data.push(newId);

        // special treatment for catalysis report clustering diagrams
        // which have internal uuids, plus uuid references to interpretations or observations
        if (this.itemClassName === "CatalysisReport") {
            this.updateIDsInClusteringDiagram(newId, "interpretationsClusteringDiagram", oldAndNewIDs);
            this.updateIDsInClusteringDiagram(newId, "observationsClusteringDiagram", oldAndNewIDs);
        }

        return newId;
    }
    
    makeNewItem(): any {
        // TODO: This needs to create an action that affects original list
        this.ensureSetExists();
        const newId = this.tripleStore.makeNewSetItem(this.setIdentifier, this.itemClassName);
        this.data.push(newId);
        return newId;
    }
   
    deleteItem(item) {
        // TODO: This needs to create an action that affects original list
        // TODO: Should the C be undefined instead of null?
        this.tripleStore.deleteSetItem(this.setIdentifier, item);
        const index = this.data.indexOf(item);
        this.data.splice(index, 1);
        return index;
    }
    
    moveItemUp(item) {
        throw new Error("TripleSetDataStore moveItemUp Unfinished");
    }
    
    moveItemDown(item) {
        throw new Error("TripleSetDataStore moveItemDown Unfinished");
    }
    
    idForItem(item) {
        return item;
    }
    
    valueForField(item, fieldName: string) {
        let value = this.tripleStore.queryLatestC(item, fieldName);
        if (this.valueTransform) value = this.valueTransform(value, fieldName);
        return value;
    }
}

export = GridWithItemPanel;
