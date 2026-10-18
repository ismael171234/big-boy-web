"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Eye,
  EyeOff,
  ImagePlus,
  Package,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import {
  createProductImageUpload,
  deleteProduct,
  listAdminProducts,
  saveProduct,
  setProductFlag,
  type AdminProduct,
} from "@/actions/admin-products";
import { createClient } from "@/lib/supabase/client";
import { money } from "./ui";

const BUCKET = "product-images";
const MAX_IMAGE_MB = 5;

const CATEGORIES = [
  { id: "combos", label: "Combos" },
  { id: "burgers", label: "Burgers" },
  { id: "drinks", label: "Bebidas" },
  { id: "desserts", label: "Postres" },
];

const categoryLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

/* ───────────── Formulario (crear / editar) ───────────── */
function ProductForm({
  product,
  onClose,
  onSaved,
}: {
  product: AdminProduct | null; // null = producto nuevo
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [category, setCategory] = useState(product?.category ?? "burgers");
  const [price, setPrice] = useState(product ? String(product.basePrice) : "");
  const [comparePrice, setComparePrice] = useState(
    product?.compareAtPrice ? String(product.compareAtPrice) : ""
  );
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isAvailable, setIsAvailable] = useState(product?.isAvailable ?? true);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Libera la vista previa al cerrar el formulario
  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  // Cerrar con la tecla Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, saving]);

  const pickFile = (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen.");
      return;
    }
    if (f.size > MAX_IMAGE_MB * 1024 * 1024) {
      setError(`La imagen pesa más de ${MAX_IMAGE_MB} MB. Elige una más liviana.`);
      return;
    }
    setError(null);
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    const url = URL.createObjectURL(f);
    previewRef.current = url;
    setPreview(url);
    setFile(f);
  };

  const removeImage = () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = "";
    setPreview("");
    setFile(null);
    setImageUrl("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const toNumber = (v: string) => Number(v.replace(",", ".").trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setError(null);

    const basePrice = toNumber(price);
    const compare = comparePrice.trim() === "" ? null : toNumber(comparePrice);

    if (name.trim().length < 2) return setError("Escribe el nombre del producto.");
    if (!Number.isFinite(basePrice) || basePrice <= 0)
      return setError("Escribe un precio válido, mayor a 0.");
    if (compare !== null && (!Number.isFinite(compare) || compare <= basePrice))
      return setError("El precio anterior debe ser mayor al precio actual (o déjalo vacío).");

    setSaving(true);
    let finalImage = imageUrl;

    // 1) Si eligió una foto nueva, se sube primero
    if (file) {
      const up = await createProductImageUpload(file.name, file.type);
      if (!up.ok) {
        setError(up.error);
        setSaving(false);
        return;
      }
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .uploadToSignedUrl(up.path, up.token, file, { contentType: file.type });
      if (uploadError) {
        setError("No se pudo subir la foto. Intenta de nuevo.");
        setSaving(false);
        return;
      }
      finalImage = up.publicUrl;
    }

    // 2) Se guarda el producto
    const res = await saveProduct({
      id: product?.id,
      name,
      description,
      category,
      basePrice,
      compareAtPrice: compare,
      imageUrl: finalImage,
      isFeatured,
      isAvailable,
    });

    if (!res.ok) {
      setError(res.error);
      setSaving(false);
      return;
    }
    onSaved();
  };

  const shownImage = preview || imageUrl;
  const inputCls =
    "w-full rounded-xl border border-char/10 bg-bone/50 px-3.5 py-2.5 text-sm outline-none transition focus:border-brick focus:bg-white focus:ring-2 focus:ring-brick/15";
  const labelCls = "mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-char/50";

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-char/60 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <header className="flex items-center justify-between border-b border-char/[0.07] px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-char">
              {product ? "Editar producto" : "Nuevo producto"}
            </h2>
            <p className="text-xs text-char/50">
              {product ? "Cambia lo que necesites y guarda." : "Se publicará en tu carta al guardar."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-9 w-9 items-center justify-center rounded-full text-char/50 transition hover:bg-char/[0.06] hover:text-char"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* Foto */}
          <div>
            <span className={labelCls}>Foto del producto</span>
            {shownImage ? (
              <div className="relative flex h-52 items-center justify-center overflow-hidden rounded-2xl border border-char/10 bg-bone/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={shownImage} alt="Vista previa" className="h-full w-full object-contain p-3" />
                <div className="absolute right-3 top-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-char shadow hover:bg-white"
                  >
                    Cambiar
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-brick shadow hover:bg-white"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  pickFile(e.dataTransfer.files?.[0]);
                }}
                className="flex h-44 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-char/15 bg-bone/40 text-char/50 transition hover:border-brick hover:bg-brick/[0.03] hover:text-brick"
              >
                <UploadCloud className="h-8 w-8" />
                <span className="text-sm font-semibold">Haz clic o arrastra una foto aquí</span>
                <span className="text-xs">PNG, JPG o WEBP · máximo {MAX_IMAGE_MB} MB</span>
              </button>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
          </div>

          {/* Nombre y categoría */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="p-name">Nombre</label>
              <input
                id="p-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                placeholder="Ej. Burger Doble Cheddar"
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="p-desc">Descripción</label>
              <textarea
                id="p-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={300}
                placeholder="Ingredientes o detalles que verá el cliente"
                className={`${inputCls} resize-none`}
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="p-cat">Categoría</label>
              <select
                id="p-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputCls}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls} htmlFor="p-price">Precio (S/)</label>
                <input
                  id="p-price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  inputMode="decimal"
                  placeholder="0.00"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="p-compare">Antes (S/)</label>
                <input
                  id="p-compare"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(e.target.value)}
                  inputMode="decimal"
                  placeholder="Opcional"
                  className={inputCls}
                />
              </div>
            </div>
          </div>
          <p className="-mt-2 text-xs text-char/45">
            Si llenas &quot;Antes&quot;, la web mostrará el precio tachado y una etiqueta de descuento.
          </p>

          {/* Interruptores */}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-char/10 px-4 py-3">
              <span>
                <span className="block text-sm font-semibold text-char">Disponible</span>
                <span className="text-xs text-char/50">Visible en la carta</span>
              </span>
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="h-5 w-5 accent-[#8b2e1f]"
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-char/10 px-4 py-3">
              <span>
                <span className="block text-sm font-semibold text-char">Destacado</span>
                <span className="text-xs text-char/50">Sale en &quot;Nuestros favoritos&quot;</span>
              </span>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-5 w-5 accent-[#8b2e1f]"
              />
            </label>
          </div>

          {product && product.optionGroupsCount > 0 && (
            <p className="rounded-xl bg-mustard/15 px-4 py-3 text-xs text-char/70">
              Este producto tiene {product.optionGroupsCount} grupos de opciones (burgers, papas,
              bebidas…). Se conservan tal como están.
            </p>
          )}

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-char/[0.07] bg-char/[0.02] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-char/10 px-5 py-2.5 text-sm font-semibold text-char/70 transition hover:bg-white disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-brick to-brick-light px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-brick/25 transition hover:opacity-95 disabled:opacity-60"
          >
            {saving ? "Guardando…" : product ? "Guardar cambios" : "Crear producto"}
          </button>
        </footer>
      </form>
    </div>
  );
}

