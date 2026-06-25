// src/components/Auth/Profile.tsx

import { useAuthStore } from '../../stores/authStore';

const Profile = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {user.email}</p>
      {/* Add more profile details as needed */}
    </div>
  );
};

export default Profile;
