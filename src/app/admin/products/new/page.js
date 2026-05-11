"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductForm from "@/features/admin/components/ProductForm";
import { useToastStore } from "@/features/toast";

export default function NewProductPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToastStore((s) => s.toast);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Error al obtener las categorías");
        const data = await res.json();
        setCategories(data);
      } catch {
        toast("Error al cargar categorías", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, [toast]);

  function handleSuccess() {
    router.push("/admin/products");
  }

  if (loading) {
    return <div className="loading-spinner" />;
  }

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <Link href="/admin/products" className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} />
          Volver a productos
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Crear nuevo producto</h3>
        </div>

        <ProductForm
          mode="create"
          categories={categories}
          onSuccess={handleSuccess}
          onCancel={handleSuccess}
        />
      </div>
    </div>
  );
}
