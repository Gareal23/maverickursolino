<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive Pet Adoption</title>
    <link rel="stylesheet" href="Css/styles.css">
</head>
<body>
    <header>
        <h1>Adopt a Pet</h1>
        <nav>
            <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#pets">Available Pets</a></li>
                <li><a href="#adoption-process">Adoption Process</a></li>
                <li><a href="#testimonials">Testimonials</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#contact">Contact Us</a></li>
            </ul>
        </nav>
    </header>

    <section id="hero">
        <h2>Find Your New Best Friend!</h2>
        <p>Join us in giving pets a loving home.</p>
        <button onclick="location.href='#pets'">See Available Pets</button>
    </section>

    <section id="about">
        <h2>About Us</h2>
        <p>We are dedicated to finding loving homes for pets in need. Our mission is to ensure that every pet finds a family that will love and care for them.</p>
        <p>Join us in making a difference! Our team works tirelessly to rescue, rehabilitate, and rehome pets from various backgrounds.</p>
    </section>

    <section id="pets">
        <h2>Available Pets</h2>

        <!-- Pet Card 1 -->
        <div class="pet-card">
            <img src="dog.jpg" alt="Dog">
            <h3>Buddy</h3>
            <p>Age: 2 years</p>
            <p>Breed: Golden Retriever</p>
            <p>Personality: Friendly and playful, loves to fetch!</p>
            <button onclick="adopt('Buddy')">Adopt Me!</button>
            <button onclick="location.href='buddy.html'">View Details</button> <!-- Link to detailed profile -->
        </div>

        <!-- Pet Card 2 -->
        <div class="pet-card">
            <img src="cat.jpg" alt="Cat">
            <h3>Whiskers</h3>
            <p>Age: 3 years</p>
            <p>Breed: Domestic Shorthair</p>
            <p>Personality: Independent and curious, loves to explore.</p>
            <button onclick="adopt('Whiskers')">Adopt Me!</button>
            <button onclick="location.href='whiskers.html'">View Details</button> <!-- Link to detailed profile -->
        </div>

        <!-- Pet Card 3 -->
        <div class="pet-card">
            <img src="rabbit.jpg" alt="Rabbit">
            <h3>Coco</h3>
            <p>Age: 1 year</p>
            <p>Breed: Holland Lop Rabbit</p>
            <p>Personality: Gentle and affectionate, loves cuddles!</p>
            <button onclick="adopt('Coco')">Adopt Me!</button>
            <button onclick="location.href='coco.html'">View Details</button> <!-- Link to detailed profile -->
        </div>

    </section>

    <!-- Adoption Process Section -->
    <section id="adoption-process">
        <h2>The Adoption Process</h2>
        <ol class="process-list">
            <li><strong>Step 1:</strong> Fill out an adoption application form.</li>
            <li><strong>Step 2:</strong> Meet the pet you are interested in.</li>
            <li><strong>Step 3:</strong> Complete the necessary paperwork.</li>
            <li><strong>Step 4:</strong> Pay the adoption fee.</li>
            <li><strong>Step 5:</strong> Take your new best friend home!</li>
        </ol>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials">
        <h2>What Our Adopters Say</h2>

        <!-- Testimonial 1 -->
        <blockquote class="testimonial">
            "Adopting Bella was the best decision we ever made! She has brought so much joy to our family." - Sarah K.
        </blockquote>

        <!-- Testimonial 2 -->
        <blockquote class="testimonial">
            "Max is such a loving companion. Thank you for helping us find him!" - John D.
        </blockquote>

        <!-- Testimonial 3 -->
        <blockquote class="testimonial">
            "Coco has filled our home with happiness! We couldn't be happier." - Emily R.
        </blockquote>

    </section>

    <!-- FAQ Section -->
    <section id="faq">
        <h2>Frequently Asked Questions</h2>

        <!-- FAQ Item 1 -->
        <div class="faq-item">
            <strong>Q: What is the adoption process?</strong>
            <p>A: The adoption process involves filling out an application form, meeting the pet, and completing the necessary paperwork.</p>
        </div>

        <!-- FAQ Item 2 -->
        <div class="faq-item">
            <strong>Q: Do you charge an adoption fee?</strong>
            <p>A: Yes, we do charge an adoption fee which helps cover the cost of vaccinations, spaying/neutering, and other medical expenses.</p>
        </div>

    </section>

    <!-- Contact Section -->
    <section id="contact">
        <h2>Contact Us</h2>
        <form action="submit.php" method="POST">
            <input type="text" name="name" placeholder="Your Name" required>
            <input type="email" name="email" placeholder="Your Email" required>
            <textarea name="message" placeholder="Your Message" required></textarea>
            <button type="submit">Send Message</button>
        </form>
    </section>

    <!-- Footer Section -->
    <footer>
        <p>&copy; 2024 Pet Adoption Center | Follow us on social media!</p>
    </footer>

    <!-- JavaScript for Adoption Alert -->
    <script>
        function adopt(petName) {
            alert(`Thank you for considering adopting ${petName}!`);
        }
    </script>

</body>
</html>
