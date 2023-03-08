interface GraphSelection {
    xAxis: string;
    x1: number;
    x2: number;
    yAxis?: string;
    y1?: number;
    y2?: number;
    subgraphQuestion?: any;
    subgraphChoice?: any;
    selectionCategories?: Array<String>;
}

interface PatternDisplayConfiguration {
    hideNoAnswerValues: boolean;
    useLumpingCommands: boolean;
    remarkable?: string;
}

// Possible Grid configuration options
interface GridConfiguration {
    idProperty?: string;
    maxColumnCount?: number;
    inlineButtons?: boolean;
    addButton?: boolean;
    removeButton?: boolean;
    duplicateButton?: boolean;
    navigationButtons?: boolean;
    navigationButtonsAtBottom?: boolean;
    specialHiddenPanelForPatternExplorer?: boolean;
    randomButton?: boolean;
    // For next field, Array could be ["fieldName1", "fieldName2", ...]
    columnsToDisplay?: boolean | Array<String>;
    customButton?: any;
    validateAdd?: string;
    validateEdit?: string;
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
    displayPrompt: any;
    required?: boolean;
    valuePath?: string;
    valueOptions?: string | string[] | Object;
    valueOptionsSubfield?: string;
    displayName?: string;
    displayConfiguration?: any;
    displayIconClass?: any;
    displayVisible?: any;
    displayReadOnly?: any;
    displayTransformValue?: any;
    displayURLValue?: any;
    displayPreventBreak?: any;
    displayWithoutQuestionDivs?: any;
    displayDataOptionField?: any;
    displayClass?: string;
}

interface FormFieldInfo {
    tripleStoreFieldID: string;
    objectFieldID?: string;
    exportImportID?: string;
    type?: string;
    canBeTranslated?: boolean;
    default?: any;
    nonNativeImportOption?: any;
    section?: string;
    explanation?: string;
}

interface StoryFormTemplate {
        __type?: string;
        id?: string;
        questionForm_shortName?: string; // set identifier
        questionForm_elicitingQuestions?: string; // set identifier
        questionForm_storyQuestions?: string; // set identifier
        questionForm_participantQuestions?: string;
        questionForm_title?: string;
        questionForm_startText?: string;
        questionForm_image?: string;
        questionForm_video?: string;
        questionForm_textAfterVideo?: string;
        questionForm_endText?: string;
        questionForm_aboutYouText?: string;
        questionForm_thankYouPopupText?: string;
        questionForm_customCSS?: string;
        questionForm_customCSSForPrint?: string;

        questionForm_chooseQuestionText?: string;
        questionForm_enterStoryText?: string;
        questionForm_nameStoryText?: string;
        questionForm_tellAnotherStoryText?: string;
        questionForm_tellAnotherStoryButtonText?: string;
        questionForm_maxNumStories?: string;
        questionForm_sliderValuePrompt?: string;
        questionForm_selectNoChoiceName?: string;
        questionForm_booleanYesNoNames?: string;
        questionForm_maxNumAnswersPrompt?: string;

        questionForm_submitSurveyButtonText?: string;
        questionForm_sendingSurveyResultsText?: string;
        questionForm_couldNotSaveSurveyText?: string;
        questionForm_resubmitSurveyButtonText?: string;

        questionForm_deleteStoryButtonText?: string;
        questionForm_deleteStoryDialogPrompt?: string;
        questionForm_surveyStoredText?: string;
        questionForm_showSurveyResultPane?: string;
        questionForm_surveyResultPaneHeader?: string;

        questionForm_errorMessage_noElicitationQuestionChosen?: string;
        questionForm_errorMessage_noStoryText?: string;
        questionForm_errorMessage_noStoryName?: string;

        questionForm_defaultLanguage?: string;
        questionForm_languageChoiceQuestion_text?: string;
        questionForm_languageChoiceQuestion_choices?: string;
    
