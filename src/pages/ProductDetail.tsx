import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MOCK_PRODUCTS } from '../mockData';
import TechnicalQuestionsModal from '../components/TechnicalQuestionsModal';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Product } from '../types';
import ProductGallery from '../sections/product/ProductGallery';
import ProductInfo from '../sections/product/ProductInfo';
import ProductRelated from '../sections/product/ProductRelated';
import { useCart } from '../hooks/useCart';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dbRelatedProducts, setDbRelatedProducts] = useState<Product[]>([]);
  const { addItem } = useCart();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(data);
          
          if (data.relatedProducts && data.relatedProducts.length > 0) {
            const q = query(collection(db, 'products'), where('id', 'in', data.relatedProducts));
            const relatedSnap = await getDocs(q);
            setDbRelatedProducts(relatedSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
          }
        } else {
          const mock = MOCK_PRODUCTS.find(p => p.id === id);
          if (mock) {
            setProduct(mock);
            setDbRelatedProducts(MOCK_PRODUCTS.filter(p => mock.relatedProducts.includes(p.id)));
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-8 h-8 border-4 border-premium-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Məhsul tapılmadı</h2>
        <Link to="/" className="text-black underline mt-4 block">Kataloqa qayıt</Link>
      </div>
    );
  }

  const handleAddToCart = (answers: Record<string, string>) => {
    addItem({ productId: product.id, quantity: 1, technicalAnswers: answers });
    setIsModalOpen(false);
    navigate('/cart');
  };

  return (
    <div className="space-y-12 pb-20">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-premium-orange transition-colors group">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Kataloqa qayıt
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <ProductGallery product={product} />
        <ProductInfo product={product} onOpenModal={() => setIsModalOpen(true)} />
      </div>

      <ProductRelated relatedProducts={dbRelatedProducts} />

      <TechnicalQuestionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAddToCart}
        productName={product.name}
        category={product.category}
      />
    </div>
  );
}
