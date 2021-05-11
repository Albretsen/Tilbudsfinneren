/*=====================================================================================
								    CORDOVA
=======================================================================================*/
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

/*=====================================================================================
								    FIREBASE SETUP
=======================================================================================*/
var firebaseConfig = {
    apiKey: "AIzaSyC9a6_YhqBctHl4Ue6MNb8cfFdpo9ODyPE",
    authDomain: "tilbudsfinneren.firebaseapp.com",
    projectId: "tilbudsfinneren",
    storageBucket: "tilbudsfinneren.appspot.com",
    messagingSenderId: "941719440548",
    appId: "1:941719440548:web:a38463f6674fec88186a31",
    measurementId: "G-8RRGH22B6R"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

/*=====================================================================================
									 Authentication
=======================================================================================*/
/*
We are currently only authenticating using email/password, but will expand to Google and
FaceBook sign in buttons later.
*/
function SignUpEmail() {
    var email = byId('inputSignupEmail').value;
    var password = byId('inputSignupPassword').value;
    var passwordConfirm = byId('inputSignupPasswordConfirm').value;
    if(password != passwordConfirm) {
        popup('Passordene er ikke like.');
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            console.log("USER: " + user);
            AddUserToDatabase(user.uid, email);
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            popup(errorMessage);
            // ..
        });
}

function SignInEmail() {
    loading(true, 'loginLoader');
    var email = byId('inputEmail').value;
    var password = byId('inputPassword').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            loading(false, 'loginLoader');
            var user = userCredential.user;
            switchMenu('listMenu');
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            popup(errorMessage);
        });
}

function ResetPassword(emailAddress) {
    firebase.auth().sendPasswordResetEmail(emailAddress).then(function () {
        // Email sent.
    }).catch(function (_error) {
        // An error happened.
    });
}

function GetCurrentUser() {
    return firebase.auth().currentUser;
}

// DO NOT REMOVE!!!!!!!!!!!!!!!!!
/*var provider = new firebase.auth.GoogleAuthProvider();

function SignInGoogle() {
    firebase.auth().signInWithPopup(provider).then(function (userCredential) {
        // code which runs on success
        console.log("SUCCESS")
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        console.log(errorCode);
        alert(errorCode);

        var errorMessage = error.message;
        console.log(errorMessage);
        alert(errorMessage);
    });
}*/

/*

db.collection("week15").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {

        createListItem(doc.data().name, doc.data().image, doc.data().before_price, doc.data().sale_price, doc.data().combined_price, doc.data().item_count, doc.data().description);
        
        if(doc.data().item_count != "") { console.log(doc.data().combined_price, doc.data().sale_price) }
        //console.log("DATA: " + doc.data().combined_price, doc.data().item_count);
    });
});*/

/*=====================================================================================
									 DATABASE
=======================================================================================*/
const db_base_url_with_http = "http://18.224.108.235"

function AddUserToDatabase(id, email) {
    const Http = new XMLHttpRequest();
    const url = db_base_url_with_http + '/adduser/' + id + '/' + email;
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (_e) => {
        console.log(Http.responseText)
    }
}

// Sort names:
// best_deal
// alphabetically

var fullyLoaded = false;
var page_ = 1;
var sort = "none";
var query = "";
var shop = "spar";
var Http = new XMLHttpRequest();
function GetDiscountsFromDB() {
    if(!fullyLoaded) {
        loading(true, 'listLoader');
        loadMoreReady = false;
        var page = page_ + "";

        if(query == '') {
            query = 'GzMsXN9CuJp3pRSXubvfX';
        }

        Http.abort();
        Http = new XMLHttpRequest();
        const url = `${db_base_url_with_http}/db/${allOrDiscount}/${sort}/${query}/${shop}/${page}`;
        Http.open("GET", url);
        Http.send();
        Http.onreadystatechange = (_e) => {
            loading(false, 'listLoader');
            loadMoreReady = true;
            if (Http.readyState == 4 && Http.status == 200) {
                var data = JSON.parse(Http.responseText);
                if(data.length == 0) { fullyLoaded = true; }
                getAllDiscounts(Http.responseText);
                page_++;
            }
        }
    }
}


