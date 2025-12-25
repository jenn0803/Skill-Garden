import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function LessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [quizResult, setQuizResult] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);

  // ----------------------------
  // NOTES
  // ----------------------------
  const [noteText, setNoteText] = useState("");
  const [noteId, setNoteId] = useState(null);
  const [noteLoading, setNoteLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ----------------------------
  // YOUTUBE
  // ----------------------------
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const youTubeReadyRef = useRef(false);

  const token = localStorage.getItem("token");

  // ----------------------------
  // LOGOUT
  // ----------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ----------------------------
  // GET USER
  // ----------------------------
  const getUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded;
    } catch (err) {
      return null;
    }
  };

  const user = getUser();

  // ----------------------------
  // EXTRACT VIDEO ID
  // ----------------------------
  const extractVideoId = (url) => {
    if (!url) return null;
    const reg = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(reg);
    return match?.[2] || null;
  };

  // ----------------------------
  // LOAD LESSON
  // ----------------------------
  useEffect(() => {
    api
      .get(`/lessons/${lessonId}`)
      .then((res) => setLesson(res.data))
      .catch(console.error);
  }, [lessonId]);

  // ----------------------------
  // LOAD NOTE
  // ----------------------------
  useEffect(() => {
    if (!user) return;
    if (!lessonId) return;

    setNoteLoading(true);

    api
      .get(`/notes/user-lesson?userId=${user.id}&lessonId=${lessonId}`)
      .then((res) => {
        const note = res.data;
        if (note) {
          setNoteText(note.text);
          setNoteId(note._id);
        } else {
          setNoteText("");
          setNoteId(null);
        }
      })
      .catch(console.error)
      .finally(() => setNoteLoading(false));
  }, [lessonId, user?.id]);

  // ----------------------------
  // SAVE NOTE
  // ----------------------------
  const saveNote = () => {
    if (!user) return;

    setSaving(true);

    api
      .post("/notes/upsert", {
        userId: user.id,
        lessonId,
        text: noteText,
        noteId: noteId || undefined,
      })
      .then((res) => setNoteId(res.data._id))
      .catch(console.error)
      .finally(() => setSaving(false));
  };

  // AUTO-SAVE
  useEffect(() => {
    if (!user) return;
    if (noteLoading) return;

    const timer = setTimeout(saveNote, 1200);
    return () => clearTimeout(timer);
  }, [noteText]);

  // ----------------------------
  // DELETE NOTE
  // ----------------------------
  const deleteNote = () => {
    if (!noteId) return;

    api
      .delete(`/notes/${noteId}`, { data: { userId: user.id } })
      .then(() => {
        setNoteId(null);
        setNoteText("");
      })
      .catch(console.error);
  };

  // ----------------------------
  // DOWNLOAD NOTES PDF
  // ----------------------------
  const downloadPDF = async () => {
  if (!noteId) {
    alert("No note to download");
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/notes/pdf?noteId=${noteId}`, {
      method: "GET",
    });

    if (!response.ok) throw new Error("Failed to download PDF");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "lesson_note.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("PDF Download Error:", err);
    alert("Failed to download PDF");
  }
};


  // ----------------------------
  // INIT YOUTUBE
  // ----------------------------
  useEffect(() => {
    if (!lesson?.videoUrl) return;

    const videoId = extractVideoId(lesson.videoUrl);
    if (!videoId) return;

    if (!window.YT && !youTubeReadyRef.current) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
    }

    window.onYouTubeIframeAPIReady = () => {
      if (youTubeReadyRef.current) return;
      youTubeReadyRef.current = true;

      playerRef.current = new window.YT.Player("yt-player", {
        videoId,
        events: {
          onReady: () => startTracking(),
          onStateChange: handleVideoStateChange,
        },
      });
    };
  }, [lesson]);

  // ----------------------------
  // TRACK VIDEO PROGRESS
  // ----------------------------
  const startTracking = () => {
    let lastPercent = 0;

    intervalRef.current = setInterval(() => {
      const player = playerRef.current;
      if (!player || !player.getDuration) return;

      const duration = player.getDuration();
      const current = player.getCurrentTime();

      if (duration > 0) {
        const percent = Math.floor((current / duration) * 100);
        if (percent !== lastPercent) {
          lastPercent = percent;
          saveProgress(percent);
        }
      }
    }, 5000);
  };

  const handleVideoStateChange = (event) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      saveProgress(100, true);
    }
  };

  const saveProgress = (percent, completedOverride = false) => {
    const user = getUser();
    if (!user || !lesson) return;

    const completed = completedOverride || percent >= 95;
    const videoPercent = completed ? 100 : percent;

    const courseId =
      lesson.courseId?._id ||
      lesson.course?._id ||
      (typeof lesson.courseId === "string" ? lesson.courseId : null);

    api.post("/progress/upsert", {
      userId: user.id,
      courseId,
      lessonId,
      videoWatchedPercent: videoPercent,
      completed,
    });
  };

  // CLEANUP
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // ----------------------------
  // QUIZ
  // ----------------------------
  const checkAnswer = (qi, oi) => {
    const q = lesson.quiz[qi];
    setQuizResult(q.correctIndex === oi ? "Correct! 🎉" : "Wrong ❌");
  };

  if (!lesson)
    return <div style={{ padding: 20, fontSize: 20 }}>Loading lesson...</div>;

  return (
    <>
      {/* NAVBAR */}
      <nav className="sg-navbar">
        <div className="sg-nav-left" onClick={() => navigate("/")}>
          <h2 className="sg-logo">🌱 SkillGarden</h2>
        </div>

        <div className="sg-nav-center">
          <Link to="/" className="sg-nav-link">Home</Link>
          <Link to="/categories" className="sg-nav-link">Categories</Link>
          <Link to="/courses" className="sg-nav-link">Courses</Link>
          <Link to="/contact-us" className="sg-nav-link">Contact Us</Link>
        </div>

        <div className="sg-nav-right">
          {token ? (
            <>
              <Link to="/profile" className="sg-nav-btn filled">Profile</Link>
              <button className="sg-nav-btn outline" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="sg-nav-btn filled">Login</Link>
          )}
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ maxWidth: 850, margin: "30px auto", padding: "0 20px" }}>
        <h1 style={{ marginBottom: 10 }}>{lesson.title}</h1>

        {/* VIDEO */}
        <div
          style={{
            position: "relative",
            paddingTop: "56%",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
            marginBottom: 30,
          }}
        >
          <div
            id="yt-player"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
          ></div>
        </div>

        {/* NOTES */}
        {user ? (
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "20px",
              boxShadow:
                "0 4px 20px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.12)",
              marginBottom: 30,
              border: "1px solid #e8e8e8",
            }}
          >
            <h2
              style={{
                marginBottom: 15,
                fontWeight: 600,
                fontSize: "20px",
                color: "#222",
              }}
            >
              📝 Lesson Notes
            </h2>

            {noteLoading ? (
              <p>Loading notes...</p>
            ) : (
              <>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Type your notes…"
                  style={{
                    width: "100%",
                    minHeight: 180,
                    resize: "vertical",
                    padding: "14px 16px",
                    fontSize: "16px",
                    borderRadius: "14px",
                    border: "1px solid #d8d8d8",
                    background: "#fafafa",
                    outline: "none",
                    lineHeight: "1.6",
                    fontFamily: "system-ui",
                    transition: "0.2s",
                  }}
                />

                <div
                  style={{
                    marginTop: 15,
                    display: "flex",
                    gap: 12,
                  }}
                >
                  <button
                    onClick={saveNote}
                    disabled={saving}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "12px",
                      background: "#007aff",
                      color: "white",
                      fontSize: "16px",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 500,
                      boxShadow: "0 2px 6px rgba(0,122,255,0.3)",
                    }}
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>

                  {noteId && (
                    <button
                      onClick={deleteNote}
                      style={{
                        padding: "10px 20px",
                        borderRadius: "12px",
                        background: "#ff3b30",
                        color: "white",
                        fontSize: "16px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Delete
                    </button>
                  )}

                  {noteId && (
                    <button
                      onClick={downloadPDF}
                      style={{
                        padding: "10px 20px",
                        borderRadius: "12px",
                        background: "#4CAF50",
                        color: "white",
                        fontSize: "16px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Download PDF
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <p style={{ color: "#555" }}>Login to write and save notes.</p>
        )}

        {/* QUIZ TOGGLE */}
        {!showQuiz && (
          <button
            onClick={() => setShowQuiz(true)}
            style={{
              padding: "12px 22px",
              fontSize: 18,
              background: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              marginBottom: 20,
            }}
          >
            🎯 Start Quiz
          </button>
        )}

        {/* QUIZ */}
        {showQuiz && (
          <div
            style={{
              padding: 20,
              borderRadius: 12,
              background: "#f9f9f9",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ color: "black" }}>Quiz</h2>

            {lesson.quiz?.map((q, qi) => (
              <div
                key={qi}
                style={{
                  marginBottom: 25,
                  paddingBottom: 10,
                  borderBottom: "1px solid #ccc",
                }}
              >
                <h3 style={{ color: "black", marginBottom: "10px" }}>
                  {q.question}
                </h3>

                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => checkAnswer(qi, oi)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      margin: "6px 0",
                      padding: "12px 14px",
                      borderRadius: 8,
                      background: "#eef2f3",
                      border: "1px solid #ccc",
                      cursor: "pointer",
                      fontSize: 16,
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ))}

            {quizResult && (
              <p style={{ fontSize: 20, marginTop: 15 }}>{quizResult}</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
