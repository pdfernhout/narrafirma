// Generated from design
"use strict";

define(function() {

  var templates = [
    {
        "id": "elicitationQuestions",
        "name": "Elicitation questions",
        "description": "",
        "isHeader": false,
        "type": "page",
        "questions": [
            {
                "id": "topic_timeWhenYouFelt",
                "shortName": "Time when you felt",
                "text": "Was there ever a time when you felt _____? What happened then?",
                "category": "Topic",
                "type": "label"
            },
            {
                "id": "topic_everThought",
                "shortName": "Ever thought",
                "text": "Have you ever thought ____? What happened that made you think that?",
                "category": "Topic",
                "type": "label"
            },
            {
                "id": "topic_causedAChange",
                "shortName": "Caused a change",
                "text": "Was there ever a change in your ___ about ___? What happened that caused the change?",
                "category": "Topic",
                "type": "label"
            },
            {
                "id": "topic_doingSomethingBecauseYouFelt",
                "shortName": "Doings something because felt",
                "text": "Can you remember ever ____ because you felt ___? What happened that made you feel that way?",
                "category": "Topic",
                "type": "label"
            },
            {
                "id": "topic_aTimeWhenYouSomethingBecauseOf",
                "shortName": "You something because of",
                "text": "Think of a time when you ____ because of ____.",
                "category": "Topic",
                "type": "label"
            },
            {
                "id": "time_whatHappenedFirstTime",
                "shortName": "First or last time",
                "text": "What happened the (first, last, most recent) time you ____?",
                "category": "Point in time (specific)",
                "type": "label"
            },
            {
                "id": "time_yourSomething",
                "shortName": "About your event",
                "text": "Tell me about your ___. What happened during it?",
                "category": "Point in time (specific)",
                "type": "label"
            },
            {
                "id": "time_whatJustHappened",
                "shortName": "What just happened",
                "text": "What just happened? Can you tell us about it?",
                "category": "Point in time (specific)",
                "type": "label"
            },
            {
                "id": "time_mostMemorable",
                "shortName": "Most memorable",
                "text": "What was the most memorable ___ during ____?",
                "category": "Point in time (memorable)",
                "type": "label"
            },
            {
                "id": "time_standsOutInMemory",
                "shortName": "Stands out in memory",
                "text": "Was there a time during ___ that stands out in your memory?",
                "category": "Point in time (memorable)",
                "type": "label"
            },
            {
                "id": "time_momentWasMostSomething",
                "shortName": "Moment was most something",
                "text": "What moment during ___ was most ____ to you? What happened in that moment?",
                "category": "Point in time (memorable)",
                "type": "label"
            },
            {
                "id": "time_happenedThatMadeYouFeel",
                "shortName": "Made you feel",
                "text": "During ____, did anything happen that made you feel ___? What was it that happened?",
                "category": "Point in time (emotion)",
                "type": "label"
            },
            {
                "id": "time_mostSomethingHour",
                "shortName": "Most something hour",
                "text": "What has been your (most, least) ___ hour as a ____?",
                "category": "Point in time (emotion)",
                "type": "label"
            },
            {
                "id": "time_whenYouFelt",
                "shortName": "When you felt",
                "text": "Was there ever a time during ____ when you felt ___? What happened that made you feel that way?",
                "category": "Point in time (emotion)",
                "type": "label"
            },
            {
                "id": "time_feltTopicWas",
                "shortName": "Felt topic was",
                "text": "Was there ever a moment when you felt that (a project topic) was ___?",
                "category": "Point in time (topic)",
                "type": "label"
            },
            {
                "id": "time_foundYourselfMost",
                "shortName": "Found yourself most"w,
                "text": "At what point during ____ did you find yourself the most (project topic)?",
                "category": "Point in time (topic)",
                "type": "label"
            },
            {
                "id": "time_emotionWasInState",
                "shortName": "Emotion was in state",
                "text": "Recall for us a moment when (an emotion) was (in a state) during ____.",
                "category": "Point in time (topic)",
                "type": "label"
            },
            {
                "id": "event_standsOut",
                "shortName": "Event stands out",
                "text": "What event most stands out in your mind during ____?",
                "category": "Event (memorable)",
                "type": "label"
            },
            {
                "id": "event_willRemember",
                "shortName": "Will remember",
                "text": "Did anything happen (today, this week, etc) that you will remember for a long time?",
                "category": "Event (memorable)",
                "type": "label"
            },
            {
                "id": "event_importantToYou",
                "shortName": "Important to you",
                "text": "Can you describe an incident in the past (day, week, etc) that is important to you?",
                "category": "Event (memorable)",
                "type": "label"
            },
            {
                "id": "event_causedToFeel",
                "shortName": "Cause you to feel",
                "text": "Did any particular event or incident cause you to feel ___ during ____?",
                "category": "Event (emotion)",
                "type": "label"
            },
            {
                "id": "event_feltSomething",
                "shortName": "Felt something",
                "text": "Tell me about a time when you felt ____. What happened?",
                "category": "Event (emotion)",
                "type": "label"
            },
            {
                "id": "event_feltSomethignWasSomething",
                "shortName": "Felt something was something",
                "text": "Can you recall a situation when you felt that ____ was _____?",
                "category": "Event (emotion)",
                "type": "label"
            },
            {
                "id": "event_proverb",
                "shortName": "Proverb",
                "text": "When you consider the (motto, saying, proverb) ____, was there a moment during ____ when you felt that this (motto, saying, proverb) was especially ____?",
                "category": "Event (topic)",
                "type": "label"
            },
            {
                "id": "event_situationInWhich",
                "shortName": "Situation in which",
                "text": "Could you tell us about a situation in which ___ was ____?",
                "category": "Event (topic)",
                "type": "label"
            },
            {
                "id": "event_madeYouThink",
                "shortName": "Made you think",
                "text": "Did you ever experience anything that made you think ____? What happened?",
                "category": "Event (topic)",
                "type": "label"
            },
            {
                "id": "extreme_highOrLowPoint",
                "shortName": "High or low point",
                "text": "Can you recall the (highlight, lowest point) of ___?",
                "category": "Extreme (in general)",
                "type": "label"
            },
            {
                "id": "extreme_bestOrWorstThing",
                "shortName": "Best or worst thing",
                "text": "What was the (best, worst) thing that ever happened during ____?",
                "category": "Extreme (in general)",
                "type": "label"
            },
            {
                "id": "extreme_bestOrWorstMoment",
                "shortName": "Best or worst moment",
                "text": "What was the (best, worst) moment of ____?",
                "category": "Extreme (in general)",
                "type": "label"
            },
            {
                "id": "extreme_feltTheMost",
                "shortName": "Felt the most",
                "text": "During ____, when did you feel the most ___? What happened that made you feel that way?",
                "category": "Extreme (emotion)",
                "type": "label"
            },
            {
                "id": "extreme_saidToThemselves",
                "shortName": "Said to yourself",
                "text": "During ____, did you ever say to yourself, \"This the ____ moment in this ____?\" What happened during that moment?",
                "category": "Extreme (emotion)",
                "type": "label"
            },
            {
                "id": "extreme_highOrLowLevel",
                "shortName": "High or low level",
                "text": "What was the (highest, lowest) level of ____ you felt during ____? What happened when you felt that?",
                "category": "Extreme (emotion)",
                "type": "label"
            },
            {
                "id": "extreme_thinkBackOver",
                "shortName": "Think back over",
                "text": "Think back over ___. When was ___ the most ____? What happened then?",
                "category": "Extreme (topic)",
                "type": "label"
            },
            {
                "id": "extreme_neverSeenSuch",
                "shortName": "Never seen such",
                "text": "Did you ever think, \"I've never seen such ___\"? What happened that made you think that?",
                "category": "Extreme (topic)",
                "type": "label"
            },
            {
                "id": "extreme_momentYouCanRecall",
                "shortName": "Moment you can recall",
                "text": "As you look back on ____, what is the ____ moment you can recall with respect to ____? What happened during that moment?",
                "category": "Extreme (topic)",
                "type": "label"
            },
            {
                "id": "surprise_timeWhenSurprised",
                "shortName": "Time when surprised",
                "text": "Can you remember a time when you were surprised at how ____?",
                "category": "Surprise",
                "type": "label"
            },
            {
                "id": "surprise_somethingSurprisedYou",
                "shortName": "Something surprised you",
                "text": "As you remember ____, can you think of a time when ___ surprised you?",
                "category": "Surprise",
                "type": "label"
            },
            {
                "id": "surprise_aSuprisingSomething",
                "shortName": "A surprising something",
                "text": "Can you tell us about a surprising ____ during ____?",
                "category": "Surprise",
                "type": "label"
            },
            {
                "id": "change_momentOfChange",
                "shortName": "Moment of change",
                "text": "Was there ever a moment during ___ when ___ changed? What happened?",
                "category": "Change",
                "type": "label"
            },
            {
                "id": "change_feelAChange",
                "shortName": "Feel a change",
                "text": "Did you ever feel a change in ____? What caused you to feel that a change was taking place?",
                "category": "Change",
                "type": "label"
            },
            {
                "id": "change_turningPoint",
                "shortName": "Turning point",
                "text": "Looking back over ____, can you pick out a turning point in ____? What happened during that turning point?",
                "category": "Change",
                "type": "label"
            },
            {
                "id": "person_whenMetPerson",
                "shortName": "When met person",
                "text": "What was it like the ____ time you met ___? What happened?",
                "category": "Person",
                "type": "label"
            },
            {
                "id": "person_timeYouDidSomethingWithPerson",
                "shortName": "Did something with person",
                "text": "Can you tell us about the ___ when you ___ with ___?",
                "category": "Person",
                "type": "label"
            },
            {
                "id": "person_bestExplains",
                "shortName": "Best explains",
                "text": "What experience with ____ best explains ____?",
                "category": "Person",
                "type": "label"
            },
            {
                "id": "group_joinedLeft",
                "shortName": "Joined or left",
                "text": "Do you remember the ___ when you (joined, left, did something with) ___? What happened during that ___?",
                "category": "Group",
                "type": "label"
            },
            {
                "id": "group_decisionTo",
                "shortName": "Decision to",
                "text": "Can you remember making the decision to ___ with ____? What were you thinking about at the time?",
                "category": "Group",
                "type": "label"
            },
            {
                "id": "group_standsOut",
                "shortName": "Stands out",
                "text": "Recall a ___ with ___ that stands out in your memory.",
                "category": "Group",
                "type": "label"
            },
            {
                "id": "place_didSomethingAt",
                "shortName": "Did something at",
                "text": "Do you remember the ___ time you ___ at ___? What happened?",
                "category": "Place",
                "type": "label"
            },
            {
                "id": "place_rememberHappening",
                "shortName": "Remember happening",
                "text": "When you (arrived at, left, did something at) ____, what do you remember happening?",
                "category": "Place",
                "type": "label"
            },
            {
                "id": "place_madeYouThink",
                "shortName": "Made you think",
                "text": "Did anything ever happen at ___ that made you think: that's what this place is like? What was it?",
                "category": "Place",
                "type": "label"
            },
            {
                "id": "object_momentSpringsToMind",
                "shortName": "Moment springs to mind",
                "text": "When you look at this ___, what moment springs to mind?",
                "category": "Object",
                "type": "label"
            },
            {
                "id": "object_whatWereYouThinking",
                "shortName": "What were you thinking",
                "text": "When you first saw ____, what were you thinking? What happened during that encounter?",
                "category": "Object",
                "type": "label"
            },
            {
                "id": "object_especiallySomethingMoments",
                "shortName": "Especially something moments",
                "text": "Can you recall any especially _____ moments (using, holding, etc) this ____?",
                "category": "Object",
                "type": "label"
            },
            {
                "id": "scenario_aboutTo",
                "shortName": "About to",
                "text": "If someone told you that they were about to ___, what story about your experiences with ___ would you tell them?",
                "category": "Fictional scenario",
                "type": "label"
            },
            {
                "id": "scenario_someoneTellsYou",
                "shortName": "Someone tells you",
                "text": "Say someone tells you that ___. Say you want to ___. What would you tell them about your experiences with ___ to ___ them?",
                "category": "Fictional scenario",
                "type": "label"
            },
            {
                "id": "scenario_yearsInThe",
                "shortName": "Years in the",
                "text": "If you found yourself suddenly ____ years in the ___, what would you tell people about your experiences with ____ that would help them understand?",
                "category": "Fictional scenario",
                "type": "label"
            }
        ]
    },
    {
        "id": "storyQuestions",
        "name": "Story questions",
        "description": "",
        "isHeader": false,
        "type": "page",
        "questions": [
            {
                "id": "howFeel",
                "text": "How do you feel about this story?",
                "shortName": "Feel about",
                "category": "Value",
                "type": "select",
                "options": "happy;sad;angry;relieved;enthused;indifferent;not sure"
            },
            {
                "id": "emotionalIntensity",
                "text": "How would you rate the emotional intensity of this story?",
                "shortName": "Emotional intensity",
                "category": "Value",
                "type": "slider",
                "options": "strongly negative;strongly positive"
            },
            {
                "id": "howMemorable",
                "text": "How long do you think you will remember this story?",
                "shortName": "How memorable",
                "category": "Value",
                "type": "slider",
                "options": "I've already forgotten it;I'll remember it all my life"
            },
            {
                "id": "howImportantToMe",
                "text": "How important is this story to you? How much does it matter?",
                "shortName": "How important to me",
                "category": "Value",
                "type": "slider",
                "options": "trivial;huge"
            },
            {
                "id": "howImportantToOthers",
                "text": "How important do you think this story is to (other people, another group) in (the community or organization)? How much does it matter to them?",
                "shortName": "How important to others",
                "category": "Value",
                "type": "slider",
                "options": "trivial;huge"
            },
            {
                "id": "desiredImportanceToOthers",
                "text": "How important would you like this story to be to (other people, another group) in (the community or organization)? How much do you want it to matter to them?",
                "shortName": "Desired importance to others",
                "category": "Value",
                "type": "slider",
                "options": "trivial;huge"
            },
            {
                "id": "howLongAgo",
                "text": "How long ago did the events in this story take place?",
                "shortName": "How long ago",
                "category": "Setting",
                "type": "slider",
                "options": "ten years;it just happened"
            },
            {
                "id": "duringHistory",
                "text": "At what point during the history of your interaction with (the topic) did the events in this story happen?",
                "shortName": "When during history",
                "category": "Setting",
                "type": "select",
                "options": "fill in your own relevant choices;choice 2;choice 3;not sure"
            },
            {
                "id": "whereTookPlace",
                "text": "Where did the events of this story take place?",
                "shortName": "Where took place",
                "category": "Setting",
                "type": "select",
                "options": "fill in your own relevant choices; choice 2; choice 3; not sure"
            },
            {
                "id": "timePeriod",
                "text": "Over what period of time did the events in this story take place?",
                "shortName": "Time period",
                "category": "Setting",
                "type": "slider",
                "options": "moments;decades"
            },
            {
                "id": "whatChanged",
                "text": "What changed in this story?",
                "shortName": "What changed",
                "category": "Change",
                "type": "select",
                "options": "fill in your own relevant choices; choice 2; choice 3; not sure"
            },
            {
                "id": "whatDidNotChange",
                "text": "What did not change in this story?",
                "shortName": "What did not change",
                "category": "Change",
                "type": "select",
                "options": "fill in your own relevant choices;choice 2; choice 3;not sure"
            },
            {
                "id": "whoWasAffectedByChanges",
                "text": "Who was affected by the changes in this story?",
                "shortName": "Who was affected by changes",
                "category": "Change",
                "type": "select",
                "options": "fill in your own relevant choices;choice 2;choice 3;not sure"
            },
            {
                "id": "whoWasUnaffectedByChanges",
                "text": "Who was unaffected by the changes in this story?",
                "shortName": "Who was unaffected by changes",
                "category": "Change",
                "type": "select",
                "options": "fill in your own relevant choices;choice 2;choice 3;not sure"
            },
            {
                "id": "storyHoldsTogether",
                "text": "How well would you say this story holds together? If it were a machine, how well would it work?",
                "shortName": "Story holds together",
                "category": "Evaluation",
                "type": "slider",
                "options": "horribly;perfectly"
            },
            {
                "id": "storyHasHoles",
                "text": "Is there anything missing from this story? Does it have any holes in it?",
                "shortName": "Story has holes",
                "category": "Evaluation",
                "type": "slider",
                "options": "nothing is missing;there are large gaps in the story"
            },
            {
                "id": "storyRingsTrue",
                "text": "Does this story ring true? Does it match with other stories you know about?",
                "shortName": "Story rings true",
                "category": "Evaluation",
                "type": "slider",
                "options": "it connects perfectly with all other experience;something about it doesn't seem right"
            },
            {
                "id": "elementsConflictHowMuch",
                "text": "How much conflict do you see in this story?",
                "category": "Elements",
                "type": "textarea"
            },
            {
                "id": "elementsConflictDescribe",
                "text": "Describe any conflicts you see in this story.",
                "category": "Elements",
                "type": "textarea"
            },
            {
                "id": "elementsCooperationHowMuch",
                "text": "How much cooperation do you see in this story?",
                "category": "Elements",
                "type": "textarea"
            },
            {
                "id": "elementsCooperationDescribe",
                "text": "Describe any cooperation you see in this story.",
                "category": "Elements",
                "type": "textarea"
            },
            {
                "id": "elementsDangerHowMuch",
                "text": "How much danger do you see in this story?",
                "category": "Elements",
                "type": "textarea"
            },
            {
                "id": "elementsDangerDescribe",
                "text": "Describe any dangers you see in this story.",
                "category": "Elements",
                "type": "textarea"
            },
            {
                "id": "elementsOpportunityHowMuch",
                "text": "How much opportunity do you see in this story?",
                "category": "Elements",
                "type": "textarea"
            },
            {
                "id": "elementsOpportunityDescribe",
                "text": "Describe any opportunities you see in this story.",
                "category": "Elements",
                "type": "textarea"
            },
            {
                "id": "whyTold",
                "text": "Why was this story told?",
                "shortName": "Why told",
                "category": "Origin",
                "type": "select",
                "options": "to educate;to explain;to inform;to persuade;to reminisce;to complain;to entertain;not sure"
            },
            {
                "id": "whereCameFrom",
                "text": "Where did this story come from?",
                "shortName": "Where came from",
                "category": "Origin",
                "type": "select",
                "options": "it happened to me;it happened to someone I know;it happened to someone I don't know;I heard about it;it's a rumor;it's made up;not sure"
            },
            {
                "id": "howTrue",
                "text": "How factually true is this story?",
                "shortName": "How true",
                "category": "Origin",
                "type": "slider",
                "options": "it happened just as it was told;it's totally made up"
            },
            {
                "id": "whyStoryChosen",
                "text": "Why do you think this particular story was chosen to be told just when it was?",
                "shortName": "Why story chosen",
                "category": "Origin",
                "type": "select",
                "options": "it seemed to fit;it followed another story;it needed to be told;the teller wanted to tell it;it seemed helpful;not sure"
            },
            {
                "id": "commonOrRare",
                "text": "Based on what you know of (the community or organization or topic), do you consider the events described in this story to be common or rare?",
                "shortName": "Common or rare",
                "category": "Community",
                "type": "slider",
                "options": "happens to everyone;happens to one in a million"
            },
            {
                "id": "scopeInvolved",
                "text": "What scope of (the community or organization) is involved in this story?",
                "shortName": "Scope involved",
                "category": "Community",
                "type": "slider",
                "options": "one person;everyone"
            },
            {
                "id": "rolesInvolved",
                "text": "Which of these roles were involved in this story?",
                "shortName": "Roles involved",
                "category": "Community",
                "type": "checkboxes",
                "options": "fill in your own relevant choices;choice 2;choice 3;not sure"
            },
            {
                "id": "groupsInvolved",
                "text": "Which groups of people were involved in this story?",
                "shortName": "Groups involved",
                "category": "Community",
                "type": "checkboxes",
                "options": "fill in your own relevant choices; choice 2; choice 3;not sure"
            },
            {
                "id": "strengthOfImpactIfHeard",
                "text": "If this story was more widely heard, how strong would its impact be on (the community or organization)?",
                "shortName": "Strength of impact if heard",
                "category": "Community",
                "type": "slider",
                "options": "no impact;it would change everything"
            },
            {
                "id": "impactIfHeard",
                "text": "If this story was more widely heard, what impact would that have on (the community or organization)?",
                "shortName": "Impact if heard",
                "category": "Community",
                "type": "textarea",
                "options": ""
            },
            {
                "id": "groupsNeedToHearStory",
                "text": "Which of these groups particularly need to hear this story?",
                "shortName": "Groups need to hear story",
                "category": "Community",
                "type": "checkboxes",
                "options": "fill in your own relevant choices;choice 2;choice 3;not sure"
            },
            {
                "id": "groupsHaveNotHeardStory",
                "text": "Which of these groups is not likely to have ever heard this type of story before?",
                "shortName": "Groups have never heard story",
                "category": "Community",
                "type": "checkboxes",
                "options": "fill in your own relevant choices;choice 2;choice 3;not sure"
            },
            {
                "id": "groupsWillNotHearStory",
                "text": "In which of these groups will people refuse to hear this story?",
                "shortName": "Groups will not hear story",
                "category": "Community",
                "type": "checkboxes",
                "options": "fill in your own relevant choices;choice 2;choice 3;not sure"
            },
            {
                "id": "groupsWillGetNewEnergy",
                "text": "To which of these groups will this story give new energy to solve problems?",
                "shortName": "Groups will get new energy",
                "category": "Community",
                "type": "checkboxes",
                "options": "fill in your own relevant choices;choice 2;choice 3;not sure"
            },
            {
                "id": "groupsWillLoseEnergy",
                "text": "For which of these groups will this story drain their energy?",
                "shortName": "Groups will lose energy",
                "category": "Community",
                "type": "checkboxes",
                "options": "fill in your own relevant choices;choice 2;choice 3;not sure"
            },
            {
                "id": "storySaysAbout",
                "text": "What does this story say to you about (rules, cooperation, trust, power, etc)?",
                "shortName": "Story says about",
                "category": "Community",
                "type": "textarea",
                "options": ""
            },
            {
                "id": "storySaysToOthersAbout",
                "text": "What do you think this story says to (other people, another group) about (rules, cooperation, trust, power, etc)?",
                "shortName": "Story says to others about",
                "category": null,
                "type": "textarea",
                "options": ""
            },
            {
                "id": "otherViewsOnValue",
                "text": "Do you think (other people, another group) in (the community or organization) would say that this story turned out well?",
                "shortName": "Other views on value",
                "category": "Other views",
                "type": "slider",
                "options": "they would say it turned out horribly;they would say it turned out perfectly"
            },
            {
                "id": "otherViewsOnCommonality",
                "text": "Do you think (other people, another group) in (the community or organization) would say the events in this story were common?",
                "shortName": "Other views on commonality",
                "category": "Other views",
                "type": "slider",
                "options": "they would say it was common;they would say it was rare"
            },
            {
                "id": "otherViewsOnWhyTold",
                "text": "Why do you think (other people, another group) in (the community or organization) would say this story was told?",
                "shortName": "Other views on why told",
                "category": "Other views",
                "type": "select",
                "options": "to educate;to explain;to inform;to persuade;to reminisce;to complain;to entertain;not sure"
            },
            {
                "id": "otherViewsOnMemorability",
                "text": "How long do you think (other people, another group) in (the community or organization) would remember this story?",
                "shortName": "Other views on memorability",
                "category": "Other views",
                "type": "slider",
                "options": "they would have forgotten it already;they would remember it all of their lives"
            },
            {
                "id": "feelingsAboutOtherViewsOnValue",
                "text": "Would you like (other people, another group) in (the community or organization) to say that this story turned out well?",
                "shortName": "Feelings about other views on value",
                "category": "Feelings about other views",
                "type": "slider",
                "options": "I would like them to say that it turned out horribly;I would like them to say that it turned out perfectly"
            },
            {
                "id": "feelingsAboutOtherViewsOnCommonality",
                "text": "Would you like (other people, another group) in (the community or organization) to say that the events in this story were common?",
                "shortName": "Feelings about other views on commonality",
                "category": "Feelings about other views",
                "type": "slider",
                "options": "I would like them to say it was common;I would like them to say it was rare"
            },
            {
                "id": "feelingsaboutOtherViewsOnWhyTold",
                "text": "What would you like (other people, another group) in (the community or organization) to say about why this story was told?",
                "shortName": "Feelings about other views on why told",
                "category": "Feelings about other views",
                "type": "select",
                "options": "to educate;to explain;to inform;to persuade;to reminisce;to complain;to entertain;not sure"
            },
            {
                "id": "feelingsAboutOtherViewsOnMemorability",
                "text": "How long would you like (other people, another group) in (the community or organization) to remember this story?",
                "shortName": "Feelings about other views on memorability",
                "category": "Feelings about other views",
                "type": "slider",
                "options": "I would like them have forgotten it already;I would like them to remember it all of their lives"
            },
            {
                "id": "topicWouldYouSay",
                "text": "Would you say that the people in this story ____?",
                "category": "Project topics",
                "type": "textarea"
            },
            {
                "id": "topicFeltAbout",
                "text": "What do you think the people in this story felt about ____?",
                "category": "Project topics",
                "type": "textarea"
            },
            {
                "id": "topicMoreOrLess",
                "text": "Did this story make you feel more or less ___ about ___?",
                "category": "Project topics",
                "type": "textarea"
            },
            {
                "id": "topicSayToYou",
                "text": "What does this story say to you about ____?",
                "category": "Project topics",
                "type": "textarea"
            },
            {
                "id": "topicChangeHowYouSee",
                "text": "Does this story change how you see ___? If so, how?",
                "category": "Project topics",
                "type": "textarea"
            },
            {
                "id": "topicChooseAStory",
                "text": "If you were to choose a story to tell about ____, would you choose this one? Why or why not?",
                "category": "Project topics",
                "type": "textarea"
            },
            {
                "id": "mainCharacter",
                "text": "Who (or what) was the main character in this story? Who was it about?",
                "shortName": "Main character",
                "category": "Main character",
                "type": "select",
                "options": "fill in your own relevant choices;choice 2 choice 3;not sure"
            },
            {
                "id": "endedWell",
                "text": "From the perspective of this story's main character, would you say the story ended well or badly?",
                "shortName": "Ended well",
                "category": "Main character",
                "type": "slider",
                "options": "horribly;perfectly"
            },
            {
                "id": "wantOrNeed",
                "text": "In this story, what did the main character want or need?",
                "shortName": "Want or need",
                "category": "Main character",
                "type": "select",
                "options": "resources;help;support;information;respect;trust;not sure"
            },
            {
                "id": "strengthOfWant",
                "text": "How much did the story's main character want or need what they wanted or needed?",
                "shortName": "Strength of want",
                "category": "Main character",
                "type": "slider",
                "options": "not at all;too much"
            },
            {
                "id": "gotWhatWanted",
                "text": "Did the story's main character get what they wanted or needed?",
                "shortName": "Got what wanted",
                "category": "Main character",
                "type": "slider",
                "options": "nothing at all;too much"
            },
            {
                "id": "whoHelped",
                "text": "Who or what helped the story's main character get what they wanted or needed?",
                "shortName": "Helped",
                "category": "Main character",
                "type": "select",
                "options": "fill in your own relevant choices;choice 2 choice 3;not;not sure"
            },
            {
                "id": "amountOfHelp",
                "text": "How much help did the main character get?",
                "shortName": "Amount of help",
                "category": "Main character",
                "type": "slider",
                "options": "none;more than they needed"
            },
            {
                "id": "whoHindered",
                "text": "Who or what hindered the story's main character in getting what they wanted or needed?",
                "shortName": "Hindered",
                "category": "Main character",
                "type": "select",
                "options": "fill in your own relevant choices;choice 2 choice 3;not;not sure"
            },
            {
                "id": "amountOfHindrance",
                "text": "How much hindrance did the main character face in getting what they needed?",
                "shortName": "Amount of hindrance",
                "category": "Main character",
                "type": "slider",
                "options": "none;a crushing amount"
            },
            {
                "id": "thingsThatWouldHaveHelped",
                "text": "Which of these things, if they had been available to the main character of the story, would have helped them to get what they wanted or needed?",
                "shortName": "Would have helped",
                "category": "Main character",
                "type": "select",
                "options": "fill in your own relevant choices;not sure"
            }
        ]
    },
    {
        "id": "participantQuestions",
        "name": "Participant questions",
        "description": "",
        "isHeader": false,
        "type": "page",
        "questions": [
            {
                "id": "ageRange",
                "text": "Which age range do you fall into?",
                "shortName": "Age",
                "category": "Demographics",
                "type": "select",
                "options": "<25;25-34;35-44;45-64;65-74;75+"
            },
            {
                "id": "gender",
                "text": "What is your gender?",
                "category": "Demographics",
                "type": "select",
                "options": "male;female"
            },
            {
                "id": "rentOrOwn",
                "text": "Do you rent or own your home?",
                "shortName": "Rent or own",
                "category": "Demographics",
                "type": "select",
                "options": "rent;own"
            },
            {
                "id": "incomeLevel",
                "text": "What is your income level?",
                "category": "Demographics",
                "type": "select",
                "options": "put in your own levels here"
            },
            {
                "id": "educationLevel",
                "text": "How much education have you completed?",
                "category": "Demographics",
                "type": "select",
                "options": "high school;college;post-graduate;trade;other"
            },
            {
                "id": "maritalStatus",
                "text": "What is your marital staus?",
                "category": "Demographics",
                "type": "select",
                "options": "single;married;widowed;divorced;other"
            },
            {
                "id": "children",
                "text": "How many children do you have?",
                "category": "Demographics",
                "type": "select",
                "options": "none;1;2;3;4;5;6;7;8;9;10"
            },
            {
                "id": "profession",
                "text": "What is your profession?",
                "category": "Demographics",
                "type": "select",
                "options": "put in your own choices here"
            },
            {
                "id": "location",
                "text": "Where do you live?",
                "category": "Demographics",
                "type": "select",
                "options": "put in your own choices here"
            },
            {
                "id": "position",
                "text": "What is your position?",
                "category": "Demographics",
                "type": "select",
                "options": "put in your own choices here"
            },
            {
                "id": "ethnicBackground",
                "text": "What is your ethnic background?",
                "category": "Demographics",
                "type": "select",
                "options": "put in your own choices here"
            },
            {
                "id": "opennessToExperience",
                "text": "Do you like trying new things?",
                "category": "Personality Big Five",
                "type": "slider",
                "options": "I like things to stay the same;if it's new I'm for it"
            },
            {
                "id": "selfDisciplined",
                "text": "Would you call yourself self-disciplined?",
                "category": "Personality Big Five",
                "type": "slider",
                "options": "I always do exactly what I should;I have no control over myself"
            },
            {
                "id": "introvertOrExtravert",
                "text": "Are you more of an extravert or an introvert?",
                "category": "Personality Big Five",
                "type": "slider",
                "options": "introverted;extraverted"
            },
            {
                "id": "agreeableness",
                "text": "How do you feel about other people?",
                "category": "Personality Big Five",
                "type": "slider",
                "options": "heaven is other people;hell is other people"
            },
            {
                "id": "neuroticism",
                "text": "How much do you worry?",
                "category": "Personality Big Five",
                "type": "slider",
                "options": "constantly;me? never"
            },
            {
                "id": "sensingVsIntuition",
                "text": "Do you prefer to think of abstract, \"big picture\" ideas, or do you like concrete, practical applications?",
                "category": "Personality Myers Briggs",
                "type": "slider",
                "options": "I like the big picture;give me concrete details"
            },
            {
                "id": "introversionVsExtraversion",
                "text": "Do you get more energy from being alone or being with other people?",
                "category": "Personality Myers Briggs",
                "type": "slider",
                "options": "being alone;being with others"
            },
            {
                "id": "thinkingVsFeeling",
                "text": "Does logic or emotion have more impact on your decisions?",
                "category": "Personality Myers Briggs",
                "type": "slider",
                "options": "logic and reason only;my values and feelings are my guide"
            },
            {
                "id": "judgingVsPerceiving",
                "text": "How do you feel about rules?",
                "category": "Personality Myers Briggs",
                "type": "slider",
                "options": "rules keep life working;rules are for breaking"
            }
              {
                "id": "vigilant",
                "text": "What do you typically do about the future?",
                "shortName": "How vigilant",
                "category": "Personality self-portrait",
                "type": "slider",
                "options": "Constantly scan the horizon for upcoming problems;Enjoy blissful ignorance"
              },
              {
                "id": "solitary",
                "text": "How do you feel about other people?",
                "shortName": "How solitary",
                "category": "Personality self-portrait",
                "type": "slider",
                "options": "people are fine at a distance;I can't live without them"
              },
              {
                "id": "idiosyncratic",
                "text": "Do you consider yourself eccentric?",
                "shortName": "How idiosyncratic",
                "category": "Personality self-portrait",
                "type": "slider",
                "options": "who are you calling strange?;I'm as strange as they come"
              },
              {
                "id": "adventurous",
                "text": "When you face a challenge, how do you feel?",
                "shortName": "How adventuresome",
                "category": "Personality self-portrait",
                "type": "slider",
                "options": "wow, let's go for it!;ugh, how can I get out of it?"
              },
              {
                "id": "mercurial",
                "text": "How much do your moods vary?",
                "shortName": "How mercurial",
                "category": "Personality self-portrait",
                "type": "slider",
                "options": "it's all smooth sailing for me;I can be all four seasons in one day"
              },
              {
                "id": "dramatic",
                "text": "When you go to a party, where can you be found?",
                "shortName": "How dramatic",
                "category": "Personality self-portrait",
                "type": "slider",
                "options": "right in the middle, leading everyone in a song;trying to become invisible in a corner"
              },
              {
                "id": "self-confident",
                "text": "When you talk, how do people typically respond?",
                "shortName": "How self-confident",
                "category": "Personality self-portrait",
                "type": "slider",
                "options": "everybody wants to do what I'm doing;people don't respond at all"
              },
              {
                "id": "sensitive",
                "text": "Which is more fun, a night on the town or a novel in bed at home?",
                "shortName": "How sensitive",
                "category": "Personality self-portrait",
                "type": "slider",
                "options": "let's go out;let's stay in"
              },
              {
                "id": "devoted",
                "text": "When you see two people arguing, what is your first instinct?",
                "shortName": "How devoted",
                "category": "Personality self-portrait",
                "type": "slider",
                "options": "walk away;see how I can help"
              },
              {
                "id": "conscientious",
                "text": "You've been working forever on something, but it's not quite perfect yet. What do you do?",
                "shortName": "How conscientious",
                "category": "Personality self-portrait",
                "type": "slider",
                "options": "decide it's good enough and quit;find the time to make it perfect"
              },
              {
                "id": "leisurely",
                "text": "Your work is done and it's time for fun. What do you do?",
                "shortName": "How leisurely",
                "category": "Personality self-portrait",
                "type": "slider",
                "options": "enjoy myself as long as I can;make sure there is nothing else I need to do"
              },
              {
                "id": "agressive",
                "text": "When somebody starts a competitive game, how do you usually respond?",
                "shortName": "How aggressive",
                "category": "Personality self-portrait",
                "type": "slider",
                "options": "I prepare to dominate the pack;I run away and hide"
              },
              {
                "id": "self-sacrificing",
                "text": "What is your purpose in life?",
                "shortName": "How self-sacrificing",
                "category": "Personality self-portrait",
                "type": "slider",
                "options": "to help others;I need a mission?"
              },
              {
                  "id": "learningStyle",
                  "text": "How do you like to learn? (Choose the top two modes for you)",
                  "shortName": "Learning style",
                  "category": "Personality general",
                  "type": "checkboxes",
                  "options": "reading;writing;listening;talking;thinking;moving around;handling things;arranging things;making things"
                },
                {
                  "id": "multipleIntelligences",
                  "text": "Which of these types of intelligence do you rely on most? (Choose the top two)",
                  "shortName": "Intelligences",
                  "category": "Personality general",
                  "type": "checkboxes",
                  "options": "musical;visual;verbal;logical;bodily;interpersonal;intrapersonal;naturalistic"
                },
              {
                  "id": "comfortWithUncertainty",
                  "text": "How much does it bother you when you don't know what is going to happen next?",
                  "shortName": "Comfort with uncertainty",
                  "category": "Personality general",
                  "type": "slider",
                  "options": "I love not knowing;I can't stand not knowing"
                },
                {
                  "id": "patience",
                  "text": "Are you a patient person?",
                  "shortName": "Patience",
                  "category": "Personality general",
                  "type": "slider",
                  "options": "I could wait for decades if necessary;five minutes is too long for me"
                },
                {
                  "id": "comfortWithAmbiguity",
                  "text": "When you can't find a definitive answer to a question, how does that make you feel?",
                  "shortName": "Comfort with ambiguity",
                  "category": "Personality general",
                  "type": "slider",
                  "options": "it energizes me;it drains me"
                },
                {
                  "id": "decisiveness",
                  "text": "When you have a decision to make, how do you generally go about it?",
                  "shortName": "Decisiveness",
                  "category": "Personality general",
                  "type": "slider",
                  "options": "I hesitate until it's too late;I assess my options and decide on the spot"
                },
                {
                  "id": "socialLearning",
                  "text": "Do you prefer to learn alone or with others?",
                  "shortName": "Social learning",
                  "category": "Personality general",
                  "type": "slider",
                  "options": "I need to be alone to learn;I need to be with people to learn"
                },
                {
                  "id": "socialWorking",
                  "text": "Do you prefer to work alone or with others?",
                  "shortName": "Social working",
                  "category": "Personality general",
                  "type": "slider",
                  "options": "I need to be alone to work;I need to be with people to work"
                },
                {
                  "id": "planning",
                  "text": "How much does planning enter into your life?",
                  "shortName": "Planning",
                  "category": "Personality general",
                  "type": "slider",
                  "options": "I never plan anything;I have a plan for everything"
                },
                {
                  "id": "flexibility",
                  "text": "When you have a plan and something unexpected happens, how do you usually respond?",
                  "shortName": "Flexibility",
                  "category": "Personality general",
                  "type": "slider",
                  "options": "I stick to my plan no matter what;I throw out the plan and make a new one"
                },
                {
                  "id": "organization",
                  "text": "Would you say that you are an organized person?",
                  "shortName": "Organization",
                  "category": "Personality general",
                  "type": "slider",
                  "options": "I thrive on chaos;I like things in their places"
                },

              {
                "id": "finishWhatYouStart",
                "text": "Do you always finish what you start?",
                "shortName": "Finish what you start",
                "category": "Personality general",
                "type": "slider",
                "options": "Yes, even when I shouldn't;No, even when I should"
              },
              {
                "id": "socialActivities",
                "text": "How often do you participate in social activities outside the home?",
                "shortName": "Social activities",
                "category": "Personality general",
                "type": "slider",
                "options": "daily;yearly"
              },
              {
                "text": "getInfo",
                "shortName": "Where do you get your information? (Check the strongest three)",
                "category": "Personality general",
                "type": "checkboxes",
                "options": "newspapers;magazines;television;radio;internet;family;friends;colleagues;professionals"
              }
          ]
      },
	  {
	      "id": "storyCollectionActivities",
	      "name": "Story collection activities",
	      "description": "",
	      "isHeader": false,
	      "type": "page",
	      "questions": [
	            {
	                "id": "twoTrueStoriesOneTallTale",
	                "name": "Two true stories one tall tale",
	                "type": "ice-breaker",
	                "plan": "In small groups, ask people to share with each other two true experiences and one made-up tall tale. Ask people to guess story is made up.",
	                "elaborations": "If this is too difficult for people, fall back on the two-truths-and-a-lie exercise on which this is based.",
	                "length": "15 minutes",
	                "recording": "Recording the conversation can lead to more stories being collected; but the topics may be unrelated to the project's topic",
	                "materials": "None required",
	                "spaces": "Tables or seating for small groups",
	                "facilitation": "Nothing required beyond setting up the game at the start",
	            },
	            {
	                "id": "guessWhoseExperience",
	                "name": "Guess whose experience",
	                "type": "ice-breaker",
	                "plan": "In small groups, ask people to write down a few notes on an experience that happened to them, using the form \"I once _____\". Then have the group guess which experience happened to whom.",
	                "elaborations": "If coming up with experiences is hard, ask people to write down facts about themselves instead.",
	                "length": "15 minutes",
	                "recording": "Recording the conversation can lead to more stories being collected; but the topics may be unrelated to the project's topic",
	                "materials": "None required",
	                "spaces": "Tables or seating for small groups",
	                "facilitation": "Nothing required beyond setting up the game at the start",
	            },
	            {
	                "id": "whatHasNeverHappened",
	                "name": "What has never happened",
	                "type": "ice-breaker",
	                "plan": "In small groups, ask people to answer the question, \"What has never happened to you?\". The group can then talk about what that means about each person.",
	                "elaborations": "If people don't know what to say, remind them that they can say ridiculous things, like \"Flying in outer space.\".",
	                "length": "15 minutes",
	                "recording": "Recording the conversation can lead to more stories being collected; but the topics may be unrelated to the project's topic",
	                "materials": "None required",
	                "spaces": "Tables or seating for small groups",
	                "facilitation": "Nothing required beyond setting up the game at the start",
	            },
	            {
	                "id": "sharingStoriesNoTask",
	                "name": "Sharing stories (no task)",
	                "type": "sharing stories (no task)",
	                "plan": "In small groups, ask people to simply share stories about a topic you choose.",
	                "elaborations": "If people can't think of any stories to start with, give them some starter questions.",
	                "length": "15-30 minutes",
	                "recording": "Record stories with audio, video, or notes (taken by a facilitator or helper). Have people fill out question forms for each story they told.",
	                "materials": "Question forms, recording equipment",
	                "spaces": "Tables or seating for small groups",
	                "facilitation": "Watch over people and help out if they are not telling stories or can't find any stories to tell.",
	            }

	            {
	                "id": "sharingStoriesSimpleTask",
	                "name": "Sharing stories (simple task)",
	                "type": "sharing stories (simple task)",
	                "plan": "Ask people to share stories, and while doing so array sticky notes with story names in some simple way - high to low emotion, positive to negative, memorable to trivial - any answer to a question, as long as it is agreed on by all.",
	                "elaborations": "This is only one way of setting up a simple task; there are many others. The basic idea is to give people some simple over-arching task to do while they tell stories.",
	                "length": "30 minutes",
	                "recording": "Record stories with audio, video, or notes (taken by a facilitator or helper). Have people fill out question forms for each story they told.",
	                "materials": "Question forms, recording equipment",
	                "spaces": "Tables or seating for small groups",
	                "facilitation": "Listen to see if people are not telling stories (if so, nudge them in the right direction).",
	            },
	            {
	                "id": "discussingStories",
	                "name": "Discussing stories",
	                "type": "discussing stories",
	                "plan": "Ask people to consider some stories they have already told, as a way of helping them develop insights that spur the telling of more (and more relevant) stories.",
	                "elaborations": "This can be done with or without a simple task (such as arraying told stories along some gradient or sorting stories into groups).",
	                "length": "15-30 minutes",
	                "recording": "Record stories with audio, video, or notes (taken by a facilitator or helper). Have people fill out question forms for each story they told.",
	                "materials": "Question forms, recording equipment",
	                "spaces": "Tables or seating for small groups",
	                "facilitation": "If people are not patient or willing this exercise should not be placed into a story collection session. If people show frustration shorten the exercise and move on to more story sharing.",
	            },
	            {
	                "id": "twiceToldStories",
	                "name": "Twice-told stories",
	                "type": "twice-told stories exercise",
	                "plan": "Form small groups. Have each group select a criterion to choose which story they will retell (which may not be \"the best story\"). Have groups share stories for a while, then bring everyone together to share the stories each group chose to retell. End with general discussion.",
	                "elaborations": "If people can't think of stories on the topic, you could give them questions or reminders. Also, you can add many elaborations onto this basic frame.",
	                "length": "one hour",
	                "recording": "Record stories with audio, video, or notes (taken by a facilitator or helper). Have people fill out question forms for each story they told.",
	                "materials": "Question forms, recording equipment",
	                "spaces": "Tables or seating for small groups",
	                "facilitation": "Listen to see if any groups are not on task or need help. Listen to see if any are choosing \"best\" stories.",
	            },
	            {
	                "id": "timeline",
	                "name": "Timeline exercise",
	                "type": "timeline exercise",
	                "plan": "Describe current state with several stories (place sticky notes with names of each in cluster). Move backward describing events at times in the past (with sticky note titles again).",
	                "elaborations": "Mark turning points with a special color or note. Consider utopian and/or dystopian possibilities, again working backward and again placing sticky notes, and connect them to the main timeline.",
	                "length": "90 minutes or more",
	                "recording": "Record stories with audio, video, or notes (taken by a facilitator or helper). Have people fill out question forms for each story they told.",
	                "materials": "Sticky notes or index cards, question forms, recording equipment",
	                "spaces": "Wall/table/floor space",
	                "facilitation": "Listen for difficulty coming up with events. Have ready a list of event types (surprises, dilemmas, etc) to help people.",
	            },
	            {
	                "id": "landscape",
	                "name": "Landscape exercise",
	                "type": "landscape exercise",
	                "plan": "Present and describe dimensions. Have people lay out a space defined by them, then tell stories based on questions (which you brought), then place the stories in the space and consider them.",
	                "elaborations": "Help people design their own dimensions; ask people to look for patterns in the space.",
	                "length": "90 minutes or more",
	                "recording": "Record stories with audio, video, or notes (taken by a facilitator or helper). Have people fill out question forms for each story they told.",
	                "materials": "Sticky notes or index cards, question forms, recording equipment",
	                "spaces": "Wall/table/floor space",
	                "facilitation": "Listen for confusion about dimensions and placement (have examples ready to explain). Make sure your elicitation questions are well thought through. The space is for insight (spurring deeper revelation), not initial elicitation.",
	            },
	      ]
	  },
	  {
	      "id": "sensemakingActivities",
	      "name": "Sensemaking activities",
	      "description": "",
	      "isHeader": false,
	      "type": "page",
	      "questions": [
	            {
	                "id": "twoTrueStoriesOneTallTale",
	                "name": "Two true stories one tall tale",
	                "type": "ice-breaker",
	                "plan": "In small groups, ask people to share with each other two true experiences and one made-up tall tale. Ask people to guess story is made up.",
	                "elaborations": "If this is too difficult for people, fall back on the two-truths-and-a-lie exercise on which this is based.",
	                "length": "15 minutes",
	                "recording": "Recording the conversation can lead to more stories being collected; but the topics may be unrelated to the project's topic",
	                "materials": "None required",
	                "spaces": "Tables or seating for small groups",
	                "facilitation": "Nothing required beyond setting up the game at the start",
	            },
	            {
	                "id": "guessWhoseExperience",
	                "name": "Guess whose experience",
	                "type": "ice-breaker",
	                "plan": "In small groups, ask people to write down a few notes on an experience that happened to them, using the form \"I once _____\". Then have the group guess which experience happened to whom.",
	                "elaborations": "If coming up with experiences is hard, ask people to write down facts about themselves instead.",
	                "length": "15 minutes",
	                "recording": "Recording the conversation can lead to more stories being collected; but the topics may be unrelated to the project's topic",
	                "materials": "None required",
	                "spaces": "Tables or seating for small groups",
	                "facilitation": "Nothing required beyond setting up the game at the start",
	            },
	            {
	                "id": "whatHasNeverHappened",
	                "name": "What has never happened",
	                "type": "ice-breaker",
	                "plan": "In small groups, ask people to answer the question, \"What has never happened to you?\". The group can then talk about what that means about each person.",
	                "elaborations": "If people don't know what to say, remind them that they can say ridiculous things, like \"Flying in outer space.\".",
	                "length": "15 minutes",
	                "recording": "Recording the conversation can lead to more stories being collected; but the topics may be unrelated to the project's topic",
	                "materials": "None required",
	                "spaces": "Tables or seating for small groups",
	                "facilitation": "Nothing required beyond setting up the game at the start",
	            },
                {
                    "id": "encounteringStoriesNoTask",
	                "name": "Encountering stories (no task)",
	                "type": "encountering stories (no task)",
	                "plan": "Give stories to people so that each person reads/hears several stories and each story is read/heard by multiple people. Ask small groups to discuss what they have read.",
	                "elaborations": "If people have time, they can tell some of their own stories in response.",
	                "length": "15-30 minutes",
	                "recording": "None needed",
	                "materials": "Stories printed on story cards with answers to questions",
	                "spaces": "Tables or seating for small groups",
	                "facilitation": "Listen to see if people need help understanding the stories. Make sure everyone knows to be respectful.",
                },
                {
                    "id": "encounteringStoriesSimpleTask",
	                "name": "Encountering stories (simple task)",
	                "type": "encountering stories (simple task)",
	                "plan": "Give stories to people so that each person reads/hears several stories and each story is read/heard by multiple people. Ask small groups to do something simple with the stories - sort or rank or choose among them.",
	                "elaborations": "If people have time, they can tell some of their own stories in response. Also, the tasks people do with the stories can be multiple or elaborated.",
	                "length": "15-30 minutes",
	                "recording": "None needed",
	                "materials": "Stories printed on story cards with answers to questions",
	                "spaces": "Tables or seating for small groups",
	                "facilitation": "Listen to see if people need help understanding the stories. Make sure everyone knows to be respectful.",
                },
                {
                    "id": "discussingStories",
	                "name": "Discussing stories",
	                "type": "discussing stories",
	                "plan": "After people have encountered stories, ask small groups to talk about what the stories say to them.",
	                "length": "If people have time, they can tell some of their own stories in response. Also, the tasks people do with the stories can be multiple or elaborated.",
	                "length": "15-30 minutes",
	                "recording": "None required",
	                "materials": "Stories printed on story cards with answers to questions",
	                "spaces": "Tables or seating for small groups",
	                "facilitation": "Listen to see if people need help understanding the stories. Make sure everyone knows to be respectful.",
                },
                {
                    "id": "twiceToldStories",
	                "name": "Twice-told stories",
	                "type": "twice-told stories exercise",
	                "plan": "Form small groups. Have each group select a criterion to choose which story they will retell (which may not be \"the best story\"). Have groups consider (already collected) stories for a while, then bring everyone together to share the stories each group chose to retell. End with general discussion.",
	                "elaborations": "Ask people to share some of their own stories in response.",
	                "length": "one hour",
	                "recording": "None required, but if new stories are told they can be captured",
	                "materials": "None required",
	                "spaces": "Tables or seating for small groups",
	                "facilitation": "Listen to see if people need help understanding the stories. Make sure everyone knows to be respectful.",
                },
                {
                    "id": "timeline",
	                "name": "Timeline exercise",
	                "type": "timeline exercise",
	                "plan": "Place stories describing current state in cluster. Move backward placing events from times in the past.",
	                "elaborations": "Mark turning points with a special color or note. Consider utopian and/or dystopian possibilities, again working backward and again placing sticky notes, and connect them to the main timeline.",
	                "length": "90 minutes or more",
	                "recording": "None required, but if new stories are told they can be captured",
	                "materials": "Sticky notes or index cards",
	                "spaces": "Wall/table/floor space",
	                "facilitation": "Listen for difficulty placing stories onto the timeline. Explain that perfect placement is not the point; emergence of meaning is.",
                },
                {
                    "id": "landscape",
	                "name": "Landscape exercise",
	                "type": "landscape exercise",
	                "plan": "Present and describe dimensions. Have people lay out a space defined by them, then place encountered stories in the space and consider them.",
	                "elaborations": "Help people design their own dimensions.",
	                "length": "90 minutes or more",
	                "recording": "None required, but if new stories are told they can be captured",
	                "materials": "Sticky notes or index cards",
	                "spaces": "Wall/table/floor space",
	                "facilitation": "Listen for confusion about dimensions and placement (have examples ready to explain)",
                },
                {
                    "id": "storyElements",
	                "name": "Story elements",
	                "type": "story elements exercise",
	                "plan": "Have people answer a question (which you chose beforehand) about each story. Write answers on sticky notes. Cluster sticky notes; name clusters; describe clusters with attributes; cluster all attributes together into new groups; name the clusters; these are story elements",
	                "elaborations": "Use a different question; use multiple questions.",
	                "length": "90 minutes or more",
	                "recording": "None required",
	                "materials": "Sticky notes or index cards",
	                "spaces": "Wall/table/floor space",
	                "facilitation": "Listen for confusion about clustering; like goes with like. Watch for confusion when attributes are being created (have questions ready).",
                }
                {
                    "id": "compositeStories",
	                "name": "Composite stories exercise",
	                "type": "composite stories exercise",
	                "plan": "Have people use story template to build stories. (See book ;)",
	                "elaborations": "Many (see book)",
	                "length": "2 hours or more",
	                "recording": "None required",
	                "materials": "Sticky notes or index cards",
	                "spaces": "Wall/table/floor space",
	                "facilitation": "Watch out for people being confused at many points in this process. Don't use with people who aren't ready for a challenge.",
                }
	      ]
	  },
  ];

  

  return {
    "elicitationQuestions": templates[0],
    "storyQuestions": templates[1],
    "participantQuestions": templates[2],
    "storyCollectionActivities": templates[3],
    "sensemakingActivities": templates[4]
  };
});
