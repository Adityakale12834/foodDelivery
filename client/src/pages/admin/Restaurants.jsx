import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import {
  AdminCreateRestaurant,
  AdminDeleteRestaurant,
  AdminGetRestaurants,
  AdminUpsertRestaurantAccount,
  AdminUpdateRestaurant,
} from "../../api";
import { openSnackbar } from "../../redux/reducers/SnackbarSlice";

const Title = styled.div`
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 12px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 16px;
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.text_secondary + 30};
  border-radius: 16px;
  padding: 16px;
`;

const Row = styled.div`
  border: 1px solid ${({ theme }) => theme.text_secondary + 30};
  border-radius: 14px;
  padding: 12px;
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
`;

const Name = styled.div`
  font-weight: 800;
  margin-bottom: 4px;
`;

const Meta = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 600;
  font-size: 13px;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
`;

const SmallBtn = styled.button`
  border: 1px solid ${({ theme }) => theme.text_secondary + 40};
  background: transparent;
  color: ${({ theme }) => theme.text_primary};
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
  }
`;

const Restaurants = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("foodeli-app-token");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    img: "",
    isActive: true,
  });
  const [account, setAccount] = useState({ email: "", password: "", name: "" });

  const setField = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const load = async (q) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await AdminGetRestaurants(token, q || "");
      setRestaurants(res.data || []);
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err?.response?.data?.message || err.message,
          severity: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      address: "",
      phone: "",
      img: "",
      isActive: true,
    });
    setAccount({ email: "", password: "", name: "" });
  };

  const onEdit = (r) => {
    setEditingId(r._id);
    setForm({
      name: r.name || "",
      description: r.description || "",
      address: r.address || "",
      phone: r.phone || "",
      img: r.img || "",
      isActive: r.isActive !== false,
    });
    setAccount({ email: "", password: "", name: r.name || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSaveAccount = async () => {
    if (!token || !editingId) return;
    if (!account.email || !account.password) {
      dispatch(openSnackbar({ message: "Account email and password are required", severity: "error" }));
      return;
    }
    try {
      await AdminUpsertRestaurantAccount(token, editingId, account);
      dispatch(openSnackbar({ message: "Restaurant login saved", severity: "success" }));
      setAccount((p) => ({ ...p, password: "" }));
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err?.response?.data?.message || err.message,
          severity: "error",
        })
      );
    }
  };

  const onSave = async () => {
    if (!token) return;
    if (!form.name || !form.address) {
      dispatch(openSnackbar({ message: "Name and address are required", severity: "error" }));
      return;
    }
    setSaving(true);
    try {
      if (isEditing) {
        const res = await AdminUpdateRestaurant(token, editingId, {
          ...form,
          isActive: Boolean(form.isActive),
        });
        setRestaurants((prev) => prev.map((x) => (x._id === editingId ? res.data : x)));
        dispatch(openSnackbar({ message: "Restaurant updated", severity: "success" }));
      } else {
        const res = await AdminCreateRestaurant(token, {
          ...form,
          isActive: true,
        });
        setRestaurants((prev) => [res.data, ...prev]);
        dispatch(openSnackbar({ message: "Restaurant added", severity: "success" }));
      }
      resetForm();
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err?.response?.data?.message || err.message,
          severity: "error",
        })
      );
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!token) return;
    const ok = window.confirm("Delete this restaurant?");
    if (!ok) return;
    try {
      await AdminDeleteRestaurant(token, id);
      setRestaurants((prev) => prev.filter((x) => x._id !== id));
      dispatch(openSnackbar({ message: "Restaurant deleted", severity: "success" }));
      if (editingId === id) resetForm();
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err?.response?.data?.message || err.message,
          severity: "error",
        })
      );
    }
  };

  return (
    <div>
      <Title>Restaurants</Title>
      <Grid>
        <Card>
          <Title style={{ fontSize: 16, marginBottom: 10 }}>
            {isEditing ? "Edit restaurant" : "Add restaurant"}
          </Title>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <TextInput
              label="Name *"
              placeholder="Restaurant name"
              value={form.name}
              handelChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
            <TextInput
              label="Address *"
              placeholder="Address"
              value={form.address}
              handelChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              textArea
              rows={3}
            />
            <TextInput
              label="Description"
              placeholder="Short description"
              value={form.description}
              handelChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              textArea
              rows={3}
            />
            <TextInput
              label="Phone"
              placeholder="Phone number"
              value={form.phone}
              handelChange={setField("phone")}
            />
            <TextInput
              label="Image URL"
              placeholder="https://..."
              value={form.img}
              handelChange={setField("img")}
            />

            {isEditing && (
              <>
                <Title style={{ fontSize: 14, margin: "6px 0 0 0" }}>
                  Restaurant login (for Restaurant Portal)
                </Title>
                <TextInput
                  label="Login Name"
                  placeholder="Optional"
                  value={account.name}
                  handelChange={(e) => setAccount((p) => ({ ...p, name: e.target.value }))}
                />
                <TextInput
                  label="Login Email *"
                  placeholder="restaurant@example.com"
                  value={account.email}
                  handelChange={(e) => setAccount((p) => ({ ...p, email: e.target.value }))}
                />
                <TextInput
                  label="Login Password *"
                  placeholder="Set / Reset password"
                  password
                  value={account.password}
                  handelChange={(e) => setAccount((p) => ({ ...p, password: e.target.value }))}
                />
                <Button text="Save Login" onClick={onSaveAccount} />
              </>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <Button
                text={isEditing ? "Update" : "Add"}
                onClick={onSave}
                isLoading={saving}
                isDisabled={saving}
                flex
              />
              {isEditing && (
                <Button text="Cancel" outlined onClick={resetForm} isDisabled={saving} />
              )}
            </div>
          </div>
        </Card>

        <Card>
          <Title style={{ fontSize: 16, marginBottom: 10 }}>All restaurants</Title>
          <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
            <TextInput
              label="Search"
              placeholder="Search by name/address"
              value={search}
              handelChange={(e) => setSearch(e.target.value)}
            />
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <Button
                text="Search"
                small
                onClick={() => load(search)}
                isDisabled={loading}
              />
            </div>
          </div>

          {loading ? (
            <div>Loading…</div>
          ) : restaurants.length === 0 ? (
            <div>No restaurants yet.</div>
          ) : (
            <div>
              {restaurants.map((r) => (
                <Row key={r._id}>
                  <div>
                    <Name>{r.name}</Name>
                    <Meta>{r.address}</Meta>
                  </div>
                  <Actions>
                    <SmallBtn onClick={() => onEdit(r)}>Edit</SmallBtn>
                    <SmallBtn onClick={() => onDelete(r._id)}>Delete</SmallBtn>
                  </Actions>
                </Row>
              ))}
            </div>
          )}
        </Card>
      </Grid>
    </div>
  );
};

export default Restaurants;

