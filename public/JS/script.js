(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })


    function checkLazyImages(attempt = 1) {
      setTimeout(() => {
          let lazyImages = document.querySelectorAll("img[loading='lazy']");

          console.log(`Attempt ${attempt}: Found ${lazyImages.length} lazy images`);

          if (lazyImages.length === 0 && attempt < 5) { 
              console.warn(`Lazy images not found, retrying in 2 seconds... (Attempt ${attempt})`);
              checkLazyImages(attempt + 1);
              return;
          }

          if (lazyImages.length > 0 && "IntersectionObserver" in window) {
              let observer = new IntersectionObserver((entries, observer) => {
                  entries.forEach(entry => {
                      if (entry.isIntersecting) {
                          let img = entry.target;
                          console.log(`Loading image: ${img.src}`);
                          img.classList.add("lazy-loaded");
                          observer.unobserve(img);
                      }
                  });
              }, { rootMargin: "100px" });

              lazyImages.forEach(img => observer.observe(img));
          } else {
              console.warn("IntersectionObserver not supported. Loading all images.");
              lazyImages.forEach(img => img.classList.add("lazy-loaded"));
          }
      }, 1000);
  }

  document.addEventListener("DOMContentLoaded", function () {
      console.log("Document Loaded. Checking for lazy images...");
      checkLazyImages();
  });


    
  })()


