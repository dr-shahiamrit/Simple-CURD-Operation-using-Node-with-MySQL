const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'curd_express_v1',
    password: 'password',
    database: 'curd_express_v1'
})

connection.connect((err) => {
    if(err) {
        console.log('Error in DB Connection: ' + JSON.stringify(err, undefined, 2));
    } else {
        console.log('DB connected successfully')
    }
})

module.exports = connection