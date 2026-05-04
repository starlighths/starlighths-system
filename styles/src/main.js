
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
                <h1 style="color: var(--primary)">🌟 STARLIGHT</h1>
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
    document.getElementById('root').innerHTML = `
        <div class="dashboard-layout">
            <aside class="sidebar">
                <h2>Starlight High</h2>
                <hr style="opacity:0.2">
                <p>📅 Week 1 (Active)</p>
                <nav style="display:flex; flex-direction:column; gap:10px; margin-top:20px;">
                    <a href="#" style="color:white; text-decoration:none;">Dashboard</a>
                    <a href="#" style="color:white; text-decoration:none;">Timetable</a>
                    <a href="#" style="color:white; text-decoration:none;">ECA Applications</a>
                </nav>
            </aside>
            <main class="main-view">
                <header>
                    <h1>Welcome, ${u.fullName}</h1>
                    <p>${u.role} | Class ${u.classId}</p>
                </header>
                <div class="grid-stats">
                    <div class="widget"><h4>On-Time Rate</h4><h2>${u.onTimeRate}%</h2></div>
                    <div class="widget"><h4>English (Unified)</h4><h2>A-</h2></div>
                    <div class="widget"><h4>Next Class</h4><p>13:00 - Makeup & Beauty</p></div>
                </div>
            </main>
        </div>
    `;
}

// Mock Login Function for Testing
window.handleLogin = () => {
    state.isLoggedIn = true;
    state.user = { fullName: "Lee Hana", role: "STUDENT", classId: "1A", onTimeRate: 98 };
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
