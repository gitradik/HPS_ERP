import { useSelector } from "src/store/Store";
import { selectUserId } from "src/store/apps/auth/AuthSlice";
import UserProfileUsers from "./UserProfileUsers";

const UserProfileUsersContainer = () => {
    const userId = useSelector(selectUserId);
    return <UserProfileUsers userId={userId} />;
};

export default UserProfileUsersContainer;