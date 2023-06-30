import {
  chakra,
  Box,
  Input,
  Flex,
  Heading,
  Text,
  VStack,
  Image,
  HStack
} from "@chakra-ui/react";
import { useDebounce } from "use-debounce";
import React, { useEffect, useState } from "react";

// putting this here as a guide for what the API returns
// and what you need from it.
interface Show {
  score: number;
  show: {
    id: number;
    name: string;
    type: string;
    genres: string[];
    image?: {
      medium: string;
    };
    summary: string;
  };
}

interface ShowCardProps {
  show: Show;
}

const Genre = chakra("span", {
  baseStyle: {
    display: "inline-flex",
    verticalAlign: "top",
    boxAlign: "center",
    alignItems: "center",
    maxWidth: "100%",
    lineHeight: "1.2",
    outline: "transparent solid 1px",
    outlineOffset: "2px",
    minH: "1.25rem",
    maxH: "1.25rem",
    fontWeight: "medium",
    fontSize: "xs",
    px: "2",
    borderRadius: "full",
    bg: "gray.100",
    color: "gray.800"
  }
});

function ShowCard({ show }: ShowCardProps) {
  // 💡 use this link below for placeholder images.
  // "https://via.placeholder.com/112x157.png?text=No+image"

  // 💡 A few hints:
  // genres use the Tag component
  // loading placeholders use the Skeleton component
  // both from @chakra-ui/react
  // use the docs: https://chakra-ui.com/docs/getting-started
  return (
    <Flex
      w="full"
      borderWidth="1px"
      rounded="lg"
      overflow="hidden"
      shadow="sm"
      _hover={{
        cursor: "pointer",
        shadow: "lg"
      }}
    >

      <Image
        src={
          show.show.image
            ? show.show.image.medium
            : "https://via.placeholder.com/112x157.png?text=No+image"
        }
        w="28"
        roundedTopLeft="lg"
        roundedBottomLeft="lg"
        alt="Dan Abramov"
      />
      <Box ml={4} py={4} pr={4}>
        <HStack>
          {show.show.genres.map((genre: string, index: number) => (
            <Genre key={index}>{genre}</Genre>
          ))}
        </HStack>
        <Heading as="h2" fontSize="md" mt={2} color="gray.600">
          {show.show.name}
        </Heading>
        <Text
          mt={2}
          fontSize="small"
          color="gray.500"
          overflow="hidden"
          noOfLines={2}
          dangerouslySetInnerHTML={{ __html: show.show.summary }}
        />
      </Box>
    </Flex>
  );
}

export default function Two() {
  const [search, setSearch] = useState("");
  const [shows, setShows] = useState([]);
  const [searchValue] = useDebounce(search, 1000);
  const [showsValue] = useDebounce(shows, 1000);

  // I've debounced the input for you just
  // use 'searchValue' to trigger a request to the search API
  // https://api.tvmaze.com/search/shows?q=:searchValue

  console.log(searchValue);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        `https://api.tvmaze.com/search/shows?q=${searchValue}`
      ).then((res) => res.json());
      setShows(data);
    };
    fetchData();
  }, [searchValue]);

  return (
    <Box>
      <Input
        type="text"
        placeholder="Search for a TV show"
        onChange={handleSearch}
      />
      {showsValue.length === 0 ? (
        <Text p={6} textAlign="center" color="gray.500">
          {searchValue !== ""
            ? `No results for "${searchValue}"`
            : "Nothing here. Try searching for a TV show above!"}
        </Text>
      ) : (
        <VStack spacing={4} mt={6}>
          {showsValue.map((show: Show) => (
            <ShowCard key={show.show.id} show={show} />
          ))}
        </VStack>
      )}
    </Box>
  );
}
