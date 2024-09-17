/*
self notes
****Endpoints Summary : endpoint Name	/Example Call	/Purpose

Root
   GET http://localhost:3000/	
   Returns a confirmation message that the server is running.
Fetch Like Data	
  GET http://localhost:3000/like	
  Fetches and returns all entries from the like table.
Seed Database	
  GET http://localhost:3000/seed_db	
  Seeds the database with predefined data; returns all data.
Like a Track	
  GET http://localhost:3000/users/1/like?trackId=2	
  Allows a user to like a track by providing userId and trackId.
Dislike a Track	
  GET http://localhost:3000/users/1/dislike?trackId=2	
  Allows a user to remove a like for a track by providing userId and trackId.
Fetch All Liked Tracks	by a specific user,  including detailed information.
  GET http://localhost:3000/users/1/liked	

Fetches all tracks of a specified artist that have been liked by a user, using userId and artist as parameters.
    GET http://localhost:3000/users/:userId/liked-artist?artist=ArtistName	




****Functions Summary : Function Name	/What It Does

getAllLikeData	
    Fetches all records from the like table and returns them.
getAllData	
    Fetches and returns all records from user, track, and like tables.
likeTrack	
    Creates a new entry in the like table for a specified userId and trackId.
dislikeTrack	
    Removes an entry from the like table based on userId and trackId.
getAllLikedTracks	
    Retrieves all track IDs liked by a user and fetches detailed information for each from the track table.
getAllLikedTracksIds
    Retrieves an array of all track IDs that a user has liked by querying the like table.
getAllLikedTracksDetails	
    Retrieves detailed information for each track liked by a user, using the track IDs to query the track table.
getallLikedTracksDetailsByArtist	
  Retrieves detailed information for tracks liked by a user, filtered by track IDs and a specific artist.
getAllLikedTracksByArtists
    Coordinates fetching of track IDs liked by a user and then uses those IDs to get details of tracks by the specified artist.
*/


let express = require("express");
const app = express();
app.use(express.json());
// Import the Track user like model and Sequelize instance from the previously defined paths
let { track } = require("./models/track.model");
let { user } = require("./models/user.model");
let { like } = require("./models/like.model");
let { sequelize } = require("./lib/index");

const port = 3000;
app.listen(port, () => {
  console.log("Server is running on port" + port);
});



let trackData = [
  {
    name: "Raabta",
    genre: "Romantic",
    release_year: 2012,
    artist: "Arijit Singh",
    album: "Agent Vinod",
    duration: 4,
  },
  {
    name: "Naina Da Kya Kasoor",
    genre: "Pop",
    release_year: 2018,
    artist: "Amit Trivedi",
    album: "Andhadhun",
    duration: 3,
  },
  {
    name: "Ghoomar",
    genre: "Traditional",
    release_year: 2018,
    artist: "Shreya Ghoshal",
    album: "Padmaavat",
    duration: 3,
  },
  {
    name: "Bekhayali",
    genre: "Rock",
    release_year: 2019,
    artist: "Sachet Tandon",
    album: "Kabir Singh",
    duration: 6,
  },
  {
    name: "Hawa Banke",
    genre: "Romantic",
    release_year: 2019,
    artist: "Darshan Raval",
    album: "Hawa Banke (Single)",
    duration: 3,
  },
  {
    name: "Ghungroo",
    genre: "Dance",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "War",
    duration: 5,
  },
  {
    name: "Makhna",
    genre: "Hip-Hop",
    release_year: 2019,
    artist: "Tanishk Bagchi",
    album: "Drive",
    duration: 3,
  },
  {
    name: "Tera Ban Jaunga",
    genre: "Romantic",
    release_year: 2019,
    artist: "Tulsi Kumar",
    album: "Kabir Singh",
    duration: 3,
  },
  {
    name: "First Class",
    genre: "Dance",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "Kalank",
    duration: 4,
  },
  {
    name: "Kalank Title Track",
    genre: "Romantic",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "Kalank",
    duration: 5,
  },
];


let userData = {
  username: 'testuser',
  email: 'testuser@gmail.com',
  password: 'testuser',
};


app.get("/", (req, res) => {
  res.status(200).json({ message: "BD5.5 - CW Application" });
});



// self - to fetch data from all tables / like only table

