console.log(peopleArray);
yakImageArray = ["yak1.jpg", "yak2.jpg", "yak3.jpg", "yak4.jpg", "yak5.jpg",
"yak6.jpg", "yak7.jpg", "yak8.jpg", "yak9.jpg", "yak10.jpg", "yak11.jpg",
"yak12.jpg", "yak13.jpg", "yak14.jpg", "yak15.jpg", "yak16.jpg", "yak17.jpg",
"yak18.jpg", "yak19.jpg"];

//Pick a person (by index in peopleArray) to have featured on page load
var startingFeaturedPersonIndex = 0;

//Create some important global variables
var currentFeaturedPerson;
var timer;

function FeaturedPerson(personIndex) {
  this.personIndex = personIndex;
  this.personInfo = peopleArray[personIndex];
  this.imageSource = "imgs/yaks/" + yakImageArray[personIndex];
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
  console.log("New featured person set");
}

$(document).ready(onReady);

function onReady() {
  appendDots();
  changeToPerson(startingFeaturedPersonIndex);
  eventListeners();
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

function eventListeners(){
  $(".dot-container").on("click", ".dot", function() {
    var personIndex = $(this).data("personIndex");
    if (personIndex != currentFeaturedPerson.personIndex){
      changeToPerson(personIndex);
    }
    $(this).removeClass("highlight");
  });
  $(".dot-container").on("mouseover", ".dot", function() {
    if ($(this).data("personIndex") != currentFeaturedPerson.personIndex) {
      $(this).addClass("highlight");
    }
  });
  $(".dot-container").on("mouseleave", ".dot", function() {
    if ($(this).hasClass("highlight")) {
      $(this).removeClass("highlight");
    }
  });
  $("#prev-button").on("click", function() {
    var personIndex = currentFeaturedPerson.findPrevPerson();
    changeToPerson(personIndex);
  });
  $("#next-button").on("click", function() {
    var personIndex = currentFeaturedPerson.findNextPerson();
    changeToPerson(personIndex);
  });
  $(".button").on("mouseover", function() {
    $(this).addClass("highlight");
  });
  $(".button").on("mouseleave", function() {
    $(this).removeClass("highlight");
  });
  $("#anna-link").on("mouseover", function() {
    $(this).addClass("highlight");
  });
  $("#anna-link").on("mouseleave", function() {
    $(this).removeClass("highlight");
  });
  $("#anna-link").on("click", function() {
      changeToPerson(1);
  });
  $(document).on('keydown', function (key) {
    var personIndex;
    if (key.which == 37) {
      personIndex = currentFeaturedPerson.findPrevPerson();
      changeToPerson(personIndex);
    } else if (key.which == 39) {
      personIndex = currentFeaturedPerson.findNextPerson();
      changeToPerson(personIndex);
    }
  });
}

//changes value of currentFeaturedPerson to new person and updates DOM
function changeToPerson(personIndex){
  setFeaturedPerson(personIndex);
  updateDOM();
  clearInterval(timer);
  timer = setInterval(function () {
    autoAdvance();
  }, 10000);
  console.log(timer);
}
function updateDOM() {
  updateFeaturedImage();
  updateFeaturedShoutout();
  updateFeaturedName();
  updateDots();
}

function updateFeaturedImage() {
  $(".image-block").children().first().next().remove();
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
  var featuredShoutout = '"' + currentFeaturedPerson.personInfo.shoutout.trim() + '"';
  $(".shoutout").text(featuredShoutout);
}

function updateFeaturedName() {
  var featuredName = currentFeaturedPerson.personInfo.name;
  console.log(featuredName);
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

function autoAdvance() {
  var currentPersonIndex = currentFeaturedPerson.personIndex;
  if (currentPersonIndex == peopleArray.length - 1) {
        changeToPerson(0);
  } else {
    changeToPerson(currentPersonIndex + 1);
  }
}
