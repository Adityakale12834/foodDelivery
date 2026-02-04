import styled, { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lightTheme } from "./utils/Themes";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { useState } from "react";
import Authentication from "./pages/Authentication";
import Favourites from "./pages/Favourites";
import Cart from "./pages/Cart";
import FoodDetails from "./pages/FoodDetails";
import FoodListing from "./pages/FoodListing";
import UserOrders from "./pages/Orders";
import Contact from "./pages/Contact";
import { useSelector } from "react-redux";
import AdminLogin from "./pages/admin/Login";
import AdminSignup from "./pages/admin/Signup";
import AdminProtectedRoute from "./pages/admin/AdminProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import DashBoard from "./pages/admin/DashBoard";
import Orders from "./pages/admin/Orders";
import Restaurants from "./pages/admin/Restaurants";
import RestaurantLogin from "./pages/restaurant/Login";
import RestaurantProtectedRoute from "./pages/restaurant/RestaurantProtectedRoute";
import RestaurantLayout from "./pages/restaurant/RestaurantLayout";
import RestaurantDashboard from "./pages/restaurant/DashBoard";
import RestaurantOrders from "./pages/restaurant/Orders";
import RestaurantFoods from "./pages/restaurant/Foods";

const Container = styled.div``;

function App() {
  const { currentUser } = useSelector((state) => state.user);
  const { open, message, severity } = useSelector((state) => state.snackbar);
  const [openAuth, setOpenAuth] = useState(false);
  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        <Container>
          <Navbar
            setOpenAuth={setOpenAuth}
            openAuth={openAuth}
            currentUser={currentUser}
          />
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/favorite" exact element={<Favourites />} />
            <Route path="/cart" exact element={<Cart />} />
            <Route path="/orders" exact element={<UserOrders />} />
            <Route path="/contact" exact element={<Contact />} />
            <Route path="/dishes/:id" exact element={<FoodDetails />} />
            <Route path="/dishes" exact element={<FoodListing />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route path="/admin" element={<AdminProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<DashBoard />} />
                <Route path="dashboard" element={<DashBoard />} />
                <Route path="restaurants" element={<Restaurants />} />
                <Route path="orders" element={<Orders />} />
              </Route>
            </Route>
            <Route path="/restaurant/login" element={<RestaurantLogin />} />
            <Route path="/restaurant" element={<RestaurantProtectedRoute />}>
              <Route element={<RestaurantLayout />}>
                <Route index element={<RestaurantDashboard />} />
                <Route path="dashboard" element={<RestaurantDashboard />} />
                <Route path="menu" element={<RestaurantFoods />} />
                <Route path="orders" element={<RestaurantOrders />} />
              </Route>
            </Route>
          </Routes>
          {openAuth && (
            <Authentication setOpenAuth={setOpenAuth} openAuth={openAuth} />
          )}
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
