import React, { useState, useEffect } from 'react';
import { TbUsersGroup } from "react-icons/tb";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Lenders() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [lenderCode, setLenderCode] = useState('');
    const [lenders, setLenders] = useState([]);

    const handleSubmit = (event) => {
        event.preventDefault();

        const lenderData = {
            name,
            email,
            mobile,
            lender_code: lenderCode
        };

        axios.post('http://localhost:3001/api/add-lender', lenderData)
            .then(response => {
                console.log('Lender Added Successfully!');
                toast.success('Lendor Added Successfully!');
                setName('');
                setEmail('');
                setMobile('');
                setLenderCode('');

                axios.get('http://localhost:3001/api/view-lenders')
                .then(response => {
                    setLenders(response.data);
                })
                .catch(error => {
                    console.error('Error fetching updated lenders', error);
                });
            })
            .catch(error => {
                console.error('Error while adding Lendor', error);
            })
    }

    useEffect(() => {
        axios.get('http://localhost:3001/api/view-lenders')
            .then(response => {
                setLenders(response.data);
            })
            .catch(error => {
                console.error('error fetching lenders', error);
            });
    }, []);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3001/api/remove-lenders/${id}`)
        .then(response => {
            console.log('Lenders removed successfully!');
            toast.warning('Lender removed successfully!');
            setLenders(lenders.filter(lenders => lenders.id !== id))
        })
        .catch(error => {
            console.error('Error Fetching Lenders !');
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
                            <b className="p-2 ">LENDERS</b>
                        </h3>
                        <form on onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input type="text" required className="form-control" placeholder="Lendor Name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <input type="email" required className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <input type="text" required className="form-control" placeholder="Mobile No" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <input type="text" required className="form-control" placeholder="Lendor Code" value={lenderCode} onChange={(e) => setLenderCode(e.target.value)} />
                            </div>

                            <div className="align-content-center d-flex justify-content-center pt-3">
                                <button type="submit" className="btn btn-outline-dark align-content-center">Add Lendors</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='mt-4'>
                    <table class="table shadow text-center">
                        <thead class="thead-dark">
                            <tr>
                                <th scope="col">NO</th>
                                <th scope="col">LENDER NAME</th>
                                <th scope="col">LENDER CODE</th>
                                <th scope="col">EMAIL</th>
                                <th scope="col">MOBILE NO</th>
                                <th scope="col">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lenders.map((lender, index) => (
                                <tr key={lender.id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{lender.lender_name}</td>
                                    <td>{lender.lender_code}</td>
                                    <td>{lender.lender_email}</td>
                                    <td>{lender.lender_phone}</td>
                                    <td className='text-center'>
                                        <button type="button" className="btn btn-outline-danger" onClick={() => handleDelete(lender.id)}>Delete</button>
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

export default Lenders