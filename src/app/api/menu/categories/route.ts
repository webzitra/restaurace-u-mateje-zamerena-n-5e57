import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const PROJECT_ID = "5e57ae04-3c95-4658-bcd1-f32f71e5063e";

/**
 * GET /api/menu/categories
 * Vrátí seznam kategorií.
 */
export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from("menu_categories")
      .select("*")
      .eq("project_id", PROJECT_ID)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ categories: categories || [] });
  } catch (err) {
    console.error("Chyba při načítání kategorií:", err);
    return NextResponse.json(
      { error: "Nepodařilo se načíst kategorie." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/menu/categories
 * Vytvoří novou kategorii.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Název kategorie je povinný." },
        { status: 400 }
      );
    }

    // Zjistit max sort_order
    const { data: existing } = await supabase
      .from("menu_categories")
      .select("sort_order")
      .eq("project_id", PROJECT_ID)
      .order("sort_order", { ascending: false })
      .limit(1);

    const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

    const { data: category, error } = await supabase
      .from("menu_categories")
      .insert({
        project_id: PROJECT_ID,
        name,
        description: description || null,
        sort_order: nextOrder,
        active: true,
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      categoryId: category.id,
      message: `Kategorie "${name}" byla vytvořena.`,
    });
  } catch (err) {
    console.error("Chyba při vytváření kategorie:", err);
    return NextResponse.json(
      { error: "Nepodařilo se vytvořit kategorii." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/menu/categories — aktualizace kategorie
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Chybí ID kategorie." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("menu_categories")
      .update(updates)
      .eq("id", id)
      .eq("project_id", PROJECT_ID);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Chyba při aktualizaci kategorie:", err);
    return NextResponse.json(
      { error: "Nepodařilo se aktualizovat kategorii." },
      { status: 500 }
    );
  }
}
