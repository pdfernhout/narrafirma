interface ClientState {
    projectIdentifier: string;
    pageIdentifier: string;
    storyCollectionIdentifier: string;
    catalysisReportIdentifier: string;
    debugMode: string;
    serverStatus: string;
    serverStatusText: string;
}

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
    includeAllFields?: boolean | Array<String>;
    customButton?: any;
    validateAdd?: string;
    validateEdit?: string;
    shouldNextItemBeSelectedAfterItemRemoved?: boolean;
}

interface GridDisplayConfiguration {
    itemPanelID: string;
    itemPanelSpecification: any;
    gridConfiguration: GridConfiguration;
}