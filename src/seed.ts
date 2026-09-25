import { db } from './firebase';
import { collection, doc, setDoc, getDocs, writeBatch } from 'firebase/firestore';
import { MOCK_PRODUCTS, MOCK_CONCEPTS } from './mockData';

export async function seedDatabase() {
  try {
    // Check if products already exists
    const productsSnapshot = await getDocs(collection(db, 'products'));
    if (productsSnapshot.empty) {
      console.log('Seeding products...');
      const batch = writeBatch(db);
      MOCK_PRODUCTS.forEach((product) => {
        const productRef = doc(collection(db, 'products'), product.id);
        batch.set(productRef, {
          ...product,
          createdAt: new Date().toISOString()
        });
      });
      await batch.commit();
      console.log('Products seeded.');
    }

    // Check if concepts already exists
    const conceptsSnapshot = await getDocs(collection(db, 'teambuilding_concepts'));
    if (conceptsSnapshot.empty) {
      console.log('Seeding teambuilding concepts...');
      const batch = writeBatch(db);
      MOCK_CONCEPTS.forEach((concept) => {
        const conceptRef = doc(collection(db, 'teambuilding_concepts'), concept.id);
        batch.set(conceptRef, {
          ...concept,
          createdAt: new Date().toISOString()
        });
      });
      await batch.commit();
      console.log('Concepts seeded.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
