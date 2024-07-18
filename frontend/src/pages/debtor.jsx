import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Debtor() {
  const [debtorData, setDebtorData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerCode, setSelectedCustomerCode] = useState('');
  const [amount, setAmount] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [customerId, setCustomerId] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [creditAmount, setCreditAmount] = useState('');
  const [creditDate, setCreditDate] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [customerCode, setCustomerCode] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const date = new Date().toISOString().split('T')[0];
    setCurrentDate(date);
  }, []);

  useEffect(() => {
    async function fetchDebtorData() {
      try {
        const response = await axios.get('http://localhost:3001/api/viewcredits');
        setDebtorData(response.data);
      } catch (error) {
        console.error('Error fetching debtor data:', error);
        toast.error('Failed to fetch debtor data');
      }
    }
    fetchDebtorData();

    async function fetchCustomerDropdown() {
      try {
        const response = await axios.get('http://localhost:3001/api/customers-dropdown');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers for dropdown:', error);
        toast.error('Failed to fetch customers');
      }
    }
    fetchCustomerDropdown();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log('Value of customerId in handleSubmit:', customerId);

    const formData = new FormData(event.target);
    formData.append('customer_id', customerId);

    console.log('FormData before axios.post:', formData);

    const data = {};

    if (formData && formData.entries) { // Check if formData is iterable
      for (let [key, value] of formData.entries()) {
        data[key] = value;
      }
      data['credit_amount'] = amount;
      data['credit_date'] = creditDate;
      data['customer_id'] = parseInt(customerId); // Ensure customer ID is an integer
      data['customer_id'] = parseInt(customerId);
      try {
        await axios.post('http://localhost:3001/api/addcredit', data);
        toast.success('Credit added successfully');

        setAmount('');
        setCreditDate('');
        setSelectedCustomerCode('');
        setCustomerId('');
        setCustomerCode('');

        axios.get('http://localhost:3001/api/viewcredits')
          .then(response => {
            setDebtorData(response.data);
          })
          .catch(error => {
            console.error('Error fetching Credits', error);
          });
      } catch (error) {
        console.error('Error adding credit:', error);
        toast.error('Failed to add credit');
      }
    } else {
      console.error('FormData is not iterable');
      // Handle the case where formData is not iterable
    }
  };

  const handleCustomerChange = (event) => {
    const selectedName = event.target.value;
    const selectedCustomer = customers.find(customer => customer.cus_name === selectedName);

    if (selectedCustomer) {
      setSelectedCustomerCode(selectedCustomer.cus_code);
      setCustomerId(selectedCustomer.id); // Check if this line is setting the correct value
      setCustomerCode(selectedCustomer.cus_code);
      console.log('Selected Customer ID:', selectedCustomer.id);
    } else {
      setSelectedCustomerCode('');
      setCustomerId('');
      setCustomerCode('');
    }
  };

  const handleDelete = (creditId) => {
    axios.delete(`http://localhost:3001/api/deletecredit/${creditId}`)
      .then(response => {
        if (response.status === 200) {
          // If deletion is successful, fetch updated credits data or update state accordingly
          axios.get('http://localhost:3001/api/viewcredits')
            .then(response => {
              setDebtorData(response.data);
            })
            .catch(error => {
              console.error('Error fetching Credits', error);
            });

          toast.warning('Credit deleted successfully');
        } else {
          toast.error('Failed to delete credit');
        }
      })
      .catch(error => {
        console.error('Error deleting credit:', error);
        toast.error('Failed to delete credit');
      });
  };

  return (
    <div className="container mt-1">
      <div className="card">
        <div className="card-body shadow p-5">
          <h3 className="pb-3 text-center">
            <ToastContainer />
            <b className="p-2 ">DEBTOR</b>
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <input
                    type="date"
                    required
                    name="credit_date"
                    className="form-control"
                    value={creditDate}
                    onChange={(e) => setCreditDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <select name="customer_name" className="form-select" onChange={handleCustomerChange}>
                    <option key="default" value="">
                      Select Customer
                    </option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.cus_name}>
                        {customer.cus_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <input type="hidden" name="customer_id" value={customerId} />
                  <input type="text" name="customer_id" className="form-control" value={selectedCustomerCode} readOnly />
                </div>

                <div className="form-group input-group">
                  <span className="input-group-text">AED</span>
                  <input type="hidden" name="credit_amount" value={creditAmount} />
                  <input type="text" required className="form-control" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>

              </div>
              <div className="col">
                <div className="form-group">
                  <input type="text" required name="description" className="form-control" placeholder="Description" />
                </div>
                <div className="form-group">
                  <input type="hidden" name="due_date" value={creditDate} />
                  <input type="date" required name="due_date" className="form-control" placeholder="Due Date" />
                </div>
                <div className="form-group">
                  <select name="payment_type" className="form-select">
                    <option value="">Select Payment Type</option>
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                    <option value="bank_deposit">Bank Deposit</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="align-content-center d-flex justify-content-center pt-3">
              <button type="submit" className="btn btn-outline-dark align-content-center">Add Debtor</button>
            </div>
          </form>
        </div>
      </div >
      <table className="table mt-3 text-center shadow">
        <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Date</th>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col">Amount</th>
            <th scope="col">Due Date</th>
            <th scope="col">Payment Type</th>
            <th scope="col">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {debtorData.map((debtor, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{new Date(debtor.credit_date).toLocaleDateString('en-GB')}</td>
              <td>{debtor.customer_name}</td>
              <td>{debtor.description}</td>
              <td>AED {debtor.credit_amount}</td>
              <td>{new Date(debtor.due_date).toLocaleDateString('en-GB')}</td>
              <td>{debtor.payment_type}</td>
              <td>
                <button type="button" className="btn btn-outline-danger" onClick={() => handleDelete(debtor.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div >
  );
}

export default Debtor;