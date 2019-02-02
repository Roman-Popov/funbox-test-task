# Тестовое задание для FunBox


## Q1
Расскажите, чем, на ваш взгляд, отличается хорошее клиентское приложение от плохого с точки зрения
* пользователя;
* менеджера проекта;
* дизайнера;
* верстальщика;
* серверного программиста.

### A1
Хорошее приложение должно обладать следующими чертами:

**Для пользователя:**
1) Быстродействие;
2) Логичный и интуитивно-понятный интерфейс;
3) Дизайн, не вызывающий раздражения;
4) Доступное для использования с любого устройства и любого браузера;
5) Доступное для лиц с ограниченными возможностями (accessibility).

**Для менеджера проекта:**
*Не было опыта работы менеджером проекта, поэтому лишь предположения*
1) Четко оговоренное техническое задание;
2) Легкость разбиения разработки проекта на этапы;
3) Масштабируемость без особых трудозатрат;
4) Рентабельность.

**Для дизайнера:**
1) Неограниченная производительность для реализации всех задумок дизайнера;
2) Продукт работы дизайнера получает широкое одобрение целевой аудитории.

**Для верстальщика:**
1) Правильная верстка с семантической точки зрения;
2) Воспроизводимость уже имеющихся элементов;
3) Простота структуры для реализации адаптивной верстки;
4) Отсутствие необходимости поддерживать IE.

**Для серверного программиста:**
*Не было опыта работы в бэкенде, поэтому лишь предположения*
1) Любые формы в приложении содержат только реально необходимые поля, т.е. нет нужды работать с невостребованной информацией;
2) Удобная архитектура приложения;
3) База данных приложения имеет четкую и понятную структуру.



## Q2
Опишите основные особенности разработки крупных многостраничных сайтов, функциональность которых может меняться в процессе реализации и поддержки. Расскажите о своем опыте работы над подобными сайтами: какие подходы, инструменты и технологии вы применяли на практике, с какими проблемами сталкивались и как их решали.

### A2
*Опыта разработки крупных многостраничных сайтов не имею, поэтому опишу лишь свои соображения на этот счет.*

Я думаю особенность любого крупного проекта - это много-много легаси-кода. Поэтому в случае таких объемов чрезвычайно важно иметь соглашения на предмет того, что и как делается. Иными словами - style guide. Стандартизация в крупных проектах важна как никогда. Что касается изменений функционала - я думаю, что хорошо было бы иметь модульную структуру. Тогда, изменяя какой-либо модуль, можно либо вносить минимальные, либо вообще не вносить сопутствующих правок.

Небольшой опыт на этот все же есть, но я бы не назвал его в привычном слове многостраничным проектом.
Я реализовал многостраничность приложения путем представления страниц в качестве отдельных React-компонентов в связке с Router'ом. Проблема была с хостингом проекта на GitHub. Если приложение находится по адресу, отличному от корневого (условно корневой адрес имеет вид .../myproject/, но благодаря реакт-роутеру адресная строка имеет вид: .../my-project/nextpage и отображается соответствующая страница), то GitHub Pages при обновлении страницы выдавал ошибку 404, т.к. не имел информации о файле по такому адресу. Приходилось делать кастомную страницу 404 со скриптом, подменяющим адрес на корневой, а оставшийся адрес передавался в качестве запроса в виде (.../my-project/?p=...). В свою очередь, скрипт на главной странице, при наличии запроса в адресе, выполнял history.replaceState(), тем самым указывая исходный адрес без перезагрузки страницы, а затем загружался основной реакт-скрипт. Все эти манипуляции можно увидеть [здесь](https://github.com/Roman-Popov/event-planner).



## Q3
При разработке интерфейсов с использованием компонентной архитектуры часто используются термины Presentational Components и Сontainer Сomponents. Что означают данные термины? Зачем нужно такое разделение, какие у него есть плюсы и минусы?

### A3
Presentational Component - как правило stateless компонент, т.е. не имеет своего состояния (или имеет, не в целях работы с данными, а в целях рендеринга UI). Служит для отображения данных и не определяет способ их изменения.

Сontainer Сomponent - как правило stateful компонент, осуществляющий работу с данными и управление дочерними компонентами. Обычно не содержит разметки, кроме wrapper'ов, и не имеет стилей.

Разделение на такие компоненты способствует более строгому построению приложения. Снижается доля т.н. спагетти-кода, более четко видна логика. Повышается воспроизводимость кода. В конечном счете, такой подход позволяет облегчить разработку и последующую поддержку продукта. Недостатки..? Быть может, к недостаткам следует отнести возросшее количество компонентов.



## Q4
Как устроено наследование в JS? Расскажите о своем опыте реализации JS-наследования без использования фреймворков.

