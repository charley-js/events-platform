import { ObjectId } from "mongodb";

export default [
  {
    _id: new ObjectId("679d1d562f9f097591e2c343"),
    username: "staff",
    email: "schedulostaff@gmail.com",
    password: "$2b$10$i7QCDAtNgnj277kkZo9/i.4KVuONJs6sCAiOsUtkg2C8RyFyCfKN.",
    events: [],
    isMod: true,
  },
  {
    _id: new ObjectId("679d1de02f9f097591e2c344"),
    username: "test-user",
    email: "user@gmail.com",
    password: "$2b$10$VJYisB0SBG2IUF3zNgCyiORrYnZtEKWvn7QKK/dTj12FMBeB5JnNO",
    events: [],
    isMod: false,
  },
];