function loading(bool, which) {
    if(bool) {
        display(which);
    }else {
        hide(which);
    }
}

function GetFavoritesFromDB(id) {
    loading(true, 'favoritesLoader');
    const Http = new XMLHttpRequest();
    const url = db_base_url_with_http + '/getfavorites/' + id;
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = (_e) => {
        loading(false, 'favoritesLoader');
        if (Http.readyState == 4 && Http.status == 200) {
            getAllFavorites(Http.responseText)
            console.log(Http.responseText);
        }
    }
}

function AddFavoriteToDB(id, ean) {
    const Http = new XMLHttpRequest();
    const url = db_base_url_with_http + '/addfavorite/'+ id + '/' + ean;
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = (_e) => {
        if (Http.readyState == 4 && Http.status == 200) {
            console.log(Http.responseText);
        }
    }
}

function RemoveFavoriteFromDB(id, ean) {
    const Http = new XMLHttpRequest();
    const url = db_base_url_with_http + '/removefavorite/'+ id + '/' + ean;
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = (_e) => {
        if (Http.readyState == 4 && Http.status == 200) {
            console.log(Http.responseText);
        }
    }
}

function SearchAllItems(query) {
    if(query == '') {
        query = 'GzMsXN9CuJp3pRSXubvfX';
    }
    const Http = new XMLHttpRequest();
    const url = db_base_url_with_http + '/search/' + query;
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (_e) => {
        if (Http.readyState == 4 && Http.status == 200) {
            // jsonResult is all the returned objects
            var jsonResult = JSON.parse(Http.responseText);
        }
    }
}

function GetItemUsingGTINFromDB(_gtin) {
    
}

/*=====================================================================================
									    UI
=======================================================================================*/
const byId = function(id) { // Shorthand
	return document.getElementById(id);
}

// Shorthands for style
function display(id) {
    byId(id).style.display = 'block';
}

function hide(id) {
    byId(id).style.display = 'none';
}

function style_height(id, value) {
    byId(id).style.height = value;
}

function style_width(id, value) {
    byId(id).style.width = value;
}

function style_transform(id, value) {
    byId(id).style.transform = value;
}

function style_top(id, value) {
    byId(id).style.top = value;
}

function style_boxShadow(id, value) {
    byId(id).style.boxShadow = value;
}

function style_zIndex(id, value) {
    byId(id).style.zIndex = value;
}

function style_left(id, value) {
    byId(id).style.left = value;
}



