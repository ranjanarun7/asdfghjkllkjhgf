import React, { useState, useEffect } from "react";
import {
    ArrowLeft, CheckCircle2, Lock, Clock, FileText, Shield,
    Award, AlertTriangle, Upload, ChevronDown, ChevronUp, MapPin, Phone,
    Download, UserCheck, Accessibility, Backpack, HelpCircle, Star, Heart,
    Briefcase, DollarSign, Globe
} from "lucide-react";

// ============== MAIN COMPONENT ==============
export const GuideVerification = ({ onBack }) => {

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

    const getThemeColor = () =>
        guideType === "specialist" ? "text-purple-700" : "text-green-700";

    const getThemeBg = () =>
        guideType === "specialist" ? "bg-purple-600" : "bg-green-600";

    const getThemeHoverBg = () =>
        guideType === "specialist" ? "hover:bg-purple-500" : "hover:bg-green-500";

    const getThemeBorder = () =>
        guideType === "specialist" ? "border-purple-600" : "border-green-600";

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
            <div className="min-h-screen bg-earth-50 pt-24 pb-12 px-6">
                <div className="container mx-auto max-w-6xl">

                    <button
                        onClick={onBack}
                        className="mb-8 flex items-center gap-2 text-earth-900 font-medium hover:text-jh-green-600"
                    >
                        <ArrowLeft size={20} /> Back to Profile
                    </button>

                    <div className="text-center mb-12">
                        <span className="bg-jh-green-100 text-jh-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                            Certification Program
                        </span>

                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-earth-900 mt-4">
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
                            className="bg-white rounded-3xl p-8 border-2 hover:border-purple-500 transition-all cursor-pointer group relative"
                            onClick={() => setGuideType("normal")}
                        >
                            <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                                <Backpack size={40} className="text-purple-600 group-hover:text-white" />
                            </div>

                            <h2 className="text-2xl font-bold text-earth-900 mb-2">
                                Normal Tourist Guide
                            </h2>
                            <p className="text-gray-500 mb-6">
                                For general tourism, culture, and nature guides.
                            </p>

                            <button className="w-full py-4 rounded-xl bg-purple-50 text-purple-900 font-bold group-hover:bg-purple-600 group-hover:text-white transition-all">
                                Select Normal Guide
                            </button>
                        </div>

                        {/* Specialist Guide */}
                        <div
                            className="bg-white rounded-3xl p-8 border-2 hover:border-purple-500 transition-all cursor-pointer group relative"
                            onClick={() => setGuideType("specialist")}
                        >
                            

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
                            className="text-gray-500 hover:text-green-900 underline flex items-center gap-2 mx-auto"
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
        <div className="min-h-screen bg-earth-50 pt-24 pb-12 px-6">
            <div className="container mx-auto max-w-6xl">

                <button
                    onClick={() => setGuideType(null)}
                    className="flex items-center gap-2 mb-8 text-earth-900 hover:text-gray-600"
                >
                    <ArrowLeft size={20} /> Change Path
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
                    <div className="lg:w-2/3 space-y-14 pl-6 ">

                        {/* BASIC TRAINING */}
                        <StageCard
                            stageNum={1}
                            title="Basic Guide Training"
                            desc="Mandatory 40-hour workshop."
                            status={getStageStatus(1)}
                            icon={renderStageIcon(1, getStageStatus(1))}
                            themeColor={getThemeColor()}
                        >
                            {!basicTrainingComplete ? (
                                <button
                                    onClick={() => setBasicTrainingComplete(true)}
                                    className={`mt-4 px-6 py-3 text-white rounded-xl font-bold ${getThemeBg()} ${getThemeHoverBg()}`}
                                >
                                    Mark Training Complete
                                </button>
                            ) : (
                                currentStage === 1 && (
                                    <button
                                        onClick={handleNextStage}
                                        className={`mt-4 px-6 py-3 text-white rounded-xl font-bold ${getThemeBg()} ${getThemeHoverBg()}`}
                                    >
                                        Proceed
                                    </button>
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
                                        onClick={() => setSpecialistTrainingComplete(true)}
                                        className="px-6 py-3 bg-purple-600 text-white rounded-xl mt-4"
                                    >
                                        Complete Specialization
                                    </button>
                                ) : (
                                    currentStage === 2 && (
                                        <button
                                            onClick={handleNextStage}
                                            className="px-6 py-3 bg-purple-600 text-white rounded-xl mt-4"
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
                                <button
                                    onClick={handleNextStage}
                                    className={`mt-4 px-6 py-3 bg-gray-100 text-white rounded-xl font-bold ${getThemeBg()} ${getThemeHoverBg()}`}
                                >
                                    Pass Interview
                                </button>
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
                            {!docsUploaded ? (
                                <button
                                    onClick={() => setDocsUploaded(true)}
                                    className={`mt-4 px-6 py-3 bg-gray-100 text-white rounded-xl font-bold ${getThemeBg()} ${getThemeHoverBg()}`}
                                >
                                    Submit Documents
                                </button>
                            ) : (
                                currentStage === (guideType === "specialist" ? 4 : 3) && (
                                    <button
                                        onClick={handleNextStage}
                                        className={`mt-4 px-6 py-3 text-white rounded-xl font-bold ${getThemeBg()} ${getThemeHoverBg()}`}
                                    >
                                        Approve
                                    </button>
                                )
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
                                <button
                                    onClick={handleNextStage}
                                    className={`mt-4 px-6 py-3 text-white bg-gray-100 rounded-xl font-bold ${getThemeBg()} ${getThemeHoverBg()}`}
                                >
                                    Complete Verification
                                </button>
                            )}
                        </StageCard>
                    </div>

                    {/* RIGHT SIDE - ID Card */}
                    <div className="lg:w-1/3 sticky top-20">

                        <div
                            className={`transition-all duration-700 ${
                                showIdCard ? "opacity-100 scale-100" : "opacity-60 blur-sm scale-95"
                            }`}
                        >
                            <div className={`bg-white rounded-3xl shadow-xl border-2 p-6 ${getThemeBorder()}`}>
                                <div className="text-center">
                                    <img
                                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
                                        className="w-28 h-28 rounded-full border-4 border-white mx-auto -mt-12 object-cover"
                                        alt="Guide"
                                    />

                                    <h2 className="mt-4 text-xl font-bold text-earth-900">Arun Kumar</h2>

                                    <span className="mt-2 inline-block text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                                        {guideType === "specialist" ? "DISABILITY SPECIALIST" : "VERIFIED GUIDE"}
                                    </span>
                                </div>
                            </div>

                            {showIdCard && (
                                <button
                                    className={`w-full mt-4 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${getThemeBg()}`}
                                >
                                    <Download size={18} /> Download ID Card
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============== STAGE CARD ==============
const StageCard = ({ title, desc, icon, status, themeColor = "text-earth-900", children }) => {
    return (
        <div
            className={`relative pl-10 ${
                status === "locked" ? "opacity-60 grayscale" : "opacity-100"
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

// ============== EXTRA ICON ==============
const EyeIcon = ({ size }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);
