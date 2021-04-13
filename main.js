
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
function createListItem() { // Takes straight from other game of mine, serves just as example
    var str = document.createElement('section');
    str.innerHTML = '<img draggable="false" onclick="oreFloat()" id="ore' + oreNum + '" class="ore" src="images/' + amounts[0][oresDisplayed] + '.png"/><br /><section id="oreText">+' + amounts[1][oresDisplayed] + ' ' + amounts[0][oresDisplayed] + '!</section>';
    byId("oreAnchor").append(str);
}