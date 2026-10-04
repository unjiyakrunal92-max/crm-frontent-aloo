import React, { useState } from "react";
import { 
  CreditCard, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  FileText, 
  Lock, 
  ArrowLeft,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/Payment.css";

const DOCS_URL = "https://docs.google.com/document/d/1AAt3WDQqtrhyamSJGj-VvKS0UPa3z3N5DF3G6RLmc_Y/edit?usp=sharing";
const EMBED_URL = "https://docs.google.com/document/d/1AAt3WDQqtrhyamSJGj-VvKS0UPa3z3N5DF3G6RLmc_Y/preview";

export default function Payment() {
  const [copied, setCopied] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

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

  // If not admin, show access denied card
  if (!isAdmin) {
    return (
      <div className="payment-restricted-container">
        <div className="payment-restricted-card">
          <div className="restricted-icon-box">
            <Lock size={32} />
          </div>
          <h2>Restricted Access</h2>
          <p>
            The Payment section is strictly reserved for administrators. You do not have permission to view or manage payment documentation.
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
            <span>Admin Confidential</span>
          </div>
          <h1 className="payment-title">Payment Documentation</h1>
          <p className="payment-subtitle">
            Centralized Google Docs repository for financial tracking, salary disbursements, and invoice logs.
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
          <div className="details-icon-wrapper">
            <FileText size={22} />
          </div>
          <div>
            <h3 className="details-card-title">ALOO SMP Payment & Accounts Ledger</h3>
            <p className="details-card-desc">
              All payment records, invoice history, and compensation adjustments are documented in real time inside this Google Doc. As an administrator, you have full edit permissions.
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
              className="btn-toolbar-refresh"
              onClick={handleRefreshIframe}
              title="Reload Document Preview"
            >
              <RefreshCw size={14} />
              <span>Refresh Preview</span>
            </button>
            <a
              href={DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-toolbar-external"
            >
              <ExternalLink size={14} />
              <span>Full Screen / Edit</span>
            </a>
          </div>
        </div>

        <div className="embed-frame-wrapper">
          <iframe
            key={iframeKey}
            src={EMBED_URL}
            title="Google Docs Payment Documentation"
            className="payment-docs-iframe"
            allow="autoplay"
          />
        </div>
      </div>
    </div>
  );
}
