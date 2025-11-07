const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.elementos-menu');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Dropdown
const dropdownToggles = document.querySelectorAll('.intercalar-secoes');

dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const dropdown = toggle.parentElement;
        const menu = toggle.nextElementSibling;

        // Fecha outros dropdowns abertos
        document.querySelectorAll('.secoes-menu').forEach(otherMenu => {
            if (otherMenu !== menu && window.innerWidth > 768) {
                otherMenu.style.display = 'none';
            }
        });

        // Alterna o menu atual
        if (menu) {
            if (window.innerWidth > 768) {
                menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            } else if (dropdown) {
                dropdown.classList.toggle('active');
            }
        }
    });
});

// Fecha o dropdown quando clica fora
document.addEventListener('click', (e) => {
    if (window.innerWidth > 768) {
        const isDropdown = e.target.matches('.intercalar-secoes') ||
                         e.target.closest('.intercalar-secoes') ||
                         e.target.matches('.secoes-menu') ||
                         e.target.closest('.secoes-menu');

        if (!isDropdown) {
            document.querySelectorAll('.secoes-menu').forEach(menu => {
                menu.style.display = 'none';
            });
        }
    }
});

// Carrossel
const carouselInner = document.querySelector('.carrosel-interno');
const dots = document.querySelectorAll('.ponto');
const slides = document.querySelectorAll('.slide-carrosel');
let currentSlide = 0;
const totalSlides = slides.length;

if (carouselInner && dots.length > 0 && totalSlides > 0) {

    function goToSlide(slideIndex) {
        // garante índice válido
        const idx = Math.max(0, Math.min(slideIndex, totalSlides - 1));
        carouselInner.style.transform = `translateX(-${idx * 100}%)`;
        dots.forEach(dot => dot.classList.remove('ponto-ativo'));
        if (dots[idx]) dots[idx].classList.add('ponto-ativo');
        currentSlide = idx;
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.getAttribute('data-slide'), 10);
            if (!Number.isNaN(slideIndex)) goToSlide(slideIndex);
        });
    });

    goToSlide(0);

    // Auto-slide (somente se houver mais de 1 slide)
    if (totalSlides > 1) {
        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            goToSlide(currentSlide);
        }, 5000);
    }
}

//Formulário Avaliações 
if (typeof Swiper !== 'undefined') {
  var swiper = new Swiper(".swiper-carrocel-form", {
    loop: true, 
    speed: 500,
    autoplay: {
      delay: 8000,
      disableOnInteraction: false,
    },
    allowTouchMove: false,
  });
} else {
  console.warn('Swiper não encontrado — carrossel de formulário não iniciado.');
}

document.querySelectorAll('.avaliacao-estrela input').forEach(input => {
  input.addEventListener('change', () => {
    console.log("Avaliação escolhida:", input.value);
  });
});

//index.js

//comentários
// Modifique a parte dos comentários para:
const urlComentario = "https://z39pk737.api.sanity.io/v2025-11-05/data/query/production?query=*%0A%5B_type+%3D%3D+%22comentarios%22%5D%0A%7Bcomment%2C+nome%2C+rating%7D&perspective=drafts";
fetch(urlComentario)
  .then(res => res.json())
  .then(data => {
    const comentarios = Array.isArray(data.result) ? data.result : [];
    const wrapper = document.querySelector(".swiper-comentarios .swiper-wrapper");
    if (!wrapper) return;
    wrapper.innerHTML = "";

    comentarios.forEach(c => {
const slide = document.createElement("div");
slide.className = "swiper-slide";

const card = document.createElement("div");
card.className = "container-avaliacoes";

const ratingVal = Number(c.rating) || 0;
const rating = "★".repeat(ratingVal) + "☆".repeat(5 - ratingVal);

// Monta o HTML do card
card.innerHTML = `
  <div class="header-comentario">
    <h4>${c.nome || 'Anônimo'}</h4>
    <div class="estrelas">${rating}</div>
  </div>
  <p>${c.comment || ''}</p>
`;

slide.appendChild(card);
wrapper.appendChild(slide);
    });

    // inicializa Swiper somente para o container de comentários
    if (typeof Swiper !== 'undefined') {
      new Swiper(".swiper-comentarios", {
        slidesPerView: 4,
        spaceBetween: 24,
        loop: true,
        autoplay: { delay: 3500, disableOnInteraction: false },
        breakpoints: {
        320: { slidesPerView: 1, spaceBetween: 16 },
        768: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 24 },
        1400: { slidesPerView: 4, spaceBetween: 24 }
        }
      });
    }
  })
  .catch(err => console.error("Erro ao carregar comentários do Sanity:", err));

