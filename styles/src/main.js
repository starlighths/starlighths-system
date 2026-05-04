
const state = {
    isLoggedIn: false,
    user: null // Will hold { fullName, role, classId, onTimeRate }
};

function initApp() {
    const root = document.getElementById('root');
    if (!state.isLoggedIn) {
        renderLogin();
    } else {
        renderDashboard();
    }
}

function renderLogin() {
    document.getElementById('root').innerHTML = `
        <div class="auth-container">
            <div class="login-card">
                <h1 style="color: var(--primary)">🌟 STARLIGHT HIGH SCHOOL</h1>
                <p>Please sign in to the 2025-2026 Portal</p>
                <input type="text" id="uid" placeholder="User ID" style="width:100%; padding:10px; margin:10px 0;">
                <input type="password" id="pwd" placeholder="Password" style="width:100%; padding:10px; margin:10px 0;">
                <button onclick="handleLogin()" style="width:100%; padding:12px; background:var(--primary); color:white; border:none; border-radius:5px; cursor:pointer;">Enter System</button>
            </div>
        </div>
    `;
}

function renderDashboard() {
    const u = state.user;
    const root = document.getElementById('root');

    root.innerHTML = `
        <div class="dashboard-layout">
            <aside class="sidebar">
                <h2>🌟 STARLIGHT</h2>
                <nav>
                    <button onclick="showView('home')">🏠 Home</button>
                    
                    ${u.role === 'ADMIN' ? '<button onclick="showView(\'admin\')">🛡️ Admin Panel</button>' : ''}
                    ${u.role === 'TEACHER' ? '<button onclick="showView(\'teacher\')">📋 Class Sync</button>' : ''}
                    ${u.role === 'STUDENT' ? '<button onclick="showView(\'student\')">📚 My ECA</button>' : ''}
                    
                    <button onclick="location.reload()">🚪 Logout</button>
                </nav>
            </aside>
            <main class="main-view">
                <div id="content-area">
                    <h1>Welcome, ${u.fullName}</h1>
                    <p>Current Role: <strong>${u.role}</strong></p>
                    <div class="grid-stats">
                        ${renderRoleWidgets(u)}
                    </div>
                </div>
            </main>
        </div>
    `;
}
function renderRoleWidgets(user) {
    if (user.role === 'ADMIN') {
        return `
            <div class="widget"><h4>Total Students</h4><h2>450</h2></div>
            <div class="widget"><h4>Teacher Sync Status</h4><h2>92%</h2></div>
            <div class="widget"><h4>System Alerts</h4><p>Timetable 2B conflict</p></div>
        `;
    } else if (user.role === 'TEACHER') {
        return `
            <div class="widget"><h4>My S-Class</h4><h2>1A</h2></div>
            <div class="widget"><h4>Next Sync</h4><p>15:45 with Partner</p></div>
            <div class="widget"><h4>Pending Grades</h4><h2>14</h2></div>
        `;
    } else {
        return `
            <div class="widget"><h4>On-Time Rate</h4><h2>${user.onTimeRate}%</h2></div>
            <div class="widget"><h4>English (Unified)</h4><h2>A-</h2></div>
            <div class="widget"><h4>Attendance</h4><p>Perfect Week!</p></div>
        `;
    }
}


window.handleLogin = function(selectedRole) {
    state.isLoggedIn = true;
    
    
    state.user = {
        fullName: selectedRole === 'ADMIN' ? "Director Chen" : (selectedRole === 'TEACHER' ? "Mx. Smith" : "Lee Hana"),
        role: selectedRole, // ADMIN, TEACHER, or STUDENT
        classId: selectedRole === 'STUDENT' ? "1A" : "Staff Room",
        onTimeRate: 98
    };

    console.log("Logged in as:", state.user.role);
    initApp(); 
};



window.onload = initApp;

function initApp() {
    const root = document.getElementById('root');
    root.innerHTML = ''; // This clears the "Loading..." text immediately
    
    if (!state.isLoggedIn) {
        renderLogin();
    } else {
        renderDashboard();
    }
}
