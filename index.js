let express = require("express");
/*
   - This line imports the Express framework, which is used to create and handle web servers and APIs in Node.js.
   - Express simplifies server creation by providing various built-in middleware and methods for routing, making it easier to handle HTTP requests and responses.
*/



const app = express();
/*
   - Here, the `app` constant is initialized as an instance of Express.
   - This creates your server object, which will be used to define routes (endpoints), middleware, and listen for incoming requests.
*/



app.use(express.json());
/*
   - This middleware is used to automatically parse incoming requests with a JSON payload.
   - Without this line, your application would not be able to handle requests containing JSON data in the request body.
   - It allows you to easily access the data sent in the request body via `req.body` in your route handlers.
   - This is especially necessary for POST and PUT requests, where data is typically sent in JSON format.
*/

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



app.get("/", (req, res) => {
  res.status(200).json({ message: "BD5.4 - CW Application" });
});


// end point to see the db
app.get("/seed_db", async (req, res) => {
  try {
    // Synchronize the database, forcing it to recreate the tables if they already exist

    await sequelize.sync({ force: true });
    // Bulk create entries in the Track table using predefined data
    await track.bulkCreate(trackData);

    // Send a 200 HTTP status code and a success message if the database is seeded successfully
    res.status(200).json({ message: "Database Seeding successful for track model using trackData" });
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




//--------------------------------- BD5.4_CW----------------------------------------//






/*
Exercise 1: Create new user

Create an endpoint /users/new that’ll create a new user record in the database.

Declare a variable named newUser to store the data from request body i.e. req.body.newUser

Create a function named addNewUser to create a new record in the database based on the request body.

API Call

http://localhost:3000/users/new

Request Body

{
  newUser: {
    username: 'testuser',
    email: 'test@gmail.com',
    password: 'testpassword'
  }
}

Expected Output:

{
  newUser: {
    id: 1
    username: 'testuser',
    email: 'test@gmail.com',
    password: 'testpassword'
  }
}
   
*/




// function to add a new user
async function addNewUser(newUser) {
  try {
    // Create a newUser in the database using Sequelize's create method.
    let result = await user.create(newUser);

    // If the result is falsy (i.e., null or undefined), throw an error.
    // Normally, if the creation was successful, result will contain the newUser data.
    if (!result) {
      throw new Error("No user created"); // Custom error message to indicate that the creation failed.
    }

    // Return the newly created user in the response.
    return { newUser: result };
  } catch (error) {
    // Log the error message if an error occurs during the creation process.
    console.log("Error in adding new User", error.message);

    // Return the error object so that it can be handled later in the request flow.
    return error;
  }
}

// Endpoint to add a new User
app.post("/users/new", async (req, res) => {
  try {


    // Extract the 'newUser' property from the request body. This contains the details of the new User to be added.
    let newUser = req.body.newUser;

    // Call the 'addNewUser' function to add the user to the database and wait for the result.
    let result = await addNewUser(newUser);

    // Send a successful response with a 200 HTTP status code and the newly created user data.
    return res.status(200).json(result);
  } catch (error) {
    // Handle the case where no user were found or created (custom error message defined in the addNewUser function).
    if (error.message === "No user created") {
      return res.status(404).json({
        code: 404,
        message: "No user created", // Response message indicating that the user creation failed.
        error: error.message, // Send the error message back to the client for further information.
      });
    } else {
      // Handle general errors, such as database connection issues or validation errors.
      return res.status(500).json({
        code: 500,
        message: "Error in adding new user", // Response message indicating an internal server error occurred.
        error: error.message, // Provide the error message to help with debugging.
      });
    }
  }
});

/*
Exercise 2: Update user data

Create a POST endpoint /users/update/:id that’ll update the current user’s record

Create a function named updateUserById that’ll update the user’s record with new data and return the new user record from the database.

API Call

http://localhost:3000/users/update/1

Request Body:

{
   'email': 'tester@gmail.com'
}

Expected Output:

{
    'message': 'User updated successfully',
    'updatedUser': {
        'id': 1,
        'username': 'testuser',
        'email': 'tester@gmail.com',
        'password': 'testpassword'
    }
}
     */

// function to update user by id
async function updateUserById(id, newData) {
  try {
    let userToBeUpdated = await user.findByPk(id);
    if (!userToBeUpdated) {
      throw new Error("User not found");
    }
    let updatedUser = await userToBeUpdated.update(newData);
    return {
      message: "User updated  successfully",
      updatedUser: updatedUser
    };

  } catch (error) {
    console.log("error in updating user ", error.message)
    throw error;

  }

}

// endpoint to update user
app.post("/user/update/:id", async (req, res) => {
  try {

    let id = parseInt(req.params.id);
    let newData = req.body;
    let result = await updateUserById(id, newData);
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({
        code: 404,
        message: "User not found",
        error: error.message
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Internal server error",
        error: error.message
      })

    }
  }
})