//serviços
const urlServicos = "https://z39pk737.api.sanity.io/v2025-10-20/data/query/production?query=*[_type=='servicos']{descricao,'imagemUrl':simbolo.asset->url,titulo}&perspective=drafts";

fetch(urlServicos)
  .then(res => res.json())
  .then(data => {
    const icones = Array.isArray(data.result) ? data.result : [];
    const container = document.querySelector(".container-icones");
    if (!container) return;

    // Limpa o container antes
    container.innerHTML = "";

    icones.forEach((item, index) => {
      const link = document.createElement("a");
      link.href = "MicroBio-ultima-versao/src/servicos.html";
      link.classList.add("icone-link");

      // Cria o bloco principal
      const iconeDiv = document.createElement("div");
      iconeDiv.classList.add("icone");

      // Cria o círculo
      const circulo = document.createElement("div");
      circulo.classList.add(`circulo`);

      // Cria a imagem
      const img = document.createElement("img");
      img.src = item.imagemUrl || "";
      img.alt = item.titulo || "Ícone de serviço";

      // Adiciona imagem dentro do círculo
      circulo.appendChild(img);

      // Cria o título (descrição)
      const texto = document.createElement("p");
      texto.innerHTML = item.titulo || "Serviço";

      // Monta tudo
      iconeDiv.appendChild(circulo);
      iconeDiv.appendChild(texto);

       link.appendChild(iconeDiv);

      // Adiciona no container
      container.appendChild(link);
    });
  })
  .catch(err => console.error("Erro ao carregar ícones do Sanity:", err));

// novidades (notícias)
const urlNoticias = "https://z39pk737.api.sanity.io/v2025-11-03/data/query/production?query=*%0A%5B_type+%3D%3D+%27novidades%27%5D%0A%7Bdescricao%2C+%22imagemUrl%22%3A+imagem.asset-%3Eurl%2C+titulo%2C+subtitulo%2C+publicar%2C+link%7D%0A%0A%0A&perspective=drafts";

