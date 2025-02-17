"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Center, Box, Heading, Text, Spinner, Image, Separator } from "@chakra-ui/react";
import { Tag } from "../../../components/ui/tag";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/events?_id=${id}`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch((err) => console.error("Error fetching event:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Center height={"100vh"} width={"100%"}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!event) {
    return (
      <Center height={"100vh"} width={"100%"}>
        <Text fontSize="xl">Event not found</Text>
      </Center>
    );
  }

  const attendeesCount = event.attendees ? event.attendees.length : 0;

  return (
    <Center height="100vh">
      <Box
        borderWidth="1px"
        borderRadius="xl"
        overflow="hidden"
        boxShadow="lg"
        p={5}
        w="80%"
        h="100%"
        bgGradient="linear(to-r, gray.900, gray.800)"
        color="white"
      >
        {event.imageUrl && (
          <Image src={event.imageUrl} alt={event.title} borderRadius="md" mb={3} maxHeight={300} htmlWidth={"100%"} />
        )}
        <Heading fontSize={"3xl"} mb={4}>
          {event.title}
        </Heading>
        <Tag size={"xl"} variant="solid" colorPalette={"red"} width="fit" mb={4}>
          {event.category}
        </Tag>
        <Separator borderColor="gray.600" />
        <Text fontSize="lg" mt={4} mb={6}>
          {event.description}
        </Text>
        <Box background={"gray.800"} padding={3} borderRadius={20} w={"40%"} mb={4}>
          <Text fontSize="lg" opacity={0.7} paddingTop={2}>
            📅 {new Date(event.date).toLocaleDateString()}
          </Text>
          <Text fontSize="lg" opacity={0.7}>
            ⏰ {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
          </Text>
          <Text fontSize="lg" opacity={0.7}>
            <FaMapMarkerAlt style={{ display: "inline", marginRight: "5px" }} />
            {event.venue}
          </Text>
        </Box>
        <Text opacity={0.5} fontStyle={"italic"}>
          {event.attendees.length} currently attending.
        </Text>
      </Box>
    </Center>
  );
}
