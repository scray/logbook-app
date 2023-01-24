export default interface UserContext {
    userId: string;
    setUserId: React.Dispatch<React.SetStateAction<string>>;
}