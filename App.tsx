
import React, { useState, useEffect, useCallback } from 'react';
import { InventoryItem, ViewMode } from './types';
import Dashboard from './components/Dashboard';
import InventoryTable from './components/InventoryTable';
import ItemModal from './components/ItemModal';
import Scanner from './components/Scanner';
import { LayoutDashboard, Table, PlusCircle, LogOut, Camera, Github, Database } from 'lucide-react';

const STORAGE_KEY = 'asset_flow_items';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>();
  const [scannedCode, setScannedCode] = useState<string | undefined>();

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse storage data", e);
      }
    } else {
      // Mock initial data
      const mockItems: InventoryItem[] = [
        {
          id: '1',
          tagNumber: 'ASSET-2024-001',
          dateCreated: '2024-01-15',
          fileReference: 'INV-A-101',
          dispoPlanned: '2024-06-01',
          disposed: true,
          remarks: 'Disposed safely at local facility.'
        },
        {
          id: '2',
          tagNumber: 'TAG-99120',
          dateCreated: '2024-02-10',
          fileReference: 'DOC-SEC-09',
          dispoPlanned: '2023-12-31',
          disposed: false,
          remarks: 'Overdue for pickup. Needs manager review.'
        }
      ];
      setItems(mockItems);
    }
  }, []);

  // Save to local storage whenever items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const handleAddItem = () => {
    setEditingItem(undefined);
    setScannedCode(undefined);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setScannedCode(undefined);
    setIsModalOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleToggleDisposed = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, disposed: !item.disposed } : item
    ));
  };

  const handleSaveItem = (itemData: Omit<InventoryItem, 'id'> & { id?: string }) => {
    if (itemData.id) {
      // Update
      setItems(prev => prev.map(item => item.id === itemData.id ? (itemData as InventoryItem) : item));
    } else {
      // Create
      const newItem: InventoryItem = {
        ...itemData,
        id: crypto.randomUUID(),
      } as InventoryItem;
      setItems(prev => [newItem, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleScanSuccess = (code: string) => {
    setScannedCode(code);
    setIsScannerOpen(false);
    // If modal wasn't open, open it
    if (!isModalOpen) {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Database className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">AssetFlow</h1>
        </div>

        <nav className="flex-grow px-4 space-y-2 py-4">
          <button 
            onClick={() => setView(ViewMode.DASHBOARD)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              view === ViewMode.DASHBOARD ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-semibold">Dashboard</span>
          </button>
          <button 
            onClick={() => setView(ViewMode.INVENTORY)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              view === ViewMode.INVENTORY ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Table size={20} />
            <span className="font-semibold">Inventory</span>
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Integration</p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Connected to Sheets
            </div>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-slate-400 hover:text-rose-400 transition-colors">
            <LogOut size={20} />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col overflow-hidden">
        {/* Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            {view === ViewMode.DASHBOARD ? 'Analytics Overview' : 'Manage Assets'}
          </h2>

          <div className="flex items-center gap-3">
             <button 
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all font-semibold text-sm border border-slate-200"
            >
              <Camera size={18} />
              Scan Tag
            </button>
            <button 
              onClick={handleAddItem}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-semibold text-sm shadow-md active:scale-95"
            >
              <PlusCircle size={18} />
              New Record
            </button>
          </div>
        </header>

        {/* View Container */}
        <div className="p-6 overflow-y-auto flex-grow max-w-7xl mx-auto w-full">
          {view === ViewMode.DASHBOARD ? (
            <Dashboard items={items} />
          ) : (
            <InventoryTable 
              items={items} 
              onEdit={handleEditItem} 
              onDelete={handleDeleteItem} 
              onToggleDisposed={handleToggleDisposed}
            />
          )}
        </div>

        {/* Modals & Overlay Components */}
        <ItemModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveItem}
          onOpenScanner={() => setIsScannerOpen(true)}
          editingItem={editingItem}
          scannedCode={scannedCode}
        />

        {isScannerOpen && (
          <Scanner 
            onScan={handleScanSuccess} 
            onClose={() => setIsScannerOpen(false)} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
