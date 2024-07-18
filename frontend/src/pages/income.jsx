import React, { useState, useEffect } from 'react';
import { BsCashCoin } from "react-icons/bs";
import '../styles/income.css';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Income() {

  //inserting the data to database
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const customer_id = 'test112233';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/income', { customer_id, date, description, amount });
      toast.success('Income added Successfully!!');
      setDate('');
      setDescription('');
      setAmount('');
      axios.get('http://localhost:3001/api/incomelist')
        .then(response => {
          setIncome(response.data);
        })
        .catch(error => {
          console.error('Error fetching income data', error);
        });

    } catch (error) {
      console.error('Error while adding income', error);
      toast.error('Failed to add income. Please try again!');
    }
  };

  //Retrive data to the table from the db
  const [income, setIncome] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:3001/api/incomelist')
      .then(response => {
        setIncome(response.data);
      })
      .catch(error => {
        console.error('Error fetching Income', error);
      });
  }, []);

  // Delete the data from the database
  const handleDelete = (id) => {
    console.log('Deleting income with ID:', id);
    axios.delete(`http://localhost:3001/api/removeincome/${id}`)
      .then(response => {
        console.log('Income deleted successfully');
        toast.warning('Income removed successfully!');
        setIncome(income.filter(income => income.id !== id));
      })
      .catch(error => {
        console.error('Error deleting income:', error);
      });
  };

  //To show latest income from the begining
  const reversedIncome = [...income].reverse();

  return (
    <div className="container mt-1">
      <div>
        <div className="card">
          <div className="card-body shadow p-5">
            <h3 className="pb-3 text-center">
              <ToastContainer />
              <BsCashCoin id='income-icon' /><b className="p-2 ">DAILY INCOME</b>
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input type="date" required  value={date} onChange={(e) => setDate(e.target.value)} className="form-control" />
              </div>
              <div className="form-group">
                <input type="text" required  className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
              </div>
              <div>
                <div className="form-group input-group">
                  <span class="input-group-text">AED</span>
                  <input type="text" required  class="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div>
                  <div className="align-content-center d-flex justify-content-center pt-3">
                    <button type="submit" className="btn btn-outline-dark align-content-center">Add Income</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <table class="table mt-3 text-center shadow">
          <thead class="thead-dark">
            <tr>
              <th scope="col" >#</th>
              <th scope="col" >Date</th>
              <th scope="col">Description</th>
              <th scope="col">Amount</th>
              <th scope="col" className='text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
            {reversedIncome.map((income) => (
              <tr key={income.id}>
                <th scope="row">#</th>
                <td >{new Date(income.date).toLocaleDateString('en-GB')}</td>
                <td>{income.description}</td>
                <td>AED {income.amount}</td>
                <td >
                  <button type="button" className="btn btn-outline-danger" onClick={() => handleDelete(income.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Income