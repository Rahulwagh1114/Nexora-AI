import './insights.css';
import { useEffect, useState } from 'react';

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TOPIC_RULES = [
    { key: "code", match: ["code", "function", "bug", "error", "java", "python", "js", "react", "loop", "compont", "component"], color: "#EF9F27" },
    { key: "document", match: ["document", "pdf", "docx", "table", "summar", "notes", "letter"], color: "#7F77DD" },
    { key: "resume", match: ["resume", "cv", "cover letter", "ats"], color: "#5DCAA5" },
    { key: "translate", match: ["translat", "language"], color: "#D85A30" },
    { key: "voice", match: ["voice", "speech", "audio"], color: "#85B7EB" },
    { key: "general", match: [], color: "#B4B2A9" },
];

function bucketTopic(title = "") {
    const lower = title.toLowerCase();
    for (const rule of TOPIC_RULES) {
        if (rule.key !== "general" && rule.match.some(w => lower.includes(w))) return rule.key;
    }
    return "general";
}

function estimateTokens(threads) {
    let chars = 0;
    threads.forEach(t => {
        (t.message || []).forEach(m => { chars += (m.content || "").length; });
    });
    return Math.round(chars / 4);
}

function formatK(n) {
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "K";
    return n.toString();
}

function buildWeekCounts(threads) {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const counts = new Array(7).fill(0);
    threads.forEach(t => {
        const d = new Date(t.updatedAt);
        if (d >= startOfWeek) {
            const dayIdx = d.getDay();
            counts[dayIdx]++;
        }
    });
    return counts;
}

function smoothPath(points) {
    if (points.length < 2) return "";
    let d = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 0; i < points.length - 1; i++) {
        const [x0, y0] = points[i];
        const [x1, y1] = points[i + 1];
        const midX = (x0 + x1) / 2;
        d += ` C ${midX} ${y0}, ${midX} ${y1}, ${x1} ${y1}`;
    }
    return d;
}

function Insights() {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);

   useEffect(() => {
    const getInsights = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");

            if (!accessToken) {
                setThreads([]);
                setLoading(false);
                return;
            }

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/thread`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.log(data.error);
                setThreads([]);
            } else {
                setThreads(Array.isArray(data) ? data : []);
            }

        } catch (err) {
            console.log(err);
            setThreads([]);
        }

        setLoading(false);
    };

    getInsights();
}, []);

    if (loading) {
        return <div className="insightsPage"><p className="loadingText">Loading insights…</p></div>;
    }

    const now = new Date();
    const todayStr = now.toDateString();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const totalChats = threads.length;
    const dailyUsage = threads.filter(t => new Date(t.updatedAt).toDateString() === todayStr).length;
    const monthlyUsage = threads.filter(t => {
        const d = new Date(t.updatedAt);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;
    const tokenUsage = estimateTokens(threads);

    const weekCounts = buildWeekCounts(threads);
    const maxVal = Math.max(...weekCounts, 4);
    const chartTop = Math.ceil(maxVal / 4) * 4 || 4;

    const W = 900, H = 260, padL = 40, padB = 30, padT = 10;
    const stepX = (W - padL - 10) / 6;
    const points = weekCounts.map((v, i) => {
        const x = padL + i * stepX;
        const y = padT + (1 - v / chartTop) * (H - padT - padB);
        return [x, y];
    });
    const linePath = smoothPath(points);
    const areaPath = `${linePath} L ${points[6][0]} ${H - padB} L ${points[0][0]} ${H - padB} Z`;

    const topicCounts = {};
    threads.forEach(t => {
        const key = bucketTopic(t.title);
        topicCounts[key] = (topicCounts[key] || 0) + 1;
    });
    const topicTotal = Object.values(topicCounts).reduce((a, b) => a + b, 0) || 1;
    const topicLabels = { code: "Code & dev", document: "Document Q&A", resume: "Resume polish", translate: "Translation", voice: "Voice chat", general: "General chat" };
    const topTopics = Object.entries(topicCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([key, count]) => ({
            label: topicLabels[key],
            pct: Math.round((count / topicTotal) * 100),
            color: TOPIC_RULES.find(r => r.key === key)?.color || "#B4B2A9",
        }));

    const cards = [
        { icon: "fa-solid fa-comments", label: "Total chats", value: totalChats.toLocaleString(), color: "violet" },
        { icon: "fa-solid fa-wave-square", label: "Daily usage", value: `${dailyUsage} session${dailyUsage === 1 ? "" : "s"}`, color: "gold" },
        { icon: "fa-solid fa-calendar-days", label: "Monthly usage", value: `${monthlyUsage} session${monthlyUsage === 1 ? "" : "s"}`, color: "violet" },
        { icon: "fa-solid fa-coins", label: "Token usage (est.)", value: formatK(tokenUsage), color: "gold" },
    ];

    return (
        <div className="insightsPage">
            <div className="statGrid">
                {cards.map((c, idx) => (
                    <div className="statCard" key={idx}>
                        <div className={`statIcon c-${c.color}`}><i className={c.icon}></i></div>
                        <p className="statValue">{c.value}</p>
                        <p className="statLabel">{c.label}</p>
                    </div>
                ))}
            </div>

            <div className="insightsRow">
                <div className="chartCard">
                    <div className="cardHeader">
                        <h3>AI usage graph</h3>
                        <span className="pillTag">This week</span>
                    </div>
                    {totalChats === 0 ? (
                        <p className="emptyNote">No activity yet — start chatting to see your usage graph.</p>
                    ) : (
                        <svg viewBox={`0 0 ${W} ${H}`} className="usageSvg" preserveAspectRatio="none">
                            {[0, 1, 2, 3, 4].map(i => {
                                const y = padT + (i / 4) * (H - padT - padB);
                                return <line key={i} x1={padL} y1={y} x2={W - 10} y2={y} className="gridLine" />;
                            })}
                            {[0, 1, 2, 3, 4].map(i => {
                                const val = Math.round(chartTop - (i / 4) * chartTop);
                                const y = padT + (i / 4) * (H - padT - padB);
                                return <text key={i} x={padL - 10} y={y + 4} className="axisLabel" textAnchor="end">{val}</text>;
                            })}
                            <path d={areaPath} className="areaFill" />
                            <path d={linePath} className="lineStroke" />
                            {points.map(([x, y], i) => (
                                <circle key={i} cx={x} cy={y} r="3.5" className="dot" />
                            ))}
                            {DAYS.map((d, i) => (
                                <text key={d} x={padL + i * stepX} y={H - 8} className="axisLabel" textAnchor="middle">{d}</text>
                            ))}
                        </svg>
                    )}
                </div>

                <div className="topicsCard">
                    <div className="cardHeader"><h3>Favorite topics</h3></div>
                    {topTopics.length === 0 ? (
                        <p className="emptyNote">No topics yet.</p>
                    ) : (
                        <div className="topicList">
                            {topTopics.map((t, idx) => (
                                <div className="topicRow" key={idx}>
                                    <div className="topicHead">
                                        <span>{t.label}</span>
                                        <span>{t.pct}%</span>
                                    </div>
                                    <div className="topicBarTrack">
                                        <div className="topicBarFill" style={{ width: `${t.pct}%`, backgroundColor: t.color }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Insights;