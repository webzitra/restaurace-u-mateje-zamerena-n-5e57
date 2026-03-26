"use client";

import { useState, useEffect } from "react";
import MenuSection from "@/components/MenuSection";

interface Category {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  active: boolean;
}

interface MenuItem {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  allergens: string[];
  available: boolean;
  sort_order: number;
}

const PRIMARY = "#1f2937";
const BUSINESS = "Restaurace u Matěje, zaměřená na luxusní jídla";

const ALLERGEN_LABELS: Record<string, string> = {
  "1": "Lepek",
  "2": "Korýši",
  "3": "Vejce",
  "4": "Ryby",
  "5": "Arašídy",
  "6": "Sója",
  "7": "Mléko",
  "8": "Skořápkové plody",
  "9": "Celer",
  "10": "Hořčice",
  "11": "Sezam",
  "12": "Oxid siřičitý",
  "13": "Vlčí bob",
  "14": "Měkkýši",
};

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    async function loadMenu() {
      try {
        const res = await fetch("/api/menu");
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Nepodařilo se načíst menu.");
          return;
        }

        setCategories(data.categories || []);
        setItems(data.items || []);
      } catch {
        setError("Nepodařilo se načíst jídelní lístek.");
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, []);

  // Filtrované položky pro aktivní kategorii (null = všechny)
  const filteredItems = activeCategory
    ? items.filter((item) => item.category_id === activeCategory)
    : items;

  // Položky seskupené podle kategorie
  const itemsByCategory = categories.map((cat) => ({
    category: cat,
    items: filteredItems.filter((item) => item.category_id === cat.id),
  }));

  // Položky bez kategorie
  const uncategorized = filteredItems.filter((item) => !item.category_id);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0f" }}>
      {/* Hlavička */}
      <header
        style={{
          padding: "64px 24px 48px",
          textAlign: "center",
          background: `linear-gradient(180deg, ${PRIMARY}15 0%, transparent 100%)`,
        }}
      >
        <p
          style={{
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: PRIMARY,
            marginBottom: "12px",
          }}
        >
          {BUSINESS}
        </p>
        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 500,
            color: "#f1f5f9",
            letterSpacing: "-0.02em",
            margin: 0,
            textWrap: "balance",
          }}
        >
          Jídelní lístek
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#94a3b8",
            marginTop: "12px",
            lineHeight: 1.6,
            maxWidth: "480px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Vyberte si z naší nabídky. Ceny jsou uvedeny v Kč.
        </p>
      </header>

      {/* Navigace kategorií */}
      {categories.length > 1 && (
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "rgba(10, 10, 15, 0.85)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            padding: "0 24px",
          }}
        >
          <div
            style={{
              maxWidth: "960px",
              margin: "0 auto",
              display: "flex",
              gap: "4px",
              overflowX: "auto",
              padding: "12px 0",
            }}
          >
            <button
              onClick={() => setActiveCategory(null)}
              style={{
                padding: "8px 18px",
                borderRadius: "20px",
                border: "none",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                backgroundColor: !activeCategory
                  ? PRIMARY
                  : "rgba(255, 255, 255, 0.06)",
                color: !activeCategory ? "#fff" : "#94a3b8",
              }}
            >
              Vše
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "20px",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  backgroundColor:
                    activeCategory === cat.id
                      ? PRIMARY
                      : "rgba(255, 255, 255, 0.06)",
                  color:
                    activeCategory === cat.id ? "#fff" : "#94a3b8",
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Obsah */}
      <main
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        {loading && (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                border: `3px solid ${PRIMARY}30`,
                borderTopColor: PRIMARY,
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>
              Načítání jídelního lístku...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {error && (
          <div
            style={{
              textAlign: "center",
              padding: "64px 0",
              color: "#f87171",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <p style={{ color: "#94a3b8", fontSize: "16px" }}>
              Jídelní lístek se připravuje.
            </p>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <>
            {/* Kategorizované položky */}
            {itemsByCategory.map(({ category, items: catItems }) => (
              <MenuSection
                key={category.id}
                title={category.name}
                description={category.description}
                items={catItems}
                primaryColor={PRIMARY}
              />
            ))}

            {/* Položky bez kategorie */}
            {uncategorized.length > 0 && (
              <MenuSection
                title="Ostatní"
                items={uncategorized}
                primaryColor={PRIMARY}
              />
            )}

            {/* Legenda alergenů */}
            <div
              style={{
                marginTop: "64px",
                padding: "24px",
                backgroundColor: "rgba(15, 23, 42, 0.4)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#94a3b8",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                  margin: "0 0 16px 0",
                }}
              >
                Alergeny
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "8px",
                }}
              >
                {Object.entries(ALLERGEN_LABELS).map(([num, label]) => (
                  <div
                    key={num}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "13px",
                      color: "#64748b",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "24px",
                        height: "24px",
                        padding: "0 6px",
                        fontSize: "11px",
                        fontWeight: 600,
                        borderRadius: "12px",
                        backgroundColor: "rgba(251, 191, 36, 0.1)",
                        color: "#fbbf24",
                      }}
                    >
                      {num}
                    </span>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Patička */}
      <footer
        style={{
          textAlign: "center",
          padding: "24px",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          color: "#475569",
          fontSize: "13px",
        }}
      >
        {BUSINESS} &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
