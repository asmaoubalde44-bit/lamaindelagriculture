// La Main de l'Agriculture — Interactive Features & Script

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky / Floating Header Scroll Effect
  const header = document.querySelector('.floating-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // 2. Lightbox Gallery Logic
  const galleryItems = document.querySelectorAll('.gallery-card, .mosaic-tile');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (galleryItems.length > 0 && lightbox) {
    galleryItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const style = item.currentStyle || window.getComputedStyle(item, false);
        const bgUrl = style.backgroundImage.slice(4, -1).replace(/"/g, "");
        const captionText = item.getAttribute('data-caption') || item.querySelector('.tile-label, h3')?.textContent || 'La Main de l’Agriculture';
        
        if (bgUrl && bgUrl !== 'none') {
          lightboxImg.src = bgUrl;
          lightboxCaption.textContent = captionText;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    lightboxClose?.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    });

    lightbox?.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // 3. Gallery Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterCards = document.querySelectorAll('.gallery-card');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');
        filterCards.forEach(card => {
          if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
            setTimeout(() => card.style.opacity = '1', 50);
          } else {
            card.style.opacity = '0';
            setTimeout(() => card.style.display = 'none', 300);
          }
        });
      });
    });
  }

  // 4. Interactive Technical Visit Estimator (Simulateur de Visite)
  const calcSurface = document.getElementById('calc-surface');
  const calcFormule = document.getElementById('calc-formule');
  const calcResult = document.getElementById('calc-result');

  function updateEstimation() {
    if (!calcSurface || !calcResult) return;
    const surface = parseFloat(calcSurface.value) || 1;
    const formule = calcFormule ? calcFormule.value : 'ponctuelle';
    
    let basePrice = formule === 'mensuel' ? 35000 : 15000;
    let multiplier = surface > 2 ? 1 + (surface - 2) * 0.3 : 1;
    let total = Math.round(basePrice * multiplier);

    calcResult.innerHTML = `
      <div class="result-box">
        <span class="result-label">Estimation indicative</span>
        <strong class="result-price">${total.toLocaleString('fr-FR')} FCFA</strong>
        <span class="result-detail">${formule === 'mensuel' ? 'Par mois (Suivi régulier sur le terrain)' : 'Par visite (Diagnostic complet + conseils)'}</span>
        <a href="contact.html?formula=${formule}&surface=${surface}" class="btn btn-primary btn-sm mt-3">Demander cette prestation</a>
      </div>
    `;
  }

  if (calcSurface && calcFormule) {
    calcSurface.addEventListener('input', updateEstimation);
    calcFormule.addEventListener('change', updateEstimation);
    updateEstimation();
  }

  // 5. Formspree Contact Form Notification
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      if (contactForm.getAttribute('action')?.includes('VOTRE_ID_FORMSPREE')) {
        e.preventDefault();
        if (formStatus) {
          formStatus.style.display = 'block';
          formStatus.className = 'form-status success';
          formStatus.innerHTML = '✅ Merci ! Votre message a été simule avec succès. Pour nous joindre directement : 78 250 43 01 / 77 12 12 309.';
          contactForm.reset();
        }
      }
    });
  }
});
