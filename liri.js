//Requirements
require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require('twitter');
	var client = new Twitter(keys.twitter);
var Spotify = require('node-spotify-api');
	var spotify = new Spotify(keys.spotify);
var request = require('request');
var inquirer = require("inquirer");
var fs = require("fs");

//Prompt for User Input
inquirer.prompt([
	 {
      type: "list",
      message: "Give LIRI a command",
      choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
      name:"command"
    },
])

.then(function(user){

	//Twitter Command
	if (user.command === "my-tweets"){
		inquirer.prompt([
			{
			 type: "input",
			 message: "Enter your Twitter username: ",
			 name:"twitterUsername"
			},
		])

		.then(function(user){
			function runTwitter(){
				var params = {screen_name: user.twitterUsername};
				client.get('statuses/user_timeline/', params, function(error, data, response) {
				  	if (error) {
						return console.log("Error occured: " + err);
					}
					else {
						for (var i = 0;  i < data.length; i++) {
		  					console.log("\n" + data[i].text);
		  					console.log("Tweeted on " + data[i].created_at + "\n");
		  				}
					}
				}) 
			} 
			runTwitter();   
	 	})
	}

	//Spotify Command
	else if (user.command === "spotify-this-song"){
		inquirer.prompt([
			{
			 type: "input",
			 message: "What song are you looking for?",
			 name:"songTitle"
			},
		])

		.then(function(user){
			function runSpotify(){
				spotify.search({ type: 'track', query: user.songTitle, limit:1}, function(error, data) {
					if (error) {
						return console.log("Error occured: " + err);
					} 
					else {
						console.log("\nArtist: " + data.tracks.items[0].artists[0].name); 
						console.log("Song Title: " + data.tracks.items[0].name);
						console.log("Preview: " + data.tracks.items[0].preview_url);
						console.log("Album: " + data.tracks.items[0].album.name + "\n");
					}
				})
			}
			runSpotify();
		})
	}

	//OMDB Command
	else if (user.command === "movie-this"){
		inquirer.prompt([
			{
			 type: "input",
			 message: "What movie would you like more information about?",
			 name:"movieTitle"
			},
		])

		.then(function(user){
			function runMovie(){
				request("http://www.omdbapi.com/?t=" + user.movieTitle + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
			  		if (error) {
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
				  	}
				})
			}
			runMovie();	
		})
	}

	//Final Command -- Needs tweaking. When I have more time I plan to edit the general setup 
					//of my code to separate functions and make it more useable
	else if (user.command === "do-what-it-says"){
		fs.readFile("random.txt", "utf8", function(error,data){
			var data = data.split(", ");
			if (error){
				return console.log(error);
			}
			else if (data[0] === "my-tweets") {
				runTwitter()
			}
			else if (data[0] === "spotify-this-song") {
				runSpotify(dataArr[1])
			}
			else if (data[0] === "movie-this") {
				runMovie(dataArr[1])
			}
		})
	} 
});


