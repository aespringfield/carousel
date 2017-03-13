console.log(peopleArray);
yakImageArray = ["yak1.jpg", "yak2.jpg", "yak3.jpg", "yak4.jpg", "yak5.jpg",
"yak6.jpg", "yak7.jpg", "yak8.jpg", "yak9.jpg", "yak10.jpg", "yak11.jpg",
"yak12.jpg", "yak13.jpg", "yak14.jpg", "yak15.jpg", "yak16.jpg", "yak17.jpg",
"yak18.jpg", "yak19.jpg"];

//Settings
//Pick a person (by index in peopleArray) to have featured on page load
//Pick a speed for fade transitions
var startingFeaturedPersonIndex = 0;
var fadeSpeed = 800;

//Create some important global variables
var currentFeaturedPerson;
var autoAdvanceTimer;
var buttonsToBackgroundTimer;


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
  foregroundButtons();
}

//appends one dot to .dot-container for each person in array
//gives each dot a data attribute named personIndex with a unique value of 0-18
function appendDots() {
  var dot = "<div class='dot'></div>";
  for (var i = 0; i < peopleArray.length; i++) {
    $(".dot-container").append(dot);
    $(".dot-container").children().last().data("personIndex", i);
  }
}

function eventListeners(){
  changeOnButtonClicks();
  changeOnDotClicks();
  changeOnArrowKeys();
  changeOnAnnaLink();
  highlightDotsOnMouseover();
  highlightButtonsOnMouseover();
  highlightAnnaLinkOnMouseover();
  $(document).on("mousemove", foregroundButtons);
}

function changeOnButtonClicks() {
  $("#prev-button").on("click", function() {
    var personIndex = currentFeaturedPerson.findPrevPerson();
    changeToPerson(personIndex);
  });
  $("#next-button").on("click", function() {
    var personIndex = currentFeaturedPerson.findNextPerson();
    changeToPerson(personIndex);
  });
}

function changeOnDotClicks() {
  $(".dot-container").on("click", ".dot", function() {
    var personIndex = $(this).data("personIndex");
    if (personIndex != currentFeaturedPerson.personIndex){
      changeToPerson(personIndex);
    }
    $(this).removeClass("highlight");
  });
}

function changeOnArrowKeys() {
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

function changeOnAnnaLink() {
  $("#anna-link").on("click", function() {
      changeToPerson(1);
  });
}

function highlightDotsOnMouseover() {
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
}

function highlightButtonsOnMouseover() {
  $(".button").on("mouseover", function() {
    $(this).addClass("highlight");
  });
  $(".button").on("mouseleave", function() {
    $(this).removeClass("highlight");
  });
}

function highlightAnnaLinkOnMouseover() {
  $("#anna-link").on("mouseover", function() {
    $(this).addClass("highlight");
  });
  $("#anna-link").on("mouseleave", function() {
    $(this).removeClass("highlight");
  });
}

function foregroundButtons() {
  var buttons = $(".button");
  buttons.fadeIn(100, function() {
      buttons.addClass("foregrounded");
  });
  clearInterval(buttonsToBackgroundTimer);
  if (!($("#next-button").hasClass("highlight")) && !(($("#prev-button").hasClass("highlight")))){
    buttonsToBackgroundTimer = setInterval(function() {
        buttons.fadeOut(1000, function() {
          buttons.removeClass("foregrounded");
        });
    }, 2000);
  }
}

//changes value of currentFeaturedPerson to new person and updates DOM
function changeToPerson(personIndex){
  setFeaturedPerson(personIndex);
  updateDOM();
  refreshTimer();
}

//updates DOM with correct image, shoutout, name, and selected dot
function updateDOM() {
  updateFeaturedImage();
  updateFeaturedShoutout();
  updateFeaturedName();
  updateDots();
}

//retrieves correct image for current featured person and updates DOM
function updateFeaturedImage() {
  var $parentEl = $(".image-block");
  var $el = $parentEl.children().first().next();
  var featuredImageSource = currentFeaturedPerson.imageSource;
  var featuredPersonFirstName = currentFeaturedPerson.personInfo.name.split(" ")[0];
  var imageHTML = "<img src='" +
                  featuredImageSource +
                  "' class='yak-pic hidden' alt='yak' title='A yak called " +
                  featuredPersonFirstName +
                  "' />";
  fadeOutFadeIn($el, $parentEl, imageHTML);
}

//fades out old image & removes it
//appends new image and fades it in
function fadeOutFadeIn($elToRemove, $parentEl, newHTML) {
  $elToRemove.fadeOut(fadeSpeed, function() {
    this.remove();
  });

  $parentEl.append(newHTML);
  $parentEl.children().last().fadeIn(fadeSpeed);
}

//retrieves correct shoutout for current featured person and updates DOM
function updateFeaturedShoutout() {
  var featuredShoutout = '"' + currentFeaturedPerson.personInfo.shoutout.trim() + '"';
  var $el = $(".shoutout");
  fadeOutFadeInText(featuredShoutout, $el);
}

//retrieves correct name for current featured person and updates DOM
function updateFeaturedName() {
  var featuredName = currentFeaturedPerson.personInfo.name;
  var $el = $(".name");
  fadeOutFadeInText(featuredName, $el);
}

//fades out old name/shoutout divs, changes text, and fades back in
function fadeOutFadeInText(text, $el) {
  $el.parent().fadeOut(fadeSpeed, function () {
    $el.text(text);
  });
  $el.parent().fadeIn(fadeSpeed);
}

//finds dot corresponding to the index of the current featured person
//changes its class to selected
//removes selected class from other dots
function updateDots() {
  for (var i = 0; i < $(".dot").length; i++) {
    var thisDot = $(".dot").eq(i);
    thisDot.removeClass("selected");
    if (thisDot.data("personIndex") == currentFeaturedPerson.personIndex) {
      thisDot.addClass("selected");
    }
  }
}

//restarts auto-advance timer for ten seconds
function refreshTimer() {
  clearInterval(autoAdvanceTimer);
  autoAdvanceTimer = setInterval(autoAdvance, 10000);
}

//advances automatically to next person
function autoAdvance() {
  var currentPersonIndex = currentFeaturedPerson.personIndex;
  if (currentPersonIndex == peopleArray.length - 1) {
        changeToPerson(0);
  } else {
    changeToPerson(currentPersonIndex + 1);
  }
}
