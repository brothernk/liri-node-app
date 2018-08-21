//Dependencies
require("dotenv").config();

const keys = require("./keys.js");
const request = require("request");
const inquirer = require("inquirer");

const Twitter = require("twitter");
const client = new Twitter(keys.twitter);

const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);

const Hangman = require("./library/Hangman");
const hangman = new Hangman();
	
//Twitter Function
const runTwitter = () => {
	inquirer.prompt([
		{
		type: "input",
		message: "Enter a Twitter username: ",
		name:"twitterUsername"
		},
	]).then(function(user){
		let twitterSetup = () =>{
			let params = {screen_name: user.twitterUsername};
			client.get('statuses/user_timeline/', params, function(err, data, res) {
				if (err) {
					return console.log("Run the app again and enter a valid username");
				}
				else {
					for (let i = 0;  i < data.length; i++) {
						console.log("\n" + data[i].text);
						console.log("Tweeted on " + data[i].created_at + "\n");
					}

					inquirer.prompt([
						{
						type:"list",
						message:"Would you like to look at someone else's Tweets?",
						choices:["Yes", "No", "Exit"],
						name:"choice"
						}
					]).then(function(user){
						if(user.choice === "Yes"){
							runMovie();
						}
						else if (user.choice === "No") {
							runApp();
						}
						else {
							quit();
						}
					})
				}
			}) 
		}
		twitterSetup();  
	});
}

//Spotify Function
const runSpotify = () => {
	inquirer.prompt([
		{
		type: "input",
		message: "What song are you looking for?",
		name:"songTitle"
		},
	]).then(function(user){
		let spotifySetup = () => {
			spotify.search({ type: 'track', query: user.songTitle, limit:1}, function(err, data) {
				if (err) {
					return console.log("Error occured: " + err);
				} 
				else {
					console.log("\nArtist: " + data.tracks.items[0].artists[0].name); 
					console.log("Song Title: " + data.tracks.items[0].name);
					console.log("Preview: " + data.tracks.items[0].preview_url);
					console.log("Album: " + data.tracks.items[0].album.name + "\n");
					
					inquirer.prompt([
						{
						type:"list",
						message:"Would you like to search another song?",
						choices:["Yes", "No", "Exit"],
						name:"choice"
						}
					]).then(function(user){
						if(user.choice === "Yes"){
							runMovie();
						}
						else if (user.choice === "No") {
							runApp();
						}
						else {
							quit();
						}
					})
				}
			})
		}
		spotifySetup();
	});
}

//Movie Function
const runMovie = () => {
	inquirer.prompt([
		{
		type: "input",
		message: "What movie would you like more information about?",
		name:"movieTitle"
		},
	]).then(function(user){
		let movieSetup = () => {
			if (user.movieTitle === " " || user.movieTitle === ""){
				console.log("\nYou didn't enter a movie title. Try again!\n");
				runMovie();
			} else {
				request("http://www.omdbapi.com/?t=" + user.movieTitle + "&y=&plot=short&apikey=trilogy", function(err, res, body) {
					if (err) {
						return console.log("Error occured: " + err);
					} 
					else {
						console.log("\nMovie Title: " + JSON.parse(body).Title);
						console.log("Year Released: " + JSON.parse(body).Year);
						console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
						console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
						console.log("Country of Production " + JSON.parse(body).Country);
						console.log("Language: " + JSON.parse(body).Language);
						console.log("Major Actors: " + JSON.parse(body).Actors);
						console.log("\nPlot Synopsis: " + JSON.parse(body).Plot + "\n");

						inquirer.prompt([
							{
							type:"list",
							message:"Would you like to search another movie?",
							choices:["Yes", "No", "Exit"],
							name:"choice"
							}
						]).then(function(user){
							if(user.choice === "Yes"){
								runMovie();
							}
							else if (user.choice === "No") {
								runApp();
							}
							else {
								quit();
							}
						})
					}
				})
			}
		}
		movieSetup();	
	})
}

//Hangman Function
const playHangman = () => {
	hangman.play();
}

const runApp = () => {
	inquirer.prompt([
		{
		type: "list",
		message: "Give LIRI a command",
		choices: ["Recent-Tweets", "Song-Search", "Movie-Info", "Bamazon", "Hangman"],
		name:"command"
		},
	]).then(function(user){

		if (user.command === "Recent-Tweets"){ 
			runTwitter();
		} else if (user.command === "Song-Search"){
			runSpotify();
		} else if (user.command === "Movie-Info"){
			runMovie();
		} else if (user.command === "Hangman"){
			playHangman();
		}
		else if (user.command === "Bamazon"){
			console.log("\nCurrently under construction. Please try back later!\n");
		}
	});
}

const quit = () => {
	console.log("\nThanks for playing, catch you on the flip side!\n");
    process.exit(0);
}

runApp();

