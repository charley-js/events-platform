import { ObjectId } from "mongodb";

export default [
  {
    _id: new ObjectId("60f8c0f8b8a5ca401f2fbb1b"),
    username: "john",
    email: "johndoe@gmail.com",
    password: "password",
    events: [new ObjectId("60f8c0f8b8a5ca401f2fbb4e")],
    isMod: true,
  },
  {
    _id: new ObjectId("60f8c0f8b8a5ca401f2fbb2c"),
    username: "simon",
    email: "simonsays@gmail.com",
    password: "1234",
    events: [new ObjectId("60f8c0f8b8a5ca401f2fbb5f"), new ObjectId("60f8c0f8b8a5ca401f2fbb7b")],
    isMod: false,
  },
  {
    _id: new ObjectId("60f8c0f8b8a5ca401f2fbb3d"),
    username: "ben",
    email: "benson1@gmail.com",
    password: "abc",
    events: [new ObjectId("60f8c0f8b8a5ca401f2fbb7b")],
    isMod: false,
  },
];
