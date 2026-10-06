import React, { useState } from "react";
import { 
  StickyNote, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  FileText, 
  Lock, 
  ArrowLeft, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Sparkles,
  ChevronDown,
  BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/Payment.css";

const NOTES_LIST = [
  {
    id: "notes-1",
    label: "Notes - 1",
    tag: "Primary Workspace",
    title: "ALOO SMP Notes - 1",
    subtitle: "Centralized Google Docs repository for sprint notes, operational playbooks, client requirements, and team guidelines.",
    description: "Primary collaborative documentation workspace. Admins have complete editing, reviewing, and commenting privileges inside this Google Doc.",
    url: "https://docs.google.com/document/d/1IdCr9Yn-EOljercs7N8O5HTqFbkrUMj3Mu9xn-5MzTw/edit?usp=sharing",
    embedUrl: "https://docs.google.com/document/d/1IdCr9Yn-EOljercs7N8O5HTqFbkrUMj3Mu9xn-5MzTw/preview"
  },
  {
    id: "notes-2",
    label: "Notes - 2",
    tag: "Sprint & Strategy",
    title: "ALOO SMP Notes - 2",
    subtitle: "Secondary operational notes, sprint plans, feature requirements, and documentation ledger.",
    description: "Secondary collaborative workspace document for strategic documentation, sprint execution notes, task references, and team planning.",
    url: "https://docs.google.com/document/d/1iTeY9KtJwX1nBhafdsVegVXSUb6ywbXEj6Gm48h7zA4/edit?usp=sharing",
    embedUrl: "https://docs.google.com/document/d/1iTeY9KtJwX1nBhafdsVegVXSUb6ywbXEj6Gm48h7zA4/preview"
  },
  {
    id: "notes-3",
    label: "Notes - 3",
    tag: "Technical & Logs",
    title: "ALOO SMP Notes - 3",
    subtitle: "Tertiary documentation repository for technical notes, meeting briefs, and team guidelines.",
    description: "Tertiary documentation workspace for technical guidelines, engineering notes, meeting briefs, and operational tracking.",
    url: "https://docs.google.com/document/d/1N8rzIAfLmtdsc3b1A7aTUJ9M0BjB6C_MOfVwvgcc3EA/edit?usp=sharing",
    embedUrl: "https://docs.google.com/document/d/1N8rzIAfLmtdsc3b1A7aTUJ9M0BjB6C_MOfVwvgcc3EA/preview"
  }
];

export default function Notes() {
  const [selectedNoteId, setSelectedNoteId] = useState("notes-1");
  const [copied, setCopied] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [showPreview, setShowPreview] = useState(true);

  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser).user || JSON.parse(rawUser) : null;
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const currentNote = NOTES_LIST.find((n) => n.id === selectedNoteId) || NOTES_LIST[0];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentNote.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRefreshIframe = () => {
    setIframeKey((prev) => prev + 1);
  };

  // If not admin, show access restricted prompt
  if (!isAdmin) {
    return (
      <div className="payment-restricted-container">
        <div className="payment-restricted-card">
          <div className="restricted-icon-box">
            <Lock size={32} />
          </div>
          <h2>Restricted Access</h2>
          <p>
            The Notes section is strictly reserved for administrators. You do not have permission to view or edit this documentation.
          </p>
          <Link to="/" className="btn-restricted-home">
            <ArrowLeft size={16} />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page-container">
      {/* Page Header */}
      <div className="payment-header-section">
        <div className="payment-header-left">
          <div className="payment-badge">
            <ShieldCheck size={14} />
            <span>Admin Knowledge Base • {currentNote.label}</span>
          </div>
          <h1 className="payment-title">{currentNote.title}</h1>
          <p className="payment-subtitle">
            {currentNote.subtitle}
          </p>
        </div>

        <div className="payment-header-actions notes-header-actions-group">
          {/* Dropdown Selector for Notes Documents */}
          <div className="notes-dropdown-container">
            <BookOpen size={16} className="notes-dropdown-icon" />
            <select
              id="notes-dropdown-select"
              aria-label="Select Notes document"
              className="notes-dropdown-select"
              value={selectedNoteId}
              onChange={(e) => {
                setSelectedNoteId(e.target.value);
                setCopied(false);
              }}
            >
              {NOTES_LIST.map((note) => (
                <option key={note.id} value={note.id}>
                  {note.label} ({note.tag})
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="notes-dropdown-chevron" />
          </div>

          <a
            href={currentNote.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-open-docs-primary"
          >
            <ExternalLink size={16} />
            <span>Open in Google Docs</span>
          </a>
        </div>
      </div>

      {/* Quick Navigation Pills for Instant 1-Click Switching */}
      <div className="notes-pills-bar">
        <span className="notes-pills-label">Switch Notes:</span>
        <div className="notes-pills-grid">
          {NOTES_LIST.map((note) => {
            const isActive = selectedNoteId === note.id;
            return (
              <button
                key={note.id}
                type="button"
                className={`notes-pill-btn ${isActive ? "active" : ""}`}
                onClick={() => {
                  setSelectedNoteId(note.id);
                  setCopied(false);
                }}
              >
                <StickyNote size={14} />
                <span>{note.label}</span>
                <span className="notes-pill-badge">{note.tag}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Info & Document Details Card */}
      <div className="payment-details-card">
        <div className="details-header-row">
          <div className="details-icon-wrapper note-icon-color">
            <StickyNote size={22} />
          </div>
          <div className="details-text-group">
            <h3 className="details-card-title">{currentNote.title}</h3>
            <p className="details-card-desc">
              {currentNote.description}
            </p>
          </div>
        </div>

        {/* Link Copy Bar */}
        <div className="docs-link-bar">
          <span className="docs-url-label">Document Link:</span>
          <span className="docs-url-display">{currentNote.url}</span>
          <button
            type="button"
            className={`btn-copy-link ${copied ? "copied" : ""}`}
            onClick={handleCopyLink}
            title="Copy Google Docs URL"
          >
            {copied ? (
              <>
                <Check size={15} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={15} />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile Quick Recommendation Banner */}
        <div className="mobile-docs-tip-banner">
          <Sparkles size={15} className="tip-icon" />
          <span>
            <strong>Mobile Tip:</strong> Tap <em>"Open in Google Docs"</em> above for full-screen editing, pinch-to-zoom, and native keyboard support on mobile phones.
          </span>
        </div>
      </div>

      {/* Live Embedded Preview Frame */}
      <div className="payment-embed-card">
        <div className="embed-card-toolbar">
          <div className="embed-toolbar-left">
            <span className="embed-live-indicator" />
            <span className="embed-toolbar-title">
              Live Preview: <strong>{currentNote.label}</strong>
            </span>
          </div>

          <div className="embed-toolbar-actions">
            <button
              type="button"
              className="btn-toolbar-toggle"
              onClick={() => setShowPreview(!showPreview)}
              title={showPreview ? "Collapse preview" : "Expand preview"}
            >
              {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{showPreview ? "Hide Preview" : "Show Preview"}</span>
            </button>

            {showPreview && (
              <button
                type="button"
                className="btn-toolbar-refresh"
                onClick={handleRefreshIframe}
                title="Reload Document Preview"
              >
                <RefreshCw size={14} />
                <span>Refresh</span>
              </button>
            )}

            <a
              href={currentNote.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-toolbar-external"
            >
              <ExternalLink size={14} />
              <span>Full Screen</span>
            </a>
          </div>
        </div>

        {showPreview && (
          <div className="embed-frame-wrapper">
            <iframe
              key={`${currentNote.id}-${iframeKey}`}
              src={currentNote.embedUrl}
              title={`Google Docs ${currentNote.label} Documentation`}
              className="payment-docs-iframe"
              allow="autoplay"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  );
}
