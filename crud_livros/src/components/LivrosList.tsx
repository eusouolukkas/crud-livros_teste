import React, { useState, useEffect } from 'react';
import { Livro } from '../types';

const LivrosList: React.FC = () => {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [livroEmEdicao, setLivroEmEdicao] = useState<Livro | null>(null);
  const [formulario, setFormulario] = useState<Livro>({
    id: '',
    titulo: '',
    autor: '',
    anoPublicacao: 0,
    dataCadastro: '',
    genero: '',
    descricao: '',
  });

  useEffect(() => {
    // Carregar livros do Local Storage ao iniciar o componente
    const livrosSalvos = JSON.parse(localStorage.getItem('livros') || '[]');
    setLivros(livrosSalvos);
  }, []);

  useEffect(() => {
    // Salvar livros no Local Storage sempre que houver uma alteração
    localStorage.setItem('livros', JSON.stringify(livros));
  }, [livros]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const adicionarLivro = () => {
    if (!formulario.titulo || !formulario.autor) {
      return;
    }

    const novoLivro: Livro = {
      ...formulario,
      id: Date.now().toString(),
      dataCadastro: new Date().toLocaleDateString(),
    };

    setLivros([...livros, novoLivro]);
    setFormulario({
      id: '',
      titulo: '',
      autor: '',
      anoPublicacao: 0,
      dataCadastro: '',
      genero: '',
      descricao: '',
    });
  };

  const editarLivro = (livro: Livro) => {
    setLivroEmEdicao(livro);
    setFormulario(livro);
  };

  const atualizarLivro = () => {
    if (!livroEmEdicao) {
      return;
    }

    const livrosAtualizados = livros.map((livro) =>
      livro.id === livroEmEdicao.id ? formulario : livro
    );

    setLivros(livrosAtualizados);
    setLivroEmEdicao(null);
    setFormulario({
      id: '',
      titulo: '',
      autor: '',
      anoPublicacao: 0,
      dataCadastro: '',
      genero: '',
      descricao: '',
    });
  };

  const excluirLivro = (id: string) => {
    const confirmacao = window.confirm('Tem certeza de que deseja excluir este livro?');
    if (confirmacao) {
      const livrosRestantes = livros.filter((livro) => livro.id !== id);
      setLivros(livrosRestantes);
    }
  };

  return (
    <div>
      <h1>Lista de Livros</h1>
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Ano de Publicação</th>
            <th>Opções</th>
          </tr>
        </thead>
        <tbody>
          {livros.map((livro) => (
            <tr key={livro.id}>
              <td>{livro.titulo}</td>
              <td>{livro.autor}</td>
              <td>{livro.anoPublicacao}</td>
              <td>
                <button onClick={() => editarLivro(livro)}>Editar</button>
                <button onClick={() => excluirLivro(livro.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>{livroEmEdicao ? 'Editar Livro' : 'Adicionar Livro'}</h2>
      <form>
        <div>
          <label>Título:</label>
          <input
            type="text"
            name="titulo"
            value={formulario.titulo}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Autor:</label>
          <input
            type="text"
            name="autor"
            value={formulario.autor}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Ano de Publicação:</label>
          <input
            type="number"
            name="anoPublicacao"
            value={formulario.anoPublicacao}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Gênero:</label>
          <input
            type="text"
            name="genero"
            value={formulario.genero}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Descrição:</label>
          <textarea
            name="descricao"
            value={formulario.descricao}
            onChange={handleInputChange}
          ></textarea>
        </div>
        {livroEmEdicao ? (
          <button type="button" onClick={atualizarLivro}>
            Atualizar Livro
          </button>
        ) : (
          <button type="button" onClick={adicionarLivro}>
            Adicionar Livro
          </button>
        )}
      </form>
    </div>
  );
};

export default LivrosList;
