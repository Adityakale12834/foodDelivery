import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import { RestaurantSignIn } from "../../api";
import { loginSuccess } from "../../redux/reducers/UserSlice";
import { openSnackbar } from "../../redux/reducers/SnackbarSlice";

const Container = styled.div`
  width: 100%;
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 28px;
  border-radius: 16px;
  background: ${({ theme }) => theme.card};
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.primary};
`;

const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 90};
`;

const RestaurantLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async () => {
    if (!email || !password) {
      dispatch(openSnackbar({ message: "Enter email and password", severity: "error" }));
      return;
    }
    setLoading(true);
    try {
      const res = await RestaurantSignIn({ email, password });
      localStorage.setItem("foodeli-restaurant-token", res.data.token);
      dispatch(loginSuccess(res.data)); // store user in redux for UI
      dispatch(openSnackbar({ message: "Restaurant login successful", severity: "success" }));
      navigate("/restaurant/dashboard");
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

  return (
    <Container>
      <Card>
        <div>
          <Title>Restaurant Portal</Title>
          <Span>Login to manage your orders</Span>
        </div>
        <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
          <TextInput
            label="Email Address"
            placeholder="Enter your email address"
            value={email}
            handelChange={(e) => setEmail(e.target.value)}
          />
          <TextInput
            label="Password"
            placeholder="Enter your password"
            password
            value={password}
            handelChange={(e) => setPassword(e.target.value)}
          />
          <Button text="Sign In" onClick={onLogin} isLoading={loading} isDisabled={loading} />
        </div>
      </Card>
    </Container>
  );
};

export default RestaurantLogin;

