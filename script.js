document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburgerIcon && mobileMenu) {
        hamburgerIcon.addEventListener('click', () => {
            mobileMenu.classList.toggle('active'); // 'active' class controls visibility via CSS
        });
    }

    // Language Switching Logic
    const langOptions = document.querySelectorAll('.lang-option');
    const desktopLangChecks = {
        en: document.getElementById('lang-check-en'),
        kok: document.getElementById('lang-check-kok'),
        mr: document.getElementById('lang-check-mr')
    };
    const mobileLangChecks = {
        en: document.getElementById('mobile-lang-check-en'),
        kok: document.getElementById('mobile-lang-check-kok'),
        mr: document.getElementById('mobile-lang-check-mr')
    };

    // Load translations (assuming translations.js is loaded before this script)
    if (typeof translations === 'undefined') {
        console.error('translations.js not loaded or translations object is missing. Please ensure translations.js is loaded before script.js');
        return; // Exit if translations are not available
    }

    // Function to apply translations
    const applyTranslations = (lang) => {
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) {
                const translatedText = translations[lang][key];

                // Handle special cases based on element type or specific keys
                if (key === 'logoText' || key === 'footerLogoText') {
                    const spanElement = element.querySelector('span');
                    if (spanElement) {
                        const originalSpanContent = spanElement.outerHTML;
                        element.innerHTML = originalSpanContent + translatedText.substring(spanElement.textContent.length);
                        spanElement.textContent = translatedText.charAt(0);
                    } else {
                        element.textContent = translatedText;
                    }
                } else if (key === 'heroTitle') {
                    const spanElement = element.querySelector('span');
                    if (spanElement) {
                        const translatedHeroTitle = translations[lang].heroTitle;
                        if (translatedHeroTitle.includes(':')) {
                            const translatedParts = translatedHeroTitle.split(':');
                            element.innerHTML = `${translatedParts[0]}: <span>${translatedParts[1].trim()}</span>`;
                        } else {
                            element.textContent = translatedHeroTitle;
                        }
                    } else {
                        element.textContent = translatedText;
                    }
                } else if (key.endsWith('Placeholder')) {
                    element.setAttribute('placeholder', translatedText);
                } else if (element.tagName === 'LABEL') { // Specific for LABEL elements
                    element.textContent = translatedText;
                    // Re-add the required asterisk if it was present in the original HTML
                    const requiredSpan = element.nextElementSibling; // Check next sibling
                    if (requiredSpan && requiredSpan.classList.contains('required')) {
                        element.innerHTML += ` <span class="required">*</span>`;
                    }
                } else if (key === 'mainOfficeTag') {
                    element.textContent = translatedText;
                } else if (key === 'connectWithMentor') {
                    const originalButtonText = element.textContent;
                    const parts = originalButtonText.split(' ');
                    const mentorName = parts[parts.length - 1];

                    const baseTranslatedText = translations[lang][key];
                    if (parts.length > 1 && !['with', 'Dr.', 'Mr.', 'Ms.'].includes(mentorName)) {
                        element.textContent = `${baseTranslatedText} ${mentorName}`;
                    } else {
                        element.textContent = translatedText;
                    }
                } else if (key.endsWith('Initials')) {
                    // Initials for avatars, no translation needed here as they are static.
                } else if (key === 'aboutGoaSkillUpConnectTitle') {
                    const spanElement = element.querySelector('span');
                    if (spanElement) {
                        const translatedAboutTitle = translations[lang][key];
                        const translatedSkillConnect = translations[lang].logoText;
                        element.innerHTML = translatedAboutTitle.replace(translatedSkillConnect, `<span>${translatedSkillConnect}</span>`);
                    } else {
                        element.textContent = translatedText;
                    }
                } else if (key.includes('CardTitle') || key.includes('CardDescription') || key.includes('faqQuestion') || key.includes('faqAnswer') || key.includes('valueTitle') || key.includes('valueDescription') || key.includes('teamTitle') || key.includes('teamDescription') || key.includes('member') || key.includes('impactGoalsTitle') || key.includes('impactGoalsDescription') || key.includes('impactStat')) {
                    // Generic handling for H3/P tags that might contain icons or specific formatting
                    // This is the common case for your "Get in Touch", "FAQ", "About Us" sub-sections
                    const originalIcon = element.querySelector('i');
                    if (originalIcon) {
                        const iconHtml = originalIcon.outerHTML;
                        const nonIconText = element.textContent.replace(originalIcon.textContent, '').trim(); // Get text excluding icon's own text content
                        element.innerHTML = iconHtml + '&nbsp;' + translatedText; // Re-add icon and translated text
                    } else {
                        element.textContent = translatedText;
                    }
                } else if (key === 'showingCoursesText') {
                    const currentText = element.textContent;
                    const regex = /(\d+)\s+of\s+(\d+)\s+courses/;
                    const match = currentText.match(regex);
                    if (match) {
                        const visibleCount = match[1];
                        const totalCount = match[2];
                        const translatedBaseText = translations[lang][key];
                        element.textContent = `${translatedBaseText.split(' ')[0]} ${visibleCount} ${translatedBaseText.split(' ')[1]} ${totalCount} ${translatedBaseText.split(' ')[2] || ''}`;
                    } else {
                        element.textContent = translatedText;
                    }
                }
                else {
                    element.textContent = translatedText;
                }
            }
        });

        // Update select dropdown option text specifically
        const updateSelectOptions = (selectId, translationsObject, allKeyDataKey) => {
            const selectElement = document.getElementById(selectId);
            if (selectElement) {
                Array.from(selectElement.options).forEach(option => {
                    const value = option.value;
                    let optionKey = '';
                    let translatedOptionText = '';

                    if (value === 'all') {
                        translatedOptionText = translationsObject[allKeyDataKey] || translationsObject.all;
                    } else {
                        if (selectId === 'job-category-filter') {
                             optionKey = `${value}Option`;
                        } else if (selectId === 'job-location-filter') {
                             optionKey = `${value}Option`;
                        } else if (selectId === 'job-type-filter') {
                             optionKey = `${value}Option`;
                        } else if (selectId === 'industry-filter') {
                            optionKey = `${value}Industry`;
                        } else if (selectId === 'mentor-location-filter') {
                            optionKey = `${value}Option`;
                        } else if (selectId === 'category-filter') { // For courses page
                            optionKey = `${value}Option`;
                            if (!translationsObject[optionKey]) { // Fallback if no specific "Option" for category
                                optionKey = `${value}Tag`; // Try as generic tag name
                            }
                        } else if (selectId === 'location-filter') { // For courses page
                            optionKey = `${value}Option`;
                        } else if (selectId === 'duration-filter') { // For courses page
                            optionKey = `${value}DurationOption`;
                        } else if (selectId === 'difficulty-filter') { // For courses page
                            optionKey = `${value}Option`;
                        } else if (selectId === 'sort-by-filter') { // For courses page
                            optionKey = `${value}Option`;
                        }

                        if (translationsObject[optionKey]) {
                            translatedOptionText = translationsObject[optionKey];
                        }
                    }
                    option.textContent = translatedOptionText || option.textContent;
                });
            }
        };

        // Call updateSelectOptions for all relevant select elements across different pages
        updateSelectOptions('job-category-filter', translations[lang], 'allCategoriesLabel');
        updateSelectOptions('job-location-filter', translations[lang], 'allLocationsLabel');
        updateSelectOptions('job-type-filter', translations[lang], 'allTypesLabel');
        updateSelectOptions('industry-filter', translations[lang], 'industryLabel');
        updateSelectOptions('mentor-location-filter', translations[lang], 'locationLabel');
        updateSelectOptions('category-filter', translations[lang], 'categoryLabel');
        updateSelectOptions('location-filter', translations[lang], 'locationLabel');
        updateSelectOptions('duration-filter', translations[lang], 'durationLabel');
        updateSelectOptions('difficulty-filter', translations[lang], 'difficultyLabel');
        updateSelectOptions('sort-by-filter', translations[lang], 'sortByLabel');


        // Update selected language checks (green checkmark)
        Object.values(desktopLangChecks).forEach(check => { if (check) check.classList.add('hidden'); });
        Object.values(mobileLangChecks).forEach(check => { if (check) check.classList.add('hidden'); });

        if (desktopLangChecks[lang]) desktopLangChecks[lang].classList.remove('hidden');
        if (mobileLangChecks[lang]) mobileLangChecks[lang].classList.remove('hidden');

        // Store selected language in local storage
        localStorage.setItem('selectedLanguage', lang);

        // Call respective filter functions if their sections are present on the current page
        if (document.querySelector('.jobs-listing-section')) {
            filterJobs();
        }
        if (document.querySelector('.mentors-listing-section')) {
            filterMentors();
        }
        if (document.querySelector('.course-listing-section')) {
            filterCourses();
        }
    };

    // Initialize with default or stored language
    const initialLanguage = localStorage.getItem('selectedLanguage') || 'en';
    applyTranslations(initialLanguage);

    // Add event listeners for language options
    langOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            const lang = event.target.closest('.lang-option').dataset.lang;
            applyTranslations(lang);
            // Close mobile menu if open after selection
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
            }
        });
    });

    // --- Form Submission Logic (NEW for contact.html) ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            // Basic form validation (client-side)
            const fullName = document.getElementById('fullName').value.trim();
            const emailAddress = document.getElementById('emailAddress').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!fullName || !emailAddress || !subject || !message) {
                alert('Please fill in all required fields.'); // Replace with a more user-friendly modal/message
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
                alert('Please enter a valid email address.'); // Basic email format validation
                return;
            }

            // In a real application, you would send this data to a server
            // For demonstration, we'll just log and provide feedback
            console.log('Form Submitted:');
            console.log('Full Name:', fullName);
            console.log('Email:', emailAddress);
            console.log('Subject:', subject);
            console.log('Message:', message);

            alert('Thank you for your message! We will get back to you soon.'); // User feedback
            contactForm.reset(); // Clear the form
        });
    }


    // --- Job Search and Filter Logic (from jobs.html) ---
    const jobSearchInput = document.querySelector('.jobs-search-bar .search-input');
    const jobCategoryFilter = document.getElementById('job-category-filter');
    const jobLocationFilter = document.getElementById('job-location-filter');
    const jobTypeFilter = document.getElementById('job-type-filter');
    const jobClearFiltersButton = document.querySelector('.jobs-search-filter-container .clear-filters-button');
    const jobsFoundTextElement = document.querySelector('.jobs-found-text');
    const jobCards = document.querySelectorAll('.job-card');

    const filterJobs = () => {
        if (!jobsFoundTextElement || jobCards.length === 0 || !jobSearchInput || !jobCategoryFilter || !jobLocationFilter || !jobTypeFilter) return;

        const searchTerm = jobSearchInput.value.toLowerCase();
        const selectedCategory = jobCategoryFilter.value;
        const selectedLocation = jobLocationFilter.value;
        const selectedType = jobTypeFilter.value;
        let visibleJobsCount = 0;

        jobCards.forEach(card => {
            const title = card.querySelector('.job-title')?.textContent.toLowerCase() || '';
            const company = card.querySelector('.job-company')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.job-description')?.textContent.toLowerCase() || '';
            const skills = Array.from(card.querySelectorAll('.job-skill-tag'))
                                .map(tag => tag.textContent.toLowerCase())
                                .join(' ');

            const cardTags = Array.from(card.querySelectorAll('.job-tag'))
                                 .map(tag => tag.textContent.toLowerCase());
            const cardLocationText = card.querySelector('.job-location')?.textContent.toLowerCase() || '';
            const isRemoteJob = cardTags.includes('remote');


            const matchesSearch = searchTerm === '' ||
                                  title.includes(searchTerm) ||
                                  company.includes(searchTerm) ||
                                  description.includes(searchTerm) ||
                                  skills.includes(searchTerm);

            const matchesCategory = selectedCategory === 'all' || cardTags.includes(selectedCategory);

            const matchesLocation = selectedLocation === 'all' ||
                                    (cardLocationText.includes(selectedLocation.toLowerCase())) ||
                                    (selectedLocation === 'remote' && isRemoteJob);


            const matchesType = selectedType === 'all' || cardTags.includes(selectedType);

            if (matchesSearch && matchesCategory && matchesLocation && matchesType) {
                card.style.display = 'flex';
                visibleJobsCount++;
            } else {
                card.style.display = 'none';
            }
        });

        const currentLang = localStorage.getItem('selectedLanguage') || 'en';
        if (translations[currentLang] && translations[currentLang].jobsFoundText) {
             jobsFoundTextElement.textContent = `${visibleJobsCount} ${translations[currentLang].jobsFoundText}`;
        } else {
             jobsFoundTextElement.textContent = `${visibleJobsCount} jobs found`;
        }
    };

    // Add event listeners to job filters and search input only if they exist on the page
    if (document.querySelector('.jobs-listing-section')) {
        if (jobSearchInput) jobSearchInput.addEventListener('input', filterJobs);
        if (jobCategoryFilter) jobCategoryFilter.addEventListener('change', filterJobs);
        if (jobLocationFilter) jobLocationFilter.addEventListener('change', filterJobs);
        if (jobTypeFilter) jobTypeFilter.addEventListener('change', filterJobs);
        if (jobClearFiltersButton) {
            jobClearFiltersButton.addEventListener('click', () => {
                if (jobSearchInput) jobSearchInput.value = '';
                if (jobCategoryFilter) jobCategoryFilter.value = 'all';
                if (jobLocationFilter) jobLocationFilter.value = 'all';
                if (jobTypeFilter) jobTypeFilter.value = 'all';
                filterJobs();
            });
        }
    }


    // --- Mentors Search and Filter Logic (from mentors.html) ---
    const mentorSearchInput = document.querySelector('.mentors-search-bar .search-input');
    const industryFilter = document.getElementById('industry-filter');
    const mentorLocationFilter = document.getElementById('mentor-location-filter');
    const mentorClearFiltersButton = document.querySelector('.mentors-search-filter-container .clear-filters-button');
    const mentorsFoundTextElement = document.querySelector('.mentors-found-text');
    const mentorCards = document.querySelectorAll('.mentor-card');

    const filterMentors = () => {
        if (!mentorsFoundTextElement || mentorCards.length === 0 || !mentorSearchInput || !industryFilter || !mentorLocationFilter) return;

        const searchTerm = mentorSearchInput.value.toLowerCase();
        const selectedIndustry = industryFilter.value;
        const selectedLocation = mentorLocationFilter.value;
        let visibleMentorsCount = 0;

        mentorCards.forEach(card => {
            const name = card.querySelector('.mentor-name')?.textContent.toLowerCase() || '';
            const role = card.querySelector('.mentor-role')?.textContent.toLowerCase() || '';
            const bio = card.querySelector('.mentor-bio')?.textContent.toLowerCase() || '';
            const skills = Array.from(card.querySelectorAll('.mentor-skill-tag'))
                                .map(tag => tag.textContent.toLowerCase())
                                .join(' ');
            const locationText = card.querySelector('.mentor-location')?.textContent.toLowerCase() || '';

            const matchesIndustry = selectedIndustry === 'all' || skills.includes(selectedIndustry);

            const matchesSearch = searchTerm === '' ||
                                  name.includes(searchTerm) ||
                                  role.includes(searchTerm) ||
                                  bio.includes(searchTerm) ||
                                  skills.includes(searchTerm);

            const matchesLocation = selectedLocation === 'all' || locationText.includes(selectedLocation.toLowerCase());


            if (matchesSearch && matchesIndustry && matchesLocation) {
                card.style.display = 'flex';
                visibleMentorsCount++;
            } else {
                card.style.display = 'none';
            }
        });

        const currentLang = localStorage.getItem('selectedLanguage') || 'en';
        if (translations[currentLang] && translations[currentLang].mentorsFoundText) {
             mentorsFoundTextElement.textContent = `${visibleMentorsCount} ${translations[currentLang].mentorsFoundText}`;
        } else {
             mentorsFoundTextElement.textContent = `${visibleMentorsCount} mentors found`;
        }
    };

    // Add event listeners to mentor filters and search input only if they exist on the page
    if (document.querySelector('.mentors-listing-section')) {
        if (mentorSearchInput) mentorSearchInput.addEventListener('input', filterMentors);
        if (industryFilter) industryFilter.addEventListener('change', filterMentors);
        if (mentorLocationFilter) mentorLocationFilter.addEventListener('change', filterMentors);
        if (mentorClearFiltersButton) {
            mentorClearFiltersButton.addEventListener('click', () => {
                if (mentorSearchInput) mentorSearchInput.value = '';
                if (industryFilter) industryFilter.value = 'all';
                if (mentorLocationFilter) mentorLocationFilter.value = 'all';
                filterMentors();
            });
        }
    }


    // --- Courses Search and Filter Logic (from courses.html) ---
    const courseSearchInput = document.querySelector('.discover-course-section .search-input');
    const categoryFilter = document.getElementById('category-filter');
    const locationFilter = document.getElementById('location-filter');
    const durationFilter = document.getElementById('duration-filter');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const sortByFilter = document.getElementById('sort-by-filter');
    const certifiedCheckbox = document.getElementById('certified-checkbox');
    const showingCoursesTextElement = document.querySelector('.showing-courses-text');
    const courseCards = document.querySelectorAll('.course-list-card');

    const filterCourses = () => {
        if (!showingCoursesTextElement || courseCards.length === 0 || !courseSearchInput || !categoryFilter || !locationFilter || !durationFilter || !difficultyFilter || !sortByFilter || !certifiedCheckbox) return;

        const searchTerm = courseSearchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedLocation = locationFilter.value;
        const selectedDuration = durationFilter.value;
        const selectedDifficulty = difficultyFilter.value;
        const selectedSortBy = sortByFilter.value;
        const showCertifiedOnly = certifiedCheckbox.checked;
        let visibleCourseCards = [];

        courseCards.forEach(card => {
            const title = card.querySelector('.course-list-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.course-list-description')?.textContent.toLowerCase() || '';
            const provider = card.querySelector('.provider-text')?.textContent.toLowerCase() || '';
            const skills = Array.from(card.querySelectorAll('.key-skill-tag'))
                                .map(tag => tag.textContent.toLowerCase())
                                .join(' ');

            const isCertified = card.querySelector('.cert-tag')?.classList.contains('certified'); // Check for class, or use textContent if tag text strictly "Certified"
            const courseLocationText = card.querySelector('[data-key^="list"][data-key$="Location"]')?.textContent.toLowerCase() || '';
            const courseLevel = card.querySelector('.level-tag')?.textContent.toLowerCase() || '';
            const courseDurationText = card.querySelector('[data-key^="list"][data-key$="Duration"]')?.textContent.toLowerCase() || '';
            const courseRating = parseFloat(card.querySelector('[data-key^="list"][data-key$="Rating"]')?.textContent) || 0;
            const courseStudents = parseInt(card.querySelector('[data-key^="list"][data-key$="Students"]')?.textContent) || 0;


            const durationMatch = courseDurationText.match(/(\d+)\s*weeks/);
            const courseDurationWeeks = durationMatch ? parseInt(durationMatch[1]) : 0;


            const matchesSearch = searchTerm === '' ||
                                  title.includes(searchTerm) ||
                                  description.includes(searchTerm) ||
                                  provider.includes(searchTerm) ||
                                  skills.includes(searchTerm);

            // Get category from a reliable source, e.g., a data attribute on the course card or specific tag
            const cardCategoryTagText = card.querySelector('.card-top-tags .cert-tag:nth-of-type(1)')?.textContent.toLowerCase() || ''; // Assuming first tag is category
            // A more robust way would be to add data-category="tourism" to your .course-list-card div
            const matchesCategory = selectedCategory === 'all' || cardCategoryTagText.includes(selectedCategory); // Less precise, needs refinement


            const matchesLocation = selectedLocation === 'all' || courseLocationText.includes(selectedLocation.toLowerCase());
            // Specific check for 'online'
            if (selectedLocation === 'online' && !courseLocationText.includes('online')) {
                matchesLocation = false;
            }


            const matchesDuration = selectedDuration === 'all' ||
                                    (selectedDuration === 'short' && courseDurationWeeks < 8) ||
                                    (selectedDuration === 'medium' && courseDurationWeeks >= 8 && courseDurationWeeks <= 12) ||
                                    (selectedDuration === 'long' && courseDurationWeeks > 12);

            const matchesDifficulty = selectedDifficulty === 'all' || courseLevel.includes(selectedDifficulty); // Use includes for beginner/intermediate/advanced if tags are "Beginner"


            const matchesCertified = !showCertifiedOnly || isCertified;

            if (matchesSearch && matchesCategory && matchesLocation && matchesDuration && matchesDifficulty && matchesCertified) {
                visibleCourseCards.push(card);
            }
        });

        // Sorting Logic (apply only to visible cards)
        if (selectedSortBy === 'newest') {
            // Requires a 'date added' data attribute on cards to implement properly.
            // For now, no specific sort order changes for 'newest'
        } else if (selectedSortBy === 'rating') {
            visibleCourseCards.sort((a, b) => {
                const ratingA = parseFloat(a.querySelector('[data-key^="list"][data-key$="Rating"]')?.textContent) || 0;
                const ratingB = parseFloat(b.querySelector('[data-key^="list"][data-key$="Rating"]')?.textContent) || 0;
                return ratingB - ratingA; // Descending order for rating
            });
        } else if (selectedSortBy === 'popularity') {
            visibleCourseCards.sort((a, b) => {
                const studentsA = parseInt(a.querySelector('[data-key^="list"][data-key$="Students"]')?.textContent) || 0;
                const studentsB = parseInt(b.querySelector('[data-key^="list"][data-key$="Students"]')?.textContent) || 0;
                return studentsB - studentsA; // Descending order for students (popularity)
            });
        }


        // Update display
        courseCards.forEach(card => card.style.display = 'none'); // Hide all first
        visibleCourseCards.forEach(card => card.style.display = 'block'); // Display filtered ones

        // Update showing courses text with translation
        const totalCourses = courseCards.length;
        const currentLang = localStorage.getItem('selectedLanguage') || 'en';
        if (translations[currentLang] && translations[currentLang].showingCoursesText) {
             const baseTextParts = translations[currentLang].showingCoursesText.split(' ');
             // Assuming format is "Showing X of Y courses" -> "Showing", "of", "courses"
             showingCoursesTextElement.textContent = `${baseTextParts[0]} ${visibleCourseCards.length} ${baseTextParts[1]} ${totalCourses} ${baseTextParts[2] || ''}`;
        } else {
             showingCoursesTextElement.textContent = `Showing ${visibleCourseCards.length} of ${totalCourses} courses`;
        }
    };

    // Add event listeners to course filters and search input only if they exist on the page
    if (document.querySelector('.discover-course-section')) { // Check if courses filter section exists
        if (courseSearchInput) courseSearchInput.addEventListener('input', filterCourses);
        if (categoryFilter) categoryFilter.addEventListener('change', filterCourses);
        if (locationFilter) locationFilter.addEventListener('change', filterCourses);
        if (durationFilter) durationFilter.addEventListener('change', filterCourses);
        if (difficultyFilter) difficultyFilter.addEventListener('change', filterCourses);
        if (sortByFilter) sortByFilter.addEventListener('change', filterCourses);
        if (certifiedCheckbox) certifiedCheckbox.addEventListener('change', filterCourses);
        // Note: No explicit "Clear Filters" button in this section's HTML for courses, but you can add one and link it.
    }

    // Initial filter calls for all sections that might appear on any page
    // These functions are designed to safely exit if their target elements are not present.
    // Call them here once DOM is ready to set initial state.
    filterJobs();
    filterMentors();
    filterCourses();
});


