// Get organizational chart data and render form
// controllers/accreditationsController.js
const query = require("../utils/db");

const fs = require("fs");
const path = require("path");
const {uploadOrgChart} = require("./organizationalchartStorage");
exports.getOrganizationalChart = async (req, res) => {
    try {
      const [orgChart] = await query(
        "SELECT id, title, description, image_path FROM organizational_charts ORDER BY id DESC LIMIT 1"
      );
  
      res.render("admin/adminorganizationalchart", {
        orgChart,
        successMessage: req.session.successMessage,
        errorMessage: req.session.errorMessage
      });
      
      delete req.session.successMessage;
      delete req.session.errorMessage;
    } catch (err) {
      console.error("Error loading organizational chart:", err);
      req.session.errorMessage = "Failed to load organizational chart";
      res.redirect("/cms/admin-home");
    }
  };
  
  // Save or update organizational chart
  exports.saveOrgChart = async (req, res) => {
    const { title, description } = req.body;
    const file = req.file;
    
    try {
      // Check if org chart already exists
      const [existingChart] = await query(
        "SELECT id, image_path FROM organizational_charts ORDER BY id DESC LIMIT 1"
      );
  
      // UPDATE EXISTING
      if (existingChart) {
        let imagePath = existingChart.image_path;
  
        if (file) {
          // Delete old file
          const oldFilePath = path.join('public', imagePath);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
          
          // Update with new file
          imagePath = file.path.replace('public', '');
        }
  
        await query(
          `UPDATE organizational_charts 
           SET title = ?, description = ?, image_path = ?
           WHERE id = ?`,
          [title, description, imagePath, existingChart.id]
        );
        
        req.session.successMessage = "Organizational chart updated successfully";
      } 
      // CREATE NEW
      else {
        if (!file) {
          req.session.errorMessage = "Please upload an image file";
          return res.redirect("/cms/adminorganizationalchart");
        }
  
        await query(
          `INSERT INTO organizational_charts 
           (title, description, image_path)
           VALUES (?, ?, ?)`,
          [title, description, file.path.replace('public', '')]
        );
        
        req.session.successMessage = "Organizational chart created successfully";
      }
  
      res.redirect("/cms/adminorganizationalchart");
    } catch (err) {
      console.error("Error saving organizational chart:", err);
      
      // Cleanup uploaded file if error occurred
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      
      req.session.errorMessage = "Failed to save organizational chart";
      res.redirect("/cms/adminorganizationalchart");
    }
  };