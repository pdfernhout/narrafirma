/// <reference types="cypress" />

import { loginToAProject } from "./login-support.js"

context("Navigation", () => {
  beforeEach(() => {
    loginToAProject()
  })

  // https://on.cypress.io/interacting-with-elements

  it("should move through sections", () => {
    const sections = ["Planning", "Collection", "Catalysis", "Sensemaking", "Intervention", "Return"]
    for (const sectionName of sections) {
      cy.get("map area[alt=\"" + sectionName + "\"]").click({force: true})
      cy.get("span#narrafirma-breadcrumb-current").contains(sectionName)
      cy.get("a").contains("Home").click()
    }
  })
})
