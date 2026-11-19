import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import { Modal } from "bootstrap";
import type { Game } from "./bindings/Game";

const grid = document.getElementById("results")!;
const form = document.querySelector<HTMLFormElement>("#addGameForm")!;
const modalEl = document.querySelector<HTMLElement>("#addGameModal")!;
const resultsEl = document.querySelector<HTMLElement>("#results")!;
const deleteModalEl = document.querySelector<HTMLElement>("#deleteModal")!;
const deleteNameEl = document.querySelector<HTMLElement>("#deleteName")!;
const confirmBtn = document.querySelector<HTMLButtonElement>("#confirmDelete")!;
const searchEl = document.querySelector<HTMLInputElement>("#search")!;
const genreEl = document.querySelector<HTMLSelectElement>("#genre")!;
const platformEl = document.querySelector<HTMLSelectElement>("#platform")!;

let games: Game[] = [];
let pendingDeleteId: number | null = null;

function newCard(game: Game): HTMLElement {
    const card = document.createElement("div");
    card.className = "col";

    card.innerHTML = `
    <article class="card h-100">
        <button type="button"
            class="btn btn-danger btn-sm delete-btn position-absolute top-0 end-0 m-2"
            data-id="${game.id}"
            aria-label="Delete ${game.title}">
            🗑
        </button>
        <div class="card-body">
            <h2 class="card-title h5">${game.title}</h2>
            <span class="badge text-bg-primary">${game.genre}</span>
        </div>
        <div class="card-footer text-secondary d-flex justify-content-between">
            <span>${game.platforms}</span>
            <span>${game.year}</span>
        </div>
    </article>
    `;

    return card;
}

function fillSelect(select: HTMLSelectElement, values: string[]) {
    const current = select.value;
    const unique = [...new Set(values)].sort();
    select.replaceChildren(
        new Option(select.options[0].text, ""),
        ...unique.map((v) => new Option(v, v)),
    );
    select.value = current;
}

function applyFilters(): Game[] {
    const text = searchEl.value.trim().toLowerCase();
    const genre = genreEl.value;
    const platform = platformEl.value;

    return games.filter(
        (g) =>
            g.title.toLowerCase().includes(text) &&
            (genre === "" || g.genre === genre) &&
            (platform === "" || g.platforms.includes(platform)),
    );
}

async function reload() {
    games = [];
    games = await (await fetch("/api/games")).json();
    fillSelect(genreEl, games.map((g) => g.genre));
    fillSelect(platformEl, games.flatMap((g) => g.platforms.split(";")));
    const filtered = applyFilters();
    render(filtered);
}

async function render(games: Game[]) {
    grid.replaceChildren(
        ...games.map(game => newCard(game))
    );
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const platforms = data.getAll("platform").join(";");
    const yearRaw = String(data.get("year") ?? "");

    if (!platforms) {
        alert("Pick at least one platform");
        return;
    }

    const body = {
        title: String(data.get("title")).trim(),
        genre: String(data.get("genre")).trim(),
        platforms,
        year: yearRaw ? Number(yearRaw) : null,
    }

    const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        alert(`Could not save the game (${res.status})`);
        return;
    }

    form.reset();
    Modal.getInstance(modalEl)?.hide();

    await reload();
});

resultsEl.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(".delete-btn");
    if (!btn) return;

    const id = Number(btn.dataset.id);
    const game = games.find((g) => g.id === id);
    if (!game) return;

    pendingDeleteId = id;
    deleteNameEl.textContent = game.title;
    Modal.getOrCreateInstance(deleteModalEl).show();
});

confirmBtn.addEventListener("click", async () => {
    if (pendingDeleteId === null) return;

    const res = await fetch(`/api/games/${pendingDeleteId}`, { method: "DELETE" });
    if (!res.ok) {
        alert(`Could not delete the game (${res.status})`);
        return;
    }

    pendingDeleteId = null;
    Modal.getInstance(deleteModalEl)?.hide();
    await reload();
});

searchEl.addEventListener("input", () => render(applyFilters()));
genreEl.addEventListener("change", () => render(applyFilters()));
platformEl.addEventListener("change", () => render(applyFilters()));


await reload();