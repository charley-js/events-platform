import { ObjectId } from "mongodb";

export default [
  {
    _id: new ObjectId("67a11dcd6dd7bb9089aa85eb"),
    username: "staff",
    email: "schedulostaff@gmail.com",
    password: "$2a$10$1jquw4QmrPHjNpi4N.3HwOiudTnGvjKl5JvUcjc99OceDACwFJ0Jy",
    events: [],
    isMod: true,
  },
  {
    _id: new ObjectId("67a125d6fd2709b4867fb8cb"),
    username: "user",
    email: "schedulouser@gmail.com",
    password: "$2a$10$TVrcqrUKxlMZU4tL243EHe51KZ.0jtDEO4T965V.yyo8U05NTeQ3.",
    events: [],
    isMod: false,
  },
];
