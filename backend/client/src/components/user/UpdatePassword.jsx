import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUpdatePasswordMutation } from '../../redux/api/userapi';
import UserLayout from '../layout/Userlayout'; // Corrected import path


const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState(""); // Corrected variable name
  const [password, setPassword] = useState(""); // Corrected variable name

  const navigate = useNavigate();

  const [updatePassword, { isLoading, error, isSuccess }] = useUpdatePasswordMutation(); // Corrected mutation name

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (isSuccess) {
      toast.success("Password Updated");
      navigate("/me/profile");
    }
  }, [error, isSuccess, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    const userData = {
      oldPassword, // Corrected variable name
      password, // Corrected variable name
    };
    updatePassword(userData);
  };

  return (
    <UserLayout>
      <div className="row wrapper">
        <div className="col-10 col-lg-8">
          <form className="shadow rounded bg-body" onSubmit={submitHandler}>
            <h2 className="mb-4">Update Password</h2>
            <div className="mb-3">
              <label htmlFor="old_password_field" className="form-label">Old Password</label>
              <input
                type="password"
                id="old_password_field"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)} // Corrected variable name
              />
            </div>

            <div className="mb-3">
              <label htmlFor="new_password_field" className="form-label">New Password</label>
              <input
                type="password"
                id="new_password_field"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Corrected variable name
              />
            </div>

            <button type="submit" className="btn update-btn w-100" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
}

export default UpdatePassword;
