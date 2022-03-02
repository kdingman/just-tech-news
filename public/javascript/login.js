// function to handle the signup submission
async function signupFormHandler(event) {
    event.preventDefault();

// pulling all data from the form
const username = document.querySelector('#username-signup').value.trim();
const email = document.querySelector('#email-signup').value.trim();
const password = document.querySelector('#password-signup').value.trim();

// making sure all fields have value before making a post request
if(username && email && password) {
    // assigning the result of the promise to a variable - .then() .catch() are not needed to tell the code what to do next
    const response = await fetch('/api/users', {
        method: 'post',
        body: JSON.stringify({
            username,
            email,
            password
        }),
        headers: { 'Content-Type': 'application/json' }
    })
    // check the response status
    if(response.ok) {
        console.log('success');
    }
    else {
        alert(response.statusText);
    }
}
}

// function to handle the login submission
async function logininFormHandler(event) {
    event.preventDefault();

const email = document.querySelector('#email-login').value.trim();
const password = document.querySelector('#password-login').value.trim();

    if (email && password) {
        const response = await fetch('/api/users/login' , {
            method: 'post',
            body: JSON.stringify({
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        // check the repsonse status
        if(response.ok) {
            document.location.replace('/');
        }
        else {
            alert(response.statusText);
        }
    }
}

// listener for the login submission
document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
document.querySelector('login-form').addEventListener('submit', logininFormHandler);