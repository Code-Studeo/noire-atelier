(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const products = {
    aurora: { name: 'Vestido Aurora', price: 890, category: 'Vestidos', note: 'Linho · areia' },
    linha: { name: 'Conjunto Linha', price: 1240, category: 'Alfaiataria', note: 'Alfaiataria · carvão' },
    iris: { name: 'Bolsa Íris', price: 620, category: 'Bolsas', note: 'Couro · preto' },
    mare: { name: 'Vestido Maré', price: 970, category: 'Vestidos', note: 'Crepe fluido · preto' },
    caderno: { name: 'Caderno Essência', price: 180, category: 'Editorial', note: 'Edição impressa · capa artesanal' },
  };
  const looks = [
    { name: 'Vestido Aurora', copy: 'Linho de caimento fluido em tom areia.', product: 'aurora', image: 'public/images/destaque-01.webp', width: 1122, height: 1402 },
    { name: 'Conjunto Linha', copy: 'Alfaiataria de linhas precisas em tom carvão.', product: 'linha', image: 'public/images/destaque-02.webp', width: 1122, height: 1402 },
    { name: 'Bolsa Íris', copy: 'Couro preto e ferragens douradas para todos os dias.', product: 'iris', image: 'public/images/destaque-02.webp', width: 1122, height: 1402 },
    { name: 'Vestido Maré', copy: 'Crepe fluido em uma silhueta de presença.', product: 'mare', image: 'public/images/hero.webp', width: 1672, height: 941 },
    { name: 'Caderno Essência', copy: 'Edição impressa com capa artesanal.', product: 'caderno', image: 'public/images/detalhe.webp', width: 1536, height: 1024 },
  ];
  const money = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  let scrollPending = false;
  const updateHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
    scrollPending = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateHeader); }
  }, { passive: true });
  updateHeader();

  menuToggle?.addEventListener('click', () => {
    const opened = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!opened));
    menuToggle.setAttribute('aria-label', opened ? 'Abrir menu' : 'Fechar menu');
    nav?.classList.toggle('is-open', !opened);
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Abrir menu');
    nav.classList.remove('is-open');
  }));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      menuToggle?.setAttribute('aria-expanded', 'false');
      menuToggle?.setAttribute('aria-label', 'Abrir menu');
      nav?.classList.remove('is-open');
    }
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else revealItems.forEach((item) => item.classList.add('is-visible'));

  const parallaxItems = [...document.querySelectorAll('[data-parallax]')];
  if (!reducedMotion && parallaxItems.length) {
    let frame = 0;
    const moveParallax = () => {
      parallaxItems.forEach((item) => {
        const rect = item.parentElement.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > innerHeight) return;
        const offset = (rect.top + rect.height / 2 - innerHeight / 2) * -0.035;
        item.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
      frame = 0;
    };
    window.addEventListener('scroll', () => {
      if (!frame) frame = requestAnimationFrame(moveParallax);
    }, { passive: true });
    moveParallax();
  }

  document.querySelectorAll('[data-year]').forEach((item) => { item.textContent = new Date().getFullYear(); });
  const credit = document.querySelector('[data-credit]');
  const portfolioCredit = window.NOIRE_CONFIG?.portfolioCredit?.trim();
  if (credit && portfolioCredit) {
    credit.textContent = portfolioCredit;
    credit.closest('.portfolio-credit')?.removeAttribute('hidden');
  }

  const filterButtons = document.querySelectorAll('[data-filter]');
  const productCards = document.querySelectorAll('[data-category]');
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    productCards.forEach((card) => { card.hidden = filter !== 'todos' && card.dataset.category !== filter; });
  }));

  const toast = document.querySelector('[data-toast]');
  let toastTimeout;
  const announce = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove('is-visible'), 2500);
  };
  const cart = new Map();
  const countTarget = document.querySelector('[data-cart-count]');
  const cartItems = document.querySelector('[data-cart-items]');
  const cartTotal = document.querySelector('[data-cart-total]');
  const cartDialog = document.querySelector('.cart-dialog');
  const renderCart = () => {
    const entries = [...cart.entries()];
    const quantity = entries.reduce((sum, [, count]) => sum + count, 0);
    const total = entries.reduce((sum, [id, count]) => sum + products[id].price * count, 0);
    if (countTarget) countTarget.textContent = String(quantity);
    if (cartTotal) cartTotal.textContent = money(total);
    if (!cartItems) return;
    if (!entries.length) {
      cartItems.innerHTML = '<p class="empty-cart">Sua sacola está vazia.</p>';
      return;
    }
    cartItems.replaceChildren(...entries.map(([id, count]) => {
      const row = document.createElement('div');
      row.className = 'cart-row';
      const info = document.createElement('div');
      const name = document.createElement('b');
      name.textContent = products[id].name;
      const detail = document.createElement('small');
      detail.textContent = products[id].note;
      info.append(name, detail);
      const amount = document.createElement('span');
      amount.textContent = `${count} × ${money(products[id].price)}`;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'remove-item';
      remove.setAttribute('aria-label', `Remover ${products[id].name} do carrinho`);
      remove.textContent = '×';
      remove.addEventListener('click', () => {
        cart.delete(id);
        renderCart();
        announce(`${products[id].name} removido da sua sacola.`);
      });
      row.append(info, amount, remove);
      return row;
    }));
  };
  const addToCart = (id) => {
    if (!products[id]) return;
    cart.set(id, (cart.get(id) || 0) + 1);
    renderCart();
    announce(`${products[id].name} adicionado à sua sacola.`);
  };
  document.querySelectorAll('[data-add]').forEach((button) => button.addEventListener('click', () => addToCart(button.dataset.add)));
  document.querySelectorAll('[data-open-cart]').forEach((button) => button.addEventListener('click', () => cartDialog?.showModal()));
  document.querySelectorAll('.cart-dialog .dialog-close').forEach((button) => button.addEventListener('click', () => cartDialog?.close()));
  document.querySelector('[data-checkout]')?.addEventListener('click', () => {
    if (!cart.size) {
      announce('Adicione uma peça à sua sacola para continuar.');
      return;
    }
    const summary = [...cart.entries()].map(([id, count]) => `${products[id].name} (${count})`).join(', ');
    const message = document.querySelector('#message');
    if (message) message.value = `Olá, gostaria de saber mais sobre: ${summary}.`;
    cartDialog?.close();
    document.querySelector('#contato')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    window.setTimeout(() => message?.focus(), reducedMotion ? 0 : 450);
  });
  renderCart();

  const lookDialog = document.querySelector('.look-dialog');
  const dialogTitle = document.querySelector('[data-dialog-name]');
  const dialogCopy = document.querySelector('[data-dialog-copy]');
  const dialogNumber = document.querySelector('[data-dialog-number]');
  const dialogArt = document.querySelector('[data-dialog-art]');
  const dialogAdd = document.querySelector('[data-dialog-add]');
  let selectedLook = 0;
  const openLook = (index) => {
    const look = looks[index];
    if (!look || !lookDialog) return;
    selectedLook = index;
    dialogTitle.textContent = look.name;
    dialogCopy.textContent = look.copy;
    dialogNumber.textContent = `EDITORIAL 0${index + 1}`;
    dialogArt.className = `dialog-art dialog-look-${index + 1}`;
    const image = document.createElement('img');
    image.src = look.image;
    image.width = look.width;
    image.height = look.height;
    image.alt = '';
    image.decoding = 'async';
    dialogArt.replaceChildren(image);
    dialogAdd.dataset.product = look.product;
    lookDialog.showModal();
  };
  document.querySelectorAll('[data-look]').forEach((button) => button.addEventListener('click', () => openLook(Number(button.dataset.look))));
  document.querySelector('.look-dialog .dialog-close')?.addEventListener('click', () => lookDialog?.close());
  dialogAdd?.addEventListener('click', () => {
    addToCart(dialogAdd.dataset.product);
    lookDialog.close();
  });
  document.querySelectorAll('dialog').forEach((dialog) => dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  }));
  void selectedLook;

  const form = document.querySelector('[data-contact-form]');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = form.querySelector('.form-status');
    if (!form.reportValidity()) {
      status.textContent = 'Confira os campos indicados antes de continuar.';
      status.className = 'form-status is-error';
      return;
    }
    status.textContent = 'Mensagem revisada. O formulário ainda precisa de um canal de atendimento configurado para receber seu contato.';
    status.className = 'form-status is-success';
    form.reset();
  });
})();
