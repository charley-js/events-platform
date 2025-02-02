import { React, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Alert, Stack, Text, Button, ButtonGroup, Center } from "@chakra-ui/react";
import { Tag } from "../components/ui/tag";

export default function EventCard({ event, isMod, fetchEvents }) {
  const [attendees, setAttendees] = useState(event.attendees);
  const [signupLoading, setSignupLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "" });
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");
  const eventId = event._id;
  const router = useRouter();

  function handleClick() {
    router.push(`events/${eventId}`);
  }

  function handleSignup() {
    setSignupLoading(true);
    if (!userId || !accessToken) {
      setSignupLoading(false);
      setAlert({ message: "Log in and Google authentication required", status: "error" });
      return;
    }
    if (attendees.includes(userId)) {
      setSignupLoading(false);
      setAlert({ message: "You are already signed up for this event", status: "error" });
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
          setAlert({ message: "Signed up and added to Google Calendar", status: "success" });
        } else {
          setAlert({ message: "Failed to sign up for event", status: "error" });
        }
      })
      .finally(() => {
        setSignupLoading(false);
      });
  }

  function handleEditEvent(event) {
    event.stopPropagation();
    setEditLoading(true);
    router.push(`/edit-event/${eventId}`);
  }

  function handleDeleteEvent(event) {
    event.stopPropagation();
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
          setAlert({ message: "Event deleted", status: "success" });
          fetchEvents();
          setTimeout(() => {
            router.replace("/events");
          }, 3000);
        } else {
          setAlert({ message: "Failed to delete event", status: "error" });
        }
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  }

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      p={4}
      maxWidth="350px"
      margin="auto"
      cursor="pointer"
      onClick={handleClick}
    >
      {alert.message && (
        <Alert.Root zindex={9999} status={alert.status} top={4}>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{alert.status === "error" ? "Error!" : "Success!"}</Alert.Title>
            <Alert.Description>{alert.message}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}
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
              <Button
                colorPalette="blue"
                onClick={(event) => handleEditEvent(event)}
                loading={editLoading}
                loadingText={"Loading..."}
              >
                Edit
              </Button>
              <Button
                colorPalette="red"
                onClick={(event) => handleDeleteEvent(event)}
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
