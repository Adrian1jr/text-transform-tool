# 🚀 Transformador de Texto - Extensión Chrome

Extensión de Chrome que transforma automáticamente tu escritura con el estilo **P I L O T A S** (espacios entre letras) en cualquier campo de texto.

## ✨ Características

- ✅ Transformación en tiempo real mientras escribes
- ✅ Mayúsculas/minúsculas personalizables
- ✅ Control de espaciado entre letras (1-5 espacios)
- ✅ Activar/desactivar con un clic
- ✅ Funciona en todos los sitios web
- ✅ Área de prueba integrada en el popup

## 📦 Instalación

### Paso 1: Crear los iconos

Como Chrome requiere iconos PNG, necesitas convertir el archivo `icon.svg` a PNG:

1. Abre el archivo `icon.svg` en un navegador
2. Toma captura de pantalla o usa una herramienta de conversión online
3. Crea 3 versiones:
   - `icon16.png` (16x16 píxeles)
   - `icon48.png` (48x48 píxeles)
   - `icon128.png` (128x128 píxeles)

**O usa este comando si tienes ImageMagick instalado:**

```bash
# Requiere ImageMagick
magick icon.svg -resize 16x16 icon16.png
magick icon.svg -resize 48x48 icon48.png
magick icon.svg -resize 128x128 icon128.png
```

**Alternativa rápida:** Descarga iconos gratuitos de [Flaticon](https://www.flaticon.com/) o [Icons8](https://icons8.com/) y renómbralos.

### Paso 2: Cargar la extensión en Chrome

1. Abre Chrome y ve a: `chrome://extensions/`
2. Activa el **"Modo de desarrollador"** (esquina superior derecha)
3. Haz clic en **"Cargar extensión sin empaquetar"**
4. Selecciona la carpeta `text-transform-tool`
5. ¡Listo! Verás el icono en la barra de herramientas

## 🎯 Cómo usar

1. **Activa la extensión**: Haz clic en el icono y presiona "Activar Extensión"
2. **Configura tus preferencias**:
   - Mayúsculas/minúsculas
   - Cantidad de espacios entre letras
3. **Escribe en cualquier sitio**: Ve a cualquier página web y escribe en cualquier campo de texto
4. **Resultado automático**: Tu texto se transformará mientras escribes

### Ejemplo:

Si escribes: `hola mundo`  
Con la extensión activada, se escribirá: `H O L A   M U N D O`

## 🔧 Configuración

- **Mayúsculas**: Convierte todo a MAYÚSCULAS
- **Minúsculas**: Convierte todo a minúsculas
- **Espacios entre letras**: Añade espacios entre cada carácter
- **Cantidad de espacios**: Controla cuántos espacios (1-5)

## 📝 Archivos de la extensión

```
text-transform-tool/
├── manifest.json       # Configuración de la extensión
├── popup.html          # Interfaz del popup
├── popup.js            # Lógica del popup
├── content.js          # Script que intercepta el texto
├── background.js       # Mantiene el estado
├── icon.svg            # Icono en SVG
├── icon16.png          # Icono 16x16
├── icon48.png          # Icono 48x48
├── icon128.png         # Icono 128x128
└── README.md           # Este archivo
```

## 🐛 Solución de problemas

**La extensión no transforma el texto:**

- Verifica que esté activada (badge "ON" en el icono)
- Recarga la página web
- Algunos campos pueden estar protegidos (ej: contraseñas)

**No veo el indicador verde:**

- El indicador aparece por 3 segundos cuando activas la extensión
- Verifica que la extensión esté habilitada en `chrome://extensions/`

**Los espacios no se aplican correctamente:**

- Algunos sitios web pueden tener su propia lógica de input
- Intenta desactivar y reactivar la extensión

## 🚀 Mejoras futuras

- [ ] Atajos de teclado para activar/desactivar
- [ ] Whitelist/blacklist de sitios
- [ ] Más estilos de transformación
- [ ] Soporte para idiomas con caracteres especiales
- [ ] Modo "sticky" que se mantiene activo por sitio

## 📄 Licencia

Libre para uso personal y comercial.

---

**¡Disfruta escribiendo con estilo P I L O T A S! ✨**
