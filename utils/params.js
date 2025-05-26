const params = (pageTitle, pagePath, pageLinks, pageRoutes) => {
  const fn = (title, path, banner, bannerTxt) => {
    return {
      pageTitle: title,
      sidebarHeading: pageTitle,
      path: `${pagePath}${path}`,
      bannerImg: banner,
      bannerText: bannerTxt,
      pageLinks: pageLinks,
      pageRoutes: pageRoutes
    };
  };

  return fn;
};

module.exports = params;
