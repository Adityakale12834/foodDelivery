import React from "react";
import styled from "styled-components";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/reducers/UserSlice";

const Shell = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  background: ${({ theme }) => theme.bg};
`;

const Sidebar = styled.div`
  width: 240px;
  padding: 18px 14px;
  border-right: 1px solid ${({ theme }) => theme.text_secondary + 30};
  @media (max-width: 900px) {
    width: 200px;
  }
  @media (max-width: 700px) {
    display: none;
  }
`;

const Brand = styled.div`
  font-weight: 800;
  color: ${({ theme }) => theme.primary};
  font-size: 18px;
  margin-bottom: 14px;
`;

const NavItem = styled(NavLink)`
  display: block;
  padding: 10px 12px;
  border-radius: 10px;
  text-decoration: none;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 600;
  margin: 6px 0;

  &.active {
    background: ${({ theme }) => theme.primary + 18};
    color: ${({ theme }) => theme.primary};
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 22px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
`;

const LogoutBtn = styled.button`
  border: 1px solid ${({ theme }) => theme.text_secondary + 40};
  background: transparent;
  color: ${({ theme }) => theme.text_primary};
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
  }
`;

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  return (
    <Shell>
      <Sidebar>
        <Brand>Admin Portal</Brand>
        <NavItem to="/admin/dashboard">Dashboard</NavItem>
        <NavItem to="/admin/restaurants">Restaurants</NavItem>
        <NavItem to="/admin/orders">Orders</NavItem>
      </Sidebar>
      <Content>
        <TopRow>
          <div />
          <LogoutBtn onClick={onLogout}>Logout</LogoutBtn>
        </TopRow>
        <Outlet />
      </Content>
    </Shell>
  );
};

export default AdminLayout;