fetch(urlNoticias)
  .then(res => res.json())
  .then(data => {
    const noticias = Array.isArray(data.result) ? data.result : [];
    const container = document.querySelector(".container-noticias");

    if (!container) {
      console.error("Container de notícias não encontrado!");
      return;
    }

    container.innerHTML = ""; // limpa antes de renderizar

    noticias.forEach(noticia => {
     const targetUrl = (typeof noticia.link === 'string')
        ? noticia.link
        : (noticia.link && (noticia.link.url || noticia.link.href))
          ? (noticia.link.url || noticia.link.href)
          : null;
          const slugOrId = (noticia.slug && noticia.slug.current) ? noticia.slug.current : noticia._id;

      const link = document.createElement("a");
      if (targetUrl) {
        link.href = targetUrl;
        // se for externa (começa com http/https) abre em nova aba com segurança
        if (/^https?:\/\//i.test(targetUrl)) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
      } else {
        link.href = `novidades.html?slug=${encodeURIComponent(slugOrId)}`;
      }
      link.classList.add("bloco-link");

      // Cria bloco principal
      const bloco = document.createElement("div");
      bloco.classList.add("bloco-noticia");

      // Imagem
      const img = document.createElement("img");
      img.src = noticia.imagemUrl || "";
      img.alt = noticia.titulo || "Notícia";

      // Overlay
      const overlay = document.createElement("div");
      overlay.classList.add("overlay");

      const conteudo = document.createElement("div");
      conteudo.classList.add("conteudo-texto");

      const h2 = document.createElement("h2");
      h2.textContent = noticia.titulo || "Título";

      const h3 = document.createElement("h3");
      h3.textContent = noticia.subtitulo || "Subtítulo";

      conteudo.appendChild(h2);
      conteudo.appendChild(h3);
      overlay.appendChild(conteudo);

      // Monta bloco completo
      bloco.appendChild(img);
      bloco.appendChild(overlay);
      link.appendChild(bloco)

      // Adiciona no container
      if(noticia.publicar=== true){
        container.appendChild(link);
      }
    });
  })
  .catch(err => console.error("Erro ao carregar notícias do Sanity:", err));

(function() {
  const linhas = document.querySelector('.linhas');
  if (!linhas) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        linhas.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(linhas);
})();

//carrocel-formulario
const urlcarrocel = "https://z39pk737.api.sanity.io/v2025-11-04/data/query/production?query=*%0A%5B_type+%3D%3D+%22carrocel_formulario%22%5D%0A%7Bpublicar%2C+%22imagemUrl%22%3A+imagem.asset-%3Eurl%7D&perspective=drafts";

fetch(urlcarrocel)
  .then(res => res.json())
  .then(data => {
    const items = Array.isArray(data.result) ? data.result : [];
    const wrapper = document.querySelector(".swiper-carrocel-form .swiper-wrapper");
    if (!wrapper) return;
    wrapper.innerHTML = "";

    items.forEach(item => {
      if (item.publicar !== true) return;
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.innerHTML = `<div class="imagem"><img src="${item.imagemUrl || ''}" alt=""></div>`;
      wrapper.appendChild(slide);
    });

    if (typeof Swiper !== 'undefined') {
      new Swiper(".swiper-carrocel-form", {
        slidesPerView: 1,
        loop: true,
        centeredSlides: true,
        spaceBetween: 0,
        allowTouchMove: false,
        autoplay: { delay: 3500, disableOnInteraction: false }
      });
    }
  })
  .catch(err => console.error("Erro ao carregar carrossel do Sanity:", err));
//novidades.js (apenas se precisar de outro container)
const urlNovidades = "https://z39pk737.api.sanity.io/v2025-11-03/data/query/production?query=*%0A%5B_type+%3D%3D+%27novidades%27%5D%0A%7Bdescricao%2C+%22imagemUrl%22%3A+imagem.asset-%3Eurl%2C+titulo%2C+subtitulo%2C+publicar%2C+link%2C+slug%7D%0A%0A%0A&perspective=drafts";

fetch(urlNovidades)
  .then(res => res.json())
  .then(data => {
    const novidades = Array.isArray(data.result) ? data.result : [];
    const container = document.querySelector(".noticias-secao");

    if (!container) {
      console.error("Container de novidades não encontrado!");
      return;
    }

    container.innerHTML = ""; // limpa antes de renderizar

    novidades.forEach(item => {
      // define o link de destino
      const targetUrl = (typeof item.link === 'string')
        ? item.link
        : (item.link && (item.link.url || item.link.href))
          ? (item.link.url || item.link.href)
          : null;

      const slugOrId = (item.slug && item.slug.current) ? item.slug.current : item._id;

      const link = document.createElement("a");
      if (targetUrl) {
        link.href = targetUrl;
        // se for link externo abre em nova aba com segurança
        if (/^https?:\/\//i.test(targetUrl)) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
      } else {
        link.href = `novidades.html?slug=${encodeURIComponent(slugOrId)}`;
      }
      link.classList.add("bloco-link");

      // cria o bloco principal
      const bloco = document.createElement("div");
      bloco.classList.add("bloco-noticia");

      // imagem
      const img = document.createElement("img");
      img.src = item.imagemUrl || "";
      img.alt = item.titulo || "Notícia";

      // overlay
      const overlay = document.createElement("div");
      overlay.classList.add("overlay");

      const conteudo = document.createElement("div");
      conteudo.classList.add("conteudo-texto");

      const h2 = document.createElement("h2");
      h2.textContent = item.titulo || "Título";

      const h3 = document.createElement("h3");
      h3.textContent = item.subtitulo || "Subtítulo";

      const p = document.createElement("p");
      p.textContent = item.descricao || "";

      conteudo.appendChild(h2);
      conteudo.appendChild(h3);
      conteudo.appendChild(p);
      overlay.appendChild(conteudo);

      // monta tudo
      bloco.appendChild(img);
      bloco.appendChild(overlay);
      link.appendChild(bloco);

      // adiciona no container
      container.appendChild(link);
    });
  })
  .catch(err => console.error("Erro ao carregar novidades do Sanity:", err));
    //servicos.js

     const url = "https://z39pk737.api.sanity.io/v2025-10-20/data/query/production?query=*[_type=='servicos']{descricao,'imagemUrl':simbolo.asset->url,titulo}&perspective=drafts";

fetch(url)
  .then(res => res.json())
  .then(data => {
    const servicos = data.result;
    const container = document.querySelector(".cards-servicos");

    servicos.forEach(s => {
      // Cria o card
      const card = document.createElement("div");
      card.classList.add("card-servicos");

      // Título
      const titulo = document.createElement("h4");
      titulo.textContent = s.titulo || "Serviço";

      // Descrição
      const descricao = document.createElement("p");
      descricao.textContent = s.descricao || "Descrição não disponível.";

      // Monta o card
      card.appendChild(titulo);
      card.appendChild(descricao);

      // Adiciona no container
      container.appendChild(card);
    });
  })
  .catch(err => console.error("Erro ao carregar serviços do Sanity:", err));
     (function() {
    const linhas = document.querySelector('.linhas');
    if (!linhas) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          linhas.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(linhas);
  })();

  //formulario
const formAvaliacao = document.querySelector(".avaliacao");
if (formAvaliacao) {
  formAvaliacao.addEventListener("submit", function(e) {
    e.preventDefault();

    const nome = document.getElementById("usuario-nome").value;
    const email = document.getElementById("usuario-email").value;
    const telefone = document.getElementById("usuario-telefone").value;
    const mensagem = document.getElementById("usuario-descricao").value;
    const avaliacao = document.querySelector('input[name="avaliacao"]:checked')?.value || "Não avaliado";

    if (!nome || !email || !mensagem || !telefone || avaliacao === "Não avaliado") {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    // Inicializa EmailJS se ainda não estiver
    if (!emailjs._init) {
      emailjs.init("WAB4qtpKvI9nd2Zee");
    }

    emailjs.send("service_s5wdpg9", "template_sn8qfky", {
      from_name: nome,
      from_email: email,
      from_phone: telefone,
      message: mensagem,
      rating: avaliacao
    })
    .then(() => {
      alert("Mensagem enviada com sucesso!");
      formAvaliacao.reset();
    })
    .catch((error) => {
      console.error("Erro:", error);
      alert("Ocorreu um erro ao enviar a mensagem. Tente novamente.");
    });
  });
}


// FORMULÁRIO DE SERVIÇOS (sem estrelas)
const formContato = document.getElementById("formContato");
if (formContato) {
  formContato.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    if (!nome || !email || !telefone || !mensagem) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (!emailjs._init) {
      emailjs.init("WAB4qtpKvI9nd2Zee");
    }

    emailjs.send("service_s5wdpg9", "template_f2i8ufk", {
      from_name: nome,
      from_email: email,
      from_phone: telefone,
      message: mensagem,
    })
    .then(() => {
      alert("Mensagem enviada com sucesso! ✅");
      formContato.reset();
    })
    .catch((error) => {
      console.error("Erro ao enviar:", error);
      alert("Ocorreu um erro ao enviar sua mensagem. Tente novamente.");
    });
  });
}
