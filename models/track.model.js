let { sequelize, DataTypes } = require("../lib/index");

// Defines a model representing the 'Track' table with its structure
let track = sequelize.define("track", {
  name: DataTypes.TEXT, //// Defines a text column for the track name
  artist: DataTypes.TEXT,
  album: DataTypes.TEXT,
  genre: DataTypes.TEXT,
  duration: DataTypes.INTEGER,
  release_year: DataTypes.INTEGER, // Defines an integer column for the release year
});
// Makes the Track model available elsewhere in the application
module.exports = {track};
