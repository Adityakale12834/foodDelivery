import React, { useState } from "react";
import styled from "styled-components";
import {
  Email,
  Phone,
  LocationOn,
  Send,
} from "@mui/icons-material";
import { submitContactQuery } from "../api";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/SnackbarSlice";

const Container = styled.div`
  padding: 40px 30px 200px;
  min-height: 100%;
  background: ${({ theme }) => theme.bg};
  @media (max-width: 768px) {
    padding: 24px 16px 120px;
  }
`;

const Section = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
  margin: 0 0 32px 0;
`;

const InfoCard = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.text_secondary + 25};
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

const IconWrap = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ theme }) => theme.primary + 18};
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const InfoLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.text_primary};
`;

const FormCard = styled.form`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.text_secondary + 25};
  border-radius: 16px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
  border-radius: 10px;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.text_primary};
  box-sizing: border-box;
  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }
  &::placeholder {
    color: ${({ theme }) => theme.text_secondary + 99};
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px 16px;
  font-size: 15px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
  border-radius: 10px;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.text_primary};
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;
  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }
  &::placeholder {
    color: ${({ theme }) => theme.text_secondary + 99};
  }
`;

const SubmitBtn = styled.button`
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: ${({ theme }) => theme.primary};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.2s;
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Contact = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name?.trim() || !form.email?.trim() || !form.message?.trim()) {
      dispatch(
        openSnackbar({ message: "Please fill name, email and message", severity: "error" })
      );
      return;
    }
    setSubmitting(true);
    try {
      await submitContactQuery(form);
      dispatch(
        openSnackbar({ message: "Query submitted successfully! We'll get back soon.", severity: "success" })
      );
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err?.response?.data?.message || "Failed to submit query",
          severity: "error",
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Section>
        <div>
          <Title>Get in Touch</Title>
          <Subtitle>
            Have questions? Reach out to us — we&apos;re here to help.
          </Subtitle>
          <InfoCard>
            <InfoItem>
              <IconWrap>
                <Email />
              </IconWrap>
              <div>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>support@mealkartzs.com</InfoValue>
              </div>
            </InfoItem>
            <InfoItem>
              <IconWrap>
                <Phone />
              </IconWrap>
              <div>
                <InfoLabel>Phone</InfoLabel>
                <InfoValue>+1 (555) 123-4567</InfoValue>
              </div>
            </InfoItem>
            <InfoItem>
              <IconWrap>
                <LocationOn />
              </IconWrap>
              <div>
                <InfoLabel>Address</InfoLabel>
                <InfoValue>123 Food Street, City, State 12345</InfoValue>
              </div>
            </InfoItem>
          </InfoCard>
        </div>
        <FormCard onSubmit={handleSubmit}>
          <FormLabel>Name *</FormLabel>
          <FormInput
            type="text"
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <FormLabel>Email *</FormLabel>
          <FormInput
            type="email"
            name="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          <FormLabel>Subject</FormLabel>
          <FormInput
            type="text"
            name="subject"
            placeholder="What is this about?"
            value={form.subject}
            onChange={handleChange}
          />
          <FormLabel>Message *</FormLabel>
          <FormTextarea
            name="message"
            placeholder="Write your query here..."
            value={form.message}
            onChange={handleChange}
            required
          />
          <SubmitBtn type="submit" disabled={submitting}>
            <Send fontSize="small" /> {submitting ? "Sending…" : "Send Query"}
          </SubmitBtn>
        </FormCard>
      </Section>
    </Container>
  );
};

export default Contact;
