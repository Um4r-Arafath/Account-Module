import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

function Lending() {

  const [lenders, setLenders] = useState([]);
  const [selectedLender, setSelectedLender] = useState({ name: '', code: '' });
  // eslint-disable-next-line no-unused-vars
  const [lenderName, setLenderName] = useState('');
  const [lendAmount, setLendAmount] = useState('');
  const [description, setDescription] = useState('');
  const [lendDate, setLendDate] = useState('');
  const [repaymentDate, setRepaymentDate] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [paymentType, setPaymentType] = useState('');
  const [lendingData, setLendingData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetch('http://localhost:3001/api/view-lenders')
      .then((response) => response.json())
      .then((data) => {
        setLenders(data);
      })
      .catch((error) => {
        console.error('Error fetching lenders', error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3001/api/view-lending')
      .then(response => {
        setLendingData(response.data);
      })
      .catch(error => {
        console.error('Error fetching lending details:', error);
      });
  }, []);

  const handleLenderChange = (event) => {
    const selectedLenderCode = event.target.value;
    const selectedLenderData = lenders.find(lender => lender.lender_code === selectedLenderCode);

    if (selectedLenderData) {
      setSelectedLender({
        name: selectedLenderData.lender_name,
        code: selectedLenderData.lender_code
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const lendingData = {
      lender_name: selectedLender.name,
      lend_amount: lendAmount,
      description: description,
      lend_date: lendDate,
      repayment_date: repaymentDate,
      payment_type: paymentType
    };

    axios.post('http://localhost:3001/api/add-lend', lendingData)
      .then(response => {
        console.log('Lending added Successfully !');
        toast.success('Lending added Successfully !');
        setLenderName('');
        setLendAmount('');
        setDescription('');
        setLendDate('');
        setRepaymentDate('');
        setPaymentType('');

        axios.get('http://localhost:3001/api/view-lending')
          .then(response => {
            setLendingData(response.data);
          })
          .catch(error => {
            console.error('Error fetching updated lending data', error);
          });

      }).catch(error => {
        console.error('Error while adding Lending!', error);
        toast.error('Failed to add lending.');
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/api/remove-lending/${id}`)
      .then(response => {
        console.log('Lenders removed successfully!');
        toast.warning('Lender removed successfully!');

        axios.get('http://localhost:3001/api/view-lending')
          .then(response => {
            setLendingData(response.data);
          })
          .catch(error => {
            console.error('Error fetching updated lending data', error);
          });
      })
      .catch(error => {
        console.error('Error Fetching Lenders !');
      })
  };

  return (
    <div className="container mt-1">
      <div className="card">
        <div className="card-body shadow p-5">
          <h3 className="pb-3 text-center">
            <ToastContainer />
            <b className="p-2 ">LENDING</b>
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <input
                    type="date" required name="lending date" className="form-control" value={lendDate} onChange={(e) => setLendDate(e.target.value)} />
                </div>
                <div className="form-group" >
                  <select name="lendor_name" className="form-select" onChange={handleLenderChange}>
                    <option key="default" value="">
                      Select Lender
                    </option>
                    {lenders.map((lender, index) => (
                      <option key={index} value={lender.lender_code}>
                        {lender.lender_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <input
                    type="text" name="lendor_code" className="form-control" value={selectedLender.code} readOnly
                  />
                </div>

                <div className="form-group input-group">
                  <span className="input-group-text">AED</span>
                  <input type="hidden" name="Lend_amount" value={lendAmount} />
                  <input type="text" required className="form-control" placeholder="Lend Amount" value={lendAmount} onChange={(e) => setLendAmount(e.target.value)} />
                </div>

              </div>
              <div className="col">
                <div className="form-group">
                  <input type="text" required name="description" className="form-control" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="form-group">
                  <input type="hidden" name="due_date" />
                  <input type="date" required name="due_date" className="form-control" placeholder="Due Date" value={repaymentDate} onChange={(e) => setRepaymentDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <select name="payment_type" className="form-select" value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                    <option value="">Select Payment Type</option>
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                    <option value="bank_deposit">Bank Deposit</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="align-content-center d-flex justify-content-center pt-3">
              <button type="submit" className="btn btn-outline-dark align-content-center">Add Lend</button>
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
          {lendingData.map((data, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{new Date(data.lend_date).toLocaleDateString('en-GB')}</td>
              <td>{data.lender_name}</td>
              <td>{data.description}</td>
              <td>{data.lend_amount}</td>
              <td>{new Date(data.repayment_date).toLocaleDateString('en-GB')}</td>
              <td>{data.payment_type}</td>
              <td>
                <button type="button" className="btn btn-outline-danger" onClick={() => handleDelete(data.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div >
  )
}

export default Lending;