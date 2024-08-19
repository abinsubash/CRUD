alert('sdfsd')
document.getElementById('login').addEventListener('submit',async(event)=>{
     event.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const error = document.getElementById('error');

        const passwordRegex = /^[^\W_][\w\W]{4,}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let isValid = true;

        if (!emailRegex.test(email)) {
            error.innerHTML = 'Invalid Email';
            isValid = false;
        } else if (!passwordRegex.test(password)) {
            error.innerHTML = "Invalid Password";
            isValid = false;
        } else {
            error.innerHTML = "";
        }

        if (isValid) {
            const response = await fetch('/user/home', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                })
            });

            if (response.ok) {
                window.location.href = "/home";
            } else {
                const data = await response.json();
                error.innerHTML = data.message;
            }
        }
    });
