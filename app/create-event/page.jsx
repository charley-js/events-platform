"use client";

import { React, useState } from "react";
import { useRouter } from "next/navigation";
import { Center, Field, FieldRequiredIndicator, Stack, Button, Heading, Box, Input, Textarea } from "@chakra-ui/react";

export default function CreateEventPage() {
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const router = useRouter();

  function handleEventCreate(event) {
    setButtonLoading(true);
    event.preventDefault();
    const newEvent = {
      title: eventTitle,
      description: eventDescription,
      date: eventDate,
      category: eventCategory,
    };
    fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Event created successfully") {
          alert("Event created successfully!");
          router.push("/events");
        } else {
          alert("Error creating event");
        }
      })
      .catch((err) => {
        console.error("Error creating event:", err);
        alert("Error creating event");
      })
      .finally(() => {
        setButtonLoading(false);
      });
  }

  return (
    <Center height={"100vh"}>
      <Stack width={"50%"} align={"center"}>
        <Heading size={"xl"}>Create Event</Heading>
        <Box width={"50%"} p={8} boxShadow="lg" borderRadius="lg" borderColor={"white"}>
          <form onSubmit={handleEventCreate}>
            <Field.Root required mb={4}>
              <Field.Label>
                Event Title:
                <FieldRequiredIndicator />
              </Field.Label>
              <Input value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
            </Field.Root>
            <Field.Root required mb={4}>
              <Field.Label>
                Event Description:
                <FieldRequiredIndicator />
              </Field.Label>
              <Textarea value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
            </Field.Root>
            <Field.Root required mb={4}>
              <Field.Label>
                Event Date:
                <FieldRequiredIndicator />
              </Field.Label>
              <input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
            </Field.Root>
            <Field.Root required mb={4}>
              <Field.Label>
                Event Category:
                <FieldRequiredIndicator />
              </Field.Label>
              <Input value={eventCategory} onChange={(e) => setEventCategory(e.target.value)} />
            </Field.Root>
            <Button loading={buttonLoading} loadingText={"Creating..."} type={"submit"}>
              Create Event
            </Button>
          </form>
        </Box>
      </Stack>
    </Center>
  );
}
