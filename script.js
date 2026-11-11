/* Aves3D — интерактивность сайта */
(() => {
  const body = document.body;

  // Тема: сохраняем выбор в localStorage и применяем его при загрузке.
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

  // Мобильное меню.
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
      menuButton.setAttribute('aria-label', 'Открыть меню');
    }));
  }

  // Текущий год в подвале.
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Калькулятор цены и быстрый выбор услуги из карточки.
  const serviceSelect = document.getElementById('service-select');
  const totalPrice = document.getElementById('total-price');
  function updatePrice() {
    if (!serviceSelect || !totalPrice) return;
    const option = serviceSelect.options[serviceSelect.selectedIndex];
    totalPrice.textContent = `${option.dataset.price} ₽`;
  }
  if (serviceSelect) {
    serviceSelect.addEventListener('change', updatePrice);
    document.querySelectorAll('.card-order').forEach(button => {
      button.addEventListener('click', () => {
        serviceSelect.value = button.dataset.service;
        updatePrice();
        document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' });
      });
    });
    updatePrice();
  }

  // Контактный способ: Discord или Email. Email проверяется браузером.
  const contactMethod = document.getElementById('contact-method');
  const contactValue = document.getElementById('contact-value');
  const contactLabel = document.getElementById('contact-value-label');
  function updateContactField() {
    if (!contactMethod || !contactValue || !contactLabel) return;
    const isEmail = contactMethod.value === 'Email';
    contactValue.type = isEmail ? 'email' : 'text';
    contactValue.autocomplete = isEmail ? 'email' : 'off';
    contactValue.placeholder = isEmail ? 'name@example.com' : 'Например, aves_gree';
    contactValue.maxLength = isEmail ? 254 : 120;
    contactValue.setAttribute('aria-label', isEmail ? 'Email для связи' : 'Discord-тег или ссылка на личные сообщения');
    contactLabel.textContent = isEmail ? 'Твой Email' : 'Discord-тег или ссылка на личные сообщения';
  }
  contactMethod?.addEventListener('change', updateContactField);
  updateContactField();

  // Формирование заказа. Контактный способ и контакт включаются в сообщение.
  const orderForm = document.getElementById('order-form');
  if (orderForm) {
    orderForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (!orderForm.reportValidity()) return;

      const nickname = document.getElementById('nickname').value.trim();
      const contactType = contactMethod.value;
      const contact = contactValue.value.trim();
      const skin = document.getElementById('skin').value.trim();
      const details = document.getElementById('details').value.trim();
      const option = serviceSelect.options[serviceSelect.selectedIndex];
      const message = [
        'Привет! Хочу заказать работу в Aves3D.',
        '',
        `Услуга: ${serviceSelect.value}`,
        `Стоимость: ${option.dataset.price} ₽`,
        `Мой ник Minecraft: ${nickname}`,
        `Связаться через: ${contactType}`,
        `Контакт: ${contact}`,
        `Скин: ${skin || 'Пришлю отдельно'}`,
        `Пожелания: ${details || 'Обсудим лично'}`
      ].join('\n');

      const hint = document.getElementById('form-hint');
      try {
        await navigator.clipboard.writeText(message);
        hint.textContent = 'Заказ и контакт скопированы. Откроется Discord — вставь сообщение в личку или канал заказов.';
      } catch (error) {
        // Резервный способ копирования для браузеров без Clipboard API.
        const temp = document.createElement('textarea');
        temp.value = message;
        temp.setAttribute('readonly', '');
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();
        const copied = document.execCommand('copy');
        temp.remove();
        hint.textContent = copied
          ? 'Заказ и контакт скопированы. Откроется Discord — вставь сообщение.'
          : 'Автокопирование недоступно. Проверь поля и напиши в Discord вручную.';
      }
      window.open('https://discord.gg/veFrZrz5hR', '_blank', 'noopener,noreferrer');
    });
  }

  // Лайтбокс портфолио.
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    document.querySelectorAll('.portfolio-item').forEach(item => {
      item.addEventListener('click', () => {
        lightboxImg.src = item.dataset.full;
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
      });
    });
    const close = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';
    };
    lightbox.querySelector('.lightbox-close')?.addEventListener('click', close);
    lightbox.addEventListener('click', event => {
      if (event.target === lightbox) close();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') close();
    });
  }
})();
