import { ObjectId } from "mongodb";

export default [
  {
    _id: new ObjectId("60f8c0f8b8a5ca401f2fbb4e"),
    title: "Great Park Run",
    description:
      "20th anniversary of The Great Park Run, all in the name of charity. Join us , get fit, do something big.",
    date: "13th February 2025, 10:00AM",
    category: "Charity",
    attendees: [new ObjectId("60f8c0f8b8a5ca401f2fbb1b")],
    created_at: "14th January 2025, 21:56PM",
  },
  {
    _id: new ObjectId("60f8c0f8b8a5ca401f2fbb5f"),
    title: "90's Dance Party",
    description:
      "Relive the night life on the 90's , a one time event organised by us for you, featuring your favourite oldskool anthems and DJ's.",
    date: " 30th June 2025, 20:00PM",
    category: "Nightlife",
    attendees: [new ObjectId("60f8c0f8b8a5ca401f2fbb2c")],
    created_at: "14th January 2025, 22:07PM",
  },
  {
    _id: new ObjectId("60f8c0f8b8a5ca401f2fbb6d"),
    title: "Christmas Light Switch On",
    description:
      "Join the community in the town square as we kick off the festive period with our annual christmas light switch!",
    date: "1st December 2025, 18:00PM",
    category: "Festivities",
    attendees: [],
    created_at: "15th January 2025, 19:28PM",
  },
  {
    _id: new ObjectId("60f8c0f8b8a5ca401f2fbb7b"),
    title: "Cinderella At The Pantomime",
    description: "The famous fairy tale of Cinderella, retold as a theatre production here at our local pantomime!",
    date: " 5th May 2025, 16:00PM",
    category: "Theatre",
    attendees: [new ObjectId("60f8c0f8b8a5ca401f2fbb3d"), new ObjectId("60f8c0f8b8a5ca401f2fbb2c")],
    created_at: "14th January 2025, 22:07PM",
  },
];
