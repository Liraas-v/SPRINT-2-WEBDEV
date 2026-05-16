// ==========================================================
// JOVI LensAI — script.js
// Sprint 2 — Web Development
// ==========================================================


// ==========================================================
// DADOS — usuários salvos no localStorage
// ==========================================================

let usuarios = JSON.parse(localStorage.getItem('jovi-usuarios'));

if (!usuarios) {
    usuarios = [
        { nome: 'Ana Silva', email: 'ana@fiap.com', senha: '123456' }
    ];
    localStorage.setItem('jovi-usuarios', JSON.stringify(usuarios));
}

let usuarioLogado = JSON.parse(localStorage.getItem('jovi-logado')) || null;

const telaLogin     = document.getElementById('telaLogin');
const telaCadastro  = document.getElementById('telaCadastro');
const sitePrincipal = document.getElementById('sitePrincipal');


// ==========================================================
// 1. FORMULÁRIO DE LOGIN
// ==========================================================

const formLogin = document.getElementById('formLogin');

formLogin.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value;

    document.getElementById('erroLoginEmail').textContent = '';
    document.getElementById('erroLoginSenha').textContent = '';

    let valido = true;

    if (email === '') {
        document.getElementById('erroLoginEmail').textContent = 'Informe seu e-mail.';
        valido = false;
    } else if (!email.includes('@') || !email.includes('.')) {
        document.getElementById('erroLoginEmail').textContent = 'E-mail inválido.';
        valido = false;
    }

    if (senha === '') {
        document.getElementById('erroLoginSenha').textContent = 'Informe sua senha.';
        valido = false;
    }

    if (!valido) return;

    let encontrado = null;
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].email === email && usuarios[i].senha === senha) {
            encontrado = usuarios[i];
            break;
        }
    }

    if (encontrado === null) {
        alert('E-mail ou senha incorretos.\nVerifique seus dados ou crie uma conta.');
        return;
    }

    usuarioLogado = encontrado;
    localStorage.setItem('jovi-logado', JSON.stringify(usuarioLogado));
    entrarNoSite(true);
});


// ==========================================================
// 2. FORMULÁRIO DE CADASTRO
// ==========================================================

const formCadastro = document.getElementById('formCadastro');

document.getElementById('cadSenha').addEventListener('input', function() {
    const hint = document.getElementById('dicaSenha');
    const tamanho = this.value.length;

    if (tamanho === 0) {
        hint.textContent = 'Mínimo 6 caracteres';
        hint.style.color = '';
    } else if (tamanho < 6) {
        hint.textContent = tamanho + '/6 caracteres';
        hint.style.color = '#ff4db8';
    } else if (tamanho < 10) {
        hint.textContent = '✓ Senha boa';
        hint.style.color = '#00f0d4';
    } else {
        hint.textContent = '✓✓ Senha forte!';
        hint.style.color = '#00f0d4';
    }
});

formCadastro.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const nome  = document.getElementById('cadNome').value.trim();
    const email = document.getElementById('cadEmail').value.trim();
    const senha = document.getElementById('cadSenha').value;

    document.getElementById('erroCadNome').textContent  = '';
    document.getElementById('erroCadEmail').textContent = '';
    document.getElementById('erroCadSenha').textContent = '';

    let valido = true;

    if (nome.length < 3) { document.getElementById('erroCadNome').textContent = 'Nome deve ter ao menos 3 caracteres.'; valido = false; }
    if (!email.includes('@') || !email.includes('.')) { document.getElementById('erroCadEmail').textContent = 'Insira um e-mail válido.'; valido = false; }
    if (senha.length < 6) { document.getElementById('erroCadSenha').textContent = 'Senha deve ter ao menos 6 caracteres.'; valido = false; }

    if (!valido) { alert('⚠️ Corrija os campos destacados antes de continuar.'); return; }

    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].email === email) { alert('Este e-mail já está cadastrado. Tente fazer login.'); return; }
    }

    const novoUsuario = { nome: nome, email: email, senha: senha };
    usuarios.push(novoUsuario);
    localStorage.setItem('jovi-usuarios', JSON.stringify(usuarios));

    const primeiroNome = nome.split(' ')[0];
    alert('✅ Conta criada com sucesso, ' + primeiroNome + '!\nAgora faça login para entrar.');

    telaCadastro.classList.add('oculto');
    telaLogin.classList.remove('oculto');
    formCadastro.reset();
    document.getElementById('dicaSenha').textContent = 'Mínimo 6 caracteres';
    document.getElementById('dicaSenha').style.color = '';
});

