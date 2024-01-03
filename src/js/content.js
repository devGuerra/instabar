

const progressBarClass = 'custom-progress-bar'; // Classe para marcar a barra de progresso

async function addProgressBar(video) {
    try {
        if (video.parentElement.querySelector(`.${progressBarClass}`)) {
            return; // Se a barra de progresso já existir, encerre a função
        }

        const progressBar = document.createElement("div");
        progressBar.classList.add(progressBarClass); // Adiciona a classe para marcar a barra de progresso
        progressBar.style.height = "5px"; // Reduzindo a altura da barra de progresso
        progressBar.style.position = "relative";
        progressBar.style.width = "calc(100% - 16px)"; // Barra com espaçamento nas laterais
        progressBar.style.zIndex = "9999"; // Coloque a barra acima do vídeo
        progressBar.style.cursor = "pointer"; // Mudando o cursor para indicar interatividade
        progressBar.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)"; // Adicionando uma sombra sutil
        progressBar.style.bottom = "8px"; // Distância da parte inferior
        progressBar.style.left = "8px"; // Distância da parte inferior
        progressBar.style.right = "8px"; // Distância da parte inferior
        progressBar.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.9)"; // Adicionando uma sombra sutil



        const progressBarBackground = document.createElement('div')

        progressBarBackground.style.width = '100%'
        progressBarBackground.style.height = '100%'
        progressBarBackground.style.backgroundColor = "#c1c1c1"; // Alterando a cor de fundo da barra de progresso
        progressBarBackground.style.position = 'absolute'
        progressBarBackground.style.left = '0'
        progressBarBackground.style.right = '0'
        progressBarBackground.style.bottom = '0'
        progressBarBackground.style.top = '0'
        progressBarBackground.style.opacity = '0.8'
        progressBarBackground.style.borderRadius = '3px';



        progressBar.appendChild(progressBarBackground)

        video.style.position = "relative";
        video.parentElement.style.position = "relative";
        video.parentElement.appendChild(progressBar);

        // Barra de progresso vermelha (se movendo sobre a barra cinza)
        const progressInnerBar = document.createElement("div");
        progressInnerBar.style.height = "100%";
        progressInnerBar.style.backgroundColor = "#FFFFFF"; // Alterando a cor da barra de progresso ativa
        progressInnerBar.style.width = "0%"; // Inicialmente vazia
        progressInnerBar.style.borderRadius = '3px';
        progressInnerBar.style.transition = "width 0.1s ease"; // Reduzindo o tempo de transição para uma animação mais fluida

        progressBar.appendChild(progressInnerBar);



        // Adicionando o botão deslizante para um controle mais preciso
        const sliderButton = document.createElement("div");
        sliderButton.style.width = "10px";
        sliderButton.style.height = "10px";
        sliderButton.style.backgroundColor = "#FFFFFF";
        sliderButton.style.borderRadius = "50%";
        sliderButton.style.position = "absolute";
        sliderButton.style.top = "-3px"; // Ajuste para alinhar com a barra vermelha
        sliderButton.style.cursor = "pointer";
        sliderButton.style.zIndex = "10000";
        sliderButton.style.bottom = "-8px"; // Distância da parte inferior do botão deslizante
        sliderButton.style.overflow = 'visible'
        sliderButton.draggable = true; // Tornando o botão deslizante arrastável


        progressInnerBar.appendChild(sliderButton);



        // Função para atualizar a barra de progresso e o controle deslizante
        function updateProgress() {
            const progress = (video.currentTime / video.duration) * 100;
            progressInnerBar.style.width = `${progress}%`;

            // Atualização da posição do botão deslizante com uma animação suave
            const sliderPosition = `calc(${progress}% - 5px)`;
            sliderButton.style.transition = "left 0.1s ease";
            sliderButton.style.left = sliderPosition;
        }
        // Atualizar a barra de progresso enquanto o vídeo é reproduzido

        video?.addEventListener("timeupdate", updateProgress);


        // Adicionar funcionalidade de controle ao clicar na barra de progresso
        progressBar?.addEventListener("click", event => {
            const boundingRect = progressBar.getBoundingClientRect();
            const offsetX = event.clientX - boundingRect.left;
            const percentage = (offsetX / boundingRect.width) * 100;
            const videoTime = (percentage * video.duration) / 100;
            video.currentTime = videoTime;
            updateProgress(); // Atualiza a barra de progresso após clicar
        });

        // Adicionar funcionalidade para arrastar o botão deslizante
        let isDragging = false;

        sliderButton?.addEventListener("mousedown", event => {
            event.preventDefault();
            isDragging = true;
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });



        function onMouseMove(event) {
            if (!isDragging) return;

            const boundingRect = progressBar.getBoundingClientRect();
            let offsetX = event.clientX - boundingRect.left;

            // Limitar a posição do botão deslizante dentro da barra de progresso
            if (offsetX < 0) {
                offsetX = 0;
            } else if (offsetX > boundingRect.width) {
                offsetX = boundingRect.width;
            }

            const percentage = (offsetX / boundingRect.width) * 100;
            const videoTime = (percentage * video.duration) / 100;
            video.currentTime = videoTime;
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        }
    } catch (e) {
        console.error(e)
    }
}



const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        const videos = mutation.target.querySelectorAll('video')

        videos.forEach(video => {
            const hasProgressBar = video.parentElement.querySelector(".custom-progress-bar");

            if (!hasProgressBar) {
                addProgressBar(video);
            }
        })
    })
})

const observerConfig = {
    childList: true,
    subtree: true
};

// Inicia a observação no corpo do documento
observer.observe(document.body, observerConfig);