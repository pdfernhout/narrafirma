export function loginToAProject() {
    cy.visit("http://localhost:8080/login")
    cy.get("input[name=\"username\"]").type("superuser")
    cy.get("input[name=\"password\"]").type("secret")
    cy.get(".narrafirma-login-button").click()
    cy.url().should("include", "http://localhost:8080/start")
    cy.get(".narrafirma-login-hello").should("contain", "Hello, superuser.")
    cy.get("a").contains("Choose a project").click()
    cy.url().should("include", "http://localhost:8080/narrafirma.html")
    cy.get("b").should("contain", "NarraFirma Projects")
    cy.get("button").should("contain", "pf-test-1").click()
    cy.get("#narrafirma-name").should("contain", "NarraFirma™")
    cy.get("#narrafirma-name").should("have.class", "narrafirma-serverstatus-ok")
}
