interface GraphSelection {
    xAxis: string;
    x1: number;
    x2: number;
    yAxis?: string;
    y1?: number;
    y2?: number;
    subgraphQuestion?: any;
    subgraphChoice?: any;
}

interface GraphHolder {
    graphResultsPane: HTMLElement;
    chartPanes: Array<HTMLElement>;
    allStories: Array<any>;
    currentGraph: any;
    currentSelectionExtentPercentages: GraphSelection;
    excludeStoryTooltips?: boolean;
    minimumStoryCountRequiredForTest: number;
}

// Possible Grid configuration options
interface GridConfiguration {
    idProperty?: string;
    inlineButtons?: boolean;
    viewButton?: boolean;
    addButton?: boolean;
    removeButton?: boolean;
    editButton?: boolean;
    duplicateButton?: boolean;
    moveUpDownButtons?: boolean;
    navigationButtons?: boolean;
    // For next field, Array could be ["fieldName1", "fieldName2", ...]
    columnsToDisplay?: boolean | Array<String>;
    customButton?: any;
    validateAdd?: string;
    validateEdit?: string;
    shouldNextItemBeSelectedAfterItemRemoved?: boolean;
    selectCallback?: Function;
    transformDisplayedValues?: Function;
}

interface GridDisplayConfiguration {
    id: string;
    itemPanelID: string;
    itemPanelSpecification: any;
    gridConfiguration: GridConfiguration;
}

// For Panels

interface PanelField {
    id: string;
    valueType: string;
    displayType: string;
    displayPrompt: string;
    valuePath?: string;
    valueOptions?: string | string[] | Object;
    valueOptionsSubfield?: string;
    displayName?: string;
    displayConfiguration?: any;
    displayVisible?: any;
    displayReadOnly?: any;
    displayTransformValue?: any;
    displayPreventBreak?: any;
    displayDataOptionField?: any;
}

interface Panel {
    id: string;
    displayName?: string;
    tooltipText?: string;
    headerAbove?: string;
    panelFields: PanelField[];
    modelClass?: string;
}

interface ClusteringDiagramItem {
    uuid: string;
    "type": string;
    name: string;
    notes: string;
    x: number;
    y: number;
    bodyColor?;
    borderColor?;
    borderWidth?;
    radius?: number;
    textStyle?;
}

interface ClusteringDiagramModel {
    surfaceWidthInPixels: number;
    surfaceHeightInPixels: number;
    items: ClusteringDiagramItem[];
    changesCount: number;
}