"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Painting, PaintingCategory } from "@/types/painting";
import { CATEGORIES } from "@/types/painting";
import { refreshGallery } from "@/app/gallery/actions";
import styles from "./Admin.module.css";

type View = "login" | "dashboard" | "add" | "edit";

const STORAGE_BUCKET = "paintings";

export default function AdminClient() {
  const [view, setView] = useState<View>("login");
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [editTarget, setEditTarget] = useState<Painting | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const supabase = createClient();

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchPaintings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("paintings")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) { showToast(error.message, "error"); return; }
    setPaintings((data as Painting[]) ?? []);
  }, [supabase]);

  useEffect(() => {
    if (view === "dashboard") fetchPaintings();
  }, [view, fetchPaintings]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this painting permanently?")) return;
    const { error } = await supabase.from("paintings").delete().eq("id", id);
    if (error) { showToast(error.message, "error"); return; }
    refreshGallery();
    showToast("Painting deleted.");
    fetchPaintings();
  };

  if (view === "login") {
    return (
      <LoginScreen
        onLogin={() => setView("dashboard")}
        showToast={showToast}
      />
    );
  }

  return (
    <div className={styles.admin}>
      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${toast.type === "error" ? styles.toastError : styles.toastSuccess}`}>
          {toast.msg}
        </div>
      )}

      {/* Top bar */}
      <header className={styles.topbar}>
        <div className={styles.topbarBrand}>
          <div className={styles.topbarLogo}>AM</div>
          <div>
            <p className={styles.topbarTitle}>Admin Panel</p>
            <p className={styles.topbarSub}>Gallery Management</p>
          </div>
        </div>
        <div className={styles.topbarActions}>
          {view === "dashboard" ? (
            <button
              className="btn btn-primary"
              onClick={() => { setEditTarget(null); setView("add"); }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
              Add Painting
            </button>
          ) : (
            <button className="btn btn-outline" onClick={() => setView("dashboard")}>
              ← Back to Dashboard
            </button>
          )}
          <button className={styles.logoutBtn} onClick={() => setView("login")}>
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <div className={`container ${styles.content}`}>
        {view === "dashboard" && (
          <Dashboard
            paintings={paintings}
            loading={loading}
            onEdit={(p) => { setEditTarget(p); setView("edit"); }}
            onDelete={handleDelete}
            onAdd={() => { setEditTarget(null); setView("add"); }}
          />
        )}
        {(view === "add" || view === "edit") && (
          <PaintingForm
            painting={editTarget}
            supabase={supabase}
            onSuccess={() => { setView("dashboard"); showToast(editTarget ? "Painting updated!" : "Painting added!"); }}
            showToast={showToast}
          />
        )}
      </div>
    </div>
  );
}

/* ── Login ── */
function LoginScreen({
  onLogin,
  showToast,
}: {
  onLogin: () => void;
  showToast: (msg: string, type: "success" | "error") => void;
}) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      onLogin();
    } else {
      showToast("Invalid password.", "error");
    }
  };

  return (
    <div className={styles.loginPage}>
      <form className={styles.loginCard} onSubmit={handleSubmit}>
        <div className={styles.loginLogo}>AM</div>
        <h1 className={styles.loginTitle}>Admin Access</h1>
        <p className={styles.loginSub}>Enter your admin password to continue</p>
        <div className="form-group" style={{ marginTop: "1.5rem" }}>
          <label className="form-label" htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}
          disabled={loading}
        >
          {loading ? "Verifying…" : "Enter Admin Panel"}
        </button>
      </form>
    </div>
  );
}

/* ── Dashboard ── */
function Dashboard({
  paintings,
  loading,
  onEdit,
  onDelete,
  onAdd,
}: {
  paintings: Painting[];
  loading: boolean;
  onEdit: (p: Painting) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}) {
  const stats = {
    total: paintings.length,
    available: paintings.filter((p) => p.is_available).length,
    categories: new Set(paintings.map((p) => p.category)).size,
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashHeader}>
        <div>
          <h2 className={styles.dashTitle}>All Paintings</h2>
          <p className={styles.dashSub}>{stats.total} works in the collection</p>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <StatCard label="Total Works" value={stats.total} icon="🖼️" />
        <StatCard label="Available" value={stats.available} icon="✅" />
        <StatCard label="Categories" value={stats.categories} icon="🎨" />
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <div className="spinner" />
        </div>
      ) : paintings.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>No paintings yet</p>
          <p className={styles.emptySub}>Add your first painting to get started.</p>
          <button className="btn btn-primary" onClick={onAdd} style={{ marginTop: "1rem" }}>
            Add First Painting
          </button>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Tags</th>
                <th>Year</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paintings.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className={styles.thumb}>
                      <Image
                        src={p.image_url}
                        alt={p.title}
                        fill
                        sizes="56px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </td>
                  <td>
                    <p className={styles.tableTitle}>{p.title}</p>
                    <p className={styles.tableSub}>{p.description.slice(0, 60)}{p.description.length > 60 ? "…" : ""}</p>
                  </td>
                  <td><span className="tag tag-gold">{p.category}</span></td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                      {(p.tags ?? []).slice(0, 3).map((t) => (
                        <span key={t} className="tag tag-muted" style={{ fontSize: "0.625rem" }}>{t}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>{p.year ?? "—"}</td>
                  <td>
                    <span className={`${styles.availableBadge} ${p.is_available ? styles.badgeYes : styles.badgeNo}`}>
                      {p.is_available ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <button className={styles.editBtn} onClick={() => onEdit(p)} aria-label="Edit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                      </button>
                      <button className={styles.deleteBtn} onClick={() => onDelete(p.id)} aria-label="Delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statIcon}>{icon}</span>
      <p className={styles.statValue}>{value}</p>
      <p className={styles.statLabel}>{label}</p>
    </div>
  );
}

/* ── Painting Form ── */
function PaintingForm({
  painting,
  supabase,
  onSuccess,
  showToast,
}: {
  painting: Painting | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any;
  onSuccess: () => void;
  showToast: (msg: string, type: "success" | "error") => void;
}) {
  const isEdit = !!painting;
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(painting?.title ?? "");
  const [description, setDescription] = useState(painting?.description ?? "");
  const [category, setCategory] = useState<PaintingCategory>(painting?.category ?? "Oil");
  const [tagsInput, setTagsInput] = useState((painting?.tags ?? []).join(", "));
  const [year, setYear] = useState(painting?.year?.toString() ?? "");
  const [dimensions, setDimensions] = useState(painting?.dimensions ?? "");
  const [isAvailable, setIsAvailable] = useState(painting?.is_available ?? true);
  const [price, setPrice] = useState(painting?.price?.toString() ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(painting?.image_url ?? "");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEdit && !imageFile) {
      showToast("Please select an image.", "error");
      return;
    }

    setUploading(true);

    let imageUrl = painting?.image_url ?? "";

    // Upload image if new file selected
    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, imageFile, { upsert: false });

      if (uploadError) {
        setUploading(false);
        showToast(`Upload failed: ${uploadError.message}`, "error");
        return;
      }

      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(path);
      imageUrl = urlData.publicUrl;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      description,
      category,
      tags,
      image_url: imageUrl,
      year: year ? parseInt(year) : null,
      dimensions: dimensions || null,
      is_available: isAvailable,
      price: price ? parseFloat(price) : null,
    };

    let error;
    if (isEdit) {
      ({ error } = await supabase
        .from("paintings")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", painting!.id));
    } else {
      ({ error } = await supabase.from("paintings").insert(payload));
    }

    setUploading(false);

    if (error) {
      showToast(error.message, "error");
    } else {
      refreshGallery();
      onSuccess();
    }
  };

  return (
    <div className={styles.formWrap}>
      <h2 className={styles.formTitle}>
        {isEdit ? "Edit Painting" : "Add New Painting"}
      </h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          {/* Left: Image upload */}
          <div className={styles.formLeft}>
            <div
              className={styles.dropzone}
              onClick={() => fileRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
            >
              {preview ? (
                <div className={styles.previewWrap}>
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized={preview.startsWith("blob:")}
                  />
                  <div className={styles.previewOverlay}>
                    <span>Change Image</span>
                  </div>
                </div>
              ) : (
                <div className={styles.dropzonePlaceholder}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--color-text-dim)" }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p>Click to upload image</p>
                  <p style={{ fontSize: "0.75rem" }}>JPG, PNG, WEBP · Max 5MB</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="painting-image"
            />
          </div>

          {/* Right: Fields */}
          <div className={styles.formRight}>
            <div className="form-group">
              <label className="form-label" htmlFor="painting-title">Title *</label>
              <input
                id="painting-title"
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Monsoon in Goa"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="painting-description">Description *</label>
              <textarea
                id="painting-description"
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the work, inspiration, technique…"
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" htmlFor="painting-category">Category *</label>
                <select
                  id="painting-category"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PaintingCategory)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" htmlFor="painting-year">Year</label>
                <input
                  id="painting-year"
                  type="number"
                  className="form-input"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder={new Date().getFullYear().toString()}
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="painting-tags">Tags (comma separated)</label>
              <input
                id="painting-tags"
                type="text"
                className="form-input"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. landscape, nature, monsoon"
              />
            </div>

            <div className={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" htmlFor="painting-dimensions">Dimensions</label>
                <input
                  id="painting-dimensions"
                  type="text"
                  className="form-input"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="e.g. 24×36 in"
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" htmlFor="painting-price">Price (₹)</label>
                <input
                  id="painting-price"
                  type="number"
                  className="form-input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 25000"
                  min="0"
                />
              </div>
            </div>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className={styles.checkbox}
                id="painting-available"
              />
              <span>Available for sale / commission</span>
            </label>

            <div className={styles.formActions}>
              <button type="submit" className="btn btn-primary" disabled={uploading} style={{ minWidth: "160px", justifyContent: "center" }}>
                {uploading ? "Saving…" : isEdit ? "Update Painting" : "Add Painting"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
