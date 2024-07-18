import React, { useState, useEffect } from 'react';
import { BsCashCoin } from "react-icons/bs";
import '../styles/income.css';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Expense() {

  //add expense
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/expense', { date, description, amount });
      toast.success('Expense added Successfully!!');
      setDate('');
      setDescription('');
      setAmount('');
      axios.get('http://localhost:3001/api/expenselist')
        .then(response => {
          setExpense(response.data);
        })
        .catch(error => {
          console.error('Error fetching Expense data', error);
        });

    } catch (error) {
      console.error('Error while adding Expense', error);
      toast.error('Failed to add expense. Please try again!');
    }
  };

  //Retrive data to the table from the db
  const [expense, setExpense] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/expenselist')
      .then(response => {
        setExpense(response.data);
      })
      .catch(error => {
        console.error('Error fetching Expense', error);
      });
  }, []);

  //To show latest expense from the begining
  const reversedExpense = [...expense].reverse();

  // Delete the data from the database
  const handleDelete = (id) => {
    console.log('Deleting expense with ID:', id);
    axios.delete(`http://localhost:3001/api/removeexpense/${id}`)
      .then(response => {
        console.log('Expense deleted successfully');
        toast.warning('Expense removed successfully!');
        setExpense(expense.filter(expense => expense.id !== id));
      })
      .catch(error => {
        console.error('Error deleting income:', error);
      });
  };



  return (
    <div className="container mt-1">
      <div>
        <div className="card">
          <div className="card-body shadow p-5">
            <h3 className="pb-3 text-center">
              <ToastContainer />
              <BsCashCoin id='income-icon' /><b className="p-2 ">DAILY EXPENSE</b>
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input type="date" required className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="form-group">
                <input type="text" required className="form-control" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div>
                <div className="form-group input-group">
                  <span class="input-group-text">AED</span>
                  <input type="text" required class="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div>
                  <div className="align-content-center d-flex justify-content-center pt-3">
                    <button type="submit" className="btn btn-outline-dark align-content-center">Add Expense</button>
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
            {reversedExpense.map((expense) => (
              <tr key={expense.id}>
                <th scope="row">#</th>
                <td>{new Date(expense.date).toLocaleDateString('en-GB')}</td>
                <td>{expense.description}</td>
                <td>AED  {expense.amount}</td>
                <td >
                  <button type="button" className="btn btn-outline-danger" onClick={() => handleDelete(expense.id)} >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Expense;