import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";
import { getOrders, userUpdateOrderStatus } from "../api";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/SnackbarSlice";

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
  background: ${({ theme }) => theme.bg};
`;

const Section = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  display: flex;
  justify-content: ${({ center }) => (center ? "center" : "space-between")};
  align-items: center;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Card = styled.div`
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 30};
  padding: 16px 18px;
  background: ${({ theme }) => theme.card};
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 16px;
  align-items: start;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 4px;
`;

const Value = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  background: ${({ status, theme }) =>
    status === "Delivered"
      ? theme.green + 30
      : status === "Cancelled"
      ? theme.red + 30
      : status === "Out for Delivery"
      ? theme.primary + 25
      : theme.text_secondary + 25};
  color: ${({ status, theme }) =>
    status === "Delivered"
      ? theme.green
      : status === "Cancelled"
      ? theme.red
      : theme.text_primary};
`;

const CancelBtn = styled.button`
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.red};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.red};
  border-radius: 8px;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.red + 20};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Orders = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);

  const load = useCallback(() => {
    const token = localStorage.getItem("foodeli-app-token");
    if (!token) return;
    setLoading(true);
    getOrders(token)
      .then((res) => setOrders(res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCancel = async (orderId) => {
    const token = localStorage.getItem("foodeli-app-token");
    if (!token) return;
    if (!window.confirm("Cancel this order?")) return;
    setCancellingId(orderId);
    try {
      await userUpdateOrderStatus(token, orderId, "Cancelled");
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "Cancelled" } : o))
      );
      dispatch(openSnackbar({ message: "Order cancelled", severity: "success" }));
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err?.response?.data?.message || "Failed to cancel order",
          severity: "error",
        })
      );
    } finally {
      setCancellingId(null);
    }
  };

  const canCancel = (status) =>
    status !== "Delivered" && status !== "Cancelled";

  return (
    <Container>
      <Section>
        <Title>Your Orders</Title>
        {loading ? (
          <CircularProgress />
        ) : orders.length === 0 ? (
          <div>You have no orders yet.</div>
        ) : (
          <List>
            {orders.map((order) => {
              const status = order.status || "Payment Done";
              return (
                <Card key={order._id}>
                  <div>
                    <Label>Order</Label>
                    <Value style={{ fontFamily: "monospace", fontSize: 12 }}>
                      {order._id}
                    </Value>
                    <Label style={{ marginTop: 8 }}>Placed on</Label>
                    <Value>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "-"}
                    </Value>
                    {Array.isArray(order.products) && order.products.length > 0 && (
                      <>
                        <Label style={{ marginTop: 8 }}>Items</Label>
                        <Value>
                          {order.products
                            .map(
                              (p) =>
                                `${p.product?.name || "Item"} (×${p.quantity || 1})`
                            )
                            .join(", ")}
                        </Value>
                      </>
                    )}
                  </div>
                  <div>
                    <Label>Total</Label>
                    <Value>₹{order.total_amount}</Value>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Value>
                      <StatusBadge status={status}>{status}</StatusBadge>
                    </Value>
                    <Label style={{ marginTop: 8 }}>Address</Label>
                    <Value style={{ wordBreak: "break-word" }}>
                      {order.address || "-"}
                    </Value>
                  </div>
                  <div>
                    {canCancel(status) && (
                      <CancelBtn
                        onClick={() => handleCancel(order._id)}
                        disabled={cancellingId === order._id}
                      >
                        {cancellingId === order._id ? "Cancelling…" : "Cancel order"}
                      </CancelBtn>
                    )}
                  </div>
                </Card>
              );
            })}
          </List>
        )}
      </Section>
    </Container>
  );
};

export default Orders;

