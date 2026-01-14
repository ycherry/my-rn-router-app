import { UserStoreProvider } from "./_store";
import { UserContent } from "./UserContent";

export const User = () => {
  return (
    <UserStoreProvider>
      <UserContent />
    </UserStoreProvider>
  );
};