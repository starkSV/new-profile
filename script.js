// Add interactive JS features if needed in the future.
console.log("Portfolio loaded successfully!");

// Initialize EmailJS
emailjs.init("h9ZA1tIrtzGXLl1lK"); // Replace with your EmailJS Public Key

// Back to Top Button Functionality
document.addEventListener("DOMContentLoaded", () => {
    const backToTopButton = document.getElementById("back-to-top");

    if (backToTopButton) {
        window.addEventListener("scroll", () => {
            backToTopButton.style.display = window.scrollY > 300 ? "block" : "none";
        });

        backToTopButton.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        });
    } else {
        console.error("Back to Top button not found in the DOM!");
    }
});

// Initialize AOS (Animation on Scroll)
document.addEventListener("DOMContentLoaded", () => {
    AOS.init({
        duration: 1000,
        once: true,
    });
});

// Smooth Navigation Scrolling
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").slice(1);
        const targetSection = document.getElementById(targetId);
        targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    });
});

// Fetch and Display Blogs with Latest Posts
document.addEventListener("DOMContentLoaded", () => {
    const blogsContainer = document.querySelector(".blogs-container");

    fetch("blogs.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(blog => {
                const blogCard = document.createElement("div");
                blogCard.classList.add("blog-card");

                // Basic blog details
                blogCard.innerHTML = `
                    <img src="${blog.image}" alt="${blog.title} Logo" class="blog-logo">
                    <h3>${blog.title}</h3>
                    <p>${blog.description}</p>
                    <div class="latest-posts">
                        <h4>Latest Posts</h4>
                        <ol id="${blog.title.toLowerCase()}-posts"></ol>
                    </div>
                    <a href="${blog.link}" target="_blank" class="btn">Visit ${blog.title}</a>
                `;

                blogsContainer.appendChild(blogCard);

                // Fetch latest posts for each blog
                fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(blog.rss)}`)
                    .then(response => response.json())
                    .then(feed => {
                        const postsContainer = document.getElementById(`${blog.title.toLowerCase()}-posts`);
                        feed.items.slice(0, 3).forEach(post => {
                            const postItem = document.createElement("li");
                            postItem.innerHTML = `<a href="${post.link}" target="_blank">${post.title}</a>`;
                            postsContainer.appendChild(postItem);
                        });
                    })
                    .catch(error => console.error(`Error fetching posts for ${blog.title}:`, error));
            });
        })
        .catch(error => console.error("Error fetching blogs:", error));
});

// Toast Notification
const showToast = (message) => {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000); // Hide toast after 3 seconds
};

// Handle Form Submission with EmailJS
document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();

    emailjs.sendForm("service_swubjt9", "template_ny7q2a4", this)
        .then(() => {
            showToast("Message Sent Successfully!");
            this.reset();
        })
        .catch(() => {
            showToast("Failed to Send Message. Please Try Again.");
        });
});

// Interactive Canvas in Body
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("interactive-bg");
    const ctx = canvas.getContext("2d");
    //console.log("Canvas initialized:", canvas);
    const particles = [];
    const numParticles = 100;
    const maxDistance = 100;
    const mouse = { x: null, y: null };

    // Resize Canvas to Cover Full Page
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        //console.log("Canvas resized to:", canvas.width, canvas.height);
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Particle Constructor
    class Particle {
        constructor(x, y) {
            this.x = x || Math.random() * canvas.width;
            this.y = y || Math.random() * canvas.height;
            this.vx = Math.random() * 2 - 1;
            this.vy = Math.random() * 2 - 1;
            //console.log("Particle created at:", this.x, this.y);
        }
        move() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            //console.log("Particle moved to:", this.x, this.y);
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.fill();
        }
    }

    // Create Initial Particles
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }

    // Draw Lines Between Close Particles
    const drawLines = () => {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = Math.hypot(
                    particles[i].x - particles[j].x,
                    particles[i].y - particles[j].y
                );
                if (dist < maxDistance) {
                    //console.log("Drawing line between particles at distance:", dist);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 123, 255, ${1 - dist / maxDistance})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    };

    // Add Hover Interaction
    canvas.addEventListener("mousemove", (e) => {
        //console.log("Mouse moved at:", e.clientX, e.clientY);
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;

        // Add a particle at the mouse position
        //console.log("Relative mouse position:", mouse.x, mouse.y);
        particles.push(new Particle(mouse.x, mouse.y));

        // Limit particles to avoid performance issues
        if (particles.length > numParticles + 20) {
            particles.shift(); // Remove the oldest particle
            //console.log("Particle removed. Total particles:", particles.length);
        }
    });

    canvas.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Animation Loop
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //console.log("Animating... Particle count:", particles.length);

        particles.forEach((p) => {
            p.move();
            p.draw();
        });

        drawLines();
        requestAnimationFrame(animate);
    };
    animate();
});

// Game
document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.getElementById("game-container");
    const scoreboard = document.getElementById("scoreboard");
    const startGameBtn = document.getElementById("start-game-btn");

    let score = 0;
    let gameInterval;
    let gameTimeout;

    const createStar = () => {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.top = `${Math.random() * (gameContainer.offsetHeight - 20)}px`;
        star.style.left = `${Math.random() * (gameContainer.offsetWidth - 20)}px`;

        // Remove star after 3 seconds
        setTimeout(() => {
            if (star.parentElement) {
                star.parentElement.removeChild(star);
            }
        }, 3000);

        // Increment score on click
        star.addEventListener("click", () => {
            score += 1;
            scoreboard.textContent = `Score: ${score}`;
            gameContainer.removeChild(star);
        });

        gameContainer.appendChild(star);
    };

    const startGame = () => {
        score = 0;
        scoreboard.textContent = "Score: 0";
        gameContainer.innerHTML = ""; // Clear the game area

        // Create stars every 500ms
        gameInterval = setInterval(createStar, 500);

        // Stop the game after 30 seconds
        gameTimeout = setTimeout(() => {
            clearInterval(gameInterval);
            alert(`Time's up! Your final score is ${score}.`);
        }, 30000);
    };

    startGameBtn.addEventListener("click", startGame);
});

// Spy Scroll
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".navbar a");
    const sections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute("href")));

    const setActiveLink = () => {
        let currentSection = sections.find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= 150 && rect.bottom >= 150;
        });

        navLinks.forEach(link => link.classList.remove("active"));
        if (currentSection) {
            const activeLink = document.querySelector(`.navbar a[href="#${currentSection.id}"]`);
            if (activeLink) activeLink.classList.add("active");
        }
    };

    window.addEventListener("scroll", setActiveLink);
});

// Stikcy Header
document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".custom-header");
    const body = document.body;

    if (body.classList.contains("dynamic-bg")) {
        //console.warn("Body has class 'dynamic-bg'. Checking for constraints...");
        body.style.height = "auto"; // Ensure body height is not constrained
        body.style.overflow = "visible"; // Allow sticky to work
    }

    // Debug header's parent constraints
    const parent = header.parentElement;
    //console.log("Header parent styles:", window.getComputedStyle(parent));
});

//Dynamic Header Adjustment
document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".custom-header");

    if (!header) {
        console.error("Header element not found.");
        return;
    }

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            if (!header.classList.contains("compact")) {
                header.classList.add("compact");
            }
        } else {
            header.classList.remove("compact");
        }
    });
});
