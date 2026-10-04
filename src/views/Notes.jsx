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
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/Payment.css"; // Uses the shared responsive docs styling

const DOCS_URL = "https://docs.google.com/document/d/1IdCr9Yn-EOljercs7N8O5HTqFbkrUMj3Mu9xn-5MzTw/edit?usp=sharing";
const EMBED_URL = "https://docs.google.com/document/d/1IdCr9Yn-EOljercs7N8O5HTqFbkrUMj3Mu9xn-5MzTw/preview";

export default function Notes() {
  const [copied, setCopied] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [showPreview, setShowPreview] = useState(true);

  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser).user || JSON.parse(rawUser) : null;
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(DOCS_URL);
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
            <span>Admin Knowledge Base</span>
          </div>
          <h1 className="payment-title">Workspace Notes & Docs</h1>
          <p className="payment-subtitle">
            Centralized Google Docs repository for sprint notes, operational playbooks, client requirements, and team guidelines.
          </p>
        </div>

        <div className="payment-header-actions">
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-open-docs-primary"
          >
            <ExternalLink size={16} />
            <span>Open in Google Docs</span>
          </a>
        </div>
      </div>

      {/* Info & Document Details Card */}
      <div className="payment-details-card">
        <div className="details-header-row">
          <div className="details-icon-wrapper note-icon-color">
            <StickyNote size={22} />
          </div>
          <div className="details-text-group">
            <h3 className="details-card-title">ALOO SMP Central Notes Ledger</h3>
            <p className="details-card-desc">
              All collaborative documentation, feature specifications, and team briefings are maintained live inside this Google Doc. Admins have complete editing and commenting privileges.
            </p>
          </div>
        </div>

        {/* Link Copy Bar */}
        <div className="docs-link-bar">
          <span className="docs-url-label">Document Link:</span>
          <span className="docs-url-display">{DOCS_URL}</span>
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
            <span className="embed-toolbar-title">Live Document Preview</span>
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
              href={DOCS_URL}
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
              key={iframeKey}
              src={EMBED_URL}
              title="Google Docs Notes Documentation"
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
