# CRUD de Estudantes

Aplicação web simples para cadastro e gerenciamento de estudantes usando HTML, CSS e JavaScript.

## Funcionalidades

- Cadastro de dados básicos do estudante;
- Busca automática de endereço pelo CEP usando a API ViaCEP;
- Cadastro, listagem, edição e exclusão usando CRUDCRUD;
- Interface responsiva.

## Tecnologias

- HTML5;
- CSS3;
- JavaScript;
- [ViaCEP](https://viacep.com.br/);
- [CRUDCRUD](https://crudcrud.com/).

## Estrutura

```text
.
├── index.html
├── style.css
├── script.js
├── GUIA-CRUD-ESTUDANTES.md
└── README.md
```

## Configuração

Abra o arquivo `script.js` e informe o endpoint gerado no CRUDCRUD:

```javascript
const CRUDCRUD_BASE_URL =
  "https://crudcrud.com/api/SEU_ID";
```

## Como executar

Na pasta do projeto, execute:

```bash
python3 -m http.server 5500
```

Acesse no navegador:

```text
http://localhost:5500
```

Se a porta `5500` já estiver ocupada, utilize outra:

```bash
python3 -m http.server 5501
```

## Observação

Consulte o [GUIA-CRUD-ESTUDANTES.md](GUIA-CRUD-ESTUDANTES.md) para ver a implementação completa e as instruções detalhadas.
