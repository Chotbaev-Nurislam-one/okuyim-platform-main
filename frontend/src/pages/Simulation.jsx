import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CurrencyDollarIcon,
  CalendarIcon,
  HeartIcon,
  BeakerIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon,
  PauseIcon,
  PlayIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
  UserIcon,
  StarIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

function Simulation({ user }) {
  const { simulationId } = useParams();
  const navigate = useNavigate();
  const [simulation, setSimulation] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoStep, setAutoStep] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const autoStepInterval = useRef(null);

  useEffect(() => {
    fetchSimulation();
    return () => {
      if (autoStepInterval.current) {
        clearInterval(autoStepInterval.current);
      }
    };
  }, []);

  const fetchSimulation = async () => {
    try {
      const simRes = await axios.get(`/simulations/${simulationId}`);
      setSimulation(simRes.data);

      const scenarioRes = await axios.get(
        `/scenarios/${simRes.data.scenarioId}`,
      );
      setScenario(scenarioRes.data);
    } catch (error) {
      console.error("Error fetching simulation:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextDay = async () => {
    try {
      const response = await axios.post(`/simulations/${simulationId}/nextDay`);
      setSimulation(response.data);

      if (response.data.status === "completed") {
        if (autoStepInterval.current) {
          clearInterval(autoStepInterval.current);
          setAutoStep(false);
        }
        navigate(`/results/${simulationId}`);
      }
    } catch (error) {
      console.error("Error advancing day:", error);
    }
  };

  const toggleAutoStep = () => {
    if (autoStep) {
      if (autoStepInterval.current) {
        clearInterval(autoStepInterval.current);
      }
      setAutoStep(false);
    } else {
      const interval = setInterval(() => {
        nextDay();
      }, 3000);
      autoStepInterval.current = interval;
      setAutoStep(true);
    }
  };

  const assignResource = async (taskId, resourceId) => {
    try {
      const task = simulation.tasks.find((t) => t.id === taskId);
      await axios.put(`/simulations/${simulationId}/tasks/${taskId}`, {
        ...task,
        assignedTo: resourceId,
        status: "in_progress",
        actualStartDay: simulation.currentDay,
      });
      fetchSimulation();
      setShowAssignModal(false);
    } catch (error) {
      console.error("Error assigning resource:", error);
    }
  };

  const completeSimulation = async () => {
    if (window.confirm("Вы уверены, что хотите завершить проект досрочно?")) {
      try {
        await axios.post(`/simulations/${simulationId}/complete`);
        navigate(`/results/${simulationId}`);
      } catch (error) {
        console.error("Error completing simulation:", error);
      }
    }
  };

  const saveAndExit = async () => {
    navigate("/dashboard");
  };

  const getSatisfactionColor = (value) => {
    if (value < 40) return "text-red-600";
    if (value < 70) return "text-yellow-600";
    return "text-green-600";
  };

  const getSatisfactionBarColor = (value) => {
    if (value < 40) return "bg-red-500";
    if (value < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <StarIcon className="w-4 h-4 text-red-500" />;
      case "medium":
        return <StarIcon className="w-4 h-4 text-yellow-500" />;
      default:
        return <StarIcon className="w-4 h-4 text-gray-300" />;
    }
  };

  // Добавьте эту функцию в компонент Simulation
  const trackUserAction = async (actionType) => {
    try {
      const currentSim = simulation;
      if (!currentSim.userActions) {
        currentSim.userActions = {
          tasksAssigned: 0,
          priorityChanges: 0,
          daysSkipped: 0,
        };
      }

      if (actionType === "assign") {
        currentSim.userActions.tasksAssigned++;
      } else if (actionType === "priority") {
        currentSim.userActions.priorityChanges++;
      }

      currentSim.userActions.lastActionDay = currentSim.currentDay;

      // Сохраняем в бэкенд
      await axios.put(
        `/simulations/${simulationId}/userActions`,
        currentSim.userActions,
      );
    } catch (error) {
      console.error("Error tracking action:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Загрузка симуляции...</p>
        </div>
      </div>
    );
  }

  if (!simulation || !scenario) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600">Симуляция не найдена</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Вернуться к кейсам
          </button>
        </div>
      </div>
    );
  }

  const budgetPercent = (simulation.budget / simulation.initialBudget) * 100;
  const timePercent = (simulation.currentDay / scenario.duration) * 100;
  const daysLeft = scenario.duration - simulation.currentDay;
  const completedTasksCount = simulation.tasks.filter(
    (t) => t.status === "completed",
  ).length;
  const totalTasks = simulation.tasks.length;
  const progressPercent = (completedTasksCount / totalTasks) * 100;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Metrics Bar */}
      <div className="bg-gray-900 text-white sticky top-0 z-40 shadow-lg">
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Budget */}
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium">Бюджет</span>
                </div>
                <span className="text-lg font-bold">
                  {Math.round(simulation.budget).toLocaleString()} /{" "}
                  {simulation.initialBudget.toLocaleString()} сом
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${budgetPercent}%` }}
                />
              </div>
            </div>

            {/* Time */}
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium">Время</span>
                </div>
                <span className="text-lg font-bold">
                  День {simulation.currentDay} / {scenario.duration}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`rounded-full h-2 transition-all duration-300 ${timePercent > 90 ? "bg-red-500" : "bg-blue-500"}`}
                  style={{ width: `${timePercent}%` }}
                />
              </div>
            </div>

            {/* Satisfaction */}
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <HeartIcon
                    className={`w-5 h-5 ${getSatisfactionColor(simulation.satisfaction)}`}
                  />
                  <span className="text-sm font-medium">Удовлетворённость</span>
                </div>
                <span
                  className={`text-lg font-bold ${getSatisfactionColor(simulation.satisfaction)}`}
                >
                  {Math.round(simulation.satisfaction)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`${getSatisfactionBarColor(simulation.satisfaction)} rounded-full h-2 transition-all duration-300`}
                  style={{ width: `${simulation.satisfaction}%` }}
                />
              </div>
            </div>

            {/* Quality */}
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <BeakerIcon className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-medium">Качество</span>
                </div>
                <span className="text-lg font-bold">
                  {Math.round(simulation.quality)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-500 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${simulation.quality}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 p-4">
        {/* Left Column - Tasks */}
        <div className="lg:w-1/3 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Задачи проекта</h3>
                <div className="flex space-x-2">
                  <span className="text-xs text-gray-500">
                    {completedTasksCount}/{totalTasks} выполнено
                  </span>
                </div>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-green-500 rounded-full h-1.5 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {simulation.tasks.map((task) => {
                const resource = scenario.resources.find(
                  (r) => r.id === task.assignedTo,
                );
                const isOverdue =
                  task.plannedEndDay < simulation.currentDay &&
                  task.status !== "completed";

                return (
                  <div
                    key={task.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2 flex-1">
                        {getPriorityIcon(task.priority)}
                        <span
                          className={`font-medium text-sm ${isOverdue ? "text-red-600" : "text-gray-900"}`}
                        >
                          {task.title}
                        </span>
                        {isOverdue && (
                          <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                            Просрочка
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setShowAssignModal(true);
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-700"
                      >
                        {task.assignedTo ? "Сменить" : "Назначить"}
                      </button>
                    </div>

                    {resource && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500 mb-2">
                        <UserIcon className="w-3 h-3" />
                        <span>
                          {resource.name} ({resource.role})
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Прогресс</span>
                      <span>{Math.round(task.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`rounded-full h-1.5 transition-all duration-300 ${
                          task.status === "completed"
                            ? "bg-green-500"
                            : "bg-indigo-500"
                        }`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>
                        План: д.{task.plannedStartDay}-{task.plannedEndDay}
                      </span>
                      {task.actualStartDay && (
                        <span>Старт: д.{task.actualStartDay}</span>
                      )}
                      {task.delay > 0 && (
                        <span className="text-red-500">
                          Задержка: +{task.delay} дн.
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Column - Gantt Chart */}
        <div className="lg:w-1/2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Диаграмма Ганта</h3>
            <p className="text-xs text-gray-500 mt-1">
              Визуализация плана проекта
            </p>
          </div>

          <div className="overflow-x-auto p-4">
            <div className="min-w-[800px]">
              {/* Timeline header */}
              <div className="flex border-b border-gray-200 pb-2 mb-2">
                <div className="w-48 flex-shrink-0 font-medium text-sm text-gray-600">
                  Задача
                </div>
                <div className="flex-1 flex">
                  {Array.from(
                    { length: Math.min(scenario.duration, 30) },
                    (_, i) => (
                      <div
                        key={i}
                        className="flex-1 text-center text-xs text-gray-400"
                      >
                        {i + 1}
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Gantt rows */}
              <div className="space-y-2">
                {simulation.tasks.map((task) => {
                  const start = task.plannedStartDay - 1;
                  const duration =
                    task.plannedEndDay - task.plannedStartDay + 1;
                  const isCompleted = task.status === "completed";
                  const isInProgress = task.status === "in_progress";
                  const isOverdue =
                    task.plannedEndDay < simulation.currentDay && !isCompleted;

                  return (
                    <div
                      key={task.id}
                      className="flex items-center hover:bg-gray-50 rounded"
                    >
                      <div className="w-48 flex-shrink-0 text-sm text-gray-700 truncate pr-2">
                        {task.title}
                      </div>
                      <div className="flex-1 h-8 relative">
                        <div
                          className={`absolute h-6 rounded cursor-pointer transition-all ${
                            isCompleted
                              ? "bg-green-500"
                              : isOverdue
                                ? "bg-red-500"
                                : isInProgress
                                  ? "bg-indigo-500"
                                  : "bg-gray-300"
                          }`}
                          style={{
                            left: `${(start / scenario.duration) * 100}%`,
                            width: `${(duration / scenario.duration) * 100}%`,
                            top: "4px",
                          }}
                          title={`${task.title}: д.${task.plannedStartDay}-${task.plannedEndDay}`}
                        >
                          {isInProgress && (
                            <div className="absolute inset-0 bg-white/20 animate-pulse rounded"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Events & Risks */}
        <div className="lg:w-1/4 space-y-4">
          {/* Event Log */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Лог событий</h3>
            </div>
            <div className="h-80 overflow-y-auto divide-y divide-gray-100">
              {simulation.logs
                .slice()
                .reverse()
                .map((log, idx) => (
                  <div key={idx} className="p-3 hover:bg-gray-50">
                    <div className="flex items-start space-x-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                          log.type === "risk"
                            ? "bg-red-500"
                            : log.type === "success"
                              ? "bg-green-500"
                              : log.type === "completed"
                                ? "bg-purple-500"
                                : "bg-blue-500"
                        }`}
                      />
                      <div className="flex-1">
                        <span className="text-xs font-medium text-gray-500">
                          День {log.day}
                        </span>
                        <p
                          className={`text-sm ${
                            log.type === "risk"
                              ? "text-red-600"
                              : log.type === "success"
                                ? "text-green-600"
                                : log.type === "completed"
                                  ? "text-purple-600"
                                  : "text-gray-700"
                          }`}
                        >
                          {log.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Risks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Активные риски</h3>
            </div>
            <div className="p-4 space-y-3">
              {scenario.risks.map((risk) => {
                const hasOccurred = simulation.occurredRisks.some(
                  (r) => r.id === risk.id,
                );
                return (
                  <div
                    key={risk.id}
                    className={`p-3 rounded-lg ${hasOccurred ? "bg-red-50 border border-red-200" : "bg-gray-50"}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <ExclamationTriangleIcon
                          className={`w-4 h-4 ${hasOccurred ? "text-red-500" : "text-yellow-500"}`}
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {risk.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {risk.probability}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {risk.description}
                    </p>
                    {hasOccurred && (
                      <p className="text-xs text-red-600 mt-2">
                        ⚠️ Наступил!{" "}
                        {
                          simulation.occurredRisks.find((r) => r.id === risk.id)
                            ?.effect
                        }
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="space-y-2">
              <button
                onClick={nextDay}
                disabled={simulation.status === "completed"}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <ChevronRightIcon className="w-4 h-4" />
                <span>Следующий день</span>
              </button>

              <button
                onClick={toggleAutoStep}
                disabled={simulation.status === "completed"}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                  autoStep
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                {autoStep ? (
                  <PauseIcon className="w-4 h-4" />
                ) : (
                  <PlayIcon className="w-4 h-4" />
                )}
                <span>{autoStep ? "Пауза" : "Авто-шаг"}</span>
              </button>

              <button
                onClick={saveAndExit}
                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                <span>Сохранить и выйти</span>
              </button>

              <button
                onClick={completeSimulation}
                disabled={simulation.status === "completed"}
                className="w-full border border-red-300 text-red-600 py-2 px-4 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Завершить проект
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Resource Modal */}
      {showAssignModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Назначить ресурс - {selectedTask.title}
              </h3>
              <div className="space-y-2">
                {scenario.resources.map((resource) => (
                  <button
                    key={resource.id}
                    onClick={() => assignResource(selectedTask.id, resource.id)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">
                          {resource.name}
                        </p>
                        <p className="text-sm text-gray-500">{resource.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          Эффективность: {Math.round(resource.efficiency * 100)}
                          %
                        </p>
                        <p className="text-xs text-gray-400">
                          {resource.costPerDay.toLocaleString()} сом/день
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Simulation;
