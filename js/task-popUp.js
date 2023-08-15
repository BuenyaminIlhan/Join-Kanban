document.addEventListener("DOMContentLoaded", function() {
    var popUpDeleteDiv = document.getElementById("popUpDelete");
    var popUpDeleteImg = popUpDeleteDiv.querySelector("img");
    
    popUpDeleteDiv.addEventListener("mouseover", function() {
      popUpDeleteImg.src = "./asssets/img/popUpDeletehover.svg";
    });
    
    popUpDeleteDiv.addEventListener("mouseout", function() {
      popUpDeleteImg.src = "./asssets/img/popUpDelete.svg";
    });
  });
