// ==UserScript==
// @name BC Wolf Girl (Loader)
// @namespace https://www.bondageprojects.com/
// @version 1.6
// @description Bondage Club Wolf Girl Roleplay Script
// @author Saki Saotome, lyudmila
// @include /^https?:\/\/(www\.)?(bondageprojects\.elementfx|bondage-europe)\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @icon  https://dynilath.gitlab.io/SaotomeToyStore/favicon.ico
// @grant none
// @run-at document-end
// ==/UserScript==

(function () {
    "use strict";
    const src = `http://localhost:3042/WolfGirl/main.js?v=${Date.now()}`;
    if (typeof BCWolfGirl_Loaded === "undefined") {
        const script = document.createElement("script");
        script.src = src;
        script.type = "text/javascript";
        script.crossOrigin = "anonymous";
        script.id = "WolfGirlLoader";
        document.head.appendChild(script);
    }
})();