import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { BsCashCoin } from "react-icons/bs";

const Home = () => {

  //line chart
  const lineChartRef = useRef('');
  const [chartData, setChartData] = useState('');
  const [chartInstance, setChartInstance] = useState('');
  const [recentDebts, setRecentDebts] = useState([]);
  const [recentLends, setRecentLends] = useState([]);

  useEffect(() => {
    const fetchRecentData = async () => {
      try {
        const debtResponse = await axios.get('http://localhost:3001/api/recent-debts');
        console.log('Debt Response:', debtResponse.data); // Log fetched data

        if (Array.isArray(debtResponse.data)) {
          setRecentDebts(debtResponse.data.slice(0, 5));
        } else {
          console.error('Invalid data structure for recent debts:', debtResponse.data);
        }
      } catch (error) {
        console.error('Error fetching recent debts:', error);
      }
    };
    fetchRecentData();
  }, []);

  useEffect(() => {
    const fetchRecentLends = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/recent-lends');
        setRecentLends(response.data);
      } catch (error) {
        console.error('Error fetching recent lends:', error);
      }
    };
    fetchRecentLends();
  }, []);

  /* eslint-disable */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentDate = new Date();
        const date = currentDate.toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

        const dateArray = [];
        for (let i = 4; i >= 0; i--) {
          const pastDate = new Date(currentDate);
          pastDate.setDate(currentDate.getDate() - i);
          const formattedDate = `${String(pastDate.getDate()).padStart(2, '0')}-${String(pastDate.getMonth() + 1).padStart(2, '0')}-${pastDate.getFullYear()}`;
          dateArray.push(formattedDate);
        }

        const chartDataArray = [];

        for (const date of dateArray) {
          const formattedApiDate = date.split('-').reverse().join('-'); // Reformatting from DD-MM-YYYY to YYYY-MM-DD
          const response = await axios.get(`http://localhost:3001/api/daily-report-details?date=${formattedApiDate}`);
          chartDataArray.push(response.data);
        }


        const formattedChartData = {
          labels: dateArray,
          datasets: [
            {
              label: 'Income',
              data: chartDataArray.map((data) => data.totalIncome),
              borderColor: 'rgb(18,161,0)',

              fill: false,
            },
            {
              label: 'Expense',
              data: chartDataArray.map((data) => data.totalExpense),
              borderColor: 'rgb(216,0,0)',

              fill: false,
            },
            {
              label: 'Balance',
              data: chartDataArray.map((data) => data.balance),
              borderColor: 'rgb(4,0,173)',

              fill: false,
            },
          ],
        };

        setChartData(formattedChartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (lineChartRef.current && chartData) {
      if (chartInstance) {
        chartInstance.destroy();
      }

      const newChartInstance = new Chart(lineChartRef.current, {
        type: 'line',
        data: chartData,
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      setChartInstance(newChartInstance);
    }
  }, [chartData]);

  //Bar Chart
  const barChartRef = useRef('');
  const [barChartData, setBarChartData] = useState('');
  const [barChartInstance, setBarChartInstance] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentDate = new Date();
        const date = currentDate.toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

        const dateArray = [];
        for (let i = 4; i >= 0; i--) {
          const pastDate = new Date(currentDate);
          pastDate.setDate(currentDate.getDate() - i);
          const formattedDate = `${String(pastDate.getDate()).padStart(2, '0')}-${String(pastDate.getMonth() + 1).padStart(2, '0')}-${pastDate.getFullYear()}`;
          dateArray.push(formattedDate);
        }

        const chartDataArray = [];

        for (const date of dateArray) {
          const formattedApiDate = date.split('-').reverse().join('-'); // Reformatting from DD-MM-YYYY to YYYY-MM-DD
          const response = await axios.get(`http://localhost:3001/api/daily-report-details?date=${formattedApiDate}`);
          chartDataArray.push(response.data);
        }

        const formattedChartData = {
          labels: dateArray,
          datasets: [
            {
              label: 'Income',
              data: chartDataArray.map((data) => data.totalIncome),
              backgroundColor: 'rgba(18,161,0, 0.5)',
              borderColor: 'rgba(18,161,0)',
              borderWidth: 1,
            },
            {
              label: 'Expense',
              data: chartDataArray.map((data) => data.totalExpense),
              backgroundColor: 'rgba(216,0,0, 0.5)',
              borderColor: 'rgba(216,0,0)',
              borderWidth: 1,
            },
            {
              label: 'Balance',
              data: chartDataArray.map((data) => data.balance),
              backgroundColor: 'rgba(4,0,173)',
              borderColor: 'rgb(4,0,173)',
              fill: false,
            },
          ],
        };

        setBarChartData(formattedChartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (barChartRef.current && barChartData) {
      if (barChartInstance) {
        barChartInstance.destroy();
      }

      const newBarChartInstance = new Chart(barChartRef.current, {
        type: 'bar',
        data: barChartData,
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      setBarChartInstance(newBarChartInstance);
    }
  }, [barChartData]);

  //to show the summery data in numbers

  const fetchTodayDataFromAPI = async (date) => {
    const response = await fetch(`http://localhost:3001/api/daily-report-details?date=${date}`);
    const data = await response.json();
    return data;
  };

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchTodayData = async () => {
      try {
        const currentDate = new Date().toISOString().split('T')[0];
        const todayData = await fetchTodayDataFromAPI(currentDate);

        if (todayData && typeof todayData === 'object') {
          const todayTotalIncome = todayData.totalIncome || 0;
          const todayTotalExpense = todayData.totalExpense || 0;

          setTotalIncome(todayTotalIncome.toLocaleString());
          setTotalExpense(todayTotalExpense.toLocaleString());
          setBalance((todayTotalIncome - todayTotalExpense).toLocaleString());
        } else {
          console.error("Invalid data format for today's data", todayData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchTodayData();
  }, []);

  return (
    <div className="container mt-1">
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body text-center">
              <h5 className='text text-success'>
                <BsCashCoin size={40} className='mt-2' />
                <span className="ml-2 align-middle">
                  <h4 className="mt-0 d-inline align-middle">INCOME</h4>
                  <div className='my-3'> <b>AED {totalIncome}</b> </div>
                </span>
              </h5>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body text-center">
              <h5 className='text text-danger'>
                <BsCashCoin size={40} className='mt-2' />
                <span className="ml-2 align-middle">
                  <h4 className="mt-0 d-inline align-middle">EXPENSE</h4>
                  <div className='my-3'> <b> AED {totalExpense}</b> </div>
                </span>
              </h5>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body text-center">
              <h5 className='text text-primary'>
                <BsCashCoin size={40} className='mt-2' />
                <span className="ml-2 align-middle">
                  <h4 className="mt-0 d-inline align-middle">BALANCE</h4>
                  <div className='my-3'> <b>AED {balance}</b> </div>
                </span>
              </h5>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title text-center mb-4"></h5>
              <canvas ref={lineChartRef} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title text-center mb-4"></h5>
              <canvas ref={barChartRef} />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title text-center mb-4">RECENT DEBTS</h5>
              <table className="table">
                <thead>
                  <tr>
                    <th> Name</th>
                    <th>Due Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDebts.map((debt, index) => (
                    <tr key={index}>
                      <td>{debt.customer_name}</td>
                      <td>{new Date(debt.due_date).toLocaleDateString()}</td>
                      <td>{debt.description}</td>
                      <td>AED {Number(debt.credit_amount).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title text-center mb-4">RECENT LENDS</h5>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Due Date</th>
                    <th>Description</th>
                    <th>Lend Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLends.map((lend, index) => (
                    <tr key={index}>
                      <td>{lend.lender_name}</td>
                      <td>{new Date(lend.repayment_date).toLocaleDateString('en-US')}</td>
                      <td>{lend.description}</td>
                      <td>AED {lend.lend_amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Home;