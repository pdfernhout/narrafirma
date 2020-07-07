/// <reference types="cypress" />

context("login-logout", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/narrafirma.html")
  })

  // https://on.cypress.io/interacting-with-elements

  it("should login and logout", () => {
    cy.get("body").should("contain", "No projects. The NarraFirma application cannot run.")

    cy.get("a").contains("login").click()

    cy.url().should("include", "http://localhost:8080/login")

    cy.get("input[name=\"username\"]").should("have.value", "")
    cy.get("input[name=\"password\"]").should("have.value", "")

    cy.get("input[name=\"username\"]").type("superuser")
    cy.get("input[name=\"password\"]").type("secretWRONG")

    cy.get(".narrafirma-login-button").click()

    cy.get("b").should("contain", "Authentication failed for: superuser")

    cy.get("input[name=\"username\"]").should("have.value", "")
    cy.get("input[name=\"password\"]").should("have.value", "")

    cy.get("input[name=\"username\"]").type("superuser")
    cy.get("input[name=\"password\"]").type("secret")

    cy.get(".narrafirma-login-button").click()

    cy.get(".narrafirma-login-hello").should("contain", "Hello, superuser.")

    cy.get("a").contains("Log out").click()

    cy.url().should("include", "http://localhost:8080/start")

    cy.get("a").contains("log in").click()

    cy.get("input[name=\"username\"]").should("have.value", "")
    cy.get("input[name=\"password\"]").should("have.value", "")

  })
})
