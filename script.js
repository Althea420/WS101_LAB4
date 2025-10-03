
let attendees = [
  { name: "Rinafe", company: "Microsoft", role: "Speaker", sessions: 5 },
  { name: "Ondoy", company: "InnoSoft", role: "Attendee", sessions: 3 },
  { name: "Maria", company: "TechCorp", role: "Organizer", sessions: 7 },
  { name: "Diana", company: "WebSolutions", role: "Speaker", sessions: 4 }
];

const outputEl = document.getElementById('output');

function showOutput(data) {
  if (typeof data === 'string') {
    document.getElementById("output").innerHTML = `<p>${data}</p>`;
  } 
  else if (Array.isArray(data)) {
    let html = "<table border='1' cellpadding='6'><tr><th>Name</th><th>Company</th><th>Role</th><th>Sessions</th></tr>";
    data.forEach(a => {
      html += `<tr>
                 <td>${a.name}</td>
                 <td>${a.company}</td>
                 <td>${a.role}</td>
                 <td>${a.sessions}</td>
               </tr>`;
    });
    html += "</table>";
    document.getElementById("output").innerHTML = html;
  } 
  else if (typeof data === 'object') {
    let html = "<pre>" + JSON.stringify(data, null, 2) + "</pre>";
    document.getElementById("output").innerHTML = html;
  }
}


function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replaceAll('&','&amp;')
            .replaceAll('<','&lt;')
            .replaceAll('>','&gt;');
}


function countAttendees() {
  return attendees.length;
}

function filterByRole(role) {
  return attendees.filter(a => a.role === role);
}

function findMostSessions() {
  if (attendees.length === 0) return null;
  return attendees.reduce((best, cur) => (cur.sessions > best.sessions ? cur : best), attendees[0]);
}

function groupByCompany() {
  return attendees.reduce((groups, a) => {
    if (!groups[a.company]) groups[a.company] = [];
    groups[a.company].push(a);
    return groups;
  }, {});
}

function fetchNewAttendees() {
  const simulatedNew = [
    { name: "Althea", company: "CloudNet", role: "Attendee", sessions: 2 },
    { name: "Jade", company: "TechCorp", role: "Speaker", sessions: 6 }
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      attendees = attendees.concat(simulatedNew);
      resolve(simulatedNew);
    }, 1000); 
  });
}

document.getElementById('btn-count').addEventListener('click', () => {
  showOutput(`Total attendees: ${countAttendees()}`);
});

document.getElementById('btn-filter-speaker').addEventListener('click', () => {
  showOutput(filterByRole('Speaker'));
});

document.getElementById('btn-most-sessions').addEventListener('click', () => {
  const best = findMostSessions();
  showOutput(best ? `Most sessions: ${best.name} (${best.sessions})` : 'No attendees');
});

document.getElementById('btn-group-company').addEventListener('click', () => {
  const grouped = groupByCompany();
  const simple = {};
  Object.keys(grouped).forEach(company => {
    simple[company] = grouped[company].map(a => a.name);
  });
  showOutput(simple);
});

document.getElementById('btn-group-company').addEventListener('click', () => {
  const grouped = groupByCompany();

  let html = "<table border='1' cellpadding='6'><tr><th>Company</th><th>Attendees</th></tr>";
  Object.keys(grouped).forEach(company => {
    const names = grouped[company].map(a => a.name).join(", ");
    html += `<tr>
               <td>${company}</td>
               <td>${names}</td>
             </tr>`;
  });
  html += "</table>";

  document.getElementById("output").innerHTML = html;
});


document.getElementById('btn-fetch').addEventListener('click', async () => {
  showOutput('Fetching new attendees...');
  try {
    const added = await fetchNewAttendees();

    let html = `<p><b>Fetched and added new attendees!</b></p>`;
    html += "<table border='1' cellpadding='6'><tr><th>Name</th><th>Company</th><th>Role</th><th>Sessions</th></tr>";
    added.forEach(a => {
      html += `<tr>
                 <td>${a.name}</td>
                 <td>${a.company}</td>
                 <td>${a.role}</td>
                 <td>${a.sessions}</td>
               </tr>`;
    });
    html += "</table>";
    html += `<p><b>Total attendees now:</b> ${attendees.length}</p>`;

    document.getElementById("output").innerHTML = html;

  } catch (err) {
    showOutput('Fetch failed: ' + String(err));
  }
});

