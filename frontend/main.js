const months = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const today = new Date();
let currentMonth = today.getMonth();
let currentYear  = today.getFullYear();
let selectedDay  = today.getDate();

const monthNameEl       = document.querySelector('.date');
const prevArrow         = document.querySelector('.prev');
const nextArrow         = document.querySelector('.next');
const daysGrid          = document.querySelector('.days');
const eventsEl          = document.querySelector('.events');
const addEventBtn       = document.querySelector('.add-event-btn');
const addEventForm      = document.querySelector('.add-event-form');
const saveEventBtn      = document.getElementById('save-event');
const eventTitleInput   = document.getElementById('event-title');
const eventTimeInput    = document.getElementById('event-time');
const selectedDateLabel = document.getElementById('selected-date-label');

function isSameDate(a, b) {
  return a.getDate() === b.getDate() &&
         a.getMonth() === b.getMonth() &&
         a.getFullYear() === b.getFullYear();
}

// ── localStorage helpers ──────────────────────────────────────────────────────

function getEvents() {
  return JSON.parse(localStorage.getItem('events') || '[]');
}

function saveEvents(events) {
  localStorage.setItem('events', JSON.stringify(events));
}

// ── Calendar rendering ────────────────────────────────────────────────────────

function renderCalendar() {
  if (!monthNameEl || !daysGrid) return;
  monthNameEl.textContent = `${months[currentMonth]} ${currentYear}`;

  const firstDay    = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevDays    = new Date(currentYear, currentMonth, 0).getDate();

  let html = '';

  for (let i = firstDay - 1; i >= 0; i--) {
    html += `<div class="prev-date">${prevDays - i}</div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const isToday    = d === today.getDate() &&
                       currentMonth === today.getMonth() &&
                       currentYear  === today.getFullYear();
    const isSelected = d === selectedDay;
    let cls = '';
    if (isToday)    cls += ' today';
    if (isSelected) cls += ' active';
    html += `<div class="${cls.trim()}" data-day="${d}">${d}</div>`;
  }

  const totalCells = firstDay + daysInMonth;
  const trailing   = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let n = 1; n <= trailing; n++) {
    html += `<div class="next-date">${n}</div>`;
  }

  daysGrid.innerHTML = html;
  updateSelectedDateLabel();
}

function updateSelectedDateLabel() {
  if (!selectedDateLabel) return;
  const d = String(selectedDay).padStart(2, '0');
  const m = String(currentMonth + 1).padStart(2, '0');
  selectedDateLabel.textContent = `Adding to: ${currentYear}-${m}-${d}`;
}

// ── Navigation ────────────────────────────────────────────────────────────────

if (prevArrow) {
  prevArrow.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    selectedDay = 1;
    renderCalendar();
    renderEvents();
    renderWeekView();
  });
}

if (nextArrow) {
  nextArrow.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    selectedDay = 1;
    renderCalendar();
    renderEvents();
    renderWeekView();
  });
}

// ── Day selection ─────────────────────────────────────────────────────────────

if (daysGrid) {
  daysGrid.addEventListener('click', (e) => {
    const dayEl = e.target.closest('[data-day]');
    if (!dayEl) return;
    selectedDay = parseInt(dayEl.dataset.day, 10);
    renderCalendar();
    renderEvents();
    renderWeekView();
  });
}

// ── Toggle form ───────────────────────────────────────────────────────────────

if (addEventBtn && addEventForm) {
  addEventBtn.addEventListener('click', () => {
    const open = addEventForm.style.display === 'flex';
    addEventForm.style.display = open ? 'none' : 'flex';
  });
}

// ── Add event ─────────────────────────────────────────────────────────────────

if (saveEventBtn && eventTitleInput && eventTimeInput) {
  saveEventBtn.addEventListener('click', () => {
    const title = eventTitleInput.value.trim();
    const time  = eventTimeInput.value;

    if (!title) {
      alert('Please enter an event title.');
      return;
    }

    const m    = String(currentMonth + 1).padStart(2, '0');
    const d    = String(selectedDay).padStart(2, '0');
    const date = `${currentYear}-${m}-${d}`;

    const events = getEvents();
    events.push({ id: Date.now(), title, date, time });
    saveEvents(events);

    eventTitleInput.value      = '';
    eventTimeInput.value       = '';
    addEventForm.style.display = 'none';
    renderEvents();
    renderWeekView();
  });
}

// ── Delete event ──────────────────────────────────────────────────────────────

function deleteEvent(id) {
  saveEvents(getEvents().filter(e => e.id !== id));
  renderEvents();
  renderWeekView();
}

// ── Render events for selected day ────────────────────────────────────────────

function renderEvents() {
  if (!eventsEl) return;
  const m = String(currentMonth + 1).padStart(2, '0');
  const d = String(selectedDay).padStart(2, '0');
  const selectedDate = `${currentYear}-${m}-${d}`;

  const dayEvents = getEvents().filter(e => e.date === selectedDate);

  if (dayEvents.length === 0) {
    eventsEl.innerHTML = '<p class="no-events">No events for this day.</p>';
    return;
  }

  eventsEl.innerHTML = dayEvents.map(e => `
    <div class="event-item">
      <div class="event-info">
        <span class="event-title">${e.title}</span>
        ${e.time ? `<span class="event-time-tag">${e.time}</span>` : ''}
      </div>
      <button class="delete-event-btn" data-id="${e.id}" title="Remove event">×</button>
    </div>
  `).join('');

  eventsEl.querySelectorAll('.delete-event-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteEvent(Number(btn.dataset.id)));
  });
}


// ===== SIMPLE TODO FUNCTION =====
function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();
  if (!taskText) return;

  const div = document.createElement("div");
  div.textContent = taskText;
  div.style.padding = "5px 0";

  document.getElementById("taskList").appendChild(div);
  input.value = "";
}

// ===== WEEK VIEW =====

const timeColumnEl = document.getElementById('time-column');
const weekHeaderEl = document.getElementById('week-header');
const weekBodyEl = document.getElementById('week-body');
const weekTitleEl = document.querySelector('.week-title');
const weekBodyWrapperEl = document.querySelector('.week-body-wrapper');

const HOUR_HEIGHT = 64;

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatWeekdayShort(date) {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
}

function formatTimeLabel(hour) {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const normalized = hour % 12 === 0 ? 12 : hour % 12;
  return `${normalized} ${suffix}`;
}

function formatEventTime(time) {
  if (!time) return 'All day';
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const normalized = h % 12 === 0 ? 12 : h % 12;
  const minutes = String(m).padStart(2, '0');
  return `${normalized}:${minutes} ${suffix}`;
}

function renderTimeColumn() {
  if (!timeColumnEl) return;

  let html = '<div class="time-column-track">';
  for (let hour = 0; hour < 24; hour++) {
    html += `<div class="time-slot-label">${formatTimeLabel(hour)}</div>`;
  }
  html += '</div>';

  timeColumnEl.innerHTML = html;
  timeColumnEl.style.overflow = 'hidden';
}

function syncTimeColumnScroll() {
  if (!timeColumnEl || !weekBodyWrapperEl) return;

  const trackEl = timeColumnEl.querySelector('.time-column-track');
  if (!trackEl) return;

  trackEl.style.transform = `translateY(${-weekBodyWrapperEl.scrollTop}px)`;
}

function renderWeekHeader() {
  if (!weekHeaderEl) return;

  const selectedDate = new Date(currentYear, currentMonth, selectedDay);
  const weekStart = getStartOfWeek(selectedDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  if (weekTitleEl) {
    weekTitleEl.textContent = `${months[weekStart.getMonth()]} ${weekStart.getDate()} - ${months[weekEnd.getMonth()]} ${weekEnd.getDate()}`;
  }

  let html = '';
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(weekStart);
    dayDate.setDate(weekStart.getDate() + i);

    const isSelected =
      dayDate.getDate() === selectedDay &&
      dayDate.getMonth() === currentMonth &&
      dayDate.getFullYear() === currentYear;

    const isTodayInWeek = isSameDate(dayDate, today);

    html += `
      <div class="week-header-day ${isSelected ? 'active' : ''} ${isTodayInWeek ? 'today-column' : ''}" data-date="${dayDate.toISOString().split('T')[0]}">
        <div class="week-header-day-name">${formatWeekdayShort(dayDate)}</div>
        <div class="week-header-day-num">${dayDate.getDate()}</div>
      </div>
    `;
  }

  weekHeaderEl.innerHTML = html;
}

function renderWeekColumns() {
  if (!weekBodyEl) return;

  let html = '<div class="current-time-line" id="current-time-line"></div>';

  for (let day = 0; day < 7; day++) {
    html += `<div class="week-day-column" data-weekday="${day}">`;

    for (let hour = 0; hour < 24; hour++) {
      html += `<div class="hour-cell"></div>`;
    }

    html += `</div>`;
  }

  weekBodyEl.innerHTML = html;
}

function renderWeekEvents() {
  if (!weekBodyEl) return;

  const selectedDate = new Date(currentYear, currentMonth, selectedDay);
  const weekStart = getStartOfWeek(selectedDate);
  const allEvents = getEvents();

  allEvents.forEach((event) => {
    const eventDate = new Date(`${event.date}T00:00:00`);
    const diffDays = Math.floor((eventDate - weekStart) / (1000 * 60 * 60 * 24));

    if (diffDays < 0 || diffDays > 6) return;

    const dayColumn = weekBodyEl.querySelector(`.week-day-column[data-weekday="${diffDays}"]`);
    if (!dayColumn) return;

    let hour = 9;
    let minute = 0;

    if (event.time) {
      [hour, minute] = event.time.split(':').map(Number);
    }

    const top = (hour * HOUR_HEIGHT) + ((minute / 60) * HOUR_HEIGHT);
    const height = 56;

    const eventEl = document.createElement('div');
    eventEl.className = 'week-event';
    eventEl.style.top = `${top + 4}px`;
    eventEl.style.height = `${height}px`;
    eventEl.innerHTML = `
      <div class="week-event-title">${event.title}</div>
      <div class="week-event-time">${formatEventTime(event.time)}</div>
    `;

    dayColumn.appendChild(eventEl);
  });
}

function updateCurrentTimeLine() {
  const lineEl = document.getElementById('current-time-line');
  if (!lineEl) return;
  if (!weekBodyEl) return;

  const selectedDate = new Date(currentYear, currentMonth, selectedDay);
  const weekStart = getStartOfWeek(selectedDate);
  const now = new Date();

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  if (now < weekStart || now >= weekEnd) {
    lineEl.style.display = 'none';
    return;
  }

  lineEl.style.display = 'block';

  const dayOffset = now.getDay();
  const minutesToday = (now.getHours() * 60) + now.getMinutes();
  const top = (minutesToday / 60) * HOUR_HEIGHT;

  lineEl.style.top = `${top}px`;

  const colWidth = weekBodyEl.clientWidth / 7;
  lineEl.style.left = `${dayOffset * colWidth}px`;
  lineEl.style.width = `${colWidth}px`;
  lineEl.style.right = 'auto';
}

function renderWeekView() {
  renderWeekHeader();
  renderTimeColumn();
  renderWeekColumns();
  renderWeekEvents();
  updateCurrentTimeLine();
  syncTimeColumnScroll();
}

// ── Init ──────────────────────────────────────────────────────────────────────

function initializeApp() {
  renderCalendar();
  renderEvents();
  renderWeekView();
  updateCurrentTimeLine();
  if (weekBodyWrapperEl) {
    weekBodyWrapperEl.addEventListener('scroll', () => {
      syncTimeColumnScroll();
      updateCurrentTimeLine();
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  requestAnimationFrame(initializeApp);
}

setInterval(updateCurrentTimeLine, 60000);
