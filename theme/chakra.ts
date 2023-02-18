import { extendTheme } from "@pankod/refine-chakra-ui";

const theme = extendTheme({
    styles: {
        global: {
            body: {
                bg: "#E7E7F2",
                color: "#2E3440",
            },
        },
    },
    initialColorMode: "light",
    useSystemColorMode: false,
    breakpoints: {
        // Nav Bar breakpoints
        nav_sm: "",

        // SideBar breakpoints
        sidebar_md: "1000px",

        sm: "800px",
    },
    components: {
        Button: {
            defaultProps: {
                _hover: { bg: "#2E3440" },
            },
        },
    },
});

export default theme;
