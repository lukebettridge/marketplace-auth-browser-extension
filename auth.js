const authToken = {
    remove: () => {
        executeTabScript(`document.cookie="${_.authTokenName}=null";`);
        reload();
    },
    set: token => {
        executeTabScript(`document.cookie="${_.authTokenName}=${token}";`);
        reload();
    }
};

const getAuthToken = (env, customerId) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                authToken.set(data.secureToken);
            } else {
                let error = document.querySelector('.error');
                error.classList.remove('hide');
                error.innerHTML = 'An unexpected error occurred, are you sure you\'re connected to the UK VPN?';
            }
        }
    };
    xhr.open("POST", _.endpoint(env), true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        sub: customerId,
        scope: "member",
        exp: 500000,
        idle: 500000,
        clientId: "web_creditmatcher"
    }));
};