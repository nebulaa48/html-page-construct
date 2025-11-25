export const elements = {
  section: (id, background) => {
    const section = document.createElement("section");
    section.id = id;

    if (background) section.style.background = background;

    return section;
  },

  div: (id, classList, content) => {
    const div = document.createElement("div");

    if (id) div.id = id;
    if (classList) div.classList.add(...classList);
    if (content) div.append(content);

    return div;
  },

  span: (id, classList) => {
    const span = document.createElement("span");

    if (id) span.id = id;
    if (classList) span.classList.add(...classList);

    return span;
  },

  h1Title: (label) => {
    const title = document.createElement("h1");
    title.innerText = label;

    return title;
  },

  h2Title: (label) => {
    const subtitle = document.createElement("h2");
    subtitle.innerText = label;

    return subtitle;
  },

  h3Title: (label) => {
    const subtitle = document.createElement("h3");
    subtitle.innerText = label;

    return subtitle;
  },

  paragraph: (text, classList) => {
    const paragraph = document.createElement("p");
    paragraph.innerText = text;
    if (classList) paragraph.classList.add(...classList);

    return paragraph;
  },

  link: (id, href, label, highlight, classList) => {
    const link = document.createElement("a");
    link.classList.add("link");

    if (id) link.id = id;

    if (highlight) link.classList.add("highlight-text");

    if (classList && classList.length > 0) link.classList.add(...classList);

    if (href) {
      link.href = href;
      link.target = href[0] === "#" ? "" : "_blank";
    }

    link.innerText = label || "";

    return link;
  },
  linkImage: (id, href, label, imagePath, imageSize, classList) => {
    const link = elements.link(id, href);
    link.append(elements.image(id ? id+"-img" : null, imagePath, imageSize, label, classList));

    return link;
  },

  image: (id, path, size, alt, classList) => {
    const img = document.createElement("img");
    img.id = id || "";
    img.src = "../images/" + path;
    img.style.height = size;
    img.style.width = size;
    img.alt = alt;
    if (classList) img.classList.add(...classList);

    return img;
  },

  separator: (type) => {
    const separator = document.createElement("div");
    separator.classList.add(type ? [type] : "separator");

    return separator;
  },

  form: (action) => {
    const form = document.createElement("form");
    form.action = action;

    return form;
  },

  input: (type, placeholder) => {
    const input = document.createElement("input");
    input.type = type;
    input.placeholder = placeholder;

    return input;
  },

  textarea: (placeholder) => {
    const textarea = document.createElement("textarea");
    textarea.placeholder = placeholder;

    return textarea;
  },

  button: (label, type) => {
    const button = document.createElement("button");
    button.innerText = label;
    if (type) button.type = type;
    return button;
  },

  widget: (id, src) => {
    const iframe = document.createElement("iframe");

    iframe.id = id;
    iframe.src = src;

    iframe.style.border = "none";

    iframe.allowTransparency = true;
    iframe.onload = window.addEventListener("message", function (e) {
      const dataHeight = e.data.height;
      const haWidgetElement = document.getElementById(id);
      haWidgetElement.height = dataHeight + "px";
    });

    return iframe;
  },

  list: (items, classList) => {
    const ul = document.createElement("ul");

    if (classList) ul.classList.add(...classList);

    items.forEach((item) => {
      const li = document.createElement("li");
      li.append(item);
      ul.append(li);
    });
    return ul;
  },

  card: (title, text, icon, width) => {
    const card = elements.div(null, ["card"]);

    if (width) card.style.width = width;

    if (icon) card.append(elements.image(null, "icons/" + icon, "60px"));

    card.append(
      elements.h2Title(title),
      elements.separator(),
      elements.paragraph(text)
    );

    return card;
  },
  header: (id, classList) => {
    const header = document.createElement("header");

    if (id) header.id = id;

    if (classList) header.classList.add(...classList);

    return header;
  },
  nav: (id, classList) => {
    const nav = document.createElement("nav");

    if (id) nav.id = id;

    if (classList) nav.classList.add(...classList);

    return nav;
  },
  create: (type, content) => {
    switch (type) {
      //Création de paragraphe
      case "paragraph":
        return elements.paragraph(
          content.text,
          content.textStyle?.split(" ") || []
        );
      //Création d'un séparateur
      case "separator":
        return elements.separator(content);

      //Création d'une card
      case "card":
        return elements.card(
          content.title,
          content.text,
          content.icon,
          content.width
        );
      //Création d'un lien bouton
      case "linkBtn":
        return elements.link(
          null,
          content.link,
          content.label,
          content.highlight,
          ["link-btn"]
        );
      //Création d'un lien image
      case "linkImg":
        return elements.linkImage(
          null,
          content.link,
          content.label,
          content.image,
          content.size
        );
      //Création d'une liste
      case "list":
        return elements.list(
          content.items,
          content.textStyle?.split(" ") || []
        );
      //Création d'un titre h2
      case "subtitle.h2":
        return elements.h2Title(content);
      //Création d'un titre h3
      case "subtitle.h3":
        return elements.h3Title(content);
      //Création d'un widget
      case "widget":
        return elements.widget(content.id, content.src);
      //Si aucun élément n'a été trouvé avec le type indiqué, création d'une div vide avec comme class le type renseigné
      default:
        return elements.div(null, [type]);
    }
  },
};
