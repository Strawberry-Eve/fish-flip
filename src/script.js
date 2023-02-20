var $board = $("main"),
   $card = $(".card"),
   $itemCount = $(".score span"),
   $wins = $(".wins span"),
   $turns = $(".turns span"),
   $attempts = $(".attempts span"),
   $attemptsOverall = $(".attempts-overall span"),
   $success = $(".success"),
   $successMsg = $(".success-message"),
   $successIcon = $(".success-icon"),
   $btnContinue = $(".btn-continue"),
   selectedClass = "is-selected",
   visibleClass = "is-visible",
   playSoundClass = "is-playing",
   scoreUpdateClass = "is-updating",
   lastTurnClass = "last-turn",
   dataMatch = "data-matched",
   dataType = "data-type",
   turnsCount = 3,
   winsCount = 0,
   attemptsCount = 0,
   attemptsOverallCount = 0,
   tooManyAttempts = 8,
   timeoutLength = 600,
   card1,
   card2,
   msg;

// Shuffle up the deck
shuffleCards();

$card.on("click", function () {
   if ($(this).attr(dataMatch) == "false") {
      $(this).addClass(selectedClass);
   }
   var selectedCards = $("." + selectedClass);
   if (selectedCards.length == 2) {
      card1 = selectedCards.eq(0).attr(dataType);
      card2 = selectedCards.eq(1).attr(dataType);

      //If match
      if (card1 == card2) {
         selectedCards.attr(dataMatch, true).removeClass(selectedClass);
      }
      //Else, if not match
      else {
         setTimeout(function () {
            turnsCount--;
            $turns.addClass(scoreUpdateClass).html(turnsCount);
            selectedCards.removeClass(selectedClass);
         }, timeoutLength);

         //If one turn remaining
         if (turnsCount === 1) {
            setTimeout(function () {
               $turns.addClass(lastTurnClass);
            }, timeoutLength);
         }

         //If no turns remaining
         if (turnsCount <= 0) {
            setTimeout(function () {
               turnsCount = 3;
               $turns.removeClass(lastTurnClass).html(turnsCount);
               $card.attr(dataMatch, false);
               attemptsCount += 1;
               $attempts.addClass(scoreUpdateClass).html(attemptsCount);
            }, timeoutLength);
         }
      }
   }

   // On Winner
   if ($("[" + dataMatch + '="true"]').length == $card.length) {
      $success.addClass(visibleClass);
      switch (true) {
         //Set success message depending on attemptsCount
         case attemptsCount <= 2:
            msg = "FIN-TASTIC!!!";
            $successIcon.attr(dataType, "purplefish");
            break;
         case attemptsCount > 2 && attemptsCount <= 5:
            msg = "Ex-squid-sit!";
            $successIcon.attr(dataType, "squid");
            break;
         case attemptsCount > 5 && attemptsCount <= 8:
            msg = "A dab hand!";
            $successIcon.attr(dataType, "bluefish");
            break;
         case attemptsCount > tooManyAttempts:
            msg = "A-trout-cious...";
            $successIcon.attr(dataType, "angler");
            break;
      }

      //Display success message
      $successMsg.text(msg);

      setTimeout(function () {
         attemptsOverallCount += attemptsCount;
         $attemptsOverall.addClass(scoreUpdateClass).html(attemptsOverallCount);
         winsCount += 1;
         $wins.addClass(scoreUpdateClass).html(winsCount);
         $card.attr(dataMatch, false);
      }, 1200);
   }
});

// Remove the score update class after the animation completes
$itemCount.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function () {
   $itemCount.removeClass(scoreUpdateClass);
});

// Next round
$btnContinue.on("click", function () {
   $success.removeClass(visibleClass);
   shuffleCards();
   setTimeout(function () {
      turnsCount = 3;
      $turns.removeClass(lastTurnClass).html(turnsCount);
      attemptsCount = 0;
      $attempts.html(attemptsCount);
   }, 300);
});

// shuffleCards Function
function shuffleCards() {
   var cards = $board.children();
   while (cards.length) {
      $board.append(cards.splice(Math.floor(Math.random() * cards.length), 1)[0]);
   }
}
