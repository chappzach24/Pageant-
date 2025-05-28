export const handleFileUpload = (file, maxSize = 5 * 1024 * 1024) => { // 5MB default
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/heic'];
    if (!allowedTypes.includes(file.type)) {
      reject(new Error('Invalid file type. Please upload a JPG, PNG, or HEIC file.'));
      return;
    }

    // Check file size
    if (file.size > maxSize) {
      reject(new Error('File is too large. Please upload a file smaller than 5MB.'));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({
        file: file,
        preview: reader.result,
        name: file.name
      });
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
};