'use client';

import { Button, Container, Typography, Box } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" component="p" gutterBottom>
          Generate custom flashcards instantly using AI.
        </Typography>
        <Typography variant="h6" component="p" sx={{ mb: 4 }}>
          Sign up for our Pro plan to unlock premium features.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Link href="/generate" passHref>
            <Button variant="contained" color="primary" size="large">
              Generate Flashcards
            </Button>
          </Link>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={handleCheckout}
          >
            Upgrade to Pro
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

// Stripe Checkout Handler
import getStripe from '../utils/get-stripe';

const handleCheckout = async () => {
  const stripe = await getStripe();

  const { sessionId } = await fetch('/api/checkout_sessions', {
    method: 'POST',
  }).then((res) => res.json());

  stripe.redirectToCheckout({ sessionId });
};
