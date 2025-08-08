import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Input, Text, List, ListItem } from '@chakra-ui/react';

export default function App() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const BACKEND_URL = "http://13.232.52.162";

  useEffect(() => {
    if (query) {
      axios.get(BACKEND_URL + `/api/suggest?q=${query}`).then((res) => {
        console.log("res: ", res);
        setSuggestions(res.data);
      });
    } else {
      setSuggestions([]);
    }
  }, [query]);

  return (
    <Box h="100vh" w="100vw" bg="gray.800" display="flex" alignItems="center" justifyContent="center">
      <Box bg="gray.600" boxShadow="2xl" p={8} borderRadius="2xl" w="96">
        <Text fontSize="xl" fontWeight="bold" color="black" mb={4}>QuickSuggest</Text>
        <Input
          placeholder="Type to search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          mb={4}
          color="white"
          borderRadius="xl"
        />
        <List spacing={0} color="white">
          {suggestions.map((s, i) => (
            <ListItem
              key={i}
              p={2}
              borderBottom="1px"
              borderColor="gray.200"
              _hover={{ bg: 'gray.700' }}
            >
              {s}
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
