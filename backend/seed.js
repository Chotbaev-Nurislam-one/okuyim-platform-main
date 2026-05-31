const bcrypt = require("bcryptjs");
const fs = require("fs").promises;
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const SIMULATIONS_FILE = path.join(DATA_DIR, "simulations.json");
const SCENARIOS_FILE = path.join(DATA_DIR, "scenarios.json");

async function seedDatabase() {
  console.log("🌱 Начинаем заполнение базы данных...");

  // Читаем существующие данные
  let users = await readUsers();
  const scenarios = await readScenarios();
  let simulations = await readSimulations();

  const passwordHash = await bcrypt.hash("qweqwe", 10);

  // Находим существующих тестовых пользователей или создаём новых
  const testEmails = [
    "aybek@test.com",
    "nurs@test.com",
    "aigerim@test.com",
    "misha@test.com",
    "elena@test.com",
    "daniyar@test.com",
    "madina@test.com",
    "sasha@test.com",
    "dinara@test.com",
    "azamat@test.com",
  ];

  let nextId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 2;
  const testUsers = [];

  // Создаём или находим тестовых пользователей
  for (const email of testEmails) {
    let user = users.find((u) => u.email === email);
    if (!user) {
      const name = email.split("@")[0];
      user = {
        id: nextId++,
        firstName: name.charAt(0).toUpperCase() + name.slice(1),
        lastName: "Тестов",
        email: email,
        password: passwordHash,
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
      users.push(user);
      testUsers.push(user);
      console.log(`✅ Добавлен пользователь: ${email} (пароль: qweqwe)`);
    } else {
      testUsers.push(user);
      console.log(`📌 Пользователь уже существует: ${email}`);
    }
  }

  await writeUsers(users);

  // Данные для симуляций (разные результаты для каждого пользователя)
  const userScores = {
    "aybek@test.com": [95, 88, 92, 90, 85],
    "nurs@test.com": [85, 90, 82, 88, 87],
    "aigerim@test.com": [88, 84, 86, 82, 90, 80],
    "misha@test.com": [75, 80, 78],
    "elena@test.com": [96, 94, 98, 92, 95, 97, 93],
    "daniyar@test.com": [80, 85, 78, 82],
    "madina@test.com": [92, 88, 94, 86, 90],
    "sasha@test.com": [72, 78, 80],
    "dinara@test.com": [95, 93, 96, 94, 92, 95, 98, 91],
    "azamat@test.com": [70, 72, 74],
  };

  // Удаляем старые симуляции для тестовых пользователей
  const testUserIds = testUsers.map((u) => u.id);
  const originalLength = simulations.length;
  simulations = simulations.filter((s) => !testUserIds.includes(s.userId));
  console.log(
    `🗑️ Удалено старых симуляций: ${originalLength - simulations.length}`,
  );

  // Создаём новые симуляции
  let simId =
    simulations.length > 0 ? Math.max(...simulations.map((s) => s.id)) + 1 : 1;
  const scenario = scenarios[0];

  if (!scenario) {
    console.error("❌ Кейсы не найдены! Сначала создайте кейсы.");
    return;
  }

  const newSimulations = [];

  for (const user of testUsers) {
    const scores = userScores[user.email] || [80];

    for (let i = 0; i < scores.length; i++) {
      const score = scores[i];
      const satisfaction = Math.min(
        100,
        score + Math.floor(Math.random() * 10) - 5,
      );
      const budgetVariance = Math.floor(Math.random() * 30) - 10;
      const timeVariance = Math.floor(Math.random() * 40) - 15;
      const daysSpent = Math.floor(
        scenario.duration * (1 + timeVariance / 100),
      );
      const quality = Math.min(
        100,
        satisfaction - 5 + Math.floor(Math.random() * 15),
      );

      const completedAt = new Date();
      completedAt.setDate(
        completedAt.getDate() - Math.floor(Math.random() * 30),
      );

      const simulation = {
        id: simId++,
        userId: user.id,
        scenarioId: scenario.id,
        status: "completed",
        currentDay: Math.min(daysSpent, scenario.duration + 10),
        budget: scenario.budget - scenario.budget * (budgetVariance / 100),
        initialBudget: scenario.budget,
        satisfaction: satisfaction,
        quality: quality,
        completedTasks: scenario.tasks.map((t) => t.id),
        tasks: scenario.tasks.map((task) => ({
          ...task,
          status: "completed",
          progress: 100,
          assignedTo: (task.id % 5) + 1,
          actualStartDay: task.startDay,
          actualEndDay: task.endDay + Math.floor(Math.random() * 3) - 1,
          plannedStartDay: task.startDay,
          plannedEndDay: task.endDay,
          delay: Math.floor(Math.random() * 3),
        })),
        logs: [
          {
            day: 0,
            message: `Проект "${scenario.title}" запущен`,
            type: "info",
          },
          {
            day: scenario.duration,
            message: "Проект успешно завершён!",
            type: "completed",
          },
        ],
        activeRisks: [],
        occurredRisks: scenario.risks
          .filter(() => Math.random() > 0.7)
          .map((r) => ({
            ...r,
            dayOccurred: Math.floor(Math.random() * scenario.duration),
            effect: `Наступил риск: ${r.name}`,
          })),
        startedAt: new Date(
          completedAt.getTime() - daysSpent * 24 * 60 * 60 * 1000,
        ).toISOString(),
        completedAt: completedAt.toISOString(),
        lastUpdatedAt: completedAt.toISOString(),
        userActions: {
          tasksAssigned: scenario.tasks.length,
          priorityChanges: Math.floor(Math.random() * 10),
          daysSkipped: Math.floor(Math.random() * 5),
          risksMitigated: Math.floor(Math.random() * 3),
        },
        finalMetrics: {
          totalDelay: Math.floor(Math.random() * 10),
          budgetUsed: scenario.budget * (Math.abs(budgetVariance) / 100),
          budgetVariance: budgetVariance,
          timeVariance: timeVariance,
          finalSatisfaction: satisfaction,
          finalQuality: quality,
          completedTasksCount: scenario.tasks.length,
          totalTasksCount: scenario.tasks.length,
        },
      };

      newSimulations.push(simulation);

      // Обновляем статистику пользователя
      const userIndex = users.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex].stats.totalSimulations++;
        users[userIndex].stats.completedSimulations++;
        users[userIndex].stats.totalDaysSpent += simulation.currentDay;

        const finalScore = Math.round(
          satisfaction * 0.4 +
            (100 - Math.min(100, Math.abs(budgetVariance))) * 0.3 +
            (100 - Math.min(100, Math.abs(timeVariance))) * 0.3,
        );

        const currentTotal =
          users[userIndex].stats.averageScore *
          (users[userIndex].stats.completedSimulations - 1);
        users[userIndex].stats.averageScore =
          (currentTotal + finalScore) /
          users[userIndex].stats.completedSimulations;
      }
    }
  }

  // Добавляем новые симуляции
  for (const sim of newSimulations) {
    simulations.push(sim);
  }

  await writeSimulations(simulations);
  await writeUsers(users);

  console.log(`✅ Добавлено ${newSimulations.length} тестовых симуляций`);
  console.log(`📊 Всего симуляций теперь: ${simulations.length}`);
  console.log(`🎉 База данных успешно заполнена!`);
  console.log("");
  console.log("📝 Тестовые аккаунты (пароль: qweqwe):");
  testUsers.forEach((u) => console.log(`   ${u.email}`));
}

// Вспомогательные функции
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

async function readScenarios() {
  try {
    const data = await fs.readFile(SCENARIOS_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function readSimulations() {
  try {
    const data = await fs.readFile(SIMULATIONS_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeSimulations(simulations) {
  await fs.writeFile(SIMULATIONS_FILE, JSON.stringify(simulations, null, 2));
}

// Запуск
seedDatabase().catch(console.error);
