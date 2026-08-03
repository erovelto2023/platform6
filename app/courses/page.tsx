import { redirect } from "next/navigation";

export default async function LegacyCoursesListPage() {
    return redirect("/catalog");
}
