let SERVER_URL = "";

function loadConfig(callback) {
  $.getJSON("./config.json")
    .done((config) => {
      SERVER_URL = config.SERVER_URL;
    //   console.log("API URL Loaded:", SERVER_URL);
      if (callback) callback();
    })
    .fail(() => {
      console.error("Failed to load config.json");
    });
}
