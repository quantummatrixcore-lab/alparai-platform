const API_BASE = "https://alparai.com";

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) return;

  let url;
  try {
    url = new URL(tab.url);
  } catch {
    return;
  }

  const domain = url.hostname;
  document.getElementById("domain").textContent = domain;

  if (domain.includes("alparai.com")) {
    document.getElementById("loadingMsg").style.display = "none";
    document.getElementById("emptyMsg").style.display = "block";
    document.getElementById("emptyMsg").textContent = "You're on ALPAR AI.";
    return;
  }

  try {
    const res = await fetch(
      `${API_BASE}/api/v1/incidents?domain=${encodeURIComponent(domain)}&limit=100`,
    );
    const data = await res.json();
    const count = data.meta?.count ?? data.data?.length ?? 0;

    document.getElementById("loadingMsg").style.display = "none";

    if (count > 0) {
      document.getElementById("countBadge").style.display = "flex";
      document.getElementById("countNum").textContent = count;
      document.getElementById("viewBtn").style.display = "block";
      document.getElementById("viewBtn").href =
        `${API_BASE}/en/incidents?q=${encodeURIComponent(domain)}`;
    } else {
      document.getElementById("emptyMsg").style.display = "block";
    }
  } catch {
    document.getElementById("loadingMsg").style.display = "none";
    document.getElementById("emptyMsg").style.display = "block";
    document.getElementById("emptyMsg").textContent = "Could not reach ALPAR AI database.";
  }
}

document.getElementById("reportBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabUrl = tabs[0]?.url || "";
    window.open(`${API_BASE}/en/submit?source=extension&ref=${encodeURIComponent(tabUrl)}`);
  });
});

init();
