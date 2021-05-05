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
    }).catch(function (error) {
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

    Http.onreadystatechange = (e) => {
        console.log(Http.responseText)
    }
}

// Sort names:
// best_deal
// alphabetically

var allOrDiscount = 'discounts';
var page_ = 1;
var sort = "none";
var query = "";
var shop = "spar";
var Http = new XMLHttpRequest();
function GetDiscountsFromDB() {
    loading(true, 'listLoader');
    var page = page_ + "";

    if(query == '') {
        query = 'GzMsXN9CuJp3pRSXubvfX';
    }

    Http.abort();
    Http = new XMLHttpRequest();
    const url = `${db_base_url_with_http}/db/${allOrDiscount}/${sort}/${query}/${shop}/${page}`;
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = (e) => {
        loading(false, 'listLoader');
        if (Http.readyState == 4 && Http.status == 200) {
            getAllDiscounts(Http.responseText);
            page_++;
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
    console.log(url)
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = (e) => {
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
    Http.onreadystatechange = (e) => {
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
    Http.onreadystatechange = (e) => {
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

    Http.onreadystatechange = (e) => {
        if (Http.readyState == 4 && Http.status == 200) {
            // jsonResult is all the returned objects
            var jsonResult = JSON.parse(Http.responseText);
        }
    }
}

function GetItemUsingGTINFromDB(gtin) {
    
}

/*=====================================================================================
									    UI
=======================================================================================*/
const byId = function(id) { // Shorthand
	return document.getElementById(id);
}

function display(id) {
    byId(id).style.display = 'block';
}

function hide(id) {
    byId(id).style.display = 'none';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var filterOpen = false;
async function openFilter() { // Opens or closes filter dropdown
    if(!filterOpen) {
        byId('filterMenu').style.top = '26vw';
        document.getElementsByTagName("BODY")[0].style.overflow = 'hidden'; // Disables scrolling while open
        filterOpen = true;

        await sleep(200);
        byId('filterMenu').style.boxShadow = '0 0 0 99999vw rgba(0, 0, 0, .5)';
        byId('filterMenu').style.zIndex = 3;
    } else {
        byId('filterMenu').style.zIndex = 1;
        byId('filterMenu').style.top = '-38vw';
        byId('filterMenu').style.boxShadow = '0 0 0 99999vw rgba(0, 0, 0, 0)';

        document.getElementsByTagName("BODY")[0].style.overflow = 'visible';
        filterOpen = false;

        // Close the dropdowns
        byId('storeChoose').style.height = '6vw';
        byId('storeDropDown').style.transform = 'rotate(0deg)';
        byId('sortBy').style.height = '6vw'; 
        byId('sortDropDown').style.transform = 'rotate(0deg)';
        sortByOpen = false;
    }
}

var chosenStores = ['spar'];
var storeChooseOpen = false;
function openStoreChoose() { // Opens or closes store dropdown
    if(!storeChooseOpen) {
        byId('storeChoose').style.height = '68vw';
        byId('storeDropDown').style.transform = 'rotate(-180deg)';
        storeChooseOpen = true;
    } else {
        byId('storeChoose').style.height = '6vw';
        byId('storeDropDown').style.transform = 'rotate(0deg)';
        storeChooseOpen = false;
    }
}

var sortByOpen = false;
function openSortBy() { // Opens or closes sort by dropdown
    if(!sortByOpen) {
        byId('sortBy').style.height = '40vw';
        byId('sortDropDown').style.transform = 'rotate(-180deg)';
        sortByOpen = true;
    } else {
        byId('sortBy').style.height = '6vw';
        byId('sortDropDown').style.transform = 'rotate(0deg)';
        sortByOpen = false;
    }
}

function chooseSort(which) {
    sort = which;
    if(menuOpen == 'listMenu') {
        page_ = 1;
        console.log(which);
        byId('listAnchor').innerHTML = '';
        GetDiscountsFromDB();
    }
    if(menuOpen == 'favoritesMenu') {
        byId('favoritesAnchor').innerHTML = '';
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
var filterMenu = [byId('filterMenu'), byId('filterIcon')]
window.addEventListener('click', function(e) {
    if(outsideClick(e, navMenu)) {
   	    openCloseNav(true);
    }
    if(outsideClick(e, filterMenu)) {
        filterOpen = true;
        openFilter();
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

    byId('navList').style.backgroundColor = "white";
    byId('navFavorites').style.backgroundColor = "white";
    if(menuId == 'listMenu') {
        byId('pageHeader').innerHTML = 'Alle varer'
        byId('navList').style.backgroundColor = "#FFEBEC";
        display('searchBarContainer');
        display('filterMenu');
        byId('searchBar').placeholder = 'Varenavn...'

        if(menuOpen == 'loginMenu' || menuOpen == 'signupMenu') {
            GetDiscountsFromDB();
        }
        menuOpen = 'listMenu';
    }
    if(menuId == 'favoritesMenu') {
        byId('pageHeader').innerHTML = 'Favoritter'
        byId('navFavorites').style.backgroundColor = "#FFEBEC";
        display('searchBarContainer');
        display('filterMenu');
        byId('searchBar').placeholder = 'Søk blandt dine favoritter...'
        menuOpen = 'favoritesMenu';

        createFavoritesList();
    }
    if(menuId != 'signupMenu') { // Hide or show top bar
        document.body.className = 'noBackground';
        display('topBar');
        if(menuId == 'loginMenu'){
            document.body.className = 'loginBackground';
            hide('topBar');
            hide('searchBarContainer');
            hide('filterMenu');
        }
    }
}


// Temporary, to get menu on load for quality of life
//switchMenu('listMenu');
//switchMenu('favoritesMenu');
switchMenu('loginMenu');
//GetFavoritesFromDB('123');

/*=====================================================================================
									 DISCOUNT LIST
=======================================================================================*/
var loadMoreReady = true;
window.onscroll = function() { // Automatically loads discounts
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
        if(loadMoreReady && menuOpen == 'listMenu') {
            GetDiscountsFromDB();
            setTimeout(loadMoreWait, 1000);
            loadMoreReady = false;
        }
    }
}

function loadMoreWait() { // Prevents several executions while loading new items
    loadMoreReady = true;
}

var searchExtended = false;
function search() {
    page_ = 1;
    query = byId('searchBar').value;
    console.log(query)

    if (menuOpen == "listMenu") {
        byId('listAnchor').innerHTML = ''; // Clears the list
        GetDiscountsFromDB();
    } else {
        byId('favoritesAnchor').innerHTML = ''; // Clears the list
        createFavoritesList();
    }
}

function getAllDiscounts(data) {
    var discounts = JSON.parse(data);
    let discountsCopy = discounts;
    discountsCopy = sortProducts(discounts, byId('searchBar').value, sort, chosenStores[0]);

    console.log(discounts, sort)
    for(var i = 0; i < discountsCopy.length; i++) {
        createListItem(discountsCopy[i].name, discountsCopy[i].image, discountsCopy[i].price_text, discountsCopy[i].sale_text, discountsCopy[i].description, discountsCopy[i].ean, discountsCopy[i].saved_amount, discountsCopy[i].store,'listAnchor')
    }
    
}

function getAllFavorites(data) {
    var favorites = JSON.parse(data);

    for(var i = 0; i < favorites.length; i++) {
        createListItem(favorites[i].name, favorites[i].image, favorites[i].price_text, favorites[i].sale_text, favorites[i].description, favorites[i].ean, 'favoritesAnchor')
    }
    
}

function createFavoritesList() {
    byId('favoritesAnchor').innerHTML = ''; // Clears the list
    let favoritesObjectsCopy = favoritesObjects;
    favoritesObjectsCopy = sortProducts(favoritesObjects, byId('searchBar').value, sort, chosenStores[0]);
    
    for(var i = 0; i < favoritesObjectsCopy.length; i++) {
        createListItem(favoritesObjectsCopy[i].name, favoritesObjectsCopy[i].image, favoritesObjectsCopy[i].price_text, favoritesObjectsCopy[i].sale_text, favoritesObjectsCopy[i].description, favoritesObjectsCopy[i].ean, favoritesObjectsCopy[i].saved_amount, favoritesObjectsCopy[i].store, 'favoritesAnchor')
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
                if(productsInList[i].ean == ean && productsInList[i].location == 'listMenu') {
                    byId(`${ean}-listMenu`).innerHTML = 'star_border'; // Changes appearance of star
                }
            }
            if(menuOpen == 'favoritesMenu') {
                byId(`${ean}-favoritesMenu`).innerHTML = 'star_border';
            }
            
            remove = true;
        }
    }

    if(!remove) { // Add 
        favorites[favorites.length] = ean; // Adds the ean to favorites
        byId(`${ean}-${menuOpen}`).innerHTML = 'star';
        byId(`${ean}-${menuOpen}`).innerHTML = 'star';

        for(var i = 0; i < productsInList.length; i++) {
            if(productsInList[i].ean == ean) {
                favoritesObjects[favoritesObjects.length] = productsInList[i];
            }
        }
    }

    saveFavorites(); // Saves locally
}

var productsInList = [];
var madeEans = [];
var itemsMade = 0;
function createListItem(name, image, beforePrice, sale, description, ean, saved_amount, store, location) {

    var alreadyMade = false;
    for(var i = 0; i < madeEans.length; i++) {
        if(madeEans[i] == ean) {
            alreadyMade = true;
        }
    }
    
    if(!alreadyMade) {
        var object = { 
            name: name,
            image: image,
            price_text: beforePrice,
            sale_text: sale,
            store: store,
            description: description,
            ean: ean,
            saved_amount: saved_amount,
            location: menuOpen
        }
        madeEans[itemsMade] = ean;
        productsInList[itemsMade] = object;
        itemsMade++;
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
    <i class="material-icons favoriteIcon" id="${ean}-${menuOpen}" onclick="addFavorite(${ean})">${star}</i>
    <ins class="listName" id="1-name" style="font-size:${fontSize}vw">${name}</ins>
    <br />
    <ins class="listDesc">${description}</ins>
    <br />
    <img class="listStoreLogo" src="img/spar.png" />
    <ins class="listNewPrice" id="1-newPrice" ${displaySale}>${sale}</ins>
    <ins class="listBeforePrice" id="1-beforePrice">${beforePrice}</ins>`

    byId(location).append(str);
}

/*=====================================================================================
									 SAVING
=======================================================================================*/
var storage = window.localStorage;

function saveFavorites() {
    storage.setItem('favoritesSave', JSON.stringify(favorites));
    storage.setItem('savedFavoritesObjects', JSON.stringify(favoritesObjects))
}

function clearStorage() {
    storage.clear();
    location.reload();
}

function load() { // Assigns all saved variables
    if(storage.length != 0) { // If storage empty, don't run. Prevents the function on the first load
        favorites = JSON.parse(storage.getItem('favoritesSave'));
        favoritesObjects = JSON.parse(storage.getItem('savedFavoritesObjects'));

        switchMenu('listMenu'); // Skips the login menu if not first time using app
        //GetDiscountsFromDB(); // Loads list
    }
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
        if (allowQuery && allowStore) {
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