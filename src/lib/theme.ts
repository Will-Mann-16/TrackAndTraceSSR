import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors: {
    primary: "#144733",
  },
  styles: {
    global: (props) => ({
      "html, body": {
        backgroundColor: props.colorMode === "dark" ? "gray.800" : "gray.200",
      },
    }),
  },
});

export default theme;
