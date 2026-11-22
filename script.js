/* Aves3D — интерактивность сайта */
(() => {
  const body = document.body;
  const themeButton = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('aves3d-theme');
  if (savedTheme === 'dark') body.classList.add('dark-theme');
  function syncThemeButton() {
    if (!themeButton) return;
    const isDark = body.classList.contains('dark-theme');
    themeButton.setAttribute('aria-label', isDark ? 'Включить светлую тему' : 'Включить тёмную тему');
    themeButton.setAttribute('aria-pressed', String(isDark));
    themeButton.title = isDark ? 'Светлая тема' : 'Тёмная тема';
  }
  syncThemeButton();
  themeButton?.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-theme');
    localStorage.setItem('aves3d-theme', isDark ? 'dark' : 'light');
    syncThemeButton();
  });

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const serviceSelect = document.getElementById('service-select');
  const totalPrice = document.getElementById('total-price');
  const speed = document.getElementById('delivery-speed');
  const revisions = document.getElementById('revisions');
  function updatePrice() {
    if (!serviceSelect || !totalPrice) return;
    const option = serviceSelect.options[serviceSelect.selectedIndex];
    const count = Math.max(0, Math.min(15, Number(revisions?.value || 0)));
    if (revisions) revisions.value = String(count);
    totalPrice.textContent = `${Number(option.dataset.price || 0) + Number(speed?.selectedOptions[0]?.dataset.price || 0) + count * 15} ₽`;
  }
  serviceSelect?.addEventListener('change', updatePrice);
  speed?.addEventListener('change', updatePrice);
  revisions?.addEventListener('input', updatePrice);
  document.querySelectorAll('.card-order').forEach(button => button.addEventListener('click', () => {
    if (serviceSelect) serviceSelect.value = button.dataset.service;
    updatePrice();
    document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' });
  }));
  updatePrice();

  const accountType = document.getElementById('account-type');
  const skinField = document.getElementById('skin');
  function updateSkinRequirement() {
    if (!accountType || !skinField) return;
    const required = accountType.value === 'Без лицензии';
    skinField.required = required;
    skinField.placeholder = required ? 'Обязательная ссылка на скин' : 'Ссылка на скин (необязательно для лицензии)';
  }
  accountType?.addEventListener('change', updateSkinRequirement);
  updateSkinRequirement();

  const orderForm = document.getElementById('order-form');
  const result = document.getElementById('order-result');
  const messageField = document.getElementById('order-message');
  const hint = document.getElementById('form-hint');
  const discordUrl = 'https://discord.com/users/1225161111096135774';
  orderForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!orderForm.reportValidity()) return;
    const selectedService = serviceSelect.options[serviceSelect.selectedIndex];
    const selectedSpeed = speed.options[speed.selectedIndex];
    const revisionCount = Number(revisions.value || 0);
    const base = Number(selectedService.dataset.price || 0);
    const speedPrice = Number(selectedSpeed.dataset.price || 0);
    const revisionPrice = revisionCount * 15;
    const total = base + speedPrice + revisionPrice;
    const account = accountType.value;
    const skin = skinField.value.trim() || 'Не указана (лицензионный аккаунт)';
    const lines = [
      'НОВЫЙ ЗАКАЗ — AVES3D',
      '',
      `Услуга: ${serviceSelect.value} — ${base} ₽`,
      `Скорость: ${selectedSpeed.textContent.trim()}${speedPrice ? ` (+${speedPrice} ₽)` : ''}`,
      `Платные правки: ${revisionCount} × 15 ₽ = ${revisionPrice} ₽`,
      `ИТОГО: ${total} ₽`,
      '',
      `Тип аккаунта Minecraft: ${account}`,
      `Ник Minecraft: ${document.getElementById('nickname').value.trim()}`,
      `Ссылка на скин: ${skin}`,
      `Discord заказчика: ${document.getElementById('contact-value').value.trim() || 'Напишет в личные сообщения'}`,
      '',
      'Пожелания:',
      document.getElementById('details').value.trim() || 'Не указаны',
      '',
      'С правилами по запрещённым скинам ознакомлен(а): Да'
    ];
    messageField.value = lines.join('\n');
    result.hidden = false;
    hint.textContent = 'Заявка готова. Скопируй её, затем открой мой Discord и отправь сообщение.';
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  const copyButton = document.getElementById('copy-order');
  copyButton?.addEventListener('click', async () => {
    const text = messageField.value;
    try {
      await navigator.clipboard.writeText(text);
      copyButton.textContent = 'Скопировано!';
    } catch (_) {
      messageField.focus();
      messageField.select();
      copyButton.textContent = 'Выделено — нажми Ctrl+C';
    }
  });
  document.getElementById('open-discord')?.setAttribute('href', discordUrl);

  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    document.querySelectorAll('.portfolio-item').forEach(item => item.addEventListener('click', () => {
      lightboxImg.src = item.dataset.full;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    }));
    const close = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';
    };
    lightbox.querySelector('.lightbox-close')?.addEventListener('click', close);
    lightbox.addEventListener('click', event => { if (event.target === lightbox) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
  }
})();
