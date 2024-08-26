"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "/app/firebase-config";
import { useRouter } from "next/navigation";

import {
  Container,
  Card,
  Grid,
  Box,
  Button,
  TextField,
  Typography,
  CardActionArea,
  CardContent,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useAuth, useUser, SignOutButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function Flashcards() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [flashcards, setFlashcards] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [newCollection, setNewCollection] = useState("");
  const [fullName, setFullName] = useState("");
  const router = useRouter();
  const [newFlashcard, setNewFlashcard] = useState({
    front: "",
    back: "",
    collection: "",
  });
  const [prompt, setPrompt] = useState("");
  const [flippedCards, setFlippedCards] = useState({});
  const [editingFlashcard, setEditingFlashcard] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      setFullName(user?.fullName || "User");
      setLoading(false);
    } else {
      setFullName("Guest");
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    async function getData() {
      if (!user) return;
      const docRef = doc(db, "users", user.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFlashcards(data.flashcards || []);
        setCollections(data.collections || []);
      } else {
        await setDoc(docRef, { flashcards: [], collections: [] });
      }
    }
    if (user) {
      getData();
    }
  }, [user]);

  const goHome = () => {
    router.push("/");
  };

  const handleCardClick = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleFlashcardSubmit = async (e) => {
    e.preventDefault();
    if (!newFlashcard.front || !newFlashcard.back) return;

    let updatedFlashcards;
    if (editingFlashcard) {
      updatedFlashcards = flashcards.map((card) =>
        card.id === editingFlashcard.id
          ? { ...newFlashcard, id: card.id }
          : card
      );
    } else {
      const newFlashcardWithId = {
        ...newFlashcard,
        id: Date.now().toString(),
        collection: selectedCollection,
      };
      updatedFlashcards = [...flashcards, newFlashcardWithId];
    }

    setFlashcards(updatedFlashcards);
    setNewFlashcard({ front: "", back: "", collection: "" });
    setEditingFlashcard(null);

    // Update Firestore
    if (user) {
      const docRef = doc(db, "users", user.id);
      await setDoc(docRef, { flashcards: updatedFlashcards }, { merge: true });
    }
  };

  const handleAddCollection = async () => {
    if (!newCollection.trim()) return;
    const newCollectionWithId = {
      id: Date.now().toString(),
      name: newCollection.trim(),
    };
    const updatedCollections = [...collections, newCollectionWithId];
    setCollections(updatedCollections);
    setNewCollection("");

    // Update Firestore
    if (user) {
      const docRef = doc(db, "users", user.id);
      await setDoc(docRef, { collections: updatedCollections }, { merge: true });
    }
  };

  const handleSelectCollection = (collectionId) => {
    setSelectedCollection(collectionId);
  };

  const handleGenerateFlashcards = async () => {
    if (!prompt || !isSignedIn) return;
    console.log("Prompt value before API call:", prompt);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      console.error("Error fetching flashcards:", response.statusText);
      return;
    }

    try {
      const data = await response.json();
      if (data.flashcards) {
        const newFlashcardsWithIds = data.flashcards.map((card) => ({
          ...card,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          collection: selectedCollection,
        }));
        const updatedFlashcards = [...flashcards, ...newFlashcardsWithIds];
        setFlashcards(updatedFlashcards);

        // Update Firestore
        if (user) {
          const docRef = doc(db, "users", user.id);
          await setDoc(docRef, { flashcards: updatedFlashcards }, { merge: true });
        }
      } else {
        console.error("No flashcards found in response:", data);
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };

  // ... (other functions remain unchanged)

  if (loading) {
    return (
      <div className="loader-wrapper">
        <span className="loader"></span>
        <style jsx>{`
          .loader-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #121212;
          }

          .loader {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: inline-block;
            border-top: 3px solid #fff;
            border-right: 3px solid transparent;
            box-sizing: border-box;
            animation: rotation 1s linear infinite;
          }
          @keyframes rotation {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        backgroundImage: 'url("/bg-purple-white.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        minHeight: "100vh",
        paddingBottom: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        sx={{
          borderBottom: "1px solid #333",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <Button
          onClick={goHome}
          sx={{
            textTransform: "none",
            backgroundColor: "transparent",
            "&:hover": { backgroundColor: "#eaeaea" },
          }}
        >

        <img src="/favicon.ico" alt="Logo" style={{ height: "120px" }} />


        </Button>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body1" fontWeight="bold">
            {fullName}
          </Typography>
          {isSignedIn ? (
            <SignOutButton
              signOutCallback={() => {
                router.push("/sign-in");
              }}
            >
              <Button
                variant="outlined"
                sx={{
                  color: "#0070f3",
                  borderColor: "#0070f3",
                  "&:hover": { borderColor: "#005bb5", color: "#005bb5" },
                }}
              >
                Sign Out
              </Button>
            </SignOutButton>
          ) : (
            <Button
              onClick={() => router.push("/sign-in")}
              variant="outlined"
              sx={{
                color: "#0070f3",
                borderColor: "#0070f3",
                "&:hover": { borderColor: "#005bb5", color: "#005bb5" },
              }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Box>
            <Typography variant="h6" gutterBottom>
                Sign in for access to a flashcard generating AI!
        </Typography>
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        {/* Flashcard Generation Feature (only for signed-in users) */}
        {isSignedIn && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: "20px" }}
          >
            <Card
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "#fff",
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
                backdropFilter: "blur(10px)",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Generate Flashcards
                </Typography>
                <TextField
                  label="Enter prompt"
                  fullWidth
                  multiline
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  sx={{
                    marginBottom: 2,
                    backgroundColor: "#fff",
                    borderRadius: 1,
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGenerateFlashcards}
                  disabled={!prompt}
                >
                  Generate Flashcards
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              color: "#fff",
              p: 3,
              boxShadow: 3,
              borderRadius: 2,
              backdropFilter: "blur(10px)",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Create a New Flashcard
              </Typography>
              <form onSubmit={handleFlashcardSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Front"
                      fullWidth
                      value={newFlashcard.front}
                      onChange={(e) =>
                        setNewFlashcard({ ...newFlashcard, front: e.target.value })
                      }
                      required
                      sx={{
                        backgroundColor: "#fff",
                        borderRadius: 1,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Back"
                      fullWidth
                      value={newFlashcard.back}
                      onChange={(e) =>
                        setNewFlashcard({ ...newFlashcard, back: e.target.value })
                      }
                      required
                      sx={{
                        backgroundColor: "#fff",
                        borderRadius: 1,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Collection"
                      fullWidth
                      value={selectedCollection}
                      onChange={(e) => handleSelectCollection(e.target.value)}
                      sx={{
                        backgroundColor: "#fff",
                        borderRadius: 1,
                      }}
                    >
                      {collections.map((collection) => (
                        <MenuItem key={collection.id} value={collection.id}>
                          {collection.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="New Collection"
                      fullWidth
                      value={newCollection}
                      onChange={(e) => setNewCollection(e.target.value)}
                      sx={{
                        backgroundColor: "#fff",
                        borderRadius: 1,
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddCollection}
                      sx={{
                        marginTop: 1,
                        color: "#0070f3",
                        borderColor: "#0070f3",
                        "&:hover": { borderColor: "#005bb5", color: "#005bb5" },
                      }}
                    >
                      Add Collection
                    </Button>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2 }}
                >
                  {editingFlashcard ? "Update Flashcard" : "Add Flashcard"}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2, marginLeft: 2 }}
                  onClick={() => router.push("/viewcards")}
                >
                  View All Cards
                </Button>

              </form>
            </CardContent>
          </Card>
        </motion.div>


        {/* Flashcard Display Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginTop: "20px" }}
        >
          <Grid container spacing={2}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCardClick(index)}
                >
                  <Card
                    sx={{
                      backgroundColor: flippedCards[index]
                        ? "rgba(0, 0, 0, 0.8)"
                        : "rgba(255, 255, 255, 0.8)",
                      color: flippedCards[index] ? "#fff" : "#000",
                      p: 2,
                      minHeight: 150,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 2,
                      boxShadow: 3,
                      textAlign: "center",
                    }}
                  >
                    {flippedCards[index] ? flashcard.back : flashcard.front}
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Container>
  );
}
