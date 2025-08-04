// Cute FocusFlow Tracker JavaScript

// Global variables for statistics
let savingsGoal = parseFloat(localStorage.getItem('savingsGoal')) || 0;

function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector('.tab[onclick*="' + tabId + '"]').classList.add('active');
  document.getElementById(tabId).classList.add('active');
  
  // Add cute animation
  const activeTab = document.getElementById(tabId);
  activeTab.style.animation = 'none';
  activeTab.offsetHeight; // Trigger reflow
  activeTab.style.animation = 'fadeIn 0.5s ease-in-out';
  
  // Update statistics for the active tab
  updateTabStatistics(tabId);
}

function updateTabStatistics(tabId) {
  switch(tabId) {
    case 'tasks':
      updateTaskStatistics();
      break;
    case 'habits':
      updateHabitStatistics();
      break;
    case 'weedTracker':
      updateDisciplineStatistics();
      break;
    case 'finances':
      updateFinanceStatistics();
      break;
  }
}

function renderList(list, containerId, type) {
  const ul = document.getElementById(containerId);
  ul.innerHTML = '';
  
  if (type === 'discipline') {
    console.log('Rendering discipline list with data:', list);
  }
  
  list.forEach((item, i) => {
    const li = document.createElement('li');
    li.className = 'list-item';
    if (item.done) li.classList.add('completed');
    
    li.innerHTML = `
      <div class="list-left">
        <input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleItem('${type}', ${i})">
        <span contenteditable="true" onblur="editItem('${type}', ${i}, this.innerText)">${item.text}</span>
      </div>
      <div class="actions">
        <button onclick="deleteItem('${type}', ${i})" title="Delete item">🗑️</button>
      </div>
    `;
    
    if (type === 'discipline') {
      console.log(`Day ${i + 1}: done=${item.done}, checked=${item.done ? 'checked' : ''}`);
    }
    
    // Add cute entrance animation
    li.style.opacity = '0';
    li.style.transform = 'translateX(-20px)';
    ul.appendChild(li);
    
    setTimeout(() => {
      li.style.transition = 'all 0.3s ease';
      li.style.opacity = '1';
      li.style.transform = 'translateX(0)';
    }, i * 100);
  });
}

function updateProgressBar(id, list, textId = null) {
  const done = list.filter(x => x.done).length;
  const percent = list.length > 0 ? (done / list.length) * 100 : 0;
  const progressBar = document.getElementById(id);
  progressBar.style.width = percent + '%';
  
  if (textId) {
    document.getElementById(textId).textContent = `${Math.round(percent)}% Complete`;
  }
  
  // Add cute color change based on progress
  if (percent >= 80) {
    progressBar.style.background = 'linear-gradient(90deg, #4ecdc4, #44a08d)';
  } else if (percent >= 50) {
    progressBar.style.background = 'linear-gradient(90deg, #ffd93d, #ff6b6b)';
  } else {
    progressBar.style.background = 'linear-gradient(90deg, #ff6b9d, #ff8fab)';
  }
}

// Task Functions
function addTask() {
  const val = document.getElementById('newTask').value.trim();
  const time = document.getElementById('taskTime').value;
  if (!val) return;
  
  const list = JSON.parse(localStorage.getItem('tasksList')) || [];
  list.push({ 
    text: time ? `${val} (by ${time})` : val, 
    done: false,
    created: new Date().toISOString().slice(0, 10)
  });
  localStorage.setItem('tasksList', JSON.stringify(list));
  
  document.getElementById('newTask').value = '';
  document.getElementById('taskTime').value = '';
  
  // Add cute success animation
  const button = event.target;
  button.innerHTML = 'Added! ✨';
  button.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
  
  setTimeout(() => {
    button.innerHTML = 'Add ✨';
    button.style.background = 'linear-gradient(45deg, #ff6b9d, #ff8fab)';
  }, 1000);
  
  renderTasks();
  updateTaskStatistics();
}

function updateTaskStatistics() {
  const list = JSON.parse(localStorage.getItem('tasksList')) || [];
  const completed = list.filter(x => x.done).length;
  const pending = list.length - completed;
  const completionRate = list.length > 0 ? Math.round((completed / list.length) * 100) : 0;
  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = list.filter(x => x.created === today).length;
  
  document.getElementById('totalTasks').textContent = list.length;
  document.getElementById('completedTasks').textContent = completed;
  document.getElementById('pendingTasks').textContent = pending;
  document.getElementById('taskCompletionRate').textContent = `${completionRate}%`;
  document.getElementById('todayTasks').textContent = todayTasks;
}