function clearList(id) {
    byId(id).innerHTML = '';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var filterOpen = false;
async function openFilter() { // Opens or closes filter dropdown
    if(!filterOpen) {
        style_top('filterMenu', '26vw');
        document.getElementsByTagName("BODY")[0].style.overflow = 'hidden'; // Disables scrolling while open
        filterOpen = true;

        await sleep(200);
        style_boxShadow('filterMenu', '0 0 0 99999vw rgba(0, 0, 0, .5)');
        style_zIndex('filterMenu', 3);
    } else {
        style_zIndex('filterMenu', 1);
        style_top('filterMenu', '-38vw');
        style_boxShadow('filterMenu', '0 0 0 99999vw rgba(0, 0, 0, 0)');

        document.getElementsByTagName("BODY")[0].style.overflow = 'visible';
        filterOpen = false;

        // Close the dropdowns
        style_height('storeChoose', '6vw');
        style_transform('storeDropDown', 'rotate(0deg)');
        style_height('sortBy', '6vw'); 
        style_transform('sortDropDown', 'rotate(0deg)');
        sortByOpen = false;
    }
}

var chosenStores = ['spar'];
var storeChooseOpen = false;
function openStoreChoose() { // Opens or closes store dropdown
    if(!storeChooseOpen) {
        style_height('storeChoose', '78vw');
        style_transform('storeDropDown', 'rotate(-180deg)');
        storeChooseOpen = true;
    } else {
        style_height('storeChoose', '6vw');
        style_transform('storeDropDown', 'rotate(0deg)');
        storeChooseOpen = false;
    }
}

var allOrDiscount = 'discounts';
function onlyShowDiscounts() {
    if(allOrDiscount == 'all') {
        allOrDiscount = 'discounts';
        byId('onlyDiscountsCheck').checked = true;

        byId('displayedFilter').innerHTML = 'ALLE TILBUD';
        byId('displayedFilterIcon').innerHTML = 'shopping_bag';
        byId('displayedFilterDropdown').innerHTML = 'ALLE VARER';
        byId('displayedFilterDropdownIcon').innerHTML = 'shopping_cart';
    }
    else if(allOrDiscount == 'discounts') {
        allOrDiscount = 'all';
        byId('onlyDiscountsCheck').checked = false;

        byId('displayedFilter').innerHTML = 'ALLE VARER';
        byId('displayedFilterIcon').innerHTML = 'shopping_cart';
        byId('displayedFilterDropdown').innerHTML = 'ALLE TILBUD';
        byId('displayedFilterDropdownIcon').innerHTML = 'shopping_bag';
    }
    page_ = 1;
    clearList('listAnchor');
    fullyLoaded = false;
    GetDiscountsFromDB();
    save();
}

var filterBarExpanded = false;
function filterBarDrop() {
    if(!filterBarExpanded) {
        style_zIndex('filterBar', 3);
        style_height('filterBar', '19vw');
        style_boxShadow('filterBar', '0 0 0 99999vw rgba(0, 0, 0, .5)');
        style_transform('filterBarDropdownIcon', 'rotate(-180deg)');
        filterBarExpanded = true;
    } else {
        filterBarOnlyShowDiscounts(true);
    }
}

function filterBarOnlyShowDiscounts(close) {
    style_zIndex('filterBar', 1);
    style_height('filterBar', '6vw');
    style_boxShadow('filterBar', '0 0 0 99999vw rgba(0, 0, 0, 0)');
    style_transform('filterBarDropdownIcon', 'rotate(0deg)');

    filterBarExpanded = false;

    if(!close) {
        onlyShowDiscounts();
    }
}


var sortByOpen = false;
function openSortBy() { // Opens or closes sort by dropdown
    if(!sortByOpen) {
        style_height('sortBy', '40vw');
        style_transform('sortDropDown', 'rotate(-180deg)');
        sortByOpen = true;
    } else {
        style_height('sortBy', '6vw');
        style_transform('sortDropDown', 'rotate(0deg)');
        sortByOpen = false;
    }
}

function chooseSort(which) {
    byId('onlyDiscountsCheck').checked = true;
    sort = which;
    if(menuOpen == 'listMenu') {
        page_ = 1;
        clearList('listAnchor');
        GetDiscountsFromDB();
    }
    if(menuOpen == 'favoritesMenu') {
        clearList('favoritesAnchor');
        createFavoritesList();
    }
}

var navOpen = false;
function openCloseNav(close) {
    if(!navOpen && !close) {
        byId("sidenav").style.left = "24vw";
        byId('sidenav').style.boxShadow = '0 0 0 99999vw rgba(0, 0, 0, .5)'; // Shadow on everything but the menu
        navOpen = true;
    } else {
        byId("sidenav").style.left = "102vw"; // Moves the nav menu off screen
        byId('sidenav').style.boxShadow = '0 0 0 99999vw rgba(0, 0, 0, 0)';
        navOpen = false;
    }
}


function outsideClick(event, notelem) {
    var clickedOut = true, i, len = notelem.length;
    for (i = 0;i < len;i++)  {
        if (event.target == notelem[i] || notelem[i].contains(event.target)) {
            clickedOut = false;
        }
    }
    if (clickedOut) return true;
    else return false;
}

// Close side menu if clicked outside it, using function above
var navMenu = [byId('sidenav'), byId('hamburger')];
var filterMenu = [byId('filterMenu'), byId('filterIcon')];
var filterBar = [byId('filterBar')];
window.addEventListener('click', function(e) {
    if(outsideClick(e, navMenu)) {
   	    openCloseNav(true);
    }
    if(outsideClick(e, filterMenu)) {
        filterOpen = true;
        openFilter();
    }
    if(outsideClick(e, filterBar)) {
        filterBarOnlyShowDiscounts(true);
    }
});

async function popup(text) {
    byId("popup").innerHTML = text + '<br /><ins class="smallText">Trykk for å fjerne</ins>';
    byId("popup").style.height = (12 + (text.length/7)) + "vw"; // Popup height is determiend by text length
    var time = 1000 + text.length * 100; // Popup duration is determiend by text length
    await sleep(time);
    hidePopup();
}

function hidePopup() { // Separate function because it can be called from more than one place
    byId("popup").style.height = "0";
}

var menuOpen = 'loginMenu';
function switchMenu(menuId) {
    var menus = document.getElementsByClassName("menu");
    for(var i = 0; i < menus.length; i++) {
        menus[i].style.display = 'none';
    }
    display(menuId);

    openCloseNav(true);

    clearList('favoritesAnchor');
    clearList('listAnchor');

    hide('searchBarContainer');
    hide('filterMenu');
    hide('filterBar');

    byId('navList').style.backgroundColor = "white";
    byId('navFavorites').style.backgroundColor = "white";
    byId('navSettings').style.backgroundColor = "white";
    byId('navContact').backgroundColor = "white";
    if(menuId == 'listMenu') {
        byId('pageHeader').innerHTML = 'Alle varer'
        byId('navList').style.backgroundColor = "#FFEBEC";
        display('searchBarContainer');
        display('filterMenu');
        display('filterBar');
        byId('searchBar').placeholder = 'Varenavn...'

        menuOpen = 'listMenu';
        page_ = 1;
        GetDiscountsFromDB();
    }
    if(menuId == 'favoritesMenu') {
        byId('pageHeader').innerHTML = 'Favoritter'
        byId('navFavorites').style.backgroundColor = "#FFEBEC";
        display('searchBarContainer');
        display('filterMenu');
        display('filterBar');
        byId('searchBar').placeholder = 'Søk blandt dine favoritter...'
        menuOpen = 'favoritesMenu';

        createFavoritesList();
    }
    if(menuId == 'settingsMenu'){
        byId('pageHeader').innerHTML = 'Favoritter';
        byId('navFavorites').style.backgroundColor = "#FFEBEC";
    }

    if(menuId != 'signupMenu') { // Hide or show top bar
        document.body.className = 'noBackground';
        display('topBar');
        if(menuId == 'loginMenu'){
            document.body.className = 'loginBackground';
            hide('topBar');
        }
    }
}

function darkMode() {
    document.getElementsByTagName('BODY')[0].style.backgroundColor = '#121212';
}


/*
This function takes in a list of favorites and returns them sorted.
query - search term
store - which store (e.g "spar")
sort - the order of the products (e.g "none", "best_deal", "alphabetically")
*/
function sortProducts(favorites, query, sort, store) {
    if (query == "" || query == undefined) {
        query == "";
    }
    let result = []

    favorites.forEach(product => {
        let allowQuery = false;
        let allowStore = false;
        let name = product.name;
        name = name.split(/,| /);
        for (let i = 0; i < name.length; i++) {
            if (searchCustomizedEpicness(query, name[i])) {
                allowQuery = true;
                break;
            }
        }
        if (query == "") { allowStore = true; }
        allowStore = product.store == store;
        if (allowQuery) {
            result.push(product);
        }
        /*if (searchCustomizedEpicness(query, product.name)) {
            result.push(product);
        }*/
    });

    result.sort(function(a, b) {
        return a[1] - b[1];
    });

    switch (sort) {
        case "best_deal":
            result.sort(function(a, b) {
                if (a.saved_amount == null) { a.saved_amount = 0; }
                if (b.saved_amount == null) { b.saved_amount = 0; }
                return b.saved_amount - a.saved_amount;
            });
            break;
        case "alphabetically":
            break;
    }

    return result;
}

function searchCustomizedEpicness(query, s) {
    query = query.toString().toLowerCase();
    s = s.toString().toLowerCase();
    let matchesStart = true; 
    for (let i = 0; i < query.length; i++) {
        if (query[i] != s[i]) {
            matchesStart = false;
            break;
        }
    }

    /*if (!matchesStart) {
        let index = s.search(query);
        if ((s[index-1] == " " || s[index-1] == "-") && (s[query.length + index] == " " || s[query.length + index] == "-" || s[query.length + index] == undefined)) {
            matchesStart = true;
        }
    }*/
    return matchesStart;
}

// Only search after no changes for X seconds

// Delete list items when changes have been detected


// Temporary, to get menu on load for quality of life
//switchMenu('listMenu');
//switchMenu('favoritesMenu');
switchMenu('loginMenu');
//GetFavoritesFromDB('123');

/*=====================================================================================
									 DISCOUNT LIST
=======================================================================================*/
var loadMoreReady = true;
window.onscroll = function() { // Automatically loads discounts when at bottom of page
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
        if(loadMoreReady && menuOpen == 'listMenu') {
            GetDiscountsFromDB();
            // setTimeout(loadMoreWait, 1000);
            // loadMoreReady = false;
        }
    }
}

