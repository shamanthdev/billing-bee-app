import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserMenu = () => {
  const navigate = useNavigate();
  const { userDetails } = useAuth();
  const { logout } = useAuth();
  console.log("userDetails", userDetails);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex items-center gap-3">

      <div className="text-sm text-gray-300">
        Welcome 👋 {userDetails?.name || "User"}
      </div>
{/* 
      <button
        onClick={handleLogout}
        className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition"
      >
        Logout
      </button> */}

    </div>
  );
};

export default UserMenu;