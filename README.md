# 🚀 Ranjit Editor - Advanced jQuery Rich Text Editor Plugin

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/ranjit-editor/ranjit-editor)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![jQuery](https://img.shields.io/badge/jquery-3.7+-orange.svg)](https://jquery.com/)

A powerful, feature-rich, and modern jQuery plugin that transforms simple textareas into advanced rich text editors with professional-grade functionality.

## ✨ Features

### 🎯 Core Features

- **Undo/Redo System** - Full history management with 50 levels
- **Auto-save** - Automatic content saving every 5 seconds
- **Word & Character Count** - Real-time statistics
- **Dark Mode** - Beautiful dark theme with localStorage persistence
- **Fullscreen Mode** - Distraction-free editing experience

### 📝 Rich Text Formatting

- **Advanced Headings** - H1 to H6 with custom styling
- **Font Selection** - 7 professional fonts
- **Font Sizes** - 8pt to 36pt range
- **Text Styling** - Bold, Italic, Underline, Strikethrough
- **Text Alignment** - Left, Center, Right, Justify
- **Subscript/Superscript** - Mathematical and scientific notation
- **Color Picker** - Text and background colors

### 🎨 Media & Content

- **Drag & Drop Images** - Simply drag images into the editor
- **Image Compression** - Auto-resize and optimize large images
- **Emoji Picker** - 80+ beautiful emojis
- **Tables** - Advanced table creation with styling
- **Links** - Easy link insertion and management
- **Date/Time Insert** - Current date/time insertion
- **Horizontal Rules** - Visual content separation

### 💻 Developer Features

- **HTML Source View** - Direct HTML editing
- **Keyboard Shortcuts** - Professional shortcuts (Ctrl+B, I, U, Z, Y, S)
- **Plugin Options** - Highly configurable
- **Event Handling** - Optimized performance
- **Cross-browser** - Works on all modern browsers
- **Mobile Responsive** - Touch-friendly interface

## 🚀 Quick Start

**That's it! No hidden elements, no complex setup - just include the files and initialize!**

### 1. Include Dependencies

```html
<!-- Font Awesome for icons -->
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
/>

<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<!-- Ranjit Editor CSS & JS -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/ranjitraut-sta/ranjit-editor@main/assets/main.css"
/>
<script src="https://cdn.jsdelivr.net/gh/ranjitraut-sta/ranjit-editor@main/assets/main.js"></script>
```

### 2. HTML Structure

```html
<!-- Just add your textarea - no hidden elements needed! -->
<textarea id="myEditor" name="content">
  <h2>Welcome to Ranjit Editor!</h2>
  <p>Start editing your content here...</p>
</textarea>
```

### 3. Initialize Plugin

```javascript
$(document).ready(function () {
  // Basic usage
  $("#myEditor").ranjitEditor();

  // Or with custom options
  $("#myEditor").ranjitEditor({
    autosave: true,
    wordCount: true,
    darkMode: false,
    fullscreen: true,
    emoji: true,
    autosaveInterval: 5000,
  });
});
```

## ⚙️ Configuration Options

| Option             | Type    | Default | Description                        |
| ------------------ | ------- | ------- | ---------------------------------- |
| `autosave`         | Boolean | `true`  | Enable automatic content saving    |
| `wordCount`        | Boolean | `true`  | Show word and character count      |
| `darkMode`         | Boolean | `false` | Start in dark mode                 |
| `fullscreen`       | Boolean | `true`  | Enable fullscreen mode             |
| `emoji`            | Boolean | `true`  | Enable emoji picker                |
| `autosaveInterval` | Number  | `5000`  | Auto-save interval in milliseconds |

## 🎮 Keyboard Shortcuts

| Shortcut       | Action         |
| -------------- | -------------- |
| `Ctrl + B`     | Bold text      |
| `Ctrl + I`     | Italic text    |
| `Ctrl + U`     | Underline text |
| `Ctrl + Z`     | Undo           |
| `Ctrl + Y`     | Redo           |
| `Ctrl + S`     | Manual save    |
| `Ctrl + A`     | Select all     |
| `Ctrl + Enter` | Submit form    |

## 🎨 Themes & Customization

### Dark Mode

```javascript
// Enable dark mode programmatically
$("body").addClass("dark-mode");

// Toggle dark mode
$("body").toggleClass("dark-mode");
```

### Custom Styling

```css
/* Override default colors */
.ranjit-editor-container {
  --primary-color: #your-color;
  --secondary-color: #your-color;
}
```

## 📱 Mobile Support

Ranjit Editor is fully responsive and touch-friendly:

- Touch-optimized toolbar buttons
- Responsive design for all screen sizes
- Mobile-friendly modals and dialogs
- Swipe gesture support

## 🔧 Advanced Usage

### Multiple Editors

```javascript
// Initialize multiple editors
$(".editor").ranjitEditor({
  autosave: true,
  wordCount: true,
});
```

### Custom Event Handling

```javascript
$("#myEditor")
  .ranjitEditor({
    autosave: true,
  })
  .on("ranjit:save", function (e, content) {
    console.log("Content saved:", content);
  });
```

### Programmatic Control

```javascript
// Get editor instance
const editor = $("#myEditor").data("ranjitEditor");

// Get content
const content = editor.getContent();

// Set content
editor.setContent("<p>New content</p>");

// Toggle fullscreen
editor.toggleFullscreen();
```

## 🌟 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Opera 47+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📦 File Structure

```
ranjit-editor/
├── assets/
│   ├── main.js          # Core plugin JavaScript
│   └── main.css         # Complete styling
├── texteditor.html      # Demo page
├── README.md           # Documentation
├── LICENSE             # MIT License
└── package.json        # Package information
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Font Awesome for beautiful icons
- jQuery team for the amazing framework
- All contributors and users

## 📞 Support

- 📧 Email: support@ranjiteditor.com
- 🐛 Issues: [GitHub Issues](https://github.com/ranjit-editor/ranjit-editor/issues)
- 📖 Documentation: [Full Docs](https://ranjiteditor.com/docs)

---

**Made with ❤️ by Ranjit Editor Team**

_Transform your textareas into powerful rich text editors!_
