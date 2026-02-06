import { useState } from "react";
import useAuthStore from "../store/useAuthStore";

const EditUserModal = ({ user, onClose, onSuccess }) => {
  const { updateUser, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    email: user?.email || "",
    password: "", // Default to empty
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call the store action
    const result = await updateUser(user.id, formData);

    if (result.success) {
      onSuccess(); // Trigger parent to refresh the user list
      onClose(); // Close the modal
    }
  };

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Edit User: {user.username}</h3>

        <form onSubmit={handleSubmit} className="py-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">First Name</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Last Name</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </label>
          </div>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Email</span>
            </div>
            <input
              type="email"
              className="input input-bordered w-full"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">New Password (Optional)</span>
            </div>
            <input
              type="password"
              placeholder="Leave empty to keep current password"
              className="input input-bordered w-full"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </label>

          <div className="modal-action">
            <button
              type="button"
              className="btn"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default EditUserModal;
