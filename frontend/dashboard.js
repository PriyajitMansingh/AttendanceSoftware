const items = document.querySelectorAll(".nav-item");
const sidebar = document.getElementById("sidebar");
const toggle = document.getElementById("toggle");

items.forEach((item) => {
  item.addEventListener("click", () => {
    items.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
  });
});

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});
