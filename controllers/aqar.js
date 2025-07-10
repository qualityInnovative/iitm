const query = require("../utils/db");
const pageTitle = "AQAR";
const pagePath = "/aqar";

async function buildNestedMenu(yearId) {
    const criteriaList = await query(
        `SELECT id, criteria_label FROM aqar_criteria WHERE year_id = ? ORDER BY id ASC`,
        [yearId]
    );

    const pageRoutes = [];
    const pageLinks = [];

    for (const criteria of criteriaList) {
        const baseRoute = `/aqar/${yearId}/criteria/${criteria.id}`;
        const baseLabel = criteria.criteria_label.toUpperCase();

        // Get all documents under this criteria
        const documents = await query(
            `SELECT id, document_title FROM aqar_documents WHERE criteria_id = ? AND is_active = 1 AND is_deleted = 0 ORDER BY id ASC`,
            [criteria.id]
        );

        const routes = [baseRoute]; // main route first
        const links = [baseLabel];  // main label first

        // Add document routes/links if available
        if (documents.length > 0) {
            for (const doc of documents) {
                routes.push(`${baseRoute}/documents/${doc.id}`);
                links.push(doc.document_title);
            }
        }

        // Push for each criteria whether it has docs or not
        pageRoutes.push(routes);
        pageLinks.push(links);
    }

    return { pageRoutes, pageLinks };
}



// Controller: AQAR Year Details
exports.getAQARdetails = async (req, res, next) => {
    const yearId = req.params.id;
    try {
        const criteriaList = await query(`
            SELECT * FROM aqar_criteria WHERE year_id = ?
        `, [yearId]);

        const [yearLabel] = await query("SELECT * FROM aqar_years WHERE id = ?", [yearId]);

        const { pageRoutes, pageLinks } = await buildNestedMenu(yearId);

        res.render("aqar/aqardetails", {
            pageTitle: `${pageTitle} Details`,
            path: req.path,
            isAuthenticated: req.session.isLoggedIn,
            criteriaList,
            pageRoutes,
            pageLinks,
            sidebarHeading: `AQAR ${yearLabel.year_label}`
        });

    } catch (err) {
        console.error("Error fetching AQAR details:", err);
        res.status(500).send("Internal Server Error");
    }
};

// Controller: Single Criteria Details
exports.getSingleCriteria = async (req, res, next) => {
    const { yearId, criteriaId } = req.params;

    try {
        const [criteria] = await query(
            `SELECT * FROM aqar_criteria WHERE id = ? AND year_id = ?`,
            [criteriaId, yearId]
        );

        if (!criteria) {
            return res.status(404).send("Criteria not found.");
        }

        const [yearLabel] = await query(
            "SELECT year_label FROM aqar_years WHERE id = ?",
            [yearId]
        );

        const documents = await query(
            `SELECT * FROM aqar_documents WHERE criteria_id = ? AND is_active = 1 AND is_deleted = 0`,
            [criteriaId]
        );

        const { pageRoutes, pageLinks } = await buildNestedMenu(yearId);

      
        res.render("aqar/criteriadetails", {
            pageTitle: `${criteria.criteria_label} - AQAR ${yearLabel.year_label}`,
            path: req.path,
            isAuthenticated: req.session.isLoggedIn,
            criteria,
            documents,
            pageRoutes,
            pageLinks,
            sidebarHeading: `AQAR ${yearLabel.year_label}`
        });

    } catch (err) {
        console.error("Error fetching criteria detail:", err);
        res.status(500).send("Internal Server Error");
    }
};

// Controller: Single Document View
exports.getSingleDocument = async (req, res, next) => {
    const { documentId } = req.params;

    try {
        const [doc] = await query(`
            SELECT d.*, c.year_id, y.year_label
            FROM aqar_documents d
            JOIN aqar_criteria c ON d.criteria_id = c.id
            JOIN aqar_years y ON c.year_id = y.id
            WHERE d.id = ? AND d.is_active = 1 AND d.is_deleted = 0
        `, [documentId]);

        if (!doc) return res.status(404).send("Document not found");

        const yearId = doc.year_id;
        const yearLabel = doc.year_label;

        const { pageRoutes, pageLinks } = await buildNestedMenu(yearId);

        res.render("aqar/singledocument", {
            pageTitle: doc.document_title,
            path: req.path,
            isAuthenticated: req.session.isLoggedIn,
            document: doc,
            pageRoutes,
            pageLinks,
            sidebarHeading: `AQAR ${yearLabel}` 
        });
    } catch (err) {
        console.error("Error fetching document:", err);
        res.status(500).send("Internal Server Error");
    }
};

