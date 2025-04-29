// theme/CustomTheme.js
import { configureFonts } from "react-native-paper";

const fontConfig = {
  fontFamily: "Inter",
  fontWeight: "400",
  letterSpacing: 0.5,
  lineHeight: 22,
  fontSize: 16,
};

// Light Theme
export const lightTheme = {
  background: {
    primary: "rgba(236,253,245,1)",
    secondary: "rgb(255,255,255)",
    tertiary: "rgba(0,79,59,1)",
    header: "#FFFFFF",
    mute: "#F5F5F5",
    text: "#333333",
    customColor: "#FF5722",
    statusBar: "#F3EDF7",
  },
  text: {
    margin: 16,
    padding: 8,
  },
};

// Dark Theme
export const darkTheme = {
  background: {
    primary: "blue",
    secondary: "#CCC2DC",
    tertiary: "#EFB8C8",
    header: "#000000",
    mute: "#121212",
    text: "#FFFFFF",
    customColor: "#FF7043",
    statusBar: "#1C1B1F",
  },
  text: {
    margin: 16,
    padding: 8,
  },
};
