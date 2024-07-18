import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function DebtorRepay() {
  const [creditDate, setCreditDate] = useState('');
  const [rePaymentAmount, setRePaymentAmount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [totalDueAmount, setTotalDueAmount] = useState(0); // Assuming this is set elsewhere in your component
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
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

  const fetchDueAmount = async (customerName) => {
    if (customerName === '') {
      setTotalDueAmount('');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3001/api/customer/history/${customerName}`);
      const dueAmountData = response.data;
      console.log('Fetched due amount data:', dueAmountData);
  
      // Calculate the total credit amount and total credit income amount
      let totalCreditAmount = 0;
      let totalCreditIncomeAmount = 0;
  
      for (const creditData of dueAmountData) {
        if (creditData.type === 'credit' && creditData.credit_amount !== '-') {
          totalCreditAmount += parseFloat(creditData.credit_amount);
        } else if (creditData.type === 'credit income' && creditData.credit_amount !== '-') {
          totalCreditIncomeAmount += parseFloat(creditData.credit_amount);
        }
      }
  
      // Handle potential invalid credit amounts
      totalCreditAmount = isNaN(totalCreditAmount) ? 0 : totalCreditAmount;
      totalCreditIncomeAmount = isNaN(totalCreditIncomeAmount) ? 0 : totalCreditIncomeAmount;
  
      // Deduct credit income from credit to get the net total
      const netTotalDueAmount = totalCreditAmount - totalCreditIncomeAmount;
  
      setTotalDueAmount(netTotalDueAmount.toString());
    } catch (error) {
      console.error('Error fetching due amount:', error);
      toast.error(`${customerName} has no Credit`);
      setTotalDueAmount('');
    }
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/credit-repayments', {
        date: creditDate,
        description: customerName,
        amount: rePaymentAmount
      });

      if (response.status === 200) {
        toast.success('Credit repayment added successfully!');
        setCreditDate('');
        setRePaymentAmount('');
        setCustomerName('');
        setTotalDueAmount(0);
      }
    } catch (error) {
      console.error('Error adding credit repayment:', error);
      toast.error('Failed to add credit repayment');
    }
  };

  const formatNumberWithSeparator = (number) => {
    return Number(number).toLocaleString('en');
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body shadow p-4">
          <h3 className="pb-3 text-center">
            <ToastContainer />
            <b className="p-2">DEBTOR REPAY</b>
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
                    value={creditDate}
                    onChange={(e) => setCreditDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <select
                    id="customer_name"
                    className="form-select"
                    name="customer_name"
                    value={customerName} // Set the value attribute for controlled components
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      fetchDueAmount(e.target.value); // Fetch due amount when a customer is selected
                    }}
                  >
                    <option key="default" value="">
                      Select Customer
                    </option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}> 
                        {customer.cus_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col">
                <div className="form-group input-group">
                  <span className="input-group-text">AED</span>
                  <input
                    placeholder="Total Due Amount"
                    type="text"
                    id="total_due_amount"
                    className="form-control"
                    value={formatNumberWithSeparator(totalDueAmount)}
                    readOnly
                  />
                </div>
                <div className="form-group input-group">
                  <span className="input-group-text">AED</span>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Re Payment Amount"
                    name="repayment_amount"
                    value={rePaymentAmount}
                    onChange={(e) => setRePaymentAmount(e.target.value)}
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

export default DebtorRepay;