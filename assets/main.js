(function ($) {
  let activeEditorInstance = null;
  const emojis = ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','🥱','😴','🤤','😪','😵','🤐','🥴','🤢','🤮','🤧','😷','🤒','🤕','🤑','🤠','😈','👿','👹','👺','🤡','💩','👻','💀','☠️','👽','👾','🤖','🎃','😺','😸','😹','😻','😼','😽','🙀','😿','😾'];

  $.fn.ranjitEditor = function (options = {}) {
    const settings = $.extend({
      autosave: true,
      wordCount: true,
      darkMode: false,
      fullscreen: true,
      emoji: true,
      autosaveInterval: 5000
    }, options);

    const generateId = () => "ranjit-" + Math.random().toString(36).substr(2, 9);

    const editorTemplate = `
      <div class="ranjit-editor-container">
        <div class="ranjit-editor-toolbar">
          <div class="tool-group">
            <button type="button" class="tool-button" data-command="undo" title="Undo (Ctrl+Z)"><i class="fas fa-undo"></i></button>
            <button type="button" class="tool-button" data-command="redo" title="Redo (Ctrl+Y)"><i class="fas fa-redo"></i></button>
          </div>
          <div class="tool-group">
            <select class="tool-select" data-command="formatBlock">
              <option value="P">Paragraph</option>
              <option value="H1">Heading 1</option>
              <option value="H2">Heading 2</option>
              <option value="H3">Heading 3</option>
              <option value="H4">Heading 4</option>
              <option value="H5">Heading 5</option>
              <option value="H6">Heading 6</option>
              <option value="BLOCKQUOTE">Quote</option>
              <option value="PRE">Code Block</option>
            </select>
          </div>
          <div class="tool-group">
            <select class="tool-select" data-command="fontName">
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Courier New">Courier New</option>
              <option value="Impact">Impact</option>
            </select>
          </div>
          <div class="tool-group">
            <select class="tool-select" data-command="fontSize">
              <option value="1">8pt</option>
              <option value="2">10pt</option>
              <option value="3" selected>12pt</option>
              <option value="4">14pt</option>
              <option value="5">18pt</option>
              <option value="6">24pt</option>
              <option value="7">36pt</option>
            </select>
          </div>
          <div class="tool-group">
            <button type="button" class="tool-button" data-command="bold" title="Bold (Ctrl+B)"><i class="fas fa-bold"></i></button>
            <button type="button" class="tool-button" data-command="italic" title="Italic (Ctrl+I)"><i class="fas fa-italic"></i></button>
            <button type="button" class="tool-button" data-command="underline" title="Underline (Ctrl+U)"><i class="fas fa-underline"></i></button>
            <button type="button" class="tool-button" data-command="strikeThrough" title="Strikethrough"><i class="fas fa-strikethrough"></i></button>
          </div>
          <div class="tool-group">
            <button type="button" class="tool-button" data-command="subscript" title="Subscript"><i class="fas fa-subscript"></i></button>
            <button type="button" class="tool-button" data-command="superscript" title="Superscript"><i class="fas fa-superscript"></i></button>
          </div>
          <div class="tool-group">
            <div class="tool-color-picker" title="Text Color"><i class="fas fa-font"></i><input type="color" data-command="foreColor" value="#000000"></div>
            <div class="tool-color-picker" title="Background Color"><i class="fas fa-fill-drip"></i><input type="color" data-command="hiliteColor" value="#ffff00"></div>
          </div>
          <div class="tool-group">
            <button type="button" class="tool-button" data-command="justifyLeft" title="Align Left"><i class="fas fa-align-left"></i></button>
            <button type="button" class="tool-button" data-command="justifyCenter" title="Align Center"><i class="fas fa-align-center"></i></button>
            <button type="button" class="tool-button" data-command="justifyRight" title="Align Right"><i class="fas fa-align-right"></i></button>
            <button type="button" class="tool-button" data-command="justifyFull" title="Justify"><i class="fas fa-align-justify"></i></button>
          </div>
          <div class="tool-group">
            <button type="button" class="tool-button" data-command="insertUnorderedList" title="Bullet List"><i class="fas fa-list-ul"></i></button>
            <button type="button" class="tool-button" data-command="insertOrderedList" title="Numbered List"><i class="fas fa-list-ol"></i></button>
            <button type="button" class="tool-button" data-command="outdent" title="Decrease Indent"><i class="fas fa-outdent"></i></button>
            <button type="button" class="tool-button" data-command="indent" title="Increase Indent"><i class="fas fa-indent"></i></button>
          </div>
          <div class="tool-group">
            <button type="button" class="tool-button" data-command="createLink" title="Insert Link"><i class="fas fa-link"></i></button>
            <button type="button" class="tool-button" data-command="unlink" title="Remove Link"><i class="fas fa-unlink"></i></button>
            <button type="button" class="tool-button" data-command="insertImage" title="Insert Image"><i class="fas fa-image"></i></button>
            <button type="button" class="tool-button" data-command="insertTable" title="Insert Table"><i class="fas fa-table"></i></button>
          </div>
          <div class="tool-group">
            <button type="button" class="tool-button" data-command="insertHorizontalRule" title="Horizontal Line"><i class="fas fa-minus"></i></button>
            <button type="button" class="tool-button" data-command="showEmoji" title="Insert Emoji"><i class="fas fa-smile"></i></button>
            <button type="button" class="tool-button" data-command="insertDateTime" title="Insert Date/Time"><i class="fas fa-clock"></i></button>
          </div>
          <div class="tool-group">
            <button type="button" class="tool-button" data-command="removeFormat" title="Clear Formatting"><i class="fas fa-remove-format"></i></button>
            <button type="button" class="tool-button" data-command="selectAll" title="Select All (Ctrl+A)"><i class="fas fa-check-square"></i></button>
          </div>
          <div class="tool-group">
            <button type="button" class="tool-button" data-command="toggleCode" title="HTML Source"><i class="fas fa-code"></i></button>
            <button type="button" class="tool-button" data-command="toggleFullscreen" title="Fullscreen"><i class="fas fa-expand"></i></button>
            <button type="button" class="tool-button" data-command="showHelp" title="Help"><i class="fas fa-question-circle"></i></button>
          </div>
        </div>
        <div class="ranjit-editor-content" contenteditable="true" data-placeholder="Start writing your content here..."></div>
        <div class="ranjit-editor-footer">
          <div class="editor-status">
            <span class="word-count">Words: 0</span>
            <span class="char-count">Characters: 0</span>
            <span class="autosave-status">Ready</span>
          </div>
        </div>
        <div class="ranjit-editor-code-wrapper">
          <div class="ranjit-editor-code-toolbar">
            <span>HTML Source Code</span>
            <button type="button" class="tool-button" data-command="toggleCode" title="Visual Editor"><i class="fas fa-eye"></i> Visual</button>
          </div>
          <textarea class="ranjit-editor-code"></textarea>
        </div>
      </div>
    `;

    return this.each(function () {
      const $originalTextarea = $(this);
      const $editor = $(editorTemplate);
      const editorId = generateId();
      
      const $contentArea = $editor.find(".ranjit-editor-content");
      const $codeArea = $editor.find(".ranjit-editor-code");
      const $toolbar = $editor.find(".ranjit-editor-toolbar");
      const $wordCount = $editor.find(".word-count");
      const $charCount = $editor.find(".char-count");
      const $autosaveStatus = $editor.find(".autosave-status");
      
      let history = [];
      let historyIndex = -1;
      let autosaveTimer;
      
      const instance = {
        $editor: $editor,
        $contentArea: $contentArea,
        settings: settings,
        
        exec: (command, value = null) => {
          if (command === 'undo' || command === 'redo') {
            document.execCommand(command, false, value);
          } else {
            instance.saveState();
            document.execCommand(command, false, value);
          }
          $contentArea.focus();
          instance.updateToolbar();
          instance.updateCounts();
        },
        
        saveState: () => {
          const content = $contentArea.html();
          if (history[historyIndex] !== content) {
            history = history.slice(0, historyIndex + 1);
            history.push(content);
            historyIndex++;
            if (history.length > 50) {
              history.shift();
              historyIndex--;
            }
          }
        },
        
        undo: () => {
          if (historyIndex > 0) {
            historyIndex--;
            $contentArea.html(history[historyIndex]);
            instance.updateCounts();
          }
        },
        
        redo: () => {
          if (historyIndex < history.length - 1) {
            historyIndex++;
            $contentArea.html(history[historyIndex]);
            instance.updateCounts();
          }
        },
        
        updateCounts: () => {
          if (settings.wordCount) {
            const text = $contentArea.text();
            const words = text.trim() ? text.trim().split(/\s+/).length : 0;
            const chars = text.length;
            $wordCount.text(`Words: ${words}`);
            $charCount.text(`Characters: ${chars}`);
          }
        },
        
        autosave: () => {
          if (settings.autosave) {
            const content = $contentArea.html();
            $originalTextarea.val(content);
            localStorage.setItem(`ranjit-editor-${editorId}`, content);
            $autosaveStatus.text('Saved').addClass('saved');
            setTimeout(() => {
              $autosaveStatus.text('Ready').removeClass('saved');
            }, 2000);
          }
        },
        
        saveSelection: () => {
          if (window.getSelection) {
            const sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) return sel.getRangeAt(0);
          }
          return null;
        },
        
        restoreSelection: (range) => {
          if (range && window.getSelection) {
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
          }
        },
        
        updateToolbar: () => {
          $toolbar.find("[data-command]").each(function () {
            const command = $(this).data("command");
            if (document.queryCommandState && document.queryCommandState(command)) {
              $(this).addClass("is-active");
            } else {
              $(this).removeClass("is-active");
            }
          });
        },
        
        toggleFullscreen: () => {
          $editor.toggleClass('fullscreen-mode');
          const isFullscreen = $editor.hasClass('fullscreen-mode');
          $toolbar.find('[data-command="toggleFullscreen"] i')
            .toggleClass('fa-expand', !isFullscreen)
            .toggleClass('fa-compress', isFullscreen);
        },
        
        insertEmoji: (emoji) => {
          instance.exec('insertText', emoji);
        }
      };

      // Setup
      $originalTextarea.hide().after($editor);
      
      // Load content
      const savedContent = localStorage.getItem(`ranjit-editor-${editorId}`);
      const initialContent = savedContent || $originalTextarea.val();
      $contentArea.html(initialContent);
      instance.saveState();
      instance.updateCounts();
      
      // Drag and drop support
      $contentArea.on('dragover', (e) => {
        e.preventDefault();
        $contentArea.addClass('drag-over');
      }).on('dragleave', () => {
        $contentArea.removeClass('drag-over');
      }).on('drop', (e) => {
        e.preventDefault();
        $contentArea.removeClass('drag-over');
        const files = e.originalEvent.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => instance.exec('insertImage', e.target.result);
          reader.readAsDataURL(files[0]);
        }
      });
      
      // Content sync and autosave
      $contentArea.on("input keyup paste", () => {
        $originalTextarea.val($contentArea.html());
        instance.updateCounts();
        $autosaveStatus.text('Modified').removeClass('saved');
        
        if (settings.autosave) {
          clearTimeout(autosaveTimer);
          autosaveTimer = setTimeout(instance.autosave, settings.autosaveInterval);
        }
      });
      
      // Keyboard shortcuts
      $contentArea.on('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
          switch(e.key) {
            case 'z': e.preventDefault(); instance.undo(); break;
            case 'y': e.preventDefault(); instance.redo(); break;
            case 'b': e.preventDefault(); instance.exec('bold'); break;
            case 'i': e.preventDefault(); instance.exec('italic'); break;
            case 'u': e.preventDefault(); instance.exec('underline'); break;
            case 's': e.preventDefault(); instance.autosave(); break;
          }
        }
      });
      
      $contentArea.on("keyup mouseup focus", () => {
        activeEditorInstance = instance;
        instance.updateToolbar();
      });

      // Toolbar events
      $editor.find("[data-command]").on("click change", function (e) {
        e.preventDefault();
        activeEditorInstance = instance;
        const command = $(this).data("command");
        const value = $(this).is("select") ? $(this).val() : null;
        const selection = instance.saveSelection();

        switch (command) {
          case 'undo': instance.undo(); break;
          case 'redo': instance.redo(); break;
          
          case "createLink": {
            instance.restoreSelection(selection);
            const url = prompt("Enter URL:", "https://");
            if (url) instance.exec(command, url);
            break;
          }
          
          case "insertImage": {
            $("#ranjitImageUpload").click();
            break;
          }
          
          case "insertTable": {
            instance.restoreSelection(selection);
            const rows = prompt("Number of rows:", "3");
            const cols = prompt("Number of columns:", "3");
            if (rows > 0 && cols > 0) {
              let table = '<table border="1" style="border-collapse: collapse; width: 100%;"><tbody>';
              for (let r = 0; r < rows; r++) {
                table += '<tr>';
                for (let c = 0; c < cols; c++) {
                  table += '<td style="padding: 8px; border: 1px solid #ddd;">&nbsp;</td>';
                }
                table += '</tr>';
              }
              table += '</tbody></table><p><br></p>';
              instance.exec('insertHTML', table);
            }
            break;
          }
          
          case "insertDateTime": {
            const now = new Date();
            const dateTime = now.toLocaleString();
            instance.exec('insertText', dateTime);
            break;
          }
          
          case "showEmoji": {
            let emojiHtml = '<div class="emoji-grid">';
            emojis.forEach(emoji => {
              emojiHtml += `<span class="emoji-item" data-emoji="${emoji}">${emoji}</span>`;
            });
            emojiHtml += '</div>';
            
            $("#ranjitEmojiModal").html(`
              <div class="ranjit-modal-content">
                <span class="ranjit-modal-close">&times;</span>
                <h3>Select Emoji</h3>
                ${emojiHtml}
              </div>
            `).css("display", "flex");
            break;
          }
          
          case "toggleCode": {
            $editor.toggleClass("code-view-active");
            if ($editor.hasClass("code-view-active")) {
              $codeArea.val($contentArea.html());
            } else {
              $contentArea.html($codeArea.val()).focus();
              instance.updateCounts();
            }
            break;
          }
          
          case "toggleFullscreen": {
            instance.toggleFullscreen();
            break;
          }
          
          case "selectAll": {
            instance.exec('selectAll');
            break;
          }
          
          case "showHelp": {
            $("#ranjitHelpModal").html(`
              <div class="ranjit-modal-content">
                <span class="ranjit-modal-close">&times;</span>
                <h3>Ranjit Editor - Advanced Features</h3>
                <div class="help-content">
                  <h4>Keyboard Shortcuts:</h4>
                  <ul>
                    <li><strong>Ctrl+B</strong> - Bold</li>
                    <li><strong>Ctrl+I</strong> - Italic</li>
                    <li><strong>Ctrl+U</strong> - Underline</li>
                    <li><strong>Ctrl+Z</strong> - Undo</li>
                    <li><strong>Ctrl+Y</strong> - Redo</li>
                    <li><strong>Ctrl+S</strong> - Save</li>
                  </ul>
                  <h4>Features:</h4>
                  <ul>
                    <li>Auto-save every 5 seconds</li>
                    <li>Drag & drop image upload</li>
                    <li>Word and character count</li>
                    <li>Fullscreen editing mode</li>
                    <li>Emoji picker</li>
                    <li>Advanced formatting options</li>
                  </ul>
                </div>
              </div>
            `).css("display", "flex");
            break;
          }
          
          default: {
            instance.exec(command, value);
          }
        }
      });
    });
  };

  // Shared event handlers
  $(function () {
    // Image upload with compression
    $("#ranjitImageUpload").on("change", function () {
      if (this.files && this.files[0] && activeEditorInstance) {
        const file = this.files[0];
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
          alert('Image size should be less than 2MB');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Resize if too large
            let { width, height } = img;
            const maxSize = 800;
            if (width > maxSize || height > maxSize) {
              if (width > height) {
                height = (height * maxSize) / width;
                width = maxSize;
              } else {
                width = (width * maxSize) / height;
                height = maxSize;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            activeEditorInstance.exec('insertImage', compressedDataUrl);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        $(this).val('');
      }
    });
    
    // Emoji selection
    $(document).on('click', '.emoji-item', function() {
      const emoji = $(this).data('emoji');
      if (activeEditorInstance) {
        activeEditorInstance.insertEmoji(emoji);
        $('.ranjit-modal-overlay').hide();
      }
    });
    
    // Modal events
    $(document)
      .on("click", ".ranjit-modal-overlay, .ranjit-modal-close", function () {
        $(".ranjit-modal-overlay").hide();
      })
      .on("click", ".ranjit-modal-content", (e) => e.stopPropagation());
      
    // Prevent form submission on Enter in editor
    $(document).on('keydown', '.ranjit-editor-content', function(e) {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        $(this).closest('form').submit();
      }
    });
  });
})(jQuery);