### A4
В JS реализована прототипная модель наследования. Если объект имеет внутреннюю связь с другим объектом посредством `[[Prototype]]` (можно получить доступ через свойство `__proto__`), значит он унаследован от другого объекта. При чтении свойства дочернего объекта, если оно отсутствует, оно ищется у родительского компонента и далее по цепочке. Как только искомое свойство найдено - оно считывается и поиск останавливается. Мне известно два способа реализации наследования, непосредственно с использованием прототипа (до ES6) и с использованием классов (в ES6). На практике использовал последний вариант при написании мини-игры, можно увидеть по [ссылке](https://github.com/Roman-Popov/frogger-game-project/blob/f7f6242a7506513f5c0daa55453bcd3dd04123b1/js/app.js#L277).



## Q5
Какие библиотеки можно использовать для написания тестов end-to-end во фронтенде? Расскажите о своем опыте тестирования веб-приложений.

### A5
С end-to-end тестами на практике не сталкивался, знаю лишь, что это самые комплексные тесты, которые отражают работоспособность системы в целом. Я в процессе обучения в Udacity сталкивался лишь с Unit-тестами и использовал Jasmine. Код можно найти [здесь](https://github.com/Roman-Popov/feed-reader-testing-project).



## Q6
Вам нужно реализовать форму для отправки данных на сервер, состоящую из нескольких шагов. В вашем распоряжении дизайн формы и статичная верстка, в которой не показано, как форма должна работать в динамике. Подробного описания, как должны вести себя различные поля в зависимости от действий пользователя, в требованиях к проекту нет. Ваши действия?

### A6
Если брать ситуацию, исключительно описанную в вопросе, безо всяких предварительных договоренностей - то тут два варианта действий, в зависимости от объема работ.
* Если объем небольшой - накидал бы адекватно функционирующий, но простой рабочий вариант, который в дальнейшем можно будет использовать для доработки, и пошел бы к руководству уточнить детали на этот счет, попутно представив работающий вариант.
* Если объем значительный, либо сопряжен с какими-либо трудностями, пошел бы к руководству сразу без работающего прототипа, но с предложением варианта реализации.

А так, считаю, что такие моменты должны быть заранее оговорены. Имеет ли разработчик некую свободу действий и "свое видение", либо же как можно строже придерживаться ТЗ, и, соответственно, если деталей нет в ТЗ - непременно согласовывать все непонятные моменты.



## Q7
Расскажите, какие инструменты помогают вам экономить время в процессе написания, проверки и отладки кода.

### A7
При разработке всегда пользовался Visual Studio Code с различными расширениями, например GitLens, Code Spell Checker, различные Snippet'ы.

Конечно Chrome DevTools, куда же без него. В добавок ко всему для React-проектов пользуюсь расширением React Developer Tools.



## Q8
Какие ресурсы вы используете для развития в профессиональной сфере? Приведите несколько конкретных примеров (сайты, блоги и так далее). Какие ещё области знаний, кроме тех, что непосредственно относятся к работе, вам интересны?

### A8
Ресурсы для развития MDN, StackOverflow, Medium, Хабр, Tproger, CSS-Tricks, курсы от Udacity, реже learn.javascript.ru.

Помимо прочего интересуюсь авиацией, нравится совершенствовать английский язык (слушаю аудиокниги, смотрю фильмы в оригинале, порой почитываю литературу) и время от времени изучаю статьи на тему финансов.



## Q9
Расскажите нам немного о себе и предоставьте несколько ссылок на последние работы, выполненные вами.

### A9
Мне 23 года. Не пью, не курю.

Имею высшее техническое образование (красный диплом бакалавра по направлению "Электроэнергетика и электротехника", МАИ, 2017 г.). В 2017 поступил в магистратуру МАИ, бросил в январе 2019. Основная причина - моя неприязнь к имитации бурной деятельности без реального результата. Никогда не учился ради бумажки, основная цель учебы - знания, в противном случае - это не учеба, а пустая трата времени.

Так же прошел курс Front-End Web Developer от Udacity ([сертификат](https://confirm.udacity.com/AYHE9SHP)).

С 1-го курса института (2013 г.) по февраль 2019 работал в ОКБ Сухого (гибкий график 0,5 ставки), как студент-целевик. Изначально техником, как только получил диплом - инженером.

Почему такой лихой заворот событий и смена профессии? Все просто. Изначально, со школы, было желание идти по пути IT, но в моей школе информатика преподавалась на околонулевом уровне. На бюджет IT я бы в ВУЗ не прошел, а на платку - финансово не потянул бы. Поэтому пошел по пути инженера. Ну а далее так случилось, что товарищ рассказал о курсах от Udacity и возможности получить т.н. Nanodegree бесплатно (10% студентов, успешно прошедших отборочный конкурс получали стипендию на обучение). Ну а дальше закрутилось-завертелось. Меня увлекла Front-End отрасль, и, можно сказать я вернулся на изначально намеченный путь.

Email для связи: roman.job.mail@yandex.ru


##### Последние проекты:
###
**1) Планировщик задач с учетом доходов/расходов**
[[Код]](https://github.com/Roman-Popov/event-planner), [[Демо (EN)]](https://roman-popov.github.io/event-planner/), [[Демо (RU)]](https://roman-popov.github.io/ru-event-planner/)

*Примечание: полностью самостоятельный (не учебный) проект.*

Основные особенности:
* Использован React;
* Формирование задач и отметки о выполнении;
* Редактирование задач;
* Поиск по задачам и переход из поиска к нужной;
* Подсчет доходов и расходов;
* Ведение статистики доходов/расходов за месяц, год;
* Использование LocalStorage для хранения информации;
* Бэкап и восстановление данных из файла;
* Реализован Responsive Design;
* Реализован принцип Offline First с использованием сервис-воркера.

*Что в планах: реализовать интерактивную инструкцию (на данный момент ее нет, т.к. пока что проект не для широкой публики, и используется лишь несколькими людьми).*

**2) Учебный проект с использованием React, Google Maps, Flickr API**
[[Код]](https://github.com/Roman-Popov/neighborhood-map), [[Демо (EN)]](https://roman-popov.github.io/neighborhood-map/)
*Примечание: во время разработки проекта Google изменила политику относительно Google Maps. Сильно урезали квоты на некоммерческое использование API для России, поэтому при просмотре могут возникать ошибки вида Quota Exceeded*

**3) Учебный проект (без React) - небольшая игра, используются Canvas, классы и наследование**
[[Код]](https://github.com/Roman-Popov/frogger-game-project), [[Демо (EN)]](https://roman-popov.github.io/frogger-game-project/)