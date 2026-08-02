import './RobotMascot.css';

const features = [
    { icon: "fa-solid fa-comment-dots", label: "AI Chat Assistant", pos: "p1", color: "violet" },
    { icon: "fa-solid fa-image", label: "Text & Image Chat", pos: "p2", color: "teal" },
    { icon: "fa-solid fa-microphone", label: "Voice Assistant", pos: "p3", color: "coral" },
    { icon: "fa-solid fa-code", label: "Developer Assistant", pos: "p4", color: "gold" },
     { icon: "fa-solid fa-pen-nib", label: "Content Generator", pos: "p5", color: "blue" },
    { icon: "fa-solid fa-wand-magic-sparkles", label: "Smart Prompting", pos: "p6", color: "pink" },
    
];

function RobotMascot() {
    return (
        <div className="robotStage">

            <div className="heroBadgeWrap">
                <div className="heroBadge">
                    <i className="fa-solid fa-sparkles"></i>
                    <span>Modern AI Workspace</span>
                </div>
            </div>

            {features.map((f, idx) => (
                <div
                    className={`featureBadge ${f.pos} c-${f.color}`}
                    key={idx}
                    style={{ animationDelay: `${idx * 0.12}s, ${0.8 + idx * 0.12}s` }}
                >
                    <i className={f.icon}></i>
                    <span>{f.label}</span>
                </div>
            ))}

            <svg viewBox="0 0 680 420" className="robotSvg" xmlns="http://www.w3.org/2000/svg">
                <g className="bubble1">
                    <rect x="410" y="60" width="130" height="42" rx="21" fill="#E6F1FB" stroke="#85B7EB" strokeWidth="0.5" />
                    <circle cx="435" cy="81" r="4" fill="#378ADD" />
                    <circle cx="455" cy="81" r="4" fill="#378ADD" />
                    <circle cx="475" cy="81" r="4" fill="#378ADD" />
                </g>
                <g className="bubble2">
                    <rect x="460" y="120" width="110" height="36" rx="18" fill="#EEEDFE" stroke="#AFA9EC" strokeWidth="0.5" />
                    <line x1="480" y1="138" x2="550" y2="138" stroke="#7F77DD" strokeWidth="3" strokeLinecap="round" />
                </g>
                <g className="bubble3">
                    <rect x="150" y="90" width="100" height="34" rx="17" fill="#E1F5EE" stroke="#5DCAA5" strokeWidth="0.5" />
                    <line x1="168" y1="107" x2="230" y2="107" stroke="#1D9E75" strokeWidth="3" strokeLinecap="round" />
                </g>
                <g className="robot">
                    <ellipse cx="340" cy="370" rx="80" ry="12" fill="#000000" opacity="0.08" />
                    <rect x="300" y="270" width="80" height="90" rx="24" fill="#F1EFE8" stroke="#B4B2A9" strokeWidth="0.5" />
                    <circle cx="340" cy="315" r="18" fill="#378ADD" />
                    <circle cx="340" cy="315" r="9" fill="#E6F1FB" />
                    <g className="arm">
                        <path d="M 380 285 Q 415 290 420 265" fill="none" stroke="#B4B2A9" strokeWidth="6" strokeLinecap="round" />
                        <circle cx="421" cy="262" r="9" fill="#F1EFE8" stroke="#B4B2A9" strokeWidth="0.5" />
                    </g>
                    <path d="M 300 300 Q 275 305 278 340" fill="none" stroke="#B4B2A9" strokeWidth="6" strokeLinecap="round" />
                    <circle cx="278" cy="343" r="9" fill="#F1EFE8" stroke="#B4B2A9" strokeWidth="0.5" />
                    <circle cx="340" cy="180" r="60" fill="#F1EFE8" stroke="#B4B2A9" strokeWidth="0.5" />
                    <rect x="286" y="160" width="108" height="40" rx="20" fill="#2C2C2A" />
                    <circle className="eye" cx="315" cy="180" r="10" fill="#5DCAA5" />
                    <circle className="eye" cx="365" cy="180" r="10" fill="#5DCAA5" />
                    <line x1="325" y1="210" x2="355" y2="210" stroke="#B4B2A9" strokeWidth="4" strokeLinecap="round" />
                    <line x1="340" y1="120" x2="340" y2="95" stroke="#B4B2A9" strokeWidth="4" />
                    <circle className="antenna-light" cx="340" cy="88" r="9" fill="#378ADD" />
                </g>
            </svg>
        </div>
    )
}

export default RobotMascot;