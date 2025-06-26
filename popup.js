const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const actionsList = document.getElementById('actions-list');

function updateUI(isTracking) {
  startBtn.disabled = isTracking;
  stopBtn.disabled = !isTracking;
  if (!isTracking) showActions();
  else actionsList.innerHTML = "";
}

function showActions() {
  chrome.storage.local.get({ actions: [] }, (data) => {
    actionsList.innerHTML = "";
    if (data.actions && data.actions.length) {
      data.actions.forEach(a => {
        const li = document.createElement('li');
        li.textContent = a;
        actionsList.appendChild(li);
      });
    } else {
      actionsList.innerHTML = "<li><em>No actions tracked yet.</em></li>";
    }
  });
}

chrome.runtime.sendMessage({ type: "GET_STATUS" }, (resp) => {
  updateUI(resp && resp.isTracking);
});

startBtn.onclick = () => {
  chrome.runtime.sendMessage({ type: "START_TRACKING" }, () => {
    updateUI(true);
    window.close(); // hides popup, tracking continues!
  });
};
stopBtn.onclick = () => {
  chrome.runtime.sendMessage({ type: "STOP_TRACKING" }, () => {
    updateUI(false);
    showActions();
  });
};
