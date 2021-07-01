/**
 * Prototyp zewnętrznej aplikacji do obejrzenia wydarzeń FAME MMA
 */

// System wielokrotnych okienek
const {BrowserWindow} = require("electron");

class WindowsManager {
	constructor() {
		this.windowsDefaultSettings = { // Domyślne ustawienia dla okienek
			width: 1280, // Szerokość ekranu
			height: 720, // Wysokość ekranu
			webPreferences: { // Preferencje przeglądarki dla okienka
				nodeIntegration: true // Integracja Node.js do okienka
			}
		};

		this.windows = []; // Pamięć okienek
	}

	_getWindowBrowserById(windowId) {
		return this.windows[windowId] ? this.windows[windowId].browser : undefined;
	}

	createWindow(windowId) { // Tworzenie nowego okienka
		if (!windowId || typeof windowId !== "string") // Brak identyfikatora okienka
			throw new Error("Nie można stworzyć okienka: " + typeof windowId !== "string" ? "Typ identyfikatora okienka nie jest prawidłowy!" : "Wymagany jest identyfikator okienka!");

		// Sprawdzanie czy nie ma okienka o takim samym identyfikatorze
		const window = this._getWindowBrowserById(windowId);

		if (window instanceof BrowserWindow)
			throw new Error("Ten identyfikator okienka jest już zajęty!");

		// Tworzenie nowego okienka
		const browser = new BrowserWindow(this.windowsDefaultSettings);

		// Tworzenie w pamięci nową instancję okienka
		this.windows[windowId] = {
			id: windowId,
			browser
		};

		// Jeżeli okienko zostanie zamknięte, w pamięci zostaje on również usunięty z automatu
		browser.on("closed", () => delete this.windows[windowId]);

		// Zwracanie danych stworzonego okienka
		return this.windows[windowId];
	}

	destroyWindow(windowId) { // Niszczenie danego okienka po jego identyfikatorze
		if (!windowId || typeof windowId !== "string") // Brak identyfikatora okienka
			throw new Error("Nie można uzyskać okienka: " + typeof windowId !== "string" ? "Typ identyfikatora okienka nie jest prawidłowy!" : "Wymagany jest identyfikator okienka!");

		// Sprawdzanie czy jest okienko o takim identyfikatorze
		const window = this._getWindowBrowserById(windowId);

		if (!window)
			throw new Error("Nie znaleziono okienka o podanym identyfikatorze!");

		if (window instanceof BrowserWindow)
			window.destroy();
	}

	setWindowURL(windowId, url) { // Ustawianie adresu URL (strony) dla danego okienka
		if (!windowId || typeof windowId !== "string") // Brak identyfikatora okienka
			throw new Error("Nie można uzyskać okienka: " + typeof windowId !== "string" ? "Typ identyfikatora okienka nie jest prawidłowy!" : "Wymagany jest identyfikator okienka!");

		// Sprawdzanie czy jest okienko o takim identyfikatorze
		const window = this._getWindowBrowserById(windowId);

		if (!window)
			throw new Error("Nie znaleziono okienka o podanym identyfikatorze!");

		if (window instanceof BrowserWindow) {
			// Sprawdzanie podanego adresu URL
			if (!url)
				throw new Error(typeof url !== "string" ? "To nie jest adres URL!" : "Nie podano adresu URL!");

			// Sprawdzanie protokołu podanego adresu URL
			const urlProtocolTest = url.includes("https") || url.includes("http");

			if (!urlProtocolTest)
				throw new Error("Nieprawidłowy protokół adresu URL!");

			window.loadURL(url);
		}
	}
}

module.exports = WindowsManager;