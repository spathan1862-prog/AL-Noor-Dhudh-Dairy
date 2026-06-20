document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Header Scroll Effect ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 2. Mobile Menu Toggle ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.replace('fa-bars-staggered', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars-staggered');
            }
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.replace('fa-xmark', 'fa-bars-staggered');
            });
        });
    }

    // --- 3. Scroll Active Link Highlight ---
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // offset for sticky header
            const sectionId = current.getAttribute('id');
            const activeNavLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            
            if (activeNavLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    activeNavLink.classList.add('active');
                } else {
                    activeNavLink.classList.remove('active');
                }
            }
        });
    });

    // --- 4. Product Dynamic Price Update ---
    const sizeSelects = document.querySelectorAll('.size-select');
    sizeSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            const price = selectedOption.getAttribute('data-price');
            const productId = e.target.id.replace('size-', 'price-');
            const priceDisplay = document.getElementById(productId);
            if (priceDisplay) {
                priceDisplay.textContent = price;
            }
        });
    });

    // --- 5. WhatsApp Integration & Widget Logic ---
    const whatsappTrigger = document.getElementById('whatsapp-trigger');
    const whatsappWidget = document.getElementById('whatsapp-widget');
    const widgetClose = document.getElementById('widget-close');
    const whatsappSendBtn = document.getElementById('whatsapp-send-btn');
    const whatsappUserMessage = document.getElementById('whatsapp-user-message');
    const whatsappTooltip = document.getElementById('whatsapp-tooltip');
    
    // Set current time in chat bubble
    const msgTime = document.getElementById('msg-time');
    if (msgTime) {
        const now = new Date();
        msgTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const whatsappNumber = "923001234567"; // Customize with real number if needed

    // Toggle widget
    const toggleWidget = () => {
        whatsappWidget.classList.toggle('open');
        if (whatsappWidget.classList.contains('open')) {
            whatsappWidget.style.display = 'flex';
            whatsappTooltip.style.opacity = '0'; // Hide tooltip when open
            whatsappUserMessage.focus();
        } else {
            setTimeout(() => {
                if (!whatsappWidget.classList.contains('open')) {
                    whatsappWidget.style.display = 'none';
                }
            }, 300);
        }
    };

    if (whatsappTrigger) {
        whatsappTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleWidget();
        });
    }

    if (widgetClose) {
        widgetClose.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleWidget();
        });
    }

    // Close widget when clicking outside
    document.addEventListener('click', (e) => {
        if (whatsappWidget && whatsappWidget.classList.contains('open')) {
            if (!whatsappWidget.contains(e.target) && e.target !== whatsappTrigger && !whatsappTrigger.contains(e.target)) {
                toggleWidget();
            }
        }
    });

    // Send WhatsApp message from widget input
    const sendWidgetMessage = () => {
        const messageText = whatsappUserMessage.value.trim();
        if (messageText !== "") {
            const formattedMsg = encodeURIComponent(messageText);
            const waUrl = `https://wa.me/${whatsappNumber}?text=${formattedMsg}`;
            window.open(waUrl, '_blank');
            whatsappUserMessage.value = "";
            toggleWidget();
        }
    };

    if (whatsappSendBtn) {
        whatsappSendBtn.addEventListener('click', sendWidgetMessage);
    }

    if (whatsappUserMessage) {
        whatsappUserMessage.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendWidgetMessage();
            }
        });
    }

    // Product Order Button to WhatsApp Redirect
    const orderBtns = document.querySelectorAll('.btn-whatsapp-order');
    orderBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productName = btn.getAttribute('data-product');
            const selectId = btn.getAttribute('data-select-id');
            const selectEl = document.getElementById(selectId);
            const selectedSize = selectEl ? selectEl.value : "";
            
            const message = `Assalam-o-Alaikum! I would like to order: \n*Product:* ${productName}\n*Size/Qty:* ${selectedSize}\n\nPlease confirm the availability and delivery details. JazakAllah!`;
            const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.open(waUrl, '_blank');
        });
    });

    // --- 6. Leaflet Map Initialization ---
    // Location Coordinates: 33.6518, 72.9734 (near farm-rich suburbs of Islamabad)
    const mapElement = document.getElementById('map');
    if (mapElement) {
        try {
            const farmLocation = [33.6518, 72.9734];
            const map = L.map('map', {
                scrollWheelZoom: false
            }).setView(farmLocation, 14);

            // Add clean openstreetmap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Custom green cow icon for Al-Noor
            const dairyIcon = L.divIcon({
                html: '<div style="background-color: #2d6a4f; color: #d4af37; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"><i class="fa-solid fa-cow" style="font-size: 1.2rem;"></i></div>',
                className: 'custom-map-icon',
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });

            // Add marker with descriptive popup
            L.marker(farmLocation, { icon: dairyIcon })
                .addTo(map)
                .bindPopup(`
                    <div style="font-family: 'Outfit', sans-serif; padding: 6px;">
                        <h4 style="margin: 0 0 4px 0; color: #1b4332; font-size: 1rem; font-family: 'Playfair Display', serif;">AL-Noor Dairy</h4>
                        <p style="margin: 0; font-size: 0.85rem; color: #6c7a72;">Fresh milk, organic ghee, & farm visits!</p>
                    </div>
                `)
                .openPopup();
        } catch (error) {
            console.error("Map initialization failed: ", error);
        }
    }

    // --- 7. Quick Contact Form ---
    const contactForm = document.getElementById('quick-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('c-name').value;
            const subject = document.getElementById('c-subject').value;
            const message = document.getElementById('c-message').value;
            
            // Generate a beautiful WhatsApp text from contact form
            const emailMsg = `Assalam-o-Alaikum! My name is ${name}. \n*Subject:* ${subject}\n*Message:* ${message}`;
            const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(emailMsg)}`;
            
            alert(`Thank you, ${name}! Redirecting you to WhatsApp to send this message.`);
            window.open(waUrl, '_blank');
            contactForm.reset();
        });
    }
});
