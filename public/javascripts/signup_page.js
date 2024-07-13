function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return pattern.test(password);
}

function onSignInButton() {
    const email = document.getElementById('user_email').value;
    const password = document.getElementById('user_password').value;
    if (validateEmail(email) && validatePassword(password)) {
        const data = {
            'email': email, 'password': password
        }
        console.log(window.location)
        fetch(window.location.origin + `/auth/signup_creds`, {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                response.text().then(value => {
                    console.log(value);
                    window.location.href = `/${value}`;
                });
            }
        }).catch(error => alert(`Something went wrong.\n${error}`));
    } else {
        alert('Please check your email and password ');
    }
}
