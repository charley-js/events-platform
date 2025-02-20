import { React, useState, useContext } from "react";
import { SessionContext } from "../context/SessionContext";
import { useRouter } from "next/navigation";
import { Box, Alert, Stack, Text, Button, ButtonGroup, Center, Flex, Badge, Separator, Image } from "@chakra-ui/react";
import { Tag } from "../components/ui/tag";
import { FaEdit, FaTrash, FaUsers, FaMapMarkerAlt } from "react-icons/fa";
import Cookies from "js-cookie";
import { useGoogleLogin } from "@react-oauth/google";

export default function EventCard({ event, isMod, fetchEvents }) {
  const [attendees, setAttendees] = useState(event.attendees);
  const [signupLoading, setSignupLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "" });
  const { userId } = useContext(SessionContext);
  const eventId = event._id;
  const router = useRouter();

  const googleLogin = useGoogleLogin({
    onSuccess: (res) => {
      setSignupLoading(true);
      handleSignup(res.access_token);
    },
    onError: (error) => {
      setSignupLoading(false);
      console.error("Google login failed:", error);
      setAlert({ message: "Authentication failed", status: "error" });
      setTimeout(() => {
        setAlert({ message: "", status: "" });
      }, 3000);
    },
    scope: "https://www.googleapis.com/auth/calendar",
  });

  function handleClick() {
    router.push(`events/${eventId}`);
  }

  function handleSignup(accessToken) {
    if (!userId) {
      setSignupLoading(false);
      setAlert({ message: "Log in required", status: "error" });
      setTimeout(() => {
        setAlert({ message: "", status: "" });
      }, 1500);
      return;
    }
    if (attendees.includes(userId)) {
      setSignupLoading(false);
      setAlert({ message: "You are already signed up for this event", status: "error" });
      setTimeout(() => {
        setAlert({ message: "", status: "" });
      }, 1500);
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
          setTimeout(() => {
            setAlert({ message: "", status: "" });
          }, 1500);
        } else {
          setAlert({ message: "Failed to sign up for event", status: "error" });
          setTimeout(() => {
            setAlert({ message: "", status: "" });
          }, 1500);
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
          setTimeout(() => {
            setAlert({ message: "", status: "" });
          }, 1500);
          fetchEvents();
        } else {
          setAlert({ message: "Failed to delete event", status: "error" });
          setTimeout(() => {
            setAlert({ message: "", status: "" });
          }, 1500);
        }
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  }

  return (
    <Box
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="lg"
      p={5}
      maxWidth="450px"
      h="100%"
      bgGradient="linear(to-r, gray.900, gray.800)"
      color="white"
      _hover={{ transform: "scale(1.02)", transition: "0.3s ease-in-out" }}
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
      {event.imageUrl && (
        <Image src={event.imageUrl} alt={event.title} borderRadius="md" mb={3} maxHeight={100} htmlWidth={"100%"} />
      )}

      <Stack spacing={4}>
        <Flex justify="space-between" align="center">
          <Text fontSize="xl" fontWeight="bold">
            {event.title}
          </Text>
          <Badge colorScheme="green" fontSize="sm" p={1} borderRadius="lg">
            <FaUsers /> {event.attendees.length}
          </Badge>
        </Flex>

        <Tag size="lg" variant="solid" colorPalette={"red"} width="fit" mb={2}>
          {event.category}
        </Tag>

        <Separator borderColor="gray.600" />

        <Text noOfLines={2} opacity={0.8} paddingTop={2} paddingBottom={2}>
          {event.description}
        </Text>

        <Box background={"gray.800"} padding={3} borderRadius={20}>
          <Text fontSize="sm" opacity={0.7} paddingTop={2}>
            📅 {new Date(event.date).toLocaleDateString()}
          </Text>
          <Text fontSize="sm" opacity={0.7}>
            ⏰ {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
          </Text>
          <Text fontSize="sm" opacity={0.7}>
            <FaMapMarkerAlt style={{ display: "inline", marginRight: "5px" }} />
            {event.venue}
          </Text>
        </Box>

        <Text fontSize="sm" opacity={0.5}>
          Created on: {new Date(event.created_at).toLocaleDateString()}
        </Text>

        {userId && (
          <Center>
            <Button
              width={"45%"}
              colorPalette="red"
              onClick={(event) => {
                event.stopPropagation();
                googleLogin();
              }}
              loading={signupLoading}
              loadingText={"Loading..."}
              _hover={{ bg: "pink" }}
              disabled={attendees.includes(userId)}
            >
              Sign Up
            </Button>
          </Center>
        )}

        {isMod && (
          <Center>
            <ButtonGroup mt={4} gap={1}>
              <Button
                bg={"none"}
                onClick={(event) => handleEditEvent(event)}
                loading={editLoading}
                loadingText={"Loading..."}
                _hover={{ bg: "white" }}
              >
                <FaEdit color={"blue"} _hover={{ color: "white" }} />
              </Button>
              <Button
                bg={"none"}
                onClick={(event) => handleDeleteEvent(event)}
                _hover={{ bg: "white" }}
                loading={deleteLoading}
                loadingText={"Deleting..."}
              >
                <FaTrash color="red" _hover={{ color: "white" }} />
              </Button>
            </ButtonGroup>
          </Center>
        )}
      </Stack>
    </Box>
  );
}