// Habit Functions
function addHabit(type) {
  const tf = document.getElementById('habitTimeframe').value;
  const id = type === 'good' ? 'newGoodHabit' : 'newBadHabit';
  const val = document.getElementById(id).value.trim();
  if (!val) return;
  
  const key = `${type}Habits_${tf}`;
  const list = JSON.parse(localStorage.getItem(key)) || [];
  list.push({ text: val, done: false });
  localStorage.setItem(key, JSON.stringify(list));
  
  document.getElementById(id).value = '';
  
  // Add cute success animation
  const button = event.target;
  const originalText = button.innerHTML;
  button.innerHTML = type === 'good' ? 'Added! ✨' : 'Added! 💔';
  button.style.background = type === 'good' ? 
    'linear-gradient(45deg, #4ecdc4, #44a08d)' : 
    'linear-gradient(45deg, #ff6b6b, #ff8e8e)';
  
  setTimeout(() => {
    button.innerHTML = originalText;
    button.style.background = 'linear-gradient(45deg, #ff6b9d, #ff8fab)';
  }, 1000);
  
  renderHabits();
  updateHabitStatistics();
}

function updateHabitStatistics() {
  const tf = document.getElementById('habitTimeframe').value;
  const goodHabits = JSON.parse(localStorage.getItem(`goodHabits_${tf}`)) || [];
  const badHabits = JSON.parse(localStorage.getItem(`badHabits_${tf}`)) || [];
  
  const completedGood = goodHabits.filter(x => x.done).length;
  const avoidedBad = badHabits.filter(x => x.done).length;
  const totalHabits = goodHabits.length + badHabits.length;
  const successRate = totalHabits > 0 ? Math.round(((completedGood + avoidedBad) / totalHabits) * 100) : 0;
  
  document.getElementById('totalGoodHabits').textContent = goodHabits.length;
  document.getElementById('totalBadHabits').textContent = badHabits.length;
  document.getElementById('completedGoodHabits').textContent = completedGood;
  document.getElementById('avoidedBadHabits').textContent = avoidedBad;
  document.getElementById('habitSuccessRate').textContent = `${successRate}%`;
}

