class Carousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.carousel-item');
        this.isAnimating = false;
        this.autoPlayInterval = null; // Para auto-play
        this.autoPlaySpeed = 3000; // Velocidade do auto-play
        this.initSwipe();
        this.updateIndicators();
        this.startAutoPlay(); // Inicia o auto-play
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.move(1), this.autoPlaySpeed);
    }

    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }

    move(direction) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        this.slides[this.currentSlide].classList.remove('active');
        this.slides[this.currentSlide].classList.add('fade-out');

        this.currentSlide = (this.currentSlide + direction + this.slides.length) % this.slides.length;

        setTimeout(() => {
            this.slides[this.currentSlide].classList.add('active');
            this.slides[this.currentSlide].classList.remove('fade-out');
            this.updateIndicators();
            this.isAnimating = false;
        }, 300);
    }

    updateIndicators() {
        const indicators = document.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }

    initSwipe() {
        let startX;

        const touchStart = (event) => {
            startX = event.touches[0].clientX;
        };

        const touchMove = (event) => {
            const endX = event.touches[0].clientX;
            const diffX = startX - endX;

            if (Math.abs(diffX) > 50) {
                this.move(diffX > 0 ? 1 : -1);
                document.removeEventListener('touchstart', touchStart);
                document.removeEventListener('touchmove', touchMove);
            }
        };

        document.addEventListener('touchstart', touchStart);
        document.addEventListener('touchmove', touchMove);
    }
}

class Modal {
    constructor() {
        this.modal = document.getElementById('modal');
        this.title = document.getElementById('modal-title');
        this.description = document.getElementById('modal-description');
        this.closeButton = document.getElementById('modal-close');

        this.closeButton.addEventListener('click', () => this.close());

        window.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.close();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.close();
            }
        });
    }

    open(title, description) {
        this.title.innerText = title;
        this.description.innerText = description;
        this.modal.style.display = "block";
        this.modal.classList.add('fade-in');
        this.modal.setAttribute('aria-hidden', 'false');
    }

    close() {
        this.modal.classList.remove('fade-in');
        this.modal.style.display = "none";
        this.modal.setAttribute('aria-hidden', 'true');
    }
}

// Inicialização do carrossel e modal
const carousel = new Carousel();
const modal = new Modal();

// Navegação do carrossel com teclas de seta
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        carousel.move(1);
    } else if (event.key === 'ArrowLeft') {
        carousel.move(-1);
    }
});

// Botões de navegação
document.getElementById('next-button').addEventListener('click', () => carousel.move(1));
document.getElementById('prev-button').addEventListener('click', () => carousel.move(-1));

