import { elements } from "./html-elements.js";
import { jsonDatas } from "./json-read.js";

export function init() {
  console.info("========= HTML PAGE CONSTRUCT ==========");
  console.info("====== GENERATION DE LA PAGE HTML =========");
  //---- INITALISATION DU STYLE GLOBAL DE LA PAGE -----//
  document.body.style.background = jsonDatas.globalStyle.background || "white";
  if (jsonDatas.globalStyle.backgroundImg) {
    document.body.style.backgroundImage = `url(${
      "../images/" + jsonDatas.globalStyle.backgroundImg
    })`;
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
  }
  document.body.style.color = jsonDatas.globalStyle.textColor || "black";
  /// ------------------------- ///

  /// ---- FOOTER ---- ///
  if (jsonDatas.constants.copyright) {
    const copyright = document.getElementById("f-copyright");
    copyright.innerText = jsonDatas.constants.copyright;
  }

  const footerYear = document.getElementById("f-year");
  if (footerYear) {
    footerYear.innerText = new Date().getFullYear();
  }
  /// --------------------- ///

  //Récupération des sections sous forme clé/valeur
  const sections = Object.entries(jsonDatas.sections);

  /// --- GENERATION DU HEADER --- ///
  _generateHeader(sections);
  /// ---------------------------- ///

  // --- GENERATION DES SECTIONS --- //
  for (const section of sections) {
    _generateSection(section[0], section[1]);
  }
  console.info("====== FIN DE LA GENERATION =========");
}

/**
 * Génère le header en fonction des sections
 * @param {*} sections Sections renseignées dans le fichier de configuration
 */
function _generateHeader(sections) {
  //Fonction pour cacher la navbar en mode réduit
  const _hideNavbar = (navbar) => {
    navbar.classList.remove("burger-menu");
    navbar.style = null;
  };
  //Fonction pour afficher la navbar en mode réduit
  const _showNavbar = (navbar) => {
    navbar.classList.add("burger-menu");
    navbar.style.display = "block";
  };

  //Fonction pour afficher/cacher la navbar en mode réduit
  const _toggleNavbar = (navbar) => {
    if (navbar.style.display === "block") {
      _hideNavbar(navbar);
    } else {
      _showNavbar(navbar);
    }
  };

  const header = elements.header(); //Création d'un header
  const headerDiv = elements.div("header", ["header-content"]); //Création d'un container pour le contenu du header
  const headerNav = elements.div(null, ["header-nav"]); //Création d'un container pour le conenu de la nav bar

  //--- GENERATION DU NOM DU SITE ---//
  const headerNavTitle = elements.link(null, "#home", null, null, [
    "header-nav-title",
  ]);

  headerNavTitle.append(
    elements.div(
      null,
      ["title", "pacifico-regular"],
      jsonDatas.constants.title || ""
    ),
    elements.div(null, ["subtitle"], jsonDatas.constants.subtitle || "")
  );
  /// ---------------- //

  const nav = elements.nav("nav"); //Création d'une nav

  const burgerMenuIcon = elements.image(
    "burger",
    jsonDatas.constants.burgerMenuIcon,
    "30px"
  ); //Création d'un bouton pour le burger menu

  //Ajout d'un listener pour la manipulation du burger menu
  burgerMenuIcon.addEventListener("click", () => {
    _toggleNavbar(nav);
  });

  //Création de la liste d'éléments de navigation
  const navLinkList = elements.list(
    //Création de lien pour chaque section
    sections
      .map((section) => {
        if (!section[1]?.hideInHeader) {
          //Création d'un lien pour la section
          const link = elements.link(
            null,
            `#${section[0]}`,
            section[1]?.headerTitle
          );
          //Ajout d'un listener pour fermer le burger menu en mode réduit
          link.addEventListener("click", () => {
            _hideNavbar(nav);
          });
          return link;
        }
        return null;
      })
      .filter((links) => links != null) //Filtre des liens non créés
  );

  //Ajout des liens dans la nav
  nav.append(navLinkList);

  //Ajout d'un evenement au resize de la page pour cacher la navbar en mode réduit, si elle est ouverte
  window.addEventListener("resize", (event) => {
    _hideNavbar(nav);
  });

  //--- Ajouts des éléments dans le header --- ///
  headerNav.append(headerNavTitle, burgerMenuIcon, nav);
  headerDiv.append(headerNav);
  header.append(headerDiv);
  ///  -----------  ///

  //Ajout du header dans le body de la page
  document.body.append(header);
}

/**
 * Génère une section en fonction des data renseignées dans le fichier de configuration
 * @param {*} id identifiant de la section
 * @param {*} config données de configuration de la section
 */
function _generateSection(id, config) {
  const section = elements.section(id, config.background); //Génération de l'élément section

  const content = _generateSectionContent(id, config); //Génération du contenu de la section

  if (content) {
    section.append(content); //Ajout du contenu de la section à l'élément section
    console.log(
      "========= HTML PAGE CONSTRUCT ========== \n Section générée ->",
      id
    );

    //Ajout d'un séparateur si renseigné dans la config
    if (config.separator)
      document.body.append(elements.div(null, ["rounded-dashes"]));

    //Ajout de la section générée dans le body de la page
    document.body.append(section);
  } else {
    console.log(
      "========= HTML PAGE CONSTRUCT ========== \n Section non générée ->",
      id,
      "- Aucun contenu trouvé"
    );
  }
}
/**
 * Génère le contenu d'une section en fonction de la configuration renseignée
 * @param {*} id
 * @param {*} config
 * @returns
 */
