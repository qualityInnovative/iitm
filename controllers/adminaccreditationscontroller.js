// controllers/accreditationsController.js
const query = require("../utils/db");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { uploadAccreditation } = require("./accreditationStorage");

exports.getAccreditations = async (req, res) => {
  try {
    const sections = await query(`
      SELECT id, section_name, section_title, section_description, 
             section_order, created_at, updated_at
      FROM accreditation_sections
      ORDER BY section_order
    `);

    const subsections = await query(`
      SELECT id, section_id, subsection_title, subsection_description,
             pdf_path, original_filename, subsection_order
      FROM accreditation_subsections
      ORDER BY subsection_order
    `);

    // Organize data
    const accreditationData = sections.map(section => ({
      ...section,
      subsections: subsections.filter(sub => sub.section_id === section.id)
    }));

    res.render("admin/adminaccreditations.pug", {
      accreditationData,
      successMessage: req.session.successMessage,
      errorMessage: req.session.errorMessage
    });
    
    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (err) {
    console.error("Error fetching accreditation data:", err);
    req.session.errorMessage = "Failed to load accreditation data";
    res.redirect("/cms/admin-home");
  }
};

// Show form to add/edit section
exports.getSectionForm = async (req, res) => {
  try {
    const section = req.params.id 
      ? (await query("SELECT * FROM accreditation_sections WHERE id = ?", [req.params.id]))[0]
      : null;

    res.render("admin/accreditation-section-form", {
      section,
      errorMessage: req.session.errorMessage
    });
    
    delete req.session.errorMessage;
  } catch (err) {
    console.error("Error loading section form:", err);
    req.session.errorMessage = "Failed to load form";
    res.redirect("/cms/adminaccreditations");
  }
};

// Save section data
exports.saveSection = async (req, res) => {
  const { section_name, section_title, section_description, section_order } = req.body;
  const sectionId = req.params.id;

  try {
    if (sectionId) {
      // Update existing section
      await query(
        `UPDATE accreditation_sections 
         SET section_name = ?, section_title = ?, section_description = ?, section_order = ?
         WHERE id = ?`,
        [section_name, section_title, section_description, section_order, sectionId]
      );
      req.session.successMessage = "Section updated successfully";
    } else {
      // Create new section
      await query(
        `INSERT INTO accreditation_sections 
         (section_name, section_title, section_description, section_order)
         VALUES (?, ?, ?, ?)`,
        [section_name, section_title, section_description, section_order]
      );
      req.session.successMessage = "Section created successfully";
    }
    
    res.redirect("/cms/adminaccreditations");
  } catch (err) {
    console.error("Error saving section:", err);
    req.session.errorMessage = "Failed to save section";
    res.redirect(sectionId ? `/cms/admin-accreditations/sections/${sectionId}/edit` : "/cms/admin-accreditations/sections/new");
  }
};

exports.getSubsectionForm = async (req, res) => {
  try {
    const [subsection, sections] = await Promise.all([
      req.params.id 
        ? query("SELECT * FROM accreditation_subsections WHERE id = ?", [req.params.id])
        : Promise.resolve(null),
      query("SELECT id, section_name, section_title FROM accreditation_sections ORDER BY section_order")
    ]);

    // Ensure sections exists and is an array
    if (!sections || !Array.isArray(sections)) {
      throw new Error("Failed to load sections");
    }

    // Preserve form data if there was an error
    const formData = req.session.formData || (subsection ? subsection[0] : null);

    res.render("admin/accreditation-subsection-form", {
      subsection: formData,
      sections: sections,
      selectedSectionId: formData?.section_id,
      errorMessage: req.session.errorMessage,
      successMessage: req.session.successMessage
    });
    
    // Clear flash messages
    delete req.session.errorMessage;
    delete req.session.successMessage;
    delete req.session.formData;
  } catch (err) {
    console.error("Error loading subsection form:", err);
    req.session.errorMessage = "Failed to load form data";
    res.redirect("/cms/admin-accreditations");
  }
};

exports.saveSubsection = async (req, res) => {
  try {
    // First handle the file upload
    await new Promise((resolve, reject) => {
      uploadAccreditation(req, res, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    const { section_id, subsection_title, subsection_description, subsection_order } = req.body;
    const subsectionId = req.params.id;
    const files = req.files;
    const pdfFile = files?.pdf?.[0];
    const thumbnailFile = files?.thumbnail?.[0];

    // Validate required fields
    if (!section_id || !subsection_title) {
      throw new Error("Section and Title are required fields");
    }

    if (subsectionId) {
      // Handle update
      const [existingSubsection] = await query(
        "SELECT pdf_path, thumbnail_path FROM accreditation_subsections WHERE id = ?",
        [subsectionId]
      );

      if (!existingSubsection) {
        throw new Error("Subsection not found");
      }

      // Prepare update data
      const updateData = {
        section_id,
        subsection_title,
        subsection_description: subsection_description || null,
        subsection_order: subsection_order || null
      };

      // Handle PDF file update
      if (pdfFile) {
        // Delete old file if exists
        if (existingSubsection.pdf_path) {
          const oldPath = path.join('public', existingSubsection.pdf_path);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        updateData.pdf_path = pdfFile.path.replace('public', '');
        updateData.original_filename = pdfFile.originalname;
      }

      // Handle thumbnail update
      if (thumbnailFile) {
        // Delete old thumbnail if exists
        if (existingSubsection.thumbnail_path) {
          const oldPath = path.join('public', existingSubsection.thumbnail_path);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        updateData.thumbnail_path = thumbnailFile.path.replace('public', '');
        updateData.thumbnail_original_name = thumbnailFile.originalname;
      }

      await query(
        "UPDATE accreditation_subsections SET ? WHERE id = ?",
        [updateData, subsectionId]
      );

      req.session.successMessage = "Subsection updated successfully";
    } else {
      // Handle create
      if (!pdfFile) {
        throw new Error("PDF file is required for new subsections");
      }

      const newSubsection = {
        section_id,
        subsection_title,
        subsection_description: subsection_description || null,
        subsection_order: subsection_order || null,
        pdf_path: pdfFile.path.replace('public', ''),
        original_filename: pdfFile.originalname,
        thumbnail_path: thumbnailFile?.path.replace('public', '') || null,
        thumbnail_original_name: thumbnailFile?.originalname || null
      };

      await query(
        "INSERT INTO accreditation_subsections SET ?",
        [newSubsection]
      );

      req.session.successMessage = "Subsection created successfully";
    }

    res.redirect("/cms/adminaccreditations");
  } catch (error) {
    console.error("Error saving subsection:", error);

    // Cleanup uploaded files if error occurred
    if (req.files) {
      for (const fileArray of Object.values(req.files)) {
        for (const file of fileArray) {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        }
      }
    }

    // Preserve form data for redisplay
    req.session.formData = {
      ...req.body,
      id: req.params.id
    };
    req.session.errorMessage = error.message;

    const redirectPath = req.params.id
      ? `/cms/admin-accreditations/subsections/${req.params.id}/edit`
      : "/cms/admin-accreditations/subsections/new";

    res.redirect(redirectPath);
  }
};
// Delete subsection
exports.deleteSubsection = async (req, res) => {
  try {
    const [subsection] = await query(
      "SELECT pdf_path FROM accreditation_subsections WHERE id = ?",
      [req.params.id]
    );

    if (!subsection) {
      req.session.errorMessage = "Subsection not found";
      return res.redirect("/cms/adminaccreditations");
    }

    // Delete from database
    await query("DELETE FROM accreditation_subsections WHERE id = ?", [req.params.id]);

    // Delete file
    if (subsection.pdf_path) {
      const filePath = path.join('public', subsection.pdf_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    req.session.successMessage = "Subsection deleted successfully";
    res.redirect("/cms/adminaccreditations");
  } catch (err) {
    console.error("Error deleting subsection:", err);
    req.session.errorMessage = "Failed to delete subsection";
    res.redirect("/cms/adminaccreditations");
  }
};

// Delete section (only if no subsections)
exports.deleteSection = async (req, res) => {
  try {
    const [subsections] = await query(
      "SELECT COUNT(*) as count FROM accreditation_subsections WHERE section_id = ?",
      [req.params.id]
    );

    if (subsections.count > 0) {
      req.session.errorMessage = "Cannot delete section with existing subsections";
      return res.redirect("/cms/adminaccreditations");
    }

    await query("DELETE FROM accreditation_sections WHERE id = ?", [req.params.id]);

    req.session.successMessage = "Section deleted successfully";
    res.redirect("/cms/adminaccreditations");
  } catch (err) {
    console.error("Error deleting section:", err);
    req.session.errorMessage = "Failed to delete section";
    res.redirect("/cms/adminaccreditations");
  }
};