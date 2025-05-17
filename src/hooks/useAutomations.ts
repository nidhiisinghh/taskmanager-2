import { useState, useEffect } from 'react';
import { Automation } from '../types/automation';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const useAutomations = (projectId: string) => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'automations'),
      where('projectId', '==', projectId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const automationsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Automation[];
        setAutomations(automationsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching automations:', error);
        setError('Failed to fetch automations');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [projectId]);

  const addAutomation = async (automation: Omit<Automation, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date().toISOString();
      const automationData = {
        ...automation,
        createdAt: now,
        updatedAt: now,
      };
      await addDoc(collection(db, 'automations'), automationData);
    } catch (error) {
      console.error('Error adding automation:', error);
      throw new Error('Failed to add automation');
    }
  };

  const updateAutomation = async (id: string, updates: Partial<Automation>) => {
    try {
      const docRef = doc(db, 'automations', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating automation:', error);
      throw new Error('Failed to update automation');
    }
  };

  const deleteAutomation = async (id: string) => {
    try {
      const docRef = doc(db, 'automations', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting automation:', error);
      throw new Error('Failed to delete automation');
    }
  };

  return {
    automations,
    loading,
    error,
    addAutomation,
    updateAutomation,
    deleteAutomation,
  };
}; 