document.getElementById('btnIrCadastro').addEventListener('click', function() {
    telaLogin.classList.add('oculto');
    telaCadastro.classList.remove('oculto');
});

document.getElementById('btnIrLogin').addEventListener('click', function() {
    telaCadastro.classList.add('oculto');
    telaLogin.classList.remove('oculto');
});

function entrarNoSite(mostrarBoasVindas) {
    telaLogin.classList.add('oculto');
    telaCadastro.classList.add('oculto');
    sitePrincipal.classList.remove('oculto');

    const primeiroNome = usuarioLogado.nome.split(' ')[0];
    document.getElementById('saudacao').textContent = 'Olá, ' + primeiroNome + '!';

    if (mostrarBoasVindas) {
        alert('Bem-vindo(a) de volta, ' + primeiroNome + '! 🎉');
    }
}

document.getElementById('btnSair').addEventListener('click', function() {
    const confirma = confirm('Deseja sair da sua conta?');
    if (confirma) {
        usuarioLogado = null;
        localStorage.removeItem('jovi-logado');
        sitePrincipal.classList.add('oculto');
        telaLogin.classList.remove('oculto');
        document.getElementById('formLogin').reset();
    }
});

if (usuarioLogado !== null) { entrarNoSite(false); }


// ==========================================================
// 3. NAVBAR — SCROLL + MENU MOBILE
// ==========================================================

const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', function() {
    if (window.scrollY > 40) { navbar.classList.add('fixo'); }
    else { navbar.classList.remove('fixo'); }
});

hamburger.addEventListener('click', function() {
    const estaAberto = navLinks.classList.contains('aberto');
    if (estaAberto) {
        navLinks.classList.remove('aberto');
        hamburger.classList.remove('aberto');
        hamburger.setAttribute('aria-expanded', 'false');
    } else {
        navLinks.classList.add('aberto');
        hamburger.classList.add('aberto');
        hamburger.setAttribute('aria-expanded', 'true');
    }
});

