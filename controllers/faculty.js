const query = require("../utils/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
exports.uploadFacultyFiles = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadPath = 'public/uploads/';
      uploadPath += file.fieldname === 'profile_image' ? 'profile_images' : 'resumes';
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const prefix = file.fieldname === 'profile_image' ? 'profile-' : 'resume-';
      cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'profile_image') {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed for profile pictures'), false);
      }
    } else if (file.fieldname === 'resume_file') {
      if (file.mimetype !== 'application/pdf') {
        return cb(new Error('Only PDF files are allowed for resumes'), false);
      }
    }
    cb(null, true);
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB for images
    files: 2 // Maximum 2 files (1 image, 1 pdf)
  }
}).fields([
  { name: 'profile_image', maxCount: 1 },
  { name: 'resume_file', maxCount: 1 }
]);

// List all faculty
exports.getFaculty = async (req, res) => {
    
  try {
    const faculty = await query(`
      SELECT * FROM faculty 
      WHERE is_active = TRUE 
      ORDER BY department, \`order\`, full_name
    `);

 
    const facultyByDepartment = faculty.reduce((acc, member) => {
      if (!acc[member.department]) {
        acc[member.department] = [];
      }
      acc[member.department].push(member);
      return acc;
    }, {});

  
    res.render('admin/adminfaculty', {
      faculty: facultyByDepartment,
      successMessage: req.session.successMessage,
      errorMessage: req.session.errorMessage,
      isAuthenticated: req.session.isLoggedIn,
      pageTitle: "CMS - Faculty",
      pageName: "Faculty"
    });

    delete req.session.successMessage;
    delete req.session.errorMessage;
  } catch (err) {
    console.error('Error fetching faculty:', err);
    req.session.errorMessage = "Failed to load faculty data";
    res.redirect("/cms/admin-cms");
  }
};

// Show faculty form for add/edit
exports.getFacultyForm = async (req, res) => {
  try {
    const facultyId = req.params.id;
    let faculty = null;

    if (facultyId) {
      [faculty] = await query(`
        SELECT * FROM faculty 
        WHERE faculty_id = ? 
        AND is_active = TRUE
      `, [facultyId]);

      if (!faculty) {
        req.session.errorMessage = "Faculty member not found";
        return res.redirect("/cms/adminfaculty");
      }
    }

    // Get the current highest order value
    const [maxOrderResult] = await query(`
      SELECT MAX(\`order\`) as maxOrder FROM faculty
      WHERE is_active = TRUE
    `);
    const nextOrder = (maxOrderResult?.maxOrder || 0) + 1;

    res.render('admin/adminfacultyaddedit', {
      faculty,
      isEditMode: !!facultyId,
      nextOrder: faculty?.order || nextOrder,
      isAuthenticated: req.session.isLoggedIn,
      pageTitle: facultyId ? "Edit Faculty" : "Add Faculty",
      pageName: "Faculty"
    });

  } catch (err) {
    console.error('Error in faculty form:', err);
    req.session.errorMessage = "Failed to load faculty form";
    res.redirect("/cms/adminfaculty");
  }
};

// Save faculty member
exports.saveFaculty = async (req, res) => {
  try {
   

    const facultyId = req.params.id || req.body.faculty_id;
    const {
      full_name,
      position,
      department,
      experience,
      specialization,
      education,
      email,
      phone,
      order,
      is_active
    } = req.body;

    const activeStatus = 1;
    
    // Get file paths if they were uploaded
    const profile_image = req.files?.profile_image ? `/uploads/profile_images/${req.files.profile_image[0].filename}` : null;
    const resume_path = req.files?.resume_file ? `/uploads/resumes/${req.files.resume_file[0].filename}` : null;

    if (facultyId) {
      // Update existing faculty
      const [currentFaculty] = await query(`
        SELECT profile_image, resume_path FROM faculty WHERE faculty_id = ?
      `, [facultyId]);

      // Handle file deletions for updates
      if (profile_image && currentFaculty?.profile_image) {
        const oldImagePath = path.join(__dirname, '../public', currentFaculty.profile_image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      if (resume_path && currentFaculty?.resume_path) {
        const oldResumePath = path.join(__dirname, '../public', currentFaculty.resume_path);
        if (fs.existsSync(oldResumePath)) {
          fs.unlinkSync(oldResumePath);
        }
      }

      await query(`
        UPDATE faculty SET
          profile_image = COALESCE(?, profile_image),
          full_name = ?,
          position = ?,
          department = ?,
          experience = ?,
          specialization = ?,
          education= ?,
          email = ?,
          phone = ?,
          \`order\` = ?,
          resume_path = COALESCE(?, resume_path),
          is_active = ?
        WHERE faculty_id = ?
      `, [
        profile_image,
        full_name,
        position,
        department,
        experience,
        specialization,
        education,
        email,
        phone,
        order,
        resume_path,
        1,
        facultyId
      ]);

      req.session.successMessage = "Faculty member updated successfully";
    } else {
      // Insert new faculty
      await query(`
        INSERT INTO faculty (
          profile_image,
          full_name,
          position,
          department,
          experience,
          specialization,
          education,
          email,
          phone,
          \`order\`,
          resume_path,
          is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        profile_image,
        full_name,
        position,
        department,
        experience,
        specialization,
        education,
        email,
        phone,
        order,
        resume_path,
        activeStatus
      ]);

      req.session.successMessage = "Faculty member added successfully";
    }

    res.redirect("/cms/adminfaculty");
  } catch (err) {
    console.error('Error saving faculty:', err);
    
    // Clean up uploaded files if error occurred
    if (req.files?.profile_image) {
      fs.unlinkSync(req.files.profile_image[0].path);
    }
    if (req.files?.resume_file) {
      fs.unlinkSync(req.files.resume_file[0].path);
    }

    req.session.errorMessage = "Failed to save faculty member: " + err.message;
    res.redirect(req.headers.referer || '/cms/adminfaculty');
  }
};

// Delete faculty (soft delete)
exports.deleteFaculty = async (req, res) => {
  try {
    const facultyId = req.params.id;
    await query("UPDATE faculty SET is_active = FALSE WHERE faculty_id = ?", [facultyId]);
    req.session.successMessage = "Faculty member deleted successfully";
    res.redirect("/cms/adminfaculty");
  } catch (err) {
    console.error(err);
    req.session.errorMessage = "Error deleting faculty member";
    res.redirect("/cms/adminfaculty");
  }
};

// Update faculty order
exports.updateFacultyOrder = async (req, res) => {
  try {
    const { facultyIds } = req.body;
    
    if (!Array.isArray(facultyIds)) {
      return res.status(400).json({ success: false, message: "Invalid data format" });
    }

    const updatePromises = facultyIds.map((facultyId, index) => {
      return query(`
        UPDATE faculty SET \`order\` = ?
        WHERE faculty_id = ?
      `, [index + 1, facultyId]);
    });

    await Promise.all(updatePromises);
    res.json({ success: true, message: "Order updated successfully" });
  } catch (err) {
    console.error('Error updating faculty order:', err);
    res.status(500).json({ success: false, message: "Failed to update order" });
  }
};