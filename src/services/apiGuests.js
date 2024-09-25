import supabase from "./supabase";

import { PAGE_SIZE } from "../utils/constants";

export async function getGuests({ page }) {
  let query = supabase.from("guests").select("*", { count: "exact" });

  // PAGINATION
  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    query = query.range(from, to);
  }

  const { data, error, count } = await query; /* supabase
    .from("guests")
    .select("*", { count: "exact" }); */

  if (error) {
    console.error(error);
    throw new Error("Guests could not be loaded");
  }

  return { data, count };
}

export async function getGuestByNationalId(nationalID) {
  const { data: guest, error } = await supabase
    .from("guests")
    .select("*")
    .eq("nationalID", nationalID)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be found");
  }

  return guest;
}

export async function createGuest(guest) {
  const { data, error } = await supabase
    .from("guests")
    .insert([guest])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
}

export async function editGuest(newGuest, id) {
  const { data, error } = await supabase
    .from("guests")
    .update(newGuest)
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be edited");
  }

  return data;
}

export async function deleteGuest(id) {
  const { data, error } = await supabase.from("guests").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be deleted");
  }

  return data;
}
