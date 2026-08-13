// Purge inconditionnelle nucléaire au chargement du fichier JS
try {
  localStorage.clear();
  sessionStorage.clear();
} catch(e) {}

(function () {
  'use strict';

  // Nettoyage DOM automatique immédiat des cartes de test cassées
  function purgeTestElementsFromDOM() {
    try {
      var allItems = document.querySelectorAll('.gallery-item, .custom-harvest-item');
      allItems.forEach(function (el) {
        var text = el.innerText || '';
        if (text.indexOf('06/08/2026') !== -1 || text.indexOf('PIMENTS (06/08/2026)') !== -1) {
          el.remove();
        }
      });
    } catch(e) {}
  }

  // 1. SCROLL REVEAL ANIMATIONS
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealElements = document.querySelectorAll('.reveal');

  if (prefersReduced || !revealElements.length) {
    revealElements.forEach(function (el) { el.classList.add('is-visible'); });
  } else if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function (el) { observer.observe(el); });
  } else {
    revealElements.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // 2. HEADER STICKY SCROLLED STATE
  var header = document.querySelector('.floating-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // 3. LIGHTBOX MODAL DYNAMIQUE
  function initLightbox() {
    if (!document.getElementById('lightbox-modal')) {
      var modal = document.createElement('div');
      modal.id = 'lightbox-modal';
      modal.className = 'lightbox-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.innerHTML = 
        '<div class="lightbox-content">' +
          '<button class="lightbox-close" aria-label="Fermer la vue grand format">&times;</button>' +
          '<img class="lightbox-image" src="" alt="">' +
          '<div class="lightbox-caption"></div>' +
        '</div>';
      document.body.appendChild(modal);

      var closeBtn = modal.querySelector('.lightbox-close');
      closeBtn.addEventListener('click', closeLightbox);
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeLightbox();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          closeLightbox();
        }
      });
    }

    function openLightbox(src, captionText) {
      var modal = document.getElementById('lightbox-modal');
      var img = modal.querySelector('.lightbox-image');
      var caption = modal.querySelector('.lightbox-caption');
      img.src = src;
      img.alt = captionText || 'Photo La Main de l’Agriculture';
      caption.textContent = captionText || '';
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      var modal = document.getElementById('lightbox-modal');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    document.body.addEventListener('click', function (e) {
      var tile = e.target.closest('.mosaic-tile, .gallery-item');
      if (tile && !e.target.closest('.delete-harvest-btn') && !e.target.closest('#harvest-modal')) {
        var bgImage = tile.style.backgroundImage;
        var imgSrc = '';
        var captionText = '';

        if (bgImage && bgImage !== 'none') {
          imgSrc = bgImage.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
        } else {
          var imgEl = tile.querySelector('img');
          if (imgEl) imgSrc = imgEl.getAttribute('src');
        }

        var labelEl = tile.querySelector('.tile-label, .gallery-caption');
        if (labelEl) {
          captionText = labelEl.innerText.replace('🗑️ Supprimer', '').replace('🔍', '').trim();
        }

        if (imgSrc) {
          e.preventDefault();
          openLightbox(imgSrc, captionText);
        }
      }
    });
  }

  // 4. FILTRES GALERIE (Page Galerie)
  function initGalleryFilters() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var galleryItems = document.querySelectorAll('.gallery-item');

    if (!filterBtns.length || !galleryItems.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');

        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var currentItems = document.querySelectorAll('.gallery-item');
        currentItems.forEach(function (item) {
          var category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(function () {
              if (btn.getAttribute('data-filter') !== filter) return;
              if (filter !== 'all' && category !== filter) {
                item.style.display = 'none';
              }
            }, 300);
          }
        });
      });
    });
  }

  // 5. FORMULAIRE DE CONTACT INTERACTIF & WHATSAPP GENERATOR
  function initContactForm() {
    var form = document.getElementById('visit-request-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('name') ? document.getElementById('name').value : '';
      var phone = document.getElementById('phone') ? document.getElementById('phone').value : '';
      var service = document.getElementById('service-choice') ? document.getElementById('service-choice').value : '';
      var message = document.getElementById('message') ? document.getElementById('message').value : '';

      var text = 'Bonjour La Main de l’Agriculture, je me nomme ' + encodeURIComponent(name) +
        '. Mon numéro : ' + encodeURIComponent(phone) +
        '. Je souhaite des informations concernant : ' + encodeURIComponent(service) +
        '. Message : ' + encodeURIComponent(message);

      var waUrl = 'https://wa.me/221782504301?text=' + text;

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerText = 'Redirection vers WhatsApp...';
        submitBtn.style.background = '#25d366';
      }

      setTimeout(function () {
        window.open(waUrl, '_blank');
      }, 600);
    });
  }

  // 6. GESTIONNAIRE DE NOUVELLES RÉCOLTES
  function initHarvestManager() {
    var STORAGE_KEY = 'lma_custom_harvests';
    var selectedImageDataUrl = '';

    function loadSavedHarvests() {
      var galleryGrid = document.querySelector('.gallery-grid');
      if (!galleryGrid) return;

      var saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      try {
        var harvests = JSON.parse(saved);
        
        var validHarvests = harvests.filter(function (h) {
          if (!h || !h.imageUrl) return false;
          if (h.imageUrl === 'images/piments' || (h.title && h.title.indexOf('06/08/2026') !== -1)) {
            return false;
          }
          return true;
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(validHarvests));

        validHarvests.forEach(function (h, index) {
          var item = document.createElement('div');
          item.className = 'gallery-item reveal-child custom-harvest-item';
          item.setAttribute('data-category', h.category || 'recoltes');
          item.style.position = 'relative';

          var img = document.createElement('img');
          img.src = h.imageUrl;
          img.alt = h.title;

          img.onerror = function () {
            item.remove();
          };

          var topDelBtn = document.createElement('button');
          topDelBtn.className = 'delete-harvest-btn';
          topDelBtn.innerHTML = '🗑️ Supprimer';
          topDelBtn.style.position = 'absolute';
          topDelBtn.style.top = '10px';
          topDelBtn.style.right = '10px';
          topDelBtn.style.background = '#e74c3c';
          topDelBtn.style.color = '#fff';
          topDelBtn.style.border = 'none';
          topDelBtn.style.padding = '6px 12px';
          topDelBtn.style.borderRadius = '20px';
          topDelBtn.style.fontWeight = 'bold';
          topDelBtn.style.fontSize = '0.8rem';
          topDelBtn.style.cursor = 'pointer';
          topDelBtn.style.zIndex = '10';
          topDelBtn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';

          topDelBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            if (confirm('Voulez-vous supprimer cette récolte ?')) {
              var currentHarvests = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
              currentHarvests.splice(index, 1);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(currentHarvests));
              item.remove();
            }
          });

          var caption = document.createElement('div');
          caption.className = 'gallery-caption';
          caption.textContent = h.title + (h.date ? ' (' + h.date + ')' : '');

          item.appendChild(topDelBtn);
          item.appendChild(img);
          item.appendChild(caption);

          galleryGrid.insertBefore(item, galleryGrid.firstChild);
        });
      } catch (err) {
        console.error('Erreur chargement récoltes:', err);
      }
    }

    var modal = document.getElementById('harvest-modal');
    var addBtn = document.getElementById('add-harvest-trigger');
    var closeBtn = document.getElementById('close-harvest-modal');

    if (addBtn && modal) {
      addBtn.addEventListener('click', function (e) {
        e.preventDefault();
        modal.classList.add('active');
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', function () {
        modal.classList.remove('active');
      });
    }

    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) modal.classList.remove('active');
      });

      var form = modal.querySelector('#new-harvest-form');
      if (form) {
        var fileInput = modal.querySelector('#h-file-input');
        var previewContainer = modal.querySelector('#h-img-preview-container');
        var previewImg = modal.querySelector('#h-img-preview');
        var presetSelect = modal.querySelector('#h-preset-select');

        if (fileInput) {
          fileInput.addEventListener('change', function (e) {
            var file = e.target.files[0];
            if (file) {
              var reader = new FileReader();
              reader.onload = function (event) {
                selectedImageDataUrl = event.target.result;
                previewImg.src = selectedImageDataUrl;
                previewContainer.style.display = 'block';
                if (presetSelect) presetSelect.value = '';
              };
              reader.readAsDataURL(file);
            }
          });
        }

        if (presetSelect) {
          presetSelect.addEventListener('change', function () {
            if (presetSelect.value) {
              selectedImageDataUrl = presetSelect.value;
              previewImg.src = selectedImageDataUrl;
              previewContainer.style.display = 'block';
              if (fileInput) fileInput.value = '';
            }
          });
        }

        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var title = document.getElementById('h-title').value;
          var category = document.getElementById('h-category').value;
          var desc = document.getElementById('h-desc').value;

          var finalImg = selectedImageDataUrl || (presetSelect ? presetSelect.value : '') || 'images/piments.jpeg';

          var harvestData = {
            title: title,
            category: category,
            imageUrl: finalImg,
            desc: desc,
            date: new Date().toLocaleDateString('fr-FR')
          };

          var saved = localStorage.getItem(STORAGE_KEY);
          var harvests = saved ? JSON.parse(saved) : [];
          harvests.push(harvestData);

          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(harvests));
          } catch (err) {
            console.warn('LocalStorage plein');
          }

          alert('La nouvelle récolte a été ajoutée avec succès !');
          modal.classList.remove('active');
          location.reload();
        });
      }

      var waBtn = modal.querySelector('#broadcast-wa-btn');
      if (waBtn) {
        waBtn.addEventListener('click', function () {
          var title = document.getElementById('h-title') ? document.getElementById('h-title').value : 'Nouvelle récolte';
          var desc = document.getElementById('h-desc') ? document.getElementById('h-desc').value : 'Disponible dès maintenant à Vélingara !';
          var waText = '📢 *LA MAIN DE L’AGRICULTURE — NOUVELLE RÉCOLTE DISPONIBLE !*\n\n🌾 *Produit* : ' + title + '\n📝 *Info* : ' + desc + '\n📍 *Lieu* : Vélingara\n📞 *Contact* : 78 250 43 01 / 77 12 12 309';

          window.open('https://wa.me/?text=' + encodeURIComponent(waText), '_blank');
        });
      }
    }

    loadSavedHarvests();
    purgeTestElementsFromDOM();
  }

  // Initialisation globale au DOMReady
  document.addEventListener('DOMContentLoaded', function () {
    initLightbox();
    initGalleryFilters();
    initContactForm();
    initHarvestManager();
    purgeTestElementsFromDOM();
  });
})();
