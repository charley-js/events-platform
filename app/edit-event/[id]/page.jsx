"use client";
import { React, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Center, Field, Stack, Button, Heading, Box, Input, Textarea } from "@chakra-ui/react";

export default function EditEventPage() {
  const params = useParams();
  const eventId = params.id;

  const router = useRouter();
  const [eventInfo, setEventInfo] = useState({
    title: "",
    description: "",
    date: "",
    category: "",
  });

  useEffect(() => {
    console.log("Event ID", eventId);
    fetch(`/api/events?_id=${eventId}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setEventInfo({
          title: data.title,
          description: data.description,
          date: data.date,
          category: data.category,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [eventId]);

  function handleChange(event) {
    const { name, value } = event.target;
    setEventInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    fetch(`/api/events?_id=${eventId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventInfo),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Event updated successfully") {
          alert("Event updated successfully!");
          router.push(`/events`);
        } else {
          alert("Failed to update event.");
        }
      })
      .catch((err) => {
        console.error("Error updating event", err);
        alert("Error updating event.");
      });
  }

  return (
    <Center height={"100vh"}>
      <Stack width={"50%"} align={"center"}>
        <Heading size={"xl"}>Edit Event</Heading>
        <Box width={"50%"} p={8} boxShadow="lg" borderRadius="lg" borderColor={"white"}>
          <form onSubmit={handleSubmit}>
            <Field.Root mb={4}>
              <Field.Label>Event Title:</Field.Label>
              <Input value={eventInfo.title} onChange={handleChange} name={"title"} />
            </Field.Root>
            <Field.Root mb={4}>
              <Field.Label>Event Description:</Field.Label>
              <Textarea value={eventInfo.description} onChange={handleChange} name={"description"} />
            </Field.Root>
            <Field.Root mb={4}>
              <Field.Label>Event Date:</Field.Label>
              <input type="datetime-local" value={eventInfo.date} onChange={handleChange} name={"date"} />
            </Field.Root>
            <Field.Root mb={4}>
              <Field.Label>Event Category:</Field.Label>
              <Input value={eventInfo.category} onChange={handleChange} name={"category"} />
            </Field.Root>
            <Button type={"submit"}>Edit Event</Button>
          </form>
        </Box>
      </Stack>
    </Center>
  );
}
