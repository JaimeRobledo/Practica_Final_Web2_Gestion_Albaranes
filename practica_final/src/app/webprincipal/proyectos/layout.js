'use client';

export default function proyectsLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white p-4">
      </div>
      <div className="flex-1 p-8">
        <main>{children}</main>
      </div>
    </div>
  );
}