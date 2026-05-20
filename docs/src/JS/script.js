const API_URL = "http://localhost:8080/api";

let usuarioActual = null;
let posts = [];
let nextId = 1;
let selectedFilm = null;

// ===============================
// INIT
// ===============================

document.addEventListener("DOMContentLoaded", async function () {
    console.log("script.js cargado correctamente");

    await cargarUsuarioLogueado();

    inicializarDatosPrueba();
    inicializarBuscadorPeliculas();
    inicializarPublicador();
    inicializarNavbar();

    renderFeed();
});

// ===============================
// USUARIO LOGUEADO
// ===============================

async function cargarUsuarioLogueado() {
    const token = localStorage.getItem("token");
    const usuarioGuardado = localStorage.getItem("usuario");
    const nombreUsuario = document.getElementById("nombreUsuario");

    if (!nombreUsuario) {
        console.error("No existe el elemento id='nombreUsuario' en home.html");
        return;
    }

    if (!token) {
        console.warn("No hay token en localStorage. Redirigiendo al login.");
        window.location.href = "login.html";
        return;
    }

    if (usuarioGuardado) {
        usuarioActual = JSON.parse(usuarioGuardado);
        nombreUsuario.textContent = `@${usuarioActual.username || usuarioActual.nombre || "Usuario"}`;
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            window.location.href = "login.html";
            return;
        }

        usuarioActual = await response.json();

        localStorage.setItem("usuario", JSON.stringify(usuarioActual));
        nombreUsuario.textContent = `@${usuarioActual.username || usuarioActual.nombre || "Usuario"}`;

    } catch (error) {
        console.error("Error cargando usuario:", error);
        nombreUsuario.textContent = "Usuario";
    }
}

function obtenerNombreUsuarioActual() {
    if (!usuarioActual) {
        return "Usuario";
    }

    return usuarioActual.username || usuarioActual.nombre || "Usuario";
}

function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "login.html";
}

// ===============================
// CATALOGO LOCAL DE PRUEBA
// ===============================

const FILMS = [
    { title: "One Piece", type: "Anime", tags: ["Anime", "Aventura"], grad: "linear-gradient(135deg,#ff8c00,#c22000)" },
    { title: "Attack on Titan", type: "Anime", tags: ["Anime", "Acción"], grad: "linear-gradient(135deg,#4a3000,#8b5a00)" },
    { title: "Demon Slayer", type: "Anime", tags: ["Anime", "Acción"], grad: "linear-gradient(135deg,#003a6b,#c0392b)" },
    { title: "Breaking Bad", type: "TV Show", tags: ["TV Show", "Drama"], grad: "linear-gradient(135deg,#1a3a00,#5a8a00)" },
    { title: "The Last of Us", type: "TV Show", tags: ["TV Show", "Drama"], grad: "linear-gradient(135deg,#2a1a00,#7a5a00)" },
    { title: "Stranger Things", type: "TV Show", tags: ["TV Show", "Sci-Fi"], grad: "linear-gradient(135deg,#0a0a2a,#4a0080)" },
    { title: "Interstellar", type: "Película", tags: ["Película", "Sci-Fi"], grad: "linear-gradient(135deg,#000820,#1a4080)" },
    { title: "The Dark Knight", type: "Película", tags: ["Película", "Acción"], grad: "linear-gradient(135deg,#0a0a0a,#1a1a3a)" },
    { title: "Spider-Man: No Way Home", type: "Película", tags: ["Película", "Acción"], grad: "linear-gradient(135deg,#0a1a6b,#c0392b)" },
    { title: "Oppenheimer", type: "Película", tags: ["Película", "Drama"], grad: "linear-gradient(135deg,#1a0a00,#8b4500)" },
    { title: "Your Name", type: "Anime", tags: ["Anime", "Romance"], grad: "linear-gradient(135deg,#1a0050,#c050a0)" },
    { title: "Naruto", type: "Anime", tags: ["Anime", "Aventura"], grad: "linear-gradient(135deg,#ff6b00,#ffd700)" },
    { title: "House of the Dragon", type: "TV Show", tags: ["TV Show", "Fantasía"], grad: "linear-gradient(135deg,#3a0000,#8b0000)" },
    { title: "Severance", type: "TV Show", tags: ["TV Show", "Misterio"], grad: "linear-gradient(135deg,#002a3a,#005a7a)" },
    { title: "Dune", type: "Película", tags: ["Película", "Sci-Fi"], grad: "linear-gradient(135deg,#3a2800,#8b6a00)" }
];

