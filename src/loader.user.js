// ==UserScript==
// @name BC Wolf Girl (Loader)
// @namespace https://www.bondageprojects.com/
// @version 1.0
// @description Bondage Club Wolf Girl Roleplay Script Loader
// @author Saki Saotome
// @match bondageprojects.elementfx.com/*/BondageClub/*
// @match www.bondageprojects.elementfx.com/*/BondageClub/*
// @match bondage-europe.com/*/BondageClub/*
// @match www.bondage-europe.com/*/BondageClub/*
// @icon  https://dynilath.gitlab.io/SaotomeToyStore/favicon.ico
// @grant none
// @run-at document-end
// ==/UserScript==

(function () {
    "use strict";
    const src = `__DEPLOY_SITE__?v=${Date.now()}`;
    if (typeof BCWorlGirl_Loaded === "undefined") {
        const n = document.createElement("script");
        n.setAttribute("type", "text/javascript");
        n.setAttribute("src", src);
        n.setAttribute("id", "WolfGirlLoader");
        document.head.appendChild(n);
    }
})();