function _generateSectionContent(id, config) {
  if (id && config) {
    //Génération de l'élément section content
    const sectionContent = elements.div(id + "-section-content", [
      "section-content",
    ]);

    const { title, subtitle, content, links } = config;

    if (title) sectionContent.append(elements.h1Title(title)); //Ajout d'un titre à la section

    if (subtitle) sectionContent.append(elements.h2Title(subtitle)); //Ajout d'un sous-titre à la section

    if (content) _generateElements(sectionContent, content); //Génère des éléments en fonction des variables définies dans la propriété `content`

    if (links) _replaceLinks(sectionContent, links); //Remplace tous les liens dans la section par les balises correspondantes

    _checkAndReplaceConstants(sectionContent); //Remplace toutes les variables dans le texte de la section par les valeurs correspontantes

    return sectionContent;
  }
  return null;
}

/**
 * Génère tous les éléments contenus dans un objet `content` dans un élément parent
 * @param {*} parent Parent où vont être générés tous les éléments
 * @param {*} content Objet de configuration du contenu à afficher dans l'élément parent
 * @returns L'élément parent avec son contenu généeé
 */
function _generateElements(parent, content) {
  const contentElements = Object.entries(content); //Récupère tous les éléments renseignés dans la propriété content

  for (const element of contentElements) {
    //L'élément est constitué en deux parties :
    //[0] -> Type d'élément à créer
    //[1] -> Le contenu à injecter dans l'élément à créer
    const createdElement = _generateElement(parent, element[0], element[1]);
    if (createdElement) {
      parent.append(createdElement); //Ajout de l'élément créé dans l'élément parent
    }
  }

  return parent;
}

/**
 * Génère un élément HTML
 * @param {*} parent Parent où l'élément va être généré
 * @param {*} rawType Type brute de l'élément
 * @param {*} content Contenu à injecter dans l'élément
 * @returns
 */
function _generateElement(parent, rawType, content) {
  const type = rawType.split("-")[0]; //Formattage du type brute pour n'en récupérer que le type pur

  if (type) {
    //Manipulation des éléments avec une propriété supplémentaire '.list'
    if (type.includes(".list")) {
      const elemType = type.split(".")[0]; //Récupération du type de l'élément à générer en liste
      const listType = type.split(".")[2]; //Récupération du type de liste à générer

      //Création d'un élément parent pour accueillir la liste
      const listParent = elements.div(null, [
        elemType + "-list",
        listType === "line" ? "container-line" : "container",
      ]);

      //Génération de chaque élément de la liste dans l'élément parent
      for (const item of content) {
        listParent.append(_generateElement(parent, elemType, item));
      }

      //La liste générée est retournée
      return listParent;
    }

    //Manipulation des éléments de type container
    if (type.includes("container")) {
      const containerType = type.split(".")[1]; //Récupération du type de container

      //Création d'un container pour accueillir le contenu
      const container = elements.div(null, [
        parent.id + "-container",
        containerType === "line" ? "container-line" : "container",
      ]);

      //Retourne le container généré avec le contenu renseigné
      return _generateElements(container, content);
    }

    //Manipulation des éléments de type formulaire
    if (type === "form") {
      const formContainer = elements.div(null, ["form-container", "container"]);
      const form = elements.form("");
      formContainer.append(_generateElements(form, content));

      return formContainer;
    }

    //Manipulation des éléments groupés dans un formulaire
    if (type === "group") {
      return _generateElements(elements.div(null, ["form-group"]), content);
    }

    //Manipulation des éléments de type input dans un formulaire
    if (type.includes("input")) {
      const inputType = type.split(".")[1];

      if (inputType === "textarea") return elements.textarea(content);

      return elements.input(inputType, content);
    }

    //Manipulation des éléments de type button dans un formulaire
    if (type.includes("button")) {
      const buttonType = type.split(".")[1];
      return elements.button(content, buttonType);
    }

    //Création d'éléments en fonction du type et du contenu
    return elements.create(type, content);
  }
}

/**
 * Remplace les identifiants de lien dans le innerHTML d'un élément par une balise link
 * @param {*} elem Element à traiter
 * @param {*} links Liens à remplacer dans l'élément
 */
function _replaceLinks(elem, links) {
  if (links && links.length > 0) {
    links.forEach((linkConfig) => {
      const { id, link, label, highlight } = linkConfig;
      const linkElem = elements.link(id, link, label, highlight);
      elem.innerHTML = elem.innerHTML.replace(
        new RegExp(`{${id}}`, "g"),
        linkElem.outerHTML
      );
    });
  }
}

/**
 * Remplace les valeurs des constantes dans le innerHTML d'un élément
 * @param {*} element Element à manipuler
 * @returns
 */
function _checkAndReplaceConstants(element) {
  let formattedInnerHtml = element.innerHTML;
  Object.entries(jsonDatas.constants).forEach((constant) => {
    const key = constant[0];
    const value = constant[1];
    if (value) {
      formattedInnerHtml = formattedInnerHtml.replace(
        new RegExp(`{${key}}`, "g"),
        value
      );
    }
  });
  element.innerHTML = formattedInnerHtml;
}
