"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "/app/firebase-config";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  CircularProgress,
} from "@mui/material";

export default function ViewCards() {
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    async function fetchCollections() {
      // Fetch user data to get collections
      // Replace `userId` with the actual user ID
      const docRef = doc(db, "users", "userId");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCollections(data.collections || []);
      } else {
        console.error("No collections found");
      }
      setLoading(false);
    }

    fetchCollections();
  }, []);

  useEffect(() => {
    async function fetchFlashcards() {
      if (!selectedCollection) return;
      // Fetch flashcards based on the selected collection
      const collectionRef = collection(db, "users", "userId", "flashcards");
      const docSnap = await getDoc(collectionRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFlashcards(data.flashcards.filter((card) => card.collection === selectedCollection) || []);
      }
    }

    fetchFlashcards();
  }, [selectedCollection]);

  const handleCollectionChange = (event) => {
    setSelectedCollection(event.target.value);
  };

  const handlePreviousCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : flashcards.length - 1));
  };

  const handleNextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex < flashcards.length - 1 ? prevIndex + 1 : 0));
  };

  const handleGoBack = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <Typography variant="h4" gutterBottom>
        View Flashcards
      </Typography>
      <Select
        value={selectedCollection}
        onChange={handleCollectionChange}
        displayEmpty
        sx={{ marginBottom: 2, width: "100%" }}
      >
        <MenuItem value="" disabled>Select a Collection</MenuItem>
        {collections.map((collection) => (
          <MenuItem key={collection.id} value={collection.id}>
            {collection.name}
          </MenuItem>
        ))}
      </Select>
      {selectedCollection && flashcards.length > 0 && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "20px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {flashcards[currentIndex].front}
          </Typography>
          <Typography variant="body1">
            {flashcards[currentIndex].back}
          </Typography>
          <Box sx={{ marginTop: 2, display: "flex", gap: 2 }}>
            <Button onClick={handlePreviousCard}>Previous</Button>
            <Button onClick={handleNextCard}>Next</Button>
          </Box>
        </Box>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoBack}
        sx={{ marginTop: 2 }}
      >
        Go Back
      </Button>
    </Container>
  );
}
