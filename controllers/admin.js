const query = require("../utils/db");
const multer = require("multer");
const fs = require("fs");
const marked = require("marked");
const sanitizeHtml = require("sanitize-html");
const path = require("path");
const authFns = require("../utils/authenticate");

const mail = require("../utils/mail");
const { getCampusVideos } = require("./community");

const visionariesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/visionaries");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/ /g, "-"));
  }
});
exports.uploadVisionary = multer({ storage: visionariesStorage });


// 
const aqarDocumentsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "public/uploads/aqar";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const cleanName = file.originalname.replace(/[^a-z0-9\.]/gi, '_');
    cb(null, uniqueSuffix + '-' + cleanName);
  }
});

exports.uploaddocument=multer({storage:aqarDocumentsStorage});

const uploadAQARDocument = multer({ 
  storage: aqarDocumentsStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, XLS, XLSX, JPG, PNG files are allowed.'));
    }
  }
}).single('document');

// Get criteria and documents for editing
exports.getEditCriteriaForm = async (req, res) => {
  const { year_id, criteria_id } = req.params;
  
  try {
    const [yearResult, criteriaResult] = await Promise.all([
      query("SELECT * FROM aqar_years WHERE id = ?", [year_id]),
      query("SELECT * FROM aqar_criteria WHERE id = ?", [criteria_id])
    ]);
    
    if (yearResult.length === 0 || criteriaResult.length === 0) {
      req.session.errorMessage = "Year or criteria not found";
      return res.redirect("/cms/admin-aqar");
    }
    
    // Get documents for this criteria
    const documents = await query(
      `SELECT id, document_title, file_path, original_file_name, file_type, uploaded_at 
       FROM aqar_documents 
       WHERE criteria_id = ? AND is_deleted = 0 
       ORDER BY uploaded_at DESC`,
      [criteria_id]
    );
    
    // Format dates
    const formattedDocuments = documents.map(doc => ({
      ...doc,
      uploaded_at: new Date(doc.uploaded_at)
    }));
    
    res.render("admin/criteria-form", {
      year: yearResult[0],
      criteria: criteriaResult[0],
      documents: formattedDocuments,
      successMessage: req.session.successMessage,
      errorMessage: req.session.errorMessage
    });
    
    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (err) {
    console.error("Error loading edit criteria form:", err);
    req.session.errorMessage = "Failed to load form";
    res.redirect(`/cms/admin-aqar/${year_id}/criteria`);
  }
};

// Add document to a criteria
exports.addAQARDocument = (req, res) => {
  const { year_id, criteria_id } = req.params;
  
  uploadAQARDocument(req, res, async (err) => {
    try {
      if (err) {
        throw err;
      }
      
      const { title } = req.body;
      const file = req.file;
      
      if (!file) {
        throw new Error("No file uploaded");
      }
      
      // Insert document into database (REMOVED uploaded_by)
      await query(
        `INSERT INTO aqar_documents (
          criteria_id, 
          document_title, 
          file_path, 
          original_file_name, 
          file_type
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          criteria_id,
          title,
          file.filename,
          file.originalname,
          file.mimetype
        ]
      );
      
      req.session.successMessage = "Document uploaded successfully";
      res.redirect(`/cms/admin-aqar/${year_id}/criteria/${criteria_id}/edit`);
    } catch (error) {
      console.error("Error uploading document:", error);
      
      // Delete uploaded file if it exists
      if (req.file) {
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting file:", unlinkErr);
        });
      }
      
      req.session.errorMessage = error.message || "Failed to upload document";
      res.redirect(`/cms/admin-aqar/${year_id}/criteria/${criteria_id}/edit`);
    }
  });
};
exports.updateAQARDocument = async (req, res) => {
  const { year_id, criteria_id, document_id } = req.params;
  const { title } = req.body;
  
  try {
    // Convert document_id to integer
    const docId = parseInt(document_id);
    if (isNaN(docId)) {
      throw new Error('Invalid document ID format');
    }

    // Update document title
    await query(
      "UPDATE aqar_documents SET document_title = ? WHERE id = ?",
      [title, docId]
    );
    
    // Handle file upload if new file was provided
    if (req.file) {
      const { originalname, mimetype, filename } = req.file;
      
      // Get current file path for deletion
      const [currentFile] = await query(
        "SELECT file_path FROM aqar_documents WHERE id = ?",
        [docId]
      );
      
      // Update file information - CORRECTED PARAMETER ORDER
      await query(
        `UPDATE aqar_documents 
         SET 
           original_file_name = ?, 
           file_type = ?, 
           file_path = ?
         WHERE id = ?`,
        [originalname, mimetype, filename, docId]  // Correct order and count
      );
      
      // Delete old file if exists
      if (currentFile && currentFile.file_path) {
        const filePath = path.join(
          __dirname, 
          '../public/uploads/aqar/', 
          currentFile.file_path
        );
        
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting old file:", err);
          });
        } else {
          console.warn(`File not found: ${filePath}`);
        }
      }
    }
    
    req.session.successMessage = "Document updated successfully";
    res.redirect(`/cms/admin-aqar/${year_id}/criteria/${criteria_id}/edit`);
  } catch (error) {
    console.error("Error updating document:", error);
    
    // Delete new file if upload failed during update
    if (req.file) {
      const filePath = path.join(
        __dirname, 
        '../public/uploads/aqar/', 
        req.file.filename
      );
      
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting new file:", unlinkErr);
        });
      }
    }
    
    req.session.errorMessage = error.message || "Failed to update document";
    res.redirect(`/cms/admin-aqar/${year_id}/criteria/${criteria_id}/documents/${document_id}/edit`);
  }
};

// Edit document form
exports.getEditDocumentForm = async (req, res) => {
  const { year_id, criteria_id, document_id } = req.params;
  
  try {
    const [yearResult, criteriaResult, documentResult] = await Promise.all([
      query("SELECT * FROM aqar_years WHERE id = ?", [year_id]),
      query("SELECT * FROM aqar_criteria WHERE id = ?", [criteria_id]),
      query("SELECT * FROM aqar_documents WHERE id = ?", [document_id])
    ]);
    
    if (yearResult.length === 0 || criteriaResult.length === 0 || documentResult.length === 0) {
      req.session.errorMessage = "Year, criteria or document not found";
      return res.redirect(`/cms/admin-aqar/${year_id}/criteria/${criteria_id}/edit`);
    }
    
    const year = yearResult[0];
    const criteria = criteriaResult[0];
    const document = documentResult[0];
    
    // Get all documents for this criteria
    const documents = await query(
      `SELECT id, document_title, file_path, original_file_name, file_type, uploaded_at 
       FROM aqar_documents 
       WHERE criteria_id = ? AND is_deleted = 0 
       ORDER BY uploaded_at DESC`,
      [criteria_id]
    );
    
    // Format dates
    const formattedDocuments = documents.map(doc => ({
      ...doc,
      uploaded_at: new Date(doc.uploaded_at)
    }));
    
    res.render("admin/aqar-criteria-documents", {
      year,
      criteria,
      documents: formattedDocuments,
      editDocument: document,
      successMessage: req.session.successMessage,
      errorMessage: req.session.errorMessage
    });
    
    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (err) {
    console.error("Error loading edit document form:", err);
    req.session.errorMessage = "Failed to load form";
    res.redirect(`/cms/admin-aqar/${year_id}/criteria/${criteria_id}/edit`);
  }
};

// Update document

// Delete document
exports.deleteAQARDocument = async (req, res) => {
  const { year_id, criteria_id, document_id } = req.params;
  
  try {
    // Get document info - remove the array destructuring
    const documentResult = await query(
      "SELECT file_path FROM aqar_documents WHERE id = ?",
      [document_id]
    );
    
    // Check if we got results
    if (documentResult.length === 0) {
      throw new Error("Document not found");
    }
    
    // Access the first element in the result array
    const filePath = path.join("public", "uploads", "aqar", documentResult[0].file_path);
    
    // Soft delete in database
    await query(
      "UPDATE aqar_documents SET is_deleted = 1 WHERE id = ?",
      [document_id]
    );
    
    // Delete file from filesystem
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
    
    req.session.successMessage = "Document deleted successfully";
    res.redirect(`/cms/admin-aqar/${year_id}/criteria/${criteria_id}/edit`);
  } catch (error) {
    console.error("Error deleting document:", error);
    req.session.errorMessage = error.message || "Failed to delete document";
    res.redirect(`/cms/admin-aqar/${year_id}/criteria/${criteria_id}/edit`);
  }
};

// Download document
exports.downloadAQARDocument = async (req, res) => {
  const { document_id } = req.params;
  
  try {
    const [documentResult] = await query(
      "SELECT file_path, original_file_name FROM aqar_documents WHERE id = ?",
      [document_id]
    );
    
    if (documentResult.length === 0) {
      return res.status(404).send("Document not found");
    }
    
    const document = documentResult[0];
    console.log(document)
    const filePath = path.join("public", "uploads", "aqar", document.file_path);
    
    res.download(filePath, document.original_file_name, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).send("Could not download file");
      }
    });
  } catch (error) {
    console.error("Error retrieving document:", error);
    res.status(500).send("Internal server error");
  }
};
// 


exports.getAqarDash = async (req, res) => {
  try {
    const aqarYearList = await query("SELECT * FROM aqar_years ORDER BY year_label DESC");
    res.render("admin/aqar", {
      aqarList: aqarYearList,
      successMessage: req.session.successMessage,
      errorMessage: req.session.errorMessage
    });

    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (err) {
    console.error("Error fetching AQAR year data:", err);
    res.status(500).send("Internal Server Error");
  }
};
exports.getAddAqarYearForm = (req, res) => {
  res.render("admin/add-aqar-year", {
    year: null, // no data for create
    successMessage: req.session.successMessage,
    errorMessage: req.session.errorMessage,
  });
  delete req.session.successMessage;
  delete req.session.errorMessage;
};

// GET form to edit existing year
exports.getEditAqarYearForm = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query("SELECT * FROM aqar_years WHERE id = ?", [id]);
    const criteriaList = await query("SELECT * FROM aqar_criteria WHERE year_id = ?",[id]);
    const year = result[0];

    if (!year) {
      req.session.errorMessage = "AQAR Year not found";
      return res.redirect("/cms/admin-aqar");
    }

    res.render("admin/add-aqar-year", {
      year,
      criteriaList,
      successMessage: req.session.successMessage,
      errorMessage: req.session.errorMessage,
    });
    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (error) {
    console.error("Error fetching AQAR year:", error);
    req.session.errorMessage = "Failed to load AQAR year";
    res.redirect("/cms/admin-aqar");
  }
};
exports.postAddAqarYear = async (req, res) => {
  const { year_label, title, description } = req.body;
  try {
    await query(
      "INSERT INTO aqar_years (year_label, title, description) VALUES (?, ?, ?)",
      [year_label, title, description]
    );
    req.session.successMessage = "AQAR Year added successfully.";
    res.redirect("/cms/admin-aqar");
  } catch (error) {
    console.error("Error adding AQAR year:", error);
    req.session.errorMessage = "Failed to add AQAR year.";
    res.redirect("/cms/admin-aqar");
  }
};
exports.postUpdateAqarYear = async (req, res) => {
  const { id } = req.params;
  const { year_label, title, description } = req.body;

  try {
    await query(
      "UPDATE aqar_years SET year_label = ?, title = ?, description = ?, updated_at = NOW() WHERE id = ?",
      [year_label, title, description, id]
    );
    req.session.successMessage = "AQAR Year updated successfully.";
    res.redirect("/cms/admin-aqar");
  } catch (error) {
    console.error("Error updating AQAR year:", error);
    req.session.errorMessage = "Failed to update AQAR year.";
    res.redirect("/cms/admin-aqar");
  }
};
exports.getAqarCriteria = async (req, res) => {
  const { year_id } = req.params;
  
  try {
    // Get the year details
    const yearResult = await query("SELECT * FROM aqar_years WHERE id = ?", [year_id]);
    if (yearResult.length === 0) {
      req.session.errorMessage = "AQAR Year not found";
      return res.redirect("/cms/admin-aqar");
    }
    const year = yearResult[0];
    
    // Get criteria for this year
    const criteriaList = await query(
      "SELECT * FROM aqar_criteria WHERE year_id = ? ORDER BY criteria_label",
      [year_id]
    );
    
    res.render("admin/aqar-criteria", {
      year,
      criteriaList,
      successMessage: req.session.successMessage,
      errorMessage: req.session.errorMessage
    });
    
    // Clear flash messages
    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (err) {
    console.error("Error fetching AQAR criteria:", err);
    req.session.errorMessage = "Failed to load criteria";
    res.redirect("/cms/admin-aqar");
  }
};

// Show form to add new criteria
exports.getAddCriteriaForm = async (req, res) => {
  const { year_id } = req.params;
  
  try {
    const yearResult = await query("SELECT * FROM aqar_years WHERE id = ?", [year_id]);
    
    if (yearResult.length === 0) {
      req.session.errorMessage = "AQAR Year not found";
      return res.redirect("/cms/admin-aqar");
    }
    
    res.render("admin/criteria-form", {
      year: yearResult[0],
      criteria: null,
      successMessage: req.session.successMessage,
      errorMessage: req.session.errorMessage
    });
    
    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (err) {
    console.error("Error loading criteria form:", err);
    req.session.errorMessage = "Failed to load form";
    res.redirect(`/cms/admin-aqar/${year_id}/criteria`);
  }
};

// Show form to edit existing criteria


// Save criteria (add or update)
exports.saveCriteria = async (req, res) => {
  const { year_id, criteria_id } = req.params;
  const { criteria_label, title, description } = req.body;
  
  try {
    if (criteria_id) {
      // Update existing criteria
      await query(
        "UPDATE aqar_criteria SET criteria_label = ?, title = ?, description = ?, updated_at = NOW() WHERE id = ?",
        [criteria_label, title, description, criteria_id]
      );
      req.session.successMessage = "Criteria updated successfully";
    } else {
      // Add new criteria
      await query(
        "INSERT INTO aqar_criteria (year_id, criteria_label, title, description) VALUES (?, ?, ?, ?)",
        [year_id, criteria_label, title, description]
      );
      req.session.successMessage = "Criteria added successfully";
    }
    
    res.redirect(`/cms/admin-aqar/${year_id}/criteria`);
  } catch (err) {
    console.error("Error saving criteria:", err);
    req.session.errorMessage = "Failed to save criteria";
    res.redirect(criteria_id 
      ? `/cms/admin-aqar/${year_id}/criteria/${criteria_id}/edit` 
      : `/cms/admin-aqar/${year_id}/criteria/add`);
  }
};

// Delete criteria
exports.deleteCriteria = async (req, res) => {
  const { year_id, criteria_id } = req.params;
  
  try {
    await query("DELETE FROM aqar_criteria WHERE id = ?", [criteria_id]);
    req.session.successMessage = "Criteria deleted successfully";
    res.redirect(`/cms/admin-aqar/${year_id}/criteria`);
  } catch (err) {
    console.error("Error deleting criteria:", err);
    req.session.errorMessage = "Failed to delete criteria";
    res.redirect(`/cms/admin-aqar/${year_id}/criteria`);
  }
};


// Admin dashboard controller
exports.getAdminDash = (req, res, next) => {
  query("SELECT username FROM users WHERE uid = ?", [req.session.user])
    .then((result) => {
      user = result[0].username;
      // If logged in user is not cms admin then redirect to /cms to redirect him to his own admin panel
      if (user != "admin@cms") {
        res.redirect("/cms");
      } else {
        // Else render notifications admin
        res.render("admin/admin-cms", {
          pageTitle: "CMS - Admin",
          pageName: "Admin",
          isAuthenticated: req.session.isLoggedIn,
        });
      }
    })
    .catch((err) => {

      res.send(500).send("Internal Server Error");
    });
};


// adminController.js

// Add these methods to your existing admin controller
// coursesController.js
exports.getCourses = async (req, res) => {
  try {
    const courses = await query("SELECT * FROM courses ORDER BY priority ASC");
    res.render('admin/courses', {
      courses,
      successMessage: req.session.successMessage,
      errorMessage: req.session.errorMessage
    });
    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};


exports.getadminssioninstructions = async (req, res) => {
  try {
    const [instructions] = await query(
      "SELECT * FROM admission_instructions LIMIT 1"
    );

    let sections = [];

    if (instructions) {
      if (typeof instructions.sections === 'object') {
        sections = instructions.sections;
      } else if (typeof instructions.sections === 'string') {
        try {
          sections = JSON.parse(instructions.sections);
        } catch (e) {
          console.error("Error parsing sections:", e);
          sections = [];
        }
      }
    }

    // Convert old single link to array format
    sections = sections.map(section => {
      if (section.link && !section.links) {
        return {
          ...section,
          links: [section.link]
        };
      }
      return section;
    });

    res.render("admin/addadmissioninstructions", {
      instructions: instructions || null,
      sections,
      successMessage: req.session.successMessage,
      errorMessage: req.session.errorMessage
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
exports.postadminssioninstructions = async (req, res) => {
  try {
    const { title, heading } = req.body;
    const sections = [];
    let i = 0;

    while (req.body[`sections[${i}].title`] !== undefined) {
      const sectionLinks = [];
      let linkIndex = 0;

      // Process multiple links
      while (req.body[`sections[${i}].links[${linkIndex}].text`] !== undefined) {
        sectionLinks.push({
          text: req.body[`sections[${i}].links[${linkIndex}].text`] || '',
          url: req.body[`sections[${i}].links[${linkIndex}].url`] || ''
        });
        linkIndex++;
      }

      sections.push({
        title: req.body[`sections[${i}].title`] || '',
        content: req.body[`sections[${i}].content`] || '',
        programs: req.body[`sections[${i}].programs`]
          ? req.body[`sections[${i}].programs`].split('\n').filter(p => p.trim())
          : [],
        links: sectionLinks
      });
      i++;
    }

    const sectionsJson = JSON.stringify(sections);

    // Database operation remains the same
    const [existing] = await query(
      "SELECT id FROM admission_instructions LIMIT 1"
    );

    if (existing) {
      await query(
        "UPDATE admission_instructions SET title = ?, heading = ?, sections = ? WHERE id = ?",
        [title, heading, sectionsJson, existing.id]
      );
    } else {
      await query(
        "INSERT INTO admission_instructions (title, heading, sections) VALUES (?, ?, ?)",
        [title, heading, sectionsJson]
      );
    }

    req.session.successMessage = "Instructions saved successfully!";
    res.redirect("/cms/admissions-iitm/adminsioninstructions");
  } catch (err) {
    console.error(err);
    req.session.errorMessage = "Failed to save instructions";
    res.redirect("/cms/admissions-iitm/add-adminsioninstructions");
  }
};

// new admisiion //// /////

exports.getnewadmissioninstructions = async (req, res) => {
  try {
    const [instructions] = await query(
      "SELECT * FROM new_admission_instructions LIMIT 1"
    );

    let instructionList = [];
    let formUrl = '';
    let title = 'Admission Instructions';
    let heading = 'Admissions Open';

    if (instructions) {
      formUrl = instructions.form_url || '';
      title = instructions.title || title;
      heading = instructions.heading || heading;

      // Handle instructions parsing
      if (instructions.instructions) {
        try {
          // Parse if it's JSON string
          instructionList = typeof instructions.instructions === 'string'
            ? JSON.parse(instructions.instructions)
            : instructions.instructions;

          // Ensure it's always an array
          if (!Array.isArray(instructionList)) {
            instructionList = [instructionList];
          }
        } catch (e) {
          console.error('Error parsing instructions:', e);
          instructionList = [instructions.instructions];
        }
      }
    }

    console.log('Final instructionList:', instructionList); // Debug log

    res.render("admin/newaddadmissioninstructions", {
      instructions: {  // Pass as an object to match your template
        title,
        heading,
        form_url: formUrl,
        instructions: instructionList
      },
      successMessage: req.session.successMessage,
      errorMessage: req.session.errorMessage
    });

    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.postnewadmissioninstructions = async (req, res) => {
  console.log("post req.body", req.body.instructionText)
  try {
    const { title, heading } = req.body;
    let instructionText = req.body.instructionText || [];


    // Ensure instructionText is always an array
    if (!Array.isArray(instructionText)) {
      instructionText = [instructionText].filter(Boolean);
    }

    const formFile = req.file;
    const [current] = await query(
      "SELECT id, form_url FROM new_admission_instructions LIMIT 1"
    );

    // Handle file upload
    let formUrl = current?.form_url || '';
    if (formFile) {
      if (current?.form_url) {
        const filePath = path.join(__dirname, '../public', current.form_url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      formUrl = '/uploads/' + formFile.filename;
    }

    // Process instructions
    const instructions = instructionText
      .filter(text => text && text.trim())
      .map(text => text.trim());

    // Database operation
    if (current?.id) {
      await query(
        "UPDATE new_admission_instructions SET title = ?, heading = ?, form_url = ?, instructions = ? WHERE id = ?",
        [title, heading, formUrl, JSON.stringify(instructions), current.id]
      );
    } else {
      await query(
        "INSERT INTO new_admission_instructions (title, heading, form_url, instructions) VALUES (?, ?, ?, ?)",
        [title, heading, formUrl, JSON.stringify(instructions)]
      );
    }

    req.session.successMessage = "Admission instructions saved successfully!";
    res.redirect("/cms/admissions-iitm/adminsioninstructions");
  } catch (err) {
    console.error(err);
    req.session.errorMessage = "Failed to save admission instructions";
    res.redirect("/cms/admissions-iitm/adminsioninstructions");
  }
};
/// //// /////
exports.getAffidavitData = async (req, res) => {
  try {
    const [affidavit] = await query(
      "SELECT * FROM affidavit_data ORDER BY last_updated DESC LIMIT 1"
    );

    let sections = [];

    if (affidavit) {
      // Parse JSON instructions if needed
      if (typeof affidavit.instructions === 'string') {
        try {
          sections = JSON.parse(affidavit.instructions).sections || [];
        } catch (e) {
          console.error("Error parsing affidavit instructions:", e);
          sections = [];
        }
      } else if (affidavit.instructions && affidavit.instructions.sections) {
        sections = affidavit.instructions.sections;
      }
    }

    res.render("admin/affidavit", {
      affidavit: affidavit || null,
      sections,
      successMessage: req.session.successMessage,
      errorMessage: req.session.errorMessage
    });
  } catch (err) {
    console.error("Error fetching affidavit data:", err);
    res.status(500)
      .render("error", {
        message: "Failed to load affidavit data",
        error: err
      });
  }
};

exports.postAffidavitData = async (req, res) => {
  try {
    const { title, form_link } = req.body;
    const sections = [];
    let i = 0;

    // Process sections
    while (req.body[`sections[${i}].title`] !== undefined) {
      const section = {
        title: req.body[`sections[${i}].title`] || '',
      };

      // Process items - get as string and split by newline
      if (req.body[`sections[${i}].items`] !== undefined) {
        const itemsString = req.body[`sections[${i}].items`];
        if (itemsString && itemsString.trim() !== '') {
          section.items = itemsString.split('\n')
            .map(item => item.trim())
            .filter(item => item.length > 0);
        }
      }

      // Process subsections
      const subsections = [];
      let k = 0;
      while (req.body[`sections[${i}].subsections[${k}].title`] !== undefined) {
        const subsection = {
          title: req.body[`sections[${i}].subsections[${k}].title`] || '',
        };

        // Process subsection items
        if (req.body[`sections[${i}].subsections[${k}].items`] !== undefined) {
          const subItemsString = req.body[`sections[${i}].subsections[${k}].items`];
          if (subItemsString && subItemsString.trim() !== '') {
            subsection.items = subItemsString.split('\n')
              .map(item => item.trim())
              .filter(item => item.length > 0);
          }
        }

        subsections.push(subsection);
        k++;
      }
      if (subsections.length > 0) section.subsections = subsections;

      sections.push(section);
      i++;
    }

    const instructions = JSON.stringify({ sections });

    // Check if we have existing data
    const [existing] = await query(
      "SELECT id FROM affidavit_data ORDER BY last_updated DESC LIMIT 1"
    );

    if (existing) {
      // Update existing record
      await query(
        "UPDATE affidavit_data SET title = ?, instructions = ?, form_link = ?, last_updated = NOW() WHERE id = ?",
        [title, instructions, form_link, existing.id]
      );
    } else {
      // Create new record
      await query(
        "INSERT INTO affidavit_data (title, instructions, form_link) VALUES (?, ?, ?)",
        [title, instructions, form_link]
      );
    }

    req.session.successMessage = "Affidavit data saved successfully!";
    res.redirect("/cms/admissions-iitm/affidavit");
  } catch (err) {
    console.error("Error saving affidavit data:", err);
    req.session.errorMessage = "Failed to save affidavit data: " + err.message;
    res.redirect("/cms/admissions-iitm/affidavit");
  }
};


exports.showAdmissionInstructions = async (req, res) => {
  try {
    const [data] = await query(
      "SELECT * FROM admission_instructions LIMIT 1"
    );

    if (!data) {
      return res.render("admissions", {
        data: {
          title: "Admission Instructions",
          heading: "Admissions Information",
          sections: [],
          last_updated: new Date()
        },
        pageTitle: "Admissions",
        pageName: "Admissions",
        isAuthenticated: req.session.isLoggedIn
      });
    }

    // Parse JSON sections
    data.sections = JSON.parse(data.sections);

    res.render("admissions", {
      data,
      pageTitle: data.title,
      pageName: "Admissions",
      isAuthenticated: req.session.isLoggedIn
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.getallprogramdetails = async (req, res) => {
  try {
    const programdetails = await query("SELECT * FROM programdetails ORDER BY priority ASC");
    res.render("admin/programdetails", {
      programdetails,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.addProgramDetail = async (req, res) => {
  const { program, eligibility, test, domain, priority } = req.body;
  try {
    await query(
      "INSERT INTO programdetails (programme, eligibility, test, domain, priority) VALUES (?, ?, ?, ?, ?)",
      [program, eligibility, test, domain, priority]
    );
    res.redirect("/cms/admissions-iitm/programdetails");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.deleteProgramDetail = async (req, res) => {
  try {
    await query("DELETE FROM programdetails WHERE id = ?", [req.params.id]);
    res.redirect("/cms/admissions-iitm/programdetails");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.updatePriority = async (req, res) => {
  const { priority } = req.body;
  try {
    await query("UPDATE programdetails SET priority = ? WHERE id = ?", [priority, req.params.id]);
    res.redirect("/cms/admissions-iitm/programdetails");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.updateprogram = async (req, res) => {
  try {
    const { id } = req.params;
    const { program, priority, eligibility, test, domain } = req.body;

    const result = await query(
      `UPDATE programdetails 
       SET programme = ?, priority = ?, eligibility = ?, test = ?, domain = ? 
       WHERE id = ?`,
      [program, priority, eligibility, test, domain, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send('Program not found');
    }

    res.redirect('/cms/admissions-iitm/programdetails');
  } catch (err) {
    console.error('Error updating program:', err);
    res.status(500).send('Server Error');
  }
};


exports.getCourseForm = async (req, res) => {
  try {
    const id = req.params.id;
    const course = id ? (await query("SELECT * FROM courses WHERE id = ?", [id]))[0] : null;
    res.render('admin/course-form', { course });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.saveCourse = async (req, res) => {
  try {
    const { id, name, code, fee, duration, description, priority, is_active } = req.body;
    const isActive = is_active === 'on' ? 1 : 0;

    if (id) {
      await query(
        `UPDATE courses SET 
         name=?, code=?, fee=?, duration=?, 
         description=?, priority=?, is_active=?
         WHERE id=?`,
        [name, code, fee, duration, description, priority, isActive, id]
      );
      req.session.successMessage = "Course updated successfully";
    } else {
      await query(
        `INSERT INTO courses 
         (name, code, fee, duration, description, priority, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, code, fee, duration, description, priority, isActive]
      );
      req.session.successMessage = "Course added successfully";
    }
    res.redirect('/cms/courses');
  } catch (err) {
    console.error(err);
    req.session.errorMessage = "Error saving course";
    res.redirect(req.originalUrl);
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await query("DELETE FROM courses WHERE id = ?", [req.params.id]);
    req.session.successMessage = "Course deleted successfully";
    res.redirect('/cms/courses');
  } catch (err) {
    console.error(err);
    req.session.errorMessage = "Error deleting course";
    res.redirect('/cms/courses');
  }
};
// Statistics Dashboard
exports.getStatisticsDash = async (req, res) => {
  try {
    const year = req.query.year;
    let queryStr = "SELECT * FROM statistics";
    let queryParams = [];

    if (year) {
      queryStr += " WHERE year = ?";
      queryParams.push(year);
    }

    queryStr += " ORDER BY year DESC, category, priority";

    const statistics = await query(queryStr, queryParams);
    const years = await query("SELECT DISTINCT year FROM statistics ORDER BY year DESC");

    res.render("admin/admin-statistics", {
      pageTitle: "CMS - Statistics",
      pageName: "Statistics",
      statistics,
      availableYears: years.map(y => y.year),
      selectedYear: year,
      isAuthenticated: req.session.isLoggedIn
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Statistics Form
exports.getStatisticsForm = async (req, res) => {
  try {
    const id = req.params.id;
    let statistic = null;

    if (id) {
      [statistic] = await query("SELECT * FROM statistics WHERE id = ?", [id]);
      if (!statistic) {
        req.session.errorMessage = "Statistic not found";
        return res.redirect("/cms/admin-statistics");
      }
    }

    res.render("admin/statistics-form", {
      pageTitle: id ? "Edit Statistic" : "Create Statistic",
      pageName: "Statistics",
      statistic,
      isAuthenticated: req.session.isLoggedIn
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Save Statistic
exports.postSaveStatistic = async (req, res) => {
  try {
    const {
      id,
      category,
      title,
      value,
      suffix,
      year,
      priority,
      is_active
    } = req.body;

    const isActive = is_active === "on" ? 1 : 0;

    if (id) {
      // Update existing
      await query(
        `UPDATE statistics SET 
         category = ?, title = ?, value = ?, suffix = ?, 
         year = ?, priority = ?, is_active = ? 
         WHERE id = ?`,
        [category, title, value, suffix, year, priority, isActive, id]
      );
      req.session.successMessage = "Statistic updated successfully";
    } else {
      // Create new
      await query(
        `INSERT INTO statistics 
         (category, title, value, suffix, year, priority, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [category, title, value, suffix, year, priority, isActive]
      );
      req.session.successMessage = "Statistic created successfully";
    }

    res.redirect("/cms/admin-statistics");
  } catch (err) {
    console.error(err);
    req.session.errorMessage = "Failed to save statistic";
    res.redirect(id ? `/cms/admin-statistics/${id}/edit` : "/cms/admin-statistics/new");
  }
};

// Delete Statistic
exports.deleteStatistic = async (req, res) => {
  try {
    const id = req.params.id;
    await query("DELETE FROM statistics WHERE id = ?", [id]);
    req.session.successMessage = "Statistic deleted successfully";
    res.redirect("/cms/admin-statistics");
  } catch (err) {
    console.error(err);
    req.session.errorMessage = "Failed to delete statistic";
    res.redirect("/cms/admin-statistics");
  }
};
//? ////////////////////////////////////////////////////////
//? ////////////////////////////////////////////////////////
// HOME ADMIN PANEL
//? ////////////////////////////////////////////////////////
//? ////////////////////////////////////////////////////////
// marquee links 
exports.getMarqueeLinksDash = (req, res, next) => {
  query("SELECT username FROM users WHERE uid = ?", [req.session.user])
    .then(([user]) => {
      user = user.username;
      if (user !== "admin@cms") {
        return res.redirect("/cms");
      }

      return query(`
        SELECT * FROM marquee_links 
        WHERE (start_date IS NULL OR start_date <= NOW())
          AND (end_date IS NULL OR end_date >= NOW())
        ORDER BY priority ASC, created_at DESC
      `);
    })
    .then((links) => {
      const successMessage = req.session.successMessage;
      const errorMessage = req.session.errorMessage;

      delete req.session.successMessage;
      delete req.session.errorMessage;

      res.render("admin/admin-marquee", {
        pageTitle: "CMS - Marquee Links",
        pageName: "Marquee Links",
        isAuthenticated: req.session.isLoggedIn,
        links: links || [],
        successMessage,
        errorMessage
      });
    })
    .catch((err) => {
      console.error("Error in getMarqueeLinksDash:", err);
      req.session.errorMessage = "Failed to load marquee links";
      res.redirect("/cms/admin-home");
    });
};

// marquee links 
exports.getMarqueeLinksDash = (req, res, next) => {
  query("SELECT username FROM users WHERE uid = ?", [req.session.user])
    .then(([user]) => {
      user = user.username;
      if (user !== "admin@cms") {
        return res.redirect("/cms");
      }

      return query("SELECT * FROM marquee_links ORDER BY priority ASC, created_at DESC");
    })
    .then((links) => {
      const successMessage = req.session.successMessage;
      const errorMessage = req.session.errorMessage;

      delete req.session.successMessage;
      delete req.session.errorMessage;

      res.render("admin/admin-marquee", {
        pageTitle: "CMS - Marquee Links",
        pageName: "Marquee Links",
        isAuthenticated: req.session.isLoggedIn,
        links: links || [],
        successMessage,
        errorMessage
      });
    })
    .catch((err) => {
      console.error("Error in getMarqueeLinksDash:", err);
      req.session.errorMessage = "Failed to load marquee links";
      res.redirect("/cms/admin-home");
    });
};

// GET - Render form to create new marquee link
exports.getCreateMarqueeLink = (req, res) => {
  res.render("admin/marquee-form", {
    pageTitle: "Create Marquee Link",
    pageName: "Create Marquee",
    link: null,
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.getEditMarqueeLink = (req, res, next) => {
  const id = req.params.id;




  query("SELECT * FROM marquee_links WHERE id = ?", [id])
    .then(([rows]) => {

      if (!rows || rows.length === 0) {

        req.session.errorMessage = "Marquee link not found.";
        return res.redirect("/cms/admin-marquee");
      }

      res.render("admin/marquee-form", {
        pageTitle: "Edit Marquee Link",
        pageName: "Edit Marquee",
        link: rows,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.error("Error in getEditMarqueeLink:", err);
      req.session.errorMessage = "Error loading marquee link.";
      res.redirect("/cms/admin-marquee");
    });
};


// POST - Save new or updated marquee link
exports.postSaveMarqueeLink = (req, res) => {
  const {
    id,
    text,
    url,
    title,
    priority,
    is_active,
    start_date,
    end_date
  } = req.body;

  const isActive = is_active === "on" ? 1 : 0;
  const parsedPriority = Number(priority) || 0;

  // Normalize dates
  const startDate = start_date || null;
  const endDate = end_date || null;

  if (id) {
    // Update existing
    query(
      `UPDATE marquee_links 
       SET text = ?, url = ?, title = ?, priority = ?, is_active = ?, start_date = ?, end_date = ? 
       WHERE id = ?`,
      [text, url, title, parsedPriority, isActive, startDate, endDate, id]
    )
      .then(() => {
        req.session.successMessage = "Marquee link updated successfully.";
        res.redirect("/cms/admin-marquee");
      })
      .catch((err) => {
        console.error("Error in postSaveMarqueeLink (update):", err);
        req.session.errorMessage = "Failed to update marquee link.";
        res.redirect("/cms/admin-marquee");
      });
  } else {
    // Insert new
    query(
      `INSERT INTO marquee_links 
       (text, url, title, priority, is_active, start_date, end_date, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [text, url, title, parsedPriority, isActive, startDate, endDate]
    )
      .then(() => {
        req.session.successMessage = "Marquee link created successfully.";
        res.redirect("/cms/admin-marquee");
      })
      .catch((err) => {
        console.error("Error in postSaveMarqueeLink (insert):", err);
        req.session.errorMessage = "Failed to create marquee link.";
        res.redirect("/cms/admin-marquee");
      });
  }
};


// POST - Delete marquee link
exports.deleteMarqueeLink = (req, res) => {
  const id = req.params.id;

  query("DELETE FROM marquee_links WHERE id = ?", [id])
    .then(() => {
      req.session.successMessage = "Marquee link deleted successfully.";
      res.redirect("/cms/admin-marquee");
    })
    .catch((err) => {
      console.error("Error in deleteMarqueeLink:", err);
      req.session.errorMessage = "Failed to delete marquee link.";
      res.redirect("/cms/admin-marquee");
    });
};

// Visionaries Admin Dashboard
exports.getVisionariesDash = (req, res, next) => {
  query("SELECT username FROM users WHERE uid = ?", [req.session.user])
    .then(([user]) => {
      user = user.username;
      if (user !== "admin@cms") {
        return res.redirect("/cms");
      }

      return query("SELECT * FROM visionaries ORDER BY priority ASC, created_at DESC");
    })
    .then((visionaries) => {
      const successMessage = req.session.successMessage;
      const errorMessage = req.session.errorMessage;

      delete req.session.successMessage;
      delete req.session.errorMessage;

      res.render("admin/admin-visionaries", {
        pageTitle: "CMS - Visionaries",
        pageName: "Visionaries",
        isAuthenticated: req.session.isLoggedIn,
        visionaries: visionaries || [],
        successMessage,
        errorMessage
      });
    })
    .catch((err) => {
      console.error("Error in getVisionariesDash:", err);
      req.session.errorMessage = "Failed to load visionaries";
      res.redirect("/cms/admin-home");
    });
};

// GET - Render form to create/edit visionary
exports.getVisionaryForm = (req, res) => {
  const id = req.params.id;

  if (id) {
    // Edit existing
    query("SELECT * FROM visionaries WHERE id = ?", [id])
      .then(([visionary]) => {
        if (!visionary) {
          req.session.errorMessage = "Visionary not found.";
          return res.redirect("/cms/admin-visionaries");
        }

        res.render("admin/visionary-form", {
          pageTitle: "Edit Visionary",
          pageName: "Edit Visionary",
          visionary,
          isAuthenticated: req.session.isLoggedIn
        });
      })
      .catch(err => {
        console.error("Error fetching visionary:", err);
        req.session.errorMessage = "Error loading visionary.";
        res.redirect("/cms/admin-visionaries");
      });
  } else {
    // Create new
    res.render("admin/visionary-form", {
      pageTitle: "Create Visionary",
      pageName: "Create Visionary",
      visionary: null,
      isAuthenticated: req.session.isLoggedIn
    });
  }
};

exports.postSaveVisionary = (req, res) => {
  const {
    id,
    name,
    role,
    title,
    description,
    link,
    priority,
    is_active
  } = req.body;

  // Handle image upload
  const imagePath = req.file ? `/uploads/visionaries/${req.file.filename}` : req.body.existing_image;
  const isActive = is_active === "on" ? 1 : 0;
  const parsedPriority = Number(priority) || 0;


  if (id) {
    // UPDATE existing visionary
    query(
      `UPDATE visionaries 
       SET name = ?, role = ?, title = ?, description = ?, link = ?, 
           image_path = ?, priority = ?, is_active = ?
       WHERE id = ?`,
      [name, role, title, description, link, imagePath, parsedPriority, isActive, id]
    )
      .then(() => {
        req.session.successMessage = "Visionary updated successfully.";
        res.redirect("/cms/admin-visionaries");
      })
      .catch((err) => {
        console.error("Error updating visionary:", err);
        req.session.errorMessage = "Failed to update visionary.";
        res.redirect(`/cms/admin-visionaries/${id}/edit`);
      });
  } else {
    // INSERT new visionary
    query(
      `INSERT INTO visionaries 
       (name, role, title, description, link, image_path, priority, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, role, title, description, link, imagePath, parsedPriority, isActive]
    )
      .then(() => {
        req.session.successMessage = "Visionary created successfully.";
        res.redirect("/cms/admin-visionaries");
      })
      .catch((err) => {
        console.error("Error creating visionary:", err);
        req.session.errorMessage = "Failed to create visionary.";
        res.redirect("/cms/admin-visionaries/new");
      });
  }
};

// POST - Delete visionary
exports.deleteVisionary = (req, res) => {
  const id = req.params.id;

  // First get image path to delete the file
  query("SELECT image_path FROM visionaries WHERE id = ?", [id])
    .then(([visionary]) => {
      if (visionary && visionary.image_path) {
        const filePath = path.join(__dirname, '../public', visionary.image_path);
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting image file:", err);
        });
      }

      return query("DELETE FROM visionaries WHERE id = ?", [id]);
    })
    .then(() => {
      req.session.successMessage = "Visionary deleted successfully.";
      res.redirect("/cms/admin-visionaries");
    })
    .catch((err) => {
      console.error("Error deleting visionary:", err);
      req.session.errorMessage = "Failed to delete visionary.";
      res.redirect("/cms/admin-visionaries");
    });
};

// POST - Update priority (drag & drop)
exports.updateVisionaryPriority = (req, res) => {
  const visionaries = req.body.visionaries;

  if (!Array.isArray(visionaries)) {
    return res.status(400).json({
      success: false,
      error: "Invalid request: 'visionaries' must be an array",
    });
  }

  const updates = visionaries.map((visionary) =>
    query("UPDATE visionaries SET priority = ? WHERE id = ?", [
      visionary.priority,
      visionary.id,
    ])
  );

  Promise.all(updates)
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      console.error("Error updating visionary priorities:", err);
      res.status(500).json({
        success: false,
        error: "Failed to update priorities",
      });
    });
};

// POST - Update priority (via drag & drop)
exports.updateMarqueeLinkPriority = (req, res) => {
  const links = req.body.links;


  if (!Array.isArray(links)) {
    return res.status(400).json({
      success: false,
      error: "Invalid request: 'links' must be an array",
    });
  }

  const updates = links.map((link) =>
    query("UPDATE marquee_links SET priority = ? WHERE id = ?", [
      link.priority,
      link.id,
    ])
  );

  Promise.all(updates)
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      console.error("Error in updateMarqueeLinkPriority:", err);
      res.status(500).json({
        success: false,
        error: "Failed to update priorities",
      });
    });
};

// Home dashboard controller
exports.getHomeDash = (req, res, next) => {
  Promise.all([
    query("SELECT username FROM users WHERE uid = ?", [req.session.user]),
    query("SELECT * FROM homeButtons"),
    query("SELECT * FROM gallery"),
    query("SELECT * FROM homeCarousel ORDER BY date DESC"),
  ])
    .then(([user, homeButtons, gallery, homeCarousel]) => {
      user = user[0].username;
      if (user != "admin@cms") {
        res.redirect("/cms");
      } else {
        const homeHeadingPath = "./public/data/homeHeading.txt";
        const homeHeading = fs.readFileSync(homeHeadingPath, "utf8").trim();

        // Else render home admin
        res.render("admin/admin-home", {
          pageTitle: "CMS - Home",
          pageName: "Home",
          isAuthenticated: req.session.isLoggedIn,
          buttons: homeButtons,
          homeHeading,
          gallery,
          homeCarousel,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};

// Upload home button controller
exports.postHomeButton = (req, res, next) => {
  const buttonID = req.body.bid;
  const text = req.body.buttonText;
  const link = req.body.buttonLink;

  // Set up mysql query to update only text or only link or both
  let sql = "UPDATE homeButtons ";
  let values;
  if (text && link) {
    sql += "SET `text` = ?, `link` = ? WHERE(`bid` = ?)";
    values = [text, link, buttonID];
  } else if (text && !link) {
    sql += "SET `text` = ? WHERE(`bid` = ?)";
    values = [text, buttonID];
  } else if (!text && link) {
    sql += "SET `link` = ? WHERE(`bid` = ?)";
    values = [link, buttonID];
  } else if (!text && !link) {
    sql += "SET `text` = ?, `link` = ? WHERE(`bid` = ?)";
    values = ["", "", buttonID];
  }

  query(sql, values, req.session.user)
    .then(() => {
      res.redirect("/cms/admin-home");
    })
    .catch((err) => {
      console.log(err);
      res.send(500).status("Internal Sever Error");
    });
};

// Update home heading
exports.postHomeHeading = (req, res, next) => {
  const heading = req.body.heading;

  // Update homeHeading.txt file
  fs.writeFileSync("./public/data/homeHeading.txt", heading);

  res.redirect("/cms/admin-home");
};

// Handle Gallery Upload
// configure multer to store uploaded files in the 'uploads/gallery' directory
const galleryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/gallery");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/ /g, "-"));
  },
});
const uploadGallery = multer({ storage: galleryStorage });
// Upload gallery controller
exports.postGallery = (req, res, next) => {
  uploadGallery.single("image")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Handle multer error
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Handle other errors
      return res.status(500).json({ error: err.message });
    }

    // Store form inputs
    const fileUrl = req.file.path.replace("public", "").replace(/ /g, "-"); // Get relative file URL
    const caption = req.body.caption;
    const imageID = req.body.iid;

    // Fetch path that is already present in db for that image.(To delete the image from uploads/gallery folder and to check if that gallery item is already set or not)
    query("SELECT path FROM gallery WHERE(iid = ?)", [imageID])
      .then((result) => {
        // Store path in existingFile (if exists)
        const existingFile = result[0] ? `public/${result[0].path}` : null;

        // If path exists then it needs to be updated else to be inserted(Because that tells us if the entry for that image is already set or not)
        const sql = existingFile
          ? "UPDATE `gallery` SET `path` = ?, `caption` = ? WHERE (`iid` = ?)"
          : "INSERT INTO gallery (path, caption, iid) VALUES (?, ?, ?)";

        // Insert or update
        query(sql, [fileUrl, caption, imageID], req.session.user)
          .then(() => {
            // If existingFile existes then remove it from uploads/gallery folder
            if (fs.existsSync(existingFile)) {
              fs.unlink(existingFile, (err) => {
                if (err) {
                  console.error(err);
                  return res.status(500).send("Failed to delete file");
                }
              });
            }
          })
          .then(() => {
            // And redirect to /cms/admin-home
            res.redirect("/cms/admin-home");
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  });
};

// Handle HOme Carousel Upload
// configure multer to store uploaded files in the 'uploads/gallery' directory
const homeCarouselStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/homeCarousel");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/ /g, "-"));
  },
});
const uploadHomeCarousel = multer({ storage: homeCarouselStorage });
// Upload homeCarousel controller
exports.postHomeCarousel = (req, res, next) => {
  uploadHomeCarousel.single("image")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Handle multer error
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Handle other errors
      return res.status(500).json({ error: err.message });
    }

    // Store form inputs
    const fileUrl = req.file.path.replace("public", "").replace(/ /g, "-"); // Get relative file URL
    const imageID = req.body.cid;

    // Fetch path that is already present in db for that image.(To delete the image from uploads/gallery folder and to check if that gallery item is already set or not)
    query("SELECT path FROM homeCarousel WHERE(cid = ?)", [imageID])
      .then((result) => {
        // Store path in existingFile (if exists)
        const existingFile = result[0] ? `public/${result[0].path}` : null;

        // If path exists then it needs to be updated else to be inserted(Because that tells us if the entry for that image is already set or not)
        const sql = existingFile
          ? "UPDATE `homeCarousel` SET `path` = ? WHERE (`cid` = ?)"
          : "INSERT INTO homeCarousel (path, cid) VALUES (?, ?)";

        // Insert or update
        query(sql, [fileUrl, imageID], req.session.user)
          .then(() => {
            // If existingFile existes then remove it from uploads/homeCarousel folder
            if (fs.existsSync(existingFile)) {
              fs.unlink(existingFile, (err) => {
                if (err) {
                  console.error(err);
                  return res.status(500).send("Failed to delete file");
                }
              });
            }
          })
          .then(() => {
            // And redirect to /cms/admin-home
            res.redirect("/cms/admin-home");
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  });
};

//? ////////////////////////////////////////////////////////
//? ////////////////////////////////////////////////////////
// NOTIFICATIONS ADMIN PANEL
//? ////////////////////////////////////////////////////////
//? ////////////////////////////////////////////////////////

// Route to notifications upload dashboard
exports.getNotificationDash = (req, res, next) => {
  query("SELECT username FROM users WHERE uid = ?", [req.session.user])
    .then((result) => {
      user = result[0].username;
      // If logged in user is not notifications admin and cms admin then redirect to /cms to redirect him to his own admin panel
      if (
        user != "admin@cms" &&
        user != "hod@cs" &&
        user != "hod@ms" &&
        user != "coordinator@cs" &&
        user != "coordinator@ms" &&
        user != "so@iitm" &&
        user != "pro@iitm" &&
        user != "po@iitm" &&
        user != "director@iitm"
      ) {
        res.redirect("/cms");
      } else {
        query("SELECT * FROM notifications order by date desc").then(
          (result) => {
            // Else render notifications admin
            res.render("admin/admin-notifications", {
              pageTitle: "CMS - Notifications",
              pageName: "Notifications",
              isAuthenticated: req.session.isLoggedIn,
              notifications: result,
            });
          }
        );
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};

// Handle Notification Upload
// configure multer to store uploaded files in the 'uploads/notifications' directory
const notificationStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/notifications");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/ /g, "-"));
  },
});
const uploadNotification = multer({ storage: notificationStorage });
// Upload notification controller
exports.postNotification = (req, res, next) => {
  uploadNotification.single("notification")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Handle multer error
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Handle other errors
      return res.status(500).json({ error: err.message });
    }

    // const fileUrl = req.file?.path.replace("public", "").replace(" ", "-"); // Get relative file URL
    const fileUrl = req.file
      ? req.file.path.replace("public", "").replace(/ /g, "-")
      : null; // Get relative file URL

    const notification = req.body.notificationName;
    const links = req.body.links ? req.body.links.replace(/ /g, "") : null;
    const category = req.body.category;
    const audience = req.body.audience ? req.body.audience : "all";
    // const priority = req.body.priority ? req.body.priority : 0;

    const sql =
      "INSERT INTO notifications (notification, links, path, audience, category) VALUES (?, ?, ?, ?, ?)";
    query(
      sql,
      [notification, links, fileUrl, audience, category],
      req.session.user
    )
      .then(() => {
        // if (priority == 1) {
        //   let condition = "";
        //   if (audience == "all") {
        //     condition = "";
        //   } else if (audience == "ug") {
        //     condition = "WHERE (program = 'bca' OR 'bba')";
        //   } else if (audience == "pg") {
        //     condition = "WHERE (program = 'mca' OR 'mba')";
        //   } else if (audience == "cs") {
        //     condition = "WHERE (program = 'bca' OR 'mca')";
        //   } else if (audience == "ms") {
        //     condition = "WHERE (program = 'bba' OR 'mba')";
        //   } else if (audience == "bca") {
        //     condition = "WHERE (program = 'bca')";
        //   } else if (audience == "bba") {
        //     condition = "WHERE (program = 'bba')";
        //   } else if (audience == "mca") {
        //     condition = "WHERE (program = 'mca')";
        //   } else if (audience == "mba") {
        //     condition = "WHERE (program = 'mba')";
        //   }

        //   query(`SELECT emailId, name FROM studentsDatabase ${condition}`)
        //     .then((result) => {
        //       const recipients = [
        //         { emailId: "mouzinmonis@gmail.com", name: "Mouzin Gulzar" },
        //         { emailId: "mouzinmonis@gmail.com", name: "MG" },
        //         {
        //           emailId: "mouzingulzarbhat@gmail.com",
        //           name: "Mouzin Gulzar Bhat",
        //         },
        //         { emailId: "mouzingulzarbhat@gmail.com", name: "MGB" },
        //       ];

        //       // Build the array of objects with email, subject, and body
        //       const emails = recipients.map((recipient) => {
        //         let notificationLink = "";
        //         if (fileUrl) {
        //           notificationLink = `<p><a href="iitm.edu.in${fileUrl}">Click here to view the full notification.</a></p>`;
        //         } else {
        //           notificationLink = `<p><a href="iitm.edu.in/notifications">Click here to view the notification.</a></p>`;
        //         }
        //         return {
        //           recipient: recipient.emailId,
        //           subject: "You have an important notification!",
        //           body: `
        //           <html>
        //           <body>
        //             <h2>Greetings, ${recipient.name}!</h2>
        //             <p>This email is to notify you about an important update.</p>
        //             <p><b>This update contains crucial information about <strong><i>${category.replace(
        //               / /g,
        //               "-"
        //             )}</i></strong>, that requires your attention.</b></p>
        //             <h3>Notification</h3>
        //             <p><b>${notification}</b></p>
        //             ${notificationLink}
        //           </body>
        //         </html>
        //           `,
        //         };
        //       });
        //       // mail.sendNotification(emails);
        //     })
        //     .catch((err) => {
        //       console.log(err);
        //       res.status(500).send("Can't fetch audience. Try again later!");
        //     });
        // }
        res.redirect("/cms/admin-notifications");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  });
};

// Delete notification controller
exports.deleteNotification = (req, res, next) => {
  query("SELECT path FROM notifications WHERE (nid = ?)", [req.params.nid])
    .then((result) => {
      query(
        "DELETE FROM notifications WHERE (nid = ?)",
        [req.params.nid],
        req.session.user
      )
        .then(() => {
          const filePath = `public/${result[0].path}`;
          // Checks if the file to be delete exist or not
          if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(err);
                return res.status(500).send("Failed to delete file");
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(500)
            .send("Couldn't delete the notification for some reasons");
        });
    })
    .then(() => {
      res.redirect("/notifications");
    });
};

//? ///////////////////////////////////////////////////////////////////
//? ///////////////////////////////////////////////////////////////////
// NEWS ADMIN PANEL
//? ///////////////////////////////////////////////////////////////////
//? ///////////////////////////////////////////////////////////////////

// Route to news upload dashboard
exports.getNewsDash = (req, res, next) => {
  query("SELECT username FROM users WHERE uid = ?", [req.session.user])
    .then((result) => {
      user = result[0].username;

      // If logged in user is not news admin and cms admin then redirect to /cms to redirect him to his own admin panel or login page
      if (
        user != "admin@cms" &&
        user != "so@iitm" &&
        user != "hod@cs" &&
        user != "hod@ms" &&
        user != "coordinator@cs" &&
        user != "coordinator@ms" &&
        user != "po@iitm" &&
        user != "pro@iitm" &&
        user != "director@iitm"
      ) {
        res.redirect("/cms");
      } else {
        query("SELECT * FROM news ORDER BY date DESC").then((result) => {
          // Sanitizes the html fetched from database to remove all html tags. (Just want to show plane text in news cards)
          result.forEach((res) => {
            res.news = sanitizeHtml(res.news, {
              allowedTags: [],
              allowedAttributes: {},
            });
          });

          // Else render news admin
          res.render("admin/admin-news", {
            pageTitle: "CMS - News",
            pageName: "News",
            isAuthenticated: req.session.isLoggedIn,
            news: result,
          });
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};

// Handle News Upload
// configure multer to store uploaded files in the 'uploads/news' directory
const newsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/news");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/ /g, "-"));
  },
});
const uploadNews = multer({ storage: newsStorage });
// Upload notification controller
exports.postNews = (req, res, next) => {
  uploadNews.single("poster")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Handle multer error
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Handle other errors
      return res.status(500).json({ error: err.message });
    }

    // Collects form data
    const fileUrl = req.file
      ? req.file.path.replace("public", "").replace(/ /g, "-")
      : null; // Get relative file URL
    const headline = req.body.headline;
    const news = marked.parse(req.body.news); // Convert the user news input from Markdown to HTML
    const date = req.body.date ? req.body.date : new Date();
    const sql =
      "INSERT INTO news (headline, news, path, date) VALUES (?, ?, ?, ?)";

    query(sql, [headline, news, fileUrl, date], req.session.user)
      .then(() => {
        res.redirect("/cms/admin-news");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  });
};
// Delete notification controller
exports.deleteNews = (req, res, next) => {
  query("SELECT path FROM news WHERE (nid = ?)", [req.params.nid])
    .then((result) => {
      query(
        "DELETE FROM news WHERE (nid = ?)",
        [req.params.nid],
        req.session.user
      )
        .then(() => {
          const filePath = `public/${result[0].path}`;
          if (fs.existsSync(filePath)) {
            fs.unlink(`public/${result[0].path}`, (err) => {
              if (err) {
                console.log(err);
                return res.status(500).send("Failed to delete file");
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(500)
            .send("Couldn't delete the notification for some reasons");
        });
    })
    .then(() => {
      res.redirect("/community/news");
    });
};

//? ///////////////////////////////////////////////////////////////////
//? ///////////////////////////////////////////////////////////////////
// EVENTS ADMIN PANEL
//? ///////////////////////////////////////////////////////////////////
//? ///////////////////////////////////////////////////////////////////

// Route to events upload dashboard
exports.getEventsDash = (req, res, next) => {
  query("SELECT username FROM users WHERE uid = ?", [req.session.user])
    .then((result) => {
      user = result[0].username;

      // If logged in user is not events admin and cms admin then redirect to /cms to redirect him to his own admin panel
      if (
        user != "admin@cms" &&
        user != "hod@cs" &&
        user != "hod@ms" &&
        user != "coordinator@cs" &&
        user != "coordinator@ms" &&
        user != "po@iitm" &&
        user != "pro@iitm" &&
        user != "director@iitm"
      ) {
        res.redirect("/cms");
      } else {
        // Else render events admin
        res.render("admin/admin-events", {
          pageTitle: "CMS - Events",
          pageName: "Events",
          isAuthenticated: req.session.isLoggedIn,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};

// Handle events Upload
// configure multer to store uploaded files in the 'uploads/events' directory
const eventsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/events");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/ /g, "-"));
  },
});
const uploadEvent = multer({ storage: eventsStorage });
// Upload events controller
exports.postEvent = (req, res, next) => {
  uploadEvent.single("poster")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Handle multer error
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Handle other errors
      return res.status(500).json({ error: err.message });
    }

    // Collects form data
    const fileUrl = req.file
      ? req.file.path.replace("public", "").replace(/ /g, "-")
      : null; // Get relative file URL
    const event = req.body.event;
    const desc = marked.parse(req.body.description); // Convert the user events description input from Markdown to HTML
    const start = req.body.start;
    const end = req.body.end;
    const speaker = req.body.speaker;
    const audience = req.body.audience;
    const place = req.body.place;

    const sql =
      "INSERT INTO events (event, description, start, end, speaker, audience, place, path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    query(
      sql,
      [event, desc, start, end, speaker, audience, place, fileUrl],
      req.session.user
    )
      .then(() => {
        res.redirect("/cms/admin-events");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  });
};
// Delete events controller
exports.deleteEvent = (req, res, next) => {
  const eventID = req.params.eid;
  query("SELECT path FROM events WHERE (eid = ?)", [eventID])
    .then((result) => {
      query("DELETE FROM events WHERE (eid = ?)", [eventID], req.session.user)
        .then(() => {
          const filePath = `public/${result[0]?.path}`;
          if (fs.existsSync(filePath)) {
            fs.unlink(`public/${result[0].path}`, (err) => {
              if (err) {
                console.log(err);
                return res.status(500).send("Failed to delete file");
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(500)
            .send("Couldn't delete the notification for some reasons");
        });
    })
    .then(() => {
      res.redirect("/events");
    });
};

// Post video conroller
exports.postVideo = (req, res, next) => {
  // Collects form data
  const title = req.body.title;
  const video = req.body.link;
  const category = req.body.category;
  const sql = "INSERT INTO videos (title, link, category) VALUES (?, ?,  ?)";

  query(sql, [title, video, category], req.session.user)
    .then(() => {
      res.redirect("/cms/admin-events");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Can't upload the video. Try again!");
    });
};
// Delete video controller
exports.deleteVideo = (req, res, next) => {
  const videoID = req.params.vid;
  query("DELETE FROM videos WHERE (vid = ?)", [videoID], req.session.user)
    .then(() => {
      res.redirect("/community/videos/campus");
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .send(
          "Couldn't delete the video for some reason. Try deleting again!."
        );
    });
};

//? /////////////////////////////////////////////////////////////////////////////
// Handle S0
exports.getSODash = (req, res, next) => {
  query("SELECT username FROM users WHERE uid = ?", [req.session.user])
    .then((result) => {
      user = result[0].username;

      // If logged in user is not SO then redirect to /cms to redirect him to his own admin panel
      if (user != "so@iitm") {
        res.redirect("/cms");
      } else {
        res.render("admin/so-iitm", {
          pageTitle: "CMS - Section Officer",
          pageName: "Section Officer",
          isAuthenticated: req.session.isLoggedIn,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};
exports.getContactFormSubmissions = (req, res, next) => {
  query("SELECT username FROM users WHERE uid = ?", [req.session.user])
    .then((result) => {
      user = result[0].username;

      if (user != "so@iitm" && user != "admin@cms" && user != "director@iitm") {
        res.redirect("/cms");
      } else {
        query("SELECT * FROM contactUs ORDER BY date DESC LIMIT 0, 25")
          .then((contacts) => {
            res.render("admin/contact-form-submissions", {
              pageTitle: "CMS - Contact Submissions",
              pageName: "Contact Submissions",
              isAuthenticated: req.session.isLoggedIn,
              contacts,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send("Internal Server Error");
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};
exports.fetchContacts = (req, res, next) => {
  // Collecting data send by client side
  const limit = 25;
  const offset = parseInt(req.query.offset);

  let sql = "SELECT * FROM contactUs ORDER BY DATE DESC LIMIT ?, ?";
  let queryPlaceholders = [offset, limit];

  query(sql, queryPlaceholders)
    .then((contacts) => {
      res.json(contacts);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};
exports.postDeleteContact = (req, res, next) => {
  const cid = req.params.cid;
  query("DELETE FROM contactUs WHERE (cid = ?)", [cid], req.session.user)
    .then(() => {
      res.redirect("/cms/so-iitm");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};

// Handle PRO
exports.getPRODash = (req, res, next) => {
  query("SELECT username FROM users WHERE uid = ?", [req.session.user])
    .then((result) => {
      user = result[0].username;

      // If logged in user is not PRO then redirect to /cms to redirect him to his own admin panel
      if (user != "pro@iitm") {
        res.redirect("/cms");
      } else {
        res.render("admin/pro-iitm", {
          pageTitle: "CMS - PRO",
          pageName: "PRO",
          isAuthenticated: req.session.isLoggedIn,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};
exports.getFeedbacks = (req, res, next) => {
  query("SELECT username FROM users WHERE uid = ?", [req.session.user])
    .then((result) => {
      user = result[0].username;

      // If logged in user is not PRO then redirect to /cms to redirect him to his own admin panel
      if (
        user != "pro@iitm" &&
        user != "admin@cms" &&
        user != "director@iitm"
      ) {
        res.redirect("/cms");
      } else {
        res.render("admin/feedbacks", {
          pageTitle: "CMS - Feedbacks",
          pageName: "Feedbacks",
          isAuthenticated: req.session.isLoggedIn,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};

exports.fetchFeedbacks = (req, res, next) => {
  // Collecting data send by client side
  const limit = 25;
  const offset = parseInt(req.query.offset);
  const provider = req.query.provider;

  let sql =
    "SELECT * FROM feedbacks WHERE (provider = ?) ORDER BY DATE DESC LIMIT ?, ?";
  let queryPlaceholders = [provider, offset, limit];

  query(sql, queryPlaceholders)
    .then((feedbacks) => {
      res.json(feedbacks);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};

//? /////////////////////////////////////////////
//? HANDLE GRIEVANCE REDRESSAL
// Get Grievance Redressal dashboard. (Pending grievances will be shown here)
exports.getGRDash = (req, res, next) => {
  Promise.all([
    query("SELECT username FROM users WHERE uid = ?", [req.session.user]),
    query("SELECT COUNT(*) AS pending FROM grievances WHERE redressal IS NULL"),
  ])
    .then(([result, toBeRedressed]) => {
      user = result[0].username;
      // If logged in user is not GR then redirect to /cms to redirect him to his own admin panel
      if (user != "gr@iitm") {
        res.redirect("/cms");
      } else {
        res.render("admin/gr-iitm", {
          pageTitle: "CMS - Greivance Redressal",
          pageName: "Grievance Redressal",
          isAuthenticated: req.session.isLoggedIn,
          toBeRedressed: toBeRedressed[0].pending,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};
// Get Grievance Redressal dashboard. (Redressed grievances will be shown here)
exports.getRedressedGRDash = (req, res, next) => {
  Promise.all([
    query("SELECT username FROM users WHERE uid = ?", [req.session.user]),
    query(
      "SELECT COUNT(*) AS redressed FROM grievances WHERE redressal IS NOT NULL"
    ),
  ])
    .then(([result, redressed]) => {
      user = result[0].username;

      // If logged in user is not GR then redirect to /cms to redirect him to his own admin panel
      if (user != "gr@iitm") {
        res.redirect("/cms");
      } else {
        res.render("admin/redressed-grievances", {
          pageTitle: "CMS - Redressed Grievances",
          pageName: "Redressed Grievances",
          isAuthenticated: req.session.isLoggedIn,
          redressed: redressed[0].redressed,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};
// Asynchronous function to fetch pending grievances from database
exports.fetchGrievances = (req, res, next) => {
  // Collecting data send by client side
  const limit = 25;
  const offset = parseInt(req.query.offset);
  const submitter = req.query.submitter;

  let sql =
    "SELECT * FROM grievances WHERE (submitter = ?) AND redressal IS NULL ORDER BY DATE DESC LIMIT ?, ?";
  let queryPlaceholders = [submitter, offset, limit];

  query(sql, queryPlaceholders)
    .then((grievances) => {
      res.json(grievances);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};
// Asynchronous function to fetch redressed grievances from database
exports.fetchRedressedGrievances = (req, res, next) => {
  // Collecting data send by client side
  const limit = 25;
  const offset = parseInt(req.query.offset);
  const submitter = req.query.submitter;

  let sql =
    "SELECT * FROM grievances WHERE (submitter = ?) AND redressal IS NOT NULL ORDER BY redressedOn DESC LIMIT ?, ?";
  let queryPlaceholders = [submitter, offset, limit];

  query(sql, queryPlaceholders)
    .then((grievances) => {
      res.json(grievances);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .send(
          "Can't fetch redressed grievances due to some issues. Try again later!"
        );
    });
};
// Funciton to redress grievance and mail the same to the grievance submitter
exports.redressGrievance = (req, res, next) => {
  const gid = req.params.gid;
  const redressal = req.body.redressal;

  const insertQuery =
    "UPDATE grievances SET redressal = ?, redressedOn = CURRENT_TIMESTAMP WHERE (gid = ?)";
  const queryParams = [redressal, gid];

  Promise.all([
    query(insertQuery, queryParams, req.session.user),
    query(
      "SELECT name, email, grievance, redressal, date FROM grievances WHERE (gid = ?)",
      [gid]
    ),
  ])
    .then(([result, grievanceDetails]) => {
      const gd = grievanceDetails[0];
      const name = gd.name;
      const email = gd.email;
      const grievance = gd.grievance;
      const gr = redressal;
      const date = gd.date;

      const emailBody = `
      <html>
        <body>
            <h1>Your Grievance has been Redressed</h1>
            <p>Dear <strong>${name}</strong>,</p>
            <p>We are pleased to inform you that your grievance which you had raised on ${new Date(
        date
      ).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })} has been redressed.</p>
            <p>Here are the key details:</p>
            <h3>Grievance</h3>
            <p><b>${grievance}</b></p>
            <h3>Redressal</h3>
            <p><b>${redressal}</b></p>

            <p>Thank you for bringing this matter to our attention. If you have any further questions or require additional assistance, please feel free to reach out to us.</p>

            <p>Best regards,<br>Grievance Redressal, <a href="iitm.edu.in">IITM</a></p>
        </body>
      </html>
      `;

      mail.sendGR(email, "Your Grievance has been Redressed", emailBody);

      res.redirect("/cms/gr-iitm");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Can't redress now. Try again later!");
    });
};

// Handle PO
exports.getPODash = (req, res, next) => {
  query("SELECT username FROM users WHERE uid = ?", [req.session.user])
    .then((result) => {
      user = result[0].username;

      // If logged in user is not GR then redirect to /cms to redirect him to his own admin panel
      if (user != "po@iitm") {
        res.redirect("/cms");
      } else {
        res.render("admin/po-iitm", {
          pageTitle: "CMS - Placement Officer",
          pageName: "Placement Officer",
          isAuthenticated: req.session.isLoggedIn,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};
exports.getPlacementsDash = (req, res, next) => {
  query("SELECT username FROM users WHERE uid = ?", [req.session.user])
    .then((result) => {
      user = result[0].username;

      // If logged in user is not GR then redirect to /cms to redirect him to his own admin panel
      if (user != "po@iitm") {
        res.redirect("/cms");
      } else {
        res.render("admin/admin-placements", {
          pageTitle: "CMS - Placement Officer",
          pageName: "Placement Officer",
          isAuthenticated: req.session.isLoggedIn,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};
// Handle Testimonial Upload
// configure multer to store uploaded files in the 'uploads/news' directory
const testimonialStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/testimonialImages");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/ /g, "-"));
  },
});
const uploadTestimonial = multer({ storage: testimonialStorage });
exports.postTestimonial = (req, res, next) => {
  uploadTestimonial.single("photograph")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Handle multer error
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Handle other errors
      return res.status(500).json({ error: err.message });
    }

    // Collects form data
    const fileUrl = req.file
      ? req.file.path.replace("public", "").replace(/ /g, "-")
      : null; // Get relative file URL

    const name = req.body.name;
    const program = req.body.program;
    const company = req.body.company;
    const package = req.body.package;
    const testimonial = req.body.testimonial;

    const sql =
      "INSERT INTO placementTestimonials (photograph, name, program, company, package, testimonial) VALUES (?, ?, ?, ?, ? ,?)";

    query(
      sql,
      [fileUrl, name, program, company, package, testimonial],
      req.session.user
    )
      .then(() => {
        res.redirect("/cms/po-iitm");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  });
};
// Handle Highlight Upload
// configure multer to store uploaded files in the 'uploads/news' directory
const highlightsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/highlightsImages");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/ /g, "-"));
  },
});
const uploadHighlights = multer({ storage: highlightsStorage });
exports.postHighlight = (req, res, next) => {
  uploadHighlights.single("picture")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Handle multer error
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Handle other errors
      return res.status(500).json({ error: err.message });
    }

    // Collects form data
    const fileUrl = req.file
      ? req.file.path.replace("public", "").replace(/ /g, "-")
      : null; // Get relative file URL

    const headline = req.body.headline;
    const description = req.body.description;

    const sql =
      "INSERT INTO placementDriveHighlights (headline, description, picture) VALUES (?, ?, ?)";

    query(sql, [headline, description, fileUrl], req.session.user)
      .then(() => {
        res.redirect("/cms/po-iitm");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Cannot upload the highlight. Try again later!");
      });
  });
};
exports.postWorkshopBootcamp = (req, res, next) => {
  // Collects form data
  const type = req.body.type;
  const title = req.body.title;
  const desc = req.body.description;
  const place = req.body.place;
  const speaker = req.body.speaker;
  const participants = req.body.participants;
  const date = req.body.date ? new Date(req.body.date) : new Date();

  const sql =
    "INSERT INTO workshopsAndBootcamps (type, title, description, place, speaker, participants, date) VALUES (?, ?, ?, ?, ?, ?, ?)";
  query(
    sql,
    [type, title, desc, place, speaker, participants, date],
    req.session.user
  )
    .then(() => {
      res.redirect("/cms/po-iitm");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Cannot upload workshop/bootcamp. Try again later!");
    });
};
exports.postGuestLecture = (req, res, next) => {
  // Collects form data
  const title = req.body.title;
  const desc = req.body.description;
  const place = req.body.place;
  const speaker = req.body.speaker;
  const participants = req.body.participants;
  const date = req.body.date ? new Date(req.body.date) : new Date();

  const sql =
    "INSERT INTO guestLectures (title, description, place, speaker, participants, date) VALUES (?, ?, ?, ?, ?, ?)";

  query(
    sql,
    [title, desc, place, speaker, participants, date],
    req.session.user
  )
    .then(() => {
      res.redirect("/cms/po-iitm");
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .send("Cannot upload guest lecture right now. Try again later!");
    });
};
exports.postIndustrialVisit = (req, res, next) => {
  // Collects form data
  const industry = req.body.industry;
  const desc = req.body.description;
  const place = req.body.place;
  const participants = req.body.participants;
  const date = req.body.date ? new Date(req.body.date) : new Date();

  const sql =
    "INSERT INTO industrialVisits (industry, description, place, participants, date) VALUES (?, ?, ?, ?, ?)";

  query(sql, [industry, desc, place, participants, date], req.session.user)
    .then(() => {
      res.redirect("/cms/po-iitm");
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .send("Cannot upload industrial visit now. Try again later!");
    });
};

//? //////////////////////////////////////////////////
//? Admissions
exports.getAdmissionsDash = (req, res, next) => {
  const course = req.query.course ? req.query.course : null;
  const type = req.query.type ? req.query.type : 0;
  const year = req.query.year ? req.query.year : new Date().getFullYear();

  let insertQuery = "";
  let queryParams = "";

  if (type == 0) {
    if (course && !year) {
      insertQuery =
        "SELECT * FROM newAdmissions WHERE (admitted = 0) AND (interestedIn = ?) ORDER BY date DESC";
      queryParams = [course];
    } else if (year && !course) {
      insertQuery =
        "SELECT * FROM iitm.newAdmissions WHERE (admitted = 0) AND (year(date) = ?) ORDER BY date DESC";
      queryParams = [year];
    } else if (course && year) {
      insertQuery =
        "SELECT * FROM newAdmissions WHERE (admitted = 0) AND (interestedIn = ?) AND (year(date) = ?) ORDER BY date DESC";
      queryParams = [course, year];
    } else {
      insertQuery =
        "SELECT * FROM newAdmissions WHERE (admitted = 0) AND YEAR(date) = YEAR(CURRENT_DATE) ORDER BY date DESC";
      queryParams = [];
    }
  } else {
    if (course && !year) {
      insertQuery =
        "SELECT * FROM newAdmissions WHERE (admitted = 1) AND (interestedIn = ?) ORDER BY date DESC";
      queryParams = [course];
    } else if (year && !course) {
      insertQuery =
        "SELECT * FROM iitm.newAdmissions WHERE (admitted = 1) AND (year(date) = ?) ORDER BY date DESC";
      queryParams = [year];
    } else if (course && year) {
      insertQuery =
        "SELECT * FROM newAdmissions WHERE (admitted = 1) AND (interestedIn = ?) AND (year(date) = ?) ORDER BY date DESC";
      queryParams = [course, year];
    } else {
      insertQuery =
        "SELECT * FROM newAdmissions WHERE (admitted = 1) AND YEAR(date) = YEAR(CURRENT_DATE) ORDER BY date DESC";
      queryParams = [];
    }
  }

  query("SELECT username FROM users WHERE uid = ?", [req.session.user])
    .then((result) => {
      user = result[0].username;

      // If logged in user is not GR then redirect to /cms to redirect him to his own admin panel
      if (user != "admissions@iitm") {
        res.redirect("/cms");
      } else {
        query(insertQuery, queryParams)
          .then((admissions) => {
            res.render("admin/admissions-iitm", {
              pageTitle: "CMS - New Admissions",
              pageName: "Admissions",
              admissions,
              year,
              course,
              type,
              isAuthenticated: req.session.isLoggedIn,
            });
          })
          .catch((err) => {
            console.log(err);
            res
              .status(500)
              .send("Can't fetch admissions now. Try again later!");
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Can't authenticate.");
    });
};
exports.admitStudent = (req, res, next) => {
  const admissionId = req.params.aid;
  query(
    "UPDATE newAdmissions SET admitted = 1 WHERE (aid = ?)",
    [admissionId],
    req.session.user
  )
    .then(() => {
      res.json({ status: 1 });
    })
    .catch((err) => {
      res.json({ status: 0 });
    });
};

exports.getDirectorDash = (req, res, next) => {
  query("SELECT username FROM users WHERE uid = ?", [req.session.user])
    .then((result) => {
      user = result[0].username;

      // If logged in user is not GR then redirect to /cms to redirect him to his own admin panel
      if (user != "director@iitm") {
        res.redirect("/cms");
      } else {
        res.render("admin/director-iitm", {
          pageTitle: "CMS - Director",
          pageName: "Director",
          isAuthenticated: req.session.isLoggedIn,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};
exports.getLogsDash = (req, res, next) => {
  const date = req.query.date ? req.query.date : null;

  if (!date) {
    queryDate = new Date().toISOString().slice(0, 10);
  } else {
    queryDate = date;
  }

  const sql =
    "SELECT l.*, u.username FROM logs l JOIN users u ON l.user = u.uid WHERE DATE(l.time) = ? ORDER by l.time DESC";

  // all logs of today
  query(sql, [queryDate])
    .then((logs) => {
      console.log(logs);
      res.render("admin/admin-logs", {
        pageTitle: "CMS - Logs",
        pageName: "Logs",
        isAuthenticated: req.session.isLoggedIn,
        logs,
        date,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};

//? ////////////////////////////////////////////////////////
//? ////////////////////////////////////////////////////////
// HOME ADMIN PANEL
//? ////////////////////////////////////////////////////////
//? ////////////////////////////////////////////////////////

// CS HOD controller
exports.getHODCS = (req, res, next) => {
  Promise.all([
    query("SELECT username FROM users WHERE uid = ?", [req.session.user]),
  ])
    .then(([user]) => {
      user = user[0].username;
      if (user != "hod@cs") {
        res.redirect("/cms");
      } else {
        // Else render home admin
        res.render("admin/cs-hod", {
          pageTitle: "CMS - Home",
          pageName: "HOD CS",
          isAuthenticated: req.session.isLoggedIn,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};
// MS HOD controller
exports.getHODMS = (req, res, next) => {
  Promise.all([
    query("SELECT username FROM users WHERE uid = ?", [req.session.user]),
  ])
    .then(([user]) => {
      user = user[0].username;
      if (user != "hod@ms") {
        res.redirect("/cms");
      } else {
        // Else render home admin
        res.render("admin/ms-hod", {
          pageTitle: "CMS - Home",
          pageName: "HOD MS",
          isAuthenticated: req.session.isLoggedIn,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};

// CS Coordinator controller
exports.getCoordinatorCS = (req, res, next) => {
  Promise.all([
    query("SELECT username FROM users WHERE uid = ?", [req.session.user]),
  ])
    .then(([user]) => {
      user = user[0].username;
      if (user != "coordinator@cs") {
        res.redirect("/cms");
      } else {
        // Else render home admin
        res.render("admin/cs-coordinator", {
          pageTitle: "CMS - Coordinator",
          pageName: "Coordinator CS",
          isAuthenticated: req.session.isLoggedIn,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};
// MS Coordinator controller
exports.getCoordinatorMS = (req, res, next) => {
  Promise.all([
    query("SELECT username FROM users WHERE uid = ?", [req.session.user]),
  ])
    .then(([user]) => {
      user = user[0].username;
      if (user != "coordinator@ms") {
        res.redirect("/cms");
      } else {
        // Else render home admin
        res.render("admin/ms-coordinator", {
          pageTitle: "CMS - Coordinator",
          pageName: "Coordinator MS",
          isAuthenticated: req.session.isLoggedIn,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};

// Password Change
exports.getChangePassword = (req, res, next) => {
  // Checks if there is any error to show
  const changeErr = req.params.error
    ? req.params.error.split("_").join(" ")
    : null;

  // Checks if the user attempted to change password previouly to load the password field with prefilled values
  const valuePassword = req.session.oldPass ? req.session.oldPass : null;
  delete req.session.oldPass;

  // Else render notifications admin
  res.render("admin/change-password", {
    pageTitle: "CMS - Change Password",
    pageName: "Change Password",
    isAuthenticated: req.session.isLoggedIn,
    changeErr,
    password: valuePassword,
  });
};
exports.postChangePassword = async (req, res, next) => {
  const oldPass = req.body.old;
  const newPass = req.body.new;
  const cNewPass = req.body.cnew;

  // Regex pattern to validate strong password
  const strongPasswordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

  // If new password and confirm new passwor do not matches.
  if (newPass != cNewPass) {
    // Redirect back with error message
    res.redirect("/cms/change-password/passwords_do_not_match");
  }
  // If user didn't chose strong password
  else if (!strongPasswordRegex.test(cNewPass)) {
    // Store old password in session variable to retrieve it later in order to prefill the old password input field.
    req.session.oldPass = oldPass;

    // Redirect back with error message

    res.redirect(`/cms/change-password/not_strong_password`);
  } else {
    // Store the status updatePassword function returned
    const changeStatus = await authFns.updatePassword(
      oldPass,
      cNewPass,
      req.session.user
    );

    // If user didn't entered correct password
    if (changeStatus == 0) {
      // Redirect back with error message
      res.redirect("/cms/change-password/incorrect_password");
    }
    // Else log out the user as password is changed.
    else {
      req.session.destroy((err) => {
        console.log(err);
        res.redirect("/login");
      });
    }
  }
};

// API
exports.getAPI = (req, res, next) => {
  // Get query params
  const type = req.query.type;
  const id = req.query.id;
  const program = req.query.program ? req.query.program : null;
  const batch = req.query.batch ? req.query.batch : null;

  // Initialize query and it's params
  let getQuery = "";
  let queryParams = [id];

  // If it's a student or employee
  if (type == "student") {
    getQuery = "SELECT * FROM studentsDatabase WHERE (studentId = ?)";

    // If program and batch is also provided
    if (program) {
      getQuery =
        "SELECT * FROM studentsDatabase WHERE (program = ?) ORDER BY SUBSTRING(studentId, 7, 4) DESC, SUBSTRING(studentId, 4, 3)";
      queryParams = [program];

      if (batch) {
        getQuery =
          "SELECT * FROM studentsDatabase WHERE (program = ?) AND (batch = ?) ORDER BY SUBSTRING(studentId, 7, 4) DESC, SUBSTRING(studentId, 4, 3)";
        queryParams = [program, batch];
      }
    }

    // If only batch is provided
    if (batch && !program) {
      getQuery =
        "SELECT * FROM studentsDatabase WHERE (batch = ?) ORDER BY SUBSTRING(studentId, 1, 3), SUBSTRING(studentId, 7, 4) DESC, SUBSTRING(studentId, 4, 3)";
      queryParams = [batch];
    }
  } else if (type == "employee") {
    getQuery =
      "SELECT eid, name, email, contact, designation FROM employees WHERE (eid = ?) UNION SELECT eid, name, email, contact, designation FROM teachingFaculty WHERE (eid = ?)";
    queryParams = [id, id];
  }

  // Excetute query and render page
  query(getQuery, queryParams)
    .then((result) => {
      res.render("admin/api", {
        pageTitle: "IITM API",
        pageName: "IITM API",
        isAuthenticated: req.session.isLoggedIn,
        type: type,
        details: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Can't get data from database. Try again!");
    });
};



