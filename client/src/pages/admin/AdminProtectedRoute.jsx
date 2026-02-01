import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AdminMe } from "../../api";
import { updateUser, logout } from "../../redux/reducers/UserSlice";

const AdminProtectedRoute = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [checking, setChecking] = useState(true);

  const token = localStorage.getItem("foodeli-app-token");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // If already admin in state, allow immediately
      if (currentUser?.role === "admin") {
        if (!cancelled) setChecking(false);
        return;
      }

      if (!token) {
        if (!cancelled) setChecking(false);
        return;
      }

      try {
        const res = await AdminMe(token);
        dispatch(updateUser(res.data));
      } catch (e) {
        dispatch(logout());
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [dispatch, token, currentUser?.role]);

  if (checking) return <div style={{ padding: 24 }}>Loading…</div>;
  if (!token) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  if (currentUser?.role !== "admin") return <Navigate to="/admin/login" replace />;

  return <Outlet />;
};

export default AdminProtectedRoute;