// ===============================
// DATOS DE PRUEBA
// ===============================

function inicializarDatosPrueba() {
    const seedPost = {
        id: 0,
        user: "FABIANX",
        text: "Homies, veamos esta serie en mi casa?? XD quien se anota?!",
        film: FILMS[0],
        tags: ["Anime", "Aventura"],
        likes: 25,
        reactions: 45,
        liked: false,
        time: "20 Jul 2025 14:58",
        comments: [
            { user: "MARIAV", text: "Yoo me anoto!! A que hora nos juntamos?", time: "hace 2 horas" },
            { user: "PEDRITO", text: "Mejor vemos Naruto jaja", time: "hace 1 hora" }
        ]
    };

    posts = [seedPost];
    nextId = 1;
}

// ===============================
// UTILIDADES
// ===============================

function timeNow() {
    return new Date().toLocaleString("es-CL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function tagClass(tag) {
    const blue = ["Anime", "Sci-Fi", "Misterio"];
    const yellow = ["TV Show", "Aventura", "Acción", "Fantasía"];
    const teal = ["Película", "Drama", "Romance"];

    if (blue.includes(tag)) return "tag-blue";
    if (yellow.includes(tag)) return "tag-yellow";
    if (teal.includes(tag)) return "tag-teal";

    return "tag-blue";
}

function escapeHtml(texto) {
    return String(texto ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// ===============================
// CONVERTIR RESULTADOS DE API
// ===============================

function convertirTipoApi(tipoContenido, proveedor) {
    const proveedorNormalizado = String(proveedor || "").toUpperCase();
    const tipoNormalizado = String(tipoContenido || "").toUpperCase();

    if (proveedorNormalizado === "JIKAN") {
        return "Anime";
    }

    if (tipoNormalizado === "PELICULA") {
        return "Película";
    }

    if (tipoNormalizado === "SERIE") {
        return "TV Show";
    }

    return tipoContenido || "Contenido";
}

function convertirResultadoApiAFilm(item) {
    const proveedor = item.proveedor || item.provider || item.apiProvider || "API";
    const apiId = item.apiId || item.id || item.malId || item.tmdbId;
    const titulo = item.titulo || item.title || item.name || "Sin título";
    const tipoContenido = item.tipoContenido || item.mediaType || item.type;
    const tipo = convertirTipoApi(tipoContenido, proveedor);

    const tags = [];

    if (String(proveedor).toUpperCase() === "JIKAN") {
        tags.push("Anime");
    } else {
        tags.push(tipo);
    }

    if (item.anioEstreno) {
        tags.push(String(item.anioEstreno));
    }

    return {
        title: titulo,
        type: tipo,
        tags: tags,
        grad: "linear-gradient(135deg,#2a1a3a,#6a4c93)",
        posterUrl: item.posterUrl || item.imageUrl || item.coverUrl,
        source: "API",
        proveedor: proveedor,
        apiId: apiId,
        descripcion: item.descripcion || item.overview || item.synopsis,
        fechaEstreno: item.fechaEstreno || item.releaseDate || item.airedFrom,
        anioEstreno: item.anioEstreno || item.year,
        idiomaOriginal: item.idiomaOriginal || item.originalLanguage,
        puntajeExterno: item.puntajeExterno || item.voteAverage || item.score
    };
}

async function buscarCatalogoApi(query) {
    try {
        const token = localStorage.getItem("token");

        const headers = {};

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/catalogo/buscar?query=${encodeURIComponent(query)}`, {
            method: "GET",
            headers: headers
        });

        console.log("Respuesta API catálogo:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error API catálogo:", errorText);
            return [];
        }

        const data = await response.json();

        console.log("Resultados API:", data);

        return data
            .map(convertirResultadoApiAFilm)
            .slice(0, 8);

    } catch (error) {
        console.error("Error buscando catálogo externo:", error);
        return [];
    }
}

function renderMiniCover(film) {
    if (film.posterUrl) {
        return `
            <div 
                class="mini-cover" 
                style="
                    background-image:url('${film.posterUrl}');
                    background-size:cover;
                    background-position:center;
                "
            ></div>
        `;
    }

    return `
        <div class="mini-cover" style="background:${film.grad}">
            ${escapeHtml(film.title)}
        </div>
    `;
}

// ===============================
// RENDER COMENTARIOS
// ===============================

function renderComment(comment) {
    return `
        <div class="comment">
            <div class="c-avatar">👤</div>
            <div>
                <div class="c-name">${escapeHtml(comment.user)}</div>
                <div class="c-text">${escapeHtml(comment.text)}</div>
                <div class="c-time">${escapeHtml(comment.time)}</div>
            </div>
        </div>
    `;
}

// ===============================
// RENDER POSTS
// ===============================

function renderPost(post) {
    const tagsHtml = post.tags
        .map(tag => `<span class="tag ${tagClass(tag)}">${escapeHtml(tag)}</span>`)
        .join("");

    const commentsHtml = post.comments
        .map(renderComment)
        .join("");

    const commentCount = post.comments.length;

    const posterStyle = post.film.posterUrl
        ? `background-image:url('${post.film.posterUrl}'); background-size:cover; background-position:center;`
        : `background:${post.film.grad}`;

    const posterText = post.film.posterUrl ? "" : escapeHtml(post.film.title);

    return `
        <div class="post-card" id="post-${post.id}">
            <div class="timestamp">${escapeHtml(post.time)}</div>

            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <div class="username">
                    <div class="user-icon">👤</div>
                    ${escapeHtml(post.user)}
                </div>

                <div class="d-flex gap-2 flex-wrap">
                    ${tagsHtml}
                </div>
            </div>

            <div class="d-flex gap-3">
                <div class="post-thumb" style="${posterStyle}">
                    ${posterText}
                </div>

                <p class="post-text mb-0">
                    ${escapeHtml(post.text)}
                </p>
            </div>

            <div class="post-actions">
                <button onclick="likePost(${post.id})" id="like-${post.id}" class="${post.liked ? "liked" : ""}">
                    <img src="../img/postlike.webp" alt="Me gustó" width="50px" class="glow-image">
                    <span id="likes-${post.id}">${post.likes}</span>
                </button>

                <button onclick="dislikePost(${post.id})">
                    <img src="../img/postdislike.webp" alt="No me gustó" width="50px" class="glow-image">
                    <span id="reactions-${post.id}">${post.reactions}</span>
                </button>
            </div>

            <button class="comment-toggle" onclick="toggleComments(${post.id})">
                💬 ${commentCount} comentario${commentCount !== 1 ? "s" : ""} — ver / comentar
            </button>

            <div class="comment-section" id="comments-${post.id}">
                <div class="comment-list" id="comment-list-${post.id}">
                    ${commentsHtml}
                </div>

                <div class="comment-input-row">
                    <input 
                        type="text" 
                        id="comment-input-${post.id}" 
                        placeholder="Escribe un comentario..."
                        onkeydown="if(event.key === 'Enter') addComment(${post.id})"
                    >

                    <button onclick="addComment(${post.id})">
                        Comentar
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderFeed() {
    const feed = document.getElementById("feed");

    if (!feed) {
        console.error("No existe el contenedor id='feed'");
        return;
    }

    feed.innerHTML = posts.map(renderPost).join("");
}

// ===============================
// LIKE / DISLIKE
// ===============================

function likePost(id) {
    const post = posts.find(post => post.id === id);

    if (!post) return;

    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;

    const likesElement = document.getElementById(`likes-${id}`);
    const likeButton = document.getElementById(`like-${id}`);

    if (likesElement) {
        likesElement.textContent = post.likes;
    }

    if (likeButton) {
        likeButton.classList.toggle("liked", post.liked);
    }
}

function dislikePost(id) {
    const post = posts.find(post => post.id === id);

    if (!post) return;

    post.reactions++;

    const reactionsElement = document.getElementById(`reactions-${id}`);

    if (reactionsElement) {
        reactionsElement.textContent = post.reactions.toLocaleString();
    }
}

// ===============================
// COMENTARIOS
// ===============================

function toggleComments(id) {
    const section = document.getElementById(`comments-${id}`);

    if (!section) return;

    section.classList.toggle("open");
}

function addComment(id) {
    const input = document.getElementById(`comment-input-${id}`);

    if (!input) return;

    const text = input.value.trim();

    if (!text) return;

    const post = posts.find(post => post.id === id);

    if (!post) return;

    const comment = {
        user: obtenerNombreUsuarioActual(),
        text: text,
        time: "ahora mismo"
    };

    post.comments.push(comment);

    const list = document.getElementById(`comment-list-${id}`);

    if (list) {
        list.insertAdjacentHTML("beforeend", renderComment(comment));
    }

    const count = post.comments.length;
    const toggle = document.querySelector(`#post-${id} .comment-toggle`);

    if (toggle) {
        toggle.textContent = `💬 ${count} comentario${count !== 1 ? "s" : ""} — ver / comentar`;
    }

    input.value = "";
    input.focus();
}

// ===============================
// BUSCADOR DE PELICULAS: LOCAL + API
// ===============================

function inicializarBuscadorPeliculas() {
    const filmSearchInput = document.getElementById("filmSearchInput");
    const filmDropdown = document.getElementById("filmDropdown");

    if (!filmSearchInput || !filmDropdown) {
        console.error("No existe filmSearchInput o filmDropdown");
        return;
    }

    let timeoutBusqueda = null;

    filmSearchInput.addEventListener("input", function () {
        const query = filmSearchInput.value.trim().toLowerCase();

        clearTimeout(timeoutBusqueda);

        timeoutBusqueda = setTimeout(async function () {
            console.log("Buscando:", query);

            if (!query) {
                filmDropdown.classList.remove("open");
                filmDropdown.innerHTML = "";
                return;
            }

            const resultadosLocales = FILMS
                .filter(film => film.title.toLowerCase().includes(query))
                .map(film => ({
                    ...film,
                    source: "LOCAL"
                }));

            const resultadosApi = await buscarCatalogoApi(query);

            const resultadosCombinados = [
                ...resultadosLocales,
                ...resultadosApi
            ];

            console.log("Locales:", resultadosLocales);
            console.log("API:", resultadosApi);
            console.log("Combinados:", resultadosCombinados);

            if (resultadosCombinados.length === 0) {
                filmDropdown.classList.remove("open");
                filmDropdown.innerHTML = "";
                return;
            }

            filmDropdown.innerHTML = resultadosCombinados.map((film, index) => `
                <div class="film-option" data-index="${index}">
                    ${renderMiniCover(film)}

                    <div>
                        <div>${escapeHtml(film.title)}</div>
                        <div class="film-meta">
                            ${escapeHtml(film.type)}
                            ${film.source === "API" ? "• API" : "• Ejemplo"}
                        </div>
                    </div>
                </div>
            `).join("");

            filmDropdown.dataset.resultados = JSON.stringify(resultadosCombinados);
            filmDropdown.classList.add("open");

        }, 400);
    });

    filmDropdown.addEventListener("click", function (event) {
        const option = event.target.closest(".film-option");

        if (!option) return;

        const resultados = JSON.parse(filmDropdown.dataset.resultados || "[]");
        const film = resultados[parseInt(option.dataset.index)];

        if (!film) return;

        selectFilm(film);
    });

    document.addEventListener("click", function (event) {
        if (!event.target.closest("#filmSearchWrap")) {
            filmDropdown.classList.remove("open");
        }
    });
}

function selectFilm(film) {
    selectedFilm = film;

    const filmSearchInput = document.getElementById("filmSearchInput");
    const filmDropdown = document.getElementById("filmDropdown");
    const selectedFilmEl = document.getElementById("selectedFilm");
    const selectedCoverEl = document.getElementById("selectedCover");
    const selectedTitleEl = document.getElementById("selectedTitle");
    const selectedMetaEl = document.getElementById("selectedMeta");
    const selectedTagsEl = document.getElementById("selectedTags");
    const filmSearchWrap = document.getElementById("filmSearchWrap");

    filmSearchInput.value = "";
    filmDropdown.classList.remove("open");

    selectedCoverEl.textContent = "";
    selectedCoverEl.style.background = "";
    selectedCoverEl.style.backgroundImage = "";

    if (film.posterUrl) {
        selectedCoverEl.style.backgroundImage = `url('${film.posterUrl}')`;
        selectedCoverEl.style.backgroundSize = "cover";
        selectedCoverEl.style.backgroundPosition = "center";
    } else {
        selectedCoverEl.style.background = film.grad;
        selectedCoverEl.textContent = film.title;
    }

    selectedTitleEl.textContent = film.title;
    selectedMetaEl.textContent = `${film.type} ${film.source === "API" ? "• API" : "• Ejemplo"}`;

    selectedTagsEl.innerHTML = film.tags
        .map(tag => `<span class="tag ${tagClass(tag)}" style="font-size:0.72rem;padding:2px 10px">${escapeHtml(tag)}</span>`)
        .join("");

    filmSearchWrap.style.display = "none";
    selectedFilmEl.classList.add("show");

    checkPostReady();
}

// ===============================
// PUBLICAR POST
// ===============================

function inicializarPublicador() {
    const postText = document.getElementById("postText");
    const postBtn = document.getElementById("postBtn");
    const removeFilmBtn = document.getElementById("removeFilm");

    if (!postText || !postBtn) {
        console.error("No existe postText o postBtn");
        return;
    }

    postText.addEventListener("input", checkPostReady);

    postBtn.addEventListener("click", function () {
        if (!selectedFilm || !postText.value.trim()) {
            return;
        }

        const newPost = {
            id: nextId++,
            user: obtenerNombreUsuarioActual(),
            text: postText.value.trim(),
            film: selectedFilm,
            tags: [...selectedFilm.tags],
            likes: 0,
            reactions: 0,
            liked: false,
            time: timeNow(),
            comments: []
        };

        posts.unshift(newPost);
        renderFeed();

        postText.value = "";

        if (removeFilmBtn) {
            removeFilmBtn.click();
        }

        checkPostReady();
    });

    if (removeFilmBtn) {
        removeFilmBtn.addEventListener("click", function () {
            selectedFilm = null;

            const selectedFilmEl = document.getElementById("selectedFilm");
            const filmSearchWrap = document.getElementById("filmSearchWrap");
            const filmSearchInput = document.getElementById("filmSearchInput");

            selectedFilmEl.classList.remove("show");
            filmSearchWrap.style.display = "";
            filmSearchInput.value = "";

            checkPostReady();
        });
    }
}

function checkPostReady() {
    const postText = document.getElementById("postText");
    const postBtn = document.getElementById("postBtn");

    if (!postText || !postBtn) return;

    postBtn.disabled = !(selectedFilm && postText.value.trim());
}

// ===============================
// NAVBAR
// ===============================

function inicializarNavbar() {
    const menuBtn = document.getElementById("menuBtn");
    const drawer = document.getElementById("drawer");

    if (menuBtn && drawer) {
        menuBtn.addEventListener("click", function () {
            drawer.classList.toggle("open");
            menuBtn.textContent = drawer.classList.contains("open") ? "✕" : "☰";
        });
    }

    document.querySelectorAll(".bottom-nav button").forEach(button => {
        button.addEventListener("click", function () {
            document.querySelectorAll(".bottom-nav button").forEach(item => item.classList.remove("active"));
            button.classList.add("active");
        });
    });
}