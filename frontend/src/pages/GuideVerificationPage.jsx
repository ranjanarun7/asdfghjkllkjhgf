import React, { useState, useEffect } from "react";
import {
    ArrowLeft, CheckCircle2, Lock, Clock, FileText, Shield,
    Award, AlertTriangle, Upload, ChevronDown, ChevronUp, MapPin, Phone,
    Download, UserCheck, Accessibility, Backpack, HelpCircle, Star, Heart,
    Briefcase, DollarSign, Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ============== MAIN COMPONENT ==============
export const GuideVerification = () => {
    const navigate = useNavigate();

    const [guideType, setGuideType] = useState(() => {
        return localStorage.getItem("guideType") || null;
    });

    const [currentStage, setCurrentStage] = useState(1);
    const [interviewAttempts, setInterviewAttempts] = useState(0);
    const [showIdCard, setShowIdCard] = useState(false);
    const [isCompareOpen, setIsCompareOpen] = useState(false);

    const [basicTrainingComplete, setBasicTrainingComplete] = useState(false);
    const [specialistTrainingComplete, setSpecialistTrainingComplete] = useState(false);
    const [docsUploaded, setDocsUploaded] = useState(false);

    // New States for Enhanced Training Flow
    const [trainingMethod, setTrainingMethod] = useState(null); // 'license' | 'center'
    const [verificationStatus, setVerificationStatus] = useState(null); // 'pending' | 'approved'
    const [selectedCenter, setSelectedCenter] = useState(null);

    const TRAINING_CENTERS = [
        { id: 1, name: "Jharkhand Tourism Training Institute", location: "Ranchi, Jharkhand" },
        { id: 2, name: "Tribal Culture Centre", location: "Jamshedpur, Jharkhand" },
        { id: 3, name: "Hazaribagh Wildlife Guide NGO", location: "Hazaribagh, Jharkhand" },
        { id: 4, name: "Netarhat Eco-Tourism Society", location: "Netarhat, Jharkhand" }
    ];

    useEffect(() => {
        if (guideType) localStorage.setItem("guideType", guideType);

        if (!guideType) {
            setCurrentStage(1);
            setBasicTrainingComplete(false);
            setSpecialistTrainingComplete(false);
            setDocsUploaded(false);
            setShowIdCard(false);
        }
    }, [guideType]);

    const maxStages = guideType === "specialist" ? 5 : 4;

    const calculateProgress = () => {
        if (showIdCard) return 100;

        const stepWeight = 100 / maxStages;
        let progress = (currentStage - 1) * stepWeight;

        if (currentStage === 1 && basicTrainingComplete) progress += stepWeight * 0.5;
        if (guideType === "specialist" && currentStage === 2 && specialistTrainingComplete)
            progress += stepWeight * 0.5;
        if (currentStage === (guideType === "specialist" ? 4 : 3) && docsUploaded)
            progress += stepWeight * 0.5;

        return Math.min(Math.round(progress), 95);
    };

    const handleNextStage = () => {
        if (currentStage < maxStages) setCurrentStage(currentStage + 1);
        else setShowIdCard(true);
    };

    // Simulation Helper
    const useAutoAdvance = (trigger, action, delay = 4000) => {
        useEffect(() => {
            if (trigger) {
                const timer = setTimeout(action, delay);
                return () => clearTimeout(timer);
            }
        }, [trigger]);
    };

    // Stage States
    const [interviewStatus, setInterviewStatus] = useState('idle'); // idle, joined, reviewing, completed
    const [docStatus, setDocStatus] = useState('idle'); // idle, uploaded, reviewing, completed
    const [policeStatus, setPoliceStatus] = useState('idle'); // idle, initiated, checking, completed

    // 1. License Verification Simulation
    useAutoAdvance(verificationStatus === 'pending', () => {
        setVerificationStatus('approved');
        setBasicTrainingComplete(true);
        if (guideType === 'specialist') setSpecialistTrainingComplete(true);
        const interviewStage = guideType === 'specialist' ? 3 : 2;
        setCurrentStage(interviewStage);
    });

    // 2. Training Center Simulation (NEW)
    const [trainingStatus, setTrainingStatus] = useState('idle'); // idle, checking, completed
    useAutoAdvance(trainingStatus === 'checking', () => {
        setTrainingStatus('completed');
        setBasicTrainingComplete(true);
    });

    // 3. Interview Simulation
    useAutoAdvance(interviewStatus === 'reviewing', () => {
        setInterviewStatus('completed');
        handleNextStage();
    });

    // 4. Document Verification Simulation
    useAutoAdvance(docStatus === 'reviewing', () => {
        setDocStatus('completed');
        handleNextStage();
    });

    // 5. Police Verification Simulation
    useAutoAdvance(policeStatus === 'checking', () => {
        setPoliceStatus('completed');
        handleNextStage(); // Shows ID Card
    });


    // FIXED: Use standard colors defined in tailwind.config.js (primary = Forest Green)
    const getThemeColor = () =>
        guideType === "specialist" ? "text-purple-700" : "text-primary";

    const getThemeBg = () =>
        guideType === "specialist" ? "bg-purple-600" : "bg-primary";

    const getThemeHoverBg = () =>
        guideType === "specialist" ? "hover:bg-purple-700" : "hover:bg-green-700";

    const getThemeBorder = () =>
        guideType === "specialist" ? "border-purple-600" : "border-primary";

    const renderStageIcon = (stageNum, status) => {
        if (status === "completed")
            return (
                <div className={`w-10 h-10 rounded-full ${getThemeBg()} flex items-center justify-center text-white shadow-md`}>
                    <CheckCircle2 size={20} />
                </div>
            );

        if (status === "failed")
            return (
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white shadow-md">
                    <AlertTriangle size={20} />
                </div>
            );

        if (status === "current")
            return (
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold animate-pulse border-2 border-white ring-2 ring-orange-200">
                    {stageNum}
                </div>
            );

        return (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 border-2 border-white">
                <Lock size={16} />
            </div>
        );
    };

    const getStageStatus = (stageNum) => {
        if (showIdCard) return "completed";
        if (stageNum < currentStage) return "completed";
        if (stageNum === currentStage) return "current";
        return "locked";
    };

    // ------------------------------------------------------
    // SELECTION SCREEN
    // ------------------------------------------------------
    if (!guideType) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
                <div className="container mx-auto max-w-6xl">

                    <button
                        onClick={() => navigate('/')}
                        className="mb-8 flex items-center gap-2 text-gray-800 font-medium hover:text-primary"
                    >
                        <ArrowLeft size={20} /> Back to Home
                    </button>

                    <div className="text-center mb-12">
                        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                            Certification Program
                        </span>

                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mt-4">
                            Choose Your Guide Path
                        </h1>

                        <p className="text-gray-500 text-lg max-w-2xl mx-auto mt-4">
                            Select your specialization to begin the certification process.
                        </p>
                    </div>

                    {/* GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">

                        {/* Normal Guide */}
                        <div
                            className="bg-white rounded-3xl p-8 border-2 hover:border-primary transition-all cursor-pointer group"
                            onClick={() => setGuideType("normal")}
                        >
                            <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                                <Backpack size={40} className="text-primary group-hover:text-white" />
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Normal Tourist Guide
                            </h2>
                            <p className="text-gray-500 mb-6">
                                For general tourism, culture, and nature guides.
                            </p>

                            <button className="w-full py-4 rounded-xl bg-gray-100 text-gray-900 font-bold group-hover:bg-primary group-hover:text-white transition-all">
                                Select Normal Guide
                            </button>
                        </div>

                        {/* Specialist Guide */}
                        <div
                            className="bg-white rounded-3xl p-8 border-2 hover:border-purple-500 transition-all cursor-pointer group relative"
                            onClick={() => setGuideType("specialist")}
                        >
                            <div className="absolute top-0 right-0 bg-purple-100 text-purple-700 text-[10px] px-4 py-2 rounded-bl-xl font-bold">
                                <Star size={12} /> HIGH DEMAND
                            </div>

                            <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                                <Accessibility size={40} className="text-purple-600 group-hover:text-white" />
                            </div>

                            <h2 className="text-2xl font-bold text-purple-900 mb-2">
                                Disability Specialist
                            </h2>

                            <p className="text-gray-500 mb-6">
                                Train to support tourists with various disabilities.
                            </p>

                            <button className="w-full py-4 rounded-xl bg-purple-50 text-purple-900 font-bold group-hover:bg-purple-600 group-hover:text-white transition-all">
                                Select Specialist
                            </button>
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => setIsCompareOpen(true)}
                            className="text-gray-500 hover:text-gray-900 underline flex items-center gap-2 mx-auto"
                        >
                            <FileText size={16} /> Compare both paths
                        </button>
                    </div>

                    {/* Comparison Modal */}
                    {isCompareOpen && (
                        <div
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                            onClick={() => setIsCompareOpen(false)}
                        >
                            <div
                                className="bg-white p-8 rounded-3xl max-w-4xl w-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-serif font-bold">
                                        Guide Path Comparison
                                    </h3>
                                    <button
                                        onClick={() => setIsCompareOpen(false)}
                                        className="p-2 bg-gray-100 rounded-full"
                                    >
                                        <Lock size={20} />
                                    </button>
                                </div>

                                <p className="text-sm text-gray-500">
                                    Comparison Table…
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ------------------------------------------------------
    // MAIN TIMELINE SCREEN (AFTER SELECTION)
    // ------------------------------------------------------
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
            <div className="container mx-auto max-w-6xl">

                <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-2 mb-8 text-gray-900 hover:text-gray-600"
                >
                    <ArrowLeft size={20} /> Back to Profile
                </button>

                <h1 className={`text-4xl font-serif font-bold mb-3 ${getThemeColor()}`}>
                    {guideType === "specialist"
                        ? "Specialist Verification"
                        : "Guide Verification"}
                </h1>

                {/* Progress Bar */}
                <div className="bg-white p-4 rounded-2xl border shadow-sm mb-10">
                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                        <span>Your Journey</span>
                        <span>{calculateProgress()}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${getThemeBg()} transition-all duration-700`}
                            style={{ width: `${calculateProgress()}%` }}
                        ></div>
                    </div>
                </div>

                {/* Timeline & ID card layout */}
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Timeline */}
                    <div className="lg:w-2/3 space-y-14 pl-6 border-l-2 border-gray-200">

                        {/* BASIC TRAINING */}
                        <StageCard
                            stageNum={1}
                            title="Basic Guide Training & Verification"
                            desc="Prove your experience or get trained."
                            status={getStageStatus(1)}
                            icon={renderStageIcon(1, getStageStatus(1))}
                            themeColor={getThemeColor()}
                        >
                            {!basicTrainingComplete ? (
                                <div className="mt-4">
                                    {/* Sub-Stage 1: Choose Path */}
                                    {!trainingMethod && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div
                                                onClick={() => setTrainingMethod('license')}
                                                className={`border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer transition-all text-center group ${guideType === "specialist" ? "hover:bg-purple-50 hover:border-purple-500" : "hover:bg-green-50 hover:border-primary"}`}
                                            >
                                                <Award className={`mx-auto text-gray-400 ${guideType === "specialist" ? "group-hover:text-purple-600" : "group-hover:text-primary"} mb-3 transition-colors`} size={36} />
                                                <h4 className={`font-bold text-gray-700 ${guideType === "specialist" ? "group-hover:text-purple-700" : "group-hover:text-primary"} transition-colors`}>I have Experience</h4>
                                                <p className="text-xs text-gray-500 mt-2">Upload License/Certificate</p>
                                            </div>

                                            <div
                                                onClick={() => setTrainingMethod('center')}
                                                className={`border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer transition-all text-center group ${guideType === "specialist" ? "hover:bg-purple-50 hover:border-purple-500" : "hover:bg-green-50 hover:border-primary"}`}
                                            >
                                                <Backpack className={`mx-auto text-gray-400 ${guideType === "specialist" ? "group-hover:text-purple-600" : "group-hover:text-primary"} mb-3 transition-colors`} size={36} />
                                                <h4 className={`font-bold text-gray-700 ${guideType === "specialist" ? "group-hover:text-purple-700" : "group-hover:text-primary"} transition-colors`}>I need Training</h4>
                                                <p className="text-xs text-gray-500 mt-2">Join an NGO/Training Centre</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Sub-Stage 2A: License Upload */}
                                    {trainingMethod === 'license' && (
                                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-slide-up shadow-sm">
                                            <div className="flex justify-between items-center mb-6">
                                                <h4 className="font-bold text-gray-900">Upload Valid License/Certificate</h4>
                                                <button onClick={() => { setTrainingMethod(null); setVerificationStatus(null); }} className="text-xs text-red-500 hover:text-red-700 font-medium">Change</button>
                                            </div>

                                            {verificationStatus === 'pending' ? (
                                                <div className="text-center py-6">
                                                    <div className={`animate-spin w-8 h-8 border-4 border-current border-t-transparent rounded-full mx-auto mb-3 ${getThemeColor()}`}></div>
                                                    <p className={`${getThemeColor()} font-bold`}>Document Verification in Progress...</p>
                                                    <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">Your license is being reviewed by the tourism board admin. You will be notified shortly.</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className={`border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:bg-white hover:${getThemeBorder()} transition-all cursor-pointer bg-white`}>
                                                        <Upload size={32} className="mb-3" />
                                                        <span className="text-sm font-medium">Click to upload document (PDF/JPG)</span>
                                                    </div>
                                                    <button
                                                        onClick={() => setVerificationStatus('pending')}
                                                        className={`w-full py-3 text-white rounded-xl font-bold ${getThemeBg()} ${getThemeHoverBg()} shadow-sm`}
                                                    >
                                                        Submit for Verification
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Sub-Stage 2B: Training Centers */}
                                    {trainingMethod === 'center' && (
                                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-slide-up shadow-sm">
                                            <div className="flex justify-between items-center mb-6">
                                                <h4 className="font-bold text-gray-900">Select Training Centre</h4>
                                                <button onClick={() => { setTrainingMethod(null); setSelectedCenter(null); }} className="text-xs text-red-500 hover:text-red-700 font-medium">Change</button>
                                            </div>

                                            {!selectedCenter ? (
                                                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                                    {TRAINING_CENTERS.map((center) => (
                                                        <div
                                                            key={center.id}
                                                            onClick={() => setSelectedCenter(center)}
                                                            className={`bg-white p-4 rounded-xl border border-gray-200 hover:${getThemeBorder()} cursor-pointer flex justify-between items-center group transition-all shadow-sm`}
                                                        >
                                                            <div>
                                                                <h5 className={`font-bold text-gray-800 text-sm group-hover:${getThemeColor().replace('text-', 'text-')}`}>{center.name}</h5>
                                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                                                    <MapPin size={12} /> {center.location}
                                                                </div>
                                                            </div>
                                                            <ChevronDown size={18} className="text-gray-300 -rotate-90 group-hover:text-gray-600" />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <div className="bg-white border border-gray-100 p-6 rounded-2xl mb-6 shadow-sm">
                                                        <div className={`w-12 h-12 rounded-full ${getThemeBg()} bg-opacity-10 flex items-center justify-center mx-auto mb-3`}>
                                                            <CheckCircle2 className={getThemeColor()} size={24} />
                                                        </div>
                                                        <h5 className="font-bold text-gray-900 text-lg">Registered at {selectedCenter.name}</h5>
                                                        <p className="text-sm text-gray-500 mt-1">Please visit the centre with your ID proof.</p>
                                                        <div className="mt-4 text-xs font-mono bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 inline-block text-gray-600">
                                                            📍 {selectedCenter.location}
                                                        </div>
                                                    </div>

                                                    {trainingStatus === 'idle' && (
                                                        <button
                                                            onClick={() => setTrainingStatus('checking')}
                                                            className={`w-full py-3 text-white rounded-xl font-bold ${getThemeBg()} ${getThemeHoverBg()} shadow-sm`}
                                                        >
                                                            I have completed training
                                                        </button>
                                                    )}

                                                    {trainingStatus === 'checking' && (
                                                        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl text-sm font-medium animate-pulse border border-yellow-100">
                                                            Waiting for centre confirmation...
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                currentStage === 1 && (
                                    <div className="mt-4">
                                        <div className={`flex items-center gap-2 ${getThemeColor()} bg-green-50 p-3 rounded-lg border border-green-200 mb-3`}>
                                            <CheckCircle2 size={18} />
                                            <span className="text-sm font-bold">
                                                {trainingMethod === 'license' ? "Experience Verified" : "Training Completed"}
                                            </span>
                                        </div>
                                        {/* Auto-progression happens, but we keep button for manual nav just in case? No, simulation handles it? No, stage 1 completion usually needs manual 'Proceed' or auto? Let's manual Proceed for clear checkpoint */}
                                        <button
                                            onClick={handleNextStage}
                                            className={`w-full px-6 py-3 text-white rounded-xl font-bold ${getThemeBg()} ${getThemeHoverBg()}`}
                                        >
                                            Proceed to {guideType === 'specialist' ? 'Specialization' : 'Interview'}
                                        </button>
                                    </div>
                                )
                            )}
                        </StageCard>

                        {/* SPECIALIST TRAINING */}
                        {guideType === "specialist" && (
                            <StageCard
                                stageNum={2}
                                title="Specialist Training"
                                desc="Advanced NIEPD-certified modules."
                                status={getStageStatus(2)}
                                icon={renderStageIcon(2, getStageStatus(2))}
                                themeColor={getThemeColor()}
                            >
                                {!specialistTrainingComplete ? (
                                    <button
                                        onClick={() => setSpecialistTrainingComplete(true)} // Keep manual for now as it's 'Training'
                                        className="px-6 py-3 bg-purple-600 text-white rounded-xl mt-4 hover:bg-purple-700 transition"
                                    >
                                        Start Online Module
                                    </button>
                                ) : (
                                    currentStage === 2 && (
                                        <button
                                            onClick={handleNextStage}
                                            className="px-6 py-3 bg-purple-600 text-white rounded-xl mt-4 hover:bg-purple-700 transition"
                                        >
                                            Proceed
                                        </button>
                                    )
                                )}
                            </StageCard>
                        )}

                        {/* INTERVIEW */}
                        <StageCard
                            stageNum={guideType === "specialist" ? 3 : 2}
                            title="Interview"
                            desc="Assessment by tourism panel."
                            status={getStageStatus(guideType === "specialist" ? 3 : 2)}
                            icon={renderStageIcon(
                                guideType === "specialist" ? 3 : 2,
                                getStageStatus(guideType === "specialist" ? 3 : 2)
                            )}
                            themeColor={getThemeColor()}
                        >
                            {currentStage === (guideType === "specialist" ? 3 : 2) && (
                                <div>
                                    {interviewStatus === 'idle' && (
                                        <button
                                            onClick={() => setInterviewStatus('reviewing')}
                                            className={`mt-4 px-6 py-3 text-white rounded-xl font-bold ${getThemeBg()} ${getThemeHoverBg()}`}
                                        >
                                            Join Interview Panel
                                        </button>
                                    )}
                                    {interviewStatus === 'reviewing' && (
                                        <div className="mt-4 p-4 bg-gray-50 border rounded-xl text-center">
                                            <div className="animate-spin w-6 h-6 border-4 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-2"></div>
                                            <p className="text-gray-800 font-bold">Interview Completed</p>
                                            <p className="text-xs text-gray-500">Panel is submitting their review...</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </StageCard>

                        {/* DOCUMENT VERIFICATION */}
                        <StageCard
                            stageNum={guideType === "specialist" ? 4 : 3}
                            title="Document Verification"
                            desc="Upload Aadhaar, PAN & Address proof."
                            status={getStageStatus(guideType === "specialist" ? 4 : 3)}
                            icon={renderStageIcon(
                                guideType === "specialist" ? 4 : 3,
                                getStageStatus(guideType === "specialist" ? 4 : 3)
                            )}
                            themeColor={getThemeColor()}
                        >
                            {currentStage === (guideType === "specialist" ? 4 : 3) && (
                                <div>
                                    {docStatus === 'idle' && (
                                        <button
                                            onClick={() => setDocStatus('reviewing')}
                                            className="mt-4 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900"
                                        >
                                            Submit Documents
                                        </button>
                                    )}
                                    {docStatus === 'reviewing' && (
                                        <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
                                            <Shield className="text-green-600" size={24} />
                                            <div>
                                                <p className="text-green-800 font-bold text-sm">Documents Submitted</p>
                                                <p className="text-xs text-green-600">Verification in progress (Estimated: 24h)</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </StageCard>

                        {/* POLICE VERIFICATION */}
                        <StageCard
                            stageNum={guideType === "specialist" ? 5 : 4}
                            title="Police Verification"
                            desc="Final security clearance."
                            status={getStageStatus(guideType === "specialist" ? 5 : 4)}
                            icon={renderStageIcon(
                                guideType === "specialist" ? 5 : 4,
                                getStageStatus(guideType === "specialist" ? 5 : 4)
                            )}
                            themeColor={getThemeColor()}
                        >
                            {currentStage === (guideType === "specialist" ? 5 : 4) && !showIdCard && (
                                <div>
                                    {policeStatus === 'idle' && (
                                        <button
                                            onClick={() => setPoliceStatus('checking')}
                                            className={`mt-4 px-6 py-3 text-white rounded-xl font-bold ${getThemeBg()} ${getThemeHoverBg()}`}
                                        >
                                            Initiate Background Check
                                        </button>
                                    )}
                                    {policeStatus === 'checking' && (
                                        <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl text-center">
                                            <div className="flex justify-center gap-2 mb-2">
                                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75"></span>
                                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></span>
                                            </div>
                                            <p className="text-blue-800 font-bold text-sm">Checking Criminal Records...</p>
                                            <p className="text-xs text-blue-600">Connecting with local police database.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </StageCard>
                    </div>

                    {/* RIGHT SIDE - ID Card & Benefits */}
                    <div className="lg:w-1/3 space-y-6 sticky top-24 h-fit">

                        {/* ID Card Preview */}
                        <div className={`transition-all duration-700 ${showIdCard ? "opacity-100 scale-100" : "opacity-100 scale-100"}`}>
                            <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-500 uppercase tracking-widest">
                                <Shield size={14} /> Result Preview
                            </div>

                            <div className={`bg-white rounded-3xl shadow-xl border-2 p-6 ${getThemeBorder()}`}>
                                <div className="text-center">
                                    <div className="relative inline-block">
                                        <img
                                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
                                            className="w-28 h-28 rounded-full border-4 border-white shadow-sm mx-auto object-cover"
                                            alt="Guide"
                                        />
                                        {showIdCard && (
                                            <div className="absolute bottom-0 right-0 bg-green-500 text-white p-1.5 rounded-full border-2 border-white">
                                                <CheckCircle2 size={14} />
                                            </div>
                                        )}
                                    </div>

                                    <h2 className="mt-4 text-xl font-bold text-gray-900">Arun Kumar</h2>
                                    <p className="text-gray-500 text-sm mb-3">ID: REF-2024-889</p>

                                    <span className={`inline-block text-xs ${guideType === 'specialist' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'} px-3 py-1 rounded-full font-bold uppercase tracking-wide`}>
                                        {guideType === "specialist" ? "DISABILITY SPECIALIST" : "VERIFIED GUIDE"}
                                    </span>
                                </div>
                            </div>

                            {showIdCard ? (
                                <button
                                    className={`w-full mt-4 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${getThemeBg()} animate-bounce`}
                                >
                                    <Download size={18} /> Download Official ID
                                </button>
                            ) : (
                                <p className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                                    <Lock size={10} /> Complete stages to unlock ID
                                </p>
                            )}
                        </div>

                        {/* Unlocked Access / Benefits */}
                        <div className="bg-white rounded-2xl p-6 border shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Star className={guideType === 'specialist' ? "text-purple-500" : "text-yellow-500"} fill="currentColor" size={18} />
                                {guideType === 'specialist' ? "Specialist Privileges" : "Verified Benefits"}
                            </h3>

                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className={`p-1.5 rounded-full ${guideType === 'specialist' ? "bg-purple-100 text-purple-600" : "bg-green-100 text-green-600"} mt-0.5`}>
                                        <Shield size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">Verified Badge</p>
                                        <p className="text-xs text-gray-500">Build trust with the official verification tick on your profile.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className={`p-1.5 rounded-full ${guideType === 'specialist' ? "bg-purple-100 text-purple-600" : "bg-green-100 text-green-600"} mt-0.5`}>
                                        <DollarSign size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">Accept {guideType === 'specialist' ? "Premium " : ""}Payments</p>
                                        <p className="text-xs text-gray-500">Direct wallet access to receive booking fees instantly.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className={`p-1.5 rounded-full ${guideType === 'specialist' ? "bg-purple-100 text-purple-600" : "bg-green-100 text-green-600"} mt-0.5`}>
                                        <Globe size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">{guideType === 'specialist' ? "Priority Listing" : "Global Reach"}</p>
                                        <p className="text-xs text-gray-500">{guideType === 'specialist' ? "Appear at the top for accessibility-focused travelers." : "Showcase your tours to international tourists."}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

// ============== STAGE CARD ==============
const StageCard = ({ title, desc, icon, status, themeColor = "text-gray-900", children }) => {
    return (
        <div
            className={`relative pl-10 ${status === "locked" ? "opacity-60 grayscale" : "opacity-100"
                }`}
        >
            <div className="absolute -left-6 top-1">{icon}</div>

            <h3 className={`text-xl font-bold ${status === "current" ? "text-black" : themeColor}`}>
                {title}
            </h3>

            <p className="text-sm text-gray-500 mb-3">{desc}</p>

            {children}
        </div>
    );
};
