'use client'

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Maximize2, Pause, Play, Search, Volume2, Share2 } from "lucide-react"

export default function StreamingUI() {
  const [recording, setRecording] = useState(false)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const stopStreamTracks = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
  }, [stream])

  useEffect(() => {
    async function startWebcam() {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        setStream(newStream)
        if (videoRef.current) {
          videoRef.current.srcObject = newStream
        }
      } catch (error) {
        console.error("Error accessing webcam:", error)
      }
    }

    startWebcam()

    return stopStreamTracks
  }, [stopStreamTracks])

  const handleStartRecording = () => {
    if (stream) {
      const newMediaRecorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      newMediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      newMediaRecorder.onstop = () => {
        setRecordedChunks(chunks)
      }

      newMediaRecorder.start()
      setMediaRecorder(newMediaRecorder)
      setRecording(true)
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      setRecording(false)
    }
  }

  const handlePlayback = () => {
    const recordedBlob = new Blob(recordedChunks, { type: "video/webm" })
    const recordedUrl = URL.createObjectURL(recordedBlob)
    const video = document.createElement("video")
    video.src = recordedUrl
    video.controls = true
    document.body.appendChild(video)
  }

  const handleShare = () => {
    // Implement sharing functionality here
    console.log("Sharing functionality to be implemented")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">StreamFlix Live</h1>
          <nav className="hidden md:flex space-x-4">
            <Button variant="ghost" className="rounded-full">Home</Button>
            <Button variant="ghost" className="rounded-full">TV Shows</Button>
            <Button variant="ghost" className="rounded-full">Movies</Button>
            <Button variant="ghost" className="rounded-full">New & Popular</Button>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <Avatar className="rounded-full">
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="aspect-video bg-gray-800 rounded-3xl overflow-hidden relative mb-8 shadow-lg">
          {stream ? (
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-xl text-gray-400">Loading webcam...</p>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button size="icon" variant="ghost" className="rounded-full">
                  <Play className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full">
                  <Pause className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full">
                  <Volume2 className="h-5 w-5" />
                </Button>
              </div>
              <Slider className="w-1/2" />
              <Button size="icon" variant="ghost" className="rounded-full">
                <Maximize2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <Button
            className={`rounded-full ${!recording ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500'}`}
            onClick={handleStartRecording}
            disabled={recording}
          >
            Start Recording
          </Button>
          <Button
            className={`rounded-full ${recording ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500'}`}
            onClick={handleStopRecording}
            disabled={!recording}
          >
            Stop Recording
          </Button>
          <Button
            className="rounded-full bg-green-500 hover:bg-green-600"
            onClick={handlePlayback}
            disabled={recordedChunks.length === 0}
          >
            Playback
          </Button>
          <Button
            className="rounded-full bg-purple-500 hover:bg-purple-600"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-4">Your Live Stream</h2>
            <p className="text-gray-300 mb-4">
              Share your live stream with your audience. Start recording to save your stream for later viewing.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Recommended Streams</h3>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-gray-800 hover:bg-gray-700 transition-colors rounded-2xl overflow-hidden">
                  <CardContent className="p-2">
                    <div className="aspect-video bg-blue-900 rounded-xl mb-2"></div>
                    <p className="text-sm font-medium">Live Stream {i}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-16 p-4 text-center text-gray-400">
        <p>&copy; 2023 StreamFlix Live. All rights reserved.</p>
      </footer>
    </div>
  )
}