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
function SignUpEmail(email, password) {
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
            console.log('success');
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage)
        });
}

function AddUserToDatabase(id, email_) {
    console.log("TEST1: " + id);
    db.collection("users").doc(id).set({
        email: email_
    })
    .then(() => {
        console.log("Document successfully written!");
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
    console.log("TEST2");
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
									 HELPER FUNCTIONS
=======================================================================================*/
const byId = function(id) { // Shortcut
	return document.getElementById(id);
}




function animateHamburger(x) { // Activates the css animation for the hamburger menu
    x.classList.toggle("change");
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}
  
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
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

    if(itemsMade < 30) {
        var str = document.createElement('DIV');
        str.setAttribute("class", "listItem");
        str.innerHTML =
        '<img class="listImage" src="' +  image  + '" /><img class="listStoreLogo" src="images/sparLogo.png" /><br /><ins class="listName" id="1-name">' + name + '</ins><br /><ins class="listNewPrice" id="1-newPrice">' + salePrice + '</ins><br /><ins class="listBeforePrice" id="1-beforePrice">Før:' + beforePrice + '</ins>'
    
        // <br /><ins class="listDesc" id="1-desc">' + description +'</ins> REMOVED THE DESCRIPTION DUE TO SPACING ISSUES
    
        byId("listAnchor").append(str);

        itemsMade++;
    } else {
       // itemsMade = 0;
    }


}