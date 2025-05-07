//vaida hosti alla olevaksi localhostiksi jos pyörität serveriä paikallisesti
//const host = "http://localhost:3000"
const host = window.location.origin;

let itemsList = null;
//hakee listan kaikista mahdollisita haettavista itemeistä itemsearch.json tiedostosta
async function getItemsList() {
    if (!itemsList) {
        try {

            const response = await fetch("item-search.json");
            if (!response.ok) {
                throw new Error("ei toiminu");
            }
            itemsList = await response.json();

        } catch (error) {
            console.error(error);
        }
    }
    return itemsList;
}

//etsii itemin ID:n käyttäen käyttäjän antamaa itemin nimeä
async function idForName(itemName) {
    const itemList = await getItemsList();
    const itemSearchKey = itemName.toLowerCase();
    //const result = itemList.find(item => item.name.toLowerCase() === itemSearchKey);
    for (itemKey in itemList) {
        if (itemList[itemKey].name.toLowerCase() === itemSearchKey) {
            return itemList[itemKey].id;
        }

    }
    return null;
}

//hakee itemin tiedot runescapen APIsta käyttä idForName funktiosta haettua ID:tä
async function fetchItem(event) {
    event.preventDefault();
    const itemName = document.getElementById("itemSearchBox").value;
    const itemId = await idForName(itemName);
    let itemData = {};

    try {
        clearItem();
        // const response = await fetch(`${host}/item/${itemId}`);
        const response = await fetch(
          `https://osrsmultitools-api-backend.onrender.com/item/${itemId}`
        );
        if (response.ok) {
            itemData = await response.json();

            showItem(itemData.item);
            addToSearchHistory(itemName);
            displaySearchHistory();

        }
        else {
          showItemNotFound(itemName);

          

        }
    } catch (error) {
        console.error(error);
    }



    console.log(itemData);


}

//tyhjentää itemdatan
function clearItem() {
    const itemDiv = document.getElementById("itemData");
    itemDiv.innerHTML = "";
}

//näyttää haetun itemin tiedot
function showItem(item) {
    clearItem();
    const itemDiv = document.getElementById("itemData");

    const img = document.createElement('img');
    const priceDiv = document.createElement('div');
    const priceCurrent = document.createElement('p');
    const price30Day = document.createElement('p');
    const price90Day = document.createElement('p');
    const price180Day = document.createElement('p');
    const itemName = document.createElement('div');
    itemName.className = "item-icon-box";

    img.src = item.icon;
    img.alt = item.description;
    priceCurrent.innerHTML = `<b>Current price:</b> ${item.current.price}`;

    itemName.append(img);
    itemName.append(item.name);

    itemDiv.append(itemName);
    itemDiv.append(priceCurrent);


    price30Day.innerHTML = `<b>30 day price change:</b> ${item.day30.change}`;
    price90Day.innerHTML = `<b>90 day price change:</b> ${item.day90.change}`;
    price180Day.innerHTML = `<b>180 day price change:</b> ${item.day180.change}`;

    itemDiv.append(price30Day);
    itemDiv.append(price90Day);
    itemDiv.append(price180Day);
}

//antaa virheviestin jos itemiä ei löydy
function showItemNotFound(item) {
    clearItem();
    const itemDiv = document.getElementById("itemData");

    const itemName = document.createElement('div');
    itemName.className = "item-not-found";

    itemName.append(`Item "${item}" not found`);

    itemDiv.append(itemName);

}

//luo eventlistenerin seuraamaan käyttäjän kirjoittamista
const itemSearchBoxEl = document.getElementById("itemSearchBox");
itemSearchBoxEl.addEventListener("input", itemSearchBoxChanged);

//muuttaa autofillin suosittelemiä itemeitä kun käyttäjä kirjoittaa
function itemSearchBoxChanged(e) {
    const searchText = e.target.value;
    fillAutocompleteList(searchText);
}

//sulkee autofill valikon kun item on valittu ja lisää valitun itemin tekstikenttään
function itemClicked(e) {
    e.preventDefault();
    itemSearchBoxEl.value = e.target.textContent;
    console.log(e.target.textContent);

    const itemsListEl = document.getElementById("itemsList");
    itemsListEl.innerHTML = "";

}

//funktio näyttää hakuedotuksia käyttäjälle
async function fillAutocompleteList(searchText) {
    const itemsListEl = document.getElementById("itemsList");
    itemsListEl.innerHTML = "";

    itemsList = await getItemsList();

    let shownItemsCount = 0;
    for (itemKey in itemsList) {

        if (itemsList[itemKey].name.toLowerCase().startsWith(searchText)) {
            const liEl = document.createElement("li");
            const buttonEl = document.createElement("button");
            buttonEl.innerHTML = itemsList[itemKey].name;
            buttonEl.addEventListener("click", itemClicked);
            console.log(itemsList[itemKey].name);
            liEl.appendChild(buttonEl);
            itemsListEl.appendChild(liEl);
            shownItemsCount++;
        }
        if (shownItemsCount >= 10) {
            break;
        }
    }

}

//näyttää hakuhistorian
function displaySearchHistory() {
    const searchHistoryContainer = document.getElementById("searchHistory");
    searchHistoryContainer.innerHTML = "";

    const searches = JSON.parse(localStorage.getItem("itemSearchHistory")) || [];
    searches.forEach((search) => {
        const p = document.createElement("p");
        p.textContent = search;
        p.addEventListener("click", () => {
            document.getElementById("itemSearchBox").value = search;
        });
        searchHistoryContainer.appendChild(p);
    });
}

//lisää haetun itemin hakuhistoriaan
function addToSearchHistory(input) {
    if (input === null || input.trim() === "") {
        return;
    }
    let searches = JSON.parse(localStorage.getItem("itemSearchHistory")) || [];
    if (!searches.includes(input)) {
        searches.unshift(input);
        searches = searches.slice(0, 5);
        localStorage.setItem("itemSearchHistory", JSON.stringify(searches));
    }
}

document.getElementById("togglehistorybutton").addEventListener("click", () => {
    const searchHistoryContainer = document.getElementById("searchHistory");
    searchHistoryContainer.style.display =
        searchHistoryContainer.style.display === "none" ? "block" : "none";
});

