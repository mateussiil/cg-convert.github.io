let table = [];
let reflexive = false;
keyW = false;
const hexadecimal = "0123456789abcdef";
const na = "3210";
let hexa = "0x";

(() => {
  for (let i = 0; i < 32; i++) {
    table.push([]);
    for (let j = 0; j < 4; j++) {
      table[i].push([]);
      for (let _ = 0; _ < 8; _++) {
        table[i][j].push(0);
      }
    }
  }
})();

const draw = document.getElementById("draw");
draw.style.gridTemplateColumns = `repeat(32, 1fr)`;
draw.style.gridTemplateRows = `repeat(32, 1fr)`;

window.onkeydown = (e) => {
  console.log(e.keyCode);
  if (e.keyCode === 87) {
    keyW = !keyW;
  }
  if (e.keyCode === 82) {
    reflexive = !reflexive;
  }
};

function activeRefletion(){
    reflexive=!reflexive;
}

for (let i = 0; i < 32 * 32; i++) {
  const div = document.createElement("div");
  div.setAttribute("id", i);
  div.style.borderLeft = `1px solid black`;
  div.style.borderBottom = `1px solid black`;
  div.style.height = `${20}px`;
  div.style.width = `${20}px`;
  div.onmouseenter = function (e) {
    if (keyW) {
      calculateCoordinate($(this).attr("id"));
      div.style.background = "#000000";
    }
  };
  div.onclick = function (e) {
    if (!keyW) {
      calculateCoordinate($(this).attr("id"));
      div.style.background = "#000000";
    }
  };
  draw.appendChild(div);
}

function calculateCoordinateReflex(id, linha, group, indice) {
  let div = document.getElementById(
    `${(linha + 1) * 32 - 1 - id + linha * 32}`
  );
  div.style.background = "#000000";
  return { nLinha: linha, nGroup: 3 - group, nIndice: 7 - indice };
}

function calculateCoordinate(id) {
  const linha = Math.floor(id / 32);
  const group = Math.floor(id / 8) % 4;
  const indice = id % 8;
  if (reflexive) {
    let { nLinha, nGroup, nIndice } = calculateCoordinateReflex(
      id,
      linha,
      group,
      indice
    );
    table[nLinha][nGroup][nIndice] = 1;
  }
  table[linha][group][indice] = 1;
}

function convertToHex() {
  let decimal = 0;
  let text = "";
  let copyTable = angular.copy(table);
  for (let linha = 0; linha < table.length; linha++) {
    for (let group = 0; group < table[linha].length; group++) {
      hexa = "0x";
      for (let i = 3; i >= 0; i--) {
        decimal += table[linha][group][i] * 2 ** na[i];
      }
      hexa += hexadecimal[decimal];
      decimal = 0;
      for (let i = 7; i >= 4; i--) {
        decimal += table[linha][group][i] * 2 ** na[i - 4];
      }

      hexa += hexadecimal[decimal];
      decimal = 0;
      text += hexa;
      text += ",";
      copyTable[linha][group] = hexa;
    }
    text += "\n";
  }
  saveDynamicDataToFile(text.slice(0, text.length - 1));
}

function saveDynamicDataToFile(text) {
  var file = new Blob([text], { type: "text/plain;charset=utf-8" });
  filename = "Glubyte.txt";
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}
