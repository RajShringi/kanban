import React, { useState } from "react";
import kanbanLightImage from "../assets/kanban-light-logo.svg";
import kanbanDarkImage from "../assets/kanban-dark-logo.svg";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetError, userRegister } from "../slice/userSlice";

export default function Register() {
  const { theme } = useSelector((state) => state.theme);
  const { user, errMsg } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, SetErrors] = useState({
    usernameErr: "",
    emailErr: "",
    passwordErr: "",
  });

  function handleChange(e) {
    dispatch(resetError());
    const { name, value } = e.target;
    setUserInfo((prev) => {
      return { ...prev, [name]: value };
    });
  }

  function isPasswordValid(password) {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
  }

  function validate() {
    let isValid = true;
    if (!userInfo.username) {
      SetErrors((prev) => ({ ...prev, usernameErr: `Field can't be empty` }));
      isValid = false;
    }
    if (!userInfo.email) {
      SetErrors((prev) => ({ ...prev, emailErr: `Field can't be empty` }));
      isValid = false;
    }
    if (!userInfo.password) {
      SetErrors((prev) => ({ ...prev, passwordErr: `Field can't be empty` }));
      isValid = false;
    }
    if (userInfo.password && !isPasswordValid(userInfo.password)) {
      SetErrors((prev) => ({
        ...prev,
        passwordErr: `Password should be minimum eight characters, at least one letter, one number and one special character:`,
      }));
      isValid = false;
    }
    if (userInfo.email && !userInfo.email.includes("@")) {
      SetErrors((prev) => ({
        ...prev,
        emailErr: `Enter a valid email address`,
      }));
      isValid = false;
    }
    return isValid;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    const result = await dispatch(
      userRegister({ ...userInfo, name: userInfo.username })
    );
    if (result.meta.requestStatus === "fulfilled") {
      <Navigate to="/" />;
    }
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div
      className={`absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center ${
        theme === "dark" ? "bg-[#20212c]" : "bg-[#f4f7fd]"
      }`}
    >
      <div
        className={`py-8 px-8 rounded-md w-2/6 flex flex-col gap-4 ${
          theme === "dark" ? "bg-[#2b2c37] text-white" : "bg-white "
        }`}
      >
        <div className="flex justify-center items-center mb-6">
          {theme === "dark" ? (
            <img src={kanbanDarkImage} alt="kanban-logo" />
          ) : (
            <img src={kanbanLightImage} alt="kanban-logo" />
          )}
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-2">Register Account</h3>
          <p className="mb-6 text-gray-500">
            Register your account to enjoy kanban services right now!
          </p>
        </div>

        <form>
          <div className="mb-6">
            <input
              className={`block w-full px-2 py-3 border  rounded-md text-sm outline-none 
              ${
                errors.usernameErr || errMsg.username
                  ? "border-red-400"
                  : theme === "dark"
                  ? "border-[#94a3b840]"
                  : "border-gray-300"
              }
              ${theme === "dark" ? "bg-[#2b2c37] " : "bg-white "}`}
              type="text"
              placeholder="Username"
              name="username"
              value={userInfo.username}
              required
              onChange={handleChange}
            />
            <span className="text-sm text-red-400">
              {errors.usernameErr || errMsg.username}
            </span>
          </div>

          <div className="mb-6">
            <input
              className={`block w-full px-2 py-3 border  rounded-md text-sm outline-none 
              ${
                errors.emailErr || errMsg.email
                  ? "border-red-400"
                  : theme === "dark"
                  ? "border-[#94a3b840]"
                  : "border-gray-300"
              }
              
              ${theme === "dark" ? "bg-[#2b2c37] " : "bg-white "}`}
              type="text"
              placeholder="Email"
              name="email"
              value={userInfo.email}
              required
              onChange={handleChange}
            />
            <span className="text-sm text-red-400">
              {errors.emailErr || errMsg.email}
            </span>
          </div>

          <div className="mb-6">
            <input
              className={`block w-full px-2 py-3 border  rounded-md text-sm outline-none 
              ${
                errors.passwordErr
                  ? "border-red-400"
                  : theme === "dark"
                  ? "border-[#94a3b840]"
                  : "border-gray-300"
              }
              
              ${theme === "dark" ? "bg-[#2b2c37] " : "bg-white "}`}
              type="text"
              placeholder="password"
              name="password"
              value={userInfo.password}
              required
              onChange={handleChange}
            />
            <span className="text-sm text-red-400">{errors.passwordErr}</span>
          </div>

          <button
            onClick={handleSubmit}
            className="block mt-4 w-full bg-[#635fc7] hover:bg-[#635fc8c9] text-white px-6 py-3 rounded-full font-bold"
          >
            Register
          </button>
        </form>
        <div className="flex items-center justify-center">
          <p className="text-gray-500 font-bold">
            Already have an account?{" "}
            <span
              className={`${theme === "dark" ? "text-white" : "text-gray-500"}`}
            >
              <Link to="/login">Sign in right now!</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
