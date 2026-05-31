import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  UsersIcon,
  BriefcaseIcon,
  ChartBarIcon,
  ServerIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  UserCircleIcon,
  CogIcon,
  BeakerIcon,
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
);

function AdminPanel({ user }) {
  const [activeTab, setActiveTab] = useState("cases");
  const [users, setUsers] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "users") {
        const res = await axios.get("/admin/users");
        setUsers(res.data);
      } else if (activeTab === "cases") {
        const res = await axios.get("/scenarios");
        setScenarios(res.data);
      } else if (activeTab === "stats") {
        const res = await axios.get("/admin/stats");
        setStats(res.data);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchData();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleUserBlock = async (userId, isBlocked) => {
    try {
      await axios.put(`/admin/users/${userId}/block`, { isBlocked });
      fetchData();
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      try {
        await axios.delete(`/admin/users/${userId}`);
        fetchData();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleDeleteCase = async (caseId) => {
    if (
      window.confirm(
        "Вы уверены, что хотите удалить этот кейс? Все связанные симуляции будут потеряны.",
      )
    ) {
      try {
        await axios.delete(`/scenarios/${caseId}`);
        fetchData();
      } catch (error) {
        console.error("Error deleting case:", error);
      }
    }
  };

  // Данные для графиков статистики
  const activityChartData = stats
    ? {
        labels: stats.dailyActivity.map((d) => d.date),
        datasets: [
          {
            label: "Новых симуляций",
            data: stats.dailyActivity.map((d) => d.count),
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      }
    : null;

  const casesChartData = stats
    ? {
        labels: stats.scenarioStats.map((s) =>
          s.title.length > 15 ? s.title.slice(0, 12) + "..." : s.title,
        ),
        datasets: [
          {
            label: "Попыток",
            data: stats.scenarioStats.map((s) => s.attempts),
            backgroundColor: "rgba(59, 130, 246, 0.7)",
            borderRadius: 8,
          },
          {
            label: "Завершено",
            data: stats.scenarioStats.map((s) => s.completedCount),
            backgroundColor: "rgba(16, 185, 129, 0.7)",
            borderRadius: 8,
          },
        ],
      }
    : null;

  const tabs = [
    { id: "cases", name: "Кейсы", icon: BriefcaseIcon },
    { id: "users", name: "Пользователи", icon: UsersIcon },
    { id: "stats", name: "Статистика", icon: ChartBarIcon },
    { id: "logs", name: "Системные логи", icon: ServerIcon },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Панель управления</h1>
        <p className="text-gray-500 mt-1">Управление платформой и аналитика</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 pb-4 px-1 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* Cases Tab */}
          {activeTab === "cases" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Все кейсы
                </h2>
                <button
                  onClick={() => setShowComingSoon(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Создать кейс</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {scenario.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              scenario.difficulty === "новичок"
                                ? "bg-green-100 text-green-700"
                                : scenario.difficulty === "средний"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {scenario.difficulty === "новичок" && "🌱 Новичок"}
                            {scenario.difficulty === "средний" && "⚡ Средний"}
                            {scenario.difficulty === "профи" && "🎯 Профи"}
                          </span>
                          <span className="text-xs text-gray-500">
                            Бюджет: {scenario.budget.toLocaleString()} сом
                          </span>
                          <span className="text-xs text-gray-500">
                            {scenario.duration} дней
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowComingSoon(true)}
                          className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCase(scenario.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {scenario.description}
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Задач:</span>
                        <span className="ml-2 font-medium">
                          {scenario.tasks?.length || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Ресурсов:</span>
                        <span className="ml-2 font-medium">
                          {scenario.resources?.length || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Рисков:</span>
                        <span className="ml-2 font-medium">
                          {scenario.risks?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {scenarios.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl">
                  <p className="text-gray-500">Нет созданных кейсов</p>
                  <button
                    onClick={() => setShowComingSoon(true)}
                    className="mt-4 text-indigo-600 hover:text-indigo-700"
                  >
                    Создать первый кейс
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Все пользователи
              </h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto -mx-4 px-4">
                  <div className="min-w-[500px]">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Пользователь
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Роль
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Дата регистрации
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Статус
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Действия
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((userItem) => (
                          <tr key={userItem.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                  <UserCircleIcon className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">
                                    {userItem.firstName} {userItem.lastName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {userItem.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={userItem.role}
                                onChange={(e) =>
                                  handleUserRoleChange(
                                    userItem.id,
                                    e.target.value,
                                  )
                                }
                                className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500"
                              >
                                <option value="student">Студент</option>
                                <option value="admin">Администратор</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(
                                userItem.createdAt,
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  userItem.isBlocked
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {userItem.isBlocked
                                  ? "Заблокирован"
                                  : "Активен"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                {!userItem.isBlocked ? (
                                  <button
                                    onClick={() =>
                                      handleUserBlock(userItem.id, true)
                                    }
                                    className="text-yellow-600 hover:text-yellow-900"
                                  >
                                    Заблокировать
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      handleUserBlock(userItem.id, false)
                                    }
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    Разблокировать
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteUser(userItem.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Удалить
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === "stats" && stats && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <UsersIcon className="w-8 h-8 text-indigo-600" />
                    <span className="text-2xl font-bold text-gray-900">
                      {stats.totalUsers}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Всего пользователей
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <BriefcaseIcon className="w-8 h-8 text-green-600" />
                    <span className="text-2xl font-bold text-gray-900">
                      {stats.totalSimulations}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Всего симуляций</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <CheckIcon className="w-8 h-8 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-900">
                      {stats.completedSimulations}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Завершённых проектов
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <ChartBarIcon className="w-8 h-8 text-purple-600" />
                    <span className="text-2xl font-bold text-gray-900">
                      {stats.totalSimulations > 0
                        ? Math.round(
                            (stats.completedSimulations /
                              stats.totalSimulations) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Процент завершения
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Динамика активности
                  </h3>
                  {activityChartData && (
                    <Line
                      data={activityChartData}
                      options={{ responsive: true }}
                    />
                  )}
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Популярность кейсов
                  </h3>
                  {casesChartData && (
                    <Bar data={casesChartData} options={{ responsive: true }} />
                  )}
                </div>
              </div>

              <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Детальная статистика по кейсам
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
                            Попыток
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Завершено
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Средний балл
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stats.scenarioStats.map((stat) => (
                          <tr key={stat.id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {stat.title}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {stat.attempts}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {stat.completedCount}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  stat.avgScore >= 80
                                    ? "bg-green-100 text-green-800"
                                    : stat.avgScore >= 60
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {stat.avgScore.toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === "logs" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Системные логи
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Информация о работе симуляций и ошибках
                </p>
              </div>
              <div className="p-6">
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <p className="text-green-400">
                    [INFO] Сервер запущен на порту 5000
                  </p>
                  <p className="text-blue-400">
                    [INFO] База данных инициализирована
                  </p>
                  <p className="text-yellow-400">
                    [WARN] Резервное копирование выполнено
                  </p>
                  <p className="text-green-400">
                    [INFO] Создан демо-администратор: admin@okuyim.com
                  </p>
                  <p className="text-gray-400 mt-4 text-xs">
                    * Полный список логов будет доступен в следующей версии
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal "В разработке" */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 transform transition-all animate-fade-in">
            <div className="relative">
              <button
                onClick={() => setShowComingSoon(false)}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400" />
              </button>

              <div className="text-center pt-8 pb-6 px-6">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BeakerIcon className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  В разработке
                </h3>

                <p className="text-gray-500 mb-6">
                  Функция создания и редактирования кейсов находится в
                  разработке.
                  <br />
                  Скоро она станет доступна!
                </p>

                <div className="bg-indigo-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-center space-x-2 text-indigo-600">
                    <CogIcon className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">
                      Ведутся технические работы
                    </span>
                  </div>
                  <p className="text-xs text-indigo-500 mt-2">
                    Ожидайте обновления в ближайшее время
                  </p>
                </div>

                <button
                  onClick={() => setShowComingSoon(false)}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                  Понятно
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
