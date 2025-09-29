const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const logoutToggle = document.getElementById("logout3");
const logout = document.getElementsByClassName("signOut")[0]; // FIX: get first element

// Check saved state on load
if (localStorage.getItem("sidebarState") === "shrink") {
    sidebar.classList.add("shrink");
    if (logout) logout.classList.add("shrink");
    sidebarToggle.src = "/icons/icon.png";
} else {
    sidebar.classList.remove("shrink");
}

// Toggle manually with button
sidebarToggle.addEventListener("click", function () {
    toggleSidebar();
});

// ✅ Function to handle shrinking logic
function toggleSidebar(forceShrink = null) {
    if (forceShrink === true) {
        sidebar.classList.add("shrink");
    } else if (forceShrink === false) {
        sidebar.classList.remove("shrink");
    } else {
        sidebar.classList.toggle("shrink");
    }

    if (sidebar.classList.contains("shrink")) {
        sidebarToggle.src = "/icons/icon.png"; 
        if (logoutToggle) {
            logoutToggle.src = "/icons/logout3.png";
            logoutToggle.style.width = "12px";
        }
        localStorage.setItem("sidebarState", "shrink");
    } else {
        sidebarToggle.src = "/logos/logo.png"; 
        if (logoutToggle) {
            logoutToggle.src = "/icons/Frame 9.png";
            logoutToggle.style.removeProperty('width');
        }
        localStorage.setItem("sidebarState", "expand");
    }
}

// ✅ Handle screen resizing dynamically
function handleResize() {
    if (window.innerWidth < 992) { 
        // shrink automatically when screen < 992px (bootstrap lg breakpoint)
        toggleSidebar(true);
    } else {
        // restore previous saved state when screen is big
        if (localStorage.getItem("sidebarState") === "shrink") {
            toggleSidebar(true);
        } else {
            toggleSidebar(false);
        }
    }
}

window.addEventListener("resize", handleResize);

// Run once on page load
handleResize();
