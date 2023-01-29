// ! ================ UTILITIES ================

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function getHostPrefixedKey(key) {
  const tab = await getCurrentTab();
  const url = tab.url;
  const urlInstance = new URL(url);
  return key + urlInstance.host;
}

const getState = async (key) => {
  const prefixedKey = await getHostPrefixedKey(key);
  const item = localStorage.getItem(prefixedKey) || "";
  return item;
};

const setState = async (key, val) => {
  const prefixedKey = await getHostPrefixedKey(key);
  localStorage.setItem(prefixedKey, val);
};

// ! ================ END UTILITIES ================

// ================================================

// ! ================ DARK MODE ================
const IS_DARK = "isDark";

// *********** HOST PART ***********
function darkMode(isDark) {
  document.documentElement.setAttribute(
    "data-read-y-theme",
    isDark === "true" ? "dark" : "light"
  );
}

// *********** EXTENSION PART ***********
const darkmodebutton = document.getElementById("dark-mode-button");

function addException() {
  document.querySelectorAll("div").forEach((x) => {
    if (x.style.zIndex === "9999" && x.style.position === "fixed") {
      x.setAttribute("data-read-y-exception", "true");
    }
  });
}

async function setDarkMode() {
  const tb = await getCurrentTab();
  const isDark = await getState(IS_DARK);

  chrome.scripting.executeScript({
    target: { tabId: tb.id },
    func: darkMode,
    args: [isDark],
  });
}

function setDark() {
  const status = darkmodebutton.getElementsByTagName("span")[0];
  status.innerText = "ON";
  status.style.color = "#4d7c0f";
  setState(IS_DARK, "true");
}

function setLight() {
  const status = darkmodebutton.getElementsByTagName("span")[0];
  status.innerText = "OFF";
  status.style.color = "#262626";
  setState(IS_DARK, "false");
}

async function setDarkModeStatus() {
  const isDark = await getState(IS_DARK);

  if (isDark === "true") {
    setDark();
  } else {
    setLight();
  }
}

async function toggleDarkModeStatus() {
  const isDark = await getState(IS_DARK);

  if (isDark === "true") {
    setLight();
  } else {
    setDark();
  }
}

// set initial status of button based on localStorage history
addException();
setDarkMode();
setDarkModeStatus();

darkmodebutton.addEventListener("click", function () {
  toggleDarkModeStatus();
  setDarkMode();
});

// ! ================ END DARK MODE ================

// ================================================

// ! ================ TEXT ZOOM ================
const ZOOM_LEVEL = "zoom_level";

// *********** HOST PART ***********
const zooming = (value) => {
  document.body.style.zoom = parseFloat(value) * 100 + "%";
};

// *********** EXTENSION PART ***********
const sliderInput = document.getElementById("slider-input");

async function setSlideLevel() {
  const tb = await getCurrentTab();
  const level = (await getState(ZOOM_LEVEL)) || 1;

  chrome.scripting.executeScript({
    target: { tabId: tb.id },
    func: zooming,
    args: [level],
  });
}

async function setInitialSlide() {
  setSlideLevel();
  const level = (await getState(ZOOM_LEVEL)) || 1;
  sliderInput.value = level;
}

setInitialSlide();

sliderInput.addEventListener("input", async function (e) {
  await setState(ZOOM_LEVEL, e.target.value);
  setSlideLevel();
});

// ! ================ END TEXT ZOOM ================
