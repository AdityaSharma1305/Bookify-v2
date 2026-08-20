package com.bookify.config;

import com.bookify.entity.*;
import com.bookify.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final BookListingRepository bookListingRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Checking and seeding Bookify real book catalog and user accounts...");

        // 1. Seed Users
        User admin = upsertUser("admin@bookify.com", "Admin User", Role.ROLE_ADMIN, 25, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300");
        User reader = upsertUser("user@bookify.com", "Jane Reader", Role.ROLE_USER, 15, "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300");
        User seller = upsertUser("seller@bookify.com", "Rahul Sharma", Role.ROLE_USER, 20, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300");

        // 2. Seed Categories
        Map<String, Category> categories = seedCategories();

        // 3. Seed Authors
        Map<String, Author> authors = seedAuthors();

        // 4. Seed Real Books
        seedBooks(authors, categories, admin, reader, seller);

        log.info("Bookify real book database and marketplace initialized successfully!");
    }

    private User upsertUser(String email, String name, Role role, int goal, String avatar) {
        return userRepository.findByEmail(email).map(u -> {
            u.setPassword(passwordEncoder.encode("Password123!"));
            u.setEmailVerified(true);
            u.setStatus(UserStatus.ACTIVE);
            u.setRole(role);
            if (u.getProfileImage() == null) u.setProfileImage(avatar);
            return userRepository.save(u);
        }).orElseGet(() -> userRepository.save(User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode("Password123!"))
                .role(role)
                .status(UserStatus.ACTIVE)
                .emailVerified(true)
                .profileImage(avatar)
                .readingGoal(goal)
                .build()));
    }

    private Map<String, Category> seedCategories() {
        Map<String, Category> map = new HashMap<>();
        List<Category> list = List.of(
                Category.builder().name("Self-Help & Personal Growth").slug("self-help").description("Master habits, productivity, mindfulness, and personal transformation.").build(),
                Category.builder().name("Business & Finance").slug("business-finance").description("Wealth creation, investing, startups, management, and economics.").build(),
                Category.builder().name("Psychology & Mindset").slug("psychology").description("Behavioral psychology, decision making, cognitive biases, and mental models.").build(),
                Category.builder().name("Fiction & Literature").slug("fiction").description("Captivating narratives, literary masterpieces, and timeless storytelling.").build(),
                Category.builder().name("Science Fiction & Fantasy").slug("sci-fi-fantasy").description("Epic worldbuilding, futuristic technologies, space operas, and magic systems.").build(),
                Category.builder().name("Technology & Programming").slug("technology").description("Software engineering, architecture, AI, clean code, and computing.").build(),
                Category.builder().name("Mystery & Thriller").slug("mystery-thriller").description("Edge-of-your-seat suspense, crimes, investigative twists, and psychological thrillers.").build(),
                Category.builder().name("History & Society").slug("history").description("Civilizations, evolutionary biology, anthropology, and human origins.").build(),
                Category.builder().name("Biography & Memoir").slug("biography").description("Inspirational real-life journeys of icons, innovators, and world leaders.").build(),
                Category.builder().name("Romance").slug("romance").description("Heartfelt emotional drama, contemporary romance, and relationship journeys.").build()
        );

        for (Category c : list) {
            Category saved = categoryRepository.findBySlug(c.getSlug()).orElseGet(() -> categoryRepository.save(c));
            map.put(c.getSlug(), saved);
        }
        return map;
    }

    private Map<String, Author> seedAuthors() {
        Map<String, Author> map = new HashMap<>();
        List<Author> list = List.of(
                Author.builder().name("James Clear").country("United States").biography("Author of the multi-million copy bestseller Atomic Habits, focusing on habits, decision making, and continuous improvement.").profileImage("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400").build(),
                Author.builder().name("Morgan Housel").country("United States").biography("Partner at Collaborative Fund, former Wall Street Journal columnist, and author of The Psychology of Money.").profileImage("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400").build(),
                Author.builder().name("Robert T. Kiyosaki").country("United States").biography("Renowned investor, entrepreneur, and author of Rich Dad Poor Dad, advocating for financial literacy worldwide.").profileImage("https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400").build(),
                Author.builder().name("Yuval Noah Harari").country("Israel").biography("Historian, philosopher, and professor at Hebrew University of Jerusalem, author of the international phenomenon Sapiens.").profileImage("https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400").build(),
                Author.builder().name("Paulo Coelho").country("Brazil").biography("One of the most widely read authors globally, celebrated for the poetic, philosophical allegory The Alchemist.").profileImage("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400").build(),
                Author.builder().name("Cal Newport").country("United States").biography("Associate Professor of Computer Science at Georgetown University and author of Deep Work and Digital Minimalism.").profileImage("https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400").build(),
                Author.builder().name("Robert C. Martin").country("United States").biography("Uncle Bob is a legendary software engineer, author of Clean Code, and co-author of the Agile Manifesto.").profileImage("https://images.unsplash.com/photo-1544717305-2782549b5136?w=400").build(),
                Author.builder().name("Daniel Kahneman").country("Israel / United States").biography("Nobel Memorial Prize laureate in Economic Sciences and pioneer in behavioral economics and cognitive science.").profileImage("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400").build(),
                Author.builder().name("Hector Garcia & Francesc Miralles").country("Spain / Japan").biography("Authors of the international bestseller Ikigai: The Japanese Secret to a Long and Happy Life.").profileImage("https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400").build(),
                Author.builder().name("J.K. Rowling").country("United Kingdom").biography("Acclaimed author of the seven-volume Harry Potter fantasy series, loved by hundreds of millions of readers.").profileImage("https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400").build(),
                Author.builder().name("Matt Haig").country("United Kingdom").biography("Popular novelist and author of The Midnight Library, exploring parallel lives, second chances, and mental health.").profileImage("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400").build(),
                Author.builder().name("Colleen Hoover").country("United States").biography("#1 New York Times bestselling author of It Ends with Us, renowned for powerful, emotional relationship dramas.").profileImage("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400").build(),
                Author.builder().name("Frank Herbert").country("United States").biography("Hugo and Nebula Award-winning science fiction icon best known for the seminal masterpiece Dune.").profileImage("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400").build(),
                Author.builder().name("Ankur Warikoo").country("India").biography("Indian entrepreneur, mentor, and bestselling author of Do Epic Shit and Get Epic Shit Done.").profileImage("https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400").build(),
                Author.builder().name("Joshua Bloch").country("United States").biography("Former Chief Java Architect at Sun Microsystems and Google, author of the indispensable guide Effective Java.").profileImage("https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400").build(),
                Author.builder().name("Ichiro Kishimi & Fumitake Koga").country("Japan").biography("Philosophers and co-authors of The Courage to Be Disliked, applying Adlerian psychology to modern everyday dilemmas.").profileImage("https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400").build()
        );

        for (Author a : list) {
            Author saved = authorRepository.findByName(a.getName()).orElseGet(() -> authorRepository.save(a));
            map.put(a.getName(), saved);
        }
        return map;
    }

    private void seedBooks(Map<String, Author> authors, Map<String, Category> categories, User admin, User reader, User seller) {
        if (bookRepository.count() >= 12) {
            log.info("Books already seeded ({} found).", bookRepository.count());
            return;
        }

        List<Book> booksToSave = new ArrayList<>();

        // 1. Atomic Habits
        booksToSave.add(Book.builder()
                .isbn("9780735211292")
                .title("Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones")
                .subtitle("Tiny Changes, Remarkable Results")
                .description("No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.")
                .author(authors.get("James Clear"))
                .publisher("Avery / Penguin Random House")
                .publicationDate(LocalDate.of(2018, 10, 16))
                .language("English")
                .pageCount(320)
                .price(new BigDecimal("499.00"))
                .coverImage("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg")
                .averageRating(new BigDecimal("4.85"))
                .totalRatings(1420)
                .totalReviews(380)
                .status(BookStatus.ACTIVE)
                .categories(Set.of(categories.get("self-help"), categories.get("psychology")))
                .build());

        // 2. The Psychology of Money
        booksToSave.add(Book.builder()
                .isbn("9780857197689")
                .title("The Psychology of Money: Timeless Lessons on Wealth, Greed, and Happiness")
                .subtitle("Timeless Lessons on Wealth, Greed, and Happiness")
                .description("Doing well with money isn't necessarily about what you know. It's about how you behave. And behavior is hard to teach, even to really smart people. In The Psychology of Money, award-winning author Morgan Housel shares 19 short stories exploring the strange ways people think about money and teaches you how to make better sense of one of life's most important topics.")
                .author(authors.get("Morgan Housel"))
                .publisher("Harriman House")
                .publicationDate(LocalDate.of(2020, 9, 8))
                .language("English")
                .pageCount(256)
                .price(new BigDecimal("399.00"))
                .coverImage("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1581527774i/41881472.jpg")
                .averageRating(new BigDecimal("4.78"))
                .totalRatings(980)
                .totalReviews(240)
                .status(BookStatus.ACTIVE)
                .categories(Set.of(categories.get("business-finance"), categories.get("psychology")))
                .build());

        // 3. Rich Dad Poor Dad
        booksToSave.add(Book.builder()
                .isbn("9781612680194")
                .title("Rich Dad Poor Dad")
                .subtitle("What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not!")
                .description("Rich Dad Poor Dad is Robert's story of growing up with two dads -- his real father and the father of his best friend, his rich dad -- and the ways in which both men shaped his thoughts about money and investing. The book explodes the myth that you need to earn a high income to be rich and explains the difference between working for money and having your money work for you.")
                .author(authors.get("Robert T. Kiyosaki"))
                .publisher("Plata Publishing")
                .publicationDate(LocalDate.of(1997, 4, 1))
                .language("English")
                .pageCount(336)
                .price(new BigDecimal("349.00"))
                .coverImage("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388211242i/69571.jpg")
                .averageRating(new BigDecimal("4.62"))
                .totalRatings(1250)
                .totalReviews(310)
                .status(BookStatus.ACTIVE)
                .categories(Set.of(categories.get("business-finance"), categories.get("self-help")))
                .build());

        // 4. Ikigai
        booksToSave.add(Book.builder()
                .isbn("9780143130727")
                .title("Ikigai: The Japanese Secret to a Long and Happy Life")
                .subtitle("The Japanese Secret to a Long and Happy Life")
                .description("Bring meaning and joy to all your days with this internationally bestselling guide to the Japanese concept of ikigai (the art of finding satisfaction, purpose, and balance in life)--enriched with anecdotes from centenarians living in Okinawa.")
                .author(authors.get("Hector Garcia & Francesc Miralles"))
                .publisher("Penguin Life")
                .publicationDate(LocalDate.of(2017, 8, 29))
                .language("English")
                .pageCount(208)
                .price(new BigDecimal("399.00"))
                .coverImage("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1682498263i/40534545.jpg")
                .averageRating(new BigDecimal("4.70"))
                .totalRatings(870)
                .totalReviews(190)
                .status(BookStatus.ACTIVE)
                .categories(Set.of(categories.get("self-help"), categories.get("psychology")))
                .build());

        // 5. Sapiens
        booksToSave.add(Book.builder()
                .isbn("9780062316097")
                .title("Sapiens: A Brief History of Humankind")
                .subtitle("A Brief History of Humankind")
                .description("100,000 years ago, at least six human species inhabited the earth. Today there is just one. Us. Homo sapiens. How did our species succeed in the battle for dominance? Why did our foraging ancestors come together to create cities and kingdoms? How did we come to believe in gods, nations, and human rights?")
                .author(authors.get("Yuval Noah Harari"))
                .publisher("Harper")
                .publicationDate(LocalDate.of(2015, 2, 10))
                .language("English")
                .pageCount(464)
                .price(new BigDecimal("599.00"))
                .coverImage("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1700180949i/23692271.jpg")
                .averageRating(new BigDecimal("4.82"))
                .totalRatings(1850)
                .totalReviews(520)
                .status(BookStatus.ACTIVE)
                .categories(Set.of(categories.get("history"), categories.get("psychology")))
                .build());

        // 6. The Alchemist
        booksToSave.add(Book.builder()
                .isbn("9780062315007")
                .title("The Alchemist")
                .subtitle("A Fable About Following Your Dream")
                .description("Paulo Coelho's enchanting novel has inspired a devoted following around the world. This story, dazzling in its powerful simplicity and inspiring wisdom, is about an Andalusian shepherd boy named Santiago who travels from his homeland in Spain to the Egyptian desert in search of treasure buried near the Pyramids.")
                .author(authors.get("Paulo Coelho"))
                .publisher("HarperOne")
                .publicationDate(LocalDate.of(1988, 4, 15))
                .language("English")
                .pageCount(208)
                .price(new BigDecimal("299.00"))
                .coverImage("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg")
                .averageRating(new BigDecimal("4.74"))
                .totalRatings(2100)
                .totalReviews(640)
                .status(BookStatus.ACTIVE)
                .categories(Set.of(categories.get("fiction"), categories.get("self-help")))
                .build());

        // 7. Deep Work
        booksToSave.add(Book.builder()
                .isbn("9781455586691")
                .title("Deep Work: Rules for Focused Success in a Distracted World")
                .subtitle("Rules for Focused Success in a Distracted World")
                .description("Deep work is the ability to focus without distraction on a cognitively demanding task. It's a skill that allows you to quickly master complicated information and produce better results in less time. Deep work will make you better at what you do and provide the sense of true fulfillment that comes from craftsmanship.")
                .author(authors.get("Cal Newport"))
                .publisher("Grand Central Publishing")
                .publicationDate(LocalDate.of(2016, 1, 5))
                .language("English")
                .pageCount(304)
                .price(new BigDecimal("449.00"))
                .coverImage("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1447957962i/25744928.jpg")
                .averageRating(new BigDecimal("4.68"))
                .totalRatings(720)
                .totalReviews(180)
                .status(BookStatus.ACTIVE)
                .categories(Set.of(categories.get("self-help"), categories.get("business-finance")))
                .build());

        // 8. Clean Code
        booksToSave.add(Book.builder()
                .isbn("9780132350884")
                .title("Clean Code: A Handbook of Agile Software Craftsmanship")
                .subtitle("A Handbook of Agile Software Craftsmanship")
                .description("Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn't have to be that way. Noted software expert Robert C. Martin presents a revolutionary paradigm with Clean Code.")
                .author(authors.get("Robert C. Martin"))
                .publisher("Prentice Hall")
                .publicationDate(LocalDate.of(2008, 8, 1))
                .language("English")
                .pageCount(464)
                .price(new BigDecimal("799.00"))
                .coverImage("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436202607i/3735293.jpg")
                .averageRating(new BigDecimal("4.80"))
                .totalRatings(1100)
                .totalReviews(290)
                .status(BookStatus.ACTIVE)
                .categories(Set.of(categories.get("technology")))
                .build());

        // 9. Thinking, Fast and Slow
        booksToSave.add(Book.builder()
                .isbn("9780374533557")
                .title("Thinking, Fast and Slow")
                .subtitle("The Groundbreaking Book on Cognitive Biases and Human Judgment")
                .description("In the international bestseller, Thinking, Fast and Slow, Daniel Kahneman, the renowned psychologist and winner of the Nobel Prize in Economics, takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think: System 1 is fast, intuitive, and emotional; System 2 is slower, more deliberative, and more logical.")
                .author(authors.get("Daniel Kahneman"))
                .publisher("Farrar, Straus and Giroux")
                .publicationDate(LocalDate.of(2011, 10, 25))
                .language("English")
                .pageCount(512)
                .price(new BigDecimal("549.00"))
                .coverImage("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1317793965i/11468377.jpg")
                .averageRating(new BigDecimal("4.72"))
                .totalRatings(940)
                .totalReviews(210)
                .status(BookStatus.ACTIVE)
                .categories(Set.of(categories.get("psychology"), categories.get("business-finance")))
                .build());

        // 10. Harry Potter and the Sorcerer's Stone
        booksToSave.add(Book.builder()
                .isbn("9780590353427")
                .title("Harry Potter and the Sorcerer's Stone")
                .subtitle("Book 1 in the Legendary Harry Potter Series")
                .description("Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts in with some astonishing news: Harry Potter is a wizard.")
                .author(authors.get("J.K. Rowling"))
                .publisher("Scholastic / Bloomsbury")
                .publicationDate(LocalDate.of(1997, 6, 26))
                .language("English")
                .pageCount(320)
                .price(new BigDecimal("499.00"))
                .coverImage("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1474154022i/3.jpg")
                .averageRating(new BigDecimal("4.92"))
                .totalRatings(3200)
                .totalReviews(890)
                .status(BookStatus.ACTIVE)
                .categories(Set.of(categories.get("sci-fi-fantasy"), categories.get("fiction")))
                .build());

        // 11. The Midnight Library
        booksToSave.add(Book.builder()
                .isbn("9780525559474")
                .title("The Midnight Library")
                .subtitle("A Novel")
                .description("Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?")
                .author(authors.get("Matt Haig"))
                .publisher("Viking")
                .publicationDate(LocalDate.of(2020, 9, 29))
                .language("English")
                .pageCount(304)
                .price(new BigDecimal("399.00"))
                .coverImage("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253i/52578297.jpg")
                .averageRating(new BigDecimal("4.65"))
                .totalRatings(1120)
                .totalReviews(330)
                .status(BookStatus.ACTIVE)
                .categories(Set.of(categories.get("fiction"), categories.get("sci-fi-fantasy")))
                .build());

        // 12. Do Epic Shit
        booksToSave.add(Book.builder()
                .isbn("9789391165482")
                .title("Do Epic Shit")
                .subtitle("Thoughts on Life, Success, Failure, and Relationships")
                .description("In Do Epic Shit, Ankur Warikoo reflects on the lessons he learned the hard way in life and business. He writes about the importance of creating habits for long-term success, the foundations of money management, embracing failure, and cultivating empathy in relationships.")
                .author(authors.get("Ankur Warikoo"))
                .publisher("Juggernaut")
                .publicationDate(LocalDate.of(2021, 12, 27))
                .language("English")
                .pageCount(312)
                .price(new BigDecimal("299.00"))
                .coverImage("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1639918237i/59858348.jpg")
                .averageRating(new BigDecimal("4.58"))
                .totalRatings(680)
                .totalReviews(140)
                .status(BookStatus.ACTIVE)
                .categories(Set.of(categories.get("self-help"), categories.get("business-finance")))
                .build());

        // 13. Dune
        booksToSave.add(Book.builder()
                .isbn("9780441172719")
                .title("Dune")
                .subtitle("The Epic Science Fiction Masterpiece")
                .description("Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the 'spice' melange, a drug capable of extending life and enhancing consciousness.")
                .author(authors.get("Frank Herbert"))
                .publisher("Ace Books")
                .publicationDate(LocalDate.of(1965, 8, 1))
                .language("English")
                .pageCount(688)
                .price(new BigDecimal("599.00"))
                .coverImage("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg")
                .averageRating(new BigDecimal("4.79"))
                .totalRatings(1600)
                .totalReviews(480)
                .status(BookStatus.ACTIVE)
                .categories(Set.of(categories.get("sci-fi-fantasy"), categories.get("fiction")))
                .build());

        // 14. Effective Java
        booksToSave.add(Book.builder()
                .isbn("9780134685991")
                .title("Effective Java (3rd Edition)")
                .subtitle("Best practices for the Java Platform")
                .description("The Definitive Guide to Java Platform Best Practices. Since the previous edition of Effective Java, the Java programming language and its libraries have undergone a tremendous evolution. In this new edition, Joshua Bloch brings each chapter up to date with Java 7, 8, and 9 best practices.")
                .author(authors.get("Joshua Bloch"))
                .publisher("Addison-Wesley Professional")
                .publicationDate(LocalDate.of(2017, 12, 27))
                .language("English")
                .pageCount(416)
                .price(new BigDecimal("899.00"))
                .coverImage("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1513288108i/34927404.jpg")
                .averageRating(new BigDecimal("4.88"))
                .totalRatings(850)
                .totalReviews(210)
                .status(BookStatus.ACTIVE)
                .categories(Set.of(categories.get("technology")))
                .build());

        // 15. The Courage to Be Disliked
        booksToSave.add(Book.builder()
                .isbn("9781501197277")
                .title("The Courage to Be Disliked")
                .subtitle("How to Free Yourself, Change Your Life and Achieve Real Happiness")
                .description("Using the theories of Alfred Adler, one of the three giants of nineteenth-century psychology alongside Freud and Jung, this book follows an illuminating dialogue between a philosopher and a young man. Over the course of five conversations, the philosopher helps his student understand how each of us is able to determine the direction of our own life.")
                .author(authors.get("Ichiro Kishimi & Fumitake Koga"))
                .publisher("Atria Books")
                .publicationDate(LocalDate.of(2013, 12, 13))
                .language("English")
                .pageCount(288)
                .price(new BigDecimal("449.00"))
                .coverImage("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1545421584i/43306206.jpg")
                .averageRating(new BigDecimal("4.67"))
                .totalRatings(790)
                .totalReviews(160)
                .status(BookStatus.ACTIVE)
                .categories(Set.of(categories.get("psychology"), categories.get("self-help")))
                .build());

        // 16. It Ends with Us
        booksToSave.add(Book.builder()
                .isbn("9781501110368")
                .title("It Ends with Us")
                .subtitle("A Novel")
                .description("Lily hasn't always had it easy, but that's never stopped her from working hard for the life she wants. She's come a long way from the small town where she grew up--she graduated from college, moved to Boston, and started her own business. And when she feels a spark with a gorgeous neurosurgeon named Ryle Kincaid, everything in Lily's life seems almost too good to be true.")
                .author(authors.get("Colleen Hoover"))
                .publisher("Atria Books")
                .publicationDate(LocalDate.of(2016, 8, 2))
                .language("English")
                .pageCount(384)
                .price(new BigDecimal("399.00"))
                .coverImage("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1688011937i/27362503.jpg")
                .averageRating(new BigDecimal("4.60"))
                .totalRatings(2800)
                .totalReviews(750)
                .status(BookStatus.ACTIVE)
                .categories(Set.of(categories.get("romance"), categories.get("fiction")))
                .build());

        List<Book> savedBooks = bookRepository.saveAll(booksToSave);
        log.info("Saved {} bestseller books in database!", savedBooks.size());

        // 5. Seed Used Book Marketplace Listings
        seedMarketplaceListings(savedBooks, seller, reader);

        // 6. Seed Sample Reviews
        seedSampleReviews(savedBooks, reader, seller);
    }

    private void seedMarketplaceListings(List<Book> books, User seller, User reader) {
        if (books.isEmpty()) return;

        List<BookListing> listings = List.of(
                BookListing.builder()
                        .seller(seller)
                        .book(books.get(0)) // Atomic Habits
                        .conditionGrade(BookCondition.LIKE_NEW)
                        .conditionDescription("Read once carefully. Absolutely pristine condition with crisp uncreased spine and no notes.")
                        .photoUrl("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500")
                        .listingPrice(new BigDecimal("249.00"))
                        .originalPrice(new BigDecimal("499.00"))
                        .shippingFee(BigDecimal.ZERO)
                        .status(ListingStatus.AVAILABLE)
                        .build(),
                BookListing.builder()
                        .seller(reader)
                        .book(books.get(1)) // Psychology of Money
                        .conditionGrade(BookCondition.VERY_GOOD)
                        .conditionDescription("Minor shelf wear on bottom corner, inside pages are spotless and crisp.")
                        .photoUrl("https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500")
                        .listingPrice(new BigDecimal("199.00"))
                        .originalPrice(new BigDecimal("399.00"))
                        .shippingFee(new BigDecimal("30.00"))
                        .status(ListingStatus.AVAILABLE)
                        .build(),
                BookListing.builder()
                        .seller(seller)
                        .book(books.get(4)) // Sapiens
                        .conditionGrade(BookCondition.GOOD)
                        .conditionDescription("Paperback edition. Minor pencil markings on chapter 2, sturdy binding and clean text.")
                        .photoUrl("https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500")
                        .listingPrice(new BigDecimal("279.00"))
                        .originalPrice(new BigDecimal("599.00"))
                        .shippingFee(BigDecimal.ZERO)
                        .status(ListingStatus.AVAILABLE)
                        .build(),
                BookListing.builder()
                        .seller(seller)
                        .book(books.get(7)) // Clean Code
                        .conditionGrade(BookCondition.LIKE_NEW)
                        .conditionDescription("Original Pearson India edition, flawless condition. Essential for developers.")
                        .photoUrl("https://images.unsplash.com/photo-1532012164546-f432f2e3ddb5?w=500")
                        .listingPrice(new BigDecimal("449.00"))
                        .originalPrice(new BigDecimal("799.00"))
                        .shippingFee(BigDecimal.ZERO)
                        .status(ListingStatus.AVAILABLE)
                        .build(),
                BookListing.builder()
                        .seller(reader)
                        .book(books.get(9)) // Harry Potter
                        .conditionGrade(BookCondition.VERY_GOOD)
                        .conditionDescription("Bloomsbury 20th Anniversary Edition. Beautiful cover and intact pages.")
                        .photoUrl("https://images.unsplash.com/photo-1618666012174-83b441c0bc76?w=500")
                        .listingPrice(new BigDecimal("299.00"))
                        .originalPrice(new BigDecimal("499.00"))
                        .shippingFee(BigDecimal.ZERO)
                        .status(ListingStatus.AVAILABLE)
                        .build(),
                BookListing.builder()
                        .seller(seller)
                        .book(books.get(11)) // Do Epic Shit
                        .conditionGrade(BookCondition.LIKE_NEW)
                        .conditionDescription("Gift duplicate copy, never read. Brand new with ribbon bookmark.")
                        .photoUrl("https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500")
                        .listingPrice(new BigDecimal("149.00"))
                        .originalPrice(new BigDecimal("299.00"))
                        .shippingFee(BigDecimal.ZERO)
                        .status(ListingStatus.AVAILABLE)
                        .build()
        );

        bookListingRepository.saveAll(listings);
        log.info("Seeded {} marketplace pre-loved listings!", listings.size());
    }

    private void seedSampleReviews(List<Book> books, User reader, User seller) {
        if (books.isEmpty()) return;

        List<Review> sampleReviews = List.of(
                Review.builder()
                        .book(books.get(0))
                        .user(reader)
                        .rating(5)
                        .title("Life-changing practical framework")
                        .body("The 1% better every day concept and the 4 laws of behavior change completely transformed my daily routine and focus.")
                        .status(ReviewStatus.APPROVED)
                        .helpfulCount(42)
                        .build(),
                Review.builder()
                        .book(books.get(1))
                        .user(seller)
                        .rating(5)
                        .title("Must-read for everyone dealing with money")
                        .body("Morgan Housel breaks down the psychological side of investing in the most accessible and profound way possible.")
                        .status(ReviewStatus.APPROVED)
                        .helpfulCount(28)
                        .build()
        );

        reviewRepository.saveAll(sampleReviews);
    }
}

