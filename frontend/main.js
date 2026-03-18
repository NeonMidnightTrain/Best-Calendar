const months = [
'January','February','March','April','May','June',
'July','August','September','October','November','December'
];

let currentMonth = 10; // November

const monthNameEl = document.querySelector('.date');
const prevArrow = document.querySelector('.prev');
const nextArrow = document.querySelector('.next');
const eventsEl = document.querySelector(".events");

function updateMonth(){
    monthNameEl.textContent = months[currentMonth] + " 2026";
}

prevArrow.addEventListener('click', function(){
    currentMonth = (currentMonth - 1 + months.length) % months.length;
    updateMonth();
});

nextArrow.addEventListener('click', function(){
    currentMonth = (currentMonth + 1) % months.length;
    updateMonth();
});

updateMonth();

async function loadEvents() {
  if (!eventsEl) return;
  eventsEl.textContent = "Loading...";

  try {
    const res = await fetch("http://localhost:3000/events");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      eventsEl.textContent = "No events yet.";
      return;
    }

    eventsEl.innerHTML = data
      .map((e) => `<div>${e.title}${e.date ? ` - ${e.date}` : ""}${e.time ? ` @ ${e.time}` : ""}</div>`)
      .join("");
  } catch (err) {
    eventsEl.textContent = "Failed to load events.";
    console.error(err);
  }
}

loadEvents();
