import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  type = 'danger' 
}) => {
  const isDanger = type === 'danger';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDanger ? 'bg-red-500/10' : 'bg-primary-violet/10'}`}>
          <AlertTriangle className={`h-8 w-8 ${isDanger ? 'text-red-500' : 'text-primary-violet'}`} />
        </div>
        <p className="text-muted mb-8 leading-relaxed">
          {message}
        </p>
        <div className="flex w-full gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-bg-deep border border-main text-main rounded-2xl font-bold hover:bg-main/5 transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-6 py-3 text-white rounded-2xl font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${
              isDanger 
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
                : 'bg-primary-violet hover:bg-primary-purple shadow-primary-violet/20'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
