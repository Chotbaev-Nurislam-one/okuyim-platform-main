const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const fs = require("fs").promises;
const path = require("path");
const rateLimit = require("express-rate-limit");
const {
  generateToken,
  verifyToken,
  requireAdmin,
  requireOwnership,
} = require("./middleware/auth");
const database = require("./config/database");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Подключение к БД
database.connect();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Rate limiting защита
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов
  message: { error: "Слишком много запросов. Попробуйте позже." },
});

app.use("/api/", limiter);

// Пути к файлам данных
const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const SCENARIOS_FILE = path.join(DATA_DIR, "scenarios.json");
const SIMULATIONS_FILE = path.join(DATA_DIR, "simulations.json");

// Инициализация папки и файлов данных
async function initDataFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Инициализация users.json
    try {
      await fs.access(USERS_FILE);
    } catch {
      const defaultAdminPassword = await bcrypt.hash("admin123", 10);
      await fs.writeFile(
        USERS_FILE,
        JSON.stringify(
          [
            {
              id: 1,
              firstName: "Администратор",
              lastName: "Системы",
              email: "admin@okuyim.com",
              password: defaultAdminPassword,
              role: "admin",
              createdAt: new Date().toISOString(),
              isBlocked: false,
              stats: {
                totalSimulations: 0,
                completedSimulations: 0,
                averageScore: 0,
                totalDaysSpent: 0,
              },
            },
          ],
          null,
          2,
        ),
      );
    }

    // Инициализация scenarios.json
    try {
      await fs.access(SCENARIOS_FILE);
    } catch {
      const demoScenario = {
        id: 1,
        title: "Запуск корпоративного сайта",
        difficulty: "средний",
        description:
          "Вам предстоит управлять командой разработки для создания корпоративного сайта компании. Необходимо уложиться в бюджет и сроки, обеспечив высокое качество.",
        budget: 100000,
        duration: 30,
        tasks: [
          {
            id: 1,
            title: "Анализ требований",
            startDay: 1,
            endDay: 3,
            dailyProgress: 20,
            dependencies: [],
            priority: "high",
          },
          {
            id: 2,
            title: "Дизайн макетов",
            startDay: 2,
            endDay: 7,
            dailyProgress: 15,
            dependencies: [1],
            priority: "medium",
          },
          {
            id: 3,
            title: "Верстка страниц",
            startDay: 4,
            endDay: 12,
            dailyProgress: 10,
            dependencies: [2],
            priority: "high",
          },
          {
            id: 4,
            title: "Разработка модулей",
            startDay: 5,
            endDay: 20,
            dailyProgress: 6,
            dependencies: [2],
            priority: "high",
          },
          {
            id: 5,
            title: "Интеграция БД",
            startDay: 10,
            endDay: 18,
            dailyProgress: 10,
            dependencies: [4],
            priority: "medium",
          },
          {
            id: 6,
            title: "Тестирование",
            startDay: 18,
            endDay: 25,
            dailyProgress: 12,
            dependencies: [3, 4, 5],
            priority: "high",
          },
          {
            id: 7,
            title: "Наполнение контентом",
            startDay: 20,
            endDay: 26,
            dailyProgress: 15,
            dependencies: [3],
            priority: "low",
          },
          {
            id: 8,
            title: "SEO оптимизация",
            startDay: 22,
            endDay: 27,
            dailyProgress: 15,
            dependencies: [6],
            priority: "medium",
          },
          {
            id: 9,
            title: "Финальное тестирование",
            startDay: 26,
            endDay: 29,
            dailyProgress: 20,
            dependencies: [6, 7, 8],
            priority: "high",
          },
          {
            id: 10,
            title: "Запуск и мониторинг",
            startDay: 29,
            endDay: 30,
            dailyProgress: 50,
            dependencies: [9],
            priority: "high",
          },
        ],
        resources: [
          {
            id: 1,
            name: "Анна",
            role: "Project Manager",
            efficiency: 1.2,
            costPerDay: 5000,
          },
          {
            id: 2,
            name: "Иван",
            role: "Разработчик",
            efficiency: 1.0,
            costPerDay: 4000,
          },
          {
            id: 3,
            name: "Мария",
            role: "Дизайнер",
            efficiency: 1.1,
            costPerDay: 4500,
          },
          {
            id: 4,
            name: "Петр",
            role: "Тестировщик",
            efficiency: 0.9,
            costPerDay: 3500,
          },
          {
            id: 5,
            name: "Елена",
            role: "Контент-менеджер",
            efficiency: 1.0,
            costPerDay: 3800,
          },
        ],
        risks: [
          {
            id: 1,
            name: "Задержка сервера",
            probability: 30,
            type: "time",
            severity: 2,
            description: "Проблемы с хостингом могут задержать разработку",
          },
          {
            id: 2,
            name: "Перегорание разработчика",
            probability: 25,
            type: "quality",
            severity: 15,
            description: "Высокая нагрузка может снизить качество кода",
          },
          {
            id: 3,
            name: "Изменение требований",
            probability: 40,
            type: "time",
            severity: 3,
            description: "Заказчик может запросить новые функции",
          },
          {
            id: 4,
            name: "Бюджетные риски",
            probability: 20,
            type: "budget",
            severity: 15,
            description: "Непредвиденные расходы могут превысить бюджет",
          },
          {
            id: 5,
            name: "Низкая мотивация команды",
            probability: 35,
            type: "satisfaction",
            severity: 10,
            description:
              "Снижение удовлетворенности может повлиять на скорость",
          },
        ],
        createdAt: new Date().toISOString(),
      };
      await fs.writeFile(
        SCENARIOS_FILE,
        JSON.stringify([demoScenario], null, 2),
      );
    }

    // Инициализация simulations.json
    try {
      await fs.access(SIMULATIONS_FILE);
    } catch {
      await fs.writeFile(SIMULATIONS_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error("Error initializing data files:", error);
  }
}

