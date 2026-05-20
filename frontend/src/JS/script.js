
import { obtenerUsuarioAutenticado } from "../api/authApi.js";
import { buscarTmdb, buscarAnime, guardarContenidoExterno } from "../api/catalogoApi.js";
import { apiRequest } from "../api/api.js";
 
const API_URL = "https://homiewood.onrender.com/api";
 
let usuarioActual = null;
let selectedFilm = null;
 
// ===============================
// INIT
// ===============================
 
document.addEventListener("DOMContentLoaded", async function () {
    console.log("script.js cargado correctamente");
 
    await cargarUsuarioLogueado();
    inicializarBuscadorPeliculas();
    inicializarPublicador();
    inicializarNavbar();
    await cargarFeed();
});
 
// ===============================
// USUARIO LOGUEADO
// ===============================
 
async function cargarUsuarioLogueado() {
    const token = localStorage.getItem("token");
    const usuarioGuardado = localStorage.getItem("usuario");
    const nombreUsuario = document.getElementById("navbar-username");
 
    if (!token) {
        console.warn("No hay token. Redirigiendo al login.");
        window.location.href = "login.html";
        return;
    }
 
    if (usuarioGuardado) {
        usuarioActual = JSON.parse(usuarioGuardado);
        if (nombreUsuario) {
            nombreUsuario.textContent = `@${usuarioActual.username || usuarioActual.nombre || "Usuario"}`;
        }
        return;
    }
 
    try {
        const usuario = await obtenerUsuarioAutenticado();
        usuarioActual = usuario;
        localStorage.setItem("usuario", JSON.stringify(usuario));
        if (nombreUsuario) {
            nombreUsuario.textContent = `@${usuario.username || usuario.nombre || "Usuario"}`;
        }
    } catch (error) {
        console.error("Error cargando usuario:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        window.location.href = "login.html";
    }
}
 
function obtenerNombreUsuarioActual() {
    return usuarioActual?.username || usuarioActual?.nombre || "Usuario";
}
 
function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "login.html";
}
 
// ===============================
// UTILIDADES
// ===============================
 
function timeNow() {
    return new Date().toLocaleString("es-CL", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    });
}
 
