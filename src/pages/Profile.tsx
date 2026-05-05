import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut, User, updateProfile } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { Lead } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import ProfileSidebar from '../sections/profile/ProfileSidebar';
import ProfileOverview from '../sections/profile/ProfileOverview';
import ProfileOrders from '../sections/profile/ProfileOrders';
import ProfileSettings from '../sections/profile/ProfileSettings';
import ProfileSupport from '../sections/profile/ProfileSupport';
import { useSiteContent } from '../content.context';
import { t } from '../content';

type Tab = 'overview' | 'orders' | 'settings' | 'support';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [displayName, setDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { locale } = useSiteContent();
  const navigate = useNavigate();

  const labels = {
    demoUserName: { az: 'Tural Rəhimov', en: 'Tural Rahimov', ru: 'Турал Рагимов', tr: 'Tural Rəhimov' },
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setDisplayName(u.displayName || '');
      } else {
        const isDemo = localStorage.getItem('demo_mode') === 'true';
        if (isDemo) {
          setDisplayName(localStorage.getItem('demo_user_name') || t(locale, labels.demoUserName));
          setIsLoading(false);
        } else {
          navigate('/login');
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const isDemo = localStorage.getItem('demo_mode') === 'true';
    if (isDemo) {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead)));
        setIsLoading(false);
      });
      return () => unsubscribe();
    }

    if (!user) return;

    const q = query(
      collection(db, 'leads'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead)));
      setIsLoading(false);
    }, (err) => {
      console.error('Error fetching orders:', err);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('demo_mode');
      localStorage.removeItem('demo_user_name');
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await updateProfile(user, { displayName });
    } catch (err) {
      console.error('Update profile error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-8 h-8 border-4 border-premium-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <ProfileSidebar 
          user={user} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          ordersCount={orders.length}
          onLogout={handleLogout}
        />

        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {activeTab === 'overview' && (
                <ProfileOverview orders={orders} onViewAll={() => setActiveTab('orders')} />
              )}
              {activeTab === 'orders' && (
                <ProfileOrders orders={orders} />
              )}
              {activeTab === 'settings' && (
                <ProfileSettings 
                  user={user} 
                  displayName={displayName} 
                  setDisplayName={setDisplayName} 
                  isSaving={isSaving} 
                  onSubmit={handleUpdateProfile} 
                />
              )}
              {activeTab === 'support' && (
                <ProfileSupport />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
