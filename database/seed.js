import { connect } from "./connection.js";
import userData from "./data/test-data/users.js";
import eventData from "./data/test-data/events.js";
import categoryData from "./data/test-data/categories.js";
import roleData from "./data/test-data/roles.js";
import signupData from "./data/test-data/eventSignup.js";

export const seed = async () => {
  let client;
  try {
    client = await connect();
    const db = client.db();
    await seedUsers(db, userData);
    await seedEvents(db, eventData);
    await seedCategories(db, categoryData);
    await seedRoles(db, roleData);
    await seedEventSignup(db, signupData);
    console.log("Seeding succesful.");
  } catch (error) {
    console.log("Error during seeding.", error.message);
  }
};

const seedUsers = async (db, userData) => {
  try {
    const collections = await db.listCollections({ name: "users" }).toArray();
    if (collections.length > 0) {
      await db.collection("users").drop();
      console.log("Existing 'users' collection dropped.");
    }

    await db.createCollection("users");
    console.log("Collection 'users' created.");
    const users = db.collection("users");
    await users.insertMany(userData);
    const usersDocs = await users.find().toArray();
    console.log("Contents of the 'users' collection:", usersDocs);
    console.log("'users' data added succesfully.");
  } catch (error) {
    console.log("Error whilst seeding 'users'.", error.message);
  }
};

const seedEvents = async (db, eventData) => {
  try {
    const collections = await db.listCollections({ name: "events" }).toArray();
    if (collections.length > 0) {
      await db.collection("events").drop();
      console.log("Existing 'events' collection dropped.");
    }

    await db.createCollection("events");
    console.log("Collection 'events' created.");
    const events = db.collection("events");
    await events.insertMany(eventData);
    const eventDocs = await events.find().toArray();
    console.log("Contents of the 'events' collection:", eventDocs);
    console.log("'events' data added succesfully.");
  } catch (error) {
    console.log("Error whilst seeding 'events'.", error.message);
  }
};

const seedCategories = async (db, categoryData) => {
  try {
    const collections = await db.listCollections({ name: "categories" }).toArray();
    if (collections.length > 0) {
      await db.collection("categories").drop();
      console.log("Existing 'categories' collection dropped.");
    }

    await db.createCollection("categories");
    console.log("Collection 'categories' created.");
    const categories = db.collection("categories");
    await categories.insertMany(categoryData);
    const categoryDocs = await categories.find().toArray();
    console.log("Contents of the 'categories' collection:", categoryDocs);
    console.log("'category' data added succesfully.");
  } catch (error) {
    console.log("Error whilst seeding 'categories'.", error.message);
  }
};

seed();
