import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ChartBarIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  HomeIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  SparklesIcon,
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
  ArcElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

function Results({ user }) {
  const { simulationId } = useParams();
  const navigate = useNavigate();
  const [simulation, setSimulation] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedRec, setExpandedRec] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const simRes = await axios.get(`/simulations/${simulationId}`);
      setSimulation(simRes.data);

      const scenarioRes = await axios.get(
        `/scenarios/${simRes.data.scenarioId}`,
      );
      setScenario(scenarioRes.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const retryCase = async () => {
    if (!scenario) return;
    try {
      const response = await axios.post("/simulations", {
        userId: user.id,
        scenarioId: scenario.id,
      });
      navigate(`/simulation/${response.data.id}`);
    } catch (error) {
      console.error("Error retrying case:", error);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-rose-500";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-emerald-50";
    if (score >= 60) return "bg-amber-50";
    return "bg-rose-50";
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case "critical":
        return <ExclamationTriangleIcon className="w-6 h-6 text-rose-500" />;
      case "warning":
        return <LightBulbIcon className="w-6 h-6 text-amber-500" />;
      case "success":
        return <SparklesIcon className="w-6 h-6 text-emerald-500" />;
      default:
        return <ShieldCheckIcon className="w-6 h-6 text-indigo-500" />;
    }
  };

  const getRecommendationBg = (type) => {
    switch (type) {
      case "critical":
        return "bg-rose-50 border-rose-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      case "success":
        return "bg-emerald-50 border-emerald-200";
      default:
        return "bg-indigo-50 border-indigo-200";
    }
  };

  const getBudgetData = () => {
    if (!simulation || !scenario) return { labels: [], datasets: [] };

    const daysToShow = Math.min(simulation.currentDay, 30);
    return {
      labels: Array.from({ length: daysToShow }, (_, i) => `День ${i + 1}`),
      datasets: [
        {
          label: "План бюджета",
          data: Array.from(
            { length: daysToShow },
            (_, i) =>
              simulation.initialBudget * (1 - (i / scenario.duration) * 0.8),
          ),
          borderColor: "rgb(99, 102, 241)",
          backgroundColor: "rgba(99, 102, 241, 0.05)",
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
        {
          label: "Факт бюджета",
          data: (() => {
            const budgetData = [];
            let currentBudget = simulation.initialBudget;
            for (let i = 0; i < daysToShow; i++) {
              const reduction = simulation.initialBudget - simulation.budget;
              const dailyReduction =
                reduction / Math.max(1, simulation.currentDay);
              currentBudget -= dailyReduction;
              budgetData.push(Math.max(0, currentBudget));
            }
            return budgetData;
          })(),
          borderColor: "rgb(239, 68, 68)",
          backgroundColor: "rgba(239, 68, 68, 0.05)",
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
      ],
    };
  };

  const getTaskComparisonData = () => {
    if (!simulation || !simulation.tasks) return { labels: [], datasets: [] };

    const tasksToShow = simulation.tasks.slice(0, 8);
    return {
      labels: tasksToShow.map((t) =>
        t.title.length > 15 ? t.title.slice(0, 12) + "..." : t.title,
      ),
      datasets: [
        {
          label: "План (дни)",
          data: tasksToShow.map((t) => t.plannedEndDay - t.plannedStartDay + 1),
          backgroundColor: "rgba(99, 102, 241, 0.7)",
          borderRadius: 8,
          barPercentage: 0.7,
        },
        {
          label: "Факт (дни)",
          data: tasksToShow.map((t) => {
            if (t.status === "completed") {
              return (
                t.actualEndDay - (t.actualStartDay || t.plannedStartDay) + 1
              );
            }
            return (
              simulation.currentDay -
              (t.actualStartDay || t.plannedStartDay) +
              1
            );
          }),
          backgroundColor: "rgba(239, 68, 68, 0.7)",
          borderRadius: 8,
          barPercentage: 0.7,
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
            Загрузка результатов...
          </p>
        </div>
      </div>
    );
  }

  if (!simulation || !scenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <ExclamationTriangleIcon className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-4">Результаты не найдены</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition-all transform hover:scale-105"
          >
            Вернуться к кейсам
          </button>
        </div>
      </div>
    );
  }

  const metrics = simulation.finalMetrics || {
    budgetVariance: 0,
    timeVariance: 0,
    finalSatisfaction: simulation.satisfaction || 0,
    finalQuality: simulation.quality || 0,
    completedTasksCount:
      simulation.tasks?.filter((t) => t.status === "completed").length || 0,
    totalTasksCount: simulation.tasks?.length || 0,
    budgetUsed: simulation.initialBudget - simulation.budget,
  };

  const finalScore = Math.round(
    metrics.finalSatisfaction * 0.4 +
      (100 - Math.min(100, Math.abs(metrics.budgetVariance))) * 0.3 +
      (100 - Math.min(100, Math.abs(metrics.timeVariance))) * 0.3,
  );

  const recommendations = simulation.recommendations || {
    recommendations: [],
    summary: "",
  };
  const userActions = simulation.userActions || {
    tasksAssigned: 0,
    priorityChanges: 0,
    daysSkipped: 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg mb-6">
            <TrophyIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {scenario.title}
          </h1>
          <p className="text-gray-500 text-lg">
            Завершено{" "}
            {new Date(
              simulation.completedAt || simulation.lastUpdatedAt,
            ).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 text-center">
          <div
            className={`inline-flex flex-col items-center justify-center p-8 rounded-full ${getScoreBgColor(finalScore)}`}
          >
            <div className={`text-6xl font-bold ${getScoreColor(finalScore)}`}>
              {finalScore}
            </div>
            <div className="text-sm text-gray-500 mt-2">Общая оценка</div>
          </div>
          <div className="mt-6 flex justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {userActions.tasksAssigned}
              </div>
              <div className="text-sm text-gray-500">Назначено задач</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {userActions.priorityChanges}
              </div>
              <div className="text-sm text-gray-500">Изменено приоритетов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {simulation.occurredRisks?.length || 0}
              </div>
              <div className="text-sm text-gray-500">Наступило рисков</div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <span
                className={`text-sm font-medium ${metrics.budgetVariance >= 0 ? "text-rose-500" : "text-emerald-500"}`}
              >
                {metrics.budgetVariance >= 0
                  ? `+${metrics.budgetVariance.toFixed(1)}%`
                  : `${metrics.budgetVariance.toFixed(1)}%`}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(metrics.budgetUsed).toLocaleString()} СОМ
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Использовано бюджета
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-5 h-5 text-blue-600" />
              </div>
              <span
                className={`text-sm font-medium ${metrics.timeVariance >= 0 ? "text-rose-500" : "text-emerald-500"}`}
              >
                {metrics.timeVariance >= 0
                  ? `+${metrics.timeVariance.toFixed(1)}%`
                  : `${metrics.timeVariance.toFixed(1)}%`}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {simulation.currentDay} дн.
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Фактическая длительность
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(metrics.finalSatisfaction)}%
            </div>
            <div className="text-sm text-gray-500 mt-1">Удовлетворенность</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <UserGroupIcon className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {metrics.completedTasksCount}/{metrics.totalTasksCount}
            </div>
            <div className="text-sm text-gray-500 mt-1">Выполнено задач</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Бюджет: план vs факт
            </h3>
            <Line
              data={getBudgetData()}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  tooltip: {
                    callbacks: {
                      label: (ctx) =>
                        `${ctx.dataset.label}: ${Math.round(ctx.raw).toLocaleString()} СОМ`,
                    },
                  },
                },
                maintainAspectRatio: true,
              }}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Длительность задач: план vs факт
            </h3>
            <Bar
              data={getTaskComparisonData()}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} дней`,
                    },
                  },
                },
                maintainAspectRatio: true,
              }}
            />
          </div>
        </div>

        {/* Detailed Recommendations */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <LightBulbIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Персональные рекомендации
            </h2>
          </div>

          {recommendations.recommendations &&
          recommendations.recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border ${getRecommendationBg(rec.type)} overflow-hidden transition-all cursor-pointer hover:shadow-md`}
                  onClick={() =>
                    setExpandedRec(expandedRec === idx ? null : idx)
                  }
                >
                  <div className="p-5">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getRecommendationIcon(rec.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {rec.title}
                          </h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              rec.type === "critical"
                                ? "bg-rose-200 text-rose-800"
                                : rec.type === "warning"
                                  ? "bg-amber-200 text-amber-800"
                                  : "bg-emerald-200 text-emerald-800"
                            }`}
                          >
                            {rec.type === "critical"
                              ? "Критично"
                              : rec.type === "warning"
                                ? "Важно"
                                : "Отлично"}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-2">{rec.description}</p>
                        {expandedRec === idx && rec.detailed && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="prose prose-sm max-w-none">
                              {rec.detailed.split("\n").map((line, i) => {
                                if (
                                  line.startsWith("**") &&
                                  line.endsWith("**")
                                ) {
                                  return (
                                    <h4
                                      key={i}
                                      className="font-semibold text-gray-800 mt-3 mb-2"
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
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <SparklesIcon className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <p className="text-gray-600">
                Анализ рекомендаций будет доступен после завершения симуляции
              </p>
            </div>
          )}

          {recommendations.summary && (
            <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
              <div className="flex items-start space-x-3">
                <SparklesIcon className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 leading-relaxed">
                  {recommendations.summary}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Occurred Risks */}
        {simulation.occurredRisks && simulation.occurredRisks.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="px-6 py-4 bg-rose-50 border-b border-rose-100">
              <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-rose-600" />
                <h3 className="font-semibold text-gray-900">
                  Наступившие риски ({simulation.occurredRisks.length})
                </h3>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {simulation.occurredRisks.map((risk, idx) => (
                <div
                  key={idx}
                  className="p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {risk.name}
                        </span>
                        <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                          День {risk.dayOccurred}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {risk.description}
                      </p>
                      <p className="text-sm text-rose-600 mt-2">
                        📉 {risk.effect}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">
                        Вероятность: {risk.probability}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={retryCase}
            className="px-8 py-3 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition-all transform hover:scale-105 shadow-sm flex items-center space-x-2"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span>Повторить кейс</span>
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center space-x-2"
          >
            <HomeIcon className="w-5 h-5" />
            <span>Вернуться к списку</span>
          </button>
          <button
            onClick={() => alert("PDF отчет будет доступен в следующей версии")}
            className="px-8 py-3 bg-white border border-indigo-200 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-all flex items-center space-x-2"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
            <span>Скачать PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;
