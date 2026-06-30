'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getScanInfo, lookupRegistration, markAttended } from '@/app/actions/scan';
import { Registration } from '@/types/event';

type ScanState = 'scanning' | 'found' | 'not_found' | 'admitted' | 'denied' | 'already_attended';

export default function ScanPage() {
  const params = useParams();
  const eventId = params?.id as string;

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  const [eventTitle, setEventTitle] = useState('Event');
  const [attendedCount, setAttendedCount] = useState(0);
  const [scanState, setScanState] = useState<ScanState>('scanning');
  const [scannedReg, setScannedReg] = useState<Registration | null>(null);
  const [cameraError, setCameraError] = useState('');

  useEffect(() => {
    getScanInfo(eventId).then((info) => {
      if (info) {
        setEventTitle(info.title);
        setAttendedCount(info.attendedCount);
      }
    });
  }, [eventId]);

  const stopScan = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
  }, []);

  const startScan = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let active = true;

    async function tick() {
      if (!active || !video || !canvas || video.readyState < 2) {
        if (active) rafRef.current = requestAnimationFrame(tick);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx!.drawImage(video, 0, 0);

      const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
      const jsQR = (await import('jsqr')).default;
      const result = jsQR(imageData.data, imageData.width, imageData.height);

      if (result?.data) {
        active = false;
        const reg = await lookupRegistration(result.data, eventId);

        if (!reg) {
          setScanState('not_found');
          setScannedReg(null);
          return;
        }

        setScannedReg(reg);
        setScanState(reg.attended ? 'already_attended' : 'found');
        return;
      }

      if (active) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { active = false; };
  }, [eventId]);

  useEffect(() => {
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        startScan();
      } catch {
        setCameraError('Camera access denied or unavailable. Please allow camera access and try again.');
      }
    }

    initCamera();

    return () => {
      stopScan();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [startScan, stopScan]);

  async function handleAdmit() {
    if (!scannedReg) return;
    await markAttended(scannedReg.id);
    setAttendedCount((c) => c + 1);
    setScanState('admitted');
  }

  function handleDeny() {
    setScanState('denied');
  }

  function handleScanNext() {
    setScannedReg(null);
    setScanState('scanning');
    startScan();
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-black flex flex-col">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/70 to-transparent">
        <Link
          href={`/admin/events/${eventId}`}
          className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Metrics
        </Link>
        <div className="text-right">
          <p className="text-white text-xs font-semibold truncate max-w-[160px]">{eventTitle}</p>
          <p className="text-white/60 text-xs">{attendedCount} admitted</p>
        </div>
      </div>

      {/* Camera feed */}
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover flex-1"
        style={{ minHeight: 'calc(100vh - 64px)' }}
      />

      {/* Scanning reticle */}
      {scanState === 'scanning' && !cameraError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-56 h-56">
            {/* Corners */}
            {[
              'top-0 left-0 border-t-4 border-l-4 rounded-tl-lg',
              'top-0 right-0 border-t-4 border-r-4 rounded-tr-lg',
              'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-lg',
              'bottom-0 right-0 border-b-4 border-r-4 rounded-br-lg',
            ].map((cls, i) => (
              <div key={i} className={`absolute w-8 h-8 border-white ${cls}`} />
            ))}
            <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-xs whitespace-nowrap">
              Align QR code within frame
            </p>
          </div>
        </div>
      )}

      {/* Camera error */}
      {cameraError && (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-6 text-center max-w-sm w-full shadow-xl">
            <svg className="w-10 h-10 text-red-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <p className="text-sm font-semibold text-navy-900 mb-1">Camera Unavailable</p>
            <p className="text-xs text-gray-500">{cameraError}</p>
          </div>
        </div>
      )}

      {/* Result card */}
      {scanState !== 'scanning' && (
        <div className="absolute bottom-0 left-0 right-0 z-20 animate-[slideUp_0.25s_ease-out]">
          <div className="bg-white rounded-t-3xl shadow-2xl p-6">

            {/* Not found */}
            {scanState === 'not_found' && (
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="font-bold text-navy-900 mb-1">Unknown Ticket</h3>
                <p className="text-sm text-gray-500 mb-5">This QR code is not registered for this event.</p>
                <button onClick={handleScanNext} className="w-full bg-navy-700 text-white font-semibold py-3 rounded-xl text-sm hover:bg-navy-900 transition-colors">
                  Scan Next
                </button>
              </div>
            )}

            {/* Found — admit or deny */}
            {(scanState === 'found' || scanState === 'already_attended') && scannedReg && (
              <div>
                {scanState === 'already_attended' && (
                  <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 mb-4">
                    <svg className="w-4 h-4 text-yellow-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <p className="text-xs text-yellow-700 font-medium">Already admitted at {scannedReg.attendedAt ? new Date(scannedReg.attendedAt).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' }) : ''}</p>
                  </div>
                )}
                <div className="bg-navy-50 rounded-xl p-4 mb-5 space-y-1">
                  <p className="font-bold text-navy-900">{scannedReg.userName}</p>
                  <p className="text-xs text-gray-500">{scannedReg.userEmail}</p>
                  <p className="text-xs text-gray-500">Student ID: {scannedReg.userStudentId}</p>
                  <p className="text-xs text-gray-400 mt-1">Ticket: {scannedReg.ticketEmail}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleDeny} className="flex-1 border border-red-200 text-red-600 font-semibold py-3 rounded-xl text-sm hover:bg-red-50 transition-colors">
                    Deny
                  </button>
                  <button onClick={handleAdmit} className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-xl text-sm hover:bg-green-700 transition-colors">
                    Admit
                  </button>
                </div>
              </div>
            )}

            {/* Admitted */}
            {scanState === 'admitted' && scannedReg && (
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-green-800 mb-1">Admitted</h3>
                <p className="text-sm text-gray-500 mb-5">
                  <span className="font-medium text-navy-900">{scannedReg.userName}</span> has been checked in.
                </p>
                <button onClick={handleScanNext} className="w-full bg-navy-700 text-white font-semibold py-3 rounded-xl text-sm hover:bg-navy-900 transition-colors">
                  Scan Next
                </button>
              </div>
            )}

            {/* Denied */}
            {scanState === 'denied' && scannedReg && (
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="font-bold text-red-800 mb-1">Entry Denied</h3>
                <p className="text-sm text-gray-500 mb-5">
                  <span className="font-medium text-navy-900">{scannedReg.userName}</span> was not admitted.
                </p>
                <button onClick={handleScanNext} className="w-full bg-navy-700 text-white font-semibold py-3 rounded-xl text-sm hover:bg-navy-900 transition-colors">
                  Scan Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
