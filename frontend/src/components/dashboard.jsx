import React from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { FaHome, FaUserShield, FaUserCircle, FaCaretDown, FaHistory } from "react-icons/fa";
import { GiPayMoney } from "react-icons/gi";
import { BsCashCoin, BsCash } from "react-icons/bs";
import { HiDocumentReport, HiOutlineCash } from "react-icons/hi";
import { TbUsersGroup } from "react-icons/tb";
import { VscGraphLeft } from "react-icons/vsc";
import { MdMoneyOff, MdOutlinePayment } from "react-icons/md";
import "./dashboard.css";
import Orders from "../pages/income";
import Expense from "../pages/expense";
import DailyReport from "../pages/daily_report";
import Users from "../pages/addUser";
import Home from "../pages/home";
import Customer from "../pages/customer";
import Debtor from "../pages/debtor";
import Header from "../pages/header";
import Footer from "../pages/footer";
import Lending from "../pages/lending";
import History from "../pages/credithistory";
import Lendors from "../pages/Lenders";
import DebtorRepay from "../pages/debtorepay";
import LenderRepay from "../pages/lenderrepay";
import LendingHistory from "../pages/lendinghistory";
import MonthlyReport from "../pages/monthly_report";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Dashboard = () => {
  const location = useLocation();

  return (
    <div className="container-fluid">
      <div className="row">

        <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block card sidebar m-3 shadow">
          <div className="card-body">
            <div className="text-left mb-3 ">
              <h6 className="card-title text-light sidebar-header ">
                <FaUserShield className="mr-2 " /> Accounts Module
              </h6>
              <hr className="bg-light" />
            </div>
            <ul className="nav flex-column">
              <li className="nav-item  mb-2">
                <NavLink to="/dashboard/home" className="nav-link" isActive={() => location.pathname === '/dashboard/home'} activeStyle={{ backgroundColor: "blue", color: "white" }}>
                  <FaHome className="mr-2" /> Dashboard
                </NavLink>
              </li>
              <li className="nav-item dropdown  mb-2">
                <NavLink
                  to="#" className="nav-link d-flex align-items-center" id="accountsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="true" >
                  <span>  <VscGraphLeft className="mr-2" /> Accounts </span>
                  <span className="ms-auto">  <FaCaretDown />   </span>
                </NavLink>
                <ul className="dropdown-menu" aria-labelledby="accountsDropdown" >
                  <li className="nav-item mb-2">
                    <NavLink to="/dashboard/income" className="nav-link">
                      <BsCashCoin className="mr-2" /> Income
                    </NavLink>
                  </li>
                  <li className="nav-item mb-2">
                    <NavLink to="/dashboard/expense" className="nav-link">
                      <BsCash className="mr-2" /> Expense
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/dashboard/daily_report" className="nav-link">
                      <HiDocumentReport className="mr-2" /> Daily Report
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/dashboard/monthly_report" className="nav-link">
                      <HiDocumentReport className="mr-2" /> Monthly Report
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown  mb-2">
                <NavLink
                  to="#" className="nav-link d-flex align-items-center" id="accountsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="true" >
                  <span>  <MdMoneyOff className="mr-2" /> Debt Account </span>
                  <span className="ms-auto">  <FaCaretDown />   </span>
                </NavLink>
                <ul className="dropdown-menu" aria-labelledby="accountsDropdown" >
                  <li className="nav-item mb-2">
                    <NavLink to="/dashboard/customer" className="nav-link">
                      <TbUsersGroup className="mr-2" /> Customer
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/dashboard/debtor" className="nav-link">
                      <GiPayMoney className="mr-2" /> Debtor
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/dashboard/debtor_repay" className="nav-link">
                      <MdOutlinePayment className="mr-2" /> Debtor Repay
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/dashboard/debt_report" className="nav-link">
                      <FaHistory className="mr-2" /> Debtor Report
                    </NavLink>
                  </li>
                </ul>
              </li>

              <li className="nav-item dropdown  mb-2">
                <NavLink
                  to="#" className="nav-link d-flex align-items-center" id="accountsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="true" >
                  <span>  <HiOutlineCash className="mr-2" /> Lending Account </span>
                  <span className="ms-auto">  <FaCaretDown />   </span>
                </NavLink>
                <ul className="dropdown-menu" aria-labelledby="accountsDropdown" >
                  <li className="nav-item mb-2">
                    <NavLink to="/dashboard/lenders" className="nav-link">
                      <TbUsersGroup className="mr-2" /> Lenders
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/dashboard/lending" className="nav-link">
                      <GiPayMoney className="mr-2" /> Lendings
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/dashboard/lender_repay" className="nav-link">
                      <MdOutlinePayment className="mr-2" /> Lendor Repay
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/dashboard/lend_report" className="nav-link">
                      <FaHistory className="mr-2" /> Lendor Report
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <NavLink to="/dashboard/users" className="nav-link" >
                  <FaUserCircle className="mr-2" /> Users
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>

        <main role="main" className="col-md-8 ml-sm-auto col-lg-9" id="content" >

          <Header />
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/income" element={<Orders />} />
            <Route path="/expense" element={<Expense />} />
            <Route path="/daily_report" element={<DailyReport />} />
            <Route path="/monthly_report" element={<MonthlyReport />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/users" element={<Users />} />
            <Route path="/debtor" element={<Debtor />} />
            <Route path="/lending" element={<Lending />} />
            <Route path="/debt_report" element={<History />} />
            <Route path="/debtor_repay" element={<DebtorRepay />} />
            <Route path="/lenders" element={<Lendors />} />
            <Route path="/lender_repay" element={<LenderRepay />} />
            <Route path="/lend_report" element={<LendingHistory />} />
          </Routes>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
