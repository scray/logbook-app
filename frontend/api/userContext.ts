import {Theme} from "../api/theme";

export default interface UserContext {
    userId: string;
    setUserId: React.Dispatch<React.SetStateAction<string>>;
    theme: Theme
}