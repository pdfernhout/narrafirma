define(["require", "exports", "../reportGeneration"], function (require, exports, reportGeneration) {
    "use strict";
    function add_report(panelBuilder, contentPane, model, fieldSpecification) {
        var headerPageID = "page_" + fieldSpecification.displayConfiguration;
        var calculate = reportGeneration.calculate_report.bind(null, panelBuilder.panelSpecificationCollection, model, headerPageID);
        // TODO: Fix when refactor
        return panelBuilder._add_calculatedText(panelBuilder, contentPane, fieldSpecification, calculate);
    }
    return add_report;
});
//# sourceMappingURL=add_report.js.map