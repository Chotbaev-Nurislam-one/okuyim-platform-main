import React, { useState } from "react";
import {
  BookOpenIcon,
  ClockIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  CalculatorIcon,
  ArrowPathIcon,
  LightBulbIcon,
  AcademicCapIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlayIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

function Theory() {
  const [expandedSection, setExpandedSection] = useState(null);

  const sections = [
    {
      id: "formula",
      title: "Формула расчёта прогресса",
      icon: CalculatorIcon,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      content: {
        formula: `P_new = P_old + (E_eff × T) / W`,
        description: "Где:",
        variables: [
          { name: "P_new", desc: "Новый прогресс задачи (%)" },
          { name: "P_old", desc: "Текущий прогресс задачи (%)" },
          {
            name: "E_eff",
            desc: "Эффективная мощность назначенных ресурсов (человеко-часы)",
          },
          { name: "T", desc: "Квант времени (обычно 1 день или 8 часов)" },
          { name: "W", desc: "Общие трудозатраты задачи (человеко-часы)" },
        ],
        example: `
          **Пример расчёта:**
          • Задача "Разработка модуля" требует 40 человеко-часов (W = 40)
          • На задачу назначен разработчик с эффективностью 1.0 (E_eff = 8 ч/день)
          • За один день (T = 8) прогресс увеличится на: (8 × 8) / 40 = 1.6 часа
          • Это составляет 4% от общей задачи
          
          Если назначить двух разработчиков (E_eff = 16), прогресс ускорится вдвое!
        `,
      },
    },
    {
      id: "risks",
      title: "Механизм имитации рисков",
      icon: ExclamationTriangleIcon,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      content: {
        description:
          "Каждый день система проверяет возможность наступления рисков. Риски имеют определённую вероятность и могут повлиять на различные аспекты проекта.",
        riskTypes: [
          {
            type: "Временные",
            effect: "Задерживают выполнение задач",
            example: "Задержка сервера на 2 дня",
          },
          {
            type: "Бюджетные",
            effect: "Увеличивают расходы",
            example: "Непредвиденные затраты -15% бюджета",
          },
          {
            type: "Качественные",
            effect: "Снижают качество работы",
            example: "Перегорание разработчика - качество на 15%",
          },
          {
            type: "Командные",
            effect: "Снижают удовлетворённость",
            example: "Низкая мотивация -10% удовлетворённости",
          },
        ],
        formula: "Если random() < вероятность_риска / 100, то риск наступает",
        example: `
          **Как управлять рисками:**
          1. Изучите список возможных рисков перед стартом проекта
          2. Для рисков с вероятностью >30% создайте план действий
          3. Создайте резерв бюджета (15-20%) под непредвиденные ситуации
          4. Добавьте буферные дни в график (обычно +20% к срокам)
          5. При наступлении риска — сразу принимайте меры!
        `,
      },
    },
    {
      id: "critical-path",
      title: "Расчёт критического пути",
      icon: ArrowPathIcon,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      content: {
        description:
          "Критический путь — это последовательность задач, от которых зависит общая длительность проекта. Любая задержка на критическом пути приводит к задержке всего проекта.",
        concepts: [
          {
            name: "Ранний старт (ES)",
            desc: "Самое раннее время, когда задача может начаться",
          },
          { name: "Ранний финиш (EF)", desc: "ES + длительность задачи" },
          {
            name: "Поздний старт (LS)",
            desc: "Самое позднее время старта без задержки проекта",
          },
          { name: "Поздний финиш (LF)", desc: "LS + длительность задачи" },
          {
            name: "Резерв времени",
            desc: "Разница между LF и EF. Если резерв = 0 — задача на критическом пути",
          },
        ],
        example: `
          **Алгоритм расчёта:**
          1. Прямой проход: рассчитываем ES и EF для всех задач
          2. Обратный проход: рассчитываем LS и LF
          3. Находим задачи с нулевым резервом → это критический путь
          4. В симуляции эти задачи подсвечиваются красным!
          
          **Совет:** Всегда следите за задачами на критическом пути. Их задержка = задержка всего проекта!
        `,
      },
    },
    {
      id: "methodologies",
      title: "Методологии управления проектами",
      icon: AcademicCapIcon,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      content: {
        methodologies: [
          {
            name: "Waterfall (Каскадная)",
            desc: "Последовательное выполнение этапов: анализ → дизайн → разработка → тестирование → запуск",
            pros: [
              "Простая и понятная",
              "Чёткие этапы и результаты",
              "Лёгкое планирование бюджета",
            ],
            cons: [
              "Сложно вернуться назад",
              "Позднее обнаружение ошибок",
              "Не подходит для сложных проектов",
            ],
          },
          {
            name: "Agile (Гибкая)",
            desc: "Итеративная разработка с короткими спринтами (обычно 1-4 недели)",
            pros: [
              "Быстрая адаптация к изменениям",
              "Ранняя поставка ценности",
              "Постоянная обратная связь",
            ],
            cons: [
              "Сложнее планировать бюджет",
              "Требует высокой дисциплины",
              "Не подходит для фиксированной цены",
            ],
          },
          {
            name: "Scrum",
            desc: "Фреймворк Agile с ролями (Product Owner, Scrum Master, Команда)",
            pros: [
              "Прозрачность процесса",
              "Мотивация команды",
              "Регулярные демо-результатов",
            ],
            cons: [
              "Требует вовлеченности заказчика",
              "Сложно масштабировать",
              "Не подходит для больших команд",
            ],
          },
        ],
      },
    },
    {
      id: "metrics",
      title: "Ключевые метрики проекта",
      icon: ChartBarIcon,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      content: {
        metrics: [
          {
            name: "CPI (Cost Performance Index)",
            formula: "CPI = EV / AC",
            desc: "Эффективность использования бюджета. CPI > 1 — хорошо, < 1 — плохо",
          },
          {
            name: "SPI (Schedule Performance Index)",
            formula: "SPI = EV / PV",
            desc: "Эффективность соблюдения сроков. SPI > 1 — опережаем график",
          },
          {
            name: "EAC (Estimate at Completion)",
            formula: "EAC = BAC / CPI",
            desc: "Прогноз общей стоимости проекта",
          },
          {
            name: "ETC (Estimate to Complete)",
            formula: "ETC = EAC - AC",
            desc: "Оставшийся бюджет для завершения",
          },
        ],
        example: `
          **Практический пример:**
          • Плановая стоимость (PV) = 50 000 сом
          • Фактические затраты (AC) = 55 000 сом
          • Освоенный объём (EV) = 45 000 сом
          
          CPI = 45 000 / 55 000 = 0.82 (перерасход бюджета на 18%)
          SPI = 45 000 / 50 000 = 0.90 (отставание от графика на 10%)
          
          EAC = 100 000 / 0.82 = 121 951 сом (прогнозируемый перерасход)
        `,
      },
    },
    {
      id: "team-management",
      title: "Управление командой и ресурсами",
      icon: UserGroupIcon,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      content: {
        tips: [
          "**Назначайте задачи сразу** — не ждите, пока команда сама начнёт работать",
          "**Учитывайте эффективность** — разные сотрудники работают с разной скоростью",
          "**Не перегружайте команду** — более 3-х задач с высоким приоритетом вызывают выгорание",
          "**Меняйте приоритеты гибко** — приоритеты должны пересматриваться каждые 3-5 дней",
          "**Следите за качеством** — если качество падает ниже 60%, снизьте нагрузку",
          "**Мотивируйте команду** — высокая удовлетворённость = высокая продуктивность",
        ],
        resourceFormula:
          "E_eff = Σ (базовая_эффективность × приоритет_задачи × состояние_команды)",
        example: `
          **Факторы влияющие на эффективность:**
          • Базовые навыки сотрудника (1.2 для сеньора, 0.8 для джуна)
          • Приоритет задачи (высокий приоритет даёт +20% к скорости, но рискует выгоранием)
          • Состояние команды (при перегрузке эффективность падает на 15-30%)
        `,
      },
    },
    {
      id: "recommendations",
      title: "Рекомендации для успешного управления",
      icon: LightBulbIcon,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      content: {
        recommendations: [
          "**Начинайте с планирования** — первые 2-3 дня посвятите распределению задач и ресурсов",
          "**Создайте резервы** — всегда оставляйте 15-20% бюджета и времени на непредвиденные ситуации",
          "**Ежедневно проверяйте прогресс** — 5 минут в день могут спасти проект от провала",
          "**Визуализируйте задачи** — диаграмма Ганта поможет увидеть зависимости",
          "**Фокусируйтесь на критическом пути** — красные задачи должны быть в приоритете",
          "**Анализируйте риски** — изучите список рисков перед стартом и подготовьте план",
          "**Учитесь на ошибках** — каждый проект делает вас лучше, анализируйте отчёты",
          "**Повышайте сложность** — как только освоитесь с кейсом, берите более сложный",
        ],
        mistakeExamples: [
          "❌ Пропускать дни без действий → команда простаивает, прогресс = 0",
          "❌ Назначать задачи без учёта специализации → низкая эффективность",
          "❌ Игнорировать риски → внезапные проблемы срывают сроки",
          "❌ Не следить за бюджетом → перерасход в конце проекта",
          "❌ Ставить высокий приоритет всем задачам → выгорание + низкое качество",
        ],
      },
    },
  ];

  const [openVideo, setOpenVideo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg mb-6">
            <BookOpenIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Теория управления проектами
          </h1>
          <p className="text-gray-500 text-lg">
            Изучите основы и станьте экспертом в тайм-менеджменте
          </p>
        </div>

        {/* Video Introduction */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div
            className="relative h-64 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center cursor-pointer group"
            onClick={() => setOpenVideo(true)}
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all" />
            <div className="relative text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <PlayIcon className="w-10 h-10 text-indigo-600 ml-1" />
              </div>
              <h3 className="text-white text-xl font-semibold">
                Введение в управление проектами
              </h3>
              <p className="text-indigo-100 mt-1">5-минутный видео-урок</p>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <DocumentTextIcon className="w-8 h-8 text-indigo-500" />
              <div>
                <p className="text-gray-600">
                  Узнайте основы проектного менеджмента за 5 минут. В этом видео
                  мы расскажем о ключевых принципах, метриках и подходах к
                  управлению проектами.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Video Modal */}
        {openVideo && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setOpenVideo(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">
                  Введение в управление проектами
                </h3>
                <button
                  onClick={() => setOpenVideo(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                <p className="text-gray-400">
                  Видео-контент будет добавлен в следующей версии
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Theory Sections */}
        <div className="space-y-4">
          {sections.map((section) => {
            const isExpanded = expandedSection === section.id;
            const Icon = section.icon;

            return (
              <div
                key={section.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedSection(isExpanded ? null : section.id)
                  }
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Нажмите для подробностей
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-5">
                    {/* Формула */}
                    {section.id === "formula" && (
                      <div>
                        <div
                          className={`${section.bgColor} rounded-xl p-6 mb-6`}
                        >
                          <div className="text-center">
                            <div className="text-3xl font-mono font-bold text-gray-800 mb-4">
                              {section.content.formula}
                            </div>
                            <p className="text-gray-600">
                              {section.content.description}
                            </p>
                          </div>
                          <div className="mt-6 grid gap-3">
                            {section.content.variables.map((v, i) => (
                              <div
                                key={i}
                                className="flex items-start space-x-3"
                              >
                                <code className="bg-white px-2 py-1 rounded text-indigo-600 font-mono text-sm">
                                  {v.name}
                                </code>
                                <span className="text-gray-600">{v.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          {section.content.example
                            .split("\n")
                            .map((line, i) => {
                              if (line.startsWith("**")) {
                                return (
                                  <h4
                                    key={i}
                                    className="font-semibold text-gray-800 mt-4 mb-2"
                                  >
                                    {line.slice(2, -2)}
                                  </h4>
                                );
                              }
                              if (line.startsWith("•")) {
                                return (
                                  <li key={i} className="text-gray-600 ml-4">
                                    {line.slice(1)}
                                  </li>
                                );
                              }
                              if (line.trim()) {
                                return (
                                  <p key={i} className="text-gray-600">
                                    {line}
                                  </p>
                                );
                              }
                              return null;
                            })}
                        </div>
                      </div>
                    )}

                    {/* Риски */}
                    {section.id === "risks" && (
                      <div>
                        <p className="text-gray-600 mb-6">
                          {section.content.description}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {section.content.riskTypes.map((risk, i) => (
                            <div key={i} className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-800 mb-1">
                                {risk.type}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {risk.effect}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                Пример: {risk.example}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div
                          className={`${section.bgColor} rounded-xl p-4 mb-4`}
                        >
                          <code className="text-sm font-mono">
                            {section.content.formula}
                          </code>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          {section.content.example
                            .split("\n")
                            .map((line, i) => {
                              if (line.startsWith("**")) {
                                return (
                                  <h4
                                    key={i}
                                    className="font-semibold text-gray-800 mt-3 mb-2"
                                  >
                                    {line.slice(2, -2)}
                                  </h4>
                                );
                              }
                              if (line.match(/^\d+\./)) {
                                return (
                                  <li key={i} className="text-gray-600 ml-4">
                                    {line}
                                  </li>
                                );
                              }
                              if (line.trim()) {
                                return (
                                  <p key={i} className="text-gray-600">
                                    {line}
                                  </p>
                                );
                              }
                              return null;
                            })}
                        </div>
                      </div>
                    )}

                    {/* Остальные секции */}
                    {(section.id === "critical-path" ||
                      section.id === "metrics" ||
                      section.id === "team-management" ||
                      section.id === "recommendations") && (
                      <div>
                        <p className="text-gray-600 mb-4">
                          {section.content.description}
                        </p>

                        {section.content.concepts && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                            {section.content.concepts.map((concept, i) => (
                              <div
                                key={i}
                                className="bg-gray-50 rounded-lg p-3"
                              >
                                <span className="font-mono text-indigo-600 font-medium">
                                  {concept.name}
                                </span>
                                <p className="text-sm text-gray-600 mt-1">
                                  {concept.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {section.content.metrics && (
                          <div className="space-y-3 mb-6">
                            {section.content.metrics.map((metric, i) => (
                              <div
                                key={i}
                                className="bg-gray-50 rounded-lg p-4"
                              >
                                <div className="flex items-start justify-between flex-wrap gap-2">
                                  <code className="font-mono text-indigo-600 font-semibold">
                                    {metric.name}
                                  </code>
                                  <code className="text-sm bg-white px-2 py-1 rounded">
                                    {metric.formula}
                                  </code>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                  {metric.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {section.content.methodologies && (
                          <div className="space-y-4 mb-6">
                            {section.content.methodologies.map((method, i) => (
                              <div
                                key={i}
                                className="border border-gray-200 rounded-lg p-4"
                              >
                                <h4 className="font-semibold text-gray-800">
                                  {method.name}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {method.desc}
                                </p>
                                <div className="grid grid-cols-2 gap-4 mt-3">
                                  <div>
                                    <p className="text-xs font-medium text-green-600 mb-1">
                                      ✓ Плюсы:
                                    </p>
                                    <ul className="text-xs text-gray-500 space-y-0.5">
                                      {method.pros.map((pro, j) => (
                                        <li key={j}>{pro}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-red-600 mb-1">
                                      ✗ Минусы:
                                    </p>
                                    <ul className="text-xs text-gray-500 space-y-0.5">
                                      {method.cons.map((con, j) => (
                                        <li key={j}>{con}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {section.content.tips && (
                          <div className="space-y-2 mb-6">
                            {section.content.tips.map((tip, i) => {
                              if (tip.startsWith("**")) {
                                return (
                                  <p
                                    key={i}
                                    className="font-semibold text-gray-800 mt-3 mb-1"
                                  >
                                    {tip.slice(2, -2)}
                                  </p>
                                );
                              }
                              return (
                                <p key={i} className="text-gray-600">
                                  • {tip}
                                </p>
                              );
                            })}
                          </div>
                        )}

                        {section.content.recommendations && (
                          <div className="space-y-2 mb-4">
                            {section.content.recommendations.map((rec, i) => {
                              if (rec.startsWith("**")) {
                                return (
                                  <p
                                    key={i}
                                    className="font-semibold text-green-700 mt-2"
                                  >
                                    {rec.slice(2, -2)}
                                  </p>
                                );
                              }
                              return (
                                <p key={i} className="text-gray-600">
                                  • {rec}
                                </p>
                              );
                            })}
                          </div>
                        )}

                        {section.content.mistakeExamples && (
                          <div className={`${section.bgColor} rounded-xl p-4`}>
                            <p className="font-semibold text-gray-800 mb-2">
                              Частые ошибки:
                            </p>
                            {section.content.mistakeExamples.map(
                              (mistake, i) => (
                                <p key={i} className="text-sm text-gray-600">
                                  {mistake}
                                </p>
                              ),
                            )}
                          </div>
                        )}

                        {section.content.example && (
                          <div
                            className={`${section.bgColor} rounded-xl p-4 mt-4`}
                          >
                            <div className="prose prose-sm max-w-none">
                              {section.content.example
                                .split("\n")
                                .map((line, i) => {
                                  if (line.startsWith("**")) {
                                    return (
                                      <h4
                                        key={i}
                                        className="font-semibold text-gray-800"
                                      >
                                        {line.slice(2, -2)}
                                      </h4>
                                    );
                                  }
                                  if (line.trim()) {
                                    return (
                                      <p key={i} className="text-gray-600">
                                        {line}
                                      </p>
                                    );
                                  }
                                  return null;
                                })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">
            Готовы применить знания на практике?
          </h3>
          <p className="text-indigo-100 mb-6">
            Переходите к кейсам и начните управлять проектами прямо сейчас
          </p>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            К кейсам
          </button>
        </div>
      </div>
    </div>
  );
}

export default Theory;
