export const jsonDatas = {
  constants: (await _read("../constants.json")) || {},
  globalStyle: (await _read("../global-style.json")) || {},
  sections: (await _read("../sections.json")) || {},
};

async function _read(path) {
  try {
    const jsonResponse = await fetch(path);
    const data = await jsonResponse.json();
    return data;
  } catch (e) {
    console.error(
      "========= HTML PAGE CONSTRUCT ========== \n Fichier JSON non trouvé..."
    );
  }
}
