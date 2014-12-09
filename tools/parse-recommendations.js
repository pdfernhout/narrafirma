function generateRecommendationsTable() {
    if (!pages) console.log('Run convert before generating recommendations table');
    outputTextArea.set("value", "");
    array.forEach(pages, function (page) {
        array.forEach(page.questions, function (question) {
            if (startsWith(question.id, 'aspects_') && (question.type === 'select')) {
                addOutput('\n' + question.id + '\n');
                array.forEach(question.options.split(';'), function (option) {
                    addOutput('\t' + option + '\n');
                    // console.log(option);
                });
            }
        });
        
    });
    
}

function loadRecommendationsCSV() {
    inputTextArea.set("value", textOfRecommendations);
    outputTextArea.set("value", "");
    
    processRecommendationsCSV();
}


var matrix = [];
var matrixColumnCount = 0;
var matrixRowCount = 0;

function getMatrixValue(row, column) {
    if (row > matrixRowCount) return null;
    if (column > matrixColumnCount) return null;
    var line = matrix[row];
    // console.log("test1", column, line.length, line);
    if (column > line.length) return "";
    return line[column];
}

function loadMatrix() {
    // Load matrix
    matrix = [];
    matrixColumnCount = 0;
    matrixRowCount = 0;
    
    var lines = textOfRecommendations.split("\r");
    console.log(JSON.stringify(lines));
    var rowCategoriesSplit = lines[0].split(",");
    console.log(JSON.stringify(rowCategoriesSplit));
    
    for (var lineIndex in lines) {
        var line = lines[lineIndex];
        // TODO: Will not handle embedded commas or quotes
        var splitLine = line.split(",");
        matrix[lineIndex] = splitLine;
        if (splitLine.length > matrixColumnCount) matrixColumnCount = splitLine.length;
    }
    matrixRowCount = lines.length;
    console.log(matrixColumnCount, matrixRowCount, matrix);
    console.log("test retrieval 5.5", getMatrixValue(5, 5));
}

function processRecommendationsCSV() {
    // Process CSV file which has row categories line then row data line, then column category line, then column data line, then blank, then repeate columns
    
    // Store did not seem to load data carrectly based on line breaks not processed correctly despite changing them to \n; also could not find URL
    //var fixedNewlinesText = textOfRecommendations.replace(/\r?\n/g, "\n");
    // console.log("fixedNewlinesText", fixedNewlinesText);
    // var store = new CsvStore({data: fixedNewlinesText});
    // var store = new CsvStore({url: "file:../design/recommendations.csv"});
    //console.log("store", store);
    
    loadMatrix();
    
    var rowCategories = [];
    var columnCategories = [];
    
    // TODO: finish
}