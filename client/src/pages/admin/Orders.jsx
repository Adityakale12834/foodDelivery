import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { AdminGetOrders, AdminUpdateOrderStatus } from "../../api";
import { openSnackbar } from "../../redux/reducers/SnackbarSlice";

const Title = styled.div`
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 12px;
`;

const Table = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Row = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.text_secondary + 30};
  border-radius: 16px;
  padding: 14px;
  display: grid;
  grid-template-columns: 1.2fr 1fr 0.8fr 1fr;
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 700;
  font-size: 12px;
  margin-bottom: 6px;
`;

const Value = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-weight: 600;
  word-break: break-word;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 40};
  background: transparent;
  color: ${({ theme }) => theme.text_primary};
`;

const Orders = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("foodeli-app-token");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const statusOptions = useMemo(
    () => ["Payment Done", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
    []
  );

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await AdminGetOrders(token);
      setOrders(res.data || []);
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
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeStatus = async (orderId, status) => {
    if (!token) return;
    try {
      const res = await AdminUpdateOrderStatus(token, orderId, status);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? res.data : o)));
      dispatch(openSnackbar({ message: "Status updated", severity: "success" }));
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
      <Title>Orders</Title>
      {loading ? (
        <div>Loading…</div>
      ) : orders.length === 0 ? (
        <div>No orders yet.</div>
      ) : (
        <Table>
          {orders.map((o) => (
            <Row key={o._id}>
              <div>
                <Label>Order</Label>
                <Value>{o._id}</Value>
                <Label style={{ marginTop: 10 }}>Created</Label>
                <Value>{o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}</Value>
              </div>
              <div>
                <Label>Customer</Label>
                <Value>{o.user?.name || "-"}</Value>
                <Label style={{ marginTop: 10 }}>Email</Label>
                <Value>{o.user?.email || "-"}</Value>
              </div>
              <div>
                <Label>Total</Label>
                <Value>{typeof o.total_amount === "number" ? `₹${o.total_amount}` : "-"}</Value>
                <Label style={{ marginTop: 10 }}>Items</Label>
                <Value>{Array.isArray(o.products) ? o.products.length : 0}</Value>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={o.status || "Payment Done"}
                  onChange={(e) => onChangeStatus(o._id, e.target.value)}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
                <Label style={{ marginTop: 10 }}>Address</Label>
                <Value>{o.address || "-"}</Value>
              </div>
            </Row>
          ))}
        </Table>
      )}
    </div>
  );
};

export default Orders;

