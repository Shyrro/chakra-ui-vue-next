import { cy } from "local-cypress"
import { h } from "vue"
import * as Examples from "../examples"

describe("Tag", () => {
  it("has no accessibility violation", () => {
    Object.entries(Examples).map(([name, example]) => {
      it(`renders ${name} successfully`, () => {
        cy.mount(h(() => example.default)).checkA11y()
      })
    })
  })
})
