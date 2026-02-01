import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RestaurantMe } from "../../api";
import { updateUser, logout } from "../../redux/reducers/UserSlice";

const RestaurantProtectedRoute = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [checking, setChecking] = useState(true);

  const token = localStorage.getItem("foodeli-restaurant-token");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (currentUser?.role === "restaurant") {
        if (!cancelled) setChecking(false);
        return;
      }
      if (!token) {
        if (!cancelled) setChecking(false);
        return;
      }
      try {
        const res = await RestaurantMe(token);
        dispatch(updateUser(res.data));
      } catch (e) {
        dispatch(logout());
        localStorage.removeItem("foodeli-restaurant-token");
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
  if (!token) return <Navigate to="/restaurant/login" replace />;
  if (currentUser?.role !== "restaurant") return <Navigate to="/restaurant/login" replace />;

  return <Outlet />;
};

export default RestaurantProtectedRoute;

