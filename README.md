# Social Media Content Analyzer
A web application that allows users to upload PDFs and images, extracts text, analyzes social media content, and suggests engagement improvements.  
Live Application - https://social-media-content-analyzer-1-tfnl.onrender.com

Features

1. **User Authentication**: Signup and login with JWT-based authentication.  
2. **File Upload**: Upload PDFs and images (up to 7 files at once).  
3. **Text Extraction**: Extracts text from PDFs and images using OCR and PDF parsing.  
4. **Engagement Analysis**:
   - Word count, average sentence length
   - Sentiment and tone detection
   - Hashtags and suggested hashtags
   - Emoji count  
5. **Persistent Storage**: Saved results in local storage for quick access.  
6. **Logout**: Secure logout clears stored data and token.

Tech Stack & Libraries

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose  
- **Authentication**: JWT, bcryptjs  
- **File Handling**: Multer  
- **Text Analysis**: natural, Jimp, tesseract.js, pdf-parse-fixed  
- **CORS**: cors middleware  