        import_minScaleValue?: number;
        import_maxScaleValue?: number;
        import_multiChoiceYesIndicator?: string;
        import_multiChoiceYesQASeparator?: string;
        import_multiChoiceYesQAEnding?: string;
        import_multiChoiceDelimiter?: string;
        import_storyTitleColumnName?: string;
        import_storyTextColumnName?: string;
        import_storyCollectionDateColumnName?: string;
        import_storyFormLanguageColumnName?: string;
        import_participantIDColumnName?: string;
        import_columnsToIgnore?: any;
        import_columnsToAppendToStoryText?: string;
        import_textsToWriteBeforeAppendedColumns?: string;
        import_minWordsToIncludeStory?: string;
        import_stringsToRemoveFromHeaders?: string;
        import_elicitingQuestionColumnName?: string;
        import_elicitingQuestionGraphName?: string;
}

interface StoryFormFields {
    id?: string;
    shortName?: string; 
    elicitingQuestions?: any [];
    storyQuestions?: any [];
    participantQuestions?: any [];
    title?: string;
    startText?: string;
    image?: string;
    video?: string;
    textAfterVideo?: string;
    endText?: string;
    aboutYouText?: string;
    thankYouPopupText?: string;
    customCSS?: string;
    customCSSForPrint?: string;

    chooseQuestionText?: string;
    enterStoryText?: string;
    nameStoryText?: string;
    tellAnotherStoryText?: string;
    tellAnotherStoryButtonText?: string;
    maxNumStories?: string;
    sliderValuePrompt?: string;
    selectNoChoiceName?: string;
    booleanYesNoNames?: string;
    maxNumAnswersPrompt?: string;

    submitSurveyButtonText?: string;
    sendingSurveyResultsText?: string;
    couldNotSaveSurveyText?: string;
    resubmitSurveyButtonText?: string;

    deleteStoryButtonText?: string;
    deleteStoryDialogPrompt?: string;
    surveyStoredText?: string;
    showSurveyResultPane?: string;
    surveyResultPaneHeader?: string;

    errorMessage_noElicitationQuestionChosen?: string;
    errorMessage_noStoryText?: string;
    errorMessage_noStoryName?: string;

    defaultLanguage?: string;
    languageChoiceQuestion_text?: string;
    languageChoiceQuestion_choices?: string;
    translationDictionary?: {};

    import_minScaleValue?: number;
    import_maxScaleValue?: number;
    import_multiChoiceYesIndicator?: string;
    import_multiChoiceYesQASeparator?: string;
    import_multiChoiceYesQAEnding?: string;
    import_multiChoiceDelimiter?: string;
    import_storyTitleColumnName?: string;
    import_storyTextColumnName?: string;
    import_storyCollectionDateColumnName?: string;
    import_storyFormLanguageColumnName?: string;
    import_participantIDColumnName?: string;
    import_columnsToIgnore?: any;
    import_columnsToAppendToStoryText?: string;
    import_textsToWriteBeforeAppendedColumns?: string;
    import_minWordsToIncludeStory?: string;
    import_stringsToRemoveFromHeaders?: string;
    import_elicitingQuestionColumnName?: string;
    elicitingQuestionGraphName?: string;
}

interface Panel {
    id: string;
    displayName?: string;
    pageExplanation?: string;
    pageCategories?: string;
    headerAbove?: string;
    panelFields: PanelField[];
    modelClass?: string;
}

interface ClusteringDiagramItem {
    uuid: string;
    referenceUUID?: string;
    "type": string;
    name: string;
    notes: string;
    x: number;
    y: number;
    bodyColor?;
    borderColor?;
    textColor?;
    borderWidth?;
    radius?: number;
    textStyle?;
    hidden?: boolean;
    print?: boolean;
    strength?: string;
    notesExtra?: string;
    order?: number;
}

interface ClusteringDiagramModel {
    surfaceWidthInPixels: number;
    surfaceHeightInPixels: number;
    items: ClusteringDiagramItem[];
    changesCount: number;
}
