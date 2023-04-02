import { ToramObject } from "../../../../modules/_types/toram.js";
import { ToramMap } from "../../../../modules/_types/map.js";
import { ToramMonster } from "../../../../modules/_types/monster.js";

document.addEventListener("DOMContentLoaded", () => {
	const btnSubmit = document.getElementById("edit_submit_update");
	btnSubmit?.addEventListener("click", () => {
		const elements = {
			id: document.getElementById("edit_id") as HTMLSpanElement,
			name: document.getElementById("edit_name") as HTMLInputElement,
			type: document.getElementById("edit_type") as HTMLSelectElement,
			_map: {
				monsters: document.getElementById("edit_map_monster_list") as HTMLTextAreaElement,
			},
			_monster: {
				level: document.getElementById("edit_monster_level") as HTMLInputElement,
				hp: document.getElementById("edit_monster_hp") as HTMLInputElement,
				element: document.getElementById("edit_monster_element") as HTMLSelectElement,
				exp: document.getElementById("edit_monster_exp") as HTMLInputElement,
				tamable: document.getElementById("edit_monster_tamable") as HTMLSelectElement,
				map: document.getElementById("edit_monster_map") as HTMLInputElement,
				drops: document.getElementById("edit_monster_drops") as HTMLTextAreaElement,
			},
			_item: {
				sell: document.getElementById("edit_item_sell") as HTMLInputElement,
				proc: document.getElementById("edit_item_proc") as HTMLInputElement,
				thumb: document.getElementById("edit_item_thumb") as HTMLInputElement,
				stats: document.getElementById("edit_item_stats") as HTMLTextAreaElement,
				drops: document.getElementById("edit_item_drop_from") as HTMLTextAreaElement,
				uses: document.getElementById("edit_item_usages") as HTMLTextAreaElement,
				recipe: {
					fee: document.getElementById("edit_item_recipe_fee") as HTMLInputElement,
					set: document.getElementById("edit_item_recipe_set") as HTMLInputElement,
					level: document.getElementById("edit_item_recipe_level") as HTMLInputElement,
					difficulty: document.getElementById("edit_item_recipe_difficulty") as HTMLInputElement,
					materials: document.getElementById("edit_item_recipe_materials") as HTMLTextAreaElement,
				},
			},
		};

		// @ts-ignore
		const model: ToramObject =
			elements.type.value === "Map"
				? {
						id: elements.id.innerText || "",
						name: elements.name.value,
						type: elements.type.value,
						monsters: elements._map.monsters.value.split("\n").filter((entry) => entry.length !== 0),
				  }
				: new RegExp(/(boss)|(monster)/gi).test(elements.type.value)
				? {
						id: elements.id.innerText || "",
						name: elements.name.value,
						type: elements.type.value,
						level: Number(elements._monster.level.value),
						hp: Number(elements._monster.hp.value) || 0,
						ele: elements._monster.element.value,
						exp: Number(elements._monster.exp.value) || 0,
						tamable: elements._monster.tamable.value,
						map: elements._monster.map.value || "Event",
						drops: elements._monster.drops.value
							.split("\n")
							.map((line) => ({
								id: line.split("_").at(0) as string,
								dyes: line
									.split("_")
									.slice(1)
									.filter((dye) => dye !== ""),
							}))
							.filter((entry) => entry.id.length !== 0),
				  }
				: {
						id: elements.id.innerText || "",
						name: elements.name.value,
						type: elements.type.value,
						sell: elements._item.sell.value,
						proc: elements._item.proc.value,
						thumb: elements._item.thumb.value,
						stats: elements._item.stats.value.split("\n").filter((e) => e.length !== 0),
						drops: elements._item.drops.value
							.split("\n")
							.map((line) => ({
								from: line.split("_").at(0) as string,
								dyes: line
									.split("_")
									.slice(1)
									.filter((dye) => dye !== ""),
							}))
							.filter((entry) => entry.from.length !== 0),
						uses: elements._item.uses.value
							.split("\n")
							.map((line) => ({
								for: line.split("_").at(0),
								amount: line.split("_").at(1),
							}))
							.filter((entry) => entry.for?.length !== 0),
						recipe: {
							fee: elements._item.recipe.fee.value,
							set: elements._item.recipe.set.value,
							level: elements._item.recipe.level.value,
							difficulty: elements._item.recipe.difficulty.value,
							materials: elements._item.recipe.materials.value
								.split("\n")
								.map((line) => ({
									item: line.split("_").at(0),
									amount: line.split("_").at(1),
								}))
								.filter((entry) => entry.item?.length !== 0),
						},
				  };

		if (confirm("Confirm update entry?")) {
			fetch("/api/manage/update", {
				method: "POST",
				body: JSON.stringify(model),
			})
				.then((res) => res.json())
				.then((res) => {
					alert(res.message);
					if (res.error) console.error(res.error);
				});
		}
	});
});
