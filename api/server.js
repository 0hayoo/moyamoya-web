let SERVER_URL = "";

function loadConfig(callback) {
    $.getJSON("./config/config.json")
        .done((config) => {
            SERVER_URL = config.SERVER_URL;
            // 서버 URL 로드 후 다른 코드 실행할 수 있게
            if (callback) callback();
        })
        .fail(() => {
            console.error("Failed to load Server");
        });
}
