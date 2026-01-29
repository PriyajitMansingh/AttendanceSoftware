const items = document.querySelectorAll(".nav-item");
const sidebar = document.getElementById("sidebar");
const toggle = document.getElementById("toggle");
const logoutbtn = document.querySelector(".logout-btn");
const avatar = document.querySelector(".top-avatar");
const profileBox = document.getElementById("profileBox");
const profileName = document.getElementById("profileName");
const profileMobile = document.getElementById("profileMobile");

avatar.addEventListener("click", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("User not found. Please login again.");
    return;
  }

  profileName.textContent = `Name:${user.name}` || "N/A";
  profileMobile.textContent = `Mob:${user.mobile}` || "N/A";

  // toggle show/hide
  profileBox.style.display =
    profileBox.style.display === "block" ? "none" : "block";
});


if (logoutbtn) {
  logoutbtn.addEventListener("click", logout);
}

items.forEach((item) => {
  item.addEventListener("click", () => {
    items.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
  });
});

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}