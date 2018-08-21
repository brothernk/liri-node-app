const inquirer = require("inquirer");
const Word = require("./Word");
const wordArray = require("./WordArray");

function Hangman() {
    let self = this;

    //Game play
    this.play = function() {
        console.log("\nTry to guess the animal name.")
        this.guessesLeft = 10;
        this.nextWord();
    };

    //Next Word
    this.nextWord = function() {
        let randomWord = wordArray[Math.floor(Math.random() * wordArray.length)];
        this.currentWord = new Word(randomWord);
        console.log('\n' + this.currentWord + '\n');
        this.makeGuess();
    };

    //Prompt User
    this.makeGuess = function() {
        this.userInput().then(function() {
      
        if (self.guessesLeft < 1) {
            console.log("Ooooh tough break. The answer was: \"" + self.currentWord.getSolution() + "\"\n");
            self.askToPlayAgain();
        }
        else if (self.currentWord.guessedCorrectly()) {
            console.log("Holla! You're #killin it.\n");
            self.guessesLeft = 10;
            self.askToPlayAgain();
        }
        else {
            self.makeGuess();
        }
        });
    };

    //Play Again
    this.askToPlayAgain = function() {
        inquirer
        .prompt([
            {
            type: "confirm",
            name: "choice",
            message: "Do you want to play Hangman again?"
            }
        ]).then(function(val) {
            if (val.choice) {
                self.play();
            }
            else {
                self.quit();
            }
        });
    };

    //Prompts for Letter
    this.userInput = function() {
        return inquirer
        .prompt([
            {
            type: "input",
            name: "choice",
            message: "Guess a letter",

            validate: function(val) {
                return /[a-z1-9]/gi.test(val);
            }
            }
        ]).then(function(val) {
            let correctGuess = self.currentWord.guessLetter(val.choice);
            
            if (correctGuess) {
                console.log("\nYep.\n");
            }
            else {
                self.guessesLeft--;
                console.log("Nope. Now you only have " + self.guessesLeft + " guesses left...\n");
            }
        });
    };

    //Quit the game
    this.quit = function() {
        console.log("\nThanks for playing!");
        process.exit(0);
    };
}

module.exports = Hangman;