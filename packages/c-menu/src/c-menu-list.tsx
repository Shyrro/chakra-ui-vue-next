import { useStyles, chakra } from "@chakra-ui/vue-system"
import { defineComponent, h } from "vue"
import { CPortal } from "@chakra-ui/c-portal"

import { useMenu } from "./c-menu"
import { getValidChildren } from "@chakra-ui/vue-utils"

export const CMenuList = defineComponent({
  setup(_, { slots, attrs }) {
    const styles = useStyles()
    const { root } = useMenu()
    return () => (
      <CPortal to="body">
        <chakra.div
          __label="menu-list-container"
          {...root.value.positionerProps}
          {...attrs}
        >
          <chakra.ul
            __label="menu-list"
            __css={styles.value.list}
            {...root.value.contentProps}
          >
            {() => getValidChildren(slots)}
          </chakra.ul>
        </chakra.div>
      </CPortal>
    )
  },
})
