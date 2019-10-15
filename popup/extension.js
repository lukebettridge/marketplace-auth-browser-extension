document.addEventListener('DOMContentLoaded', () => {
    build();

    /*
     * Set click events on load for the environment filters, user descriptions, reset 
     * token button and clear site data button.
     */
    Array.from(document.querySelectorAll('ul'))
        .forEach(collection => {
            Array.from(collection.querySelectorAll('a')).forEach(anchor => {
                anchor.addEventListener('click', e => {
                    setFilter(e.target.dataset.env);
                });
            });
        });
    Array.from(document.querySelectorAll('div[data-env]'))
        .forEach(container => {
            container.querySelector('select').addEventListener('change', e => {
                if (e.target.value) getAuthToken(container.dataset.env, e.target.value);
            });
        });
    document.querySelector('.reset_token').addEventListener('click', () => {
        authToken.remove();
    });
    document.querySelector('.clear_site_data').addEventListener('click', () => {
        usingTabUrl(url => clearSiteData(url, reload));
    });

    /*
     * Try to detect the environment open and set the appropriate environment filter.
     */
    usingTabUrl(url => {
        _.environments.forEach(env => {
            if (url.includes(env.url)) setFilter(env.name);
        });
        if (url.includes('localhost') || url.includes('127.0.0.1')) {
            document.querySelector('.local_warning').classList.remove('hide');
        }
    });
});

const executeTabScript = (code, callback = null) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.executeScript(tabs[0].id, { code }, callback);
    });
};

const usingTabUrl = callback => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        callback(tabs[0].url);
    });
};

const getCurrentEnv = callback => {
    _.environments.forEach(env => {
        if (env.name === document.querySelector('.filter .active a').dataset.env) {
            callback(env);
            return;
        }
    });
};

const clearSiteData = (url, callback = null) => {
    chrome.browsingData.remove({
        "origins": [url]
    }, {
        "cacheStorage": true,
        "cookies": true,
        "fileSystems": true,
        "indexedDB": true,
        "localStorage": true,
        "pluginData": true,
        "serviceWorkers": true,
        "webSQL": true
    }, callback);
};

const reload = () => {
    executeTabScript("location.reload();", () => window.close());
};

const setFilter = env => {
    resetFilter();
    setTimeout(() => {
        document.querySelector(`a[data-env="${env}"]`).parentElement.classList.add('active');
        document.querySelector(`div[data-env="${env}"]`).classList.remove('hide');
    }, 150);
};

const resetFilter = () => {
    Array.from(document.querySelectorAll('ul.filter li')).forEach(el => el.classList.remove('active'));
    Array.from(document.querySelectorAll('div[data-env]')).forEach(el => el.classList.add('hide'));
};

const build = () => {
    /*
     * Build the collection lists with a list item per user from var.js, display no 
     * results message for environment with no users.
     */
    _.environments.forEach(env => {
        let el = document.querySelector(`div[data-env="${env.name}"]`);
        let select = el.querySelector('select');
        if (!_.users.hasOwnProperty(env.name) || _.users[env.name].length === 0) {
            select.classList.add('hide');
            el.innerHTML += `<div class='no_results'><img src="./emoji.png" /><p>No results for this environment were found, add more users to the <i>vars.js</i> file.</p></div>`;
            return;
        }
        select.classList.remove('hide');
        select.innerHTML = '<option>Please select...</option>';
        _.users[env.name].forEach(user => {
            select.innerHTML += `<option value="${user.id}">${user.description}</option>`;
        });
    });
};