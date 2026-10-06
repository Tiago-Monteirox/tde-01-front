# CRUD de Estudantes

Aplicação front-end em HTML, CSS e JavaScript para:

- cadastrar estudantes;
- consultar endereço automaticamente pelo CEP usando o ViaCEP;
- salvar os dados no CRUDCRUD;
- listar estudantes cadastrados;
- editar estudantes;
- excluir estudantes.

## Estrutura do projeto

```text
tde-01-front/
├── index.html
├── style.css
├── script.js
└── GUIA-CRUD-ESTUDANTES.md
```

## 1. Arquivo `index.html`

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cadastro de Estudantes</title>

  <link rel="stylesheet" href="style.css">
  <script src="script.js" defer></script>
</head>
<body>
  <main class="container">
    <header class="page-header">
      <div>
        <p class="eyebrow">CRUD de estudantes</p>
        <h1>Cadastro de estudantes</h1>
        <p>Preencha os dados e informe o CEP para completar o endereço automaticamente.</p>
      </div>
    </header>

    <section class="card">
      <h2 id="form-title">Novo estudante</h2>

      <form id="student-form" autocomplete="off">
        <input type="hidden" id="student-id">

        <div class="form-grid">
          <div class="field field-full">
            <label for="nome">Nome completo *</label>
            <input type="text" id="nome" required>
          </div>

          <div class="field">
            <label for="email">E-mail *</label>
            <input type="email" id="email" required>
          </div>

          <div class="field">
            <label for="telefone">Telefone</label>
            <input type="tel" id="telefone">
          </div>

          <div class="field">
            <label for="data-nascimento">Data de nascimento</label>
            <input type="date" id="data-nascimento">
          </div>
        </div>

        <fieldset>
          <legend>Endereço</legend>

          <div class="form-grid">
            <div class="field">
              <label for="cep">CEP *</label>
              <input
                type="text"
                id="cep"
                name="student-cep"
                placeholder="00000-000"
                maxlength="9"
                inputmode="numeric"
                autocomplete="new-password"
                required
              >
              <small>Ao sair do campo, o endereço será consultado.</small>
            </div>

            <div class="field field-large">
              <label for="rua">Rua</label>
              <input type="text" id="rua">
            </div>

            <div class="field">
              <label for="numero">Número *</label>
              <input type="text" id="numero" required>
            </div>

            <div class="field">
              <label for="complemento">Complemento</label>
              <input type="text" id="complemento">
            </div>

            <div class="field">
              <label for="bairro">Bairro</label>
              <input type="text" id="bairro">
            </div>

            <div class="field">
              <label for="cidade">Cidade</label>
              <input type="text" id="cidade">
            </div>

            <div class="field">
              <label for="estado">Estado/UF</label>
              <input type="text" id="estado" maxlength="2">
            </div>
          </div>
        </fieldset>

        <div class="form-actions">
          <button type="submit" id="save-button">Salvar estudante</button>
          <button type="button" id="cancel-button" class="secondary" hidden>
            Cancelar edição
          </button>
        </div>
      </form>

      <div id="message" class="message" role="status" aria-live="polite" hidden></div>
    </section>

    <section class="card">
      <div class="list-header">
        <div>
          <p class="eyebrow">Consulta</p>
          <h2>Estudantes cadastrados</h2>
        </div>

        <button type="button" id="refresh-button" class="secondary">
          Atualizar lista
        </button>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Endereço</th>
              <th>Cidade/UF</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody id="students-body">
            <tr>
              <td colspan="6" class="empty-cell">Carregando...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</body>
</html>
```

## 2. Arquivo `style.css`

```css
* {
  box-sizing: border-box;
}

:root {
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --background: #f1f5f9;
  --surface: #ffffff;
  --text: #1e293b;
  --muted: #64748b;
  --border: #cbd5e1;
  --danger: #dc2626;
  --success-background: #dcfce7;
  --success-text: #166534;
  --error-background: #fee2e2;
  --error-text: #991b1b;
}

body {
  margin: 0;
  background: var(--background);
  color: var(--text);
  font-family: Arial, Helvetica, sans-serif;
}

