const connectDB = require('./dbConfig/dbConfig.js');

const path = require('path')
const bodyParser = require('body-parser')
const express = require('express');
const app = express()



// Middleware to parse form data
// Middleware: The express.urlencoded() middleware is required to handle form data sent via POST.

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true })); 

app.set('view engine', 'html')

app.engine('.html', require('ejs').__express)


// path to public directory
app.use(express.static(path.join(__dirname, 'public')))


// Dummy users
var styletext = [
    { name: 'style.css'},
    { name: 'post.css'},
    { name: 'jane'}
  ];

// GET 

app.get('/', (req, res) => {
    connectDB.query('SELECT * FROM employee', (err, rows) => {
        if(err) {
            console.log(err)
        } else {
            res.render('users', {
                data: rows,
                title: 'ggood',
                headers: 'very nicce to see you',
                styletext: styletext
            });
        }
    })
});


// GET by One
app.get('/:id', (req, res) => {

    connectDB.query('SELECT * FROM employee WHERE id=?', [req.params.id], (err, rows) => {
        if(err) {
            console.log(err)
        } else {
            res.render('oneGet', {
                data: rows[0],
                title: 'onlyone'
            })
        }
    })
})


// POST data
app.post('/', (req, res) => {
    const data = req.body
    const dataAll = [data.name, data.age, data.address]
    connectDB.query('INSERT INTO employee (name, age, address) VALUES (?)', [dataAll], (err, rows) => {
        if(err) {
            console.log(err)
        } else {
            res.redirect('/')
        }
    })
})


// DELETE data
app.delete('/:id', (req, res) => {
    connectDB.query('DELETE FROM employee WHERE id=?', [req.params.id], (err, rows) => {
        if(err) {
            console.log(err)
            res.status(500).send('Error deleting user')
        } else {
            res.status(200).send('User deleted')
        }
    })
})


// PATCH Request


// app.get('/edit/:id', (req, res) => {
//     connectDB.query('SELECT * FROM employee WHERE id=?', [req.params.id], (err, rows) => {
//         if(err) {
//             console.log(err)
//         } else {
//             res.render('patch_insert', {
//                 data: rows[0],
//                 title: 'Edit View'
//             })
//         }
//     })
// })


app.get('/edit/:id', (req, res) => {
    const userId = req.params.id;

    connectDB.query('SELECT * FROM employee WHERE id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).send('Server error');
        }

        if (results.length > 0) {
            // Ensure that `data` contains the correct user information
            res.render('patch_insert', { data: results[0], title: 'Edit View' });
        } else {
            res.status(404).send('User not found');
        }
    });
});



app.patch('/edit/:id', (req, res) => {
    const data = req.body
    connectDB.query('UPDATE employee SET ? WHERE id='+req.params.id, [data], (err, rows) => {
        if(err) {
            console.log(err)
        } else {
            res.redirect('/')
        }
    })
})



app.listen(3000, ()=> {
    console.log('Server running on port 3000')
})