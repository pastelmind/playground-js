import type { ImageRequireSource } from "react-native";

declare module "*.png" {
  const source: ImageRequireSource;
  export default source;
}
