// Generated from design

define(function() {
    "use strict";

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
                "text": "Was there ever a time when you felt _____? What happened then?",
                "category": "Topic",
                "type": "label"
            },
            {
                "id": "topic_everThought",
                "text": "Have you ever thought ____? What happened that made you think that?",
                "category": "Topic",
                "type": "label"
            },
            {
                "id": "topic_causedAChange",
                "text": "Was there ever a change in your ___ about ___? What happened that caused the change?",
                "category": "Topic",
                "type": "label"
            },
            {
                "id": "topic_doingSomethingBecauseYouFelt",
                "text": "Can you remember ever ____ because you felt ___? What happened that made you feel that way?",
                "category": "Topic",
                "type": "label"
            },
            {
                "id": "topic_aTimeWhenYouSomethingBecauseOf",
                "text": "Think of a time when you ____ because of ____.",
                "category": "Topic",
                "type": "label"
            },
            {
                "id": "time_whatHappenedFirstTime",
                "text": "What happened the (first, last, most recent) time you ____?",
                "category": "Point in time (specific)",
                "type": "label"
            },
            {
                "id": "time_yourSomething",
                "text": "Tell me about your ___. What happened during it?",
                "category": "Point in time (specific)",
                "type": "label"
            },
            {
                "id": "time_whatJustHappened",
                "text": "What just happened? Can you tell us about it?",
                "category": "Point in time (specific)",
                "type": "label"
            },
            {
                "id": "time_mostMemorable",
                "text": "What was the most memorable ___ during ____?",
                "category": "Point in time (memorable)",
                "type": "label"
            },
            {
                "id": "time_standsOutInMemory",
                "text": "Was there a time during ___ that stands out in your memory?",
                "category": "Point in time (memorable)",
                "type": "label"
            },
            {
                "id": "time_momentWasMostSomething",
                "text": "What moment during ___ was most ____ to you? What happened in that moment?",
                "category": "Point in time (memorable)",
                "type": "label"
            },
            {
                "id": "time_happenedThatMadeYouFeel",
                "text": "During ____, did anything happen that made you feel ___? What was it that happened?",
                "category": "Point in time (emotion)",
                "type": "label"
            },
            {
                "id": "time_mostSomethingHour",
                "text": "What has been your (most, least) ___ hour as a ____?",
                "category": "Point in time (emotion)",
                "type": "label"
            },
            {
                "id": "time_whenYouFelt",
                "text": "Was there ever a time during ____ when you felt ___? What happened that made you feel that way?",
                "category": "Point in time (emotion)",
                "type": "label"
            },
            {
                "id": "time_feltTopicWas",
                "text": "Was there ever a moment when you felt that (a project topic) was ___?",
                "category": "Point in time (topic)",
                "type": "label"
            },
            {
                "id": "time_foundYourselfMost",
                "text": "At what point during ____ did you find yourself the most (project topic)?",
                "category": "Point in time (topic)",
                "type": "label"
            },
            {
                "id": "time_emotionWasInState",
                "text": "Recall for us a moment when (an emotion) was (in a state) during ____.",
                "category": "Point in time (topic)",
                "type": "label"
            },
            {
                "id": "event_standsOut",
                "text": "What event most stands out in your mind during ____?",
                "category": "Event (memorable)",
                "type": "label"
            },
            {
                "id": "event_willRemember",
                "text": "Did anything happen (today, this week, etc) that you will remember for a long time?",
                "category": "Event (memorable)",
                "type": "label"
            },
            {
                "id": "event_importantToYou",
                "text": "Can you describe an incident in the past (day, week, etc) that is important to you?",
                "category": "Event (memorable)",
                "type": "label"
            },
            {
                "id": "event_causedToFeel",
                "text": "Did any particular event or incident cause you to feel ___ during ____?",
                "category": "Event (emotion)",
                "type": "label"
            },
            {
                "id": "event_feltSomething",
                "text": "Tell me about a time when you felt ____. What happened?",
                "category": "Event (emotion)",
                "type": "label"
            },
            {
                "id": "event_feltSomethingWasSomething",
                "text": "Can you recall a situation when you felt that ____ was _____?",
                "category": "Event (emotion)",
                "type": "label"
            },
            {
                "id": "event_proverb",
                "text": "When you consider the (motto, saying, proverb) ____, was there a moment during ____ when you felt that this (motto, saying, proverb) was especially ____?",
                "category": "Event (topic)",
                "type": "label"
            },
            {
                "id": "event_situationInWhich",
                "text": "Could you tell us about a situation in which ___ was ____?",
                "category": "Event (topic)",
                "type": "label"
            },
            {
                "id": "event_madeYouThink",
                "text": "Did you ever experience anything that made you think ____? What happened?",
                "category": "Event (topic)",
                "type": "label"
            },
            {
                "id": "extreme_highOrLowPoint",
                "text": "Can you recall the (highlight, lowest point) of ___?",
                "category": "Extreme (in general)",
                "type": "label"
            },
            {
                "id": "extreme_bestOrWorstThing",
                "text": "What was the (best, worst) thing that ever happened during ____?",
                "category": "Extreme (in general)",
                "type": "label"
            },
            {
                "id": "extreme_bestOrWorstMoment",
                "text": "What was the (best, worst) moment of ____?",
                "category": "Extreme (in general)",
                "type": "label"
            },
            {
                "id": "extreme_feltTheMost",
                "text": "During ____, when did you feel the most ___? What happened that made you feel that way?",
                "category": "Extreme (emotion)",
                "type": "label"
            },
            {
                "id": "extreme_saidToThemselves",
                "text": "During ____, did you ever say to yourself, \"This the ____ moment in this ____?\" What happened during that moment?",
                "category": "Extreme (emotion)",
                "type": "label"
            },
            {
                "id": "extreme_highOrLowLevel",
                "text": "What was the (highest, lowest) level of ____ you felt during ____? What happened when you felt that?",
                "category": "Extreme (emotion)",
                "type": "label"
            },
            {
                "id": "extreme_thinkBackOver",
                "text": "Think back over ___. When was ___ the most ____? What happened then?",
                "category": "Extreme (topic)",
                "type": "label"
            },
            {
                "id": "extreme_neverSeenSuch",
                "text": "Did you ever think, \"I've never seen such ___\"? What happened that made you think that?",
                "category": "Extreme (topic)",
                "type": "label"
            },
            {
                "id": "extreme_momentYouCanRecall",
                "text": "As you look back on ____, what is the ____ moment you can recall with respect to ____? What happened during that moment?",
                "category": "Extreme (topic)",
                "type": "label"
            },
            {
                "id": "surprise_timeWhenSurprised",
                "text": "Can you remember a time when you were surprised at how ____?",
                "category": "Surprise",
                "type": "label"
            },
            {
                "id": "surprise_somethingSurprisedYou",
                "text": "As you remember ____, can you think of a time when ___ surprised you?",
                "category": "Surprise",
                "type": "label"
            },
            {
                "id": "surprise_aSurprisingSomething",
                "text": "Can you tell us about a surprising ____ during ____?",
                "category": "Surprise",
                "type": "label"
            },
            {
                "id": "change_momentOfChange",
                "text": "Was there ever a moment during ___ when ___ changed? What happened?",
                "category": "Change",
                "type": "label"
            },
            {
                "id": "change_feelAChange",
                "text": "Did you ever feel a change in ____? What caused you to feel that a change was taking place?",
                "category": "Change",
                "type": "label"
            },
            {
                "id": "change_turningPoint",
                "text": "Looking back over ____, can you pick out a turning point in ____? What happened during that turning point?",
                "category": "Change",
                "type": "label"
            },
            {
                "id": "person_whenMetPerson",
                "text": "What was it like the ____ time you met ___? What happened?",
                "category": "Person",
                "type": "label"
            },
            {
                "id": "person_timeYouDidSomethingWithPerson",
                "text": "Can you tell us about the ___ when you ___ with ___?",
                "category": "Person",
                "type": "label"
            },
            {
                "id": "person_bestExplains",
                "text": "What experience with ____ best explains ____?",
                "category": "Person",
                "type": "label"
            },
            {
                "id": "group_joinedLeft",
                "text": "Do you remember the ___ when you (joined, left, did something with) ___? What happened during that ___?",
                "category": "Group",
                "type": "label"
            },
            {
                "id": "group_decisionTo",
                "text": "Can you remember making the decision to ___ with ____? What were you thinking about at the time?",
                "category": "Group",
                "type": "label"
            },
            {
                "id": "group_standsOut",
                "text": "Recall a ___ with ___ that stands out in your memory.",
                "category": "Group",
                "type": "label"
            },
            {
                "id": "place_didSomethingAt",
                "text": "Do you remember the ___ time you ___ at ___? What happened?",
                "category": "Place",
                "type": "label"
            },
            {
                "id": "place_rememberHappening",
                "text": "When you (arrived at, left, did something at) ____, what do you remember happening?",
                "category": "Place",
                "type": "label"
            },
            {
                "id": "place_madeYouThink",
                "text": "Did anything ever happen at ___ that made you think: that's what this place is like? What was it?",
                "category": "Place",
                "type": "label"
            },
            {
                "id": "object_momentSpringsToMind",
                "text": "When you look at this ___, what moment springs to mind?",
                "category": "Object",
                "type": "label"
            },
            {
                "id": "object_whatWereYouThinking",
                "text": "When you first saw ____, what were you thinking? What happened during that encounter?",
                "category": "Object",
                "type": "label"
            },
            {
                "id": "object_especiallySomethingMoments",
                "text": "Can you recall any especially _____ moments (using, holding, etc) this ____?",
                "category": "Object",
                "type": "label"
            },
            {
                "id": "scenario_aboutTo",
                "text": "If someone told you that they were about to ___, what story about your experiences with ___ would you tell them?",
                "category": "Fictional scenario",
                "type": "label"
            },
            {
                "id": "scenario_someoneTellsYou",
                "text": "Say someone tells you that ___. Say you want to ___. What would you tell them about your experiences with ___ to ___ them?",
                "category": "Fictional scenario",
                "type": "label"
            },
            {
                "id": "scenario_yearsInThe",
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
                "id": "feelingsAboutOtherViewsOnWhyTold",
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
                "category": null,
                "type": "select",
                "options": "<25;25-34;35-44;45-64;65-74;75+"
            },
            {
                "id": "gender",
                "text": "What is your gender?",
                "category": null,
                "type": "select",
                "options": "male;female"
            },
            {
                "id": "rentOrOwn",
                "text": "Do you rent or own your home?",
                "shortName": "Rent or own",
                "category": null,
                "type": "select",
                "options": "rent;own"
            },
            {
                "id": "incomeLevel",
                "text": "What is your income level?",
                "category": null,
                "type": "select",
                "options": "put in your own levels here"
            },
            {
                "id": "educationLevel",
                "text": "How much education have you completed?",
                "category": null,
                "type": "select",
                "options": "high school;college;post-graduate;trade;other"
            },
            {
                "id": "maritalStatus",
                "text": "What is your marital status?",
                "category": null,
                "type": "select",
                "options": "single;married;widowed;divorced;other"
            },
            {
                "id": "children",
                "text": "How many children do you have?",
                "category": null,
                "type": "select",
                "options": "none;1;2;3;4;5;6;7;8;9;10"
            },
            {
                "id": "profession",
                "text": "What is your profession?",
                "category": null,
                "type": "select",
                "options": "put in your own choices here"
            },
            {
                "id": "location",
                "text": "Where do you live?",
                "category": null,
                "type": "select",
                "options": "put in your own choices here"
            },
            {
                "id": "position",
                "text": "What is your position?",
                "category": null,
                "type": "select",
                "options": "put in your own choices here"
            },
            {
                "id": "ethnicBackground",
                "text": "What is your ethnic background?",
                "category": null,
                "type": "select",
                "options": "put in your own choices here"
            },
            {
                "id": "opennessToExperience",
                "text": "Do you like trying new things?",
                "category": null,
                "type": "slider",
                "options": "I like things to stay the same;if it's new I'm for it"
            },
            {
                "id": "selfDisciplined",
                "text": "Would you call yourself self-disciplined?",
                "category": null,
                "type": "slider",
                "options": "I always do exactly what I should;I have no control over myself"
            },
            {
                "id": "introvertOrExtravert",
                "text": "Are you more of an extravert or an introvert?",
                "category": null,
                "type": "slider",
                "options": "introverted;extraverted"
            },
            {
                "id": "agreeableness",
                "text": "How do you feel about other people?",
                "category": null,
                "type": "slider",
                "options": "heaven is other people;hell is other people"
            },
            {
                "id": "neuroticism",
                "text": "How much do you worry?",
                "category": null,
                "type": "slider",
                "options": "constantly;me? never"
            },
            {
                "id": "sensingVsIntuition",
                "text": "Do you prefer to think of abstract, \"big picture\" ideas, or do you like concrete, practical applications?",
                "category": null,
                "type": "slider",
                "options": "I like the big picture;give me concrete details"
            },
            {
                "id": "thinkingVsFeeling",
                "text": "Does logic or emotion have more impact on your decisions?",
                "category": null,
                "type": "slider",
                "options": "logic and reason only;my values and feelings are my guide"
            },
            {
                "id": "judgingVsPerceiving",
                "text": "How do you feel about rules?",
                "category": null,
                "type": "slider",
                "options": "rules keep life working;rules are for breaking"
            }
        ]
    }
];
  
  function convertSemicolonsToNewlinesForOptions(section) {
      var questions = section.questions;
      for (var questionIndex in questions) {
          var question = questions[questionIndex];
          if (question.options) {
              question.options = question.options.replace(/;/g, "\n");
              // console.log("new options", question.options);
          }
      }
      return section;
  }

  return {
    "elicitationQuestions": convertSemicolonsToNewlinesForOptions(templates[0]),
    "storyQuestions": convertSemicolonsToNewlinesForOptions(templates[1]),
    "participantQuestions": convertSemicolonsToNewlinesForOptions(templates[2])
  };
});
