// Cute FocusFlow Tracker JavaScript

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
}

function renderList(list, containerId, type) {
  const ul = document.getElementById(containerId);
  ul.innerHTML = '';
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

function updateProgressBar(id, list) {
  const done = list.filter(x => x.done).length;
  const percent = list.length > 0 ? (done / list.length) * 100 : 0;
  const progressBar = document.getElementById(id);
  progressBar.style.width = percent + '%';
  
  // Add cute color change based on progress
  if (percent >= 80) {
    progressBar.style.background = 'linear-gradient(90deg, #4ecdc4, #44a08d)';
  } else if (percent >= 50) {
    progressBar.style.background = 'linear-gradient(90deg, #ffd93d, #ff6b6b)';
  } else {
    progressBar.style.background = 'linear-gradient(90deg, #ff6b9d, #ff8fab)';
  }
}

function addTask() {
  const val = document.getElementById('newTask').value.trim();
  const time = document.getElementById('taskTime').value;
  if (!val) return;
  
  const list = JSON.parse(localStorage.getItem('tasksList')) || [];
  list.push({ text: time ? `${val} (by ${time})` : val, done: false });
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
}

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
}

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
    }, 300);
  } else {
    list.splice(i, 1);
    localStorage.setItem(key, JSON.stringify(list));
    renderAll();
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

function renderTasks() {
  const list = JSON.parse(localStorage.getItem('tasksList')) || [];
  renderList(list, 'taskList', 'tasks');
  updateProgressBar('taskProgress', list);
}

function renderHabits() {
  const tf = document.getElementById('habitTimeframe').value;
  document.querySelectorAll('#habitType').forEach(el => el.textContent = tf.charAt(0).toUpperCase() + tf.slice(1));
  
  ['good', 'bad'].forEach(type => {
    const list = JSON.parse(localStorage.getItem(`${type}Habits_${tf}`)) || [];
    renderList(list, `${type}HabitList`, type);
    updateProgressBar('habitProgress', list);
  });
}

function renderDiscipline() {
  let list = JSON.parse(localStorage.getItem('disciplineList'));
  if (!list || list.length !== 30) {
    list = Array.from({ length: 30 }, (_, i) => ({
      text: 'Day ' + (i + 1) + ' – No weed at all 🚫🌿',
      done: false
    }));
    localStorage.setItem('disciplineList', JSON.stringify(list));
  }
  renderList(list, 'disciplineList', 'discipline');
  updateProgressBar('disciplineProgress', list);
}

function resetDiscipline() {
  if (!confirm('Are you sure you want to reset the weed tracker? 🌿')) return;
  
  const list = Array.from({ length: 30 }, (_, i) => ({
    text: 'Day ' + (i + 1) + ' – No weed at all 🚫🌿',
    done: false
  }));
  localStorage.setItem('disciplineList', JSON.stringify(list));
  
  // Add cute reset animation
  const button = event.target;
  button.innerHTML = 'Reset! 🔄';
  button.style.background = 'linear-gradient(45deg, #ff6b6b, #ff8e8e)';
  
  setTimeout(() => {
    button.innerHTML = 'Reset Weed Tracker 🔄';
    button.style.background = 'linear-gradient(45deg, #ff6b9d, #ff8fab)';
  }, 1000);
  
  renderDiscipline();
}

function addFinance(type) {
  const incomeInput = document.getElementById('incomeInput');
  const expenseInput = document.getElementById('expenseInput');
  const value = type === 'income' ? parseFloat(incomeInput.value) : -parseFloat(expenseInput.value);
  
  if (isNaN(value)) return;
  
  const financeList = JSON.parse(localStorage.getItem('financeList')) || [];
  financeList.push({ amount: value, date: new Date().toISOString().slice(0, 10) });
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
}

function renderFinances() {
  const financeList = JSON.parse(localStorage.getItem('financeList')) || [];
  const financeListEl = document.getElementById('financeList');
  const totalEl = document.getElementById('financeTotal');
  
  financeListEl.innerHTML = '';
  let total = 0;
  
  financeList.forEach((entry, index) => {
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
    
    total += entry.amount;
  });
  
  totalEl.textContent = total.toFixed(2);
  
  // Add cute color to total
  const totalElement = document.getElementById('financeTotal');
  if (total >= 0) {
    totalElement.style.color = '#4ecdc4';
  } else {
    totalElement.style.color = '#ff6b6b';
  }
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