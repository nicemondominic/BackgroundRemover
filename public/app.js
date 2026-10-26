const fileInput =
    document.getElementById("fileInput");

const browseButton =
    document.getElementById("browseButton");

const dropZone =
    document.getElementById("dropZone");

const uploadSection =
    document.getElementById("uploadSection");

const processingSection =
    document.getElementById("processingSection");

const resultSection =
    document.getElementById("resultSection");

const originalPreview =
    document.getElementById("originalPreview");

const resultPreview =
    document.getElementById("resultPreview");

const downloadButton =
    document.getElementById("downloadButton");

const newButton =
    document.getElementById("newButton");

const resultInfo =
    document.getElementById("resultInfo");

const errorBox =
    document.getElementById("errorBox");

const progressBar =
    document.getElementById("progressBar");


let currentFile = null;

// BROWSE

browseButton.addEventListener("click", (event) => {

    event.stopPropagation();

    fileInput.click();

});


dropZone.addEventListener("click", () => {

    fileInput.click();

});


fileInput.addEventListener("change", () => {

    if (fileInput.files.length > 0) {

        handleFile(fileInput.files[0]);

    }

});

// DRAG & DROP

dropZone.addEventListener("dragover", (event) => {

    event.preventDefault();

    dropZone.classList.add("dragging");

});


dropZone.addEventListener("dragleave", () => {

    dropZone.classList.remove("dragging");

});


dropZone.addEventListener("drop", (event) => {

    event.preventDefault();

    dropZone.classList.remove("dragging");

    const files = event.dataTransfer.files;

    if (files.length > 0) {

        handleFile(files[0]);

    }

});

// HANDLE FILE

function handleFile(file) {

    clearError();

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {

        showError(
            "Please select a JPG, PNG or WEBP image."
        );

        return;
    }


    if (file.size > 50 * 1024 * 1024) {

        showError(
            "The image is larger than 50 MB."
        );

        return;
    }


    currentFile = file;

    console.log(
    "Selected file:",
    currentFile.name,
    currentFile.type,
    currentFile.size
);


    // Show original preview immediately

    const reader = new FileReader();

    reader.onload = (event) => {

        originalPreview.src =
            event.target.result;

    };

    reader.readAsDataURL(file);


    startProcessing();

}

// PROCESS

async function startProcessing() {

    if (!currentFile) {

        showError("No image selected.");

        uploadSection.classList.remove("hidden");
        processingSection.classList.add("hidden");

        return;
    }


    uploadSection.classList.add("hidden");

    resultSection.classList.add("hidden");

    processingSection.classList.remove("hidden");

    progressBar.style.width = "5%";


    const formData = new FormData();

    formData.append(
        "image",
        currentFile,
        currentFile.name
    );


    console.log(
        "Uploading:",
        currentFile.name,
        currentFile.type,
        currentFile.size
    );


    let progress = 5;


    const progressTimer =
        setInterval(() => {

            if (progress < 90) {

                progress += Math.random() * 8;

                if (progress > 90) {
                    progress = 90;
                }

                progressBar.style.width =
                    `${progress}%`;

            }

        }, 700);


    try {

        const response =
            await fetch(
                "/api/remove-background",
                {
                    method: "POST",
                    body: formData
                }
            );


        const data =
            await response.json();


        clearInterval(progressTimer);


        console.log(
            "Server response:",
            data
        );


        if (!response.ok || !data.success) {

            throw new Error(
                data.error ||
                `Server returned ${response.status}`
            );

        }


        progressBar.style.width =
            "100%";


        resultPreview.src =
            data.url +
            "?t=" +
            Date.now();


        downloadButton.href =
            data.url;


        downloadButton.download =
            data.filename;


        resultInfo.textContent =
            `Background removed from ${data.originalName}`;


        setTimeout(() => {

            processingSection.classList.add(
                "hidden"
            );

            resultSection.classList.remove(
                "hidden"
            );

        }, 400);


    }
    catch (error) {

        clearInterval(progressTimer);

        console.error(
            "Processing error:",
            error
        );


        processingSection.classList.add(
            "hidden"
        );

        uploadSection.classList.remove(
            "hidden"
        );


        showError(
            error.message ||
            "Something went wrong."
        );

    }

}

// NEW IMAGE

newButton.addEventListener("click", () => {

    currentFile = null;

    fileInput.value = "";

    originalPreview.src = "";

    resultPreview.src = "";

    progressBar.style.width = "0%";

    resultSection.classList.add("hidden");

    processingSection.classList.add("hidden");

    uploadSection.classList.remove("hidden");

    clearError();

});

// ERRORS

function showError(message) {

    errorBox.textContent = message;

    errorBox.classList.remove("hidden");

}


function clearError() {

    errorBox.textContent = "";

    errorBox.classList.add("hidden");

}