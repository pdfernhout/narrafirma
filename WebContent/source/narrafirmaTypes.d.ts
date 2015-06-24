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
    graphResultsPane: _mithril.MithrilVirtualElement;
    chartPanes: Array<_mithril.MithrilVirtualElement>;
    allStories: Array<any>;
    currentGraph: any;
    currentSelectionExtentPercentages: GraphSelection;
}