"use client";
import { React, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, Heading, Box, Stack, Text, HStack, Center, Spinner, Image, Separator } from "@chakra-ui/react";
import { Avatar } from "../../components/ui/avatar";
import { Tag } from "../../components/ui/tag";
import { FaMapMarkerAlt } from "react-icons/fa";
import Cookies from "js-cookie";

export default function Dashboard() {
  const [user, setUser] = useState({});
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userId = Cookies.get("userId");
    if (!userId) {
      router.push("/login");
      return;
    }
    fetch(`/api/users?_id=${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => router.push("/login"));

    fetch(`/api/events?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => {
        setEvents([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Center height={"100vh"} width={"100%"}>
        <Spinner size="xl" speed="0.8s" />
      </Center>
    );
  }
  return (
    <Box p={6}>
      <Card.Root
        mb={10}
        p={2}
        borderRadius="xl"
        boxShadow="lg"
        bg={"gray.950"}
        w={{ base: "350px", lg: "800px", md: "600px" }}
      >
        <CardBody>
          <HStack mb={4} gap={3}>
            <Avatar size={"2xl"} name={user.username} src="" colorPalette={"blue"} />
            <Heading ml={4} fontSize={{ base: "lg", lg: "3xl", md: "2xl", sm: "xl" }}>
              Welcome, {user.username}!
            </Heading>
          </HStack>

          <Stack ml={24} mt={-7}>
            <Text>{user.email}</Text>
            <Tag colorPalette="red" variant="solid" fontSize="2xl" size={"lg"} width={"fit"} mb={6}>
              Attending {user.events ? user.events.length : 0} events
            </Tag>
            <Text fontSize={"sm"} fontStyle={"italic"} opacity={0.5}>
              Member since {new Date(user.created_at).toLocaleDateString()}.
            </Text>
          </Stack>
        </CardBody>
      </Card.Root>
      <Center>
        <Card.Root p={5} borderRadius="lg" boxShadow="md" bg="gray.950" w={{ base: "500px", lg: "900px", md: "700px" }}>
          <CardBody>
            <Heading fontSize={{ base: "xl", lg: "3xl" }} mb={8} textAlign={"center"}>
              Your Events
            </Heading>
            {events.length > 0 ? (
              events.map((event) => (
                <Card.Root
                  key={event._id}
                  mb={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  transition="transform 0.2s ease-in-out"
                  _hover={{ transform: "scale(1.02)", boxShadow: "2xl" }}
                  bg={"gray.900"}
                  w={{ base: "400px", lg: "700px", md: "600px" }}
                  mx={"auto"}
                  maxWidth={"100%"}
                >
                  <CardBody>
                    {event.imageUrl && (
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        borderRadius="md"
                        mb={3}
                        maxHeight={100}
                        htmlWidth={"100%"}
                      />
                    )}
                    <Heading size="lg" mb={2}>
                      {event.title}
                    </Heading>
                    <Tag size={"lg"} colorPalette={"red"} variant={"solid"} w={"fit"} mb={4}>
                      {event.category}
                    </Tag>
                    <Separator borderColor="gray.600" />
                    <Text mt={2} mb={4}>
                      {event.description}
                    </Text>
                    <Box
                      background={"gray.800"}
                      padding={2}
                      borderRadius={20}
                      w={{ base: "150px", lg: "650px", md: "500px" }}
                      mb={4}
                    >
                      <Text fontSize="md" opacity={0.7} paddingTop={2}>
                        📅 {new Date(event.date).toLocaleDateString()}
                      </Text>
                      <Text fontSize="md" opacity={0.7}>
                        ⏰{" "}
                        {new Date(event.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </Text>
                      <Text fontSize="md" opacity={0.7}>
                        <FaMapMarkerAlt style={{ display: "inline", marginRight: "5px" }} />
                        {event.venue}
                      </Text>
                    </Box>
                    <Text fontSize="sm" mt={1}>
                      {event.attendees.length} Attending
                    </Text>
                  </CardBody>
                </Card.Root>
              ))
            ) : (
              <Text color="gray.500">No events available.</Text>
            )}
          </CardBody>
        </Card.Root>
      </Center>
    </Box>
  );
}
