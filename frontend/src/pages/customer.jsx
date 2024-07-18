import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { TbUsersGroup } from "react-icons/tb";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Customer() {

    //create customers
    const [cusName, setCusName] = useState('');
    const [cusEmail, setCusEmail] = useState('');
    const [cusMob, setCusMob] = useState('');
    const [cusCode, setCusCode] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        const customerData = {
            cus_name: cusName,
            cus_email: cusEmail,
            cus_mob: cusMob,
            cus_code: cusCode
        }

        axios.post('http://localhost:3001/api/addcustomer', customerData)
            .then(response => {
                console.log('Customer added successfully !!');
                toast.success('Customer added successfully!');
                setCusName('');
                setCusEmail('');
                setCusMob('');
                setCusCode('');
                axios.get('http://localhost:3001/api/viewcustomers')
                    .then(response => {
                        setCustomers(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching customers', error);
                    })
            })
            .catch(error => {
                console.error('Error while adding Customer', error);
            });
    };

    //customer visibility
    const [customers, setCustomers] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:3001/api/viewcustomers')
            .then(response => {
                setCustomers(response.data);
            })
            .catch(error => {
                console.error('error fetching customers', error);
            });
    }, []);

    //Remove customer
    const handleDelete = (id) => {
        console.log('Deleting Customer with ID:', id);
        axios.delete(`http://localhost:3001/api/removecust/${id}`)
            .then(response => {
                console.log('Customer removed successfully');
                toast.warning('Customer removed successfully');
                setCustomers(customers.filter(customer => customer.id !== id))
            })
            .catch(error => {
                console.error('error deleting customer');
            })
    };

    return (
        <div className="container mt-1">
            <div>
                <div className="card">
                    <div className="card-body shadow p-5">
                        <h3 className="pb-3 text-center">
                            <ToastContainer />
                            <TbUsersGroup className="adduser-icon" />
                            <b className="p-2 ">CUSTOMERS</b>
                        </h3>
                        <form onSubmit={handleSubmit} >
                            <div className="form-group">
                                <input type="text" required className="form-control" value={cusName} onChange={(e) => setCusName(e.target.value)} placeholder="Customer Name" />
                            </div>
                            <div className="form-group">
                                <input type="email" required className="form-control" value={cusEmail} onChange={(e) => setCusEmail(e.target.value)} placeholder="Email" />
                            </div>
                            <div className="form-group">
                                <input type="text" required className="form-control" value={cusMob} onChange={(e) => setCusMob(e.target.value)} placeholder="Mobile No" />
                            </div>
                            <div className="form-group">
                                <input type="text" required className="form-control" value={cusCode} onChange={(e) => setCusCode(e.target.value)} placeholder="Customer Code" />
                            </div>

                            <div className="align-content-center d-flex justify-content-center pt-3">
                                <button type="submit" className="btn btn-outline-dark align-content-center">Add Customer</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='mt-4'>
                    <table class="table shadow text-center">
                        <thead class="thead-dark">
                            <tr>
                                <th scope="col">NO</th>
                                <th scope="col">CUSTOMER NAME</th>
                                <th scope="col">CUSTOMER CODE</th>
                                <th scope="col">EMAIL</th>
                                <th scope="col">MOBILE NO</th>
                                <th scope="col">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer, index) => (
                                <tr key={customer.id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{customer.cus_name}</td>
                                    <td>{customer.cus_code}</td>
                                    <td>{customer.cus_email}</td>
                                    <td>{customer.cus_mob}</td>
                                    <td className='text-center'>
                                        <button type="button" className="btn btn-outline-danger" onClick={() => handleDelete(customer.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Customer