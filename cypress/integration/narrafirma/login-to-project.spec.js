/// <reference types="cypress" />

import { loginToAProject } from "./login-support.js"

context("login-to-project", () => {
  
    // https://on.cypress.io/interacting-with-elements
  
    it("should login to a project", () => {
        loginToAProject()
    })
  })
  