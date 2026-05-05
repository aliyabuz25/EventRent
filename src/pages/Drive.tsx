import React, { useState, useEffect } from 'react';
import { Share2, Upload, FileText, Eye, Download, Trash2, Link as LinkIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, increment, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { cn } from '../lib/utils';
import { SharedFile } from '../types';

export default function Drive() {
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [clientName, setClientName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const q = query(collection(db, 'files'), orderBy('expiryDate', 'desc'));
      const snapshot = await getDocs(q);
      const fileList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SharedFile));
      setFiles(fileList);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !clientName) return;

    setIsUploading(true);
    setError(null);

    try {
      const storageRef = ref(storage, `drive/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7); // 7 days expiry

      await addDoc(collection(db, 'files'), {
        name: file.name,
        link: downloadUrl,
        views: 0,
        expiryDate: expiryDate.toISOString(),
        clientName,
        uploadedBy: 'Admin'
      });

      setClientName('');
      fetchFiles();
    } catch (err: any) {
      setError(err.message || 'Fayl yüklənərkən xəta baş verdi');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Faylı silmək istədiyinizə əminsiniz?')) return;
    try {
      await deleteDoc(doc(db, 'files', id));
      fetchFiles();
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };

  const handleView = async (id: string, link: string) => {
    try {
      await updateDoc(doc(db, 'files', id), {
        views: increment(1)
      });
      window.open(link, '_blank');
      fetchFiles();
    } catch (err) {
      console.error('Error updating view count:', err);
    }
  };

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Eventrent Drive</h1>
        <p className="text-gray-500 max-w-2xl">
          Müştərilərinizə brendli linklərlə fayllar göndərin. Təqdimatlar, PDF-lər və digər sənədlər üçün.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Upload Section */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-black/5 sticky top-24">
            <h3 className="text-xl font-bold mb-6">Yeni Fayl Yüklə</h3>
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Müştəri Adı</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                  placeholder="Məs: Coca-Cola"
                />
              </div>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleUpload}
                  disabled={isUploading || !clientName}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className={cn(
                    "w-full flex flex-col items-center justify-center gap-4 p-12 border-2 border-dashed border-gray-100 rounded-3xl cursor-pointer transition-all hover:border-black hover:bg-gray-50",
                    (isUploading || !clientName) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center shadow-xl shadow-black/10">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-900">Faylı seçin</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, PPT, DOCX (Max 10MB)</p>
                  </div>
                </label>
              </div>
              {isUploading && (
                <div className="space-y-2">
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-black animate-pulse w-1/2" />
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase text-center">Yüklənir...</p>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-500 rounded-xl text-xs font-medium">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Files List */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Yüklənmiş Fayllar</h3>
          {files.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {files.map(file => (
                <div key={file.id} className="group bg-white border border-gray-100 rounded-2xl p-6 flex items-center gap-6 transition-all hover:border-gray-200 hover:shadow-lg">
                  <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">{file.name}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{file.clientName}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {file.views} baxış
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleView(file.id, file.link)}
                      className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition-all"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(file.link);
                        alert('Link kopyalandı!');
                      }}
                      className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition-all"
                    >
                      <LinkIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(file.id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-3xl">
              <p className="text-gray-500 font-medium">Hələ fayl yüklənməyib</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
