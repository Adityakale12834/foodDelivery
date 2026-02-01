import React from "react";
import styled from "styled-components";
import { StorefrontOutlined } from "@mui/icons-material";

const Card = styled.div`
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.3s ease-out;
  cursor: pointer;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.text_secondary + 30};
  border-radius: 16px;
  padding: 16px;
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 4px 20px ${({ theme }) => theme.shadow || "rgba(0,0,0,0.1)"};
  }
  @media (max-width: 600px) {
    width: 100%;
    max-width: 320px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 160px;
  border-radius: 12px;
  object-fit: cover;
  background: ${({ theme }) => theme.text_secondary + 20};
`;

const Placeholder = styled.div`
  width: 100%;
  height: 160px;
  border-radius: 12px;
  background: ${({ theme }) => theme.text_secondary + 25};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text_secondary};
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const Desc = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

const Cta = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

const RestaurantCard = ({ restaurant, onClick }) => {
  return (
    <Card onClick={() => onClick(restaurant)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onClick(restaurant)}>
      {restaurant.img ? (
        <Image src={restaurant.img} alt={restaurant.name} />
      ) : (
        <Placeholder>
          <StorefrontOutlined sx={{ fontSize: 48 }} />
        </Placeholder>
      )}
      <Title>{restaurant.name}</Title>
      {restaurant.description && <Desc>{restaurant.description}</Desc>}
      <Cta>View menu →</Cta>
    </Card>
  );
};

export default RestaurantCard;
