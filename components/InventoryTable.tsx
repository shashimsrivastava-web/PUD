
import React from 'react';
import { InventoryItem } from '../types';
import { Edit2, Trash2, CheckCircle, Clock, FileText, Tag, Calendar, ExternalLink } from 'lucide-react';

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
  onToggleDisposed: (id: string) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ items, onEdit, onDelete, onToggleDisposed }) => {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Tag className="text-slate-300" size={40} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No assets found</h3>
        <p className="text-slate-500 mt-1 max-w-sm mx-auto">Start by adding a new tag manually or scanning a barcode from the top menu.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tag Info</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">File Reference</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dates</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Remarks</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <Tag size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 font-mono">{item.tagNumber}</div>
                      <div className="text-xs text-slate-400">Created {new Date(item.dateCreated).toLocaleDateString()}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <FileText size={16} className="text-slate-400" />
                    {item.fileReference}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar size={12} />
                      Planned: {new Date(item.dispoPlanned).toLocaleDateString()}
                    </div>
                    {new Date(item.dispoPlanned) < new Date() && !item.disposed && (
                      <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                        <Clock size={10} /> OVERDUE
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => onToggleDisposed(item.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      item.disposed 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {item.disposed ? (
                      <>
                        <CheckCircle size={14} /> Disposed
                      </>
                    ) : (
                      <>
                        <Clock size={14} /> Pending
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600 max-w-[200px] truncate" title={item.remarks}>
                    {item.remarks || <span className="text-slate-300 italic">No remarks</span>}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(item)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Item"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
        <div className="text-xs text-slate-500 font-medium">
          Showing {items.length} assets
        </div>
        <div className="flex gap-2">
           <button 
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            onClick={() => window.open('https://docs.google.com/spreadsheets/u/0/', '_blank')}
           >
             <ExternalLink size={14} />
             Open Sheets
           </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;