// Function to fetch data from all tables
async function getAllData() {
  // Fetch all records from user, track, and like tables
  let userResult = await user.findAll();
  let trackResult = await track.findAll();
  let likeResult = await like.findAll();

  // Return the results
  return {
    user: userResult,
    track: trackResult,
    like: likeResult
  };
}


// Function to fetch data from like only
async function getAllLikeData() {
  let likeResult = await like.findAll();

  // Return the results
  return {
    like: likeResult
  };
}

//self- endpoint to get all details of like model
app.get("/like", async (req, res) => {
  try {
    let likeData = await getAllLikeData();
    if (!likeData || !likeData.like || likeData.like.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(likeData);
  } catch (error) {
    console.log("Error fetching like data", error.message);
    res.status(500).json({
      message: "Error fetching like data",
      error: error.message
    });
  }
});






// end point to see the db
app.get("/seed_db", async (req, res) => {
  try {
    // Synchronize the database, forcing it to recreate the tables if they already exist
    await sequelize.sync({ force: true });

    //The bulkCreate method of Sequelize is intended for creating multiple 
    //records at once and expects an array of objects
    await track.bulkCreate(trackData);

    // to insert just one user,  should  use the create method, 
    await user.create(userData);


    // Fetch all data from the database after seeding
    const allData = await getAllData();
    // Send a 200 HTTP status code and a success message if the database is seeded successfully
    return res.status(200).json({
      message: "Database Seeding successful for track and user",
      dataInDB: allData
    });


  } catch (error) {
    // Send a 500 HTTP status code and an error message if there's an error during seeding

    console.log("Error in seeding db", error.message);
    return res.status(500).json({
      code: 500,
      message: "Error in seeding db",
      error: error.message,
    });
  }
});






/*
Exercise 1: Like a Track

Create an endpoint /users/:id/like that will allow a user to like a track.

Use the likeTrack function to handle the liking process.

Extract the userId from the URL parameter and trackId from the query parameter.

API Call

http://localhost:3000/users/1/like?trackId=2

Expected Output

{
  'message': 'Track liked',
  'newLike': {
    'userId': 1,
    'trackId': 2
  }
}


*/
//function to like a track
async function likeTrack(data) {
  try {
    let newLike = await like.create(
      {
        userId: data.userId,
        trackId: data.trackId
      }
    );
    if (!newLike) {
      throw new Error("Error in creating like for track");
    }
    // Return only the necessary attributes
    return {
      message: 'Track liked',
      newLike: {
        userId: newLike.userId,
        trackId: newLike.trackId
      }
    };

  } catch (error) {
    console.log("Error in liking track", error.message);
    throw error;

  }
}

//endpoint to like a track

app.get("/users/:userId/like", async (req, res) => {
  try {
    let userId = req.params.userId;
    let trackId = req.query.trackId;
    let result = await likeTrack({ userId, trackId });
    return res.status(200).json(result);

  } catch (error) {
    if (error.message === "Error in creting like for track") {
      res.status(400).json({
        code: 404,
        message: 'Error in liking track',
        error: error.message
      });
    } else {
      res.status(500).json({
        code: 500,
        message: 'Error in liking track',
        error: error.message
      });
    }

  }
})



/*
exercise 2: Dislike a Track

Create an endpoint /users/:id/dislike that will allow a user to dislike a track.

Use the dislikeTrack function to handle the disliking process.

Extract the userId from the URL parameter and trackId from the query parameter.

API Call

http://localhost:3000/users/1/dislike?trackId=2

Expected Output

{
  'message': 'Track disliked'
}
  
*/

//function to dislike a track
async function dislikeTrack(data) {
  try {
    let count = await like.destroy({
      where: {
        userId: data.userId,
        trackId: data.trackId
      }
    })
    if (count === 0) {
      throw new Error("Error in disliking track, records not found");
    }

    return {
      message: 'Track disliked'
    };

  } catch (error) {
    console.log("Error in disliking track", error.message);
    throw error;

  }
}

//endpoint to dislike a track

app.get("/users/:userId/dislike", async (req, res) => {
  try {
    let userId = req.params.userId;
    let trackId = req.query.trackId;
    let result = await dislikeTrack({ userId, trackId });
    return res.status(200).json(result);

  } catch (error) {
    if (error.message === "Error in disliking track, records not found") {
      res.status(400).json({
        code: 404,
        message: 'records not found',
        error: error.message
      });
    } else {
      res.status(500).json({
        code: 500,
        message: 'Error in disliking track',
        error: error.message
      });
    }

  }
})

/**
 * Exercise 3: Get All Liked Tracks

Create an endpoint /users/:id/liked that will fetch all liked tracks of a user.

Use the getAllLikedTracks function to handle fetching liked tracks.

Extract the userId from the URL parameter.

API Call

http://localhost:3000/users/1/liked

Expected Output

{
  'likedTracks': [
    {
      'id': 1,
      'name': 'Raabta',
      'genre': 'Romantic',
      'release_year': 2012,
      'artist': 'Arijit Singh',
      'album': 'Agent Vinod',
      'duration': 4
    },
    // Other liked tracks (if any)
  ]
}





 */



// fucntion to get  array of all liked trackids from like model using userid

async function getallLikedTracksIds(userId) {
  /* there are two ways to get track id
   **************** way 1 : using raw:true in finalAll ***********************
  - which will return plain js object and we can specify what attributes we want
  - Best used when you need data for display or JSON output, especially in web APIs where you need to send data 
   directly to the client side without further manipulation at the server level.
  
  <write code here for way 1 and output> 

   // Way 1: Fetching track IDs as plain JavaScript objects
    let tracksLikedRaw = await like.findAll({
      where: { userId: userId },
      attributes: ['trackId'], // Only fetch the trackId
      raw: true // This tells Sequelize to return results as plain JavaScript objects
    });

    console.log("Way 1 Output:", tracksLikedRaw);
    // Expected Output for Way 1:
    // [
    //   { "trackId": 1 },
    //   { "trackId": 2 },
    //   { "trackId": 3 }
    // ]

  
  ***********way 2: without raw in findAll i.e Using Model Instances **************
  
  - which will return instance of model like,
   even if we specify wht atrributes we want it will still return methods
   and metadata associated with the Sequelize model like.
   here we have to again extract trackid from each instance using map or
   ierated over oraay of objects of model returned from finadAll

  -Ideal for situations where the fetched data might need to be manipulated or saved back to the database after some processing. 
   Model methods like .save(), .update(), and relationships can be utilized
  
  <write code here for way 2 and output>

  // Way 2: Fetching track IDs as model instances
    let tracksLikedInstances = await like.findAll({
      where: { userId: userId },
      attributes: ['trackId'] // Even specifying attributes, the result includes model metadata
    });

        Model Instance Output:


    [
      likeInstance { dataValues: { trackId: 1 }, ... },
      likeInstance { dataValues: { trackId: 2 }, ... }
    ]

    // Extracting track IDs from model instances for simple array output

    let trackIds = tracksLikedInstances.map(instance => instance.trackId);

    Mapping Over Instances: This line uses the .map() method to transform the array of 
    model instances into an array of track IDs. The .trackId property is accessed directly 
    from each instance's dataValues, which is more straightforward because the instances are 
    full-fledged objects with direct property access.


    console.log("Way 2 Output:", trackIds);
    // Expected Output for Way 2:
    // [1, 2, 3]  
  */


  try {
    //way 1 : of geting track id
    let tracksLikedRaw = await like.findAll({
      where: { userId: userId },
      attributes: ['trackId'], // Only fetch the trackId,
      raw: true  /*this tells Sequelize to return results as plain JavaScript objects rather than instances of the model. 
        This makes handling the data simpler and more efficient if you don't need model instance methods like save(), update(), etc. */

    });

    // console.log("Way 1 Output using raw :true :", tracksLikedRaw);

    /*above we obtained the trackIds from the like table using the raw: true option in Sequelize,
     the next step is to use these trackIds to fetch detailed information about each track
     from the track model */

    //extract the trackId from each object in the array tracksLikedRaw
    let trackIds = tracksLikedRaw.map((track) => track.trackId); // Extract an array of trackIds from the raw output
    if (trackIds.length === 0) { // Check if the array is empty
      console.log("No tracks liked by user with id:", userId);
      throw new Error("No tracks liked by user");
    }
    return trackIds;// array containg trackid

  } catch (error) {
    console.log("error in extracting trackid for user ", error.message)
    throw error;

  }
}

//function to get track details for tracks liked by user from track model

async function getallLikedTracksDetails(trackids) {
  try {
    let LikedTracksDetails = await track.findAll(
      {
        where: { id: trackids },// Use the array of trackIds to filter tracks
        attributes: ['id', 'name', 'genre', 'release_year', 'artist', 'album', 'duration']
      }
    );
    return LikedTracksDetails;

  } catch (error) {
    console.error("Error fetching track details:", error);
    throw error;

  }

}
//fucntion to get all liked tracks details by user
async function getAllLikedTracks(userId) {

  try {
    //extract tarckids,which is  array of trackids
    let trackids = await getallLikedTracksIds(userId);
    console.log("liked tracks id  ", trackids);
    //use trackids array to query the track model and fetch details 
    //for all tracks that have an ID in this array
    let tracksDetails = await getallLikedTracksDetails(trackids);

    return { likedTracks: tracksDetails };

  } catch (error) {
    console.error("Error in processing liked tracks:", error);
    throw error;

  }

}

// endpoint to get all liked tracks

app.get("/users/:userId/liked", async (req, res) => {
  try {
    let userId = req.params.userId;
    let likedTracks = await getAllLikedTracks(userId);
    return res.status(200).json(likedTracks);

  } catch (error) {
    if (error.message === "No tracks liked by user") {
      return res.status(404).json({
        code: 404,
        message: "No tracks liked by user",
        error: error.message
      });

    } else if (error.message === "Error in processing liked tracks:") {
      return res.status(500).json({
        code: 500,
        message: "Error in processing liked tracks",
        error: error.message
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Internal Server Error",
        error: error.message
      });
    }

  }
})


/**
 * Exercise 4: Get All Liked Tracks by Artist

Create an endpoint /users/:id/liked-artist that will fetch all liked tracks of a user by a specific artist.

Use the getAllLikedTracksByArtists function to handle fetching liked tracks by artist.

Extract the userId from the URL parameter and artist from the query parameter.

API Call

http://localhost:3000/users/1/liked-artist?artist=Arijit%20Singh

Expected Output

{
  'likedTracks': [
    {
      'id': 1,
      'name': 'Raabta',
      'genre': 'Romantic',
      'release_year': 2012,
      'artist': 'Arijit Singh',
      'album': 'Agent Vinod',
      'duration': 4
    },
       // Other liked tracks (if any)
  ]
}

 */

//function to get track details for tracks liked by user from track model for given artist

async function getallLikedTracksDetailsByArtist(trackids, artist) {
  try {
    let LikedTracksDetails = await track.findAll(
      {
        where: { // Use the array of trackIds and artist to filter tracks
          id: trackids,
          artist: artist
        },
        attributes: ['id', 'name', 'genre', 'release_year', 'artist', 'album', 'duration']
      }
    );
    if (LikedTracksDetails.length === 0) {
      throw new Error("No  tracks found for the given artist");
    }
    return LikedTracksDetails;

  } catch (error) {
    console.error("Error fetching track details:", error);
    throw error;

  }

}
// function to get track details by artist which are liked by user
async function getAllLikedTracksByArtists(userId, artist) {
  try {
    //extract tarckids,which is  array of trackids
    let trackids = await getallLikedTracksIds(userId);
    console.log("liked tracks id  ", trackids);
    //use trackids array to query the track model and fetch details 
    //for all tracks that have an ID in this array and  are by the artist
    let trackdetails = await getallLikedTracksDetailsByArtist(trackids, artist);
    return { likedTracks: trackdetails };

  } catch (error) {
    console.error("Error in processing liked tracks:", error);
    throw error;

  }

}
//endpoint to  fetching all tracks of a artist which are liked by a user 
app.get("/users/:userId/liked-artist", async (req, res) => {
  try {
    let userId = req.params.userId;
    let artist = req.query.artist;
    let likedTracks = await getAllLikedTracksByArtists(userId, artist);
    return res.status(200).json(likedTracks);

  } catch (error) {
    if (error.message === "No tracks liked by user") {
      return res.status(404).json({
        code: 404,
        message: "No tracks liked by user",
        error: error.message
      });
    } else if (error.message === "No  tracks found for the given artist") {
      return res.status(404).json({
        code: 404,
        message: "No tracks found for the given artist",
        error: error.message
      });
    } else if (error.message === "Error in processing liked tracks:") {
      return res.status(500).json({
        code: 500,
        message: "Error in processing liked tracks",
        error: error.message
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Internal server error",
        error: error.message
      });
    }

  }
});
