
import React, { useState, useEffect, useRef } from 'react';
import { CallAppointment, AppNotification, Language, UserProfile } from '../types.ts';
import { 
  PhoneCall, Video, User, ShieldCheck, Clock, CheckCircle, Plus, VideoOff, Mic, MicOff, PhoneOff, 
  MoreVertical, Wifi, Globe, CameraOff, RefreshCw, ScreenShare, Volume2, ClipboardList, 
  AlertCircle, XCircle, Heart, Zap, FileText, ChevronRight, Activity, ShieldAlert, Sparkles, Loader2
} from 'lucide-react';
import { getChatResponse } from '../services/geminiService.ts';

interface CallSchedulerProps {
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  prefilledReason?: string | null;
  clearPrefilledReason?: () => void;
  language: Language;
  userProfile: UserProfile;
}

const MOCK_DOCTORS = [
  { id: 'D1', name: 'Dr. Anita Sharma', specialty: 'Obstetrician' },
  { id: 'D2', name: 'Dr. Priya Varma', specialty: 'Gynecologist' },
  { id: 'D3', name: 'Dr. Rahul Mehta', specialty: 'General Physician' }
];

const CONNECTION_STEPS = ["Initializing clinical signal...", "Allocating dedicated bandwidth...", "Securing end-to-end tunnel...", "Finalizing secure handshake..."];

