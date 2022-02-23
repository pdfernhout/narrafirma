import { Story } from "./surveyCollection";

export interface GraphHolder {

    // graphical elements
    graphResultsPane: HTMLElement;
    chartPanes: Array<HTMLElement>;
    currentGraph: any;
    currentSelectionExtentPercentages: GraphSelection;
    
    // data elements
    allStories: Array<Story>;

    // display options
    graphTypesToCreate: {};
    minimumStoryCountRequiredForTest: number;
    minimumStoryCountRequiredForGraph: number;
    numHistogramBins: number;
    numScatterDotOpacityLevels: number;
    scatterDotSize: number;
    correlationMapShape: string;
    correlationMapIncludeScaleEndLabels: string;
    correlationMapCircleDiameter: number;
    correlationLineChoice: string;
    customLabelLengthLimit: string;
    hideNumbersOnContingencyGraphs: boolean;
    excludeStoryTooltips?: boolean; // this is used to suppress story tooltips in "data integrity" graphs where stories are not the things being represented
    patternDisplayConfiguration: PatternDisplayConfiguration;
    dataForCSVExport?: {};
    lumpingCommands: {};

    // printed report options
    outputGraphFormat?: string;
    showStatsPanelsInReport?: boolean;
    statisticalInfo?: string;
    customStatsTextReplacements?: string;
    customGraphWidth: number;
    customGraphHeight: number;
    customGraphPadding?: number;
    outputFontModifierPercent?: number;
    adjustedCSS?: string;
    customGraphCSS?: string;
}