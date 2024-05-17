import React from "react";
import { Route, Routes } from "react-router-dom";
import App from "./App";
import Login from "./components/Login";
import Register from "./components/Register";
import NoMatch from "./components/NoMatch";
import RequireAuth from "./components/RequireAuth";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <App />
          </RequireAuth>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}
