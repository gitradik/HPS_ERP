import { useSelector } from 'src/store/Store';
import UserProfile from './UserProfile';
import { selectUserId } from 'src/store/apps/auth/AuthSlice';

const UserProfileContainer = () => {
  const userId = useSelector(selectUserId);
  return <UserProfile userId={userId} />;
};

export default UserProfileContainer;
