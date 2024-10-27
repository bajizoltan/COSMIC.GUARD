function checkOrientation() {
    const orientationAlert = document.getElementById("orientationAlert");
    if (window.innerHeight > window.innerWidth) {
        orientationAlert.classList.remove("d-none");
    } else {
        orientationAlert.classList.add("d-none");
    }
}


window.addEventListener("load", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
window.addEventListener("resize", checkOrientation);