// Вспомогательные функции для работы с файлами
async function readUsers() {
  const data = await fs.readFile(USERS_FILE, "utf8");
  return JSON.parse(data);
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

async function readScenarios() {
  const data = await fs.readFile(SCENARIOS_FILE, "utf8");
  return JSON.parse(data);
}

async function writeScenarios(scenarios) {
  await fs.writeFile(SCENARIOS_FILE, JSON.stringify(scenarios, null, 2));
}

async function readSimulations() {
  const data = await fs.readFile(SIMULATIONS_FILE, "utf8");
  return JSON.parse(data);
}

async function writeSimulations(simulations) {
  await fs.writeFile(SIMULATIONS_FILE, JSON.stringify(simulations, null, 2));
}

// Генерация ID
async function getNextUserId() {
  const users = await readUsers();
  return users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
}

async function getNextScenarioId() {
  const scenarios = await readScenarios();
  return scenarios.length > 0 ? Math.max(...scenarios.map((s) => s.id)) + 1 : 1;
}

async function getNextSimulationId() {
  const simulations = await readSimulations();
  return simulations.length > 0
    ? Math.max(...simulations.map((s) => s.id)) + 1
    : 1;
}

// -------------------- AUTH ROUTES --------------------
app.post("/api/auth/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const users = await readUsers();
    const existingUser = users.find((u) => u.email === email);

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Пользователь с таким email уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: await getNextUserId(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "student",
      createdAt: new Date().toISOString(),
      isBlocked: false,
      stats: {
        totalSimulations: 0,
        completedSimulations: 0,
        averageScore: 0,
        totalDaysSpent: 0,
      },
    };

    users.push(newUser);
    await writeUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = await readUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }

    if (user.isBlocked) {
      return res.status(401).json({ error: "Аккаунт заблокирован" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Неверный пароль" });
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/api/auth/logout", async (req, res) => {
  // Для JWT здесь нужно было бы инвалидировать токен
  // Для session-based - удалить сессию
  // Для простого варианта просто возвращаем успех
  res.json({ message: "Logged out successfully" });
});

// -------------------- SCENARIO ROUTES --------------------
app.get("/api/scenarios", verifyToken, async (req, res) => {
  try {
    const scenarios = await readScenarios();
    res.json(scenarios);
  } catch (error) {
    res.status(500).json({ error: "Ошибка загрузки кейсов" });
  }
});

app.get("/api/scenarios/:id", verifyToken, async (req, res) => {
  try {
    const scenarios = await readScenarios();
    const scenario = scenarios.find((s) => s.id === parseInt(req.params.id));
    if (!scenario) {
      return res.status(404).json({ error: "Кейс не найден" });
    }
    res.json(scenario);
  } catch (error) {
    res.status(500).json({ error: "Ошибка загрузки кейса" });
  }
});

// -------------------- SIMULATION ROUTES --------------------
app.post("/api/simulations", verifyToken, async (req, res) => {
  const { userId, scenarioId } = req.body;

  try {
    const scenarios = await readScenarios();
    const scenario = scenarios.find((s) => s.id === scenarioId);

    if (!scenario) {
      return res.status(404).json({ error: "Кейс не найден" });
    }

    const simulation = {
      id: await getNextSimulationId(),
      userId,
      scenarioId,
      status: "in_progress",
      currentDay: 1,
      budget: scenario.budget,
      initialBudget: scenario.budget,
      satisfaction: 100,
      quality: 100,
      completedTasks: [],
      tasks: scenario.tasks.map((task) => ({
        ...task,
        status: "pending",
        progress: 0,
        assignedTo: null,
        actualStartDay: null,
        actualEndDay: null,
        plannedStartDay: task.startDay,
        plannedEndDay: task.endDay,
        delay: 0,
        priorityChanges: 0,
      })),
      logs: [
        {
          day: 0,
          message: `Проект "${scenario.title}" запущен. Бюджет: ${scenario.budget.toLocaleString()} сом`,
          type: "info",
        },
      ],
      activeRisks: [],
      occurredRisks: [],
      startedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      userActions: {
        tasksAssigned: 0,
        priorityChanges: 0,
        daysSkipped: 0,
        risksMitigated: 0,
      },
    };

    const simulations = await readSimulations();
    simulations.push(simulation);
    await writeSimulations(simulations);

    res.status(201).json(simulation);
  } catch (error) {
    console.error("Error creating simulation:", error);
    res.status(500).json({ error: "Ошибка создания симуляции" });
  }
});

app.get("/api/simulations/user/:userId", verifyToken, async (req, res) => {
  try {
    const simulations = await readSimulations();
    const userSimulations = simulations.filter(
      (s) => s.userId === parseInt(req.params.userId),
    );
    res.json(userSimulations);
  } catch (error) {
    res.status(500).json({ error: "Ошибка загрузки симуляций" });
  }
});

app.get("/api/simulations/:id", verifyToken, async (req, res) => {
  try {
    const simulations = await readSimulations();
    const simulation = simulations.find(
      (s) => s.id === parseInt(req.params.id),
    );
    if (!simulation) {
      return res.status(404).json({ error: "Симуляция не найдена" });
    }
    res.json(simulation);
  } catch (error) {
    res.status(500).json({ error: "Ошибка загрузки симуляции" });
  }
});

app.put("/api/simulations/:id/tasks/:taskId", verifyToken, async (req, res) => {
  try {
    const simulations = await readSimulations();
    const simulationIndex = simulations.findIndex(
      (s) => s.id === parseInt(req.params.id),
    );

    if (simulationIndex === -1) {
      return res.status(404).json({ error: "Симуляция не найдена" });
    }

    const taskIndex = simulations[simulationIndex].tasks.findIndex(
      (t) => t.id === parseInt(req.params.taskId),
    );
    if (taskIndex === -1) {
      return res.status(404).json({ error: "Задача не найдена" });
    }

    simulations[simulationIndex].tasks[taskIndex] = {
      ...simulations[simulationIndex].tasks[taskIndex],
      ...req.body,
    };

    if (
      req.body.assignedTo &&
      !simulations[simulationIndex].tasks[taskIndex].assignedTo
    ) {
      simulations[simulationIndex].userActions.tasksAssigned++;
    }

    simulations[simulationIndex].lastUpdatedAt = new Date().toISOString();
    await writeSimulations(simulations);

    res.json(simulations[simulationIndex].tasks[taskIndex]);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Ошибка обновления задачи" });
  }
});

// Функция для генерации подробных рекомендаций
function generateDetailedRecommendations(simulation, scenario) {
  const recommendations = [];
  const actions = simulation.userActions || {
    tasksAssigned: 0,
    priorityChanges: 0,
    daysSkipped: 0,
    risksMitigated: 0,
  };
  const metrics = simulation.finalMetrics || {};

  // Анализ действий пользователя
  const daysWithoutAction = actions.daysSkipped || 0;
  const totalDays = simulation.currentDay;
  const actionRatio =
    (actions.tasksAssigned + actions.priorityChanges) / Math.max(1, totalDays);

  // 1. Если пользователь ничего не делал
  if (actionRatio < 0.1 && totalDays > 3) {
    recommendations.push({
      type: "critical",
      icon: "⚠️",
      title: "Критическая ошибка: пассивное управление",
      description:
        'Вы практически не управляли проектом! Вы просто нажимали "Следующий день" без назначения задач и управления приоритетами.',
      detailed: `
        **Что пошло не так:**
        • Вы не назначили ни одного исполнителя на задачи (${actions.tasksAssigned} из ${simulation.tasks?.length || 0} задач)
        • Вы не меняли приоритеты задач, хотя в реальном проекте приоритеты меняются ежедневно
        • Команда не получала указаний, что привело к хаосу и срыву сроков
        
        **Как правильно управлять проектом:**
        1. **Назначайте задачи сразу** — как только проект запущен, распределите задачи между членами команды
        2. **Ежедневно проверяйте прогресс** — каждый день смотрите, какие задачи требуют внимания
        3. **Меняйте приоритеты** — если задача становится критической, повысьте её приоритет
        4. **Реагируйте на риски** — когда наступает риск, принимайте меры для минимизации ущерба
        
        **Практический совет:** В следующий раз попробуйте провести 5 минут в начале каждого "дня" симуляции, чтобы проверить статус всех задач и при необходимости переназначить ресурсы.
      `,
    });
  }

  // 2. Анализ назначения задач
  if (
    actions.tasksAssigned === 0 &&
    simulation.tasks &&
    simulation.tasks.length > 0
  ) {
    recommendations.push({
      type: "critical",
      icon: "👥",
      title: "Задачи остались без исполнителей",
      description:
        "Вы не назначили ни одной задачи членам команды. Без назначенных исполнителей работа не двигается.",
      detailed: `
        **Последствия:**
        • Команда простаивала, потому что не знала, что делать
        • Прогресс задач оставался на нуле
        • Бюджет тратился впустую на ожидание указаний
        
        **Как исправить:**
        • При старте проекта сразу откройте панель задач
        • Для каждой задачи нажмите "Назначить" и выберите подходящего специалиста
        • Учитывайте эффективность сотрудников — разработчика не стоит ставить на дизайн
      `,
    });
  }

  // 3. Анализ приоритетов
  if (actions.priorityChanges === 0 && totalDays > 5) {
    recommendations.push({
      type: "warning",
      icon: "🎯",
      title: "Приоритеты задач не менялись",
      description:
        "Приоритеты задач оставались неизменными на протяжении всего проекта, хотя в реальности они должны пересматриваться.",
      detailed: `
        **Почему это важно:**
        • Критические задачи могут терять актуальность
        • Новые задачи могут появляться с высоким приоритетом
        • Зависимости между задачами требуют пересмотра расписания
        
        **Рекомендация:** Каждые 3-5 дней пересматривайте список задач и повышайте приоритет тем, у которых:
        • Приближается дедлайн, а прогресс низкий
        • От них зависят другие задачи
        • Клиент запросил срочные изменения
      `,
    });
  }

  // 4. Анализ бюджета
  if (metrics.budgetVariance > 20) {
    recommendations.push({
      type: "warning",
      icon: "💰",
      title: "Значительное превышение бюджета",
      description: `Бюджет превышен на ${metrics.budgetVariance.toFixed(1)}%. Это критическое отклонение для проекта.`,
      detailed: `
        **Причины превышения:**
        • Возможно, вы не контролировали затраты на ресурсы
        • Риски съели значительную часть бюджета
        • Задачи занимали больше времени, чем планировалось
        
        **Как избежать в будущем:**
        1. Создайте резервный фонд (минимум 15% от бюджета)
        2. Отслеживайте бюджет ежедневно через верхнюю панель
        3. При приближении к лимиту, временно приостановите дорогие задачи
        4. Используйте более дешевых исполнителей для нетребовательных задач
      `,
    });
  } else if (metrics.budgetVariance < -10) {
    recommendations.push({
      type: "success",
      icon: "🎉",
      title: "Отличная экономия бюджета!",
      description: `Вы сэкономили ${Math.abs(metrics.budgetVariance).toFixed(1)}% бюджета. Это отличный результат!`,
      detailed: `
        **Что вы сделали правильно:**
        • Эффективно распределили ресурсы
        • Минимизировали влияние рисков на бюджет
        • Возможно, завершили задачи быстрее ожидаемого
        
        **Совет:** Сэкономленные средства можно было направить на:
        • Повышение качества через дополнительное тестирование
        • Премии команде для повышения мотивации
        • Дополнительные функции, которые повысят удовлетворенность
      `,
    });
  }

  // 5. Анализ времени
  if (metrics.timeVariance > 30) {
    recommendations.push({
      type: "warning",
      icon: "⏰",
      title: "Серьёзное отставание от графика",
      description: `Проект занял на ${metrics.timeVariance.toFixed(1)}% больше времени, чем планировалось.`,
      detailed: `
        **Причины отставания:**
        • Задачи стартовали позже запланированного из-за нераспределения ресурсов
        • Риски вызывали задержки, к которым вы не были готовы
        • Отсутствовал план действий при форс-мажорах
        
        **Как улучшить тайм-менеджмент:**
        1. Используйте диаграмму Ганта для визуализации зависимостей
        2. Добавляйте буферные дни между связанными задачами
        3. Ежедневно проверяйте красные задачи (критический путь)
        4. При возникновении задержки — пересматривайте расписание
      `,
    });
  } else if (metrics.timeVariance < -10) {
    recommendations.push({
      type: "success",
      icon: "🚀",
      title: "Досрочное завершение!",
      description: `Вы завершили проект на ${Math.abs(metrics.timeVariance).toFixed(1)}% быстрее срока. Превосходный тайм-менеджмент!`,
      detailed: `
        **Что способствовало успеху:**
        • Четкое планирование и распределение задач
        • Быстрая реакция на изменения
        • Эффективная коммуникация с командой
        
        **Как закрепить успех:** 
        Попробуйте более сложный кейс, где сроки будут жестче, а задач больше. Ваш текущий уровень позволяет переходить на следующий этап.
      `,
    });
  }

  // 6. Анализ удовлетворенности
  if (metrics.finalSatisfaction < 50) {
    recommendations.push({
      type: "warning",
      icon: "😟",
      title: "Низкая удовлетворенность стейкхолдеров",
      description: `Удовлетворенность упала до ${metrics.finalSatisfaction}%. Клиент недоволен результатом.`,
      detailed: `
        **Факторы, влияющие на удовлетворенность:**
        • Задержки сроков
        • Превышение бюджета
        • Низкое качество выполнения
        • Плохая коммуникация
        
        **Как повысить удовлетворенность:**
        1. Держите клиента в курсе прогресса через регулярные отчеты
        2. Сдавайте промежуточные результаты для обратной связи
        3. Быстро реагируйте на замечания
        4. Управляйте ожиданиями — не обещайте невозможного
      `,
    });
  } else if (metrics.finalSatisfaction > 85) {
    recommendations.push({
      type: "success",
      icon: "⭐",
      title: "Высокая удовлетворенность!",
      description: `Удовлетворенность составила ${metrics.finalSatisfaction}%. Клиент в восторге от вашей работы!`,
      detailed: `
        **Поздравляем! Вы показали отличный результат.**
        
        **Что вы делали правильно:**
        • Укладывались в сроки и бюджет
        • Качественно выполняли задачи
        • Вероятно, хорошо коммуницировали с командой и стейкхолдерами
        
        **Следующий уровень:** Попробуйте управлять проектом с более агрессивными сроками или меньшим бюджетом — это проверит ваши навыки на прочность.
      `,
    });
  }

  // 7. Анализ качества
  if (metrics.finalQuality < 60) {
    recommendations.push({
      type: "warning",
      icon: "🔧",
      title: "Проблемы с качеством",
      description: `Качество выполнения задач составило всего ${metrics.finalQuality}%.`,
      detailed: `
        **Причины низкого качества:**
        • Слишком высокая нагрузка на команду
        • Перегорание сотрудников от переработок
        • Недостаточно времени на тестирование
        
        **Как улучшить качество:**
        1. Не повышайте приоритет критических задач слишком часто (это выжигает команду)
        2. Добавляйте время на тестирование в график
        3. Следите за индикатором качества на верхней панели
        4. При снижении качества — временно снизьте нагрузку
      `,
    });
  }

  // 8. Анализ рисков
  if (
    simulation.occurredRisks &&
    simulation.occurredRisks.length > (scenario.risks?.length || 0) / 2
  ) {
    recommendations.push({
      type: "warning",
      icon: "⚠️",
      title: "Много наступивших рисков",
      description: `Наступило ${simulation.occurredRisks.length} из ${scenario.risks?.length || 0} возможных рисков.`,
      detailed: `
        **Выявленные риски:**
        ${simulation.occurredRisks.map((r) => `• ${r.name} (день ${r.dayOccurred})`).join("\n")}
        
        **Как управлять рисками:**
        1. При старте проекта изучите список возможных рисков в правой панели
        2. Для каждого риска с вероятностью >30% продумайте план действий
        3. Создайте резервы времени и бюджета под самые опасные риски
        4. При наступлении риска — сразу применяйте контрмеры
        
        **Важно:** Невозможно предотвратить все риски, но можно минимизировать их влияние.
      `,
    });
  }

  // 9. Итоговая рекомендация
  const successfulActions = recommendations.filter(
    (r) => r.type === "success",
  ).length;
  const criticalActions = recommendations.filter(
    (r) => r.type === "critical",
  ).length;
  const warningActions = recommendations.filter(
    (r) => r.type === "warning",
  ).length;

  let summary = "";
  if (criticalActions > 0) {
    summary =
      "У вас есть критические ошибки в управлении. Обязательно изучите рекомендации выше — они помогут значительно улучшить результат в следующий раз. Начните с назначения задач и ежедневного контроля прогресса.";
  } else if (warningActions > 0 && successfulActions === 0) {
    summary =
      "Неплохая попытка, но есть куда расти. Сосредоточьтесь на управлении бюджетом и временем. Используйте диаграмму Ганта для планирования.";
  } else if (successfulActions >= 2) {
    summary =
      "Отличная работа! Вы показали хорошее понимание проектного управления. Для дальнейшего роста попробуйте кейс посложнее или установите себе дополнительные ограничения (меньше бюджета, жестче сроки).";
  } else {
    summary =
      "Продолжайте практиковаться! Управление проектами — это навык, который приходит с опытом. Каждая следующая симуляция будет даваться легче.";
  }

  return { recommendations, summary };
}

app.post("/api/simulations/:id/nextDay", verifyToken, async (req, res) => {
  try {
    const simulations = await readSimulations();
    const simulationIndex = simulations.findIndex(
      (s) => s.id === parseInt(req.params.id),
    );

    if (simulationIndex === -1) {
      return res.status(404).json({ error: "Симуляция не найдена" });
    }

    const simulation = simulations[simulationIndex];
    const scenarios = await readScenarios();
    const scenario = scenarios.find((s) => s.id === simulation.scenarioId);

    if (simulation.status !== "in_progress") {
      return res.status(400).json({ error: "Симуляция уже завершена" });
    }

    // Проверяем, были ли действия в этот день
    const hadActionsToday =
      simulation.userActions.lastActionDay !== simulation.currentDay;
    if (!hadActionsToday) {
      simulation.userActions.daysSkipped =
        (simulation.userActions.daysSkipped || 0) + 1;
    }

    simulation.currentDay++;
    simulation.userActions.lastActionDay = null;

    // Обновление прогресса задач
    let anyTaskInProgress = false;
    simulation.tasks.forEach((task) => {
      if (task.status === "in_progress" && task.assignedTo) {
        anyTaskInProgress = true;
        const resource = scenario.resources.find(
          (r) => r.id === task.assignedTo,
        );
        const efficiency = resource?.efficiency || 1;
        let dailyProgress = (task.dailyProgress || 10) * efficiency;

        // Если приоритет высокий - ускорение, но риск выгорания
        if (task.priority === "high") {
          dailyProgress *= 1.2;
        }

        task.progress = Math.min(100, task.progress + dailyProgress);

        if (task.progress >= 100) {
          task.status = "completed";
          task.actualEndDay = simulation.currentDay;
          simulation.completedTasks.push(task.id);
          simulation.logs.push({
            day: simulation.currentDay,
            message: `✅ Задача "${task.title}" завершена!`,
            type: "success",
          });
        }
      }
    });

    // Если нет активных задач - предупреждение
    if (!anyTaskInProgress && simulation.currentDay > 1) {
      simulation.logs.push({
        day: simulation.currentDay,
        message: `⚠️ Внимание: Нет активных задач! Назначьте задачи членам команды.`,
        type: "warning",
      });
    }

    // Обработка рисков
    scenario.risks.forEach((risk) => {
      if (
        !simulation.occurredRisks.some((r) => r.id === risk.id) &&
        Math.random() < risk.probability / 100
      ) {
        let effectMessage = "";
        let effectValue = 0;

        if (risk.type === "budget") {
          const reduction = simulation.budget * (risk.severity / 100);
          simulation.budget = Math.max(0, simulation.budget - reduction);
          effectValue = reduction;
          effectMessage = `Бюджет уменьшен на ${Math.round(reduction).toLocaleString()} сом`;
        } else if (risk.type === "time") {
          const delayDays = risk.severity;
          simulation.tasks.forEach((task) => {
            if (task.status === "in_progress") {
              task.delay += delayDays;
            }
          });
          effectValue = delayDays;
          effectMessage = `Все задачи задержаны на ${delayDays} ${getDaysWord(delayDays)}`;
        } else if (risk.type === "satisfaction") {
          const reduction = risk.severity;
          simulation.satisfaction = Math.max(
            0,
            simulation.satisfaction - reduction,
          );
          effectValue = reduction;
          effectMessage = `Удовлетворенность снижена на ${reduction}%`;
        } else if (risk.type === "quality") {
          const reduction = risk.severity;
          simulation.quality = Math.max(0, simulation.quality - reduction);
          effectValue = reduction;
          effectMessage = `Качество снижено на ${reduction}%`;
        }

        simulation.occurredRisks.push({
          ...risk,
          dayOccurred: simulation.currentDay,
          effect: effectMessage,
        });

        simulation.logs.push({
          day: simulation.currentDay,
          message: `⚠️ РИСК: ${risk.name}. ${effectMessage}`,
          type: "risk",
        });
      }
    });

    // Расчет удовлетворенности
    const completedCount = simulation.tasks.filter(
      (t) => t.status === "completed",
    ).length;
    const totalTasks = simulation.tasks.length;
    const expectedProgress = simulation.currentDay / scenario.duration;
    const actualProgress = completedCount / totalTasks;

    let satisfactionChange = 0;
    if (actualProgress > expectedProgress + 0.1) {
      satisfactionChange = 5;
    } else if (actualProgress > expectedProgress) {
      satisfactionChange = 2;
    } else if (actualProgress < expectedProgress - 0.2) {
      satisfactionChange = -15;
    } else if (actualProgress < expectedProgress - 0.1) {
      satisfactionChange = -8;
    } else if (actualProgress < expectedProgress) {
      satisfactionChange = -3;
    }

    // Штраф за бездействие
    if (!hadActionsToday && simulation.currentDay > 2) {
      satisfactionChange -= 5;
      simulation.logs.push({
        day: simulation.currentDay,
        message: `📉 Удовлетворенность снижена из-за отсутствия управления в предыдущий день`,
        type: "warning",
      });
    }

    simulation.satisfaction = Math.min(
      100,
      Math.max(0, simulation.satisfaction + satisfactionChange),
    );

    // Расчет качества
    let qualityChange = 0;
    const highPriorityTasks = simulation.tasks.filter(
      (t) => t.priority === "high" && t.status === "in_progress",
    ).length;
    if (highPriorityTasks > 3) {
      qualityChange = -5;
      simulation.logs.push({
        day: simulation.currentDay,
        message: `🔥 Внимание: Слишком много задач с высоким приоритетом! Команда перегружена, качество падает.`,
        type: "warning",
      });
    }

    simulation.quality = Math.min(
      100,
      Math.max(0, simulation.quality + qualityChange),
    );

    // Проверка завершения
    const allCompleted = simulation.tasks.every(
      (t) => t.status === "completed",
    );
    const timeOver = simulation.currentDay > scenario.duration;

    if (allCompleted || timeOver) {
      simulation.status = "completed";
      simulation.completedAt = new Date().toISOString();

      const totalDelay = simulation.tasks.reduce((sum, t) => sum + t.delay, 0);
      const budgetUsed = simulation.initialBudget - simulation.budget;
      const budgetVariance =
        ((budgetUsed - scenario.budget) / scenario.budget) * 100;
      const timeVariance =
        ((simulation.currentDay - scenario.duration) / scenario.duration) * 100;

      simulation.finalMetrics = {
        totalDelay,
        budgetUsed,
        budgetVariance,
        timeVariance,
        finalSatisfaction: simulation.satisfaction,
        finalQuality: simulation.quality,
        completedTasksCount: simulation.completedTasks.length,
        totalTasksCount: totalTasks,
      };

      // Генерация подробных рекомендаций
      const detailedRecommendations = generateDetailedRecommendations(
        simulation,
        scenario,
      );
      simulation.recommendations = detailedRecommendations;

      const resultMessage = allCompleted
        ? `🎉 ПОЗДРАВЛЯЕМ! Проект успешно завершен за ${simulation.currentDay} ${getDaysWord(simulation.currentDay)}`
        : `📅 Проект завершен с превышением срока. Срок: ${scenario.duration} ${getDaysWord(scenario.duration)}, фактически: ${simulation.currentDay} ${getDaysWord(simulation.currentDay)}`;

      simulation.logs.push({
        day: simulation.currentDay,
        message: resultMessage,
        type: "completed",
      });

      // Обновление статистики пользователя
      const users = await readUsers();
      const userIndex = users.findIndex((u) => u.id === simulation.userId);
      if (userIndex !== -1) {
        users[userIndex].stats.totalSimulations++;
        users[userIndex].stats.completedSimulations++;
        users[userIndex].stats.totalDaysSpent += simulation.currentDay;

        const score = Math.round(
          simulation.satisfaction * 0.4 +
            (100 - Math.min(100, Math.abs(budgetVariance))) * 0.3 +
            (100 - Math.min(100, Math.abs(timeVariance))) * 0.3,
        );

        const currentTotal =
          users[userIndex].stats.averageScore *
          (users[userIndex].stats.completedSimulations - 1);
        users[userIndex].stats.averageScore =
          (currentTotal + score) / users[userIndex].stats.completedSimulations;

        await writeUsers(users);
      }
    }

    simulation.lastUpdatedAt = new Date().toISOString();
    simulations[simulationIndex] = simulation;
    await writeSimulations(simulations);

    res.json(simulation);
  } catch (error) {
    console.error("Error advancing day:", error);
    res.status(500).json({ error: "Ошибка при переходе на следующий день" });
  }
});

app.post("/api/simulations/:id/complete", verifyToken, async (req, res) => {
  try {
    const simulations = await readSimulations();
    const simulationIndex = simulations.findIndex(
      (s) => s.id === parseInt(req.params.id),
    );

    if (simulationIndex === -1) {
      return res.status(404).json({ error: "Симуляция не найдена" });
    }

    simulations[simulationIndex].status = "completed";
    simulations[simulationIndex].completedAt = new Date().toISOString();
    simulations[simulationIndex].lastUpdatedAt = new Date().toISOString();

    const scenarios = await readScenarios();
    const scenario = scenarios.find(
      (s) => s.id === simulations[simulationIndex].scenarioId,
    );
    const totalTasks = simulations[simulationIndex].tasks.length;
    const completedCount = simulations[simulationIndex].completedTasks.length;
    const budgetUsed =
      simulations[simulationIndex].initialBudget -
      simulations[simulationIndex].budget;
    const budgetVariance =
      ((budgetUsed - scenario.budget) / scenario.budget) * 100;
    const timeVariance =
      ((simulations[simulationIndex].currentDay - scenario.duration) /
        scenario.duration) *
      100;

    simulations[simulationIndex].finalMetrics = {
      totalDelay: simulations[simulationIndex].tasks.reduce(
        (sum, t) => sum + t.delay,
        0,
      ),
      budgetUsed,
      budgetVariance,
      timeVariance,
      finalSatisfaction: simulations[simulationIndex].satisfaction,
      finalQuality: simulations[simulationIndex].quality,
      completedTasksCount: completedCount,
      totalTasksCount: totalTasks,
    };

    // Генерация подробных рекомендаций
    const detailedRecommendations = generateDetailedRecommendations(
      simulations[simulationIndex],
      scenario,
    );
    simulations[simulationIndex].recommendations = detailedRecommendations;

    await writeSimulations(simulations);
    res.json(simulations[simulationIndex]);
  } catch (error) {
    console.error("Error completing simulation:", error);
    res.status(500).json({ error: "Ошибка завершения симуляции" });
  }
});

// Добавьте этот код в server.js после других маршрутов
app.get("/api/leaderboard", verifyToken, async (req, res) => {
  try {
    const simulations = await readSimulations();
    const users = await readUsers();
    const period = req.query.period || "all";

    let filteredSims = simulations.filter((s) => s.status === "completed");

    // Фильтр по периоду
    if (period === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredSims = filteredSims.filter(
        (s) => new Date(s.completedAt) > weekAgo,
      );
    } else if (period === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filteredSims = filteredSims.filter(
        (s) => new Date(s.completedAt) > monthAgo,
      );
    }

    // Подсчёт очков
    const leaderboard = users
      .filter((u) => u.role !== "admin")
      .map((user) => {
        const userSims = filteredSims.filter((s) => s.userId === user.id);
        const totalScore = userSims.reduce((sum, sim) => {
          const metrics = sim.finalMetrics || {};
          const score = Math.round(
            (metrics.finalSatisfaction || 0) * 0.4 +
              (100 - Math.min(100, Math.abs(metrics.budgetVariance || 0))) *
                0.3 +
              (100 - Math.min(100, Math.abs(metrics.timeVariance || 0))) * 0.3,
          );
          return sum + score;
        }, 0);

        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          totalScore,
          completedProjects: userSims.length,
          avgScore:
            userSims.length > 0 ? Math.round(totalScore / userSims.length) : 0,
        };
      })
      .filter((u) => u.completedProjects > 0)
      .sort((a, b) => b.totalScore - a.totalScore);

    res.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ error: "Ошибка загрузки рейтинга" });
  }
});

