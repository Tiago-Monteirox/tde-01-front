const CRUDCRUD_BASE_URL =
  "https://crudcrud.com/api/5b98a027ad6c402d92dcd6fe0cdb64e7";

const ESTUDANTES_URL = `${CRUDCRUD_BASE_URL}/estudantes`;

const form = document.querySelector("#student-form");
const formTitle = document.querySelector("#form-title");
const studentId = document.querySelector("#student-id");
const saveButton = document.querySelector("#save-button");
const cancelButton = document.querySelector("#cancel-button");
const refreshButton = document.querySelector("#refresh-button");
const message = document.querySelector("#message");
const studentsBody = document.querySelector("#students-body");
const cepInput = document.querySelector("#cep");

let estudantes = [];

/**
 * Exibe uma mensagem de feedback para o usuário.
 *
 * @param {string} texto Texto que será exibido.
 * @param {"info"|"success"|"error"} [tipo="info"] Tipo visual da mensagem.
 * @returns {void}
 */
function mostrarMensagem(texto, tipo = "info") {
  message.textContent = texto;
  message.dataset.type = tipo;
  message.hidden = false;
}

/**
 * Remove caracteres não numéricos e limita o CEP a oito dígitos.
 *
 * @param {string} valor Valor original do campo.
 * @returns {string} CEP contendo somente números.
 */
function normalizarCep(valor) {
  return String(valor).replace(/\D/g, "").slice(0, 8);
}

/**
 * Aplica o formato brasileiro ao CEP.
 *
 * @param {string} valor CEP sem formatação ou já formatado.
 * @returns {string} CEP no formato 00000-000.
 */
function formatarCep(valor) {
  const cep = normalizarCep(valor);

  if (cep.length > 5) {
    return `${cep.slice(0, 5)}-${cep.slice(5)}`;
  }

  return cep;
}

/**
 * Limpa os campos de endereço preenchidos pelo ViaCEP.
 *
 * @returns {void}
 */
function limparEndereco() {
  document.querySelector("#rua").value = "";
  document.querySelector("#bairro").value = "";
  document.querySelector("#cidade").value = "";
  document.querySelector("#estado").value = "";
}

/**
 * Consulta o ViaCEP e preenche os campos de endereço.
 *
 * @returns {Promise<void>}
 */
async function buscarEnderecoPorCep() {
  const cep = normalizarCep(cepInput.value);

  cepInput.value = formatarCep(cep);

  if (!cep) {
    return;
  }

  if (cep.length !== 8) {
    mostrarMensagem("Digite um CEP válido com 8 números.", "error");
    return;
  }

  try {
    mostrarMensagem("Consultando o endereço...", "info");

    const response = await fetch(
      `https://viacep.com.br/ws/${cep}/json/`
    );

    if (!response.ok) {
      throw new Error("Não foi possível consultar o CEP.");
    }

    const endereco = await response.json();

    if (endereco.erro) {
      throw new Error("CEP não encontrado.");
    }

    document.querySelector("#rua").value = endereco.logradouro || "";
    document.querySelector("#bairro").value = endereco.bairro || "";
    document.querySelector("#cidade").value = endereco.localidade || "";
    document.querySelector("#estado").value = endereco.uf || "";

    mostrarMensagem("Endereço preenchido automaticamente.", "success");
  } catch (error) {
    limparEndereco();
    mostrarMensagem(error.message, "error");
  }
}

/**
 * Obtém o valor textual de um campo do formulário.
 *
 * @param {string} id Identificador do elemento HTML.
 * @returns {string} Valor sem espaços nas extremidades.
 */
function obterValor(id) {
  return document.querySelector(`#${id}`).value.trim();
}

/**
 * Monta o objeto de estudante a partir dos dados do formulário.
 *
 * @returns {Object} Dados do estudante e seu endereço.
 */
function montarEstudante() {
  return {
    nome: obterValor("nome"),
    email: obterValor("email"),
    telefone: obterValor("telefone"),
    dataNascimento: obterValor("data-nascimento"),
    endereco: {
      cep: normalizarCep(obterValor("cep")),
      rua: obterValor("rua"),
      numero: obterValor("numero"),
      complemento: obterValor("complemento"),
      bairro: obterValor("bairro"),
      cidade: obterValor("cidade"),
      estado: obterValor("estado").toUpperCase()
    }
  };
}

