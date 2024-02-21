"use strict";
$(document).ready(() => {
    $("#tabs").tabs();

    const imageFolder = "images/";
    const totalImages = 24;
    let cards = [];
    let matchesFound = 0;
    let cardAttempts = 0;
    let highScore = localStorage.getItem("highScore") || 0;
    let firstCard = null;
    let secondCard = null;
    let isChecking = false;

    // Start the game
    preloadImages();
    setupGame();

    // Event handlers
    $("#save_settings").click(() => {
        let playerName = $("#player_name").val();
        let numOfCards = $("#num_cards").val();
        sessionStorage.setItem("playerName", playerName);
        sessionStorage.setItem("numOfCards", numOfCards);
        location.reload();
    });
    $("#cards").on("click", ".card", function() {
        // when a card is clicked
        if (!$(this).hasClass("matched")) {
            flipCard($(this));
        }
    });

    $("#new_game").click(() => {//when new game is clicked
        matchesFound = 0;
        cardAttempts = 0;
        firstCard = secondCard = null;
        isChecking = false;
        $("#cards").empty();
        $("#correct").text("");
        setupGame();
    });

    function setupGame() {  
        showHighScore();
        createPairs();
        shuffleCards();
        displayCards();
    }

    function showHighScore() {
        $("#player").text(sessionStorage.getItem("playerName") || "Player");
        $("#high_score").text(`High Score: ${highScore}%`);
    }

    function flipCard(card) {
        if (isChecking || card.hasClass("matched")) return;

        let cardValue = card.data("cardValue");
        let cardImage = card.find("img");

        if (cardImage.attr("src") !== imageFolder + "back.png") return;

        cardImage.fadeOut(500, function () {
            $(this)
                .attr("src", imageFolder + "card_" + cardValue + ".png")
                .fadeIn(500);
        });

        if (!firstCard) {
            firstCard = card;
        } else {
            secondCard = card;
            isChecking = true;
            setTimeout(checkForMatch, 1000);
        }
    }

    function checkForMatch() {
        if (firstCard.data("cardValue") === secondCard.data("cardValue")) { //if fist card and second card match
            firstCard.add(secondCard).addClass("matched").fadeOut(500);
            matchesFound++;
            updateScore();
            resetCards();
        } else {
            setTimeout(() => {
                firstCard
                    .add(secondCard)
                    .find("img")
                    .fadeOut(500, function () {
                        $(this)
                            .attr("src", imageFolder + "back.png")
                            .fadeIn(500);
                    });
                resetCards();
            }, 1000);
        }
    }

    function resetCards() {
        firstCard = secondCard = null;
        isChecking = false;
    }

    function updateScore() {
        cardAttempts++;
        let score = (matchesFound / cardAttempts) * 100;
        $("#correct").text(`Score: ${score.toFixed(2)}%`);
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
    }

    function createPairs() {
        let numOfCards = sessionStorage.getItem("numOfCards") || 48;
        cards = [];
        for (let i = 0; i < numOfCards / 2; i++) {
            let value = (i % totalImages) + 1;

            cards.push(value, value); // Add each card twice for pairing
        }
    }

    function shuffleCards() {
        for (let i = cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }

    function preloadImages() {
        for (let i = 1; i <= totalImages; i++) {
            new Image().src = imageFolder + "card_" + i + ".png";
        }
        new Image().src = imageFolder + "back.png";
        new Image().src = imageFolder + "blank.png";
    }

    function displayCards() {
        let $cardsContainer = $("#cards").empty();
        cards.forEach(function (cardValue) {
            let $card = $("<div>", { class: "card" }).data("cardValue", cardValue);
            let $cardImage = $("<img>", {
                src: imageFolder + "back.png",
                alt: "Card back",
            });
            $card.append($cardImage);
            let $cardAnchor = $("<a>", {
                href: "#",
                id: imageFolder + "card_" + cardValue + ".png",
            }).append($card);
            $cardsContainer.append($cardAnchor);
        });
    }
});
