
const serverless = require('serverless-http');



const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const FILES_DIR = './files';

// Middleware для парсинга POST-запросов
app.use(bodyParser.urlencoded({ extended: true }));

// Создаём папку для файлов, если её нет
if (!fs.existsSync(FILES_DIR)) {
    fs.mkdirSync(FILES_DIR);
}

// Главная страница
app.get('/', (req, res) => {
    let fileList = '';

    // Читаем все файлы из директории
    fs.readdir(FILES_DIR, (err, files) => {
        if (err) {
            return res.send('Ошибка при чтении файлов');
        }

        // Собираем содержимое всех файлов
        files.forEach((file) => {
            const filePath = path.join(FILES_DIR, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            fileList += `<h3>${file}</h3><pre>${content}</pre><hr>`;
        });

        // Отображаем форму и список файлов
        res.send(`
            <html>
                <head><title>Text File Server</title></head>
                <body>
                    <h1>Text File Server</h1>
                    <form action="/save" method="POST">
                        <textarea name="content" rows="4" cols="50" placeholder="Введите текст"></textarea><br>
                        <button type="submit">Сохранить</button>
                    </form>
                    <h2>Сохранённые файлы:</h2>
                    ${fileList}
                </body>
            </html>
        `);
    });
});

// Сохранение текста в файл
app.post('/save', (req, res) => {
    const content = req.body.content;
    if (!content) {
        return res.send('Пустой текст не может быть сохранён.');
    }

    // Генерируем уникальное имя файла
    const timestamp = Date.now();
    const filename = `file_${timestamp}.txt`;

    // Сохраняем текст в файл
    fs.writeFile(path.join(FILES_DIR, filename), content, (err) => {
        if (err) {
            return res.send('Ошибка при сохранении файла.');
        }

        res.redirect('/');
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/.netlify/functions/server', (req, res) => {
  res.send('Hello from Node.js on Netlify!');
});

module.exports.handler = serverless(app);
