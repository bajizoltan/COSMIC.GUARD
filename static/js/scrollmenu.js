/*
document.addEventListener("DOMContentLoaded", function() {
    const menuContent = document.getElementById("menu-content");

    // 20 példa gomb hozzáadása a menühöz
    for (let i = 1; i <= 20; i++) {
        const button = document.createElement("button");
        button.className = "menu-button";
        button.textContent = `Gomb ${i}`;
        button.addEventListener("click", function() {
            showContent(`<h2>Gomb ${i} tartalma</h2><p>Ez egy hosszú szöveg részletes tartalommal a ${i}. gombhoz. <strong>HTML formázással</strong> is megadhatod, <em>például félkövérrel, dőlt betűkkel</em>, vagy akár <a href="#">hivatkozásokkal</a>.</p>`);
        });
        menuContent.appendChild(button);
    }

    // Bezárja a menüt, ha máshova kattintunk
    document.addEventListener("click", function(event) {
        const sidebar = document.getElementById("sidebar");
        const toggleButton = document.getElementById("toggleButton");
        
        // Ellenőrzi, hogy nem a menüre vagy a gombra kattintottunk
        if (!sidebar.contains(event.target) && event.target !== toggleButton) {
            closeSidebar();
        }
    });    
});
*/

document.addEventListener("DOMContentLoaded", function() {
    const menuContent = document.getElementById("menu-content");

    // Beolvassuk a gombok JSON adatait
    fetch('content/buttons.json')
        .then(response => response.json())
        .then(buttons => {
            // Gombok létrehozása a JSON adatok alapján
            buttons.forEach((buttonData, index) => {
                const button = document.createElement("button");
                button.className = buttonData.class;
                button.style.backgroundImage = `url(${buttonData.texture})`; // Textúra
                button.setAttribute("onclick", buttonData.clickAction);             
                // Hozzáadjuk a bolygó nevét tartalmazó elemet

                const label = document.createElement("span");
                label.className = "button-label";
                label.textContent = buttonData.name;

                button.appendChild(label);          

                // Gomb esemény kezelő a tartalom betöltésére
                button.addEventListener("click", function() {
                    loadContent(buttonData.contentFile);
                });
                menuContent.appendChild(button);
            });
        })
        .catch(error => console.error('Error loading buttons:', error));

    // Bezárja a menüt, ha máshova kattintunk
    document.addEventListener("click", function(event) {
        const sidebar = document.getElementById("sidebar");
        const toggleButton = document.getElementById("toggleButton");
        
        // Ellenőrzi, hogy nem a menüre vagy a gombra kattintottunk
        if (!sidebar.contains(event.target) && event.target !== toggleButton) {
            closeSidebar();
        }
    });           
});

function loadContent(contentFile) {
    const contentDisplay = document.getElementById("contentDisplay");

    // Töröljük a korábbi tartalmat
    contentDisplay.innerHTML = '<button class="close-button" onclick="closeContent()">✖</button>';

    // A HTML tartalom beolvasása a megadott fájlból
    fetch(contentFile)
        .then(response => response.text())
        .then(html => {
            contentDisplay.innerHTML += html; // Új tartalom hozzáadása a bezáró gomb alá
            contentDisplay.style.display = "block"; // Megjelenítjük a tartalmat
        })
        .catch(error => console.error('Error loading content:', error));
}


function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("toggleButton");

    if (sidebar.classList.contains("open")) {
        closeSidebar();
    } else {
        sidebar.style.left = "0px";
        toggleButton.style.left = "250px";
        sidebar.classList.add("open");
        toggleButton.innerHTML = "‹";
    }
}

function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("toggleButton");

    sidebar.style.left = "-250px";
    toggleButton.style.left = "20px";
    sidebar.classList.remove("open");
    toggleButton.innerHTML = "›";
}

function showContent(text) {
    const contentDisplay = document.getElementById("contentDisplay");
    contentDisplay.innerHTML = text;
    contentDisplay.style.display = "block"; // Tartalom megjelenítése
}


function closeContent() {
    const contentDisplay = document.getElementById("contentDisplay");
    contentDisplay.style.display = "none"; // Elrejtjük a tartalmat
}