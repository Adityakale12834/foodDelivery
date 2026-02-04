import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { category } from "../utils/data";
import HeaderImage from "../utils/Images/Header.png";
import ProductCategoryCard from "../components/cards/ProductCategoryCard";
import ProductsCard from "../components/cards/ProductsCard";
import RestaurantCard from "../components/cards/RestaurantCard";
import { getRestaurants, getAllProducts } from "../api";
import { CircularProgress } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

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
  max-width: 1400px;
  width: 100%;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;
const Img = styled.img`
  width: 100%;
  max-width: 1200px;
`;
const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  display: flex;
  justify-content: ${({ center }) => (center ? "center" : "space-between")};
  align-items: center;
`;
const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: center;
  @media (max-width: 760px) {
    gap: 16px;
  }
`;

const BackBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 8px;
  &:hover {
    background: ${({ theme }) => theme.primary + 18};
  }
`;

const Home = () => {
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [restaurantItems, setRestaurantItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getRestaurants()
      .then((res) => setRestaurants(res.data || []))
      .catch(() => setRestaurants([]))
      .finally(() => setRestaurantsLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedRestaurant) {
      setRestaurantItems([]);
      return;
    }
    setItemsLoading(true);
    getAllProducts(`restaurant=${selectedRestaurant._id}`)
      .then((res) => setRestaurantItems(res.data || []))
      .catch(() => setRestaurantItems([]))
      .finally(() => setItemsLoading(false));
  }, [selectedRestaurant?._id]);

  return (
    <Container>
      <Section>
        <Img src={HeaderImage} />
      </Section>

      <Section>
        <Title>Restaurants</Title>
        {restaurantsLoading ? (
          <CircularProgress />
        ) : restaurants.length === 0 ? (
          <div>No restaurants yet.</div>
        ) : (
          <CardWrapper>
            {restaurants.map((r) => (
              <RestaurantCard
                key={r._id}
                restaurant={r}
                onClick={(restaurant) => setSelectedRestaurant(restaurant)}
              />
            ))}
          </CardWrapper>
        )}
      </Section>

      {selectedRestaurant && (
        <Section>
          <BackBtn type="button" onClick={() => setSelectedRestaurant(null)}>
            <ArrowBack /> Back to restaurants
          </BackBtn>
          <Title>Items from {selectedRestaurant.name}</Title>
          {itemsLoading ? (
            <CircularProgress />
          ) : restaurantItems.length === 0 ? (
            <div>No items from this restaurant yet.</div>
          ) : (
            <CardWrapper>
              {restaurantItems.map((product) => (
                <ProductsCard key={product._id} product={product} />
              ))}
            </CardWrapper>
          )}
        </Section>
      )}

      <Section>
        <Title>Food Categories</Title>
        <CardWrapper>
          {category.map((c) => (
            <ProductCategoryCard key={c.name} category={c} />
          ))}
        </CardWrapper>
      </Section>
    </Container>
  );
};

export default Home;
