import React from 'react'

function Footer() {
  return (
    <div className="text-center mt-20">
      <div className="inline-flex items-center gap-2 py-3 px-6 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
        <span className="text-slate-400 text-sm">Part of the</span>
        <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          NepLoom
        </span>
        <span className="text-slate-400 text-sm">ecosystem</span>
      </div>
    </div>
  );
}

export default Footer