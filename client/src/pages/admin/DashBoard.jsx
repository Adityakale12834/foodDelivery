import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { AdminGetOrders } from "../../api";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(Link)`
  text-decoration: none;
  background: ${({ theme }) => theme.card};
  border-radius: 16px;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 30};
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  flex-direction: column;
  gap: 8px;
  &:hover {
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 800;
`;

const Meta = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 600;
`;

const DashBoard = () => {
  const [ordersCount, setOrdersCount] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("foodeli-app-token");
    if (!token) return;
    AdminGetOrders(token)
      .then((res) => setOrdersCount(res.data?.length ?? 0))
      .catch(() => setOrdersCount(null));
  }, []);

  return (
    <div>
      <Title style={{ marginBottom: 12 }}>Dashboard</Title>
      <Grid>
        <Card to="/admin/orders">
          <Title>Orders</Title>
          <Meta>
            {ordersCount === null ? "View and manage orders" : `${ordersCount} total orders`}
          </Meta>
        </Card>
        <Card to="/">
          <Title>Go to Store</Title>
          <Meta>Back to customer website</Meta>
        </Card>
      </Grid>
    </div>
  );
};

export default DashBoard;

