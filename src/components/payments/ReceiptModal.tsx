'use client';

import React from 'react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: {
    reference: string;
    clientName: string;
    coachName: string;
    amount: number;
    paymentMethod: string;
    paymentDate: string;
    nextDueDate: string;
  } | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, receiptData }) => {
  if (!isOpen || !receiptData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
        <div id="printable-receipt" className="space-y-4">
          <div className="text-center border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold tracking-tight text-emerald-400">RECIBO DE PAGO</h2>
            <p className="text-xs text-slate-400">Ref: {receiptData.reference}</p>
          </div>

          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Fecha de Pago:</span>
              <span>{receiptData.paymentDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cliente:</span>
              <span className="font-medium">{receiptData.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Entrenador a cargo:</span>
              <span>{receiptData.coachName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Método de Pago:</span>
              <span>{receiptData.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Próximo Vencimiento:</span>
              <span className="text-amber-400 font-medium">{receiptData.nextDueDate}</span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-base font-semibold">
            <span>Total Cancelado:</span>
            <span className="text-emerald-400">${receiptData.amount.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-6 flex gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500 transition"
          >
            Imprimir Recibo
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 font-medium text-slate-300 hover:bg-slate-700 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};