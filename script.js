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


// ==========================================================
// REFERÊNCIAS AOS ELEMENTOS DO DOM
// ==========================================================

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

    if (nome.length < 3) {
        document.getElementById('erroCadNome').textContent = 'Nome deve ter ao menos 3 caracteres.';
        valido = false;
    }

    if (!email.includes('@') || !email.includes('.')) {
        document.getElementById('erroCadEmail').textContent = 'Insira um e-mail válido.';
        valido = false;
    }

    if (senha.length < 6) {
        document.getElementById('erroCadSenha').textContent = 'Senha deve ter ao menos 6 caracteres.';
        valido = false;
    }

    if (!valido) {
        alert('⚠️ Corrija os campos destacados antes de continuar.');
        return;
    }

    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].email === email) {
            alert('Este e-mail já está cadastrado. Tente fazer login.');
            return;
        }
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


// ==========================================================
// NAVEGAR ENTRE LOGIN E CADASTRO
// ==========================================================

document.getElementById('btnIrCadastro').addEventListener('click', function() {
    telaLogin.classList.add('oculto');
    telaCadastro.classList.remove('oculto');
});

document.getElementById('btnIrLogin').addEventListener('click', function() {
    telaCadastro.classList.add('oculto');
    telaLogin.classList.remove('oculto');
});


// ==========================================================
// ENTRAR NO SITE / SAIR
// ==========================================================

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

if (usuarioLogado !== null) {
    entrarNoSite(false);
}
