/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AndroidToastProps {
  message: string | null;
  visible: boolean;
}

export const AndroidToast: React.FC<AndroidToastProps> = ({ message, visible }) => {
  if (!visible || !message) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300">
      <div className="bg-slate-900/95 text-slate-100 border border-slate-700/80 px-4 py-2.5 rounded-full shadow-2xl text-xs font-medium max-w-sm text-center backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200">
        {message}
      </div>
    </div>
  );
};
