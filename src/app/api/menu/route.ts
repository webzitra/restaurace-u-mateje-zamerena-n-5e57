import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const PROJECT_ID = "5e57ae04-3c95-4658-bcd1-f32f71e5063e";

/**
 * GET /api/menu
 * Vrátí všechny aktivní kategorie a jejich položky.
 * Query params:
 *   - category_id (UUID) — volitelný, filtruje položky
 *   - admin (true) — vrátí i neaktivní
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("category_id");
  const isAdmin = searchParams.get("admin") === "true";

  try {
    // Načtení kategorií
    let catQuery = supabase
      .from("menu_categories")
      .select("*")
      .eq("project_id", PROJECT_ID)
      .order("sort_order", { ascending: true });

    if (!isAdmin) {
      catQuery = catQuery.eq("active", true);
    }

    const { data: categories, error: catError } = await catQuery;
    if (catError) throw catError;

    // Načtení položek
    let itemQuery = supabase
      .from("menu_items")
      .select("*")
      .eq("project_id", PROJECT_ID)
      .order("sort_order", { ascending: true });

    if (!isAdmin) {
      itemQuery = itemQuery.eq("available", true);
    }

    if (categoryId) {
      itemQuery = itemQuery.eq("category_id", categoryId);
    }

    const { data: items, error: itemError } = await itemQuery;
    if (itemError) throw itemError;

    return NextResponse.json({ categories: categories || [], items: items || [] });
  } catch (err) {
    console.error("Chyba při načítání menu:", err);
    return NextResponse.json(
      { error: "Nepodařilo se načíst jídelní lístek." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/menu
 * Vytvoří novou položku menu.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category_id, name, description, price, image_url, allergens } = body;

    if (!name || price == null) {
      return NextResponse.json(
        { error: "Název a cena jsou povinné." },
        { status: 400 }
      );
    }

    const { data: item, error } = await supabase
      .from("menu_items")
      .insert({
        project_id: PROJECT_ID,
        category_id: category_id || null,
        name,
        description: description || null,
        price: Math.round(Number(price)),
        image_url: image_url || null,
        allergens: allergens || [],
        available: true,
        sort_order: 0,
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      itemId: item.id,
      message: "Položka byla přidána do jídelního lístku.",
    });
  } catch (err) {
    console.error("Chyba při přidávání položky:", err);
    return NextResponse.json(
      { error: "Nepodařilo se přidat položku." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/menu — aktualizace položky
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Chybí ID položky." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("menu_items")
      .update(updates)
      .eq("id", id)
      .eq("project_id", PROJECT_ID);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Chyba při aktualizaci položky:", err);
    return NextResponse.json(
      { error: "Nepodařilo se aktualizovat položku." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/menu — smazání položky
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Chybí ID položky." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id)
      .eq("project_id", PROJECT_ID);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Chyba při mazání položky:", err);
    return NextResponse.json(
      { error: "Nepodařilo se smazat položku." },
      { status: 500 }
    );
  }
}
