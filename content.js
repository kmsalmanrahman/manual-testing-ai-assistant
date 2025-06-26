let tracking = false;
let handlerClick, handlerInput;

function startTracking() {
  if (tracking) return;
  tracking = true;

  handlerClick = (e) => {
    let el = e.target;
    storeAction(formatAction("click", el));
  };
  handlerInput = (e) => {
    let el = e.target;
    storeAction(formatAction("input", el, el.value));
  };

  document.addEventListener("click", handlerClick, true);
  document.addEventListener('change', handlerInput, true);
}

function stopTracking() {
  if (!tracking) return;
  document.removeEventListener("click", handlerClick, true);
  document.removeEventListener("input", handlerInput, true);
  tracking = false;
}
function formatAction(actionType, el, value) {
  try {
    const id = el.id || "";
    const name = el.name || "";
    const aria =
      (el.getAttribute &&
        (el.getAttribute("aria-label") ||
          el.getAttribute("aria-labelledby"))) ||
      "";
    const placeholder = el.placeholder || "";
    const dataLabel = el.getAttribute && el.getAttribute("data-label");
    const alt = el.alt || "";
    let label = "";

    if (id && /email/i.test(id)) label = "email";
    else if (id && /pass/i.test(id)) label = "password";
    else if (name && /email/i.test(name)) label = "email";
    else if (name && /pass/i.test(name)) label = "password";
    else if (aria) label = aria;
    else if (dataLabel) label = dataLabel;
    else if (placeholder) label = placeholder;
    else if (alt) label = alt;
    else if (el.innerText && el.innerText.trim().length < 30)
      label = el.innerText.trim();
    else label = el.tagName;

    if (actionType === "input") {
      return `User inputs ${label}`;
    } else if (actionType === "click") {
      if (el.tagName === "BUTTON" || el.type === "submit") {
        return `Clicks on ${label}`;
      }
      if (/login/i.test(label)) return "Clicks on login";
      if (/user list/i.test(label)) return "Clicks on user list";
      if (/submit/i.test(label)) return "Clicks on submit";
      if (/search/i.test(label)) return "Clicks on search";
      return `Clicks on ${label}`;
    }
    return `${actionType} on ${label}`;
  } catch (err) {
    // If anything fails, fall back to basic format
    let desc =
      el.tagName +
      (el.id ? "#" + el.id : "") +
      (el.className ? "." + el.className.replace(/ /g, ".") : "");
    if (actionType === "input") {
      return "Input in " + desc;
    } else if (actionType === "click") {
      return "Click on " + desc;
    }
    return `${actionType} on ${desc}`;
  }
}

function storeAction(action) {
  chrome.storage.local.get({ actions: [] }, (data) => {
    data.actions.push(action);
    chrome.storage.local.set({ actions: data.actions });
  });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "ENABLE_TRACKING") startTracking();
  else if (msg.type === "DISABLE_TRACKING") stopTracking();
});
