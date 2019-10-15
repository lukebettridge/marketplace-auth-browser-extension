chrome.runtime.onMessage.addListener(msg => {
    if (msg.action == 'set_event_listener') {
        setInterval(() => {
            let modal = document.getElementById('js-modal-st');
            if (modal && modal.getAttribute('aria-hidden') === 'false') {
                document.getElementById('js-keep-working').click();
            };
        }, 100000);
    }
});