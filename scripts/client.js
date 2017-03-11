console.log(peopleArray);
yakImageArray = ["yak1.jpg", "yak2.jpg", "yak3.jpg", "yak4.jpg", "yak5.jpeg",
"yak6.jpg", "yak7.jpg", "yak8.jpg", "yak9.jpg", "yak10.jpg", "yak11.jpg",
"yak12.jpg", "yak13.jpg", "yak14.jpg", "yak15.jpg", "yak16.jpg", "yak17.jpg",
"yak18.jpg", "yak19.jpg"];

//Pick a person (by index in peopleArray) to have featured on page load
var startingFeaturedPersonIndex = 0;
var currentFeaturedPerson;
setFeaturedPerson(startingFeaturedPersonIndex);

function FeaturedPerson(personIndex) {
  this.personIndex = personIndex;
  this.personInfo = peopleArray[personIndex];
  this.imageSource = "imgs/yaks_raw/" + yakImageArray[personIndex];
}

FeaturedPerson.prototype = {
  //returns personIndex for next person. If at end of carousel, returns to 0.
  findNextPerson: function() {
    var nextPersonIndex;
    if (this.personIndex == peopleArray.length - 1) {
      nextPersonIndex = 0;
    } else {
      nextPersonIndex = this.personIndex + 1;
    }
    return nextPersonIndex;
  },
  //returns personIndex for previous person. If at beginning of carousel, goes to end.
  findPrevPerson: function() {
    var prevPersonIndex;
    if (this.personIndex === 0) {
      prevPersonIndex = peopleArray.length - 1;
    } else {
      prevPersonIndex = this.personIndex - 1;
    }
    return prevPersonIndex;
  }
};

function setFeaturedPerson(personIndex) {
  currentFeaturedPerson = new FeaturedPerson(personIndex);
}

$(document).ready(onReady);

function onReady() {
  appendDots();
  updateDOM();
  listenForClicks();
  // checkForTimeOut();

}

//appends 1 dot to .dot-container for each person in array
//gives each dot a data attribute named personIndex with a unique value of 0-18
function appendDots() {
  var dot = "<div class='dot'></div>";
  for (var i = 0; i < peopleArray.length; i++) {
    $(".dot-container").append(dot);
    $(".dot-container").children().last().data("personIndex", i);
  }
}

function checkData() {
  var selectedDot = 15;
  for (var i = 0; i < $(".dot").length; i++) {
    if ($(".dot").eq(i).data("personIndex") == selectedDot) {
      $(".dot").eq(i).addClass("selected");
    }
  }
}

function listenForClicks(){
  $(".dot-container").on("click", ".dot", function() {
    var personIndex = $(this).data("personIndex");
    changeToPerson(personIndex);
  });
  $("#prev-button").on("click", function() {
    var personIndex = currentFeaturedPerson.findPrevPerson();
    changeToPerson(personIndex);
  });
}

//changes value of currentFeaturedPerson to new person and updates DOM
function changeToPerson(personIndex){
  setFeaturedPerson(personIndex);
  updateDOM();
}

function updateDOM() {
  updateFeaturedImage();
  updateFeaturedShoutout();
  updateFeaturedName();
  updateDots();
}

function updateFeaturedImage() {
  $(".image-block").children().remove();
  var featuredImageSource = currentFeaturedPerson.imageSource;
  var featuredPersonFirstName = currentFeaturedPerson.personInfo.name.split(" ")[0];
  var imageHTML = "<img src='" +
                  featuredImageSource +
                  "' class='yak-pic' alt='yak' title='A yak called " +
                  featuredPersonFirstName +
                  "' />";
  $(".image-block").append(imageHTML);
  return imageHTML;
}

function updateFeaturedShoutout() {
  var featuredShoutout = currentFeaturedPerson.personInfo.shoutout;
  $(".shoutout").text(featuredShoutout);
}

function updateFeaturedName() {
  var featuredName = currentFeaturedPerson.personInfo.name;
  $(".name").text(featuredName);
}

function updateDots() {
  for (var i = 0; i < $(".dot").length; i++) {
    var thisDot = $(".dot").eq(i);
    thisDot.removeClass("selected");
    if (thisDot.data("personIndex") == currentFeaturedPerson.personIndex) {
      thisDot.addClass("selected");
    }
  }
}
