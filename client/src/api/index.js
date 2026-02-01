import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// auth
export const UserSignUp = async (data) =>
  await API.post("/user/signup", data);

export const UserSignIn = async (data) =>
  await API.post("/user/signin", data);

export const UserMe = async (token) =>
  await API.get("/user/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

// admin auth
export const AdminSignUp = async (data, adminSecret) =>
  await API.post(
    "/admin/signup",
    { ...data, adminSecret },
    adminSecret
      ? { headers: { "x-admin-secret": adminSecret } }
      : undefined
  );

export const AdminSignIn = async (data) => await API.post("/admin/signin", data);

export const AdminMe = async (token) =>
  await API.get("/admin/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const AdminGetOrders = async (token) =>
  await API.get("/admin/orders", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const AdminUpdateOrderStatus = async (token, orderId, status) =>
  await API.patch(
    `/admin/orders/${orderId}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );

// admin restaurants
export const AdminGetRestaurants = async (token, search) =>
  await API.get(`/admin/restaurants${search ? `?search=${encodeURIComponent(search)}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const AdminCreateRestaurant = async (token, data) =>
  await API.post(`/admin/restaurants`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const AdminUpdateRestaurant = async (token, id, data) =>
  await API.patch(`/admin/restaurants/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const AdminDeleteRestaurant = async (token, id) =>
  await API.delete(`/admin/restaurants/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const AdminUpsertRestaurantAccount = async (token, restaurantId, data) =>
  await API.post(`/admin/restaurants/${restaurantId}/account`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// restaurant portal
export const RestaurantSignIn = async (data) => await API.post("/restaurant/signin", data);

export const RestaurantMe = async (token) =>
  await API.get("/restaurant/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const RestaurantGetOrders = async (token) =>
  await API.get("/restaurant/orders", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const RestaurantUpdateOrderStatus = async (token, orderId, status) =>
  await API.patch(
    `/restaurant/orders/${orderId}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );

// public restaurants (for homepage)
export const getRestaurants = async () => await API.get("/restaurants");

// products (filter optional: "minPrice=0&maxPrice=100" or "restaurant=id")
export const getAllProducts = async (filter) =>
  await API.get(`/food?${filter || ""}`);

export const getProductDetails = async (id) =>
  await API.get(`/food/${id}`);

// restaurant portal: menu CRUD
export const RestaurantGetFoods = async (token) =>
  await API.get("/restaurant/foods", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const RestaurantCreateFood = async (token, data) =>
  await API.post("/restaurant/foods", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const RestaurantUpdateFood = async (token, id, data) =>
  await API.patch(`/restaurant/foods/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const RestaurantDeleteFood = async (token, id) =>
  await API.delete(`/restaurant/foods/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// cart
export const getCart = async (token) =>
  await API.get(`/user/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addToCart = async (token, data) =>
  await API.post(`/user/cart`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteFromCart = async (token, data) =>
  await API.patch(`/user/cart`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// favorites
export const getFavourite = async (token) =>
  await API.get(`/user/favorite`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addToFavourite = async (token, data) =>
  await API.post(`/user/favorite`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteFromFavourite = async (token, data) =>
  await API.patch(`/user/favorite`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// orders
export const placeOrder = async (token, data) =>
  await API.post(`/user/order`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getOrders = async (token) =>
  await API.get(`/user/order`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const userUpdateOrderStatus = async (token, orderId, status) =>
  await API.patch(`/user/order/${orderId}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });
