// Background script para mantener el estado de la extensión

// Configuración por defecto
const defaultSettings = {
  enabled: false,
  uppercase: true,
  lowercase: false,
  addSpaces: true,
  spacingAmount: 1,
};

// Inicializar configuración al instalar
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(defaultSettings, (data) => {
    // Si no hay configuración guardada, usar la por defecto
    if (Object.keys(data).length === 0) {
      chrome.storage.sync.set(defaultSettings);
    }
  });
});

// Escuchar mensajes de otros scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSettings") {
    chrome.storage.sync.get(defaultSettings, (settings) => {
      sendResponse(settings);
    });
    return true; // Mantener el canal abierto para respuesta asíncrona
  }
});

// Actualizar badge del icono según el estado
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    const isEnabled = changes.enabled.newValue;

    if (isEnabled) {
      chrome.action.setBadgeText({ text: "ON" });
      chrome.action.setBadgeBackgroundColor({ color: "#48bb78" });
    } else {
      chrome.action.setBadgeText({ text: "" });
    }
  }
});

// Configurar badge inicial
chrome.storage.sync.get("enabled", (data) => {
  if (data.enabled) {
    chrome.action.setBadgeText({ text: "ON" });
    chrome.action.setBadgeBackgroundColor({ color: "#48bb78" });
  }
});
