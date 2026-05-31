import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ClockIcon,
  ChartBarIcon,
  TrophyIcon,
  ArrowPathIcon,
  PlayIcon,
  DocumentTextIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

function Dashboard({ user }) {
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState([]);
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCompleted: 0,
    averageScore: 0,
    totalTime: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [scenariosRes, simulationsRes] = await Promise.all([
        axios.get("/scenarios"),
        axios.get(`/simulations/user/${user.id}`),
      ]);

      setScenarios(scenariosRes.data);
      setSimulations(simulationsRes.data);

      // Расчет статистики
      const completed = simulationsRes.data.filter(
        (s) => s.status === "completed",
      );
      const avgScore =
        completed.length > 0
          ? completed.reduce(
              (sum, s) => sum + (s.finalMetrics?.finalSatisfaction || 0),
              0,
            ) / completed.length
          : 0;

      setStats({
        totalCompleted: completed.length,
        averageScore: Math.round(avgScore),
        totalTime: completed.reduce((sum, s) => sum + s.currentDay, 0),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (scenarioId) => {
    const userSimulations = simulations.filter(
      (s) => s.scenarioId === scenarioId,
    );
    const activeSim = userSimulations.find((s) => s.status === "in_progress");
    const completedSim = userSimulations.find((s) => s.status === "completed");

    if (activeSim) {
      return {
        status: "in_progress",
        simulationId: activeSim.id,
        progress: Math.round(
          (activeSim.currentDay /
            scenarios.find((s) => s.id === scenarioId)?.duration) *
            100,
        ),
      };
    }
    if (completedSim) {
      return {
        status: "completed",
        simulationId: completedSim.id,
        score: completedSim.finalMetrics?.finalSatisfaction,
      };
    }
    return { status: "not_started" };
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "новичок":
        return "bg-green-100 text-green-700";
      case "средний":
        return "bg-yellow-100 text-yellow-700";
      case "профи":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleStartCase = async (scenarioId) => {
    try {
      const response = await axios.post("/simulations", {
        userId: user.id,
        scenarioId,
      });
      navigate(`/simulation/${response.data.id}`);
    } catch (error) {
      console.error("Error starting simulation:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-6 md:p-8 text-white mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Здравствуйте, {user.firstName}!
        </h1>
        <p className="text-indigo-100 text-sm md:text-base mb-6">
          Продолжайте развивать навыки управления проектами
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <TrophyIcon className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-sm text-indigo-200">Пройдено кейсов</p>
                <p className="text-2xl font-bold">{stats.totalCompleted}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <StarIcon className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-sm text-indigo-200">Средний балл</p>
                <p className="text-2xl font-bold">{stats.averageScore}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <ClockIcon className="w-8 h-8 text-indigo-200" />
              <div>
                <p className="text-sm text-indigo-200">Всего дней в проектах</p>
                <p className="text-2xl font-bold">{stats.totalTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Cases */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Доступные кейсы
          </h2>
          <button
            onClick={fetchData}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1"
          >
            <ArrowPathIcon className="w-4 h-4" />
            <span>Обновить</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {scenarios.map((scenario) => {
            const status = getStatusInfo(scenario.id);

            return (
              <div
                key={scenario.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all card-hover"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {scenario.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(scenario.difficulty)}`}
                    >
                      {scenario.difficulty === "новичок"
                        ? "🌱 Новичок"
                        : scenario.difficulty === "средний"
                          ? "⚡ Средний"
                          : "🎯 Профи"}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {scenario.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>≈{scenario.duration} дней</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ChartBarIcon className="w-4 h-4" />
                      <span>{scenario.tasks?.length || 0} задач</span>
                    </div>
                  </div>

                  {status.status === "in_progress" && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Прогресс</span>
                        <span>{status.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 rounded-full h-2 transition-all duration-300"
                          style={{ width: `${status.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (status.status === "in_progress") {
                        navigate(`/simulation/${status.simulationId}`);
                      } else if (status.status === "completed") {
                        navigate(`/results/${status.simulationId}`);
                      } else {
                        handleStartCase(scenario.id);
                      }
                    }}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                      status.status === "completed"
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : status.status === "in_progress"
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status.status === "completed" && (
                      <span className="flex items-center justify-center space-x-1">
                        <DocumentTextIcon className="w-4 h-4" />
                        <span>Посмотреть отчёт</span>
                      </span>
                    )}
                    {status.status === "in_progress" && (
                      <span className="flex items-center justify-center space-x-1">
                        <PlayIcon className="w-4 h-4" />
                        <span>Продолжить</span>
                      </span>
                    )}
                    {status.status === "not_started" && (
                      <span className="flex items-center justify-center space-x-1">
                        <PlayIcon className="w-4 h-4" />
                        <span>Начать кейс</span>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {scenarios.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">Пока нет доступных кейсов</p>
          </div>
        )}
      </div>

      {/* Recent Results */}
      {simulations.filter((s) => s.status === "completed").length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Недавние результаты
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto -mx-4 px-4">
              <div className="min-w-[500px]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дата
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Кейс
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Оценка
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {simulations
                      .filter((s) => s.status === "completed")
                      .slice(0, 5)
                      .map((sim) => {
                        const scenario = scenarios.find(
                          (sc) => sc.id === sim.scenarioId,
                        );
                        return (
                          <tr key={sim.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(sim.completedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {scenario?.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  sim.finalMetrics?.finalSatisfaction >= 80
                                    ? "bg-green-100 text-green-800"
                                    : sim.finalMetrics?.finalSatisfaction >= 60
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {Math.round(
                                  sim.finalMetrics?.finalSatisfaction || 0,
                                )}
                                %
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <button
                                onClick={() => navigate(`/results/${sim.id}`)}
                                className="text-indigo-600 hover:text-indigo-900 font-medium"
                              >
                                Подробнее →
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