document.querySelectorAll('#navLinks a').forEach(function(link) {
    link.addEventListener('click', function() {
        navLinks.classList.remove('aberto');
        hamburger.classList.remove('aberto');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        navLinks.classList.remove('aberto');
        hamburger.classList.remove('aberto');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});


// ==========================================================
// 4. TEMA DARK / LIGHT
// ==========================================================

const btnTema = document.getElementById('btnTema');
const htmlEl  = document.documentElement;

const temaSalvo = localStorage.getItem('jovi-tema') || 'dark';
htmlEl.setAttribute('data-theme', temaSalvo);
btnTema.textContent = temaSalvo === 'dark' ? '☀' : '🌙';

btnTema.addEventListener('click', function() {
    const temaAtual = htmlEl.getAttribute('data-theme');
    const novoTema  = temaAtual === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', novoTema);
    localStorage.setItem('jovi-tema', novoTema);
    btnTema.textContent = novoTema === 'dark' ? '☀' : '🌙';
});


// ==========================================================
// 5. SLIDESHOW
// ==========================================================

const slides    = document.querySelectorAll('.slide');
const indicDiv  = document.getElementById('indicadores');
const numeracao = document.getElementById('numeracaoSlide');

let slideAtual = 0;

for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('button');
    dot.className = 'indicador' + (i === 0 ? ' ativo' : '');
    dot.setAttribute('aria-label', 'Ir para slide ' + (i + 1));
    dot.setAttribute('data-indice', i);

    dot.addEventListener('click', function() {
        irParaSlide(parseInt(this.getAttribute('data-indice')));
    });

    indicDiv.appendChild(dot);
}

function irParaSlide(indice) {
    slides[slideAtual].classList.remove('ativo');
    document.querySelectorAll('.indicador')[slideAtual].classList.remove('ativo');

    slideAtual = (indice + slides.length) % slides.length;

    slides[slideAtual].classList.add('ativo');
    document.querySelectorAll('.indicador')[slideAtual].classList.add('ativo');

    numeracao.textContent = (slideAtual + 1) + ' / ' + slides.length;
}

document.getElementById('btnAnterior').addEventListener('click', function() { irParaSlide(slideAtual - 1); });
document.getElementById('btnProximo').addEventListener('click',  function() { irParaSlide(slideAtual + 1); });

setInterval(function() { irParaSlide(slideAtual + 1); }, 4500);

numeracao.textContent = '1 / ' + slides.length;


// ==========================================================
// 6. IA EM AÇÃO — CENÁRIO LOUSA
// ==========================================================

const cenarioLousa = {
    titulo:    'Modo Lousa',
    descricao: 'A IA identifica a lousa, corrige perspectiva e aumenta o contraste automaticamente.',
    antes:     'Foto borrada da lousa',
    depois:    'Lousa nítida e corrigida',
    recursos:  ['✓ Correção de perspectiva', '✓ Eliminação de reflexo', '✓ Contraste de texto', '✓ Auto-corte de bordas']
};

document.getElementById('iaTitulo').textContent      = cenarioLousa.titulo;
document.getElementById('iaDescricao').textContent   = cenarioLousa.descricao;
document.getElementById('legendaAntes').textContent  = cenarioLousa.antes;
document.getElementById('legendaDepois').textContent = cenarioLousa.depois;

const listaRecursos = document.getElementById('iaRecursos');
listaRecursos.innerHTML = '';

for (let i = 0; i < cenarioLousa.recursos.length; i++) {
    const item = document.createElement('li');
    item.textContent = cenarioLousa.recursos[i];
    listaRecursos.appendChild(item);
}


// ==========================================================
// 7. FORMULÁRIO DE CONTATO
// ==========================================================

const formContato = document.getElementById('formContato');

formContato.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const nome     = document.getElementById('contatoNome').value.trim();
    const email    = document.getElementById('contatoEmail').value.trim();
    const mensagem = document.getElementById('contatoMensagem').value.trim();
    const feedback = document.getElementById('feedbackContato');

    document.getElementById('erroContatoNome').textContent     = '';
    document.getElementById('erroContatoEmail').textContent    = '';
    document.getElementById('erroContatoMensagem').textContent = '';

    let valido = true;

    if (nome.length < 3) { document.getElementById('erroContatoNome').textContent = 'Nome deve ter ao menos 3 caracteres.'; valido = false; }
    if (!email.includes('@') || !email.includes('.')) { document.getElementById('erroContatoEmail').textContent = 'Insira um e-mail válido.'; valido = false; }
    if (mensagem.length < 10) { document.getElementById('erroContatoMensagem').textContent = 'Mensagem muito curta (mínimo 10 caracteres).'; valido = false; }

    if (!valido) { alert('⚠️ Preencha todos os campos corretamente antes de enviar.'); return; }

    const primeiroNome = nome.split(' ')[0];

    feedback.textContent = '✅ Mensagem enviada, ' + primeiroNome + '! Responderemos em breve.';
    feedback.className = 'feedback-msg sucesso';
    feedback.classList.remove('oculto');

    alert('Sua mensagem foi enviada com sucesso, ' + primeiroNome + '! 📨');

    formContato.reset();
});


// ==========================================================
// 8. BOTÃO HERO — PROMPT + SCROLL
// ==========================================================

document.getElementById('btnExperimentar').addEventListener('click', function() {
    const dificuldade = prompt('Qual é sua maior dificuldade ao fotografar conteúdo em aula?\n(Ex: foco, iluminação, velocidade...)');

    if (dificuldade !== null && dificuldade.trim().length > 0) {
        alert('Entendido! "' + dificuldade.trim() + '" é exatamente o problema que a JOVI LensAI resolve. 🎯\nVeja como se cadastrar abaixo!');
    }

    const secaoContato = document.getElementById('contato');
    const topo = secaoContato.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top: topo, behavior: 'smooth' });
});
