/// <reference types="cypress" />

import { loginToAProject } from "./login-support.js"

context("Navigation", () => {

  beforeEach(() => {
    loginToAProject()
  })

  // https://on.cypress.io/interacting-with-elements

  it("should have a planning image", () => {
    cy.wait(300)
    cy.get("img.narrafirma-pni-phases-image").toMatchImageSnapshot({
        imageConfig: {
            "createDiffImage": true, 
            "threshold": 0.00,
            "thresholdType": "percent"
            }
        })
    })
})
