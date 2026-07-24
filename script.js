// ════════════════════════════════════════════════════════════════
// TTGuys - Main JavaScript Functions
// ════════════════════════════════════════════════════════════════

// GALLERY FUNCTIONS
// ════════════════════════════════════════════════════════════════
function renderGallery(filter = 'all') {
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = '';
  
  GALLERY.filter(item => filter === 'all' || item.category === filter).forEach(item => {
    const div = document.createElement('div');
    div.className = 'masonry-item group cursor-pointer';
    div.innerHTML = `
      <div class="relative overflow-hidden rounded-xl">
        <img 
          src="${item.src}" 
          alt="${item.label}" 
          loading="lazy"
          class="w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onerror="this.src='https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&h=600&fit=crop'" 
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <span class="text-white text-sm font-semibold">${item.label}</span>
        </div>
      </div>
    `;
    div.addEventListener('click', () => openLightbox(item.src));
    grid.appendChild(div);
  });
}

// Initialize gallery on load
document.addEventListener('DOMContentLoaded', () => {
  renderGallery('all');
  renderQuotes();
  renderMembers();
  renderTimeline();
  setupFilterButtons();
  observeAll();
});

// Setup filter button events
function setupFilterButtons() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active');
        b.classList.add('text-slate-400');
      });
      btn.classList.add('active');
      btn.classList.remove('text-slate-400');
      renderGallery(btn.dataset.filter);
    });
  });
}

// ════════════════════════════════════════════════════════════════
// LIGHTBOX FUNCTIONS
// ════════════════════════════════════════════════════════════════
function openLightbox(src) {
  const img = document.getElementById('lightbox-img');
  img.src = src;
  const lb = document.getElementById('lightbox');
  lb.classList.remove('hidden');
  lb.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.add('hidden');
  lb.classList.remove('flex');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

if (document.getElementById('lightbox')) {
  document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
  });
}

// ════════════════════════════════════════════════════════════════
// QUOTES CAROUSEL
// ════════════════════════════════════════════════════════════════
let currentQuoteIndex = 0;

function renderQuotes() {
  if (QUOTES.length === 0) return;
  
  const container = document.getElementById('quote-container');
  const dots = document.getElementById('quote-dots');
  
  if (!container || !dots) return;
  
  container.innerHTML = '';
  dots.innerHTML = '';
  
  QUOTES.forEach((quote, index) => {
    const slide = document.createElement('div');
    slide.className = `quote-slide ${index === 0 ? 'active' : ''}`;
    slide.innerHTML = `
      <p class="text-lg sm:text-xl text-slate-300 mb-6 leading-relaxed">"${quote.text}"</p>
      <p class="text-right text-cyan-400 font-semibold">${quote.author}</p>
    `;
    container.appendChild(slide);
    
    const dot = document.createElement('button');
    dot.className = `w-2.5 h-2.5 rounded-full transition-all ${index === 0 ? 'bg-cyan-400 w-8' : 'bg-slate-600'}`;
    dot.addEventListener('click', () => goToQuote(index));
    dots.appendChild(dot);
  });
}

function nextQuote() {
  currentQuoteIndex = (currentQuoteIndex + 1) % QUOTES.length;
  updateQuote();
}

function prevQuote() {
  currentQuoteIndex = (currentQuoteIndex - 1 + QUOTES.length) % QUOTES.length;
  updateQuote();
}

function goToQuote(index) {
  currentQuoteIndex = index;
  updateQuote();
}

function updateQuote() {
  document.querySelectorAll('.quote-slide').forEach((slide, index) => {
    slide.classList.toggle('active', index === currentQuoteIndex);
  });
  
  document.querySelectorAll('#quote-dots button').forEach((dot, index) => {
    dot.classList.toggle('bg-cyan-400', index === currentQuoteIndex);
    dot.classList.toggle('w-8', index === currentQuoteIndex);
    dot.classList.toggle('bg-slate-600', index !== currentQuoteIndex);
  });
}

// ════════════════════════════════════════════════════════════════
// MEMBERS SECTION
// ════════════════════════════════════════════════════════════════
function renderMembers() {
  const container = document.getElementById('members-grid');
  if (!container) return;
  
  container.innerHTML = '';
  
  MEMBERS.forEach(member => {
    const card = document.createElement('div');
    card.className = 'member-card card-hover fade-up';
    card.innerHTML = `
      <img src="${member.image}" alt="${member.name}" onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop'" />
      <h3 class="text-xl font-bold">${member.name}</h3>
      <p class="role">${member.role}</p>
      <p>${member.bio}</p>
    `;
    container.appendChild(card);
  });
}

// ════════════════════════════════════════════════════════════════
// TIMELINE SECTION
// ════════════════════════════════════════════════════════════════
function renderTimeline() {
  const container = document.getElementById('timeline-container');
  if (!container) return;
  
  container.innerHTML = '<div class="timeline-line">';
  
  TIMELINE.forEach((event, index) => {
    const item = document.createElement('div');
    item.className = 'timeline-item fade-up';
    item.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <h3 class="text-2xl font-bold gradient-text">${event.year}</h3>
        <h4 class="text-lg font-semibold mt-2">${event.title}</h4>
        <p class="text-slate-400 mt-2">${event.description}</p>
      </div>
    `;
    container.appendChild(item);
  });
  
  container.innerHTML += '</div>';
}

// ════════════════════════════════════════════════════════════════
// SCROLL ANIMATIONS (Fade-up on scroll)
// ════════════════════════════════════════════════════════════════
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.08 });

function observeAll() {
  document.querySelectorAll('.fade-up:not([data-obs])').forEach(el => {
    el.dataset.obs = '1';
    io.observe(el);
  });
}

// Re-observe new elements added dynamically
new MutationObserver(observeAll).observe(document.body, { 
  childList: true, 
  subtree: true 
});

// ════════════════════════════════════════════════════════════════
// SMOOTH SCROLL
// ════════════════════════════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
