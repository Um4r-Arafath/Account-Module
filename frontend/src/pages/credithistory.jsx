import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CreditHistory() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customerHistory, setCustomerHistory] = useState([]);
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/customers-dropdown');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const fetchCustomerHistory = async (customerName) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/customer/history/${customerName}`);
      setCustomerHistory(response.data);
    } catch (error) {
      console.error('Error fetching customer history:', error);
    }
  };

  const calculateTotalAmount = () => {
    const creditTotal = customerHistory.reduce((total, credit) => {
      if (credit.type === 'credit' && credit.credit_amount !== '-') {
        return total + parseFloat(credit.credit_amount);
      } else if (credit.type === 'credit income' && credit.credit_amount !== '-') {
        return total - parseFloat(credit.credit_amount);
      }
      return total;
    }, 0);

    return creditTotal;
  };

  const handleCustomerChange = (event) => {
    const selectedCustomerName = event.target.value;
    setSelectedCustomer(selectedCustomerName);

    if (selectedCustomerName) {
      fetchCustomerHistory(selectedCustomerName);
    }
    setFilterType('');
  };

  const handleFilterChange = (event) => {
    const selectedFilterType = event.target.value;
    setFilterType(selectedFilterType);
  };


  const openPrintPreview = () => {
    const customerName = selectedCustomer; // Assuming selectedCustomer holds the customer's name
    const currentDate = new Date().toLocaleDateString('en-gb');
  
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${customerName} | Credit Report</title>
          <style>
            /* Define your styles here */
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              text-align: center;
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            table {
              width: 70%;
              border-collapse: collapse;
              margin-top: 30px;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }
            h2 {
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <h2>CREDIT REPORT</h2>
          <p>Customer: ${customerName}</p>
          <p>Date: ${currentDate}</p>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Return / Return Date</th>
                <th>Amount</th>
                <th>Payment Type</th>
                <th>Return Date</th>
              </tr>
            </thead>
            <tbody>
              ${customerHistory
                .filter((credit) => !filterType || credit.type === filterType)
                .map((credit, index) => (
                  `<tr key=${index}>
                    <td>${credit.type}</td>
                    <td>${new Date(credit.credit_date).toLocaleDateString('en-gb')}</td>
                    <td>AED ${parseFloat(credit.credit_amount).toLocaleString()}</td>
                    <td>${credit.payment_type}</td>
                    <td>
                      ${credit.due_date !== '-' && new Date(credit.due_date) instanceof Date && !isNaN(new Date(credit.due_date)) ?
                        new Date(credit.due_date).toLocaleDateString('en-gb') :
                        '-'
                      }
                    </td>
                  </tr>`
                ))
                .join('')}
              <tr>
                <td colSpan="4">
                  <strong>Total Balance Amount: AED ${calculateTotalAmount().toLocaleString('en-US')}</strong>
                </td>
              </tr>
            </tbody>
          </table>
          <script>
            // Automatically trigger print dialog
            window.onload = () => {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
  };
  

  return (
    <div className="container mt-3">
      <div className='card shadow'>
        <div>
          <select className='m-2 p-2' value={selectedCustomer} onChange={handleCustomerChange}>
            <option value="">Select Customer</option>
            {customers.map((customer, index) => (
              <option key={index} value={customer.cus_name}>
                {customer.cus_name}
              </option>
            ))}
          </select>

          <select className='m-2 p-2' value={filterType} onChange={handleFilterChange}>
            <option value="">Filter by Type</option>
            <option value="credit">Credit</option>
            <option value="credit income">Credit Income</option>
          </select>
          <button className='btn btn-dark mb-1' onClick={openPrintPreview}>Print Preview</button>
        </div>

        {selectedCustomer && customerHistory.length > 0 ? (
          <div className="container mt-3">
            <h2 className='text-center p-2 mb-3'>CREDIT REPORT</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Return / Return Date </th>
                  <th>Amount</th>
                  <th>Payment Type</th>
                  <th>Return Date</th>
                </tr>
              </thead>
              <tbody>
                {customerHistory
                  .filter((credit) => !filterType || credit.type === filterType)
                  .map((credit, index) => (
                    <tr key={index}>
                      <td>{credit.type}</td>
                      <td>{new Date(credit.credit_date).toLocaleDateString('en-gb')}</td>
                      <td>AED {parseFloat(credit.credit_amount).toLocaleString()}</td>
                      <td>{credit.payment_type}</td>
                      <td>
                        {credit.due_date !== '-' && new Date(credit.due_date) instanceof Date && !isNaN(new Date(credit.due_date)) ?
                          new Date(credit.due_date).toLocaleDateString('en-gb') :
                          '-'
                        }
                      </td>
                    </tr>
                  ))}
                <tr>
                  <td colSpan="4">
                    <strong>Total Amount: AED {calculateTotalAmount().toLocaleString('en-US')}</strong>                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : selectedCustomer ? (
          <div className="container mt-3">
            <p>No credit history found for the selected customer.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}



export default CreditHistory;
