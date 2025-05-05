
const host = "http://localhost:3000"

let itemsList = null;
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



async function fetchItem() {
    const itemName = document.getElementById("item").value;
    const itemId = await idForName(itemName);
    let itemData = {};

    try {
        const response = await fetch(`${host}/item/${itemId}`);
        if (!response.ok) {
            throw new Error("ei toiminu");
        }
        itemData = await response.json();
        
        showItem(itemData.item);
    } catch (error) {
        console.error(error);
    }


    console.log(itemData);

}
function showItem(item) {
    const itemDiv = document.getElementById("itemData");

    itemDiv.innerHTML = "";

    const img = document.createElement('img');
    const priceDiv = document.createElement('div');
    const priceCurrent = document.createElement('p');

    img.src = item.icon;
    img.alt = item.description;
    // img.classList.add("skill-icon");
    // skillBox.classList.add("skill-box");
    priceCurrent.innerText = `Current price: ${item.current.price}`;
    priceDiv.append(img, priceCurrent);
    itemDiv.append(priceDiv);
}
