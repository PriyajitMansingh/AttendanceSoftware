document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let mobile = document.getElementById("mobile").value;
  let password = document.getElementById("password").value;

  let storedUser = JSON.parse(localStorage.getItem("userData"));

  if (!storedUser) {
    alert("No user found. Please signup.");
    return;
  }

  if (mobile === storedUser.mobile && password === storedUser.password) {
    alert("Login successful");
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid mobile number or password");
  }
});