/**
 * Executa uma requisição HTTP para a API CRUDCRUD.
 *
 * @param {string} url URL da requisição.
 * @param {RequestInit} [options={}] Opções do fetch.
 * @returns {Promise<unknown>} Dados retornados pela API.
 */
async function requisicaoApi(url, options = {}) {
  if (CRUDCRUD_BASE_URL.includes("COLE_SEU_ID_AQUI")) {
    throw new Error(
      "Configure o endpoint do CRUDCRUD no arquivo script.js."
    );
  }

  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const detalhe = await response.text();

    throw new Error(
      `Erro na API: ${response.status}${detalhe ? ` - ${detalhe}` : ""}`
    );
  }

  if (response.status === 204) {
    return null;
  }

  const texto = await response.text();
  return texto ? JSON.parse(texto) : null;
}

/**
 * Escapa caracteres especiais antes de inserir texto no HTML.
 *
 * @param {*} valor Valor que será convertido para texto.
 * @returns {string} Texto seguro para uso em HTML.
 */
function escaparHtml(valor) {
  const mapa = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };

  return String(valor ?? "").replace(/[&<>"']/g, caractere => mapa[caractere]);
}

/**
 * Constrói uma descrição legível para um endereço.
 *
 * @param {Object} [endereco={}] Dados do endereço.
 * @returns {string} Endereço formatado.
 */
function formatarEndereco(endereco = {}) {
  const partes = [
    endereco.rua,
    endereco.numero ? `nº ${endereco.numero}` : "",
    endereco.complemento,
    endereco.bairro
  ].filter(Boolean);

  return partes.length > 0 ? partes.join(", ") : "-";
}

/**
 * Renderiza os estudantes armazenados na tabela.
 *
 * @returns {void}
 */
function renderizarEstudantes() {
  if (estudantes.length === 0) {
    studentsBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-cell">
          Nenhum estudante cadastrado.
        </td>
      </tr>
    `;
    return;
  }

  studentsBody.innerHTML = estudantes.map(estudante => {
    const endereco = estudante.endereco || {};

    return `
      <tr>
        <td>${escaparHtml(estudante.nome)}</td>
        <td>${escaparHtml(estudante.email)}</td>
        <td>${escaparHtml(estudante.telefone || "-")}</td>
        <td>${escaparHtml(formatarEndereco(endereco))}</td>
        <td>
          ${escaparHtml(endereco.cidade || "-")}
          /
          ${escaparHtml(endereco.estado || "-")}
        </td>
        <td>
          <div class="actions">
            <button
              type="button"
              class="secondary"
              data-action="edit"
              data-id="${escaparHtml(estudante._id)}"
            >
              Editar
            </button>

            <button
              type="button"
              class="danger"
              data-action="delete"
              data-id="${escaparHtml(estudante._id)}"
            >
              Excluir
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

/**
 * Busca os estudantes no CRUDCRUD e atualiza a tabela.
 *
 * @returns {Promise<void>}
 */
async function carregarEstudantes() {
  studentsBody.innerHTML = `
    <tr>
      <td colspan="6" class="empty-cell">Carregando...</td>
    </tr>
  `;

  try {
    estudantes = await requisicaoApi(ESTUDANTES_URL);
    renderizarEstudantes();
  } catch (error) {
    studentsBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-cell">
          Não foi possível carregar os estudantes.
        </td>
      </tr>
    `;

    mostrarMensagem(error.message, "error");
  }
}

/**
 * Preenche o formulário com os dados de um estudante para edição.
 *
 * @param {Object} estudante Estudante que será editado.
 * @returns {void}
 */
function preencherFormulario(estudante) {
  const endereco = estudante.endereco || {};

  studentId.value = estudante._id || "";
  document.querySelector("#nome").value = estudante.nome || "";
  document.querySelector("#email").value = estudante.email || "";
  document.querySelector("#telefone").value = estudante.telefone || "";
  document.querySelector("#data-nascimento").value =
    estudante.dataNascimento || "";

  document.querySelector("#cep").value =
    formatarCep(endereco.cep || "");
  document.querySelector("#rua").value = endereco.rua || "";
  document.querySelector("#numero").value = endereco.numero || "";
  document.querySelector("#complemento").value =
    endereco.complemento || "";
  document.querySelector("#bairro").value = endereco.bairro || "";
  document.querySelector("#cidade").value = endereco.cidade || "";
  document.querySelector("#estado").value = endereco.estado || "";

  formTitle.textContent = "Editar estudante";
  saveButton.textContent = "Atualizar estudante";
  cancelButton.hidden = false;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/**
 * Limpa o formulário e retorna o modo para novo cadastro.
 *
 * @returns {void}
 */
function prepararNovoCadastro() {
  form.reset();
  studentId.value = "";

  formTitle.textContent = "Novo estudante";
  saveButton.textContent = "Salvar estudante";
  cancelButton.hidden = true;
}

/**
 * Salva um novo estudante ou atualiza um estudante existente.
 *
 * @param {SubmitEvent} event Evento de envio do formulário.
 * @returns {Promise<void>}
 */
async function salvarEstudante(event) {
  event.preventDefault();

  const id = studentId.value;
  const editando = Boolean(id);
  const estudante = montarEstudante();

  saveButton.disabled = true;
  saveButton.textContent = editando ? "Atualizando..." : "Salvando...";

  try {
    const url = editando
      ? `${ESTUDANTES_URL}/${encodeURIComponent(id)}`
      : ESTUDANTES_URL;

    await requisicaoApi(url, {
      method: editando ? "PUT" : "POST",
      body: JSON.stringify(estudante)
    });

    mostrarMensagem(
      editando
        ? "Estudante atualizado com sucesso."
        : "Estudante cadastrado com sucesso.",
      "success"
    );

    prepararNovoCadastro();
    await carregarEstudantes();
  } catch (error) {
    mostrarMensagem(error.message, "error");
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = studentId.value
      ? "Atualizar estudante"
      : "Salvar estudante";
  }
}

/**
 * Exclui um estudante após confirmação do usuário.
 *
 * @param {string} id Identificador do estudante no CRUDCRUD.
 * @returns {Promise<void>}
 */
async function excluirEstudante(id) {
  const estudante = estudantes.find(item => item._id === id);

  if (!estudante) {
    return;
  }

  const confirmou = window.confirm(
    `Deseja excluir o estudante "${estudante.nome}"?`
  );

  if (!confirmou) {
    return;
  }

  try {
    await requisicaoApi(
      `${ESTUDANTES_URL}/${encodeURIComponent(id)}`,
      {
        method: "DELETE"
      }
    );

    mostrarMensagem("Estudante excluído com sucesso.", "success");
    await carregarEstudantes();
  } catch (error) {
    mostrarMensagem(error.message, "error");
  }
}

/**
 * Trata os cliques nos botões de editar e excluir da tabela.
 *
 * @param {MouseEvent} event Evento de clique na tabela.
 * @returns {void}
 */
function tratarAcaoDaTabela(event) {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  const { action, id } = button.dataset;

  if (action === "edit") {
    const estudante = estudantes.find(item => item._id === id);

    if (estudante) {
      preencherFormulario(estudante);
    }
  }

  if (action === "delete") {
    excluirEstudante(id);
  }
}

cepInput.addEventListener("input", event => {
  // Durante a digitação, mantém somente os números para não mover o cursor.
  event.target.value = normalizarCep(event.target.value);
});

cepInput.addEventListener("blur", buscarEnderecoPorCep);

form.addEventListener("submit", salvarEstudante);

cancelButton.addEventListener("click", () => {
  prepararNovoCadastro();
  mostrarMensagem("Edição cancelada.", "info");
});

refreshButton.addEventListener("click", carregarEstudantes);

studentsBody.addEventListener("click", tratarAcaoDaTabela);

carregarEstudantes();
