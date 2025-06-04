// 1. Зберігання даних у браузері
const saveBrowserInfo = () => {
    const browserInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        languages: navigator.languages,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        hardwareConcurrency: navigator.hardwareConcurrency,
        screenWidth: screen.width,
        screenHeight: screen.height,
        colorDepth: screen.colorDepth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        dateSaved: new Date().toISOString()
    };
    
    localStorage.setItem('browserData', JSON.stringify(browserInfo));
    displayBrowserInfo(browserInfo);
};

const displayBrowserInfo = (data) => {
    const footer = document.getElementById('browser-info-footer');
    footer.innerHTML = `
        <h3>Інформація про систему (варіант 11):</h3>
        <p>Браузер: ${data.userAgent}</p>
        <p>Платформа: ${data.platform}</p>
        <p>Мови: ${data.languages.join(', ')}</p>
        <p>Cookies: ${data.cookieEnabled ? 'Увімкнено' : 'Вимкнено'}</p>
        <p>Екран: ${data.screenWidth}x${data.screenHeight}, ${data.colorDepth} біт</p>
        <p>Часовий пояс: ${data.timezone}</p>
        <p>Дата збереження: ${new Date(data.dateSaved).toLocaleString()}</p>
    `;
};

// 2. Отримання коментарів для варіанту 11
const fetchComments = async () => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/11/comments');
        const comments = await response.json();
        
        const container = document.getElementById('comments-container');
        container.innerHTML = '';
        
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <h4>${comment.name}</h4>
                <p class="comment-email">${comment.email}</p>
                <p class="comment-body">${comment.body}</p>
            `;
            container.appendChild(commentElement);
        });
    } catch (error) {
        console.error('Помилка при отриманні коментарів:', error);
        document.getElementById('comments-container').innerHTML = 
            '<p class="error">Не вдалося завантажити відгуки. Спробуйте оновити сторінку.</p>';
    }
};

// 3. Форма зворотнього зв'язку
const setupFeedbackForm = () => {
    // Показати форму через 1 хвилину
    setTimeout(() => {
        document.getElementById('feedback-modal').style.display = 'block';
    }, 60000);

    // Закриття модального вікна
    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('feedback-modal').style.display = 'none';
    });

    // Валідація номера телефону
    document.getElementById('phone').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    // Обробка форми
    document.getElementById('feedback-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Відправка...';
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                alert('Дякуємо за ваш відгук! Форма успішно відправлена.');
                form.reset();
                document.getElementById('feedback-modal').style.display = 'none';
            } else {
                throw new Error('Помилка при відправці форми');
            }
        } catch (error) {
            console.error('Помилка:', error);
            alert('Сталася помилка при відправці форми. Спробуйте ще раз.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Відправити';
        }
    });
};

// 4. Нічний/денний режим
const setupThemeSwitcher = () => {
    const setTheme = (isNight) => {
        document.body.classList.toggle('night-theme', isNight);
        localStorage.setItem('nightTheme', isNight);
        document.getElementById('theme-toggle').checked = isNight;
    };

    const checkTimeForTheme = () => {
        const hours = new Date().getHours();
        const isNightTime = hours < 7 || hours >= 21;
        setTheme(isNightTime);
    };

    document.getElementById('theme-toggle').addEventListener('change', (e) => {
        setTheme(e.target.checked);
    });

    if (localStorage.getItem('nightTheme') !== null) {
        setTheme(localStorage.getItem('nightTheme') === 'true');
    } else {
        checkTimeForTheme();
    }

    setInterval(checkTimeForTheme, 300000);
};

// Ініціалізація всіх функцій при завантаженні сторінки
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('browserData')) {
        displayBrowserInfo(JSON.parse(localStorage.getItem('browserData')));
    } else {
        saveBrowserInfo();
    }
    
    fetchComments();
    setupFeedbackForm();
    setupThemeSwitcher();
});