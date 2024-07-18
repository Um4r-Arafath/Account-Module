import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

function MonthlyReport() {
    const [monthlyReport, setMonthlyReport] = useState([]);
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [balance, setBalance] = useState(0);
    const [months, setMonths] = useState([]);
    const [years, setYears] = useState([]);

    const fetchMonthlyReportData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/monthly-report-details?year=${year}&month=${month}`);
            setMonthlyReport(response.data); // Set monthly report data in state
        } catch (error) {
            console.error('Error fetching monthly report data:', error);
        }
    };


    useEffect(() => {
        if (year && month) {
            fetchMonthlyReportData();
        }
        // eslint-disable-next-line
    }, [year, month]);


    useEffect(() => {
        // Populate months and years array when component mounts
        const generateMonths = () => {
            const monthsArr = Array.from({ length: 12 }, (_, index) => ({
                value: index + 1,
                label: new Date(2000, index, 1).toLocaleString('default', { month: 'long' }),
            }));
            setMonths(monthsArr);
        };

        const generateYears = () => {
            const yearsArr = Array.from({ length: 10 }, (_, index) => ({
                value: 2022 + index,
                label: 2022 + index,
            }));
            setYears(yearsArr);
        };

        generateMonths();
        generateYears();
    }, []);

    useEffect(() => {
        // Calculate total income, total expense, and balance when monthlyReport changes
        const totalIncomeAmount = monthlyReport.reduce((total, item) => {
            return item.type === 'Income' ? total + Number(item.amount) : total;
        }, 0);

        const totalExpenseAmount = monthlyReport.reduce((total, item) => {
            return item.type === 'Expense' ? total + Number(item.amount) : total;
        }, 0);

        setTotalIncome(totalIncomeAmount);
        setTotalExpense(totalExpenseAmount);
        setBalance(totalIncomeAmount - totalExpenseAmount);
    }, [monthlyReport]);


    const handleMonthChange = (e) => {
        setMonth(e.target.value);
    };

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };


    const downloadReport = () => {
        const doc = new jsPDF();

        doc.setDrawColor(0);
        doc.setTextColor(0);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text('MONTHLY REPORT', 105, 20, null, null, 'center');

        const tableHeaders = ['Date', 'Description', 'Type', 'Expense', 'Income'];
        const tableRows = monthlyReport.map(item => [
            new Date(item.date).toLocaleDateString('en-GB'),
            item.description,
            item.type,
            item.type === 'Expense' ? `AED ${item.amount}` : '-',
            item.type === 'Income' ? `AED ${item.amount}` : '-',
        ]);

        const totalIncomeAmount = monthlyReport.reduce((acc, item) => {
            return item.type === 'Income' ? acc + Number(item.amount) : acc;
        }, 0);

        const totalExpenseAmount = monthlyReport.reduce((acc, item) => {
            return item.type === 'Expense' ? acc + Number(item.amount) : acc;
        }, 0);

        const balance = totalIncomeAmount - totalExpenseAmount;

        const totalRow = ['', 'Total', '', `AED ${totalExpenseAmount}`, `AED ${totalIncomeAmount}`];
        const balanceRow = ['', 'Balance', '', '', `AED ${balance.toFixed(2)}`];
        tableRows.push(totalRow, balanceRow);

        doc.autoTable({
            head: [tableHeaders],
            body: tableRows,
            startY: 40,
            theme: 'grid',
            styles: {
                lineColor: 0,
                textColor: 0,
            },
            headerStyles: {
                fillColor: '',
                textColor: 'black',
                borderColor: [0, 0, 0],
                lineWidth: 0.2,
            },
        });

        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const tab = window.open(pdfUrl, '_blank');

        if (tab) {
            setTimeout(() => {
                tab.document.title = 'Monthly Report';
                const a = tab.document.createElement('a');
                a.href = pdfUrl;
                a.download = `monthly_report_${year}_${month}.pdf`;
            }, 1000);
        }
    };

    return (
        <div className="container mt-3">
            <div className="card shadow">
                <div>
                    <select value={month} onChange={handleMonthChange} className=' m-2 p-2'>
                        <option value="">Select Month</option>
                        {months.map((m) => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                    </select>

                    <select value={year} onChange={handleYearChange} className='m-2 p-2'>
                        <option value="">Select Year</option>
                        {years.map((y) => (
                            <option key={y.value} value={y.value}>{y.label}</option>
                        ))}
                    </select>
                    <button onClick={downloadReport} className='btn btn-dark mb-1'>Download Report</button>
                </div>

                {monthlyReport && monthlyReport.length > 0 ? (
                    <div className="container mt-3">
                        <h2 className='text-center p-2 mb-3'>MONTHLY REPORT</h2>
                        <table className="table">
                            <thead >
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Type</th>
                                    <th>Expense</th>
                                    <th>Income</th>
                                </tr>
                            </thead>
                            <tbody>

                                <>
                                    {monthlyReport.map((item, index) => (
                                        <tr key={index}>
                                            <td>{new Date(item.date).toLocaleDateString('en-GB')}</td>
                                            <td>{item.description}</td>
                                            <td>
                                                {item.type === 'Income' ? (
                                                    <span className="text-success">{item.type}</span>
                                                ) : (
                                                    <span className="text-danger">{item.type}</span>
                                                )}
                                            </td>
                                            <td>{item.type === 'Expense' ? `AED ${item.amount.toLocaleString('en-US')}` : '-'}</td>
                                            <td>{item.type === 'Income' ? `AED ${item.amount.toLocaleString('en-US')}` : '-'}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td><strong>Total</strong></td>
                                        <td> AED {totalExpense.toLocaleString('en-US')}</td>
                                        <td> AED {totalIncome.toLocaleString('en-US')}</td>
                                    </tr>

                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td><strong>Balance</strong></td>
                                        <td></td>
                                        <td>AED {balance.toLocaleString('en-US')}</td>
                                    </tr>
                                </>
                            </tbody>
                        </table>
                    </div>
                ) : ('')}
            </div>


            <div className='card shadow col-md-4 p-3 mt-3 '>
                <h5 className='text text-success '>Total Income: AED {totalIncome.toFixed(2)}</h5>
                <h5 className='text text-danger '>Total Expense: AED {totalExpense.toFixed(2)}</h5>
                <h5 className='text text-primary '>Balance: AED {balance.toFixed(2)}</h5>
            </div>
        </div>
    );
}

export default MonthlyReport;
