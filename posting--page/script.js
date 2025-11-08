const form = document.querySelector('#form-post');
const usuarioInput = document.querySelector('#usuario');
const tituloInput = document.querySelector('#titulo');
const conteudoInput = document.querySelector('#conteudo');
const postsContainer = document.querySelector('#posts-container');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const data = {
    title: tituloInput.value,
    body: conteudoInput.value,
    userId: 1
  };

  const autor = usuarioInput.value;

  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  })
    .then(response => response.json())
    .then(post => {
      const postElement = document.createElement('article');
      postElement.classList.add('post');

      const dataHora = new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      postElement.innerHTML = `
        <button class="btn-deletar" title="Excluir post">
          <i class="fas fa-trash-alt"></i>
        </button>
        <h2>${post.title}</h2>
        <p>${post.body}</p>
        <small>Postado por <strong>${autor}</strong> em: ${dataHora}</small>

        <div class="post-actions">
          <button class="btn-curtir">
            <i class="fas fa-heart"></i> <span class="contador">0</span>
          </button>

          <button class="btn-compartilhar">
            <i class="fas fa-share-alt"></i> Compartilhar
          </button>
        </div>
      `;

      // Curtir (limitado a 1 vez)
      const btnCurtir = postElement.querySelector('.btn-curtir');
      const contador = btnCurtir.querySelector('.contador');
      let jaCurtiu = false;
      btnCurtir.addEventListener('click', () => {
        if (!jaCurtiu) {
          contador.textContent = parseInt(contador.textContent) + 1;
          jaCurtiu = true;
          btnCurtir.classList.add('curtido');
        }
      });

      // Compartilhar (copiar conteúdo)
      postElement.querySelector('.btn-compartilhar').addEventListener('click', () => {
        const texto = `${post.title}\n\n${post.body}\n\nPostado por ${autor} em: ${dataHora}`;
        navigator.clipboard.writeText(texto)
          .then(() => alert('Conteúdo copiado para a área de transferência!'))
          .catch(() => alert('Erro ao copiar o conteúdo.'));
      });

      // Deletar com confirmação
      postElement.querySelector('.btn-deletar').addEventListener('click', () => {
        const confirmar = confirm('Tem certeza que deseja excluir este post?');
        if (confirmar) {
          postElement.remove();
        }
      });

      postsContainer.appendChild(postElement);

      // Limpar campos
      usuarioInput.value = '';
      tituloInput.value = '';
      conteudoInput.value = '';
    })
    .catch(error => {
      console.error('Erro ao postar:', error);
    });
});