// function loadMoreWait() { // Prevents several executions while loading new items
//     loadMoreReady = true;
// }

var searchExtended = false;
function search() {
    page_ = 1;
    query = byId('searchBar').value;
    console.log(query)

    if (menuOpen == "listMenu") {
        clearList('listAnchor'); // Clears the list
        GetDiscountsFromDB();
    } else {
        clearList('favoritesAnchor'); // Clears the list
        createFavoritesList();
    }
}

function getAllDiscounts(data) {
    var discounts = JSON.parse(data);

    var newDiscounts = [];
    for(var i = 0; i < discounts.length; i++) {
        for(var ii = 0; ii < discounts[i].prices.length; ii++) {
            var obj = discounts[i];
            try{
                obj.sale = discounts[i].discounts[ii].sale;
                obj.sale_text = discounts[i].discounts[ii].sale_text;
            }
            catch{}
            obj.price = discounts[i].prices[ii].price;
            obj.price_text = discounts[i].prices[ii].price_text;
            obj.store = discounts[i].prices[ii].store;
            obj.location = 'listMenu';
            newDiscounts.push(obj);
        }
    }

    newDiscounts = sortProducts(newDiscounts, '', sort, '')

    for(var i = 0; i < newDiscounts.length; i++) {
        createListItem(newDiscounts[i],'listAnchor')
    }
    
}

