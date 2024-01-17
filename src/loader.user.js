// ==UserScript==
// @name Bondage Club Suitcase Harvester Loader
// @namespace https://www.bondageprojects.com/
// @version 1.0
// @description Bondage Club Suitcase Harvester
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
    const src = `https://dynilath.gitlab.io/SaotomeToyStoreVendor/WolfGirl/main.js?v=${Date.now()}`;
    const loadScript = (url, okay, failed) => fetch(url).then(r => {if(r.ok) return r.text();
        else throw new Error("Failed to load script")} ).then(okay).catch(() => { setTimeout(() => {failed(url, okay, failed)}, 15000); });
    loadScript(src, text => {if (typeof BCWorlGril_Loaded === "undefined") eval(text);}, loadScript);
})();