const CallScheduler: React.FC<CallSchedulerProps> = ({ addNotification, prefilledReason, clearPrefilledReason, language, userProfile }) => {
  const [calls, setCalls] = useState<CallAppointment[]>([{
    id: 'demo-1', doctorName: 'Dr. Anita Sharma', patientName: userProfile.name, date: new Date().toISOString().split('T')[0], time: '09:00', reason: 'Routine follow-up on vitals', status: 'Upcoming', type: 'Video'
  }]);
  
  // Call State
  const [isCalling, setIsCalling] = useState(false);
  const [activeCall, setActiveCall] = useState<CallAppointment | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [consultSummary, setConsultSummary] = useState<string | null>(null);
  const [emergencyActive, setEmergencyActive] = useState(false);
  
  // Scheduling Form State
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [newConsult, setNewConsult] = useState({ doctorId: 'D1', reason: prefilledReason || '', type: 'Video' as 'Video' | 'Voice' });

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const tDict: Record<Language, any> = {
    English: {
      bridge: "Clinical Bridge",
      desc: "Connect with doctors and ASHA workers instantly.",
      emergency: "Emergency Call",
      upcoming: "Scheduled Consults",
      summary: "Janaki's Consult Notes",
      connecting: "Establishing Link",
      join: "Join Call",
      newConsult: "New Consult",
      doctor: "Select Doctor",
      reason: "Reason"
    },
    Hindi: {
      bridge: "क्लिनीकल ब्रिज",
      desc: "डॉक्टरों और आशा कार्यकर्ताओं से तुरंत जुड़ें।",
      emergency: "आपातकालीन कॉल",
      upcoming: "निर्धारित परामर्श",
      summary: "जानकी के परामर्श नोट्स",
      connecting: "लिंक स्थापित कर रहा है",
      join: "कॉल में शामिल हों",
      newConsult: "नया परामर्श",
      doctor: "डॉक्टर चुनें",
      reason: "कारण"
    },
    Marathi: {}, Bengali: {}, Telugu: {}, Tamil: {}, Gujarati: {}, Kannada: {}, Malayalam: {}, Punjabi: {}
  };

  const t = { ...tDict.English, ...(tDict[language] || {}) };

  // Connection simulation
  useEffect(() => {
    let interval: number;
    if (isCalling && !isConnected && !permissionError) {
      interval = window.setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= CONNECTION_STEPS.length - 1) {
            clearInterval(interval);
            setIsConnected(true);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isCalling, isConnected, permissionError]);

  // Timer
  useEffect(() => {
    let interval: number;
    if (isConnected) {
      interval = window.setInterval(() => setCallTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  // Media Stream
  useEffect(() => {
    const startMedia = async () => {
      if (isCalling && !permissionError) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, // Always try for video if joining a session
            audio: true 
          });
          streamRef.current = stream;
        } catch (err) {
          console.error("Hardware access failed", err);
          setPermissionError(true);
        }
      }
    };

    if (isCalling) startMedia();
    
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    };
  }, [isCalling]);

  // ATTACH STREAM ONCE CONNECTED: Fixes the black screen issue
  useEffect(() => {
    if (isConnected && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isConnected]);

  const handleStartCall = (call: CallAppointment) => {
    setCurrentStepIndex(0);
    setCallTimer(0);
    setIsConnected(false);
    setActiveCall(call);
    setIsCalling(true);
  };

  const handleEndCall = async () => {
    setIsCalling(false);
    setIsConnected(false);
    setPermissionError(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (callTimer > 5) {
      try {
        const summaryPrompt = `Clinical summary for a ${activeCall?.type} consult with ${activeCall?.doctorName} regarding ${activeCall?.reason}. Write as 'Janaki'.`;
        const summary = await getChatResponse([], summaryPrompt, language);
        setConsultSummary(summary);
      } catch (e) {
        setConsultSummary("Consultation completed successfully.");
      }
    }
    setActiveCall(null);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      {!isCalling ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center text-white">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{t.bridge}</h2>
                    <p className="text-slate-500 text-sm">{t.desc}</p>
                  </div>
               </div>
               <button 
                  onClick={() => setShowScheduleForm(true)}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
               >
                 <Plus className="w-4 h-4" /> {t.newConsult}
               </button>
            </div>

            <div className="bg-rose-50 border border-rose-100 p-8 rounded-[2.5rem] flex items-center justify-between gap-4">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white animate-pulse">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-rose-900">{t.emergency}</h3>
               </div>
               <button 
                 onClick={() => handleStartCall({ id: 'em', doctorName: 'Emergency Unit', patientName: userProfile.name, date: 'now', time: 'now', reason: 'Emergency', status: 'Live', type: 'Video' })}
                 className="px-8 py-3 bg-rose-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-rose-700 transition-all"
               >
                 Call Now
               </button>
            </div>

            <div className="space-y-4">
               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">{t.upcoming}</h3>
               {calls.map(call => (
                 <div key={call.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between hover:border-teal-500 transition-all group">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-500">
                          {call.type === 'Video' ? <Video className="w-6 h-6" /> : <PhoneCall className="w-6 h-6" />}
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-800">{call.doctorName}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{call.date} • {call.time}</p>
                       </div>
                    </div>
                    <button onClick={() => handleStartCall(call)} className="px-6 py-2.5 bg-teal-500 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-teal-600 transition-all">
                      {t.join}
                    </button>
                 </div>
               ))}
            </div>
          </div>

          <div className="lg:col-span-4">
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-500" /> {t.summary}
                </h3>
                {consultSummary ? (
                   <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 text-sm text-teal-800 leading-relaxed italic">
                      "{consultSummary}"
                   </div>
                ) : (
                   <p className="text-slate-400 text-xs italic">Clinical notes from Janaki will appear here after your call.</p>
                )}
             </div>
          </div>
        </div>
      ) : (
        /* Call View - Matching the requested screenshot aesthetic */
        <div className="fixed inset-0 bg-slate-950 z-[999] flex flex-col text-white animate-fade-in">
           {/* Clean Minimal Header */}
           <div className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-slate-900/80 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-slate-950">
                    <ShieldCheck className="w-6 h-6" />
                 </div>
                 <div>
                    <h2 className="text-xs font-bold uppercase tracking-widest">{activeCall?.id === 'em' ? 'EMERGENCY BRIDGE' : 'SECURE CLINICAL BRIDGE'}</h2>
                    <p className="text-[9px] text-teal-400 font-bold uppercase tracking-[0.2em]">V2.5 ENCRYPTED HANDSHAKE</p>
                 </div>
              </div>

              {isConnected && (
                <div className="px-6 py-2 bg-slate-800 border border-white/10 rounded-2xl flex items-center gap-3">
                   <Clock className="w-4 h-4 text-teal-400" />
                   <span className="font-mono text-xl font-bold">{formatTime(callTimer)}</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-teal-500 rounded-xl text-slate-950">
                    <ClipboardList className="w-5 h-5" />
                 </div>
                 <div className="p-2.5 bg-white/5 rounded-xl text-white/40">
                    <MoreVertical className="w-5 h-5" />
                 </div>
              </div>
           </div>

           {/* Workspace */}
           <div className="flex-1 relative flex flex-col md:flex-row p-4 gap-4">
              {!isConnected ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-6">
                   <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center animate-pulse">
                      <Wifi className="w-10 h-10 text-teal-500" />
                   </div>
                   <div className="text-center">
                      <h3 className="text-2xl font-bold">{t.connecting}...</h3>
                      <p className="text-teal-400/60 text-[10px] font-bold uppercase tracking-widest mt-2">{CONNECTION_STEPS[currentStepIndex]}</p>
                   </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 bg-slate-900 rounded-[2rem] overflow-hidden relative border border-white/5">
                     {/* Remote Mock */}
                     <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-800/50">
                        <div className="w-32 h-32 bg-teal-500/10 rounded-full flex items-center justify-center border border-teal-500/20">
                           <User className="w-16 h-16 text-teal-500/40" />
                        </div>
                        <h4 className="text-xl font-bold text-white/80">{activeCall?.doctorName}</h4>
                     </div>
                  </div>

                  <div className="w-full md:w-80 h-60 md:h-auto bg-slate-900 rounded-[2rem] overflow-hidden relative border border-white/5 group">
                     {isVideoOff ? (
                       <div className="w-full h-full flex items-center justify-center bg-black">
                          <VideoOff className="w-12 h-12 text-slate-700" />
                       </div>
                     ) : (
                       <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror" />
                     )}
                     <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 text-[9px] font-bold rounded-lg uppercase">You</div>
                  </div>
                </>
              )}
           </div>

           {/* Simplified Controls */}
           <div className="h-32 flex items-center justify-center gap-8 bg-black/60 backdrop-blur-3xl border-t border-white/5">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${isMuted ? 'bg-rose-500' : 'bg-white/10'}`}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              
              <button 
                onClick={handleEndCall}
                className="w-20 h-20 bg-rose-600 hover:bg-rose-700 rounded-[2rem] flex items-center justify-center shadow-lg shadow-rose-600/20"
              >
                <PhoneOff className="w-10 h-10 rotate-[135deg]" />
              </button>

              <button 
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${isVideoOff ? 'bg-rose-500' : 'bg-white/10'}`}
              >
                {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
              </button>
           </div>
        </div>
      )}

      {/* Basic Scheduling Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl relative">
              <button onClick={() => setShowScheduleForm(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-800"><XCircle className="w-6 h-6" /></button>
              <h3 className="text-2xl font-bold text-slate-800 mb-8">{t.newConsult}</h3>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">{t.doctor}</label>
                    <select value={newConsult.doctorId} onChange={e => setNewConsult({...newConsult, doctorId: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-xl font-bold outline-none">
                      {MOCK_DOCTORS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">{t.reason}</label>
                    <textarea value={newConsult.reason} onChange={e => setNewConsult({...newConsult, reason: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-xl font-medium outline-none resize-none h-24" />
                 </div>
                 <button onClick={() => {
                   handleStartCall({ id: 'temp', doctorName: MOCK_DOCTORS.find(d => d.id === newConsult.doctorId)?.name || 'Doctor', patientName: userProfile.name, date: 'today', time: 'now', reason: newConsult.reason, status: 'Upcoming', type: 'Video' });
                   setShowScheduleForm(false);
                 }} className="w-full py-4 bg-teal-500 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-teal-600">Start Session Now</button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .mirror { transform: scaleX(-1); }
      `}</style>
    </div>
  );
};

export default CallScheduler;
