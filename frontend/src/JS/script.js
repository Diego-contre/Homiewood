
    // CATALOGO DE PRUEBA (title, type, gradient)
    const FILMS = [
      { title: 'One Piece', type: 'Anime', tags: ['Anime', 'Aventura'], grad: 'linear-gradient(135deg,#ff8c00,#c22000)' },
      { title: 'Attack on Titan', type: 'Anime', tags: ['Anime', 'Acción'], grad: 'linear-gradient(135deg,#4a3000,#8b5a00)' },
      { title: 'Demon Slayer', type: 'Anime', tags: ['Anime', 'Acción'], grad: 'linear-gradient(135deg,#003a6b,#c0392b)' },
      { title: 'Breaking Bad', type: 'TV Show', tags: ['TV Show', 'Drama'], grad: 'linear-gradient(135deg,#1a3a00,#5a8a00)' },
      { title: 'The Last of Us', type: 'TV Show', tags: ['TV Show', 'Drama'], grad: 'linear-gradient(135deg,#2a1a00,#7a5a00)' },
      { title: 'Stranger Things', type: 'TV Show', tags: ['TV Show', 'Sci-Fi'], grad: 'linear-gradient(135deg,#0a0a2a,#4a0080)' },
      { title: 'Interstellar', type: 'Película', tags: ['Película', 'Sci-Fi'], grad: 'linear-gradient(135deg,#000820,#1a4080)' },
      { title: 'The Dark Knight', type: 'Película', tags: ['Película', 'Acción'], grad: 'linear-gradient(135deg,#0a0a0a,#1a1a3a)' },
      { title: 'Spider-Man: No Way Home', type: 'Película', tags: ['Película', 'Acción'], grad: 'linear-gradient(135deg,#0a1a6b,#c0392b)' },
      { title: 'Oppenheimer', type: 'Película', tags: ['Película', 'Drama'], grad: 'linear-gradient(135deg,#1a0a00,#8b4500)' },
      { title: 'Your Name', type: 'Anime', tags: ['Anime', 'Romance'], grad: 'linear-gradient(135deg,#1a0050,#c050a0)' },
      { title: 'Naruto', type: 'Anime', tags: ['Anime', 'Aventura'], grad: 'linear-gradient(135deg,#ff6b00,#ffd700)' },
      { title: 'House of the Dragon', type: 'TV Show', tags: ['TV Show', 'Fantasía'], grad: 'linear-gradient(135deg,#3a0000,#8b0000)' },
      { title: 'Severance', type: 'TV Show', tags: ['TV Show', 'Misterio'], grad: 'linear-gradient(135deg,#002a3a,#005a7a)' },
      { title: 'Dune', type: 'Película', tags: ['Película', 'Sci-Fi'], grad: 'linear-gradient(135deg,#3a2800,#8b6a00)' },
    ];

    // POST DE PRUEBA
    const SEED_POST = {
      id: 0,
      user: 'FABIANX',
      text: 'Homies, veamos esta serie en mi casa?? XD quien se anota?!',
      film: FILMS[0],
      tags: ['Anime', 'Aventura'],
      likes: 25,
      reactions: 45,
      time: '20 Jul 2025 14:58',
      comments: [
        { user: 'MARIAV', text: 'Yoo me anoto!! A que hora nos juntamos?', time: 'hace 2 horas' },
        { user: 'PEDRITO', text: 'Mejor vemos Naruto jaja', time: 'hace 1 hora' },
      ]
    };

    let posts = [SEED_POST];
    let nextId = 1;
    let selectedFilm = null;

    //  FUNCIONES PARA RENDERIZAR POST (HORA, TAGS)

    function timeNow() {
      return new Date().toLocaleString('es-CL', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    function tagClass(tag) {
      const blue = ['Anime', 'Sci-Fi', 'Misterio'];
      const yellow = ['TV Show', 'Aventura', 'Acción', 'Fantasía'];
      const teal = ['Película', 'Drama', 'Romance'];
      if (blue.includes(tag)) return 'tag-blue';
      if (yellow.includes(tag)) return 'tag-yellow';
      if (teal.includes(tag)) return 'tag-teal';
      return 'tag-blue';
    }

    // RENDERIZAR COMENTARIO CON SUS VARIABLES
    function renderComment(c) {
      return `
    <div class="comment">
      <div class="c-avatar">👤</div>
      <div>
        <div class="c-name">${c.user}</div>
        <div class="c-text">${c.text}</div>
        <div class="c-time">${c.time}</div>
      </div>
    </div>`;
    }

  // RENDERIZAR POST CON SUS VARIABLES
    function renderPost(p) {
      const tagsHtml = p.tags.map(t => `<span class="tag ${tagClass(t)}">${t}</span>`).join('');
      const commentsHtml = p.comments.map(renderComment).join('');
      const commentCount = p.comments.length;

      return `
  <div class="post-card" id="post-${p.id}">
    <div class="timestamp">${p.time}</div>

    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
      <div class="username">
        <div class="user-icon">👤</div>
        ${p.user}
      </div>
      <div class="d-flex gap-2 flex-wrap">${tagsHtml}</div>
    </div>

    <div class="d-flex gap-3">
      <div class="post-thumb" style="background:${p.film.grad}">${p.film.title}</div>
      <p class="post-text mb-0">${p.text}</p>
    </div>

    <div class="post-actions">
      <button onclick="likePost(${p.id})" id="like-${p.id}"><img src="/frontend/img/postlike.webp" alt="Me gustó" width="50px" class="glow-image"><span id="likes-${p.id}">${p.likes}</span></button>
      <button onclick="dislikePost(${p.id})"><img src="/frontend/img/postdislike.webp" alt="No me gustó" width="50px" class="glow-image"><span id="reactions-${p.id}">${p.reactions}</span></button>
    </div>

    <button class="comment-toggle" onclick="toggleComments(${p.id})">
      💬 ${commentCount} comentario${commentCount !== 1 ? 's' : ''} — ver / comentar
    </button>

    <div class="comment-section" id="comments-${p.id}">
      <div class="comment-list" id="comment-list-${p.id}">
        ${commentsHtml}
      </div>
      <div class="comment-input-row">
        <input type="text" id="comment-input-${p.id}" placeholder="Escribe un comentario..." 
               onkeydown="if(event.key==='Enter') addComment(${p.id})"/>
        <button onclick="addComment(${p.id})">Comentar</button>
      </div>
    </div>
  </div>`;
    }

    function renderFeed() {
      const feed = document.getElementById('feed');
      feed.innerHTML = posts.map(renderPost).join('');
    }

    //  FUNCIONES DE LIKE Y DISLIKE DE POST

    function likePost(id) {
      const post = posts.find(p => p.id === id);
      if (!post) return;
      post.liked = !post.liked;
      post.likes += post.liked ? 1 : -1;
      document.getElementById(`likes-${id}`).textContent = post.likes;
      document.getElementById(`like-${id}`).classList.toggle('liked', post.liked);
    }

    function dislikePost(id) {
      const post = posts.find(p => p.id === id);
      if (!post) return;
      post.reactions++;
      document.getElementById(`reactions-${id}`).textContent = post.reactions.toLocaleString();
    }

    function toggleComments(id) {
      const section = document.getElementById(`comments-${id}`);
      section.classList.toggle('open');
    }

    function addComment(id) {
      const input = document.getElementById(`comment-input-${id}`);
      const text = input.value.trim();
      if (!text) return;

      const post = posts.find(p => p.id === id);
      const comment = { user: 'Carlos696969', text, time: 'ahora mismo' };
      post.comments.push(comment);

      // Agregar comentario
      const list = document.getElementById(`comment-list-${id}`);
      list.insertAdjacentHTML('beforeend', renderComment(comment));

      // Mostrar comentario
      const count = post.comments.length;
      const toggle = document.querySelector(`#post-${id} .comment-toggle`);
      toggle.textContent = `💬 ${count} comentario${count !== 1 ? 's' : ''} — ver / comentar`;

      input.value = '';
      input.focus();
    }

    //  BUSCAR PELICULA O SERIE DEL POST

    const filmSearchInput = document.getElementById('filmSearchInput');
    const filmDropdown = document.getElementById('filmDropdown');
    const selectedFilmEl = document.getElementById('selectedFilm');
    const selectedCoverEl = document.getElementById('selectedCover');
    const selectedTitleEl = document.getElementById('selectedTitle');
    const selectedMetaEl = document.getElementById('selectedMeta');
    const postBtn = document.getElementById('postBtn');

    filmSearchInput.addEventListener('input', () => {
      const q = filmSearchInput.value.trim().toLowerCase();
      if (!q) { filmDropdown.classList.remove('open'); return; }

      const matches = FILMS.filter(f => f.title.toLowerCase().includes(q));
      if (!matches.length) { filmDropdown.classList.remove('open'); return; }

      filmDropdown.innerHTML = matches.map((f, i) => `
    <div class="film-option" data-index="${FILMS.indexOf(f)}">
      <div class="mini-cover" style="background:${f.grad}">${f.title}</div>
      <div>
        <div>${f.title}</div>
        <div class="film-meta">${f.type}</div>
      </div>
    </div>`).join('');

      filmDropdown.classList.add('open');
    });

    filmDropdown.addEventListener('click', e => {
      const option = e.target.closest('.film-option');
      if (!option) return;
      const film = FILMS[parseInt(option.dataset.index)];
      selectFilm(film);
    });

    function selectFilm(film) {
      selectedFilm = film;
      filmSearchInput.value = '';
      filmDropdown.classList.remove('open');

      selectedCoverEl.style.background = film.grad;
      selectedCoverEl.textContent = film.title;
      selectedTitleEl.textContent = film.title;
      selectedMetaEl.textContent = film.type;
      document.getElementById('selectedTags').innerHTML =
        film.tags.map(t => `<span class="tag ${tagClass(t)}" style="font-size:0.72rem;padding:2px 10px">${t}</span>`).join('');

      document.getElementById('filmSearchWrap').style.display = 'none';
      selectedFilmEl.classList.add('show');
      checkPostReady();
    }

    document.getElementById('removeFilm').addEventListener('click', () => {
      selectedFilm = null;
      selectedFilmEl.classList.remove('show');
      document.getElementById('filmSearchWrap').style.display = '';
      filmSearchInput.value = '';
      checkPostReady();
    });

    // Cerrar busqueda de pelicula o serie al momento de seleccionar
    document.addEventListener('click', e => {
      if (!e.target.closest('#filmSearchWrap')) filmDropdown.classList.remove('open');
    });



    //  PUBLICAR POST
    const postText = document.getElementById('postText');
    postText.addEventListener('input', checkPostReady);

    function checkPostReady() {
      postBtn.disabled = !(selectedFilm && postText.value.trim());
    }

    postBtn.addEventListener('click', () => {
      const newPost = {
        id: nextId++,
        user: 'Carlos696969',
        text: postText.value.trim(),
        film: selectedFilm,
        tags: [...selectedFilm.tags],
        likes: 0,
        reactions: 0,
        time: timeNow(),
        comments: [],
      };

      posts.unshift(newPost);
      renderFeed();

      // RESETEAR CREADOR DE POST
      postText.value = '';
      document.getElementById('removeFilm').click();
      checkPostReady();
    });

    //  NAVBAR
    const menuBtn = document.getElementById('menuBtn');
    const drawer = document.getElementById('drawer');
    menuBtn.addEventListener('click', () => {
      drawer.classList.toggle('open');
      menuBtn.textContent = drawer.classList.contains('open') ? '✕' : '☰';
    });

    document.querySelectorAll('.bottom-nav button').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.bottom-nav button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
      });
    });

    //  INIT
    renderFeed();