// Função para criar elementos do carrossel dinamicamente
function createCarouselItems(items) {
    const carouselContainer = document.querySelector('.carousel-container');
    items.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.classList.add('carousel-item');
        if (index === 0) slide.classList.add('active'); // Primeiro item ativo

        slide.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="carousel-caption">
                <h5>${item.title}</h5>
                <p>${item.description}</p>
                <button class="modal-open" data-title="${item.title}" data-description="${item.description}">Abrir Modal</button>
            </div>
        `;
        carouselContainer.appendChild(slide);
    });
}

// Lista de itens para o carrossel
const carouselItems = [
    { image: 'img1.jpg', title: 'Título 1', description: 'Descrição 1' },
    { image: 'img2.jpg', title: 'Título 2', description: 'Descrição 2' },
    { image: 'img3.jpg', title: 'Título 3', description: 'Descrição 3' },
];

// Cria itens no carrossel
createCarouselItems(carouselItems);

// Configuração de abertura do modal
document.querySelectorAll('.modal-open').forEach(button => {
    button.addEventListener('click', () => {
        const title = button.getAttribute('data-title');
        const description = button.getAttribute('data-description');
        modal.open(title, description);
    });
});

// Funções adicionais para animações
function fadeIn(element) {
    element.style.opacity = 0;
    element.style.display = 'block';
    let last = +new Date();
    const tick = () => {
        element.style.opacity = +element.style.opacity + (new Date() - last) / 400;
        last = +new Date();
        if (+element.style.opacity < 1) {
            requestAnimationFrame(tick);
        }
    };
    tick();
}

function fadeOut(element) {
    element.style.opacity = 1;
    const tick = () => {
        element.style.opacity = +element.style.opacity - 0.1;
        if (+element.style.opacity > 0) {
            requestAnimationFrame(tick);
        } else {
            element.style.display = 'none';
        }
    };
    tick();
}

// Modal com animação de fade
class EnhancedModal extends Modal {
    open(title, description) {
        super.open(title, description);
        fadeIn(this.modal); // Animação de fade in
    }

    close() {
        fadeOut(this.modal); // Animação de fade out
        setTimeout(() => super.close(), 400); // Aguarda a animação terminar
    }
}

// Substitui a modal original pela modal melhorada
const enhancedModal = new EnhancedModal();

// Atualização do evento de clique para abrir a nova modal
document.querySelectorAll('.modal-open').forEach(button => {
    button.addEventListener('click', () => {
        const title = button.getAttribute('data-title');
        const description = button.getAttribute('data-description');
        enhancedModal.open(title, description);
    });
});

// Adicionando recursos de acessibilidade
function updateAccessibility() {
    const slides = document.querySelectorAll('.carousel-item');
    slides.forEach((slide, index) => {
        slide.setAttribute('role', 'tabpanel');
        slide.setAttribute('aria-hidden', index !== carousel.currentSlide);
    });
}

// Atualiza a acessibilidade sempre que o carrossel é movido
carousel.move = (direction) => {
    if (carousel.isAnimating) return;
    carousel.isAnimating = true;

    const currentSlideElement = carousel.slides[carousel.currentSlide];
    currentSlideElement.classList.remove('active');
    currentSlideElement.classList.add('fade-out');

    carousel.currentSlide = (carousel.currentSlide + direction + carousel.slides.length) % carousel.slides.length;

    setTimeout(() => {
        const nextSlideElement = carousel.slides[carousel.currentSlide];
        nextSlideElement.classList.add('active');
        nextSlideElement.classList.remove('fade-out');
        carousel.updateIndicators();
        updateAccessibility(); // Atualiza acessibilidade ao mudar de slide
        carousel.isAnimating = false;
    }, 300);
};

// Funções de preload de imagens
function preloadImages(images) {
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Pré-carrega as imagens do carrossel
preloadImages(carouselItems.map(item => item.image));

// Adiciona um evento para parar o auto-play ao passar o mouse
document.querySelector('.carousel-container').addEventListener('mouseenter', () => {
    carousel.stopAutoPlay();
});

document.querySelector('.carousel-container').addEventListener('mouseleave', () => {
    carousel.startAutoPlay();
});

// Mudanças de design para melhorar a usabilidade
document.querySelectorAll('.carousel-item img').forEach(img => {
    img.addEventListener('load', () => {
        img.classList.add('loaded'); // Adiciona uma classe quando a imagem é carregada
    });
});

// CSS para adicionar carregamento visual
const style = document.createElement('style');
style.innerHTML = `
.carousel-item img {
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
}

.carousel-item img.loaded {
    opacity: 1;
}
`;
document.head.appendChild(style);

// Implementação de botões de início e reiniciar
document.getElementById('start-button').addEventListener('click', () => {
    carousel.currentSlide = 0; // Reinicia para o primeiro slide
    carousel.move(0); // Atualiza o carrossel
});

document.getElementById('restart-button').addEventListener('click', () => {
    carousel.stopAutoPlay();
    carousel.startAutoPlay(); // Reinicia o auto-play
});

// Melhoria do design do modal
const modalStyle = document.createElement('style');
modalStyle.innerHTML = `
#modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    align-items: center;
    justify-content: center;
}

.modal-content {
    background-color: white;
    border-radius: 15px;
    padding: 20px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    transform: scale(0.9);
    transition: transform 0.3s ease-in-out;
}

.modal-content.fade-in {
    transform: scale(1);
}
`;
document.head.appendChild(modalStyle);

// Mais melhorias e extensões
// Exemplo de um sistema de feedback do usuário
function createFeedbackForm() {
    const feedbackContainer = document.createElement('div');
    feedbackContainer.classList.add('feedback-container');
    
    const form = document.createElement('form');
    form.innerHTML = `
        <h3>Feedback</h3>
        <textarea rows="4" placeholder="Deixe seu feedback aqui..."></textarea>
        <button type="submit">Enviar</button>
    `;
    
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const feedback = form.querySelector('textarea').value;
        console.log('Feedback enviado:', feedback); // Simulação de envio
        form.reset(); // Limpa o formulário
    });

    feedbackContainer.appendChild(form);
    document.body.appendChild(feedbackContainer);
}

// Cria o formulário de feedback
createFeedbackForm();

// Função de validação para o formulário de feedback
function validateFeedback(feedback) {
    if (feedback.length < 10) {
        alert('O feedback deve ter pelo menos 10 caracteres.');
        return false;
    }
    return true;
}
