import { React, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Flex, Stack, Text, Button, ButtonGroup, Center } from "@chakra-ui/react";
import { Tag } from "../components/ui/tag";

export default function EventCard({ event, isMod }) {
  const [attendees, setAttendees] = useState(event.attendees);
  const [signupLoading, setSignupLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");
  const eventId = event._id;
  const router = useRouter();

  function handleSignup() {
    setSignupLoading(true);
    if (!userId || !accessToken) {
      setSignupLoading(false);
      alert("Log in and Google authentication required");
      return;
    }
    if (attendees.includes(userId)) {
      setSignupLoading(false);
      alert("You are already signed up for this event");
      return;
    }
    fetch(`/api/event-signup`, {
      cache: "no-store",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, eventId, accessToken }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.message === "Event added to Google Calendar") {
          setAttendees([...attendees, userId]);
          alert("Signed up and added to Google Calendar");
        } else {
          alert("Failed to sign up for event");
        }
      })
      .finally(() => {
        setSignupLoading(false);
      });
  }

  function handleEditEvent() {
    setEditLoading(true);
    router.push(`/edit-event/${eventId}`);
  }

  function handleDeleteEvent() {
    setDeleteLoading(true);
    fetch(`/api/events?_id=${eventId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.message === "Event deleted succesfully") {
          alert("Event deleted");
        } else {
          alert("Failed to delete event");
        }
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="md" p={4} maxWidth="350px" margin="auto">
      <Stack spacing={4}>
        <Text fontSize="xl" fontWeight="bold">
          {event.title}
        </Text>
        <Tag size="sm">{event.category}</Tag>
        <Text>{event.description}</Text>
        <Text fontSize="sm" color="gray">
          {new Date(event.date).toLocaleDateString()}
        </Text>
        <Text>{event.attendees.length} Attending</Text>
        <Text fontSize="sm" color="gray.400" mb={"4"}>
          Created on: {new Date(event.created_at).toLocaleDateString()}
        </Text>
        <Center>
          <Button width={"50%"} onClick={handleSignup} loading={signupLoading} loadingText={"Signing up..."}>
            Sign up
          </Button>
        </Center>

        {isMod && (
          <Center>
            <ButtonGroup gap={6}>
              <Button colorPalette="blue" onClick={handleEditEvent} loading={editLoading} loadingText={"Loading..."}>
                Edit
              </Button>
              <Button
                colorPalette="red"
                onClick={handleDeleteEvent}
                loading={deleteLoading}
                loadingText={"Deleting..."}
              >
                Delete
              </Button>
            </ButtonGroup>
          </Center>
        )}
      </Stack>
    </Box>
  );
}
