import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
    const currentYear = new Date().getFullYear();
    const softwareVersion = "1.3.0";

    return (
        <div className='mt-5'>
            <hr className="my-2 " />
            <footer className="footer mt-auto ">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    <div>
                        <p className="mb-0">
                            <a
                                href="https://www.tajalkenztech.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none', color: 'black' }}
                            >
                                &copy; {currentYear} Taj Alkenz Technologies. All Rights Reserved.
                            </a>
                        </p>
                    </div>
                    <div>
                        <p className="mb-0">Version: {softwareVersion}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Footer;
