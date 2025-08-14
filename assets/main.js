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
            <button type="button" class="tool-button" data-command="insertVideo" title="Insert Video"><i class="fas fa-video"></i></button>
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
      // Ensure required elements exist before initializing
      ensureRequiredElements();
      
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
          activeEditorInstance = instance;
          showImageBuilder(instance);
          // Auto-load the dropped file
          setTimeout(() => {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
              const img = new Image();
              img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                let { width, height } = img;
                const maxSize = 1200;
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
                
                // Show in image builder
                if ($('#imagePreview').length) {
                  $('#imagePreview').attr('src', compressedDataUrl);
                  $('#imagePreviewSection').show();
                  window.currentImageData = { src: compressedDataUrl, width, height, size: 50, align: 'left', display: 'inline', alt: 'Image' };
                }
              };
              img.src = e.target.result;
            };
            reader.readAsDataURL(file);
          }, 100);
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
            showImageBuilder(instance);
            break;
          }
          
          case "insertVideo": {
            showVideoBuilder(instance);
            break;
          }
          
          case "insertTable": {
            instance.restoreSelection(selection);
            showTableBuilder(instance);
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

  // Auto-create required elements if they don't exist
  function ensureRequiredElements() {
    if (!$('#ranjitImageUpload').length) {
      $('body').append('<input type="file" id="ranjitImageUpload" accept="image/*" style="display: none;">');
    }
    if (!$('#ranjitHelpModal').length) {
      $('body').append('<div id="ranjitHelpModal" class="ranjit-modal-overlay"></div>');
    }
    if (!$('#ranjitEmojiModal').length) {
      $('body').append('<div id="ranjitEmojiModal" class="ranjit-modal-overlay"></div>');
    }
    if (!$('#ranjitTableModal').length) {
      $('body').append('<div id="ranjitTableModal" class="ranjit-modal-overlay"></div>');
    }
    if (!$('#ranjitImageModal').length) {
      $('body').append('<div id="ranjitImageModal" class="ranjit-modal-overlay"></div>');
    }
    if (!$('#ranjitVideoModal').length) {
      $('body').append('<div id="ranjitVideoModal" class="ranjit-modal-overlay"></div>');
    }
  }
  
  // Video builder function
  function showVideoBuilder(editorInstance) {
    const videoBuilderHtml = `
      <div class="ranjit-modal-content video-builder-modal">
        <span class="ranjit-modal-close">&times;</span>
        <h3>🎥 Insert Video</h3>
        
        <div class="video-builder-section">
          <h4>🔗 Video URL</h4>
          <div class="video-url-inputs">
            <input type="url" id="videoUrlInput" placeholder="Paste YouTube, Vimeo, or direct video URL...">
            <button class="video-btn" id="loadVideoBtn">Load Video</button>
          </div>
          <div class="video-examples">
            <small>ℹ️ Supported: YouTube, Vimeo, MP4, WebM, OGV</small>
          </div>
        </div>
        
        <div class="video-builder-section">
          <h4>📁 Upload Video File</h4>
          <div class="video-upload-area" id="videoUploadArea">
            <div class="upload-content">
              <i class="fas fa-video"></i>
              <p>Click to Upload Video File</p>
              <small>Supports: MP4, WebM, OGV (Max 50MB)</small>
            </div>
            <input type="file" id="videoFileInput" accept="video/*" style="display: none;">
          </div>
        </div>
        
        <div class="video-preview-section" id="videoPreviewSection" style="display: none;">
          <h4>🎨 Video Settings</h4>
          <div class="video-preview-container" id="videoPreviewContainer"></div>
          
          <div class="video-controls">
            <div class="control-group">
              <label>📏 Size:</label>
              <div class="size-buttons">
                <button class="size-btn" data-size="400">Small</button>
                <button class="size-btn active" data-size="560">Medium</button>
                <button class="size-btn" data-size="800">Large</button>
                <button class="size-btn" data-size="100%">Full Width</button>
              </div>
            </div>
            
            <div class="control-group">
              <label>📍 Alignment:</label>
              <div class="align-buttons">
                <button class="align-btn" data-align="left"><i class="fas fa-align-left"></i> Left</button>
                <button class="align-btn active" data-align="center"><i class="fas fa-align-center"></i> Center</button>
                <button class="align-btn" data-align="right"><i class="fas fa-align-right"></i> Right</button>
              </div>
            </div>
            
            <div class="control-group">
              <label>⚙️ Options:</label>
              <div class="video-options">
                <label><input type="checkbox" id="videoAutoplay"> ▶️ Autoplay</label>
                <label><input type="checkbox" id="videoControls" checked> 🎮 Show Controls</label>
                <label><input type="checkbox" id="videoLoop"> 🔁 Loop</label>
                <label><input type="checkbox" id="videoMuted"> 🔇 Muted</label>
              </div>
            </div>
            
            <div class="insert-buttons">
              <button class="video-btn primary" id="insertVideoBtn">✨ Insert Video</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    $('#ranjitVideoModal').html(videoBuilderHtml).css('display', 'flex');
    
    let currentVideoData = null;
    
    // Video upload area click
    $('#videoUploadArea').on('click', function() {
      $('#videoFileInput').click();
    });
    
    // File input change
    $('#videoFileInput').on('change', function() {
      const file = this.files[0];
      if (file) {
        handleVideoFile(file);
      }
    });
    
    // Load video URL
    $('#loadVideoBtn').on('click', function() {
      const url = $('#videoUrlInput').val().trim();
      if (url) {
        handleVideoUrl(url);
      }
    });
    
    // Size buttons
    $('.size-btn').on('click', function() {
      $('.size-btn').removeClass('active');
      $(this).addClass('active');
      updateVideoPreview();
    });
    
    // Alignment buttons
    $('.align-btn').on('click', function() {
      $('.align-btn').removeClass('active');
      $(this).addClass('active');
      updateVideoPreview();
    });
    
    // Video options
    $('.video-options input').on('change', function() {
      updateVideoPreview();
    });
    
    // Insert video
    $('#insertVideoBtn').on('click', function() {
      if (currentVideoData) {
        insertVideo(editorInstance, currentVideoData);
        $('#ranjitVideoModal').hide();
      } else {
        alert('Please select a video first!');
      }
    });
    
    function handleVideoFile(file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        alert('Video file should be less than 50MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function(e) {
        showVideoPreview(e.target.result, 'file');
      };
      reader.readAsDataURL(file);
    }
    
    function handleVideoUrl(url) {
      // Detect video type
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = extractYouTubeId(url);
        if (videoId) {
          showVideoPreview(`https://www.youtube.com/embed/${videoId}`, 'youtube');
        } else {
          alert('Invalid YouTube URL');
        }
      } else if (url.includes('vimeo.com')) {
        const videoId = extractVimeoId(url);
        if (videoId) {
          showVideoPreview(`https://player.vimeo.com/video/${videoId}`, 'vimeo');
        } else {
          alert('Invalid Vimeo URL');
        }
      } else if (url.match(/\.(mp4|webm|ogv)$/i)) {
        showVideoPreview(url, 'direct');
      } else {
        alert('Unsupported video URL format');
      }
    }
    
    function extractYouTubeId(url) {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      return match ? match[1] : null;
    }
    
    function extractVimeoId(url) {
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? match[1] : null;
    }
    
    function showVideoPreview(src, type) {
      currentVideoData = { src, type };
      $('#videoPreviewSection').show();
      updateVideoPreview();
    }
    
    function updateVideoPreview() {
      if (!currentVideoData) return;
      
      const size = $('.size-btn.active').data('size') || '560';
      const align = $('.align-btn.active').data('align') || 'center';
      const autoplay = $('#videoAutoplay').is(':checked');
      const controls = $('#videoControls').is(':checked');
      const loop = $('#videoLoop').is(':checked');
      const muted = $('#videoMuted').is(':checked');
      
      let videoHtml = '';
      let containerStyle = '';
      
      if (align === 'center') {
        containerStyle = 'text-align: center; margin: 20px 0;';
      } else if (align === 'right') {
        containerStyle = 'text-align: right; margin: 20px 0;';
      } else {
        containerStyle = 'text-align: left; margin: 20px 0;';
      }
      
      if (currentVideoData.type === 'youtube' || currentVideoData.type === 'vimeo') {
        let embedSrc = currentVideoData.src;
        const params = [];
        
        if (autoplay) params.push('autoplay=1');
        if (!controls && currentVideoData.type === 'youtube') params.push('controls=0');
        if (loop && currentVideoData.type === 'youtube') params.push('loop=1');
        if (muted) params.push('muted=1');
        
        if (params.length > 0) {
          embedSrc += '?' + params.join('&');
        }
        
        const width = size === '100%' ? '100%' : size + 'px';
        const height = size === '100%' ? '400px' : Math.round(size * 0.5625) + 'px';
        
        videoHtml = `<iframe src="${embedSrc}" width="${width}" height="${height}" frameborder="0" allowfullscreen style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"></iframe>`;
      } else {
        const width = size === '100%' ? '100%' : size + 'px';
        const height = size === '100%' ? '400px' : Math.round(size * 0.5625) + 'px';
        
        let videoAttrs = `width="${width}" height="${height}" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"`;
        if (controls) videoAttrs += ' controls';
        if (autoplay) videoAttrs += ' autoplay';
        if (loop) videoAttrs += ' loop';
        if (muted) videoAttrs += ' muted';
        
        videoHtml = `<video ${videoAttrs}><source src="${currentVideoData.src}" type="video/mp4">Your browser does not support the video tag.</video>`;
      }
      
      $('#videoPreviewContainer').html(`<div style="${containerStyle}">${videoHtml}</div>`);
      
      currentVideoData.size = size;
      currentVideoData.align = align;
      currentVideoData.autoplay = autoplay;
      currentVideoData.controls = controls;
      currentVideoData.loop = loop;
      currentVideoData.muted = muted;
    }
  }
  
  function insertVideo(editorInstance, videoData) {
    let containerStyle = 'margin: 20px 0;';
    
    if (videoData.align === 'center') {
      containerStyle += ' text-align: center;';
    } else if (videoData.align === 'right') {
      containerStyle += ' text-align: right;';
    } else {
      containerStyle += ' text-align: left;';
    }
    
    let videoHtml = '';
    
    if (videoData.type === 'youtube' || videoData.type === 'vimeo') {
      let embedSrc = videoData.src;
      const params = [];
      
      if (videoData.autoplay) params.push('autoplay=1');
      if (!videoData.controls && videoData.type === 'youtube') params.push('controls=0');
      if (videoData.loop && videoData.type === 'youtube') params.push('loop=1');
      if (videoData.muted) params.push('muted=1');
      
      if (params.length > 0) {
        embedSrc += '?' + params.join('&');
      }
      
      const width = videoData.size === '100%' ? '100%' : videoData.size + 'px';
      const height = videoData.size === '100%' ? '400px' : Math.round(videoData.size * 0.5625) + 'px';
      
      videoHtml = `<iframe src="${embedSrc}" width="${width}" height="${height}" frameborder="0" allowfullscreen style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 100%;"></iframe>`;
    } else {
      const width = videoData.size === '100%' ? '100%' : videoData.size + 'px';
      const height = videoData.size === '100%' ? '400px' : Math.round(videoData.size * 0.5625) + 'px';
      
      let videoAttrs = `width="${width}" height="${height}" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 100%;"`;
      if (videoData.controls) videoAttrs += ' controls';
      if (videoData.autoplay) videoAttrs += ' autoplay';
      if (videoData.loop) videoAttrs += ' loop';
      if (videoData.muted) videoAttrs += ' muted';
      
      videoHtml = `<video ${videoAttrs}><source src="${videoData.src}" type="video/mp4">Your browser does not support the video tag.</video>`;
    }
    
    const finalHtml = `<div class="video-container" style="${containerStyle}">${videoHtml}</div><p><br></p>`;
    
    editorInstance.$contentArea.focus();
    editorInstance.exec('insertHTML', finalHtml);
    
    console.log('Video inserted:', finalHtml);
  }
  
  // Image builder function
  function showImageBuilder(editorInstance) {
    const imageBuilderHtml = `
      <div class="ranjit-modal-content image-builder-modal">
        <span class="ranjit-modal-close">&times;</span>
        <h3>🖼️ Insert Image</h3>
        
        <div class="image-builder-section">
          <h4>📁 Upload Images</h4>
          <div class="upload-options">
            <button class="upload-mode-btn active" data-mode="single">📷 Single Image</button>
            <button class="upload-mode-btn" data-mode="multiple">🖼️ Multiple Images</button>
          </div>
          <div class="upload-area" id="imageUploadArea">
            <div class="upload-content">
              <i class="fas fa-cloud-upload-alt"></i>
              <p id="uploadText">Drag & Drop or Click to Upload</p>
              <small id="uploadHint">Supports: JPG, PNG, GIF (Max 2MB each)</small>
            </div>
            <input type="file" id="imageFileInput" accept="image/*" style="display: none;">
          </div>
        </div>
        
        <div class="image-builder-section">
          <h4>🔗 Image URL</h4>
          <div class="url-input-group">
            <input type="url" id="imageUrlInput" placeholder="https://example.com/image.jpg">
            <button class="image-btn" id="loadImageUrl">Load</button>
          </div>
        </div>
        
        <div class="gallery-preview-section" id="galleryPreviewSection" style="display: none;">
          <h4>🖼️ Gallery Preview</h4>
          <div class="gallery-images-container" id="galleryImagesContainer"></div>
          <div class="gallery-controls">
            <button class="image-btn" id="addMoreImages">➕ Add More Images</button>
            <button class="image-btn" id="clearGallery">🗑️ Clear All</button>
            <button class="image-btn primary" id="insertGalleryBtn">✨ Insert Gallery</button>
          </div>
        </div>
        
        <div class="image-preview-section" id="imagePreviewSection" style="display: none;">
          <h4>🎨 Image Settings</h4>
          <div class="image-preview-container">
            <img id="imagePreview" src="" alt="Preview">
          </div>
          
          <div class="image-controls">
            <div class="control-group">
              <label>📏 Size:</label>
              <div class="size-buttons">
                <button class="size-btn active" data-size="25">25%</button>
                <button class="size-btn" data-size="50">50%</button>
                <button class="size-btn" data-size="75">75%</button>
                <button class="size-btn" data-size="100">100%</button>
                <input type="number" id="customSize" placeholder="Custom" min="10" max="200" style="width: 80px;">
              </div>
            </div>
            
            <div class="control-group">
              <label>📍 Alignment:</label>
              <div class="align-buttons">
                <button class="align-btn active" data-align="left"><i class="fas fa-align-left"></i> Left</button>
                <button class="align-btn" data-align="center"><i class="fas fa-align-center"></i> Center</button>
                <button class="align-btn" data-align="right"><i class="fas fa-align-right"></i> Right</button>
              </div>
            </div>
            
            <div class="control-group">
              <label>🎯 Display:</label>
              <div class="display-buttons">
                <button class="display-btn active" data-display="inline">📄 Inline</button>
                <button class="display-btn" data-display="block">📋 Block</button>
                <button class="display-btn" data-display="gallery">🖼️ Gallery</button>
              </div>
            </div>
            
            <div class="control-group">
              <label>✏️ Alt Text:</label>
              <input type="text" id="imageAltText" placeholder="Describe the image...">
            </div>
            
            <div class="insert-buttons">
              <button class="image-btn primary" id="insertImageBtn">✨ Insert Image</button>
              <button class="image-btn" id="addToGalleryBtn">📚 Add to Gallery</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    $('#ranjitImageModal').html(imageBuilderHtml).css('display', 'flex');
    
    let currentImageData = null;
    let galleryImages = [];
    let uploadMode = 'single';
    
    // Upload mode toggle
    $('.upload-mode-btn').on('click', function() {
      $('.upload-mode-btn').removeClass('active');
      $(this).addClass('active');
      uploadMode = $(this).data('mode');
      
      if (uploadMode === 'multiple') {
        $('#imageFileInput').attr('multiple', true);
        $('#uploadText').text('Select Multiple Images for Gallery');
        $('#uploadHint').text('Hold Ctrl/Cmd to select multiple files (Max 2MB each)');
      } else {
        $('#imageFileInput').removeAttr('multiple');
        $('#uploadText').text('Drag & Drop or Click to Upload');
        $('#uploadHint').text('Supports: JPG, PNG, GIF (Max 2MB)');
      }
    });
    
    // Upload area click
    $('#imageUploadArea').on('click', function() {
      $('#imageFileInput').click();
    });
    
    // File input change
    $('#imageFileInput').on('change', function() {
      if (uploadMode === 'multiple' && this.files.length > 1) {
        handleMultipleFiles(this.files);
      } else if (this.files[0]) {
        handleImageFile(this.files[0]);
      }
    });
    
    // Drag and drop
    $('#imageUploadArea').on('dragover', function(e) {
      e.preventDefault();
      $(this).addClass('drag-over');
    }).on('dragleave', function() {
      $(this).removeClass('drag-over');
    }).on('drop', function(e) {
      e.preventDefault();
      $(this).removeClass('drag-over');
      const files = e.originalEvent.dataTransfer.files;
      
      if (uploadMode === 'multiple' && files.length > 1) {
        handleMultipleFiles(files);
      } else if (files[0] && files[0].type.startsWith('image/')) {
        handleImageFile(files[0]);
      }
    });
    
    // URL input
    $('#loadImageUrl').on('click', function() {
      const url = $('#imageUrlInput').val().trim();
      if (url) {
        handleImageUrl(url);
      }
    });
    
    // Size buttons
    $('.size-btn').on('click', function() {
      $('.size-btn').removeClass('active');
      $(this).addClass('active');
      updateImagePreview();
    });
    
    // Custom size input
    $('#customSize').on('input', function() {
      $('.size-btn').removeClass('active');
      updateImagePreview();
    });
    
    // Alignment buttons
    $('.align-btn').on('click', function() {
      $('.align-btn').removeClass('active');
      $(this).addClass('active');
      updateImagePreview();
    });
    
    // Display buttons
    $('.display-btn').on('click', function() {
      $('.display-btn').removeClass('active');
      $(this).addClass('active');
      updateImagePreview();
    });
    
    // Insert image
    $('#insertImageBtn').on('click', function() {
      const imageData = currentImageData || window.currentImageData;
      if (imageData) {
        insertImage(editorInstance, imageData);
        $('#ranjitImageModal').hide();
        // Clear data
        currentImageData = null;
        window.currentImageData = null;
      } else {
        alert('Please select an image first!');
      }
    });
    
    // Add to gallery
    $('#addToGalleryBtn').on('click', function() {
      const imageData = currentImageData || window.currentImageData;
      if (imageData) {
        galleryImages.push({...imageData});
        updateGalleryPreview();
        // Clear current image data for next image
        currentImageData = null;
        window.currentImageData = null;
        $('#imagePreviewSection').hide();
        alert(`Image added to gallery! Total: ${galleryImages.length} images`);
      }
    });
    
    // Gallery controls
    $('#addMoreImages').on('click', function() {
      $('#imageFileInput').click();
    });
    
    $('#clearGallery').on('click', function() {
      if (confirm('Clear all gallery images?')) {
        galleryImages = [];
        $('#galleryPreviewSection').hide();
      }
    });
    
    $('#insertGalleryBtn').on('click', function() {
      if (galleryImages.length >= 2) {
        insertGallery(editorInstance, galleryImages);
        $('#ranjitImageModal').hide();
        galleryImages = [];
      } else {
        alert('Gallery needs at least 2 images!');
      }
    });
    
    function handleImageFile(file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          // Compress if needed
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          let { width, height } = img;
          const maxSize = 1200;
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
          showImagePreview(compressedDataUrl, width, height);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
    
    function handleImageUrl(url) {
      const img = new Image();
      img.onload = function() {
        showImagePreview(url, img.width, img.height);
      };
      img.onerror = function() {
        alert('Failed to load image from URL');
      };
      img.src = url;
    }
    
    function handleMultipleFiles(files) {
      const validFiles = Array.from(files).filter(file => 
        file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024
      );
      
      if (validFiles.length === 0) {
        alert('No valid images found. Please select image files under 2MB.');
        return;
      }
      
      let processed = 0;
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
          const img = new Image();
          img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            let { width, height } = img;
            const maxSize = 800; // Smaller for gallery
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
            
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            galleryImages.push({
              src: compressedDataUrl,
              width,
              height,
              size: 25, // Default gallery size
              align: 'left',
              display: 'gallery',
              alt: `Gallery Image ${galleryImages.length + 1}`
            });
            
            processed++;
            if (processed === validFiles.length) {
              updateGalleryPreview();
            }
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    }
    
    function updateGalleryPreview() {
      if (galleryImages.length === 0) {
        $('#galleryPreviewSection').hide();
        return;
      }
      
      let galleryHtml = '';
      galleryImages.forEach((img, index) => {
        galleryHtml += `
          <div class="gallery-preview-item">
            <img src="${img.src}" alt="${img.alt}">
            <button class="remove-gallery-item" data-index="${index}">×</button>
          </div>
        `;
      });
      
      $('#galleryImagesContainer').html(galleryHtml);
      $('#galleryPreviewSection').show();
      $('#imagePreviewSection').hide();
      
      // Remove item functionality
      $('.remove-gallery-item').on('click', function() {
        const index = $(this).data('index');
        galleryImages.splice(index, 1);
        updateGalleryPreview();
      });
    }
    
    function showImagePreview(src, width, height) {
      currentImageData = { src, width, height, size: 50, align: 'left', display: 'inline', alt: 'Image' };
      window.currentImageData = currentImageData;
      $('#imagePreview').attr('src', src);
      $('#imagePreviewSection').show();
      $('#galleryPreviewSection').hide();
      updateImagePreview();
    }
    
    function updateImagePreview() {
      if (!currentImageData && !window.currentImageData) return;
      
      const imageData = currentImageData || window.currentImageData;
      const size = $('#customSize').val() || $('.size-btn.active').data('size') || 50;
      const align = $('.align-btn.active').data('align') || 'left';
      const display = $('.display-btn.active').data('display') || 'inline';
      
      let style = `width: ${size}%; height: auto;`;
      
      if (display === 'block') {
        style += ` display: block; margin: 10px auto;`;
      } else if (display === 'gallery') {
        style += ` display: inline-block; margin: 5px;`;
      }
      
      if (align === 'center') {
        style += ` margin-left: auto; margin-right: auto; display: block;`;
      } else if (align === 'right') {
        style += ` float: right; margin-left: 10px;`;
      } else if (align === 'left') {
        style += ` float: left; margin-right: 10px;`;
      }
      
      $('#imagePreview').attr('style', style);
      
      imageData.size = size;
      imageData.align = align;
      imageData.display = display;
      imageData.alt = $('#imageAltText').val() || 'Image';
      
      // Update both references
      currentImageData = imageData;
      window.currentImageData = imageData;
    }
  }
  
  function insertImage(editorInstance, imageData) {
    let style = `width: ${imageData.size}%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);`;
    
    if (imageData.display === 'block') {
      style += ` display: block; margin: 15px auto;`;
    } else if (imageData.align === 'center') {
      style += ` display: block; margin: 15px auto;`;
    } else if (imageData.align === 'right') {
      style += ` float: right; margin: 10px 0 10px 15px;`;
    } else {
      style += ` float: left; margin: 10px 15px 10px 0;`;
    }
    
    const imgHtml = `<img src="${imageData.src}" alt="${imageData.alt || 'Image'}" style="${style}" class="editor-image">`;
    
    // Focus editor and insert
    editorInstance.$contentArea.focus();
    editorInstance.exec('insertHTML', imgHtml + '<p><br></p>');
    
    console.log('Image inserted:', imgHtml);
  }
  
  function insertGallery(editorInstance, images) {
    let galleryHtml = '<div class="image-gallery" style="display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0;">';
    
    images.forEach(img => {
      const size = Math.min(100 / images.length, 25); // Auto-size based on count
      galleryHtml += `<img src="${img.src}" alt="${img.alt}" style="width: ${size}%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" class="gallery-image">`;
    });
    
    galleryHtml += '</div><p><br></p>';
    editorInstance.exec('insertHTML', galleryHtml);
  }
  
  // Table builder function
  function showTableBuilder(editorInstance) {
    const tableBuilderHtml = `
      <div class="ranjit-modal-content table-builder-modal">
        <span class="ranjit-modal-close">&times;</span>
        <h3>📊 Create Table</h3>
        
        <div class="table-builder-section">
          <h4>🎯 Quick Select (Hover to Preview)</h4>
          <div class="table-grid-selector" id="tableGridSelector">
            <div class="grid-preview" id="gridPreview"></div>
            <div class="grid-info" id="gridInfo">1 x 1</div>
          </div>
        </div>
        
        <div class="table-builder-section">
          <h4>⚙️ Custom Size</h4>
          <div class="custom-inputs">
            <label>Rows: <input type="number" id="customRows" value="3" min="1" max="20"></label>
            <label>Columns: <input type="number" id="customCols" value="3" min="1" max="10"></label>
            <button class="table-btn" id="createCustomTable">Create Custom Table</button>
          </div>
        </div>
        
        <div class="table-builder-section">
          <h4>🎨 Table Templates</h4>
          <div class="table-templates">
            <button class="template-btn" data-template="simple">📋 Simple</button>
            <button class="template-btn" data-template="header">📊 Header</button>
            <button class="template-btn" data-template="striped">🦓 Striped</button>
            <button class="template-btn" data-template="bordered">🔲 Bordered</button>
            <button class="template-btn" data-template="modern">✨ Modern</button>
            <button class="template-btn" data-template="minimal">🎯 Minimal</button>
          </div>
        </div>
        
        <div class="table-builder-section">
          <h4>🔧 Advanced Options</h4>
          <div class="advanced-options">
            <div class="option-group">
              <label><input type="checkbox" id="tableResponsive" checked> 📱 Responsive</label>
              <label><input type="checkbox" id="tableHover"> 🖱️ Hover Effects</label>
              <label><input type="checkbox" id="tableSortable"> 🔄 Sortable Headers</label>
            </div>
            <div class="option-group">
              <label>🎨 Color Theme:</label>
              <select id="tableColorTheme">
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="purple">Purple</option>
                <option value="red">Red</option>
                <option value="orange">Orange</option>
              </select>
            </div>
            <div class="option-group">
              <label>📏 Table Width:</label>
              <select id="tableWidth">
                <option value="100">100% (Full Width)</option>
                <option value="75">75%</option>
                <option value="50">50%</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `;
    
    $('#ranjitTableModal').html(tableBuilderHtml).css('display', 'flex');
    
    // Grid selector functionality
    const maxRows = 8, maxCols = 8;
    let gridHtml = '';
    for (let r = 0; r < maxRows; r++) {
      for (let c = 0; c < maxCols; c++) {
        gridHtml += `<div class="grid-cell" data-row="${r+1}" data-col="${c+1}"></div>`;
      }
    }
    $('#tableGridSelector .grid-preview').html(gridHtml);
    
    // Grid hover effects
    $(document).on('mouseenter', '.grid-cell', function() {
      const row = $(this).data('row');
      const col = $(this).data('col');
      
      $('.grid-cell').removeClass('active');
      for (let r = 1; r <= row; r++) {
        for (let c = 1; c <= col; c++) {
          $(`.grid-cell[data-row="${r}"][data-col="${c}"]`).addClass('active');
        }
      }
      $('#gridInfo').text(`${row} x ${col}`);
    });
    
    // Grid click to create table
    $(document).on('click', '.grid-cell', function() {
      const rows = $(this).data('row');
      const cols = $(this).data('col');
      createTable(editorInstance, rows, cols, 'simple');
      $('#ranjitTableModal').hide();
    });
    
    // Custom table creation
    $(document).on('click', '#createCustomTable', function() {
      const rows = parseInt($('#customRows').val());
      const cols = parseInt($('#customCols').val());
      if (rows > 0 && cols > 0) {
        const options = {
          responsive: $('#tableResponsive').is(':checked'),
          hover: $('#tableHover').is(':checked'),
          sortable: $('#tableSortable').is(':checked'),
          colorTheme: $('#tableColorTheme').val(),
          width: $('#tableWidth').val()
        };
        createAdvancedTable(editorInstance, rows, cols, 'simple', options);
        $('#ranjitTableModal').hide();
      }
    });
    
    // Template buttons
    $(document).on('click', '.template-btn', function() {
      const template = $(this).data('template');
      const rows = parseInt($('#customRows').val()) || 3;
      const cols = parseInt($('#customCols').val()) || 3;
      
      const options = {
        responsive: $('#tableResponsive').is(':checked'),
        hover: $('#tableHover').is(':checked'),
        sortable: $('#tableSortable').is(':checked'),
        colorTheme: $('#tableColorTheme').val(),
        width: $('#tableWidth').val()
      };
      
      createAdvancedTable(editorInstance, rows, cols, template, options);
      $('#ranjitTableModal').hide();
    });
  }
  
  // Create advanced table with modern features
  function createAdvancedTable(editorInstance, rows, cols, template, options = {}) {
    const colorThemes = {
      blue: { primary: '#667eea', secondary: '#764ba2', light: '#f0f4ff' },
      green: { primary: '#28a745', secondary: '#20c997', light: '#f0fff4' },
      purple: { primary: '#6f42c1', secondary: '#e83e8c', light: '#f8f0ff' },
      red: { primary: '#dc3545', secondary: '#fd7e14', light: '#fff5f5' },
      orange: { primary: '#fd7e14', secondary: '#ffc107', light: '#fff8f0' }
    };
    
    const theme = colorThemes[options.colorTheme] || colorThemes.blue;
    const tableId = 'table-' + Math.random().toString(36).substr(2, 9);
    
    let tableClasses = 'ranjit-table';
    if (options.responsive) tableClasses += ' responsive-table';
    if (options.hover) tableClasses += ' hover-table';
    if (options.sortable) tableClasses += ' sortable-table';
    
    let tableStyle = `border-collapse: collapse; width: ${options.width === 'auto' ? 'auto' : options.width + '%'}; margin: 20px 0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);`;
    
    let table = `<table id="${tableId}" class="${tableClasses}" style="${tableStyle}">`;
    
    // Add thead for header templates
    if (template === 'header' || template === 'modern' || options.sortable) {
      table += '<thead>';
    } else {
      table += '<tbody>';
    }
    
    const hasHeader = (template === 'header' || template === 'modern' || options.sortable);
    
    for (let r = 0; r < rows; r++) {
      table += '<tr>';
      
      for (let c = 0; c < cols; c++) {
        let cellStyle = 'padding: 15px 12px; border: 1px solid #e1e8ed; text-align: left; transition: all 0.3s ease;';
        let cellContent = '&nbsp;';
        
        // Header row styling
        if (hasHeader && r === 0) {
          cellStyle += ` background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary}); color: white; font-weight: 600; font-size: 14px;`;
          if (options.sortable) {
            cellContent = `<span class="sortable-header">Header ${c + 1} <i class="fas fa-sort"></i></span>`;
          } else {
            cellContent = `Header ${c + 1}`;
          }
          table += `<th style="${cellStyle}">${cellContent}</th>`;
        } else {
          // Body cell styling based on template
          const bodyRowIndex = hasHeader ? r - 1 : r; // Adjust for header row
          
          switch(template) {
            case 'striped':
              if (bodyRowIndex % 2 === 1) cellStyle += ` background: ${theme.light};`;
              break;
            case 'bordered':
              cellStyle += ` border: 2px solid ${theme.primary};`;
              break;
            case 'modern':
              cellStyle += ` background: #fafbfc;`;
              if (bodyRowIndex % 2 === 0) cellStyle += ` background: ${theme.light};`;
              break;
            case 'minimal':
              cellStyle += ' border: none; border-bottom: 1px solid #e1e8ed;';
              break;
          }
          
          if (options.hover) {
            cellStyle += ` cursor: pointer;`;
          }
          
          table += `<td style="${cellStyle}">${cellContent}</td>`;
        }
      }
      
      table += '</tr>';
      
      // Close thead and start tbody after header row
      if (hasHeader && r === 0) {
        table += '</thead><tbody>';
      }
    }
    
    table += '</tbody></table>';
    
    // Add responsive wrapper if needed
    if (options.responsive) {
      table = `<div class="table-responsive" style="overflow-x: auto; margin: 20px 0;">${table}</div>`;
    }
    
    table += '<p><br></p>';
    
    editorInstance.exec('insertHTML', table);
    
    // Add sortable functionality if enabled
    if (options.sortable) {
      setTimeout(() => {
        addTableSortability(tableId);
      }, 100);
    }
  }
  
  // Add table sorting functionality
  function addTableSortability(tableId) {
    $(document).on('click', `#${tableId} .sortable-header`, function() {
      const $table = $(this).closest('table');
      const columnIndex = $(this).closest('th').index();
      const $tbody = $table.find('tbody');
      const rows = $tbody.find('tr').toArray();
      
      // Toggle sort direction
      const isAsc = $(this).hasClass('sort-asc');
      $table.find('.sortable-header').removeClass('sort-asc sort-desc');
      $table.find('.sortable-header i').removeClass('fa-sort-up fa-sort-down').addClass('fa-sort');
      
      if (isAsc) {
        $(this).addClass('sort-desc');
        $(this).find('i').removeClass('fa-sort').addClass('fa-sort-down');
      } else {
        $(this).addClass('sort-asc');
        $(this).find('i').removeClass('fa-sort').addClass('fa-sort-up');
      }
      
      // Sort rows
      rows.sort((a, b) => {
        const aText = $(a).find('td').eq(columnIndex).text().trim();
        const bText = $(b).find('td').eq(columnIndex).text().trim();
        
        if (isAsc) {
          return bText.localeCompare(aText);
        } else {
          return aText.localeCompare(bText);
        }
      });
      
      // Reorder rows
      $tbody.empty().append(rows);
    });
  }
  
  // Legacy function for backward compatibility
  function createTable(editorInstance, rows, cols, template) {
    createAdvancedTable(editorInstance, rows, cols, template, {
      responsive: true,
      hover: false,
      sortable: false,
      colorTheme: 'blue',
      width: '100'
    });
  }

  // Shared event handlers
  $(function () {
    // Ensure required elements exist
    ensureRequiredElements();
    // Legacy image upload (fallback)
    $("#ranjitImageUpload").on("change", function () {
      if (this.files && this.files[0] && activeEditorInstance) {
        const file = this.files[0];
        if (file.size > 2 * 1024 * 1024) {
          alert('Image size should be less than 2MB');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const imgHtml = `<img src="${e.target.result}" alt="Image" style="width: 50%; height: auto; margin: 10px 0;" class="editor-image">`;
          activeEditorInstance.exec('insertHTML', imgHtml);
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
    
    // Table grid reset on mouse leave
    $(document).on('mouseleave', '.table-grid-selector', function() {
      $('.grid-cell').removeClass('active');
      $('#gridInfo').text('Hover to select');
    });
    
    // Video upload area drag and drop
    $(document).on('dragover', '#videoUploadArea', function(e) {
      e.preventDefault();
      $(this).addClass('drag-over');
    }).on('dragleave', '#videoUploadArea', function() {
      $(this).removeClass('drag-over');
    }).on('drop', '#videoUploadArea', function(e) {
      e.preventDefault();
      $(this).removeClass('drag-over');
      const file = e.originalEvent.dataTransfer.files[0];
      if (file && file.type.startsWith('video/')) {
        $('#videoFileInput')[0].files = e.originalEvent.dataTransfer.files;
        $('#videoFileInput').trigger('change');
      }
    });
    
    // Modal events
    $(document)
      .on("click", ".ranjit-modal-overlay, .ranjit-modal-close", function () {
        $(".ranjit-modal-overlay").hide();
      })
      .on("click", ".ranjit-modal-content", (e) => e.stopPropagation())
      .on("click", ".table-builder-modal", (e) => e.stopPropagation())
      .on("click", ".video-builder-modal", (e) => e.stopPropagation());
      
    // Prevent form submission on Enter in editor
    $(document).on('keydown', '.ranjit-editor-content', function(e) {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        $(this).closest('form').submit();
      }
    });
  });
})(jQuery);
