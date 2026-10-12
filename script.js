let today = new Date().toLocaleDateString("en-CA");

let goal = Number(localStorage.getItem("waterGoal")) || 2000;

let savedDate = localStorage.getItem("waterDate");

let history = savedDate === today
    ? JSON.parse(localStorage.getItem("waterHistory") || "[]")
    : [];

function saveData() {
    localStorage.setItem("waterDate", today);
    localStorage.setItem("waterHistory", JSON.stringify(history));
    localStorage.setItem("waterGoal", goal);
}

function addWater(amount) {
    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    history.push({
        amount: amount,
        time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })
    });

    saveData();
    updateDisplay();
}

function addCustomWater() {
    let amount = Number(document.getElementById("customAmount").value);

    if (amount <= 0 || !Number.isFinite(amount)) {
        alert("Please enter a valid water amount.");
        return;
    }

    addWater(amount);
    document.getElementById("customAmount").value = "";
}

function undoWater() {
    if (history.length === 0) {
        alert("There is no entry to undo.");
        return;
    }

    history.pop();
    saveData();
    updateDisplay();
}

function updateGoal() {
    let newGoal = Number(document.getElementById("goalInput").value);

    if (!Number.isFinite(newGoal) || newGoal <= 0) {
        alert("Please enter a valid daily goal.");
        return;
    }

    goal = newGoal;
    saveData();
    updateDisplay();
}

function updateDisplay() {
    let total = history.reduce(function(sum, entry) {
        return sum + entry.amount;
    }, 0);

    let remaining = Math.max(goal - total, 0);
    let percentage = Math.round((total / goal) * 100);
    let circlePercentage = Math.min(percentage, 100);

    document.getElementById("total").textContent = total + " ml";
    document.getElementById("goal").textContent = goal + " ml";
    document.getElementById("remaining").textContent = remaining + " ml";
    document.getElementById("percentage").textContent = percentage + "%";
    document.getElementById("goalInput").value = goal;

    document.getElementById("progressCircle").style.background =
        `conic-gradient(#168aad ${circlePercentage}%, #dceaf2 ${circlePercentage}%)`;

    let historyList = document.getElementById("history");
    historyList.replaceChildren();

    if (history.length === 0) {
        let item = document.createElement("li");
        item.textContent = "No water entries yet.";
        historyList.appendChild(item);
    } else {
        history.forEach(function(entry) {
            let item = document.createElement("li");
            item.textContent = entry.time + " — " + entry.amount + " ml";
            historyList.appendChild(item);
        });
    }
}

saveData();
updateDisplay();