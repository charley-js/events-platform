import React from "react";

export default function eventCard(title, description, date, category, attendees, created_at) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <p>Date: {new Date(date).toLocaleDateString()}</p>
      <p>Category: {category}</p>
      <p>{attendees.length} Attending</p>
      <p>Created on: {new Date(created_at).toLocaleDateString()}</p>
    </div>
  );
}
