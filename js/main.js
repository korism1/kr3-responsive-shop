// Получаем модальное окно и элементы заказа.
const orderDialog = document.getElementById('order-dialog');
const orderButtons = document.querySelectorAll('.product-card__button');
const closeDialogButton = document.getElementById('close-order-dialog');
const selectedProductInput = document.getElementById('selected-product');
const successMessage = document.getElementById('success-message');
let lastOrderButton;

// Открываем форму с названием выбранного товара.
orderButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (!orderDialog) {
      return;
    }

    const productName = button.dataset.product;

    selectedProductInput.value = productName;
    document.getElementById('order-product-name').textContent = `Выбранный товар: ${productName}`;
    document.getElementById('order-topic').value = 'product';
    successMessage.hidden = true;

    lastOrderButton = button;
    orderDialog.showModal();
  });
});

// Закрываем модальное окно и возвращаем фокус на кнопку заказа.
if (closeDialogButton && orderDialog) {
  closeDialogButton.addEventListener('click', () => {
    orderDialog.close();
  });
}

if (orderDialog) {
  orderDialog.addEventListener('close', () => {
    if (lastOrderButton) {
      lastOrderButton.focus();
    }
  });
}

// Проверяем форму заявки и форму обратной связи.
const orderForms = document.querySelectorAll('.order-form');

orderForms.forEach((orderForm) => {
  orderForm.addEventListener('submit', (event) => {
    // Backend не подключён, поэтому отменяем отправку данных.
    event.preventDefault();

    const formElements = Array.from(orderForm.elements);
    const formStatus = orderForm.querySelector('.form-status');

    // Сбрасываем предыдущие признаки ошибок.
    formElements.forEach((element) => {
      if (element.willValidate) {
        element.removeAttribute('aria-invalid');
      }
    });

    formStatus.textContent = '';

    // Используем встроенные HTML-ограничения и сообщения браузера, как в КР №1.
    if (!orderForm.checkValidity()) {
      formElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
        }
      });

      orderForm.reportValidity();
      return;
    }

    const message = 'Форма успешно проверена. Данные на сервер не отправлялись.';

    if (orderDialog && orderDialog.contains(orderForm)) {
      successMessage.textContent = message;
      successMessage.hidden = false;
      orderDialog.close();
    } else {
      formStatus.textContent = message;
    }

    orderForm.reset();
  });
});
