// Global variables
let currentIntake = 0;
let dailyGoal = 2000;
let reminderInterval;
let reminderTimer;
let waterLog = [];

// ---------------------- Goal Setting ----------------------
function setGoal() {
    const goalInput = document.getElementById('goal-input');
    const newGoal = parseInt(goalInput.value);

    if (!newGoal || newGoal <= 0) {
        showNotification('⚠️ Please enter a valid goal (greater than 0)', 'error');
        return;
    }

    dailyGoal = newGoal;
    updateProgress();
    showNotification('✅ Goal updated!', 'success');
}

// ---------------------- Water Intake ----------------------
function addWater(amount) {
    if (!amount || amount <= 0) {
        showNotification('⚠️ Invalid water amount!', 'error');
        return;
    }

    currentIntake += amount;

    const logEntry = {
        amount: amount,
        time: new Date().toLocaleTimeString()
    };
    waterLog.push(logEntry);

    updateProgress();
    updateWaterLog();
    checkGoalAchievement();
}

function addCustomWater() {
    const customInput = document.getElementById('custom-amount');
    const amount = parseInt(customInput.value);

    if (!amount || amount <= 0) {
        showNotification('⚠️ Enter a valid custom amount', 'error');
        return;
    }

    addWater(amount);
    customInput.value = '';
}

// ---------------------- Progress ----------------------
function updateProgress() {
    if (dailyGoal === 0) {
        document.getElementById('progress-text').textContent = "Set a goal first!";
        document.getElementById('progress-bar').style.width = "0%";
        document.getElementById('percentage-display').textContent = "0%";
        return;
    }

    const percentage = Math.min((currentIntake / dailyGoal) * 100, 100);

    document.getElementById('progress-text').textContent = `${currentIntake} / ${dailyGoal} ml`;
    document.getElementById('progress-bar').style.width = `${percentage}%`;
    document.getElementById('percentage-display').textContent = `${Math.round(percentage)}%`;
}

// ---------------------- Water Log ----------------------
function updateWaterLog() {
    const logContainer = document.getElementById('water-log');
    logContainer.innerHTML = '';

    waterLog.forEach((entry, index) => {
        const logItem = document.createElement('div');
        logItem.className = 'flex justify-between items-center p-2 bg-gray-50 rounded';
        logItem.innerHTML = `
            <span>💧 ${entry.amount}ml</span>
            <span class="text-sm text-gray-500">${entry.time}</span>
            <button onclick="removeLogEntry(${index})" class="text-red-500 hover:text-red-700 text-sm">✕</button>
        `;
        logContainer.appendChild(logItem);
    });
}

function removeLogEntry(index) {
    currentIntake -= waterLog[index].amount;
    waterLog.splice(index, 1);
    updateProgress();
    updateWaterLog();
}

// ---------------------- Reminder ----------------------
function setReminder() {
    const intervalInput = document.getElementById('reminder-interval');
    const minutes = parseInt(intervalInput.value);

    if (!minutes || minutes < 1) {
        showNotification('⚠️ Enter a valid reminder interval', 'error');
        return;
    }

    if (reminderTimer) {
        clearInterval(reminderTimer);
    }

    reminderInterval = minutes;
    reminderTimer = setInterval(() => {
        showNotification('⏰ Time to drink water! 💧', 'reminder');
    }, minutes * 60 * 1000);

    document.getElementById('reminder-status').textContent = `Reminder every ${minutes} minutes`;
}

function stopReminder() {
    clearInterval(reminderTimer);
    document.getElementById('reminder-status').textContent = 'No reminder set';
}

// ---------------------- Goal Check ----------------------
function checkGoalAchievement() {
    if (currentIntake >= dailyGoal) {
        showNotification('🎉 Congratulations! You reached your daily goal!', 'success');
    }
}

// ---------------------- Reset ----------------------
function resetDaily() {
    currentIntake = 0;
    waterLog = [];
    updateProgress();
    updateWaterLog();
    showNotification('🔄 Daily progress reset', 'info');
}

// ---------------------- Notifications ----------------------
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;

    // Base styles
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white`;

    // Type-based styling
    if (type === 'success') notification.classList.add('bg-green-500');
    else if (type === 'error') notification.classList.add('bg-red-500');
    else if (type === 'reminder') notification.classList.add('bg-blue-500');
    else if (type === 'info') notification.classList.add('bg-gray-500');
    else notification.classList.add('bg-gray-700');

    notification.classList.remove('hidden');

    // Auto-dismiss after 3s
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// ---------------------- Initialization ----------------------
window.onload = () => {
    updateProgress();
    updateWaterLog();
};