function tagClass(tag) {
    const blue   = ["Anime", "Sci-Fi", "Misterio", "SERIE", "Serie"];
    const yellow = ["TV Show", "Aventura", "Acción", "Fantasía"];
    const teal   = ["Película", "PELICULA", "Drama", "Romance"];
    if (blue.includes(tag))   return "tag-blue";
    if (yellow.includes(tag)) return "tag-yellow";
    if (teal.includes(tag))   return "tag-teal";
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
// FEED DESDE BACKEND
// ===============================
 
async function cargarFeed() {
    try {
        const calificaciones = await apiRequest("/calificaciones");
        const feed = document.getElementById("feed");
        if (!feed) return;
        feed.innerHTML = calificaciones.map(c => renderCalificacion(c)).join("");
    } catch (e) {
        console.log("Error cargando feed:", e);
    }
}
 
function renderCalificacion(c) {
    const fecha = c.fechaCalificacion ? c.fechaCalificacion.split("T")[0] : "";
    const tipo  = c.tipoContenido || "Contenido";
 
    return `
    <div class="post-card" id="post-${c.idCalificacion}">
        <div class="timestamp">${fecha}</div>
 
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <div class="username">
                <div class="user-icon">👤</div>
                ${escapeHtml(c.username || c.nombreUsuario)}
            </div>
            <div class="d-flex gap-2 flex-wrap">
                <span class="tag ${tagClass(tipo)}">${escapeHtml(tipo)}</span>
            </div>
        </div>
 
        <div class="d-flex gap-3">
            <div class="post-thumb" style="background:linear-gradient(135deg,#2a1a4a,#5a2a8a)">
                ${escapeHtml(c.tituloContenido)}
            </div>
            <p class="post-text mb-0">${escapeHtml(c.comentario || "")}</p>
        </div>
 
        <div class="post-actions">
            <button>
                <img src="../img/postlike.webp" alt="Me gustó" width="50px" class="glow-image">
                <span>0</span>
            </button>
            <button>
                <img src="../img/postdislike.webp" alt="No me gustó" width="50px" class="glow-image">
                <span>0</span>
            </button>
        </div>
 
        <button class="comment-toggle" onclick="toggleComments(${c.idCalificacion})">
            <img src="../img/hamstercomment.webp" alt="Comentar" width="40px">
            0 comentarios
        </button>
 
        <div class="comment-section" id="comments-${c.idCalificacion}">
            <div class="comment-list" id="comment-list-${c.idCalificacion}"></div>
            <div class="comment-input-row">
                <input type="text" id="comment-input-${c.idCalificacion}"
                       placeholder="Escribe un comentario..."
                       onkeydown="if(event.key==='Enter') addComment(${c.idCalificacion})">
                <button onclick="addComment(${c.idCalificacion})">Comentar</button>
            </div>
        </div>
    </div>`;
}
 
// ===============================
// COMENTARIOS
// ===============================
 
function toggleComments(id) {
    const section = document.getElementById(`comments-${id}`);
    if (!section) return;
    section.classList.toggle("open");
}
 
function renderComment(comment) {
    return `
    <div class="comment">
        <div class="c-avatar">👤</div>
        <div>
            <div class="c-name">${escapeHtml(comment.user)}</div>
            <div class="c-text">${escapeHtml(comment.text)}</div>
            <div class="c-time">${escapeHtml(comment.time)}</div>
        </div>
    </div>`;
}
 
function addComment(id) {
    const input = document.getElementById(`comment-input-${id}`);
    if (!input) return;
 
    const text = input.value.trim();
    if (!text) return;
 
    const comment = {
        user: obtenerNombreUsuarioActual(),
        text: text,
        time: "ahora mismo"
    };
 
    const list = document.getElementById(`comment-list-${id}`);
    if (list) {
        list.insertAdjacentHTML("beforeend", renderComment(comment));
    }
 
    const toggle = document.querySelector(`#post-${id} .comment-toggle`);
    if (toggle) {
        const count = list ? list.querySelectorAll(".comment").length : 1;
        toggle.innerHTML = `<img src="../img/hamstercomment.webp" alt="Comentar" width="40px"> ${count} comentario${count !== 1 ? "s" : ""}`;
    }
 
    input.value = "";
    input.focus();
}
 
// ===============================
// BUSCADOR DE PELÍCULAS/SERIES
// ===============================
 
function inicializarBuscadorPeliculas() {

    const filmSearchInput = document.getElementById("filmSearchInput");
    const filmDropdown    = document.getElementById("filmDropdown");
 
    if (!filmSearchInput || !filmDropdown) return;
 
    let searchTimeout = null;

    
 
    filmSearchInput.addEventListener("input", () => {
        const q = filmSearchInput.value.trim();
        if (!q) { filmDropdown.classList.remove("open"); return; }
 
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            try {
                const [tmdb, anime] = await Promise.allSettled([
                    buscarTmdb(q),
                    buscarAnime(q)
                ]);

                console.log("TMDB:", tmdb);
                console.log("Anime:", anime);


 
                const resultados = [
                    ...(tmdb.status  === "fulfilled" ? tmdb.value  : []),
                    ...(anime.status === "fulfilled" ? anime.value : []),
                ];
 
                if (!resultados.length) { filmDropdown.classList.remove("open"); return; }
 
                filmDropdown._data = resultados;
                filmDropdown.innerHTML = resultados.map((f, i) => `
                    <div class="film-option" data-index="${i}">
                        <div class="mini-cover" style="background:linear-gradient(135deg,#2a1a4a,#5a2a8a); overflow:hidden; padding:0">
                            ${f.posterUrl
                                ? `<img src="${f.posterUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:6px">`
                                : `<span style="font-size:0.7rem;padding:4px">${escapeHtml(f.titulo)}</span>`}
                        </div>
                        <div>
                            <div>${escapeHtml(f.titulo)}</div>
                            <div class="film-meta">${escapeHtml(f.tipoContenido || "")} ${f.anioEstreno ? "· " + f.anioEstreno : ""}</div>
                        </div>
                    </div>`).join("");
 
                filmDropdown.classList.add("open");
            } catch (e) {
                console.log("Error buscando:", e);
            }
        }, 400);
    });
 
    filmDropdown.addEventListener("click", e => {
        const option = e.target.closest(".film-option");
        if (!option) return;
        const f = filmDropdown._data[parseInt(option.dataset.index)];
        selectFilm({
            title:     f.titulo,
            type:      f.tipoContenido || "Contenido",
            tags:      [f.tipoContenido || "Contenido"],
            grad:      "linear-gradient(135deg,#2a1a4a,#5a2a8a)",
            posterUrl: f.posterUrl || null,
            apiId:     f.apiId,
            proveedor: f.proveedor,
        });
    });
 
    document.addEventListener("click", e => {
        if (!e.target.closest("#filmSearchWrap")) filmDropdown.classList.remove("open");
    });
}
 
