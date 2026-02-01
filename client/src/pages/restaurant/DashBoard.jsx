import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RestaurantGetOrders } from "../../api";

const Title = styled.div`
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 10px;
`;

const Meta = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 600;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.text_secondary + 30};
  border-radius: 16px;
  padding: 16px;
`;

const DashBoard = () => {
  const { currentUser } = useSelector((s) => s.user);
  const [ordersCount, setOrdersCount] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("foodeli-restaurant-token");
    if (!token) return;
    RestaurantGetOrders(token)
      .then((res) => setOrdersCount(res.data?.length ?? 0))
      .catch(() => setOrdersCount(null));
  }, []);

  return (
    <div>
      <Title>Dashboard</Title>
      <Card>
        <Title style={{ fontSize: 16, marginBottom: 6 }}>
          {currentUser?.restaurant?.name || "Your Restaurant"}
        </Title>
        <Meta>
          {ordersCount === null ? "View your latest orders" : `${ordersCount} total orders`}
        </Meta>
      </Card>
    </div>
  );
};

export default DashBoard;

