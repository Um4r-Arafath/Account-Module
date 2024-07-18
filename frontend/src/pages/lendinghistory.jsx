import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LendingHistory() {
  const [lenders, setLenders] = useState([]);
  const [selectedLender, setSelectedLender] = useState('');
  const [lenderHistory, setLenderHistory] = useState([]);
  const [filterType, setFilterType] = useState('');
  // eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLenders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/lenders-dropdown');
        setLenders(response.data);
      } catch (error) {
        console.error('Error fetching lenders:', error);
      }
    };

    fetchLenders();
  }, []);

  const fetchLenderHistory = async (lenderName) => {
    try {
      setIsLoading(true); // Set loading to true before fetching data

      const response = await axios.get(`http://localhost:3001/api/lending/history/${lenderName}`);
      setLenderHistory(response.data);

      setIsLoading(false); // Set loading to false after data is received
    } catch (error) {
      console.error('Error fetching lender history:', error);
      setIsLoading(false);
    }
  };


  const calculateTotalLendAmount = () => {
    if (!lenderHistory || lenderHistory.length === 0) {
      return 0;
    }

    // Initialize lend and return amounts
    let lendAmount = 0;
    let returnAmount = 0;

    // Calculate lend and return amounts
    lenderHistory.forEach((entry) => {
      if (entry.type === 'lend' && entry.amount) {
        lendAmount += parseFloat(entry.amount);
      } else if (entry.type === 'return' && entry.amount) {
        returnAmount += parseFloat(entry.amount);
      }
    });

    // Calculate the remaining amount after deducting returns from lends
    const remainingAmount = lendAmount - returnAmount;

    return remainingAmount >= 0 ? remainingAmount : 0;
  };


  const handleLenderChange = (event) => {
    const selectedLenderName = event.target.value;
    setSelectedLender(selectedLenderName);

    if (selectedLenderName) {
      fetchLenderHistory(selectedLenderName);
    }
    setFilterType('');
  };

  const handleFilterChange = (event) => {
    const selectedFilterType = event.target.value;
    setFilterType(selectedFilterType);
  };

  const openPrintPreview = () => {
    const lenderName = selectedLender; // Assuming selectedLender holds the lender's name
    const currentDate = new Date().toLocaleDateString('en-gb');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
          <html>
            <head>
              <title>${lenderName} | Lending Report</title>
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
              <h2>LENDING REPORT</h2>
              <p>Lender: ${lenderName}</p>
              <p>Date: ${currentDate}</p>
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Payment Type</th>
                    <th>Promised Return Date</th>
                  </tr>
                </thead>
                <tbody>
                  ${lenderHistory
        .filter((entry) => !filterType || entry.type === filterType)
        .map((entry, index) => {
          const returnDate = entry.date ? new Date(entry.date) : null;
          const promisedReturnDate =
            entry.type !== 'return' && returnDate
              ? new Date(returnDate.getTime() + 7 * 24 * 60 * 60 * 1000) // Adjust this calculation as needed
              : null;

          return `
                        <tr key=${index}>
                          <td>${entry.type || 'Filled Value'}</td>
                          <td>${entry.date ? returnDate.toLocaleDateString('en-gb') : '-'}</td>
                          <td>${entry.amount ? `AED ${parseFloat(entry.amount).toLocaleString()}` : 'N/A'}</td>
                          <td>${entry.payment_type || '-'}</td>
                          <td>${entry.type !== 'return' && promisedReturnDate ? promisedReturnDate.toLocaleDateString('en-gb') : '-'}</td>
                        </tr>`;
        })
        .join('')}
                  <tr>
                    <td colSpan="5">
                      <strong>Total Lend Amount: AED ${calculateTotalLendAmount().toLocaleString('en-US')}</strong>
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
          <select className='m-2 p-2' value={selectedLender} onChange={handleLenderChange}>
            <option value="">Select Lender</option>
            {lenders.map((lender, index) => (
              <option key={index} value={lender.lender_name}>
                {lender.lender_name}
              </option>
            ))}
          </select>
          <select className='m-2 p-2' value={filterType} onChange={handleFilterChange}>
            <option value="">Filter by Type</option>
            <option value="lend">Lend</option>
            <option value="return">Return</option>
          </select>
          <button className='btn btn-dark mb-1' onClick={openPrintPreview}>Print Preview</button>
        </div>
        {selectedLender && lenderHistory.length > 0 ? (
          <div className="container mt-3">
            <h2 className='text-center p-2 mb-3'>LENDING REPORT</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Payment Type</th> {/* Include Payment Type column */}
                  <th>Promised Return Date</th>
                </tr>
              </thead>
              <tbody>
                {lenderHistory
                  .filter((entry) => {
                    if (filterType === '') {
                      return true;
                    } else {
                      return entry.type.toLowerCase() === filterType.toLowerCase();
                    }
                  })
                  .map((entry, index) => {
                    const returnDate = entry.date ? new Date(entry.date) : null;
                    const promisedReturnDate =
                      entry.type !== 'return' && returnDate
                        ? new Date(returnDate.getTime() + 7 * 24 * 60 * 60 * 1000)
                        : null;

                    return (
                      <tr key={index}>
                        <td>{entry.type || 'Filled Value'}</td>
                        <td>{entry.date ? returnDate.toLocaleDateString('en-gb') : '-'}</td>
                        <td>{entry.amount ? `AED ${parseFloat(entry.amount).toLocaleString()}` : 'N/A'}</td>
                        <td>{entry.type === 'lend' ? entry.payment_type || '-' : '-'}</td>
                        <td>{entry.type !== 'return' && promisedReturnDate ? promisedReturnDate.toLocaleDateString('en-gb') : '-'}</td>
                      </tr>
                    );
                  })}

                <tr>
                  <td colSpan="6">
                    <strong>Total Lend Amount: AED {calculateTotalLendAmount().toLocaleString('en-US')}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : selectedLender ? (
          <div className="container mt-3">
            <p>No lending history found for the selected lender.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default LendingHistory;