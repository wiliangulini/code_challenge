import { ReactNode } from 'react'

export const Modal = ({ children, onClose }: { children: ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-xl">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500">✖</button>
      {children}
    </div>
  </div>
)