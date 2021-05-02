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
    var email = byId('inputEmail').value;
    var password = byId('inputPassword').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            switchMenu('listMenu');
            console.log('success');
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

var page_ = 1;
var sort = "none";
var query = "";
var shop = "spar";
var isSearching = false;
function GetDiscountsFromDB() {
    loading(true, 'listLoader');
    if(isSearching) {
        return
    }
    isSearching = true;
    var page = page_ + "";

    if(query == '') {
        query = 'GzMsXN9CuJp3pRSXubvfX';
    }
    const Http = new XMLHttpRequest();
    const url = db_base_url_with_http + '/db/all/' + sort + '/' + query + '/' + shop + '/' + page;
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = (e) => {
        loading(false, 'listLoader');
        isSearching = false;
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
									 MISCELLANEOUS
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

// async function tutorialPulsate(elem, type) {
//     console.log(byId(elem).style.fontSize)
//     // byId(elem).style;
// }

var filterOpen = false;
async function openFilter() { // Opens or closes filter dropdown
    if(!filterOpen) {
        byId('filterMenu').style.top = '26vw';
        
        filterOpen = true;

        await sleep(200);
        byId('filterMenu').style.boxShadow = '0 0 0 99999vw rgba(0, 0, 0, .5)';
        byId('filterMenu').style.zIndex = 3;
    } else {
        byId('filterMenu').style.zIndex = 1;
        byId('filterMenu').style.top = '-38vw';
        byId('filterMenu').style.boxShadow = '0 0 0 99999vw rgba(0, 0, 0, 0)';

        byId('storeChoose').style.height = '8vw';
        byId('storeDropDown').style.transform = 'rotate(0deg)';
        filterOpen = false;

    }
}

var storeChooseOpen = false;
function openStoreChoose() { // Opens or closes store dropdown
    if(!filterOpen) {
        byId('storeChoose').style.height = '80vw';
        byId('storeDropDown').style.transform = 'rotate(-180deg)';
        filterOpen = true;
    } else {
        byId('storeChoose').style.height = '8vw';
        byId('storeDropDown').style.transform = 'rotate(0deg)';
        filterOpen = false;
    }
}

var navOpen = false;
function openCloseNav(close) {
    if(!navOpen && !close) {
        byId("sidenav").style.left = "24vw";
        byId('sidenav').style.boxShadow = '0 0 0 99999vw rgba(0, 0, 0, .5)';
        // var menus = document.getElementsByClassName("menu");
        // for(var i = 0; i < menus.length; i++) {
        //     menus[i].style.filter = 'brightness(50%)';
        // }
        navOpen = true;
    } else {
        byId("sidenav").style.left = "100vw";
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
var navMenu = [document.getElementById("sidenav"), document.getElementById("hamburger")];
window.addEventListener('click', function(e) {
   if(outsideClick(e, navMenu)) {
   	    openCloseNav(true);
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

function switchMenu(menuId) {
    var menus = document.getElementsByClassName("menu");
    for(var i = 0; i < menus.length; i++) {
        menus[i].style.display = 'none';
    }
    display(menuId);

    byId('navList').style.backgroundColor = "white";
    byId('navFavorites').style.backgroundColor = "white";
    if(menuId == 'listMenu') {
        byId('pageHeader').innerHTML = 'Alle varer'
        byId('navList').style.backgroundColor = "#FFEBEC";
        display('searchBarContainer');
        byId('searchBar').placeholder = 'Varenavn...'
    }
    if(menuId == 'favoritesMenu') {
        byId('pageHeader').innerHTML = 'Favoritter'
        byId('navFavorites').style.backgroundColor = "#FFEBEC";
        display('searchBarContainer');
        byId('searchBar').placeholder = 'Søk blandt dine favoritter...'
    }

    if(menuId != 'signupMenu') { // Hide or show top bar
        document.body.className = 'noBackground';
        display('topBar');
        display('filterBar');
        if(menuId == 'loginMenu'){
            document.body.className = 'loginBackground';
            hide('topBar');
            hide('searchBarContainer');
            hide('filterBar');
        }
    }
}


// Temporary, to get menu on load for quality of life
switchMenu('listMenu');
//switchMenu('favoritesMenu');
//switchMenu('loginMenu');
GetDiscountsFromDB();
//GetFavoritesFromDB('123');

/*=====================================================================================
									 DISCOUNT LIST
=======================================================================================*/

// REFERENCE
// name: DONE
// before_price: DONE
// sale_price: DONE
// item_count: DONE
// combined_price: DONE
// gtin:
// image: DONE
// description: DONE

var loadMoreReady = true;
window.onscroll = function() { // Automatically loads discounts
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
        if(loadMoreReady) {
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
    // if(!searchExtended) {
    //     searchExtended = true;
    //     byId('searchBar').style.width = '60vw';
    //     //display('searchBar');
    // }

    page_ = 1;
    query = byId('searchBar').value;
    console.log(query)
    byId('listAnchor').innerHTML = ''; // Clears the list
    GetDiscountsFromDB();
}

function getAllDiscounts(data) {
    var discounts = JSON.parse(data);

    for(var i = 0; i < discounts.length; i++) {
        createListItem(discounts[i].name, discounts[i].image, discounts[i].price_text, discounts[i].sale_text, discounts[i].description, discounts[i].ean, 'listAnchor')
    }
    
}

function getAllFavorites(data) {
    var favorites = JSON.parse(data);

    for(var i = 0; i < favorites.length; i++) {
        createListItem(favorites[i].name, favorites[i].image, favorites[i].price_text, favorites[i].sale_text, favorites[i].description, favorites[i].ean, 'favoritesAnchor')
    }
    
}

var favoritesObjects = [];
var favorites = [];
function addFavorite(ean) {

    var remove = false;
    for(var i = 0; i < favorites.length; i++) {
        if(favorites[i] == ean) {
            console.log(favorites)

            favorites.splice(i, 1);
            byId(ean).innerHTML = 'star_border';
            remove = true;

            console.log(favorites)
        }
    }

    if(!remove) {
        favorites[favorites.length] = ean;
        byId(ean).innerHTML = 'star';

        console.log(favorites)
    }

    saveFavorites();
}

var productsInList = [];
var madeEans = [];
var itemsMade = 0;
function createListItem(name, image, beforePrice, sale, description, ean, location) {

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
            beforePrice: beforePrice,
            sale: sale,
            description: description,
            ean: ean
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
    

    console.log(productsInList)

    var fontSize = 7;

    if(name.length > 8) {
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

    if(description.length > 20) {
        description = '';
    }

    var displaySale = '';
    if(location == 'favoritesAnchor') {
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
    <ins class="listNewPrice" id="1-newPrice" ${displaySale}>${sale}</ins>
    <ins class="listBeforePrice" id="1-beforePrice">${beforePrice}</ins>`


    byId(location).append(str);
}


/*=====================================================================================
									 STORAGE
=======================================================================================*/
var storage = window.localStorage;
var saveArray = [];

function saveFavorites() {
    storage.setItem('favoritesSave', JSON.stringify(favorites));
    storage.setItem('savedProducts', JSON.stringify())
}

function load() {
    if(storage.length != 0) {
        favorites = JSON.parse(storage.getItem('favoritesSave'));
    }
}