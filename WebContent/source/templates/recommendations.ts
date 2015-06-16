import kludgeForUseStrict = require("../kludgeForUseStrict");
"use strict";

var recommendations = {
    "categories": {
        "Eliciting questions": [
            "directed questions",
            "undirected questions",
            "point in time",
            "event",
            "extreme",
            "surprise",
            "change",
            "people places things",
            "fictional scenario",
            "menu method (choose a question)",
            "multiple questions per person"
        ],
        "storyQuestions": [
            "questions about story form",
            "questions about story function",
            "questions about story phenomenon",
            "questions using story elements",
            "choice list (ordinal)",
            "choice list (nominal)",
            "choice list (nominal with middle option)",
            "range (unipolar)",
            "range (bipolar)",
            "visual range",
            "word range",
            "free text"
        ],
        "participantQuestions": [
            "questions about demographics",
            "questions about personality",
            "questions about role in community",
            "questions about views on issues",
            "questions about views on community"
        ],
        "Venues": [
            "individual interviews",
            "group interviews",
            "peer interviews",
            "group story sessions",
            "survey (web)",
            "survey (email)",
            "survey (paper)",
            "journals",
            "narrative incident reports",
            "gleaned stories"
        ],
        "collectionSessions": [
            "inviting via command",
            "inviting via networks",
            "inviting via broadcasting",
            "inviting via advertisement",
            "inviting via spontaneous sessions",
            "mixing groups in one session",
            "paying people to come",
            "gifting",
            "background music",
            "virtual sessions",
            "long sessions",
            "exploring fiction",
            "encouraging competition",
            "high facilitation",
            "intermittent facilitation",
            "available facilitation",
            "no facilitation",
            "video recording",
            "audio recording",
            "note taking",
            "twice-told stories",
            "timeline",
            "landscape",
            "story elements"
        ],
        "sensemakingSessions": [
            "inviting via command",
            "inviting via networks",
            "inviting via broadcasting",
            "inviting via advertisement",
            "inviting via spontaneous sessions",
            "mixing groups in one session",
            "paying people to come",
            "gifting",
            "background music",
            "virtual sessions",
            "long sessions",
            "exploring fiction",
            "encouraging competition",
            "high facilitation",
            "intermittent facilitation",
            "available facilitation",
            "no facilitation",
            "video recording",
            "audio recording",
            "note taking",
            "twice-told stories",
            "timeline",
            "landscape",
            "story elements",
            "composite stories"
        ],
        "interventions": [
            "narrative ombudsmen",
            "narrative suggestion boxes",
            "story-sharing spaces",
            "narrative orientations",
            "narrative learning resources",
            "narrative simulation",
            "narrative presentations",
            "dramatic action",
            "sensemaking spaces",
            "sensemaking pyramids",
            "narrative mentoring",
            "narrative therapy",
            "participatory theatre",
            "combined interventions"
        ]
    },
    "questions": {
        "participantGroup_status": [
            "unknown",
            "very low",
            "low",
            "moderate",
            "high",
            "very high",
            "mixed"
        ],
        "participantGroup_confidence": [
            "unknown",
            "very low",
            "low",
            "medium",
            "high",
            "very high",
            "mixed"
        ],
        "participantGroup_time": [
            "unknown",
            "very little",
            "little",
            "some",
            "a lot",
            "mixed"
        ],
        "participantGroup_education": [
            "unknown",
            "illiterate",
            "minimal",
            "moderate",
            "high",
            "very high",
            "mixed"
        ],
        "participantGroup_physicalDisabilities": [
            "unknown",
            "none",
            "minimal",
            "moderate",
            "strong",
            "mixed"
        ],
        "participantGroup_emotionalImpairments": [
            "unknown",
            "none",
            "minimal",
            "moderate",
            "strong",
            "mixed"
        ],
        "participantGroup_performing": [
            "unknown",
            "very unimportant",
            "somewhat unimportant",
            "somewhat important",
            "very important",
            "mixed"
        ],
        "participantGroup_conforming": [
            "unknown",
            "very unimportant",
            "somewhat unimportant",
            "somewhat important",
            "very important",
            "mixed"
        ],
        "participantGroup_promoting": [
            "unknown",
            "very unimportant",
            "somewhat unimportant",
            "somewhat important",
            "very important",
            "mixed"
        ],
        "participantGroup_venting": [
            "unknown",
            "very unimportant",
            "somewhat unimportant",
            "somewhat important",
            "very important",
            "mixed"
        ],
        "participantGroup_interest": [
            "unknown",
            "very little",
            "a little",
            "some",
            "a lot",
            "extremely",
            "mixed"
        ],
        "participantGroup_feelings_project": [
            "unknown",
            "negative",
            "neutral",
            "positive",
            "mixed"
        ],
        "participantGroup_feelings_facilitator": [
            "unknown",
            "negative",
            "neutral",
            "positive",
            "mixed"
        ],
        "participantGroup_feelings_stories": [
            "unknown",
            "negative",
            "neutral",
            "positive",
            "mixed"
        ],
        "participantGroup_topic_feeling": [
            "unknown",
            "strongly negative",
            "negative",
            "neutral",
            "positive",
            "strongly positive",
            "mixed"
        ],
        "participantGroup_topic_private": [
            "unknown",
            "very private",
            "medium",
            "not private",
            "mixed"
        ],
        "participantGroup_topic_articulate": [
            "unknown",
            "hard",
            "medium",
            "easy",
            "mixed"
        ],
        "participantGroup_topic_timeframe": [
            "unknown",
            "hours",
            "days",
            "months",
            "years",
            "decades",
            "mixed"
        ],
        "aboutYou_experience": [
            "none",
            "a little",
            "some",
            "a lot"
        ],
        "aboutYou_help": [
            "none",
            "a little",
            "some",
            "a lot"
        ],
        "aboutYou_tech": [
            "none",
            "a little",
            "some",
            "a lot"
        ]
    },
    "recommendations": {
        "participantGroup_status": {
            "unknown": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "very low": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "low": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "moderate": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "high": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "very high": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "mixed": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            }
        },
        "participantGroup_confidence": {
            "unknown": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "very low": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "low": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "medium": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "high": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "very high": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "mixed": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            }
        },
        "participantGroup_time": {
            "unknown": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "very little": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "little": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "some": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "a lot": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "mixed": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            }
        },
        "participantGroup_education": {
            "unknown": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "illiterate": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "minimal": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "moderate": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "high": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "very high": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "mixed": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            }
        },
        "participantGroup_physicalDisabilities": {
            "unknown": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "none": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "minimal": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "moderate": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "strong": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "mixed": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            }
        },
        "participantGroup_emotionalImpairments": {
            "unknown": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "none": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "minimal": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "moderate": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "strong": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "mixed": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            }
        },
        "participantGroup_performing": {
            "unknown": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "very unimportant": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "somewhat unimportant": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "somewhat important": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "very important": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "mixed": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            }
        },
        "participantGroup_conforming": {
            "unknown": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "very unimportant": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "somewhat unimportant": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "somewhat important": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "very important": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "mixed": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            }
        },
        "participantGroup_promoting": {
            "unknown": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "very unimportant": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "somewhat unimportant": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "somewhat important": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "very important": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "mixed": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            }
        },
        "participantGroup_venting": {
            "unknown": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "very unimportant": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "somewhat unimportant": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "somewhat important": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "very important": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "mixed": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            }
        },
        "participantGroup_interest": {
            "unknown": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "very little": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "a little": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "some": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "a lot": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "extremely": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "mixed": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            }
        },
        "participantGroup_feelings_project": {
            "unknown": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "negative": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "neutral": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "positive": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "mixed": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            }
        },
        "participantGroup_feelings_facilitator": {
            "unknown": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "negative": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "neutral": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "positive": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "mixed": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            }
        },
        "participantGroup_feelings_stories": {
            "unknown": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "negative": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "neutral": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "positive": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "mixed": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            }
        },
        "participantGroup_topic_feeling": {
            "unknown": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "strongly negative": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "negative": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "neutral": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "positive": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "strongly positive": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "mixed": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            }
        },
        "participantGroup_topic_private": {
            "unknown": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "very private": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "medium": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "not private": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "mixed": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            }
        },
        "participantGroup_topic_articulate": {
            "unknown": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "hard": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "medium": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "easy": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "mixed": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            }
        },
        "participantGroup_topic_timeframe": {
            "unknown": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "hours": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "days": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "months": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "years": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "decades": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "mixed": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            }
        },
        "aboutYou_experience": {
            "none": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "a little": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "some": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "a lot": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            }
        },
        "aboutYou_help": {
            "none": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "a little": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "some": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "a lot": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            }
        },
        "aboutYou_tech": {
            "none": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "a little": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "some": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            },
            "a lot": {
                "storyQuestions": {
                    "choice": "",
                    "range": "",
                    "free text": ""
                },
                "Venues": {
                    "individual interviews": "",
                    "group interviews": "",
                    "peer interviews": "",
                    "group story sessions": "",
                    "surveys": "",
                    "journals": "",
                    "narrative incident reports": "",
                    "gleaned stories": ""
                }
            }
        }
    }
};

export = recommendations;
