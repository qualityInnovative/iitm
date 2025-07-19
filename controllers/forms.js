const pageTitle = "About";
const pagePath = "/about";

const query = require("../utils/db");
const validator = require('validator');
exports.postContactUs = (req, res, next) => {
  const name = req.body.name || null;
  const phone = req.body.phone || null;
  const email = req.body.email || null;
  const message = req.body.message || null;

  const insertQuery =
    "INSERT INTO contactUs (name, phone, email, message) VALUES (?, ?, ?, ?)";

  query(insertQuery, [name, phone, email, message])
    .then(() => {
      res.redirect(`/about/contact-us?submitted=true`);
    })
    .catch((err) => {
      console.log(err);
      res.redirect(`/about/contact-us?error=true`);
    });
};

exports.postFeedback = (req, res, next) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const provider = req.body.provider;
  const feedback = req.body.feedback;

  let insertQuery;
  let insertParams;

  // Flag to keep track if user is authenticated or not.
  let flag = 1;

  const promises = [];

  if (provider == "student" || provider == "parent") {
    const studentId = req.body.studentId;

    // Store the promise in variable and push it into the promises array.
    const queryPromise = query(
      "SELECT studentId FROM studentsDatabase WHERE studentId = ?",
      [studentId]
    ).then((result) => {
      if (result.length < 1) {
        res.redirect(`/about/feedback?error=NAuth`);
        flag = 0;
      } else {
        insertQuery =
          "INSERT INTO feedbacks (provider, name, phone, email, feedback, studentId) VALUES (?, ?, ?, ?, ?, ?)";
        insertParams = [provider, name, phone, email, feedback, studentId];
      }
    });
    promises.push(queryPromise);
  } else if (provider == "faculty") {
    const empId = req.body.empId;

    // Store the promise in variable and push it into the promises array.
    const queryPromise = query(
      "SELECT eid FROM employees WHERE eid = ? UNION SELECT eid FROM teachingFaculty WHERE eid = ?",
      [empId, empId]
    ).then((result) => {
      if (result.length < 1) {
        res.redirect(`/about/feedback?error=NAuth`);
        flag = 0;
      } else {
        insertQuery =
          "INSERT INTO feedbacks (provider, name, phone, email, feedback, empId) VALUES (?, ?, ?, ?, ?, ?)";
        insertParams = [provider, name, phone, email, feedback, empId];
      }
    });
    promises.push(queryPromise);
  } else if (provider == "alumni") {
    const studentId = req.body.studentId;
    const occupation = req.body.occupation;

    // Store the promise in variable and push it into the promises array.
    const queryPromise = query(
      "SELECT studentId FROM studentsDatabase WHERE studentId = ?",
      [studentId]
    ).then((result) => {
      if (result.length < 1) {
        res.redirect(`/about/feedback?error=NAuth`);
        flag = 0;
      } else {
        insertQuery =
          "INSERT INTO feedbacks (provider, name, phone, email, feedback, studentId, occupation) VALUES (?, ?, ?, ?, ?, ?, ?)";
        insertParams = [
          provider,
          name,
          phone,
          email,
          feedback,
          studentId,
          occupation,
        ];
      }
    });

    promises.push(queryPromise);
  } else if (provider == "employer") {
    const studentId = req.body.studentId;
    const company = req.body.company;

    // Store the promise in variable and push it into the promises array.
    const queryPromise = query(
      "SELECT studentId FROM studentsDatabase WHERE studentId = ?",
      [studentId]
    ).then((result) => {
      if (result.length < 1) {
        res.redirect(`/about/feedback?error=NAuth`);
        flag = 0;
      } else {
        insertQuery =
          "INSERT INTO feedbacks (provider, name, phone, email, feedback, studentId, company) VALUES (?, ?, ?, ?, ?, ?, ?)";
        insertParams = [
          provider,
          name,
          phone,
          email,
          feedback,
          studentId,
          company,
        ];
      }
    });

    promises.push(queryPromise);
  }

  // Resolve all promises
  Promise.all(promises)
    .then(() => {
      // If flag is set to 1. i.e., if user is authenticated then submit the feedback. Else the submitter is already redirected back with error in one of the query promises
      if (flag) {
        query(insertQuery, insertParams)
          .then(() => {
            res.redirect(`/about/feedback?submitted=true`);
          })
          .catch((err) => {
            console.log(err);
            res.redirect(`/about/feedback?error=swr`);
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect(`/about/feedback?error=swr`);
    });
};

exports.postGrievance = (req, res, next) => {
  const submitter = req.body.submitter || null;
  const name = req.body.name || null;
  const phone = req.body.phone || null;
  const email = req.body.email || null;
  const grievance = req.body.grievance || null;

  let insertQuery;
  let insertParams;
  let flag = 1;
  const promises = [];

  // Store the promise in variable and push it into the promises array.
  if (submitter == "student") {
    const studentId = req.body.studentId || null;

    const queryPromise = query(
      "SELECT studentId FROM studentsDatabase WHERE studentId = ?",
      [studentId]
    ).then((result) => {
      if (result.length < 1) {
        res.redirect(`/about/grievance?error=NAuth`);
        flag = 0;
      } else {
        insertQuery =
          "INSERT INTO grievances (submitter, name, phone, email, grievance, studentId) VALUES (?, ?, ?, ?, ?, ?)";
        insertParams = [submitter, name, phone, email, grievance, studentId];
      }
    });

    promises.push(queryPromise);
  } else if (submitter == "faculty") {
    // Store the promise in variable and push it into the promises array.
    const empId = req.body.empId || null;

    const queryPromise = query(
      "SELECT eid FROM employees WHERE eid = ? UNION SELECT eid FROM teachingFaculty WHERE eid=?",
      [empId, empId]
    ).then((result) => {
      if (result.length < 1) {
        res.redirect(`/about/grievance?error=NAuth`);
        flag = 0;
      } else {
        insertQuery =
          "INSERT INTO grievances (submitter, name, phone, email, grievance, empId) VALUES (?, ?, ?, ?, ?, ?)";
        insertParams = [submitter, name, phone, email, grievance, empId];
      }
    });

    promises.push(queryPromise);
  }

  Promise.all(promises)
    .then(() => {
      if (flag) {
        // If flag is set to 1. i.e., if user is authenticated then submit the feedback. Else the submitter is already redirected back with error in one of the query promises.
        query(insertQuery, insertParams)
          .then(() => {
            res.redirect(`/about/grievance?submitted=true`);
          })
          .catch((err) => {
            console.log(err);
            res.redirect(`/about/grievance?error=swr`);
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect(`/about/feedback?error=swr`);
    });
};

exports.postNewAdmission = (req, res, next) => {
  const name = req.body.name || null;
  const parentage = req.body.parentage || "";
  const address = req.body.address || "";
  const qualification = req.body.qualification || null;
  const phone = req.body.phone || null;
  const email = req.body.email || null;
  const interestedIn = req.body.interestedIn || null;
  const applicationNo = req.body.applicationNo || null;
  const remark = req.body.remark || null;

  const insertQuery =
    "INSERT INTO newAdmissions (name, parentage, address, qualification, phone, email, interestedIn, applicationNo, remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    if (!name || !qualification || !phone || !email) {
      // Required fields missing
      return res.redirect('/admissions/new-admission?error=missing_required_fields');
    }
  
    if (!validator.isEmail(email)) {
      // Invalid email format
      return res.redirect('/admissions/new-admission?error=invalid_email');
    }
  
    
  query(insertQuery, [
    name,
    parentage,
    address,
    qualification,
    phone,
    email,
    interestedIn,
    applicationNo,
    remark,
  ])
    .then(() => {
      res.redirect(`/admissions/new-admission?submitted=true`);
    })
    .catch((err) => {
      console.log(err);
      res.redirect(`/admissions/new-admission?error=true`);
    });
};
