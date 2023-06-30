import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

function useMouseLocation(ref: React.RefObject<HTMLElement>) {
  // implement me!
  const [mouseLocation, setMouseLocation] = useState({ x: 0, y: 0 });

  const handleMouseLocation = (e: any) => {
    const rect = e.target.getBoundingClientRect();
    const left = window.getComputedStyle(e.target).left;
    const top = window.getComputedStyle(e.target).top;
    if (left !== "0px" || top !== "0px") {
      return;
    }
    setMouseLocation({
      x: Math.floor(e.clientX - rect.left),
      y: Math.floor(e.clientY - rect.top)
    });
  };
  useEffect(() => {
    const currentRef = ref.current;
    if (currentRef === null) {
      return;
    }
    currentRef.addEventListener("mousemove", handleMouseLocation);

    return () => {
      currentRef.removeEventListener("mousemove", handleMouseLocation);
    };
  });

  return mouseLocation;
}

export default function One() {
  const ref = React.createRef<HTMLDivElement>();

  // ❗ This our target API
  const { x, y } = useMouseLocation(ref);

  return (
    <>
      <Box
        h="350px"
        w="full"
        bg="red.200"
        rounded="xl"
        position="relative"
        mt={6}
        _hover={{
          shadow: "lg"
        }}
        ref={ref}
      >
        <Text
          position="absolute"
          p={2}
          background="gray.600"
          rounded="md"
          color="gray.100"
          fontSize="sm"
          fontWeight="bold"
          style={{ left: x + 5, top: y + 5 }}
        >
          x: {x}, y: {y}
        </Text>
      </Box>
      <Text color="gray.500" fontSize="sm" mt="4" textAlign="center">
        Display the current x and y coordinate on hover.
      </Text>
    </>
  );
}
