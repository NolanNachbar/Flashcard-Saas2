'use client'; // Client Component

import React, { useEffect } from "react";
import { Container, Box, Typography } from "@mui/material";
import { SignUp, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  // Redirection to flashcards after signup
  useEffect(() => {
    if (isSignedIn) {
      router.push('/flashcards'); // Redirect to flashcards page
    }
  }, [isSignedIn, router]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          minWidth: "100vw",
          position: "absolute",
          top: 0,
          left: 0,
          backgroundImage: 'url("/bg3.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "#fff",
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px",
            background: "rgba(0, 0, 0, 0.7)",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <Typography variant="h2" sx={{ mb: 4 }}>
            Sign Up to Get Started
          </Typography>
          <SignUp />
        </Container>
      </Box>
    </>
  );
}
