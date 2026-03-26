"use client";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  allergens: string[];
  available: boolean;
}

interface MenuSectionProps {
  title: string;
  description?: string | null;
  items: MenuItem[];
  primaryColor: string;
}

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

function formatPrice(price: number): string {
  return new Intl.NumberFormat("cs-CZ").format(price) + " Kč";
}

export default function MenuSection({ title, description, items, primaryColor }: MenuSectionProps) {
  if (items.length === 0) return null;

  return (
    <section style={{ marginBottom: "48px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 600,
            color: "#f1f5f9",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          {title}
        </h2>
        {description && (
          <p
            style={{
              fontSize: "14px",
              color: "#94a3b8",
              marginTop: "6px",
              lineHeight: 1.6,
            }}
          >
            {description}
          </p>
        )}
        <div
          style={{
            width: "48px",
            height: "3px",
            backgroundColor: primaryColor,
            borderRadius: "2px",
            marginTop: "12px",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "16px",
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "20px",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = primaryColor + "60";
              el.style.transform = "translateY(-2px)";
              el.style.boxShadow = `0 8px 32px -8px ${primaryColor}30`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = "rgba(255, 255, 255, 0.08)";
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "none";
            }}
          >
            {/* Hlavička: název + cena */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "16px",
                marginBottom: "8px",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#f1f5f9",
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {item.name}
              </h3>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: primaryColor,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {formatPrice(item.price)}
              </span>
            </div>

            {/* Popis */}
            {item.description && (
              <p
                style={{
                  fontSize: "14px",
                  color: "#94a3b8",
                  margin: "0 0 12px 0",
                  lineHeight: 1.5,
                }}
              >
                {item.description}
              </p>
            )}

            {/* Obrázek */}
            {item.image_url && (
              <div
                style={{
                  width: "100%",
                  height: "160px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  marginBottom: "12px",
                }}
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            {/* Alergeny */}
            {item.allergens && item.allergens.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  marginTop: "auto",
                }}
              >
                {item.allergens.map((a) => (
                  <span
                    key={a}
                    title={ALLERGEN_LABELS[a] || `Alergen ${a}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "26px",
                      height: "26px",
                      padding: "0 8px",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                      borderRadius: "13px",
                      backgroundColor: "rgba(251, 191, 36, 0.12)",
                      color: "#fbbf24",
                      border: "1px solid rgba(251, 191, 36, 0.2)",
                    }}
                  >
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
