"use client";
import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface EditableTextProps {
  value: string;
  onSave: (v: string) => void;
  as?: keyof JSX.IntrinsicElements;
  multiline?: boolean;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
}

export default function EditableText({
  value,
  onSave,
  as: Tag = "span",
  multiline = false,
  className,
  style,
  placeholder,
}: EditableTextProps) {
  const { profile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const isAdmin = profile?.role === "admin";

  // Non-admin: render plain element
  if (!isAdmin) {
    const El = Tag as React.ElementType;
    return <El className={className} style={style}>{value}</El>;
  }

  function open() {
    setDraft(value);
    setEditing(true);
  }
  function commit() {
    onSave(draft.trim() || value);
    setEditing(false);
  }
  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  if (editing) {
    const inputStyle: React.CSSProperties = {
      ...style,
      display: "inline-block",
      background: "rgba(56,189,248,0.08)",
      border: "1.5px solid rgba(56,189,248,0.5)",
      borderRadius: 8,
      padding: "2px 10px",
      outline: "none",
      color: "inherit",
      font: "inherit",
      letterSpacing: "inherit",
      lineHeight: "inherit",
      width: multiline ? "100%" : undefined,
      minWidth: 120,
      resize: multiline ? "vertical" : undefined,
    };

    return (
      <span style={{ display: "inline-flex", alignItems: "flex-start", gap: 6, flexWrap: "wrap" }}>
        {multiline ? (
          <textarea
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === "Escape") cancel(); }}
            style={{ ...inputStyle, minHeight: 80 } as React.CSSProperties}
          />
        ) : (
          <input
            autoFocus
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") cancel(); }}
            style={inputStyle}
          />
        )}
        <span style={{ display: "inline-flex", gap: 4, alignItems: "center", paddingTop: 4 }}>
          <button
            onClick={commit}
            title="Save"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 22, height: 22, borderRadius: 6, cursor: "pointer",
              background: "rgba(52,211,153,0.2)", border: "1px solid rgba(52,211,153,0.5)",
              color: "#34D399",
            }}
          ><Check size={11} strokeWidth={2.5} /></button>
          <button
            onClick={cancel}
            title="Cancel"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 22, height: 22, borderRadius: 6, cursor: "pointer",
              background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.5)",
              color: "#EF4444",
            }}
          ><X size={11} strokeWidth={2.5} /></button>
        </span>
      </span>
    );
  }

  const El = Tag as React.ElementType;
  return (
    <El
      className={className}
      style={{ ...style, cursor: "pointer", position: "relative" }}
      onClick={open}
      title="Click to edit"
    >
      {value || placeholder}
      <span
        style={{
          display: "inline-flex", alignItems: "center",
          marginLeft: 6, verticalAlign: "middle",
          opacity: 0.45,
        }}
        aria-hidden="true"
      >
        <Pencil size={11} color="var(--accent)" />
      </span>
    </El>
  );
}
