// Pointrel data storage system configuration file

// Do not edit the next line as it is needed to load the file correctly
var pointrelConfig = module.exports = {};

// Change these options as appropriate for your system
// Note the need for a trailing slash at the end of these directory names
// A leading slash will indicate an absolute directory that will not be changed; otherwise the path is relative to the base directory

// This is the main directory where data is stored relative to where the server script is started; other directories are relative to this
pointrelConfig.baseDirectory = "../";

// This prevents any changes to the repository, but it can still be read.
// More fine-grained writing control options are below but this overrides them.
pointrelConfig.pointrelRepositoryIsReadOnly = false;

pointrelConfig.pointrelResourcesDirectory = "pointrel/pointrel-data/resources/";

pointrelConfig.pointrelJournalsDirectory = "pointrel/pointrel-data/journals/";
pointrelConfig.pointrelJournalsAllow = true;
pointrelConfig.pointrelJournalsDeleteAllow = true;

pointrelConfig.pointrelVariablesDirectory = "pointrel/pointrel-data/variables/";
pointrelConfig.pointrelVariablesAllow = true;
pointrelConfig.pointrelVariablesDeleteAllow = true;

pointrelConfig.pointrelLogsDirectory = "pointrel/pointrel-data/logs/";

pointrelConfig.pointrelPublishingDirectory = "pointrel/pointrel-www/";
pointrelConfig.pointrelPublishingAllow = true;

pointrelConfig.pointrelIndexesDirectory = "pointrel/pointrel-data/indexes/";
pointrelConfig.pointrelIndexesMaintain = true;

pointrelConfig.requireAuthentication = false;


