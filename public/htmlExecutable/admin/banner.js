document.addEventListener("DOMContentLoaded", async () => {

    /* ---------------------------------------------------------
     *  FETCH SLIDES FROM SERVER (MONGODB)
     * --------------------------------------------------------- */

    let slides = await fetch('/admin/getSlides').then(r => r.json());
    let slidesData = slides.banners
    // let slidesData = []
    console.log('slidesData = ===',slidesData)

    /* ---------------------------------------------------------
     *  DOM ELEMENTS
     * --------------------------------------------------------- */
    const slidesList           = document.getElementById("slides-list");
    const addNewSlideBtn       = document.getElementById("add-new-slide-btn");
    const slideEditor          = document.getElementById("slide-editor");
    const editorTitle          = document.getElementById("editor-title");
    const slideForm            = document.getElementById("slide-form");
    const cancelEditBtn        = document.getElementById("cancel-edit-btn");
    const liveCarouselPreview  = document.getElementById("live-carousel-preview");
    // const publishBtn           = document.getElementById("publish-btn");
    const slideInput           = document.getElementById("slide-id-field");
    const slidePreviewOnInput  = document.getElementById('slide-preview');



    /* ---------------------------------------------------------
     *  RENDER SLIDE LIST (ONLY DELETE)
     * --------------------------------------------------------- */

    const renderSlidesList = () => {
        console.log('working...')
        slidesList.innerHTML = "";
    
        if (slidesData.length === 0) {
            slidesList.innerHTML = `
                <p class="placeholder-text">No slides have been added yet.</p>
            `;
            // publishBtn.disabled = true;
            return;
        }


        slidesData.forEach(slide => {
            const item = document.createElement("div");
            item.className = "slide-item";
            
            item.innerHTML = `
                <div class="slide-item-actions d-flex justify-content-between align-items-center">
                    <img src="/banners/${slide.image}" style="width:200px" alt="bannerimabe">
                    <button class="action-button danger delete-btn" data-id="${slide._id}">
                        Delete
                    </button>
                </div>
            `;

            slidesList.appendChild(item);
        });

        slidesList.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", () => deleteSlide(btn.dataset.id));
        });

        renderCarouselPreview();
    };


    /* ---------------------------------------------------------
     *  CAROUSEL PREVIEW
     * --------------------------------------------------------- */

    const renderCarouselPreview = () => {
        console.log('rendering carousal preview...')
        liveCarouselPreview.innerHTML = "";

        if (slidesData.length === 0) {
            liveCarouselPreview.innerHTML = `
                <p class="placeholder-text">Add banners below to see the preview.</p>
            `;
            return;
        }

        slidesData.forEach((slide, idx) => {
            const slideEl = document.createElement("div");
            slideEl.className = `preview-slide ${idx === 0 ? "active" : ""}`;

            slideEl.innerHTML = `
                <img src="/banners/${slide.image}" alt="Slide Preview">
            `;

            liveCarouselPreview.appendChild(slideEl);
        });

        let previewIndex = 0;
        clearInterval(liveCarouselPreview.timer);

        liveCarouselPreview.timer = setInterval(() => {
            const slides = liveCarouselPreview.querySelectorAll(".preview-slide");
            if (slides.length === 0) return;

            slides[previewIndex].classList.remove("active");
            previewIndex = (previewIndex + 1) % slides.length;
            slides[previewIndex].classList.add("active");
        }, 3000);
    };


    /* ---------------------------------------------------------
     *  NEW SLIDE EDITOR (NO EDIT MODE)
     * --------------------------------------------------------- */

    const openNewSlideEditor = () => {
        slideEditor.classList.remove("hidden");
        console.log('clicked...')
        editorTitle.textContent = "Create New Slide";
        slideForm.reset();
    };

    slideInput.addEventListener('change',(e)=>{
        const file = e.target.files[0];
        const imageURL = URL.createObjectURL(file)
        console.log('files = ',file)
        if(!file){
            slidePreviewOnInput.style.display = none;
            return;
        }
        
        slidePreviewOnInput.display = "block";
        slidePreviewOnInput.src = imageURL;
        
    })

    /* ---------------------------------------------------------
     *  DELETE SLIDE (USING MONGODB _id)
     * --------------------------------------------------------- */

    const deleteSlide = async (id) => {
        if (!confirm("Are you sure you want to delete this slide?")) return;

        await fetch(`/admin/deleteSlide/${id}`, { method: "DELETE" });

        slidesData = slidesData.filter(s => s._id !== id);
        renderSlidesList();
    };


    /* ---------------------------------------------------------
     *  SAVE NEW SLIDE (NO ID CREATED HERE)
     * --------------------------------------------------------- */

    const handleSaveSlide = async () => {

        const formData = new FormData(slideForm);

        const res = await fetch('/admin/Banner', {
            method: "POST",
            body: formData
        });

        const savedSlide = await res.json(); // contains MongoDB _id

        slidesData.push(savedSlide.banner);

        slideEditor.classList.add("hidden");
        renderSlidesList();
    };


    /* ---------------------------------------------------------
     *  PUBLISH
     * --------------------------------------------------------- */

    // const handlePublish = () => {
    //     alert("SUCCESS! Carousel configuration published.");
    // };


    /* ---------------------------------------------------------
     *  EVENT LISTENERS
     * --------------------------------------------------------- */

    addNewSlideBtn.addEventListener("click", () => {
        openNewSlideEditor();            // show form
        document.getElementById("slide-file").click(); // open file chooser
    });
    cancelEditBtn.addEventListener("click", () => slideEditor.classList.add("hidden"));
    slideForm.addEventListener("submit", ()=>{
        handleSaveSlide()
    });
    // publishBtn.addEventListener("click", handlePublish);


    /* ---------------------------------------------------------
     *  INIT
     * --------------------------------------------------------- */

    renderSlidesList();
});
