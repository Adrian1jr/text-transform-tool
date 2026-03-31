// ===== CONFIGURACIÓN =====
let settings = {
  enabled: false,
  uppercase: true,
  lowercase: false,
  addSpaces: true,
  spacingAmount: 1,
};

// Cargar configuración al iniciar
chrome.storage.sync.get(settings, (data) => {
  settings = data;
  console.log("🔧 Transformador - Configuración cargada:", settings);
  if (settings.enabled) {
    showIndicator();
  }
});

// Escuchar cambios en la configuración
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateSettings") {
    settings = request.settings;
    console.log("🔄 Configuración actualizada:", settings);
  }
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    settings.enabled = changes.enabled.newValue;
    console.log("🔄 Estado:", settings.enabled ? "ACTIVADO ✅" : "DESACTIVADO ⏸️");
    if (settings.enabled) showIndicator();
  }
  if (changes.uppercase) settings.uppercase = changes.uppercase.newValue;
  if (changes.lowercase) settings.lowercase = changes.lowercase.newValue;
  if (changes.addSpaces) settings.addSpaces = changes.addSpaces.newValue;
  if (changes.spacingAmount) settings.spacingAmount = changes.spacingAmount.newValue;
});

// ===== INTERCEPTAR TECLAS (ANTES de que se escriban) =====
function handleKeyPress(event) {
  if (!settings.enabled) return;

  const element = event.target;

  // Verificar si es un campo editable
  const isEditable =
    element.tagName === "INPUT" ||
    element.tagName === "TEXTAREA" ||
    element.contentEditable === "true" ||
    element.isContentEditable;

  if (!isEditable) return;

  // No aplicar en campos especiales
  if (
    element.type === "password" ||
    element.type === "email" ||
    element.type === "number"
  )
    return;

  // Solo procesar caracteres imprimibles (no teclas especiales como Backspace, Enter, etc.)
  if (event.key.length !== 1) return;

  console.log("⌨️ Interceptando:", event.key);

  // PREVENIR que se escriba el carácter original
  event.preventDefault();
  event.stopPropagation();

  // Transformar el carácter
  let charToInsert = event.key;

  // Aplicar mayúsculas/minúsculas
  if (settings.uppercase) {
    charToInsert = charToInsert.toUpperCase();
  } else if (settings.lowercase) {
    charToInsert = charToInsert.toLowerCase();
  }

  // Agregar espacios
  if (settings.addSpaces) {
    const spaces = " ".repeat(settings.spacingAmount);

    if (charToInsert === " ") {
      // Espacio más grande entre palabras
      charToInsert = " ".repeat(settings.spacingAmount * 3);
    } else {
      // Agregar espacios después del carácter
      charToInsert = charToInsert + spaces;
    }
  }

  console.log("✨ Transformado a:", charToInsert);

  // Insertar el texto transformado
  if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
    insertIntoInput(element, charToInsert);
  } else if (element.contentEditable === "true" || element.isContentEditable) {
    insertIntoContentEditable(element, charToInsert);
  }
}

// ===== INSERTAR EN INPUT/TEXTAREA =====
function insertIntoInput(element, text) {
  const start = element.selectionStart || 0;
  const end = element.selectionEnd || 0;
  const currentValue = element.value;

  // Construir el nuevo valor
  const beforeCursor = currentValue.substring(0, start);
  const afterCursor = currentValue.substring(end);
  const newValue = beforeCursor + text + afterCursor;

  // Actualizar el valor
  element.value = newValue;

  // Posicionar el cursor después del texto insertado
  const newCursorPos = start + text.length;
  element.setSelectionRange(newCursorPos, newCursorPos);

  // Disparar eventos para que los frameworks detecten el cambio
  element.dispatchEvent(
    new InputEvent("input", {
      bubbles: true,
      cancelable: true,
      inputType: "insertText",
      data: text,
    }),
  );
  element.dispatchEvent(new Event("change", { bubbles: true }));

  console.log("✅ Insertado en INPUT:", text);
}

// ===== INSERTAR EN CONTENTEDITABLE =====
function insertIntoContentEditable(element, text) {
  try {
    const selection = window.getSelection();

    if (!selection.rangeCount) {
      // Si no hay selección, insertar al final
      element.textContent += text;
      console.log("✅ Insertado al final:", text);
      return;
    }

    const range = selection.getRangeAt(0);

    // Eliminar cualquier texto seleccionado
    range.deleteContents();

    // Crear un nodo de texto con el carácter transformado
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);

    // Mover el cursor después del texto insertado
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);

    // Disparar eventos
    element.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        cancelable: true,
        inputType: "insertText",
        data: text,
      }),
    );
    element.dispatchEvent(new Event("change", { bubbles: true }));

    console.log("✅ Insertado en CONTENTEDITABLE:", text);
  } catch (error) {
    console.error("❌ Error:", error);
    // Fallback: insertar al final
    element.textContent += text;
  }
}

// ===== AGREGAR EVENT LISTENERS =====
// Capturar keypress (antes de que se escriba)
document.addEventListener("keypress", handleKeyPress, true);

// También capturar keydown como backup
document.addEventListener(
  "keydown",
  (event) => {
    if (!settings.enabled) return;

    const element = event.target;
    const isEditable =
      element.tagName === "INPUT" ||
      element.tagName === "TEXTAREA" ||
      element.contentEditable === "true" ||
      element.isContentEditable;

    if (isEditable && event.key.length === 1) {
      // Este será manejado por keypress
      console.log("👀 Keydown detectado:", event.key);
    }
  },
  true,
);

// ===== INDICADOR VISUAL =====
function showIndicator() {
  // Remover indicador anterior
  const existing = document.getElementById("text-transform-indicator");
  if (existing) existing.remove();

  const indicator = document.createElement("div");
  indicator.id = "text-transform-indicator";
  indicator.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 20px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 600;
    z-index: 9999999;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    font-family: 'Segoe UI', -apple-system, sans-serif;
    animation: slideIn 0.3s ease-out;
    pointer-events: none;
  `;
  indicator.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 16px;">✨</span>
      <span>Transformador Activo</span>
    </div>
  `;

  // Agregar animación
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(indicator);

  // Remover después de 3 segundos
  setTimeout(() => {
    indicator.style.transition = "all 0.3s ease-out";
    indicator.style.transform = "translateX(400px)";
    indicator.style.opacity = "0";
    setTimeout(() => {
      indicator.remove();
      style.remove();
    }, 300);
  }, 3000);
}

console.log("✅ Transformador de Texto - Content Script Cargado");
console.log(
  "📝 Para ver si funciona, abre la consola (F12) y observa los logs al escribir",
);
