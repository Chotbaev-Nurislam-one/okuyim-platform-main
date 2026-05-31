// Добавить в server.js
app.get("/api/leaderboard", async (req, res) => {
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

    // Подсчет очков
    const leaderboard = users
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
