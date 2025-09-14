// Gallery data
const galleryData = [
    {
        src: "attached_assets/a33d88ae-62a0-4480-a8ef-721780aa009b_1757853854190.jpg",
        alt: "Our first date",
        caption: "Our very first date together",
        date: "First Date"
    },
    {
        src: "attached_assets/50c984bc-3189-43de-b9d0-d592c2dd2d1b_1757853872937.jpg",
        alt: "Second date in SM Dasma",
        caption: "Our 2nd date in SM Dasma",
        date: "Second Date"
    },
    {
        src: "attached_assets/43f1f4ef-a1ce-4983-8c7b-f7eea7e4e865_1757853934196.jpg",
        alt: "First movie date",
        caption: "Our first movie date",
        date: "Movie Night"
    },
    {
        src: "attached_assets/597d970f-6724-4caa-9376-30bda339bfa4_1757853969146.jpg",
        alt: "Eating matcha chocolate",
        caption: "Us eating matcha chocolate",
        date: "Sweet Moment"
    },
    {
        src: "attached_assets/e3dd1f2c-bb57-4cbb-aa89-88c09ab2a9c0_1757854010587.jpg",
        alt: "Our favorite edit",
        caption: "My favorite edit of our pictures",
        date: "Special Memory"
    }
];

// Global variables
let currentPhotoIndex = 0;
let isSlideshow = false;
let slideshowInterval = null;

// DOM elements
const themeToggle = document.getElementById('themeToggle');
const navButtons = document.querySelectorAll('.nav-btn');
const scrollButtons = document.querySelectorAll('[data-scroll]');
const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.getElementById('photoModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const modalDate = document.getElementById('modalDate');
const modalCounter = document.getElementById('modalCounter');
const modalClose = document.querySelector('.modal-close');
const modalPrev = document.querySelector('.modal-prev');
const modalNext = document.querySelector('.modal-next');
const slideshowBtn = document.getElementById('slideshowBtn');
const shareMemoryBtn = document.getElementById('shareMemoryBtn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeScrolling();
    initializeGallery();
    initializeModal();
    initializeButtons();
    observeSections();
});

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.innerHTML = '<span class="theme-icon">☀️</span>';
    } else {
        document.body.classList.remove('dark');
        themeToggle.innerHTML = '<span class="theme-icon">🌙</span>';
    }
}

// Navigation
function initializeNavigation() {
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            navigateToSection(section);
        });
    });
}

function navigateToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // Update active nav button
    navButtons.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Smooth scrolling for buttons
function initializeScrolling() {
    scrollButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-scroll');
            navigateToSection(targetId);
        });
    });
}

// Gallery functionality
function initializeGallery() {
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            openModal(index);
        });
    });
}

function openModal(index) {
    currentPhotoIndex = index;
    modal.style.display = 'block';
    updateModalContent();
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    stopSlideshow();
}

function updateModalContent() {
    const photo = galleryData[currentPhotoIndex];
    modalImage.src = photo.src;
    modalImage.alt = photo.alt;
    modalCaption.textContent = photo.caption;
    modalDate.textContent = photo.date;
    modalCounter.textContent = `${currentPhotoIndex + 1} of ${galleryData.length}`;
}

function nextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % galleryData.length;
    updateModalContent();
}

function prevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + galleryData.length) % galleryData.length;
    updateModalContent();
}

function startSlideshow() {
    if (!isSlideshow) {
        isSlideshow = true;
        slideshowBtn.innerHTML = '<span>⏸️</span>Stop Slideshow';
        slideshowInterval = setInterval(nextPhoto, 3000);
        console.log('Slideshow started');
    } else {
        stopSlideshow();
    }
}

function stopSlideshow() {
    if (isSlideshow) {
        isSlideshow = false;
        slideshowBtn.innerHTML = '<span>▶️</span>Start Slideshow';
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
            slideshowInterval = null;
        }
        console.log('Slideshow stopped');
    }
}

// Modal event listeners
function initializeModal() {
    modalClose.addEventListener('click', closeModal);
    modalNext.addEventListener('click', nextPhoto);
    modalPrev.addEventListener('click', prevPhoto);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowLeft':
                    prevPhoto();
                    break;
                case 'ArrowRight':
                    nextPhoto();
                    break;
            }
        }
    });
}

// Button functionality
function initializeButtons() {
    slideshowBtn.addEventListener('click', function() {
        if (modal.style.display === 'block') {
            startSlideshow();
        } else {
            openModal(0);
            setTimeout(startSlideshow, 500);
        }
    });
    
    shareMemoryBtn.addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: 'Our 1st Monthsary',
                text: 'Celebrating our beautiful first month together! ❤️',
                url: window.location.href
            }).then(() => {
                console.log('Thanks for sharing!');
            }).catch(console.error);
        } else {
            // Fallback: copy URL to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Link copied to clipboard! ❤️');
            }).catch(() => {
                alert('Share this beautiful memory: ' + window.location.href);
            });
        }
    });
}

// Section observation for navigation
function observeSections() {
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                updateActiveNavButton(sectionId);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

function updateActiveNavButton(activeSectionId) {
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-section') === activeSectionId) {
            btn.classList.add('active');
        }
    });
}

// Fade in animation on scroll
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in-up');
    
    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        element.style.animationPlayState = 'paused';
        animationObserver.observe(element);
    });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeScrollAnimations);

// Handle window resize
window.addEventListener('resize', function() {
    // Update modal content on resize
    if (modal.style.display === 'block') {
        updateModalContent();
    }
});

// Prevent right-click on images (optional protection)
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// Console welcome message
console.log(`
❤️ Welcome to Our 1st Monthsary Website ❤️
Made with love for a special milestone.
Thank you for visiting our love story!
`);

// Easter egg: Konami code for extra hearts
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        createHeartRain();
        konamiCode = [];
    }
});

function createHeartRain() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.top = '-50px';
            heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
            heart.style.zIndex = '9999';
            heart.style.pointerEvents = 'none';
            heart.style.animation = 'float-hearts 3s ease-out forwards';
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 3000);
        }, i * 100);
    }
    
    console.log('❤️ Extra love activated! ❤️');
}