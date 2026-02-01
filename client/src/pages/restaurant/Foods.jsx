import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import {
  RestaurantCreateFood,
  RestaurantDeleteFood,
  RestaurantGetFoods,
  RestaurantUpdateFood,
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
  align-items: center;
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

const Foods = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("foodeli-restaurant-token");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [foods, setFoods] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const isEditing = useMemo(() => Boolean(editingId), [editingId]);
  const [form, setForm] = useState({
    name: "",
    desc: "",
    img: "",
    priceOrg: "",
    priceMrp: "",
    priceOff: "",
    category: "",
    ingredients: "",
  });

  const setField = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const load = useCallback(async () => {
    const t = localStorage.getItem("foodeli-restaurant-token");
    if (!t) return;
    setLoading(true);
    try {
      const res = await RestaurantGetFoods(t);
      setFoods(res.data || []);
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
  }, [dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      desc: "",
      img: "",
      priceOrg: "",
      priceMrp: "",
      priceOff: "",
      category: "",
      ingredients: "",
    });
  };

  const onEdit = (f) => {
    setEditingId(f._id);
    setForm({
      name: f.name || "",
      desc: f.desc || "",
      img: f.img || "",
      priceOrg: f.price?.org ?? "",
      priceMrp: f.price?.mrp ?? "",
      priceOff: f.price?.off ?? "",
      category: Array.isArray(f.category) ? f.category.join(", ") : "",
      ingredients: Array.isArray(f.ingredients) ? f.ingredients.join(", ") : "",
    });
  };

  const onSave = async () => {
    if (!token) return;
    if (!form.name || !form.desc) {
      dispatch(openSnackbar({ message: "Name and description are required", severity: "error" }));
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        desc: form.desc,
        img: form.img || null,
        price: {
          org: Number(form.priceOrg) || 0,
          mrp: Number(form.priceMrp) || 0,
          off: Number(form.priceOff) || 0,
        },
        category: form.category ? form.category.split(",").map((s) => s.trim()).filter(Boolean) : [],
        ingredients: form.ingredients ? form.ingredients.split(",").map((s) => s.trim()).filter(Boolean) : ["Standard"],
      };
      if (isEditing) {
        const res = await RestaurantUpdateFood(token, editingId, payload);
        setFoods((prev) => prev.map((x) => (x._id === editingId ? res.data : x)));
        dispatch(openSnackbar({ message: "Item updated", severity: "success" }));
      } else {
        const res = await RestaurantCreateFood(token, payload);
        setFoods((prev) => [res.data, ...prev]);
        dispatch(openSnackbar({ message: "Item added", severity: "success" }));
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
    if (!window.confirm("Remove this item from menu?")) return;
    try {
      await RestaurantDeleteFood(token, id);
      setFoods((prev) => prev.filter((x) => x._id !== id));
      dispatch(openSnackbar({ message: "Item removed", severity: "success" }));
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
      <Title>Menu / Food items</Title>
      <Grid>
        <Card>
          <Title style={{ fontSize: 16, marginBottom: 10 }}>
            {isEditing ? "Edit item" : "Add item"}
          </Title>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <TextInput
              label="Name *"
              placeholder="Item name"
              value={form.name}
              handelChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
            <TextInput
              label="Description *"
              placeholder="Short description"
              value={form.desc}
              handelChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))}
              textArea
              rows={2}
            />
            <TextInput
              label="Image URL"
              placeholder="https://..."
              value={form.img}
              handelChange={setField("img")}
            />
            <TextInput
              label="Price (org)"
              placeholder="0"
              value={form.priceOrg}
              handelChange={setField("priceOrg")}
            />
            <TextInput
              label="Price (mrp)"
              placeholder="0"
              value={form.priceMrp}
              handelChange={setField("priceMrp")}
            />
            <TextInput
              label="Off %"
              placeholder="0"
              value={form.priceOff}
              handelChange={setField("priceOff")}
            />
            <TextInput
              label="Category (comma-separated)"
              placeholder="Burger, Snacks"
              value={form.category}
              handelChange={setField("category")}
            />
            <TextInput
              label="Ingredients (comma-separated)"
              placeholder="Bread, Patty"
              value={form.ingredients}
              handelChange={setField("ingredients")}
            />
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
          <Title style={{ fontSize: 16, marginBottom: 10 }}>Your menu</Title>
          {loading ? (
            <div>Loading…</div>
          ) : foods.length === 0 ? (
            <div>No items yet. Add your first dish.</div>
          ) : (
            <div>
              {foods.map((f) => (
                <Row key={f._id}>
                  <div>
                    <Name>{f.name}</Name>
                    <Meta>₹{f.price?.org ?? 0} · {f.desc?.slice(0, 50)}{f.desc?.length > 50 ? "…" : ""}</Meta>
                  </div>
                  <Actions>
                    <SmallBtn onClick={() => onEdit(f)}>Edit</SmallBtn>
                    <SmallBtn onClick={() => onDelete(f._id)}>Delete</SmallBtn>
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

export default Foods;
