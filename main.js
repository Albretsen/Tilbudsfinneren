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

db.collection("week15").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {

        createListItem(doc.data().name, doc.data().image, doc.data().before_price, doc.data().sale_price, doc.data().combined_price, doc.data().item_count, doc.data().description);
        
        if(doc.data().item_count != "") { console.log(doc.data().combined_price, doc.data().sale_price) }
        //console.log("DATA: " + doc.data().combined_price, doc.data().item_count);
    });
});


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
									 Discount list
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

function createListItem(name, image, beforePrice, salePrice, combinedPrice, itemCount, description) { //
    if (itemCount != '') {
        salePrice = combinedPrice
    }


    var str = document.createElement('DIV');
    str.setAttribute("class", "listItem");
    str.innerHTML =
    '<img class="listImage" src="' +  image  + '" /><img class="listStoreLogo" src="images/sparLogo.png" /><br /><ins class="listName" id="1-name">' + name + '</ins><br /><ins class="listNewPrice" id="1-newPrice">' + salePrice + '</ins><ins class="listBeforePrice" id="1-beforePrice">' + beforePrice + '</ins><br /><ins class="listDesc" id="1-desc">' + description +'</ins>'

    byId("listAnchor").append(str);
}