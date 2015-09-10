var sections = [
    {
        section: "dashboard",
        sectionName: "Dashboard",
        pages: [
            {
                panelID: "page_dashboard",
                panelName: "Dashboard"
            }
        ]
    },
    {
        section: "administration",
        sectionName: "Administration",
        pages: [
           {
                panelID: "page_administration",
                panelName: "Administration"
            },
            {
                panelID: "page_introduction",
                panelName: "Introduction"
            },
            {
                panelID: "page_importExport",
                panelName: "Import & Export"
            },
            {
                panelID: "page_printProjectReport",
                panelName: "Print project report"
            }
        ]
    },
    {
        section: "planning",
        sectionName: "Planning",
        pages: [
            {
                panelID: "page_planning",
                panelName: "Planning"
            },
            {
                panelID: "page_projectFacts",
                panelName: "Enter project facts"
            },
            {
                panelID: "page_planningQuestionsDraft",
                panelName: "Answer PNI Planning questions"
            },
            {
                panelID: "page_participantGroups",
                panelName: "Describe participant groups",
                extraPanels: [
                    {
                        panelID: "panel_addParticipantGroup",
                        panelName: "Participant group"
                    }
                ]
            },
            {
                panelID: "page_describeYourResources",
                panelName: "Describe your resources"
            },
            {
                panelID: "page_projectStories",
                panelName: "Tell project stories",
                extraPanels: [
                    {
                        panelID: "panel_projectStory",
                        panelName: "Project story"
                    }
                ]
            },
            {
                panelID: "page_createProjectStoryElements",
                panelName: "Create project story elements",
                extraPanels: [
                    {
                        panelID: "panel_addStoryElement",
                        panelName: "Add story element"
                    }
                ]
            },
            {
                panelID: "page_assessStorySharing",
                panelName: "Assess story sharing"
            },
            {
                panelID: "page_revisePNIPlanningQuestions",
                panelName: "Revise PNI Planning questions"
            },
            {
                panelID: "page_writeProjectSynopsis",
                panelName: "Write project synopsis"
            }
        ]
    },
    {
        section: "collection",
        sectionName: "Collection",
        pages: [
            {
                panelID: "page_collection",
                panelName: "Collection"
            },
            {
                panelID: "page_chooseCollectionMethods",
                panelName: "Choose collection methods",
                extraPanels: [
                    {
                        panelID: "panel_addStoryCollectionMethod",
                        panelName: "Plan story collection method"
                    }
                ]
            },
            {
                panelID: "page_planStoryCollectionSessions",
                panelName: "Plan story collection sessions",
                extraPanels: [
                    {
                        panelID: "panel_addStoryCollectionSession",
                        panelName: "Design story collection session"
                    },
                    {
                        panelID: "panel_addCollectionSessionActivity",
                        panelName: "Add story collection session activity"
                    }
                ]
            },
            {
                panelID: "page_writeStoryElicitingQuestions",
                panelName: "Write story eliciting questions",
                extraPanels: [
                    {
                        panelID: "panel_addElicitingQuestion",
                        panelName: "Add story eliciting question"
                    }
                ]
            },
            {
                panelID: "page_writeQuestionsAboutStories",
                panelName: "Write questions about stories",
                extraPanels: [
                    {
                        panelID: "panel_addStoryQuestion",
                        panelName: "Add story question"
                    }
                ]
            },
            {
                panelID: "page_writeQuestionsAboutParticipants",
                panelName: "Write questions about participants",
                extraPanels: [
                    {
                        panelID: "panel_addParticipantQuestion",
                        panelName: "Add participant question"
                    }
                ]
            },           
            {
                panelID: "page_designStoryForms",
                panelName: "Design questionnaires",
                extraPanels: [
                    {
                        panelID: "panel_addStoryForm",
                        panelName: "Add story form"
                    },
                    {
                        panelID: "panel_chooseElicitingQuestion",
                        panelName: "Choose eliciting question"
                    },
                    {
                        panelID: "panel_chooseStoryQuestion",
                        panelName: "Choose story question"
                    },
                    {
                        panelID: "panel_chooseParticipantQuestion",
                        panelName: "Choose participant question"
                    } 
                ]
            },
            {
                panelID: "page_startStoryCollection",
                panelName: "Start story collection",
                extraPanels: [
                    {
                        panelID: "panel_addStoryCollection",
                        panelName: "Add story collection"
                    }
                ]
            },
            {
                panelID: "page_printQuestionForms",
                panelName: "Print question forms"
            },
            {
                panelID: "page_enterStories",
                panelName: "Enter stories"
            },
            {
                panelID: "page_writeAnnotationsAboutStories",
                panelName: "Write annotations about stories",
                extraPanels: [
                    {
                        panelID: "panel_addAnnotationQuestion",
                        panelName: "Add annotation question"
                    }
                ]
            }, 
            {
                panelID: "page_reviewIncomingStories",
                panelName: "Review incoming stories"
            },
            {   panelID: "page_browseGraphs",
                panelName: "Spot check graphs for incoming stories"
            },
            {
                panelID: "page_stopStoryCollection",
                panelName: "Stop story collection"
            },
            {
                panelID: "page_enterCollectionSessionRecords",
                panelName: "Enter story collection session records",
                extraPanels: [
                    {
                        panelID: "panel_addCollectionSessionRecord",
                        panelName: "Add story collection session record"
                    },
                    {
                        panelID: "panel_newCollectionSessionConstruction",
                        panelName: "Story collection construction"
                    }
                ]
            }
        ]
    },
    {
        section: "catalysis",
        sectionName: "Catalysis",
        pages: [
            {
                panelID: "page_catalysis",
                panelName: "Catalysis"
            },
            {
                panelID: "page_startCatalysisReport",
                panelName: "Start catalysis report",
                extraPanels: [
                    {
                        panelID: "panel_addCatalysisReport",
                        panelName: "Add catalysis report"
                    },
                    {
                        panelID: "panel_chooseStoryCollection",
                        panelName: "Choose story collection"
                    }
                ]
            },
            {
                panelID: "page_themeStories",
                panelName: "Theme stories"
            },
            {
                panelID: "page_reviewTrends",
                panelName: "Review trends",
                extraPanels: [
                    {
                        panelID: "panel_addInterpretation",
                        panelName: "Add interpretation"
                    },
                    {
                        panelID: "panel_addToObservation",
                        panelName: "Add to observation"
                    },
                    {
                        panelID: "panel_createOrEditObservation",
                        panelName: "Create new observation"
                    },
                    {
                        panelID: "panel_selectExcerpt",
                        panelName: "Add excerpt to interpretation"
                    },
                    {
                        panelID: "panel_addToExcerpt",
                        panelName: "Add text to excerpt"
                    },
                    {
                        panelID: "panel_createNewExcerpt",
                        panelName: "Create new excerpt"
                    }
                ]
            },
            {
                panelID: "page_reviewExcerpts",
                panelName: "Review excerpts"
            },
            {
                panelID: "page_interpretObservations",
                panelName: "Review and interpret observations"
            },
            {
                panelID: "page_clusterInterpretations",
                panelName: "Cluster interpretations"
            },
            {
                panelID: "page_describePerspectives",
                panelName: "Describe perspectives",
                extraPanels: [
                    {
                        panelID: "panel_addPerspective",
                        panelName: "Add or change perspective"
                    },
                    {
                        panelID: "panel_annotateResultForPerspective",
                        panelName: "Annotate result for perspective"
                    },
                    {
                        panelID: "panel_annotateExcerptForPerspective",
                        panelName: "Annotate excerpt for perspective"
                    },
                    {
                        panelID: "panel_annotateInterpretationForPerspective",
                        panelName: "Annotate interpretation for perspective"
                    }
                ]
            },
            {
                panelID: "page_printCatalysisReport",
                panelName: "Print catalysis report"
            }
        ]
    },
    {
        section: "sensemaking",
        sectionName: "Sensemaking",
        pages: [
            {
                panelID: "page_sensemaking",
                panelName: "Sensemaking"
            },
            {
                panelID: "page_printStoryCards",
                panelName: "Print story cards"
            },
            {
                panelID: "page_planSensemakingSessions",
                panelName: "Plan sensemaking sessions",
                extraPanels: [
                    {
                        panelID: "panel_addSensemakingSessionPlan",
                        panelName: "Enter sensemaking session plan"
                    },
                    {
                        panelID: "panel_addSensemakingSessionActivity",
                        panelName: "Add sensemaking session activity"
                    }
                ]
            },
            {
                panelID: "page_enterSensemakingSessionRecords",
                panelName: "Enter sensemaking session records",
                extraPanels: [
                    {
                        panelID: "panel_addSensemakingSessionRecord",
                        panelName: "Add sensemaking session record"
                    },
                    {
                        panelID: "panel_addResonantStory",
                        panelName: "Add resonant story"
                    },
                    {
                        panelID: "panel_addResonantPattern",
                        panelName: "Add resonant pattern"
                    },
                    {
                        panelID: "panel_newSensemakingSessionOutcome",
                        panelName: "Sensemaking session outcome"
                    },
                    {
                        panelID: "panel_newSensemakingSessionConstruction",
                        panelName: "Sensemaking construction"
                    }
                ]
            }
        ]
    },
    {
        section: "intervention",
        sectionName: "Intervention",
        pages: [
            {
                panelID: "page_intervention",
                panelName: "Intervention"
            },
            {
                panelID: "page_projectOutcomesForIntervention",
                panelName: "Answer questions about project outcomes",
                extraPanels: [
                    {
                        panelID: "panel_projectOutcome",
                        panelName: "Project outcomes"
                    }
                ]
            },
            {
                panelID: "page_designInterventions",
                panelName: "Design intervention plans",
                extraPanels: [
                    {
                        panelID: "panel_addIntervention",
                        panelName: "Plan an intervention"
                    }
                ]
            },
            {
                panelID: "page_recordInterventions",
                panelName: "Enter intervention records",
                extraPanels: [
                    {
                        panelID: "panel_addInterventionRecord",
                        panelName: "Add intervention record"
                    }
                ]
            }
        ]
    },
    {
        section: "return",
        sectionName: "Return",
        pages: [
            {
                panelID: "page_return",
                panelName: "Return"
            },
            {
                panelID: "page_gatherFeedback",
                panelName: "Gather feedback",
                extraPanels: [
                    {
                        panelID: "panel_enterFeedbackPiece",
                        panelName: "Enter piece of feedback on project"
                    }
                ]
            },
            {
                panelID: "page_reflectOnProject",
                panelName: "Reflect on the project"
            },
            {
                panelID: "page_prepareProjectPresentation",
                panelName: "Prepare outline of project presentation",
                extraPanels: [
                    {
                        panelID: "panel_addPresentationElement",
                        panelName: "Add element to project presentation outline"
                    }
                ]
            },
            {
                panelID: "page_projectRequests",
                panelName: "Respond to requests for post-project support",
                extraPanels: [
                    {
                        panelID: "panel_addNewReturnRequest",
                        panelName: "Enter project request"
                    }
                ]
            }
        ]
    }
];

export = sections;