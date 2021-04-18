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
var db = firebase.firestore();

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

function AddUserToDatabase(id, email_) {
    db.collection("users").doc(id).set({
        email: email_
    })
    .then(() => {
        console.log("Document successfully written!");
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
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
									 MISCELLANEOUS
=======================================================================================*/
const byId = function(id) { // Shortcut
	return document.getElementById(id);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function animateHamburger(x) { // Activates the css animation for the hamburger menu
    x.classList.toggle("change");
}

function openNav() {
    byId("sidenav").style.width = "66vw";
    // var menus = document.getElementsByClassName("menu");
    // for(var i = 0; i < menus.length; i++) {
    //     menus[i].style.filter = 'brightness(50%)';
    // }
}
  
function closeNav() {
    byId("sidenav").style.width = "0";
}

function outsideClick(event, notelem)	{
    var clickedOut = true, i, len = notelem.length;
    for (i = 0;i < len;i++)  {
        if (event.target == notelem[i] || notelem[i].contains(event.target)) {
            clickedOut = false;
        }
    }
    if (clickedOut) return true;
    else return false;
}

var navMenu = document.getElementById("sidenav");
window.addEventListener('click', function(e) {
   if(outsideClick(e, navMenu) && byId("sidenav").style.width == "66vw") {
       console.log('test')
   		closeNav();
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
    byId(menuId).style.display = 'block';
}



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

var startAt = 0;
function getAllDiscounts() {
    console.log(startAt)
    db.collection("week15").orderBy('name').startAt(startAt).limit(10).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            createListItem(doc.data().name, doc.data().image, doc.data().before_price, doc.data().sale_price, doc.data().combined_price, doc.data().item_count, doc.data().description);

        });
    });
    startAt += 10;
}

var itemsMade = 0;
function createListItem(name, image, beforePrice, salePrice, combinedPrice, itemCount, description) { //
    if (itemCount != '') {
        salePrice = combinedPrice
    }

    var str = document.createElement('DIV');
    str.setAttribute("class", "listItem");
    str.innerHTML =
        '<img class="listImage" src="' + image + '" /><img class="listStoreLogo" src="images/sparLogo.png" /><br /><ins class="listName" id="1-name">' + name + '</ins><br /><ins class="listNewPrice" id="1-newPrice">' + salePrice + '</ins><br /><ins class="listBeforePrice" id="1-beforePrice">Før:' + beforePrice + '</ins>'

    // <br /><ins class="listDesc" id="1-desc">' + description +'</ins> REMOVED THE DESCRIPTION DUE TO SPACING ISSUES

    byId("listAnchor").append(str);
}