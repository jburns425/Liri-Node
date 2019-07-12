require("dotenv").config();
// Requiere VARS
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);


//Vars capturing the user input 
var userOption = process.argv[2];
var inputParameter = process.argv[3];
//Executing the function
UserInputs(userOption, inputParameter);
//Functions using switch 
function UserInputs (userOption, inputParameter){
    switch (userOption) {
        case 'concert-this':
            showConcertInfo(inputParameter);
            break;
        case 'spotify-this-song':
            showSongInfo(inputParameter);
            break;
        case 'movie-this':
            showMovieInfo(inputParameter);
            break;
        case 'do-what-it-says':
            showSomeInfo(inputParameter);
            break;
        default:
            console.log("Invalid Option.  Please type any of the following options: \nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says")

    }
}
//Function for requesting band information
function showConcertInfo(inputParameter){
    var queryUrl = "https://rest.bandsintown.com/artists/" +inputParameter + "/events?app_id=codingbootcamp";
    request(queryUrl, function(error, response, body) {
        //if the request is successful
        if (!error && response.statusCode === 200) {
            var concerts = JSON.parse(body);
            for (i = 0; i < concerts.length; i ++) {
                console.log("----------Event Information----------");
                fs.appendFileSync("log.txt", "----------Even Information----------\n" );
                console.log(i);
                fs.appendFileSync("log.txt", i+"\n");
                console.log("Name of the Venue: " + concerts[i].venue.name+"\n");
                fs.appendFileSync("log.txt", "Name of the Venue: " + concerts[i].venue.name+"\n");
                console.log("Venue Location: " + concerts[i].venue.city);
                fs.appendFileSync("log.txt", "Venue Location: " + concerts[i].venue.city+"\n");
                console.log("Date of the Event: " + concerts[i].datetime);
                fs.appendFileSync("log.txt", "Date of the Event: " + concerts[i].datetime+"\n");
                console.log("-------------------------------------");
                fs.appendFileSync("log.txt", "-------------------------------------");
            }
        }else{
            console.log('error occured');
        }
    });}
    // Getting this to work felt glorious!!!!!

    // Function for Movie Info
    function showMovieInfo(inputParameter){
        if (inputParameter === undefined) {
            inputParameter = "Mr. Nobody";
            console.log("--------------------");
            fs.appendFileSync("log.txt", "--------------------\n");
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            fs.appendFileSync("log.txt", "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/" +"\n");
            console.log("It's on Netflix!");
            fs.appendFileSync("log.txt", "It's on Netflix!\n");
        }
        var queryUrl = "http://www.omdbapi.com/?t=" + inputParameter + "&y=&plot=short&apikey=trilogy"
        //If the request is successful
        request(queryUrl, function(error, response, body) {
            if (!error && response.statusCode === 200)
            {
            var movies = JSON.parse(body);
            console.log("----------MOVIE INFO----------");
            fs.appendFileSync("log.txt", "----------MOVIE INFO----------");
            console.log("Title: " + movies.Title);
            fs.appendFileSync("log.txt", "Title: " + movies.Title + "\n");
            console.log("Release Year: " + movies.Year);
            fs.appendFileSync("log.txt", "Release Year: " + movies.Year + "\n");
            console.log("IMDB Rating: " + movies.imdbRating);
            fs.appendFileSync("log.txt", "IMDB Rating: " + movies.imdbRating + "\n");
            console.log("Rotten Tomatoes Rating: " + getRottenTomatoesRatingValue(movies));
            fs.appendFileSync("log.txt", "Rotten Tomatoes Rating: " + getRottenTomatoesRatingValue(movies) + "\n");
            console.log("Country of Production: " + movies.Country);
            fs.appendFileSync("log.txt", + "Country of Production: " + movies.Country + "\n");
            console.log("Language: " + movies.Language);
            fs.appendFileSync("log.txt", "Language: " + movies.Language + "\n");
            console.log("Plot: " + movies.Plot);
            fs.appendFileSync("log.txt", "Pilot: " + movies.Plot + "\n");
            console.log("Actors: " + movies.Actors);
            fs.appendFileSync("log.txt", + "Actors: " + movies.Actors + "\n");
            console.log("------------------------------");
            fs.appendFileSync("log.txt", "------------------------------" + "\n");
            }
            else {
               console.log("An error has occured");
            }
        })};
        //function to get Rotten Tomatoes Rating
        function getRottenTomatoesRatingObject (data) {
        return data.Ratings.find(function (item) {
        return item.Source === "Rotten Tomatoes";
        });
        }
  
        function getRottenTomatoesRatingValue (data) {
        return getRottenTomatoesRatingObject(data).Value;
        }
        //Spotify Function
        function showSongInfo(inputParameter) {
            if (inputParameter === undefined) {
                inputParameter = "The Sign";
            }
            spotify
            .search({ type: 'track', query: inputParameter })
            .then(function(response) {
                    for (var i = 0; i < 5; i++) {
            var spotifyResults = 
                "---------------------------------------" +
                    "\nArtist(s): " + response.tracks.items[i].artists[0].name + 
                    "\nSong Name: " + response.tracks.items[i].name +
                    "\nAlbum Name: " + response.tracks.items[i].album.name +
                    "\nPreview Link: " + response.tracks.items[i].preview_url;
                    
            console.log(spotifyResults);
        }
    })
    .catch(function(err) {
        console.log(err);
    });
}


   //fucntion for the do what i say

   function showSomeInfo()
   {
  console.log("------------DO WHAT IT SAYS-----------");
  fs.readFile("random.txt", "utf8", function (err, data)
   {
        if (err)
             {
                  return console.log(err);
             }

        console.log()
        fs.appendFile("log.txt", "\n" + data, function (err)
             {
                  if (err)
                       {
                            return console.log(err);
                       }
                  else
                       {
                            console.log("log.txt was updated");
             }
   });
   data = data.replace(/["']/g, "");
   data = data.split(/[ ,]+/).join(',')

   dataArr = new Array();


   dataArr = data.split(",");
   
   process.argv[2] = dataArr[0];

   for (i = 1; i < dataArr.length; i++)
        {
             process.argv.push(dataArr[i]);
        }

  switch (process.argv[2])
   {
      case "concert-this":
              showConcertInfo(process.argv[3]);
              break;

            case "spotify-this-song":
              showSongInfo(process.argv[3]);
              break;

            case "movie-this":
              showMovieInfo(process.argv[3]);
              break;



      }
   });}





