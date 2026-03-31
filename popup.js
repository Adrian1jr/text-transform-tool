// Elementos del DOM
const toggleBtn = document.getElementById("toggleBtn");
const statusIndicator = document.getElementById("statusIndicator");
const statusText = document.getElementById("statusText");
const uppercaseCheck = document.getElementById("uppercase");
const lowercaseCheck = document.getElementById("lowercase");
const addSpacesCheck = document.getElementById("addSpaces");
const spacingAmount = document.getElementById("spacingAmount");
const spacingValue = document.getElementById("spacingValue");
const testInput = document.getElementById("testInput");

// Estado por defecto
let settings = {
  enabled: false,
  uppercase: true,
  lowercase: false,
  addSpaces: true,
  spacingAmount: 1,
};

// Cargar configuración guardada
chrome.storage.sync.get(settings, (data) => {
  settings = data;
  updateUI();
});

// Actualizar UI según el estado
function updateUI() {
  if (settings.enabled) {
    statusIndicator.classList.add("active");
    statusText.textContent = "Activado";
    toggleBtn.textContent = "Desactivar Extensión";
    toggleBtn.classList.add("active");
  } else {
    statusIndicator.classList.remove("active");
    statusText.textContent = "Desactivado";
    toggleBtn.textContent = "Activar Extensión";
    toggleBtn.classList.remove("active");
  }

  uppercaseCheck.checked = settings.uppercase;
  lowercaseCheck.checked = settings.lowercase;
  addSpacesCheck.checked = settings.addSpaces;
  spacingAmount.value = settings.spacingAmount;
  spacingValue.textContent = settings.spacingAmount;
}

// Guardar configuración
function saveSettings() {
  chrome.storage.sync.set(settings, () => {
    // Notificar a los content scripts sobre el cambio
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs
          .sendMessage(tab.id, {
            action: "updateSettings",
            settings: settings,
          })
          .catch(() => {
            // Ignorar errores si el content script no está listo
          });
      });
    });
  });
}

// Toggle on/off
toggleBtn.addEventListener("click", () => {
  settings.enabled = !settings.enabled;
  updateUI();
  saveSettings();
});

// Opciones de mayúsculas/minúsculas
uppercaseCheck.addEventListener("change", () => {
  settings.uppercase = uppercaseCheck.checked;
  if (settings.uppercase) {
    settings.lowercase = false;
    lowercaseCheck.checked = false;
  }
  saveSettings();
});

lowercaseCheck.addEventListener("change", () => {
  settings.lowercase = lowercaseCheck.checked;
  if (settings.lowercase) {
    settings.uppercase = false;
    uppercaseCheck.checked = false;
  }
  saveSettings();
});

addSpacesCheck.addEventListener("change", () => {
  settings.addSpaces = addSpacesCheck.checked;
  saveSettings();
});

spacingAmount.addEventListener("input", () => {
  settings.spacingAmount = parseInt(spacingAmount.value);
  spacingValue.textContent = settings.spacingAmount;
  saveSettings();
});

// Área de prueba con transformación en tiempo real
testInput.addEventListener("input", (e) => {
  if (!settings.enabled) return;

  const cursorPos = e.target.selectionStart;
  const originalText = e.target.value;
  const transformedText = transformText(originalText, settings);

  e.target.value = transformedText;

  // Intentar mantener el cursor en una posición razonable
  e.target.setSelectionRange(transformedText.length, transformedText.length);
});

// Función de transformación (la misma lógica que en el content script)
function transformText(text, settings) {
  if (!text) return text;

  // Aplicar mayúsculas o minúsculas
  if (settings.uppercase) {
    text = text.toUpperCase();
  } else if (settings.lowercase) {
    text = text.toLowerCase();
  }

  // Agregar espacios entre letras
  if (settings.addSpaces) {
    const spaces = " ".repeat(settings.spacingAmount);
    const wordSeparator = " ".repeat(settings.spacingAmount * 3);

    text = text
      .split("")
      .map((char, index, array) => {
        if (index === array.length - 1) return char;
        if (char === " ") return wordSeparator;
        if (array[index + 1] === " ") return char;
        return char + spaces;
      })
      .join("");
  }

  return text;
}
