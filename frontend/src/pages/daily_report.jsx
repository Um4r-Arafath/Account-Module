import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

function DailyReport() {
    const [dailyReport, setDailyReport] = useState([]);
    const [date, setDate] = useState('');
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const fetchDailyReport = async () => {
            try {

                const response = await axios.get(`http://localhost:3001/api/daily-report-details?date=${date}`);
                const { dailyReport, totalIncome, totalExpense } = response.data;

                setDailyReport(dailyReport);
                setTotalIncome(totalIncome);
                setTotalExpense(totalExpense);
                setBalance(totalIncome - totalExpense);

            } catch (error) {
                console.error('Error fetching daily report:', error);
            }
        };

        if (date) {
            fetchDailyReport();
        }
    }, [date]);

    const downloadReport = () => {
        const doc = new jsPDF();

        // Set black and white theme
        doc.setDrawColor(0); // Set border color to black
        doc.setTextColor(0); // Set text color to black
        doc.setFont('helvetica', 'bold');

        // Add the heading "Daily Report"
        doc.setFontSize(18);
        doc.text('DAILY REPORT', 105, 20, null, null, 'center');

        // Generate PDF table for daily report
        const tableHeaders = ['Date', 'Description', 'Type', 'Expense', 'Income'];
        const tableRows = dailyReport.map(item => [
            new Date(item.date).toLocaleDateString('en-GB'),
            item.description,
            item.type,
            item.type === 'Expense' ? `AED ${item.amount}` : '-',
            item.type === 'Income' ? `AED ${item.amount}` : '-',
        ]);

        // Calculate total income and total expense
        const totalIncomeAmount = dailyReport.reduce((acc, item) => {
            return item.type === 'Income' ? acc + Number(item.amount) : acc;
        }, 0);

        const totalExpenseAmount = dailyReport.reduce((acc, item) => {
            return item.type === 'Expense' ? acc + Number(item.amount) : acc;
        }, 0);

        // Calculate balance
        const balance = totalIncomeAmount - totalExpenseAmount;

        // Append balance row
        const totalRow = ['', 'Total', '', `AED ${totalExpenseAmount}`, `AED ${totalIncomeAmount}`];
        const balanceRow = ['', 'Balance', '', '', `AED ${balance}`];
        tableRows.push(totalRow, balanceRow);

        doc.autoTable({
            head: [tableHeaders],
            body: tableRows,
            startY: 40,
            theme: 'grid',
            styles: {
                lineColor: 0, // Set lines color to black
                textColor: 0, // Set text color to black
                // fontStyle: 'bold',
            },
            headerStyles: {
                fillColor: '', // Set header fill color to black
                textColor: 'black',
                borderColor: [0, 0, 0], // Set header border color to black
                lineWidth: 0.2, // Set header border width
            },
        });


        // Generate a Blob containing the PDF data
        const pdfBlob = doc.output('blob');

        // Create a Blob URL for the Blob
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Open a new tab for preview
        const tab = window.open(pdfUrl, '_blank');

        // Download the PDF when the tab is focused after a delay
        if (tab) {
            setTimeout(() => {
                tab.document.title = 'Daily Report'; // Set tab title
                const a = tab.document.createElement('a');
                a.href = pdfUrl;
                a.download = `daily_report_${new Date().toLocaleDateString('en-GB').replaceAll('/', '-')}.pdf`; // Set filename with date

            },); // Adjust delay as needed
        }
    };

    return (
        <div className="container mt-3">
            <div className="card shadow">
                <div>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className='m-2 p-2' />
                    <button onClick={downloadReport} className='btn btn-dark mb-1'>Download Report</button>
                    {dailyReport && dailyReport.length > 0 ? (
                        <div className="container mt-3">
                            <h2 className='text-center p-2 mb-3'>DAILY REPORT</h2>
                            <table className="table">
                                <thead>
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
                                        {dailyReport.map((item, index) => (
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
                                                <td>{item.type === 'Expense' ? `AED ${item.amount}` : '-'}</td>
                                                <td>{item.type === 'Income' ? `AED ${item.amount}` : '-'}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td><strong>Total</strong></td>
                                            <td>AED {totalExpense} </td>
                                            <td>AED {totalIncome}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td><strong>Balance</strong></td>
                                            <td></td>
                                            <td>AED {balance}</td>
                                        </tr>
                                    </>
                                </tbody>
                            </table>
                        </div>
                    ) : ('')}
                </div>
            </div>

            <div className='card shadow col-md-4 p-3 mt-3'>
                <h5 className='text text-success '>Total Income: AED {totalIncome}</h5>
                <h5 className='text text-danger '>Total Expense: AED {totalExpense}</h5>
                <h5 className='text text-primary '>Balance: AED {balance}</h5>
            </div>
        </div>
    );
}

export default DailyReport;