// SPDX-License-Identifier: Apache-2.0

import { redirect } from "next/navigation";

export default function PlanetesPage() {
	redirect("/wiki/personnages?tab=planetes");
}
