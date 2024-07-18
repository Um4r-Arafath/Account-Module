import React from 'react';
import { useLocation } from 'react-router-dom';
import { TbUserCircle } from "react-icons/tb";
import { FaSignOutAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import '../styles/header.css';
function Header() {
    const location = useLocation();

    const handleSignOut = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    const dropdownItems = [
        { id: 1, label: 'Dashboard', link: '/dashboard/home'},
        { id: 2, label: 'Reports', link: '/dashboard/daily_report'},
        { id: 3, label: 'Customer', link: '/dashboard/customer'},
        { id: 4, label: 'Debtor', link: '/dashboard/debtor'},
        { id: 5, label: 'Lending', link: '/dashboard/lending'},
        { id: 5, label: 'Daily Report', link: '/dashboard/daily_report'},
        { id: 7, label: 'Lending Report', link: '/dashboard/lend_report'},
        { id: 8, label: 'Debtor Report', link: '/dashboard/debt_report'},
        { id: 9, label: 'Sign Out', link: '/', signOut: true },
    ];

    return (
        <header className="sticky-top ">
            <nav className="card shadow navbar navbar-light bg-light mt-2 ms-2 me-2 mb-4" id="nav">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    <div>
                        <p className="m-0"> accounts{location.pathname}</p>
                    </div>
                    <div>
                        <div className="dropdown">
                            <button className="btn" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                <TbUserCircle size={32} />
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                {dropdownItems.map((item) => (
                                    <li key={item.id}>
                                        {item.signOut ? (
                                            <a className="dropdown-item" href="/" onClick={handleSignOut}>
                                                <FaSignOutAlt className="mr-2" />
                                                {item.label}
                                            </a>
                                        ) : (
                                            <a className="dropdown-item" href={item.link}>{item.label}</a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;