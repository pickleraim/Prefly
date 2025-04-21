const form = document.getElementById("objetoForm");
const lista = document.getElementById("listaObjetos");
const mostrarMaisBtn = document.getElementById("mostrarMaisBtn");
let objetos = [];
let objetosExibidos = 20;  // Número de objetos exibidos inicialmente
const nomeAdm = "ANTONIO PICKLER MARCOS"; // Nome do administrador (você)
let objetosFiltrados = [];  // Armazena objetos filtrados pela pesquisa

// Função para carregar objetos do localStorage
function carregarObjetos() {
  objetos = JSON.parse(localStorage.getItem("objetosInuteis")) || [];
  objetosFiltrados = [...objetos];  // Inicializa a lista filtrada com todos os objetos
  atualizarContador();
  atualizarLista();
}

// Função para atualizar o contador de objetos
function atualizarContador() {
  const total = objetosFiltrados.length;
  const contadorTexto = document.getElementById("contadorObjetos");
  contadorTexto.innerText = `Objetos inúteis encontrados: ${total}`;
}

// Função para atualizar a lista de objetos na tela
function atualizarLista() {
  lista.innerHTML = "";
  const objetosParaExibir = objetosFiltrados.slice(0, objetosExibidos);

  objetosParaExibir.forEach((obj, index) => {
    const div = document.createElement("div");
    div.className = "objeto";

    const img = document.createElement("img");
    img.src = obj.imagem;
    img.alt = obj.nome;
    img.addEventListener("click", () => abrirDestaque(obj));

    const nome = document.createElement("h3");
    nome.innerText = obj.nome;

    const descricao = document.createElement("p");
    descricao.innerText = obj.descricao;

    const criador = document.createElement("p");
    criador.innerText = `Criado por: ${obj.criador}`;

    const excluirBtn = document.createElement("button");
    excluirBtn.innerText = "Excluir";
    excluirBtn.addEventListener("click", () => confirmarExclusao(index)); // Alteração aqui para chamar confirmarExclusao

    // Verifica se o usuário é o criador do objeto (simulando usuário logado)
    const usuarioLogado = nomeAdm; // Aqui você poderia integrar um sistema real de login
    if (obj.criador !== usuarioLogado) {
      excluirBtn.style.display = "none";  // Se não for o criador, esconde o botão
    }

    const curtirBtn = document.createElement("button");
    curtirBtn.innerText = obj.curtiu ? `Descurtir (${obj.curtidas || 0})` : `Curtir (${obj.curtidas || 0})`;
    curtirBtn.addEventListener("click", () => curtirOuDescurtirObjeto(index, curtirBtn));

    div.appendChild(nome);
    div.appendChild(descricao);
    div.appendChild(criador);
    div.appendChild(img);
    div.appendChild(excluirBtn);
    div.appendChild(curtirBtn);

    lista.appendChild(div);
  });

  // Verifica se deve exibir o botão "Mostrar Mais"
  if (objetosExibidos < objetosFiltrados.length) {
    mostrarMaisBtn.style.display = "block";
  } else {
    mostrarMaisBtn.style.display = "none";
  }
}

// Função para abrir o destaque de um objeto
function abrirDestaque(obj) {
  const destaque = document.getElementById("destaque");
  const titulo = document.getElementById("destaqueTitulo");
  const imagem = document.getElementById("destaqueImagem");
  const descricao = document.getElementById("destaqueDescricao");
  const criador = document.getElementById("destaqueCriador");

  titulo.innerText = obj.nome;
  imagem.src = obj.imagem;
  descricao.innerText = obj.descricao;
  criador.innerText = `Criado por: ${obj.criador}`;

  destaque.style.display = "flex";
}

// Função para fechar o destaque
function fecharDestaque() {
  document.getElementById("destaque").style.display = "none";
}

// Função para confirmar a exclusão de um objeto
function confirmarExclusao(index) {
  const confirmacao = window.confirm("Tem certeza de que deseja excluir este objeto?");
  if (confirmacao) {
    excluirObjeto(index);
  }
}

// Função para excluir objeto
function excluirObjeto(index) {
  objetos.splice(index, 1);
  localStorage.setItem("objetosInuteis", JSON.stringify(objetos));
  objetosFiltrados = [...objetos];  // Atualiza os objetos filtrados
  atualizarContador();
  atualizarLista();
}

// Função para curtir ou descurtir objeto
function curtirOuDescurtirObjeto(index, curtirBtn) {
  const obj = objetos[index];

  if (obj.curtiu) {
    // Se já curtiu, descurte
    obj.curtiu = false;
    obj.curtidas--;
  } else {
    // Se não curtiu, curte
    obj.curtiu = true;
    obj.curtidas++;
  }

  curtirBtn.innerText = obj.curtiu ? `Descurtir (${obj.curtidas})` : `Curtir (${obj.curtidas})`;
  localStorage.setItem("objetosInuteis", JSON.stringify(objetos));
  atualizarLista();
}

// Adiciona um novo objeto à lista
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const descricao = document.getElementById("descricao").value;
  const imagem = document.getElementById("imagem").value;

  const novoObjeto = {
    nome,
    descricao,
    imagem,
    criador: nomeAdm, // Aqui você poderia pegar o nome do usuário logado
    curtidas: 0,
    curtiu: false,
  };
  objetos.push(novoObjeto);

  localStorage.setItem("objetosInuteis", JSON.stringify(objetos));

  objetosFiltrados = [...objetos];  // Atualiza os objetos filtrados
  atualizarContador();
  atualizarLista();
  fecharModal();
});

// Função para abrir o modal
document.getElementById("abrirModalBtn").addEventListener("click", () => {
  document.getElementById("modal").style.display = "block";
});

// Função para fechar o modal
document.getElementById("fecharModalBtn").addEventListener("click", () => {
  fecharModal();
});

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

// Carrega os objetos ao iniciar
carregarObjetos();

// Mostrar mais objetos
mostrarMaisBtn.addEventListener("click", () => {
  objetosExibidos += 20;
  atualizarLista();
});

// Função de pesquisa
document.getElementById("pesquisa").addEventListener("input", (e) => {
  const pesquisa = e.target.value.toLowerCase();
  
  // Filtra os objetos conforme a pesquisa
  objetosFiltrados = objetos.filter(obj => 
    obj.nome.toLowerCase().includes(pesquisa) || 
    obj.descricao.toLowerCase().includes(pesquisa)
  );
  
  objetosExibidos = 5; // Resetar a quantidade de objetos exibidos
  atualizarContador();
  atualizarLista();
});

// Configurações do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  databaseURL: "https://SEU_DOMINIO.firebaseio.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializa o Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();


