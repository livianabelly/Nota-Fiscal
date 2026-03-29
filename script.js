const defaultItems = [
  ["Pelas Entranhas — Triz Parizotto",            "Maquinaria Editorial", 15,  42.90],
  ["Declínio de um Homem — Osamu Dazai",                   "Estação Liberdade",        12,  59.90],
  ["Noites Brancas — Fiódor Dostoiévsk", "Editora 34",               10,  74.90],
  ["Heaven Official's Blessing — Mo Xiang Tong Xiu",  "NewPOP",           18,  54.90],
  ["",                 "",  6,  29.90],
];

const tbody = document.getElementById("items-body");

defaultItems.forEach(function(item, i) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td style="color:rgba(255,255,255,.3);font-size:.72rem;padding:4px 6px">${String(i + 1).padStart(2, "0")}</td>
    <td><input id="d${i}" value="${item[0]}"></td>
    <td><input id="e${i}" value="${item[1]}" style="max-width:140px"></td>
    <td><input id="q${i}" type="number" value="${item[2]}" min="1" style="max-width:60px"></td>
    <td><input id="v${i}" type="number" value="${item[3].toFixed(2)}" step="0.01" min="0" style="max-width:100px"></td>
  `;
  tbody.appendChild(tr);
});

document.getElementById("f-data").value = new Date().toISOString().split("T")[0];

function fmt(n) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtDate(raw) {
  if (!raw) return "";
  const partes = raw.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

// ══════════════════════════════════════════
//   Função principal: gerar relatório
// ══════════════════════════════════════════
function gerar(pdf, print) {
  pdf   = pdf   || false;
  print = print || false;

  const n = defaultItems.length;

  document.getElementById("r-num").textContent  = document.getElementById("f-num").value;
  document.getElementById("r-cc").textContent   = document.getElementById("f-cc").value;
  document.getElementById("r-forn").textContent = document.getElementById("f-forn").value;
  document.getElementById("r-cnpj").textContent = document.getElementById("f-cnpj").value;
  document.getElementById("r-obs").textContent  = document.getElementById("f-obs").value;
  document.getElementById("r-sol").textContent  = document.getElementById("f-sol").value;
  document.getElementById("r-apr").textContent  = document.getElementById("f-apr").value;

  document.getElementById("r-data").textContent = fmtDate(document.getElementById("f-data").value);

  const agora = new Date();
  const horaFormatada =
    agora.toLocaleDateString("pt-BR") +
    " às " +
    agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  document.getElementById("r-now").textContent = horaFormatada;

  const rItems = document.getElementById("r-items");
  rItems.innerHTML = "";
  let total = 0;

  for (let i = 0; i < n; i++) {
    const desc = document.getElementById("d" + i).value || "-";
    const edit = document.getElementById("e" + i).value || "-";
    const qty  = parseFloat(document.getElementById("q" + i).value) || 0;
    const vun  = parseFloat(document.getElementById("v" + i).value) || 0;
    const vtot = qty * vun;
    total += vtot;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${String(i + 1).padStart(2, "0")}</td>
      <td>${desc}</td>
      <td>${edit}</td>
      <td>${qty}</td>
      <td>${fmt(vun)}</td>
      <td>${fmt(vtot)}</td>
    `;
    rItems.appendChild(tr);
  }

  document.getElementById("r-total").textContent = fmt(total);

  const rel = document.getElementById("relatorio");
  rel.style.visibility = "visible";
  rel.style.position   = "static";
  rel.style.left       = "0";
  rel.style.width      = "900px";
  rel.style.margin     = "0 auto";

  if (pdf) {
    const nomeArquivo = "pedido_compra_livros_" + document.getElementById("f-num").value + ".pdf";
    html2pdf()
      .set({
        margin: 0,
        filename: nomeArquivo,
        image:     { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF:     { unit: "mm", format: "a4", orientation: "portrait" }
      })
      .from(document.querySelector(".doc"))
      .save();
  }

  if (print) {
    window.print();
  }
}
