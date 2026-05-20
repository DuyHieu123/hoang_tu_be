/* ==========================================================================
   SCRIPT.JS - LẬP TRÌNH TƯƠNG TÁC ĐẦY CẢM HỨNG CHO HOÀNG TỬ BÉ
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    /* 1. KHỞI TẠO NỀN TRỜI SAO LẤP LÁNH (STAR GENERATOR) */
    const initStarBackground = () => {
        const starsContainer = document.getElementById("stars-container");
        if (!starsContainer) return;
        
        const starCount = 80;
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement("div");
            star.className = "star-element";
            
            // Tọa độ ngẫu nhiên (%)
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            
            // Kích thước ngẫu nhiên (1px - 3px)
            const size = Math.random() * 2 + 1;
            
            // Thời gian trễ lấp lánh ngẫu nhiên
            const delay = Math.random() * 5;
            const duration = Math.random() * 3 + 2; // 2s - 5s
            
            star.style.top = `${top}%`;
            star.style.left = `${left}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.animationDelay = `${delay}s`;
            star.style.animationDuration = `${duration}s`;
            
            // Đôi khi cho một số sao có màu hồng nhạt thay vì vàng cát
            if (Math.random() > 0.8) {
                star.style.backgroundColor = "var(--color-rose-primary)";
            }
            
            fragment.appendChild(star);
        }
        
        starsContainer.appendChild(fragment);
        
        // Hiệu ứng di chuột tạo cảm giác chiều sâu (Mouse Parallax)
        window.addEventListener("mousemove", (e) => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;
            
            // Di chuyển nhẹ container sao theo hướng ngược lại với chuột
            starsContainer.style.transform = `translate(${mouseX * -20}px, ${mouseY * -20}px)`;
        });
    };
    
    initStarBackground();

    /* 2. VỆT BỤI SAO BAY THEO SAU CON TRỎ CHUỘT (SPARKLE MOUSE TRAIL) */
    const initSparkleTrail = () => {
        const overlay = document.getElementById("sparkle-overlay");
        if (!overlay) return;
        
        let lastSparkleTime = 0;
        const sparkleColors = ["#ecc369", "#e58c8c", "#dfa839", "#fbebeb", "#e07a5f"];
        const symbols = ["✦", "★", "✧", "•"];
        
        window.addEventListener("mousemove", (e) => {
            const now = Date.now();
            // Khống chế tần suất sinh vụn sao để tránh giật lag (mỗi 35ms tối đa)
            if (now - lastSparkleTime < 35) return;
            lastSparkleTime = now;
            
            createSparkle(e.clientX, e.clientY);
        });
        
        function createSparkle(x, y) {
            const sparkle = document.createElement("span");
            sparkle.className = "mouse-sparkle";
            
            // Chọn ngẫu nhiên ký tự sao
            sparkle.innerText = symbols[Math.floor(Math.random() * symbols.length)];
            
            // Chọn màu ngẫu nhiên từ bảng màu
            sparkle.style.color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
            
            // Kích thước ngẫu nhiên
            const fontSize = Math.random() * 10 + 10; // 10px - 20px
            sparkle.style.fontSize = `${fontSize}px`;
            
            // Vị trí xuất phát chính xác tại chuột
            sparkle.style.left = `${x}px`;
            sparkle.style.top = `${y}px`;
            
            // Vector chuyển động ngẫu nhiên nhẹ (X, Y)
            const velocityX = (Math.random() - 0.5) * 50;
            const velocityY = (Math.random() - 0.5) * 50 - 30; // Hơi bay lên trên
            
            sparkle.style.setProperty("--dx", `${velocityX}px`);
            sparkle.style.setProperty("--dy", `${velocityY}px`);
            
            overlay.appendChild(sparkle);
            
            // Di chuyển và làm mờ dần
            let progress = 0;
            const duration = 800; // 0.8s
            const startTime = performance.now();
            
            function animateSparkle(timestamp) {
                const elapsed = timestamp - startTime;
                progress = elapsed / duration;
                
                if (progress < 1) {
                    const currentX = x + velocityX * progress;
                    // Đường bay cong vòm nhẹ xuống giống pháo hoa rụng cát
                    const currentY = y + velocityY * progress + (9.8 * 5 * progress * progress); 
                    const opacity = 1 - progress;
                    const scale = 1 - progress * 0.7;
                    
                    sparkle.style.left = `${currentX}px`;
                    sparkle.style.top = `${currentY}px`;
                    sparkle.style.opacity = opacity;
                    sparkle.style.transform = `translate(-50%, -50%) scale(${scale})`;
                    
                    requestAnimationFrame(animateSparkle);
                } else {
                    sparkle.remove();
                }
            }
            
            requestAnimationFrame(animateSparkle);
        }
    };
    
    initSparkleTrail();

    /* 3. HIỆU ỨNG HIỂN THỊ KHI CUỘN TRANG (SCROLL REVEAL) */
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll(".scroll-reveal");
        
        const observerOptions = {
            root: null,
            rootMargin: "0px 0px -60px 0px", // Kích hoạt sớm hơn một chút khi cuộn đến
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("reveal-active");
                    // Ngừng quan sát sau khi đã hiển thị để tối ưu hiệu năng
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        revealElements.forEach(element => {
            observer.observe(element);
        });
    };
    
    initScrollReveal();

    /* 4. TƯƠNG TÁC BẢN ĐỒ TIỂU HÀNH TINH (ASTEROID JOURNEY) */
    const initAsteroidJourney = () => {
        const buttons = document.querySelectorAll(".asteroid-btn");
        const contents = document.querySelectorAll(".asteroid-content");
        
        if (buttons.length === 0 || contents.length === 0) return;
        
        buttons.forEach(btn => {
            btn.addEventListener("click", () => {
                const target = btn.getAttribute("data-target");
                
                // Đổi trạng thái active của nút bấm
                buttons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                
                // Đổi trạng thái active của khối nội dung
                contents.forEach(content => {
                    content.classList.remove("active");
                    if (content.id === target) {
                        content.classList.add("active");
                    }
                });
                
                // Hiệu ứng nhảy vọt hạt sao lấp lánh tại nút khi nhấn
                for (let i = 0; i < 6; i++) {
                    const rect = btn.getBoundingClientRect();
                    const x = rect.left + rect.width / 2;
                    const y = rect.top + rect.height / 2;
                    
                    // Kích hoạt thủ công vụn sao xung quanh nút
                    const sparkle = document.createElement("span");
                    sparkle.className = "mouse-sparkle";
                    sparkle.innerText = "★";
                    sparkle.style.color = "var(--color-gold-secondary)";
                    sparkle.style.fontSize = "16px";
                    sparkle.style.left = `${x}px`;
                    sparkle.style.top = `${y + window.scrollY}px`; // Phải cộng cuộn dọc
                    
                    document.getElementById("sparkle-overlay").appendChild(sparkle);
                    
                    const velX = (Math.random() - 0.5) * 120;
                    const velY = (Math.random() - 0.5) * 120;
                    
                    let p = 0;
                    const dur = 600;
                    const start = performance.now();
                    
                    function anim(t) {
                        const el = t - start;
                        p = el / dur;
                        if (p < 1) {
                            sparkle.style.left = `${x + velX * p}px`;
                            sparkle.style.top = `${y + window.scrollY + velY * p}px`;
                            sparkle.style.opacity = 1 - p;
                            sparkle.style.transform = `scale(${1 - p})`;
                            requestAnimationFrame(anim);
                        } else {
                            sparkle.remove();
                        }
                    }
                    requestAnimationFrame(anim);
                }
            });
        });
    };
    
    initAsteroidJourney();

    /* 5. KHỐI TRÌNH DIỄN DANH NGÔN TỰ ĐỘNG (QUOTES SLIDER) */
    const initQuotesSlider = () => {
        const slider = document.getElementById("quote-slider");
        if (!slider) return;
        
        const slides = slider.querySelectorAll(".quote-slide");
        const prevBtn = document.getElementById("prev-quote");
        const nextBtn = document.getElementById("next-quote");
        const dotsContainer = document.getElementById("slider-dots");
        
        let currentIndex = 0;
        let slideInterval;
        const intervalTime = 6000; // Tự chuyển sau mỗi 6s
        
        if (slides.length <= 1) return;
        
        // 5.1 Sinh các chấm tròn chỉ mục
        slides.forEach((_, idx) => {
            const dot = document.createElement("div");
            dot.className = `dot ${idx === 0 ? "active" : ""}`;
            dot.addEventListener("click", () => {
                goToSlide(idx);
                resetInterval();
            });
            dotsContainer.appendChild(dot);
        });
        
        const dots = dotsContainer.querySelectorAll(".dot");
        
        // 5.2 Hàm chuyển slide mượt
        const goToSlide = (index) => {
            slides[currentIndex].classList.remove("active");
            dots[currentIndex].classList.remove("active");
            
            currentIndex = (index + slides.length) % slides.length;
            
            slides[currentIndex].classList.add("active");
            dots[currentIndex].classList.add("active");
        };
        
        // 5.3 Lắng nghe nút tới/lui
        nextBtn.addEventListener("click", () => {
            goToSlide(currentIndex + 1);
            resetInterval();
        });
        
        prevBtn.addEventListener("click", () => {
            goToSlide(currentIndex - 1);
            resetInterval();
        });
        
        // 5.4 Quản lý vòng lặp thời gian
        const startInterval = () => {
            slideInterval = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, intervalTime);
        };
        
        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        };
        
        startInterval();
        
        // Dừng cuộn tự động khi rê chuột vào khối slider
        const sliderWrapper = document.querySelector(".quotes-slider-wrapper");
        sliderWrapper.addEventListener("mouseenter", () => clearInterval(slideInterval));
        sliderWrapper.addEventListener("mouseleave", startInterval);
    };
    
    initQuotesSlider();

    /* 6. THƯ VIỆN ẢNH PHÓNG TO CHUYÊN NGHIỆP (LIGHTBOX GALLERY) */
    const initLightboxGallery = () => {
        const galleryItems = document.querySelectorAll(".gallery-item");
        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightbox-img");
        const lightboxCaption = document.getElementById("lightbox-caption");
        const closeBtn = document.getElementById("lightbox-close");
        const prevBtn = document.getElementById("lightbox-prev");
        const nextBtn = document.getElementById("lightbox-next");
        
        if (galleryItems.length === 0 || !lightbox) return;
        
        let activeIndex = 0;
        const imagesList = [];
        
        // Thu thập toàn bộ dữ liệu ảnh từ Grid
        galleryItems.forEach((item, idx) => {
            const imgPath = item.getAttribute("data-image");
            const caption = item.querySelector(".gallery-img").getAttribute("alt");
            imagesList.push({ src: imgPath, alt: caption });
            
            item.addEventListener("click", () => {
                activeIndex = idx;
                openLightbox();
            });
        });
        
        const openLightbox = () => {
            updateLightboxContent();
            lightbox.classList.add("active");
            document.body.style.overflow = "hidden"; // Khóa cuộn trang chính
        };
        
        const closeLightbox = () => {
            lightbox.classList.remove("active");
            document.body.style.overflow = ""; // Mở lại cuộn trang chính
        };
        
        const updateLightboxContent = () => {
            const data = imagesList[activeIndex];
            // Thêm hiệu ứng fade chuyển tiếp mượt cho ảnh phóng to
            lightboxImg.style.opacity = 0;
            setTimeout(() => {
                lightboxImg.src = data.src;
                lightboxImg.alt = data.alt;
                lightboxCaption.innerText = data.alt;
                lightboxImg.style.opacity = 1;
            }, 150);
        };
        
        // Điều hướng tới/lui trong lightbox
        const navigate = (direction) => {
            activeIndex = (activeIndex + direction + imagesList.length) % imagesList.length;
            updateLightboxContent();
        };
        
        nextBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            navigate(1);
        });
        
        prevBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            navigate(-1);
        });
        
        closeBtn.addEventListener("click", closeLightbox);
        
        // Đóng khi click ra vùng nền trống bên ngoài ảnh
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox || e.target === lightbox.querySelector(".lightbox-content-box")) {
                closeLightbox();
            }
        });
        
        // Hỗ trợ phím tắt bàn phím
        window.addEventListener("keydown", (e) => {
            if (!lightbox.classList.contains("active")) return;
            
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") navigate(1);
            if (e.key === "ArrowLeft") navigate(-1);
        });
    };
    
    initLightboxGallery();

    /* 7. HIỆU ỨNG THANH NAV KHI CUỘN & HAMBURGER MENU DI ĐỘNG */
    const initNavigation = () => {
        const header = document.querySelector(".glass-nav");
        const menuBtn = document.getElementById("menu-btn");
        const navMenu = document.getElementById("nav-menu");
        
        // 7.1 Đổi màu nav khi cuộn qua 50px
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        });
        
        // 7.2 Đóng/mở hamburger menu
        if (menuBtn && navMenu) {
            menuBtn.addEventListener("click", () => {
                navMenu.classList.toggle("active");
                
                // Thay đổi icon menu từ Bars sang X và ngược lại
                const icon = menuBtn.querySelector("i");
                if (navMenu.classList.contains("active")) {
                    icon.className = "fa-solid fa-xmark";
                } else {
                    icon.className = "fa-solid fa-bars";
                }
            });
            
            // Tự động đóng menu khi bấm vào bất kỳ mục liên kết nào
            const navLinks = navMenu.querySelectorAll(".nav-item");
            navLinks.forEach(link => {
                link.addEventListener("click", () => {
                    navMenu.classList.remove("active");
                    menuBtn.querySelector("i").className = "fa-solid fa-bars";
                });
            });
        }
    };
    
    initNavigation();

});
