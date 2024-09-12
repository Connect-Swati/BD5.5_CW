// Import Sequelize ORM and DataTypes object to define model attributes
const { DataTypes, sequelize } = require("../lib/index");

// Import user and track models to establish relationships
let { user } = require("./user.model");
let { track } = require("./track.model");

// Define the 'like' model to represent a many-to-many relationship between users and tracks
let like = sequelize.define("like", {
    userId: {
        type: DataTypes.INTEGER, // Specifies the data type for the userId
        references: {
            model: user, // Establishes a foreign key relationship with the 'user' model
            key: "id"    // Specifies that the userId will reference the 'id' column in the 'user' model
        }
    },
    trackId: {
        type: DataTypes.INTEGER, // Specifies the data type for the trackId
        references: {
            model: track, // Establishes a foreign key relationship with the 'track' model
            key: "id"     // Specifies that the trackId will reference the 'id' column in the 'track' model
        }
    }
});

// Set up a many-to-many relationship through the 'like' junction table
user.belongsToMany(track, { through: like }); // Indicates that a user can like many tracks
track.belongsToMany(user, { through: like }); // Indicates that a track can be liked by many users

// Export the 'like' model to be available in other parts of the application
module.exports = { like };
