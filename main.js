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
        //console.log(`${doc.id} => ${doc.data()}`);
        console.log("DATA: " + doc.data().name);
    });
});

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
function createListItem() { // Taken from other game of mine, serves just as example
    var str = document.createElement('section');
    str.innerHTML = '<img draggable="false" onclick="oreFloat()" id="ore' + oreNum + '" class="ore" src="images/' + amounts[0][oresDisplayed] + '.png"/><br /><section id="oreText">+' + amounts[1][oresDisplayed] + ' ' + amounts[0][oresDisplayed] + '!</section>';
    byId("oreAnchor").append(str);
}