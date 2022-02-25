const imagePickerElement = document.querySelector(
  "#image-upload-control input"
);

const imagePreviewElement = document.querySelector("#image-upload-control img");

const updateImagePreview = () => {
  const files = imagePickerElement.files;
  console.log(files);

  if (!files || files.length === 0) {
    imagePreviewElement.style.display = "none";
    return;
  }

  const pickedFiles = files[0];

  console.log(pickedFiles);
  /* URL.createObjectURL() will take a file and convert a url. 
  It will generate a link, a url to that file. At this point file has not been uploaded yet, 
  so we are not generating the url to that file on our server. 
  The file is still on the local computer.*/

  imagePreviewElement.src = URL.createObjectURL(pickedFiles);
  imagePreviewElement.style.display = "block";
};

imagePickerElement.addEventListener("change", updateImagePreview);
