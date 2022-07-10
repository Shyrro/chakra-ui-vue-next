import { SystemStyleObject } from "@chakra-ui/vue-system"
import { Dict, runIfFn } from "@chakra-ui/utils"

export interface StyleConfig {
  baseStyle?: SystemStyleObject
  sizes?: { [size: string]: SystemStyleObject }
  variants?: { [variant: string]: SystemStyleObject }
  defaultProps?: {
    size?: string
    variant?: string
    colorScheme?: string
  }
}

export interface MultiStyleConfig {
  baseStyle?: { [part: string]: SystemStyleObject }
  sizes?: { [size: string]: { [part: string]: SystemStyleObject } }
  variants?: { [variants: string]: { [part: string]: SystemStyleObject } }
  defaultProps?: StyleConfig["defaultProps"]
}

export interface GlobalStyleProps {
  colorScheme: string
  colorMode: "light" | "dark"
  theme: Dict
}

export type GlobalStyles = {
  global?: SystemStyleObject | ((props: GlobalStyleProps) => SystemStyleObject)
}

export { runIfFn }

export type Styles = GlobalStyles

export function mode(light: any, dark: any) {
  return (props: Dict) => (props.colorMode === "dark" ? dark : light)
}

export function orient(options: {
  orientation?: "vertical" | "horizontal"
  vertical: any
  horizontal: any
}) {
  const { orientation, vertical, horizontal } = options
  if (!orientation) return {}
  return orientation === "vertical" ? vertical : horizontal
}

export type StyleFunctionProps = {
  colorScheme: string
  colorMode: "light" | "dark"
  orientation?: "horizontal" | "vertical"
  theme: Dict
  [key: string]: any
}

export type SystemStyleFunction = (
  props: StyleFunctionProps
) => SystemStyleObject
