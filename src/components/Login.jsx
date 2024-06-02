import React, { useState } from "react";
import { useSelector } from "react-redux";
import kanbanLightImage from "../assets/kanban-light-logo.svg";
import kanbanDarkImage from "../assets/kanban-dark-logo.svg";
import { Link, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetError, userLogin } from "../slice/userSlice";
import Loader from "./Loader";

export default function Login() {
  const { theme } = useSelector((state) => state.theme);
  const { user, errMsg, loading } = useSelector((state) => state.user);
  const { boards } = useSelector((state) => state.board);
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [errors, SetErrors] = useState({
    emailErr: "",
    passwordErr: "",
  });
  const dispatch = useDispatch();

  function isPasswordValid(password) {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
  }

  function validate() {
    let isValid = true;
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

  function handleChange(e) {
    dispatch(resetError());
    const { name, value } = e.target;
    setUserInfo((prev) => {
      return { ...prev, [name]: value };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      console.log(errors);
      console.log(userInfo);
      return;
    }
    if (Object.keys(errMsg).length !== 0) {
      if (errMsg.email) {
        SetErrors((prev) => ({ ...prev, emailErr: `Email is not found` }));
      }
      if (errMsg.password) {
        SetErrors((prev) => ({ ...prev, emailErr: `Password is incorrect` }));
      }
      return;
    }
    const result = await dispatch(userLogin(userInfo));

    if (result.meta.requestStatus === "fulfilled") {
      console.log({ boards }, "board");
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
        <h3 className="text-2xl font-bold ">Loggin Acount</h3>
        <p className="mb-6 text-gray-500">
          Log in to your account to enjoy Kanban services right now!
        </p>

        <form>
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
              type="email"
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
                errors.passwordErr || errMsg.password
                  ? "border-red-400"
                  : theme === "dark"
                  ? "border-[#94a3b840]"
                  : "border-gray-300"
              }
              ${theme === "dark" ? "bg-[#2b2c37] " : "bg-white "} `}
              type="password"
              placeholder="password"
              name="password"
              value={userInfo.password}
              required
              onChange={handleChange}
            />
            <span className="text-sm text-red-400">
              {errors.passwordErr || errMsg.password}
            </span>
          </div>

          <button
            onClick={handleSubmit}
            className="block mt-4 w-full bg-[#635fc7] hover:bg-[#635fc8c9] text-white px-6 py-3 rounded-full font-bold"
          >
            {loading ? <Loader asButton={true} /> : "Sign In"}
          </button>
        </form>
        <div className="flex items-center justify-center">
          <p className="text-gray-500 font-bold">
            Doesn’t have an account yet?{" "}
            <span
              className={`${theme === "dark" ? "text-white" : "text-gray-500"}`}
            >
              <Link to="/register"> Register right now!</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