const translations = {
    en: {
        // Navbar
        logoText: "SkillConnect",
        home: "Home",
        aboutUs: "About Us",
        courses: "Courses",
        mentors: "Mentors",
        jobs: "Jobs",
        contact: "Contact",
        more: "More",
        login: "Login",

        // Hero Section (from index.html)
        heroTitle: "Unlock Your Potential: Skill Up for Goa's Future!",
        heroDescription: "Connecting Goan youth and adults with vocational training, mentorship, and career opportunities tailored for Goa's evolving economy.",
        exploreCourses: "Explore Courses",
        findMentor: "Find a Mentor",
        coursesCount: "500+",
        coursesLabel: "Courses Available",
        mentatorsCount: "150+",
        mentatorsLabel: "Expert Mentors",
        successCount: "1000+",
        successLabel: "Success Stories",
        newCourseTag: "New Course",
        sustainableFutureTag: "Sustainable Future",

        // Featured Courses Section (from index.html)
        featuredCoursesTitle: "Featured Course Categories",
        featuredCoursesDescription: "Discover skills that matter for Goa's future. From sustainable tourism to digital innovation, find courses designed for local relevance and global impact.",
        tourismTag: "Tourism", // Also used as a filter option category
        sustainableTourismTitle: "Sustainable Tourism Management",
        sustainableTourismDesc: "Learn to develop eco-friendly tourism practices that preserve Goa's natural beauty while boosting local economy.",
        tourismDuration: "8 weeks",
        tourismLocation: "Panaji",
        tourismRating: "4.8",
        tourismStudents: "120",
        tourismPrice: "₹2,499",
        tourismLevel: "Beginner",
        learnMore: "Learn More",
        digitalSkillsTag: "Digital Skills", // Also used as a filter option category
        digitalMarketingTitle: "Digital Marketing for Local Businesses",
        digitalMarketingDesc: "Master online marketing strategies to help Goan businesses reach global audiences while maintaining local charm.",
        digitalDuration: "6 weeks",
        digitalMode: "Online",
        digitalRating: "4.9",
        digitalStudents: "95",
        digitalPrice: "₹3,199",
        digitalLevel: "Intermediate",
        artsCraftsTag: "Arts & Crafts", // Also used as a filter option category
        goanCraftTitle: "Traditional Goan Craft Revival",
        goanCraftDesc: "Preserve and modernize traditional Goan crafts with contemporary design and marketing techniques.",
        craftDuration: "10 weeks",
        craftLocation: "Margao",
        craftRating: "4.7",
        craftStudents: "78",
        craftPrice: "₹1,799",
        craftLevel: "All Levels", // This is different from beginner/intermediate/advanced levels
        environmentalTag: "Environmental", // Also used as a filter option category
        marineConservationTitle: "Marine Conservation & Research",
        marineConservationDesc: "Develop skills in marine biology and conservation to protect Goa's coastal ecosystem.",
        marineDuration: "12 weeks",
        marineLocation: "Vasco da Gama",
        marineRating: "4.9",
        marineStudents: "56",
        marinePrice: "₹4,499",
        marineLevel: "Advanced",
        viewAllCourses: "View All Courses",

        // How It Works Section (from index.html)
        howItWorksTitle: "How It Works",
        howItWorksDescription: "Your journey to skill mastery and career success starts here. Follow these simple steps to unlock your potential.",
        discoverCoursesTitle: "Discover Courses",
        discoverCoursesDesc: "Browse our comprehensive catalog of skills-based courses tailored for Goa's unique opportunities.",
        connectMentorsTitle: "Connect with Mentors",
        connectMentorsDesc: "Get paired with experienced professionals who guide your learning journey and career path.",
        buildPortfolioTitle: "Build Your Portfolio",
        buildPortfolioDesc: "Earn micro-credentials and build a digital portfolio showcasing your newly acquired skills.",
        findOpportunitiesTitle: "Find Opportunities",
        findOpportunitiesDesc: "Access our job board featuring opportunities from local employers who value SkillConnect credentials.",
        readyToStart: "Ready to start your journey?",

        // Jobs Hero Section (specific to jobs.html)
        jobsHeroTitle: "Goa Job Opportunities",
        jobsHeroDescription: "Discover career opportunities that match your skills and contribute to Goa's growing economy.",

        // Job Listing Section - Filters & Search (from jobs.html)
        jobSearchPlaceholder: "Search jobs, companies, or skills...",
        allCategoriesLabel: "All Categories", // Label for dropdown
        allLocationsLabel: "All Locations", // Label for dropdown
        allTypesLabel: "All Types", // Label for dropdown
        all: "All", // Option value for "All Categories", "All Locations", "All Types"
        // Reusing existing tags like tourismTag, digitalSkillsTag etc. for job category filter options
        panajiOption: "Panaji", // For dropdown option (location)
        margaoOption: "Margao", // For dropdown option (location)
        vascoOption: "Vasco da Gama", // For dropdown option (location)
        bicholimOption: "Bicholim", // For dropdown option (location)
        pondaOption: "Ponda", // For dropdown option (location)
        donaPaulaOption: "Dona Paula", // For dropdown option (location)
        sangueumOption: "Sangueum", // For dropdown option (location)
        porvorimOption: "Porvorim", // For dropdown option (location)
        fullTimeOption: "Full-time", // For dropdown option (job type)
        partTimeOption: "Part-time", // For dropdown option (job type)
        contractOption: "Contract", // For dropdown option (job type)
        internshipOption: "Internship", // For dropdown option (job type)
        remoteOption: "Remote", // For dropdown option (job type / location)
        clearFilters: "Clear Filters",
        jobsFoundText: "jobs found", // This string will be dynamically updated with the count, e.g., "8 jobs found"

        // Job Cards (full list of keys from jobs.html)
        job1Title: "Sustainable Tourism Manager",
        job1Company: "Goa Tourism Development Corporation",
        job1Location: "Panaji",
        fullTimeTag: "Full-time", // Tag on card
        experienceTag: "Years", // For "15+ Years"
        job1Desc: "Lead sustainable tourism initiatives across Goa, developing eco-friendly travel packages and preserving Goa's natural beauty and cultural heritage.",
        sustainableTourismSkill: "Sustainable Tourism",
        projectManagementSkill: "Project Management",
        communityEngagementSkill: "Community Engagement",
        marketingSkill: "Marketing",
        plusOneMore: "+1 more", // generic for both jobs and mentors
        job1Salary: "₹18,000.00 - ₹22,000.00 per year",
        job1Deadline: "Application deadline: 15 days left",
        applyNow: "Apply Now",
        details: "Details",

        job2Title: "Digital Marketing Specialist",
        job2Company: "Goa Tech Solutions",
        job2Location: "Remote",
        job2Desc: "Drive digital marketing campaigns for local businesses, focusing on social media, SEO, and content marketing.",
        socialMediaMarketingSkill: "Social Media Marketing",
        seoSkill: "SEO",
        googleAdsSkill: "Google Ads",
        job2Salary: "₹15,000.00 - ₹18,000.00 per year",
        job2Deadline: "Application deadline: 30 days left",

        job3Title: "Marine Biology Research Assistant",
        job3Company: "Goa University - Department of Marine Sciences",
        job3Location: "Dona Paula",
        contractTag: "Contract",
        researchTag: "Research",
        job3Desc: "Support marine biodiversity research projects along the Goan coast, including data collection, analysis, and field work.",
        marineBiologySkill: "Marine Biology",
        researchMethodsSkill: "Research Methods",
        dataAnalysisSkill: "Data Analysis",
        fieldWorkSkill: "Field Work",
        job3Salary: "₹3,500.00 - ₹5,000.00 per month",
        job3Deadline: "Application deadline: 3 days left",

        job4Title: "Traditional Crafts Instructor",
        job4Company: "Goa Heritage Foundation",
        job4Location: "Bicholim",
        partTimeTag: "Part-time",
        educationTag: "Education",
        job4Desc: "Teach traditional Goan handicrafts including pottery, weaving, and woodwork to preserve cultural heritage.",
        traditionalCraftsSkill: "Traditional Crafts",
        teachingSkill: "Teaching",
        culturalHeritageSkill: "Cultural Heritage",
        workshopManagementSkill: "Workshop Management",
        job4Salary: "₹2,500.00 - ₹4,000.00 per day",
        job4Deadline: "Application deadline: 5 days left",

        job5Title: "Organic Farm Manager",
        job5Company: "Green Goa Farms",
        job5Location: "Sangueum",
        agricultureTag: "Agriculture",
        job5Desc: "Manage organic farming operations, implement sustainable agricultural practices, and coordinate with local farming communities.",
        organicFarmingSkill: "Organic Farming",
        sustainableAgricultureSkill: "Sustainable Agriculture",
        teamManagementSkill: "Team Management",
        cropPlanningSkill: "Crop Planning",
        job5Salary: "₹14,000.00 - ₹18,000.00 per month",
        job5Deadline: "Application deadline: 1 week left",

        job6Title: "Full Stack Developer",
        job6Company: "Startup Goa Incubator",
        job6Location: "Porvorim",
        technologyTag: "Technology",
        job6Desc: "Develop web applications for local startups, working with modern tech stack and contributing to Goa's tech ecosystem.",
        reactJsSkill: "React.js",
        nodeJsSkill: "Node.js",
        mongoDbSkill: "MongoDB",
        awsSkill: "AWS",
        plusTwoMore: "+2 more", // generic for both jobs and mentors
        job6Salary: "₹18,000.00 - ₹22,000.00 per year",
        job6Deadline: "Application deadline: 15 days left",

        job7Title: "Hospitality Operations Intern",
        job7Company: "Taj Hotels - Goa",
        job7Location: "Candolim",
        internshipTag: "Internship",
        hospitalityTag: "Hospitality",
        experienceTagEntry: "Entry Level", // Specific for entry level
        job7Desc: "Gain hands-on experience in hotel operations, guest services, and hospitality management in a luxury resort setting.",
        customerServiceSkill: "Customer Service",
        hotelOperationsSkill: "Hotel Operations",
        guestRelationsSkill: "Guest Relations",
        eventManagementSkill: "Event Management",
        job7Salary: "₹10,000.00 - ₹20,000.00 per month",
        job7Deadline: "Application deadline: 30 days left",

        job8Title: "Freelance Content Creator",
        job8Company: "Goa Content Collective",
        job8Location: "Remote",
        remoteTag: "Remote",
        contentTag: "Content",
        job8Desc: "Create engaging content about Goan culture, tourism, and lifestyle for various digital platforms and content marketing.",
        contentWritingSkill: "Content Writing",
        socialMediaSkill: "Social Media",
        photographySkill: "Photography",
        videoEditingSkill: "Video Editing",
        job8Salary: "₹500.00 - ₹2,000.00 per piece",
        job8Deadline: "Application deadline: 6 days left",

        // Mentors Hero Section (specific to mentors.html)
        mentorsHeroTitle: "Connect with Mentors",
        mentorsHeroDescription: "Learn from industry experts and experienced professionals who understand unique opportunities and challenges.",

        // Mentors Listing Section - Filters & Search (from mentors.html)
        mentorSearchPlaceholder: "Search mentors or expertise...",
        industryLabel: "All Industries", // Label for industry filter dropdown
        tourismIndustry: "Tourism", // Option for industry filter
        digitalIndustry: "Digital Marketing", // Option for industry filter
        artsIndustry: "Arts & Crafts", // Option for industry filter
        environmentalIndustry: "Environmental", // Option for industry filter
        agricultureIndustry: "Agriculture", // Option for industry filter
        hospitalityIndustry: "Hospitality", // Option for industry filter
        technologyIndustry: "Technology", // Option for industry filter
        // Reuses existing location options like panajiOption etc. for mentor location filter
        locationLabel: "All Locations", // Label for location filter

        mentorsFoundText: "mentors found", // Will be prefixed with the number, e.g., "6 mentors found"

        // Mentor Cards (All 6 mentor cards)
        mentor1Name: "Priya Sharma",
        mentor1Role: "Sustainable Tourism Director at Goa Tourism Board",
        mentor1Location: "Panaji",
        mentor1Bio: "Leading sustainable tourism initiatives across Goa with 15+ years of experience in hospitality and eco-tourism development.",
        hospitalityManagementSkill: "Hospitality Management", // New skill tag
        ecoTourismSkill: "Eco-Tourism", // New skill tag (reused from courses as well)
        mentor1Rating: "4.9",
        mentor1Mentees: "45 mentees",
        mentor1Experience: "15+ years", // This is specifically for mentor card experience
        mentor1Availability: "Available for virtual sessions",
        connectWithMentor: "Connect with", // This will be appended with mentor's name

        mentor2Name: "Rajesh Naik",
        mentor2Role: "Digital Marketing Specialist at Freelance Consultant",
        mentor2Location: "Margao",
        mentor2Bio: "Helping Goan businesses grow online with data-driven digital marketing strategies and social media expertise.",
        contentStrategySkill: "Content Strategy", // New skill tag
        mentor2Rating: "4.8",
        mentor2Mentees: "38 mentees",
        mentor2Experience: "12+ years",
        mentor2Availability: "Open to in-person meetings",

        mentor3Name: "Dr. Maria Fernandes",
        mentor3Role: "Marine Conservation Scientist at Goa University",
        mentor3Location: "Dona Paula",
        mentor3Bio: "Research scientist specializing in marine biodiversity conservation and sustainable fishing practices in Goan waters.",
        conservationSkill: "Conservation", // New skill tag
        mentor3Rating: "4.9",
        mentor3Mentees: "28 mentees",
        mentor3Experience: "20+ years",
        mentor3Availability: "Available for research guidance",

        mentor4Name: "Carlos D'Souza",
        mentor4Role: "Traditional Craft Master at Goan Heritage Crafts",
        mentor4Location: "Bicholim",
        mentor4Bio: "Master craftsman preserving and teaching traditional Goan handicrafts including pottery, weaving, and woodwork.",
        potterySkill: "Pottery", // New skill tag
        woodworkingSkill: "Woodworking", // New skill tag
        mentor4Rating: "5",
        mentor4Mentees: "67 mentees",
        mentor4Experience: "25+ years",
        mentor4Availability: "Workshop sessions available",

        mentor5Name: "Anjali Parsekar",
        mentor5Role: "Organic Farming Consultant at Green Goa Initiative",
        mentor5Location: "Sangueum",
        mentor5Bio: "Promoting sustainable agricultural practices and organic farming techniques across rural Goa.",
        permacultureSkill: "Permaculture", // New skill tag
        mentor5Rating: "4.7",
        mentor5Mentees: "52 mentees",
        mentor5Experience: "18+ years",
        mentor5Availability: "Field visits and virtual sessions",

        mentor6Name: "Vikram Kamat",
        mentor6Role: "Tech Entrepreneur at GoaTech Solutions",
        mentor6Location: "Porvorim",
        mentor6Bio: "Serial entrepreneur building tech solutions for local businesses and startups in Goa's growing tech ecosystem.",
        entrepreneurshipSkill: "Entrepreneurship", // New skill tag
        softwareDevelopmentSkill: "Software Development", // New skill tag
        businessStrategySkill: "Business Strategy", // New skill tag
        mentor6Rating: "4.8",
        mentor6Mentees: "34 mentees",
        mentor6Experience: "14+ years",
        mentor6Availability: "Flexible scheduling",

        // About Us Section (from about.html)
        aboutGoaSkillUpConnectTitle: "About SkillConnect", // Title with span
        aboutGoaSkillUpConnectDescription: "We're on a mission to bridge skill gaps and foster economic empowerment in Goa through quality education, innovative training programs, and meaningful mentorship connections.",

        // Mission & Vision Section (from about.html)
        ourMissionTitle: "Our Mission",
        ourMissionDescription: "To empower Goan communities by providing accessible, high-quality skill development opportunities that align with the region's economic needs and cultural values, contributing to the achievement of Sustainable Development Goal 4: Quality Education.",
        ourVisionTitle: "Our Vision",
        ourVisionDescription: "To become Goa's leading platform for skill development and career advancement, creating a thriving ecosystem where traditional knowledge meets modern innovation, and every individual has the opportunity to reach their full potential.",
        whyGoaSkillUpConnectTitle: "Why SkillConnect?",
        whyGoaSkillUpConnectItem1: "Goa-centric curriculum designed for local relevance",
        whyGoaSkillUpConnectItem2: "Direct mentorship from industry professionals",
        whyGoaSkillUpConnectItem3: "Multilingual support in English, Konkani, and Marathi",
        whyGoaSkillUpConnectItem4: "Micro-credentialing for flexible skill validation",

        // Core Values Section (from about.html)
        coreValuesTitle: "Our Core Values",
        coreValuesDescription: "These principles guide everything we do at SkillConnect",
        qualityEducationTitle: "Quality Education",
        qualityEducationDescription: "Committed to delivering high-quality, relevant education aligned with SDG 4 for sustainable development.",
        localImpactTitle: "Local Impact",
        localImpactDescription: "Focused on addressing Goa's unique economic needs while preparing learners for global opportunities.",
        communityDrivenTitle: "Community-Driven",
        communityDrivenDescription: "Built by Goans, for Goans - fostering local talent and preserving cultural values while embracing innovation.",
        inclusiveGrowthTitle: "Inclusive Growth",
        inclusiveGrowthDescription: "Ensuring equal access to skill development opportunities across all communities in Goa.",

        // Meet Our Team Section (from about.html)
        teamTitle: "Meet Our Team",
        teamDescription: "Passionate educators and industry professionals dedicated to Goa's growth",
        member1Initials: "DMF", // Initials for avatar, kept as is for now, could be dynamic in JS
        member1Name: "Dr. Maria Fernandes",
        member1Role: "Founder & CEO",
        member1Specialty: "Educational Technology",
        member1Bio: "Former professor at Goa University with 15+ years in skill development.",
        member2Initials: "RK",
        member2Name: "Rajesh Kamat",
        member2Role: "Head of Partnerships",
        member2Specialty: "Industry Relations",
        member2Bio: "Connecting local businesses with skilled talent across Goa.",
        member3Initials: "PD",
        member3Name: "Priya Dessai",
        member3Role: "Community Outreach",
        member3Specialty: "Social Impact",
        member3Bio: "Passionate about inclusive education and community empowerment.",

        // Our Impact Goals Section (from about.html)
        impactGoalsTitle: "Our Impact Goals",
        impactGoalsDescription: "By 2030, we aim to have trained 10,000+ Goans in relevant skills, facilitated 500+ mentorship connections, and supported 1,000+ local job placements, contributing significantly to Goa's sustainable economic development.",
        skilledGraduatesCount: "10,000+",
        skilledGraduatesLabel: "Skilled Graduates",
        mentorshipConnectionsCount: "500+",
        mentorshipConnectionsLabel: "Mentorship Connections",
        jobPlacementsCount: "1,000+",
        jobPlacementsLabel: "Job Placements",
        joinOurMissionButton: "Join Our Mission",

        // Discover Your Perfect Course Section (specific to courses.html)
        discoverCourseTitle: "Discover Your Perfect Course",
        discoverCourseDescription: "Explore our comprehensive catalog of skill-building courses designed specifically for Goa's evolving economy",
        searchPlaceholder: "Search courses, skills, or providers...", // Reused, but specific context
        categoryLabel: "Category", // New label for course filter
        durationLabel: "Duration", // New label for course filter
        difficultyLabel: "Difficulty", // New label for course filter
        sortByLabel: "Sort By", // New label for course filter
        onlineOption: "Online", // New option for location filter (course-specific)
        shortDurationOption: "Less than 8 weeks", // New duration option
        mediumDurationOption: "8-12 weeks", // New duration option
        longDurationOption: "More than 12 weeks", // New duration option
        beginnerOption: "Beginner", // Reused, but specific context for course difficulty
        intermediateOption: "Intermediate", // Reused, but specific context for course difficulty
        advancedOption: "Advanced", // Reused, but specific context for course difficulty
        popularityOption: "Popularity", // New sort by option
        newestOption: "Newest", // New sort by option
        ratingOption: "Rating", // New sort by option
        certifiedCoursesOnlyLabel: "Certified courses only", // New checkbox label

        // Course Listing Section (specific to courses.html)
        showingCoursesText: "Showing of courses", // Will be dynamically filled "Showing X of Y courses"
        certifiedTag: "Certified", // Course card tag
        nonCertifiedTag: "Non-certified", // Course card tag
        intermediateLevelTag: "Intermediate", // Course card level tag
        beginnerLevelTag: "Beginner", // Course card level tag
        advancedLevelTag: "Advanced", // Course card level tag

        listTourismTitle: "Sustainable Tourism Guide Certification",
        listTourismDesc: "Learn to create eco-friendly tourism experiences while preserving Goa's natural beauty and cultural heritage.",
        ecoTourismSkill: "Eco-tourism", // New skill
        heritageConservationSkill: "Heritage Conservation", // New skill
        guestRelationsSkill: "Guest Relations", // Reused from jobs, but added here too
        listTourismDuration: "6 weeks",
        listTourismRating: "4.8 (124)",
        listTourismLocation: "Panaji",
        listTourismStudents: "124 students",
        listTourismProvider: "Provider: Goa Tourism Board",
        listTourismPrice: "₹8,499",
        enrollNow: "Enroll Now",

        listAyurvedicTitle: "Ayurvedic Wellness Therapy",
        listAyurvedicDesc: "Traditional Ayurvedic massage and wellness practices for the growing wellness tourism sector.",
        ayurvedicPrinciplesSkill: "Ayurvedic Principles", // New skill
        massageTechniquesSkill: "Massage Techniques", // New skill
        herbalMedicineSkill: "Herbal Medicine", // New skill
        listAyurvedicDuration: "14 weeks",
        listAyurvedicRating: "4.7 (112)",
        listAyurvedicLocation: "Margao",
        listAyurvedicStudents: "112 students",
        listAyurvedicProvider: "Provider: Ayurveda Institute Goa",
        listAyurvedicPrice: "₹5,999",

        listDigitalMarketingTitle: "Digital Marketing for Local Businesses",
        listDigitalMarketingDesc: "Master online marketing strategies tailored for Goan businesses and the hospitality industry.",
        contentCreationSkill: "Content Creation", // New skill
        listDigitalMarketingDuration: "4 weeks",
        listDigitalMarketingRating: "4.6 (89)",
        listDigitalMarketingLocation: "Online",
        listDigitalMarketingStudents: "89 students",
        listDigitalMarketingProvider: "Provider: Tech Goa Institute",
        listDigitalMarketingPrice: "₹5,199",

        listOrganicFarmingTitle: "Organic Farming & Spice Cultivation",
        listOrganicFarmingDesc: "Learn sustainable farming techniques focusing on Goa's traditional spices and crop.",
        organicMethodsSkill: "Organic Methods", // New skill
        spiceCultivationSkill: "Spice Cultivation", // New skill
        soilManagementSkill: "Soil Management", // New skill
        listOrganicFarmingDuration: "10 weeks",
        listOrganicFarmingRating: "4.5 (78)",
        listOrganicFarmingLocation: "Ponda",
        listOrganicFarmingStudents: "78 students",
        listOrganicFarmingProvider: "Provider: Goa Agricultural University",
        listOrganicFarmingPrice: "₹7,499",

        listMarineConservationTitle: "Marine Conservation & Research",
        listMarineConservationDesc: "Comprehensive program on marine biodiversity conservation along Goa's coastline.",
        dataCollectionSkill: "Data Collection", // New skill
        listMarineConservationDuration: "12 weeks",
        listMarineConservationRating: "4.7 (67)",
        listMarineConservationLocation: "Dona Paula",
        listMarineConservationStudents: "67 students",
        listMarineConservationProvider: "Provider: National Institute of Oceanography",
        listMarineConservationPrice: "₹6,999",

        listGoanPotteryTitle: "Traditional Goan Craft Pottery",
        listGoanPotteryDesc: "Learn the ancient art of Goan pottery making with master craftsmen from Bicholim.",
        clayModelingSkill: "Clay Modeling", // New skill
        traditionalTechniquesSkill: "Traditional Techniques", // New skill
        glazingSkill: "Glazing", // New skill
        listGoanPotteryDuration: "8 weeks",
        listGoanPotteryRating: "4.9 (45)",
        listGoanPotteryLocation: "Bicholim",
        listGoanPotteryStudents: "45 students",
        listGoanPotteryProvider: "Provider: Goa Handicrafts Council",
        listGoanPotteryPrice: "₹6,799",


        // Get in Touch Section (from contact.html)
        getInTouchTitle: "Get in Touch",
        getInTouchDescription: "Have questions about our courses, mentorship programs, or career opportunities? We're here to help you navigate your skill development journey in Goa.",
        formCardTitle: "Send us a Message",
        formCardDescription: "Fill out the form below and we'll get back to you as soon as possible.",
        fullNameLabel: "Full Name",
        emailAddressLabel: "Email Address",
        subjectLabel: "Subject",
        messageLabel: "Message",
        fullNamePlaceholder: "Your full name",
        emailAddressPlaceholder: "your.email@example.com",
        subjectPlaceholder: "What's this about?",
        messagePlaceholder: "Tell us more about your inquiry...",
        sendMessageButton: "Send Message",
        contactInfoCardTitle: "Contact Information",
        contactInfoCardDescription: "Multiple ways to reach our team",
        emailUsLabel: "Email Us",
        contactEmailValue: "hello@goaskillup.org", // Specific email shown
        emailSubtext: "Send us an email anytime",
        callUsLabel: "Call Us",
        contactPhoneNumber: "+91 832 123 4567", // Specific phone shown
        phoneHours: "Mon-Fri from 9am to 6pm",
        visitUsLabel: "Visit Us",
        contactAddressMain: "Panaji, Goa 403001", // Specific address shown
        mainOfficeSubtext: "Our main office location",
        officeHoursLabel: "Office Hours",
        officeHoursTime: "9:00 AM - 6:00 PM",
        officeHoursDays: "Monday to Friday",
        locationsCardTitle: "Our Locations",
        locationsCardDescription: "Find us across Goa",
        panajiLocationName: "Panaji", // For location name in list item
        // mainOfficeTag: "Main Office", // Already handled by mainOfficeTag key
        panajiAddress: "EDC Complex, Patto Plaza, Panaji, Goa 403001",
        panajiPhoneValue: "+91 832 123 4567",
        margaoLocationName: "Margao",
        margaoAddress: "Grace Building, Margao, Goa 403801",
        margaoPhoneValue: "+91 832 765 4321",
        pondaLocationName: "Ponda",
        pondaAddress: "Community Center, Ponda, Goa 403401",
        pondaPhoneValue: "+91 832 567 8901",

        // FAQ Section (from contact.html)
        faqHeading: "Frequently Asked Questions",
        faqQuestion1: "How do I enroll in a course?",
        faqAnswer1: "Browse our course directory, select a course that interests you, and click 'Enroll Now'. You'll be guided through the registration process.",
        faqQuestion2: "Are the courses certified?",
        faqAnswer2: "Many of our courses offer certifications. Look for the \"Certified\" badge on course listings to identify which ones provide official certificates.",
        faqQuestion3: "Can I get mentorship support?",
        faqAnswer3: "Yes! We have a network of experienced Goan professionals who provide mentorship. Visit our Mentors page to connect with them.",
        faqQuestion4: "Is financial assistance available?",
        faqAnswer4: "We offer various scholarship and payment plan options. Contact us to discuss your specific situation and available support.",

        // Footer
        footerLogoText: "SkillConnect",
        footerDescription: "Empowering Goan communities through quality education, skill development, and career opportunities aligned with sustainable development goals.",
        quickLinksHeading: "Quick Links",
        supportHeading: "Support",
        helpCenter: "Help Center",
        privacyPolicy: "Privacy Policy",
        termsOfService: "Terms of Service",
        contactUs: "Contact Us",
        contactInfoHeading: "Contact Info",
        contactEmail: "hello@SkillConnect.com",
        contactPhone: "+91 832 XXXX XXXX",
        contactAddress: "Panaji, Goa, India",
        copyrightText: "&copy; 2025 SkillConnect. All rights reserved. Committed to Quality Education (SDG 4)."
    },
    kok: {
        // Navbar
        logoText: "स्किलकनेक्ट",
        home: "मुख्य पान",
        aboutUs: "आमच्या बद्दल",
        courses: "अभ्यासक्रम",
        mentors: "मार्गदर्शक",
        jobs: "नोकरी",
        contact: "संपर्क",
        more: "आणखी",
        login: "लॉगिन करा",

        // Hero Section
        heroTitle: "तुमची क्षमता उघडा: गोव्याच्या भविष्यासाठी कौशल्ये वाढवा!",
        heroDescription: "गोव्याच्या वाढत्या अर्थव्यवस्थेसाठी तयार केलेल्या व्यावसायिक प्रशिक्षण, मार्गदर्शन आणि करिअरच्या संधींद्वारे गोव्यातील तरुण आणि प्रौढांना जोडणे.",
        exploreCourses: "अभ्यासक्रम शोधा",
        findMentor: "मार्गदर्शक शोधा",
        coursesCount: "५००+",
        coursesLabel: "अभ्यासक्रम उपलब्ध",
        mentatorsCount: "१५०+",
        mentatorsLabel: "तज्ञ मार्गदर्शक",
        successCount: "१०००+",
        successLabel: "यशस्वी कथा",
        newCourseTag: "नवीन अभ्यासक्रम",
        sustainableFutureTag: "शाश्वत भविष्य",

        // Featured Courses Section
        featuredCoursesTitle: "वैशिष्ट्यपूर्ण अभ्यासक्रम श्रेणी",
        featuredCoursesDescription: "गोव्याच्या भविष्यासाठी महत्त्वाचे कौशल्ये शोधा. शाश्वत पर्यटनापासून डिजिटल इनोव्हेशनपर्यंत, स्थानिक प्रासंगिकता आणि जागतिक प्रभावासाठी डिझाइन केलेले अभ्यासक्रम शोधा.",
        tourismTag: "पर्यटन",
        sustainableTourismTitle: "शाश्वत पर्यटन व्यवस्थापन",
        sustainableTourismDesc: "गोव्याचे नैसर्गिक सौंदर्य जपताना आणि स्थानिक अर्थव्यवस्थेला चालना देताना पर्यावरणास अनुकूल पर्यटन पद्धती विकसित करण्यास शिका.",
        tourismDuration: "८ आठवडे",
        tourismLocation: "पणजी",
        tourismRating: "४.८",
        tourismStudents: "१२०",
        tourismPrice: "₹२,४९९",
        tourismLevel: "नवशिक्या",
        learnMore: "अधिक जाणून घ्या",
        digitalSkillsTag: "डिजिटल कौशल्ये",
        digitalMarketingTitle: "स्थानिक व्यवसायांसाठी डिजिटल मार्केटिंग",
        digitalMarketingDesc: "स्थानिक आकर्षण टिकवून गोव्यातील व्यवसायांना जागतिक स्तरावर पोहोचण्यास मदत करण्यासाठी ऑनलाइन मार्केटिंग रणनीतीमध्ये प्रभुत्व मिळवा.",
        digitalDuration: "६ आठवडे",
        digitalMode: "ऑनलाइन",
        digitalRating: "४.९",
        digitalStudents: "९५",
        digitalPrice: "₹३,१९९",
        digitalLevel: "मध्यम",
        artsCraftsTag: "कला आणि हस्तकला",
        goanCraftTitle: "पारंपरिक गोव्याची हस्तकला पुनरुज्जीवन",
        goanCraftDesc: "समकालीन डिझाइन आणि मार्केटिंग तंत्रांसह पारंपरिक गोव्याच्या हस्तकलांचे जतन आणि आधुनिकीकरण करा.",
        craftDuration: "१० आठवडे",
        craftLocation: "मडगाव",
        craftRating: "४.७",
        craftStudents: "७८",
        craftPrice: "₹१,७९९",
        craftLevel: "सर्व स्तर",
        environmentalTag: "पर्यावरण",
        marineConservationTitle: "समुद्री संवर्धन आणि संशोधन",
        marineConservationDesc: "गोव्याच्या किनारपट्टीवरील परिसंस्थेचे संरक्षण करण्यासाठी सागरी जीवशास्त्र आणि संवर्धनातील कौशल्ये विकसित करा.",
        marineDuration: "१२ आठवडे",
        marineLocation: "वास्को द गामा",
        marineRating: "४.९",
        marineStudents: "५६",
        marinePrice: "₹४,४९९",
        marineLevel: "प्रगत",
        viewAllCourses: "सर्व अभ्यासक्रम पहा",

        // How It Works Section
        howItWorksTitle: "ते कसे कार्य करते",
        howItWorksDescription: "कौशल्य प्राविण्य आणि करिअरच्या यशाचा तुमचा प्रवास येथून सुरू होतो. तुमची क्षमता अनलॉक करण्यासाठी या सोप्या चरणांचे अनुसरण करा.",
        discoverCoursesTitle: "अभ्यासक्रम शोधा",
        discoverCoursesDesc: "गोव्याच्या अनन्य संधींसाठी तयार केलेल्या कौशल्य-आधारित अभ्यासक्रमांची आमची विस्तृत सूची ब्राउझ करा.",
        connectMentorsTitle: "मार्गदर्शकांशी कनेक्ट व्हा",
        connectMentorsDesc: "तुमच्या शिकण्याच्या प्रवासात आणि करिअरच्या मार्गात मार्गदर्शन करणाऱ्या अनुभवी व्यावसायिकांशी जुळा.",
        buildPortfolioTitle: "तुमचा पोर्टफोलिओ तयार करा",
        buildPortfolioDesc: "मायक्रो-क्रेडेंशियल्स मिळवा आणि तुमच्या नवीन प्राप्त केलेल्या कौशल्यांचे प्रदर्शन करणारा डिजिटल पोर्टफोलिओ तयार करा.",
        findOpportunitiesTitle: "संधी शोधा",
        findOpportunitiesDesc: "SkillConnect क्रेडेंशियल्सला महत्त्व देणाऱ्या स्थानिक नियोक्त्यांकडून संधी दर्शविणाऱ्या आमच्या जॉब बोर्डमध्ये प्रवेश करा.",
        readyToStart: "तुमचा प्रवास सुरू करण्यास तयार आहात?",

        // Jobs Hero Section
        jobsHeroTitle: "गोव्यातील नोकरीच्या संधी",
        jobsHeroDescription: "तुमच्या कौशल्यांशी जुळणाऱ्या आणि गोव्याच्या वाढत्या अर्थव्यवस्थेत योगदान देणाऱ्या करिअरच्या संधी शोधा.",

        // Job Listing Section - Filters & Search
        jobSearchPlaceholder: "नोकरी, कंपन्या किंवा कौशल्ये शोधा...",
        allCategoriesLabel: "सर्व श्रेणी",
        allLocationsLabel: "सर्व ठिकाणे",
        allTypesLabel: "सर्व प्रकार",
        all: "सर्व",
        panajiOption: "पणजी",
        margaoOption: "मडगाव",
        vascoOption: "वास्को द गामा",
        bicholimOption: "बिचोली",
        pondaOption: "फोंडा",
        donaPaulaOption: "दोना पावला",
        sangueumOption: "सांगे",
        porvorimOption: "परवरी",
        fullTimeOption: "पूर्णवेळ",
        partTimeOption: "अंशवेळ",
        contractOption: "करार",
        internshipOption: "इंटर्नशिप",
        remoteOption: "रिमोट",
        clearFilters: "फिल्टर साफ करा",
        jobsFoundText: "नोकऱ्या सापडल्या",

        // Job Cards
        job1Title: "शाश्वत पर्यटन व्यवस्थापक",
        job1Company: "गोवा पर्यटन विकास महामंडळ",
        job1Location: "पणजी",
        fullTimeTag: "पूर्णवेळ",
        experienceTag: "वर्षे",
        job1Desc: "गोव्याच्या नैसर्गिक सौंदर्य आणि सांस्कृतिक वारसा जतन करताना पर्यावरणास अनुकूल पर्यटन पद्धती विकसित करून गोव्यात शाश्वत पर्यटन उपक्रमांचे नेतृत्व करा.",
        sustainableTourismSkill: "शाश्वत पर्यटन",
        projectManagementSkill: "प्रकल्प व्यवस्थापन",
        communityEngagementSkill: "समुदाय सहभाग",
        marketingSkill: "विपणन",
        plusOneMore: "+१ अधिक",
        job1Salary: "₹18,000.00 - ₹22,000.00 प्रति वर्ष",
        job1Deadline: "अर्जाची अंतिम मुदत: १५ दिवस बाकी",
        applyNow: "आता अर्ज करा",
        details: "तपशील",

        job2Title: "डिजिटल मार्केटिंग विशेषज्ञ",
        job2Company: "गोवा टेक सोल्युशन्स",
        job2Location: "रिमोट",
        job2Desc: "सोशल मीडिया, एसईओ आणि कंटेंट मार्केटिंगवर लक्ष केंद्रित करून स्थानिक व्यवसायांसाठी डिजिटल मार्केटिंग मोहिमा चालवा.",
        socialMediaMarketingSkill: "सोशल मीडिया मार्केटिंग",
        seoSkill: "एसईओ",
        googleAdsSkill: "गुगल ॲड्स",
        job2Salary: "₹15,000.00 - ₹18,000.00 प्रति वर्ष",
        job2Deadline: "अर्जाची अंतिम मुदत: ३० दिवस बाकी",

        job3Title: "समुद्री जीवशास्त्र संशोधन सहाय्यक",
        job3Company: "गोवा विद्यापीठ - सागरी विज्ञान विभाग",
        job3Location: "दोना पावला",
        contractTag: "करार",
        researchTag: "संशोधन",
        job3Desc: "गोव्याच्या किनारपट्टीवर सागरी जैवविविधता संशोधन प्रकल्पांना समर्थन द्या, ज्यात डेटा संकलन, विश्लेषण आणि क्षेत्रीय कार्य यांचा समावेश आहे.",
        marineBiologySkill: "समुद्री जीवशास्त्र",
        researchMethodsSkill: "संशोधन पद्धती",
        dataAnalysisSkill: "डेटा विश्लेषण",
        fieldWorkSkill: "क्षेत्रीय कार्य",
        job3Salary: "₹3,500.00 - ₹5,000.00 प्रति महिना",
        job3Deadline: "अर्जाची अंतिम मुदत: ३ दिवस बाकी",

        job4Title: "पारंपरिक हस्तकला प्रशिक्षक",
        job4Company: "गोवा हेरिटेज फाउंडेशन",
        job4Location: "बिचोली",
        partTimeTag: "अंशवेळ",
        educationTag: "शिक्षण",
        job4Desc: "सांस्कृतिक वारसा जतन करण्यासाठी मातीची भांडी, विणकाम आणि लाकडी काम यासह पारंपारिक गोव्यातील हस्तकला शिकवा.",
        traditionalCraftsSkill: "पारंपरिक हस्तकला",
        teachingSkill: "शिक्षण",
        culturalHeritageSkill: "सांस्कृतिक वारसा",
        workshopManagementSkill: "कार्यशाळा व्यवस्थापन",
        job4Salary: "₹2,500.00 - ₹4,000.00 प्रति दिन",
        job4Deadline: "अर्जाची अंतिम मुदत: ५ दिवस बाकी",

        job5Title: "सेंद्रिय शेत व्यवस्थापक",
        job5Company: "ग्रीन गोवा फार्म्स",
        job5Location: "सांगे",
        agricultureTag: "शेती",
        job5Desc: "सेंद्रिय शेतीचे कार्य व्यवस्थापित करा, शाश्वत कृषी पद्धती लागू करा आणि स्थानिक शेती समुदायांशी समन्वय साधा.",
        organicFarmingSkill: "सेंद्रिय शेती",
        sustainableAgricultureSkill: "शाश्वत शेती",
        teamManagementSkill: "संघ व्यवस्थापन",
        cropPlanningSkill: "पीक नियोजन",
        job5Salary: "₹14,000.00 - ₹18,000.00 प्रति महिना",
        job5Deadline: "अर्जाची अंतिम मुदत: १ आठवडा बाकी",

        job6Title: "फुल स्टॅक डेव्हलपर",
        job6Company: "स्टार्टअप गोवा इनक्यूबेटर",
        job6Location: "परवरी",
        technologyTag: "तंत्रज्ञान",
        job6Desc: "स्थानिक स्टार्टअप्ससाठी वेब ॲप्लिकेशन्स विकसित करा, आधुनिक टेक स्टॅकवर काम करा आणि गोव्याच्या टेक इकोसिस्टममध्ये योगदान द्या.",
        reactJsSkill: "रिॲक्ट.जेएस",
        nodeJsSkill: "नोड.जेएस",
        mongoDbSkill: "मोंगोडीबी",
        awsSkill: "एडब्ल्यूएस",
        plusTwoMore: "+२ अधिक",
        job6Salary: "₹18,000.00 - ₹22,000.00 प्रति वर्ष",
        job6Deadline: "अर्जाची अंतिम मुदत: १५ दिवस बाकी",

        job7Title: "आतिथ्य ऑपरेशन इंटर्न",
        job7Company: "ताज हॉटेल्स - गोवा",
        job7Location: "कँडोलिम",
        internshipTag: "इंटर्नशिप",
        hospitalityTag: "आतिथ्य",
        experienceTagEntry: "प्रारंभिक स्तर",
        job7Desc: "लक्झरी रिसॉर्टमध्ये हॉटेल ऑपरेशन, अतिथी सेवा आणि आतिथ्य व्यवस्थापनामध्ये व्यावहारिक अनुभव मिळवा.",
        customerServiceSkill: "ग्राहक सेवा",
        hotelOperationsSkill: "हॉटेल ऑपरेशन्स",
        guestRelationsSkill: "अतिथी संबंध",
        eventManagementSkill: "इव्हेंट व्यवस्थापन",
        job7Salary: "₹10,000.00 - ₹20,000.00 प्रति महिना",
        job7Deadline: "अर्जाची अंतिम मुदत: ३० दिवस बाकी",

        job8Title: "फ्रीलान्स कंटेंट क्रिएटर",
        job8Company: "गोवा कंटेंट कलेक्टिव्ह",
        job8Location: "रिमोट",
        remoteTag: "रिमोट",
        contentTag: "सामग्री",
        job8Desc: "गोव्याची संस्कृती, पर्यटन आणि जीवनशैलीबद्दल विविध डिजिटल प्लॅटफॉर्म आणि कंटेंट मार्केटिंगसाठी आकर्षक सामग्री तयार करा.",
        contentWritingSkill: "सामग्री लेखन",
        socialMediaSkill: "सोशल मीडिया",
        photographySkill: "फोटोग्राफी",
        videoEditingSkill: "व्हिडिओ संपादन",
        job8Salary: "₹500.00 - ₹2,000.00 प्रति नमुना",
        job8Deadline: "अर्जाची अंतिम मुदत: ६ दिवस बाकी",

        // Mentors Hero Section
        mentorsHeroTitle: "मार्गदर्शकांशी संपर्क साधा",
        mentorsHeroDescription: "उद्योग तज्ञांकडून आणि अनुभवी व्यावसायिकांकडून शिका जे अनन्य संधी आणि आव्हाने समजून घेतात.",

        // Mentors Listing Section - Filters & Search
        mentorSearchPlaceholder: "मार्गदर्शक किंवा कौशल्ये शोधा...",
        industryLabel: "सर्व उद्योग",
        tourismIndustry: "पर्यटन",
        digitalIndustry: "डिजिटल विपणन",
        artsIndustry: "कला आणि हस्तकला",
        environmentalIndustry: "पर्यावरण",
        agricultureIndustry: "शेती",
        hospitalityIndustry: "आतिथ्य",
        technologyIndustry: "तंत्रज्ञान",
        locationLabel: "सर्व ठिकाणे",

        mentorsFoundText: "मार्गदर्शक सापडले",

        // Mentor Cards
        mentor1Name: "प्रिया शर्मा",
        mentor1Role: "गोवा पर्यटन मंडळात शाश्वत पर्यटन संचालक",
        mentor1Location: "पणजी",
        mentor1Bio: "आतिथ्य आणि पर्यावरण-पर्यटन विकासात १५+ वर्षांच्या अनुभवासह गोव्यात शाश्वत पर्यटन उपक्रमांचे नेतृत्व करत आहे.",
        hospitalityManagementSkill: "आतिथ्य व्यवस्थापन",
        ecoTourismSkill: "पर्यावरण-पर्यटन",
        mentor1Rating: "४.९",
        mentor1Mentees: "४५ प्रशिक्षणार्थी",
        mentor1Experience: "१५+ वर्षे",
        mentor1Availability: "व्हर्च्युअल सत्रांसाठी उपलब्ध",
        connectWithMentor: "यांच्याशी संपर्क साधा",

        mentor2Name: "राजेश नाईक",
        mentor2Role: "फ्रीलान्स सल्लागार म्हणून डिजिटल मार्केटिंग विशेषज्ञ",
        mentor2Location: "मडगाव",
        mentor2Bio: "डेटा-आधारित डिजिटल मार्केटिंग रणनीती आणि सोशल मीडिया कौशल्याने गोव्यातील व्यवसायांना ऑनलाइन वाढण्यास मदत करत आहे.",
        contentStrategySkill: "सामग्री रणनीती",
        mentor2Rating: "४.८",
        mentor2Mentees: "३८ प्रशिक्षणार्थी",
        mentor2Experience: "१२+ वर्षे",
        mentor2Availability: "प्रत्यक्ष भेटींसाठी खुले",

        mentor3Name: "डॉ. मारिया फर्नांडिस",
        mentor3Role: "गोवा विद्यापीठात सागरी संवर्धन शास्त्रज्ञ",
        mentor3Location: "दोना पावला",
        mentor3Bio: "गोव्याच्या पाण्यातील सागरी जैवविविधता संवर्धन आणि शाश्वत मासेमारी पद्धतींमध्ये विशेष संशोधन वैज्ञानिक.",
        conservationSkill: "संवर्धन",
        mentor3Rating: "४.९",
        mentor3Mentees: "२८ प्रशिक्षणार्थी",
        mentor3Experience: "२०+ वर्षे",
        mentor3Availability: "संशोधन मार्गदर्शनासाठी उपलब्ध",

        mentor4Name: "कार्लोस डिसोझा",
        mentor4Role: "गोवा हेरिटेज क्राफ्ट्समध्ये पारंपरिक हस्तकला मास्टर",
        mentor4Location: "बिचोली",
        mentor4Bio: "मातीची भांडी, विणकाम आणि लाकडी कामासह पारंपरिक गोव्याच्या हस्तकला जतन आणि शिकवणारे कुशल कारागीर.",
        potterySkill: "मातीची भांडी",
        woodworkingSkill: "लाकडी काम",
        mentor4Rating: "५",
        mentor4Mentees: "६७ प्रशिक्षणार्थी",
        mentor4Experience: "२५+ वर्षे",
        mentor4Availability: "कार्यशाळा सत्रे उपलब्ध",

        mentor5Name: "अंजली पार्सेकर",
        mentor5Role: "ग्रीन गोवा इनिशिएटिव्हमध्ये सेंद्रिय शेती सल्लागार",
        mentor5Location: "सांगे",
        mentor5Bio: "ग्रामीण गोव्यामध्ये शाश्वत कृषी पद्धती आणि सेंद्रिय शेती तंत्रांना प्रोत्साहन देत आहे.",
        permacultureSkill: "परमॅकल्चर",
        mentor5Rating: "४.७",
        mentor5Mentees: "५२ प्रशिक्षणार्थी",
        mentor5Experience: "१८+ वर्षे",
        mentor5Availability: "क्षेत्रीय भेटी आणि व्हर्च्युअल सत्रे",

        mentor6Name: "विक्रम कामत",
        mentor6Role: "गोवाटेक सोल्युशन्समध्ये टेक उद्योजक",
        mentor6Location: "परवरी",
        mentor6Bio: "गोव्याच्या वाढत्या टेक इकोसिस्टममध्ये स्थानिक व्यवसायांसाठी आणि स्टार्टअप्ससाठी टेक सोल्यूशन्स तयार करणारा सिरियल उद्योजक.",
        entrepreneurshipSkill: "उद्योजकता",
        softwareDevelopmentSkill: "सॉफ्टवेअर विकास",
        businessStrategySkill: "व्यवसाय रणनीती",
        mentor6Rating: "४.८",
        mentor6Mentees: "३४ प्रशिक्षणार्थी",
        mentor6Experience: "१४+ वर्षे",
        mentor6Availability: "लवकर वेळापत्रक",

        // About Us Section
        aboutGoaSkillUpConnectTitle: "आमच्या बद्दल स्किलकनेक्ट",
        aboutGoaSkillUpConnectDescription: "आम्ही गुणवत्तापूर्ण शिक्षण, अभिनव प्रशिक्षण कार्यक्रम आणि अर्थपूर्ण मार्गदर्शन संबंधांद्वारे गोव्यात कौशल्य अंतर कमी करण्यासाठी आणि आर्थिक सक्षमीकरणास प्रोत्साहन देण्यासाठी मिशनवर आहोत.",

        // Mission & Vision Section
        ourMissionTitle: "आमचे ध्येय",
        ourMissionDescription: "गोव्याच्या आर्थिक गरजा आणि सांस्कृतिक मूल्यांशी जुळणाऱ्या सुलभ, उच्च-गुणवत्तेच्या कौशल्य विकास संधी प्रदान करून गोव्यातील समुदायांना सक्षम करणे, शाश्वत विकास लक्ष्य ४: गुणवत्तापूर्ण शिक्षणाच्या प्राप्तीमध्ये योगदान देणे.",
        ourVisionTitle: "आमची दृष्टी",
        ourVisionDescription: "कौशल्य विकास आणि करिअर प्रगतीसाठी गोव्याचे अग्रगण्य व्यासपीठ बनणे, एक भरभराटीची परिसंस्था निर्माण करणे जिथे पारंपरिक ज्ञान आधुनिक नवोपक्रमांशी मिळते आणि प्रत्येक व्यक्तीला त्यांची पूर्ण क्षमता गाठण्याची संधी मिळते.",
        whyGoaSkillUpConnectTitle: "स्किलकनेक्ट का?",
        whyGoaSkillUpConnectItem1: "स्थानिक प्रासंगिकतेसाठी डिझाइन केलेला गोवा-केंद्रित अभ्यासक्रम",
        whyGoaSkillUpConnectItem2: "उद्योग व्यावसायिकांकडून थेट मार्गदर्शन",
        whyGoaSkillUpConnectItem3: "इंग्रजी, कोंकणी आणि मराठीमध्ये बहुभाषिक समर्थन",
        whyGoaSkillUpConnectItem4: "लवकर कौशल्य प्रमाणीकरणासाठी मायक्रो-क्रेडेंशिअलिंग",

        // Core Values Section
        coreValuesTitle: "आमची मूळ मूल्ये",
        coreValuesDescription: "ही तत्त्वे स्किलकनेक्टमध्ये आम्ही जे काही करतो त्याला मार्गदर्शन करतात",
        qualityEducationTitle: "गुणवत्ता शिक्षण",
        qualityEducationDescription: "शाश्वत विकासासाठी SDG ४ शी जुळणारे उच्च-गुणवत्तेचे, संबंधित शिक्षण देण्यासाठी वचनबद्ध.",
        localImpactTitle: "स्थानिक प्रभाव",
        localImpactDescription: "जागतिक संधींसाठी शिक्षणार्थींना तयार करताना गोव्याच्या अनन्य आर्थिक गरजा पूर्ण करण्यावर लक्ष केंद्रित केले आहे.",
        communityDrivenTitle: "समुदाय-आधारित",
        communityDrivenDescription: "गोवेकरांनी, गोवेकरांसाठी तयार केलेले - स्थानिक प्रतिभेला प्रोत्साहन देणे आणि नवोपक्रम स्वीकारताना सांस्कृतिक मूल्यांचे जतन करणे.",
        inclusiveGrowthTitle: "समावेशक वाढ",
        inclusiveGrowthDescription: "गोव्यातील सर्व समुदायांमध्ये कौशल्य विकासाच्या संधींसाठी समान प्रवेश सुनिश्चित करणे.",

        // Meet Our Team Section
        teamTitle: "आमच्या टीमला भेटा",
        teamDescription: "गोव्याच्या वाढीसाठी समर्पित असलेले उत्साही शिक्षक आणि उद्योग व्यावसायिक",
        member1Initials: "डी.एम.एफ",
        member1Name: "डॉ. मारिया फर्नांडिस",
        member1Role: "संस्थापक आणि सीईओ",
        member1Specialty: "शैक्षणिक तंत्रज्ञान",
        member1Bio: "गोवा विद्यापीठातील माजी प्राध्यापक, कौशल्य विकासात १५+ वर्षांचा अनुभव.",
        member2Initials: "आर.के.",
        member2Name: "राजेश कामत",
        member2Role: "भागीदारी प्रमुख",
        member2Specialty: "उद्योग संबंध",
        member2Bio: "गोव्यातील स्थानिक व्यवसायांना कुशल प्रतिभेशी जोडणे.",
        member3Initials: "पी.डी.",
        member3Name: "प्रिया देसाई",
        member3Role: "समुदाय संपर्क",
        member3Specialty: "सामाजिक प्रभाव",
        member3Bio: "समावेशक शिक्षण आणि समुदाय सक्षमीकरणाबद्दल उत्साही.",

        // Our Impact Goals Section
        impactGoalsTitle: "आमची प्रभाव लक्ष्ये",
        impactGoalsDescription: "२०३० पर्यंत, आम्ही १०,०००+ गोवेकरांना संबंधित कौशल्यांमध्ये प्रशिक्षित करण्याचे, ५००+ मार्गदर्शन संबंध सुलभ करण्याचे आणि १,०००+ स्थानिक नोकरी प्लेसमेंटला समर्थन देण्याचे लक्ष्य ठेवले आहे, ज्यामुळे गोव्याच्या शाश्वत आर्थिक विकासात महत्त्वपूर्ण योगदान मिळेल.",
        skilledGraduatesCount: "१०,०००+",
        skilledGraduatesLabel: "कुशल पदवीधर",
        mentorshipConnectionsCount: "५००+",
        mentorshipConnectionsLabel: "मार्गदर्शन संबंध",
        jobPlacementsCount: "१,०००+",
        jobPlacementsLabel: "नोकरी प्लेसमेंट",
        joinOurMissionButton: "आमच्या मिशनमध्ये सामील व्हा",

        // Discover Your Perfect Course Section
        discoverCourseTitle: "तुमचा परिपूर्ण अभ्यासक्रम शोधा",
        discoverCourseDescription: "गोव्याच्या विकसनशील अर्थव्यवस्थेसाठी विशेषतः डिझाइन केलेल्या कौशल्य-निर्मिती अभ्यासक्रमांची आमची विस्तृत सूची एक्सप्लोर करा.",
        searchPlaceholder: "अभ्यासक्रम, कौशल्ये किंवा प्रदाते शोधा...",
        categoryLabel: "श्रेणी",
        durationLabel: "कालावधी",
        difficultyLabel: "कठीणता",
        sortByLabel: "यानुसार क्रमवारी लावा",
        onlineOption: "ऑनलाइन",
        shortDurationOption: "८ आठवड्यांपेक्षा कमी",
        mediumDurationOption: "८-१२ आठवडे",
        longDurationOption: "१२ आठवड्यांपेक्षा जास्त",
        beginnerOption: "नवशिक्या",
        intermediateOption: "मध्यम",
        advancedOption: "प्रगत",
        popularityOption: "लोकप्रियता",
        newestOption: "नवीनतम",
        ratingOption: "रेटिंग",
        certifiedCoursesOnlyLabel: "फक्त प्रमाणित अभ्यासक्रम",

        // Course Listing Section
        showingCoursesText: "अभ्यासक्रम दाखवत आहे", // Will be dynamically filled "Showing X of Y courses"
        certifiedTag: "प्रमाणित",
        nonCertifiedTag: "गैर-प्रमाणित",
        intermediateLevelTag: "मध्यम",
        beginnerLevelTag: "नवशिक्या",
        advancedLevelTag: "प्रगत",
        listTourismTitle: "शाश्वत पर्यटन मार्गदर्शक प्रमाणपत्र",
        listTourismDesc: "गोव्याचे नैसर्गिक सौंदर्य आणि सांस्कृतिक वारसा जतन करताना पर्यावरणपूरक पर्यटन अनुभव निर्माण करण्यास शिका.",
        ecoTourismSkill: "पर्यावरण-पर्यटन",
        heritageConservationSkill: "वारसा संवर्धन",
        guestRelationsSkill: "अतिथी संबंध",
        listTourismDuration: "६ आठवडे",
        listTourismRating: "४.८ (१२४)",
        listTourismLocation: "पणजी",
        listTourismStudents: "१२४ विद्यार्थी",
        listTourismProvider: "प्रदाता: गोवा पर्यटन मंडळ",
        listTourismPrice: "₹८,४९९",
        enrollNow: "आता नावनोंदणी करा",

        listAyurvedicTitle: "आयुर्वेदिक कल्याण थेरपी",
        listAyurvedicDesc: "वाढत्या कल्याण पर्यटन क्षेत्रासाठी पारंपरिक आयुर्वेदिक मालिश आणि कल्याण पद्धती.",
        ayurvedicPrinciplesSkill: "आयुर्वेदिक तत्त्वे",
        massageTechniquesSkill: "मालिश तंत्रे",
        herbalMedicineSkill: "वनौषधी",
        listAyurvedicDuration: "१४ आठवडे",
        listAyurvedicRating: "४.७ (११२)",
        listAyurvedicLocation: "मडगाव",
        listAyurvedicStudents: "११२ विद्यार्थी",
        listAyurvedicProvider: "प्रदाता: आयुर्वेद संस्था गोवा",
        listAyurvedicPrice: "₹५,९९९",

        listDigitalMarketingTitle: "स्थानिक व्यवसायांसाठी डिजिटल मार्केटिंग",
        listDigitalMarketingDesc: "गोव्यातील व्यवसाय आणि आतिथ्य उद्योगासाठी तयार केलेल्या ऑनलाइन मार्केटिंग रणनीतीमध्ये प्रभुत्व मिळवा.",
        contentCreationSkill: "सामग्री निर्मिती",
        listDigitalMarketingDuration: "४ आठवडे",
        listDigitalMarketingRating: "४.६ (८९)",
        listDigitalMarketingLocation: "ऑनलाइन",
        listDigitalMarketingStudents: "८९ विद्यार्थी",
        listDigitalMarketingProvider: "प्रदाता: टेक गोवा संस्था",
        listDigitalMarketingPrice: "₹५,१९९",

        listOrganicFarmingTitle: "सेंद्रिय शेती आणि मसाला लागवड",
        listOrganicFarmingDesc: "गोव्यातील पारंपरिक मसाले आणि पिकांवर लक्ष केंद्रित करून शाश्वत शेती तंत्रे शिका.",
        organicMethodsSkill: "सेंद्रिय पद्धती",
        spiceCultivationSkill: "मसाला लागवड",
        soilManagementSkill: "माती व्यवस्थापन",
        listOrganicFarmingDuration: "१० आठवडे",
        listOrganicFarmingRating: "४.५ (७८)",
        listOrganicFarmingLocation: "फोंडा",
        listOrganicFarmingStudents: "७८ विद्यार्थी",
        listOrganicFarmingProvider: "प्रदाता: गोवा कृषी विद्यापीठ",
        listOrganicFarmingPrice: "₹७,४९९",

        listMarineConservationTitle: "समुद्री संवर्धन आणि संशोधन",
        listMarineConservationDesc: "गोव्याच्या किनारपट्टीवरील सागरी जैवविविधता संवर्धनावर व्यापक कार्यक्रम.",
        dataCollectionSkill: "डेटा संकलन",
        listMarineConservationDuration: "१२ आठवडे",
        listMarineConservationRating: "४.७ (६७)",
        listMarineConservationLocation: "दोना पावला",
        listMarineConservationStudents: "६७ विद्यार्थी",
        listMarineConservationProvider: "प्रदाता: नॅशनल इन्स्टिट्यूट ऑफ ओशनोग्राफी",
        listMarineConservationPrice: "₹६,९९९",

        listGoanPotteryTitle: "पारंपरिक गोव्याची हस्तकला मातीची भांडी",
        listGoanPotteryDesc: "बिचोलीतील कुशल कारागिरांकडून गोव्याच्या मातीची भांडी बनवण्याची प्राचीन कला शिका.",
        clayModelingSkill: "मातीचे मॉडेलिंग",
        traditionalTechniquesSkill: "पारंपरिक तंत्रे",
        glazingSkill: "ग्लेझिंग",
        listGoanPotteryDuration: "८ आठवडे",
        listGoanPotteryRating: "४.९ (४५)",
        listGoanPotteryLocation: "बिचोली",
        listGoanPotteryStudents: "४५ विद्यार्थी",
        listGoanPotteryProvider: "प्रदाता: गोवा हस्तकला परिषद",
        listGoanPotteryPrice: "₹६,७९९",


        // Get in Touch Section (from contact.html)
        getInTouchTitle: "संपर्क साधा",
        getInTouchDescription: "आमच्या अभ्यासक्रम, मार्गदर्शन कार्यक्रम किंवा करिअरच्या संधींबद्दल प्रश्न आहेत? गोव्यात तुमच्या कौशल्य विकास प्रवासात तुम्हाला मार्गदर्शन करण्यासाठी आम्ही येथे आहोत.",
        formCardTitle: "आम्हाला संदेश पाठवा",
        formCardDescription: "खालील फॉर्म भरा आणि आम्ही तुम्हाला लवकरच संपर्क साधू.",
        fullNameLabel: "पूर्ण नाव",
        emailAddressLabel: "ईमेल पत्ता",
        subjectLabel: "विषय",
        messageLabel: "संदेश",
        fullNamePlaceholder: "तुमचे पूर्ण नाव",
        emailAddressPlaceholder: "तुमचा ईमेल@उदाहरण.कॉम",
        subjectPlaceholder: "हे कशाबद्दल आहे?",
        messagePlaceholder: "तुमच्या चौकशीबद्दल अधिक सांगा...",
        sendMessageButton: "संदेश पाठवा",
        contactInfoCardTitle: "संपर्क माहिती",
        contactInfoCardDescription: "आमच्या टीमपर्यंत पोहोचण्याचे अनेक मार्ग",
        emailUsLabel: "आम्हाला ईमेल करा",
        contactEmailValue: "hello@goaskillup.org",
        emailSubtext: "आम्हाला कधीही ईमेल पाठवा",
        callUsLabel: "आम्हाला कॉल करा",
        contactPhoneNumber: "+91 832 123 4567",
        phoneHours: "सोम-शुक्र सकाळी ९ ते सायंकाळी ६",
        visitUsLabel: "आम्हाला भेट द्या",
        contactAddressMain: "पणजी, गोवा ४०३००१",
        mainOfficeSubtext: "आमचे मुख्य कार्यालय स्थान",
        officeHoursLabel: "कार्यालयीन वेळ",
        officeHoursTime: "सकाळी ९:०० - सायंकाळी ६:००",
        officeHoursDays: "सोमवार ते शुक्रवार",
        locationsCardTitle: "आमची ठिकाणे",
        locationsCardDescription: "गोव्यामध्ये आम्हाला शोधा",
        panajiLocationName: "पणजी",
        panajiAddress: "ईडीसी कॉम्प्लेक्स, पत्तो प्लाझा, पणजी, गोवा ४०३००१",
        panajiPhoneValue: "+91 832 123 4567",
        margaoLocationName: "मडगाव",
        margaoAddress: "ग्रेस बिल्डिंग, मडगाव, गोवा ४०३८०१",
        margaoPhoneValue: "+91 832 765 4321",
        pondaLocationName: "फोंडा",
        pondaAddress: "कम्युनिटी सेंटर, फोंडा, गोवा ४०३४०१",
        pondaPhoneValue: "+91 832 567 8901",

        // FAQ Section
        faqHeading: "वारंवार विचारले जाणारे प्रश्न",
        faqQuestion1: "मी अभ्यासक्रमात कसे नावनोंदणी करू?",
        faqAnswer1: "आमची अभ्यासक्रम निर्देशिका ब्राउझ करा, तुम्हाला स्वारस्य असलेला अभ्यासक्रम निवडा आणि 'आता नावनोंदणी करा' वर क्लिक करा. तुम्हाला नोंदणी प्रक्रियेद्वारे मार्गदर्शन केले जाईल.",
        faqQuestion2: "अभ्यासक्रम प्रमाणित आहेत का?",
        faqAnswer2: "आमचे अनेक अभ्यासक्रम प्रमाणपत्रे देतात. अधिकृत प्रमाणपत्रे देणारे अभ्यासक्रम ओळखण्यासाठी अभ्यासक्रम सूचीवर \"प्रमाणित\" बॅज शोधा.",
        faqQuestion3: "मला मार्गदर्शन समर्थन मिळू शकते का?",
        faqAnswer3: "होय! आमच्याकडे अनुभवी गोव्यातील व्यावसायिकांचे नेटवर्क आहे जे मार्गदर्शन देतात. त्यांच्याशी संपर्क साधण्यासाठी आमच्या मार्गदर्शक पृष्ठाला भेट द्या.",
        faqQuestion4: "आर्थिक मदत उपलब्ध आहे का?",
        faqAnswer4: "आम्ही विविध शिष्यवृत्ती आणि देय योजना पर्याय ऑफर करतो. तुमच्या विशिष्ट परिस्थिती आणि उपलब्ध समर्थनावर चर्चा करण्यासाठी आमच्याशी संपर्क साधा.",

        // Footer
        footerLogoText: "स्किलकनेक्ट",
        footerDescription: "गुणवत्ता शिक्षण, कौशल्य विकास आणि शाश्वत विकास उद्दिष्टांशी जुळणाऱ्या करिअरच्या संधींद्वारे गोव्यातील समुदायांना सक्षम करणे.",
        quickLinksHeading: "जलद दुवे",
        supportHeading: "समर्थन",
        helpCenter: "मदत केंद्र",
        privacyPolicy: "गोपनीयता धोरण",
        termsOfService: "सेवा अटी",
        contactUs: "आमच्याशी संपर्क साधा",
        contactInfoHeading: "संपर्क माहिती",
        contactEmail: "hello@SkillConnect.com",
        contactPhone: "+91 832 XXXX XXXX",
        contactAddress: "पणजी, गोवा, भारत",
        copyrightText: "&copy; 2025 स्किलकनेक्ट. सर्व हक्क राखीव. गुणवत्ता शिक्षणासाठी वचनबद्ध (एसडीजी ४)."
    },
    mr: {
        // Navbar
        logoText: "स्किलकनेक्ट",
        home: "मुख्यपृष्ठ",
        aboutUs: "आमच्याबद्दल",
        courses: "अभ्यासक्रम",
        mentors: "मार्गदर्शक",
        jobs: "नोकरी",
        contact: "संपर्क",
        more: "अधिक",
        login: "लॉगिन करा",

        // Hero Section
        heroTitle: "तुमची क्षमता अनलॉक करा: गोव्याच्या भविष्यासाठी कौशल्ये वाढवा!",
        heroDescription: "गोव्याच्या विकसनशील अर्थव्यवस्थेसाठी तयार केलेल्या व्यावसायिक प्रशिक्षण, मार्गदर्शन आणि करिअरच्या संधींद्वारे गोव्यातील तरुण आणि प्रौढांना जोडणे.",
        exploreCourses: "अभ्यासक्रम एक्सप्लोर करा",
        findMentor: "मार्गदर्शक शोधा",
        coursesCount: "५००+",
        coursesLabel: "उपलब्ध अभ्यासक्रम",
        mentatorsCount: "१५०+",
        mentatorsLabel: "तज्ञ मार्गदर्शक",
        successCount: "१०००+",
        successLabel: "यशाच्या कथा",
        newCourseTag: "नवीन अभ्यासक्रम",
        sustainableFutureTag: "शाश्वत भविष्य",

        // Featured Courses Section
        featuredCoursesTitle: "वैशिष्ट्यपूर्ण अभ्यासक्रम श्रेणी",
        featuredCoursesDescription: "गोव्याच्या भविष्यासाठी महत्त्वाचे कौशल्ये शोधा. शाश्वत पर्यटनापासून डिजिटल नवकल्पनांपर्यंत, स्थानिक प्रासंगिकता आणि जागतिक प्रभावासाठी डिझाइन केलेले अभ्यासक्रम शोधा.",
        tourismTag: "पर्यटन",
        sustainableTourismTitle: "शाश्वत पर्यटन व्यवस्थापन",
        sustainableTourismDesc: "गोव्याचे नैसर्गिक सौंदर्य जतन करताना आणि स्थानिक अर्थव्यवस्थेला चालना देताना पर्यावरणास अनुकूल पर्यटन पद्धती विकसित करण्यास शिका.",
        tourismDuration: "८ आठवडे",
        tourismLocation: "पणजी",
        tourismRating: "४.८",
        tourismStudents: "१२०",
        tourismPrice: "₹२,४९९",
        tourismLevel: "नवशिक्या",
        learnMore: "अधिक जाणून घ्या",
        digitalSkillsTag: "डिजिटल कौशल्ये",
        digitalMarketingTitle: "स्थानिक व्यवसायांसाठी डिजिटल मार्केटिंग",
        digitalMarketingDesc: "स्थानिक आकर्षण टिकवून गोव्यातील व्यवसायांना जागतिक स्तरावर पोहोचण्यास मदत करण्यासाठी ऑनलाइन मार्केटिंग रणनीतीमध्ये प्रभुत्व मिळवा.",
        digitalDuration: "६ आठवडे",
        digitalMode: "ऑनलाइन",
        digitalRating: "४.९",
        digitalStudents: "९५",
        digitalPrice: "₹३,१९९",
        digitalLevel: "मध्यम",
        artsCraftsTag: "कला आणि हस्तकला",
        goanCraftTitle: "पारंपरिक गोव्याची हस्तकला पुनरुज्जीवन",
        goanCraftDesc: "समकालीन डिझाइन आणि मार्केटिंग तंत्रांसह पारंपरिक गोव्याच्या हस्तकलांचे जतन आणि आधुनिकीकरण करा.",
        craftDuration: "१० आठवडे",
        craftLocation: "मडगाव",
        craftRating: "४.७",
        craftStudents: "७८",
        craftPrice: "₹१,७९९",
        craftLevel: "सर्व स्तर",
        environmentalTag: "पर्यावरण",
        marineConservationTitle: "समुद्री संवर्धन आणि संशोधन",
        marineConservationDesc: "गोव्याच्या किनारपट्टीवरील परिसंस्थेचे संरक्षण करण्यासाठी सागरी जीवशास्त्र आणि संवर्धनातील कौशल्ये विकसित करा.",
        marineDuration: "१२ आठवडे",
        marineLocation: "वास्को द गामा",
        marineRating: "४.९",
        marineStudents: "५६",
        marinePrice: "₹४,४९९",
        marineLevel: "प्रगत",
        viewAllCourses: "सर्व अभ्यासक्रम पहा",

        // How It Works Section
        howItWorksTitle: "ते कसे काम करते",
        howItWorksDescription: "कौशल्य प्राविण्य आणि करिअरच्या यशाचा तुमचा प्रवास येथून सुरू होतो. तुमची क्षमता अनलॉक करण्यासाठी या सोप्या चरणांचे अनुसरण करा.",
        discoverCoursesTitle: "अभ्यासक्रम शोधा",
        discoverCoursesDesc: "गोव्याच्या अनन्य संधींसाठी तयार केलेल्या कौशल्य-आधारित अभ्यासक्रमांची आमची विस्तृत सूची ब्राउझ करा.",
        connectMentorsTitle: "मार्गदर्शकांशी कनेक्ट व्हा",
        connectMentorsDesc: "तुमच्या शिकण्याच्या प्रवासात आणि करिअरच्या मार्गात मार्गदर्शन करणाऱ्या अनुभवी व्यावसायिकांशी जुळा.",
        buildPortfolioTitle: "तुमचा पोर्टफोलिओ तयार करा",
        buildPortfolioDesc: "मायक्रो-क्रेडेंशियल्स मिळवा आणि तुमच्या नवीन प्राप्त केलेल्या कौशल्यांचे प्रदर्शन करणारा डिजिटल पोर्टफोलिओ तयार करा.",
        findOpportunitiesTitle: "संधी शोधा",
        findOpportunitiesDesc: "SkillConnect क्रेडेंशियल्सला महत्त्व देणाऱ्या स्थानिक नियोक्त्यांकडून संधी दर्शविणाऱ्या आमच्या जॉब बोर्डमध्ये प्रवेश करा.",
        readyToStart: "तुमचा प्रवास सुरू करण्यास तयार आहात?",

        // Jobs Hero Section
        jobsHeroTitle: "गोव्यातील नोकरीच्या संधी",
        jobsHeroDescription: "आपल्या कौशल्यांशी जुळणाऱ्या आणि गोव्याच्या वाढत्या अर्थव्यवस्थेत योगदान देणाऱ्या करिअरच्या संधी शोधा.",

        // Job Listing Section - Filters & Search
        jobSearchPlaceholder: "नोकरी, कंपन्या किंवा कौशल्ये शोधा...",
        allCategoriesLabel: "सर्व श्रेणी",
        allLocationsLabel: "सर्व ठिकाणे",
        allTypesLabel: "सर्व प्रकार",
        all: "सर्व",
        panajiOption: "पणजी",
        margaoOption: "मडगाव",
        vascoOption: "वास्को द गामा",
        bicholimOption: "बिचोली",
        pondaOption: "फोंडा",
        donaPaulaOption: "दोना पावला",
        sangueumOption: "सांगे",
        porvorimOption: "परवरी",
        fullTimeOption: "पूर्णवेळ",
        partTimeOption: "अंशवेळ",
        contractOption: "करार",
        internshipOption: "इंटर्नशिप",
        remoteOption: "रिमोट",
        clearFilters: "फिल्टर साफ करा",
        jobsFoundText: "नोकऱ्या आढळल्या",

        // Job Cards
        job1Title: "शाश्वत पर्यटन व्यवस्थापक",
        job1Company: "गोवा पर्यटन विकास महामंडळ",
        job1Location: "पणजी",
        fullTimeTag: "पूर्णवेळ",
        experienceTag: "वर्षे",
        job1Desc: "गोव्याच्या नैसर्गिक सौंदर्य आणि सांस्कृतिक वारसा जतन करताना पर्यावरणास अनुकूल पर्यटन पद्धती विकसित करून गोव्यात शाश्वत पर्यटन उपक्रमांचे नेतृत्व करा.",
        sustainableTourismSkill: "शाश्वत पर्यटन",
        projectManagementSkill: "प्रकल्प व्यवस्थापन",
        communityEngagementSkill: "समुदाय सहभाग",
        marketingSkill: "विपणन",
        plusOneMore: "+१ अधिक",
        job1Salary: "₹18,000.00 - ₹22,000.00 प्रति वर्ष",
        job1Deadline: "अर्जाची अंतिम मुदत: १५ दिवस बाकी",
        applyNow: "आता अर्ज करा",
        details: "तपशील",

        job2Title: "डिजिटल मार्केटिंग विशेषज्ञ",
        job2Company: "गोवा टेक सोल्युशन्स",
        job2Location: "रिमोट",
        job2Desc: "सोशल मीडिया, एसईओ आणि कंटेंट मार्केटिंगवर लक्ष केंद्रित करून स्थानिक व्यवसायांसाठी डिजिटल मार्केटिंग मोहिमा चालवा.",
        socialMediaMarketingSkill: "सोशल मीडिया मार्केटिंग",
        seoSkill: "एसईओ",
        googleAdsSkill: "गुगल ॲड्स",
        job2Salary: "₹15,000.00 - ₹18,000.00 प्रति वर्ष",
        job2Deadline: "अर्जाची अंतिम मुदत: ३० दिवस बाकी",

        job3Title: "समुद्री जीवशास्त्र संशोधन सहाय्यक",
        job3Company: "गोवा विद्यापीठ - सागरी विज्ञान विभाग",
        job3Location: "दोना पावला",
        contractTag: "करार",
        researchTag: "संशोधन",
        job3Desc: "गोव्याच्या किनारपट्टीवर सागरी जैवविविधता संशोधन प्रकल्पांना समर्थन द्या, ज्यात डेटा संकलन, विश्लेषण आणि क्षेत्रीय कार्य यांचा समावेश आहे.",
        marineBiologySkill: "समुद्री जीवशास्त्र",
        researchMethodsSkill: "संशोधन पद्धती",
        dataAnalysisSkill: "डेटा विश्लेषण",
        fieldWorkSkill: "क्षेत्रीय कार्य",
        job3Salary: "₹3,500.00 - ₹5,000.00 प्रति महिना",
        job3Deadline: "अर्जाची अंतिम मुदत: ३ दिवस बाकी",

        job4Title: "पारंपरिक हस्तकला प्रशिक्षक",
        job4Company: "गोवा हेरिटेज फाउंडेशन",
        job4Location: "बिचोली",
        partTimeTag: "अंशवेळ",
        educationTag: "शिक्षण",
        job4Desc: "सांस्कृतिक वारसा जतन करण्यासाठी मातीची भांडी, विणकाम आणि लाकडी काम यासह पारंपारिक गोव्यातील हस्तकला शिकवा.",
        traditionalCraftsSkill: "पारंपरिक हस्तकला",
        teachingSkill: "शिक्षण",
        culturalHeritageSkill: "सांस्कृतिक वारसा",
        workshopManagementSkill: "कार्यशाळा व्यवस्थापन",
        job4Salary: "₹2,500.00 - ₹4,000.00 प्रति दिन",
        job4Deadline: "अर्जाची अंतिम मुदत: ५ दिवस बाकी",

        job5Title: "सेंद्रिय शेत व्यवस्थापक",
        job5Company: "ग्रीन गोवा फार्म्स",
        job5Location: "सांगे",
        agricultureTag: "शेती",
        job5Desc: "सेंद्रिय शेतीचे कार्य व्यवस्थापित करा, शाश्वत कृषी पद्धती लागू करा आणि स्थानिक शेती समुदायांशी समन्वय साधा.",
        organicFarmingSkill: "सेंद्रिय शेती",
        sustainableAgricultureSkill: "शाश्वत शेती",
        teamManagementSkill: "संघ व्यवस्थापन",
        cropPlanningSkill: "पीक नियोजन",
        job5Salary: "₹14,000.00 - ₹18,000.00 प्रति महिना",
        job5Deadline: "अर्जाची अंतिम मुदत: १ आठवडा बाकी",

        job6Title: "फुल स्टॅक डेव्हलपर",
        job6Company: "स्टार्टअप गोवा इनक्यूबेटर",
        job6Location: "परवरी",
        technologyTag: "तंत्रज्ञान",
        job6Desc: "स्थानिक स्टार्टअप्ससाठी वेब ॲप्लिकेशन्स विकसित करा, आधुनिक टेक स्टॅकवर काम करा आणि गोव्याच्या टेक इकोसिस्टममध्ये योगदान द्या.",
        reactJsSkill: "रिॲक्ट.जेएस",
        nodeJsSkill: "नोड.जेएस",
        mongoDbSkill: "मोंगोडीबी",
        awsSkill: "एडब्ल्यूएस",
        plusTwoMore: "+२ अधिक",
        job6Salary: "₹18,000.00 - ₹22,000.00 प्रति वर्ष",
        job6Deadline: "अर्जाची अंतिम मुदत: १५ दिवस बाकी",

        job7Title: "आतिथ्य ऑपरेशन इंटर्न",
        job7Company: "ताज हॉटेल्स - गोवा",
        job7Location: "कँडोलिम",
        internshipTag: "इंटर्नशिप",
        hospitalityTag: "आतिथ्य",
        experienceTagEntry: "प्रारंभिक स्तर",
        job7Desc: "लक्झरी रिसॉर्टमध्ये हॉटेल ऑपरेशन, अतिथी सेवा आणि आतिथ्य व्यवस्थापनामध्ये व्यावहारिक अनुभव मिळवा.",
        customerServiceSkill: "ग्राहक सेवा",
        hotelOperationsSkill: "हॉटेल ऑपरेशन्स",
        guestRelationsSkill: "अतिथी संबंध",
        eventManagementSkill: "इव्हेंट व्यवस्थापन",
        job7Salary: "₹10,000.00 - ₹20,000.00 प्रति महिना",
        job7Deadline: "अर्जाची अंतिम मुदत: ३० दिवस बाकी",

        job8Title: "फ्रीलान्स कंटेंट क्रिएटर",
        job8Company: "गोवा कंटेंट कलेक्टिव्ह",
        job8Location: "रिमोट",
        remoteTag: "रिमोट",
        contentTag: "सामग्री",
        job8Desc: "गोव्याची संस्कृती, पर्यटन आणि जीवनशैलीबद्दल विविध डिजिटल प्लॅटफॉर्म आणि कंटेंट मार्केटिंगसाठी आकर्षक सामग्री तयार करा.",
        contentWritingSkill: "सामग्री लेखन",
        socialMediaSkill: "सोशल मीडिया",
        photographySkill: "फोटोग्राफी",
        videoEditingSkill: "व्हिडिओ संपादन",
        job8Salary: "₹500.00 - ₹2,000.00 प्रति नमुना",
        job8Deadline: "अर्जाची अंतिम मुदत: ६ दिवस बाकी",

        // Mentors Hero Section
        mentorsHeroTitle: "मार्गदर्शकांशी संपर्क साधा",
        mentorsHeroDescription: "उद्योग तज्ञांकडून आणि अनुभवी व्यावसायिकांकडून शिका जे अनन्य संधी आणि आव्हाने समजून घेतात.",

        // Mentors Listing Section - Filters & Search
        mentorSearchPlaceholder: "मार्गदर्शक किंवा कौशल्ये शोधा...",
        industryLabel: "सर्व उद्योग",
        tourismIndustry: "पर्यटन",
        digitalIndustry: "डिजिटल विपणन",
        artsIndustry: "कला आणि हस्तकला",
        environmentalIndustry: "पर्यावरण",
        agricultureIndustry: "शेती",
        hospitalityIndustry: "आतिथ्य",
        technologyIndustry: "तंत्रज्ञान",
        locationLabel: "सर्व ठिकाणे",

        mentorsFoundText: "मार्गदर्शक सापडले",

        // Mentor Cards
        mentor1Name: "प्रिया शर्मा",
        mentor1Role: "गोवा पर्यटन मंडळात शाश्वत पर्यटन संचालक",
        mentor1Location: "पणजी",
        mentor1Bio: "आतिथ्य आणि पर्यावरण-पर्यटन विकासात १५+ वर्षांच्या अनुभवासह गोव्यात शाश्वत पर्यटन उपक्रमांचे नेतृत्व करत आहे.",
        hospitalityManagementSkill: "आतिथ्य व्यवस्थापन",
        ecoTourismSkill: "पर्यावरण-पर्यटन",
        mentor1Rating: "४.९",
        mentor1Mentees: "४५ प्रशिक्षणार्थी",
        mentor1Experience: "१५+ वर्षे",
        mentor1Availability: "व्हर्च्युअल सत्रांसाठी उपलब्ध",
        connectWithMentor: "यांच्याशी संपर्क साधा",

        mentor2Name: "राजेश नाईक",
        mentor2Role: "फ्रीलान्स सल्लागार म्हणून डिजिटल मार्केटिंग विशेषज्ञ",
        mentor2Location: "मडगाव",
        mentor2Bio: "डेटा-आधारित डिजिटल मार्केटिंग रणनीती आणि सोशल मीडिया कौशल्याने गोव्यातील व्यवसायांना ऑनलाइन वाढण्यास मदत करत आहे.",
        contentStrategySkill: "सामग्री रणनीती",
        mentor2Rating: "४.८",
        mentor2Mentees: "३८ प्रशिक्षणार्थी",
        mentor2Experience: "१२+ वर्षे",
        mentor2Availability: "प्रत्यक्ष भेटींसाठी खुले",

        mentor3Name: "डॉ. मारिया फर्नांडिस",
        mentor3Role: "गोवा विद्यापीठात सागरी संवर्धन शास्त्रज्ञ",
        mentor3Location: "दोना पावला",
        mentor3Bio: "गोव्याच्या पाण्यातील सागरी जैवविविधता संवर्धन आणि शाश्वत मासेमारी पद्धतींमध्ये विशेष संशोधन वैज्ञानिक.",
        conservationSkill: "संवर्धन",
        mentor3Rating: "४.९",
        mentor3Mentees: "२८ प्रशिक्षणार्थी",
        mentor3Experience: "२०+ वर्षे",
        mentor3Availability: "संशोधन मार्गदर्शनासाठी उपलब्ध",

        mentor4Name: "कार्लोस डिसोझा",
        mentor4Role: "गोवा हेरिटेज क्राफ्ट्समध्ये पारंपरिक हस्तकला मास्टर",
        mentor4Location: "बिचोली",
        mentor4Bio: "मातीची भांडी, विणकाम आणि लाकडी कामासह पारंपरिक गोव्याच्या हस्तकला जतन आणि शिकवणारे कुशल कारागीर.",
        potterySkill: "मातीची भांडी",
        woodworkingSkill: "लाकडी काम",
        mentor4Rating: "५",
        mentor4Mentees: "६७ प्रशिक्षणार्थी",
        mentor4Experience: "२५+ वर्षे",
        mentor4Availability: "कार्यशाळा सत्रे उपलब्ध",

        mentor5Name: "अंजली पार्सेकर",
        mentor5Role: "ग्रीन गोवा इनिशिएटिव्हमध्ये सेंद्रिय शेती सल्लागार",
        mentor5Location: "सांगे",
        mentor5Bio: "ग्रामीण गोव्यामध्ये शाश्वत कृषी पद्धती आणि सेंद्रिय शेती तंत्रांना प्रोत्साहन देत आहे.",
        permacultureSkill: "परमॅकल्चर",
        mentor5Rating: "४.७",
        mentor5Mentees: "५२ प्रशिक्षणार्थी",
        mentor5Experience: "१८+ वर्षे",
        mentor5Availability: "क्षेत्रीय भेटी आणि व्हर्च्युअल सत्रे",

        mentor6Name: "विक्रम कामत",
        mentor6Role: "गोवाटेक सोल्युशन्समध्ये टेक उद्योजक",
        mentor6Location: "परवरी",
        mentor6Bio: "गोव्याच्या वाढत्या टेक इकोसिस्टममध्ये स्थानिक व्यवसायांसाठी आणि स्टार्टअप्ससाठी टेक सोल्यूशन्स तयार करणारा सिरियल उद्योजक.",
        entrepreneurshipSkill: "उद्योजकता",
        softwareDevelopmentSkill: "सॉफ्टवेअर विकास",
        businessStrategySkill: "व्यवसाय रणनीती",
        mentor6Rating: "४.८",
        mentor6Mentees: "३४ प्रशिक्षणार्थी",
        mentor6Experience: "१४+ वर्षे",
        mentor6Availability: "लवकर वेळापत्रक",

        // About Us Section
        aboutGoaSkillUpConnectTitle: "आमच्या बद्दल स्किलकनेक्ट",
        aboutGoaSkillUpConnectDescription: "आम्ही गुणवत्तापूर्ण शिक्षण, अभिनव प्रशिक्षण कार्यक्रम आणि अर्थपूर्ण मार्गदर्शन संबंधांद्वारे गोव्यात कौशल्य अंतर कमी करण्यासाठी आणि आर्थिक सक्षमीकरणास प्रोत्साहन देण्यासाठी मिशनवर आहोत.",

        // Mission & Vision Section
        ourMissionTitle: "आमचे ध्येय",
        ourMissionDescription: "गोव्याच्या आर्थिक गरजा आणि सांस्कृतिक मूल्यांशी जुळणाऱ्या सुलभ, उच्च-गुणवत्तेच्या कौशल्य विकास संधी प्रदान करून गोव्यातील समुदायांना सक्षम करणे, शाश्वत विकास लक्ष्य ४: गुणवत्तापूर्ण शिक्षणाच्या प्राप्तीमध्ये योगदान देणे.",
        ourVisionTitle: "आमची दृष्टी",
        ourVisionDescription: "कौशल्य विकास आणि करिअर प्रगतीसाठी गोव्याचे अग्रगण्य व्यासपीठ बनणे, एक भरभराटीची परिसंस्था निर्माण करणे जिथे पारंपरिक ज्ञान आधुनिक नवोपक्रमांशी मिळते आणि प्रत्येक व्यक्तीला त्यांची पूर्ण क्षमता गाठण्याची संधी मिळते.",
        whyGoaSkillUpConnectTitle: "स्किलकनेक्ट का?",
        whyGoaSkillUpConnectItem1: "स्थानिक प्रासंगिकतेसाठी डिझाइन केलेला गोवा-केंद्रित अभ्यासक्रम",
        whyGoaSkillUpConnectItem2: "उद्योग व्यावसायिकांकडून थेट मार्गदर्शन",
        whyGoaSkillUpConnectItem3: "इंग्रजी, कोंकणी आणि मराठीमध्ये बहुभाषिक समर्थन",
        whyGoaSkillUpConnectItem4: "लवकर कौशल्य प्रमाणीकरणासाठी मायक्रो-क्रेडेंशिअलिंग",

        // Core Values Section
        coreValuesTitle: "आमची मूळ मूल्ये",
        coreValuesDescription: "ही तत्त्वे स्किलकनेक्टमध्ये आम्ही जे काही करतो त्याला मार्गदर्शन करतात",
        qualityEducationTitle: "गुणवत्ता शिक्षण",
        qualityEducationDescription: "शाश्वत विकासासाठी SDG ४ शी जुळणारे उच्च-गुणवत्तेचे, संबंधित शिक्षण देण्यासाठी वचनबद्ध.",
        localImpactTitle: "स्थानिक प्रभाव",
        localImpactDescription: "जागतिक संधींसाठी शिक्षणार्थींना तयार करताना गोव्याच्या अनन्य आर्थिक गरजा पूर्ण करण्यावर लक्ष केंद्रित केले आहे.",
        communityDrivenTitle: "समुदाय-आधारित",
        communityDrivenDescription: "गोवेकरांनी, गोवेकरांसाठी तयार केलेले - स्थानिक प्रतिभेला प्रोत्साहन देणे आणि नवोपक्रम स्वीकारताना सांस्कृतिक मूल्यांचे जतन करणे.",
        inclusiveGrowthTitle: "समावेशक वाढ",
        inclusiveGrowthDescription: "गोव्यातील सर्व समुदायांमध्ये कौशल्य विकासाच्या संधींसाठी समान प्रवेश सुनिश्चित करणे.",

        // Meet Our Team Section
        teamTitle: "आमच्या टीमला भेटा",
        teamDescription: "गोव्याच्या वाढीसाठी समर्पित असलेले उत्साही शिक्षक आणि उद्योग व्यावसायिक",
        member1Initials: "डी.एम.एफ",
        member1Name: "डॉ. मारिया फर्नांडिस",
        member1Role: "संस्थापक आणि सीईओ",
        member1Specialty: "शैक्षणिक तंत्रज्ञान",
        member1Bio: "गोवा विद्यापीठातील माजी प्राध्यापक, कौशल्य विकासात १५+ वर्षांचा अनुभव.",
        member2Initials: "आर.के.",
        member2Name: "राजेश कामत",
        member2Role: "भागीदारी प्रमुख",
        member2Specialty: "उद्योग संबंध",
        member2Bio: "गोव्यातील स्थानिक व्यवसायांना कुशल प्रतिभेशी जोडणे.",
        member3Initials: "पी.डी.",
        member3Name: "प्रिया देसाई",
        member3Role: "समुदाय संपर्क",
        member3Specialty: "सामाजिक प्रभाव",
        member3Bio: "समावेशक शिक्षण आणि समुदाय सक्षमीकरणाबद्दल उत्साही.",

        // Our Impact Goals Section
        impactGoalsTitle: "आमची प्रभाव लक्ष्ये",
        impactGoalsDescription: "२०३० पर्यंत, आम्ही १०,०००+ गोवेकरांना संबंधित कौशल्यांमध्ये प्रशिक्षित करण्याचे, ५००+ मार्गदर्शन संबंध सुलभ करण्याचे आणि १,०००+ स्थानिक नोकरी प्लेसमेंटला समर्थन देण्याचे लक्ष्य ठेवले आहे, ज्यामुळे गोव्याच्या शाश्वत आर्थिक विकासात महत्त्वपूर्ण योगदान मिळेल.",
        skilledGraduatesCount: "१०,०००+",
        skilledGraduatesLabel: "कुशल पदवीधर",
        mentorshipConnectionsCount: "५००+",
        mentorshipConnectionsLabel: "मार्गदर्शन संबंध",
        jobPlacementsCount: "१,०००+",
        jobPlacementsLabel: "नोकरी प्लेसमेंट",
        joinOurMissionButton: "आमच्या मिशनमध्ये सामील व्हा",

        // Discover Your Perfect Course Section
        discoverCourseTitle: "तुमचा परिपूर्ण अभ्यासक्रम शोधा",
        discoverCourseDescription: "गोव्याच्या विकसनशील अर्थव्यवस्थेसाठी विशेषतः डिझाइन केलेल्या कौशल्य-निर्मिती अभ्यासक्रमांची आमची विस्तृत सूची एक्सप्लोर करा.",
        searchPlaceholder: "अभ्यासक्रम, कौशल्ये किंवा प्रदाते शोधा...",
        categoryLabel: "श्रेणी",
        durationLabel: "कालावधी",
        difficultyLabel: "कठीणता",
        sortByLabel: "यानुसार क्रमवारी लावा",
        onlineOption: "ऑनलाइन",
        shortDurationOption: "८ आठवड्यांपेक्षा कमी",
        mediumDurationOption: "८-१२ आठवडे",
        longDurationOption: "१२ आठवड्यांपेक्षा जास्त",
        beginnerOption: "नवशिक्या",
        intermediateOption: "मध्यम",
        advancedOption: "प्रगत",
        popularityOption: "लोकप्रियता",
        newestOption: "नवीनतम",
        ratingOption: "रेटिंग",
        certifiedCoursesOnlyLabel: "फक्त प्रमाणित अभ्यासक्रम",

        // Course Listing Section
        showingCoursesText: "अभ्यासक्रम दाखवत आहे", // Will be dynamically filled "Showing X of Y courses"
        certifiedTag: "प्रमाणित",
        nonCertifiedTag: "गैर-प्रमाणित",
        intermediateLevelTag: "मध्यम",
        beginnerLevelTag: "नवशिक्या",
        advancedLevelTag: "प्रगत",
        listTourismTitle: "शाश्वत पर्यटन मार्गदर्शक प्रमाणपत्र",
        listTourismDesc: "गोव्याचे नैसर्गिक सौंदर्य आणि सांस्कृतिक वारसा जतन करताना पर्यावरणपूरक पर्यटन अनुभव निर्माण करण्यास शिका.",
        ecoTourismSkill: "पर्यावरण-पर्यटन",
        heritageConservationSkill: "वारसा संवर्धन",
        guestRelationsSkill: "अतिथी संबंध",
        listTourismDuration: "६ आठवडे",
        listTourismRating: "४.८ (१२४)",
        listTourismLocation: "पणजी",
        listTourismStudents: "१२४ विद्यार्थी",
        listTourismProvider: "प्रदाता: गोवा पर्यटन मंडळ",
        listTourismPrice: "₹८,४९९",
        enrollNow: "आता नावनोंदणी करा",

        listAyurvedicTitle: "आयुर्वेदिक कल्याण थेरपी",
        listAyurvedicDesc: "वाढत्या कल्याण पर्यटन क्षेत्रासाठी पारंपरिक आयुर्वेदिक मालिश आणि कल्याण पद्धती.",
        ayurvedicPrinciplesSkill: "आयुर्वेदिक तत्त्वे",
        massageTechniquesSkill: "मालिश तंत्रे",
        herbalMedicineSkill: "वनौषधी",
        listAyurvedicDuration: "१४ आठवडे",
        listAyurvedicRating: "४.७ (११२)",
        listAyurvedicLocation: "मडगाव",
        listAyurvedicStudents: "११२ विद्यार्थी",
        listAyurvedicProvider: "प्रदाता: आयुर्वेद संस्था गोवा",
        listAyurvedicPrice: "₹५,९९९",

        listDigitalMarketingTitle: "स्थानिक व्यवसायांसाठी डिजिटल मार्केटिंग",
        listDigitalMarketingDesc: "गोव्यातील व्यवसाय आणि आतिथ्य उद्योगासाठी तयार केलेल्या ऑनलाइन मार्केटिंग रणनीतीमध्ये प्रभुत्व मिळवा.",
        contentCreationSkill: "सामग्री निर्मिती",
        listDigitalMarketingDuration: "४ आठवडे",
        listDigitalMarketingRating: "४.६ (८९)",
        listDigitalMarketingLocation: "ऑनलाइन",
        listDigitalMarketingStudents: "८९ विद्यार्थी",
        listDigitalMarketingProvider: "प्रदाता: टेक गोवा संस्था",
        listDigitalMarketingPrice: "₹५,१९९",

        listOrganicFarmingTitle: "सेंद्रिय शेती आणि मसाला लागवड",
        listOrganicFarmingDesc: "गोव्यातील पारंपरिक मसाले आणि पिकांवर लक्ष केंद्रित करून शाश्वत शेती तंत्रे शिका.",
        organicMethodsSkill: "सेंद्रिय पद्धती",
        spiceCultivationSkill: "मसाला लागवड",
        soilManagementSkill: "माती व्यवस्थापन",
        listOrganicFarmingDuration: "१० आठवडे",
        listOrganicFarmingRating: "४.५ (७८)",
        listOrganicFarmingLocation: "फोंडा",
        listOrganicFarmingStudents: "७८ विद्यार्थी",
        listOrganicFarmingProvider: "प्रदाता: गोवा कृषी विद्यापीठ",
        listOrganicFarmingPrice: "₹७,४९९",

        listMarineConservationTitle: "समुद्री संवर्धन आणि संशोधन",
        listMarineConservationDesc: "गोव्याच्या किनारपट्टीवरील सागरी जैवविविधता संवर्धनावर व्यापक कार्यक्रम.",
        dataCollectionSkill: "डेटा संकलन",
        listMarineConservationDuration: "१२ आठवडे",
        listMarineConservationRating: "४.७ (६७)",
        listMarineConservationLocation: "दोना पावला",
        listMarineConservationStudents: "६७ विद्यार्थी",
        listMarineConservationProvider: "प्रदाता: नॅशनल इन्स्टिट्यूट ऑफ ओशनोग्राफी",
        listMarineConservationPrice: "₹६,९९९",

        listGoanPotteryTitle: "पारंपरिक गोव्याची हस्तकला मातीची भांडी",
        listGoanPotteryDesc: "बिचोलीतील कुशल कारागिरांकडून गोव्याच्या मातीची भांडी बनवण्याची प्राचीन कला शिका.",
        clayModelingSkill: "मातीचे मॉडेलिंग",
        traditionalTechniquesSkill: "पारंपरिक तंत्रे",
        glazingSkill: "ग्लेझिंग",
        listGoanPotteryDuration: "८ आठवडे",
        listGoanPotteryRating: "४.९ (४५)",
        listGoanPotteryLocation: "बिचोली",
        listGoanPotteryStudents: "४५ विद्यार्थी",
        listGoanPotteryProvider: "प्रदाता: गोवा हस्तकला परिषद",
        listGoanPotteryPrice: "₹६,७९९",


        // Get in Touch Section
        getInTouchTitle: "संपर्क साधा",
        getInTouchDescription: "आमच्या अभ्यासक्रम, मार्गदर्शन कार्यक्रम किंवा करिअरच्या संधींबद्दल प्रश्न आहेत? गोव्यात तुमच्या कौशल्य विकास प्रवासात तुम्हाला मार्गदर्शन करण्यासाठी आम्ही येथे आहोत.",
        formCardTitle: "आम्हाला संदेश पाठवा",
        formCardDescription: "खालील फॉर्म भरा आणि आम्ही तुम्हाला लवकरच संपर्क साधू.",
        fullNameLabel: "पूर्ण नाव",
        emailAddressLabel: "ईमेल पत्ता",
        subjectLabel: "विषय",
        messageLabel: "संदेश",
        fullNamePlaceholder: "तुमचे पूर्ण नाव",
        emailAddressPlaceholder: "तुमचा ईमेल@उदाहरण.कॉम",
        subjectPlaceholder: "हे कशाबद्दल आहे?",
        messagePlaceholder: "तुमच्या चौकशीबद्दल अधिक सांगा...",
        sendMessageButton: "संदेश पाठवा",
        contactInfoCardTitle: "संपर्क माहिती",
        contactInfoCardDescription: "आमच्या टीमपर्यंत पोहोचण्याचे अनेक मार्ग",
        emailUsLabel: "आम्हाला ईमेल करा",
        contactEmailValue: "hello@goaskillup.org",
        emailSubtext: "आम्हाला कधीही ईमेल पाठवा",
        callUsLabel: "आम्हाला कॉल करा",
        contactPhoneNumber: "+91 832 123 4567",
        phoneHours: "सोम-शुक्र सकाळी ९ ते सायंकाळी ६",
        visitUsLabel: "आम्हाला भेट द्या",
        contactAddressMain: "पणजी, गोवा ४०३००१",
        mainOfficeSubtext: "आमचे मुख्य कार्यालय स्थान",
        officeHoursLabel: "कार्यालयीन वेळ",
        officeHoursTime: "सकाळी ९:०० - सायंकाळी ६:००",
        officeHoursDays: "सोमवार ते शुक्रवार",
        locationsCardTitle: "आमची ठिकाणे",
        locationsCardDescription: "गोव्यामध्ये आम्हाला शोधा",
        panajiLocationName: "पणजी",
        panajiAddress: "ईडीसी कॉम्प्लेक्स, पत्तो प्लाझा, पणजी, गोवा ४०३००१",
        panajiPhoneValue: "+91 832 123 4567",
        margaoLocationName: "मडगाव",
        margaoAddress: "ग्रेस बिल्डिंग, मडगाव, गोवा ४०३८०१",
        margaoPhoneValue: "+91 832 765 4321",
        pondaLocationName: "फोंडा",
        pondaAddress: "कम्युनिटी सेंटर, फोंडा, गोवा ४०३४०१",
        pondaPhoneValue: "+91 832 567 8901",

        // FAQ Section
        faqHeading: "वारंवार विचारले जाणारे प्रश्न",
        faqQuestion1: "मी अभ्यासक्रमात कसे नावनोंदणी करू?",
        faqAnswer1: "आमची अभ्यासक्रम निर्देशिका ब्राउझ करा, तुम्हाला स्वारस्य असलेला अभ्यासक्रम निवडा आणि 'आता नावनोंदणी करा' वर क्लिक करा. तुम्हाला नोंदणी प्रक्रियेद्वारे मार्गदर्शन केले जाईल.",
        faqQuestion2: "अभ्यासक्रम प्रमाणित आहेत का?",
        faqAnswer2: "आमचे अनेक अभ्यासक्रम प्रमाणपत्रे देतात. अधिकृत प्रमाणपत्रे देणारे अभ्यासक्रम ओळखण्यासाठी अभ्यासक्रम सूचीवर \"प्रमाणित\" बॅज शोधा.",
        faqQuestion3: "मला मार्गदर्शन समर्थन मिळू शकते का?",
        faqAnswer3: "होय! आमच्याकडे अनुभवी गोव्यातील व्यावसायिकांचे नेटवर्क आहे जे मार्गदर्शन देतात. त्यांच्याशी संपर्क साधण्यासाठी आमच्या मार्गदर्शक पृष्ठाला भेट द्या.",
        faqQuestion4: "आर्थिक मदत उपलब्ध आहे का?",
        faqAnswer4: "आम्ही विविध शिष्यवृत्ती आणि देय योजना पर्याय ऑफर करतो. तुमच्या विशिष्ट परिस्थिती आणि उपलब्ध समर्थनावर चर्चा करण्यासाठी आमच्याशी संपर्क साधा.",

        // Footer
        footerLogoText: "स्किलकनेक्ट",
        footerDescription: "गुणवत्ता शिक्षण, कौशल्य विकास आणि शाश्वत विकास उद्दिष्टांशी जुळणाऱ्या करिअरच्या संधींद्वारे गोव्यातील समुदायांना सक्षम करणे.",
        quickLinksHeading: "जलद दुवे",
        supportHeading: "समर्थन",
        helpCenter: "मदत केंद्र",
        privacyPolicy: "गोपनीयता धोरण",
        termsOfService: "सेवा अटी",
        contactUs: "आमच्याशी संपर्क साधा",
        contactInfoHeading: "संपर्क माहिती",
        contactEmail: "hello@SkillConnect.com",
        contactPhone: "+91 832 XXXX XXXX",
        contactAddress: "पणजी, गोवा, भारत",
        copyrightText: "&copy; 2025 स्किलकनेक्ट. सर्व हक्क राखीव. गुणवत्ता शिक्षणासाठी वचनबद्ध (एसडीजी ४)."
    },
    mr: {
        // Navbar
        logoText: "स्किलकनेक्ट",
        home: "मुख्यपृष्ठ",
        aboutUs: "आमच्याबद्दल",
        courses: "अभ्यासक्रम",
        mentors: "मार्गदर्शक",
        jobs: "नोकरी",
        contact: "संपर्क",
        more: "अधिक",
        login: "लॉगिन करा",

        // Hero Section
        heroTitle: "तुमची क्षमता अनलॉक करा: गोव्याच्या भविष्यासाठी कौशल्ये वाढवा!",
        heroDescription: "गोव्याच्या विकसनशील अर्थव्यवस्थेसाठी तयार केलेल्या व्यावसायिक प्रशिक्षण, मार्गदर्शन आणि करिअरच्या संधींद्वारे गोव्यातील तरुण आणि प्रौढांना जोडणे.",
        exploreCourses: "अभ्यासक्रम एक्सप्लोर करा",
        findMentor: "मार्गदर्शक शोधा",
        coursesCount: "५००+",
        coursesLabel: "उपलब्ध अभ्यासक्रम",
        mentatorsCount: "१५०+",
        mentatorsLabel: "तज्ञ मार्गदर्शक",
        successCount: "१०००+",
        successLabel: "यशाच्या कथा",
        newCourseTag: "नवीन अभ्यासक्रम",
        sustainableFutureTag: "शाश्वत भविष्य",

        // Featured Courses Section
        featuredCoursesTitle: "वैशिष्ट्यपूर्ण अभ्यासक्रम श्रेणी",
        featuredCoursesDescription: "गोव्याच्या भविष्यासाठी महत्त्वाचे कौशल्ये शोधा. शाश्वत पर्यटनापासून डिजिटल नवकल्पनांपर्यंत, स्थानिक प्रासंगिकता आणि जागतिक प्रभावासाठी डिझाइन केलेले अभ्यासक्रम शोधा.",
        tourismTag: "पर्यटन",
        sustainableTourismTitle: "शाश्वत पर्यटन व्यवस्थापन",
        sustainableTourismDesc: "गोव्याचे नैसर्गिक सौंदर्य जतन करताना आणि स्थानिक अर्थव्यवस्थेला चालना देताना पर्यावरणास अनुकूल पर्यटन पद्धती विकसित करण्यास शिका.",
        tourismDuration: "८ आठवडे",
        tourismLocation: "पणजी",
        tourismRating: "४.८",
        tourismStudents: "१२०",
        tourismPrice: "₹२,४९९",
        tourismLevel: "नवशिक्या",
        learnMore: "अधिक जाणून घ्या",
        digitalSkillsTag: "डिजिटल कौशल्ये",
        digitalMarketingTitle: "स्थानिक व्यवसायांसाठी डिजिटल मार्केटिंग",
        digitalMarketingDesc: "स्थानिक आकर्षण टिकवून गोव्यातील व्यवसायांना जागतिक स्तरावर पोहोचण्यास मदत करण्यासाठी ऑनलाइन मार्केटिंग रणनीतीमध्ये प्रभुत्व मिळवा.",
        digitalDuration: "६ आठवडे",
        digitalMode: "ऑनलाइन",
        digitalRating: "४.९",
        digitalStudents: "९५",
        digitalPrice: "₹३,१९९",
        digitalLevel: "मध्यम",
        artsCraftsTag: "कला आणि हस्तकला",
        goanCraftTitle: "पारंपरिक गोव्याची हस्तकला पुनरुज्जीवन",
        goanCraftDesc: "समकालीन डिझाइन आणि मार्केटिंग तंत्रांसह पारंपरिक गोव्याच्या हस्तकलांचे जतन आणि आधुनिकीकरण करा.",
        craftDuration: "१० आठवडे",
        craftLocation: "मडगाव",
        craftRating: "४.७",
        craftStudents: "७८",
        craftPrice: "₹१,७९९",
        craftLevel: "सर्व स्तर",
        environmentalTag: "पर्यावरण",
        marineConservationTitle: "समुद्री संवर्धन आणि संशोधन",
        marineConservationDesc: "गोव्याच्या किनारपट्टीवरील परिसंस्थेचे संरक्षण करण्यासाठी सागरी जीवशास्त्र आणि संवर्धनातील कौशल्ये विकसित करा.",
        marineDuration: "१२ आठवडे",
        marineLocation: "वास्को द गामा",
        marineRating: "४.९",
        marineStudents: "५६",
        marinePrice: "₹४,४९९",
        marineLevel: "प्रगत",
        viewAllCourses: "सर्व अभ्यासक्रम पहा",

        // How It Works Section
        howItWorksTitle: "ते कसे काम करते",
        howItWorksDescription: "कौशल्य प्राविण्य आणि करिअरच्या यशाचा तुमचा प्रवास येथून सुरू होतो. तुमची क्षमता अनलॉक करण्यासाठी या सोप्या चरणांचे अनुसरण करा.",
        discoverCoursesTitle: "अभ्यासक्रम शोधा",
        discoverCoursesDesc: "गोव्याच्या अनन्य संधींसाठी तयार केलेल्या कौशल्य-आधारित अभ्यासक्रमांची आमची विस्तृत सूची ब्राउझ करा.",
        connectMentorsTitle: "मार्गदर्शकांशी कनेक्ट व्हा",
        connectMentorsDesc: "तुमच्या शिकण्याच्या प्रवासात आणि करिअरच्या मार्गात मार्गदर्शन करणाऱ्या अनुभवी व्यावसायिकांशी जुळा.",
        buildPortfolioTitle: "तुमचा पोर्टफोलिओ तयार करा",
        buildPortfolioDesc: "मायक्रो-क्रेडेंशियल्स मिळवा आणि तुमच्या नवीन प्राप्त केलेल्या कौशल्यांचे प्रदर्शन करणारा डिजिटल पोर्टफोलिओ तयार करा.",
        findOpportunitiesTitle: "संधी शोधा",
        findOpportunitiesDesc: "SkillConnect क्रेडेंशियल्सला महत्त्व देणाऱ्या स्थानिक नियोक्त्यांकडून संधी दर्शविणाऱ्या आमच्या जॉब बोर्डमध्ये प्रवेश करा.",
        readyToStart: "तुमचा प्रवास सुरू करण्यास तयार आहात?",

        // Jobs Hero Section
        jobsHeroTitle: "गोव्यातील नोकरीच्या संधी",
        jobsHeroDescription: "आपल्या कौशल्यांशी जुळणाऱ्या आणि गोव्याच्या वाढत्या अर्थव्यवस्थेत योगदान देणाऱ्या करिअरच्या संधी शोधा.",

        // Job Listing Section - Filters & Search
        jobSearchPlaceholder: "नोकरी, कंपन्या किंवा कौशल्ये शोधा...",
        allCategoriesLabel: "सर्व श्रेणी",
        allLocationsLabel: "सर्व ठिकाणे",
        allTypesLabel: "सर्व प्रकार",
        all: "सर्व",
        panajiOption: "पणजी",
        margaoOption: "मडगाव",
        vascoOption: "वास्को द गामा",
        bicholimOption: "बिचोली",
        pondaOption: "फोंडा",
        donaPaulaOption: "दोना पावला",
        sangueumOption: "सांगे",
        porvorimOption: "परवरी",
        fullTimeOption: "पूर्णवेळ",
        partTimeOption: "अंशवेळ",
        contractOption: "करार",
        internshipOption: "इंटर्नशिप",
        remoteOption: "रिमोट",
        clearFilters: "फिल्टर साफ करा",
        jobsFoundText: "नोकऱ्या आढळल्या",

        // Job Cards
        job1Title: "शाश्वत पर्यटन व्यवस्थापक",
        job1Company: "गोवा पर्यटन विकास महामंडळ",
        job1Location: "पणजी",
        fullTimeTag: "पूर्णवेळ",
        experienceTag: "वर्षे",
        job1Desc: "गोव्याच्या नैसर्गिक सौंदर्य आणि सांस्कृतिक वारसा जतन करताना पर्यावरणास अनुकूल पर्यटन पद्धती विकसित करून गोव्यात शाश्वत पर्यटन उपक्रमांचे नेतृत्व करा.",
        sustainableTourismSkill: "शाश्वत पर्यटन",
        projectManagementSkill: "प्रकल्प व्यवस्थापन",
        communityEngagementSkill: "समुदाय सहभाग",
        marketingSkill: "विपणन",
        plusOneOne: "+१ अधिक",
        job1Salary: "₹18,000.00 - ₹22,000.00 प्रति वर्ष",
        job1Deadline: "अर्जाची अंतिम मुदत: १५ दिवस बाकी",
        applyNow: "आता अर्ज करा",
        details: "तपशील",

        job2Title: "डिजिटल मार्केटिंग विशेषज्ञ",
        job2Company: "गोवा टेक सोल्युशन्स",
        job2Location: "रिमोट",
        job2Desc: "सोशल मीडिया, एसईओ आणि कंटेंट मार्केटिंगवर लक्ष केंद्रित करून स्थानिक व्यवसायांसाठी डिजिटल मार्केटिंग मोहिमा चालवा.",
        socialMediaMarketingSkill: "सोशल मीडिया मार्केटिंग",
        seoSkill: "एसईओ",
        googleAdsSkill: "गुगल ॲड्स",
        job2Salary: "₹15,000.00 - ₹18,000.00 प्रति वर्ष",
        job2Deadline: "अर्जाची अंतिम मुदत: ३० दिवस बाकी",

        job3Title: "समुद्री जीवशास्त्र संशोधन सहाय्यक",
        job3Company: "गोवा विद्यापीठ - सागरी विज्ञान विभाग",
        job3Location: "दोना पावला",
        contractTag: "करार",
        researchTag: "संशोधन",
        job3Desc: "गोव्याच्या किनारपट्टीवर सागरी जैवविविधता संशोधन प्रकल्पांना समर्थन द्या, ज्यात डेटा संकलन, विश्लेषण आणि क्षेत्रीय कार्य यांचा समावेश आहे.",
        marineBiologySkill: "समुद्री जीवशास्त्र",
        researchMethodsSkill: "संशोधन पद्धती",
        dataAnalysisSkill: "डेटा विश्लेषण",
        fieldWorkSkill: "क्षेत्रीय कार्य",
        job3Salary: "₹3,500.00 - ₹5,000.00 प्रति महिना",
        job3Deadline: "अर्जाची अंतिम मुदत: ३ दिवस बाकी",

        job4Title: "पारंपरिक हस्तकला प्रशिक्षक",
        job4Company: "गोवा हेरिटेज फाउंडेशन",
        job4Location: "बिचोली",
        partTimeTag: "अंशवेळ",
        educationTag: "शिक्षण",
        job4Desc: "सांस्कृतिक वारसा जतन करण्यासाठी मातीची भांडी, विणकाम आणि लाकडी काम यासह पारंपारिक गोव्यातील हस्तकला शिकवा.",
        traditionalCraftsSkill: "पारंपरिक हस्तकला",
        teachingSkill: "शिक्षण",
        culturalHeritageSkill: "सांस्कृतिक वारसा",
        workshopManagementSkill: "कार्यशाळा व्यवस्थापन",
        job4Salary: "₹2,500.00 - ₹4,000.00 प्रति दिन",
        job4Deadline: "अर्जाची अंतिम मुदत: ५ दिवस बाकी",

        job5Title: "सेंद्रिय शेत व्यवस्थापक",
        job5Company: "ग्रीन गोवा फार्म्स",
        job5Location: "सांगे",
        agricultureTag: "शेती",
        job5Desc: "सेंद्रिय शेतीचे कार्य व्यवस्थापित करा, शाश्वत कृषी पद्धती लागू करा आणि स्थानिक शेती समुदायांशी समन्वय साधा.",
        organicFarmingSkill: "सेंद्रिय शेती",
        sustainableAgricultureSkill: "शाश्वत शेती",
        teamManagementSkill: "संघ व्यवस्थापन",
        cropPlanningSkill: "पीक नियोजन",
        job5Salary: "₹14,000.00 - ₹18,000.00 प्रति महिना",
        job5Deadline: "अर्जाची अंतिम मुदत: १ आठवडा बाकी",

        job6Title: "फुल स्टॅक डेव्हलपर",
        job6Company: "स्टार्टअप गोवा इनक्यूबेटर",
        job6Location: "परवरी",
        technologyTag: "तंत्रज्ञान",
        job6Desc: "स्थानिक स्टार्टअप्ससाठी वेब ॲप्लिकेशन्स विकसित करा, आधुनिक टेक स्टॅकवर काम करा आणि गोव्याच्या टेक इकोसिस्टममध्ये योगदान द्या.",
        reactJsSkill: "रिॲक्ट.जेएस",
        nodeJsSkill: "नोड.जेएस",
        mongoDbSkill: "मोंगोडीबी",
        awsSkill: "एडब्ल्यूएस",
        plusTwoMore: "+२ अधिक",
        job6Salary: "₹18,000.00 - ₹22,000.00 प्रति वर्ष",
        job6Deadline: "अर्जाची अंतिम मुदत: १५ दिवस बाकी",

        job7Title: "आतिथ्य ऑपरेशन इंटर्न",
        job7Company: "ताज हॉटेल्स - गोवा",
        job7Location: "कँडोलिम",
        internshipTag: "इंटर्नशिप",
        hospitalityTag: "आतिथ्य",
        experienceTagEntry: "प्रारंभिक स्तर",
        job7Desc: "लक्झरी रिसॉर्टमध्ये हॉटेल ऑपरेशन, अतिथी सेवा आणि आतिथ्य व्यवस्थापनामध्ये व्यावहारिक अनुभव मिळवा.",
        customerServiceSkill: "ग्राहक सेवा",
        hotelOperationsSkill: "हॉटेल ऑपरेशन्स",
        guestRelationsSkill: "अतिथी संबंध",
        eventManagementSkill: "इव्हेंट व्यवस्थापन",
        job7Salary: "₹10,000.00 - ₹20,000.00 प्रति महिना",
        job7Deadline: "अर्जाची अंतिम मुदत: ३० दिवस बाकी",

        job8Title: "फ्रीलान्स कंटेंट क्रिएटर",
        job8Company: "गोवा कंटेंट कलेक्टिव्ह",
        job8Location: "रिमोट",
        remoteTag: "रिमोट",
        contentTag: "सामग्री",
        job8Desc: "गोव्याची संस्कृती, पर्यटन आणि जीवनशैलीबद्दल विविध डिजिटल प्लॅटफॉर्म आणि कंटेंट मार्केटिंगसाठी आकर्षक सामग्री तयार करा.",
        contentWritingSkill: "सामग्री लेखन",
        socialMediaSkill: "सोशल मीडिया",
        photographySkill: "फोटोग्राफी",
        videoEditingSkill: "व्हिडिओ संपादन",
        job8Salary: "₹500.00 - ₹2,000.00 प्रति नमुना",
        job8Deadline: "अर्जाची अंतिम मुदत: ६ दिवस बाकी",

        // Mentors Hero Section
        mentorsHeroTitle: "मार्गदर्शकांशी संपर्क साधा",
        mentorsHeroDescription: "उद्योग तज्ञांकडून आणि अनुभवी व्यावसायिकांकडून शिका जे अनन्य संधी आणि आव्हाने समजून घेतात.",

        // Mentors Listing Section - Filters & Search
        mentorSearchPlaceholder: "मार्गदर्शक किंवा कौशल्ये शोधा...",
        industryLabel: "सर्व उद्योग",
        tourismIndustry: "पर्यटन",
        digitalIndustry: "डिजिटल विपणन",
        artsIndustry: "कला आणि हस्तकला",
        environmentalIndustry: "पर्यावरण",
        agricultureIndustry: "शेती",
        hospitalityIndustry: "आतिथ्य",
        technologyIndustry: "तंत्रज्ञान",
        locationLabel: "सर्व ठिकाणे",

        mentorsFoundText: "मार्गदर्शक सापडले",

        // Mentor Cards
        mentor1Name: "प्रिया शर्मा",
        mentor1Role: "गोवा पर्यटन मंडळात शाश्वत पर्यटन संचालक",
        mentor1Location: "पणजी",
        mentor1Bio: "आतिथ्य आणि पर्यावरण-पर्यटन विकासात १५+ वर्षांच्या अनुभवासह गोव्यात शाश्वत पर्यटन उपक्रमांचे नेतृत्व करत आहे.",
        hospitalityManagementSkill: "आतिथ्य व्यवस्थापन",
        ecoTourismSkill: "पर्यावरण-पर्यटन",
        mentor1Rating: "४.९",
        mentor1Mentees: "४५ प्रशिक्षणार्थी",
        mentor1Experience: "१५+ वर्षे",
        mentor1Availability: "व्हर्च्युअल सत्रांसाठी उपलब्ध",
        connectWithMentor: "यांच्याशी संपर्क साधा",

        mentor2Name: "राजेश नाईक",
        mentor2Role: "फ्रीलान्स सल्लागार म्हणून डिजिटल मार्केटिंग विशेषज्ञ",
        mentor2Location: "मडगाव",
        mentor2Bio: "डेटा-आधारित डिजिटल मार्केटिंग रणनीती आणि सोशल मीडिया कौशल्याने गोव्यातील व्यवसायांना ऑनलाइन वाढण्यास मदत करत आहे.",
        contentStrategySkill: "सामग्री रणनीती",
        mentor2Rating: "४.८",
        mentor2Mentees: "३८ प्रशिक्षणार्थी",
        mentor2Experience: "१२+ वर्षे",
        mentor2Availability: "प्रत्यक्ष भेटींसाठी खुले",

        mentor3Name: "डॉ. मारिया फर्नांडिस",
        mentor3Role: "गोवा विद्यापीठात सागरी संवर्धन शास्त्रज्ञ",
        mentor3Location: "दोना पावला",
        mentor3Bio: "गोव्याच्या पाण्यातील सागरी जैवविविधता संवर्धन आणि शाश्वत मासेमारी पद्धतींमध्ये विशेष संशोधन वैज्ञानिक.",
        conservationSkill: "संवर्धन",
        mentor3Rating: "४.९",
        mentor3Mentees: "२८ प्रशिक्षणार्थी",
        mentor3Experience: "२०+ वर्षे",
        mentor3Availability: "संशोधन मार्गदर्शनासाठी उपलब्ध",

        mentor4Name: "कार्लोस डिसोझा",
        mentor4Role: "गोवा हेरिटेज क्राफ्ट्समध्ये पारंपरिक हस्तकला मास्टर",
        mentor4Location: "बिचोली",
        mentor4Bio: "मातीची भांडी, विणकाम आणि लाकडी कामासह पारंपरिक गोव्याच्या हस्तकला जतन आणि शिकवणारे कुशल कारागीर.",
        potterySkill: "मातीची भांडी",
        woodworkingSkill: "लाकडी काम",
        mentor4Rating: "५",
        mentor4Mentees: "६७ प्रशिक्षणार्थी",
        mentor4Experience: "२५+ वर्षे",
        mentor4Availability: "कार्यशाळा सत्रे उपलब्ध",

        mentor5Name: "अंजली पार्सेकर",
        mentor5Role: "ग्रीन गोवा इनिशिएटिव्हमध्ये सेंद्रिय शेती सल्लागार",
        mentor5Location: "सांगे",
        mentor5Bio: "ग्रामीण गोव्यामध्ये शाश्वत कृषी पद्धती आणि सेंद्रिय शेती तंत्रांना प्रोत्साहन देत आहे.",
        permacultureSkill: "परमॅकल्चर",
        mentor5Rating: "४.७",
        mentor5Mentees: "५२ प्रशिक्षणार्थी",
        mentor5Experience: "१८+ वर्षे",
        mentor5Availability: "क्षेत्रीय भेटी आणि व्हर्च्युअल सत्रे",

        mentor6Name: "विक्रम कामत",
        mentor6Role: "गोवाटेक सोल्युशन्समध्ये टेक उद्योजक",
        mentor6Location: "परवरी",
        mentor6Bio: "गोव्याच्या वाढत्या टेक इकोसिस्टममध्ये स्थानिक व्यवसायांसाठी आणि स्टार्टअप्ससाठी टेक सोल्यूशन्स तयार करणारा सिरियल उद्योजक.",
        entrepreneurshipSkill: "उद्योजकता",
        softwareDevelopmentSkill: "सॉफ्टवेअर विकास",
        businessStrategySkill: "व्यवसाय रणनीती",
        mentor6Rating: "४.८",
        mentor6Mentees: "३४ प्रशिक्षणार्थी",
        mentor6Experience: "१४+ वर्षे",
        mentor6Availability: "लवकर वेळापत्रक",

        // About Us Section
        aboutGoaSkillUpConnectTitle: "आमच्या बद्दल स्किलकनेक्ट",
        aboutGoaSkillUpConnectDescription: "आम्ही गुणवत्तापूर्ण शिक्षण, अभिनव प्रशिक्षण कार्यक्रम आणि अर्थपूर्ण मार्गदर्शन संबंधांद्वारे गोव्यात कौशल्य अंतर कमी करण्यासाठी आणि आर्थिक सक्षमीकरणास प्रोत्साहन देण्यासाठी मिशनवर आहोत.",

        // Mission & Vision Section
        ourMissionTitle: "आमचे ध्येय",
        ourMissionDescription: "गोव्याच्या आर्थिक गरजा आणि सांस्कृतिक मूल्यांशी जुळणाऱ्या सुलभ, उच्च-गुणवत्तेच्या कौशल्य विकास संधी प्रदान करून गोव्यातील समुदायांना सक्षम करणे, शाश्वत विकास लक्ष्य ४: गुणवत्तापूर्ण शिक्षणाच्या प्राप्तीमध्ये योगदान देणे.",
        ourVisionTitle: "आमची दृष्टी",
        ourVisionDescription: "कौशल्य विकास आणि करिअर प्रगतीसाठी गोव्याचे अग्रगण्य व्यासपीठ बनणे, एक भरभराटीची परिसंस्था निर्माण करणे जिथे पारंपरिक ज्ञान आधुनिक नवोपक्रमांशी मिळते आणि प्रत्येक व्यक्तीला त्यांची पूर्ण क्षमता गाठण्याची संधी मिळते.",
        whyGoaSkillUpConnectTitle: "स्किलकनेक्ट का?",
        whyGoaSkillUpConnectItem1: "स्थानिक प्रासंगिकतेसाठी डिझाइन केलेला गोवा-केंद्रित अभ्यासक्रम",
        whyGoaSkillUpConnectItem2: "उद्योग व्यावसायिकांकडून थेट मार्गदर्शन",
        whyGoaSkillUpConnectItem3: "इंग्रजी, कोंकणी आणि मराठीमध्ये बहुभाषिक समर्थन",
        whyGoaSkillUpConnectItem4: "लवकर कौशल्य प्रमाणीकरणासाठी मायक्रो-क्रेडेंशिअलिंग",

        // Core Values Section
        coreValuesTitle: "आमची मूळ मूल्ये",
        coreValuesDescription: "ही तत्त्वे स्किलकनेक्टमध्ये आम्ही जे काही करतो त्याला मार्गदर्शन करतात",
        qualityEducationTitle: "गुणवत्ता शिक्षण",
        qualityEducationDescription: "शाश्वत विकासासाठी SDG ४ शी जुळणारे उच्च-गुणवत्तेचे, संबंधित शिक्षण देण्यासाठी वचनबद्ध.",
        localImpactTitle: "स्थानिक प्रभाव",
        localImpactDescription: "जागतिक संधींसाठी शिक्षणार्थींना तयार करताना गोव्याच्या अनन्य आर्थिक गरजा पूर्ण करण्यावर लक्ष केंद्रित केले आहे.",
        communityDrivenTitle: "समुदाय-आधारित",
        communityDrivenDescription: "गोवेकरांनी, गोवेकरांसाठी तयार केलेले - स्थानिक प्रतिभेला प्रोत्साहन देणे आणि नवोपक्रम स्वीकारताना सांस्कृतिक मूल्यांचे जतन करणे.",
        inclusiveGrowthTitle: "समावेशक वाढ",
        inclusiveGrowthDescription: "गोव्यातील सर्व समुदायांमध्ये कौशल्य विकासाच्या संधींसाठी समान प्रवेश सुनिश्चित करणे.",

        // Meet Our Team Section
        teamTitle: "आमच्या टीमला भेटा",
        teamDescription: "गोव्याच्या वाढीसाठी समर्पित असलेले उत्साही शिक्षक आणि उद्योग व्यावसायिक",
        member1Initials: "डी.एम.एफ",
        member1Name: "डॉ. मारिया फर्नांडिस",
        member1Role: "संस्थापक आणि सीईओ",
        member1Specialty: "शैक्षणिक तंत्रज्ञान",
        member1Bio: "गोवा विद्यापीठातील माजी प्राध्यापक, कौशल्य विकासात १५+ वर्षांचा अनुभव.",
        member2Initials: "आर.के.",
        member2Name: "राजेश कामत",
        member2Role: "भागीदारी प्रमुख",
        member2Specialty: "उद्योग संबंध",
        member2Bio: "गोव्यातील स्थानिक व्यवसायांना कुशल प्रतिभेशी जोडणे.",
        member3Initials: "पी.डी.",
        member3Name: "प्रिया देसाई",
        member3Role: "समुदाय संपर्क",
        member3Specialty: "सामाजिक प्रभाव",
        member3Bio: "समावेशक शिक्षण आणि समुदाय सक्षमीकरणाबद्दल उत्साही.",

        // Our Impact Goals Section
        impactGoalsTitle: "आमची प्रभाव लक्ष्ये",
        impactGoalsDescription: "२०३० पर्यंत, आम्ही १०,०००+ गोवेकरांना संबंधित कौशल्यांमध्ये प्रशिक्षित करण्याचे, ५००+ मार्गदर्शन संबंध सुलभ करण्याचे आणि १,०००+ स्थानिक नोकरी प्लेसमेंटला समर्थन देण्याचे लक्ष्य ठेवले आहे, ज्यामुळे गोव्याच्या शाश्वत आर्थिक विकासात महत्त्वपूर्ण योगदान मिळेल.",
        skilledGraduatesCount: "१०,०००+",
        skilledGraduatesLabel: "कुशल पदवीधर",
        mentorshipConnectionsCount: "५००+",
        mentorshipConnectionsLabel: "मार्गदर्शन संबंध",
        jobPlacementsCount: "१,०००+",
        jobPlacementsLabel: "नोकरी प्लेसमेंट",
        joinOurMissionButton: "आमच्या मिशनमध्ये सामील व्हा",

        // Discover Your Perfect Course Section
        discoverCourseTitle: "तुमचा परिपूर्ण अभ्यासक्रम शोधा",
        discoverCourseDescription: "गोव्याच्या विकसनशील अर्थव्यवस्थेसाठी विशेषतः डिझाइन केलेल्या कौशल्य-निर्मिती अभ्यासक्रमांची आमची विस्तृत सूची एक्सप्लोर करा.",
        searchPlaceholder: "अभ्यासक्रम, कौशल्ये किंवा प्रदाते शोधा...",
        categoryLabel: "श्रेणी",
        durationLabel: "कालावधी",
        difficultyLabel: "कठीणता",
        sortByLabel: "यानुसार क्रमवारी लावा",
        onlineOption: "ऑनलाइन",
        shortDurationOption: "८ आठवड्यांपेक्षा कमी",
        mediumDurationOption: "८-१२ आठवडे",
        longDurationOption: "१२ आठवड्यांपेक्षा जास्त",
        beginnerOption: "नवशिक्या",
        intermediateOption: "मध्यम",
        advancedOption: "प्रगत",
        popularityOption: "लोकप्रियता",
        newestOption: "नवीनतम",
        ratingOption: "रेटिंग",
        certifiedCoursesOnlyLabel: "फक्त प्रमाणित अभ्यासक्रम",

        // Course Listing Section
        showingCoursesText: "अभ्यासक्रम दाखवत आहे", // Will be dynamically filled "Showing X of Y courses"
        certifiedTag: "प्रमाणित",
        nonCertifiedTag: "गैर-प्रमाणित",
        intermediateLevelTag: "मध्यम",
        beginnerLevelTag: "नवशिक्या",
        advancedLevelTag: "प्रगत",
        listTourismTitle: "शाश्वत पर्यटन मार्गदर्शक प्रमाणपत्र",
        listTourismDesc: "गोव्याचे नैसर्गिक सौंदर्य आणि सांस्कृतिक वारसा जतन करताना पर्यावरणपूरक पर्यटन अनुभव निर्माण करण्यास शिका.",
        ecoTourismSkill: "पर्यावरण-पर्यटन",
        heritageConservationSkill: "वारसा संवर्धन",
        guestRelationsSkill: "अतिथी संबंध",
        listTourismDuration: "६ आठवडे",
        listTourismRating: "४.८ (१२४)",
        listTourismLocation: "पणजी",
        listTourismStudents: "१२४ विद्यार्थी",
        listTourismProvider: "प्रदाता: गोवा पर्यटन मंडळ",
        listTourismPrice: "₹८,४९९",
        enrollNow: "आता नावनोंदणी करा",

        listAyurvedicTitle: "आयुर्वेदिक कल्याण थेरपी",
        listAyurvedicDesc: "वाढत्या कल्याण पर्यटन क्षेत्रासाठी पारंपरिक आयुर्वेदिक मालिश आणि कल्याण पद्धती.",
        ayurvedicPrinciplesSkill: "आयुर्वेदिक तत्त्वे",
        massageTechniquesSkill: "मालिश तंत्रे",
        herbalMedicineSkill: "वनौषधी",
        listAyurvedicDuration: "१४ आठवडे",
        listAyurvedicRating: "४.७ (११२)",
        listAyurvedicLocation: "मडगाव",
        listAyurvedicStudents: "११२ विद्यार्थी",
        listAyurvedicProvider: "प्रदाता: आयुर्वेद संस्था गोवा",
        listAyurvedicPrice: "₹५,९९९",

        listDigitalMarketingTitle: "स्थानिक व्यवसायांसाठी डिजिटल मार्केटिंग",
        listDigitalMarketingDesc: "गोव्यातील व्यवसाय आणि आतिथ्य उद्योगासाठी तयार केलेल्या ऑनलाइन मार्केटिंग रणनीतीमध्ये प्रभुत्व मिळवा.",
        contentCreationSkill: "सामग्री निर्मिती",
        listDigitalMarketingDuration: "४ आठवडे",
        listDigitalMarketingRating: "४.६ (८९)",
        listDigitalMarketingLocation: "ऑनलाइन",
        listDigitalMarketingStudents: "८९ विद्यार्थी",
        listDigitalMarketingProvider: "प्रदाता: टेक गोवा संस्था",
        listDigitalMarketingPrice: "₹५,१९९",

        listOrganicFarmingTitle: "सेंद्रिय शेती आणि मसाला लागवड",
        listOrganicFarmingDesc: "गोव्यातील पारंपरिक मसाले आणि पिकांवर लक्ष केंद्रित करून शाश्वत शेती तंत्रे शिका.",
        organicMethodsSkill: "सेंद्रिय पद्धती",
        spiceCultivationSkill: "मसाला लागवड",
        soilManagementSkill: "माती व्यवस्थापन",
        listOrganicFarmingDuration: "१० आठवडे",
        listOrganicFarmingRating: "४.५ (७८)",
        listOrganicFarmingLocation: "फोंडा",
        listOrganicFarmingStudents: "७८ विद्यार्थी",
        listOrganicFarmingProvider: "प्रदाता: गोवा कृषी विद्यापीठ",
        listOrganicFarmingPrice: "₹७,४९९",

        listMarineConservationTitle: "समुद्री संवर्धन आणि संशोधन",
        listMarineConservationDesc: "गोव्याच्या किनारपट्टीवरील सागरी जैवविविधता संवर्धनावर व्यापक कार्यक्रम.",
        dataCollectionSkill: "डेटा संकलन",
        listMarineConservationDuration: "१२ आठवडे",
        listMarineConservationRating: "४.७ (६७)",
        listMarineConservationLocation: "दोना पावला",
        listMarineConservationStudents: "६७ विद्यार्थी",
        listMarineConservationProvider: "प्रदाता: नॅशनल इन्स्टिट्यूट ऑफ ओशनोग्राफी",
        listMarineConservationPrice: "₹६,९९९",

        listGoanPotteryTitle: "पारंपरिक गोव्याची हस्तकला मातीची भांडी",
        listGoanPotteryDesc: "बिचोलीतील कुशल कारागिरांकडून गोव्याच्या मातीची भांडी बनवण्याची प्राचीन कला शिका.",
        clayModelingSkill: "मातीचे मॉडेलिंग",
        traditionalTechniquesSkill: "पारंपरिक तंत्रे",
        glazingSkill: "ग्लेझिंग",
        listGoanPotteryDuration: "८ आठवडे",
        listGoanPotteryRating: "४.९ (४५)",
        listGoanPotteryLocation: "बिचोली",
        listGoanPotteryStudents: "४५ विद्यार्थी",
        listGoanPotteryProvider: "प्रदाता: गोवा हस्तकला परिषद",
        listGoanPotteryPrice: "₹६,७९९",


        // Get in Touch Section
        getInTouchTitle: "संपर्क साधा",
        getInTouchDescription: "आमच्या अभ्यासक्रम, मार्गदर्शन कार्यक्रम किंवा करिअरच्या संधींबद्दल प्रश्न आहेत? गोव्यात तुमच्या कौशल्य विकास प्रवासात तुम्हाला मार्गदर्शन करण्यासाठी आम्ही येथे आहोत.",
        formCardTitle: "आम्हाला संदेश पाठवा",
        formCardDescription: "खालील फॉर्म भरा आणि आम्ही तुम्हाला लवकरच संपर्क साधू.",
        fullNameLabel: "पूर्ण नाव",
        emailAddressLabel: "ईमेल पत्ता",
        subjectLabel: "विषय",
        messageLabel: "संदेश",
        fullNamePlaceholder: "तुमचे पूर्ण नाव",
        emailAddressPlaceholder: "तुमचा ईमेल@उदाहरण.कॉम",
        subjectPlaceholder: "हे कशाबद्दल आहे?",
        messagePlaceholder: "तुमच्या चौकशीबद्दल अधिक सांगा...",
        sendMessageButton: "संदेश पाठवा",
        contactInfoCardTitle: "संपर्क माहिती",
        contactInfoCardDescription: "आमच्या टीमपर्यंत पोहोचण्याचे अनेक मार्ग",
        emailUsLabel: "आम्हाला ईमेल करा",
        contactEmailValue: "hello@goaskillup.org",
        emailSubtext: "आम्हाला कधीही ईमेल पाठवा",
        callUsLabel: "आम्हाला कॉल करा",
        contactPhoneNumber: "+91 832 123 4567",
        phoneHours: "सोम-शुक्र सकाळी ९ ते सायंकाळी ६",
        visitUsLabel: "आम्हाला भेट द्या",
        contactAddressMain: "पणजी, गोवा ४०३००१",
        mainOfficeSubtext: "आमचे मुख्य कार्यालय स्थान",
        officeHoursLabel: "कार्यालयीन वेळ",
        officeHoursTime: "सकाळी ९:०० - सायंकाळी ६:००",
        officeHoursDays: "सोमवार ते शुक्रवार",
        locationsCardTitle: "आमची ठिकाणे",
        locationsCardDescription: "गोव्यामध्ये आम्हाला शोधा",
        panajiLocationName: "पणजी",
        panajiAddress: "ईडीसी कॉम्प्लेक्स, पत्तो प्लाझा, पणजी, गोवा ४०३००१",
        panajiPhoneValue: "+91 832 123 4567",
        margaoLocationName: "मडगाव",
        margaoAddress: "ग्रेस बिल्डिंग, मडगाव, गोवा ४०३८०१",
        margaoPhoneValue: "+91 832 765 4321",
        pondaLocationName: "फोंडा",
        pondaAddress: "कम्युनिटी सेंटर, फोंडा, गोवा ४०३४०१",
        pondaPhoneValue: "+91 832 567 8901",

        // FAQ Section
        faqHeading: "वारंवार विचारले जाणारे प्रश्न",
        faqQuestion1: "मी अभ्यासक्रमात कसे नावनोंदणी करू?",
        faqAnswer1: "आमची अभ्यासक्रम निर्देशिका ब्राउझ करा, तुम्हाला स्वारस्य असलेला अभ्यासक्रम निवडा आणि 'आता नावनोंदणी करा' वर क्लिक करा. तुम्हाला नोंदणी प्रक्रियेद्वारे मार्गदर्शन केले जाईल.",
        faqQuestion2: "अभ्यासक्रम प्रमाणित आहेत का?",
        faqAnswer2: "आमचे अनेक अभ्यासक्रम प्रमाणपत्रे देतात. अधिकृत प्रमाणपत्रे देणारे अभ्यासक्रम ओळखण्यासाठी अभ्यासक्रम सूचीवर \"प्रमाणित\" बॅज शोधा.",
        faqQuestion3: "मला मार्गदर्शन समर्थन मिळू शकते का?",
        faqAnswer3: "होय! आमच्याकडे अनुभवी गोव्यातील व्यावसायिकांचे नेटवर्क आहे जे मार्गदर्शन देतात. त्यांच्याशी संपर्क साधण्यासाठी आमच्या मार्गदर्शक पृष्ठाला भेट द्या.",
        faqQuestion4: "आर्थिक मदत उपलब्ध आहे का?",
        faqAnswer4: "आम्ही विविध शिष्यवृत्ती आणि देय योजना पर्याय ऑफर करतो. तुमच्या विशिष्ट परिस्थिती आणि उपलब्ध समर्थनावर चर्चा करण्यासाठी आमच्याशी संपर्क साधा.",

        // Footer
        footerLogoText: "स्किलकनेक्ट",
        footerDescription: "गुणवत्ता शिक्षण, कौशल्य विकास आणि शाश्वत विकास उद्दिष्टांशी जुळणाऱ्या करिअरच्या संधींद्वारे गोव्यातील समुदायांना सक्षम करणे.",
        quickLinksHeading: "जलद दुवे",
        supportHeading: "समर्थन",
        helpCenter: "मदत केंद्र",
        privacyPolicy: "गोपनीयता धोरण",
        termsOfService: "सेवा अटी",
        contactUs: "आमच्याशी संपर्क साधा",
        contactInfoHeading: "संपर्क माहिती",
        contactEmail: "hello@SkillConnect.com",
        contactPhone: "+91 832 XXXX XXXX",
        contactAddress: "पणजी, गोवा, भारत",
        copyrightText: "&copy; 2025 स्किलकनेक्ट. सर्व हक्क राखीव. गुणवत्ता शिक्षणासाठी वचनबद्ध (एसडीजी ४)."
    }
};

