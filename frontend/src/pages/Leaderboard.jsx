import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TrophyIcon,
  UserGroupIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // Убираем /api/ так как baseURL уже содержит /api
      const res = await axios.get(`/leaderboard?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaderboard(res.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMedal = (rank) => {
    if (rank === 0) return "🏆";
    if (rank === 1) return "🥈";
    if (rank === 2) return "🥉";
    return null;
  };

  const getMedalColor = (rank) => {
    if (rank === 0) return "from-yellow-500 to-amber-500";
    if (rank === 1) return "from-gray-400 to-gray-500";
    if (rank === 2) return "from-amber-600 to-amber-700";
    return "from-indigo-500 to-indigo-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${leaderboard.length > 0 ? getMedalColor(0) : "from-indigo-500 to-indigo-600"} rounded-2xl shadow-lg mb-4`}
          >
            <TrophyIcon className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Таблица лидеров
          </h1>
          <p className="text-gray-500 text-sm md:text-base mt-1">
            Лучшие менеджеры проектов
          </p>
        </div>

        {/* Period selector */}
        <div className="flex justify-center gap-2 mb-6 md:mb-8">
          {[
            { id: "week", label: "За неделю" },
            { id: "month", label: "За месяц" },
            { id: "all", label: "За всё время" },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-all ${
                period === p.id
                  ? "bg-indigo-500 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
            <p className="text-gray-500 mt-3">Загрузка рейтинга...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && leaderboard.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <UserGroupIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Пока нет завершённых проектов</p>
            <p className="text-gray-400 text-sm mt-1">
              Пройдите кейс, чтобы попасть в рейтинг!
            </p>
          </div>
        )}

        {/* Leaderboard list */}
        {!loading && leaderboard.length > 0 && (
          <div className="space-y-3 md:space-y-4">
            {leaderboard.map((user, idx) => (
              <div
                key={user.id}
                className={`bg-white rounded-xl shadow-sm border p-4 md:p-5 flex items-center justify-between transition-all hover:shadow-md ${
                  idx === 0
                    ? "border-yellow-200 bg-gradient-to-r from-yellow-50/50 to-white"
                    : "border-gray-100"
                }`}
              >
                <div className="flex items-center space-x-3 md:space-x-5 flex-1">
                  {/* Rank */}
                  <div className="w-8 md:w-10 text-center">
                    {idx < 3 ? (
                      <span className="text-2xl md:text-3xl">
                        {getMedal(idx)}
                      </span>
                    ) : (
                      <span className="text-sm md:text-base font-semibold text-gray-400">
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r ${idx === 0 ? "from-yellow-100 to-yellow-50" : "from-indigo-100 to-indigo-50"} flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-indigo-600 font-bold text-lg md:text-xl">
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </span>
                  </div>

                  {/* User info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm md:text-base truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                      <span>📊 {user.completedProjects} проектов</span>
                      <span>⭐ {user.avgScore}% средний</span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg md:text-2xl font-bold text-indigo-600">
                      {user.totalScore}
                    </p>
                    <p className="text-xs text-gray-400 hidden md:block">
                      баллов
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Информация о подсчёте очков */}
        <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
          <div className="flex items-start gap-3">
            <SparklesIcon className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-indigo-800">
                Как считаются очки?
              </p>
              <p className="text-xs text-indigo-600 mt-1">
                Очки = Удовлетворённость × 40% + Эффективность бюджета × 30% +
                Соблюдение сроков × 30%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
