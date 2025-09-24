import { useEffect, useMemo, useState } from "react";

function CenterPanel() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("info"); // 'error' | 'success' | 'info' | 'warning'
  const [selectedPost, setSelectedPost] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/api/rss`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Failed to load blogs.");
          setShowToast(true);
          setToastType("error");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
    return () => controller.abort();
  }, [API_BASE]);

  // Auto-hide toast after 5 seconds when shown
  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 5000);
    return () => clearTimeout(t);
  }, [showToast]);

  // Close modal with ESC key
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setSelectedPost(null);
    }
    if (selectedPost) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedPost]);

  const items = useMemo(() => {
    return (posts || [])
      .filter(Boolean)
      .slice(0, 10); // limit to first 10 posts for performance
  }, [posts]);

  function formatDate(value) {
    const d = new Date(value);
    return isNaN(d) ? "" : d.toDateString();
  }

  return (
    <div className="center-panel">
      <h2>Latest Blogs</h2>

      {loading && (
        <div aria-hidden>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="blog-card">
              <div className="skeleton" style={{ height: 18, width: "40%", marginBottom: 10 }} />
              <div className="skeleton" style={{ height: 12, width: "100%", marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 12, width: "90%", marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 12, width: "70%", marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 10, width: 120 }} />
            </div>
          ))}
        </div>
      )}
      {/* Inline error fallback (screen-reader visible) */}
      {!loading && error && (
        <p role="alert" style={{ color: "#ffd7d7" }}>{error}</p>
      )}

      {!loading && !error && items.length === 0 && (
        <p>No posts found.</p>
      )}

      {!loading && !error && items.length > 0 && (
        items.map((post, index) => (
          <div
            key={post.link || index}
            className="blog-card"
            onClick={() => setSelectedPost(post)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setSelectedPost(post);
            }}
          >
            <h3>
              <a
                href={post.link}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                {post.title || "Untitled"}
              </a>
            </h3>
            <p>{(post.contentSnippet || "").slice(0, 150)}{post.contentSnippet && post.contentSnippet.length > 150 ? "..." : ""}</p>
            <small>Published: {formatDate(post.pubDate)}</small>
          </div>
        ))
      )}

      {/* Pop-up / Zoom modal */}
      {selectedPost && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedPost(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedPost(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 style={{ marginTop: 0 }}>
              <a href={selectedPost.link} target="_blank" rel="noreferrer">
                {selectedPost.title || "Untitled"}
              </a>
            </h3>
            <p>{selectedPost.contentSnippet || ""}</p>
            <small>Published: {formatDate(selectedPost.pubDate)}</small>
          </div>
        </div>
      )}

      {/* Toast notification for errors */}
      {showToast && (
        <div className={`toast toast--${toastType}`} role="status" aria-live="polite">
          <div className="toast-content">
            <strong style={{ marginRight: 6 }}>Error:</strong>
            <span>{error}</span>
          </div>
          <button
            className="toast-close"
            onClick={() => setShowToast(false)}
            aria-label="Dismiss notification"
            title="Dismiss"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default CenterPanel;
