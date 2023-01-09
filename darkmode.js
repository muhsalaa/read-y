async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  console.log(tab);
  return tab;
}

function darkMode(params) {
  const attr = document.documentElement.getAttribute("data-read-y-theme");
  if (attr === "dark") {
    document.documentElement.setAttribute("data-read-y-theme", "light");
  } else {
    document.documentElement.setAttribute("data-read-y-theme", "dark");
  }
}

let isDark = false;
const darkmodebutton = document.getElementById("dark-mode-button");
darkmodebutton.addEventListener("click", async function () {
  const tb = await getCurrentTab();
  const status = darkmodebutton.getElementsByTagName("span")[0];

  if (isDark) {
    status.innerText = "OFF";
    status.style.color = "#262626";
    isDark = false;
  } else {
    status.innerText = "ON";
    status.style.color = "#4d7c0f";
    isDark = true;
  }

  chrome.scripting.executeScript({
    target: { tabId: tb.id },
    func: darkMode,
  });
});
