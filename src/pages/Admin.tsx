import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, TrendingUp, CheckCircle2, Clock, FileText, ChevronDown, Filter, Search, MoreVertical, Trash2, Mail, Phone, Calendar, MapPin, Plus, Package, Target, LogIn, Lock, AlertCircle, Eye, X as CloseIcon, Info, User as UserIcon } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, updateDoc, doc, deleteDoc, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { cn } from '../lib/utils';
import { Lead, LeadStatus, Product, TeambuildingConcept } from '../types';
import { MOCK_PRODUCTS, MOCK_CONCEPTS } from '../mockData';
import { format } from 'date-fns';
import ContentStudio from '../components/ContentStudio';

type AdminTab = 'leads' | 'products' | 'teambuilding' | 'content';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo.error;
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [concepts, setConcepts] = useState<TeambuildingConcept[]>(MOCK_CONCEPTS);
  
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Forms State
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '', category: '', description: '', technicalSpecs: {}, images: [''], tags: [], relatedProducts: []
  });

  const [showConceptForm, setShowConceptForm] = useState(false);
  const [conceptForm, setConceptForm] = useState<Partial<TeambuildingConcept>>({
    name: '', description: '', participantCount: '', isIndoor: true, purpose: '', tags: []
  });

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (u) {
        // Check user role from Firestore
        const userRef = doc(db, 'users', u.uid);
        onSnapshot(userRef, (snap) => {
          if (snap.exists() && snap.data().role === 'admin') {
            setUser(u);
          } else if (u.email === 'alex.sago@gmail.com') {
            // Backup for the main admin
            setUser(u);
          } else {
            setUser(null);
            setGlobalError('Giriş qadağandır. Siz admin deyilsiniz.');
          }
        });
      } else {
        const isDemo = localStorage.getItem('demo_mode') === 'true';
        if (isDemo) {
          setUser({ displayName: 'Admin (Demo)', email: 'admin@red.az', uid: 'demo_admin' } as any);
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    const qLeads = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubLeads = onSnapshot(qLeads, (snapshot) => {
      setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead)));
      setIsLoading(false);
    }, (err) => {
      setGlobalError(handleFirestoreError(err, OperationType.GET, 'leads'));
      setIsLoading(false);
    });

    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const dbProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      // Only use db products if available
      setProducts(dbProducts.length > 0 ? dbProducts : MOCK_PRODUCTS);
    }, (err) => {
      setGlobalError(handleFirestoreError(err, OperationType.GET, 'products'));
    });

    const unsubConcepts = onSnapshot(collection(db, 'teambuilding_concepts'), (snapshot) => {
      const dbConcepts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeambuildingConcept));
      setConcepts(dbConcepts.length > 0 ? dbConcepts : MOCK_CONCEPTS);
    }, (err) => {
      setGlobalError(handleFirestoreError(err, OperationType.GET, 'teambuilding_concepts'));
    });

    return () => {
      unsubLeads();
      unsubProducts();
      unsubConcepts();
    };
  }, [user]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const updateStatus = async (id: string, status: LeadStatus) => {
    try {
      await updateDoc(doc(db, 'leads', id), { status });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `leads/${id}`);
    }
  };

  const deleteLead = async (id: string) => {
    if (!window.confirm('Bu sorğunu silmək istədiyinizə əminsiniz?')) return;
    try {
      await deleteDoc(doc(db, 'leads', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `leads/${id}`);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), {
        ...productForm,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: serverTimestamp()
      });
      setShowProductForm(false);
      setProductForm({ name: '', category: '', description: '', technicalSpecs: {}, images: [''], tags: [], relatedProducts: [] });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'products');
    }
  };

  const handleAddConcept = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'teambuilding_concepts'), {
        ...conceptForm,
        id: 'c' + Math.random().toString(36).substr(2, 9),
        createdAt: serverTimestamp()
      });
      setShowConceptForm(false);
      setConceptForm({ name: '', description: '', participantCount: '', isIndoor: true, purpose: '', tags: [] });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'teambuilding_concepts');
    }
  };

  const filteredLeads = leads.filter(l => {
    const matchesFilter = filter === 'all' || l.status === filter;
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || 
                         l.email.toLowerCase().includes(search.toLowerCase()) ||
                         l.phone.includes(search);
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    won: leads.filter(l => l.status === 'won').length,
    conversion: leads.length > 0 ? Math.round((leads.filter(l => l.status === 'won').length / leads.length) * 100) : 0
  };

  const statusColors: Record<LeadStatus, string> = {
    new: 'bg-blue-50 text-blue-600 border-blue-100',
    contacted: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    quoted: 'bg-purple-50 text-purple-600 border-purple-100',
    won: 'bg-green-50 text-green-600 border-green-100',
    lost: 'bg-red-50 text-red-600 border-red-100'
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-40 space-y-8">
        <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto">
          <Lock className="w-10 h-10 text-gray-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Admin Girişi</h2>
          <p className="text-gray-500">Bu səhifəyə daxil olmaq üçün autentifikasiya tələb olunur.</p>
        </div>
        <button
          onClick={() => {
            localStorage.setItem('demo_mode', 'true');
            localStorage.setItem('demo_user_name', 'Admin (Demo)');
            window.location.reload();
          }}
          className="w-full flex items-center justify-center gap-3 bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-black/10"
        >
          <LogIn className="w-5 h-5" />
          Admin kimi daxil ol
        </button>
      </div>
    );
  }

  if (globalError) {
    return (
      <div className="max-w-md mx-auto text-center py-40 space-y-6">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold">Giriş qadağandır</h2>
        <p className="text-gray-500">Sizin bu məlumatları görmək üçün kifayət qədər icazəniz yoxdur.</p>
        <p className="text-xs text-gray-400 bg-gray-50 p-4 rounded-xl break-all">{globalError}</p>
        <button onClick={() => window.location.reload()} className="text-black font-bold underline">Yenidən yoxla</button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Admin Panel</h1>
          <p className="text-gray-500">Sistemi və sorğuları idarə edin.</p>
        </div>
        <div className="flex bg-white border border-gray-100 rounded-2xl p-1 shadow-xl shadow-black/5">
          <button
            onClick={() => setActiveTab('leads')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              activeTab === 'leads' ? "bg-black text-white" : "text-gray-400 hover:text-black"
            )}
          >
            <FileText className="w-4 h-4" /> Sorğular
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              activeTab === 'products' ? "bg-black text-white" : "text-gray-400 hover:text-black"
            )}
          >
            <Package className="w-4 h-4" /> Kataloq
          </button>
          <button
            onClick={() => setActiveTab('teambuilding')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              activeTab === 'teambuilding' ? "bg-black text-white" : "text-gray-400 hover:text-black"
            )}
          >
            <Users className="w-4 h-4" /> Teambuilding
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              activeTab === 'content' ? "bg-black text-white" : "text-gray-400 hover:text-black"
            )}
          >
            <LayoutDashboard className="w-4 h-4" /> Content
          </button>
        </div>
      </header>

      {activeTab === 'leads' && (
        <div className="space-y-12">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Ümumi Sorğular', value: stats.total, icon: FileText, color: 'text-gray-400' },
              { label: 'Yeni Sorğular', value: stats.new, icon: Clock, color: 'text-blue-500' },
              { label: 'Qazanılmış', value: stats.won, icon: CheckCircle2, color: 'text-green-500' },
              { label: 'Konversiya', value: `${stats.conversion}%`, icon: TrendingUp, color: 'text-purple-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl shadow-black/5">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50", stat.color)}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Leads Table */}
          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-2xl shadow-black/5">
            <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ad, email və ya telefon..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400 mr-2" />
                {(['all', 'new', 'contacted', 'quoted', 'won', 'lost'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                      filter === s 
                        ? "bg-black border-black text-white" 
                        : "bg-white border-gray-100 text-gray-400 hover:text-black hover:border-gray-300"
                    )}
                  >
                    {s === 'all' ? 'Hamısı' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Müştəri</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tədbir</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Məhsullar</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Əməliyyat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredLeads.map(lead => (
                    <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-6">
                        <div className="space-y-1">
                          <p className="font-bold text-gray-900">{lead.name}</p>
                          <div className="flex flex-col gap-1">
                            <a href={`mailto:${lead.email}`} className="text-xs text-gray-400 hover:text-black flex items-center gap-1.5">
                              <Mail className="w-3 h-3" /> {lead.email}
                            </a>
                            <a href={`tel:${lead.phone}`} className="text-xs text-gray-400 hover:text-black flex items-center gap-1.5">
                              <Phone className="w-3 h-3" /> {lead.phone}
                            </a>
                            {lead.userId && (
                              <span className="text-[10px] text-gray-300 flex items-center gap-1.5">
                                <UserIcon className="w-3 h-3" /> UID: {lead.userId.slice(0, 8)}...
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                            <Calendar className="w-3.5 h-3.5 text-gray-300" />
                            {lead.eventDate ? format(new Date(lead.eventDate), 'dd MMM yyyy') : 'Tarix yoxdur'}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <MapPin className="w-3.5 h-3.5" />
                            {lead.location || 'Məkan yoxdur'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex -space-x-2 overflow-hidden">
                          {lead.items.map((item, idx) => {
                            const product = products.find(p => p.id === item.productId);
                            return (
                              <div key={idx} className="group/item relative">
                                <div className="h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400 overflow-hidden">
                                  {product?.images?.[0] ? (
                                    <img src={product.images[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  ) : (
                                    idx + 1
                                  )}
                                </div>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-[10px] rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-all pointer-events-none z-50 transform translate-y-2 group-hover/item:translate-y-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="w-4 h-4 rounded bg-white/20 flex items-center justify-center">
                                      <Package className="w-2.5 h-2.5" />
                                    </div>
                                    <span className="font-bold">{product?.name || 'Naməlum'}</span>
                                  </div>
                                  <div className="flex justify-between gap-4 text-[9px] opacity-70">
                                    <span>Kateqoriya: {product?.category}</span>
                                    <span>Miqdar: {item.quantity} ədəd</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="relative group/status">
                          <select
                            value={lead.status}
                            onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)}
                            className={cn(
                              "appearance-none px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer focus:outline-none transition-all pr-8",
                              statusColors[lead.status]
                            )}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="quoted">Quoted</option>
                            <option value="won">Won</option>
                            <option value="lost">Lost</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-50" />
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedLead(lead)}
                            className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                            title="Detallı bax"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => deleteLead(lead.id)}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Məhsullar ({products.length})</h2>
            <button 
              onClick={() => setShowProductForm(true)}
              className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all"
            >
              <Plus className="w-4 h-4" /> Yeni Məhsul
            </button>
          </div>

          {showProductForm && (
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-2xl shadow-black/5 animate-in fade-in slide-in-from-top-4">
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <input
                    required
                    placeholder="Məhsul adı"
                    value={productForm.name}
                    onChange={e => setProductForm({...productForm, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                  />
                  <input
                    required
                    placeholder="Kateqoriya"
                    value={productForm.category}
                    onChange={e => setProductForm({...productForm, category: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                  />
                  <textarea
                    required
                    placeholder="Təsvir"
                    rows={4}
                    value={productForm.description}
                    onChange={e => setProductForm({...productForm, description: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all resize-none"
                  />
                </div>
                <div className="space-y-4">
                  <input
                    placeholder="Şəkil URL"
                    value={productForm.images?.[0]}
                    onChange={e => setProductForm({...productForm, images: [e.target.value]})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                  />
                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-black text-white py-3 rounded-xl font-bold">Yadda saxla</button>
                    <button type="button" onClick={() => setShowProductForm(false)} className="px-6 py-3 border border-gray-100 rounded-xl font-bold">Ləğv et</button>
                  </div>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4">
                <img src={product.images[0]} className="w-16 h-16 rounded-xl object-cover" referrerPolicy="no-referrer" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">{product.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'teambuilding' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Teambuilding Konseptləri ({concepts.length})</h2>
            <button
              onClick={() => setShowConceptForm(true)}
              className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all"
            >
              <Plus className="w-4 h-4" /> Yeni Konsept
            </button>
          </div>

          {showConceptForm && (
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-2xl shadow-black/5 animate-in fade-in slide-in-from-top-4">
              <form onSubmit={handleAddConcept} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <input
                    required
                    placeholder="Konsept adı"
                    value={conceptForm.name}
                    onChange={e => setConceptForm({...conceptForm, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                  />
                  <input
                    required
                    placeholder="İştirakçı sayı (məs: 20-50)"
                    value={conceptForm.participantCount}
                    onChange={e => setConceptForm({...conceptForm, participantCount: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                  />
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-bold text-gray-400">Məkan:</label>
                    <button
                      type="button"
                      onClick={() => setConceptForm({...conceptForm, isIndoor: true})}
                      className={cn("px-4 py-2 rounded-lg text-xs font-bold", conceptForm.isIndoor ? "bg-black text-white" : "bg-gray-50")}
                    >Indoor</button>
                    <button
                      type="button"
                      onClick={() => setConceptForm({...conceptForm, isIndoor: false})}
                      className={cn("px-4 py-2 rounded-lg text-xs font-bold", !conceptForm.isIndoor ? "bg-black text-white" : "bg-gray-50")}
                    >Outdoor</button>
                  </div>
                </div>
                <div className="space-y-4">
                  <textarea
                    required
                    placeholder="Təsvir"
                    rows={3}
                    value={conceptForm.description}
                    onChange={e => setConceptForm({...conceptForm, description: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all resize-none"
                  />
                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-black text-white py-3 rounded-xl font-bold">Yadda saxla</button>
                    <button type="button" onClick={() => setShowConceptForm(false)} className="px-6 py-3 border border-gray-100 rounded-xl font-bold">Ləğv et</button>
                  </div>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {concepts.map(concept => (
              <div key={concept.id} className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">{concept.name}</h4>
                  <p className="text-xs text-gray-400">{concept.participantCount} iştirakçı • {concept.isIndoor ? 'Indoor' : 'Outdoor'}</p>
                </div>
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-white",
                  concept.isIndoor ? "bg-blue-500" : "bg-green-500"
                )}>
                  <Target className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'content' && <ContentStudio />}
      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedLead(null)} />
          <div className="relative bg-white w-full max-w-2xl rounded-4xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", statusColors[selectedLead.status])}>
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Sorğu Detalları</h3>
                  <p className="text-xs text-gray-400">ID: {selectedLead.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8 custom-scrollbar">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Users className="w-3 h-3" /> Müştəri Məlumatları
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-gray-900">{selectedLead.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <a href={`mailto:${selectedLead.email}`} className="text-sm text-gray-600 hover:text-black">{selectedLead.email}</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <a href={`tel:${selectedLead.phone}`} className="text-sm text-gray-600 hover:text-black">{selectedLead.phone}</a>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Tədbir Məlumatları
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {selectedLead.eventDate ? format(new Date(selectedLead.eventDate), 'dd MMMM yyyy') : 'Tarix qeyd edilməyib'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-gray-600">{selectedLead.location || 'Məkan qeyd edilməyib'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Package className="w-3 h-3" /> Sifariş Edilən Məhsullar
                </h4>
                <div className="space-y-3">
                  {selectedLead.items.map((item, idx) => {
                    const product = products.find(p => p.id === item.productId);
                    return (
                      <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden">
                          {product?.images?.[0] ? (
                            <img src={product.images[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <Package className="w-6 h-6 text-gray-200" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-gray-900">{product?.name || 'Naməlum Məhsul'}</h5>
                          <p className="text-xs text-gray-400">{product?.category || 'Kateqoriya yoxdur'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">{item.quantity} ədəd</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              {selectedLead.note && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-3 h-3" /> Əlavə Qeydlər
                  </h4>
                  <div className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-2xl text-sm text-gray-700 leading-relaxed">
                    {selectedLead.note}
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Statusu Dəyiş</p>
                <div className="flex flex-wrap gap-2">
                  {(['new', 'contacted', 'quoted', 'won', 'lost'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedLead.id, s)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                        selectedLead.status === s 
                          ? "bg-black border-black text-white" 
                          : "bg-white border-gray-200 text-gray-400 hover:border-black hover:text-black"
                      )}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
