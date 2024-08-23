'use client';

import React, { useEffect } from 'react';
import { Button, Container, Typography, Box, Paper } from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { styled } from '@mui/system';

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  fontWeight: 'bold',
  padding: '12px 24px',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundColor: theme.palette.primary?.dark || '#0056b3',
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: 'url(/images/hero-bg.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: '#fff',
  padding: '100px 0',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    padding: '80px 0',
  },
}));

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/flashcards'); // Redirect to flashcards page if already signed in
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <Container maxWidth="md" sx={{ padding: 0 }}>
      <HeroSection>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h4" component="p" gutterBottom>
          Generate custom flashcards instantly using AI.
        </Typography>
        <Typography variant="h6" component="p" sx={{ mb: 4 }}>
          Sign up for our Pro plan to unlock premium features.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link href="/flashcards" passHref>
              <StyledButton variant="contained" color="primary">
                Generate Flashcards
              </StyledButton>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link href="/sign-in" passHref>
              <StyledButton variant="contained" color="secondary">
                Sign In
              </StyledButton>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link href="/sign-up" passHref>
              <StyledButton variant="contained" color="secondary">
                Sign Up
              </StyledButton>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link href="/result" passHref>
              <StyledButton
                variant="outlined"
                color = "secondary"
                onClick={handleCheckout}
              >
                Upgrade to Pro
              </StyledButton>
            </Link>
          </motion.div>
        </Box>
      </HeroSection>
    </Container>
  );
}

// Stripe Checkout Handler
import getStripe from '../utils/get-stripe';

const handleCheckout = async () => {
  const stripe = await getStripe();

  const { sessionId } = await fetch('/result', {
    method: 'POST',
  }).then((res) => res.json());

  stripe.redirectToCheckout({ sessionId });
};
