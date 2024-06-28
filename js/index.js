// JSON-список фруктов
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// Преобразование JSON в JavaScript объект
let fruits = JSON.parse(fruitsJSON);

const fruitsList = document.querySelector('.fruits__list'); // Список карточек фруктов
const shuffleButton = document.querySelector('.shuffle__btn'); // Кнопка "Перемешать"
const filterButton = document.querySelector('.filter__btn'); // Кнопка "Фильтровать"
const sortAlgorithmLabel = document.querySelector('.sort__algorithm'); // Метка для отображения текущего алгоритма сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // Метка для отображения времени сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // Кнопка "Сменить алгоритм сортировки"
const sortActionButton = document.querySelector('.sort__action__btn'); // Кнопка "Сортировать"
const kindInput = document.querySelector('.kind__input'); // Поле ввода вида фрукта
const colorInput = document.querySelector('.color__input'); // Поле ввода цвета фрукта
const weightInput = document.querySelector('.weight__input'); // Поле ввода веса фрукта
const addActionButton = document.querySelector('.add__action__btn'); // Кнопка "Добавить фрукт"
const minWeightInput = document.querySelector('.minweight__input'); // Поле ввода минимального веса
const maxWeightInput = document.querySelector('.maxweight__input'); // Поле ввода максимального веса

// Функция для отображения карточек фруктов
const display = () => {
  fruitsList.innerHTML = ''; // Очищаем список фруктов

  fruits.forEach((fruit, index) => {
    const li = document.createElement('li');
    li.classList.add('fruit__item', `fruit_${getFruitColorClass(fruit.color)}`);

    const div = document.createElement('div');
    div.classList.add('fruit__info');

    const indexDiv = document.createElement('div');
    indexDiv.textContent = `индекс: ${index}`;
    div.appendChild(indexDiv);

    const kindDiv = document.createElement('div');
    kindDiv.textContent = `вид: ${fruit.kind}`;
    div.appendChild(kindDiv);

    const colorDiv = document.createElement('div');
    colorDiv.textContent = `цвет: ${fruit.color}`;
    div.appendChild(colorDiv);

    const weightDiv = document.createElement('div');
    weightDiv.textContent = `вес (кг): ${fruit.weight}`;
    div.appendChild(weightDiv);

    li.appendChild(div);
    fruitsList.appendChild(li);
  });
};

// Функция для получения класса цвета фрукта
const getFruitColorClass = (color) => {
  switch (color) {
    case 'фиолетовый':
      return 'violet';
    case 'зеленый':
      return 'green';
    case 'розово-красный':
      return 'carmazin';
    case 'желтый':
      return 'yellow';
    case 'светло-коричневый':
      return 'lightbrown';
    default:
      return '';
  }
};

// Функция для случайного перемешивания массива фруктов
const shuffleFruits = () => {
  const originalString = JSON.stringify(fruits);
  let currentIndex = fruits.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [fruits[currentIndex], fruits[randomIndex]] = [fruits[randomIndex], fruits[currentIndex]];
  }

  const currentString = JSON.stringify(fruits);

  if (originalString === currentString) {
    alert('Порядок не изменился!');
  }

  display();
};

// Обработчик для кнопки "Перемешать"
shuffleButton.addEventListener('click', shuffleFruits);

// Функция для фильтрации фруктов по весу
const filterFruits = () => {
  const minWeight = parseInt(minWeightInput.value);
  const maxWeight = parseInt(maxWeightInput.value);

  if (isNaN(minWeight) || isNaN(maxWeight)) {
    alert('Введите корректные значения для минимального и максимального веса!');
    return;
  }

  if (minWeight > maxWeight) {
    alert('Минимальный вес не может быть больше максимального!');
    return;
  }

  fruits = JSON.parse(fruitsJSON); // Восстановить исходный список фруктов
  fruits = fruits.filter(fruit => fruit.weight >= minWeight && fruit.weight <= maxWeight);

  display();
};

// Обработчик для кнопки "Фильтровать"
filterButton.addEventListener('click', filterFruits);

// Остальной код остается без изменений

// ...

const sortAPI = {
  bubbleSort(arr, comparation) {
    let len = arr.length;
    for (let i = 0; i < len - 1; i++) {
      for (let j = 0; j < len - 1 - i; j++) {
        if (comparation(arr[j], arr[j + 1])) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
  },

  quickSort(arr, left, right, comparation) {
    if (left < right) {
      const pivotIndex = partition(arr, left, right, comparation);
      sortAPI.quickSort(arr, left, pivotIndex - 1, comparation);
      sortAPI.quickSort(arr, pivotIndex + 1, right, comparation);
    }
  }
};

// Функция для разделения массива на части (partition) в быстрой сортировке
const partition = (arr, left, right, comparation) => {
  const pivot = arr[Math.floor((right + left) / 2)];
  let i = left;
  let j = right;

  while (i <= j) {
    while (comparation(pivot, arr[i])) {
      i++;
    }
    while (comparation(arr[j], pivot)) {
      j--;
    }
    if (i <= j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
      j--;
    }
  }
  return i;
};

const startSort = (sortFunc, arr, comparationFunc) => {
  const startTime = performance.now();
  if (sortFunc === sortAPI.quickSort) {
    sortFunc(arr, 0, arr.length - 1, comparationFunc);
  } else {
    sortFunc(arr, comparationFunc);
  }
  const endTime = performance.now();
  sortTimeLabel.textContent = `${(endTime - startTime).toFixed(4)} ms`;
};

let sortKind = 'bubbleSort'; // Исходный тип сортировки

// Обработчик для кнопки "Сменить алгоритм сортировки"
sortChangeButton.addEventListener('click', () => {
  sortKind = sortKind === 'bubbleSort' ? 'quickSort' : 'bubbleSort';
  updateSortAlgorithmLabel();
});

// Функция для обновления текста метки текущего алгоритма сортировки
const updateSortAlgorithmLabel = () => {
  sortAlgorithmLabel.textContent = sortKind === 'bubbleSort' ? 'Пузырьковая сортировка' : 'Быстрая сортировка';
};

// Функция для сравнения фруктов по цвету для сортировки
const comparationColor = (a, b) => {
  const colors = ['фиолетовый', 'зеленый', 'розово-красный', 'желтый', 'светло-коричневый'];
  return colors.indexOf(a.color) > colors.indexOf(b.color);
};

// Обработчик для кнопки "Сортировать"
sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = '...';
  startSort(sortAPI[sortKind], fruits, comparationColor);
  display();
});

// Функция для добавления нового фрукта
const addFruit = () => {
  const kind = kindInput.value.trim();
  const color = colorInput.value.trim();
  const weight = parseInt(weightInput.value.trim());

  if (!kind || !color || isNaN(weight)) {
    alert('Введите корректные значения для всех полей: вид, цвет, вес!');
    return;
  }

  fruits.push({ kind, color, weight });
  kindInput.value = '';
  colorInput.value = '';
  weightInput.value = '';
  display();
};

// Обработчик для кнопки "Добавить фрукт"
addActionButton.addEventListener('click', addFruit);

// Инициализация отображения списка фруктов
display();
updateSortAlgorithmLabel();