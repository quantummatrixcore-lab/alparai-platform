const API_BASE = "https://alparai.com";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url) await checkDomain(tab);
  } catch {
    // tab may not be ready
  }
});

chrome.tabs.onUpdated.addListener(async (_tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    await checkDomain(tab);
  }
});

async function checkDomain(tab) {
  const url = new URL(tab.url);
  const domain = url.hostname;

  // Skip alparai.com itself
  if (domain.includes("alparai.com")) {
    await chrome.action.setBadgeText({ text: "", tabId: tab.id });
    return;
  }

  const cacheKey = `cache:${domain}`;
  const cached = await chrome.storage.local.get(cacheKey);
  if (cached[cacheKey] && Date.now() - cached[cacheKey].ts < CACHE_TTL_MS) {
    updateBadge(tab.id, cached[cacheKey].count);
    return;
  }

  try {
    const res = await fetch(
      `${API_BASE}/api/v1/incidents?domain=${encodeURIComponent(domain)}&limit=100`,
    );
    if (!res.ok) return;
    const data = await res.json();
    const count = data.meta?.count ?? data.data?.length ?? 0;

    await chrome.storage.local.set({ [cacheKey]: { count, ts: Date.now() } });
    updateBadge(tab.id, count);
  } catch {
    // network error — leave badge empty
  }
}

function updateBadge(tabId, count) {
  if (count > 0) {
    chrome.action.setBadgeText({ text: count > 99 ? "99+" : String(count), tabId });
    chrome.action.setBadgeBackgroundColor({ color: "#00FF88" }, tabId);
  } else {
    chrome.action.setBadgeText({ text: "", tabId });
  }
}
