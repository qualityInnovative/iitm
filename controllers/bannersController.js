const query = require("../utils/db");
const multer = require("multer");
const path = require("path");

// Setup multer storage for banner images
const bannersStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/banners");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname.replace(/ /g, "-"));
    },
});

exports.uploadBannerImage = multer({ storage: bannersStorage });

// List all banners
exports.getBanners = async (req, res) => {
    try {
        const banners = await query("SELECT * FROM banners ORDER BY priority ASC");
        res.render("admin/banners", {
            banners,
            successMessage: req.session.successMessage,
            errorMessage: req.session.errorMessage,
            isAuthenticated: req.session.isLoggedIn,
            pageTitle: "CMS - Banners",
            pageName: "Banners",
        });
        delete req.session.successMessage;
        delete req.session.errorMessage;
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// Show banner form for add/edit
exports.getBannerForm = async (req, res) => {
    try {
        const id = req.params.id;
        let banner = null;
        if (id) {
            [banner] = await query("SELECT * FROM banners WHERE id = ?", [id]);
            if (!banner) {
                req.session.errorMessage = "Banner not found";
                return res.redirect("/cms/banners");
            }
        }
        res.render("admin/banner-form", {
            banner,
            isAuthenticated: req.session.isLoggedIn,
            pageTitle: id ? "Edit Banner" : "Add Banner",
            pageName: "Banners",
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

exports.saveBanner = async (req, res) => {
    try {
        // Destructure the correct field names from req.body
        const {
            id,
            banner_text,
            banner_subtext,
            has_button,
            button_text,
            button_link,
            priority,
            is_active,
        } = req.body;

        const isActive = is_active === "1" || is_active === "on" ? 1 : 0;
        const hasButton = has_button === "1" ? 1 : 0;
        const image = req.file ? req.file.filename : null;

        if (id) {
            // Update existing banner
            if (image) {
                await query(
                    `UPDATE banners SET banner_text=?, banner_subtext=?, has_button=?, button_text=?, button_link=?, priority=?, is_active=?, image=? WHERE id=?`,
                    [
                        banner_text,
                        banner_subtext,
                        hasButton,
                        button_text,
                        button_link,
                        priority || 0,
                        isActive,
                        image,
                        id,
                    ]
                );
            } else {
                await query(
                    `UPDATE banners SET banner_text=?, banner_subtext=?, has_button=?, button_text=?, button_link=?, priority=?, is_active=? WHERE id=?`,
                    [
                        banner_text,
                        banner_subtext,
                        hasButton,
                        button_text,
                        button_link,
                        priority || 0,
                        isActive,
                        id,
                    ]
                );
            }
            req.session.successMessage = "Banner updated successfully";
        } else {
            // Insert new banner
            await query(
                `INSERT INTO banners (banner_text, banner_subtext, has_button, button_text, button_link, priority, is_active, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    banner_text,
                    banner_subtext,
                    hasButton,
                    button_text,
                    button_link,
                    priority || 0,
                    isActive,
                    image,
                ]
            );
            req.session.successMessage = "Banner added successfully";
        }
        res.redirect("/cms/banners");
    } catch (err) {
        console.error(err);
        req.session.errorMessage = "Error saving banner";
        res.redirect(req.originalUrl);
    }
};


// Delete banner
exports.deleteBanner = async (req, res) => {
    try {
        // Optionally delete banner image file from disk here before deleting DB record (not implemented)
        await query("DELETE FROM banners WHERE id = ?", [req.params.id]);
        req.session.successMessage = "Banner deleted successfully";
        res.redirect("/cms/banners");
    } catch (err) {
        console.error(err);
        req.session.errorMessage = "Error deleting banner";
        res.redirect("/cms/banners");
    }
};
