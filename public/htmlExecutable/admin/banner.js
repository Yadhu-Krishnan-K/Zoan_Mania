document.addEventListener('DOMContentLoaded', async() => {
    // --- Initial Data Store (MOCK DATABASE) ---
    // let slidesData = [
    //     { id: 1, imageUrl: 'https://picsum.photos/800/250?random=1'},
    //     { id: 2, imageUrl: 'https://picsum.photos/800/250?random=2'}
    // ];
    let slidesData = await fetch('/admin/getSlides')
    let nextSlideId = slidesData.length > 0 ? Math.max(...slidesData.map(s => s.id)) + 1 : 1;

    // --- DOM Elements ---
    const slidesList = document.getElementById('slides-list');
    const addNewSlideBtn = document.getElementById('add-new-slide-btn');
    const slideEditor = document.getElementById('slide-editor');
    const editorTitle = document.getElementById('editor-title');
    const slideForm = document.getElementById('slide-form');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const liveCarouselPreview = document.getElementById('live-carousel-preview');
    const publishBtn = document.getElementById('publish-btn');
    
    // Form fields
    const slideIdField = document.getElementById('slide-id-field');


    // --- Core Functions ---

    /** Renders the list of slides in the management section. */
    const renderSlidesList = () => {
        slidesList.innerHTML = '';
        if (slidesData.length === 0) {
            slidesList.innerHTML = '<p class="placeholder-text">No slides have been added yet.</p>';
            publishBtn.disabled = true;
            return;
        }
        
        publishBtn.disabled = false;

        slidesData.forEach(slide => {
            const item = document.createElement('div');
            item.className = 'slide-item';
            item.innerHTML = `
                <div class="slide-item-actions">
                    <button class="action-button danger delete-btn" data-id="${slide.id}">Delete</button>
                </div>
            `;
            slidesList.appendChild(item);
        });

        // Attach event listeners to the new buttons
        slidesList.querySelectorAll('.edit-btn').forEach(btn => 
            btn.addEventListener('click', () => editSlide(parseInt(btn.dataset.id)))
        );
        slidesList.querySelectorAll('.delete-btn').forEach(btn => 
            btn.addEventListener('click', () => deleteSlide(parseInt(btn.dataset.id)))
        );
        
        renderCarouselPreview();
    };
    
    /** Renders and starts the basic carousel preview. */
    const renderCarouselPreview = () => {
        liveCarouselPreview.innerHTML = '';
        if (slidesData.length === 0) {
            liveCarouselPreview.innerHTML = '<p class="placeholder-text">Add banners below to see the preview.</p>';
            return;
        }
        
        slidesData.forEach((slide, index) => {
            const slideEl = document.createElement('div');
            slideEl.className = 'preview-slide' + (index === 0 ? ' active' : '');
            slideEl.innerHTML = `
                <img src="${slide.imageUrl}" alt="Slide ${slide.id} Preview">
            `;
            liveCarouselPreview.appendChild(slideEl);
        });

        // Simple preview rotation (simulating the carousel)
        let previewIndex = 0;
        clearInterval(liveCarouselPreview.timer); // Clear existing timer
        liveCarouselPreview.timer = setInterval(() => {
            const slides = liveCarouselPreview.querySelectorAll('.preview-slide');
            if (slides.length === 0) return;
            
            // Hide current slide
            slides[previewIndex].classList.remove('active');
            
            // Move to next index
            previewIndex = (previewIndex + 1) % slides.length;
            
            // Show new slide
            slides[previewIndex].classList.add('active');
        }, 3000); // Change slide every 3 seconds
    };

    /** Opens the editor for a new slide. */
    const openNewSlideEditor = () => {
        editorTitle.textContent = 'Create New Slide';
        slideIdField.value = ''; // Empty ID for new slide
        slideForm.reset();
        slideEditor.classList.remove('hidden');
    };
    
    /** Opens the editor to update an existing slide. */
    const editSlide = (id) => {
        const slide = slidesData.find(s => s.id === id);
        if (!slide) return;

        editorTitle.textContent = `Edit Slide ${id}`;
        
        slideIdField.value = slide.id;

        slideEditor.classList.remove('hidden');
    };

    /** Deletes a slide from the data store. */
    const deleteSlide = (id) => {
        if (confirm(`Are you sure you want to delete Slide ${id}?`)) {
            slidesData = slidesData.filter(s => s.id !== id);
            renderSlidesList();
        }
    };
    
    /** Handles saving the slide data from the form. */
    const handleSaveSlide = (e) => {
        e.preventDefault();

        const id = slideIdField.value ? parseInt(slideIdField.value) : null;
        const newSlideData = {
            // imageUrl: imageUrlInput.value.trim(),
        };

        if (id) {
            // Update existing slide
            const index = slidesData.findIndex(s => s.id === id);
            if (index !== -1) {
                slidesData[index] = { ...slidesData[index], ...newSlideData };
            }
        } else {
            // Add new slide
            slidesData.push({ id: nextSlideId++, ...newSlideData });
        }
        
        slideEditor.classList.add('hidden');
        renderSlidesList();
    };
    
    /** Handles the mock publish button click. */
    const handlePublish = () => {
        alert('SUCCESS! The current carousel configuration has been published to the live site. (In a real system, this sends the JSON data to your server.)');
    };

    // --- Event Listeners ---
    addNewSlideBtn.addEventListener('click', openNewSlideEditor);
    cancelEditBtn.addEventListener('click', () => slideEditor.classList.add('hidden'));
    slideForm.addEventListener('submit', handleSaveSlide);
    publishBtn.addEventListener('click', handlePublish);

    // --- Initialization ---
    renderSlidesList();
});
