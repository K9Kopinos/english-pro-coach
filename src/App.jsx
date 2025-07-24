import React from 'react';
import Dashboard from './components/Dashboard';
import Lesson from './components/Lesson';
import Chat from './components/Chat';

export default function App() {
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">English Pro Coach</h1>
      <Dashboard />
      <Lesson />
      <Chat />
    </main>
  );
}