// Discipline Functions
function updateDisciplineStatistics() {
  const disciplineData = JSON.parse(localStorage.getItem('disciplineList')) || {};
  const entries = Object.values(disciplineData);
  
  const completed = entries.filter(x => x.done === true).length;
  const failed = entries.filter(x => x.done === false).length;
  const totalDays = entries.length;
  const successRate = totalDays > 0 ? Math.round((completed / totalDays) * 100) : 0;
  
  // Calculate streaks - improved logic for calendar-based data
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  
  // Get today's date
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  
  // Sort entries by date for proper streak calculation
  const sortedEntries = entries
    .filter(entry => entry.date && entry.done !== null) // Only include entries with dates and actual status
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Find best streak
  for (let i = 0; i < sortedEntries.length; i++) {
    if (sortedEntries[i].done === true) {
      tempStreak++;
      if (tempStreak > bestStreak) bestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  }
  
  // Find current streak by checking consecutive days backwards from today
  tempStreak = 0;
  let checkDate = new Date(today);
  
  // Check up to 30 days back for current streak
  for (let i = 0; i < 30; i++) {
    const dateStr = checkDate.toISOString().slice(0, 10);
    const dayData = disciplineData[dateStr];
    
    if (dayData && dayData.done === true) {
      tempStreak++;
    } else if (dayData && dayData.done === false) {
      break; // Stop streak on failed day
    } else if (checkDate > today) {
      // Future date, continue
    } else {
      // No data for this day, assume it's not completed
      break;
    }
    
    checkDate.setDate(checkDate.getDate() - 1);
  }
  
  currentStreak = tempStreak;
  
  
  document.getElementById('completedDays').textContent = completed;
  document.getElementById('remainingDays').textContent = failed;
  document.getElementById('currentStreak').textContent = currentStreak;
  document.getElementById('bestStreak').textContent = bestStreak;
  document.getElementById('disciplineSuccessRate').textContent = `${successRate}%`;
}

// Finance Functions
function addFinance(type) {
  const incomeInput = document.getElementById('incomeInput');
  const expenseInput = document.getElementById('expenseInput');
  const value = type === 'income' ? parseFloat(incomeInput.value) : -parseFloat(expenseInput.value);
  
  if (isNaN(value)) return;
  
  const financeList = JSON.parse(localStorage.getItem('financeList')) || [];
  financeList.push({ 
    amount: value, 
    date: new Date().toISOString().slice(0, 10),
    type: type
  });
  localStorage.setItem('financeList', JSON.stringify(financeList));
  
  incomeInput.value = '';
  expenseInput.value = '';
  
  // Add cute success animation
  const button = event.target;
  const originalText = button.innerHTML;
  button.innerHTML = type === 'income' ? 'Added! 💰' : 'Added! 💸';
  button.style.background = type === 'income' ? 
    'linear-gradient(45deg, #4ecdc4, #44a08d)' : 
    'linear-gradient(45deg, #ff6b6b, #ff8e8e)';
  
  setTimeout(() => {
    button.innerHTML = originalText;
    button.style.background = 'linear-gradient(45deg, #ff6b9d, #ff8fab)';
  }, 1000);
  
  renderFinances();
  updateFinanceStatistics();
}

function updateFinanceStatistics() {
  const financeList = JSON.parse(localStorage.getItem('financeList')) || [];
  
  // Calculate totals
  const totalIncome = financeList.filter(x => x.amount > 0).reduce((sum, x) => sum + x.amount, 0);
  const totalExpenses = Math.abs(financeList.filter(x => x.amount < 0).reduce((sum, x) => sum + x.amount, 0));
  const netIncome = totalIncome - totalExpenses;
  const totalTransactions = financeList.length;
  
  // Calculate averages
  const incomeTransactions = financeList.filter(x => x.amount > 0);
  const expenseTransactions = financeList.filter(x => x.amount < 0);
  const avgIncome = incomeTransactions.length > 0 ? totalIncome / incomeTransactions.length : 0;
  const avgExpense = expenseTransactions.length > 0 ? totalExpenses / expenseTransactions.length : 0;
  
  // Monthly calculations
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthTotal = financeList
    .filter(x => {
      const date = new Date(x.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, x) => sum + x.amount, 0);
  
  const lastMonthTotal = financeList
    .filter(x => {
      const date = new Date(x.date);
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return date.getMonth() === lastMonth && date.getFullYear() === lastYear;
    })
    .reduce((sum, x) => sum + x.amount, 0);
  
  const monthlyChange = thisMonthTotal - lastMonthTotal;
  
  // Update display
  document.getElementById('totalBalance').textContent = `$${netIncome.toFixed(2)}`;
  document.getElementById('totalIncome').textContent = `$${totalIncome.toFixed(2)}`;
  document.getElementById('totalExpenses').textContent = `$${totalExpenses.toFixed(2)}`;
  document.getElementById('netIncome').textContent = `$${netIncome.toFixed(2)}`;
  document.getElementById('totalTransactions').textContent = totalTransactions;
  document.getElementById('avgIncome').textContent = `$${avgIncome.toFixed(2)}`;
  document.getElementById('avgExpense').textContent = `$${avgExpense.toFixed(2)}`;
  document.getElementById('thisMonthTotal').textContent = `$${thisMonthTotal.toFixed(2)}`;
  document.getElementById('lastMonthTotal').textContent = `$${lastMonthTotal.toFixed(2)}`;
  document.getElementById('monthlyChange').textContent = `$${monthlyChange.toFixed(2)}`;
  
  // Update goal progress
  updateGoalProgress(netIncome);
}

function updateGoalProgress(currentBalance) {
  if (savingsGoal > 0) {
    const progress = Math.min((currentBalance / savingsGoal) * 100, 100);
    const remaining = Math.max(savingsGoal - currentBalance, 0);
    
    document.getElementById('goalProgress').textContent = `${Math.round(progress)}%`;
    document.getElementById('goalRemaining').textContent = `$${remaining.toFixed(2)}`;
  } else {
    document.getElementById('goalProgress').textContent = '0%';
    document.getElementById('goalRemaining').textContent = '$0.00';
  }
}

function setSavingsGoal() {
  const goalInput = document.getElementById('savingsGoal');
  const goal = parseFloat(goalInput.value);
  
  if (!isNaN(goal) && goal > 0) {
    savingsGoal = goal;
    localStorage.setItem('savingsGoal', goal.toString());
    
    // Add cute success animation
    const button = event.target;
    button.innerHTML = 'Goal Set! 🎯';
    button.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
    
    setTimeout(() => {
      button.innerHTML = 'Set Goal 🎯';
      button.style.background = 'linear-gradient(45deg, #ff6b9d, #ff8fab)';
    }, 1000);
    
    goalInput.value = '';
    updateFinanceStatistics();
  }
}

function renderFinances() {
  const financeList = JSON.parse(localStorage.getItem('financeList')) || [];
  const financeListEl = document.getElementById('financeList');
  
  financeListEl.innerHTML = '';
  
  // Sort by date (newest first)
  const sortedList = financeList.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  sortedList.forEach((entry, index) => {
    const li = document.createElement('li');
    li.textContent = entry.date + ': ' + (entry.amount >= 0 ? '+$' : '-$') + Math.abs(entry.amount).toFixed(2);
    li.className = entry.amount >= 0 ? 'income' : 'expense';
    li.style.color = entry.amount >= 0 ? '#4ecdc4' : '#ff6b6b';
    
    // Add cute entrance animation
    li.style.opacity = '0';
    li.style.transform = 'translateX(-20px)';
    financeListEl.appendChild(li);
    
    setTimeout(() => {
      li.style.transition = 'all 0.3s ease';
      li.style.opacity = '1';
      li.style.transform = 'translateX(0)';
    }, index * 100);
  });
}

// Common Functions
function toggleItem(type, i) {
  const key = getStorageKey(type);
  const list = JSON.parse(localStorage.getItem(key)) || [];
  list[i].done = !list[i].done;
  localStorage.setItem(key, JSON.stringify(list));
  
  // Add cute toggle animation
  const listItem = event.target.closest('.list-item');
  if (listItem) {
    listItem.style.transform = 'scale(1.05)';
    setTimeout(() => {
      listItem.style.transform = 'scale(1)';
    }, 200);
  }
  
  renderAll();
  updateTabStatistics(getCurrentTab());
}

function deleteItem(type, i) {
  const key = getStorageKey(type);
  const list = JSON.parse(localStorage.getItem(key)) || [];
  
  // Add cute delete animation
  const listItem = event.target.closest('.list-item');
  if (listItem) {
    listItem.style.transform = 'translateX(100px)';
    listItem.style.opacity = '0';
    setTimeout(() => {
      list.splice(i, 1);
      localStorage.setItem(key, JSON.stringify(list));
      renderAll();
      updateTabStatistics(getCurrentTab());
    }, 300);
  } else {
    list.splice(i, 1);
    localStorage.setItem(key, JSON.stringify(list));
    renderAll();
    updateTabStatistics(getCurrentTab());
  }
}

function editItem(type, i, text) {
  const key = getStorageKey(type);
  const list = JSON.parse(localStorage.getItem(key)) || [];
  list[i].text = text.trim();
  localStorage.setItem(key, JSON.stringify(list));
}

function getStorageKey(type) {
  if (type === 'tasks') return 'tasksList';
  if (type === 'discipline') return 'disciplineList';
  const tf = document.getElementById('habitTimeframe').value;
  return `${type}Habits_${tf}`;
}

function getCurrentTab() {
  const activeTab = document.querySelector('.tab-content.active');
  return activeTab ? activeTab.id : 'tasks';
}

function renderTasks() {
  const list = JSON.parse(localStorage.getItem('tasksList')) || [];
  renderList(list, 'taskList', 'tasks');
  updateProgressBar('taskProgress', list, 'taskProgressText');
}

function renderHabits() {
  const tf = document.getElementById('habitTimeframe').value;
  document.querySelectorAll('#habitType').forEach(el => el.textContent = tf.charAt(0).toUpperCase() + tf.slice(1));
  
  ['good', 'bad'].forEach(type => {
    const list = JSON.parse(localStorage.getItem(`${type}Habits_${tf}`)) || [];
    renderList(list, `${type}HabitList`, type);
  });
  
  updateProgressBar('habitProgress', 
    [...JSON.parse(localStorage.getItem(`goodHabits_${tf}`)) || [], 
     ...JSON.parse(localStorage.getItem(`badHabits_${tf}`)) || []], 
    'habitProgressText');
}

function renderDiscipline() {
  const container = document.getElementById('disciplineList');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Create calendar view
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Get discipline data
  let disciplineData = JSON.parse(localStorage.getItem('disciplineList')) || {};
  
  // Create calendar header
  const calendarHeader = document.createElement('div');
  calendarHeader.className = 'calendar-header';
  calendarHeader.innerHTML = `
    <h3>${new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} 🌿</h3>
    <div class="calendar-legend">
      <span class="legend-item"><span class="legend-dot completed"></span> Completed</span>
      <span class="legend-item"><span class="legend-dot failed"></span> Failed</span>
      <span class="legend-item"><span class="legend-dot future"></span> Future</span>
    </div>
  `;
  container.appendChild(calendarHeader);
  
  // Create calendar grid
  const calendarGrid = document.createElement('div');
  calendarGrid.className = 'calendar-grid';
  
  // Add day headers
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayNames.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'calendar-day-header';
    dayHeader.textContent = day;
    calendarGrid.appendChild(dayHeader);
  });
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day empty';
    calendarGrid.appendChild(emptyCell);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement('div');
    dayCell.className = 'calendar-day';
    
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayData = disciplineData[dateKey] || { done: null, text: `Day ${day}` };
    
    // Determine day status
    const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
    const isPast = new Date(currentYear, currentMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isFuture = new Date(currentYear, currentMonth, day) > new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    let statusClass = '';
    if (dayData.done === true) {
      statusClass = 'completed';
    } else if (dayData.done === false) {
      statusClass = 'failed';
    } else if (isFuture) {
      statusClass = 'future';
    } else {
      statusClass = 'past';
    }
    
    dayCell.classList.add(statusClass);
    if (isToday) dayCell.classList.add('today');
    
    dayCell.innerHTML = `
      <span class="day-number">${day}</span>
      ${dayData.done === true ? '✅' : dayData.done === false ? '❌' : ''}
    `;
    
    // Only add click handler for past and current days (not future days)
    if (!isFuture) {
      dayCell.onclick = () => toggleDay(dateKey, day, dayData);
    } else {
      dayCell.style.cursor = 'default';
      dayCell.style.opacity = '0.6';
    }
    
    calendarGrid.appendChild(dayCell);
  }
  
  container.appendChild(calendarGrid);
  updateProgressBar('disciplineProgress', Object.values(disciplineData), 'disciplineProgressText');
}