function selectFilm(film) {
    selectedFilm = film;
 
    const filmSearchInput = document.getElementById("filmSearchInput");
    const filmDropdown    = document.getElementById("filmDropdown");
    const selectedFilmEl  = document.getElementById("selectedFilm");
    const selectedCoverEl = document.getElementById("selectedCover");
    const selectedTitleEl = document.getElementById("selectedTitle");
    const selectedMetaEl  = document.getElementById("selectedMeta");
    const filmSearchWrap  = document.getElementById("filmSearchWrap");
 
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
    selectedMetaEl.textContent  = film.type;
 
    document.getElementById("selectedTags").innerHTML = film.tags
        .map(t => `<span class="tag ${tagClass(t)}" style="font-size:0.72rem;padding:2px 10px">${escapeHtml(t)}</span>`)
        .join("");
 
    filmSearchWrap.style.display = "none";
    selectedFilmEl.classList.add("show");
    checkPostReady();
}
 
// ===============================
// PUBLICAR POST
// ===============================
 
function inicializarPublicador() {
    const postText    = document.getElementById("postText");
    const postBtn     = document.getElementById("postBtn");
    const removeFilm  = document.getElementById("removeFilm");
 
    if (!postText || !postBtn) return;
 
    postText.addEventListener("input", checkPostReady);
 
    postBtn.addEventListener("click", async () => {
        console.log("selectedFilm:", selectedFilm);
        try {
            const contenido = await guardarContenidoExterno({
                proveedor:     selectedFilm.proveedor,
                apiId:         selectedFilm.apiId,
                titulo:        selectedFilm.title,
                tipoContenido: selectedFilm.type,
                posterUrl:     selectedFilm.posterUrl,
            });
 
            const usuario = await obtenerUsuarioAutenticado();
            await apiRequest("/calificaciones", {
                method: "POST",
                body: JSON.stringify({
                    idUsuario:   usuario.idUsuario,
                    idContenido: contenido.idContenido,
                    puntaje:     3,
                    comentario:  postText.value.trim(),
                })
            });
 
            postText.value = "";
            if (removeFilm) removeFilm.click();
            checkPostReady();
            await cargarFeed();
 
        } catch (e) {
            console.log("Error al postear:", e);
        }
    });
 
    if (removeFilm) {
        removeFilm.addEventListener("click", () => {
            selectedFilm = null;
            const selectedFilmEl = document.getElementById("selectedFilm");
            const filmSearchWrap = document.getElementById("filmSearchWrap");
            const filmSearchInput = document.getElementById("filmSearchInput");
            selectedFilmEl.classList.remove("show");
            filmSearchWrap.style.display = "";
            if (filmSearchInput) filmSearchInput.value = "";
            checkPostReady();
        });
    }
}
 
function checkPostReady() {
    const postText = document.getElementById("postText");
    const postBtn  = document.getElementById("postBtn");
    if (!postText || !postBtn) return;
    postBtn.disabled = !(selectedFilm && postText.value.trim());
}
 
// ===============================
// NAVBAR
// ===============================


 
function inicializarNavbar() {
    const menuBtn = document.getElementById("menuBtn");
    const drawer  = document.getElementById("drawer");
 
    if (menuBtn && drawer) {
        menuBtn.addEventListener("click", () => {
            drawer.classList.toggle("open");
            menuBtn.textContent = drawer.classList.contains("open") ? "✕" : "☰";
        });
    }
 
    document.querySelectorAll(".bottom-nav button").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".bottom-nav button").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });
}

window.toggleComments = toggleComments;
window.addComment = addComment;
window.cerrarSesion = cerrarSesion;
window.cargarFeed = cargarFeed;