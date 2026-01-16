
import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../types';
import { X, Save, Tag, FileText, Calendar, CheckSquare, Sparkles, Loader2, Camera } from 'lucide-react';
import { getSmartRemarks } from '../services/geminiService';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<InventoryItem, 'id'> & { id?: string }) => void;
  onOpenScanner: () => void;
  editingItem?: InventoryItem;
  scannedCode?: string;
}

const ItemModal: React.FC<ItemModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onOpenScanner,
  editingItem,
  scannedCode
}) => {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    tagNumber: '',
    dateCreated: new Date().toISOString().split('T')[0],
    fileReference: '',
    dispoPlanned: '',
    disposed: false,
    remarks: ''
  });
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      setFormData({
        tagNumber: '',
        dateCreated: new Date().toISOString().split('T')[0],
        fileReference: '',
        dispoPlanned: '',
        disposed: false,
        remarks: ''
      });
    }
  }, [editingItem, isOpen]);

  useEffect(() => {
    if (scannedCode) {
      setFormData(prev => ({ ...prev, tagNumber: scannedCode }));
    }
  }, [scannedCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tagNumber || !formData.fileReference) return;
    onSave(formData as InventoryItem);
  };

  const handleSmartRemark = async () => {
    if (!formData.tagNumber || !formData.fileReference) return;
    setLoadingAi(true);
    const remark = await getSmartRemarks(formData.tagNumber, formData.fileReference);
    setFormData(prev => ({ ...prev, remarks: remark }));
    setLoadingAi(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editingItem ? 'Edit Asset Record' : 'Add New Asset'}
            </h2>
            <p className="text-sm text-slate-500">Ensure all mandatory fields are accurate for reporting.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tag Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Tag size={14} /> Tag Number
              </label>
              <div className="flex gap-2">
                <input
                  required
                  type="text"
                  placeholder="e.g. SN-99420"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
                  value={formData.tagNumber}
                  onChange={e => setFormData({ ...formData, tagNumber: e.target.value })}
                />
                <button 
                  type="button"
                  onClick={onOpenScanner}
                  className="p-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
                  title="Scan Barcode"
                >
                  <Camera size={20} />
                </button>
              </div>
            </div>

            {/* Date Created */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={14} /> Date Created
              </label>
              <input
                required
                type="date"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={formData.dateCreated}
                onChange={e => setFormData({ ...formData, dateCreated: e.target.value })}
              />
            </div>

            {/* File Reference */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} /> File Reference
              </label>
              <input
                required
                type="text"
                placeholder="e.g. DOC-2024-X"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={formData.fileReference}
                onChange={e => setFormData({ ...formData, fileReference: e.target.value })}
              />
            </div>

            {/* Dispo Planned */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={14} /> Dispo Planned
              </label>
              <input
                required
                type="date"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={formData.dispoPlanned}
                onChange={e => setFormData({ ...formData, dispoPlanned: e.target.value })}
              />
            </div>
          </div>

          {/* Disposition Status */}
          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, disposed: !formData.disposed })}
              className={`w-12 h-6 rounded-full relative transition-colors ${formData.disposed ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.disposed ? 'translate-x-6' : ''}`} />
            </button>
            <div className="flex items-center gap-2">
              <CheckSquare size={16} className={formData.disposed ? 'text-emerald-500' : 'text-slate-400'} />
              <span className="text-sm font-semibold text-slate-700">Already Disposed?</span>
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Remarks</label>
              <button
                type="button"
                onClick={handleSmartRemark}
                disabled={loadingAi || !formData.tagNumber || !formData.fileReference}
                className="text-xs flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-700 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                {loadingAi ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Generate with AI
              </button>
            </div>
            <textarea
              rows={3}
              placeholder="Enter details or notes about the item..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              value={formData.remarks}
              onChange={e => setFormData({ ...formData, remarks: e.target.value })}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
            >
              <Save size={20} />
              {editingItem ? 'Update Record' : 'Register Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemModal;