/* ───────────── Vista principal ───────────── */
export function ProductosView() {
  const [products, setProducts] = useState<AdminProduct[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const data = await listAdminProducts();
      if (!alive) return;
      setProducts(data);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [tick]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const reload = () => setTick((n) => n + 1);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: products?.length ?? 0 };
    for (const p of products ?? []) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [products]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (products ?? []).filter((p) => {
      if (filter !== "all" && p.category !== filter) return false;
      return !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    });
  }, [products, filter, query]);

  const toggleAvailable = async (p: AdminProduct) => {
    setBusyId(p.id);
    const res = await setProductFlag(p.id, "is_available", !p.isAvailable);
    if (res.ok) {
      setProducts((prev) =>
        prev?.map((x) => (x.id === p.id ? { ...x, isAvailable: !p.isAvailable } : x)) ?? prev
      );
    } else {
      showToast("No se pudo cambiar la disponibilidad.");
    }
    setBusyId(null);
  };

  const toggleFeatured = async (p: AdminProduct) => {
    setBusyId(p.id);
    const res = await setProductFlag(p.id, "is_featured", !p.isFeatured);
    if (res.ok) {
      setProducts((prev) =>
        prev?.map((x) => (x.id === p.id ? { ...x, isFeatured: !p.isFeatured } : x)) ?? prev
      );
    } else {
      showToast("No se pudo cambiar el destacado.");
    }
    setBusyId(null);
  };

  const handleDelete = async (p: AdminProduct) => {
    if (!window.confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return;
    setBusyId(p.id);
    const res = await deleteProduct(p.id);
    if (res.ok) {
      setProducts((prev) => prev?.filter((x) => x.id !== p.id) ?? prev);
      showToast("Producto eliminado.");
    } else {
      showToast(res.error);
    }
    setBusyId(null);
  };

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (p: AdminProduct) => {
    setEditing(p);
    setFormOpen(true);
  };

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-72 animate-pulse rounded-2xl bg-char/[0.06]" />
        ))}
      </div>
    );
  }

  if (products === null) {
    return (
      <div className="rounded-2xl border border-char/[0.07] bg-white py-16 text-center text-sm text-char/60">
        No se pudieron cargar los productos. Revisa tu sesión o la conexión con Supabase.
      </div>
    );
  }

  const tabs = [{ id: "all", label: "Todos" }, ...CATEGORIES];

  return (
    <div className="space-y-5">
      {/* Barra superior */}
      <div className="rounded-2xl border border-char/[0.07] bg-white p-4 shadow-[0_1px_2px_rgba(28,24,21,0.04)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-char/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar producto…"
              className="w-full rounded-xl border border-char/10 bg-bone/50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brick focus:bg-white focus:ring-2 focus:ring-brick/15"
            />
          </div>
          <button
            onClick={openNew}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brick to-brick-light px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brick/25 transition hover:opacity-95"
          >
            <Plus className="h-4 w-4" />
            Nuevo producto
          </button>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((t) => {
            const active = filter === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "bg-brick text-white shadow-md shadow-brick/25"
                    : "bg-char/[0.05] text-char/65 hover:bg-char/10"
                }`}
              >
                {t.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    active ? "bg-white/25" : "bg-white text-char/60"
                  }`}
                >
                  {counts[t.id] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tarjetas */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-char/15 bg-white py-16 text-center">
          <Package className="mb-2 h-8 w-8 text-char/30" />
          <p className="text-sm text-char/55">
            {products.length === 0
              ? "Aún no hay productos. ¿Ejecutaste el SQL de la Parte 3? Luego crea el primero."
              : "No hay productos con ese filtro."}
          </p>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visible.map((p) => {
            const discount = p.compareAtPrice
              ? Math.round(100 - (p.basePrice / p.compareAtPrice) * 100)
              : null;
            return (
              <li
                key={p.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-char/[0.07] bg-white shadow-[0_1px_2px_rgba(28,24,21,0.04),0_8px_24px_-12px_rgba(28,24,21,0.08)]"
              >
                <div className="relative flex h-44 items-center justify-center bg-bone/60">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className={`h-full w-full object-contain p-3 transition ${
                        p.isAvailable ? "" : "opacity-40 grayscale"
                      }`}
                    />
                  ) : (
                    <ImagePlus className="h-10 w-10 text-char/20" />
                  )}
                  {!p.isAvailable && (
                    <span className="absolute left-3 top-3 rounded-full bg-char px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-bone">
                      Oculto
                    </span>
                  )}
                  {discount !== null && discount > 0 && p.isAvailable && (
                    <span className="absolute left-3 top-3 rounded bg-amber-light px-2 py-0.5 text-[11px] font-bold text-char">
                      -{discount}%
                    </span>
                  )}
                  <button
                    onClick={() => toggleFeatured(p)}
                    disabled={busyId === p.id}
                    title={p.isFeatured ? "Quitar de destacados" : "Marcar como destacado"}
                    className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full shadow transition ${
                      p.isFeatured
                        ? "bg-mustard text-char"
                        : "bg-white/90 text-char/35 hover:text-amber"
                    }`}
                  >
                    <Star className="h-4 w-4" fill={p.isFeatured ? "currentColor" : "none"} />
                  </button>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold leading-snug text-char">{p.name}</h3>
                    <span className="shrink-0 rounded-full bg-brick/10 px-2.5 py-0.5 text-[10px] font-bold text-brick">
                      {categoryLabel(p.category)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 min-h-[2rem] text-xs text-char/50">
                    {p.description || "Sin descripción"}
                  </p>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-display text-2xl leading-none tracking-wide text-brick">
                      {money(p.basePrice)}
                    </span>
                    {p.compareAtPrice && (
                      <span className="text-xs text-char/40 line-through">
                        {money(p.compareAtPrice)}
                      </span>
                    )}
                  </div>
                  {p.optionGroupsCount > 0 && (
                    <p className="mt-1 text-[11px] text-char/45">
                      {p.optionGroupsCount} grupos de opciones
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => toggleAvailable(p)}
                      disabled={busyId === p.id}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition disabled:opacity-50 ${
                        p.isAvailable
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-char/[0.06] text-char/55 hover:bg-char/10"
                      }`}
                    >
                      {p.isAvailable ? (
                        <Eye className="h-3.5 w-3.5" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" />
                      )}
                      {p.isAvailable ? "Disponible" : "Oculto"}
                    </button>
                    <button
                      onClick={() => openEdit(p)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      disabled={busyId === p.id}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="pb-2 text-center text-[11px] text-char/35">
        {products.length} productos en total · los cambios se ven en la web al instante
      </p>

      {formOpen && (
        <ProductForm
          key={editing?.id ?? "new"}
          product={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            reload();
            showToast(editing ? "Producto actualizado." : "Producto creado.");
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-xl bg-char px-5 py-3 text-sm font-medium text-bone shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}