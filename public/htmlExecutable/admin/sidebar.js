const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const logoutToggle = document.getElementById("logout3")
const logout = document.getElementsByClassName("signOut")

if (localStorage.getItem("sidebarState") === "shrink") {
    sidebar.classList.add("shrink");
    logout.classList.add("shrink");
    sidebarToggle.src = "/icons/icon.png";
}else{
    sidebar.classList.remove("shrink");
}
sidebarToggle.addEventListener("click", function () {
    sidebar.classList.toggle("shrink");

    // Change image when sidebar shrinks/expands
    if (sidebar.classList.contains("shrink")) {
        sidebarToggle.src = "/icons/icon.png"; // use your smaller logo/icon

        logoutToggle.src = "/icons/logout3.png"
        logoutToggle.style.width = "12px"


        localStorage.setItem("sidebarState", "shrink");
    } else {
        sidebarToggle.src = "/logos/logo.png"; // revert back to normal logo

        logoutToggle.src = "/icons/Frame 9.png"
        logoutToggle.style.removeProperty('width')

        localStorage.setItem("sidebarState", "expand");
    }
});