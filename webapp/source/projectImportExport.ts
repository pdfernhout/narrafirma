import Globals = require("./Globals");
import dialogSupport = require("./panelBuilder/dialogSupport");

// Library for saving files, imported by narrafirma.html
declare var saveAs;

export function exportEntireProject() {
    if (!confirm("Export entire project?\n(This may take a while.)")) return;
    
    var project = Globals.project();
    
    // var json = JSON.stringify(project.tripleStore.tripleMessages, null, 4);
    var exportObject =  {
        projectIdentifier: project.projectIdentifier,
        timestamp: new Date().toISOString(),
        exportFormat: "0.1.0",
        userIdentifier: project.pointrelClient.userIdentifier,
        messages: project.pointrelClient.messagesSortedByReceivedTimeArray
    };
    
    var json = JSON.stringify(exportObject, null, 4);
    
    // var printItems = m("pre", json);
    // var htmlForPage = generateHTMLForPage("NarraFirma project export for " + project.projectIdentifier + " on " + new Date().toISOString(), null, printItems);
    // printHTML(htmlForPage);
    
    var questionnaireBlob = new Blob([json], {type: "application/json;charset=utf-8"});
    saveAs(questionnaireBlob, exportObject.projectIdentifier + " exported at " + exportObject.timestamp + ".json");
}

function chooseProjectFileToImport(callback) {
    // console.log("chooseFileToImport");
    var projectFileUploader = <HTMLInputElement>document.getElementById("projectFileUploader");
    // console.log("cvsFileUploader", cvsFileUploader);
    projectFileUploader.onchange = function() {
        var file = projectFileUploader.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e: Event) {
            var contents = (<FileReader>e.target).result;
            callback(contents);
        };
        reader.readAsText(file);
    };
    projectFileUploader.click();
}

export function importEntireProject() {
    var project = Globals.project();
    
    console.log("importEntireProject");
    chooseProjectFileToImport((contents) => {
        // console.log("contents", contents);
        var importObject = JSON.parse(contents);
        // importObject.messages.forEach((message) => {
        //    // if (message._topicIdentifier === "surveyResults")
        //    console.log("message", message._topicIdentifier);
        //});
        
        // TODO: Similar to what is in scvImportExport -- coudll any duplication be refactored out?
        
        var progressModel = dialogSupport.openProgressDialog("Importing project messages...", "Progress importing project messsages", "Cancel", dialogCancelled);
  
        function dialogCancelled(dialogConfiguration, hideDialogMethod) {
            progressModel.cancelled = true;
            hideDialogMethod();
        }
        
        var messageIndexToSend = 0;
    
        function sendNextMessage() {
            console.log("sendNextMessage", messageIndexToSend);
            if (progressModel.cancelled) {
                alert("Cancelled after importing " + messageIndexToSend + " messages");
            } else if (messageIndexToSend >= importObject.messages.length) {
                alert("Done importing messages");
                progressModel.hideDialogMethod();
                progressModel.redraw();
            } else {
                var message = importObject.messages[messageIndexToSend++];
                
                // Rewrite project references in triples, but not in survey results
                // TODO: The message trace is no longer valid if do rewrite
                if (message.change && message.change.triple && message.change.triple.a === importObject.projectIdentifier) {
                    message.change.triple.a = project.projectIdentifier;
                }
                if (message.change && message.change.projectIdentifier  === importObject.projectIdentifier) {
                    message.change.projectIdentifier = project.projectIdentifier;
                }                
                
                // TODO: Translate
                progressModel.progressText = "Importing " + messageIndexToSend + " of " + importObject.messages.length + " messages";
                progressModel.redraw();
                setTimeout(function() { project.pointrelClient.sendMessage(message, sendNextMessage); }, 0);
            }
        }
        
        // Start sending project messages
        sendNextMessage();
    });
}