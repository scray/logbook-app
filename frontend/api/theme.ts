export interface Theme {
    primary: string
    secondary: string
    tertiary: string
    fontColor: string
    titleColor: string
    backgroundGradient: string[]
}

export const lightTheme: Theme = {
    primary: "#192f6a",
    secondary: "#f44336",
    tertiary: "#ccc",
    fontColor: "#000000",
    titleColor: "#333",
    backgroundGradient: ["#4c669f", "#3b5998", "#192f6a"]
}

export const darkTheme: Theme = {
    primary: "#192f6a",
    secondary: "#f44336",
    tertiary: "#ccc",
    fontColor: "#757575",
    titleColor: "#ffffff",
    backgroundGradient: ["#27365d", "#1e2a4a", "#1e2a4a"]
}

export const theme: Theme = lightTheme