.container {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 40px 0;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1,
.card h2 {
  margin: 0 0 8px;
}

.page-header p,
.list-header p {
  color: var(--muted);
}

.eyebrow {
  margin: 0 0 6px !important;
  color: var(--primary) !important;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.card {
  margin-bottom: 24px;
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-full {
  grid-column: 1 / -1;
}

.field-large {
  grid-column: span 2;
}

label,
legend {
  font-weight: bold;
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 11px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font: inherit;
}

input:focus {
  outline: 2px solid rgba(37, 99, 235, 0.25);
  border-color: var(--primary);
}

small {
  color: var(--muted);
}

fieldset {
  margin: 24px 0 0;
  padding: 0;
  border: 0;
}

fieldset legend {
  margin-bottom: 8px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

button {
  padding: 11px 16px;
  border: 0;
  border-radius: 8px;
  background: var(--primary);
  color: white;
  cursor: pointer;
  font: inherit;
  font-weight: bold;
}

button:hover {
  background: var(--primary-dark);
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

button.secondary {
  background: #e2e8f0;
  color: var(--text);
}

button.secondary:hover {
  background: #cbd5e1;
}

button.danger {
  background: var(--danger);
}

.message {
  margin-top: 20px;
  padding: 12px 14px;
  border-radius: 8px;
  font-weight: bold;
}

.message[data-type="success"] {
  background: var(--success-background);
  color: var(--success-text);
}

.message[data-type="error"] {
  background: var(--error-background);
  color: var(--error-text);
}

.message[data-type="info"] {
  background: #e0f2fe;
  color: #075985;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 850px;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid var(--border);
  text-align: left;
  vertical-align: top;
}

th {
  background: #f8fafc;
  font-size: 0.85rem;
}

.actions {
  display: flex;
  gap: 8px;
}

.actions button {
  padding: 8px 10px;
  font-size: 0.85rem;
}

.empty-cell {
  padding: 24px;
  color: var(--muted);
  text-align: center;
}

@media (max-width: 700px) {
  .container {
    width: min(100% - 20px, 1180px);
    padding: 20px 0;
  }

  .card {
    padding: 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .field-full,
  .field-large {
    grid-column: auto;
  }

  .list-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column;
  }

  button {
    width: 100%;
  }
}
```

## 3. Arquivo `script.js`

```javascript
const CRUDCRUD_BASE_URL =
  "https://crudcrud.com/api/COLE_SEU_ID_AQUI";

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

function mostrarMensagem(texto, tipo = "info") {
  message.textContent = texto;
  message.dataset.type = tipo;
  message.hidden = false;
}

function normalizarCep(valor) {
  return String(valor).replace(/\D/g, "").slice(0, 8);
}

function formatarCep(valor) {
  const cep = normalizarCep(valor);

  if (cep.length > 5) {
    return `${cep.slice(0, 5)}-${cep.slice(5)}`;
  }

  return cep;
}

function limparEndereco() {
  document.querySelector("#rua").value = "";
  document.querySelector("#bairro").value = "";
  document.querySelector("#cidade").value = "";
  document.querySelector("#estado").value = "";
}

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

function obterValor(id) {
  return document.querySelector(`#${id}`).value.trim();
}

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

function formatarEndereco(endereco = {}) {
  const partes = [
    endereco.rua,
    endereco.numero ? `nº ${endereco.numero}` : "",
    endereco.complemento,
    endereco.bairro
  ].filter(Boolean);

  return partes.length > 0 ? partes.join(", ") : "-";
}

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

function prepararNovoCadastro() {
  form.reset();
  studentId.value = "";

  formTitle.textContent = "Novo estudante";
  saveButton.textContent = "Salvar estudante";
  cancelButton.hidden = true;
}

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
```

## Configuração do CRUDCRUD

1. Acesse [crudcrud.com](https://crudcrud.com/).
2. Gere um endpoint.
3. Copie o endereço parecido com:

```text
https://crudcrud.com/api/SEU_ID
```

4. Cole o endereço na constante `CRUDCRUD_BASE_URL` do arquivo `script.js`:

```javascript
const CRUDCRUD_BASE_URL =
  "https://crudcrud.com/api/SEU_ID";
```

O recurso utilizado pela aplicação será:

```text
https://crudcrud.com/api/SEU_ID/estudantes
```

## Como executar

Na pasta do projeto, execute:

```bash
python3 -m http.server 5500
```

Depois abra no navegador:

```text
http://localhost:5500
```

É importante executar por um servidor local em vez de abrir diretamente o arquivo `index.html` pelo navegador.

## Fluxo de teste

1. Configure o endpoint do CRUDCRUD.
2. Digite o CEP `01001000`.
3. Confira o preenchimento automático da rua, bairro, cidade e UF.
4. Preencha o número e os demais dados.
5. Clique em **Salvar estudante**.
6. Confira o registro na tabela.
7. Teste os botões **Editar** e **Excluir**.

## APIs utilizadas

- ViaCEP: `https://viacep.com.br/ws/{cep}/json/`
- CRUDCRUD:
  - `POST /estudantes`
  - `GET /estudantes`
  - `PUT /estudantes/{id}`
  - `DELETE /estudantes/{id}`
