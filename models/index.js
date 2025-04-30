const Blog = require("./blogs");
const User = require("./users");
const ReadingList = require("./reading_list");
const DisabledJwt = require("./disabledJwt");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: "readings" });
Blog.belongsToMany(User, { through: ReadingList, as: "readingUsers" });
User.hasMany(ReadingList);
ReadingList.belongsTo(User);
Blog.hasMany(ReadingList);
ReadingList.belongsTo(Blog);

module.exports = { Blog, User, ReadingList, DisabledJwt };
