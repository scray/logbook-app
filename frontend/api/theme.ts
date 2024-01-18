export interface Theme {
  primary: string;
  secondary: string;
  tertiary: string;
  button1: string;
  button2: string;
  fontColor: string;
  titleColor: string;
  backgroundGradient: string[];
}

export const lightTheme: Theme = {
  primary: "#192f6a",
  secondary: "#00a4e6",
  tertiary: "#ccc",
  button1: "#00a897",
  button2: "#e71d34",
  fontColor: "#011628",
  titleColor: "#333",
  backgroundGradient: ["#a3ffd6", "#ffffff", "#84dcc6"],
};

export const darkTheme: Theme = {
  primary: "#192f6a",
  secondary: "#a7dadc",
  tertiary: "#ccc",
  button1: "#2ec2b3",
  button2: "#e63746",
  fontColor: "#a7dadc",
  titleColor: "#ffffff",
  backgroundGradient: ["#27365d", "#1e2a4a", "#1e2a4a"],
};