function toggleDay(dateKey, day, dayData) {
  // Safety check: prevent future dates from being modified
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  if (dateKey > todayStr) {
    return; // Don't allow modification of future dates
  }
  
  let disciplineData = JSON.parse(localStorage.getItem('disciplineList')) || {};
  
  // Cycle through states: null -> true (completed) -> false (failed) -> null (not set)
  let newState;
  if (dayData.done === null) {
    newState = true; // Mark as completed
  } else if (dayData.done === true) {
    newState = false; // Mark as failed
  } else {
    newState = null; // Reset to not set
  }
  
  disciplineData[dateKey] = {
    done: newState,
    text: `Day ${day}`,
    date: dateKey
  };
  
  localStorage.setItem('disciplineList', JSON.stringify(disciplineData));
  renderDiscipline();
  updateDisciplineStatistics();
}

function resetDiscipline() {
  if (!confirm('Are you sure you want to reset the weed tracker? 🌿')) return;
  
  // Clear all discipline data
  localStorage.setItem('disciplineList', JSON.stringify({}));
  
  // Add cute reset animation
  const button = event.target;
  button.innerHTML = 'Reset! 🔄';
  button.style.background = 'linear-gradient(45deg, #ff6b6b, #ff8e8e)';
  
  setTimeout(() => {
    button.innerHTML = 'Reset Weed Tracker 🔄';
    button.style.background = 'linear-gradient(45deg, #ff6b9d, #ff8fab)';
  }, 1000);
  
  renderDiscipline();
  updateDisciplineStatistics();
}

function renderAll() {
  renderTasks();
  renderHabits();
  renderDiscipline();
  renderFinances();
}

// Add cute loading animation
window.onload = function() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
    renderAll();
    updateTabStatistics('tasks');
  }, 100);
};

// Add cute keyboard shortcuts
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey || e.metaKey) {
    switch(e.key) {
      case '1':
        e.preventDefault();
        switchTab('tasks');
        break;
      case '2':
        e.preventDefault();
        switchTab('habits');
        break;
      case '3':
        e.preventDefault();
        switchTab('weedTracker');
        break;
      case '4':
        e.preventDefault();
        switchTab('finances');
        break;
    }
  }
});

// Add Enter key support for inputs
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const activeElement = document.activeElement;
    if (activeElement.id === 'newTask') {
      addTask();
    } else if (activeElement.id === 'newGoodHabit') {
      addHabit('good');
    } else if (activeElement.id === 'newBadHabit') {
      addHabit('bad');
    } else if (activeElement.id === 'incomeInput') {
      addFinance('income');
    } else if (activeElement.id === 'expenseInput') {
      addFinance('expense');
    } else if (activeElement.id === 'savingsGoal') {
      setSavingsGoal();
    }
  }
});