function createFavoritesList() {
    clearList('favoritesAnchor'); // Clears the list
    let favoritesObjectsCopy = favoritesObjects;
    favoritesObjectsCopy = sortProducts(favoritesObjects, byId('searchBar').value, sort, chosenStores[0]);
    
    for(var i = 0; i < favoritesObjectsCopy.length; i++) {
        createListItem(favoritesObjectsCopy[i], 'favoritesAnchor')
    }
}

var favoritesObjects = [];
var favorites = [];
function addFavorite(ean) {
    var remove = false;
    for(var i = 0; i < favorites.length; i++) { // Remove
        if(favorites[i] == ean) {
            favorites.splice(i, 1); // Removes the ean from favorites
            favoritesObjects.splice(i, 1); // Removes the saved product from the locally saved array

            for(var i = 0; i < productsInList.length; i++) {
                if(productsInList[i].ean == ean) {
                    byId(ean).innerHTML = 'star_border'; // Changes appearance of star
                }
            }
            remove = true;
        }
    }

    if(!remove) { // Add 
        favorites[favorites.length] = ean; // Adds the ean to favorites
        byId(ean).innerHTML = 'star';

        for(var i = 0; i < productsInList.length; i++) {
            if(productsInList[i].ean == ean) {
                favoritesObjects[favoritesObjects.length] = productsInList[i];
            }
        }

        AddFavoriteToDB('123', ean);
    }

    save(); // Saves locally
}

