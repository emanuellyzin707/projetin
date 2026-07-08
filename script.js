
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

// Elementos da DOM
const timeline = document.getElementById('timeline');
const quickPostText = document.getElementById('quickPostText');
const charCount = document.getElementById('charCount');
const btnSubmitQuickPost = document.getElementById('btnSubmitQuickPost');
const postModal = document.getElementById('postModal');
const btnOpenModal = document.getElementById('btnOpenModal');
const btnCloseModal = document.getElementById('btnCloseModal');

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    renderPosts();
    setupEventListeners();
});

// Renderizar Posts na Tela
function renderPosts() {
    timeline.innerHTML = '';
    posts.forEach(post => {
        const postElement = document.createElement('article');
        postElement.className = 'post-card';
        
        // Estado visual dos botões de voto
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
                    <button class="action-btn" onclick="showToast('💬 Seção de comentários em desenvolvimento!')">💬 12</button>
                    <button class="action-btn" onclick="showToast('🔁 Repostado com sucesso!')">🔁 4</button>
                    <button class="action-btn" onclick="showToast('❤️ Adicionado aos favoritos!')">⭐</button>
                </div>
            </div>
        `;
        timeline.appendChild(postElement);
    });
}

// Manipulação do Contador de Caracteres do Post Rápido
quickPostText.addEventListener('input', (e) => {
    const target = e.target;
    charCount.textContent = target.value.length;
});

// Criar Novo Post
function createPost(text) {
    if (text.trim() === "") return;

    const newPost = {
        id: Date.now(),
        author: "euzinho",
        username: "@s/n_user",
        time: "Agora mesmo",
        content: text,
        karma: 1,
        userVote: null
    };

    posts.unshift(newPost); // Adiciona no início do array
    saveToStorage();
    renderPosts();
    showToast("🎉 Post publicado no feed!");
}

// Motor de Votação (Estilo Karma do Reddit)
function handleVote(postId, direction) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (post.userVote === direction) {
        // Se clicar de novo no que já votou, cancela o voto
        post.karma += (direction === 'up') ? -1 : 1;
        post.userVote = null;
    } else {
        // Se mudou o voto ou está votando pela primeira vez
        if (post.userVote) {
            // Reverte o voto anterior primeiro
            post.karma += (post.userVote === 'up') ? -1 : 1;
        }
        post.karma += (direction === 'up') ? 1 : -1;
        post.userVote = direction;
    }

    saveToStorage();
    renderPosts();
}

// Auxiliares
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

// Configuração de Eventos e Modais
function setupEventListeners() {
    btnSubmitQuickPost.addEventListener('click', () => {
        createPost(quickPostText.value);
        quickPostText.value = '';
        charCount.textContent = 0;
    });

    // Modal Control
    btnOpenModal.addEventListener('click', () => postModal.showModal());
    btnCloseModal.addEventListener('click', () => postModal.close());
    
    // Fechar ao clicar fora do Modal
    postModal.addEventListener('click', (e) => {
        if (e.target === postModal) postModal.close();
    });
}
