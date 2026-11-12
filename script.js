/* ----------------------------------------------------
   KERALA & TAMIL NADU TOURS - JavaScript Logic (script.js)
   ---------------------------------------------------- */

// Default WhatsApp Number for Inquiries
const WHATSAPP_NUMBER = "917907227256"; 

document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. Navbar Scroll Effect ---
  const navbar = document.getElementById('navbar');
  if (navbar && !navbar.classList.contains('page-header')) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // --- 2. Mobile Drawer Navigation ---
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');

  if (mobileToggle && mobileDrawer && drawerClose) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('active');
    });

    drawerClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('active');
    });
  }

  // --- 3. Hero Search Filter (1 to 20 Guests & Kerala / Tamil Nadu) ---
  const heroSearchForm = document.getElementById('heroSearchForm');
  const zoneSelect = document.getElementById('zoneSelect');
  const guestsSelect = document.getElementById('guestsSelect');

  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const state = zoneSelect ? zoneSelect.value : 'all';
      const guests = guestsSelect ? guestsSelect.value : '1-20 Guests';

      let targetUrl = 'tour.html';
      if (state !== 'all') {
        targetUrl += `?state=${state}`;
      }
      showToast(`Searching ${state === 'all' ? 'Kerala & Tamil Nadu' : state.toUpperCase()} for ${guests}...`);
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 800);
    });
  }

  // --- 4. Destination & Tour State Filter Tabs ---
  const filterTabs = document.querySelectorAll('.filter-tab');
  const filterableItems = document.querySelectorAll('[data-state]');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const selectedState = tab.getAttribute('data-filter');

      filterableItems.forEach(item => {
        const itemState = item.getAttribute('data-state');
        if (selectedState === 'all' || itemState === selectedState || itemState === 'both') {
          item.style.display = 'block';
          if (item.classList.contains('package-card')) {
            item.style.display = 'flex';
          }
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Check URL Parameters on load (e.g. tour.html?state=kerala)
  const urlParams = new URLSearchParams(window.location.search);
  const stateParam = urlParams.get('state');
  if (stateParam) {
    const matchingTab = document.querySelector(`.filter-tab[data-filter="${stateParam}"]`);
    if (matchingTab) {
      matchingTab.click();
    }
  }

  // --- 5. Customer Reviews System (No Person Images) ---
  const initialReviews = [
    {
      name: 'Ananya Nair',
      role: 'Kochi, Kerala',
      stars: 5,
      quote: 'Exploring Munnar tea hills and Alleppey backwater houseboats was a dream come true! The team arranged a comfortable AC vehicle for our group of 8 guests and high-quality stays.'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Chennai, Tamil Nadu',
      stars: 5,
      quote: 'Flawless arrangement for our family trip of 14 people across Ooty and Kodaikanal. The custom itinerary flexibility allowed us to adjust sightseeing as needed. Highly recommended!'
    },
    {
      name: 'Priya Sharma',
      role: 'Bangalore, Karnataka',
      stars: 5,
      quote: 'The spiritual and heritage tour to Madurai Meenakshi Temple, Rameswaram, and Kanyakumari was spiritually uplifting. Courteous drivers and 24/7 travel support!'
    },
    {
      name: 'David Wilson',
      role: 'International Traveler',
      stars: 5,
      quote: 'Exceptional tour covering both Kerala and Tamil Nadu! From tea gardens to ancient shore temples in Mahabalipuram, everything was top-notch and stress-free.'
    },
    {
      name: 'Siddharth Rao',
      role: 'Hyderabad, Telangana',
      stars: 5,
      quote: 'Awesome Wayanad wildlife jeep adventure and Varkala beach trip! Transparent communication via WhatsApp and custom re-planning whenever we requested changes.'
    }
  ];

  // Load reviews from localStorage or initialReviews
  let reviews = JSON.parse(localStorage.getItem('kt_customer_reviews')) || initialReviews;
  let currentReviewIndex = 0;

  const testiName = document.getElementById('testiName');
  const testiRole = document.getElementById('testiRole');
  const testiQuote = document.getElementById('testiQuote');
  const testiStars = document.getElementById('testiStars');
  const prevTestiBtn = document.getElementById('prevTestiBtn');
  const nextTestiBtn = document.getElementById('nextTestiBtn');

  function renderReview(index) {
    if (!reviews || reviews.length === 0) return;
    const item = reviews[index];
    if (testiName) testiName.textContent = item.name;
    if (testiRole) testiRole.textContent = item.role;
    if (testiQuote) testiQuote.textContent = item.quote;
    if (testiStars) {
      let starsHtml = '';
      for (let i = 0; i < item.stars; i++) {
        starsHtml += '<i class="fa-solid fa-star"></i> ';
      }
      testiStars.innerHTML = starsHtml;
    }
  }

  if (prevTestiBtn && nextTestiBtn) {
    renderReview(0);

    prevTestiBtn.addEventListener('click', () => {
      currentReviewIndex = (currentReviewIndex - 1 + reviews.length) % reviews.length;
      renderReview(currentReviewIndex);
    });

    nextTestiBtn.addEventListener('click', () => {
      currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
      renderReview(currentReviewIndex);
    });
  }

  // Submit New Review Typing Form
  const addReviewForm = document.getElementById('addReviewForm');
  if (addReviewForm) {
    addReviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('revName').value.trim();
      const location = document.getElementById('revLocation').value.trim();
      const rating = parseInt(document.getElementById('revRating').value);
      const text = document.getElementById('revText').value.trim();

      if (name && text) {
        const newReview = {
          name: name,
          role: location || 'Happy Traveler',
          stars: rating || 5,
          quote: text
        };

        reviews.unshift(newReview);
        localStorage.setItem('kt_customer_reviews', JSON.stringify(reviews));
        currentReviewIndex = 0;
        renderReview(0);
        showToast('🌟 Thank you! Your review has been published.');
        addReviewForm.reset();
      }
    });
  }

  // --- 6. WhatsApp Package Inquiry Trigger (No Days Mentioned) ---
  window.inquireWhatsAppPackage = function(packageTitle, location) {
    const text = `Hello! I am interested in inquiring about the *${packageTitle}* (Location: ${location}). Please provide package itinerary details and availability for 1-20 guests.`;
    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
    window.open(url, '_blank');
  };

  // --- 7. Contact Page WhatsApp Form Submission ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cName').value;
      const phone = document.getElementById('cPhone').value;
      const email = document.getElementById('cEmail').value;
      const guests = document.getElementById('cGuests').value;
      const destination = document.getElementById('cDest').value;
      const msg = document.getElementById('cMsg').value;

      const whatsappMsg = `*New Travel Enquiry*%0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Email:* ${email}%0A*Guests:* ${guests} Person(s)%0A*Destination:* ${destination}%0A*Message:* ${msg}`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`;
      
      showToast('Redirecting to WhatsApp to send your enquiry...');
      setTimeout(() => {
        window.open(url, '_blank');
      }, 800);
    });
  }

  // --- 8. Toast Notification Utility ---
  window.showToast = function(message) {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toastContainer';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#10B981;"></i> <span>${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3500);
  };
});


  // --- Custom Select Dropdown UI ---
  const customSelects = document.querySelectorAll('.custom-select-wrapper');
  customSelects.forEach(wrapper => {
    const trigger = wrapper.querySelector('.custom-select-trigger');
    const optionsContainer = wrapper.querySelector('.custom-select-options');
    const options = wrapper.querySelectorAll('.custom-select-option');
    const hiddenSelect = wrapper.parentElement.querySelector('select');

    if(trigger && optionsContainer) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.custom-select-options').forEach(el => {
          if (el !== optionsContainer) el.classList.remove('open');
        });
        optionsContainer.classList.toggle('open');
      });

      options.forEach(option => {
        option.addEventListener('click', () => {
          trigger.textContent = option.textContent;
          if (hiddenSelect) {
            hiddenSelect.value = option.getAttribute('data-value');
          }
          optionsContainer.classList.remove('open');
        });
      });
    }
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select-options').forEach(el => el.classList.remove('open'));
  });

  // --- Destination Modal ---
  const destinationCards = document.querySelectorAll('.destination-card');
  const destinationModal = document.getElementById('destinationModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalPlacesList = document.getElementById('modalPlacesList');

  if (destinationModal && modalCloseBtn) {
    destinationCards.forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const nameElem = card.querySelector('.destination-name');
        const descElem = card.querySelector('.destination-desc-text');
        if (nameElem && descElem) {
          modalTitle.textContent = nameElem.textContent;
          const places = descElem.textContent.split(',').map(p => p.trim());
          modalPlacesList.innerHTML = '';
          places.forEach(place => {
            const li = document.createElement('li');
            li.textContent = place;
            modalPlacesList.appendChild(li);
          });
          destinationModal.classList.add('open');
        }
      });
    });

    modalCloseBtn.addEventListener('click', () => {
      destinationModal.classList.remove('open');
    });

    destinationModal.addEventListener('click', (e) => {
      if (e.target === destinationModal) {
        destinationModal.classList.remove('open');
      }
    });
  }

