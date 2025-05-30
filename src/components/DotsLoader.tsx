"use client"

import React from "react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
      <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
    </div>
  );
}