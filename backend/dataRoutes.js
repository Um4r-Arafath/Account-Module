const express = require('express');
const router = express.Router();
const connection = require('./dbConnect');
const jwt = require('jsonwebtoken');

const secretKey = '123';
const user = { id: 1, username: 'admin' };

// User Authentication FN-27-11-23
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const query = 'SELECT id, username, password FROM users WHERE username = ? AND password = ?';
        connection.query(query, [username, password], (error, results) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'Incorrect Username or Password' });
            }
            const token = jwt.sign(user, secretKey, { expiresIn: '1h' });
            res.header(secretKey, token).json({ message: 'Login successful', token });
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Adding User
router.post('/data', (req, res) => {
    const { username, email, password, repassword } = req.body;
    const insertUser = `INSERT INTO users (username, email, password, repassword) VALUES (?, ?, ?, ?)`;

    connection.query(insertUser, [username, email, password, repassword], (err, result) => {
        if (err) {
            console.error('Failed to add user', err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

// User Remove
router.delete('/data/:id', (req, res) => {
    const userId = req.params.id;
    const deleteQuery = `DELETE FROM users WHERE id = ?`;

    connection.query(deleteQuery, userId, (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

// User Visibility
router.get('/data', (req, res) => {
    const selectUsers = `SELECT * FROM users`;

    connection.query(selectUsers, (err, rows) => {
        if (err) {
            console.error('Error retriving users: ', err);
            res.sendStatus(500);
        } else {
            res.status(200).json(rows);
        }
    });
});

// **************Income API's*******************
// Add income 
router.post('/income', (req, res) => {
    const { date, description, amount } = req.body;
    const adIncome = `INSERT INTO income ( date, description, amount) VALUES (?, ?, ?)`;

    connection.query(adIncome, [date, description, amount], (err, result) => {
        if (err) {
            console.error('Failed to add income', err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

// Income Visibility
router.get('/incomelist', (req, res) => {
    const selectIncome = `SELECT * FROM income`;

    connection.query(selectIncome, (err, rows) => {
        if (err) {
            console.error('Error retriving income: ', err);
            res.sendStatus(500);
        } else {
            res.status(200).json(rows);
        }
    });
});

// Remove an income
router.delete('/removeincome/:id', (req, res) => {
    const incomeId = req.params.id;
    const deleteQuery = `DELETE FROM income WHERE id = ?`;

    connection.query(deleteQuery, incomeId, (err, result) => {
        if (err) {
            console.error('Error deleting income:', err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

// **************Expense API's*******************
// Add Expense
router.post('/expense', (req, res) => {
    const { date, description, amount } = req.body;
    const adExpense = `INSERT INTO expense ( date, description, amount) VALUES (?, ?, ?)`;

    connection.query(adExpense, [date, description, amount], (err, result) => {
        if (err) {
            console.error('Failed to add income', err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

// Expense Visibility
router.get('/expenselist', (req, res) => {
    const selectIncome = `SELECT * FROM expense`;

    connection.query(selectIncome, (err, rows) => {
        if (err) {
            console.error('Error retriving expense: ', err);
            res.sendStatus(500);
        } else {
            res.status(200).json(rows);
        }
    });
});

// Remove an Expense
router.delete('/removeexpense/:id', (req, res) => {
    const expenseId = req.params.id;
    const deleteQuery = `DELETE FROM expense WHERE id = ?`;

    connection.query(deleteQuery, expenseId, (err, result) => {
        if (err) {
            console.error('Error deleting expense:', err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});


router.get('/daily-report-details', async (req, res) => {
    const { date } = req.query; // Date format: YYYY-MM-DD

    try {
        const dailyReportQuery = `
        SELECT 'Income' AS type, DATE_FORMAT(date, '%Y-%m-%d') AS date, description, amount FROM income WHERE DATE(date) = ?

        UNION ALL
        
        SELECT 'Expense' AS type, DATE_FORMAT(date, '%Y-%m-%d') AS date, description, amount FROM expense WHERE DATE(date) = ? ORDER BY date`;

        const totalIncomeQuery = `
            SELECT SUM(amount) AS totalIncome FROM income WHERE DATE(date) = ?`;

        const totalExpenseQuery = `
            SELECT SUM(amount) AS totalExpense FROM expense WHERE DATE(date) = ?`;

        const [dailyReport, totalIncomeResult, totalExpenseResult] = await Promise.all([
            executeQuery(dailyReportQuery, [date, date]),
            executeQuery(totalIncomeQuery, [date]),
            executeQuery(totalExpenseQuery, [date])
        ]);

        const totalIncome = totalIncomeResult[0].totalIncome || 0;
        const totalExpense = totalExpenseResult[0].totalExpense || 0;

        const balance = totalIncome - totalExpense;

        res.status(200).json({ dailyReport, totalIncome, totalExpense, balance });
    } catch (error) {
        console.error('Error retrieving daily report:', error);
        res.sendStatus(500);
    }
});

// Assume executeQuery is a function to handle the database queries (connection.query or any other method)
function executeQuery(sql, values) {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

// Assume executeQuery is a function to handle the database queries (connection.query or any other method)
function executeQuery(sql, values) {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

// Adding Customer 23-12-05
router.post('/addcustomer', (req, res) => {
    const { cus_name, cus_email, cus_mob, cus_code } = req.body;
    const insertCustomer = `INSERT INTO customers (cus_name, cus_email, cus_mob, cus_code) VALUES (?, ?, ?, ?)`;

    connection.query(insertCustomer, [cus_name, cus_email, cus_mob, cus_code], (err, result) => {
        if (err) {
            console.error('Failed to add customer', err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

// Customer Visibility
router.get('/viewcustomers', (req, res) => {
    const selectcustomers = `SELECT * FROM customers`;

    connection.query(selectcustomers, (err, rows) => {
        if (err) {
            console.error('Error retriving customers: ', err);
            res.sendStatus(500);
        } else {
            res.status(200).json(rows);
        }
    });
});

// Customer Remove
router.delete('/removecust/:id', (req, res) => {
    const customerId = req.params.id;
    const deleteQuery = `DELETE FROM customers WHERE id = ?`;

    connection.query(deleteQuery, customerId, (err, result) => {
        if (err) {
            console.error('Error deleting customer:', err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

//Add credit to a customer
router.post('/addcredit', (req, res) => {
    const { customer_name, credit_amount, description, credit_date, due_date, payment_type } = req.body;

    const insertCredit = `INSERT INTO credits (customer_name, credit_amount, description, credit_date, due_date, payment_type) VALUES (?, ?, ?, ?, ?, ?)`;

    connection.query(insertCredit, [customer_name, credit_amount, description, credit_date, due_date, payment_type], (err, result) => {
        if (err) {
            console.error('Failed to add credit:', err);
            res.sendStatus(500);
        } else {
            console.log('Credit added successfully');
            res.sendStatus(200);
        }
    });
});


//Delete credit to a customer
router.delete('/deletecredit/:id', (req, res) => {
    const creditId = req.params.id;

    const deleteCredit = `DELETE FROM credits WHERE id = ?`;

    connection.query(deleteCredit, [creditId], (err, result) => {
        if (err) {
            console.error('Failed to delete credit:', err); // Log the error details
            res.sendStatus(500);
        } else {
            if (result.affectedRows > 0) {
                console.log('Credit deleted successfully');
                res.sendStatus(200);
            } else {
                console.log('Credit not found');
                res.sendStatus(404);
            }
        }
    });
});

// View credits of customers
router.get('/viewcredits', (req, res) => {
    const selectCredits = `SELECT * FROM credits`;

    connection.query(selectCredits, (err, rows) => {
        if (err) {
            console.error('Error retrieving credits: ', err);
            res.status(500).send('Internal server error');
        } else {
            res.status(200).json(rows);
        }
    });
});

// Endpoint to fetch customers' names and codes for dropdown
router.get('/customers-dropdown', (req, res) => {
    const selectCustomers = `SELECT cus_name, cus_code FROM customers`;

    connection.query(selectCustomers, (err, rows) => {
        if (err) {
            console.error('Error retrieving customers for dropdown: ', err);
            res.status(500).send('Internal server error');
        } else {
            res.status(200).json(rows);
        }
    });
});

// Backend Endpoint for Customer's Credit History
router.get('/customer/history/:customerName', (req, res) => {
    const customerName = req.params.customerName;

    const customerHistoryQuery = `
        SELECT 
            IF(STR_TO_DATE(credit_date, '%Y-%m-%d'), credit_date, '-') AS credit_date,
            IFNULL(credit_amount, '-') AS credit_amount, 
            IFNULL(payment_type, '-') AS payment_type, 
            CASE
                WHEN STR_TO_DATE(due_date, '%Y-%m-%d') IS NULL THEN '-'
                ELSE due_date
            END AS due_date,
            'credit' AS type
        FROM credits
        WHERE customer_name = ?

        UNION ALL

        SELECT 
            IF(STR_TO_DATE(credit_date, '%Y-%m-%d'), credit_date, '-') AS credit_date,
            IFNULL(repayment_amount, '-') AS credit_amount, 
            '-' AS payment_type, 
            '-' AS due_date, 
            'credit income' AS type
        FROM credit_income
        WHERE customer_name = ?`;

    connection.query(customerHistoryQuery, [customerName, customerName], (err, rows) => {
        if (err) {
            console.error('Error fetching customer history:', err);
            res.sendStatus(500);
        } else {
            res.json(rows);
        }
    });
});


// router.get('/customer/history/:customerName', (req, res) => {
//     const customerName = req.params.customerName;

//     // Query to fetch credit history based on customer's name
//     const customerHistoryQuery = `
//         SELECT credit_date, credit_amount, due_date, payment_type
//         FROM credits
//         WHERE customer_name = ?`;

//     connection.query(customerHistoryQuery, [customerName], (err, rows) => {
//         if (err) {
//             console.error('Error fetching customer history:', err);
//             res.sendStatus(500);
//         } else {
//             res.json(rows); // Send the fetched history data as JSON response
//         }
//     });
// });

// Adding Repayment to Credit Income and Updating Credit Amount
router.post('/credit-repayments', (req, res) => {
    const { date, description, amount } = req.body;
    const addIncome = `INSERT INTO credit_income ( credit_date,  customer_name, repayment_amount) VALUES (?, ?, ?)`;

    connection.query(addIncome, [date, description, amount], (err, result) => {
        if (err) {
            console.error('Failed to add credit repayment', err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});


//Add Lenders
router.post('/add-lender', (req, res) => {
    const { name, email, mobile, lender_code } = req.body;
    const addLenders = `INSERT INTO lenders (lender_name, lender_email, lender_phone, lender_code) VALUES (?, ?, ?, ?)`;

    connection.query(addLenders, [name, email, mobile, lender_code], (err, result) => {
        if (err) {
            console.error('Faild to add Lenders', err);
            res.status(500);
        } else {
            res.sendStatus(200);
        }
    });
});

//retriving lenders details
router.get('/view-lenders', (req, res) => {
    const selectLenders = `SELECT * FROM lenders`;

    connection.query(selectLenders, (err, rows) => {
        if (err) {
            console.error('Error retriving Lenders: ', err);
            res.sendStatus(500);
        } else {
            res.status(200).json(rows);
        }
    });
});

// Lendor Remove
router.delete('/remove-lenders/:id', (req, res) => {
    const lendersId = req.params.id;
    const deleteLenders = `DELETE FROM lenders WHERE id = ?`;

    connection.query(deleteLenders, lendersId, (err, result) => {
        if (err) {
            console.error('Error deleting lender:', err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

//Add lend to a lendor
router.post('/add-lend', (req, res) => {
    const { lender_name, lend_amount, description, lend_date, repayment_date, payment_type } = req.body;

    const insertLend = `INSERT INTO lending (lender_name, lend_amount, description, lend_date, repayment_date, payment_type) VALUES (?, ?, ?, ?, ?, ?)`;

    connection.query(insertLend, [lender_name, lend_amount, description, lend_date, repayment_date, payment_type], (err, result) => {
        if (err) {
            console.error('Failed to add Lend:', err);
            res.sendStatus(500);
        } else {
            console.log('Lend added successfully');
            res.sendStatus(200);
        }
    });
});

//retriving lending details
router.get('/view-lending', (req, res) => {
    const selectLendings = `SELECT * FROM lending`;

    connection.query(selectLendings, (err, rows) => {
        if (err) {
            console.error('Error retriving Lendings: ', err);
            res.sendStatus(500);
        } else {
            res.status(200).json(rows);
        }
    });
});

// Lending Remove
router.delete('/remove-lending/:id', (req, res) => {
    const lendingId = req.params.id;
    const deleteLending = `DELETE FROM lending WHERE id = ?`;

    connection.query(deleteLending, lendingId, (err, result) => {
        if (err) {
            console.error('Error deleting lending:', err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

// Endpoint to fetch lender's names 
router.get('/lenders-dropdown', (req, res) => {
    const selectLenders = `SELECT lender_name, lender_code FROM lenders`;

    connection.query(selectLenders, (err, rows) => {
        if (err) {
            console.error('Error retrieving lenders for dropdown: ', err);
            res.status(500).send('Internal server error');
        } else {
            res.status(200).json(rows);
        }
    });
});

// Endpoint to fetch lender amount for perticular amount
router.get('/lender/lend-amount/:lenderName', (req, res) => {
    const lenderName = req.params.lenderName;

    const lendAmountQuery = `
        SELECT 
            (SELECT COALESCE(SUM(lend_amount), 0) FROM lending WHERE lender_name = ?) - 
            (SELECT COALESCE(SUM(repayment_amount), 0) FROM lender_repayment WHERE lender_name = ?) AS remaining_due_amount`;

    connection.query(lendAmountQuery, [lenderName, lenderName], (err, result) => {
        if (err) {
            console.error('Error fetching remaining due amount:', err);
            res.sendStatus(500);
        } else {
            const remainingDueAmount = result[0].remaining_due_amount || 0;
            res.json({ remainingDueAmount });
        }
    });
});


// Insert the lending repayment
router.post('/lend-repayment', (req, res) => {
    const { repayment_date, repayment_amount, lender_name } = req.body;
    const addLenderRepayment = `INSERT INTO lender_repayment (repayment_date, repayment_amount, lender_name) VALUES (?, ?, ?)`;

    connection.query(addLenderRepayment, [repayment_date, repayment_amount, lender_name], (err, result) => {
        if (err) {
            console.error('Failed to add Lender Repayment', err);
            res.status(500).send('Failed to add Lender Repayment');
        } else {
            res.sendStatus(200);
        }
    });
});

// Backend Endpoint for Lending History
router.get('/lending/history/:lenderName', (req, res) => {
    const lenderName = req.params.lenderName;

    const historyQuery = `
      SELECT 
          lender_name,
          lend_date AS date,
          lend_amount AS amount,
          description,
          payment_type, /* Include payment_type field if available in the lending table */
          'lend' AS type
      FROM lending
      WHERE lender_name = ?
      
      UNION ALL
      
      SELECT 
          lender_name,
          repayment_date AS date,
          repayment_amount AS amount,
          NULL AS description,
          NULL AS payment_type, /* Assuming no payment_type in repayment table */
          'return' AS type
      FROM lender_repayment
      WHERE lender_name = ?
      
      ORDER BY date`;

    connection.query(historyQuery, [lenderName, lenderName], (err, rows) => {
        if (err) {
            console.error('Error fetching lending history:', err);
            res.status(500).json({ error: 'Error fetching lending history' });
        } else {
            res.json(rows);
        }
    });
});



// Backend API to retrieve recent debts with specific columns
router.get('/recent-debts', (req, res) => {
    const recentDebtsQuery = `
        SELECT customer_name, due_date, description, credit_amount 
        FROM credits 
        ORDER BY credit_date DESC 
        LIMIT 5`;

    connection.query(recentDebtsQuery, (err, rows) => {
        if (err) {
            console.error('Error retrieving recent debts: ', err);
            res.status(500).send('Error retrieving recent debts');
        } else {
            res.status(200).json(rows);
        }
    });
});



// Backend API to retrieve recent lendings
router.get('/recent-lends', (req, res) => {
    const recentLendsQuery = `
        SELECT lender_name, repayment_date, description, lend_amount 
        FROM lending 
        ORDER BY lend_date DESC 
        LIMIT 5`;

    connection.query(recentLendsQuery, (err, rows) => {
        if (err) {
            console.error('Error retrieving recent lends: ', err);
            res.status(500).send('Error retrieving recent lends');
        } else {
            res.status(200).json(rows);
        }
    });
});


// Monthly Report Endpoint
router.get('/monthly-report-details', async (req, res) => {
    const { year, month } = req.query;

    try {
        const startOfMonth = `${year}-${month}-01`;
        const endOfMonth = `${year}-${month}-31`; // Consider using better logic for the last day of the month

        const monthlyTransactionsQuery = `
            SELECT 
                'Income' AS type,
                DATE_FORMAT(date, '%Y-%m-%d') AS date, 
                description, 
                amount 
            FROM income 
            WHERE DATE(date) BETWEEN ? AND ?
            
            UNION ALL
            
            SELECT 
                'Expense' AS type,
                DATE_FORMAT(date, '%Y-%m-%d') AS date, 
                description, 
                amount 
            FROM expense 
            WHERE DATE(date) BETWEEN ? AND ?
            ORDER BY date`;

        const transactionsResult = await executeQuery(monthlyTransactionsQuery, [startOfMonth, endOfMonth, startOfMonth, endOfMonth]);

        res.status(200).json(transactionsResult);
    } catch (error) {
        console.error('Error retrieving monthly report:', error);
        res.sendStatus(500);
    }
});


 //

module.exports = router;