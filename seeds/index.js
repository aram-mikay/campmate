const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelper");

mongoose.connect("mongodb://localhost:27017/campmate", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const sampleData = (arr) => arr[Math.floor(Math.random() * arr.length)];

//creating dummy seed data to work with
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let index = 0; index < 400; index++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20 + 10);
    const camp = new Campground({
      author: "60905a17aa0b58a3f1c0fbf5",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sampleData(descriptors)} ${sampleData(places)}`,
      images: [
        {
          url:
            "https://res.cloudinary.com/dakftzrsd/image/upload/v1620239058/CampMate/vmstkvyt5mrinl7c4gld.jpg",
          filename: "CampMate/vmstkvyt5mrinl7c4gld",
        },
        {
          url:
            "https://res.cloudinary.com/dakftzrsd/image/upload/v1620239061/CampMate/phf6pm4nwdl5dy0glipp.jpg",
          filename: "CampMate/phf6pm4nwdl5dy0glipp",
        },
        {
          url:
            "https://res.cloudinary.com/dakftzrsd/image/upload/v1620239068/CampMate/oykyp19x5fsguokgdu3j.jpg",
          filename: "CampMate/oykyp19x5fsguokgdu3j",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia hic neque sed, vel quae odit aliquam illo perferendis nesciunt obcaecati maxime dicta officia soluta minima pariatur reiciendis nulla adipisci quas facilis, ad voluptatem provident quidem ipsam voluptatum. Inventore rem consectetur aut, odit aspernatur optio, rerum nisi quos magni molestiae nobis.",
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
    });

    await camp.save();
  }
};

//seed and close DB
seedDB().then(() => {
  mongoose.connection.close(() => {
    console.log("SEED ENDED");
  });
});
