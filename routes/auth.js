const express = require('express');
const router = express.Router();
const DatabaseManager = require('../databases/databaseManager');
/* GET home page. */
router.get('/signup_page', function (req, res, next) {
    res.render('signup_page');
});

router.post('/signup_creds', function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body)
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    if (validateEmail(email) && validatePassword(password)) {
        new DatabaseManager().add_user_credentials(email, password).then(r => {
            console.log(r);
        });
        res.status(200);
        res.send(`home_page`);
    } else {
        res.status(404);
        res.send('Given user has invalid credential details.');
    }
});



function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return pattern.test(password);
}

module.exports = router;