// -------------------- ADMIN ROUTES --------------------
app.get("/api/admin/users", verifyToken, requireAdmin, async (req, res) => {
  try {
    const users = await readUsers();
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  } catch (error) {
    res.status(500).json({ error: "Ошибка загрузки пользователей" });
  }
});

app.get("/api/admin/stats", verifyToken, requireAdmin, async (req, res) => {
  try {
    const users = await readUsers();
    const simulations = await readSimulations();
    const scenarios = await readScenarios();

    const completedSimulations = simulations.filter(
      (s) => s.status === "completed",
    );
    const scenarioStats = scenarios.map((scenario) => {
      const scenarioSimulations = simulations.filter(
        (s) => s.scenarioId === scenario.id,
      );
      const completedScenarios = scenarioSimulations.filter(
        (s) => s.status === "completed",
      );
      const avgScore =
        completedScenarios.length > 0
          ? completedScenarios.reduce(
              (sum, s) => sum + (s.finalMetrics?.finalSatisfaction || 0),
              0,
            ) / completedScenarios.length
          : 0;

      return {
        id: scenario.id,
        title: scenario.title,
        attempts: scenarioSimulations.length,
        completedCount: completedScenarios.length,
        avgScore,
      };
    });

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    const dailyActivity = last7Days.map((date) => {
      const count = simulations.filter(
        (s) => s.startedAt.split("T")[0] === date,
      ).length;
      return { date, count };
    });

    res.json({
      totalUsers: users.length,
      totalSimulations: simulations.length,
      completedSimulations: completedSimulations.length,
      scenarioStats,
      dailyActivity,
    });
  } catch (error) {
    res.status(500).json({ error: "Ошибка загрузки статистики" });
  }
});

function getDaysWord(days) {
  const lastDigit = days % 10;
  const lastTwoDigits = days % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return "дней";
  }

  if (lastDigit === 1) return "день";
  if (lastDigit >= 2 && lastDigit <= 4) return "дня";
  return "дней";
}

// Запуск сервера
initDataFiles()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📁 Data directory: ${DATA_DIR}`);
      console.log(`👨‍💼 Admin: admin@okuyim.com / admin123`);
    });
  })
  .catch(console.error);
