import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ChartBarIcon,
  TrophyIcon,
  ClockIcon,
  RocketLaunchIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  CheckBadgeIcon,
  SignalIcon,
  UserGroupIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler,
} from "chart.js";
import { Line, Bar, Radar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler,
);

function Statistics({ user }) {
  const [simulations, setSimulations] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [simulationsRes, scenariosRes] = await Promise.all([
        axios.get(`/simulations/user/${user.id}`),
        axios.get("/scenarios"),
      ]);
      setSimulations(simulationsRes.data);
      setScenarios(scenariosRes.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const completedSimulations = simulations.filter(
    (s) => s.status === "completed",
  );

  const calculateStats = () => {
    let filteredSims = completedSimulations;

    if (selectedPeriod === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredSims = completedSimulations.filter(
        (s) => new Date(s.completedAt) > weekAgo,
      );
    } else if (selectedPeriod === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filteredSims = completedSimulations.filter(
        (s) => new Date(s.completedAt) > monthAgo,
      );
    }

    const totalScore = filteredSims.reduce((sum, s) => {
      const metrics = s.finalMetrics || {};
      const score = Math.round(
        (metrics.finalSatisfaction || 0) * 0.4 +
          (100 - Math.min(100, Math.abs(metrics.budgetVariance || 0))) * 0.3 +
          (100 - Math.min(100, Math.abs(metrics.timeVariance || 0))) * 0.3,
      );
      return sum + score;
    }, 0);

    const avgScore =
      filteredSims.length > 0 ? totalScore / filteredSims.length : 0;

    const avgBudgetVariance =
      filteredSims.reduce(
        (sum, s) => sum + (s.finalMetrics?.budgetVariance || 0),
        0,
      ) / (filteredSims.length || 1);
    const avgTimeVariance =
      filteredSims.reduce(
        (sum, s) => sum + (s.finalMetrics?.timeVariance || 0),
        0,
      ) / (filteredSims.length || 1);
    const avgSatisfaction =
      filteredSims.reduce(
        (sum, s) => sum + (s.finalMetrics?.finalSatisfaction || 0),
        0,
      ) / (filteredSims.length || 1);
    const totalDays = filteredSims.reduce((sum, s) => sum + s.currentDay, 0);

    return {
      totalCompleted: filteredSims.length,
      avgScore: Math.round(avgScore),
      avgBudgetVariance: avgBudgetVariance.toFixed(1),
      avgTimeVariance: avgTimeVariance.toFixed(1),
      avgSatisfaction: Math.round(avgSatisfaction),
      totalDays,
      successRate:
        filteredSims.length > 0
          ? (filteredSims.filter((s) => {
              const metrics = s.finalMetrics || {};
              const score = Math.round(
                (metrics.finalSatisfaction || 0) * 0.4 +
                  (100 - Math.min(100, Math.abs(metrics.budgetVariance || 0))) *
                    0.3 +
                  (100 - Math.min(100, Math.abs(metrics.timeVariance || 0))) *
                    0.3,
              );
              return score >= 70;
            }).length /
              filteredSims.length) *
            100
          : 0,
    };
  };

  const stats = calculateStats();

  // Данные для графика прогресса по дням
  const getProgressData = () => {
    const sortedSims = [...completedSimulations]
      .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt))
      .slice(-10);

    return {
      labels: sortedSims.map((_, i) => `Кейс ${i + 1}`),
      datasets: [
        {
          label: "Ваш результат",
          data: sortedSims.map((s) => {
            const metrics = s.finalMetrics || {};
            return Math.round(
              (metrics.finalSatisfaction || 0) * 0.4 +
                (100 - Math.min(100, Math.abs(metrics.budgetVariance || 0))) *
                  0.3 +
                (100 - Math.min(100, Math.abs(metrics.timeVariance || 0))) *
                  0.3,
            );
          }),
          borderColor: "rgb(99, 102, 241)",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "rgb(99, 102, 241)",
        },
        {
          label: "Средний результат",
          data: sortedSims.map(() => 70),
          borderColor: "rgb(156, 163, 175)",
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.4,
          pointRadius: 0,
          fill: false,
        },
      ],
    };
  };

  // Данные для графика по кейсам
  const getCaseStatsData = () => {
    const caseStats = scenarios
      .map((scenario) => {
        const scenarioSims = completedSimulations.filter(
          (s) => s.scenarioId === scenario.id,
        );
        const avgScore =
          scenarioSims.length > 0
            ? scenarioSims.reduce((sum, s) => {
                const metrics = s.finalMetrics || {};
                return (
                  sum +
                  Math.round(
                    (metrics.finalSatisfaction || 0) * 0.4 +
                      (100 -
                        Math.min(100, Math.abs(metrics.budgetVariance || 0))) *
                        0.3 +
                      (100 -
                        Math.min(100, Math.abs(metrics.timeVariance || 0))) *
                        0.3,
                  )
                );
              }, 0) / scenarioSims.length
            : 0;

        return {
          title:
            scenario.title.length > 15
              ? scenario.title.slice(0, 12) + "..."
              : scenario.title,
          score: Math.round(avgScore),
          attempts: scenarioSims.length,
        };
      })
      .filter((c) => c.attempts > 0);

    return {
      labels: caseStats.map((c) => c.title),
      datasets: [
        {
          label: "Средний балл",
          data: caseStats.map((c) => c.score),
          backgroundColor: "rgba(99, 102, 241, 0.7)",
          borderRadius: 8,
          barPercentage: 0.7,
        },
      ],
    };
  };

  // Данные для радар-диаграммы компетенций
  const getCompetenciesData = () => {
    const competencies = {
      "Управление бюджетом": 0,
      "Соблюдение сроков": 0,
      Удовлетворенность: 0,
      "Управление рисками": 0,
      "Качество решений": 0,
    };

    completedSimulations.forEach((sim) => {
      const metrics = sim.finalMetrics || {};
      competencies["Управление бюджетом"] += Math.max(
        0,
        100 - Math.abs(metrics.budgetVariance || 0),
      );
      competencies["Соблюдение сроков"] += Math.max(
        0,
        100 - Math.abs(metrics.timeVariance || 0),
      );
      competencies["Удовлетворенность"] += metrics.finalSatisfaction || 0;
      competencies["Управление рисками"] += sim.occurredRisks
        ? 100 - sim.occurredRisks.length * 20
        : 100;
      competencies["Качество решений"] += metrics.finalQuality || 0;
    });

    const count = completedSimulations.length || 1;

    return {
      labels: Object.keys(competencies),
      datasets: [
        {
          label: "Ваши компетенции",
          data: Object.values(competencies).map((v) => Math.round(v / count)),
          backgroundColor: "rgba(99, 102, 241, 0.2)",
          borderColor: "rgb(99, 102, 241)",
          borderWidth: 2,
          pointBackgroundColor: "rgb(99, 102, 241)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(99, 102, 241)",
        },
      ],
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-indigo-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Загрузка статистики...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg mb-6">
            <ChartBarIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Моя статистика
          </h1>
          <p className="text-gray-500 text-lg">
            Отслеживайте свой прогресс в управлении проектами
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 inline-flex">
            {[
              { id: "all", label: "Всё время" },
              { id: "month", label: "За месяц" },
              { id: "week", label: "За неделю" },
            ].map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  selectedPeriod === period.id
                    ? "bg-indigo-500 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {stats.totalCompleted}
              </span>
            </div>
            <p className="text-gray-600 font-medium">Пройдено кейсов</p>
            <p className="text-sm text-gray-400 mt-1">Всего симуляций</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <SignalIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {stats.avgScore}%
              </span>
            </div>
            <p className="text-gray-600 font-medium">Средний балл</p>
            <p className="text-sm text-gray-400 mt-1">Общая эффективность</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <CheckBadgeIcon className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {stats.successRate.toFixed(0)}%
              </span>
            </div>
            <p className="text-gray-600 font-medium">Успешность</p>
            <p className="text-sm text-gray-400 mt-1">Балл ≥ 70%</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {stats.totalDays}
              </span>
            </div>
            <p className="text-gray-600 font-medium">Всего дней</p>
            <p className="text-sm text-gray-400 mt-1">В управлении проектами</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Progress Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Прогресс обучения
                </h3>
                <p className="text-sm text-gray-500">
                  Динамика ваших результатов
                </p>
              </div>
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
            </div>
            <Line
              data={getProgressData()}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} баллов`,
                    },
                  },
                },
                scales: {
                  y: {
                    min: 0,
                    max: 100,
                    title: { display: true, text: "Баллы" },
                  },
                },
              }}
            />
          </div>

          {/* Radar Chart - Competencies */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Карта компетенций
                </h3>
                <p className="text-sm text-gray-500">Ваши сильные стороны</p>
              </div>
              <UserGroupIcon className="w-5 h-5 text-indigo-500" />
            </div>
            <Radar
              data={getCompetenciesData()}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                },
                scales: {
                  r: { min: 0, max: 100, ticks: { stepSize: 20 } },
                },
              }}
            />
          </div>
        </div>

        {/* Case Stats Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Результаты по кейсам
              </h3>
              <p className="text-sm text-gray-500">
                Средний балл по каждому проекту
              </p>
            </div>
            <FireIcon className="w-5 h-5 text-orange-500" />
          </div>
          <Bar
            data={getCaseStatsData()}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                tooltip: {
                  callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} баллов`,
                  },
                },
              },
              scales: {
                y: {
                  min: 0,
                  max: 100,
                  title: { display: true, text: "Средний балл" },
                },
              },
            }}
          />
        </div>

        {/* Recent Results Table */}
        {completedSimulations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                История прохождений
              </h3>
            </div>
            <div className="overflow-x-auto -mx-4 px-4">
              <div className="min-w-[500px]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Кейс
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Дата
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Бюджет
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Сроки
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Оценка
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {completedSimulations
                      .slice()
                      .reverse()
                      .slice(0, 10)
                      .map((sim) => {
                        const scenario = scenarios.find(
                          (s) => s.id === sim.scenarioId,
                        );
                        const metrics = sim.finalMetrics || {};
                        const score = Math.round(
                          (metrics.finalSatisfaction || 0) * 0.4 +
                            (100 -
                              Math.min(
                                100,
                                Math.abs(metrics.budgetVariance || 0),
                              )) *
                              0.3 +
                            (100 -
                              Math.min(
                                100,
                                Math.abs(metrics.timeVariance || 0),
                              )) *
                              0.3,
                        );

                        return (
                          <tr
                            key={sim.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {scenario?.title || "Неизвестный кейс"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(sim.completedAt).toLocaleDateString(
                                "ru-RU",
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span
                                className={
                                  metrics.budgetVariance <= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {metrics.budgetVariance >= 0
                                  ? `+${metrics.budgetVariance.toFixed(0)}%`
                                  : `${metrics.budgetVariance.toFixed(0)}%`}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span
                                className={
                                  metrics.timeVariance <= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {metrics.timeVariance >= 0
                                  ? `+${metrics.timeVariance.toFixed(0)}%`
                                  : `${metrics.timeVariance.toFixed(0)}%`}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  score >= 80
                                    ? "bg-green-100 text-green-800"
                                    : score >= 60
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {score}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {completedSimulations.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <RocketLaunchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Пока нет завершённых кейсов</p>
            <p className="text-gray-400 mt-2">
              Пройдите первый кейс, чтобы увидеть статистику
            </p>
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="mt-6 px-6 py-3 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition-all"
            >
              К кейсам
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Statistics;
