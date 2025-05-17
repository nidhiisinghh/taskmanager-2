import express from 'express';
import cors from 'cors';
import { db } from './config/firebase';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Test endpoint to verify Firebase connection
app.get('/test', async (req, res) => {
  try {
    // Try to access Firestore
    const testDoc = await db.collection('test').doc('test').get();
    res.json({ 
      status: 'success', 
      message: 'Firebase connection successful',
      data: testDoc.exists ? testDoc.data() : null 
    });
  } catch (error) {
    console.error('Firebase connection error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Firebase connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 