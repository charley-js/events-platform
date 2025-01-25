import { ObjectId } from "mongodb";

export default [
  {
    _id: new ObjectId("60f8c0f8b8a5ca401f2fbb1b"),
    username: "john",
    email: "johndoe@gmail.com",
    password: "password",
    events: [new ObjectId("60f8c0f8b8a5ca401f2fbb4e")],
    role_id: "001",
  },
  {
    _id: new ObjectId("60f8c0f8b8a5ca401f2fbb2c"),
    username: "simon",
    email: "simonsays@gmail.com",
    password: "1234",
    events: [new ObjectId("60f8c0f8b8a5ca401f2fbb5f"), new ObjectId("60f8c0f8b8a5ca401f2fbb7b")],
    role_id: "002",
  },
  {
    _id: new ObjectId("60f8c0f8b8a5ca401f2fbb3d"),
    username: "ben",
    email: "benson1@gmail.com",
    password: "abc",
    events: [new ObjectId("60f8c0f8b8a5ca401f2fbb7b")],
    role_id: "003",
  },
];
