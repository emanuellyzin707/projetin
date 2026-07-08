
// BANCO DE DADOS EM MEMÓRIA (MOCK DATA) COM LOCALSTORAGE
let posts = JSON.parse(localStorage.getItem('br_social_posts')) || [
    {
        id: 1,
        author: "Dev Maniznha",
        username: "@manuzina_dev",
        time: "Há 21 horas",
        content: "Montando o setup com luzes RGB em verde e amarelo para codar com o espírito brasileiro ativado! 🇧🇷💻",
        karma: 42,
        userVote: null
    },
    {
        id: 2,
        author: "nana Tech",
        username: "@cryibabyy_tech",
        time: "Há 4 horas",
        content: "Alguém aí já tentou refazer o backend do Reddit usando JS puro? É um desafio e tanto!",
        karma: 105,
        userVote: null
    }
];

// Elementos da DOM principal
const timeline = document.getElementById('timeline');
const quickPostText = document.getElementById('quickPostText');
const charCount = document.getElementById('charCount');
const btnSubmitQuickPost = document.getElementById('btnSubmitQuickPost');
const postModal = document.getElementById('postModal');
const btnOpenModal = document.getElementById('btnOpenModal');
const btnCloseModal = document.getElementById('btnCloseModal');

// Elementos adicionais capturados para novas interações
const modalPostText = document.getElementById('modalPostText');
const btnSubmitModalPost = document.getElementById('btnSubmitModalPost');
const searchInput = document.querySelector('.search-box input');
const feedTabs = document.querySelectorAll('.feed-tabs .tab');
const btnFollowCommunity = document.querySelector('.btn-follow');

// Variável para armazenar o termo atual digitado na busca
let currentSearchTerm = '';

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    renderPosts();
    setupEventListeners();
});

// Renderizar Posts na Tela (com suporte a filtro de pesquisa dinâmica)
function renderPosts() {
    timeline.innerHTML = '';
    
    // Filtra os posts caso haja um termo na barra de buscas
    const filteredPosts = posts.filter(post => 
        post.content.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
        post.username.toLowerCase().includes(currentSearchTerm.toLowerCase())
    );

    if (filteredPosts.length === 0) {
        timeline.innerHTML = `<p style="padding: 2rem; text-align: center; color: var(--cinza);">Nenhum post encontrado para esta busca. 😢</p>`;
        return;
    }

    filteredPosts.forEach(post => {
        const postElement = document.createElement('article');
        postElement.className = 'post-card';
        
        const upActive = post.userVote === 'up' ? 'upactive' : '';
        const downActive = post.userVote === 'down' ? 'downactive' : '';

        postElement.innerHTML = `
            <div class="vote-section">
                <button class="vote-btn ${upActive}" onclick="handleVote(${post.id}, 'up')">▲</button>
                <span class="karma-count">${post.karma}</span>
                <button class="vote-btn ${downActive}" onclick="handleVote(${post.id}, 'down')">▼</button>
            </div>
            <div class="post-main">
                <div class="post-user-info">
                    <strong>${post.author}</strong>
                    <span>${post.username}</span>
                    <span>· ${post.time}</span>
                </div>
                <div class="post-body">
                    <p>${post.content}</p>
                </div>
                <div class="post-footer-actions">
                    <button class="action-btn" onclick="showToast('💬 Seção de comentários em desenvolvimento!')">💬 505M</button>
                    <button class="action-btn" onclick="showToast('🔁 Repostado com sucesso!')">🔁 900.4K</button>
                    <button class="action-btn" onclick="showToast('❤️ Adicionado aos favoritos!')">⭐</button>
                </div>
            </div>
        `;
        timeline.appendChild(postElement);
    });
}

// Manipulação do Contador de Caracteres do Post Rápido
quickPostText.addEventListener('input', (e) => {
    charCount.textContent = e.target.value.length;
});

// Criar Novo Post (Funciona tanto para a Home quanto para o Modal)
function createPost(text) {
    if (text.trim() === "") {
        showToast("⚠️ O texto da publicação não pode estar vazio!");
        return;
    }

    const newPost = {
        id: Date.now(),
        author: "s/n pro ,,>﹏<,,",
        username: "@s/n_user",
        time: "Agora mesmo",
        content: text,
        karma: 1,
        userVote: null
    };

    posts.unshift(newPost);
    saveToStorage();
    renderPosts();
    showToast("🎉 Post publicado no feed!");
}

// Motor de Votação (Estilo Karma do Reddit)
function handleVote(postId, direction) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (post.userVote === direction) {
        post.karma += (direction === 'up') ? -1 : 1;
        post.userVote = null;
    } else {
        if (post.userVote) {
            post.karma += (post.userVote === 'up') ? -1 : 1;
        }
        post.karma += (direction === 'up') ? 1 : -1;
        post.userVote = direction;
    }

    saveToStorage();
    renderPosts();
}

// Auxiliares de Armazenamento e Interface
function saveToStorage() {
    localStorage.setItem('br_social_posts', JSON.stringify(posts));
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Configuração Geral de Escutas de Eventos (Event Listeners)
function setupEventListeners() {
    // Enviar Post Rápido da Timeline
    btnSubmitQuickPost.addEventListener('click', () => {
        createPost(quickPostText.value);
        quickPostText.value = '';
        charCount.textContent = 0;
    });

    // Enviar Post a partir da Caixa do Modal Flutuante
    btnSubmitModalPost.addEventListener('click', () => {
        createPost(modalPostText.value);
        modalPostText.value = ''; 
        postModal.close();       
    });

    // Controle de Abertura e Fechamento do Modal <dialog>
    btnOpenModal.addEventListener('click', () => postModal.showModal());
    btnCloseModal.addEventListener('click', () => postModal.close());
    
    postModal.addEventListener('click', (e) => {
        if (e.target === postModal) postModal.close();
    });

    // Funcionalidade: Filtro na Barra de Pesquisa em Tempo Real
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value;
        renderPosts();
    });

    // Funcionalidade: Alternar Abas Visuais da Timeline (Para você / Seguindo)
    feedTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            feedTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            showToast(`Alternado para a aba: ${tab.textContent}`);
            renderPosts();
        });
    });

    // Funcionalidade: Botão "Entrar" e "Sair" na Widget de Comunidades
    if (btnFollowCommunity) {
        btnFollowCommunity.addEventListener('click', () => {
            if (btnFollowCommunity.textContent === 'Entrar') {
                btnFollowCommunity.textContent = 'Sair';
                btnFollowCommunity.style.backgroundColor = 'transparent';
                btnFollowCommunity.style.border = '1px solid var(--verde)';
                btnFollowCommunity.style.color = 'var(--verde)';
                showToast('👥 Você entrou na comunidade!');
            } else {
                btnFollowCommunity.textContent = 'Entrar';
                btnFollowCommunity.style.backgroundColor = ''; 
                btnFollowCommunity.style.color = '';
                btnFollowCommunity.style.border = '';
                showToast('🚪 Você saiu da comunidade.');
            }
        });
    }
}
