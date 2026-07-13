document.getElementById("captureBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "extract_chat" }, function (_response) {
      window.open("https://alparai.com/en/submit?source=extension");
    });
  });
});