var productsInList = [];
var madeEans = [];
var itemsMade = 0;
function createListItem(product, location) {

    var name = product.name;
    var image = product.image;
    var sale = product.sale;
    var sale_text = product.sale_text;
    var price = product.price;
    var price_text = product.price_text;
    var store = product.store;
    var description = product.description;
    var ean = product.ean;

    var alreadyMade = false;
    for(var i = 0; i < madeEans.length; i++) {
        if(madeEans[i] == ean) {
            alreadyMade = true;
        }
    }
    
    if(!alreadyMade) {
        madeEans[itemsMade] = ean;
        productsInList[itemsMade] = product;
        itemsMade++;
    }

    if(sale_text != undefined && sale_text.length > 15) {
        return;
    }

    var star = 'star_border';
    for(var i = 0; i < favorites.length; i++) {
        if(favorites[i] == ean) {
            star = 'star';
        }
    }
    

    var fontSize = 7;
    if(name.length > 8) { // Scales text size based on length
        fontSize = 7;
    }
    if(name.length > 10) {
        fontSize = 6;
    }
    if(name.length > 12) {
        fontSize = 5;
    }
    if(name.length > 16) {
        fontSize = 4;
    }

    if(description.length > 20) { // Don't display description if too long
        description = ''; // Would ideally be replaced by something better
    }

    var displaySale = '';
    if(sale == undefined) { // Hides sale price in favorites menu
        displaySale = 'style="display:none;"'
    }
    var str = document.createElement('DIV');
    str.setAttribute("class", "listItem");
    str.innerHTML =`
    <img class="listImage" src="${image}"/>
    <i class="material-icons favoriteIcon" id="${ean}" onclick="addFavorite(${ean})">${star}</i>
    <ins class="listName" id="1-name" style="font-size:${fontSize}vw">${name}</ins>
    <br />
    <ins class="listDesc">${description}</ins>
    <br />
    <img class="listStoreLogo" src="img/spar.png" />
    <ins class="listNewPrice" id="1-newPrice" ${displaySale}>${sale_text}</ins>
    <ins class="listBeforePrice" id="1-beforePrice">${price_text}</ins>`

    byId(location).append(str);
}

/*=====================================================================================
									 SAVING
=======================================================================================*/
var storage = window.localStorage;

function save() {
    // Favorites
    storage.setItem('favorites_save', JSON.stringify(favorites));
    storage.setItem('favoritesObjects_save', JSON.stringify(favoritesObjects));

    // Filter variables
    storage.setItem('allOrDiscount_save', JSON.stringify(allOrDiscount));
}

function clearStorage() {
    storage.clear();
    location.reload();
}

function load() { // Assigns all saved variables
    if(storage.length != 0) { // If storage empty, don't run. Prevents the function on the first load
        favorites = JSON.parse(storage.getItem('favorites_save'));
        favoritesObjects = JSON.parse(storage.getItem('favoritesObjects_save'));

        allOrDiscount = JSON.parse(storage.getItem('allOrDiscount_save'));
        if(allOrDiscount == 'discounts') {
            byId('onlyDiscountsCheck').checked = true;

            byId('displayedFilter').innerHTML = 'ALLE TILBUD';
            byId('displayedFilterIcon').innerHTML = 'shopping_bag';
            byId('displayedFilterDropdown').innerHTML = 'ALLE VARER';
            byId('displayedFilterDropdownIcon').innerHTML = 'shopping_cart';
        } else {
            byId('onlyDiscountsCheck').checked = false;

            byId('displayedFilter').innerHTML = 'ALLE VARER';
            byId('displayedFilterIcon').innerHTML = 'shopping_cart';
            byId('displayedFilterDropdown').innerHTML = 'ALLE TILBUD';
            byId('displayedFilterDropdownIcon').innerHTML = 'shopping_bag';
        }

        switchMenu('listMenu'); // Skips the login menu if not first time using app
        //GetDiscountsFromDB(); // Loads list
    } else {
        byId('onlyDiscountsCheck').checked = true;
    }
}