import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function LenderRepay() {
    const [lenders, setLenders] = useState([]);
    const [selectedLender, setSelectedLender] = useState(null);
    // eslint-disable-next-line
    const [dueAmount, setDueAmount] = useState('');
    const [repaymentDate, setRepaymentDate] = useState('');
    const [repaymentAmount, setRepaymentAmount] = useState('');
    const [remainingDueAmount, setRemainingDueAmount] = useState(0);

    useEffect(() => {
        async function fetchLenders() {
            try {
                const response = await axios.get('http://localhost:3001/api/lenders-dropdown');
                if (Array.isArray(response.data)) {
                    setLenders(response.data);
                } else {
                    console.error('Invalid data structure for lenders');
                }
            } catch (error) {
                console.error('Error fetching lenders:', error);
            }
        }
        fetchLenders();
    }, []);

    const handleLenderChange = async (event) => {
        const selectedLenderName = event.target.value;
        setSelectedLender(selectedLenderName);

        try {
            const response = await axios.get(`http://localhost:3001/api/lender/lend-amount/${selectedLenderName}`);
            setDueAmount(response.data.totalLendAmount || 0); // Set total lend amount as due amount
            setRemainingDueAmount(response.data.remainingDueAmount || 0); // Set remaining due amount
        } catch (error) {
            console.error('Error fetching lend amount:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await axios.post('http://localhost:3001/api/lend-repayment', {
                repayment_date: repaymentDate,
                repayment_amount: repaymentAmount,
                lender_name: selectedLender
            });
            // Clear the form fields after successful submission
            setRepaymentDate('');
            setRepaymentAmount('');
            toast.success('Lend repayment added successfully!');
        } catch (error) {
            console.error('Error submitting data:', error);
            toast.error('Lend repayment added successfully!');
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body shadow p-4">
                    <ToastContainer />
                    <h3 className="pb-3 text-center">
                        LENDER REPAY
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <div className="col">
                                <div className="form-group">
                                    <input
                                        placeholder="Date"
                                        type="date"
                                        required
                                        id="repayment_date"
                                        name="repayment_date"
                                        className="form-control"
                                        value={repaymentDate}
                                        onChange={(e) => setRepaymentDate(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <select
                                        id="lender_name"
                                        className="form-select"
                                        name="lender_name"
                                        onChange={handleLenderChange}
                                        value={selectedLender || ''}
                                    >
                                        <option value="">Select Lender</option>
                                        {lenders.map((lender) => (
                                            <option key={lender.id} value={lender.id}>
                                                {lender.lender_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group input-group">
                                    <span className="input-group-text">AED</span>
                                    <input
                                        placeholder="Remaining Due Amount"
                                        type="text"
                                        id="remaining_due_amount"
                                        className="form-control"
                                        value={remainingDueAmount}
                                        readOnly
                                    />
                                </div>
                                <div className="form-group input-group">
                                    <span className="input-group-text">AED</span>
                                    <input
                                        type="text"
                                        required
                                        className="form-control"
                                        placeholder="Repayment Amount"
                                        name="repayment_amount"
                                        value={repaymentAmount}
                                        onChange={(e) => setRepaymentAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-outline-dark">
                                Add Repayment
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LenderRepay;
