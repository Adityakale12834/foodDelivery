import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import { AdminSignUp } from "../../api";
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

const TextButton = styled(Link)`
  width: 100%;
  text-align: end;
  color: ${({ theme }) => theme.text_primary};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  font-weight: 500;
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const AdminSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminSecret, setAdminSecret] = useState("");

  const validateInputs = () => {
    if (!name || !email || !password || !adminSecret) {
      alert("Please fill in all fields");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    setLoading(true);
    setButtonDisabled(true);

    if (validateInputs()) {
      try {
        const res = await AdminSignUp({ name, email, password }, adminSecret);
        dispatch(loginSuccess(res.data));
        dispatch(
          openSnackbar({
            message: "Admin account created",
            severity: "success",
          })
        );
        navigate("/admin/dashboard");
      } catch (err) {
        const msg = err?.response?.data?.message || err.message;
        dispatch(openSnackbar({ message: msg, severity: "error" }));
      } finally {
        setLoading(false);
        setButtonDisabled(false);
      }
    } else {
      setLoading(false);
      setButtonDisabled(false);
    }
  };
  return (
    <Container>
      <Card>
        <div>
          <Title>Create Admin Account</Title>
          <Span>Requires your server ADMIN_SECRET</Span>
        </div>
        <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
          <TextInput
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            handelChange={(e) => setName(e.target.value)}
          />
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
          <TextInput
            label="Admin Secret"
            placeholder="Enter ADMIN_SECRET"
            password
            value={adminSecret}
            handelChange={(e) => setAdminSecret(e.target.value)}
          />

          <TextButton to="/admin/login">Already admin? Sign in</TextButton>
          <Button
            text="Create Admin"
            onClick={handleSignUp}
            isLoading={loading}
            isDisabled={buttonDisabled}
          />
        </div>
      </Card>
    </Container>
  );
};

export default AdminSignup;
