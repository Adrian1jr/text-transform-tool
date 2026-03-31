// Obtener elementos del DOM
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const copyBtn = document.getElementById("copyBtn");

// Opciones
const uppercaseCheck = document.getElementById("uppercase");
const lowercaseCheck = document.getElementById("lowercase");
const addSpacesCheck = document.getElementById("addSpaces");
const spacingAmount = document.getElementById("spacingAmount");
const spacingValue = document.getElementById("spacingValue");

// Función principal de transformación
function transformText() {
  let text = inputText.value;

  if (!text) {
    outputText.textContent = "Escribe algo para comenzar...";
    return;
  }

  // Aplicar mayúsculas o minúsculas
  if (uppercaseCheck.checked) {
    text = text.toUpperCase();
  } else if (lowercaseCheck.checked) {
    text = text.toLowerCase();
  }

  // Agregar espacios entre letras
  if (addSpacesCheck.checked) {
    const spaces = " ".repeat(parseInt(spacingAmount.value));
    const wordSeparator = " ".repeat(parseInt(spacingAmount.value) * 3); // Espacios entre palabras son 3x más grandes
    
    text = text
      .split("")
      .map((char, index, array) => {
        if (index === array.length - 1) return char;
        
        // Si el carácter actual es un espacio, reemplazarlo por un separador más grande
        if (char === " ") return wordSeparator;
        
        // Si el siguiente carácter es un espacio, no agregar espacios extras al carácter actual
        if (array[index + 1] === " ") return char;
        
        // Agregar espacios entre caracteres no-espacio
        return char + spaces;
      })
      .join("");
  }

  outputText.textContent = text;
}

// Event listeners
inputText.addEventListener("input", transformText);
uppercaseCheck.addEventListener("change", () => {
  if (uppercaseCheck.checked) {
    lowercaseCheck.checked = false;
  }
  transformText();
});

lowercaseCheck.addEventListener("change", () => {
  if (lowercaseCheck.checked) {
    uppercaseCheck.checked = false;
  }
  transformText();
});

addSpacesCheck.addEventListener("change", transformText);

spacingAmount.addEventListener("input", () => {
  spacingValue.textContent = spacingAmount.value;
  transformText();
});

// Copiar al portapapeles
copyBtn.addEventListener("click", async () => {
  const text = outputText.textContent;

  if (!text || text === "Escribe algo para comenzar...") {
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = "✓ ¡Copiado!";
    copyBtn.classList.add("copied");

    setTimeout(() => {
      copyBtn.textContent = "📋 Copiar al Portapapeles";
      copyBtn.classList.remove("copied");
    }, 2000);
  } catch (err) {
    console.error("Error al copiar:", err);
    alert("No se pudo copiar al portapapeles");
  }
});

// Inicializar con texto de ejemplo
inputText.value = "pilotas";
transformText();
