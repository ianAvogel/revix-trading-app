"use client"
import React, { useState } from "react"

export default function TourModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-3xl p-4">
        <div className="bg-white rounded-md overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="font-medium">Watch Tour</div>
            <button onClick={onClose} aria-label="Close">✕</button>
          </div>
          <div className="p-4">
            <div className="aspect-video bg-black">
              {/* For MVP, use an embedded sample video or scroller */}
              <video controls className="w-full h-full">
                <source src="/demo-tour.mp4" type="video/mp4" />
                <track kind="captions" src="/demo-tour.vtt" srcLang="en" label="English" default />
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Captions: <em>Demo tour captions</em></p>
          </div>
        </div>
      </div>
    </div>
  )
}
