const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const items = itemList.querySelectorAll('li');
const itemFilter = document.getElementById('filter');
let isEditMode = false;
const formBtn = itemForm.querySelector('button');



function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));

}


function onAddItemSubmit(e) {
    e.preventDefault();

    const new_item = itemInput.value;

    //Validate The input entered
    if (new_item === '') {
        alert('Please add an item');
        return;
    }

    //check for if its in editmode
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.active');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('active');
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if (checkIfItemExists(new_item)) {
            alert('That item already exists!');
            return;
        }
    }

    addItemToDOM(new_item); //fucntion to add items to DOM
    addItemToStorage(new_item);


    checkUI();

    itemInput.value = '';


}

function addItemToDOM(item) {
    //create the list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));


    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    itemList.appendChild(li);
}

function addItemToStorage(item) {
    //cehck if pre-existing items in storage
    const itemFromStorage = getItemsFromStorage();

    //push new itsms in to itemfromstorage array
    itemFromStorage.push(item);

    //convert to JSON string and then set it into localstorage
    localStorage.setItem('items', JSON.stringify(itemFromStorage));


}


function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function getItemsFromStorage() {
    //cehck if pre-existing items in storage
    let itemFromStorage;

    if (localStorage.getItem('items') === null) {
        //set to an empty array 1st;
        itemFromStorage = [];

    } else {
        //add pre-exsiting items in to itemFromStorage array
        itemFromStorage = JSON.parse(localStorage.getItem('items'))
    }

    checkUI();


    return itemFromStorage;

}


function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement); //directly targets the li for that particular entry
    } else {
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
    isEditMode = true;
    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('active'));
    item.classList.toggle('active');
    formBtn.innerHTML = "<i class='fa-solid fa-pen'> </i>  Update Item";
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;


}

function removeItem(item) {

    if (confirm('Are You Sure???')) {
        //remove from dom
        item.remove();

        //remove item from storage
        removeItemFromStorage(item.textContent);



        checkUI();

    }
}


function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    //filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);


    //reset to localstorage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));

    checkUI();


}

function clearItems() {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);

    }

    //clear from local storage
    localStorage.removeItem('items');

    checkUI();
}


function filterItems(e) {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLocaleLowerCase();

        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}


function checkUI() {

    itemInput.value = '';
    const items = itemList.querySelectorAll('li');
    if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';

    } else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }


    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = "#333";

    isEditMode = false;
}



//initialize app


function init() {
    //event listeners
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);


    //when page loads
    checkUI();


}

init();