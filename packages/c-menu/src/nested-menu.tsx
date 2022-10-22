import { computed, defineComponent, Fragment, h } from "vue"
import { useStyles, chakra } from "@chakra-ui/vue-system"
import { getValidChildren } from "@chakra-ui/vue-utils"
import { CPortal } from "@chakra-ui/c-portal"
import { useMenu } from "./c-menu"
import {
  SubMenuProvider,
  useMenuItem,
  useSubMenu,
  useInfiniteSubMenu,
} from "./composables"

export const CMenuItem = defineComponent({
  props: {
    value: {
      type: String,
    },
  },
  setup(props, { slots, attrs }) {
    const { validChildren, textValue } = useMenuItem(props, slots)
    const styles = useStyles()
    const { root } = useMenu()

    return () => (
      <chakra.li
        __label="menu-item"
        __css={styles.value.item}
        {...root.value.getItemProps({ id: textValue.value })}
        {...attrs}
      >
        {() => validChildren}
      </chakra.li>
    )
  },
})

export const CSubMenuTrigger = defineComponent({
  setup(_, { slots, attrs }) {
    const styles = useStyles()
    const { root, sub } = useSubMenu()

    const triggerItemProps = computed(() =>
      root.value.getTriggerItemProps(sub.value)
    )
    return () => (
      <chakra.li
        __label="sub-menu-trigger"
        __css={styles.value.item}
        {...triggerItemProps.value}
        {...attrs}
      >
        {() => getValidChildren(slots)}
      </chakra.li>
    )
  },
})

export const CSubMenuItem = defineComponent({
  props: {
    value: {
      type: String,
    },
  },
  setup(props, { slots, attrs }) {
    const validChildren = getValidChildren(slots)
    // const { validChildren, textValue } = useMenuItem(props, slots)

    const styles = useStyles()
    const { sub } = useSubMenu()
    return () => (
      <chakra.li
        __css={styles.value.item}
        {...sub.value.getItemProps({
          id: props.value || validChildren[0]?.children,
        })}
        {...attrs}
      >
        {() => validChildren}
      </chakra.li>
    )
  },
})

export const CSubMenuList = defineComponent({
  setup(_, { slots, attrs }) {
    const { sub } = useSubMenu()
    const styles = useStyles()
    return () => (
      <CPortal to="body">
        <chakra.div {...sub.value.positionerProps} {...attrs}>
          <chakra.ul
            __label="sub-menu-content"
            __css={styles.value.list}
            {...sub.value.contentProps}
          >
            {() => getValidChildren(slots)}
          </chakra.ul>
        </chakra.div>
      </CPortal>
    )
  },
})

export const CSubMenu = defineComponent({
  props: {
    label: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    const { root, sub, subMachine } = useInfiniteSubMenu(props)

    SubMenuProvider({ sub, root, machine: subMachine })

    return () => getValidChildren(slots)
  },
})
